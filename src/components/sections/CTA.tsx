import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchActiveJobs } from '@/lib/supabase-functions';

export const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchActiveJobs,
  });
  const jobCount = jobs?.length || 0;

  return (
    <section
      className="section-padding bg-[#001F4D] relative overflow-hidden"
      ref={ref}
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%, rgba(255,255,255,0.05)_0%, transparent_50%), radial-gradient(circle_at_75%_75%, rgba(255,255,255,0.05)_0%, transparent_50%), linear-gradient(45deg, rgba(255,215,0,0.03)_0%, transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFC107]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-6xl font-bold font-display mb-6 text-white"
          >
            Connect with our <span className="text-[#FFC107]">team</span>
          </motion.h2>

          {/* Highlighted line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-24 h-1 bg-[#FFC107] mx-auto mb-8 rounded-full"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Ready to start your next project or join our talented team? We're
            here to help you succeed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-[#FFC107] text-black hover:bg-[#FFD700] font-bold transition-all group min-w-[200px]"
              asChild
            >
              <a href="#contact">
                Connect with our team
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold transition-all group min-w-[200px]"
              asChild
            >
              <Link to="/jobs">
                <Briefcase className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                View Open Jobs
              </Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 pt-8 border-t border-white/10"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#FFC107]">
                50+
              </div>
              <div className="text-sm text-gray-400 mt-1">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#FFC107]">
                150+
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Projects Completed
              </div>
            </div>
            {jobCount > 0 && (
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#FFC107]">
                  {jobCount}+
                </div>
                <div className="text-sm text-gray-400 mt-1">Open Positions</div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
