import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import ExpertCard from "@/components/home/ExpertCard";
import PastExpertCard from "@/components/experts/PastExpertCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ChevronDown, Filter } from "lucide-react";

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border/50">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function Experts() {
  const [activeFilter, setActiveFilter] = useState("הכל");
  const [showAllCycles, setShowAllCycles] = useState(false);

  const { data: allExperts = [], isLoading } = useQuery({
    queryKey: ["allExpertsPage"],
    queryFn: () => base44.entities.Expert.list("-created_date"),
  });

  const currentExperts = useMemo(
    () => allExperts.filter((e) => e.is_current && e.status === "active"),
    [allExperts]
  );

  const pastExperts = useMemo(
    () => allExperts.filter((e) => !e.is_current || e.status !== "active"),
    [allExperts]
  );

  // All unique expertise areas from past experts
  const allAreas = useMemo(() => {
    const areas = new Set(pastExperts.map((e) => e.expertise_area).filter(Boolean));
    return ["הכל", ...Array.from(areas)];
  }, [pastExperts]);

  // Filter past experts by selected area
  const filteredPast = useMemo(() => {
    if (activeFilter === "הכל") return pastExperts;
    return pastExperts.filter((e) => e.expertise_area === activeFilter);
  }, [pastExperts, activeFilter]);

  // Group filtered past experts by cohort_name
  const groupedByCycle = useMemo(() => {
    const groups = {};
    filteredPast.forEach((expert) => {
      const key = expert.cohort_name || "מחזור לא מצוין";
      if (!groups[key]) groups[key] = [];
      groups[key].push(expert);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredPast]);

  const visibleCycles = showAllCycles ? groupedByCycle : groupedByCycle.slice(0, 2);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            המומחים שלנו
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            בוגרי הופמן קופמן שתורמים מזמנם, מניסיונם ומהידע שלהם לקהילה
          </p>
        </motion.div>

        {/* ─── SECTION 1: Current cycle ─── */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-2 h-8 bg-accent rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-foreground">זמינים לשיחות ייעוץ</h2>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : currentExperts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentExperts.map((expert, index) => (
                <ExpertCard key={expert.id} expert={expert} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
              <p className="text-xl text-muted-foreground">המחזור הבא בקרוב...</p>
            </div>
          )}
        </section>

        {/* ─── SECTION 2: Past experts archive ─── */}
        {!isLoading && pastExperts.length > 0 && (
          <section>
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-2 h-8 bg-primary/30 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">ארכיון מומחים</h2>
                <p className="text-sm text-muted-foreground">
                  {pastExperts.length} מומחים תרמו לקהילה עד כה
                </p>
              </div>
            </motion.div>

            {/* Filter bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">סינון לפי תחום:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setActiveFilter(area)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeFilter === area
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-card border border-border/50 text-muted-foreground hover:border-accent/40 hover:text-accent"
                    }`}
                  >
                    {area}
                    {area !== "הכל" && (
                      <span className="mr-1.5 text-xs opacity-60">
                        ({pastExperts.filter((e) => e.expertise_area === area).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Results summary */}
            {activeFilter !== "הכל" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground mb-6"
              >
                מציג {filteredPast.length} מומחים בתחום <span className="text-accent font-medium">{activeFilter}</span>
              </motion.p>
            )}

            {filteredPast.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                <p className="text-muted-foreground">אין מומחים בתחום זה</p>
              </div>
            ) : (
              <>
                {/* Grouped by cycle */}
                <div className="space-y-12">
                  {visibleCycles.map(([cycleName, experts], cycleIndex) => (
                    <motion.div
                      key={cycleName}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ delay: cycleIndex * 0.1, duration: 0.5 }}
                    >
                      {/* Cycle header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-accent" />
                          <h3 className="text-lg font-bold text-foreground">{cycleName}</h3>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {experts.length} מומחים
                        </Badge>
                        <div className="flex-1 h-px bg-border/50" />
                      </div>

                      {/* Experts grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {experts.map((expert, i) => (
                          <PastExpertCard
                            key={expert.id}
                            expert={expert}
                            index={i}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Show more button */}
                {groupedByCycle.length > 2 && !showAllCycles && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-10"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setShowAllCycles(true)}
                      className="rounded-full px-8 py-5 border-border/50 hover:border-accent/40"
                    >
                      <ChevronDown className="w-4 h-4 ml-2" />
                      הצגת {groupedByCycle.length - 2} מחזורים נוספים
                    </Button>
                  </motion.div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}