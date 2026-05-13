import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function CohortsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", start_date: "", end_date: "", status: "upcoming", is_active: false });

  const { data: cohorts = [], isLoading } = useQuery({
    queryKey: ["adminCohorts"],
    queryFn: () => base44.entities.Cohort.list("-created_date"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing
      ? base44.entities.Cohort.update(editing.id, data)
      : base44.entities.Cohort.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCohorts"] });
      setDialogOpen(false);
      toast({ title: editing ? "המחזור עודכן" : "המחזור נוצר" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Cohort.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCohorts"] });
      toast({ title: "המחזור הוסר" });
    },
  });

  const openNew = () => { setEditing(null); setForm({ name: "", start_date: "", end_date: "", status: "upcoming", is_active: false }); setDialogOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm(c); setDialogOpen(true); };

  const statusColors = { upcoming: "bg-accent/10 text-accent", active: "bg-green-100 text-green-700", completed: "bg-muted text-muted-foreground" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול מחזורים</h1>
          <p className="text-muted-foreground mt-1">ניהול מחזורי Expert Time</p>
        </div>
        <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
          <Plus className="w-4 h-4 ml-2" />
          מחזור חדש
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>תאריכים</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohorts.map((cohort) => (
              <TableRow key={cohort.id}>
                <TableCell className="font-semibold">{cohort.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {cohort.start_date} — {cohort.end_date}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[cohort.status]}>{cohort.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cohort)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cohort.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {cohorts.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  אין מחזורים
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "עריכת מחזור" : "מחזור חדש"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>שם המחזור *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>תאריך התחלה</Label>
                <Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="rounded-xl" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>תאריך סיום</Label>
                <Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="rounded-xl" dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>סטטוס</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">עתידי</SelectItem>
                  <SelectItem value="active">פעיל</SelectItem>
                  <SelectItem value="completed">הסתיים</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6"
              disabled={!form.name || saveMutation.isPending}
              onClick={() => saveMutation.mutate(form)}
            >
              {saveMutation.isPending ? "שומר..." : editing ? "עדכון" : "יצירה"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}