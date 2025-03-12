export interface Equipment {
  id: string | number;
  name: string;
  serialNumber: string;
  category: string;
  status: string;
  location: {
    site: string;
    latitude?: number;
    longitude?: number;
  };
  maintenanceSchedule: {
    nextMaintenance: string;
  } | null;
}

export interface MaintenanceRecord {
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