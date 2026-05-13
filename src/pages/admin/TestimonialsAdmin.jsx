import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TestimonialsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ author_name: "", author_cohort: "", content: "", expert_name: "", is_published: true });

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["adminTestimonials"],
    queryFn: () => base44.entities.Testimonial.list("-created_date"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editing
      ? base44.entities.Testimonial.update(editing.id, data)
      : base44.entities.Testimonial.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTestimonials"] });
      setDialogOpen(false);
      toast({ title: editing ? "העדות עודכנה" : "העדות נוספה" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Testimonial.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTestimonials"] });
      toast({ title: "העדות הוסרה" });
    },
  });

  const openNew = () => { setEditing(null); setForm({ author_name: "", author_cohort: "", content: "", expert_name: "", is_published: true }); setDialogOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm(t); setDialogOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">עדויות</h1>
          <p className="text-muted-foreground mt-1">ניהול עדויות מחברי הקהילה</p>
        </div>
        <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
          <Plus className="w-4 h-4 ml-2" />
          עדות חדשה
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>כותב</TableHead>
              <TableHead>מומחה</TableHead>
              <TableHead>תוכן</TableHead>
              <TableHead>מפורסם</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-semibold">{t.author_name}</TableCell>
                <TableCell>{t.expert_name || "—"}</TableCell>
                <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">{t.content}</TableCell>
                <TableCell>{t.is_published ? "✓" : "✗"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {testimonials.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">אין עדויות</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "עריכת עדות" : "עדות חדשה"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>שם הכותב *</Label>
              <Input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>מחזור</Label>
              <Input value={form.author_cohort} onChange={(e) => setForm({ ...form, author_cohort: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>שם המומחה</Label>
              <Input value={form.expert_name} onChange={(e) => setForm({ ...form, expert_name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>תוכן *</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="rounded-xl min-h-[120px]" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
              <Label>מפורסם</Label>
            </div>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6"
              disabled={!form.author_name || !form.content || saveMutation.isPending}
              onClick={() => saveMutation.mutate(form)}
            >
              {saveMutation.isPending ? "שומר..." : editing ? "עדכון" : "הוספה"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}