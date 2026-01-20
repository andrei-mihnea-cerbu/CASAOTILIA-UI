import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { Car } from '../../interfaces/car';
import { GasType, GearType, StockStatus } from '../../interfaces/types';
import { useNotification } from '../../context/NotificationProvider';
import { useSession } from '../../context/SessionContext';

interface Props {
  open: boolean;
  onClose: () => void;
  car: Car;
  onUpdated: () => void;
}

const EditCarDialog: React.FC<Props> = ({ open, onClose, car, onUpdated }) => {
  const [formData, setFormData] = useState<Car>(car);
  const [salePrice, setSalePrice] = useState<number | ''>('');

  const [stockOptions, setStockOptions] = useState<StockStatus[]>([]);
  const [gearOptions, setGearOptions] = useState<GearType[]>([]);
  const [gasOptions, setGasOptions] = useState<GasType[]>([]);
  const [loading, setLoading] = useState(false);

  const { setNotification } = useNotification();
  const { getAuthHeaders } = useSession();
  const apiUrl = import.meta.env.VITE_API_URL;

  /* ---------------- effects ---------------- */

  useEffect(() => {
    setFormData(car);
    setSalePrice(car.salePrice ?? '');
  }, [car]);

  useEffect(() => {
    if (!open) return;

    const fetchTypes = async () => {
      try {
        const [stock, gear, gas] = await Promise.all([
          axios.get<StockStatus[]>(`${apiUrl}/types/stock-status`),
          axios.get<GearType[]>(`${apiUrl}/types/gear`),
          axios.get<GasType[]>(`${apiUrl}/types/gas`),
        ]);

        setStockOptions(stock.data);
        setGearOptions(gear.data);
        setGasOptions(gas.data);
      } catch {
        setNotification('Failed to fetch types.', 'error');
      }
    };

    fetchTypes();
  }, [open, apiUrl, setNotification]);

  /* ---------------- logic ---------------- */

  const previewDiscount = (): number | null => {
    if (salePrice === '' || formData.price <= 0) return null;
    if (salePrice >= formData.price) return null;

    return Math.round(((formData.price - salePrice) / formData.price) * 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------------- submit ---------------- */

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { id, imageGallery, discount, ...payload } = formData;

      const finalPayload = {
        ...payload,
        price: Number(payload.price),
        year: Number(payload.year),
        salePrice: salePrice === '' ? undefined : salePrice,
      };

      await axios.put(`${apiUrl}/cars/${id}`, finalPayload, {
        headers: getAuthHeaders(),
      });

      onUpdated();
      setNotification('Car updated successfully.', 'success');
      onClose();
    } catch (error: any) {
      setNotification(
        error?.response?.data?.message || 'Failed to update car.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- render ---------------- */

  const discountPreviewValue = previewDiscount();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Car</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
        />

        {/* -------- Sale Price -------- */}
        <TextField
          fullWidth
          label="Sale Price (optional)"
          type="number"
          value={salePrice}
          onChange={(e) => {
            const value = e.target.value;
            setSalePrice(value === '' ? '' : Number(value));
          }}
          margin="normal"
          helperText={
            discountPreviewValue !== null
              ? `Discount preview: ${discountPreviewValue}%`
              : 'Leave empty to remove discount'
          }
        />

        <TextField
          fullWidth
          label="Engine"
          name="engine"
          value={formData.engine}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          select
          fullWidth
          label="Stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          margin="normal"
        >
          {stockOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Gear Type"
          name="gearType"
          value={formData.gearType}
          onChange={handleChange}
          margin="normal"
        >
          {gearOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Gas Type"
          name="gasType"
          value={formData.gasType}
          onChange={handleChange}
          margin="normal"
        >
          {gasOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCarDialog;
