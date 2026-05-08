import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/components/theme-provider';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import POSLayout from '@/layouts/POSLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import POS from '@/pages/POS';
import Products from '@/pages/Products';
import StockIn from '@/pages/StockIn';
import StockOut from '@/pages/StockOut';
import Reports from '@/pages/Reports';
import Users from '@/pages/Users';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import Members from '@/pages/Members';
import Suppliers from '@/pages/Suppliers';
import GlobalLoading from '@/components/GlobalLoading';

function App() {
  const location = useLocation();
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading for aesthetic
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const dashboardPaths = ['/dashboard', '/products', '/stock-in', '/stock-out', '/reports', '/users', '/settings'];
  const isDashboardRoute = dashboardPaths.includes(location.pathname);
  const routeKey = isDashboardRoute ? 'dashboard-layout' : location.pathname;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <GlobalLoading loading={appLoading} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={routeKey}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/pos" element={
            <ProtectedRoute>
              <POSLayout>
                <POS />
              </POSLayout>
            </ProtectedRoute>
          } />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stock-in" element={<StockIn />} />
            <Route path="/stock-out" element={<StockOut />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/members" element={<Members />} />
            <Route path="/suppliers" element={<Suppliers />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}

export default App;
