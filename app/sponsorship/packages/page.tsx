// app/sponsorship/packages/page.tsx
import Image from "next/image";
import Link from "next/link";

type Tier = {
  name: string;
  amount: string;
  tagline: string;
  highlights: string[];
  perks: string[];
  featured?: boolean;
  accent?: "primary" | "gold" | "neutral";
};

const TIERS: Tier[] = [
  {
    name: "Title Sponsor",
    amount: "$5,000+",
    tagline: "Front-and-center partnership for our entire season.",
    highlights: [
      "Best fit for companies that want maximum student impact + maximum visibility",
      "Helps fund major season costs: registration, parts, tools, travel, and outreach",
      "Top placement on apparel + robot + all sponsor displays",
    ],
    perks: [
      "All-sponsor benefits (visit, demo, meet the team, shop tour)",
      "Logo on robot (largest placement, most visible area)",
      "Logo on team shirts (front placement, largest size — where space allows)",
      "Top billing on pit signage / sponsor banner + website featured section",
      "Dedicated sponsor spotlight posts (minimum 3x) + optional short video feature",
      "Private demo day option for your organization (at school or your site, if feasible)",
      "Thank-you plaque + framed team photo",
    ],
    featured: true,
    accent: "gold",
  },
  {
    name: "Platinum",
    amount: "$2,500 - $4,999",
    tagline: "High-impact support with major recognition.",
    highlights: [
      "A powerful tier for local engineering, manufacturing, and tech companies",
      "Meaningful contribution toward build season parts and competition readiness",
      "Strong visibility on apparel and at competitions",
    ],
    perks: [
      "All-sponsor benefits (visit, demo, meet the team, shop tour)",
      "Large logo on robot (prime placement, space-based)",
      "Logo on team shirts (back placement, large size)",
      "Logo on pit signage / sponsor banner + website listing",
      "Dedicated sponsor spotlight post (minimum 2x)",
      "Invitation to an open shop night + robot test/demo session",
    ],
    accent: "primary",
  },
  {
    name: "Gold",
    amount: "$1,000 - $2,499",
    tagline: "Great visibility and real build-season impact.",
    highlights: [
      "Supports key robot subsystems, materials, and outreach",
      "A favorite tier for businesses that want solid recognition",
      "Strong sponsor presence without the biggest price tag",
    ],
    perks: [
      "All-sponsor benefits (visit, demo, meet the team, shop tour)",
      "Medium logo on robot (space-based)",
      "Logo on team shirts (back placement, medium size)",
      "Logo on pit signage / sponsor banner + website listing",
      "Group sponsor thank-you post + optional team photo moment at a meeting",
    ],
    accent: "gold",
  },
  {
    name: "Silver",
    amount: "$500 - $999",
    tagline: "Keeps the team moving — every bit matters.",
    highlights: [
      "Helps cover tools, safety gear, batteries, and event costs",
      "Solid recognition for local supporters",
      "Perfect for small businesses, families, and community partners",
    ],
    perks: [
      "All-sponsor benefits (visit, demo, meet the team, shop tour)",
      "Small logo on robot OR pit signage (space-based)",
      "Logo on team shirts (back placement, small size — space-based)",
      "Website listing",
      "Group sponsor thank-you post",
    ],
    accent: "neutral",
  },
  {
    name: "Bronze",
    amount: "$250 - $499",
    tagline: "An easy way to support STEM at our school.",
    highlights: [
      "Great entry-level sponsorship with real impact when many contribute",
      "Ideal for individuals, alumni families, and community supporters",
      "Small sponsorship is always better than no sponsorship",
    ],
    perks: [
      "All-sponsor benefits (visit, demo, meet the team, shop tour)",
      "Name or small logo listed on website",
      "Group sponsor thank-you post",
    ],
    accent: "neutral",
  },
];

function TierCard({ tier }: { tier: Tier }) {
  const cardClass = tier.featured ? "cb-card-strong" : "cb-card";
  const badgeClass =
    tier.accent === "gold"
      ? "border-[rgba(255,196,0,0.45)] bg-[rgba(255,196,0,0.10)]"
      : tier.accent === "primary"
      ? "border-[rgba(30,91,255,0.45)] bg-[rgba(30,91,255,0.10)]"
      : "border-white/10 bg-white/5";

  const buttonClass =
    tier.accent === "gold"
      ? "cb-btn cb-btn-gold"
      : tier.accent === "primary"
      ? "cb-btn cb-btn-primary"
      : "cb-btn";

  return (
    <div className={`${cardClass} relative overflow-hidden p-5 sm:p-6`}>
      {tier.featured && (
        <div className="absolute right-4 top-4 rounded-full border border-[rgba(255,196,0,0.45)] bg-[rgba(255,196,0,0.10)] px-3 py-1 text-xs text-white/80">
          Most Impact
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="cb-kicker">Sponsorship tier</div>
          <h3 className="mt-2 text-xl font-semibold">{tier.name}</h3>
          <div className="mt-1 text-sm cb-muted">{tier.tagline}</div>
        </div>

        <div className={`shrink-0 rounded-2xl border px-4 py-2 ${badgeClass}`}>
          <div className="text-xs cb-muted-2">Contribution</div>
          <div className="text-lg font-semibold">{tier.amount}</div>
        </div>
      </div>

      <div className="mt-5 cb-divider" />

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="text-sm font-semibold">Why this tier</div>
          <ul className="mt-3 space-y-2 text-sm cb-muted">
            {tier.highlights.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold">Recognition & benefits</div>
          <ul className="mt-3 space-y-2 text-sm cb-muted">
            {tier.perks.map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link href="/contact" className={buttonClass}>
          Become a Sponsor <span aria-hidden>→</span>
        </Link>
        <a href="mailto:canterburycougarbots@gmail.com" className="cb-btn" title="Email the team">
          Email us
        </a>
        <Link href="/sponsorship" className="cb-btn" title="Back to Sponsorship overview">
          Sponsorship Overview
        </Link>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="cb-card p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm cb-muted leading-relaxed">{children}</div>
    </div>
  );
}

export default function SponsorshipPackagesPage() {
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
        <div className="cb-kicker">Sponsorship packages</div>
        <h1 className="cb-title mt-3 text-4xl sm:text-5xl">
          Choose a package — <span className="cb-muted">or build a custom partnership</span>
        </h1>

        <p className="cb-lead mt-4 max-w-3xl">
          These packages make it easy to sponsor the Canterbury Cougarbots (FRC 11436). Every sponsor
          is welcome to visit our school, meet the students, see our build environment, and watch the
          robot in action.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" className="cb-btn cb-btn-primary">
            Become a Sponsor <span aria-hidden>→</span>
          </Link>
          <a href="mailto:canterburycougarbots@gmail.com" className="cb-btn">
            Email us
          </a>
          <Link href="/sponsorship" className="cb-btn">
            Sponsorship Overview
          </Link>
        </div>
      </section>

      {/* Quick Notes */}
      <section className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard title="Cash + services both count">
            Sponsorship isn’t only money. If you can provide services (CNC machining, fabrication,
            laser cutting, printing, materials, engineering support), we can count that value toward a
            tier based on a fair estimate.
          </InfoCard>

          <InfoCard title="In-kind support is “as-needed”">
            If you offer a service, we’ll reach out when we need it. If we don’t end up needing that
            specific service this season, we won’t claim it as tier value — but we can still list you
            as a supporter and coordinate for future needs.
          </InfoCard>

          <InfoCard title="Logo sizing & placement">
            Logo sizes and placements are space-based and follow FIRST rules and our robot/pit layout.
            Higher tiers receive larger and more prominent placement.
          </InfoCard>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="cb-kicker">Packages</div>
            <h2 className="cb-title mt-2 text-3xl">Sponsorship tiers</h2>
            <p className="cb-lead mt-2 max-w-3xl">
              Bigger tiers create the fastest impact — but smaller sponsorships still matter a lot.
              We recognize sponsors on team shirts, the robot (space-based), pit/sponsor displays, and
              this website.
            </p>
          </div>

          <div className="cb-card px-4 py-3 text-sm cb-muted">
            Want a custom package? We can tailor recognition to fit your budget and goals.
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          {TIERS.map((t) => (
            <TierCard key={t.name} tier={t} />
          ))}
        </div>
      </section>

      {/* FAQ / Next Steps */}
      <section className="mx-auto mt-12 max-w-6xl px-4 pb-16">
        <div className="cb-card-strong p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="cb-kicker">FAQ</div>
              <h2 className="cb-title mt-2 text-3xl">Details sponsors ask for</h2>

              <div className="mt-5 space-y-4">
                <div className="cb-card p-5">
                  <div className="text-sm font-semibold">Can we customize a package?</div>
                  <div className="mt-2 text-sm cb-muted leading-relaxed">
                    Yes. If you’d like to focus on a specific outcome (student mentorship, outreach,
                    a subsystem, tools, travel), we can tailor a package when possible.
                  </div>
                </div>

                <div className="cb-card p-5">
                  <div className="text-sm font-semibold">How do sponsor visits work?</div>
                  <div className="mt-2 text-sm cb-muted leading-relaxed">
                    Every sponsor can schedule a visit to meet the students, see our workspace, and
                    watch the robot run. We’ll coordinate a time that works for school policies and
                    your schedule.
                  </div>
                </div>

                <div className="cb-card p-5">
                  <div className="text-sm font-semibold">How does in-kind/services value get counted?</div>
                  <div className="mt-2 text-sm cb-muted leading-relaxed">
                    If you provide services (CNC machining, fabrication, materials, printing, etc.),
                    we estimate value fairly based on the work used. Tier credit applies when a service
                    is actually needed and delivered.
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="cb-kicker">Next step</div>
              <h3 className="cb-title mt-2 text-2xl">Become a sponsor</h3>
              <p className="cb-lead mt-3">
                We’ll follow up quickly, confirm your tier (cash and/or services), and coordinate
                logo files, recognition, and a sponsor visit if desired.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/contact" className="cb-btn cb-btn-primary">
                  Contact us to sponsor <span aria-hidden>→</span>
                </Link>
                <a href="mailto:canterburycougarbots@gmail.com" className="cb-btn">
                  Email us
                </a>
              </div>

              <div className="mt-6 cb-card p-5">
                <div className="text-sm font-semibold">Logo file tip</div>
                <div className="mt-2 text-sm cb-muted leading-relaxed">
                  For best results on shirts and banners, send a vector logo (SVG, AI, or EPS) or a
                  high-resolution PNG with a transparent background.
                </div>
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