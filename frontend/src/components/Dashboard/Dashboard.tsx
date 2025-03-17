import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, Select, MenuItem } from '@mui/material';
import { 
  Assignment,
  Build,
  PowerSettingsNew,
  BuildCircle,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import bgImage from '../../assets/images/bg.jpg';
import { API_BASE_URL } from '../../config';
import axios from 'axios';
import Layout from '../Layout/Layout.tsx';

interface DashboardStats {
  require_inspection: number;
  require_maintenance: number;
  in_operation: number;
  require_repair: number;
  total_equipment: number;
  current_value: number;
  utilization_percentage: number;
  usage_trends: { month: string; value: number; }[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('No access token found, redirecting to login');
          window.location.href = '/login';
          return;
        }
        
        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // For now, use mock data since the endpoint might not be ready
        const mockData: DashboardStats = {
          require_inspection: 12,
          require_maintenance: 8,
          in_operation: 45,
          require_repair: 5,
          total_equipment: 70,
          current_value: 1250000,
          utilization_percentage: 35,
          usage_trends: [
            { month: 'Jan', value: 65 },
            { month: 'Feb', value: 59 },
            { month: 'Mar', value: 80 },
            { month: 'Apr', value: 81 },
            { month: 'May', value: 56 },
            { month: 'Jun', value: 55 },
            { month: 'Jul', value: 40 },
          ]
        };
        
        // Try to fetch real data, fall back to mock data
        try {
          const response = await axios.get(`${API_BASE_URL}/dashboard/stats/`);
          setStats(response.data);
        } catch (err) {
          console.log('Using mock data instead');
          setStats(mockData);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    { 
      title: 'Require Inspection', 
      value: stats?.require_inspection || '0', 
      icon: <Assignment />, 
      color: '#4B5563' 
    },
    { 
      title: 'Require Maintenance', 
      value: stats?.require_maintenance || '0', 
      icon: <Build />, 
      color: '#4B5563' 
    },
    { 
      title: 'In Operation', 
      value: stats?.in_operation || '0', 
      icon: <PowerSettingsNew />, 
      color: '#EAB308' 
    },
    { 
      title: 'Require Repair', 
      value: stats?.require_repair || '0', 
      icon: <BuildCircle />, 
      color: '#4B5563' 
    },
  ];

  const dashboardContent = (
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
                  strokeDasharray={`${(stats?.utilization_percentage || 0) * 100 / 100} 100`}
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
                  {stats?.utilization_percentage || 0}%
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
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {stats?.total_equipment || 0}
                </Typography>
              </Box>
              <Box>
                <Typography 
                  sx={{ color: '#d47f39' }}
                >
                  Current Value
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  ${stats?.current_value?.toLocaleString() || '0'}
                </Typography>
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

            <LineChart width={500} height={300} data={stats?.usage_trends || []}>
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

  return <Layout>{dashboardContent}</Layout>;
};

export default Dashboard; 