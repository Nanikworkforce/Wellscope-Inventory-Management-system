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
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import oilBg from '../../assets/images/oilbg.jpg';
import { API_BASE_URL } from '../../config.ts';

interface Client {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/clients/`);
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customers');
        setLoading(false);
        console.error('Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id: number) => {
    setCustomerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/clients/${customerToDelete}/`);
        setCustomers(customers.filter(customer => customer.id !== customerToDelete));
      } catch (err) {
        setError('Failed to delete customer');
      }
    }
    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box 
      sx={{ 
        p: 3,
        minHeight: '100vh',
        background: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${oilBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center"
        >
          <Box>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                color: '#d47f39',
              }}
            >
              Customer Management
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
              Manage your customer relationships
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ 
              bgcolor: '#F97316',
              '&:hover': {
                bgcolor: '#EA580C'
              }
            }}
            onClick={() => navigate('/customers/add')}
          >
            Add Customer
          </Button>
        </Stack>

        {/* Customer Table */}
        <TableContainer 
          component={Paper}
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Company Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Contact Person
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                    Phone
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
              {customers.map((customer) => (
                <TableRow 
                  key={customer.id}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(249, 115, 22, 0.04)'
                    }
                  }}
                >
                  <TableCell>{customer.company_name}</TableCell>
                  <TableCell>{customer.contact_person}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="View Details">
                        <IconButton 
                          size="small"
                          onClick={() => handleView(customer.id)}
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
                      <Tooltip title="Edit Customer">
                        <IconButton 
                          size="small"
                          onClick={() => handleEdit(customer.id)}
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
                      <Tooltip title="Delete Customer">
                        <IconButton 
                          size="small"
                          onClick={() => handleDelete(customer.id)}
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
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#4B5563' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              sx={{ color: '#DC2626' }}
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

export default CustomerList; 