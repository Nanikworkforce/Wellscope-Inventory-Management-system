import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Stack,
  LinearProgress,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Engineering,
  Schedule,
  LocationOn,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/images/bg.jpg';
import { API_BASE_URL } from '../../config.ts';
import { useAuth } from '../../pages/Auth/AuthContext.tsx';

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
  budget: number;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        if (!token) {
          setError('Authentication token not found');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/projects/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch projects', err);
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, [getToken]);

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

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'success';
    if (progress >= 25) return 'primary';
    return 'warning';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDelete = (id: number) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        const token = getToken();
        
        if (!token) {
          setError('Authentication token not found');
          return;
        }
        
        await axios.delete(`${API_BASE_URL}/projects/${projectToDelete}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProjects(projects.filter(project => project.id !== projectToDelete));
        setDeleteDialogOpen(false);
        setProjectToDelete(null);
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

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
        <Typography variant="h4" gutterBottom sx={{ color: '#d47f39' }}>
          Projects
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
          Manage your ongoing projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ 
            bgcolor: '#F97316',
            '&:hover': {
              bgcolor: '#EA580C'
            }
          }}
          onClick={() => navigate('/projects/add')}
        >
          New Project
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Project Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Customer
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Timeline
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Location
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Status & Progress
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Equipment Assigned
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
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' }
                    }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    {project.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {project.project_code}
                  </Typography>
                </TableCell>
                <TableCell>{project.client?.company_name || 'N/A'}</TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="textSecondary">
                      Start: {formatDate(project.start_date)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      End: {formatDate(project.end_date)}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOn color="action" fontSize="small" />
                    <Typography variant="body2">{project.location?.site || 'N/A'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Chip
                      label={project.status}
                      size="small"
                      color={getStatusColor(project.status)}
                    />
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        color={getProgressColor(project.progress)}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {project.progress}% Complete
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    {project.equipment.map((eq) => (
                      <Tooltip key={eq.id} title={eq.name}>
                        <Chip
                          icon={<Engineering />}
                          label={eq.serialNumber}
                          size="small"
                          variant="outlined"
                        />
                      </Tooltip>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small"
                        onClick={() => navigate(`/projects/${project.id}`)}
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
                    <Tooltip title="Edit Project">
                      <IconButton 
                        size="small"
                        onClick={() => navigate(`/projects/edit/${project.id}`)}
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
                    <Tooltip title="Delete Project">
                      <IconButton 
                        size="small"
                        onClick={() => handleDelete(project.id)}
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

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectList; 