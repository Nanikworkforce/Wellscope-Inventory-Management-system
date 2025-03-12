import React from 'react';
import { Box, Grid, Paper, Typography, Select, MenuItem } from '@mui/material';
import { 
  Assignment,
  Build,
  PowerSettingsNew,
  BuildCircle,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import bgImage from '../../assets/images/bg.jpg';

const Dashboard: React.FC = () => {
  // Sample data for the line chart
  const usageData = [
    { month: 'Jan', value: 2000 },
    { month: 'Feb', value: 3800 },
    { month: 'Mar', value: 3000 },
    { month: 'Apr', value: 4500 },
    { month: 'May', value: 5000 },
    { month: 'Jun', value: 4000 },
    { month: 'Jul', value: 6000 },
  ];

  const statsCards = [
    { title: 'Require Inspection', value: '25', icon: <Assignment />, color: '#4B5563' },
    { title: 'Require Maintenance', value: '10', icon: <Build />, color: '#4B5563' },
    { title: 'In Operation', value: '33', icon: <PowerSettingsNew />, color: '#EAB308' },
    { title: 'Require Repair', value: '45', icon: <BuildCircle />, color: '#4B5563' },
  ];

  return (
    <Box 
      sx={{ 
        p: 3,
        minHeight: '100vh',
        background: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Typography 
        variant="h4" 
        noWrap 
        component="div" 
        sx={{ 
          flexGrow: 1, 
          mb: 4,
          color: '#d47f39',
          fontWeight: 500
        }}
      >
        Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {statsCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ color: '#d47f39' }}
                  >
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ 
                  color: card.color,
                  '& .MuiSvgIcon-root': {
                    fontSize: '2.5rem'
                  }
                }}>
                  {card.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4}>
        {/* Equipment Utilization */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ color: '#d47f39' }}
              >
                Equipment Utilization
              </Typography>
              <Select 
                defaultValue={2023} 
                size="small"
                sx={{ 
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
              </Select>
            </Box>

            <Box sx={{ position: 'relative', width: 250, height: 250, margin: 'auto' }}>
              <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3.2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="3.2"
                  strokeDasharray={`${35 * 100 / 100} 100`}
                />
              </svg>
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#F97316' }}>
                  35%
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography 
                  sx={{ color: '#d47f39' }}
                >
                  Total Equipment
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>100</Typography>
              </Box>
              <Box>
                <Typography 
                  sx={{ color: '#d47f39' }}
                >
                  Current Value
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>$33,000</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Equipment Usage Trends */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ color: '#d47f39' }}
              >
                Equipment Usage Trends
              </Typography>
              <Select 
                defaultValue="month" 
                size="small"
                sx={{ 
                  bgcolor: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
              </Select>
            </Box>

            <LineChart width={750} height={400} data={usageData}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ r: 4, fill: "#F97316" }}
                activeDot={{ r: 6, fill: "#F97316" }}
              />
            </LineChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 