import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Grid,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

interface Customer {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

const ViewCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/clients/${id}/`);
        setCustomer(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch customer data');
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  console.log('Current state:', { loading, error, customer });

  if (loading) {
    console.log('Showing loading state');
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
  }
  if (error) {
    console.log('Showing error state:', error);
    return <Alert severity="error">{error}</Alert>;
  }
  if (!customer) {
    console.log('No customer data found');
    return <Alert severity="error">Customer not found</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Tooltip title="Back to List" arrow>
          <IconButton onClick={() => navigate('/customers')}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h4" flex={1}>
          Customer Details
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit Customer" arrow>
            <IconButton 
              color="primary"
              onClick={() => navigate(`/customers/edit/${id}`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer" arrow>
            <IconButton 
              color="error"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this customer?')) {
                  axios.delete(`${API_BASE_URL}/clients/${id}/`)
                    .then(() => navigate('/customers'))
                    .catch(() => setError('Failed to delete customer'));
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
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Company Name
                </Typography>
                <Typography variant="body1">
                  {customer.company_name}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Contact Person
                </Typography>
                <Typography variant="body1">
                  {customer.contact_person}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {customer.email}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {customer.phone}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(customer.created_at).toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {new Date(customer.updated_at).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewCustomer; 