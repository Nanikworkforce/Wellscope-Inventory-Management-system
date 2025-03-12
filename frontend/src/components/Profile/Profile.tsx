import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Stack,
  Divider,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  PhotoCamera,
  Email,
  Phone,
  Work,
  LocationOn,
  Security,
} from '@mui/icons-material';
import manImage from '../../assets/images/man1.jpg';
import bgImage from '../../assets/images/bg.jpg';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
}

const Profile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@nanik.com',
    phone: '+1 234 567 8900',
    position: 'Equipment Manager',
    department: 'Operations',
    location: 'Houston, TX'
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    setShowAlert(true);
    // Here you would typically make an API call to update the profile
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

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
      <Paper sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={manImage}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: '#F97316',
                    '&:hover': { bgcolor: '#EA580C' }
                  }}
                >
                  <PhotoCamera sx={{ color: 'white' }} />
                </IconButton>
              </Box>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {profile.position}
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Profile Stats */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {[
                { icon: <Email sx={{ color: '#F97316' }} />, label: 'Email', value: profile.email },
                { icon: <Phone sx={{ color: '#2563EB' }} />, label: 'Phone', value: profile.phone },
                { icon: <Work sx={{ color: '#7C3AED' }} />, label: 'Department', value: profile.department },
                { icon: <LocationOn sx={{ color: '#16A34A' }} />, label: 'Location', value: profile.location }
              ].map((stat) => (
                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                  <Card>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        {stat.icon}
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {stat.label}
                          </Typography>
                          <Typography variant="body1">
                            {stat.value}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Profile Form */}
          <Grid item xs={12}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Personal Information</Typography>
                <Button
                  variant="contained"
                  startIcon={editing ? <SaveIcon /> : <EditIcon />}
                  onClick={editing ? handleSave : handleEdit}
                  sx={{
                    bgcolor: editing ? '#16A34A' : '#F97316',
                    '&:hover': {
                      bgcolor: editing ? '#15803D' : '#EA580C'
                    }
                  }}
                >
                  {editing ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Position"
                    name="position"
                    value={profile.position}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          {/* Security Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={3}>
              <Typography variant="h6">Security Settings</Typography>
              <Button
                variant="outlined"
                startIcon={<Security />}
                sx={{ 
                  width: 'fit-content',
                  borderColor: '#F97316',
                  color: '#F97316',
                  '&:hover': {
                    borderColor: '#EA580C',
                    bgcolor: 'rgba(249, 115, 22, 0.04)'
                  }
                }}
              >
                Change Password
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile; 