
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentLayout from "./components/layouts/StudentLayout";
import StudentDashboard from "./pages/student/DashboardPage";
import ProfilePage from "./pages/student/ProfilePage";
import StudentEventsPage from "./pages/student/EventsPage";
import StudentEventDetailPage from "./pages/student/EventDetailPage";
import StudentLeaderboardPage from "./pages/student/LeaderboardPage";
import JudgeLayout from "./components/layouts/JudgeLayout";
import JudgeDashboard from "./pages/judge/DashboardPage";
import EventsPage from "./pages/judge/EventsPage";
import EvaluationPage from "./pages/judge/EvaluationPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./components/layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import EventManagementPage from "./pages/admin/EventManagementPage";
import CompetitionManagementPage from "./pages/admin/CompetitionManagementPage";
import NotFound from "./pages/NotFound";
import MyTeamsPage from "./pages/student/MyTeamsPage";
import EventsListPage from "./pages/events/EventsListPage";
import EventDetailPage from "./pages/events/EventDetailPage";
import LeaderboardPage from "./pages/competitions/LeaderboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/competitions/:id/leaderboard" element={<LeaderboardPage />} />
            
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentLayout />
                </ProtectedRoute>
              } 
            >
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="events" element={<StudentEventsPage />} />
              <Route path="events/:id" element={<StudentEventDetailPage />} />
              <Route path="events/:id/leaderboard" element={<StudentLeaderboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="teams" element={<MyTeamsPage />} />
            </Route>
            <Route 
              path="/judge/*" 
              element={
                <ProtectedRoute allowedRoles={['JUDGE']}>
                  <JudgeLayout />
                </ProtectedRoute>
              } 
            >
              <Route path="dashboard" element={<JudgeDashboard />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="competitions/:id/evaluate" element={<EvaluationPage />} />
            </Route>
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              } 
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="events" element={<EventManagementPage />} />
              <Route path="competitions/:id/manage" element={<CompetitionManagementPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
