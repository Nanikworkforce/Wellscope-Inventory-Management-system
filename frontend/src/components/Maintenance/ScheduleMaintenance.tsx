import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Grid,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
  Build, 
  Event, 
  Description, 
  AttachMoney, 
  Person,
  PriorityHigh,
  Engineering,
} from '@mui/icons-material';
import { API_BASE_URL } from '../../config.ts';

interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
}

interface ScheduleMaintenanceProps {
  open: boolean;
  onClose: () => void;
  equipment?: {
    id: string;
    name: string;
  };
}

const MAINTENANCE_TYPES = [
  { value: 'preventive', label: 'Preventive Maintenance' },
  { value: 'corrective', label: 'Corrective Maintenance' },
  { value: 'condition', label: 'Condition-Based' },
  { value: 'emergency', label: 'Emergency Repair' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

interface MaintenanceFormData {
  equipmentId: string;
  maintenanceType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate: Date | null;
  nextMaintenanceDue: Date | null;
  description: string;
  laborCost: string;
  partsCost: string;
  performed_by: string;
  approvedBy: string;
}

const ScheduleMaintenance: React.FC<ScheduleMaintenanceProps> = ({
  open,
  onClose,
  equipment,
}) => {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    equipmentId: '',
    maintenanceType: '',
    priority: 'medium',
    scheduledDate: null,
    nextMaintenanceDue: null,
    description: '',
    laborCost: '0',
    partsCost: '0',
    performed_by: '',
    approvedBy: ''
  });

  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEquipmentList();
    }
  }, [open]);

  const fetchEquipmentList = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/equipment/`);
      if (!response.ok) {
        throw new Error('Failed to fetch equipment list');
      }
      const data = await response.json();
      setEquipmentList(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Form data at submission:', formData);
      
      if (!formData.performed_by) {
        throw new Error('Performed by is required');
      }

      const maintenanceData = {
        equipment: formData.equipmentId,
        maintenance_type: formData.maintenanceType.toLowerCase(),
        priority: formData.priority || 'medium',
        next_maintenance_due: formData.nextMaintenanceDue?.toISOString().split('T')[0],
        description: formData.description,
        actions_taken: '',
        cost: parseFloat(formData.laborCost || 0) + parseFloat(formData.partsCost || 0),
        labor_cost: parseFloat(formData.laborCost || 0),
        parts_cost: parseFloat(formData.partsCost || 0),
        performed_by: formData.performed_by,
        approved_by: formData.approvedBy || '',
        status: 'scheduled'
      };

      console.log('Maintenance data being sent:', maintenanceData);

      const response = await fetch(`${API_BASE_URL}/maintenance/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenanceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        const errorMessage = errorData.error || 
                            errorData.performed_by ? 
                            'Performed by is required' : 
                            'Failed to schedule maintenance';
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Maintenance scheduled successfully:', result);
      onClose?.();
      
    } catch (error) {
      console.error('Failed to schedule maintenance:', error);
    }
  };

  const handleChange = (field: string) => (event: any) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (newValue: Date | null) => {
    console.log('New date value:', newValue);
    setFormData(prev => ({
      ...prev,
      scheduledDate: newValue
    }));
  };

  const totalCost = () => {
    const labor = parseFloat(formData.laborCost) || 0;
    const parts = parseFloat(formData.partsCost) || 0;
    return (labor + parts).toFixed(2);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: '#faf5f0', color: '#d47f39' }}>
        Schedule Maintenance
        {equipment && (
          <Typography variant="subtitle2" color="textSecondary">
            for {equipment.name}
          </Typography>
        )}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {!equipment && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Equipment</InputLabel>
                    <Select
                      value={formData.equipmentId}
                      onChange={handleChange('equipmentId')}
                      required
                      startAdornment={
                        <InputAdornment position="start">
                          <Engineering sx={{ color: '#d47f39' }} />
                        </InputAdornment>
                      }
                    >
                      {equipmentList.map((eq) => (
                        <MenuItem key={eq.id} value={eq.id}>
                          <Stack>
                            <Typography variant="body1">{eq.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              S/N: {eq.serialNumber}
                            </Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Maintenance Type</InputLabel>
                  <Select
                    value={formData.maintenanceType}
                    onChange={handleChange('maintenanceType')}
                    required
                    startAdornment={
                      <InputAdornment position="start">
                        <Build sx={{ color: '#d47f39' }} />
                      </InputAdornment>
                    }
                  >
                    {MAINTENANCE_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={handleChange('priority')}
                    required
                    startAdornment={
                      <InputAdornment position="start">
                        <PriorityHigh sx={{ color: '#d47f39' }} />
                      </InputAdornment>
                    }
                  >
                    {PRIORITY_LEVELS.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Maintenance Date"
                    value={formData.scheduledDate}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        required: true,
                        fullWidth: true,
                        error: !formData.scheduledDate,
                        helperText: !formData.scheduledDate ? 'This field is required' : '',
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Next Maintenance Due"
                    value={formData.nextMaintenanceDue}
                    onChange={(newValue) =>
                      setFormData({ ...formData, nextMaintenanceDue: newValue })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Event sx={{ color: '#d47f39' }} />
                            </InputAdornment>
                          ),
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Labor Cost"
                  type="number"
                  value={formData.laborCost}
                  onChange={handleChange('laborCost')}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: '#d47f39' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Parts Cost"
                  type="number"
                  value={formData.partsCost}
                  onChange={handleChange('partsCost')}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney sx={{ color: '#d47f39' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Performed By"
                  value={formData.performed_by}
                  onChange={handleChange('performed_by')}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#d47f39' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Approved By"
                  value={formData.approvedBy}
                  onChange={handleChange('approvedBy')}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#d47f39' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange('description')}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description sx={{ color: '#d47f39' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#d47f39' }}>
                  Total Cost: ${totalCost()}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#faf5f0' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#d47f39',
              '&:hover': {
                bgcolor: '#c2410c',
              },
            }}
          >
            {loading ? 'Loading...' : 'Schedule'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ScheduleMaintenance; 