import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Shipping Policy | RUINED",
};

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping Policy" updated="August 19, 2026">
      <LegalSection heading="Processing Time">
        <p>
          In-stock orders placed before 2:00pm CT on a business day ship
          the same day. Orders are typically fully processed within 24–36
          hours of being placed. While orders may still be placed and
          begin moving through our system over the weekend, our primary
          business and shipping operations run Monday through Friday —
          orders placed after business hours, on weekends, or on holidays
          may not begin full processing until the next business day.
        </p>
        <p>
          Processing time and shipping time are separate. Shipping time
          begins once an order has been fully processed and handed off to
          the carrier.
        </p>
      </LegalSection>

      <LegalSection heading="Shipping Rates & Free Shipping">
        <p>
          Shipping costs are calculated at checkout based on your order and
          delivery address. Orders totaling $150 or more (before any
          affiliate or promotional discount is applied) ship free within
          the United States.
        </p>
      </LegalSection>

      <LegalSection heading="Tracking & Delivery">
        <p>
          Every order includes tracking. You&apos;ll receive a tracking
          number by email once your order has been processed and handed
          off to the carrier — please allow up to 24 hours for tracking
          information to update after you receive this email. If your
          package is confirmed lost in transit, it&apos;s covered under
          our{" "}
          <a
            href="/legal/refunds"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            Refund Policy
          </a>
          .
        </p>
        <p>
          Once an order has been processed and shipped, delivery typically
          takes 2–7+ business days, depending on the shipping method
          selected at checkout, your location, and carrier conditions.
        </p>
      </LegalSection>

      <LegalSection heading="Carriers">
        <p>
          We ship primarily via USPS, and will use other national carriers
          when necessary to ensure your package is delivered safely and
          securely. We reserve the right to select the best carrier and
          shipping method for a given order; the carrier used will be
          shown on your tracking confirmation.
        </p>
      </LegalSection>

      <LegalSection heading="Packaging">
        <p>
          Orders are packed discreetly in plain, unmarked packaging with no
          indication of contents on the exterior.
        </p>
      </LegalSection>

      <LegalSection heading="Delivery Delays">
        <p>
          Delivery estimates provided by carriers are not guaranteed.
          Orders placed after business hours, on weekends, or on holidays
          may experience slight delays in shipment movement due to our
          Monday–Friday business operations. RUINED is not responsible for
          delays caused by the carrier, weather, or other events outside
          our control. If your order is significantly delayed in transit,
          contact us and we&apos;ll work with the carrier on your behalf.
        </p>
      </LegalSection>

      <LegalSection heading="Lost or Stolen Packages">
        <p>
          If tracking shows your package as delivered but you have not
          received it, please check with neighbors and your building or
          leasing office, then contact us within 7 days of the delivery
          date so we can open a claim with the carrier. We are not
          responsible for packages confirmed as delivered to the address
          provided at checkout.
        </p>
      </LegalSection>

      <LegalSection heading="Address Accuracy">
        <p>
          You are responsible for providing a complete and accurate
          shipping address at checkout. We are not responsible for orders
          delayed, misdelivered, or returned due to an incorrect or
          incomplete address. If you notice an error, contact us
          immediately — we can only make changes before an order ships.
        </p>
      </LegalSection>

      <LegalSection heading="International Shipping">
        <p>We do not ship to researchers internationally.</p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about a shipment can be sent to{" "}
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
