"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import IntroSequence from "@/components/IntroSequence";

type Mouse = { x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function HomePage() {
  const [introDone, setIntroDone] = useState(false);

  // Parallax / tilt for the big background logo
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [mouse, setMouse] = useState<Mouse>({ x: 0.5, y: 0.5 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      setMouse({ x: clamp(x, 0, 1), y: clamp(y, 0, 1) });
    };

    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const tilt = useMemo(() => {
    // convert normalized mouse (0..1) to centered (-0.5..0.5)
    const cx = mouse.x - 0.5;
    const cy = mouse.y - 0.5;

    // subtle, sponsor-friendly
    const rotY = cx * 10; // degrees
    const rotX = -cy * 8; // degrees
    const tx = cx * 16; // px
    const ty = cy * 12; // px

    return { rotX, rotY, tx, ty };
  }, [mouse]);

  return (
    <main className="cb-bg cb-noise">
      {!introDone && <IntroSequence onDone={() => setIntroDone(true)} />}

      {/* Top Nav */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mt-3 cb-card flex items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <Image
                  src="/logo.png"
                  alt="Canterbury Cougarbots logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Canterbury Cougarbots</div>
                <div className="text-xs cb-muted">FRC Team 11436 • Fort Myers, FL</div>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <Link href="/sponsorship" className="cb-btn px-3 py-2 text-sm">
                Sponsorship
              </Link>
              <Link href="/contact" className="cb-btn px-3 py-2 text-sm">
                Contact
              </Link>
              <a
                href="https://www.firstinspires.org/robotics/frc"
                target="_blank"
                rel="noreferrer"
                className="cb-btn cb-btn-primary px-3 py-2 text-sm"
                title="Learn about FIRST Robotics Competition"
              >
                What is FRC?
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left copy */}
          <div>
            <div className="cb-kicker">2026 • Rookie season</div>
            <h1 className="cb-title mt-3 text-4xl sm:text-5xl">
              Building robots.
              <span className="block cb-muted">Building leaders.</span>
            </h1>

            <p className="cb-lead mt-4 max-w-xl">
              We’re the Canterbury Cougarbots (FRC 11436) — a student-led robotics team bringing
              engineering, coding, and real-world problem solving to Canterbury School of Fort Myers.
              Sponsors help us turn curiosity into capability.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/sponsorship" className="cb-btn cb-btn-primary">
                Sponsor the Cougarbots
                <span aria-hidden>→</span>
              </Link>
              <Link href="/contact" className="cb-btn">
                Contact the team
              </Link>
              <button
                type="button"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className="cb-btn cb-btn-gold"
                title="Hover the logo card on the right!"
              >
                Interactive Hero
              </button>
            </div>

            {/* Quick credibility row */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="cb-card px-4 py-4">
                <div className="text-sm font-semibold">Student-Led</div>
                <div className="mt-1 text-sm cb-muted">
                  Design, build, code, outreach — run by students with mentor guidance.
                </div>
              </div>
              <div className="cb-card px-4 py-4">
                <div className="text-sm font-semibold">STEM + Community</div>
                <div className="mt-1 text-sm cb-muted">
                  We demo robotics at school and local events to inspire younger students.
                </div>
              </div>
              <div className="cb-card px-4 py-4">
                <div className="text-sm font-semibold">Sponsor Impact</div>
                <div className="mt-1 text-sm cb-muted">
                  Funding supports parts, tools, safety gear, registration, and travel.
                </div>
              </div>
            </div>
          </div>

          {/* Right interactive “3D logo card” */}
          <div className="relative">
            <div
              className="cb-card-strong relative overflow-hidden"
              style={{
                perspective: "1000px",
              }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              {/* glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(700px 420px at 50% 20%, rgba(30,91,255,0.30), transparent 60%)",
                }}
              />

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="cb-kicker">Our Robot: DigBot</div>
                    <div className="mt-2 text-lg font-semibold">Canterbury Cougarbots</div>
                    <div className="mt-1 text-sm cb-muted">2026 - Rookie Season</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                    Tilt
                  </div>
                </div>

                <div className="mt-5 cb-divider" />

                {/* 3D stage */}
                <div className="mt-5">
                  <div
                    className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: `translate3d(${tilt.tx}px, ${tilt.ty}px, 0) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
                      transition: hovering ? "transform 80ms linear" : "transform 320ms ease",
                      boxShadow: "0 30px 90px rgba(0,0,0,0.55)",
                    }}
                  >
                    {/* robot image */}
                    <Image
                      src="/robot.jpg"
                      alt="Canterbury Cougarbots robot"
                      fill
                      priority
                      sizes="(max-width: 1024px) 92vw, 420px"
                      className="object-contain p-6"
                    />

                    {/* glass sheen */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(120deg, rgba(255,255,255,0.06), transparent 40%, rgba(255,255,255,0.04))",
                        transform: `translate3d(${-(tilt.tx * 0.8)}px, ${-(tilt.ty * 0.8)}px, 40px)`,
                        transition: hovering ? "transform 80ms linear" : "transform 320ms ease",
                      }}
                    />

                    {/* edge vignette for readability */}
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* floating chips */}
            <div className="pointer-events-none absolute -bottom-4 -left-2 hidden sm:block">
              <div className="cb-card px-3 py-2 text-xs text-white/70">
                Mechanical • Programming • Outreach
              </div>
            </div>
            <div className="pointer-events-none absolute -top-3 right-2 hidden sm:block">
              <div className="cb-card px-3 py-2 text-xs text-white/70">FRC • 11436</div>
            </div>
          </div>
        </div>
      </section>

      {/* Photos strip (optional, looks legit fast) */}
      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="cb-card p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="cb-kicker">Real moments</div>
              <h2 className="cb-title mt-2 text-2xl">What Cougarbots looks like</h2>
              <p className="cb-lead mt-2 max-w-2xl">
                From build season to outreach to competition days — here are a few snapshots of our
                team in action.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <PhotoCard src="/photos/build.jpg" label="In the shop" />
            <PhotoCard src="/photos/team.jpg" label="Team culture" />
            <PhotoCard src="/photos/outreach.jpg" label="Outreach" />
          </div>
        </div>
      </section>

      {/* Sponsor CTA */}
      <section className="mx-auto mt-14 max-w-6xl px-4 pb-16">
        <div className="cb-card-strong p-6 sm:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="cb-kicker">Sponsorship</div>
              <h2 className="cb-title mt-2 text-3xl">Sponsors make Cougarbots possible</h2>
              <p className="cb-lead mt-3 max-w-2xl">
                Your support funds the essential costs of an FRC season: robot parts, tools, safety
                equipment, registration, and travel. We proudly recognize sponsors on our robot,
                team apparel, and this website.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/sponsorship" className="cb-btn cb-btn-primary">
                  View sponsorship options <span aria-hidden>→</span>
                </Link>
                <Link href="/contact" className="cb-btn">
                  Talk to our team
                </Link>
              </div>
            </div>

            <div className="cb-card p-5">
              <div className="text-sm font-semibold">What your support provides</div>
              <ul className="mt-3 space-y-2 text-sm cb-muted">
                <li>• Robot parts & materials</li>
                <li>• Tools & safety equipment</li>
                <li>• Competition registration & travel</li>
                <li>• Outreach demos for younger students</li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="mx-auto mt-10 max-w-6xl px-1 text-center text-xs cb-muted">
          © {new Date().getFullYear()} Canterbury Cougarbots • FIRST Robotics Competition Team 11436
        </footer>
      </section>
    </main>
  );
}

function PhotoCard({ src, label }: { src: string; label: string }) {
  return (
    <div className="cb-card overflow-hidden">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 30vw, 360px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80 backdrop-blur">
          {label}
        </div>
      </div>
    </div>
  );
}