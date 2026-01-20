import React from 'react';
import { Box } from '@mui/material';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = window.location.pathname;
  const isLoginPage = path === '/admin';

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: `linear-gradient(
          135deg,
          #1e3c72,
          #2a5298,
          #ffffff,
          #ff4e50,
          #d4145a,
          #1e3c72
        )`,
        backgroundSize: '300% 300%',
        animation: 'gradientFlow 30s ease infinite',
        overflow: 'hidden',
      }}
    >
      {/* Content wrapper */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: isLoginPage ? '100%' : '80%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isLoginPage ? 'center' : 'flex-start',
          paddingTop: isLoginPage ? 0 : 4,
          paddingBottom: 4,
          margin: '0 auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
