import React from "react";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import CurrentExpertsSection from "@/components/home/CurrentExpertsSection";
import ProcessSection from "@/components/home/ProcessSection";
import PreviousExpertsSection from "@/components/home/PreviousExpertsSection";
import NominationSection from "@/components/home/NominationSection";
import VolunteersListSection from "@/components/home/VolunteersListSection";
import FooterSection from "@/components/home/FooterSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <CurrentExpertsSection />
      <ProcessSection />
      <PreviousExpertsSection />
      <NominationSection />
      <VolunteersListSection />
      <FooterSection />
    </div>
  );
}