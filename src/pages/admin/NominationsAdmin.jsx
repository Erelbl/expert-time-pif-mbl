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
        <h1 className="text-3xl font-bold text-foreground">המלצות למומחים</h1>
        <p className="text-muted-foreground mt-1">ניהול המלצות למועמדים במחזורים הבאים</p>
      </div>

      {nominations.length > 0 && (
        <div className="mb-12 bg-muted/30 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">נרשמו להתנדבות</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nominations.map((nom, i) => (
              <motion.div
                key={nom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border/50 p-4 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{nom.nominee_name}</p>
                  {nom.expertise_area && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3" />
                      {nom.expertise_area}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>מועמד</TableHead>
              <TableHead>ממליץ</TableHead>
              <TableHead>תחום</TableHead>
              <TableHead>סיבה</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>עדכון</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nominations.map((nom) => (
              <TableRow key={nom.id}>
                <TableCell className="font-semibold">{nom.nominee_name}</TableCell>
                <TableCell>{nom.nominator_name}</TableCell>
                <TableCell><Badge variant="secondary">{nom.expertise_area}</Badge></TableCell>
                <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{nom.reason || "—"}</TableCell>
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
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">אין המלצות</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}