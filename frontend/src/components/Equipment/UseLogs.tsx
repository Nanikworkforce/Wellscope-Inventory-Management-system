import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from '@mui/material';
import bgImage from '../../assets/images/bg.jpg';

const UseLogs: React.FC = () => {
  const logs = [
    { 
      id: 1, 
      equipmentName: 'Drilling Rig A',
      operator: 'John Doe',
      startTime: '2024-02-20 08:00',
      endTime: '2024-02-20 16:00',
      duration: '8 hours',
      status: 'completed'
    },
    // Add more mock data
  ];

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
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#d47f39' }}>
            Equipment Use Logs
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
            Track equipment usage and operation history
          </Typography>
        </Box>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Equipment
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Operator
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Start Time
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  End Time
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Duration
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#d47f39', fontWeight: 500 }}>
                  Status
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.equipmentName}</TableCell>
                <TableCell>{log.operator}</TableCell>
                <TableCell>{log.startTime}</TableCell>
                <TableCell>{log.endTime}</TableCell>
                <TableCell>{log.duration}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.status} 
                    color={log.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UseLogs; 