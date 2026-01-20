import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { UsedCarPart } from '../../interfaces/used-car-part';
import { useNotification } from '../../context/NotificationProvider';
import { useSession } from '../../context/SessionContext';

interface Props {
  open: boolean;
  onClose: () => void;
  part: UsedCarPart;
  onDeleted: () => void;
}

const DeleteUsedCarPartDialog: React.FC<Props> = ({
  open,
  onClose,
  part,
  onDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const { setNotification } = useNotification();
  const { session } = useSession();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDelete = async () => {
    if (!session) return;

    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/used-car-parts/${part.id}`, {
        headers: {
          'x-client-token': session.clientToken,
        },
      });

      onDeleted();
      setNotification('Used car part deleted successfully.', 'success');
      onClose();
    } catch (err: any) {
      setNotification('Failed to delete used car part.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Used Car Part</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{part.name}</strong>?
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

export default DeleteUsedCarPartDialog;
