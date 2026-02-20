// app/sponsorship/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ImpactStat = {
  label: string;
  value: number;
  suffix?: string; // "+", "%", etc.
  sublabel?: string;
  accent?: "primary" | "gold" | "neutral";
};

function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

function useCountUp(target: number, active: boolean, durationMs = 1200) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    const start = performance.now();
    const from = 0;
    const to = target;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const next = from + (to - from) * eased;
      setVal(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, durationMs]);

  return val;
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="cb-card p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm cb-muted leading-relaxed">{children}</div>
    </div>
  );
}

function StatPill({
  stat,
  active,
}: {
  stat: ImpactStat;
  active: boolean;
}) {
  const val = useCountUp(stat.value, active, 1050);

  const pillClass =
    stat.accent === "gold"
      ? "border-[rgba(255,196,0,0.35)] bg-[rgba(255,196,0,0.10)]"
      : stat.accent === "primary"
      ? "border-[rgba(30,91,255,0.35)] bg-[rgba(30,91,255,0.10)]"
      : "border-white/10 bg-white/5";

  return (
    <div className={`cb-card flex items-center justify-between gap-4 p-5 ${pillClass}`}>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-white/90">{stat.label}</div>
        {stat.sublabel ? <div className="mt-1 text-sm cb-muted">{stat.sublabel}</div> : null}
      </div>

      <div className="shrink-0 text-right">
        <div className="text-3xl font-semibold tracking-tight">
          {formatNumber(val)}
          {stat.suffix ? <span className="text-white/80">{stat.suffix}</span> : null}
        </div>
      </div>
    </div>
  );
}

function ImpactStats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) setActive(true);
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Removed the first two % boxes + removed the questionable/extra % claim.
  // Keep it simple: reach + ecosystem scale.
  const stats: ImpactStat[] = useMemo(
    () => [
      {
        label: "FRC students each season",
        value: 93000,
        suffix: "+",
        sublabel: "A global pipeline of future talent",
        accent: "primary",
      },
      {
        label: "FIRST youth participants (since 1989)",
        value: 4000000,
        suffix: "+",
        sublabel: "A worldwide STEM community",
        accent: "gold",
      },
      {
        label: "FIRST events each season",
        value: 5400,
        suffix: "+",
        sublabel: "Teams + partners across the world",
        accent: "neutral",
      },
      {
        label: "FIRST volunteer & educator hours (recent season)",
        value: 39000000,
        suffix: "+",
        sublabel: "Community power behind the program",
        accent: "neutral",
      },
    ],
    []
  );

  const notableNames = useMemo(
    () => [
      "NASA",
      "Boeing",
      "Apple",
      "Qualcomm",
      "Rockwell Automation",
      "RTX",
      "3M",
      "BAE Systems",
      "TE Connectivity",
      "Bechtel",
    ],
    []
  );

  return (
    <section ref={ref} className="mx-auto mt-10 max-w-6xl px-4">
      <div className="cb-card-strong relative overflow-hidden p-6 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 18% 10%, rgba(30,91,255,0.20), transparent 60%), radial-gradient(900px 520px at 82% 15%, rgba(255,196,0,0.12), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="cb-kicker">Business value</div>
          <h2 className="cb-title mt-2 text-3xl">Visibility in a global STEM ecosystem</h2>
          <p className="cb-lead mt-3 max-w-3xl">
            Sponsoring Cougarbots places your brand inside a community where engineering, innovation,
            and future talent are the main event — not an afterthought.
          </p>

          {/* New display style: stacked “stat pills” */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {stats.map((s) => (
              <StatPill key={s.label} stat={s} active={active} />
            ))}
          </div>

          {/* Keep the business explanation + notable names */}
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <InfoCard title="Brand trust + goodwill">
              Sponsorship signals that your company invests in students and innovation. It’s a strong,
              positive message to customers, families, and the community.
            </InfoCard>

            <InfoCard title="Future talent + recruiting">
              FIRST is a known pipeline for motivated STEM students. Sponsoring gives your brand early
              visibility with students who value engineering and hands-on building.
            </InfoCard>

            <InfoCard title="Employee engagement opportunity">
              If your team wants it, sponsorship can include a visit and skills-based support (as allowed).
              Many companies use programs like this to strengthen culture through purpose-driven involvement.
            </InfoCard>
          </div>

          <div className="mt-6 cb-card p-5">
            <div className="text-sm font-semibold">Who supports FIRST?</div>
            <div className="mt-2 text-sm cb-muted leading-relaxed">
              FIRST is supported by many top organizations in aerospace, defense, manufacturing, and tech.
              Examples include:
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {notableNames.map((n) => (
                <span
                  key={n}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sponsorship/packages" className="cb-btn cb-btn-primary">
              View sponsorship packages <span aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="cb-btn">
              Contact the team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SponsorshipPage() {
  return (
    <main className="cb-bg cb-noise">
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
              <Link href="/" className="cb-btn px-3 py-2 text-sm">
                Home
              </Link>
              <Link href="/sponsorship/packages" className="cb-btn px-3 py-2 text-sm">
                Packages
              </Link>
              <Link href="/contact" className="cb-btn px-3 py-2 text-sm">
                Contact
              </Link>
              <a
                href="https://www.firstinspires.org/robotics/frc"
                target="_blank"
                rel="noreferrer"
                className="cb-btn cb-btn-primary px-3 py-2 text-sm"
              >
                What is FRC?
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:pt-14">
        <div className="cb-kicker">Sponsorship</div>
        <h1 className="cb-title mt-3 text-4xl sm:text-5xl">
          Turn sponsorship into{" "}
          <span className="cb-muted">visibility, goodwill, and future talent</span>
        </h1>

        <p className="cb-lead mt-4 max-w-3xl">
          Sponsoring the Canterbury Cougarbots puts your brand in front of students, families, and a wider
          STEM ecosystem — while supporting a team that builds real engineering skills. Every sponsor is
          welcome to visit our school, meet the students, see our build environment, and watch the robot
          in action.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/sponsorship/packages" className="cb-btn cb-btn-primary">
            View sponsorship packages <span aria-hidden>→</span>
          </Link>
          <Link href="/contact" className="cb-btn">
            Sponsor / Contact
          </Link>
          <a href="mailto:canterburycougarbots@gmail.com" className="cb-btn">
            Email us
          </a>
        </div>
      </section>

      {/* Business value counters / proof */}
      <ImpactStats />

      {/* How sponsorship works (business framing) */}
      <section className="mx-auto mt-10 max-w-6xl px-4 pb-16">
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard title="Brand placement that people remember">
            Robot + pit signage + shirts + website. FRC is visually intense and sponsor logos are part of the culture.
            Higher tiers receive larger, more prominent placement (space-based).
          </InfoCard>

          <InfoCard title="Cash + services both count">
            Sponsorship isn’t only money. If you can provide services (CNC machining, fabrication, laser cutting,
            printing, materials, engineering support), we can count that value toward a tier based on a fair estimate.
          </InfoCard>

          <InfoCard title="Sponsor visits + real relationship">
            Every sponsor can schedule a visit to meet the students, see our workspace, and watch the robot run.
            We want you to personally see what you’re powering.
          </InfoCard>
        </div>

        <div className="mt-8 cb-card-strong p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="cb-kicker">Next step</div>
              <h2 className="cb-title mt-2 text-3xl">See the packages, then pick what fits</h2>
              <p className="cb-lead mt-3 max-w-2xl">
                Our packages are built for businesses: clear benefits, fair recognition, and a relationship you can
                actually feel — including school visits and robot demos for every sponsor.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/sponsorship/packages" className="cb-btn cb-btn-primary">
                  View sponsorship packages <span aria-hidden>→</span>
                </Link>
                <Link href="/contact" className="cb-btn">
                  Contact us
                </Link>
              </div>
            </div>

            <div className="cb-card p-5">
              <div className="text-sm font-semibold">Sponsor-friendly promise</div>
              <ul className="mt-3 space-y-2 text-sm cb-muted">
                <li>• Clear recognition (shirts, website, signage; robot space-based)</li>
                <li>• Fast follow-up and simple onboarding</li>
                <li>• Transparent, team-only use of funds</li>
                <li>• End-of-season impact summary available upon request</li>
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