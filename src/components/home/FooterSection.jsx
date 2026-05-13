import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Settings } from "lucide-react";

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
          <div className="flex items-center gap-6">
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              <span>ניהול</span>
            </Link>
            <div className="h-8 w-px bg-primary-foreground/20" />
            <p className="text-primary-foreground/40 text-sm">
              © {new Date().getFullYear()} Expert Time
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}