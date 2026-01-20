import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Car } from '../../interfaces/car.ts';
import { useLoading } from '../../context/LoadingContext.tsx';
import { InventoryItem, getInventoryType } from '../../utils/inventory.ts';
import DiscountBadge from '../../components/common/DiscountBadge';

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const { setLoading } = useLoading();
  const location = useLocation();

  const apiUrl = import.meta.env.VITE_API_URL;
  const bucketUrl = import.meta.env.VITE_S3_PUBLIC_BASE_URL;

  const path = location.pathname.replace(/^\/+/, '');
  const endpoint = path.includes('used-car-parts') ? 'used-car-parts' : 'cars';
  const isCarInventory = endpoint === 'cars';

  /* ---------------- effects ---------------- */

  useEffect(() => {
    setLoading(true);
    fetchInventory().finally(() => setLoading(false));
  }, [endpoint]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get<InventoryItem[]>(
        `${apiUrl}/${endpoint}`
      );

      const cleaned = response.data.map((item) => ({
        ...item,
        imageGallery:
          item.imageGallery?.map(
            (img) => `${bucketUrl}/${img.replace(/ /g, '%20')}`
          ) || [],
      }));

      const weightedShuffle = (arr: InventoryItem[]) =>
        [...arr].sort((a, b) => {
          const priceDiff = (b.price || 0) - (a.price || 0);
          const noise = (Math.random() - 0.5) * 0.3 * (b.price || 1);
          return priceDiff + noise;
        });

      const yes = weightedShuffle(
        cleaned.filter(
          (item) => item.stock === 'Yes' || item.stock === 'Reserved'
        )
      );
      const no = weightedShuffle(cleaned.filter((item) => item.stock === 'No'));

      setItems([...yes, ...no]);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  const handleCardClick = (id: string) => {
    window.location.href = `/inventory/${endpoint}?id=${id}`;
  };

  const title = isCarInventory ? 'Cars Inventory' : 'Used Car Parts Inventory';
  const subtitle = isCarInventory
    ? 'Browse our full inventory of cars'
    : 'Browse our full inventory of used car parts';

  /* ---------------- render ---------------- */

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 }, width: '90%', margin: 'auto' }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 2,
          fontSize: { xs: '1.8rem', sm: '4rem' },
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          textAlign: 'center',
          mb: 4,
          color: 'textSecondary',
          fontSize: { xs: '0.9rem', sm: '2rem' },
        }}
      >
        {subtitle}
      </Typography>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No {isCarInventory ? 'cars' : 'parts'} available.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {items.map((item) => {
            const itemType = getInventoryType(item);
            const hasDiscount = item.salePrice != null;

            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => handleCardClick(item.id)}
                >
                  {/* 🔥 Discount badge */}
                  {hasDiscount &&
                    item.stock !== 'No' &&
                    item.discount != null && (
                      <DiscountBadge discount={item.discount} />
                    )}

                  {/* Overlay badges */}
                  {item.stock === 'No' && <Overlay text="Sold" color="red" />}
                  {item.stock === 'Reserved' && (
                    <Overlay text="Reserved" color="orange" />
                  )}

                  {/* Image */}
                  <CardMedia
                    component="img"
                    image={item.imageGallery[0]}
                    alt={item.name}
                    sx={{ height: { xs: 250, sm: 400 }, objectFit: 'cover' }}
                  />

                  {/* Info */}
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {item.name}
                      {itemType === 'car' && ` (Year: ${(item as Car).year})`}
                    </Typography>

                    {!hasDiscount ? (
                      <Typography
                        variant="h5"
                        sx={{ color: 'red', fontWeight: 'bold', mt: 1 }}
                      >
                        €{item.price.toLocaleString()}
                      </Typography>
                    ) : (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'grey.600',
                            textDecoration: 'line-through',
                          }}
                        >
                          €{item.price.toLocaleString()}
                        </Typography>

                        <Typography
                          variant="h5"
                          sx={{ color: 'red', fontWeight: 'bold' }}
                        >
                          SALE: €{item.salePrice!.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

/* ---------------- Overlay badge ---------------- */

const Overlay: React.FC<{ text: string; color: string }> = ({
  text,
  color,
}) => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    }}
  >
    <Typography
      sx={{
        fontSize: '8rem',
        fontWeight: 'bold',
        color,
        transform: 'rotate(-30deg)',
        opacity: 0.7,
        textTransform: 'uppercase',
        letterSpacing: 2,
      }}
    >
      {text}
    </Typography>
  </Box>
);

export default InventoryPage;
