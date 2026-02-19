import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from './pages/Index';
import JobsPage from './pages/Jobs';
import JobDetail from './pages/JobDetail.tsx';
import Articles from './pages/Articles';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminJobNew from './pages/AdminJobNew';
import AdminJobEdit from './pages/AdminJobEdit';
import AdminApplications from './pages/AdminApplications';
import AdminApplicationDetail from './pages/AdminApplicationDetail';
import AdminBlogs from './pages/AdminBlogs';
import AdminBlogNew from './pages/AdminBlogNew';
import AdminBlogEdit from './pages/AdminBlogEdit';
import AdminNewsletter from './pages/AdminNewsletter';
import AdminLayout from '@/components/layout/AdminLayout';

const ThemeManager = () => {
  const location = useLocation();

  useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin');
    if (isAdmin) {
      document.documentElement.classList.remove('dark', 'premium');
      document.documentElement.classList.add('light');
    }
  }, [location]);

  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <ThemeManager />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/careers/:slug" element={<JobDetail />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <AdminLayout>
                  <AdminJobs />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/jobs/new"
              element={
                <AdminLayout>
                  <AdminJobNew />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/jobs/:id/edit"
              element={
                <AdminLayout>
                  <AdminJobEdit />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <AdminLayout>
                  <AdminApplications />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/applications/:id"
              element={
                <AdminLayout>
                  <AdminApplicationDetail />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/blogs"
              element={
                <AdminLayout>
                  <AdminBlogs />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/blogs/new"
              element={
                <AdminLayout>
                  <AdminBlogNew />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/blogs/:id/edit"
              element={
                <AdminLayout>
                  <AdminBlogEdit />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/newsletter"
              element={
                <AdminLayout>
                  <AdminNewsletter />
                </AdminLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
