import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Divider,
  Grid,
  Box,
} from '@mui/material';
import { Equipment } from '../../types';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add,
  Construction,
  Speed,
  Engineering,
  LocalShipping,
  Inventory2,
  Settings,
  Assignment,
  CalendarToday,
  LocationOn,
  Warning,
  CheckCircle,
  PriorityHigh,
  BarChart,
} from '@mui/icons-material';
import bgImage from '../../assets/images/bg.jpg';
import { API_BASE_URL } from '../../config.ts';

const EquipmentList: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/equipment/`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Keep this for debugging
        setEquipment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching equipment');
        console.error('Error fetching equipment:', err);
      }
    };

    fetchEquipment();
  }, []);

  const handleAddNewEquipment = () => {
    navigate('/equipment/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/equipment/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/equipment/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setEquipmentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEquipmentToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!equipmentToDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/equipment/${equipmentToDelete}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete equipment');
      }

      // Remove the deleted item from the state
      setEquipment(prev => prev.filter(item => item.id !== equipmentToDelete));
      setDeleteDialogOpen(false);
      setEquipmentToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete equipment');
      console.error('Error deleting equipment:', err);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const stats = [
    { 
      title: 'Total Equipment',
      value: equipment.length,
      icon: <Inventory2 sx={{ fontSize: 40 }}/>,
      color: '#F97316' 
    },
    { 
      title: 'In Operation',
      value: equipment.filter(eq => eq.status === 'active').length,
      icon: <Engineering sx={{ fontSize: 40 }}/>,
      color: '#F97316' // Orange
    },
    { 
      title: 'Under Maintenance',
      value: equipment.filter(eq => eq.status === 'maintenance').length,
      icon: <Construction sx={{ fontSize: 40 }}/>,
      color: '#F97316' 
    },
    { 
      title: 'Performance',
      value: '87%',
      icon: <Speed sx={{ fontSize: 40 }}/>,
      color: '#F97316' // Blue
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle sx={{ color: '#16A34A' }} />;
      case 'maintenance':
        return <Settings sx={{ color: '#7C3AED' }} />;
      case 'decommissioned':
        return <Warning sx={{ color: '#DC2626' }} />;
      default:
        return <PriorityHigh />;
    }
  };

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
      <Stack spacing={3}>
        {/* Header with Actions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: '#d47f39' }}>
              Equipment Inventory
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
              Manage and monitor your equipment fleet
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={handleAddNewEquipment}
            startIcon={<Add />}
            sx={{ 
              bgcolor: '#d47f39',
              '&:hover': {
                bgcolor: '#c2410c'
              }
            }}
          >
            Add Equipment
          </Button>
        </Stack>

        {/* Statistics Cards */}
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ color: '#d47f39' }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#d47f39' }}>
                        {stat.title}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={70} 
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: `${stat.color}20`,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: stat.color
                        }
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Equipment Table */}
        <TableContainer 
          component={Paper} 
          sx={{ 
            p: 2,
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Equipment Details</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Next Maintenance</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((item) => (
                <TableRow 
                  key={item.id}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(79, 70, 229, 0.04)'
                    }
                  }}
                >
                  <TableCell>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Assignment fontSize="small" sx={{ color: '#4F46E5' }} />
                        <Typography variant="caption" color="text.secondary">
                          SN: {item.serialNumber}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={<Chip sx={{ color: '#d47f39' }} />}
                      label={item.category}
                      variant="outlined"
                      sx={{ 
                        color: '#d47f39',
                        borderColor: '#d47f39'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {getStatusIcon(item.status)}
                      <Typography variant="body2" sx={{ color: '#d47f39' }}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOn sx={{ color: '#d47f39' }} />
                      <Typography variant="body2" sx={{ color: '#d47f39' }}>
                        {item.location?.site || 'N/A'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday fontSize="small" sx={{ color: '#7C3AED' }} />
                      <Typography variant="body2">
                        {item.maintenanceSchedule ? formatDate(item.maintenanceSchedule.nextMaintenance) : 'N/A'}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1}>
                      <Typography variant="body2">
                        {Math.floor(Math.random() * 30) + 70}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={85}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(212, 127, 57, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#d47f39'
                          }
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small" 
                          onClick={() => handleView(item.id)}
                          sx={{ 
                            color: '#d47f39',
                            '&:hover': {
                              bgcolor: 'rgba(212, 127, 57, 0.04)'
                            }
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Equipment">
                        <IconButton 
                          size="small" 
                          onClick={() => handleEdit(item.id)}
                          sx={{ 
                            color: '#d47f39',
                            '&:hover': {
                              bgcolor: 'rgba(212, 127, 57, 0.04)'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Equipment">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(item.id)}
                          sx={{ 
                            color: '#d47f39',
                            '&:hover': {
                              bgcolor: 'rgba(212, 127, 57, 0.04)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this equipment? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleDeleteCancel}
              sx={{ color: '#d47f39' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              sx={{ 
                color: '#fff',
                bgcolor: '#d47f39',
                '&:hover': {
                  bgcolor: '#c2410c'
                }
              }}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default EquipmentList; 