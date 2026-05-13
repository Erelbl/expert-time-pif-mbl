import React, { useState } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight, Linkedin, Clock, Quote, Calendar, CheckCircle, Briefcase, MapPin
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ExpertProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const pathParts = window.location.pathname.split("/");
  const expertId = pathParts[pathParts.length - 1];

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({
    booker_name: "",
    booker_email: "",
    booker_phone: "",
    topic: "",
    notes: "",
  });

  const { data: expert, isLoading } = useQuery({
    queryKey: ["expert", expertId],
    queryFn: async () => {
      const experts = await base44.entities.Expert.filter({ id: expertId });
      return experts[0] || null;
    },
    enabled: !!expertId,
  });

  const bookMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Booking.create(data);
      // Update booked hours
      if (expert) {
        const updatedSlots = (expert.available_slots || []).map((slot) =>
          slot.date === selectedSlot.date && slot.time === selectedSlot.time
            ? { ...slot, is_booked: true }
            : slot
        );
        await base44.entities.Expert.update(expert.id, {
          booked_hours: (expert.booked_hours || 0) + 1,
          available_slots: updatedSlots,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expert", expertId] });
      setConfirmed(true);
    },
  });

  const handleBook = () => {
    bookMutation.mutate({
      expert_id: expert.id,
      expert_name: expert.full_name,
      booker_name: form.booker_name,
      booker_email: form.booker_email,
      booker_phone: form.booker_phone,
      date: selectedSlot.date,
      time: selectedSlot.time,
      topic: form.topic,
      notes: form.notes,
      status: "pending",
    });
  };

  if (isLoading) {
    return (
      <div className="pt-28 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="pt-28 pb-24 px-6 text-center">
        <p className="text-xl text-muted-foreground">מומחה לא נמצא</p>
        <Link to="/experts">
          <Button variant="outline" className="mt-4">חזרה למומחים</Button>
        </Link>
      </div>
    );
  }

  const remaining = (expert.total_hours || 4) - (expert.booked_hours || 0);
  const availableSlots = (expert.available_slots || []).filter((s) => !s.is_booked);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link to="/experts" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowRight className="w-4 h-4" />
          <span className="text-sm">חזרה למומחים</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="sticky top-28">
              <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                <div className="h-72 bg-muted">
                  {expert.photo_url ? (
                    <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <span className="text-8xl font-bold text-primary/15">{expert.full_name?.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-foreground mb-1">{expert.full_name}</h1>
                  {expert.cohort_name && (
                    <p className="text-accent font-medium text-sm mb-4">{expert.cohort_name}</p>
                  )}
                  <Badge className="mb-4">{expert.expertise_area}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Clock className="w-4 h-4" />
                    <span>{remaining}/{expert.total_hours || 4} שעות פנויות</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-semibold"
                      disabled={remaining <= 0 || availableSlots.length === 0}
                      onClick={() => setBookingOpen(true)}
                    >
                      <Calendar className="w-4 h-4 ml-2" />
                      קביעת שיחה
                    </Button>
                    {expert.linkedin_url && (
                      <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon" className="rounded-xl">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Bio */}
            <div className="bg-card rounded-2xl border border-border/50 p-8">
              <h2 className="text-lg font-bold text-foreground mb-4">אודות</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {expert.full_bio || expert.short_bio || "אין מידע נוסף"}
              </p>
            </div>

            {/* Experience */}
            {expert.experience && (
              <div className="bg-card rounded-2xl border border-border/50 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">ניסיון מקצועי</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {expert.experience}
                </p>
              </div>
            )}

            {/* Industries */}
            {expert.industries?.length > 0 && (
              <div className="bg-card rounded-2xl border border-border/50 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">תעשיות</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {expert.industries.map((ind) => (
                    <Badge key={ind} variant="secondary" className="text-sm">{ind}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quote */}
            {expert.community_quote && (
              <div className="bg-primary rounded-2xl p-8">
                <Quote className="w-8 h-8 text-accent/40 mb-4" />
                <p className="text-primary-foreground text-lg leading-relaxed italic">
                  "{expert.community_quote}"
                </p>
                <p className="text-primary-foreground/50 text-sm mt-4">— {expert.full_name}</p>
              </div>
            )}

            {/* Available Slots */}
            {availableSlots.length > 0 && (
              <div className="bg-card rounded-2xl border border-border/50 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">זמנים פנויים</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSlots.map((slot, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="justify-between rounded-xl py-6 hover:border-accent/50"
                      onClick={() => { setSelectedSlot(slot); setBookingOpen(true); }}
                    >
                      <span>{slot.date}</span>
                      <span className="text-accent font-semibold">{slot.time}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={(val) => { setBookingOpen(val); if (!val) { setConfirmed(false); setSelectedSlot(null); } }}>
        <DialogContent className="max-w-md">
          {confirmed ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-2">השיחה נקבעה!</h3>
              <p className="text-muted-foreground mb-2">
                שיחה עם {expert.full_name}
              </p>
              {selectedSlot && (
                <p className="text-accent font-semibold">{selectedSlot.date} בשעה {selectedSlot.time}</p>
              )}
              <p className="text-sm text-muted-foreground mt-4">אישור יישלח לאימייל שלך</p>
              <Button onClick={() => setBookingOpen(false)} className="mt-6 rounded-xl">סגירה</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>קביעת שיחה עם {expert.full_name}</DialogTitle>
                <DialogDescription>
                  {selectedSlot ? `${selectedSlot.date} בשעה ${selectedSlot.time}` : "בחרו זמן מתאים"}
                </DialogDescription>
              </DialogHeader>

              {!selectedSlot && availableSlots.length > 0 && (
                <div className="space-y-2 my-4">
                  <Label>בחרו מועד</Label>
                  <div className="grid gap-2">
                    {availableSlots.map((slot, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className={`justify-between rounded-xl ${selectedSlot === slot ? "border-accent" : ""}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <span>{slot.date}</span>
                        <span className="text-accent">{slot.time}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {selectedSlot && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>שם מלא *</Label>
                    <Input
                      required
                      value={form.booker_name}
                      onChange={(e) => setForm({ ...form, booker_name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>אימייל *</Label>
                    <Input
                      required
                      type="email"
                      dir="ltr"
                      value={form.booker_email}
                      onChange={(e) => setForm({ ...form, booker_email: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>טלפון</Label>
                    <Input
                      dir="ltr"
                      value={form.booker_phone}
                      onChange={(e) => setForm({ ...form, booker_phone: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>נושא הייעוץ</Label>
                    <Textarea
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="rounded-xl"
                      placeholder="במה תרצו להתייעץ?"
                    />
                  </div>
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6 font-semibold"
                    disabled={!form.booker_name || !form.booker_email || bookMutation.isPending}
                    onClick={handleBook}
                  >
                    {bookMutation.isPending ? "שולח..." : "אישור הזמנה"}
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}