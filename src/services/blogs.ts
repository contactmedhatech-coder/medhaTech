import { supabase } from '../lib/supabase';
import { Blog, BlogInsert, BlogUpdate } from '../lib/schemas';

/**
 * Fetches all published blog posts sorted by date_published in descending order.
 * @returns {Promise<Blog[]>} Array of published blog posts
 * @throws {Error} If fetching fails
 */
export async function getPublishedBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('date_published', { ascending: false });

  if (error) {
    console.error('Error fetching published blogs:', error);
    throw new Error(`Failed to fetch published blogs: ${error.message}`);
  }

  return data as Blog[];
}

/**
 * Fetches all blog posts (including unpublished) for admin purposes.
 * @returns {Promise<Blog[]>} Array of all blog posts
 * @throws {Error} If fetching fails
 */
export async function getAllBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all blogs:', error);
    throw new Error(`Failed to fetch all blogs: ${error.message}`);
  }

  return data as Blog[];
}

/**
 * Fetches a single blog post by its ID.
 * @param {string} id - The unique identifier of the blog post
 * @returns {Promise<Blog>} The blog post
 * @throws {Error} If fetching fails or blog is not found
 */
export async function getBlogById(id: string): Promise<Blog> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching blog by id ${id}:`, error);
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }

  return data as Blog;
}

/**
 * Fetches a single blog post by its slug.
 * @param {string} slug - The URL-friendly slug of the blog post
 * @returns {Promise<Blog>} The blog post
 * @throws {Error} If fetching fails or blog is not found
 */
export async function getBlogBySlug(slug: string): Promise<Blog> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error) {
    console.error(`Error fetching blog by slug ${slug}:`, error);
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }

  return data as Blog;
}

/**
 * Creates a new blog post.
 * @param {BlogInsert} blog - The blog post data to create
 * @returns {Promise<Blog>} The created blog post
 * @throws {Error} If creation fails
 */
export async function createBlog(blog: BlogInsert): Promise<Blog> {
  const { data, error } = await supabase
    .from('blogs')
    .insert([blog])
    .select()
    .single();

  if (error) {
    console.error('Error creating blog:', error);
    throw new Error(`Failed to create blog: ${error.message}`);
  }

  return data as Blog;
}

/**
 * Updates an existing blog post.
 * @param {string} id - The unique identifier of the blog post to update
 * @param {BlogUpdate} blog - The updated blog post data
 * @returns {Promise<Blog>} The updated blog post
 * @throws {Error} If update fails
 */
export async function updateBlog(id: string, blog: BlogUpdate): Promise<Blog> {
  const { data, error } = await supabase
    .from('blogs')
    .update(blog)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating blog ${id}:`, error);
    throw new Error(`Failed to update blog: ${error.message}`);
  }

  return data as Blog;
}

/**
 * Deletes a blog post by its ID.
 * @param {string} id - The unique identifier of the blog post to delete
 * @returns {Promise<boolean>} True if deletion was successful
 * @throws {Error} If deletion fails
 */
export async function deleteBlog(id: string): Promise<boolean> {
  const { error } = await supabase.from('blogs').delete().eq('id', id);

  if (error) {
    console.error(`Error deleting blog ${id}:`, error);
    throw new Error(`Failed to delete blog: ${error.message}`);
  }

  return true;
}

/**
 * Uploads a blog cover image to Supabase Storage.
 * @param {File} file - The image file to upload
 * @param {string} fileName - The desired file name for the uploaded image
 * @returns {Promise<string>} The public URL of the uploaded image
 * @throws {Error} If upload fails
 */
export async function uploadBlogImage(
  file: File,
  fileName: string,
): Promise<string> {
  const filePath = `blog-images/${fileName}`;

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) {
    console.error('Error uploading blog image:', error);
    throw new Error(`Failed to upload blog image: ${error.message}`);
  }

  const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);

  return data.publicUrl;
}
