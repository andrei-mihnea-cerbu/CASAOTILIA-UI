import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Fade, Typography } from '@mui/material';

import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import { useLoading } from '../context/LoadingContext';

const LayoutWrapper: React.FC = () => {
  const { loading, renderLoadingBox } = useLoading();
  const [showOverlay, setShowOverlay] = useState(true);
  const [websiteDown, setWebsiteDown] = useState(false);

  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const isAdminRoute = location.pathname.startsWith('/admin');
  const Layout = isAdminRoute ? AdminLayout : MainLayout;

  // Loading overlay fade logic
  useEffect(() => {
    if (!loading) {
      const timeout = setTimeout(() => setShowOverlay(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setShowOverlay(true);
    }
  }, [loading]);

  // 🔥 BACKEND HEALTH CHECK
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${apiUrl}/health`, { cache: 'no-store' });

        if (!res.ok) {
          setWebsiteDown(true);
        } else {
          setWebsiteDown(false);
        }
      } catch (err) {
        setWebsiteDown(true);
      }
    };

    checkHealth(); // Run immediately

    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, [apiUrl]);

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>

      {/* Loading overlay */}
      <Fade in={loading || showOverlay} timeout={500}>
        <Box sx={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
          {renderLoadingBox()}
        </Box>
      </Fade>

      {/* 🔴 WEBSITE DOWN OVERLAY */}
      {websiteDown && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background:
              'radial-gradient(circle at center, rgba(10,10,10,0.95), rgba(0,0,0,1))',
            backdropFilter: 'blur(5px)',
            color: '#ffffff',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 3,
            py: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
              color: '#ffffff',
            }}
          >
            🔧 Website Backend Is Temporarily Down
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 600,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              opacity: 0.85,
              lineHeight: 1.6,
              color: '#dddddd',
            }}
          >
            We’re currently performing maintenance or resolving a technical
            issue.
            <br />
            We’re already working to restore service as quickly as possible.
          </Typography>

          <Typography
            sx={{
              mt: 3,
              fontSize: { xs: '0.85rem', sm: '1rem' },
              opacity: 0.5,
              color: '#999',
            }}
          >
            Thank you for your patience.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default LayoutWrapper;
