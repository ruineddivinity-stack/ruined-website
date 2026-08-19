import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | RUINED",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="August 19, 2026">
      <LegalSection heading="1. Agreement to Terms">
        <p>
          These Terms of Service (&quot;Terms&quot;) form a binding
          agreement between you and RUINEDRX, doing business as RUINED
          (&quot;RUINED,&quot; &quot;we,&quot; &quot;us,&quot; or
          &quot;our&quot;), governing your access to and use of
          ruinedrx.com and any purchase made through it (collectively, the
          &quot;Site&quot;). By accessing or using the Site, you agree to
          be bound by these Terms. If you do not agree, do not use the
          Site.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility">
        <p>
          You must be at least 21 years of age, legally able to enter into
          a binding contract, and a qualified researcher, laboratory, or
          institution acquiring products solely for legitimate research
          purposes to use the Site or place an order. By using the Site,
          you represent and warrant that you meet these requirements. See
          our{" "}
          <a
            href="/legal/research-only"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            Research Use Only Policy
          </a>{" "}
          for the full buyer certification.
        </p>
      </LegalSection>

      <LegalSection heading="3. Accounts">
        <p>
          Some features of the Site require an account. You are
          responsible for maintaining the confidentiality of your login
          credentials and for all activity that occurs under your account.
          Notify us immediately of any unauthorized use of your account.
        </p>
      </LegalSection>

      <LegalSection heading="4. Products & Intended Use">
        <p>
          All products sold on the Site are intended strictly for
          laboratory research use by qualified professionals, as described
          in our{" "}
          <a
            href="/legal/research-only"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            Research Use Only Policy
          </a>
          . Products are not drugs, dietary supplements, cosmetics, or
          food, are not intended for human or animal consumption, and have
          not been evaluated by the FDA or any equivalent regulatory body.
        </p>
      </LegalSection>

      <LegalSection heading="5. Orders, Pricing & Payment">
        <p>
          All orders are subject to acceptance and availability. We
          reserve the right to refuse, limit, or cancel any order for any
          reason, including suspected fraud, pricing or listing errors, or
          product availability. Prices, discount codes, and promotions are
          subject to change without notice. Payments are processed by a
          secure third-party payment processor; by placing an order you
          agree to that processor&apos;s applicable terms for handling
          your payment.
        </p>
      </LegalSection>

      <LegalSection heading="6. Discount Codes & Affiliate Program">
        <p>
          Promotional and affiliate discount codes are offered at our
          discretion, may have restrictions on stacking or eligible
          products, and may be modified or discontinued at any time
          without notice. Participation in our affiliate/referral program
          is subject to these Terms and any additional affiliate-specific
          terms presented during application; commissions are calculated
          and paid at our discretion based on verified, non-fraudulent
          orders.
        </p>
      </LegalSection>

      <LegalSection heading="7. Shipping & Delivery">
        <p>
          Shipping timelines, rates, and coverage are described in our{" "}
          <a
            href="/legal/shipping"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            Shipping Policy
          </a>
          . Title and risk of loss for products pass to you upon our
          delivery to the carrier.
        </p>
      </LegalSection>

      <LegalSection heading="8. Returns & Refunds">
        <p>
          Returns and refunds are handled in accordance with our{" "}
          <a
            href="/legal/refunds"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            Refund Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="9. Prohibited Uses">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Use any product purchased from the Site for human or animal
            consumption, or any purpose other than legitimate laboratory
            research
          </li>
          <li>Misrepresent your identity, age, or research affiliation</li>
          <li>Resell products as drugs, supplements, or consumables</li>
          <li>
            Use the Site for any unlawful purpose or in violation of any
            applicable local, state, federal, or international law
          </li>
          <li>
            Attempt to interfere with, compromise, or disrupt the security
            or proper functioning of the Site
          </li>
          <li>
            Use automated means to scrape, extract, or access the Site
            without our prior written consent
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="10. Intellectual Property">
        <p>
          All content on the Site — including text, graphics, logos,
          product names, and the RUINED brand — is owned by or licensed to
          RUINED and is protected by applicable intellectual property
          laws. You may not reproduce, distribute, or create derivative
          works from any Site content without our prior written
          permission.
        </p>
      </LegalSection>

      <LegalSection heading="11. Disclaimer of Warranties">
        <p>
          The Site and all products are provided &quot;as is&quot; and
          &quot;as available,&quot; without warranties of any kind, express
          or implied, including implied warranties of merchantability,
          fitness for a particular purpose, and non-infringement. We do
          not warrant that products are suitable for any particular
          research application, or that the Site will be uninterrupted,
          secure, or error-free.
        </p>
      </LegalSection>

      <LegalSection heading="12. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, RUINED and its officers,
          employees, and affiliates will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any
          loss of profits or revenue, arising from your use or misuse of
          the Site or any product purchased through it, even if advised of
          the possibility of such damages. Our total liability for any
          claim arising out of these Terms or your order will not exceed
          the amount you paid for the product(s) giving rise to the claim.
        </p>
      </LegalSection>

      <LegalSection heading="13. Indemnification">
        <p>
          You agree to indemnify and hold RUINED harmless from any claim,
          demand, loss, or damage, including reasonable attorneys&apos;
          fees, arising out of your misuse of any product, violation of
          these Terms, or violation of any law or the rights of a third
          party.
        </p>
      </LegalSection>

      <LegalSection heading="14. Governing Law & Dispute Resolution">
        <p>
          These Terms are governed by the laws of the state in which
          RUINEDRX is organized and operates, without regard to its
          conflict-of-laws principles. Any dispute arising out of or
          relating to these Terms or the Site will be resolved exclusively
          in the state or federal courts with jurisdiction over RUINEDRX,
          and you consent to personal jurisdiction there.
        </p>
      </LegalSection>

      <LegalSection heading="15. Severability">
        <p>
          If any provision of these Terms is found unenforceable, the
          remaining provisions will remain in full force and effect, and
          the unenforceable provision will be modified to the minimum
          extent necessary to make it enforceable.
        </p>
      </LegalSection>

      <LegalSection heading="16. Changes to These Terms">
        <p>
          We may revise these Terms at any time. The &quot;Last
          updated&quot; date at the top of this page reflects the most
          recent revision. Continued use of the Site after changes are
          posted constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection heading="17. Contact">
        <p>
          Questions about these Terms can be sent to{" "}
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
