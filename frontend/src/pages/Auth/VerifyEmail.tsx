import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { AUTH_BASE_URL } from '../../config.ts';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const verifyUrl = `${AUTH_BASE_URL}/verify/verify/?token=${token}`;
        console.log('Verification URL:', verifyUrl);
        
        const response = await axios.get(verifyUrl);
        console.log('Response:', response.data);
        
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully! You can now login.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.error || 'Email verification failed');
        } else {
          setMessage('Email verification failed. Please try again or contact support.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={3}
    >
      {status === 'verifying' && (
        <>
          <CircularProgress sx={{ color: '#F97316' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying your email...
          </Typography>
        </>
      )}
      {(status === 'success' || status === 'error') && (
        <Alert 
          severity={status === 'success' ? 'success' : 'error'}
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default VerifyEmail; 