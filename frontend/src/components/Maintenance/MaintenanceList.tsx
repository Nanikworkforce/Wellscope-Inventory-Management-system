import React, { useState, useEffect } from 'react';
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
  Button,
  Chip,
  IconButton,
  Stack,
  LinearProgress,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Build,
  Warning,
  CheckCircle,
  Timeline,
  Add as AddIcon,
  Engineering,
  AttachMoney,
  Schedule,
  History,
  PriorityHigh,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Equipment } from '../../types';
import bgImage from '../../assets/images/bg.jpg';
import ScheduleMaintenance from './ScheduleMaintenance.tsx';
import EditMaintenance from './EditMaintenance.tsx';
import { API_BASE_URL } from '../../config.ts';

interface MaintenanceRecord {
  id: string;
  equipment: {
    id: string;
    name: string;
  };
  maintenance_type: 'preventive' | 'corrective' | 'condition' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  maintenance_date: string;
  completion_date: string | null;
  next_maintenance_due: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  description: string;
  actions_taken: string;
  cost: number;
  labor_cost: number;
  parts_cost: number;
  performed_by: string;
  approved_by: string;
}

const MaintenanceList: React.FC = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewRecord, setViewRecord] = useState<MaintenanceRecord | null>(null);
  const [editRecord, setEditRecord] = useState<MaintenanceRecord | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/maintenance/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMaintenanceRecords(data);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      setError('Failed to load maintenance records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenScheduleDialog = (equipment?: { id: string; name: string }) => {
    setSelectedEquipment(equipment || null);
    setOpenScheduleDialog(true);
  };

  const handleCloseScheduleDialog = async () => {
    setOpenScheduleDialog(false);
    await fetchMaintenanceRecords(); // Refresh the list after scheduling
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'error';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'default';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#ff1744';
      case 'high':
        return '#f57c00';
      case 'medium':
        return '#ffb300';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const summaryStats = [
    {
      icon: <Warning color="error" />,
      title: 'Overdue',
      value: maintenanceRecords.filter(r => r.status === 'overdue').length,
      color: '#ff9800'
    },
    {
      icon: <Schedule color="warning" />,
      title: 'Scheduled',
      value: maintenanceRecords.filter(r => r.status === 'scheduled').length,
      color: '#ff9800'
    },
    {
      icon: <AttachMoney color="primary" />,
      title: 'Total Cost',
      value: `$${maintenanceRecords.reduce((sum, r) => sum + r.cost, 0).toLocaleString()}`,
      color: '#ff9800'
    },
  ];

  const handleView = (record: MaintenanceRecord) => {
    setViewRecord(record);
  };

  const handleEdit = (record: MaintenanceRecord) => {
    setEditRecord(record);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/maintenance/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete maintenance record');
      }

      // Refresh the maintenance records
      await fetchMaintenanceRecords();
      setDeleteConfirmOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
    }
  };

  const handleSaveEdit = async (updatedRecord: MaintenanceRecord) => {
    try {
      const response = await fetch(`${API_BASE_URL}/maintenance/${updatedRecord.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord)
      });
      
      if (!response.ok) throw new Error('Failed to update');
      
      await fetchMaintenanceRecords();
      setEditRecord(null);
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 3 }}>
        <LinearProgress sx={{ 
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#ff9800'
          }
        }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        width: '100%', 
        mt: 3, 
        p: 2, 
        textAlign: 'center',
        color: 'error.main' 
      }}>
        <Typography variant="h6">{error}</Typography>
        <Button 
          onClick={fetchMaintenanceRecords}
          sx={{ mt: 2 }}
          variant="contained"
          color="primary"
        >
          Retry
        </Button>
      </Box>
    );
  }

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
          Maintenance Schedule
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenScheduleDialog()}
          sx={{ 
            bgcolor: '#d47f39',
            '&:hover': {
              bgcolor: '#c2410c'
            }
          }}
        >
          Schedule Maintenance
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryStats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} key={stat.title}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ color: stat.color, fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: stat.color }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Equipment
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Type
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Priority
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Status
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Maintenance Date
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Next Due
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Costs
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Performed By
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ color: '#ff9800', fontWeight: 500 }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maintenanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Engineering sx={{ color: '#d47f39' }} />
                    <Box>
                      <Typography variant="subtitle2">{record.equipment.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        ID: {record.equipment.id}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<Build />}
                    label={record.maintenance_type.replace('_', ' ').toUpperCase()}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<PriorityHigh />}
                    label={record.priority.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: getPriorityColor(record.priority),
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={record.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(record.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(record.maintenance_date)}</TableCell>
                <TableCell>{formatDate(record.next_maintenance_due)}</TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">
                      Total: ${record.cost.toLocaleString()}
                    </Typography>
                    <Typography variant="caption">
                      Labor: ${record.labor_cost.toLocaleString()}
                    </Typography>
                    <Typography variant="caption">
                      Parts: ${record.parts_cost.toLocaleString()}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">{record.performed_by}</Typography>
                    {record.approved_by && (
                      <Typography variant="caption">
                        Approved by: {record.approved_by}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleView(record)}
                        sx={{ 
                          color: '#d47f39',
                          '&:hover': {
                            bgcolor: 'rgba(212, 127, 57, 0.04)'
                          }
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Maintenance">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(record)}
                        sx={{ 
                          color: '#d47f39',
                          '&:hover': {
                            bgcolor: 'rgba(212, 127, 57, 0.04)'
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setRecordToDelete(record.id);
                          setDeleteConfirmOpen(true);
                        }}
                        sx={{ 
                          color: '#d47f39',
                          '&:hover': {
                            bgcolor: 'rgba(212, 127, 57, 0.04)'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Schedule Maintenance">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenScheduleDialog({
                          id: record.equipment.id,
                          name: record.equipment.name
                        })}
                        sx={{ 
                          color: '#d47f39',
                          '&:hover': {
                            bgcolor: 'rgba(212, 127, 57, 0.04)'
                          }
                        }}
                      >
                        <Schedule />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ScheduleMaintenance
        open={openScheduleDialog}
        onClose={handleCloseScheduleDialog}
        equipment={selectedEquipment || undefined}
      />

      {/* View Dialog */}
      <Dialog 
        open={Boolean(viewRecord)} 
        onClose={() => setViewRecord(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: '#d47f39' }}>Maintenance Details</DialogTitle>
        <DialogContent>
          {viewRecord && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Equipment</Typography>
                <Typography variant="body1">{viewRecord.equipment.name}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Type</Typography>
                <Typography variant="body1">{viewRecord.maintenance_type}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Chip 
                  label={viewRecord.status.toUpperCase()} 
                  color={getStatusColor(viewRecord.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                <Typography variant="body1">{viewRecord.description}</Typography>
              </Grid>
              {/* Add more fields as needed */}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRecord(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this maintenance record?</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => recordToDelete && handleDelete(recordToDelete)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <EditMaintenance
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onSave={handleSaveEdit}
      />
    </Box>
  );
};

export default MaintenanceList; 