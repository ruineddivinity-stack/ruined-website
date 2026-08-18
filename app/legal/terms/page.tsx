import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | RUINED",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="August 16, 2026">
      <LegalSection heading="Agreement to Terms">
        <p>
          By accessing or using this site, you agree to be bound by these
          Terms of Service. If you do not agree, please do not use this
          site or purchase our products.
        </p>
      </LegalSection>

      <LegalSection heading="Eligibility">
        <p>
          You must be at least 18 years old and legally able to enter into
          a binding contract to place an order. By using this site, you
          represent that you meet these requirements.
        </p>
      </LegalSection>

      <LegalSection heading="Orders & Pricing">
        <p>
          We reserve the right to refuse or cancel any order for any
          reason, including suspected fraud, pricing errors, or product
          availability. Prices are subject to change without notice.
        </p>
      </LegalSection>

      <LegalSection heading="Intended Use">
        <p>
          All products are sold for laboratory research use only. See our{" "}
          <a
            href="/legal/research-only"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            Research Use Only Policy
          </a>{" "}
          for details.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of Liability">
        <p>
          RUINED is not liable for any indirect, incidental, or
          consequential damages arising from the use or misuse of any
          product purchased through this site.
        </p>
      </LegalSection>

      <LegalSection heading="Placeholder Notice">
        <p>
          This page is scaffold content generated during the site build and
          has not been reviewed by legal counsel. Replace with
          attorney-reviewed terms before launch.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
