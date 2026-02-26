"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Phase = "montage" | "title" | "subtitle" | "reveal" | "done";

/**
 * Detect "phone-ish" screens.
 * - width <= 640 OR
 * - short height (<= 720) OR
 * - tall aspect ratio (>= 1.35)
 */
function useIsPhone() {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth || 0;
      const h = window.innerHeight || 0;
      const aspect = h > 0 ? h / w : 0;

      const phone =
        w <= 640 || // typical Tailwind "sm" breakpoint
        h <= 720 || // short screens where your card can get cut off
        aspect >= 1.35; // tall screens (portrait-ish)

      setIsPhone(phone);
    };

    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  return isPhone;
}

export default function IntroSequence({ onDone }: { onDone: () => void }) {
  const images = useMemo(() => {
    const count = 8;
    return Array.from({ length: count }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `/intro/${n}.jpg`;
    });
  }, []);

  const isPhone = useIsPhone();

  const [phase, setPhase] = useState<Phase>("montage");
  const [index, setIndex] = useState(0);

  const delayMsRef = useRef(500);
  const timerRef = useRef<number | null>(null);

  const [darkness, setDarkness] = useState(0.25);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [slideUp, setSlideUp] = useState(false);
  const [flash, setFlash] = useState(false);

  const [montageLine, setMontageLine] = useState<"line1" | "line2">("line1");

  const tiltDeg = useMemo(() => {
    return images.map((_, i) => {
      const raw = Math.sin((i + 1) * 999) * 6;
      return Math.max(-4.5, Math.min(4.5, raw));
    });
  }, [images]);

  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [images]);

  useEffect(() => {
    if (phase !== "montage") return;
    setMontageLine("line1");
    const t1 = window.setTimeout(() => setMontageLine("line2"), 1700);
    return () => window.clearTimeout(t1);
  }, [phase]);

  useEffect(() => {
    if (phase !== "montage") return;

    const tick = () => {
      setIndex((prev) => {
        const next = prev + 1;

        setFlash(true);
        window.setTimeout(() => setFlash(false), 45);

        delayMsRef.current = Math.max(60, delayMsRef.current * 0.86);
        setDarkness((d) => Math.min(0.88, d + 0.03));

        if (next >= images.length) {
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
    setShowTitle(false);
    setShowSubtitle(false);
    setDarkness(0.7);
    setSlideUp(true);
    window.setTimeout(() => {
      setPhase("done");
      onDone();
    }, 600);
  };

  // Phone-only safe area padding (keeps notches safe without altering desktop)
  const safeAreaStyle = isPhone
    ? {
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }
    : undefined;

  return (
    <div
      className={[
        "fixed inset-0 z-[999] overflow-hidden bg-black",
        slideUp ? "translate-y-[-105%]" : "translate-y-0",
        "transition-transform duration-1000 ease-[cubic-bezier(.2,.9,.2,1)]",
      ].join(" ")}
      aria-hidden={phase === "done"}
      style={safeAreaStyle}
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

        <div
          className={[
            "absolute inset-0 transition-opacity duration-75",
            flash && phase === "montage" ? "opacity-100" : "opacity-0",
          ].join(" ")}
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Top story text during montage */}
      <div
        className={[
          "absolute left-0 right-0 top-14 z-10",
          isPhone ? "px-3" : "px-4",
        ].join(" ")}
        style={
          isPhone
            ? { top: "calc(env(safe-area-inset-top) + 56px)" }
            : undefined
        }
      >
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-black/25 backdrop-blur-[2px]" />
            <div
              className={[
                "relative rounded-2xl border border-white/10 text-center",
                isPhone ? "px-3 py-2" : "px-4 py-3",
              ].join(" ")}
            >
              <div
                className={[
                  "tracking-[0.35em] text-white/60",
                  isPhone ? "text-[10px]" : "text-[11px]",
                ].join(" ")}
              >
                {phase === "montage" ? "COUGARBOTS" : ""}
              </div>

              {/* Headline choreography */}
              <div
                className={isPhone ? "mt-2 overflow-hidden" : "mt-2 h-12 overflow-hidden"}
                style={isPhone ? { height: "clamp(44px, 8vw, 56px)" } : undefined}
              >
                <div
                  className={[
                    "transition-opacity duration-500",
                    phase === "montage" && montageLine === "line1" ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "font-semibold tracking-tight text-white/95",
                      isPhone ? "text-[clamp(18px,5.2vw,30px)] leading-tight" : "text-2xl sm:text-3xl",
                    ].join(" ")}
                  >
                    Behind every success story,
                  </div>
                </div>

                <div
                  className={[
                    isPhone ? "transition-opacity duration-500" : "-mt-12 transition-opacity duration-500",
                    phase === "montage" && montageLine === "line2" ? "opacity-100" : "opacity-0",
                  ].join(" ")}
                  style={isPhone ? { marginTop: "clamp(-44px, -8vw, -56px)" } : undefined}
                >
                  <div
                    className={[
                      "font-semibold tracking-tight text-white/95",
                      isPhone ? "text-[clamp(18px,5.2vw,30px)] leading-tight" : "text-2xl sm:text-3xl",
                    ].join(" ")}
                  >
                    is a strong family.
                  </div>
                </div>
              </div>

              <div className={isPhone ? "mt-1 text-[11px] text-white/55" : "mt-1 text-xs text-white/55"}>
                {phase === "montage" ? "Moments from build season & beyond" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center portrait image */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className={[
            "relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-white/5",
            // DESKTOP (old): aspect + width
            !isPhone ? "aspect-[3/4] w-[68vw] max-w-[520px]" : "",
            // PHONE (new): width + height constraint so it never clips
            isPhone ? "w-[86vw] max-w-[520px]" : "",
          ].join(" ")}
          style={{
            // DESKTOP (old)
            ...(isPhone ? { height: "min(66vh, 740px)" } : {}),
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
            sizes={isPhone ? "(max-width: 640px) 86vw, 520px" : "(max-width: 640px) 80vw, 520px"}
            className="object-cover"
            priority
          />
          <div className={isPhone ? "absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" : "absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent"} />
        </div>
      </div>

      {/* Top-right skip */}
      <div
        className="absolute z-20"
        style={
          isPhone
            ? { top: "calc(env(safe-area-inset-top) + 12px)", right: "12px" }
            : { right: "16px", top: "16px" }
        }
      >
        <button
          type="button"
          onClick={skip}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10 hover:text-white active:scale-[0.98] transition"
        >
          Skip
        </button>
      </div>

      {/* Title / Subtitle overlays */}
      <div className="absolute inset-0 flex items-center justify-center">
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
          <div
            className={[
              "mx-auto mb-5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
              isPhone ? "h-14 w-14" : "h-16 w-16",
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

          <div
            className={[
              showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
              "transition duration-500",
            ].join(" ")}
          >
            <div className={isPhone ? "text-[10px] tracking-[0.35em] text-white/70" : "text-[11px] tracking-[0.35em] text-white/70"}>
              CANTERBURY SCHOOL OF FORT MYERS
            </div>

            <div className="relative mt-3 inline-block">
              <div className={isPhone ? "font-semibold tracking-tight text-white text-[clamp(28px,7vw,56px)] leading-tight" : "text-4xl font-semibold tracking-tight sm:text-6xl"}>
                Canterbury Cougarbots
              </div>
            </div>

            <div className={isPhone ? "mt-2 text-[12px] text-white/70" : "mt-2 text-sm text-white/70"}>
              FIRST Robotics Competition • Team 11436
            </div>
            <div className={isPhone ? "mx-auto mt-5 h-[3px] w-20 rounded-full bg-[#FFC400]" : "mx-auto mt-6 h-[3px] w-24 rounded-full bg-[#FFC400]"} />
          </div>

          <div
            className={[
              showSubtitle
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none",
              "transition duration-500",
            ].join(" ")}
          >
            <div className={isPhone ? "text-[10px] tracking-[0.40em] text-white/70" : "text-[11px] tracking-[0.40em] text-white/70"}>
              2026
            </div>
            <div className={isPhone ? "mt-3 font-semibold text-[clamp(22px,6vw,48px)] leading-tight" : "mt-3 text-3xl font-semibold sm:text-5xl"}>
              Rookie Season
            </div>
            <div className={isPhone ? "mx-auto mt-5 h-[3px] w-20 rounded-full bg-[#1E5BFF]" : "mx-auto mt-6 h-[3px] w-24 rounded-full bg-[#1E5BFF]"} />
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={
          isPhone
            ? { bottom: "calc(env(safe-area-inset-bottom) + 16px)" }
            : { bottom: "24px" }
        }
      >
        <div className="text-xs text-white/60">
          {phase === "montage" ? "Loading Cougarbots…" : ""}
        </div>
      </div>
    </div>
  );
}