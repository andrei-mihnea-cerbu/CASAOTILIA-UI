import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import { Car } from '../../interfaces/car.ts';
import { UsedCarPart } from '../../interfaces/used-car-part.ts';
import SocialShare from '../../components/user/SocialShare.tsx';
import ImageSection from '../../components/user/ImageSection.tsx';
import { useLoading } from '../../context/LoadingContext.tsx';
import FeatureIcon from '../../components/common/FeatureIcon.tsx';
import { InventoryItem, getInventoryType } from '../../utils/inventory.ts';

const InventoryDetailsPage: React.FC = () => {
  const [item, setItem] = useState<InventoryItem | null>(null);

  const location = useLocation();
  const { setLoading } = useLoading();

  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const path = location.pathname;
  const endpoint = path.includes('used-car-parts') ? 'used-car-parts' : 'cars';

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const apiUrl = import.meta.env.VITE_API_URL;
  const staticUrl = import.meta.env.VITE_STATIC_URL;
  const bucketUrl = import.meta.env.VITE_S3_PUBLIC_BASE_URL;

  /* ---------------- effects ---------------- */

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetchItem().finally(() => setLoading(false));
  }, [id, endpoint]);

  const fetchItem = async () => {
    try {
      const response = await axios.get<InventoryItem>(`${apiUrl}/${endpoint}`, {
        params: { id },
      });

      const updatedGallery =
        response.data.imageGallery?.map(
          (img) => `${bucketUrl}/${img.replace(/ /g, '%20')}`
        ) || [];

      setItem({ ...response.data, imageGallery: updatedGallery });
    } catch (error) {
      console.error(`Error fetching ${endpoint} details:`, error);
    }
  };

  /* ---------------- pricing ---------------- */

  const pricing = useMemo(() => {
    if (!item || item.salePrice == null) {
      return {
        hasDiscount: false,
        original: item?.price ?? 0,
        discounted: null,
        discount: null,
      };
    }

    return {
      hasDiscount: true,
      original: item.price,
      discounted: item.salePrice,
      discount: item.discount ?? null,
    };
  }, [item]);

  /* ---------------- guards ---------------- */

  if (!item) {
    return (
      <Box sx={{ textAlign: 'center', padding: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Sorry, this {endpoint === 'cars' ? 'car' : 'part'} is not available.
        </Typography>
      </Box>
    );
  }

  const itemType = getInventoryType(item);
  const shareUrl = `https://americanmusclecars.eu/inventory/${endpoint}?id=${item.id}`;

  /* ---------------- render ---------------- */

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '40vh', sm: '50vh' },
          backgroundImage: `url('${item.imageGallery[0]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0, 114, 255, 0.5), rgba(0, 0, 255, 0.2))',
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            zIndex: 2,
            px: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 'bold', fontSize: { xs: '2.2rem', sm: '5rem' } }}
          >
            {item.name}
          </Typography>

          {itemType === 'car' && (
            <Typography variant="h5" sx={{ mt: 1 }}>
              Year: {(item as Car).year}
            </Typography>
          )}
        </Box>
      </Box>

      {/* ---------------- Details ---------------- */}
      <Card
        sx={{
          width: '90%',
          mx: 'auto',
          mt: 3,
          mb: 3,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Grid container spacing={4}>
          <ImageSection imageGallery={item.imageGallery} />

          <Grid item xs={12} sm={5}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {item.name}
                {itemType === 'car' && ` (${(item as Car).year})`}
              </Typography>

              {/* ---------------- PRICE BLOCK ---------------- */}
              {!pricing.hasDiscount ? (
                <Typography
                  variant="h4"
                  sx={{ color: 'red', fontWeight: 'bold', mt: 2 }}
                >
                  €{pricing.original.toLocaleString()}
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'grey.600',
                      textDecoration: 'line-through',
                    }}
                  >
                    €{pricing.original.toLocaleString()}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      color: 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    SALE: €{pricing.discounted!.toLocaleString()}
                  </Typography>

                  {pricing.discount != null && (
                    <Typography
                      variant="body2"
                      sx={{ color: 'green', fontWeight: 'bold', mt: 0.5 }}
                    >
                      Save {pricing.discount}%
                    </Typography>
                  )}
                </Box>
              )}

              <Typography sx={{ mt: 1 }}>
                <strong>Stock:</strong>{' '}
                <span
                  style={{
                    color:
                      item.stock === 'No'
                        ? 'red'
                        : item.stock === 'Coming Soon'
                          ? 'orange'
                          : 'green',
                  }}
                >
                  {item.stock === 'No'
                    ? 'Sold'
                    : item.stock === 'Coming Soon'
                      ? 'Coming Soon'
                      : 'Available'}
                </span>
              </Typography>

              {/* ---------------- Car Features ---------------- */}
              {itemType === 'car' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Main Features
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <FeatureIcon
                        label={(item as Car).gearType}
                        src={`${staticUrl}/stick.png`}
                        isSmallScreen={isSmallScreen}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FeatureIcon
                        label={(item as Car).engine}
                        src={`${staticUrl}/pistons.png`}
                        isSmallScreen={isSmallScreen}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FeatureIcon
                        label={(item as Car).gasType}
                        src={`${staticUrl}/petrol-canister.png`}
                        isSmallScreen={isSmallScreen}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* ---------------- Used Part Description ---------------- */}
              {itemType === 'used-car-part' && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Description
                  </Typography>
                  <Typography>{(item as UsedCarPart).description}</Typography>
                </Box>
              )}
            </CardContent>

            <Box sx={{ mt: 3 }}>
              <SocialShare url={shareUrl} />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default InventoryDetailsPage;
