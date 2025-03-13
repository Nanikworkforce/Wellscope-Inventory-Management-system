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
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

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
}

interface Client {
  id: number;
  company_name: string;
}

interface Location {
  id: number;
  site: string;
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

const EditProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
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
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, clientsRes, locationsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/projects/${id}/`),
          axios.get(`${API_BASE_URL}/clients/`),
          axios.get(`${API_BASE_URL}/locations/`),
        ]);

        setFormData({
          name: projectRes.data.name,
          description: projectRes.data.description,
          project_code: projectRes.data.project_code,
          client: projectRes.data.client?.id || null,
          location: projectRes.data.location?.id || null,
          start_date: projectRes.data.start_date,
          end_date: projectRes.data.end_date || '',
          status: projectRes.data.status,
          priority: projectRes.data.priority,
          progress: projectRes.data.progress,
          project_manager: projectRes.data.project_manager,
        });

        setClients(clientsRes.data);
        setLocations(locationsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch project data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      await axios.put(`${API_BASE_URL}/projects/${id}/`, formData);
      navigate('/projects');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Failed to update project');
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Project
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
                  <TextField {...params} label="Client" />
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
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/projects')}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProject; 