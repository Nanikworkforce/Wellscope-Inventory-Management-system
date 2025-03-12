import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Grid,
  MenuItem,
  Autocomplete,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bgImage from '../../assets/images/bg.jpg';

interface ProjectFormData {
  name: string;
  description: string;
  project_code: string;
  client: number | null;
  location: number | null;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  progress: number;
  project_manager: string;
  equipment: number[];
}

interface Client {
  id: number;
  company_name: string;
}

interface Location {
  id: number;
  site: string;
}

interface Equipment {
  id: number;
  name: string;
  serialNumber: string;
  status: string;
}

const PROJECT_STATUS = [
  { value: 'planning', label: 'Planning Phase' },
  { value: 'pending', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    project_code: '',
    client: null,
    location: null,
    start_date: '',
    end_date: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    project_manager: '',
    equipment: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, locationsRes, equipmentRes] = await Promise.all([
          axios.get('http://localhost:8000/api/clients/'),
          axios.get('http://localhost:8000/api/locations/'),
          axios.get('http://localhost:8000/api/equipment/'),
        ]);

        setClients(clientsRes.data);
        setLocations(locationsRes.data);
        setEquipment(equipmentRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch required data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const projectResponse = await axios.post('http://localhost:8000/api/projects/', {
        ...formData,
        client_id: formData.client,
        location_id: formData.location,
        equipment: selectedEquipment.map(eq => eq.id)
      });

      // If we get here, the project was created successfully
      navigate('/projects');
    } catch (err) {
      console.error('Error creating project:', err);
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        if (errorData.non_field_errors) {
          // Show warning about equipment assignment but don't block navigation
          console.warn('Equipment assignment warning:', errorData.non_field_errors);
          // Still navigate since project was created
          navigate('/projects');
        } else {
          // Other errors that might prevent project creation
          setError(`Failed to create project: ${JSON.stringify(errorData, null, 2)}`);
        }
      } else {
        setError('Failed to create project');
      }
    }
  };

  // Add this function to check if equipment is available
  const isEquipmentAvailable = (equipment: Equipment) => {
    // You could add additional checks here
    return true;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;

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
      <Typography variant="h4" gutterBottom>
        Create New Project
      </Typography>

      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Project Code"
                name="project_code"
                value={formData.project_code}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.company_name}
                value={clients.find(c => c.id === formData.client) || null}
                onChange={(_, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    client: newValue?.id || null
                  }));
                }}
                renderInput={(params) => (
                  <TextField 
                    {...params} 
                    label="Client" 
                    required 
                    error={!formData.client}
                    helperText={!formData.client ? "Client is required" : ""}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={locations}
                getOptionLabel={(option) => option.site}
                value={locations.find(l => l.id === formData.location) || null}
                onChange={(_, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    location: newValue?.id || null
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Location" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Start Date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {PROJECT_STATUS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                required
                fullWidth
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITY_LEVELS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Progress (%)"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Project Manager"
                name="project_manager"
                value={formData.project_manager}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={equipment.filter(isEquipmentAvailable)}
                getOptionLabel={(option) => `${option.name} (${option.serialNumber})`}
                value={selectedEquipment}
                onChange={(_, newValue) => {
                  setSelectedEquipment(newValue);
                }}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Stack>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        SN: {option.serialNumber} - Status: {option.status}
                      </Typography>
                    </Stack>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign Equipment"
                    placeholder="Select equipment"
                  />
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((equipment, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={equipment.id}
                      label={`${equipment.name} (${equipment.serialNumber})`}
                      size="small"
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/projects')}
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
                  Create Project
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProject; 