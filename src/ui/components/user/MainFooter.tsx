import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#001f3f', // Dark blue background
        color: 'white', // White text
        padding: '10px 0',
        textAlign: 'center',
        position: 'relative',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Casa Otilia. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
