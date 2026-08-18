import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Research Use Only Policy | RUINED",
};

export default function ResearchOnlyPage() {
  return (
    <LegalPage title="Research Use Only Policy" updated="August 16, 2026">
      <LegalSection heading="Intended Use">
        <p>
          All products sold by RUINED are intended strictly for laboratory
          research and in-vitro use by qualified professionals. Nothing on
          this site is a drug, dietary supplement, cosmetic, or food, and
          none of it is intended for human or animal consumption, injection,
          or any other form of internal or topical use.
        </p>
      </LegalSection>

      <LegalSection heading="No Medical Claims">
        <p>
          RUINED makes no claims regarding the safety, efficacy, or
          suitability of any product for diagnosing, treating, curing, or
          preventing any disease or condition in humans or animals. Product
          descriptions refer to research contexts only and should not be
          interpreted as medical or health advice.
        </p>
      </LegalSection>

      <LegalSection heading="Buyer Certification">
        <p>
          By purchasing from RUINED, you certify that you are a qualified
          researcher, institution, or laboratory acquiring these products
          solely for legitimate research purposes, and that you will handle,
          store, and dispose of them in accordance with all applicable
          laws and safety guidelines.
        </p>
      </LegalSection>

      <LegalSection heading="Regulatory Status">
        <p>
          Products sold on this site have not been evaluated by the FDA or
          any equivalent regulatory body for safety or effectiveness in
          humans or animals. Availability of any product does not imply
          regulatory approval of any kind.
        </p>
      </LegalSection>

      <LegalSection heading="Placeholder Notice">
        <p>
          This page is scaffold content generated during the site build and
          has not been reviewed by legal counsel. It should be replaced with
          language reviewed by a qualified attorney familiar with applicable
          research-chemical regulations before this site goes live.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
