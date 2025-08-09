import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Layouts
import AdminLayout from '@/components/layouts/AdminLayout';
import JudgeLayout from '@/components/layouts/JudgeLayout';
import StudentLayout from '@/components/layouts/StudentLayout';

// Public Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import EventDetailPage from '@/pages/events/EventDetailPage';
import EventsListPage from '@/pages/events/EventsListPage';
import LeaderboardPage from '@/pages/competitions/LeaderboardPage';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import EventManagementPage from '@/pages/admin/EventManagementPage';
import CompetitionManagementPage from '@/pages/admin/CompetitionManagementPage';

// Judge Pages
import JudgeDashboardPage from '@/pages/judge/DashboardPage';
import JudgeEventsPage from '@/pages/judge/EventsPage';
import EvaluationPage from '@/pages/judge/EvaluationPage';

// Student Pages
import StudentDashboardPage from '@/pages/student/DashboardPage';
import StudentEventsPage from '@/pages/student/EventsPage';
import StudentEventDetailPage from '@/pages/student/EventDetailPage';
import StudentLeaderboardPage from '@/pages/student/LeaderboardPage';
import MyTeamsPage from '@/pages/student/MyTeamsPage';
import MySubmissionsPage from '@/pages/student/MySubmissionsPage';
import ProfilePage from '@/pages/student/ProfilePage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<EventsListPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/competitions/:id/leaderboard" element={<LeaderboardPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="events" element={<EventManagementPage />} />
                <Route path="competitions/:id" element={<CompetitionManagementPage />} />
              </Route>

              {/* Judge Routes */}
              <Route path="/judge" element={
                <ProtectedRoute allowedRoles={['JUDGE']}>
                  <JudgeLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<JudgeDashboardPage />} />
                <Route path="events" element={<JudgeEventsPage />} />
                <Route path="evaluate/:submissionId" element={<EvaluationPage />} />
              </Route>

              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <StudentLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<StudentDashboardPage />} />
                <Route path="events" element={<StudentEventsPage />} />
                <Route path="events/:id" element={<StudentEventDetailPage />} />
                <Route path="competitions/:id/leaderboard" element={<StudentLeaderboardPage />} />
                <Route path="teams" element={<MyTeamsPage />} />
                <Route path="submissions" element={<MySubmissionsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
