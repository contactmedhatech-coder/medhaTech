import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from '@/config/emailjs';

// Custom toast component for success
const SuccessToast = () => (
  <div className="flex items-start gap-4 p-4">
    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-lg font-semibold text-foreground mb-1">
        Message Sent Successfully!
      </h4>
      <p className="text-sm text-muted-foreground">
        Thank you for reaching out. We'll get back to you within 24 hours.
      </p>
    </div>
  </div>
);

// Custom toast component for error
const ErrorToast = ({ message }: { message: string }) => (
  <div className="flex items-start gap-4 p-4">
    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-lg font-semibold text-foreground mb-1">
        Validation Error
      </h4>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);

// Email validation regex
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const contactInfo = [
  {
    icon: MapPin,
    title: 'Our Office',
    content: 'Kathmandu, Nepal',
    subContent: 'Gopikrishna Road, 44600',
  },
  {
    icon: Phone,
    title: 'Phone',
    content: '+977 9000000000',
    subContent: 'Sun - Fri, 7am - 3pm',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'contact.medhatech@gmail.com',
    subContent: 'We reply within 24 hours',
  },
];

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate a single field
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Please enter your name';
        if (value.trim().length < 2)
          return 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Please enter your email';
        if (!isValidEmail(value.trim()))
          return 'Please enter a valid email address';
        break;
      case 'subject':
        if (!value.trim()) return 'Please enter a subject';
        if (value.trim().length < 3)
          return 'Subject must be at least 3 characters';
        break;
      case 'message':
        if (!value.trim()) return 'Please enter your message';
        if (value.trim().length < 10)
          return 'Message must be at least 10 characters';
        break;
    }
    return undefined;
  };

  // Validate all fields
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    newErrors.name = validateField('name', formData.name);
    newErrors.email = validateField('email', formData.email);
    newErrors.subject = validateField('subject', formData.subject);
    newErrors.message = validateField('message', formData.message);

    // Remove undefined values
    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    return newErrors;
  };

  // Handle input change with validation
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  // Handle blur to mark field as touched
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {
      name: true,
      email: true,
      subject: true,
      message: true,
    };
    setTouched(allTouched);

    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);

    // If there are errors, show validation error toast
    if (Object.keys(formErrors).length > 0) {
      const firstError = Object.values(formErrors)[0];
      toast.custom(
        () => (
          <ErrorToast
            message={firstError || 'Please fill in all required fields'}
          />
        ),
        {
          duration: 5000,
          position: 'bottom-right',
        },
      );
      return;
    }

    setIsLoading(true);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'contact.medhatech@gmail.com',
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY,
      );

      toast.custom(() => <SuccessToast />, {
        duration: 5000,
        position: 'bottom-right',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({});
    } catch (error) {
      console.error('Error sending email:', error);
      toast.custom(
        () => (
          <ErrorToast message="Failed to send message. Please try again or email us directly." />
        ),
        {
          duration: 5000,
          position: 'bottom-right',
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="section-padding bg-background relative overflow-hidden"
      ref={ref}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-primary/50 to-transparent" />

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold-primary font-semibold text-sm tracking-wider uppercase mb-4 block">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-6">
              Let's <span className="gradient-text">Connect</span>
            </h2>
            <p className="text-lg text-foreground leading-relaxed mb-10">
              Have a project in mind? We'd love to hear about it. Get in touch
              and let's create something amazing together.
            </p>

            {/* Contact cards */}
            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-card rounded-xl border border-gold-primary hover:border-gold-primary/50 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-gold-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-foreground mb-1">
                      {item.title}
                    </div>
                    <div className="font-semibold text-gold-primary">
                      {item.content}
                    </div>
                    <div className="text-sm text-foreground">
                      {item.subContent}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl border border-gold-primary p-8 md:p-10">
              <h3 className="text-2xl font-bold font-display mb-6 text-gold-primary">
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-input border-gold-primary focus:border-gold-primary ${
                          touched.name && errors.name
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      {touched.name && errors.name && (
                        <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        name="email"
                        placeholder="contact.medhatech@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`bg-input border-gold-primary focus:border-gold-primary ${
                          touched.email && errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }`}
                      />
                      {touched.email && errors.email && (
                        <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="subject"
                      placeholder="Project Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-input border-gold-primary focus:border-gold-primary ${
                        touched.subject && errors.subject
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    {touched.subject && errors.subject && (
                      <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.subject}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-medium mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Textarea
                      name="message"
                      placeholder="Tell us about your project..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`bg-input border-gold-primary focus:border-gold-primary resize-none ${
                        touched.message && errors.message
                          ? 'border-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    {touched.message && errors.message && (
                      <div className="absolute -bottom-5 left-0 flex items-center gap-1 text-red-500 text-xs">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
