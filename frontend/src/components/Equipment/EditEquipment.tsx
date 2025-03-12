import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import bgImage from '../../assets/images/bg.jpg';

interface Category {
  id: number;
  name: string;
}

interface Location {
  id: number;
  site: string;
  latitude?: number;
  longitude?: number;
}

const EditEquipment: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    serial_number: '',
    category: '',
    status: '',
    condition: '',
    purchase_date: '',
    current_location: '',
    next_maintenance_date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentResponse, categoriesResponse, locationsResponse] = await Promise.all([
          fetch(`http://localhost:8000/api/equipment/${id}/`),
          fetch('http://localhost:8000/api/equipment-categories/'),
          fetch('http://localhost:8000/api/locations/')
        ]);

        if (!equipmentResponse.ok) {
          throw new Error(`Failed to fetch equipment: ${equipmentResponse.statusText}`);
        }
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
        }
        if (!locationsResponse.ok) {
          throw new Error(`Failed to fetch locations: ${locationsResponse.statusText}`);
        }

        const [equipmentData, categoriesData, locationsData] = await Promise.all([
          equipmentResponse.json(),
          categoriesResponse.json(),
          locationsResponse.json()
        ]);

        console.log('Equipment:', equipmentData);
        console.log('Categories:', categoriesData);
        console.log('Locations:', locationsData);

        setFormData({
          name: equipmentData.name || '',
          serial_number: equipmentData.serialNumber || '',
          category: equipmentData.category?.id || '',
          status: equipmentData.status || '',
          condition: equipmentData.condition || '',
          purchase_date: equipmentData.purchase_date || '',
          current_location: equipmentData.current_location || '',
          next_maintenance_date: equipmentData.next_maintenance_date || '',
        });

        setCategories(categoriesData);
        setLocations(locationsData);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedData = {
        name: formData.name,
        serial_number: formData.serial_number,
        category: formData.category || null,
        status: formData.status,
        condition: formData.condition,
        purchase_date: formData.purchase_date,
        current_location: formData.current_location || null,
        next_maintenance_date: formData.next_maintenance_date || null
      };

      console.log('Sending data:', formattedData);

      const response = await fetch(`http://localhost:8000/api/equipment/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.detail || JSON.stringify(errorData));
      }

      const data = await response.json();
      console.log('Success:', data);
      navigate('/equipment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update equipment');
      console.error('Error updating equipment:', err);
    }
  };

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
      <Stack spacing={3} sx={{ maxWidth: 800, margin: '0 auto' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#d47f39' }}>
            Edit Equipment
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
            Update equipment information
          </Typography>
        </Box>

        <Paper sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="name"
                  label="Equipment Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="serial_number"
                  label="Serial Number"
                  value={formData.serial_number}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="decommissioned">Decommissioned</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Condition</InputLabel>
                  <Select
                    name="condition"
                    value={formData.condition}
                    label="Condition"
                    onChange={handleChange}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="good">Good</MenuItem>
                    <MenuItem value="worn">Worn</MenuItem>
                    <MenuItem value="damaged">Damaged</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="date"
                  name="purchase_date"
                  label="Purchase Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.purchase_date}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    name="current_location"
                    value={formData.current_location}
                    label="Location"
                    onChange={handleChange}
                  >
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.id}>
                        {location.site}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="next_maintenance_date"
                  label="Next Maintenance Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.next_maintenance_date}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/equipment')}
                    sx={{ 
                      color: '#d47f39',
                      borderColor: '#d47f39',
                      '&:hover': {
                        borderColor: '#c2410c',
                        bgcolor: 'rgba(212, 127, 57, 0.04)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    sx={{ 
                      bgcolor: '#d47f39',
                      '&:hover': {
                        bgcolor: '#c2410c'
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Stack>
    </Box>
  );
};

export default EditEquipment; 