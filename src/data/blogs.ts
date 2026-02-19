import { Blog as SupabaseBlog } from '../lib/schemas';
import { getPublishedBlogs } from '../services/blogs';

// Frontend Blog interface (matches what Articles.tsx and Blogs.tsx expect)
export interface Blog {
  title: string;
  category: string;
  description: string;
  tags: string[];
  color: string;
  date: string;
  datePublished: Date;
  readTime: string;
  content: string;
  imageUrl: string;
}

// Static fallback blogs data - KEPT FOR DESIGN PREVIEW ONLY
// When Supabase has blogs, these will NOT be used (fallback returns empty array)
export const blogs: Blog[] = [
  {
    title: 'The Future of AI in Software Development',
    category: 'Artificial Intelligence',
    description:
      'Explore how AI and machine learning are revolutionizing the software development lifecycle, from code generation to automated testing and deployment.',
    tags: ['AI', 'Machine Learning', 'DevOps'],
    color: 'from-blue-500/20 to-cyan-500/20',
    date: 'Jan 15, 2026',
    datePublished: new Date('2026-01-15'),
    readTime: '5 min read',
    content: `
      <h2>Introduction</h2>
      <p>Artificial Intelligence is transforming the software development landscape in unprecedented ways.</p>
    `,
    imageUrl: '',
  },
];

// Helper function to convert Supabase blog to frontend Blog format
export function convertSupabaseBlogToBlog(supabaseBlog: SupabaseBlog): Blog {
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
    imageUrl: supabaseBlog.image_url,
  };
}

// Fetch blogs from Supabase - returns empty array if no blogs found
// Static blogs are kept only for design preview purposes
export async function getBlogsFromSupabase(): Promise<Blog[]> {
  try {
    const supabaseBlogs = await getPublishedBlogs();

    if (!supabaseBlogs || supabaseBlogs.length === 0) {
      console.log('No blogs found in Supabase. Add blogs via the admin panel.');
      // Return empty array - no static fallback
      return [];
    }

    return supabaseBlogs.map(convertSupabaseBlogToBlog);
  } catch (error) {
    console.error('Error fetching blogs from Supabase:', error);
    console.log(
      'Supabase not configured or not reachable. Add blogs via the admin panel.',
    );
    // Return empty array - no static fallback
    return [];
  }
}

// Sort blogs by date (latest first) - uses static data
export const getSortedBlogs = (): Blog[] => {
  return [...blogs].sort(
    (a, b) => b.datePublished.getTime() - a.datePublished.getTime(),
  );
};
