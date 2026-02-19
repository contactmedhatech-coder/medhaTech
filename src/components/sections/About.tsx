import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: 'fi fi-br-users',
    title: 'Understanding Your Vision',
    description:
      'We listen, research, and analyze to align with your goals and business objectives.',
  },
  {
    icon: 'fi fi-br-laptop',
    title: 'Design & Development',
    description:
      'We craft user-centric applications for maximum engagement and performance.',
  },
  {
    icon: 'fi fi-br-chart-line-up',
    title: 'Growth-Driven Marketing',
    description:
      "We amplify your brand's reach and impact through strategic digital marketing.",
  },
  {
    icon: 'fi fi-br-trophy',
    title: 'Commitment to Excellence',
    description:
      'We ensure quality, efficiency, and long-term success for every project.',
  },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden bg-navy"
      ref={ref}
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-ice-blue/5 to-transparent" />

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-white font-semibold text-sm tracking-wider uppercase mb-4 block">
              About Us
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 text-white">
              Your Vision, <span className="text-amber">Our Mission</span>
            </h2>
            <div className="w-20 h-1 bg-amber rounded-full mb-6"></div>
            <p className="text-lg text-white leading-relaxed mb-6">
              At Medha Tech, we believe that every great idea deserves a
              powerful digital presence. Your vision is the foundation of
              innovation, and our mission is to bring it to life with creative
              design, seamless development, and strategic digital marketing.
            </p>
            <p className="text-slate-grey leading-relaxed mb-8">
              It starts with an understanding of your business problem and
              goals. We create a plan to build your app from the ground up,
              selecting trusted members from our staff to provide comprehensive
              app development services on demand.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: '150+', label: 'Projects' },
                { value: '230+', label: 'Clients' },
                { value: '4+', label: 'Years' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center p-4 bg-off-white rounded-xl border border-slate-grey"
                >
                  <div className="text-2xl md:text-3xl font-bold font-display text-navy">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-grey mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right content - Feature grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4 md:gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group p-6 bg-off-white rounded-2xl border border-slate-grey hover:border-slate-grey/50 transition-all duration-300 hover-lift"
              >
                <i
                  className={`fi ${feature.icon} text-4xl text-amber mb-4 block`}
                />
                <h3 className="font-semibold font-display text-lg mb-2 text-navy">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-grey leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
