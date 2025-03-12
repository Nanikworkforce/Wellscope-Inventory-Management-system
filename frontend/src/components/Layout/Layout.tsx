import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Stack
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Inventory, 
  Business, 
  Timeline, 
  LocationOn, 
  Engineering,
  AttachMoney,
  Dashboard as DashboardIcon,
  Settings,
  Logout,
  Category as CategoryIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import dkLogo from '../../assets/images/dkbg.jpg';
import manImage from '../../assets/images/man1.jpg';

const drawerWidth = 120;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const isDashboard = location.pathname === '/dashboard';

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Equipment Inventory', icon: <Inventory />, path: '/equipment' },
    { text: 'Equipment Category', icon: <CategoryIcon />, path: '/equipment/categories' },
    { text: 'Use Logs', icon: <HistoryIcon />, path: '/equipment/logs' },
    { text: 'Customers', icon: <Business />, path: '/customers' },
    { text: 'Projects Pipeline', icon: <Timeline />, path: '/projects' },
    { text: 'Location Tracking', icon: <LocationOn />, path: '/tracking' },
    { text: 'Maintenance', icon: <Engineering />, path: '/maintenance' },
    { text: 'Financial Reports', icon: <AttachMoney />, path: '/finance' },
  ];

  const handleDrawerToggle = () => {
    if (!isDashboard) {  // Only toggle if not on dashboard
      setOpen(!open);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: '100%',
          ml: 0,
          transition: 'none',
          bgcolor: '#c2410c', // Dark orange from the logo
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          {!isDashboard && (
            <IconButton
              sx={{ 
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={2} 
            sx={{ flexGrow: 1 }}
          >
            <Box
              component="img"
              src={dkLogo}
              alt="DK Logo"
              sx={{ 
                height: 45,
                width: 180,
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </Stack>
          <IconButton
            onClick={handleMenuClick}
            sx={{ p: 0 }}
          >
            <Avatar 
              src={manImage}
              alt="Profile"
              sx={{ 
                width: 40,
                height: 40,
                border: '2px solid white'
              }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', width: '100%', mt: '64px' }}>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 250,
              boxSizing: 'border-box',
              transition: 'width 0.2s',
              overflowX: 'hidden',
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.map((item) => (
                <ListItem 
                  key={item.text} 
                  component={Link} 
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(249, 115, 22, 0.08)', // Light orange background
                      '&:hover': {
                        backgroundColor: 'rgba(249, 115, 22, 0.12)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(249, 115, 22, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname === item.path ? '#F97316' : '#6B7280',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{ 
                      color: location.pathname === item.path ? '#F97316' : '#6B7280',
                      '& .MuiTypography-root': {
                        fontWeight: location.pathname === item.path ? 600 : 400,
                      }
                    }} 
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 0,
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: 'none',
            bgcolor: isDashboard ? '#F3F4F6' : 'inherit',
          }}
        >
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 