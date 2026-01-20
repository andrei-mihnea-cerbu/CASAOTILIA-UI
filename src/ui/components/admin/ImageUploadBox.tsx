import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Props {
  onFileChange: (files: FileList | null) => void;
  resetTrigger: boolean;
}

const ImageUploadBox: React.FC<Props> = ({ onFileChange, resetTrigger }) => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (files: FileList | null) => {
    if (files) {
      const names = Array.from(files).map((f) => f.name);
      setFileNames(names);
      onFileChange(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleInputChange(e.dataTransfer.files);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  // Clear input and file names when resetTrigger is true
  useEffect(() => {
    if (resetTrigger) {
      setFileNames([]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }, [resetTrigger]);

  return (
    <Box>
      <Box
        onClick={handleBrowseClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: '2px dashed #aaa',
          borderRadius: 3,
          padding: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragging ? '#e3f2fd' : '#fafafa',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': { backgroundColor: '#f0f0f0' },
        }}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          hidden
          ref={inputRef}
          onChange={(e) => handleInputChange(e.target.files)}
        />
        <CloudUploadIcon sx={{ fontSize: 40, color: '#90caf9', mb: 1 }} />
        <Typography variant="body1" fontWeight={500}>
          Click or drag files to upload
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Only image files are allowed
        </Typography>
      </Box>

      {fileNames.length > 0 && (
        <Stack mt={2} spacing={0.5}>
          <Typography fontWeight={500}>Selected Files:</Typography>
          {fileNames.map((name, idx) => (
            <Typography key={idx} variant="body2" color="text.secondary">
              • {name}
            </Typography>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ImageUploadBox;
