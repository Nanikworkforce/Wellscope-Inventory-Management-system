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
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Alert,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Build as BuildIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import axios from 'axios';
import bgImage from '../../assets/images/bg.jpg';
import { API_BASE_URL } from '../../config';

interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

const EquipmentCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/equipment-categories/`);
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpen = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setOpen(true);
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setEditingCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/equipment-categories/${editingCategory.id}/`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/equipment-categories/`, formData);
      }
      fetchCategories();
      handleClose();
    } catch (err) {
      setError('Failed to save category');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_BASE_URL}/equipment-categories/${id}/`);
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category');
      }
    }
  };

  // Mock data for statistics
  const categoryStats = [
    {
      title: 'Total Categories',
      value: categories.length,
      icon: <CategoryIcon sx={{ fontSize: 40 }}/>,
      color: '#F97316'
    },
    {
      title: 'Total Equipment',
      value: '156',
      icon: <InventoryIcon sx={{ fontSize: 40 }}/>,
      color: '#2563EB'
    },
    {
      title: 'Active Equipment',
      value: '89',
      icon: <BuildIcon sx={{ fontSize: 40 }}/>,
      color: '#16A34A'
    },
    {
      title: 'Categories in Use',
      value: `${categories.length > 0 ? Math.floor((categories.length * 0.8)) : 0}`,
      icon: <TimelineIcon sx={{ fontSize: 40 }}/>,
      color: '#9333EA'
    }
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
            Equipment Categories
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
            Manage and organize your equipment inventory by categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ 
            bgcolor: '#d47f39',
            '&:hover': {
              bgcolor: '#c2410c'
            }
          }}
        >
          Add Category
        </Button>
      </Stack>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {categoryStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
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

      <Paper 
        sx={{ 
          p: 3, 
          mb: 4,
          bgcolor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Category Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Description
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Equipment Count
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Usage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Created At
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
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CategoryIcon sx={{ color: '#d47f39' }} />
                      <Typography variant="subtitle2">{category.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${Math.floor(Math.random() * 30)} items`}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(212, 127, 57, 0.1)',
                        color: '#d47f39'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ width: '200px' }}>
                    <Stack spacing={1}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.random() * 100} 
                        sx={{
                          mb: 2,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(212, 127, 57, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#d47f39'
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Last used: {new Date().toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        {new Date(category.created_at!).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(category.created_at!).toLocaleTimeString()}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit Category">
                        <IconButton 
                          size="small"
                          onClick={() => handleEdit(category)}
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
                      <Tooltip title="Delete Category">
                        <IconButton 
                          size="small"
                          onClick={() => handleDelete(category.id)}
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
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleClose}
              sx={{ color: '#d47f39' }}
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
              {editingCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EquipmentCategory; 