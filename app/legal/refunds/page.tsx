import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy | RUINED",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" updated="August 16, 2026">
      <LegalSection heading="Damaged or Incorrect Orders">
        <p>
          If your order arrives damaged or you received the wrong item,
          contact us within 7 days of delivery with photos of the issue
          and we&apos;ll arrange a replacement or refund.
        </p>
      </LegalSection>

      <LegalSection heading="Non-Returnable Items">
        <p>
          Due to the nature of our products, opened or used items cannot be
          returned. We&apos;re only able to accept returns of unopened,
          unused products in their original packaging.
        </p>
      </LegalSection>

      <LegalSection heading="Refund Timing">
        <p>
          Approved refunds are issued to your original payment method within
          5–10 business days.
        </p>
      </LegalSection>

      <LegalSection heading="Placeholder Notice">
        <p>
          This page is scaffold content generated during the site build and
          has not been reviewed by legal counsel. Replace with a
          policy reviewed by an attorney before launch.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
