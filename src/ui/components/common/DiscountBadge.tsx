import { Box, Typography } from '@mui/material';

interface Props {
  discount: number;
  position?: 'top-left' | 'top-right';
}

const DiscountBadge: React.FC<Props> = ({
  discount,
  position = 'top-right',
}) => {
  const rounded = Math.round(discount);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: position === 'top-left' ? 12 : 'auto',
        right: position === 'top-right' ? 12 : 'auto',

        background: 'linear-gradient(135deg, #ff1744, #d50000)',
        color: 'white',

        px: 2.75, // ⬅️ bigger padding
        py: 1.1,

        borderRadius: 999,
        fontWeight: 'bold',
        fontSize: '1.15rem', // ⬅️ bigger text
        boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
        zIndex: 5,
        userSelect: 'none',
        letterSpacing: 0.6,

        animation: 'discountPulse 1.8s ease-in-out infinite',
        transformOrigin: 'center',
        willChange: 'transform, box-shadow',

        '@keyframes discountPulse': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
          },
          '50%': {
            transform: 'scale(1.1)', // ⬅️ slightly stronger pulse
            boxShadow: '0 10px 26px rgba(255, 23, 68, 0.7)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.4)',
          },
        },
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          lineHeight: 1,
          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}
      >
        −{rounded}%
      </Typography>
    </Box>
  );
};

export default DiscountBadge;
