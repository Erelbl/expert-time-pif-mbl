import React from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { User, Briefcase } from "lucide-react";

const statusMap = {
  new: { label: "חדש", className: "bg-accent/10 text-accent" },
  reviewed: { label: "נבדק", className: "bg-primary/10 text-primary" },
  accepted: { label: "התקבל", className: "bg-green-100 text-green-700" },
  declined: { label: "נדחה", className: "bg-destructive/10 text-destructive" },
};

export default function NominationsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: nominations = [], isLoading } = useQuery({
    queryKey: ["adminNominations"],
    queryFn: () => base44.entities.Nomination.list("-created_date"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Nomination.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNominations"] });
      toast({ title: "הסטטוס עודכן" });
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">נרשמו להתנדבות</h1>
        <p className="text-muted-foreground mt-1">ניהול בקשות התנדבות מחברי הקהילה</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>אימייל</TableHead>
              <TableHead>טלפון</TableHead>
              <TableHead>נבחרת</TableHead>
              <TableHead>תחום מומחיות</TableHead>
              <TableHead>תיאור</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>עדכון</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nominations.map((nom) => (
              <TableRow key={nom.id}>
                <TableCell className="font-semibold">{nom.nominee_name}</TableCell>
                <TableCell className="text-sm">{nom.nominee_email || "—"}</TableCell>
                <TableCell className="text-sm">{nom.phone || "—"}</TableCell>
                <TableCell className="text-sm">{nom.cohort_name || "—"}</TableCell>
                <TableCell><Badge variant="secondary">{nom.expertise_area}</Badge></TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{nom.short_bio || "—"}</TableCell>
                <TableCell>
                  <Badge className={statusMap[nom.status]?.className}>{statusMap[nom.status]?.label}</Badge>
                </TableCell>
                <TableCell>
                  <Select value={nom.status} onValueChange={(v) => updateMutation.mutate({ id: nom.id, status: v })}>
                    <SelectTrigger className="w-24 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">חדש</SelectItem>
                      <SelectItem value="reviewed">נבדק</SelectItem>
                      <SelectItem value="accepted">התקבל</SelectItem>
                      <SelectItem value="declined">נדחה</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {nominations.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">אין בקשות</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}