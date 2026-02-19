import { Navbar } from '@/components/layout/Navbar';
import Jobs from '@/components/sections/Jobs';
import { Footer } from '@/components/layout/Footer';

const JobsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Jobs />
      <Footer />
    </div>
  );
};

export default JobsPage;
