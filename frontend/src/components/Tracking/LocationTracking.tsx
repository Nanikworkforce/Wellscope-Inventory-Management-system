import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Alert,
  Tooltip,
  LinearProgress,
  Button,
  ButtonGroup,
  Divider,
  DialogActions,
} from '@mui/material';
import {
  LocationOn,
  Warning,
  GpsFixed,
  Edit,
  History,
  QrCode,
  Timeline,
  NotificationsActive,
  MyLocation,
  Map,
  FilterAlt,
  Search,
  Refresh,
} from '@mui/icons-material';
import bgImage from '../../assets/images/bg.jpg';

interface EquipmentLocation {
  id: string;
  name: string;
  serialNumber: string;
  rfidTag: string;
  status: 'active' | 'in-transit' | 'maintenance' | 'decommissioned';
  currentLocation: {
    site: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    lastUpdated: Date;
    isInGeofence: boolean;
    trackingMethod: 'GPS' | 'Manual';
  };
  lifecycle: {
    purchaseDate: Date;
    commissionDate: Date;
    totalOperatingHours: number;
    maintenanceCount: number;
    expectedLifespan: number; // in years
    decommissionDate?: Date;
  };
  movements: {
    date: Date;
    from: string;
    to: string;
    status: 'completed' | 'in-transit';
  }[];
}

const LocationTracking: React.FC = () => {
  const [equipment, setEquipment] = useState<EquipmentLocation[]>([]);
  const [alerts, setAlerts] = useState<{ id: string; message: string; type: 'warning' | 'error' }[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchEquipmentLocations = async () => {
      const mockData: EquipmentLocation[] = [
        {
          id: 'DR001',
          name: 'Drilling Rig A',
          serialNumber: 'SN-2024-001',
          rfidTag: 'RFID-001',
          status: 'active',
          currentLocation: {
            site: 'North Sea Platform Alpha',
            coordinates: {
              latitude: 56.0000,
              longitude: 3.0000,
            },
            lastUpdated: new Date(),
            isInGeofence: true,
            trackingMethod: 'GPS',
          },
          lifecycle: {
            purchaseDate: new Date('2023-01-15'),
            commissionDate: new Date('2023-02-01'),
            totalOperatingHours: 8760,
            maintenanceCount: 4,
            expectedLifespan: 10,
          },
          movements: [
            {
              date: new Date('2024-01-15'),
              from: 'Storage Facility',
              to: 'North Sea Platform Alpha',
              status: 'completed',
            },
          ],
        },
        // Add more equipment...
      ];
      setEquipment(mockData);

      // Simulate some alerts
      setAlerts([
        {
          id: 'DR002',
          message: 'Equipment has left designated geofence',
          type: 'warning',
        },
        {
          id: 'DR003',
          message: 'GPS signal lost - switched to manual tracking',
          type: 'error',
        },
      ]);
    };

    fetchEquipmentLocations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'in-transit':
        return 'warning';
      case 'maintenance':
        return 'info';
      case 'decommissioned':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateLifecycleProgress = (equipment: EquipmentLocation) => {
    const totalDays = equipment.lifecycle.expectedLifespan * 365;
    const daysSinceCommission = Math.floor(
      (new Date().getTime() - equipment.lifecycle.commissionDate.getTime()) / (1000 * 3600 * 24)
    );
    return Math.min((daysSinceCommission / totalDays) * 100, 100);
  };

  const stats = [
    { title: 'Total Equipment', value: equipment.length, color: '#F97316' },
    { title: 'In Transit', value: '12', color: '#EAB308' },
    { title: 'Outside Geofence', value: '3', color: '#DC2626' },
    { title: 'GPS Active', value: '45', color: '#16A34A' },
  ];

  return (
    <Box 
      sx={{ 
        p: 3,
        minHeight: '100vh',
        background: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#d47f39' }}>
            Equipment Location Tracking
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
            Real-time monitoring and location management
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <ButtonGroup variant="outlined">
            <Button startIcon={<Map />}>Map View</Button>
            <Button startIcon={<FilterAlt />}>Filter</Button>
            <Button startIcon={<Search />}>Search</Button>
          </ButtonGroup>
          <Button 
            startIcon={<Refresh />}
            sx={{ 
              bgcolor: '#F97316',
              color: 'white',
              '&:hover': { bgcolor: '#EA580C' }
            }}
          >
            Refresh Data
          </Button>
        </Stack>
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ color: '#d47f39' }}>
                    {/* Assuming you have an icon component here */}
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#d47f39' }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alerts Section with improved styling */}
      {alerts.length > 0 && (
        <Paper sx={{ p: 2, bgcolor: '#FEF2F2' }}>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ color: '#991B1B', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Warning /> Active Alerts
            </Typography>
            <Divider />
            <Grid container spacing={2}>
              {alerts.map((alert) => (
                <Grid item xs={12} md={6} key={alert.id}>
                  <Alert
                    severity={alert.type}
                    sx={{ 
                      '& .MuiAlert-icon': { fontSize: '1.5rem' },
                      boxShadow: 1
                    }}
                    action={
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" color="inherit">
                          <MyLocation />
                        </IconButton>
                        <IconButton size="small" color="inherit">
                          <NotificationsActive />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <Typography variant="subtitle2">{alert.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Equipment ID: {alert.id} | Last Updated: {new Date().toLocaleTimeString()}
                    </Typography>
                  </Alert>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Paper>
      )}

      {/* Equipment Table with enhanced styling */}
      <TableContainer component={Paper} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Equipment Details
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Current Location
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Status
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Lifecycle Progress
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Last Movement
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Tracking Info
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipment.map((item) => (
              <TableRow 
                key={item.id}
                hover
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(249, 115, 22, 0.04)'
                  }
                }}
              >
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <QrCode fontSize="small" sx={{ color: '#d47f39' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOn sx={{ color: '#d47f39' }} />
                    <Typography variant="body2" sx={{ color: '#d47f39' }}>{item.currentLocation.site}</Typography>
                  </Stack>
                  <Typography variant="caption" color="textSecondary">
                    {item.currentLocation.coordinates.latitude.toFixed(4)}, 
                    {item.currentLocation.coordinates.longitude.toFixed(4)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(212, 127, 57, 0.1)',
                        color: '#d47f39'
                      }}
                    />
                    <Chip
                      label={item.currentLocation.isInGeofence ? 'In Geofence' : 'Outside Geofence'}
                      size="small"
                      color={item.currentLocation.isInGeofence ? 'success' : 'error'}
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      {calculateLifecycleProgress(item).toFixed(1)}% of lifecycle
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Operating Hours: {item.lifecycle.totalOperatingHours}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  {item.movements[0] && (
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        {item.movements[0].from} → {item.movements[0].to}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.movements[0].date.toLocaleDateString()}
                      </Typography>
                    </Stack>
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      icon={<GpsFixed />}
                      label={item.currentLocation.trackingMethod}
                      size="small"
                      color={item.currentLocation.trackingMethod === 'GPS' ? 'success' : 'warning'}
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: '#d47f39',
                          '&:hover': {
                            bgcolor: 'rgba(212, 127, 57, 0.04)'
                          }
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Track History">
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: '#d47f39',
                          '&:hover': {
                            bgcolor: 'rgba(212, 127, 57, 0.04)'
                          }
                        }}
                      >
                        <History />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Lifecycle Timeline">
                      <IconButton 
                        size="small"
                        sx={{ 
                          color: '#d47f39',
                          '&:hover': {
                            bgcolor: 'rgba(212, 127, 57, 0.04)'
                          }
                        }}
                      >
                        <Timeline />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LocationTracking; 