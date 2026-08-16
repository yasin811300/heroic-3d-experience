import Header from "@/components/Header";
import CinematicHero from "@/components/CinematicHero";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import PortfolioSection from "@/components/PortfolioSection";
import ProcessSection from "@/components/ProcessSection";
import TeamSection from "@/components/TeamSection";
import SmartCardSection from "@/components/SmartCardSection";
import ClientsSection from "@/components/ClientsSection";
import PricingSection from "@/components/PricingSection";
import TechSection from "@/components/TechSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import MusicPlayer from "@/components/MusicPlayer";
import CertificationsSection from "@/components/CertificationsSection";

import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  // Reveal on scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>آژانس دیجیتال مارکتینگ ازما | طراحی سایت، سئو و مدیریت شبکه‌های اجتماعی در همدان</title>
        <meta name="description" content="آژانس ازما، تخصصی‌ترین آژانس دیجیتال مارکتینگ غرب کشور. طراحی سایت، سئو، مدیریت اینستاگرام، طراحی لوگو و برندینگ با استانداردهای جهانی. +۲۵۰ پروژه موفق" />
        <meta name="keywords" content="آژانس دیجیتال مارکتینگ, طراحی سایت همدان, سئو, مدیریت اینستاگرام, طراحی لوگو, برندینگ, دیجیتال مارکتینگ ایران" />
        <link rel="canonical" href="https://azmamarkteng.ir" />
        <meta property="og:title" content="آژانس دیجیتال مارکتینگ ازما | طلایی کردن برندها" />
        <meta property="og:description" content="تخصصی‌ترین آژانس دیجیتال مارکتینگ غرب کشور با +۲۵۰ پروژه موفق" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://azmamarkteng.ir" />
        <meta property="og:image" content="https://azmamarkteng.ir/logo.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="آژانس ازما | دیجیتال مارکتینگ حرفه‌ای" />
        <meta name="twitter:description" content="طراحی سایت، سئو و مدیریت شبکه‌های اجتماعی با استانداردهای جهانی" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DigitalMarketingAgency",
            "name": "آژانس دیجیتال مارکتینگ ازما",
            "url": "https://azmamarkteng.ir",
            "logo": "https://azmamarkteng.ir/logo.webp",
            "description": "تخصصی‌ترین آژانس دیجیتال مارکتینگ غرب کشور",
            "telephone": "09914601322",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "همدان",
              "addressCountry": "IR"
            },
            "sameAs": [
              "https://instagram.com/azmamarkteng"
            ],
            "founder": {
              "@type": "Person",
              "name": "یاسین سالارناظم"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "250"
            }
          })}
        </script>
      </Helmet>
      
      <div ref={mainRef} className="min-h-screen bg-background [overflow-x:clip]">
        {/* Noise Overlay */}
        <div className="noise-overlay" />
        
        {/* Music Player */}
        <MusicPlayer />
        
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main>
          <CinematicHero />
          <ClientsSection />
          <ServicesSection />
          <SmartCardSection />
          
          <StatsSection />
          <CertificationsSection />
          <PortfolioSection />
          <ProcessSection />
          <PricingSection />
          <TechSection />
          <TeamSection />
          <TestimonialsSection />
          <BlogSection />
          <FAQSection />
          <ContactSection />
          <CTASection />
        </main>

        {/* Footer */}
        <Footer />

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </>
  );
};

export default Index;
