import { Box, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const LocationLink = () => {
  // Store the location to be searched
  const searchQuery =
    'Casa Otilia, B-dul Alexandru Cel Bun nr.62, bloc D3, Iasi, Romania';
  const displayText = 'B-dul Alexandru Cel Bun nr.62, bloc D3, Iasi, Romania';
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

  return (
    <Box
      component="a"
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      display="flex"
      alignItems="center"
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        '&:hover': { color: 'primary.main' }, // Add hover effect to change the color
      }}
    >
      <LocationOnIcon
        fontSize="small"
        sx={{ marginRight: 0.5, fontSize: { xs: '25px', sm: '20px' } }}
      />
      <Typography
        variant="body1"
        color="textPrimary"
        sx={{ fontSize: { xs: '15px', sm: '15px' } }}
      >
        {displayText}
      </Typography>
    </Box>
  );
};

export default LocationLink;
