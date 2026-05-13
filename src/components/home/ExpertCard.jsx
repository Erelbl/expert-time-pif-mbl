import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ExpertCard({ expert, index = 0 }) {
  const remaining = (expert.total_hours || 4) - (expert.booked_hours || 0);
  const isFull = remaining <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.12, duration: 0.6 }}
      className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
    >
      {/* Photo */}
      <div className="relative h-64 overflow-hidden bg-muted">
        {expert.photo_url ? (
          <img
            src={expert.photo_url}
            alt={expert.full_name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <span className="text-6xl font-bold text-primary/20">
              {expert.full_name?.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Industries badges */}
        {expert.industries?.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[calc(100%-2rem)]">
            {expert.industries.slice(0, 2).map((ind) => (
              <Badge key={ind} className="bg-accent/90 text-accent-foreground text-xs font-semibold backdrop-blur-sm">
                {ind}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-foreground mb-1">{expert.full_name}</h3>
          {expert.cohort_name && (
            <p className="text-sm text-accent font-medium">
              {(() => {
                const hebrewLetters = { 'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6 };
                const match = expert.cohort_name.match(/([א-ו])/);
                return match ? `נבחרת ${hebrewLetters[match[1]]}` : expert.cohort_name;
              })()}
            </p>
          )}
        </div>

        <Badge variant="secondary" className="mb-4 text-sm font-medium">
          {expert.expertise_area}
        </Badge>

        <div className="flex items-center gap-3">
          <Link to={`/expert/${expert.id}`} className="flex-1">
            <Button
              className="w-full bg-primary hover:bg-primary/90 rounded-xl font-semibold"
              disabled={isFull}
            >
              {isFull ? "רשימת המתנה" : "קביעת שיחה"}
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          {expert.linkedin_url && (
            <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="icon" className="rounded-xl border-border/50 hover:border-accent/50 hover:text-accent">
                <Linkedin className="w-4 h-4" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}