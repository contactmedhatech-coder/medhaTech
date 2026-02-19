import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/lib/supabase-functions';
import { useToast } from '@/hooks/use-toast';
import { BlogEditor } from '@/components/admin/BlogEditor';
import type { BlogInsert } from '@/lib/schemas';
import type { User } from '@supabase/supabase-js';
import { createBlog } from '@/services/blogs';

const AdminBlogNew = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        // If no user and Supabase is configured, redirect to login
        if (!currentUser) {
          navigate('/admin/login');
        }
      } catch (err) {
        // Check if it's a Supabase configuration error
        if (err instanceof Error && err.message === 'Supabase not configured') {
          setError(
            'Supabase is not configured. Please set up your environment variables to enable blog management.',
          );
        } else {
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (data: BlogInsert) => {
    setIsSubmitting(true);
    try {
      await createBlog(data);
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
      navigate('/admin/blogs');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create blog post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/blogs');
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/blogs')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
        <Card className="max-w-4xl border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Configuration Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Please add the following environment variables to your .env.local
              file:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/blogs')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Create New Blog Post
        </h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogEditor
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogNew;
