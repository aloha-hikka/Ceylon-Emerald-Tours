"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import TourCard from "./TourCard";
import { featuredTours } from "@/data/toursData";

/**
 * "Featured Tours" on the landing page: a swipeable, snap-scrolling row of tour cards.
 * - Touch: swipe. Trackpad: two-finger scroll. Mouse: the arrow buttons or the keyboard
 *   (focus the row, then use the left and right arrow keys).
 * - The first cards are the two new Bandarawela & Ella day tours (see featuredTours).
 */
export default function FeaturedTours() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const gap = 20; // matches gap-5 below
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  };

  const arrow =
    "glass glow-hover flex h-11 w-11 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:shadow-none";

  return (
    <section id="featured-tours" aria-labelledby="featured-tours-title" className="section-y bg-gradient-to-b from-ceylon-night to-ceylon-deep/60">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            <h2 id="featured-tours-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Featured Tours
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
              New private day tours around Bandarawela and Ella, plus guest favourites from across Sri Lanka.
              Prices in US dollars, and nothing is paid online.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/packages" className="btn-glass mr-1 hidden sm:inline-flex">
              View all tours
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button type="button" onClick={() => scrollByCard(-1)} disabled={!canPrev} aria-label="Scroll featured tours left" className={arrow}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scrollByCard(1)} disabled={!canNext} aria-label="Scroll featured tours right" className={arrow}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Scroller. Negative margins let cards bleed to the screen edge on phones; the vertical
            padding gives the hover lift and glow room, because overflow-x also clips vertically. */}
        <div
          ref={scrollerRef}
          role="region"
          aria-label="Featured tours. Scroll sideways to see more."
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              scrollByCard(1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              scrollByCard(-1);
            }
          }}
          className="no-scrollbar -mx-5 mt-10 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth px-5 py-8 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [scroll-padding-inline:1.25rem] sm:[scroll-padding-inline:2rem] lg:[scroll-padding-inline:0]"
        >
          <ul className="flex w-max gap-5">
            {featuredTours.map((tour, i) => (
              <li key={tour.id} className="w-[78vw] max-w-[22rem] shrink-0 snap-start sm:w-[22rem] xl:w-[23.5rem] xl:max-w-none">
                <TourCard tour={tour} index={i} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 text-center sm:hidden">
          <Link href="/packages" className="btn-glass">
            View all tours
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
