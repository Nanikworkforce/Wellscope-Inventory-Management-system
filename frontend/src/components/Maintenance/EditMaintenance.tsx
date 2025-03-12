import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Grid, MenuItem, Stack
} from '@mui/material';
import { MaintenanceRecord } from '../../types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

interface EditMaintenanceProps {
  record: MaintenanceRecord | null;
  onClose: () => void;
  onSave: (updatedRecord: MaintenanceRecord) => void;
}

const EditMaintenance: React.FC<EditMaintenanceProps> = ({ record, onClose, onSave }) => {
  const [formData, setFormData] = useState<MaintenanceRecord | null>(null);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  if (!formData) return null;

  const handleChange = (field: keyof MaintenanceRecord) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Dialog open={Boolean(record)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Maintenance Record</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maintenance Type"
                select
                value={formData.maintenance_type}
                onChange={handleChange('maintenance_type')}
              >
                <MenuItem value="preventive">Preventive</MenuItem>
                <MenuItem value="corrective">Corrective</MenuItem>
                <MenuItem value="condition">Condition-Based</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Priority"
                select
                value={formData.priority}
                onChange={handleChange('priority')}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Performed By"
                value={formData.performed_by}
                onChange={handleChange('performed_by')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Status"
                select
                value={formData.status}
                onChange={handleChange('status')}
              >
                <MenuItem value="scheduled">Scheduled</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={() => onSave(formData)}
          variant="contained"
          sx={{ bgcolor: '#d47f39', '&:hover': { bgcolor: '#c2410c' } }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMaintenance; 