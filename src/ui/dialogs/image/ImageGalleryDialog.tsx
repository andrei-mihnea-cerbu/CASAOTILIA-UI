import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNotification } from '../../context/NotificationProvider';
import { useSession } from '../../context/SessionContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Car } from '../../interfaces/car';
import { UsedCarPart } from '../../interfaces/used-car-part';
import ImageUploadBox from '../../components/admin/ImageUploadBox';

interface Props {
  open: boolean;
  onClose: () => void;
  entityId: string;
  type: 'car' | 'used-car-part';
  onUpdate: () => void;
}

const ImageGalleryDialog: React.FC<Props> = ({
  open,
  onClose,
  entityId,
  type,
  onUpdate,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const bucketUrl = import.meta.env.VITE_S3_PUBLIC_BASE_URL;

  const { getAuthHeaders } = useSession();
  const { setNotification } = useNotification();

  const [entity, setEntity] = useState<Car | UsedCarPart | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [resetUpload, setResetUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const idParam = type === 'car' ? 'carId' : 'usedCarPartId';
  const entityPath = type === 'car' ? 'cars' : 'used-car-parts';

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Car | UsedCarPart>(
        `${apiUrl}/${entityPath}?id=${entityId}`
      );
      setEntity(res.data);
      setImages(res.data.imageGallery);
    } catch {
      setNotification('Failed to load images.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchImages();
  }, [open]);

  useEffect(() => {
    if (resetUpload) setResetUpload(false);
  }, [resetUpload]);

  const handleUpload = async () => {
    if (!selectedFiles.length || !entity) return;
    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));
    try {
      await axios.post(
        `${apiUrl}/storage/upload?${idParam}=${entityId}`,
        formData,
        { headers: getAuthHeaders() }
      );
      setNotification('Upload successful!', 'success');
      setSelectedFiles([]);
      setResetUpload(true);
      onUpdate();
      fetchImages();
    } catch {
      setNotification('Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filePath: string) => {
    setDeleting(filePath);
    try {
      const fileName = filePath.split('/').pop() || '';
      await axios.delete(
        `${apiUrl}/storage/delete?${idParam}=${entityId}&fileName=${fileName}`,
        { headers: getAuthHeaders() }
      );
      onUpdate();
      setNotification('Image deleted.', 'success');
      fetchImages();
    } catch {
      setNotification('Failed to delete image.', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleReorder = async () => {
    setLoading(true);
    try {
      const fileNamesOnly = images.map((imgPath) => {
        const fileName = imgPath.split('/').pop() || '';
        return fileName.replace(/%20/g, ' ');
      });

      await axios.put(
        `${apiUrl}/storage/reorder?${idParam}=${entityId}`,
        { orderedFileNames: fileNamesOnly },
        { headers: getAuthHeaders() }
      );

      onUpdate();
      setNotification('Order saved successfully.', 'success');
    } catch {
      setNotification('Failed to reorder images.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = [...images];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setImages(reordered);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Manage Images — {type === 'car' ? 'Car' : 'Used Car Part'}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          {/* Upload Section */}
          <Box sx={{ flex: 1 }}>
            <ImageUploadBox
              onFileChange={(files) =>
                files && setSelectedFiles(Array.from(files))
              }
              resetTrigger={resetUpload}
            />
            <Button
              fullWidth
              sx={{ mt: 2 }}
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFiles.length || uploading}
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </Box>

          {/* Reorder Section */}
          <Box sx={{ flex: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : images.length === 0 ? (
              <Typography>No images uploaded yet.</Typography>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    Drag and drop to reorder
                  </Typography>
                  <Button
                    onClick={handleReorder}
                    variant="outlined"
                    color="secondary"
                    disabled={loading}
                  >
                    {loading ? 'Saving Order...' : 'Save Order'}
                  </Button>
                </Box>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          flexWrap: 'wrap',
                          alignItems: 'flex-start',
                        }}
                      >
                        {images.map((img, index) => (
                          <Draggable key={img} draggableId={img} index={index}>
                            {(drag) => (
                              <Box
                                ref={drag.innerRef}
                                {...drag.draggableProps}
                                {...drag.dragHandleProps}
                                sx={{
                                  position: 'relative',
                                  width: 120,
                                  height: 80,
                                  border: '1px solid #ccc',
                                  borderRadius: 1,
                                  overflow: 'hidden',
                                  backgroundColor: '#fff',
                                }}
                              >
                                <img
                                  src={`${bucketUrl}/${img}`}
                                  alt="preview"
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  color="error"
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                  }}
                                  onClick={() => handleDelete(img)}
                                  disabled={deleting === img}
                                >
                                  {deleting === img ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <DeleteIcon />
                                  )}
                                </IconButton>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageGalleryDialog;
