import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServicesSection from "@/components/services-section";
import DashboardPreview from "@/components/dashboard-preview";
import DigitalContracts from "@/components/digital-contracts";
import ReferralSystem from "@/components/referral-system";
import PartnersSection from "@/components/partners-section";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import { MessageCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <DashboardPreview />
      <DigitalContracts />
      <ReferralSystem />
      <PartnersSection />
      <Testimonials />
      <Footer />
      
      {/* Floating Action Button */}
      <button className="fixed bottom-8 left-8 floating-button w-16 h-16 rounded-full text-white animate-bounce-subtle z-40">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
