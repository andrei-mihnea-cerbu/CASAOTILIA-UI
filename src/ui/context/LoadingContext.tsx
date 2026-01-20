import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface LoadingContextType {
  loading: boolean;
  setLoading: (value: boolean) => void;
  renderLoadingBox: () => React.ReactNode;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const LOGO_URL = `${import.meta.env.VITE_STATIC_URL}/logo.png`;

  const setLoadingWithLog = (value: boolean) => {
    setLoading(value);
  };

  const renderLoadingBox = () => (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Logo with beam overlay */}
      <Box
        sx={{
          position: 'relative',
          width: 100,
          height: 100,
          marginBottom: 2,
        }}
      >
        <Box
          component="img"
          src={LOGO_URL}
          alt="Loading..."
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            position: 'relative',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '-50%',
            width: '150%',
            height: '100%',
            background:
              'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)',
            animation: 'beam 2s linear infinite',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Gradient Loading Text */}
      <Typography
        sx={{
          fontWeight: 'bold',
          fontSize: '1.2rem',
          background: 'linear-gradient(to right, blue, red)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Loading the page...
      </Typography>

      {/* Keyframes */}
      <style>
        {`
          @keyframes beam {
            0% {
              left: -50%;
            }
            100% {
              left: 100%;
            }
          }
        `}
      </style>
    </Box>
  );

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading: setLoadingWithLog, renderLoadingBox }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
