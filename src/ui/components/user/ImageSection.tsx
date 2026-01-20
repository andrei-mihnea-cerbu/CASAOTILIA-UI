import React, { useState, useRef } from 'react';
import {
  Box,
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface ImageSectionProps {
  imageGallery: string[];
}

const ImageSection: React.FC<ImageSectionProps> = ({ imageGallery }) => {
  const [selectedImage, setSelectedImage] = useState<string>(imageGallery[0]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const theme = useTheme();

  const imgContainerRef = useRef<HTMLDivElement>(null);

  const slidesToShow = Math.min(3, imageGallery.length);
  const thumbnailWidth =
    imageGallery.length === 1
      ? '30%'
      : imageGallery.length === 2
        ? '60%'
        : '70%';

  const openDialog = () => {
    setIsDialogOpen(true);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  const closeDialog = () => setIsDialogOpen(false);

  // 🖱️ Mouse wheel zoom (desktop)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const newScale = Math.min(
      Math.max(1, scale - e.deltaY * zoomIntensity * 0.01),
      5
    );
    setScale(newScale);
  };

  // 🖱️ Mouse drag (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;
    setLastPosition({ x: e.clientX, y: e.clientY });
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleMouseUp = () => setIsDragging(false);

  // 🤏 Touch events (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const distance = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      );
      setLastDistance(distance);
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [t1, t2] = Array.from(e.touches);
      const distance = Math.hypot(
        t2.clientX - t1.clientX,
        t2.clientY - t1.clientY
      );
      if (lastDistance) {
        const delta = distance - lastDistance;
        const newScale = Math.min(Math.max(1, scale + delta * 0.01), 5);
        setScale(newScale);
      }
      setLastDistance(distance);
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - lastPosition.x;
      const dy = touch.clientY - lastPosition.y;
      setLastPosition({ x: touch.clientX, y: touch.clientY });
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastDistance(null);
  };

  return (
    <Grid item xs={12} sm={6}>
      {/* Main Image */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          aspectRatio: '16/9',
          overflow: 'hidden',
          mx: 'auto',
          cursor: 'pointer',
        }}
        onClick={openDialog}
      >
        <img
          src={selectedImage}
          alt="Selected car"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Thumbnails */}
      <Swiper
        spaceBetween={10}
        slidesPerView={slidesToShow}
        navigation
        loop
        modules={[Navigation]}
        style={{ paddingLeft: '40px', paddingRight: '40px' }}
        breakpoints={{
          1024: { slidesPerView: slidesToShow },
          600: { slidesPerView: Math.min(2, imageGallery.length) },
          480: { slidesPerView: Math.min(1, imageGallery.length) },
        }}
      >
        {imageGallery.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`car image ${index + 1}`}
              style={{
                width: thumbnailWidth,
                height: '100px',
                objectFit: 'cover',
                cursor: 'pointer',
                border: selectedImage === image ? '2px solid red' : 'none',
                margin: 'auto',
              }}
              onClick={() => setSelectedImage(image)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Popup Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="lg">
        <DialogContent
          sx={{
            p: 0,
            position: 'relative',
            overflow: 'hidden',
            touchAction: 'none',
            backgroundColor: '#000',
          }}
        >
          <IconButton
            onClick={closeDialog}
            sx={{
              position: 'absolute',
              top: theme.spacing(1),
              right: theme.spacing(1),
              zIndex: 10,
              color: '#fff',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            ref={imgContainerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            sx={{
              width: '100%',
              height: '90vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          >
            <img
              src={selectedImage}
              alt="Enlarged"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                maxWidth: '100%',
                maxHeight: '90vh',
                userSelect: 'none',
                touchAction: 'none',
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default ImageSection;
