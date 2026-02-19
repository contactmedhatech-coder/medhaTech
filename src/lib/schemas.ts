import { z } from 'zod';

// Predefined blog categories
const BLOG_CATEGORIES = [
  'Artificial Intelligence',
  'Software Architecture',
  'Security',
  'Cloud Computing',
  'API Development',
  'Frontend Development',
  'Database',
  'DevOps',
  'Mobile Development',
] as const;

// Tailwind gradient pattern regex
const TAILWIND_GRADIENT_PATTERN = /^from-[a-z]+-\d+\/\d+ to-[a-z]+-\d+\/\d+$/;

// Helper function to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Schema for blog posts
const baseBlogSchema = z.object({
  slug: z
    .string()
    .min(5, 'Slug must be at least 5 characters')
    .max(100, 'Slug must be at most 100 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be at most 200 characters'),
  category: z
    .string()
    .refine(
      (val) =>
        BLOG_CATEGORIES.includes(val as (typeof BLOG_CATEGORIES)[number]),
      {
        message: 'Category must be one of: ' + BLOG_CATEGORIES.join(', '),
      },
    ),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be at most 500 characters'),
  tags: z
    .array(
      z
        .string()
        .min(1, 'Tag cannot be empty')
        .max(30, 'Tag must be at most 30 characters'),
    )
    .max(10, 'Maximum 10 tags allowed'),
  color: z
    .string()
    .regex(
      TAILWIND_GRADIENT_PATTERN,
      'Color must match Tailwind gradient pattern (e.g., "from-blue-500/20 to-cyan-500/20")',
    ),
  date: z.string().min(1, 'Date is required'),
  date_published: z.union([z.string(), z.date()]),
  read_time: z
    .string()
    .regex(
      /^\d+\s*min$/i,
      'Read time must include "min" pattern (e.g., "5 min")',
    ),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters (HTML content)'),
  image_url: z.string().url('Please enter a valid URL').optional().default(''),
  published: z.boolean().optional(),
});

// Full blog schema with id and timestamps
export const blogSchema = baseBlogSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Schema for inserting new blog posts (without id and timestamps)
export const blogInsertSchema = baseBlogSchema;

// Schema for updating blog posts (partial schema)
export const blogUpdateSchema = baseBlogSchema.partial();

// TypeScript types derived from schemas
export type Blog = z.infer<typeof blogSchema>;
export type BlogInsert = z.infer<typeof blogInsertSchema>;
export type BlogUpdate = z.infer<typeof blogUpdateSchema>;

// Schema for job openings
export const jobSchema = z.object({
  id: z.string(),
  slug: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  salary: z.string().optional(),
  is_active: z.boolean().optional(),
});

// Schema for job applications
export const applicationSchema = z.object({
  job_id: z.string(),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  cover_letter: z.string().min(1, 'Cover letter is required'),
  resume_url: z.string().url().optional(),
  created_at: z.string().datetime().optional(),
});
