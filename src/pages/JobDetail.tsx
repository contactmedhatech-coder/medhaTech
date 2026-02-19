import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  fetchJobBySlug,
  submitApplication,
  uploadResume,
} from '@/lib/supabase-functions';
import { applicationSchema } from '@/lib/schemas';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/sonner';

const JobDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => fetchJobBySlug(slug!),
    enabled: !!slug,
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      job_id: '',
      full_name: '',
      email: '',
      phone: '',
      cover_letter: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof applicationSchema>) => {
    if (!file) {
      setFileError('Resume/CV is required');
      return;
    }
    setFileError('');
    setIsSubmitting(true);
    try {
      let resumeUrl = '';
      if (file) {
        resumeUrl = await uploadResume(
          file,
          `${Date.now()}-${file.name}`,
          job?.slug,
          data.email,
        );
      }
      await submitApplication({
        ...data,
        job_id: job!.id,
        ...(resumeUrl && { resume_url: resumeUrl }),
      });

      toast.success(
        'Your application has been successfully submitted. Our team will contact you shortly after review.',
      );
      form.reset();
      setFile(null);
      setFileError('');
    } catch (error: unknown) {
      console.error('Error submitting application:', error);

      // Extract error message for better user feedback
      let errorMessage = 'Failed to submit application. Please try again.';

      if (error instanceof Error) {
        const errorLower = error.message.toLowerCase();

        // Check for MIME type / file format errors
        if (
          errorLower.includes('mime type') ||
          errorLower.includes('not supported') ||
          errorLower.includes('invalid mime type')
        ) {
          errorMessage =
            'The file format is not supported. Please upload a PDF, DOC, or DOCX file.';
        }
        // Check for file size errors
        else if (
          errorLower.includes('file too large') ||
          errorLower.includes('size limit') ||
          errorLower.includes('exceeds maximum size')
        ) {
          errorMessage =
            'File size exceeds the 10MB limit. Please compress your file or use a smaller one.';
        }
        // Check for network errors
        else if (
          errorLower.includes('network') ||
          errorLower.includes('fetch') ||
          errorLower.includes('connection')
        ) {
          errorMessage =
            'Network error. Please check your internet connection and try again.';
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <p>Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <p>Job not found.</p>
          <Link to="/jobs" className="text-gold-primary hover:underline">
            Back to Jobs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Background effects */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] rounded-full bg-navy/10 blur-[120px] animate-glow-pulse" />
          <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] rounded-full bg-ice-blue/20 blur-[100px]" />
        </div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line-color)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 bg-amber text-navy px-5 py-2.5 rounded-lg hover:bg-amber/90 transition-all mt-8 mb-8 font-medium shadow-md hover:shadow-lg group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Careers
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Job Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-navy/10 shadow-lg p-8"
            >
              <div className="inline-flex items-center gap-2 bg-amber/10 border border-amber/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                <span className="text-sm text-navy font-medium">
                  Open Position
                </span>
              </div>
              <h1 className="text-4xl font-bold font-display mb-4 text-navy">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-navy/10 text-navy px-3 py-1.5 rounded-full text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {job.location}
                </span>
                {job.salary && (
                  <span className="inline-flex items-center gap-1.5 bg-amber/10 text-navy px-3 py-1.5 rounded-full text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {job.salary}
                  </span>
                )}
              </div>
              <div className="w-24 h-1 bg-amber rounded-full mb-6" />
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-grey leading-relaxed">
                  {job.description}
                </p>
              </div>
            </motion.div>

            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-navy/10 shadow-lg p-8"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-display mb-2 text-navy">
                  Apply for this position
                </h2>
                <p className="text-slate-grey">
                  Fill out the form below and we'll get back to you shortly.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-semibold">
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                className="bg-white border-navy/20 focus:border-amber focus:ring-amber/20 rounded-lg h-12 pl-12"
                                placeholder="Your Name"
                              />
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-semibold">
                            Email *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                {...field}
                                className="bg-white border-navy/20 focus:border-amber focus:ring-amber/20 rounded-lg h-12 pl-12"
                                placeholder="your@example.com"
                              />
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-semibold">
                            Phone *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                className="bg-white border-navy/20 focus:border-amber focus:ring-amber/20 rounded-lg h-12 pl-12"
                                placeholder="+977 98XXXXXXXX"
                              />
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <FormField
                      control={form.control}
                      name="cover_letter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-semibold">
                            Cover Letter *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                {...field}
                                rows={5}
                                className="bg-white border-navy/20 focus:border-amber focus:ring-amber/20 rounded-lg resize-none pl-12 pt-4"
                                placeholder="Tell us why you're the perfect fit for this role..."
                              />
                              <div className="absolute left-4 top-4 text-navy/40">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className="block text-sm font-semibold mb-2 text-navy">
                      Resume/CV *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        aria-label="Resume upload"
                        onChange={(e) => {
                          const selectedFile = e.target.files?.[0] || null;
                          if (selectedFile) {
                            const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
                            const validTypes = [
                              'application/pdf',
                              'application/msword',
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            ];
                            // Also check by extension as fallback for browsers that don't detect MIME type correctly
                            const fileExtension = selectedFile.name
                              .split('.')
                              .pop()
                              ?.toLowerCase();
                            const validExtensions = ['pdf', 'doc', 'docx'];

                            // Check file size first
                            if (selectedFile.size > MAX_FILE_SIZE) {
                              setFileError(
                                'File size exceeds the 10MB limit. Please compress your file or use a smaller one.',
                              );
                              setFile(null);
                              e.target.value = '';
                              return;
                            }

                            if (
                              !validTypes.includes(selectedFile.type) &&
                              !validExtensions.includes(fileExtension || '')
                            ) {
                              setFileError(
                                'The file format is not supported. Please upload a valid PDF, DOC, or DOCX file.',
                              );
                              setFile(null);
                              e.target.value = '';
                              return;
                            }
                            setFileError('');
                          }
                          setFile(selectedFile);
                        }}
                        className="block w-full text-sm text-slate-grey file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber file:text-navy hover:file:bg-amber/90 cursor-pointer bg-white border border-navy/20 rounded-lg p-4"
                      />
                    </div>
                    <p className="text-xs text-slate-grey mt-2">
                      Supported formats: PDF, DOC, DOCX (Max 10MB)
                    </p>
                    {fileError && (
                      <p className="text-sm text-red-600 mt-1">{fileError}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-amber hover:bg-amber/90 text-navy font-semibold h-12 rounded-lg transition-all hover:shadow-lg hover:shadow-amber/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting your application...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Submit Application
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetail;
