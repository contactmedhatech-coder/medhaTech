import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchApplicationById, fetchJobById } from '@/lib/supabase-functions';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Download } from 'lucide-react';

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const { data: application, isLoading: appLoading } = useQuery({
    queryKey: ['application', id],
    queryFn: () => fetchApplicationById(id!),
    enabled: !!user && !!id,
  });

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', application?.job_id],
    queryFn: () => fetchJobById(application!.job_id),
    enabled: !!application,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || appLoading || jobLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || !application) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={() => navigate('/admin/applications')}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Application Details
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{application.full_name}'s Application</CardTitle>
          <CardDescription>
            Applied for: {job?.title || 'Unknown Job'} on{' '}
            {new Date(application.created_at).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <div className="space-y-2">
                <p>
                  <strong>Full Name:</strong> {application.full_name}
                </p>
                <p>
                  <strong>Email:</strong> {application.email}
                </p>
                <p>
                  <strong>Phone:</strong> {application.phone}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Job Information</h3>
              <div className="space-y-2">
                <p>
                  <strong>Job Title:</strong> {job?.title || 'Unknown Job'}
                </p>
                <p>
                  <strong>Location:</strong> {job?.location || 'N/A'}
                </p>
                <p>
                  <strong>Salary:</strong> {job?.salary || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
              {application.cover_letter || 'No cover letter provided'}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Resume</h3>
            {application.resume_url ? (
              <Button
                variant="outline"
                onClick={() => window.open(application.resume_url, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                View Resume
              </Button>
            ) : (
              <p className="text-muted-foreground">No resume uploaded</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApplicationDetail;
