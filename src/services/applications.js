import { supabase, supabaseAdmin } from '../lib/supabase.js';

// Helper function to ensure bucket exists
const ensureBucketExists = async (bucketName) => {
  if (!supabaseAdmin) {
    throw new Error('Admin client not available');
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
          allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          ],
          fileSizeLimit: 10485760, // 10MB limit
        },
      );

      if (createError) {
        throw createError;
      }
    } else if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
};

export async function uploadResume(file, jobSlug, applicantEmail) {
  const bucketName = 'resumes';

  // Ensure the bucket exists before uploading
  await ensureBucketExists(bucketName);

  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const uniquePath = `${jobSlug}/${applicantEmail}_${timestamp}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uniquePath, file);

  if (error) {
    throw new Error(`Failed to upload resume: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(uniquePath);

  return publicUrlData.publicUrl;
}

export async function submitApplication(payload) {
  const { data, error } = await supabase.from('applications').insert([payload]);

  if (error) {
    throw new Error(`Failed to submit application: ${error.message}`);
  }

  return data;
}

export async function fetchAllApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all applications: ${error.message}`);
  }

  return data;
}

export async function fetchApplicationsByJob(jobId) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch applications for job: ${error.message}`);
  }

  return data;
}

export async function deleteApplication(id) {
  const { error } = await supabase.from('applications').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete application: ${error.message}`);
  }

  return true;
}
