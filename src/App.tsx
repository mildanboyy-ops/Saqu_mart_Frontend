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
import Landing from '@/pages/landing/LandingPage';
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
import AIAnalytics from '@/pages/AIAnalytics';
import Gamification from '@/pages/Gamification';
import BranchManagement from '@/pages/BranchManagement';
import MemberDetail from '@/pages/MemberDetail';


// Global Components
import GlobalLoading from '@/components/GlobalLoading';
import LockScreen from '@/components/LockScreen';
import QuickNotes from '@/components/QuickNotes';
import DynamicIsland from '@/components/DynamicIsland';
import { CommandPalette } from '@/components/CommandPalette';
import { GlobalAIAssistant } from '@/components/ai/GlobalAIAssistant';
import AdzanOverlay from '@/components/islamic/AdzanOverlay';
import NetworkStatusIndicator from '@/components/shared/NetworkStatusIndicator';
import AIFraudWarningModal from '@/components/ai/AIFraudWarningModal';
import DataInitializer from '@/components/DataInitializer';
import { useAuthStore } from '@/store/useAuthStore';

import PageTransition from '@/components/shared/PageTransition';


function App() {
  const location = useLocation();
  const [appLoading, setAppLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Idle Timer Logic
  useEffect(() => {
    if (!isAuthenticated || isLocked) return;

    let timeout: any;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsLocked(true), 300000); 
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [isAuthenticated, isLocked]);
  
  const dashboardPaths = ['/dashboard', '/products', '/stock-in', '/stock-out', '/reports', '/users', '/settings', '/ai-analytics', '/gamification', '/branches'];
  const isDashboardRoute = dashboardPaths.includes(location.pathname);
  const routeKey = isDashboardRoute ? 'dashboard-layout' : location.pathname;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <GlobalLoading loading={appLoading} />
      <LockScreen isLocked={isLocked} onUnlock={() => setIsLocked(false)} />
      <DataInitializer />
      <AdzanOverlay />
      <NetworkStatusIndicator />
      <AIFraudWarningModal />
      {isAuthenticated && (
        <>
          <QuickNotes />
          <DynamicIsland />
          <CommandPalette />
          <GlobalAIAssistant />
        </>
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={routeKey}>
          <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

          <Route path="/pos" element={
            <ProtectedRoute>
              <POSLayout>
                <PageTransition><POS /></PageTransition>
              </POSLayout>
            </ProtectedRoute>
          } />

          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
            <Route path="/stock-in" element={<PageTransition><StockIn /></PageTransition>} />
            <Route path="/stock-out" element={<PageTransition><StockOut /></PageTransition>} />
            <Route path="/reports" element={<PageTransition><Reports /></PageTransition>} />
            <Route path="/users" element={<PageTransition><Users /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/members" element={<PageTransition><Members /></PageTransition>} />
            <Route path="/suppliers" element={<PageTransition><Suppliers /></PageTransition>} />
            <Route path="/ai-analytics" element={<PageTransition><AIAnalytics /></PageTransition>} />
            <Route path="/gamification" element={<PageTransition><Gamification /></PageTransition>} />
            <Route path="/branches" element={<PageTransition><BranchManagement /></PageTransition>} />
            <Route path="/members/:id" element={<PageTransition><MemberDetail /></PageTransition>} />
          </Route>

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  )
}

export default App;
