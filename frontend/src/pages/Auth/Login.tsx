import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import oilRigImage from '../../assets/images/oil.jpg';
import wsLogo from '../../assets/images/ws1.png';
import { AUTH_BASE_URL } from '../../config.ts';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Correct URL format
      const loginUrl = `${AUTH_BASE_URL}/login/`;
      
      console.log('Login attempt:', {
        url: loginUrl,
        data: {
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        }
      });

      const response = await axios.post(
        loginUrl,
        {
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Login response:', response.data);

      if (response.data.token?.access) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', response.data.token.access);
        localStorage.setItem('refreshToken', response.data.token.refresh);
        
        // Set default Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token.access}`;
        
        console.log('Login successful, tokens stored');
        
        // Check if tokens were properly stored
        const storedAccessToken = localStorage.getItem('accessToken');
        console.log('Stored access token:', storedAccessToken ? 'Present' : 'Missing');
        
        // Use React Router's navigate for client-side navigation
        navigate('/dashboard');
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid login response format');
      }
    } catch (error) {
      console.error('Login error details:', {
        error,
        response: axios.isAxiosError(error) ? error.response : null,
        data: axios.isAxiosError(error) ? error.response?.data : null
      });

      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        console.log('Full error response:', {
          status: error.response.status,
          data: errorData,
          headers: error.response.headers
        });

        let errorMessage = 'Login failed. Please try again.';

        if (typeof errorData === 'object' && errorData !== null) {
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }

        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 400) {
          errorMessage = 'Please provide both email and password';
        }

        setError(errorMessage);
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#1a1f2e',
      color: 'white',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${oilRigImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.15), rgba(0,0,0,0.1))',
        zIndex: 1
      }} />

      <Container maxWidth="md" sx={{
        position: 'relative',
        zIndex: 2,
        px: { xs: 3, sm: 5, md: 8 },
      }}>
        <Box sx={{
          pt: 4,
          pb: 8,
          maxWidth: '600px',
          mx: 'auto'
        }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 6 }}>
            <Box
              component="img"
              src={wsLogo}
              alt="Logo"
              sx={{
                width: 160,
                height: 64,
                borderRadius: '8px',
                objectFit: 'cover'
              }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="inherit"
              sx={{
                mr: 2,
                '&:hover': {
                  color: '#F97316'
                }
              }}
            >
              Sign Up
            </Button>
            <Button
              color="inherit"
              sx={{
                '&:hover': {
                  color: '#F97316'
                }
              }}
            >
              Help
            </Button>
          </Stack>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#F97316',
                mb: 2,
                letterSpacing: 1,
                fontWeight: 600
              }}
            >
              WELCOME BACK
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Login to your account<span style={{ color: '#F97316' }}>.</span>
            </Typography>

            <Typography
              variant="body1"
              sx={{ color: '#9ba1a6' }}
            >
              Don't have an account? <Link
                href="/register"
                sx={{
                  color: '#F97316',
                  fontWeight: 600
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#262b38',
                    color: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#373c4a',
                      borderRadius: '8px',
                    },
                    '&:hover fieldset': { borderColor: '#F97316' },
                  }
                }}
              />

              <TextField
                fullWidth
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#262b38',
                    color: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#373c4a',
                      borderRadius: '8px',
                    },
                    '&:hover fieldset': { borderColor: '#F97316' },
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'white' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    flex: 1,
                    bgcolor: '#262b38',
                    color: 'white',
                    borderColor: '#373c4a',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#2f3545',
                      borderColor: '#F97316'
                    }
                  }}
                >
                  Forgot Password?
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    flex: 1,
                    bgcolor: '#F97316',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#EA580C'
                    }
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
