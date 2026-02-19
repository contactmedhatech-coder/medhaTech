import { motion, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Blog } from '@/data/blogs';
import { ArticleModal } from '@/components/ArticleModal';
import { useRealtimeBlogs } from '@/hooks/useRealtimeBlogs';

export const Blogs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedArticle, setSelectedArticle] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { blogs, loading, error } = useRealtimeBlogs({
    publishedOnly: true,
    limit: 3,
  });

  const handleReadArticle = (blog: Blog) => {
    setSelectedArticle(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedArticle(null), 300);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 * index }}
          className="group relative p-8 bg-card rounded-2xl border border-gold-primary/20 overflow-hidden"
        >
          <div className="relative z-10">
            {/* Skeleton for gradient background */}
            <Skeleton className="h-48 w-full rounded-t-2xl mb-6" />

            {/* Content skeleton */}
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );

  return (
    <section
      id="blogs"
      className="section-padding bg-navy relative overflow-hidden"
      ref={ref}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />

      <div className="container-custom">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-gold-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            Our Blog
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 text-white">
            Latest Insights & <span className="gradient-text">Tech Trends</span>
          </h2>
          <div className="w-20 h-1 bg-amber rounded-full mb-6"></div>
          <p className="text-lg text-white leading-relaxed mb-6">
            Stay updated with the latest trends, best practices, and insights in
            software development, cloud computing, and emerging technologies.
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Blogs grid */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            blogs.map((blog, index) => (
              <motion.div
                key={blog.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * index }}
                className="group relative p-8 bg-card rounded-2xl border border-gold-primary hover:border-gold-primary/50 transition-all duration-500 hover-lift overflow-hidden"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Gradient background with blog image */}
                  <div
                    className={`h-48 bg-cover bg-center relative overflow-hidden rounded-t-2xl ${
                      blog.imageUrl
                        ? ''
                        : 'bg-gradient-to-br from-gold-primary/20 to-navy'
                    }`}
                    style={
                      blog.imageUrl
                        ? { backgroundImage: `url(${blog.imageUrl})` }
                        : undefined
                    }
                  >
                    {/* Dark overlay for better text readability if image exists */}
                    {blog.imageUrl && (
                      <div className="absolute inset-0 bg-navy/50" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!blog.imageUrl && (
                        <span className="text-6xl font-bold font-display text-white/30">
                          {blog.title.charAt(0)}
                        </span>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gold-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        variant="gold"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleReadArticle(blog)}
                      >
                        Read Article
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-gold-primary font-medium uppercase tracking-wider">
                          {blog.category}
                        </span>
                        <h3 className="text-xl font-bold font-display mt-1 text-gold-primary transition-colors">
                          {blog.title}
                        </h3>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gold-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>

                    <p className="text-sm text-foreground leading-relaxed mb-4">
                      {blog.description}
                    </p>

                    {/* Date and read time */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium bg-gold-primary/10 rounded-full text-gold-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button
            variant="gold"
            size="lg"
            onClick={() => (window.location.href = '/articles')}
          >
            View All Articles
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};
