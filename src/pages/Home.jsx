import React from "react";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import CurrentExpertsSection from "@/components/home/CurrentExpertsSection";
import ProcessSection from "@/components/home/ProcessSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PreviousExpertsSection from "@/components/home/PreviousExpertsSection";
import NominationSection from "@/components/home/NominationSection";
import FooterSection from "@/components/home/FooterSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <CurrentExpertsSection />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <PreviousExpertsSection />
      <NominationSection />
      <FooterSection />
    </div>
  );
}