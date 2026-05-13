import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { User, Briefcase } from "lucide-react";

export default function VolunteersListSection() {
  const { data: nominations = [] } = useQuery({
    queryKey: ["nominations"],
    queryFn: () => base44.entities.Nomination.list("-created_date"),
  });

  if (nominations.length === 0) return null;

  return (
    <section className="py-16 px-6 md:px-12 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-sm font-semibold text-accent tracking-widest uppercase mb-4">
            מתנדבים
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">
            נרשמו להתנדבות
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {nominations.map((nom, i) => (
            <motion.div
              key={nom.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border/50 p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">{nom.nominee_name}</p>
                {nom.expertise_area && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Briefcase className="w-3 h-3" />
                    {nom.expertise_area}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}