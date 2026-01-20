import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNotification } from '../../context/NotificationProvider';
import { useSession } from '../../context/SessionContext';
import { useLoading } from '../../context/LoadingContext';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const { setLoading } = useLoading();
  const { setNotification } = useNotification();
  const { setJwtToken, getRole } = useSession();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLocalLoading(true);
    try {
      const response = await axios.post<{ jwtToken: string }>(
        `${apiUrl}/auth/login`,
        { username, password }
      );

      const { jwtToken } = response.data;
      if (!jwtToken) throw new Error('Missing token');

      setJwtToken(jwtToken);
      setNotification('Login successful!', 'success');

      const role = getRole();
      const roleToPath: Record<string, string> = {
        ADMIN: '/admin/dashboard',
      };

      const redirectPath = roleToPath[role] || '/admin';
      window.location.href = redirectPath;
    } catch (err: unknown) {
      console.error('Login error:', err);
      setNotification('Login failed. Please try again.', 'error');
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const isFormValid = username.trim() !== '' && password.trim() !== '';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'transparent',
      }}
    >
      <Box
        sx={{
          padding: { xs: 3, sm: 4 },
          width: { xs: '85%', sm: '400px' },
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'rgba(255,255,255,0.95)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            marginBottom: 3,
            color: '#1976d2',
          }}
        >
          Admin Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
            required
          />

          {localLoading ? (
            <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{
                fontSize: '1rem',
                padding: '0.8rem 2rem',
                backgroundColor: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
              }}
              disabled={!isFormValid}
            >
              Login
            </Button>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default AdminLoginPage;
