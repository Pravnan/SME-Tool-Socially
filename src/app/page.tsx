import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BodySection1 from '@/components/BodySection1';
import BodySection2 from '@/components/BodySection2';
import BodySection3 from '@/components/BodySection3';
import Footer from '@/components/Footer';
export default function Home() {
  return (
    <div className="bg-white">

      <Navbar />
          <HeroSection />
          <BodySection1 />
                   <BodySection2 />
                   <BodySection3 />
                  <Footer />
      {/* Other page content */}
    </div>
  );
}
