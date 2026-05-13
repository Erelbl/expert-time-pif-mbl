import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Calendar, BarChart3, Star, Settings, Sparkles } from "lucide-react";

const menuItems = [
  { icon: Users, label: "מומחים", path: "/admin" },
  { icon: Calendar, label: "הזמנות", path: "/admin/bookings" },
  { icon: Settings, label: "מחזורים", path: "/admin/cohorts" },
  { icon: Star, label: "נרשמו להתנדבות", path: "/admin/nominations" },
  { icon: BarChart3, label: "סטטיסטיקות", path: "/admin/stats" },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-primary text-primary-foreground border-l border-border/10 hidden md:block">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="text-lg font-bold">Expert Time</span>
        </Link>
        <p className="text-xs text-primary-foreground/40 uppercase tracking-widest mb-6">ניהול</p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accent/20 text-accent"
                    : "text-primary-foreground/60 hover:text-primary-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}