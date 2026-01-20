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
import { UsedCarPart } from '../../interfaces/used-car-part';
import { StockStatus } from '../../interfaces/types';
import { useNotification } from '../../context/NotificationProvider';
import { useSession } from '../../context/SessionContext';

interface Props {
  open: boolean;
  onClose: () => void;
  part: UsedCarPart;
  onUpdated: () => void;
}

const EditUsedCarPartDialog: React.FC<Props> = ({
  open,
  onClose,
  part,
  onUpdated,
}) => {
  const [formData, setFormData] = useState<UsedCarPart>(part);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [stockOptions, setStockOptions] = useState<StockStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const { setNotification } = useNotification();
  const { getAuthHeaders } = useSession();
  const apiUrl = import.meta.env.VITE_API_URL;

  /* ---------------- effects ---------------- */

  useEffect(() => {
    setFormData(part);
    setSalePrice(part.salePrice ?? '');
  }, [part]);

  useEffect(() => {
    axios
      .get<StockStatus[]>(`${apiUrl}/types/stock-status`)
      .then((res) => setStockOptions(res.data))
      .catch(() => setNotification('Failed to load stock types', 'error'));
  }, [apiUrl, setNotification]);

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
        salePrice: salePrice === '' ? undefined : salePrice,
      };

      await axios.put(`${apiUrl}/used-car-parts/${id}`, finalPayload, {
        headers: getAuthHeaders(),
      });

      onUpdated();
      setNotification('Used car part updated successfully.', 'success');
      onClose();
    } catch (err: any) {
      setNotification(
        err?.response?.data?.message || 'Failed to update part.',
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
      <DialogTitle>Edit Used Car Part</DialogTitle>

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
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUsedCarPartDialog;
