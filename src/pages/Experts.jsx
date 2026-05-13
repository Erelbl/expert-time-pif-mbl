import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ExpertCard from "@/components/home/ExpertCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Experts() {
  const { data: experts = [], isLoading } = useQuery({
    queryKey: ["activeExperts"],
    queryFn: () => base44.entities.Expert.filter({ is_current: true, status: "active" }),
  });

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            המומחים שלנו
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            בחרו מומחה וקבעו שיחת ייעוץ — 4 שעות של ידע וניסיון מתוך הקהילה
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
            className="text-center py-24 bg-card rounded-2xl border border-border/50"
          >
            <p className="text-2xl text-muted-foreground mb-2">אין מומחים פעילים כרגע</p>
            <p className="text-muted-foreground/60">המחזור הבא בקרוב...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}