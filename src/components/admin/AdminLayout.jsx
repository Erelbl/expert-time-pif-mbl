import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Lock } from "lucide-react";

const ADMIN_PASSWORD = "experttime2024";

export default function AdminLayout() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("adminAuth") === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setAuthenticated(true);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border/50 rounded-2xl p-10 w-full max-w-sm shadow-lg">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">כניסה לניהול</h1>
            <p className="text-muted-foreground text-sm mt-1">הזן סיסמא להמשך</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="סיסמא"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="rounded-xl text-center"
              autoFocus
            />
            {error && <p className="text-destructive text-sm text-center">סיסמא שגויה</p>}
            <Button type="submit" className="w-full rounded-xl">כניסה</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-4 p-4 border-b border-border/50">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-primary text-primary-foreground p-0">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
          <span className="font-bold">ניהול Expert Time</span>
        </div>
        <main className="p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}