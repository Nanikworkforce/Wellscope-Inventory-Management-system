import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout/Layout.tsx';
import EquipmentList from './components/Equipment/EquipmentList.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import CustomerList from './components/Customers/CustomerList.tsx';
import ProjectList from './components/Projects/ProjectList.tsx';
import MaintenanceList from './components/Maintenance/MaintenanceList.tsx';
import FinancialReports from './components/Finance/FinancialReports.tsx';
import LocationTracking from './components/Tracking/LocationTracking.tsx';
import AddEquipment from './components/Equipment/AddEquipment.tsx';
import EditEquipment from './components/Equipment/EditEquipment.tsx';
import AddCustomer from './components/Customers/AddCustomer.tsx';
import EditCustomer from './components/Customers/EditCustomer.tsx';
import ViewCustomer from './components/Customers/ViewCustomer.tsx';
import ViewEquipment from './components/Equipment/ViewEquipment.tsx';
import EditProject from './components/Projects/EditProject.tsx';
import ViewProject from './components/Projects/ViewProject.tsx';
import AddProject from './components/Projects/AddProject.tsx';
import Register from './pages/Auth/Register.tsx';
import Login from './pages/Auth/Login.tsx';
import { ThemeProvider, createTheme } from '@mui/material';
import EquipmentCategory from './components/Equipment/EquipmentCategory.tsx';
import UseLogs from './components/Equipment/UseLogs.tsx';
import Profile from './components/Profile/Profile.tsx';
import VerifyEmail from './pages/Auth/VerifyEmail.tsx';
import { AuthProvider, useAuth } from './pages/Auth/AuthContext.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

// Separate the routes into a new component
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to="/dashboard" /> 
            : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/login" 
        element={
          isAuthenticated 
            ? <Navigate to="/dashboard" /> 
            : <Login />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated 
            ? <Navigate to="/dashboard" /> 
            : <Register />
        } 
      />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected routes */}
      <Route 
        element={
          isAuthenticated ? (
            <Layout>
              <Outlet />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/equipment" element={<EquipmentList />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/add" element={<AddCustomer />} />
        <Route path="/customers/edit/:id" element={<EditCustomer />} />
        <Route path="/customers/:id" element={<ViewCustomer />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/maintenance" element={<MaintenanceList />} />
        <Route path="/finance" element={<FinancialReports />} />
        <Route path="/tracking" element={<LocationTracking />} />
        <Route path="/equipment/new" element={<AddEquipment />} />
        <Route path="/equipment/edit/:id" element={<EditEquipment />} />
        <Route path="/equipment/:id" element={<ViewEquipment />} />
        <Route path="/projects/edit/:id" element={<EditProject />} />
        <Route path="/projects/:id" element={<ViewProject />} />
        <Route path="/projects/add" element={<AddProject />} />
        <Route path="/equipment/categories" element={<EquipmentCategory />} />
        <Route path="/equipment/logs" element={<UseLogs />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
