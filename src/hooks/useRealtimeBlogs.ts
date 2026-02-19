import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Blog as SupabaseBlog } from '../lib/schemas';
import { Blog } from '@/data/blogs';

// Helper function to convert Supabase blog to frontend Blog format
function convertSupabaseBlogToBlog(supabaseBlog: SupabaseBlog): Blog {
  // Parse the date_published field
  const datePublished =
    supabaseBlog.date_published instanceof Date
      ? supabaseBlog.date_published
      : new Date(supabaseBlog.date_published);

  // Format the date for display (e.g., "Jan 15, 2026")
  const formattedDate = datePublished.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Format read_time for display (e.g., "5 min read")
  const readTime = supabaseBlog.read_time
    ? `${supabaseBlog.read_time} read`
    : '5 min read';

  return {
    title: supabaseBlog.title,
    category: supabaseBlog.category,
    description: supabaseBlog.description,
    tags: supabaseBlog.tags || [],
    color: supabaseBlog.color || 'from-blue-500/20 to-cyan-500/20',
    date: formattedDate,
    datePublished: datePublished,
    readTime: readTime,
    content: supabaseBlog.content,
    imageUrl: supabaseBlog.image_url || '',
  };
}

interface RealtimeBlogsOptions {
  publishedOnly?: boolean;
  limit?: number;
}

export function useRealtimeBlogs({
  publishedOnly = true,
  limit,
}: RealtimeBlogsOptions = {}) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('blogs')
        .select('*')
        .order('date_published', { ascending: false });

      if (publishedOnly) {
        query = query.eq('published', true);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Convert Supabase blogs to frontend Blog format
      const convertedBlogs = (data as SupabaseBlog[]).map(
        convertSupabaseBlogToBlog,
      );
      setBlogs(convertedBlogs);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, [publishedOnly, limit]);

  useEffect(() => {
    // Initial fetch
    fetchBlogs();

    // Set up real-time subscription
    const channel = supabase
      .channel('blogs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blogs',
        },
        (payload) => {
          console.log('Blog change detected:', payload);

          if (payload.eventType === 'INSERT') {
            const newSupabaseBlog = payload.new as SupabaseBlog;
            const newBlog = convertSupabaseBlogToBlog(newSupabaseBlog);
            setBlogs((prev) => {
              // If publishedOnly is true, only add if published
              if (publishedOnly && !newSupabaseBlog.published) {
                return prev;
              }
              // Add new blog at the beginning
              return [newBlog, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedSupabaseBlog = payload.new as SupabaseBlog;
            const updatedBlog = convertSupabaseBlogToBlog(updatedSupabaseBlog);
            setBlogs((prev) => {
              // If publishedOnly is true, filter out if unpublished
              if (publishedOnly && !updatedSupabaseBlog.published) {
                return prev.filter((b) => b.title !== updatedBlog.title);
              }
              // Update existing blog
              return prev.map((b) =>
                b.title === updatedBlog.title ? updatedBlog : b,
              );
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedTitle = payload.old.title;
            setBlogs((prev) => prev.filter((b) => b.title !== deletedTitle));
          }
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBlogs, publishedOnly]);

  return { blogs, loading, error, refetch: fetchBlogs };
}
