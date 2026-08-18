import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { ResetPasswordForm } from "@/components/account/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | RUINED",
};

export default function ResetPasswordPage() {
  return (
    <div className="py-20">
      <Container className="max-w-md">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-fg">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Choose a new password for your account.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6">
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
