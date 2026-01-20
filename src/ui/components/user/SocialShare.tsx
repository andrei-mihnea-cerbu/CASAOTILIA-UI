import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface SocialShareProps {
  url: string;
  title?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title = 'Share on:',
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const baseUrl = import.meta.env.VITE_STATIC_URL;

  const shareOnSocialMedia = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    window.open(shareUrl, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.log(err);
      alert('Failed to copy link');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: { xs: '1rem', sm: '1.5rem' },
        }}
      >
        {title}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton onClick={() => shareOnSocialMedia('facebook')}>
          <img
            src={`${baseUrl}/facebook-icon.png`}
            alt="Facebook"
            style={{ width: isSmallScreen ? '50px' : '60px', height: 'auto' }}
          />
        </IconButton>

        <IconButton onClick={() => shareOnSocialMedia('whatsapp')}>
          <img
            src={`${baseUrl}/whatsapp-icon.png`}
            alt="WhatsApp"
            style={{ width: isSmallScreen ? '50px' : '60px', height: 'auto' }}
          />
        </IconButton>

        <IconButton onClick={copyToClipboard}>
          <img
            src={`${baseUrl}/link-icon.png`}
            alt="Copy link"
            style={{ width: isSmallScreen ? '50px' : '60px', height: 'auto' }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SocialShare;
