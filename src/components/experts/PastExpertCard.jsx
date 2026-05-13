import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, ChevronDown, ChevronUp, Calendar } from "lucide-react";

export default function PastExpertCard({ expert, index = 0 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="group bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-accent/20 hover:shadow-lg transition-all duration-400"
    >
      <div className="flex gap-5 p-5">
        {/* Photo */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted">
          {expert.photo_url ? (
            <img
              src={expert.photo_url}
              alt={expert.full_name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <span className="text-2xl font-bold text-primary/25">
                {expert.full_name?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-foreground leading-tight">{expert.full_name}</h3>
              {expert.cohort_name && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-accent/70" />
                  <span className="text-xs text-accent font-medium">{expert.cohort_name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {expert.linkedin_url && (
                <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 rounded-lg hover:text-accent hover:bg-accent/10"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </Button>
                </a>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 rounded-lg hover:text-accent hover:bg-accent/10"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Badge variant="secondary" className="mt-2 text-xs font-medium px-2 py-0.5">
            {expert.expertise_area}
          </Badge>

          {/* Short bio always visible */}
          <p className="text-muted-foreground text-xs leading-relaxed mt-2">
            {expert.short_bio}
          </p>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
              {(expert.full_bio || expert.short_bio) && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">אודות</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {expert.full_bio || expert.short_bio}
                  </p>
                </div>
              )}

              {expert.experience && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">ניסיון</p>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {expert.experience}
                  </p>
                </div>
              )}

              {expert.industries?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">תעשיות</p>
                  <div className="flex flex-wrap gap-1.5">
                    {expert.industries.map((ind) => (
                      <Badge key={ind} variant="outline" className="text-xs border-accent/30 text-accent">
                        {ind}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {expert.community_quote && (
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground italic">"{expert.community_quote}"</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}