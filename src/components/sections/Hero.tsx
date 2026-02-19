import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-[50vh] flex items-center overflow-hidden bg-off-white"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-navy/10 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-ice-blue/20 blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line-color)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="container-custom relative z-10 pt-20 md:pt-32 lg:pt-44 pb-12 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-navy/10 border border-navy/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-navy animate-pulse" />
              <span className="text-sm text-navy font-medium">
                Your Technology Growth Partner
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-tight mb-4 text-center lg:text-left text-amber"
            >
              Elevation<span className="text-navy">Through</span>{' '}
              <br className="hidden md:block" />
              Code.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="w-32 h-1 bg-amber rounded-full mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-grey max-w-xl mb-8 leading-relaxed text-center lg:text-left"
            >
              We help businesses imagine and create the digital experiences of
              tomorrow. Through the fusion of startup agility, enterprise
              standards, and world-class engineering.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                variant="gold"
                size="lg"
                className="group h-10 md:h-14 px-6 md:px-10 text-sm md:text-base py-2 md:py-3 flex items-center gap-2"
                onClick={() =>
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Build With Us
                <i className="fi fi-br-arrow-small-right text-2xl group-hover:translate-x-1.5 transition-transform flex items-center"></i>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 mt-12 pt-8 border-t border-border/50"
            >
              {[
                { value: '150+', label: 'Projects Delivered' },
                { value: '50+', label: 'Team Members' },
                { value: '4+', label: 'Years Experience' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-bold font-display text-navy">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-grey mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right content - Abstract visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full border border-navy/20 animate-[spin_20s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-navy animate-pulse" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-60 h-60 rounded-full border border-navy/30 animate-spin-reverse">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-ice-blue animate-pulse" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-navy/10 backdrop-blur-xl flex items-center justify-center">
                  <span className="text-5xl font-bold font-display text-navy">
                    MT
                  </span>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-10 right-10 glass-card rounded-xl p-4"
              >
                <div className="text-sm font-medium">Web Development</div>
                <div className="text-xs text-muted-foreground mt-1">
                  React · Node · Cloud
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-20 left-0 glass-card rounded-xl p-4"
              >
                <div className="text-sm font-medium">Mobile Apps</div>
                <div className="text-xs text-muted-foreground mt-1">
                  iOS · Android · Flutter
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-navy/30 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-navy"
          />
        </div>
      </motion.div>
    </section>
  );
};
