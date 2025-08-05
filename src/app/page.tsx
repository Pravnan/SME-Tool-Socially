import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
export default function Home() {
  return (
    <div className="bg-white">

      <Navbar />
          <HeroSection />
      {/* Other page content */}
    </div>
  );
}
