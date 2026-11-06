"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import TourCard from "./TourCard";
import type { Tour, VehicleType } from "@/data/toursData";

type VehicleFilter = "all" | VehicleType;

const FILTERS: { key: VehicleFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "tuk-tuk", label: "Tuk Tuk" },
  { key: "jeep", label: "Jeep" },
];

/** Day tour cards with an animated vehicle filter ("All", "Tuk Tuk", "Jeep"). */
export default function DayToursGrid({ tours }: { tours: Tour[] }) {
  const [filter, setFilter] = useState<VehicleFilter>("all");

  const counts = useMemo(() => {
    const map: Record<VehicleFilter, number> = { all: tours.length, "tuk-tuk": 0, jeep: 0 };
    for (const t of tours) if (t.vehicleType) map[t.vehicleType] += 1;
    return map;
  }, [tours]);

  const visible = useMemo(
    () => (filter === "all" ? tours : tours.filter((t) => t.vehicleType === filter)),
    [tours, filter]
  );

  return (
    <MotionConfig reducedMotion="user">
      <div role="group" aria-label="Filter day tours by vehicle" className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              disabled={counts[f.key] === 0}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? "border-transparent bg-gradient-to-r from-ceylon-glow to-ceylon-gold text-ceylon-night shadow-lg shadow-ceylon-gold/25"
                  : "border-white/20 bg-white/10 text-white/85 backdrop-blur-md hover:border-ceylon-glow/60 hover:text-ceylon-glow"
              }`}
            >
              {f.label}
              <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-ceylon-night/15" : "bg-white/10 text-white/60"}`}>
                {counts[f.key]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        Showing {visible.length} day {visible.length === 1 ? "tour" : "tours"}
      </p>

      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((tour, i) => (
            <motion.div
              key={tour.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TourCard tour={tour} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}
