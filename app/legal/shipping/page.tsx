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
          In-stock orders placed before 2:00pm CT on a business day
          typically ship the same day. Orders placed after that cutoff, or
          on a weekend or holiday, ship the following business day. During
          periods of high demand, processing may take slightly longer; we
          will notify you by email if your order is significantly delayed.
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

      <LegalSection heading="Shipping Area">
        <p>
          We currently ship within the United States only. We do not offer
          international shipping at this time. [Confirm whether any
          states, territories, or PO Box / freight-forwarder addresses are
          excluded due to state-level restrictions on research-chemical
          sales, and list them here.]
        </p>
      </LegalSection>

      <LegalSection heading="Carriers">
        <p>
          We ship via major national carriers (such as USPS, UPS, or
          FedEx), selected based on delivery speed, cost, and package
          requirements. The carrier used for your order will be shown on
          your tracking confirmation.
        </p>
      </LegalSection>

      <LegalSection heading="Packaging">
        <p>
          Orders are packed discreetly in plain, unmarked packaging with no
          indication of contents on the exterior. Temperature-sensitive
          items are shipped with appropriate insulation and cold packs
          when needed to help preserve product integrity in transit.
        </p>
      </LegalSection>

      <LegalSection heading="Order Tracking">
        <p>
          You&apos;ll receive a shipping confirmation email with a tracking
          number as soon as your order leaves our facility. Please allow
          up to 24 hours for tracking information to update after you
          receive this email.
        </p>
      </LegalSection>

      <LegalSection heading="Delivery Delays">
        <p>
          Delivery estimates provided by carriers are not guaranteed.
          RUINED is not responsible for delays caused by the carrier,
          weather, customs, or other events outside our control. If your
          order is significantly delayed in transit, contact us and
          we&apos;ll work with the carrier on your behalf.
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
