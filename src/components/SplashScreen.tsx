"use client";

import SafeImage, { DEFAULT_FALLBACK } from "./SafeImage";

export default function SplashScreen() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-9 overflow-hidden bg-gradient-to-br from-ceylon-deep via-ceylon-night to-ceylon-night [animation:splash-out_0.5s_ease-out_0.9s_forwards]"
    >
      <div className="absolute -right-24 top-10 h-96 w-96 animate-pulse rounded-full bg-ceylon-glow/15 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-80 w-80 animate-pulse rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative flex h-28 w-28 items-center justify-center animate-loader-rise">
        <span className="absolute inset-0 rounded-full border-2 border-white/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-ceylon-glow [animation-duration:1.2s]" />
        <img
          src="/images/logo.jpg" 
          alt="Ceylon Emerald Tours"
          className="h-14 w-14 rounded-full object-cover animate-loader-breathe"
        />
      </div>

      <div className="text-center animate-loader-rise [animation-delay:150ms]">
        <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Ceylon <span className="text-ceylon-glow">Emerald</span> Tours
        </p>
        <p className="mt-1.5 text-sm text-white/60">Preparing your journey&hellip;</p>
      </div>

      <div className="relative h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <span className="absolute inset-y-0 left-0 w-1/3 animate-loader-sweep rounded-full bg-gradient-to-r from-ceylon-glow to-ceylon-gold" />
      </div>
    </div>
  );
}