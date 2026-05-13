import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export default function PreviousExpertsSection() {
  const { data: pastExperts = [] } = useQuery({
    queryKey: ["pastExperts"],
    queryFn: () => base44.entities.Expert.filter({ is_current: false }),
  });

  if (pastExperts.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-accent tracking-widest uppercase mb-4">
            ארכיון
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            מומחים מהמחזורים הקודמים
          </h3>
          <p className="text-lg text-muted-foreground">
            תודה למומחים שתרמו מזמנם וידעם לקהילה
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {pastExperts.map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-muted mb-3 border-2 border-border/50 group-hover:border-accent/50 transition-colors">
                {expert.photo_url ? (
                  <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5">
                    <span className="text-2xl font-bold text-primary/30">{expert.full_name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">{expert.full_name}</p>
              <Badge variant="secondary" className="text-xs mt-1">
                {expert.expertise_area}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}