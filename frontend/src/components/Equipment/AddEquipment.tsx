import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AddEquipment: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    serial_number: '',
    category: '',
    status: 'active',
    condition: 'new',
    purchase_date: '',
    current_location: '',
    next_maintenance_date: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, locationsResponse] = await Promise.all([
          fetch('http://localhost:8000/api/equipment-categories/'),
          fetch('http://localhost:8000/api/locations/')
        ]);

        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
        }
        if (!locationsResponse.ok) {
          throw new Error(`Failed to fetch locations: ${locationsResponse.statusText}`);
        }

        const categoriesData = await categoriesResponse.json();
        const locationsData = await locationsResponse.json();

        console.log('Categories:', categoriesData); // Debug log
        console.log('Locations:', locationsData); // Debug log

        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load form data';
        setError(errorMessage);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

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
      // Format the data to match Django model
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

      console.log('Sending data:', formattedData); // Debug log

      const response = await fetch('http://localhost:8000/api/equipment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData); // Debug log
        throw new Error(errorData.detail || JSON.stringify(errorData));
      }

      const data = await response.json();
      console.log('Success:', data); // Debug log
      navigate('/equipment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add equipment');
      console.error('Error adding equipment:', err);
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
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add New Equipment
        </Typography>

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
                    color: '#F97316',
                    borderColor: '#F97316',
                    '&:hover': {
                      borderColor: '#EA580C',
                      bgcolor: 'rgba(249, 115, 22, 0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  sx={{ 
                    bgcolor: '#F97316',
                    '&:hover': {
                      bgcolor: '#EA580C'
                    }
                  }}
                >
                  Add Equipment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddEquipment; 