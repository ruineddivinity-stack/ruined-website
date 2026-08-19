import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy | RUINED",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" updated="August 19, 2026">
      <div className="rounded-2xl border border-danger/50 bg-danger/10 px-5 py-4">
        <p className="font-display text-sm font-black uppercase tracking-wide text-fg">
          All Sales Are Final — No Returns or Monetary Refunds
        </p>
      </div>

      <LegalSection heading="Refunds (Store Credit & Reshipment Only)">
        <p>
          RUINED does not issue monetary refunds. All sales are final. Due
          to the nature of our products and industry standards regarding
          safety, handling, and sanitation, we do not accept returns of
          any kind.
        </p>
        <p>
          If an order issue is approved — such as receiving a damaged,
          defective, incorrect, or confirmed lost package — resolution may
          be provided through a replacement shipment or store credit equal
          to the affected item value. Store credit is non-transferable,
          cannot be redeemed for cash, and does not expire.
        </p>
        <p>
          RUINED reserves the right to approve or deny any claim at our
          sole discretion.
        </p>
      </LegalSection>

      <LegalSection heading="Damages & Issues">
        <p>
          Please inspect your order immediately upon delivery and contact
          us at{" "}
          <a
            href="mailto:support@ruinedrx.com"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            support@ruinedrx.com
          </a>{" "}
          within 24 hours of your delivery date if your order arrives
          damaged, defective, incorrect, or is confirmed lost in transit.
        </p>
        <p>
          To submit a claim, photo documentation of the product,
          packaging, shipping label/packing slip, and any damage must be
          provided. Claims submitted without sufficient documentation may
          be denied.
        </p>
        <p>If approved, resolutions will be provided through reshipment or store credit only.</p>
      </LegalSection>

      <LegalSection heading="Non-Returnable Items">
        <p>
          Due to the sensitive nature of our products and for sanitary,
          safety, handling, and quality-control reasons, RUINED does not
          accept returns or exchanges on any products once shipped.
        </p>
        <p>The following are not eligible for return, exchange, or monetary refund:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Opened, used, or tampered products</li>
          <li>Products returned without prior claim approval</li>
          <li>Claims submitted without required photo documentation</li>
          <li>Buyer&apos;s remorse or accidental purchases</li>
          <li>Orders delayed due to carrier issues outside our control</li>
          <li>
            Products shipped to an incorrectly entered address provided by
            the customer
          </li>
          <li>Any item returned to sender without authorization</li>
        </ul>
        <p>All purchases are considered final upon checkout completion.</p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy can be sent to{" "}
          <a
            href="mailto:support@ruinedrx.com"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            support@ruinedrx.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
