import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { motion } from 'framer-motion';
import { useLoading } from '../../context/LoadingContext';

const MotionBox = motion(Box);

const features = [
  {
    icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
    title: 'Cars',
    description:
      'Iconic models like the Mustang, Camaro, and Charger — all restoration ready.',
    link: '/cars',
  },
  {
    icon: <BuildIcon sx={{ fontSize: 40 }} />,
    title: 'Second-Hand Parts',
    description:
      'From rare finds to essential fixes, our parts are inspected and reliable.',
    link: '/used-car-parts',
  },
  {
    icon: <StorefrontIcon sx={{ fontSize: 40 }} />,
    title: 'Mustang Shop (New Parts)',
    description:
      'Dedicated Mustang-only store with performance and body upgrade parts.',
    link: 'https://retro-mustang.ro/',
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
    title: 'Expert Help',
    description:
      'Can’t find a part? Our team helps you source and select exactly what you need.',
    link: 'https://wa.me/40744586780',
  },
];

const WelcomePage: React.FC = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <>
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '35vh', sm: '40vh' },
          backgroundImage: `url('${import.meta.env.VITE_STATIC_URL}/banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'left',
          color: 'white',
          px: 2,
          overflow: 'hidden',
        }}
      >
        {/* Overlay gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, #001f3f 30%, transparent)',
            zIndex: 1,
          }}
        />
        {/* Text Content */}
        <Box sx={{ zIndex: 3, pl: { xs: 3, sm: 8 }, pr: 2 }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
              }}
              gutterBottom
            >
              Dreams Come True
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                maxWidth: '500px',
              }}
            >
              Buy Your Dream Car Today Starting From €7000!
            </Typography>
          </motion.div>
        </Box>
      </Box>

      {/* About Us Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          padding: { xs: 3, md: 6 },
          alignItems: 'center',
          gap: 4,
        }}
      >
        <MotionBox
          component="img"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          src={`${import.meta.env.VITE_STATIC_URL}/garage.jpg`}
          alt="Garage with Muscle Cars"
          sx={{
            width: { xs: '100%', md: '45%' },
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ flex: 1 }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            About Us
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'justify' }}>
            <strong>AmericanMuscleCars.eu</strong> is your go-to destination in
            Europe for historic American Muscle Cars, new and used parts, built
            specifically for car enthusiasts, hobbyists, and restoration pros
            who see vehicles not just as machines—but as passion projects.
            <br />
            <br />
            Our collection features iconic American muscle like the Ford
            Mustang, Chevrolet Camaro, Dodge Charger, Corvette and more — most
            of which are project cars, ready for restoration or customization.
            <br />
            <br />
            We also offer a wide range of second-hand parts, carefully selected
            and inspected to ensure reliability. From rare components to
            everyday essentials, we help you keep your muscle car running strong
            without breaking the bank.
          </Typography>
        </MotionBox>
      </Box>

      {/* Section Title */}
      <MotionBox
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{ textAlign: 'center', mt: 6 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Explore More with Us
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 600, mx: 'auto', color: '#555' }}
        >
          Dive into our platform and discover resources, restoration services,
          and muscle car passion like never before.
        </Typography>
      </MotionBox>

      {/* Feature Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 4,
          px: { xs: 2, sm: 6 },
          py: 6,
        }}
      >
        {features.map((feature, i) => {
          const isExternal = feature.link.startsWith('http');
          return (
            <MotionBox
              key={i}
              component="a"
              href={feature.link}
              target={isExternal ? '_blank' : '_self'}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              sx={{
                backgroundColor: '#f8f8f8',
                borderRadius: 3,
                padding: 3,
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: 1,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ color: '#bc0c0c', mb: 1 }}>{feature.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {feature.title}
              </Typography>
              <Typography variant="body2">{feature.description}</Typography>
            </MotionBox>
          );
        })}
      </Box>

      {/* Call to Action */}
      <MotionBox
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        sx={{
          py: 6,
          px: 3,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}
        >
          Join the Muscle Car Movement
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 600, mx: 'auto', color: '#555' }}
        >
          Whether you're starting a restoration project or fine-tuning your
          dream ride — we’re here to help.
        </Typography>
        <Box
          component="a"
          href="/contact-us"
          sx={{
            mt: 3,
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#bc0c0c',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: 2,
            textDecoration: 'none',
            transition: 'background 0.3s',
            '&:hover': { backgroundColor: '#8f0000' },
          }}
        >
          Contact Us
        </Box>
      </MotionBox>
    </>
  );
};

export default WelcomePage;
