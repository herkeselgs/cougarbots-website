// app/contact/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Topic =
  | "Sponsorship"
  | "In-kind / Services (CNC, fabrication, etc.)"
  | "Mentorship"
  | "Media / Press"
  | "School visit / Demo"
  | "Other";

function buildMailto({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const enc = (s: string) => encodeURIComponent(s);
  return `mailto:${enc(to)}?subject=${enc(subject)}&body=${enc(body)}`;
}

export default function ContactPage() {
  const TEAM_EMAIL = "canterburycougarbots@gmail.com";
  const SCHOOL_NAME = "Canterbury School of Fort Myers";
  const MAP_QUERY = "Canterbury School of Fort Myers";

  const [topic, setTopic] = useState<Topic>("Sponsorship");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = `Cougarbots Contact — ${topic}`;
    const bodyLines = [
      `Topic: ${topic}`,
      `Name: ${name || "(not provided)"}`,
      `Organization: ${org || "(not provided)"}`,
      `Reply-to email: ${replyEmail || "(not provided)"}`,
      "",
      "Message:",
      message || "(no message)",
      "",
      "---",
      "Sent from the Canterbury Cougarbots website contact page.",
    ];
    return buildMailto({ to: TEAM_EMAIL, subject, body: bodyLines.join("\n") });
  }, [TEAM_EMAIL, topic, name, org, replyEmail, message]);

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
              <Link href="/sponsorship" className="cb-btn px-3 py-2 text-sm">
                Sponsorship
              </Link>
              <Link href="/sponsorship/packages" className="cb-btn px-3 py-2 text-sm">
                Packages
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
        <div className="cb-kicker">Contact</div>
        <h1 className="cb-title mt-3 text-4xl sm:text-5xl">
          Let’s connect — <span className="cb-muted">sponsorship, services, mentorship, anything</span>
        </h1>

        <p className="cb-lead mt-4 max-w-3xl">
          Whether you’re interested in sponsoring, offering in-kind services (CNC, fabrication, printing),
          mentoring students, or booking a school visit + robot demo, send us a message. We respond fast.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href={`mailto:${TEAM_EMAIL}`} className="cb-btn cb-btn-primary">
            Email the team <span aria-hidden>→</span>
          </a>
          <Link href="/sponsorship/packages" className="cb-btn">
            View sponsorship packages
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto mt-10 max-w-6xl px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Form */}
          <div className="cb-card-strong p-6 sm:p-8">
            <div className="cb-kicker">Message</div>
            <h2 className="cb-title mt-2 text-3xl">Send us a note</h2>
            <p className="cb-lead mt-3">
              This form opens your email app with a pre-filled message (no account needed, no backend required).
            </p>

            <form
              className="mt-6 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = mailtoHref;
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="cb-card p-4">
                  <label className="text-xs text-white/70">Your name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div className="cb-card p-4">
                  <label className="text-xs text-white/70">Company / Organization</label>
                  <input
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="Acme Manufacturing"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="cb-card p-4">
                  <label className="text-xs text-white/70">Your email (so we can reply)</label>
                  <input
                    value={replyEmail}
                    onChange={(e) => setReplyEmail(e.target.value)}
                    placeholder="you@company.com"
                    type="email"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div className="cb-card p-4">
                  <label className="text-xs text-white/70">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as Topic)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  >
                    <option>Sponsorship</option>
                    <option>In-kind / Services (CNC, fabrication, etc.)</option>
                    <option>Mentorship</option>
                    <option>Media / Press</option>
                    <option>School visit / Demo</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="cb-card p-4">
                <label className="text-xs text-white/70">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you’re interested in, your timeline, and the best way to reach you."
                  rows={6}
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className="cb-btn cb-btn-primary">
                  Open email draft <span aria-hidden>→</span>
                </button>
                <a href={mailtoHref} className="cb-btn" title="Opens a pre-filled email">
                  Or click here
                </a>
              </div>

              <div className="cb-card p-4">
                <div className="text-sm font-semibold">Prefer direct email?</div>
                <div className="mt-2 text-sm cb-muted">
                  Send a message to{" "}
                  <a className="underline decoration-white/20 underline-offset-4" href={`mailto:${TEAM_EMAIL}`}>
                    {TEAM_EMAIL}
                  </a>{" "}
                  and we’ll reply.
                </div>
              </div>
            </form>
          </div>

          {/* Right: Map + contact details */}
          <div className="grid gap-6">
            <div className="cb-card-strong overflow-hidden p-0">
              <div className="p-6 sm:p-8">
                <div className="cb-kicker">Location</div>
                <h2 className="cb-title mt-2 text-2xl">Find us on the map</h2>
                <p className="cb-lead mt-3">
                  We’re based at <span className="text-white/90 font-semibold">{SCHOOL_NAME}</span> in Fort Myers, Florida.
                </p>
              </div>

              <div className="relative aspect-[16/10] w-full border-t border-white/10 bg-black/20">
                <iframe
                  title="Map — Canterbury School of Fort Myers"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="p-6 sm:p-8">
                <a
                  className="cb-btn"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in Google Maps <span aria-hidden>→</span>
                </a>
              </div>
            </div>

            <div className="cb-card p-6">
              <div className="text-sm font-semibold">Quick contacts</div>
              <div className="mt-3 space-y-3 text-sm cb-muted">
                <div className="cb-card p-4">
                  <div className="text-xs text-white/60">Team email</div>
                  <div className="mt-1">
                    <a className="underline decoration-white/20 underline-offset-4" href={`mailto:${TEAM_EMAIL}`}>
                      {TEAM_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="cb-card p-4">
                  <div className="text-xs text-white/60">Sponsorship info</div>
                  <div className="mt-1">
                    <Link className="underline decoration-white/20 underline-offset-4" href="/sponsorship/packages">
                      Sponsorship packages page
                    </Link>
                  </div>
                </div>

                <div className="cb-card p-4">
                  <div className="text-xs text-white/60">Team leader</div>
                  <div className="mt-1 text-white/85">Stephan Sozkes (Student Founder)</div>
                  <div className="mt-1">
                    <a
                      className="underline decoration-white/20 underline-offset-4"
                      href="https://www.instagram.com/stephansozkes/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram: @stephansozkes
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="cb-card p-6">
              <div className="text-sm font-semibold">Want a visit or demo?</div>
              <p className="mt-2 text-sm cb-muted leading-relaxed">
                Every sponsor is welcome to schedule a visit to meet the students, tour our build environment,
                and see the robot in action (subject to school policies and scheduling).
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/sponsorship" className="cb-btn">
                  Sponsorship overview
                </Link>
                <Link href="/sponsorship/packages" className="cb-btn cb-btn-primary">
                  View packages <span aria-hidden>→</span>
                </Link>
              </div>
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