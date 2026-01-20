import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Car } from '../../interfaces/car';
import { useNotification } from '../../context/NotificationProvider';
import { useSession } from '../../context/SessionContext';

interface Props {
  open: boolean;
  onClose: () => void;
  car: Car;
  onDeleted: () => void;
}

const DeleteCarDialog: React.FC<Props> = ({
  open,
  onClose,
  car,
  onDeleted,
}) => {
  const [loading, setLoading] = React.useState(false);
  const { setNotification } = useNotification();
  const { getAuthHeaders } = useSession();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/cars/${car.id}`, {
        headers: getAuthHeaders(),
      });

      setNotification('Car deleted successfully.', 'success');
      onDeleted();
      onClose();
    } catch (error: any) {
      setNotification('Failed to delete car.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Car</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{car.name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCarDialog;
