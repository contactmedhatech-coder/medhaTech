import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  getCurrentUser,
  fetchJobById,
  updateJob,
} from '@/lib/supabase-functions';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import type { jobSchema } from '@/lib/schemas';
import type { User } from '@supabase/supabase-js';

const editJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.string().optional(),
});

type EditJobForm = z.infer<typeof editJobSchema>;

const AdminJobEdit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [job, setJob] = useState<z.infer<typeof jobSchema> | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditJobForm>({
    resolver: zodResolver(editJobSchema),
  });

  useEffect(() => {
    const checkAuthAndFetchJob = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (id) {
          const fetchedJob = await fetchJobById(id);
          setJob(fetchedJob);
          reset({
            title: fetchedJob.title,
            description: fetchedJob.description,
            location: fetchedJob.location,
            salary: fetchedJob.salary || '',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load job',
          variant: 'destructive',
        });
        navigate('/admin/jobs');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchJob();
  }, [navigate, id, reset, toast]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const onSubmit = async (data: EditJobForm) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      const slug = generateSlug(data.title);
      await updateJob(id, {
        title: data.title,
        description: data.description,
        location: data.location,
        salary: data.salary,
        slug,
      });
      toast({
        title: 'Success',
        description: 'Job updated successfully',
      });
      navigate('/admin/jobs');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update job',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || !job) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          onClick={() => navigate('/admin/jobs')}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Edit Job
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Update the details for the job posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g. Software Engineer"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the job responsibilities and requirements"
                rows={6}
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g. Kathmandu, Nepal"
              />
              {errors.location && (
                <p className="text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="salary">Salary (optional)</Label>
              <Input
                id="salary"
                {...register('salary')}
                placeholder="e.g. $50,000 - $70,000"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/jobs')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminJobEdit;
