import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  CircularProgress,
  Alert,
  Link as MuiLink
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AUTH_BASE_URL } from '../../config.ts';

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    new_password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state if available
    if (location.state && location.state.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.code.trim()) {
      newErrors.code = 'Reset code is required';
    } else if (formData.code.length !== 6) {
      newErrors.code = 'Reset code must be 6 digits';
    }
    
    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    }
    
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setServerError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/password-reset/`, 
        {
          email: formData.email.toLowerCase().trim(),
          code: formData.code,
          new_password: formData.new_password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Password reset response:', response.data);
      setSuccess(response.data.message || 'Password has been reset successfully.');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        
        if (typeof responseData === 'object' && responseData !== null) {
          if (responseData.error) {
            setServerError(responseData.error);
          } else if (responseData.detail) {
            setServerError(responseData.detail);
          } else if (responseData.new_password) {
            setErrors({
              ...errors,
              new_password: Array.isArray(responseData.new_password) 
                ? responseData.new_password[0] 
                : responseData.new_password
            });
          } else {
            setServerError('Failed to reset password. Please try again.');
          }
        } else {
          setServerError('Failed to reset password. Please try again.');
        }
      } else {
        setServerError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#A0ADA8' }}>
            Reset Password
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Enter the 6-digit code sent to your email and create a new password.
          </Typography>
          
          {serverError && (
            <Alert severity="error" sx={{ mb: 2, color: '#A0ADA8' }}>
              {serverError}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={!!location.state?.email}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="6-Digit Reset Code"
              name="code"
              autoComplete="off"
              value={formData.code}
              onChange={handleChange}
              error={!!errors.code}
              helperText={errors.code}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="new_password"
              label="New Password"
              type="password"
              id="new_password"
              autoComplete="new-password"
              value={formData.new_password}
              onChange={handleChange}
              error={!!errors.new_password}
              helperText={errors.new_password || 'Password must be at least 8 characters'}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm_password"
              label="Confirm New Password"
              type="password"
              id="confirm_password"
              autoComplete="new-password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.2,
                bgcolor: '#A0ADA8',
                '&:hover': {
                  bgcolor: '#A0ADA8'
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Remember your password?{' '}
                <MuiLink component={Link} to="/login" sx={{ color: '#A0ADA8' }}>
                  Back to Login
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword; 