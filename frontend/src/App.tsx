import React from 'react';
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

const App = () => {
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to register page */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - All wrapped in Layout */}
          <Route element={
            isAuthenticated ? (
              <Layout>
                <Outlet />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }>
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

          {/* Default redirect */}
          <Route path="/" element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
