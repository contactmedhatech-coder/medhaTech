import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchActiveJobs, fetchJobBySlug } from '@/lib/supabase-functions';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const Jobs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchActiveJobs,
  });
  const queryClient = useQueryClient();

  return (
    <section
      id="jobs"
      className="section-padding bg-background relative overflow-hidden"
      ref={ref}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-gold-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            Careers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4">
            Join Our <span className="gradient-text">Growing Team</span>
          </h2>
          <div className="w-20 h-1 bg-amber rounded-full mb-6"></div>
          <p className="text-lg text-foreground">
            Explore exciting opportunities to work on cutting-edge technologies
            and innovative projects.
          </p>
        </motion.div>
        {isLoading ? (
          <p className="text-center text-foreground">Loading job openings...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {jobs?.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * index }}
                className="group relative bg-card p-6 rounded-2xl border border-gold-primary hover:border-gold-primary/50 transition-all duration-500 hover-lift cursor-pointer overflow-hidden"
                onMouseEnter={() => {
                  if (job.slug) {
                    queryClient.prefetchQuery({
                      queryKey: ['job', job.slug],
                      queryFn: () => fetchJobBySlug(job.slug!),
                    });
                  }
                }}
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-gold-primary flex items-center mb-3">
                    {job.title}
                    <CheckCircle className="w-5 h-5 text-gold-primary ml-2 animate-pulse" />
                  </h3>
                  <p className="mb-4 text-foreground">{job.description}</p>
                  <p className="text-sm text-foreground mb-2">
                    Location: {job.location}
                  </p>
                  {job.salary && (
                    <p className="text-sm text-foreground mb-4">
                      Salary: {job.salary}
                    </p>
                  )}
                  <Link to={`/careers/${job.slug}`}>
                    <Button variant="gold" className="w-full">
                      View Details & Apply
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;
