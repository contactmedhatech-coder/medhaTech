import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

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
import type { Blog, BlogInsert } from '@/lib/schemas';
import type { User } from '@supabase/supabase-js';
import { getBlogById, updateBlog } from '@/services/blogs';

const AdminBlogEdit = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogNotFound, setBlogNotFound] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const checkAuthAndFetchBlog = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (id) {
          try {
            const fetchedBlog = await getBlogById(id);
            setBlog(fetchedBlog);
          } catch {
            setBlogNotFound(true);
          }
        }
      } catch {
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchBlog();
  }, [navigate, id]);

  const handleSubmit = async (data: BlogInsert) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateBlog(id, data);
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
      navigate('/admin/blogs');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update blog post',
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

  if (!user) {
    return null;
  }

  if (blogNotFound) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Blog Not Found
        </h1>
        <p className="text-muted-foreground mb-4">
          The blog post you're trying to edit doesn't exist.
        </p>
        <Button onClick={() => navigate('/admin/blogs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blogs
        </Button>
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
          Edit Blog Post
        </h1>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Blog Details</CardTitle>
          <CardDescription>
            Update the details for your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          {blog && (
            <BlogEditor
              initialData={blog}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogEdit;
