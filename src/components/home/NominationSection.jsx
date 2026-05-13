import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Send, CheckCircle } from "lucide-react";

export default function NominationSection() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    cohort_name: "",
    expertise_area: "",
    short_bio: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.integrations.Core.SendEmail({
      to: "info@experttime.co.il",
      subject: `בקשת התנדבות: ${form.full_name}`,
      body: `שם: ${form.full_name}\nאימייל: ${form.email}\nטלפון: ${form.phone}\nנבחרת: ${form.cohort_name}\nתחום מומחיות: ${form.expertise_area}\nתיאור: ${form.short_bio}`
    });
    setLoading(false);
    setSubmitted(true);
    toast({ title: "תודה!", description: "קיבלנו את פרטיך. נחזור אליך בקרוב." });
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <section className="py-24 md:py-32 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm font-semibold text-accent tracking-widest uppercase mb-4">
            הצטרפו כמומחים
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            רוצים להתנדב?
          </h3>
          <p className="text-lg text-muted-foreground">
            מוזמנים לכתוב לנו ולהשאיר את פרטיכם
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-card rounded-2xl border border-accent/20"
          >
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
            <h4 className="text-2xl font-bold text-foreground mb-2">תודה רבה!</h4>
            <p className="text-muted-foreground">ההמלצה נשלחה בהצלחה ותיבדק בקרוב</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl border border-border/50 p-8 md:p-10 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>שם מלא *</Label>
                <Input
                  required
                  placeholder="שם מלא"
                  value={form.full_name}
                  onChange={(e) => updateField("full_name", e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>אימייל *</Label>
                <Input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="rounded-xl"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>טלפון *</Label>
                <Input
                  type="tel"
                  required
                  placeholder="05X-XXXXXXX"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="rounded-xl"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>נבחרת *</Label>
                <Input
                  required
                  placeholder="שם הנבחרת"
                  value={form.cohort_name}
                  onChange={(e) => updateField("cohort_name", e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>תחום מומחיות *</Label>
              <Input
                required
                placeholder="לדוגמה: אסטרטגיה, טכנולוגיה, ניהול"
                value={form.expertise_area}
                onChange={(e) => updateField("expertise_area", e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>קצת על עצמך</Label>
              <Textarea
                placeholder="ספר/י על הרקע, הניסיון והתחומים בהם תוכל/י לתרום..."
                value={form.short_bio}
                onChange={(e) => updateField("short_bio", e.target.value)}
                className="rounded-xl min-h-[120px]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6 text-lg font-semibold"
            >
              <Send className="w-5 h-5 ml-2" />
              {loading ? "שולח..." : "שליחת בקשה"}
            </Button>
          </motion.form>
        )}
      </div>
    </section>
  );
}