import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Shipping Policy | RUINED",
};

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping Policy" updated="August 16, 2026">
      <LegalSection heading="Processing Time">
        <p>
          In-stock orders placed before 2pm CT ship the same business day.
          Orders placed after that cutoff ship the following business day.
        </p>
      </LegalSection>

      <LegalSection heading="Shipping Area">
        <p>
          We currently ship within the United States only. International
          shipping is not available at this time.
        </p>
      </LegalSection>

      <LegalSection heading="Packaging">
        <p>
          Orders are packed discreetly in plain, unmarked packaging.
          Temperature-sensitive items are shipped with appropriate
          insulation and cold packs when needed.
        </p>
      </LegalSection>

      <LegalSection heading="Tracking">
        <p>
          You&apos;ll receive a tracking number by email as soon as your order
          leaves our facility.
        </p>
      </LegalSection>

      <LegalSection heading="Placeholder Notice">
        <p>
          This page is scaffold content generated during the site build and
          should be reviewed and updated once real carrier and fulfillment
          details are finalized.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
