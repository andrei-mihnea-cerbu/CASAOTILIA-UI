import { Box, Typography } from '@mui/material';

const FeatureIcon: React.FC<{
  label: string;
  src: string;
  isSmallScreen: boolean;
}> = ({ label, src, isSmallScreen }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <img
      src={src}
      alt={label}
      style={{ width: isSmallScreen ? '60px' : '80px', height: 'auto' }}
    />
    <Typography
      variant="body1"
      sx={{
        mt: 1,
        color: '#bc0c0c',
        textAlign: 'center',
        fontSize: { xs: '1rem', sm: '1.1rem' },
      }}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </Typography>
  </Box>
);

export default FeatureIcon;
