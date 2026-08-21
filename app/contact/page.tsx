import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | RUINED",
};

export default function ContactPage() {
  return (
    <div className="py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
          Contact
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-fg sm:text-5xl">
          Get In Touch
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted">
          Questions about an order, a compound, or anything else — reach out
          and a real person will get back to you.
        </p>

        <div className="mt-8 max-w-xl rounded-2xl border border-danger/50 bg-danger/10 px-5 py-4">
          <p className="text-xs leading-relaxed text-fg">
            We do not respond to dosing, usage, or human-consumption
            questions. Every product we supply is strictly for laboratory
            research, and our support team cannot provide administration or
            medical guidance of any kind.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <div className="flex flex-col gap-6">
            <InfoCard
              title="Email"
              body="support@ruinedrx.com"
              note="We typically reply within one business day."
            />
            <InfoCard
              title="Phone"
              body="(210) 802-1229"
              note="For local pickup arrangements and general support."
            />
            <InfoCard
              title="Address"
              body="18130 Talavera Ridge, San Antonio, TX 78257"
              note="Local pickup by prior arrangement only — see our FAQ."
            />
            <InfoCard
              title="Hours"
              body="Mon – Fri, 9am – 5pm CT"
              note="Orders placed before 2pm ship same-day."
            />
            <InfoCard
              title="Shipping Area"
              body="United States"
              note="See our Shipping Policy for details."
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

function InfoCard({
  title,
  body,
  note,
}: {
  title: string;
  body: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-6">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-fg-faint">
        {title}
      </h3>
      <p className="mt-2 text-sm font-semibold text-fg">{body}</p>
      <p className="mt-1 text-xs leading-relaxed text-fg-muted">{note}</p>
    </div>
  );
}
