import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceDetail {
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: ServiceFeature[];
  benefits: string[];
  process: { step: string; description: string }[];
  whyChooseUs: string[];
  estimatedTimeline: string;
  startingPrice: string;
}

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceDetail: ServiceDetail | null;
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  serviceDetail,
}) => {
  if (!serviceDetail) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto p-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 rounded-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber blur-[100px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500 blur-[100px]"
          />
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-8 pb-6 border-b border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber/20 to-purple-500/20" />
          <div className="relative z-10">
            <DialogTitle className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              {serviceDetail.title}
            </DialogTitle>
            <p className="text-lg text-gray-300 leading-relaxed">
              {serviceDetail.shortDescription}
            </p>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="relative z-10 p-8 space-y-8">
          {/* Full Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-amber to-orange-500 rounded-full" />
              Overview
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {serviceDetail.fullDescription}
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceDetail.features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group bg-white/5 hover:bg-white/10 rounded-xl p-5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber to-orange-500 rounded-lg flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1 group-hover:text-amber transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits & Process Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                Benefits
              </h3>
              <ul className="space-y-3">
                {serviceDetail.benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3 text-white"
                  >
                    <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                Our Process
              </h3>
              <div className="space-y-4">
                {serviceDetail.process.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{step.step}</h4>
                      <p className="text-gray-400 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-amber/10 via-orange-500/10 to-purple-500/10 rounded-xl p-6 border border-amber/20"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-gradient-to-b from-amber to-orange-500 rounded-full" />
              Why Choose Medha Tech Solutions?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {serviceDetail.whyChooseUs.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-2 text-gray-300 bg-white/5 rounded-lg px-4 py-2"
                >
                  <span className="w-2 h-2 bg-amber rounded-full" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-amber to-orange-500 text-slate-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
              onClick={() => {
                onClose();
                document
                  .getElementById('contact')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started Today
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </motion.button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;
