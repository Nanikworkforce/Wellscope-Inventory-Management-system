import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Grid,
  Tooltip,
  IconButton,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Build as BuildIcon,
  Timeline as TimelineIcon,
  LocationOn,
  Category as CategoryIcon,
  CalendarToday,
  AttachMoney,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Equipment } from '../../types';
import bgImage from '../../assets/images/bg.jpg';
import { API_BASE_URL } from '../../config';

const ViewEquipment: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/equipment/${id}/`);
        setEquipment(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch equipment data');
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  console.log('Current state:', { loading, error, equipment });

  if (loading) {
    return (
      <Box 
        sx={{ 
          p: 3,
          minHeight: '100vh',
          background: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress sx={{ color: '#d47f39' }} />
      </Box>
    );
  }
  if (error) {
    console.log('Showing error state:', error);
    return <Alert severity="error">{error}</Alert>;
  }
  if (!equipment) {
    console.log('No equipment data found');
    return <Alert severity="error">Equipment not found</Alert>;
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid Date';
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
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Box>
            <Typography variant="h4" gutterBottom sx={{ color: '#d47f39' }}>
              Equipment Details
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
              View detailed equipment information
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/equipment/edit/${id}`)}
            sx={{ 
              bgcolor: '#d47f39',
              '&:hover': {
                bgcolor: '#c2410c'
              }
            }}
          >
            Edit Equipment
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Main Info Card */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Equipment Name
                      </Typography>
                      <Typography variant="h6">
                        {equipment.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Serial Number
                      </Typography>
                      <Typography variant="body1">
                        {equipment.serialNumber}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Category
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CategoryIcon sx={{ color: '#d47f39' }} />
                        <Typography>{equipment.category}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip 
                        label={equipment.status}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(212, 127, 57, 0.1)',
                          color: '#d47f39'
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationOn sx={{ color: '#d47f39' }} />
                        <Typography>{equipment.location?.site || 'N/A'}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Status Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Condition</Typography>
                  <BuildIcon sx={{ color: '#d47f39' }} />
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={75}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(212, 127, 57, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#d47f39'
                    }
                  }}
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Maintenance</Typography>
                  <TimelineIcon sx={{ color: '#d47f39' }} />
                </Stack>
                <Typography variant="body1">
                  Next Due: {formatDate(equipment.maintenanceSchedule?.nextMaintenance)}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Purchase Info</Typography>
                  <AttachMoney sx={{ color: '#d47f39' }} />
                </Stack>
                <Typography variant="body1">
                  Date: {formatDate(equipment.purchase_date)}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default ViewEquipment; 