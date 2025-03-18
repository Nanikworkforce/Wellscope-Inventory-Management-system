import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress, Container } from '@mui/material';
import axios from 'axios';
import { AUTH_BASE_URL } from '../../config.ts';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setVerificationStatus('error');
        setMessage('Verification token is missing.');
        return;
      }
      
      try {
        const response = await axios.post(`${AUTH_BASE_URL}/verify-email/`, { token });
        console.log('Verification response:', response.data);
        
        setVerificationStatus('success');
        setMessage(response.data.message || 'Your email has been successfully verified.');
        
        // Clear any existing tokens to ensure a fresh login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
        
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.error || 'Email verification failed. Please try again.');
        } else {
          setMessage('An unexpected error occurred. Please try again later.');
        }
      }
    };
    
    verifyEmail();
  }, [searchParams]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {verificationStatus === 'loading' && (
            <>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Verifying your email...
              </Typography>
            </>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <Typography variant="h5" color="primary" gutterBottom>
                Email Verified!
              </Typography>
              <Typography variant="body1" align="center" paragraph>
                {message}
              </Typography>
              <Typography variant="body2" align="center" paragraph>
                You will be redirected to the login page in a few seconds...
              </Typography>
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <Typography variant="h5" color="error" gutterBottom>
                Verification Failed
              </Typography>
              <Typography variant="body1" align="center" paragraph>
                {message}
              </Typography>
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                color="primary"
                sx={{ mt: 2 }}
              >
                Go to Login
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyEmail; 