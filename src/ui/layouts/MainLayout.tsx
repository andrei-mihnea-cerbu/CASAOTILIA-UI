import React from 'react';
import { Box, IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MainHeader from '../components/user/MainHeader.tsx';
import MainNavBar from '../components/user/MainNavbar.tsx';
import MainFooter from '../components/user/MainFooter.tsx';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const whatsappNumber = '+40744600746';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MainHeader />
      <MainNavBar />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {children}
      </Box>

      <MainFooter />

      {/* Sticky WhatsApp Button */}
      <IconButton
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          backgroundColor: '#25D366',
          color: 'white',
          boxShadow: 4,
          '&:hover': {
            backgroundColor: '#1EBE5D',
          },
        }}
      >
        <WhatsAppIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default MainLayout;
