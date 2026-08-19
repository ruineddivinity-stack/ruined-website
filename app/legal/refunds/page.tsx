import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy | RUINED",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund Policy" updated="August 19, 2026">
      <LegalSection heading="Overview">
        <p>
          Because of the nature of our products, we handle returns and
          refunds differently than a typical retailer. This policy
          explains when a refund or replacement is available.
        </p>
      </LegalSection>

      <LegalSection heading="Damaged, Defective, or Incorrect Orders">
        <p>
          If your order arrives damaged, appears defective, or you
          received the wrong item, contact us within 7 days of delivery
          with your order number and photos of the item and its packaging.
          Once we&apos;ve reviewed your claim, we&apos;ll arrange a
          replacement or a refund to your original payment method, at our
          discretion.
        </p>
      </LegalSection>

      <LegalSection heading="Non-Returnable Items">
        <p>
          Due to the nature of our products, we cannot accept returns of
          any item once it has been opened, used, or had its seal broken,
          for safety and integrity reasons. We&apos;re only able to accept
          returns of unopened, unused products in their original,
          undamaged packaging, requested within 7 days of delivery.
        </p>
      </LegalSection>

      <LegalSection heading="Order Cancellations">
        <p>
          You may cancel an order for a full refund any time before it
          ships by contacting us. Once an order has shipped, it can no
          longer be cancelled and is subject to this Refund Policy.
        </p>
      </LegalSection>

      <LegalSection heading="How to Request a Refund">
        <p>
          Email{" "}
          <a
            href="mailto:support@ruinedrx.com"
            className="text-steel-400 underline underline-offset-2 hover:text-steel-300"
          >
            support@ruinedrx.com
          </a>{" "}
          with your order number, the reason for your request, and photos
          if the item arrived damaged or incorrect. We&apos;ll confirm
          whether your request is approved and provide next steps,
          including a return shipping address if applicable.
        </p>
      </LegalSection>

      <LegalSection heading="Return Shipping">
        <p>
          For approved returns of unopened items, return shipping costs
          are the customer&apos;s responsibility unless the return is due
          to our error (damaged, defective, or incorrect item), in which
          case we&apos;ll cover return shipping.
        </p>
      </LegalSection>

      <LegalSection heading="Refund Timing">
        <p>
          Once a return is received and inspected, or a claim is approved,
          refunds are issued to your original payment method within 5–10
          business days. Depending on your bank or card issuer, it may
          take additional time for the refund to appear on your statement.
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
