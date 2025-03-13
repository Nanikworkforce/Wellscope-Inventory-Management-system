import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  ButtonGroup,
  Tooltip,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  AttachMoney,
  TrendingDown,
  Build,
  PieChart as PieChartIcon,
  Download,
  CalendarToday,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import bgImage from '../../assets/images/bg.jpg';
import { API_BASE_URL } from '../../config';
import axios from 'axios';

interface FinancialData {
  equipment: {
    id: string;
    name: string;
    purchaseValue: number;
    currentValue: number;
    depreciationRate: number;
    maintenanceCosts: number;
    operatingCosts: number;
    monthlyDepreciation: { month: string; value: number }[];
  }[];
  totalAssets: number;
  totalDepreciation: number;
  totalMaintenance: number;
  totalOperating: number;
  monthlyExpenses: { month: string; maintenance: number; operating: number; depreciation: number }[];
  expenseDistribution: { category: string; value: number }[];
}

const FinancialReports: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    equipment: [],
    totalAssets: 0,
    totalDepreciation: 0,
    totalMaintenance: 0,
    totalOperating: 0,
    monthlyExpenses: [],
    expenseDistribution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/finance/reports/`);
        setFinancialData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch financial data');
        setLoading(false);
        console.error('Error fetching financial data:', err);
      }
    };

    fetchFinancialData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const summaryStats = [
    {
      title: 'Total Asset Value',
      value: formatCurrency(financialData.totalAssets),
      trend: '+5.2%',
      trendUp: true,
      icon: <AttachMoney />,
      color: '#2196f3',
    },
    {
      title: 'Total Depreciation',
      value: formatCurrency(financialData.totalDepreciation),
      trend: '-2.1%',
      trendUp: false,
      icon: <TrendingDown />,
      color: '#f44336',
    },
    {
      title: 'Maintenance Expenses',
      value: formatCurrency(financialData.totalMaintenance),
      trend: '+1.8%',
      trendUp: true,
      icon: <Build />,
      color: '#ff9800',
    },
    {
      title: 'Operating Efficiency',
      value: '92%',
      trend: '+3.4%',
      trendUp: true,
      icon: <PieChartIcon />,
      color: '#4caf50',
    },
  ];

  const generatePDF = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/finance/reports/pdf/`, {
        responseType: 'blob'
      });
      
      // Create a blob from the PDF Stream
      const file = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a link element and trigger download
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `financial-report-${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to client-side PDF generation if API fails
      generateClientPDF();
    }
  };

  const generateClientPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Financial Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    // Add summary section
    doc.setFontSize(16);
    doc.text('Summary Statistics', 14, 45);
    
    const summaryData = [
      ['Total Asset Value', formatCurrency(financialData.totalAssets)],
      ['Total Depreciation', formatCurrency(financialData.totalDepreciation)],
      ['Maintenance Costs', formatCurrency(financialData.totalMaintenance)],
      ['Operating Costs', formatCurrency(financialData.totalOperating)]
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] }, // Orange theme
    });

    // Add equipment details table
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Equipment Financial Details', 14, 22);

    const equipmentData = financialData.equipment.map(item => [
      item.name,
      formatCurrency(item.purchaseValue),
      formatCurrency(item.currentValue),
      `${(item.depreciationRate * 100).toFixed(1)}%`,
      formatCurrency(item.maintenanceCosts),
      formatCurrency(item.operatingCosts)
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Equipment', 'Purchase Value', 'Current Value', 'Depreciation Rate', 'Maintenance', 'Operating']],
      body: equipmentData,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 }
      }
    });

    // Add charts section
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Monthly Depreciation Trends', 14, 22);

    // Save the PDF
    doc.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom sx={{ color: '#d47f39' }}>
          Financial Reports
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
          View financial analytics and reports
        </Typography>
        <Stack direction="row" spacing={2}>
          <ButtonGroup variant="outlined">
            {['month', 'quarter', 'year'].map((period) => (
              <Button
                key={period}
                onClick={() => setTimeRange(period as any)}
                sx={{ 
                  color: timeRange === period ? '#F97316' : 'inherit',
                  borderColor: timeRange === period ? '#F97316' : 'inherit',
                  '&:hover': {
                    borderColor: '#F97316',
                    bgcolor: 'rgba(249, 115, 22, 0.04)'
                  }
                }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}ly
              </Button>
            ))}
          </ButtonGroup>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={generatePDF}
            sx={{ 
              bgcolor: '#F97316',
              '&:hover': {
                bgcolor: '#EA580C'
              },
              mb: 3 // Add margin bottom
            }}
          >
            Export Report
          </Button>
        </Stack>
      </Stack>

      {/* Summary Stats with enhanced styling */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryStats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ color: '#d47f39' }}>{stat.icon}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" sx={{ color: '#d47f39', fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: stat.trendUp ? '#16A34A' : '#DC2626',
                          bgcolor: stat.trendUp ? '#F0FDF4' : '#FEF2F2',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        {stat.trend}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly Expenses Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Monthly Expenses Overview</Typography>
            <BarChart width={700} height={300} data={financialData.monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="maintenance" name="Maintenance" fill="#ff9800" />
              <Bar dataKey="operating" name="Operating" fill="#4caf50" />
              <Bar dataKey="depreciation" name="Depreciation" fill="#f44336" />
            </BarChart>
          </Paper>
        </Grid>

        {/* Expense Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Expense Distribution</Typography>
            <PieChart width={300} height={300}>
              <Pie
                data={financialData.expenseDistribution}
                cx={150}
                cy={150}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {financialData.expenseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </Paper>
        </Grid>

        {/* Equipment Table with enhanced currency formatting */}
        <Grid item xs={12}>
          <Paper>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                        Equipment
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                        Purchase Value
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                        Current Value
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                        Depreciation Rate
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                        Maintenance Costs
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                        Operating Costs
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                        Efficiency
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {financialData.equipment.map((item) => {
                    const efficiency = Math.floor(Math.random() * 30) + 70; // Mock efficiency value
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Build />
                            <Typography>{item.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">{formatCurrency(item.purchaseValue)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.currentValue)}</TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={`${(item.depreciationRate * 100).toFixed(1)}%`}
                            size="small"
                            sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' }}
                          />
                        </TableCell>
                        <TableCell align="right">{formatCurrency(item.maintenanceCosts)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.operatingCosts)}</TableCell>
                        <TableCell align="right">
                          <Stack spacing={1} alignItems="flex-end">
                            <Typography variant="body2">{efficiency}%</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={efficiency}
                              sx={{
                                width: 100,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'rgba(212, 127, 57, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#d47f39'
                                }
                              }}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialReports; 