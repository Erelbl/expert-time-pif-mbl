import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ExpertCard from "./ExpertCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function CurrentExpertsSection() {
  const { data: experts = [], isLoading } = useQuery({
    queryKey: ["currentExperts"],
    queryFn: () => base44.entities.Expert.filter({ is_current: true, status: "active" }),
  });

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
            מוזמנים להירשם
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            המומחים שלנו
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            הכירו את 4 המומחים של המחזור הנוכחי — מוכנים לשתף מהניסיון והידע שלהם
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {experts.map((expert, index) => (
              <ExpertCard key={expert.id} expert={expert} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-card rounded-2xl border border-border/50"
          >
            <p className="text-xl text-muted-foreground">המחזור הבא בקרוב...</p>
            <p className="text-sm text-muted-foreground/60 mt-2">עקבו אחרינו לעדכונים</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}