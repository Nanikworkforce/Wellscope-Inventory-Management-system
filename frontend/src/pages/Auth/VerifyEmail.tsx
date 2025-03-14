import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { AUTH_BASE_URL } from '../../config';

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
        const response = await axios.get(`${AUTH_BASE_URL}/verify/?token=${token}`);
        setStatus('success');
        setMessage('Email verified successfully! You can now login.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage('Email verification failed. Please try again or contact support.');
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
    >
      {status === 'verifying' && (
        <>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Verifying your email...
          </Typography>
        </>
      )}
      {(status === 'success' || status === 'error') && (
        <Typography
          variant="h6"
          color={status === 'success' ? 'success.main' : 'error.main'}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default VerifyEmail; 