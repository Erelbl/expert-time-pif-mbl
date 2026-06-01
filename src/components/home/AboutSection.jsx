import React from "react";
import { motion } from "framer-motion";
import { Users, Clock, Heart, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "מומחים מהקהילה",
    description: "בכל סבב, 4 בוגרים בעלי ניסיון וידע ייחודי מתנדבים לשתף את הקהילה"
  },
  {
    icon: Clock,
    title: "4 שעות התנדבות",
    description: "כל מומחה מעניק 4 שעות ייעוץ אישי לחברי הקהילה בהתנדבות מלאה"
  },
  {
    icon: Lightbulb,
    title: "ייעוץ מקצועי",
    description: "שיחות אחד-על-אחד עם מומחים בתחומים מגוונים — אסטרטגיה, טכנולוגיה, ניהול ועוד"
  },
  {
    icon: Heart,
    title: "ערך קהילתי",
    description: "יוזמה שנבנתה מתוך אמונה בכוח השיתוף והנתינה של קהילת הבוגרים"
  }
];

export default function AboutSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-sm font-semibold text-accent tracking-widest uppercase mb-4">
            על היוזמה
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            ידע שמחבר, ניסיון שמקדם
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Expert Time הוא מיזם ייחודי של קהילת בוגרי התוכניות הקצרות של הופמן קופמן, שמאפשר לבוגרים
            בעלי מומחיות לתרום מזמנם והידע שלהם לטובת חברי הקהילה.
            כל חודש, 4 מומחים נבחרים מעניקים שעות ייעוץ בתחומי התמחותם.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group text-center p-8 rounded-2xl border border-border/50 bg-card hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-3">{feature.title}</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}