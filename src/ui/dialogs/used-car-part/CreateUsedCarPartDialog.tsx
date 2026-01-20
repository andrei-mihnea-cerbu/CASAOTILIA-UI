import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNotification } from '../../context/NotificationProvider';
import { StockStatus } from '../../interfaces/types';
import { useSession } from '../../context/SessionContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateUsedCarPartDialog: React.FC<Props> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: '',
  });

  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [stockStatuses, setStockStatuses] = useState<StockStatus[]>([]);

  const { setNotification } = useNotification();
  const { getAuthHeaders } = useSession();
  const apiUrl = import.meta.env.VITE_API_URL;

  /* ---------------- effects ---------------- */

  useEffect(() => {
    if (!open) return;

    const fetchStock = async () => {
      try {
        const res = await axios.get<StockStatus[]>(
          `${apiUrl}/types/stock-status`
        );
        setStockStatuses(res.data);
      } catch {
        setNotification('Failed to fetch stock statuses', 'error');
      }
    };

    fetchStock();
  }, [open, apiUrl, setNotification]);

  /* ---------------- logic ---------------- */

  const previewDiscount = (): number | null => {
    if (salePrice === '' || form.price <= 0) return null;
    if (salePrice >= form.price) return null;

    return Math.round(((form.price - salePrice) / form.price) * 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- submit ---------------- */

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        stock: form.stock,
        price: Number(form.price),
        salePrice: salePrice === '' ? undefined : salePrice,
      };

      await axios.post(`${apiUrl}/used-car-parts`, payload, {
        headers: getAuthHeaders(),
      });

      onCreated();
      setNotification('Used car part created!', 'success');
      onClose();
    } catch {
      setNotification('Failed to create part.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- render ---------------- */

  const discountPreviewValue = previewDiscount();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Used Car Part</DialogTitle>

      <DialogContent>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={form.name}
        />

        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          onChange={handleChange}
          value={form.description}
        />

        <TextField
          label="Price (€)"
          name="price"
          type="number"
          fullWidth
          margin="normal"
          onChange={handleChange}
          value={form.price}
        />

        {/* -------- Sale Price -------- */}
        <TextField
          label="Sale Price (optional)"
          type="number"
          fullWidth
          margin="normal"
          value={salePrice}
          onChange={(e) => {
            const value = e.target.value;
            setSalePrice(value === '' ? '' : Number(value));
          }}
          helperText={
            discountPreviewValue !== null
              ? `Discount preview: ${discountPreviewValue}%`
              : 'Leave empty for no discount'
          }
        />

        <TextField
          select
          label="Stock Status"
          name="stock"
          fullWidth
          margin="normal"
          value={form.stock}
          onChange={handleChange}
        >
          {stockStatuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
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
          {loading ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUsedCarPartDialog;
