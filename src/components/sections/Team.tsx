import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Linkedin, Mail, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const team = [
  {
    name: 'Er. Arjun Thapa',
    role: 'CEO / Managing Director',
    image: '/teams/arjun-thapa.jpg',
  },
  {
    name: 'Ranjeeta Bhattarai',
    role: 'HR Head / People Operations',
    image: '/teams/ranjeeta-bhattarai.jpg',
  },
  {
    name: 'Sahil Khadka',
    role: 'Chief Technology Officer (CTO)',
    image: '/teams/sahil-khadka.jpg',
  },
  {
    name: 'Prajwal Limbu',
    role: 'VP of Technology / Engineering Manager',
    image: '/teams/prajwal-limbu.jpg',
  },
];

const testimonials = [
  {
    quote:
      'The collaborative environment allows us to innovate and grow professionally. The leadership truly values our input and provides opportunities to work on cutting-edge technologies.',
    name: 'Aarav Sharma',
    role: 'Senior Frontend Developer',
    initial: 'A',
  },
  {
    quote:
      'The culture emphasizes creativity and user-centered design, giving me the freedom to create intuitive and beautiful interfaces. Design thinking is integral here.',
    name: 'Priya Adhikari',
    role: 'UI/UX Designer',
    initial: 'P',
  },
  {
    quote:
      "I've had the opportunity to architect robust systems that scale effectively. The team's emphasis on clean code has refined my approach to software development.",
    name: 'Rohan Thapa',
    role: 'Backend Developer',
    initial: 'R',
  },
  {
    quote:
      'Working at Medha Tech has given me the chance to work on diverse projects that challenge my skills daily. The mentorship culture is unmatched.',
    name: 'Sneha Ray',
    role: 'Full Stack Developer',
    initial: 'S',
  },
  {
    quote:
      'The emphasis on work-life balance and continuous learning makes this an ideal place for developers who want to grow their careers.',
    name: 'Karan Singh',
    role: 'DevOps Engineer',
    initial: 'K',
  },
];

// Duplicate testimonials for infinite scroll effect
const duplicatedTestimonials = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
];

export const Team = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const scrollAmount = 380; // Width of card + gap

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (direction === 'right') {
        const newScroll = Math.min(
          container.scrollLeft + scrollAmount,
          maxScroll,
        );
        container.scrollTo({ left: newScroll, behavior: 'smooth' });
      } else {
        const newScroll = Math.max(container.scrollLeft - scrollAmount, 0);
        container.scrollTo({ left: newScroll, behavior: 'smooth' });
      }
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;

    const autoScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount * 0.5, behavior: 'smooth' });
      }
    };

    const scrollInterval = setInterval(autoScroll, 2500);

    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling]);

  return (
    <section
      id="team"
      className="section-padding bg-background relative overflow-hidden"
      ref={ref}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />

      {/* Background glow effects */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-navy/5 blur-[100px]" />
      <div className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full bg-amber/5 blur-[100px]" />

      <div className="container-custom">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-gold-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
            Our Leadership
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4">
            Meet Our <span className="gradient-text">Visionary Team</span>
          </h2>
          <div className="w-20 h-1 bg-amber rounded-full mb-6"></div>
          <p className="text-lg text-foreground">
            We're looking forward to collaborating on innovative solutions. Get
            to know our visionary leaders who drive Medha Tech forward.
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              className="group text-center"
            >
              <div className="relative mb-6 mx-auto w-36 h-36">
                {/* Team member image */}
                <div className="w-full h-full rounded-2xl overflow-hidden bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold font-display">${member.name.charAt(0)}</div>`;
                      }
                    }}
                  />
                </div>
                {/* Social links overlay */}
                <div className="absolute inset-0 rounded-2xl bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <a
                    href="https://np.linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gold-primary/20 hover:bg-gold-primary/40 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-gold-primary" />
                  </a>
                  <a
                    href="https://mail.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gold-primary/20 hover:bg-gold-primary/40 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-gold-primary" />
                  </a>
                </div>
              </div>
              <h3 className="text-lg font-bold font-display mb-1 text-gold-primary">
                {member.name}
              </h3>
              <p className="text-sm text-foreground">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* What Our Team Says - Marquee Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="flex items-center justify-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold font-display text-navy">
              What Our <span className="text-amber">Team</span> Says
            </h3>
          </div>

          {/* Scrollable container with hover navigation */}
          <div
            className="relative group"
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
          >
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            {/* Left scroll button - appears on hover */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* Right scroll button - appears on hover */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-7 h-7" />
            </button>

            {/* Testimonials scroll container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[320px] md:w-[380px]"
                >
                  <div className="relative p-6 md:p-8 bg-gradient-to-br from-card to-card/80 rounded-2xl border border-gold-primary/20 hover:border-gold-primary/50 transition-all duration-500 group">
                    {/* Decorative quote icon */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-navy/10 flex items-center justify-center group-hover:bg-navy/20 transition-colors">
                      <Quote className="w-6 h-6 text-gold-primary" />
                    </div>

                    {/* Quote text */}
                    <p className="text-foreground leading-relaxed mb-6 relative z-10">
                      "{testimonial.quote}"
                    </p>

                    {/* Author info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gold-primary/10">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy to-navy/80 flex items-center justify-center text-white font-bold text-lg ring-2 ring-gold-primary/20">
                        {testimonial.initial}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-navy">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
