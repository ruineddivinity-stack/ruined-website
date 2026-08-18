import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | RUINED",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 16, 2026">
      <LegalSection heading="Information We Collect">
        <p>
          We collect information you provide directly, such as your name,
          email, shipping address, and payment details when you place an
          order or contact us, along with basic usage data collected
          automatically when you browse the site.
        </p>
      </LegalSection>

      <LegalSection heading="How We Use It">
        <p>
          We use this information to process orders, provide customer
          support, send order and shipping updates, and — with your
          consent — send marketing communications like restock alerts.
        </p>
      </LegalSection>

      <LegalSection heading="Sharing">
        <p>
          We share information with service providers who help us operate
          the site and fulfill orders (e.g., payment processors and
          shipping carriers). We do not sell your personal information.
        </p>
      </LegalSection>

      <LegalSection heading="Your Choices">
        <p>
          You can unsubscribe from marketing emails or texts at any time.
          Contact us to request access to, correction of, or deletion of
          your personal information.
        </p>
      </LegalSection>

      <LegalSection heading="Placeholder Notice">
        <p>
          This page is scaffold content generated during the site build and
          has not been reviewed by legal counsel. Replace with an
          attorney-reviewed policy — including any state or international
          privacy law requirements that apply to your business — before
          launch.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
