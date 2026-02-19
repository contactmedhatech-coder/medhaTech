import { supabase, supabaseAdmin } from './supabase';
import { jobSchema, applicationSchema } from './schemas';
import type { z } from 'zod';

// Function to fetch job openings
export const fetchJobs = async (): Promise<z.infer<typeof jobSchema>[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as z.infer<typeof jobSchema>[];
};

// Function to submit job application
export const submitApplication = async (
  application: z.infer<typeof applicationSchema>,
) => {
  const { data, error } = await supabase
    .from('applications')
    .insert([application]);

  if (error) throw error;

  return data;
};

// Function to fetch active job openings
export const fetchActiveJobs = async (): Promise<
  z.infer<typeof jobSchema>[]
> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('id, slug, title, description, location, salary')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data as z.infer<typeof jobSchema>[];
};

// Function to fetch job by slug
export const fetchJobBySlug = async (
  slug: string,
): Promise<z.infer<typeof jobSchema>> => {
  const { data, error } = await supabase
    .from('jobs')
    .select(
      'id, slug, title, description, location, salary, is_active, created_at',
    )
    .eq('slug', slug)
    .single();

  if (error) throw error;

  return data as z.infer<typeof jobSchema>;
};

// Function to fetch job by id
export const fetchJobById = async (
  id: string,
): Promise<z.infer<typeof jobSchema>> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data as z.infer<typeof jobSchema>;
};

// Helper function to ensure bucket exists
const ensureBucketExists = async (bucketName: string) => {
  if (!supabaseAdmin) {
    // Skip bucket check if admin client is not available
    // Assume bucket already exists
    console.warn('Admin client not available, skipping bucket creation check');
    return;
  }

  try {
    // Try to get the bucket to check if it exists
    const { data, error } = await supabaseAdmin.storage.getBucket(bucketName);

    if (error && error.message.includes('not found')) {
      // Bucket doesn't exist, create it
      const { error: createError } = await supabaseAdmin.storage.createBucket(
        bucketName,
        {
          public: true, // Make it public so resumes can be accessed via public URL
          fileSizeLimit: 10485760, // 10MB limit
        },
      );

      if (createError) {
        throw createError;
      }
    } else if (!error && data) {
      // Bucket exists, update it to remove any MIME type restrictions
      // This ensures .docx files can be uploaded
      const { error: updateError } = await supabaseAdmin.storage.updateBucket(
        bucketName,
        {
          public: true,
          fileSizeLimit: 10485760, // 10MB limit
        },
      );

      if (updateError) {
        // Log but don't throw - bucket may already have correct settings
        console.warn('Could not update bucket settings:', updateError.message);
      }
    } else if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
};

// Function to upload resume/CV file
export const uploadResume = async (
  file: File,
  fileName: string,
  jobSlug?: string,
  applicantEmail?: string,
) => {
  const bucketName = 'resumes';

  // Ensure the bucket exists before uploading
  await ensureBucketExists(bucketName);

  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const uniquePath =
    jobSlug && applicantEmail
      ? `${jobSlug}/${applicantEmail}_${timestamp}.${fileExtension}`
      : `resumes/${timestamp}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uniquePath, file);

  if (error) {
    // Provide more helpful error messages
    const errorMessage = error.message.toLowerCase();

    if (
      errorMessage.includes('mime type') ||
      errorMessage.includes('not supported') ||
      errorMessage.includes('invalid mime type')
    ) {
      throw new Error(
        'The file format is not supported. Please upload a PDF, DOC, or DOCX file.',
      );
    }
    if (
      errorMessage.includes('file too large') ||
      errorMessage.includes('size limit') ||
      errorMessage.includes('exceeds maximum')
    ) {
      throw new Error(
        'File size exceeds the 10MB limit. Please compress your file or use a smaller one.',
      );
    }

    throw error;
  }

  // Return the public URL
  const { data: publicUrl } = supabase.storage
    .from(bucketName)
    .getPublicUrl(uniquePath);

  return publicUrl.publicUrl;
};

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    // Try to clear local storage as fallback
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.clear();
    throw error;
  }
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
};

// Admin functions for jobs
export const createJob = async (
  job: Omit<z.infer<typeof jobSchema>, 'id' | 'created_at'>,
) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateJob = async (
  id: string,
  updates: Partial<z.infer<typeof jobSchema>>,
) => {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteJob = async (id: string) => {
  const { error } = await supabase.from('jobs').delete().eq('id', id);

  if (error) throw error;
};

// Admin functions for applications
export const fetchApplications = async () => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export const fetchApplicationsByJob = async (jobId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export const fetchApplicationById = async (id: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return data;
};

export const deleteApplication = async (id: string) => {
  const { error } = await supabase.from('applications').delete().eq('id', id);

  if (error) throw error;
};

// Newsletter subscription functions
export const fetchNewsletterSubscriptions = async () => {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

export const deleteNewsletterSubscription = async (id: string) => {
  const { error } = await supabase
    .from('newsletter_subscriptions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Blog functions for admin
export const fetchBlogs = async () => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};
