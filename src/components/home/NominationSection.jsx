import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Send, CheckCircle, Calendar, Link2, ImagePlus } from "lucide-react";

export default function NominationSection() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    program_year: "",
    expertise_area: "",
    short_bio: "",
    linkedin_url: "",
    photo_file: null,
    slot1_date: "",
    slot1_time: "",
    slot2_date: "",
    slot2_time: "",
    slot3_date: "",
    slot3_time: "",
    slot4_date: "",
    slot4_time: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let photo_url = "";
    if (form.photo_file) {
      const res = await base44.integrations.Core.UploadFile({ file: form.photo_file });
      photo_url = res.file_url;
    }
    await Promise.all([
      base44.entities.Nomination.create({
        nominee_name: form.full_name,
        nominee_email: form.email,
        phone: form.phone,
        cohort_name: form.program_year,
        expertise_area: form.expertise_area,
        short_bio: form.short_bio,
        linkedin_url: form.linkedin_url,
        photo_url,
        status: "new",
      }),
      base44.integrations.Core.SendEmail({
        to: "info@experttime.co.il",
        subject: `בקשת התנדבות: ${form.full_name}`,
        body: `שם: ${form.full_name}\nאימייל: ${form.email}\nטלפון: ${form.phone}\nשנת השתתפות: ${form.program_year}\nתחום מומחיות: ${form.expertise_area}\nתיאור: ${form.short_bio}\nלינקדאין: ${form.linkedin_url}\nמועד 1: ${form.slot1_date} ${form.slot1_time}\nמועד 2: ${form.slot2_date} ${form.slot2_time}\nמועד 3: ${form.slot3_date} ${form.slot3_time}\nמועד 4: ${form.slot4_date} ${form.slot4_time}`
      }),
    ]);
    setLoading(false);
    setSubmitted(true);
    toast({ title: "תודה!", description: "קיבלנו את פרטיך. נחזור אליך בקרוב." });
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <section id="nomination-section" className="py-24 md:py-32 px-6 md:px-12">
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
                <Label>שנת השתתפות בתוכנית *</Label>
                <Input
                  required
                  placeholder="לדוגמה: 2023"
                  value={form.program_year}
                  onChange={(e) => updateField("program_year", e.target.value)}
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

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-accent" />
                לינקדאין (לא חובה)
              </Label>
              <Input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={form.linkedin_url}
                onChange={(e) => updateField("linkedin_url", e.target.value)}
                className="rounded-xl"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-accent" />
                תמונת פרופיל (לא חובה)
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateField("photo_file", e.target.files?.[0] || null)}
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent/10 file:text-accent file:font-medium hover:file:bg-accent/20 cursor-pointer"
              />
            </div>

            {/* Availability slots */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-accent" />
                <Label className="text-base font-semibold">4 מועדים בהם אתם פנויים *</Label>
              </div>
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-xl border border-border/40">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">מועד {num} — תאריך</Label>
                    <Input
                      type="date"
                      required
                      value={form[`slot${num}_date`]}
                      onChange={(e) => updateField(`slot${num}_date`, e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">מועד {num} — שעה</Label>
                    <Input
                      type="time"
                      required
                      value={form[`slot${num}_time`]}
                      onChange={(e) => updateField(`slot${num}_time`, e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              ))}
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