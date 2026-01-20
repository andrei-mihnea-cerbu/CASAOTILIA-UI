import React from 'react';
import { Box, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

interface EmailLinkProps {
  email: string;
}

const EmailLink: React.FC<EmailLinkProps> = ({ email }) => {
  return (
    <Box display="flex" alignItems="center">
      <EmailIcon fontSize="small" sx={{ marginRight: 0.5 }} />
      <Link
        href={`mailto:${email}`}
        color="inherit"
        underline="none"
        variant="body2"
        sx={{
          '&:hover': {
            color: 'primary.main', // Changes color on hover
          },
        }}
      >
        {email}
      </Link>
    </Box>
  );
};

export default EmailLink;
