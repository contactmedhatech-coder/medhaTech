import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import ArticleModal, { ServiceDetail } from './ArticleModal';

const servicesData: ServiceDetail[] = [
  {
    title: 'Web Application Development',
    shortDescription:
      'From responsive websites to complex web applications, we deliver fast, secure, and scalable solutions using modern frameworks.',
    fullDescription:
      'Our expert developers specialize in building cutting-edge web applications that drive business growth. We use the latest technologies including React, Next.js, and Node.js to create robust, scalable, and secure web solutions. Every project is crafted with attention to performance optimization, accessibility standards, and future scalability needs.',
    features: [
      {
        icon: '🖥️',
        title: 'Custom Web Apps',
        description:
          'Tailor-made web applications designed specifically for your business requirements and workflows.',
      },
      {
        icon: '🛒',
        title: 'E-commerce Solutions',
        description:
          'Full-featured online stores with secure payment gateways, inventory management, and analytics.',
      },
      {
        icon: '📝',
        title: 'CMS Development',
        description:
          'Easy-to-manage content systems with intuitive interfaces for non-technical users.',
      },
      {
        icon: '🔗',
        title: 'API Integration',
        description:
          'Seamless third-party integrations and custom API development for extended functionality.',
      },
      {
        icon: '⚡',
        title: 'Performance Optimization',
        description:
          'Lightning-fast load times and optimized user experience for maximum engagement.',
      },
      {
        icon: '🔒',
        title: 'Security First',
        description:
          'Enterprise-grade security measures including SSL, encryption, and threat protection.',
      },
    ],
    benefits: [
      'Increase customer engagement with interactive features',
      'Reduce operational costs through automation',
      'Improve brand visibility and credibility',
      'Scale effortlessly as your business grows',
      '24/7 accessibility for global audiences',
      'Real-time data insights and analytics',
    ],
    process: [
      {
        step: 'Discovery',
        description:
          'We analyze your requirements, target audience, and business goals.',
      },
      {
        step: 'Design',
        description:
          'Creating wireframes, prototypes, and visual designs for approval.',
      },
      {
        step: 'Development',
        description:
          'Agile development with regular updates and transparent communication.',
      },
      {
        step: 'Testing',
        description: 'Comprehensive QA testing across devices and browsers.',
      },
      {
        step: 'Launch',
        description:
          'Smooth deployment with post-launch support and monitoring.',
      },
    ],
    whyChooseUs: [
      '5+ years of web development expertise',
      '150+ successful project deliveries',
      'Expert React & Next.js developers',
      'Fast turnaround times',
      'Competitive pricing',
      'Lifetime support options',
    ],
    estimatedTimeline: '4-12 weeks',
    startingPrice: '$5,000',
  },
  {
    title: 'Mobile App Development',
    shortDescription:
      'We create beautiful, intuitive mobile applications for iOS and Android using React Native, Flutter, and native technologies.',
    fullDescription:
      'Transform your ideas into powerful mobile applications that delight users. Our team excels in developing cross-platform and native apps that perform flawlessly across all devices. From concept to launch, we ensure your app stands out in the crowded app stores with stunning UI/UX and robust functionality.',
    features: [
      {
        icon: '🍎',
        title: 'iOS Development',
        description:
          'Native Swift/SwiftUI apps optimized for Apple devices and App Store guidelines.',
      },
      {
        icon: '🤖',
        title: 'Android Development',
        description:
          'Kotlin/Java apps following Material Design principles for optimal UX.',
      },
      {
        icon: '🔄',
        title: 'Cross-Platform',
        description:
          'React Native & Flutter apps with shared codebase for iOS & Android.',
      },
      {
        icon: '🔧',
        title: 'App Maintenance',
        description:
          'Ongoing support, updates, and performance monitoring post-launch.',
      },
      {
        icon: '📱',
        title: 'UI/UX Design',
        description:
          'Intuitive interfaces designed with user research and best practices.',
      },
      {
        icon: '🚀',
        title: 'App Store Optimization',
        description: 'Strategic ASO to improve visibility and downloads.',
      },
    ],
    benefits: [
      'Reach customers on their preferred devices',
      'Increase customer engagement and loyalty',
      'Build a strong mobile presence',
      'Collect valuable user data',
      'Enable offline functionality',
      'Integrate with device features (camera, GPS, etc.)',
    ],
    process: [
      {
        step: 'Concept',
        description:
          'Brainstorming and defining app features based on your vision.',
      },
      {
        step: 'Wireframing',
        description: 'Creating detailed user flow diagrams and screen layouts.',
      },
      {
        step: 'Design',
        description:
          'High-fidelity UI designs with animations and interactions.',
      },
      {
        step: 'Development',
        description: 'Iterative coding with continuous feedback and testing.',
      },
      {
        step: 'Deployment',
        description: 'App Store submission and launch marketing support.',
      },
    ],
    whyChooseUs: [
      'React Native & Flutter specialists',
      'Published apps with 100K+ downloads',
      'Clean, maintainable code architecture',
      'Fast development cycles',
      'Transparent pricing model',
      'Post-launch success focus',
    ],
    estimatedTimeline: '6-16 weeks',
    startingPrice: '$8,000',
  },
  {
    title: 'UI/UX Design',
    shortDescription:
      'Our design team creates intuitive, engaging user experiences with a focus on usability, accessibility, and visual appeal.',
    fullDescription:
      'Great design is at the heart of every successful digital product. Our award-winning designers blend creativity with data-driven insights to craft experiences that users love. We follow human-centered design principles to ensure your product is not just beautiful, but truly functional and accessible to all.',
    features: [
      {
        icon: '🔍',
        title: 'User Research',
        description:
          'In-depth analysis of user behaviors, needs, and pain points.',
      },
      {
        icon: '📐',
        title: 'Wireframing',
        description: 'Low-fidelity blueprints to establish structure and flow.',
      },
      {
        icon: '🎨',
        title: 'Prototyping',
        description:
          'Interactive prototypes for user testing and stakeholder feedback.',
      },
      {
        icon: '🎯',
        title: 'Design Systems',
        description:
          'Comprehensive component libraries for consistent branding.',
      },
      {
        icon: '♿',
        title: 'Accessibility',
        description: 'WCAG-compliant designs for inclusive user experiences.',
      },
      {
        icon: '📊',
        title: 'Usability Testing',
        description: 'Real-user testing to validate and refine designs.',
      },
    ],
    benefits: [
      'Increase user satisfaction and retention',
      'Reduce support and training costs',
      'Strengthen brand identity',
      'Improve conversion rates',
      'Competitive market advantage',
      'Future-proof design foundation',
    ],
    process: [
      {
        step: 'Research',
        description:
          'Understanding users, competitors, and market opportunities.',
      },
      {
        step: 'Ideation',
        description: 'Brainstorming creative solutions and concepts.',
      },
      {
        step: 'Design',
        description: 'Creating high-fidelity designs with attention to detail.',
      },
      {
        step: 'Testing',
        description: 'User testing to validate and iterate on designs.',
      },
      {
        step: 'Handoff',
        description: 'Developer-ready specs and asset delivery.',
      },
    ],
    whyChooseUs: [
      'Award-winning design team',
      'Data-driven design approach',
      'Figma & Adobe XD experts',
      '100+ design systems created',
      'Fast revision cycles',
      'User-centric methodology',
    ],
    estimatedTimeline: '2-6 weeks',
    startingPrice: '$3,000',
  },
  {
    title: 'Custom Software Development',
    shortDescription:
      'Build digital experiences people love to use with battle-tested processes to systematically design and develop software.',
    fullDescription:
      'Every business has unique challenges. Our custom software development services deliver tailored solutions that address your specific needs. From enterprise applications to specialized SaaS products, we build software that streamlines operations, reduces costs, and drives growth.',
    features: [
      {
        icon: '🏢',
        title: 'Enterprise Solutions',
        description:
          'Scalable systems designed for large organizations and complex workflows.',
      },
      {
        icon: '☁️',
        title: 'SaaS Products',
        description:
          'Multi-tenant cloud applications with subscription-based monetization.',
      },
      {
        icon: '🔄',
        title: 'Legacy Modernization',
        description: 'Upgrading outdated systems with modern technologies.',
      },
      {
        icon: '🔗',
        title: 'System Integration',
        description: 'Connecting disparate systems for seamless data flow.',
      },
      {
        icon: '📈',
        title: 'Business Automation',
        description: 'Automating repetitive tasks and workflows.',
      },
      {
        icon: '📊',
        title: 'Analytics & Reporting',
        description: 'Custom dashboards and data visualization solutions.',
      },
    ],
    benefits: [
      'Eliminate inefficiencies and manual processes',
      'Gain competitive edge with unique features',
      'Improve data accuracy and security',
      'Scale operations without proportional costs',
      'Better decision-making with real-time insights',
      'Complete control over your software',
    ],
    process: [
      {
        step: 'Consultation',
        description: 'Understanding your business processes and challenges.',
      },
      {
        step: 'Planning',
        description:
          'Creating detailed specifications and technical architecture.',
      },
      {
        step: 'Development',
        description: 'Agile development with sprint demos and reviews.',
      },
      {
        step: 'Testing',
        description: 'Rigorous testing for functionality and security.',
      },
      {
        step: 'Deployment',
        description: 'Smooth transition and staff training.',
      },
    ],
    whyChooseUs: [
      'Full-stack development expertise',
      'Industry-specific solutions',
      'Enterprise-grade security',
      'Agile methodology',
      'Dedicated support team',
      'Long-term partnership approach',
    ],
    estimatedTimeline: '8-24 weeks',
    startingPrice: '$15,000',
  },
  {
    title: 'DevOps & Cloud',
    shortDescription:
      "We've built reliable CI/CD pipelines that enable rapid deployment while maintaining high quality using cutting-edge cloud technologies.",
    fullDescription:
      'Accelerate your software delivery with our DevOps and cloud solutions. We help organizations streamline their development and operations, reducing time-to-market while ensuring reliability, security, and scalability. Our expertise spans all major cloud platforms and DevOps tools.',
    features: [
      {
        icon: '☁️',
        title: 'AWS/GCP/Azure',
        description:
          'Multi-cloud strategies and optimized cloud infrastructure management.',
      },
      {
        icon: '🔄',
        title: 'CI/CD Pipeline',
        description: 'Automated build, test, and deployment workflows.',
      },
      {
        icon: '📦',
        title: 'Container Orchestration',
        description:
          'Kubernetes and Docker for scalable, resilient deployments.',
      },
      {
        icon: '🚀',
        title: 'Cloud Migration',
        description:
          'Seamless transition from on-premise to cloud infrastructure.',
      },
      {
        icon: '📊',
        title: 'Infrastructure as Code',
        description:
          'Terraform and CloudFormation for reproducible environments.',
      },
      {
        icon: '🔒',
        title: 'Security & Compliance',
        description: 'DevSecOps practices and compliance automation.',
      },
    ],
    benefits: [
      'Faster time-to-market for new features',
      'Reduced infrastructure costs',
      'Improved system reliability',
      'Enhanced security posture',
      'Better collaboration between teams',
      'Automatic scaling for demand spikes',
    ],
    process: [
      {
        step: 'Assessment',
        description: 'Analyzing current infrastructure and identifying gaps.',
      },
      {
        step: 'Strategy',
        description: 'Designing cloud architecture and DevOps roadmap.',
      },
      {
        step: 'Implementation',
        description: 'Setting up pipelines, infrastructure, and automation.',
      },
      {
        step: 'Optimization',
        description: 'Fine-tuning for performance and cost efficiency.',
      },
      {
        step: 'Monitoring',
        description: 'Implementing observability and alerting systems.',
      },
    ],
    whyChooseUs: [
      'Certified cloud architects',
      'Kubernetes experts',
      'GitOps methodology',
      '24/7 monitoring support',
      'Cost optimization specialists',
      'Security-first approach',
    ],
    estimatedTimeline: '4-12 weeks',
    startingPrice: '$6,000',
  },
  {
    title: 'Digital Marketing',
    shortDescription:
      "Our social media experts boost your brand's visibility, drive engagement, and achieve your business goals through strategic marketing.",
    fullDescription:
      'Grow your online presence with our comprehensive digital marketing services. We combine data-driven strategies with creative excellence to deliver measurable results. From SEO to social media, we help you connect with your audience and convert visitors into loyal customers.',
    features: [
      {
        icon: '🔍',
        title: 'SEO Optimization',
        description: 'Technical and content SEO to improve organic rankings.',
      },
      {
        icon: '📱',
        title: 'Social Media',
        description: 'Strategic social media management and content creation.',
      },
      {
        icon: '✍️',
        title: 'Content Strategy',
        description: 'Compelling content that resonates with your audience.',
      },
      {
        icon: '📊',
        title: 'Analytics',
        description: 'Data-driven insights and performance reporting.',
      },
      {
        icon: '💰',
        title: 'PPC Advertising',
        description: 'Targeted paid campaigns on Google and social platforms.',
      },
      {
        icon: '📧',
        title: 'Email Marketing',
        description: 'Automated campaigns and newsletter management.',
      },
    ],
    benefits: [
      'Increase brand awareness and reach',
      'Drive qualified traffic to your website',
      'Generate leads and conversions',
      'Build lasting customer relationships',
      'Measure ROI accurately',
      'Stay ahead of competitors',
    ],
    process: [
      {
        step: 'Audit',
        description: 'Analyzing current marketing presence and opportunities.',
      },
      {
        step: 'Strategy',
        description: 'Developing customized marketing plan and goals.',
      },
      {
        step: 'Execution',
        description: 'Implementing campaigns across selected channels.',
      },
      {
        step: 'Optimization',
        description: 'Continuous testing and performance improvements.',
      },
      {
        step: 'Reporting',
        description: 'Transparent reporting and strategic recommendations.',
      },
    ],
    whyChooseUs: [
      'Data-driven approach',
      'Certified marketing professionals',
      'Proven track record',
      'Transparent reporting',
      'Custom strategies',
      'Dedicated account managers',
    ],
    estimatedTimeline: 'Ongoing',
    startingPrice: '$1,500/mo',
  },
];

export const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ServiceDetail | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      id="services"
      className="section-padding bg-white relative overflow-hidden"
      ref={ref}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-30%] left-[-20%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber/20 to-transparent blur-[120px]"
        />
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-30%] right-[-20%] w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-purple-500/20 to-transparent blur-[120px]"
        />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />

      <div className="container-custom relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-amber font-semibold text-sm tracking-wider uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 text-slate-900">
            Services We're <span className="text-amber">Offering</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber to-orange-500 rounded-full mb-6 mx-auto" />
          <p className="text-lg text-slate-600">
            Choose the service that fits your business needs and growth stage.
            We deliver value, not just products.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className="group relative h-[420px] rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Layer 1: Image Layer (Default State) */}
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      index === 0
                        ? 'https://squashwebsiteprod-b8a4gfcqgmh2fmfn.westus-01.azurewebsites.net/wp-content/uploads/2021/12/header-background.jpg'
                        : index === 1
                          ? 'https://www.addevice.io/storage/ckeditor/uploads/images/65f840d316353_mobile.app.development.1920.1080.png'
                          : index === 2
                            ? 'https://s44783.pcdn.co/in/wp-content/uploads/sites/3/2022/05/ui-ux-scaled.jpg.optimal.jpg'
                            : index === 3
                              ? 'https://www.sphinx-solution.com/blog/wp-content/uploads/2019/06/successful-software-solutions.jpg'
                              : index === 4
                                ? 'https://5.imimg.com/data5/SELLER/Default/2021/11/AN/LC/CG/34152522/master-program-in-cloud-computing-and-devops.jpeg'
                                : 'https://certiprof.com/cdn/shop/articles/DIGITAL_MARKETING_BY_CERTIPROF.webp?v=1742398487'
                    })`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber/20 to-transparent opacity-50" />

                {/* Title at bottom-left */}
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <motion.h3
                    initial={{ y: 0 }}
                    className="text-2xl font-bold font-display text-white mb-2"
                  >
                    {service.title}
                  </motion.h3>
                  <p className="text-white/90 text-sm line-clamp-2">
                    {service.shortDescription}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    className="mt-4 flex items-center gap-2 text-amber font-semibold text-sm"
                  >
                    Learn More
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Layer 2: Hover Layer (Appears on Hover) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute inset-0"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber/10 via-transparent to-purple-500/10" />

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-amber/50 animate-pulse" />

                {/* Content */}
                <div className="relative h-full flex flex-col p-6 text-white">
                  {/* Description */}
                  <p className="text-gray-200 text-sm leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>
                  {/* Quick features */}
                  <ul className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <motion.li
                        key={feature.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-2 text-xs text-gray-300"
                      >
                        <span className="w-1.5 h-1.5 bg-amber rounded-full" />
                        {feature.title}
                      </motion.li>
                    ))}
                  </ul>
                  

 {/* Learn More Button */}
                  <div className="mt-auto pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-amber to-orange-500 text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => {
                        setModalContent(service);
                        setIsModalOpen(true);
                      }}
                    >
                      View Details
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Modal */}
        <ArticleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceDetail={modalContent}
        />
      </div>
    </section>
  );
};
