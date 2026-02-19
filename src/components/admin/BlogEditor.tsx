import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/ImageUpload';
import {
  blogInsertSchema,
  generateSlug,
  type Blog,
  type BlogInsert,
} from '@/lib/schemas';
import { uploadBlogImage } from '@/services/blogs';

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
  'Other',
] as const;

function formatDateForDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const COLOR_OPTIONS = [
  {
    value: 'from-blue-500/20 to-cyan-500/20',
    label: 'Blue to Cyan',
    preview: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
  },
  {
    value: 'from-purple-500/20 to-pink-500/20',
    label: 'Purple to Pink',
    preview: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
  },
  {
    value: 'from-green-500/20 to-emerald-500/20',
    label: 'Green to Emerald',
    preview: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
  },
  {
    value: 'from-orange-500/20 to-amber-500/20',
    label: 'Orange to Amber',
    preview: 'bg-gradient-to-br from-orange-500/20 to-amber-500/20',
  },
  {
    value: 'from-red-500/20 to-rose-500/20',
    label: 'Red to Rose',
    preview: 'bg-gradient-to-br from-red-500/20 to-rose-500/20',
  },
  {
    value: 'from-indigo-500/20 to-violet-500/20',
    label: 'Indigo to Violet',
    preview: 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20',
  },
] as const;

interface BlogEditorProps {
  initialData?: Blog;
  onSubmit: (data: BlogInsert) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BlogEditor({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: BlogEditorProps) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const isEditing = !!initialData;

  const form = useForm<BlogInsert>({
    resolver: zodResolver(blogInsertSchema),
    defaultValues: {
      slug: initialData?.slug || '',
      title: initialData?.title || '',
      category: initialData?.category || ('' as BlogInsert['category']),
      description: initialData?.description || '',
      tags: initialData?.tags || [],
      color: initialData?.color || COLOR_OPTIONS[0].value,
      date: initialData?.date || formatDateForDisplay(new Date().toISOString()),
      date_published: initialData?.date_published
        ? new Date(initialData.date_published).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      read_time: initialData?.read_time || '',
      content: initialData?.content || '',
      image_url: initialData?.image_url || '',
      published: initialData?.published ?? true,
    },
  });

  // Auto-generate slug from title when title changes (only if not editing and slug not manually edited)
  const titleValue = form.watch('title');
  useEffect(() => {
    if (titleValue && !isEditing && !slugManuallyEdited) {
      const generatedSlug = generateSlug(titleValue);
      form.setValue('slug', generatedSlug);
    }
  }, [titleValue, isEditing, slugManuallyEdited, form]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
        setTags([...tags, trimmedTag]);
        form.setValue('tags', [...tags, trimmedTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    return uploadBlogImage(file, fileName);
  }, []);

  const handleImageChange = (value: string) => {
    setImageUrl(value);
    form.setValue('image_url', value);
  };

  const handleImageRemove = () => {
    setImageUrl('');
    form.setValue('image_url', '');
  };

  const handleSubmit = async (data: BlogInsert) => {
    const dateValue =
      typeof data.date_published === 'string'
        ? data.date_published
        : data.date_published?.toISOString?.() || new Date().toISOString();
    const formattedDate = formatDateForDisplay(dateValue);
    await onSubmit({
      ...data,
      published: true,
      date: formattedDate,
      tags,
      image_url: imageUrl || data.image_url,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Slug Field */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input
                    placeholder="your-blog-url-slug"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSlugManuallyEdited(true);
                    }}
                  />
                  {!isEditing && titleValue && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        form.setValue('slug', generateSlug(titleValue));
                        setSlugManuallyEdited(false);
                      }}
                      title="Regenerate slug from title"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                URL-friendly identifier (auto-generated from title, but can be
                customized)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormDescription>
                Must be between 5 and 200 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the blog post"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A short summary (10-500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            aria-label={`Remove tag ${tag}`}
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <input
                    type="hidden"
                    {...form.register('tags')}
                    value={JSON.stringify(tags)}
                  />
                </div>
              </FormControl>
              <FormDescription>Maximum 10 tags allowed</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color Gradient */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a color theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color.preview}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden Date Field - Auto-computed from date_published */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => {
            const dateValue = form.watch('date_published');
            const dateString =
              typeof dateValue === 'string'
                ? dateValue
                : dateValue?.toISOString?.() || new Date().toISOString();
            return (
              <input
                type="hidden"
                {...field}
                value={formatDateForDisplay(dateString)}
              />
            );
          }}
        />

        {/* Date Published and Read Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date_published"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Published</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={
                      typeof field.value === 'string'
                        ? field.value
                        : field.value?.toISOString?.().split('T')[0] || ''
                    }
                    onChange={field.onChange}
                    disabled={field.disabled}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="read_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Read Time</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 5 min" {...field} />
                </FormControl>
                <FormDescription>
                  Include "min" pattern (e.g., "5 min")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Content (Rich Text) */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (HTML)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog content in HTML format..."
                  className="min-h-[200px] font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter HTML content (at least 50 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {showUrlInput ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter image URL"
                        value={imageUrl || field.value}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          field.onChange(e);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowUrlInput(false)}
                      >
                        Use Upload Instead
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageUpload
                        value={imageUrl || field.value}
                        onChange={handleImageChange}
                        onUpload={handleImageUpload}
                        onRemove={handleImageRemove}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowUrlInput(true)}
                      >
                        Or Enter URL Manually
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update Blog' : 'Create Blog'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default BlogEditor;
