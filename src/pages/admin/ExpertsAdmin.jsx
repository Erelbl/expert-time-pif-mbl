import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";

const emptyExpert = {
  full_name: "", photo_url: "", cohort_name: "", expertise_area: "",
  short_bio: "", full_bio: "", industries: [], experience: "",
  linkedin_url: "", community_quote: "", total_hours: 4, booked_hours: 0,
  is_current: true, status: "active", available_slots: [],
};

export default function ExpertsAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [form, setForm] = useState(emptyExpert);
  const [slotsText, setSlotsText] = useState("");

  const { data: experts = [], isLoading } = useQuery({
    queryKey: ["adminExperts"],
    queryFn: () => base44.entities.Expert.list("-created_date"),
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const slots = slotsText.split("\n").filter(Boolean).map((line) => {
        const [date, time] = line.split(",").map((s) => s.trim());
        return { date, time, is_booked: false };
      });
      const payload = { ...data, available_slots: slots.length > 0 ? slots : data.available_slots };
      if (editingExpert) {
        return base44.entities.Expert.update(editingExpert.id, payload);
      }
      return base44.entities.Expert.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminExperts"] });
      setDialogOpen(false);
      toast({ title: editingExpert ? "המומחה עודכן" : "המומחה נוסף" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Expert.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminExperts"] });
      toast({ title: "המומחה הוסר" });
    },
  });

  const openNew = () => {
    setEditingExpert(null);
    setForm(emptyExpert);
    setSlotsText("");
    setDialogOpen(true);
  };

  const openEdit = (expert) => {
    setEditingExpert(expert);
    setForm(expert);
    setSlotsText(
      (expert.available_slots || []).map((s) => `${s.date}, ${s.time}`).join("\n")
    );
    setDialogOpen(true);
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ניהול מומחים</h1>
          <p className="text-muted-foreground mt-1">הוספה, עריכה והסרה של מומחים</p>
        </div>
        <Button onClick={openNew} className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
          <Plus className="w-4 h-4 ml-2" />
          מומחה חדש
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם</TableHead>
              <TableHead>מומחיות</TableHead>
              <TableHead>שעות</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>נוכחי</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experts.map((expert) => (
              <TableRow key={expert.id}>
                <TableCell className="font-semibold">{expert.full_name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{expert.expertise_area}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {expert.booked_hours || 0}/{expert.total_hours || 4}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={expert.status === "active" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}>
                    {expert.status}
                  </Badge>
                </TableCell>
                <TableCell>{expert.is_current ? "✓" : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(expert)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(expert.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {experts.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  אין מומחים עדיין. הוסיפו את הראשון!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExpert ? "עריכת מומחה" : "מומחה חדש"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>שם מלא *</Label>
                <Input value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>תחום מומחיות *</Label>
                <Input value={form.expertise_area} onChange={(e) => updateField("expertise_area", e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>נבחרת / מחזור</Label>
                <Input value={form.cohort_name} onChange={(e) => updateField("cohort_name", e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>קישור תמונה</Label>
                <Input value={form.photo_url} onChange={(e) => updateField("photo_url", e.target.value)} className="rounded-xl" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>לינקדאין</Label>
                <Input value={form.linkedin_url} onChange={(e) => updateField("linkedin_url", e.target.value)} className="rounded-xl" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>סה"כ שעות</Label>
                <Input type="number" value={form.total_hours} onChange={(e) => updateField("total_hours", Number(e.target.value))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>שעות שנתפסו</Label>
                <Input type="number" value={form.booked_hours} onChange={(e) => updateField("booked_hours", Number(e.target.value))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>סטטוס</Label>
                <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">פעיל</SelectItem>
                    <SelectItem value="inactive">לא פעיל</SelectItem>
                    <SelectItem value="archived">ארכיון</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_current} onCheckedChange={(v) => updateField("is_current", v)} />
              <Label>מומחה במחזור הנוכחי</Label>
            </div>
            <div className="space-y-2">
              <Label>ביוגרפיה קצרה</Label>
              <Textarea value={form.short_bio} onChange={(e) => updateField("short_bio", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>ביוגרפיה מלאה</Label>
              <Textarea value={form.full_bio} onChange={(e) => updateField("full_bio", e.target.value)} className="rounded-xl min-h-[120px]" />
            </div>
            <div className="space-y-2">
              <Label>ניסיון מקצועי</Label>
              <Textarea value={form.experience} onChange={(e) => updateField("experience", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>ציטוט קהילתי</Label>
              <Input value={form.community_quote} onChange={(e) => updateField("community_quote", e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>תעשיות (מופרדות בפסיקים)</Label>
              <Input
                value={(form.industries || []).join(", ")}
                onChange={(e) => updateField("industries", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                className="rounded-xl"
                placeholder="טכנולוגיה, פיננסים, בריאות"
              />
            </div>
            <div className="space-y-2">
              <Label>זמנים פנויים (שורה לכל מועד: תאריך, שעה)</Label>
              <Textarea
                value={slotsText}
                onChange={(e) => setSlotsText(e.target.value)}
                className="rounded-xl min-h-[100px]"
                dir="ltr"
                placeholder="2025-06-15, 10:00&#10;2025-06-16, 14:00&#10;2025-06-17, 09:00"
              />
            </div>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-6 font-semibold"
              disabled={!form.full_name || !form.expertise_area || saveMutation.isPending}
              onClick={() => saveMutation.mutate(form)}
            >
              {saveMutation.isPending ? "שומר..." : editingExpert ? "עדכון" : "הוספה"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}