import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Auth Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { SetupPage } from "@/pages/auth/SetupPage";

// MR Pages
import { MRDashboardPage } from "@/pages/mr/MRDashboardPage";
import { MRVisitPage } from "@/pages/mr/MRVisitPage";
import { MRTasksPage } from "@/pages/mr/MRTasksPage";
import { MRAttendancePage } from "@/pages/mr/MRAttendancePage";
import { MRDoctorsPage } from "@/pages/mr/MRDoctorsPage";
import { MRProductsPage } from "@/pages/mr/MRProductsPage";
import { MRExplanationPage } from "@/pages/mr/MRExplanationPage";

// Admin Pages
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminMRTrackingPage } from "@/pages/admin/AdminMRTrackingPage";
import { AdminMRDetailPage } from "@/pages/admin/AdminMRDetailPage";
import { AdminTasksPage } from "@/pages/admin/AdminTasksPage";
import { AdminApprovalsPage } from "@/pages/admin/AdminApprovalsPage";
import { AdminDoctorsPage } from "@/pages/admin/AdminDoctorsPage";
import { AdminShopsPage } from "@/pages/admin/AdminShopsPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminMRsPage } from "@/pages/admin/AdminMRsPage";
import { AdminExpensesPage } from "@/pages/admin/AdminExpensesPage";
import { AdminReportsPage } from "@/pages/admin/AdminReportsPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/setup" element={<SetupPage />} />
            
            {/* Protected Routes */}
            <Route element={<AppLayout />}>
              {/* MR Routes */}
              <Route path="/mr/dashboard" element={<MRDashboardPage />} />
              <Route path="/mr/visit" element={<MRVisitPage />} />
              <Route path="/mr/tasks" element={<MRTasksPage />} />
              <Route path="/mr/attendance" element={<MRAttendancePage />} />
              <Route path="/mr/doctors" element={<MRDoctorsPage />} />
              <Route path="/mr/products" element={<MRProductsPage />} />
              <Route path="/mr/explanation" element={<MRExplanationPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/mr-tracking" element={<AdminMRTrackingPage />} />
              <Route path="/admin/mr-tracking/:id" element={<AdminMRDetailPage />} />
              <Route path="/admin/tasks" element={<AdminTasksPage />} />
              <Route path="/admin/approvals" element={<AdminApprovalsPage />} />
              <Route path="/admin/doctors" element={<AdminDoctorsPage />} />
              <Route path="/admin/shops" element={<AdminShopsPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/mrs" element={<AdminMRsPage />} />
              <Route path="/admin/expenses" element={<AdminExpensesPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
            </Route>
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
