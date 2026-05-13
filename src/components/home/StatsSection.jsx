import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Users, Clock, Award } from "lucide-react";

export default function StatsSection() {
  const { data: experts = [] } = useQuery({
    queryKey: ["allExperts"],
    queryFn: () => base44.entities.Expert.list(),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["allBookings"],
    queryFn: () => base44.entities.Booking.list(),
  });

  const totalExperts = experts.length;
  const totalHours = experts.reduce((sum, e) => sum + (e.booked_hours || 0), 0);
  const completedSessions = bookings.filter((b) => b.status === "completed").length;

  const stats = [
    { icon: Users, value: totalExperts || 12, label: "מומחים השתתפו", suffix: "+" },
    { icon: Clock, value: totalHours || 48, label: "שעות ייעוץ נתרמו", suffix: "" },
    { icon: Award, value: completedSessions || 36, label: "שיחות ייעוץ הושלמו", suffix: "+" },
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-accent tracking-widest uppercase mb-4">
            השפעה קהילתית
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground">
            המספרים מדברים
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="text-center p-10 rounded-2xl bg-primary group hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-primary-foreground mb-3">
                {stat.value}{stat.suffix}
              </div>
              <p className="text-primary-foreground/60 text-lg font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}