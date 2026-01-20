import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useLoading } from '../context/LoadingContext.tsx';

const NotFoundPage: React.FC = () => {
  const { setLoading } = useLoading();
  setLoading(false);
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        textAlign: 'center',
      }}
    >
      {/* 404 Title */}
      <Typography
        variant="h1"
        gutterBottom
        sx={{
          fontSize: { xs: '6rem', sm: '8rem' },
          fontWeight: 'bold',
          color: 'orange',
          lineHeight: 1,
        }}
      >
        404
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'black',
          fontSize: { xs: '1.8rem', sm: '2.5rem' },
          fontWeight: 'bold',
        }}
      >
        Oops! Page Not Found
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: 'gray',
          fontSize: { xs: '1rem', sm: '1.2rem' },
          maxWidth: 600,
          marginBottom: 4,
        }}
      >
        Sorry, the page you’re looking for doesn’t exist. It might have been
        removed or you may have mistyped the URL.
      </Typography>

      {/* Back Home */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => (window.location.href = '/')}
        sx={{
          fontSize: '1rem',
          padding: '0.8rem 2rem',
        }}
      >
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
