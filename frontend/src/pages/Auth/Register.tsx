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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import oilRigImage from '../../assets/images/oil.jpg';
import wsLogo from '../../assets/images/ws1.png';
import { AUTH_BASE_URL } from '../../config.ts';

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RegisterFormData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/register/`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password
        }
      );
      
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        const errorMessage = errorData.Error 
          || errorData.error
          || errorData.message 
          || errorData.detail 
          || 'Registration failed';
        setError(errorMessage);
      } else {
        setError('Registration failed. Please try again.');
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
        px: { xs: 3, sm: 5, md: 8 }, // Increase horizontal padding
      }}>
        <Box sx={{ 
          pt: 4, 
          pb: 8,
          maxWidth: '600px', // Set a max-width for the form content
          mx: 'auto' // Center the content
        }}>
          {/* Logo and Nav */}
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
                  color: '#d47f39'
                }
              }}
            >
              Sign In
            </Button>
            <Button 
              color="inherit"
              sx={{ 
                '&:hover': {
                  color: '#d47f39'
                }
              }}
            >
              Help
            </Button>
          </Stack>

          {/* Main Content */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#d47f39',
                mb: 2,
                letterSpacing: 1,
                fontWeight: 600
              }}
            >
              START FOR FREE
            </Typography>
            
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                color: 'white'  // Changed from #d47f39 back to white
              }}
            >
              Create new account<span style={{ color: '#d47f39' }}>.</span>
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ color: '#9ba1a6' }}
            >
              Already A Member? <Link 
                href="/login" 
                sx={{ 
                  color: '#d47f39',
                  fontWeight: 600
                }}
              >
                Log In
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
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  placeholder="First name"
                  name="first_name"
                  value={formData.first_name}
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
                      '&:hover fieldset': { borderColor: '#d47f39' },
                    }
                  }}
                />
                <TextField
                  fullWidth
                  placeholder="Last name"
                  name="last_name"
                  value={formData.last_name}
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
                      '&:hover fieldset': { borderColor: '#d47f39' },
                    }
                  }}
                />
              </Stack>

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
                    '&:hover fieldset': { borderColor: '#d47f39' },
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
                    '&:hover fieldset': { borderColor: '#d47f39' },
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

              <TextField
                fullWidth
                placeholder="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                error={formData.password !== formData.confirm_password && formData.confirm_password !== ''}
                helperText={
                  formData.password !== formData.confirm_password && formData.confirm_password !== '' 
                    ? 'Passwords do not match' 
                    : ''
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#262b38',
                    color: 'white',
                    borderRadius: '8px',
                    '& fieldset': { 
                      borderColor: '#373c4a',
                      borderRadius: '8px',
                    },
                    '&:hover fieldset': { borderColor: '#d47f39' },
                  },
                  '& .MuiFormHelperText-root': {
                    color: theme.palette.error.main
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
                      borderColor: '#d47f39'
                    }
                  }}
                >
                  Change method
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    flex: 1,
                    bgcolor: '#d47f39',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: '#c2410c'
                    }
                  }}
                >
                  Create account
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Register; 