import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HoloBlob } from "@/components/layout/HoloBlob";

export const metadata: Metadata = {
  title: "About | RUINED",
  description: "The story and standards behind RUINED research compounds.",
};

const values = [
  {
    title: "Rigor First",
    desc: "Every decision starts with the question: does this hold up to scrutiny?",
  },
  {
    title: "No Shortcuts",
    desc: "We'd rather ship late than ship a batch we haven't verified.",
  },
  {
    title: "Straight Answers",
    desc: "No vague sourcing claims, no marketing fluff dressed up as data.",
  },
  {
    title: "Researcher-Obsessed",
    desc: "We build for people who read the fine print, not around them.",
  },
];

export default function AboutPage() {
  return (
    <div className="py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
          About RUINED
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-black uppercase leading-tight tracking-tight text-fg sm:text-5xl">
          Built for researchers who expect more from a supplier.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-fg-muted">
          RUINED started with a simple frustration: too many suppliers treat
          quality control as optional and documentation as an afterthought.
          We built RUINED to be the opposite — a catalog held to a strict
          internal standard, shipped fast, and backed by a team that
          actually knows the compounds it sells.
        </p>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border bg-gradient-to-b from-surface-2 to-black bg-noise">
            <HoloBlob className="-top-20 right-[-10%]" size={288} animated={false} />
            <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-40 w-28 items-center justify-center rounded-xl border border-chrome-500/30 bg-gradient-to-b from-surface-3 to-surface">
                <span className="font-display text-sm font-semibold tracking-widest text-gradient-holo">
                  RUINED
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-fg-faint">
                Every batch, held to a standard
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-fg">
              Our Standard
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              We work only with vetted manufacturing partners and screen
              every batch for identity and purity before it&apos;s listed —
              no exceptions, no rushed listings. If a batch doesn&apos;t
              meet our internal bar, it doesn&apos;t go up for sale.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              We&apos;re upfront about where we are today: independent
              third-party certificates aren&apos;t published yet, and
              we&apos;d rather tell you that plainly than overstate it. As
              that changes, this page will too.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-fg">
            What We Value
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-surface/60 p-6"
              >
                <h3 className="font-display text-sm font-black uppercase tracking-wide text-fg">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface/60 px-8 py-14 text-center">
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-fg sm:text-3xl">
            Ready to see the catalog?
          </h2>
          <Button href="/shop">Shop the Catalog</Button>
        </div>
      </Container>
    </div>
  );
}
