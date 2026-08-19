import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Research Use Only Policy | RUINED",
};

export default function ResearchOnlyPage() {
  return (
    <LegalPage title="Research Use Only Policy" updated="August 19, 2026">
      <LegalSection heading="Intended Use">
        <p>
          All products sold by RUINED are intended strictly for laboratory
          research and in-vitro use by qualified professionals. Nothing on
          this site is a drug, dietary supplement, cosmetic, or food, and
          none of it is intended for human or animal consumption,
          injection, inhalation, or any other form of internal or topical
          use. Products are sold only in accordance with, and subject to,
          applicable federal, state, and local law.
        </p>
      </LegalSection>

      <LegalSection heading="No Medical Claims">
        <p>
          RUINED makes no claims regarding the safety, efficacy, or
          suitability of any product for diagnosing, treating, curing,
          mitigating, or preventing any disease or condition in humans or
          animals. Product descriptions, compound names, and any reference
          to biological activity refer strictly to published research
          literature and research contexts, and should never be
          interpreted as medical, health, or dosing advice. RUINED is not
          a healthcare provider and does not provide medical guidance of
          any kind.
        </p>
      </LegalSection>

      <LegalSection heading="Buyer Eligibility & Certification">
        <p>By creating an account or placing an order, you certify that:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>You are at least 21 years of age;</li>
          <li>
            You are a qualified researcher, laboratory, or institution, or
            are purchasing on behalf of one, acquiring these products
            solely for legitimate research purposes;
          </li>
          <li>
            You understand these products are for research use only and
            are not for human or animal consumption; and
          </li>
          <li>
            You will handle, store, transport, and dispose of any product
            purchased in accordance with all applicable laws, institutional
            protocols, and standard laboratory safety practices, including
            appropriate personal protective equipment.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Prohibited Uses">
        <p>
          You may not purchase products from RUINED for resale as a drug,
          supplement, or consumable good; for administration to or
          consumption by any person or animal; or for any purpose other
          than legitimate laboratory research. RUINED reserves the right
          to refuse or cancel any order it believes, in its sole
          discretion, is intended for a prohibited use.
        </p>
      </LegalSection>

      <LegalSection heading="Regulatory Status">
        <p>
          Products sold on this site have not been evaluated or approved
          by the U.S. Food and Drug Administration or any equivalent
          regulatory body for safety or effectiveness in humans or
          animals. Availability of any product on this site does not imply
          approval, endorsement, or regulatory clearance of any kind. The
          legal status of specific compounds varies by state and is
          subject to change; it is your responsibility to confirm that
          purchase, possession, and use of a given compound is lawful in
          your jurisdiction before ordering.
        </p>
      </LegalSection>

      <LegalSection heading="Assumption of Risk">
        <p>
          You acknowledge that research chemicals can be hazardous if
          mishandled, and that you assume full responsibility for the safe
          handling, use, storage, and disposal of any product you
          purchase. RUINED disclaims all liability for any injury, loss,
          or damage arising from the misuse of any product, including use
          inconsistent with this policy.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to This Policy">
        <p>
          We may update this policy as our compound catalog, testing
          practices, or applicable regulations change. The &quot;Last
          updated&quot; date at the top of this page reflects the most
          recent revision.
        </p>
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
