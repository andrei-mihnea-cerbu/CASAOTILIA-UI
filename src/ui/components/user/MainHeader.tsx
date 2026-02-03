import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { FaPhoneAlt, FaFacebookF, FaYoutube, FaTiktok } from 'react-icons/fa';
import LocationLink from './LocationLink.tsx';

const ICONS = [
  {
    href: 'https://www.facebook.com/CASAOTILIAIASI',
    icon: <FaFacebookF size={20} />,
    color: 'primary',
  },
  {
    href: 'https://www.tiktok.com/@casaotilia.iasi',
    icon: <FaTiktok size={20} />,
    color: 'inherit',
  },
  {
    href: 'tel:+40744600746',
    icon: <FaPhoneAlt size={20} />,
    color: 'inherit',
  },
];

const MainHeader: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e0e0e0',
        color: '#000',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '10px 15px', sm: '10px 30px' },
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 3 },
          alignItems: 'center',
          marginLeft: { sm: 3 },
        }}
      >
        <LocationLink />
        <Box display="flex" alignItems="center">
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '16px', sm: '16px' },
              color: 'text.secondary',
            }}
          >
            Program: Monday – Sunday: 08:00 – 21:00
          </Typography>
        </Box>
      </Box>

      {/* Right Side (Dynamic Icons) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          gap: { xs: 2, sm: 1 },
          marginRight: { sm: 3 },
        }}
      >
        {ICONS.map(({ href, icon, color }) => (
          <IconButton
            key={href}
            href={href}
            target="_blank"
            color={color as any}
          >
            {icon}
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default MainHeader;
