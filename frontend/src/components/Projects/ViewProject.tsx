import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Engineering,
  LocationOn,
  Schedule,
  Person,
  Business,
  Description,
  Flag,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Project {
  id: number;
  name: string;
  description: string;
  client: {
    id: number;
    company_name: string;
  };
  project_code: string;
  start_date: string;
  end_date: string | null;
  location: {
    id: number;
    site: string;
  } | null;
  status: string;
  priority: string;
  progress: number;
  project_manager: string;
  equipment: Array<{
    id: number;
    name: string;
    serialNumber: string;
  }>;
}

const ViewProject: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/projects/${id}/`);
        setProject(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to fetch project data');
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'success';
      case 'planning':
        return 'info';
      case 'completed':
        return 'default';
      case 'on_hold':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!project) return <Alert severity="error">Project not found</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Tooltip title="Back to List" arrow>
          <IconButton onClick={() => navigate('/projects')}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" flex={1}>
          Project Details
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Project" arrow>
            <IconButton 
              color="primary"
              onClick={() => navigate(`/projects/edit/${id}`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Project" arrow>
            <IconButton 
              color="error"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this project?')) {
                  axios.delete(`http://localhost:8000/api/projects/${id}/`)
                    .then(() => navigate('/projects'))
                    .catch(() => setError('Failed to delete project'));
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h5">{project.name}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                ({project.project_code})
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Chip
                label={project.status}
                color={getStatusColor(project.status)}
              />
              <Chip
                icon={<Flag />}
                label={project.priority}
                color={getPriorityColor(project.priority)}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ width: '100%', mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={project.progress}
                sx={{ height: 8, borderRadius: 5 }}
              />
              <Typography variant="body2" color="textSecondary" align="right" sx={{ mt: 1 }}>
                {project.progress}% Complete
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Business color="action" />
                  <Typography variant="subtitle2">Client</Typography>
                </Stack>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {project.client?.company_name || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Person color="action" />
                  <Typography variant="subtitle2">Project Manager</Typography>
                </Stack>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {project.project_manager}
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOn color="action" />
                  <Typography variant="subtitle2">Location</Typography>
                </Stack>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {project.location?.site || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Schedule color="action" />
                  <Typography variant="subtitle2">Timeline</Typography>
                </Stack>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Start Date: {formatDate(project.start_date)}
                  </Typography>
                  <Typography variant="body2">
                    End Date: {formatDate(project.end_date)}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Description color="action" />
                  <Typography variant="subtitle2">Description</Typography>
                </Stack>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {project.description || 'No description provided'}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Engineering color="action" />
                <Typography variant="subtitle2">Assigned Equipment</Typography>
              </Stack>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {project.equipment.map((eq) => (
                  <Tooltip key={eq.id} title={eq.name} arrow>
                    <Chip
                      icon={<Engineering />}
                      label={eq.serialNumber}
                      variant="outlined"
                      onClick={() => navigate(`/equipment/${eq.id}`)}
                    />
                  </Tooltip>
                ))}
                {project.equipment.length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                    No equipment assigned
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewProject; 