import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
  fetchJobs,
  fetchApplications,
  fetchBlogs,
} from '@/lib/supabase-functions';
import { useAuth } from '@/hooks/useAuth';
import { Briefcase, Users, Mail, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, applications: 0, blogs: 0 });
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    enabled: !!user,
  });

  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    enabled: !!user,
  });

  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
    enabled: !!user,
  });

  useEffect(() => {
    if (jobsData && applicationsData && blogsData) {
      setStats({
        jobs: jobsData.length,
        applications: applicationsData.length,
        blogs: blogsData.length,
      });
    }
  }, [jobsData, applicationsData, blogsData]);

  if (authLoading || jobsLoading || appsLoading || blogsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#001F4D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#001F4D]">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back! Here's an overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/admin/jobs')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#001F4D]" />
              Total Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#001F4D]">
              {stats.jobs}
            </div>
            <p className="text-xs text-slate-500 mt-1">Click to manage</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/admin/applications')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-500" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {stats.applications}
            </div>
            <p className="text-xs text-slate-500 mt-1">Click to manage</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/admin/blogs')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-500" />
              Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {stats.blogs}
            </div>
            <p className="text-xs text-slate-500 mt-1">Click to manage</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          onClick={() => navigate('/admin/jobs')}
          className="h-auto py-4 flex flex-col items-center gap-2 bg-[#001F4D] hover:bg-[#001a40]"
        >
          <Briefcase className="h-5 w-5" />
          <span>Manage Jobs</span>
        </Button>

        <Button
          onClick={() => navigate('/admin/blogs')}
          className="h-auto py-4 flex flex-col items-center gap-2 bg-emerald-500 hover:bg-emerald-600"
        >
          <FileText className="h-5 w-5" />
          <span>Manage Blogs</span>
        </Button>

        <Button
          onClick={() => navigate('/admin/applications')}
          className="h-auto py-4 flex flex-col items-center gap-2 bg-[#001F4D] hover:bg-[#001a40]"
        >
          <Users className="h-5 w-5" />
          <span>View Applications</span>
        </Button>

        <Button
          onClick={() => navigate('/admin/newsletter')}
          className="h-auto py-4 flex flex-col items-center gap-2 bg-violet-500 hover:bg-violet-600"
        >
          <Mail className="h-5 w-5" />
          <span>Newsletter</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
