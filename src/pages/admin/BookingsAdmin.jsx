import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, User, Mail } from "lucide-react";

const statusMap = {
  pending: { label: "ממתין", className: "bg-accent/10 text-accent" },
  confirmed: { label: "מאושר", className: "bg-green-100 text-green-700" },
  completed: { label: "הושלם", className: "bg-primary/10 text-primary" },
  cancelled: { label: "בוטל", className: "bg-destructive/10 text-destructive" },
};

export default function BookingsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: () => base44.entities.Booking.list("-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Booking.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      toast({ title: "הסטטוס עודכן" });
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">ניהול הזמנות</h1>
        <p className="text-muted-foreground mt-1">צפייה ועדכון סטטוס הזמנות</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>מזמין</TableHead>
              <TableHead>מומחה</TableHead>
              <TableHead>תאריך</TableHead>
              <TableHead>נושא</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>עדכון</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <div className="font-semibold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      {booking.booker_name}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {booking.booker_email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{booking.expert_name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {booking.date} {booking.time}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm">{booking.topic || "—"}</TableCell>
                <TableCell>
                  <Badge className={statusMap[booking.status]?.className}>
                    {statusMap[booking.status]?.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onValueChange={(v) => updateMutation.mutate({ id: booking.id, status: v })}
                  >
                    <SelectTrigger className="w-28 rounded-lg text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">ממתין</SelectItem>
                      <SelectItem value="confirmed">מאושר</SelectItem>
                      <SelectItem value="completed">הושלם</SelectItem>
                      <SelectItem value="cancelled">בוטל</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  אין הזמנות עדיין
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}