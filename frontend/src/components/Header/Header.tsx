import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import vaLogo from '../../assets/images/Heading.png'; // Ensure this path is correct

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'black' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box
          component="img"
          src={vaLogo}
          alt="VA Logo"
          sx={{ height: 40, width: 100, objectFit: 'cover' }}
        />
        <Box>
          <Button
            component={RouterLink}
            to="/signup"
            sx={{ color: '#FFFFFF', textTransform: 'none', marginRight: 2 }}
          >
            Sign Up
          </Button>
          <Button
            component={RouterLink}
            to="/help"
            sx={{ color: '#FFFFFF', textTransform: 'none' }}
          >
            Help
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 