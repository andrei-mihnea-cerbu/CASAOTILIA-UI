import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useLoading } from '../../context/LoadingContext';
import ConstructionIcon from '@mui/icons-material/Construction';
import HomeIcon from '@mui/icons-material/Home';
import MapIcon from '@mui/icons-material/Map';

const MotionBox = motion(Box);

const OldSchoolGaragePage: React.FC = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
        py: 6,
      }}
    >
      {/* Friendly Message */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 4 }}
      >
        <ConstructionIcon sx={{ fontSize: 70, color: '#bc0c0c', mb: 2 }} />
        <Typography
          variant="h3"
          sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}
        >
          Old School Garage
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, color: '#555' }}>
          🚧 Our garage page is currently under construction — but don’t worry,
          the engines are warming up!
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 600, mx: 'auto', color: '#777' }}
        >
          Meanwhile, you can find us at our garage in Iași. Drop by and say hi
          anytime!
        </Typography>
      </MotionBox>

      {/* Google Maps Embed */}
      <MotionBox
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        sx={{
          width: '100%',
          maxWidth: '800px',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 3,
          mb: 3,
        }}
      >
        <iframe
          title="Old School Garage Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2706.6476512658533!2d27.519696775866333!3d47.282141910327304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40cb1d7eac7a9b23%3A0x37569ee788f1cda7!2sAmerican%20Muscle%20Cars%20For%20Romania!5e0!3m2!1sen!2sro!4v1756329148557!5m2!1sen!2sro"
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </MotionBox>

      {/* View on Google Maps Button */}
      <Button
        href="https://share.google/Myu7Lyez5LNMwmHr5"
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        startIcon={<MapIcon />}
        sx={{ mb: 3 }}
      >
        View on Google Maps
      </Button>

      {/* Back to Home Button */}
      <Button
        href="/"
        variant="contained"
        color="primary"
        startIcon={<HomeIcon />}
        sx={{
          backgroundColor: '#bc0c0c',
          '&:hover': { backgroundColor: '#8f0000' },
          fontWeight: 'bold',
          px: 3,
          py: 1.5,
        }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default OldSchoolGaragePage;
