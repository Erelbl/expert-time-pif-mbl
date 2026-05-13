import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => base44.entities.Testimonial.filter({ is_published: true }),
  });

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    {
      id: "1",
      author_name: "דנה כהן",
      author_cohort: "נבחרת 2023",
      content: "השיחה עם המומחה שינתה לי את הפרספקטיבה לגמרי. קיבלתי כלים מעשיים שעזרו לי לקדם את הפרויקט שלי.",
      expert_name: "יוסי לוי"
    },
    {
      id: "2",
      author_name: "אורי שמש",
      author_cohort: "נבחרת 2024",
      content: "יוזמה מדהימה. הרגשתי שהמומחה באמת מקשיב ומבין את האתגרים שלי. ממליץ בחום.",
      expert_name: "מיכל ברון"
    },
    {
      id: "3",
      author_name: "נועה אברהם",
      author_cohort: "נבחרת 2023",
      content: "הקהילה הזו מוכיחה שכשנותנים — כולם מרוויחים. תודה על ההזדמנות המיוחדת.",
      expert_name: "רון דוד"
    }
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-semibold text-accent tracking-widest uppercase mb-4">
            מה אומרים עלינו
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground">
            קולות מהקהילה
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              className="relative bg-card rounded-2xl border border-border/50 p-8 hover:border-accent/20 hover:shadow-xl transition-all duration-500"
            >
              <Quote className="w-10 h-10 text-accent/20 mb-6" />
              <p className="text-foreground leading-relaxed mb-8 text-lg">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {testimonial.author_name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author_name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.author_cohort}</p>
                </div>
              </div>
              {testimonial.expert_name && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    שיחה עם <span className="text-accent font-medium">{testimonial.expert_name}</span>
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}