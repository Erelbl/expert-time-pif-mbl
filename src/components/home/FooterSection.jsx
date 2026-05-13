import React from "react";
import { Sparkles } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-primary text-primary-foreground py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-xl font-bold">Expert Time</span>
            </div>
            <p className="text-primary-foreground/50 text-sm">
              מתוך הקהילה, לקהילה — יוזמת בוגרי הופמן קופמן
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-primary-foreground/40 text-sm">
              © {new Date().getFullYear()} Expert Time | Hoffman Kofman Alumni
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}