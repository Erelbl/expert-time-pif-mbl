import React from "react";
import { motion } from "framer-motion";
import { Search, Calendar, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "בחרו מומחה",
    description: "עיינו בפרופילים של המומחים במחזור הנוכחי ובחרו את המתאים לכם"
  },
  {
    icon: Calendar,
    step: "02",
    title: "קבעו שיחה",
    description: "בחרו חלון זמן פנוי שמתאים לכם מהמועדים הזמינים של המומחה"
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "שוחחו",
    description: "פגישת ייעוץ אישית עם המומחה — שאלו, התייעצו, למדו"
  },

];

export default function ProcessSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-sm font-semibold text-accent tracking-widest uppercase mb-4">
            איך זה עובד
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground">
            3 צעדים פשוטים
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -left-4 w-8 h-px bg-border" />
              )}
              <div className="relative">
                <div className="text-7xl font-black text-accent/10 absolute -top-6 left-1/2 -translate-x-1/2">
                  {step.step}
                </div>
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <step.icon className="w-7 h-7 text-accent" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">{step.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}