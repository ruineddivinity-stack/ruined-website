import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | RUINED",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="August 19, 2026">
      <LegalSection heading="Overview">
        <p>
          This Privacy Policy explains how RUINED (&quot;RUINED,&quot;
          &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), operated by
          [Legal Entity Name], collects, uses, discloses, and protects
          information when you visit ruinedrx.com (the &quot;Site&quot;) or
          place an order with us. By using the Site, you agree to the
          collection and use of information as described here.
        </p>
      </LegalSection>

      <LegalSection heading="Information We Collect">
        <p>
          <strong className="text-fg">Information you provide directly:</strong>{" "}
          name, email address, shipping and billing address, phone number,
          and account credentials when you register, place an order,
          subscribe to email updates, submit the contact form, or apply to
          our affiliate program. Payment card details are entered directly
          into our payment processor&apos;s secure fields and are not
          stored on our servers (see &quot;Payment Information&quot;
          below).
        </p>
        <p>
          <strong className="text-fg">Information collected automatically:</strong>{" "}
          IP address, browser and device type, pages viewed, referring
          pages, and general usage data, collected through standard server
          logs and similar technologies when you browse the Site.
        </p>
        <p>
          <strong className="text-fg">Information from cookies:</strong> see
          &quot;Cookies &amp; Similar Technologies&quot; below.
        </p>
      </LegalSection>

      <LegalSection heading="Payment Information">
        <p>
          Checkout payments are processed by Square, Inc. Card numbers and
          other sensitive payment details are transmitted directly to
          Square and are not stored on our servers. Your use of Square to
          complete a purchase is also subject to Square&apos;s own privacy
          policy and terms.
        </p>
      </LegalSection>

      <LegalSection heading="Cookies & Similar Technologies">
        <p>We use a small number of cookies to operate the Site, including:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-fg">Session cookies</strong> that keep
            you signed in to your account.
          </li>
          <li>
            <strong className="text-fg">Age &amp; research-use
            verification cookies</strong> that remember you&apos;ve
            confirmed you meet our eligibility requirements, so you
            aren&apos;t asked again on every visit.
          </li>
          <li>
            <strong className="text-fg">Cart &amp; checkout cookies</strong>{" "}
            that keep track of items you&apos;ve added to your cart.
          </li>
        </ul>
        <p>
          These cookies are necessary for the Site to function and are not
          used to track you across other websites. You can block or delete
          cookies in your browser settings, but doing so may prevent parts
          of the Site (such as checkout) from working correctly.
        </p>
      </LegalSection>

      <LegalSection heading="How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Process and fulfill orders, including payment and shipping</li>
          <li>Create and maintain your account</li>
          <li>Respond to customer service and contact form inquiries</li>
          <li>
            Send transactional messages, such as order confirmations and
            shipping updates
          </li>
          <li>
            Send marketing communications (restock alerts, promotions) when
            you&apos;ve opted in — you can unsubscribe at any time
          </li>
          <li>Administer our affiliate/referral program</li>
          <li>Detect, prevent, and address fraud, abuse, or security issues</li>
          <li>Maintain age and research-use eligibility verification</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection heading="How We Share Your Information">
        <p>
          We do not sell your personal information. We share information
          only with:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-fg">Service providers</strong> who
            perform functions on our behalf, including our payment
            processor (Square), shipping carriers, e-commerce and hosting
            platform providers, and email delivery services
          </li>
          <li>
            <strong className="text-fg">Legal &amp; safety</strong> — when
            required by law, subpoena, or legal process, or to protect the
            rights, property, or safety of RUINED, our customers, or others
          </li>
          <li>
            <strong className="text-fg">Business transfers</strong> — in
            connection with a merger, acquisition, or sale of assets, your
            information may be transferred as part of that transaction
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Data Retention">
        <p>
          We retain order and account information for as long as
          reasonably necessary to fulfill the purposes described in this
          policy, including recordkeeping for tax, accounting, and legal
          compliance purposes, after which it is deleted or anonymized.
        </p>
      </LegalSection>

      <LegalSection heading="Your Privacy Rights">
        <p>
          Depending on where you live, you may have the right to request
          access to, correction of, deletion of, or a copy of your
          personal information, and to opt out of certain uses of it. We
          do not sell or &quot;share&quot; personal information as those
          terms are defined under state privacy laws. To exercise any of
          these rights, contact us using the details below. [This section
          should be reviewed by counsel and updated to reflect specific
          obligations under applicable state privacy laws, such as the
          CCPA/CPRA, based on where your customers are located.]
        </p>
      </LegalSection>

      <LegalSection heading="Children's Privacy">
        <p>
          The Site is intended for use by adults 21 years of age or older
          and is not directed to children. We do not knowingly collect
          personal information from anyone under 18. If you believe a
          minor has provided us with personal information, contact us and
          we will delete it.
        </p>
      </LegalSection>

      <LegalSection heading="Data Security">
        <p>
          We use reasonable administrative, technical, and physical
          safeguards designed to protect your information. No method of
          transmission or storage is completely secure, and we cannot
          guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection heading="International Visitors">
        <p>
          The Site is hosted and operated in the United States and we
          currently ship only within the United States. If you access the
          Site from outside the United States, your information will be
          transferred to and processed in the United States.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes are
          effective when posted, and the &quot;Last updated&quot; date at
          the top of this page will reflect the most recent revision.
          Material changes will be communicated by updating this page or,
          where appropriate, by direct notice.
        </p>
      </LegalSection>

      <LegalSection heading="Contact Us">
        <p>
          Questions about this Privacy Policy or your personal information
          can be sent to{" "}
          <a
            href="mailto:support@ruinedrx.com"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            support@ruinedrx.com
          </a>{" "}
          or to [Legal Entity Name, Business Mailing Address].
        </p>
      </LegalSection>
    </LegalPage>
  );
}
