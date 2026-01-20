import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { WhatsApp, Menu as MenuIcon } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const navItems = {
  Home: { path: '/', target: '_self' },
  Cars: { path: '/cars', target: '_self' },
  'Used Car Parts': { path: '/used-car-parts', target: '_self' },
  'Old School Garage': { path: '/old-school-garage', target: '_self' },
  'Ford Mustang Spare Parts': {
    path: 'https://retro-mustang.ro/',
    target: '_blank',
  },
};

const MainNavbar: React.FC = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuOpen, setMenuOpen] = useState(false);

  const renderNavLinks = (isOverlay: boolean = false) =>
    Object.entries(navItems).map(([label, { path, target }], index) => {
      const isExternal = target === '_blank';

      return (
        <Box
          key={index}
          component={isExternal ? 'a' : RouterLink}
          to={!isExternal ? path : undefined}
          href={isExternal ? path : undefined}
          target={target}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          onClick={() => setMenuOpen(false)}
          sx={{
            fontSize: isOverlay ? '40px' : { xs: '10px', sm: '20px' },
            color: isOverlay ? '#fff' : '#000',
            fontWeight: isOverlay ? 'bold' : 'normal',
            textAlign: 'center',
            textDecoration: 'none',
            padding: isOverlay ? '10px 0' : '10px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            cursor: 'pointer',
            '&:hover': {
              color: isOverlay ? '#bc0c0c' : 'red',
            },
          }}
        >
          {label}
        </Box>
      );
    });

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '10px 20px', sm: '20px 40px' },
      }}
    >
      {/* Desktop navigation */}
      {!isXs ? (
        <Box
          sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, alignItems: 'center' }}
        >
          {renderNavLinks()}
        </Box>
      ) : (
        /* Mobile menu */
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => setMenuOpen(true)} sx={{ color: '#000' }}>
            <MenuIcon sx={{ fontSize: '30px' }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000',
              marginLeft: '5px',
              display: menuOpen ? 'none' : 'block',
            }}
          >
            Menu
          </Typography>

          {/* Overlay menu */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)',
              visibility: menuOpen ? 'visible' : 'hidden',
              transition:
                'opacity 0.3s ease, transform 0.4s ease, visibility 0.3s ease',
              pointerEvents: menuOpen ? 'auto' : 'none',
            }}
            onClick={() => setMenuOpen(false)}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                height: '100vh',
                padding: '40px 0',
                width: '100%',
              }}
            >
              {renderNavLinks(true)}
            </Box>
          </Box>
        </Box>
      )}

      {/* WhatsApp button */}
      <Box
        onClick={() => window.open('https://wa.me/40744586780', '_blank')}
        sx={{
          fontSize: { xs: '15px', sm: '20px' },
          backgroundColor: '#bc0c0c',
          color: '#fff',
          padding: { xs: '10px 20px', sm: '12px 40px' },
          borderRadius: '40px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: '#a00000',
          },
        }}
      >
        <WhatsApp
          sx={{ marginRight: 1, fontSize: { xs: '18px', sm: '24px' } }}
        />
        +40 744 586 780
      </Box>
    </Box>
  );
};

export default MainNavbar;
