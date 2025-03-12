export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  status: 'active' | 'maintenance' | 'decommissioned';
  purchaseDate: Date;
  location: {
    latitude: number;
    longitude: number;
    site: string;
  };
  usageHours: number;
  maintenanceSchedule: {
    lastMaintenance: Date;
    nextMaintenance: Date;
  };
  depreciation: {
    initialValue: number;
    currentValue: number;
    depreciationRate: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'ongoing' | 'completed';
  location: string;
  assignedEquipment: string[];
} 