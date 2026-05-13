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
    nominee_name: "",
    nominee_email: "",
    nominator_name: "",
    expertise_area: "",
    reason: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.Nomination.create(form);
    setLoading(false);
    setSubmitted(true);
    toast({ title: "ההמלצה נשלחה בהצלחה!", description: "תודה על ההמלצה. נבחן את המועמדות." });
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
            הציעו מומחה
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            מכירים מומחה בקהילה?
          </h3>
          <p className="text-lg text-muted-foreground">
            המליצו על בוגר/ת שלדעתכם יכולים לתרום לקהילה במחזור הבא
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
                <Label>שם המועמד/ת *</Label>
                <Input
                  required
                  placeholder="שם מלא"
                  value={form.nominee_name}
                  onChange={(e) => updateField("nominee_name", e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>אימייל המועמד/ת</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={form.nominee_email}
                  onChange={(e) => updateField("nominee_email", e.target.value)}
                  className="rounded-xl"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label>שם הממליץ/ה *</Label>
                <Input
                  required
                  placeholder="שם מלא"
                  value={form.nominator_name}
                  onChange={(e) => updateField("nominator_name", e.target.value)}
                  className="rounded-xl"
                />
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
            </div>
            <div className="space-y-2">
              <Label>למה כדאי לבחור במועמד/ת?</Label>
              <Textarea
                placeholder="ספרו לנו למה המועמד/ת מתאימ/ה..."
                value={form.reason}
                onChange={(e) => updateField("reason", e.target.value)}
                className="rounded-xl min-h-[120px]"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6 text-lg font-semibold"
            >
              <Send className="w-5 h-5 ml-2" />
              {loading ? "שולח..." : "שליחת המלצה"}
            </Button>
          </motion.form>
        )}
      </div>
    </section>
  );
}