"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "montage" | "title" | "subtitle" | "reveal" | "done";

export default function IntroSequence({ onDone }: { onDone: () => void }) {
  /**
   * Put your intro photos here:
   * public/intro/01.jpg ... public/intro/15.jpg
   * If you have fewer/more, change `count`.
   */
  const images = useMemo(() => {
    const count = 8; // change to 10–15 or however many you have
    return Array.from({ length: count }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `/intro/${n}.jpg`;
    });
  }, []);

  const [phase, setPhase] = useState<Phase>("montage");
  const [index, setIndex] = useState(0);

  // Montage timing: starts at 0.5s and accelerates to ~60ms floor
  const delayMsRef = useRef(500);
  const timerRef = useRef<number | null>(null);

  // Darkness overlay (0..1)
  const [darkness, setDarkness] = useState(0.25);

  // Title states
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  // Reveal animation
  const [slideUp, setSlideUp] = useState(false);

  // tiny “photo flicker” for energy
  const [flash, setFlash] = useState(false);

  // NEW: montage top text
  const [montageLine, setMontageLine] = useState<"line1" | "line2">("line1");

  // Optional: random tilt so it feels like flipping through memories
  const tiltDeg = useMemo(() => {
    // Precompute tilts so they don't change every render
    return images.map((_, i) => {
      // deterministic-ish tilt based on index
      const raw = Math.sin((i + 1) * 999) * 6; // -6..6
      return Math.max(-4.5, Math.min(4.5, raw));
    });
  }, [images]);

  // Preload images to reduce flicker
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [images]);

  // NEW: Top text choreography during montage only
  useEffect(() => {
    if (phase !== "montage") return;

    setMontageLine("line1");
    // CHANGED: give more time to read line 1
    const t1 = window.setTimeout(() => setMontageLine("line2"), 1700);

    return () => window.clearTimeout(t1);
  }, [phase]);

  // Montage loop
  useEffect(() => {
    if (phase !== "montage") return;

    const tick = () => {
      setIndex((prev) => {
        const next = prev + 1;

        // flash quickly for a snappy montage feel
        setFlash(true);
        window.setTimeout(() => setFlash(false), 45);

        // accelerate
        delayMsRef.current = Math.max(60, delayMsRef.current * 0.86);

        // as it accelerates, darken slightly
        setDarkness((d) => Math.min(0.88, d + 0.03));

        if (next >= images.length) {
          // go dark fast
          setDarkness(0.96);
          window.setTimeout(() => setPhase("title"), 160);
          return images.length - 1;
        }

        return next;
      });

      timerRef.current = window.setTimeout(tick, delayMsRef.current);
    };

    timerRef.current = window.setTimeout(tick, delayMsRef.current);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [phase, images.length]);

  // Choreography after montage ends
  useEffect(() => {
    if (phase === "title") {
      setShowTitle(true);
      setShowSubtitle(false);
      setDarkness(0.92);

      const t = window.setTimeout(() => {
        setShowTitle(false);
        setPhase("subtitle");
      }, 1100);

      return () => window.clearTimeout(t);
    }

    if (phase === "subtitle") {
      setShowSubtitle(true);
      setDarkness(0.93);

      const t = window.setTimeout(() => {
        setShowSubtitle(false);
        setPhase("reveal");
      }, 950);

      return () => window.clearTimeout(t);
    }

    if (phase === "reveal") {
      // start slide-up to reveal website
      setDarkness(0.7);

      const t1 = window.setTimeout(() => setSlideUp(true), 140);
      const t2 = window.setTimeout(() => {
        setPhase("done");
        onDone();
      }, 1050);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
  }, [phase, onDone]);

  const skip = () => {
    // end immediately and reveal website
    setShowTitle(false);
    setShowSubtitle(false);
    setDarkness(0.7);
    setSlideUp(true);
    window.setTimeout(() => {
      setPhase("done");
      onDone();
    }, 600);
  };

  return (
    <div
      className={[
        "fixed inset-0 z-[999] overflow-hidden bg-black",
        slideUp ? "translate-y-[-105%]" : "translate-y-0",
        "transition-transform duration-1000 ease-[cubic-bezier(.2,.9,.2,1)]",
      ].join(" ")}
      aria-hidden={phase === "done"}
    >
      {/* Background (blurred fill) */}
      <div className="absolute inset-0">
        <Image
          src={images[index]}
          alt="Team montage background"
          fill
          priority
          sizes="100vw"
          className="object-cover scale-110 blur-2xl opacity-40"
        />

        {/* Cinematic lighting + darkness overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(900px 520px at 22% 10%, rgba(30,91,255,0.26), transparent 60%),
              radial-gradient(900px 520px at 78% 12%, rgba(11,31,168,0.22), transparent 62%),
              linear-gradient(180deg, rgba(0,0,0,${darkness}) 0%, rgba(0,0,0,${Math.min(
              0.98,
              darkness + 0.14
            )}) 100%)
            `,
          }}
        />

        {/* Quick flash during montage for snappiness */}
        <div
          className={[
            "absolute inset-0 transition-opacity duration-75",
            flash && phase === "montage" ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* NEW: Top story text during montage */}
      <div className="absolute left-0 right-0 top-14 z-10 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {/* subtle backdrop so it reads but still keeps photos the focus */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/25 backdrop-blur-[2px]" />
            <div className="relative rounded-2xl border border-white/10 px-4 py-3 text-center">
              {/* unchanged */}
              <div className="text-[11px] tracking-[0.35em] text-white/60">
                {phase === "montage" ? "COUGARBOTS" : ""}
              </div>

              {/* CHANGED: bigger headline text (only change requested) */}
              <div className="mt-2 h-12 overflow-hidden">
                <div
                  className={[
                    "transition-opacity duration-500",
                    phase === "montage" && montageLine === "line1" ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                >
                  <div className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
                    Behind every success story,
                  </div>
                </div>
                <div
                  className={[
                    "-mt-12 transition-opacity duration-500",
                    phase === "montage" && montageLine === "line2" ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                >
                  <div className="text-2xl font-semibold tracking-tight text-white/95 sm:text-3xl">
                    is a strong family.
                  </div>
                </div>
              </div>

              {/* unchanged */}
              <div className="mt-1 text-xs text-white/55">
                {phase === "montage" ? "Moments from build season & beyond" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center portrait image (3:4) */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className={[
            "relative aspect-[3/4] w-[68vw] max-w-[520px]",
            "overflow-hidden rounded-2xl border border-white/10 shadow-2xl",
            "bg-white/5",
          ].join(" ")}
          style={{
            transform:
              phase === "montage"
                ? `rotate(${tiltDeg[index] ?? 0}deg) scale(1.02)`
                : "rotate(0deg) scale(1.00)",
            transition: phase === "montage" ? "transform 120ms ease" : "transform 300ms ease",
          }}
        >
          <Image
            src={images[index]}
            alt="Cougarbots montage"
            fill
            sizes="(max-width: 640px) 80vw, 520px"
            className="object-cover"
            priority
          />

          {/* subtle bottom gradient so text overlays would be readable */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </div>

      {/* Top-right skip (sponsor-friendly) */}
      <div className="absolute right-4 top-4 z-10">
        <button
          type="button"
          onClick={skip}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white"
        >
          Skip
        </button>
      </div>

      {/* Title / Subtitle overlays */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* NEW: dark blue cover behind title/subtitle so text is always readable */}
        <div
          className={[
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            showTitle || showSubtitle ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{
            background:
              "radial-gradient(600px 260px at 50% 50%, rgba(10,15,44,0.92), rgba(10,15,44,0.62) 55%, rgba(10,15,44,0.10) 100%)",
          }}
        />

        <div className="text-center px-6">
          {/* Logo block */}
          <div
            className={[
              "mx-auto mb-5 h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
              showTitle || showSubtitle ? "opacity-100 scale-100" : "opacity-0 scale-95",
              "transition duration-500",
            ].join(" ")}
          >
            <Image
              src="/logo.png"
              alt="Canterbury Cougarbots logo"
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          {/* Main Title */}
          <div
            className={[
              showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
              "transition duration-500",
            ].join(" ")}
          >
            <div className="text-[11px] tracking-[0.35em] text-white/70">
              CANTERBURY SCHOOL OF FORT MYERS
            </div>

            {/* center-out line reveal behind the team name */}
            <div className="relative mt-3 inline-block">
              <div className="relative text-4xl font-semibold tracking-tight sm:text-6xl">
                Canterbury Cougarbots
              </div>
            </div>

            <div className="mt-2 text-sm text-white/70">
              FIRST Robotics Competition • Team 11436
            </div>
            <div className="mx-auto mt-6 h-[3px] w-24 rounded-full bg-[#FFC400]" />
          </div>

          {/* Subtitle */}
          <div
            className={[
              showSubtitle
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none",
              "transition duration-500",
            ].join(" ")}
          >
            <div className="text-[11px] tracking-[0.40em] text-white/70">2026</div>
            <div className="mt-3 text-3xl font-semibold sm:text-5xl">Rookie Season</div>
            <div className="mx-auto mt-6 h-[3px] w-24 rounded-full bg-[#1E5BFF]" />
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="text-xs text-white/60">{phase === "montage" ? "Loading Cougarbots…" : ""}</div>
      </div>
    </div>
  );
}