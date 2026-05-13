import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Calendar, Star, TrendingUp, Award } from "lucide-react";

export default function StatsAdmin() {
  const { data: experts = [] } = useQuery({ queryKey: ["statsExperts"], queryFn: () => base44.entities.Expert.list() });
  const { data: bookings = [] } = useQuery({ queryKey: ["statsBookings"], queryFn: () => base44.entities.Booking.list() });
  const { data: nominations = [] } = useQuery({ queryKey: ["statsNominations"], queryFn: () => base44.entities.Nomination.list() });

  const currentExperts = experts.filter((e) => e.is_current && e.status === "active");
  const totalHoursDonated = experts.reduce((s, e) => s + (e.booked_hours || 0), 0);
  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  const registeredNominees = nominations.filter((n) => n.status === "accepted").length;

  const stats = [
    { icon: Users, label: "מומחים כוללים", value: experts.length, color: "text-accent" },
    { icon: Star, label: "מומחים פעילים", value: currentExperts.length, color: "text-green-600" },
    { icon: Clock, label: "שעות שנתרמו", value: totalHoursDonated, color: "text-blue-600" },
    { icon: Calendar, label: "הזמנות ממתינות", value: pendingBookings, color: "text-accent" },
    { icon: TrendingUp, label: "נרשמו כמומחים", value: nominations.length, color: "text-purple-600" },
    { icon: Award, label: "מועמדויות שאושרו", value: registeredNominees, color: "text-green-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">סטטיסטיקות</h1>
        <p className="text-muted-foreground mt-1">סקירה כללית של הפלטפורמה</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}