import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ForgotPasswordForm } from "@/components/account/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | RUINED",
};

export default function ForgotPasswordPage() {
  return (
    <div className="py-20">
      <Container className="max-w-md">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-fg">
          Forgot Password
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          We&rsquo;ll email you a link to reset it.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6">
          <ForgotPasswordForm />
        </div>
      </Container>
    </div>
  );
}
