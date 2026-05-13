import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Heart, Lightbulb, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FooterSection from "@/components/home/FooterSection";

const values = [
  {
    icon: Heart,
    title: "נתינה",
    description: "מומחים מתנדבים מזמנם וידעם ללא תמורה, מתוך אהבה לקהילה"
  },
  {
    icon: Users,
    title: "שיתוף",
    description: "ידע שמועבר מאדם לאדם בונה קשרים חזקים ומעשירים"
  },
  {
    icon: Target,
    title: "מקצועיות",
    description: "ייעוץ ברמה הגבוהה ביותר, ממומחים עם ניסיון עשיר"
  },
  {
    icon: Lightbulb,
    title: "חדשנות",
    description: "מודל ייחודי של שיתוף ידע שמקדם את כל חברי הקהילה"
  }
];

export default function About() {
  return (
    <div>
      <div className="pt-28 pb-24 px-6 md:px-12 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              על היוזמה
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Expert Time נולד מתוך האמונה שהידע והניסיון של קהילת הבוגרים הם המשאב
              החזק ביותר שלנו. כשמומחים מתנדבים לשתף — כולם מרוויחים.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="bg-card rounded-2xl border border-border/50 p-8 md:p-12 mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">איך זה עובד?</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                כל חודשיים, אנו בוחרים <strong className="text-foreground">4 מומחים</strong> מקרב
                בוגרי הופמן קופמן. כל מומחה מעניק <strong className="text-foreground">4 שעות ייעוץ</strong> בתחום
                ההתמחות שלו, ללא עלות לחברי הקהילה.
              </p>
              <p>
                חברי הקהילה יכולים לעיין בפרופילים של המומחים, לבחור את המתאים להם,
                ולקבוע שיחת ייעוץ אישית. כל שיחה היא הזדמנות ללמוד, לצמוח, וליצור קשרים חדשים.
              </p>
              <p>
                בסיום כל מחזור, מומחים חדשים נבחרים — והמעגל של נתינה ושיתוף ממשיך.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">הערכים שלנו</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="bg-card rounded-2xl border border-border/50 p-8 hover:border-accent/20 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="text-center">
            <Link to="/experts">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-10 py-6 text-lg font-semibold"
              >
                לצפייה במומחים
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
}