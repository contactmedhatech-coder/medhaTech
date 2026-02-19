import { X } from 'lucide-react';
import { Blog } from '@/data/blogs';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ArticleModalProps {
  article: Blog | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleModal = ({
  article,
  isOpen,
  onClose,
}: ArticleModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!article) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-5xl max-h-[92vh] bg-card rounded-2xl shadow-2xl border border-gold-primary/30 overflow-hidden flex flex-col"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Hero Image Section */}
              <div className="relative h-52 md:h-64 lg:h-72 w-full flex-shrink-0 overflow-hidden">
                {article.imageUrl ? (
                  <>
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Dark gradient overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/85 to-[#0a1628]/30" />
                  </>
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${article.color || 'from-gold-primary/30 to-navy'}`}
                  />
                )}

                {/* Title overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  {/* Left side - Category, Title, Date, Read Time */}
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-gold-primary text-navy rounded-full uppercase tracking-wider mb-3 shadow-lg">
                      {article.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-white drop-shadow-xl mb-3">
                      {article.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-white/90">
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                  {/* Right side - Tags */}
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-gold-primary/20 border border-gold-primary/40 rounded-full text-gold-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar-dark">
                {/* Blog Content */}
                <div className="p-6 md:p-8">
                  <div
                    className="prose prose-invert prose-gold max-w-none
                      prose-headings:text-gold-primary prose-headings:font-display
                      prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                      prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-4
                      prose-ul:text-foreground/90 prose-ul:my-4
                      prose-li:my-2
                      prose-strong:text-gold-primary prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 bg-card/95 backdrop-blur-md border-t border-gold-primary/20 p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground hidden md:block">
                    Thanks for reading! Scroll to top to explore more.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-gold-primary text-navy font-semibold rounded-lg hover:bg-gold-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
