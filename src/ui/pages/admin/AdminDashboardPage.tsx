import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  Card,
  CardContent,
  TextField,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

import { Car } from '../../interfaces/car';
import { UsedCarPart } from '../../interfaces/used-car-part';
import { getInventoryType, InventoryItem } from '../../utils/inventory';

import CreateCarDialog from '../../dialogs/car/CreateCarDialog';
import CreateUsedCarPartDialog from '../../dialogs/used-car-part/CreateUsedCarPartDialog';
import EditCarDialog from '../../dialogs/car/EditCarDialog';
import EditUsedCarPartDialog from '../../dialogs/used-car-part/EditUsedCarPartDialog';
import DeleteCarDialog from '../../dialogs/car/DeleteCarDialog';
import DeleteUsedCarPartDialog from '../../dialogs/used-car-part/DeleteUsedCarPartDialog';
import ImageGalleryDialog from '../../dialogs/image/ImageGalleryDialog';

import { useLoading } from '../../context/LoadingContext';
import { useNotification } from '../../context/NotificationProvider';
import DiscountBadge from '../../components/common/DiscountBadge';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cars' | 'used-car-parts'>('cars');
  const [cars, setCars] = useState<Car[]>([]);
  const [parts, setParts] = useState<UsedCarPart[]>([]);
  const [localLoading, setLocalLoading] = useState(false);

  const { setLoading } = useLoading();
  const { setNotification } = useNotification();

  const [nameFilter, setNameFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [idFilter, setIdFilter] = useState<string | null>(null);
  const [linkFilterInput, setLinkFilterInput] = useState('');

  const [carDialogOpen, setCarDialogOpen] = useState(false);
  const [partDialogOpen, setPartDialogOpen] = useState(false);
  const [editCarOpen, setEditCarOpen] = useState(false);
  const [editPartOpen, setEditPartOpen] = useState(false);
  const [deleteCarOpen, setDeleteCarOpen] = useState(false);
  const [deletePartOpen, setDeletePartOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const bucketUrl = import.meta.env.VITE_S3_PUBLIC_BASE_URL;

  /* ---------------- helpers ---------------- */

  const extractIdFromInput = (value: string): string | null => {
    if (!value) return null;

    try {
      if (value.includes('?')) {
        const query = value.split('?')[1];
        const params = new URLSearchParams(query);
        return params.get('id');
      }

      if (/^[0-9a-fA-F-]{36}$/.test(value)) {
        return value;
      }

      return null;
    } catch {
      return null;
    }
  };

  /* ---------------- data fetching ---------------- */

  const fetchData = async () => {
    setLocalLoading(true);
    try {
      if (activeTab === 'cars') {
        const response = await axios.get<Car[]>(`${apiUrl}/cars`);
        const sorted = response.data
          .map((car) => ({
            ...car,
            imageGallery:
              car.imageGallery?.map((img) => img.replace(/ /g, '%20')) || [],
          }))
          .sort((a, b) => b.year - a.year || a.name.localeCompare(b.name));
        setCars(sorted);
      } else {
        const response = await axios.get<UsedCarPart[]>(
          `${apiUrl}/used-car-parts`
        );
        const sorted = response.data
          .map((part) => ({
            ...part,
            imageGallery:
              part.imageGallery?.map((img) => img.replace(/ /g, '%20')) || [],
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setParts(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [activeTab]);

  /* ---------------- filtering ---------------- */

  const items: InventoryItem[] = activeTab === 'cars' ? cars : parts;

  const filteredItems = (() => {
    if (idFilter) {
      const match = items.find((item) => item.id === idFilter);
      return match ? [match] : [];
    }

    return items.filter((item) => {
      const nameMatch = item.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      const priceMatch =
        priceFilter === '' || item.price.toString().includes(priceFilter);

      return nameMatch && priceMatch;
    });
  })();

  /* ---------------- render ---------------- */

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 3,
          width: '90%',
          minWidth: { xs: '100%', md: 1200 },
          backgroundColor: 'rgba(255,255,255,0.95)',
          position: 'relative',
        }}
      >
        {/* ---------- Local loading overlay ---------- */}
        {localLoading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.45)',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 3,
            }}
          >
            <CircularProgress size={64} sx={{ color: 'white' }} />
          </Box>
        )}

        {/* Tabs */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {(['cars', 'used-car-parts'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'contained' : 'outlined'}
              onClick={() => {
                setActiveTab(tab);
                setIdFilter(null);
                setLinkFilterInput('');
              }}
            >
              {tab === 'cars' ? 'Cars' : 'Used Car Parts'}
            </Button>
          ))}
        </Box>

        {/* ID / URL Filter */}
        <TextField
          fullWidth
          label="Filter by link or ID"
          placeholder="Paste full inventory link or UUID"
          value={linkFilterInput}
          onChange={(e) => {
            const value = e.target.value;
            setLinkFilterInput(value);
            setIdFilter(extractIdFromInput(value));
          }}
          helperText={
            idFilter
              ? `Filtering by ID: ${idFilter}`
              : 'Paste a full link like /inventory/cars?id=... or just the ID'
          }
          sx={{ mb: 3 }}
        />

        {/* Other Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Filter by name"
            value={nameFilter}
            disabled={!!idFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            fullWidth
          />
          <TextField
            label="Filter by price"
            type="number"
            value={priceFilter}
            disabled={!!idFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            sx={{ width: 200 }}
          />
        </Box>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            {activeTab === 'cars' ? 'Cars' : 'Used Car Parts'}
          </Typography>
          <IconButton
            color="primary"
            onClick={() =>
              activeTab === 'cars'
                ? setCarDialogOpen(true)
                : setPartDialogOpen(true)
            }
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* Items Grid */}
        <Grid container spacing={3}>
          {filteredItems.map((item) => {
            const type = getInventoryType(item);
            const hasDiscount = item.salePrice != null && item.discount != null;

            const shareLink = `${window.location.origin}/inventory/${
              type === 'car' ? 'cars' : 'used-car-parts'
            }?id=${item.id}`;

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: 3,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(shareLink)
                      .then(() =>
                        setNotification(
                          `Link for ${item.name} copied to clipboard`,
                          'success'
                        )
                      )
                  }
                >
                  {hasDiscount && <DiscountBadge discount={item.discount} />}

                  <CardContent sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {item.name}
                      </Typography>

                      {!hasDiscount ? (
                        <Typography variant="body2" color="text.secondary">
                          €{item.price.toLocaleString()}
                        </Typography>
                      ) : (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'grey.600',
                              textDecoration: 'line-through',
                            }}
                          >
                            €{item.price.toLocaleString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: 'error.main', fontWeight: 700 }}
                          >
                            SALE: €{item.salePrice!.toLocaleString()}
                          </Typography>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            type === 'car'
                              ? setEditCarOpen(true)
                              : setEditPartOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            type === 'car'
                              ? setDeleteCarOpen(true)
                              : setDeletePartOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setImageOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        width: 120,
                        height: 80,
                        borderRadius: 1,
                        overflow: 'hidden',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      {item.imageGallery?.length ? (
                        <img
                          src={`${bucketUrl}/${item.imageGallery[0]}`}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <Typography variant="caption">No image</Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Dialogs */}
      {activeTab === 'cars' ? (
        <CreateCarDialog
          open={carDialogOpen}
          onClose={() => setCarDialogOpen(false)}
          onCreated={fetchData}
        />
      ) : (
        <CreateUsedCarPartDialog
          open={partDialogOpen}
          onClose={() => setPartDialogOpen(false)}
          onCreated={fetchData}
        />
      )}

      {selectedItem && (
        <>
          <EditCarDialog
            open={editCarOpen}
            onClose={() => setEditCarOpen(false)}
            car={selectedItem as Car}
            onUpdated={fetchData}
          />
          <EditUsedCarPartDialog
            open={editPartOpen}
            onClose={() => setEditPartOpen(false)}
            part={selectedItem as UsedCarPart}
            onUpdated={fetchData}
          />
          <DeleteCarDialog
            open={deleteCarOpen}
            onClose={() => setDeleteCarOpen(false)}
            car={selectedItem as Car}
            onDeleted={fetchData}
          />
          <DeleteUsedCarPartDialog
            open={deletePartOpen}
            onClose={() => setDeletePartOpen(false)}
            part={selectedItem as UsedCarPart}
            onDeleted={fetchData}
          />
          <ImageGalleryDialog
            open={imageOpen}
            onClose={() => setImageOpen(false)}
            entityId={selectedItem.id}
            type={getInventoryType(selectedItem)}
            onUpdate={fetchData}
          />
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;
