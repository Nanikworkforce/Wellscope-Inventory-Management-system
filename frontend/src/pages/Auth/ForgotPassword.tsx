import React, { useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_BASE_URL } from '../../config.ts';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    console.log('Sending password reset request to:', `${AUTH_BASE_URL}/request-password-reset/`);
    console.log('With email:', email.toLowerCase().trim());
    
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/request-password-reset/`, 
        { email: email.toLowerCase().trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Password reset request response:', response.data);
      setSuccess(response.data.message || 'Password reset code has been sent to your email.');
      
      // Redirect to reset password page after 2 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email: email.toLowerCase().trim() } });
      }, 2000);
      
    } catch (error) {
      console.error('Password reset request error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        console.log('Error response data:', responseData);
        
        if (typeof responseData === 'object' && responseData !== null) {
          if (responseData.error) {
            setError(responseData.error);
          } else if (responseData.detail) {
            setError(responseData.detail);
          } else if (responseData.Error) {
            setError(responseData.Error);
          } else {
            setError('Failed to send reset code. Please try again.');
          }
        } else {
          setError('Failed to send reset code. Please try again.');
        }
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#F97316' }}>
            Forgot Password
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a code to reset your password.
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
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
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                py: 1.2,
                bgcolor: '#F97316',
                '&:hover': {
                  bgcolor: '#EA580C'
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Code'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Remember your password?{' '}
                <MuiLink component={Link} to="/login" sx={{ color: '#F97316' }}>
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

export default ForgotPassword; 