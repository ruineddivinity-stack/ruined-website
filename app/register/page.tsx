import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { RegisterForm } from "@/components/account/RegisterForm";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Create Account | RUINED",
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/account");

  return (
    <div className="py-20">
      <Container className="max-w-md">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-fg">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Track orders and access your affiliate dashboard.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-xs text-fg-faint">
          Already have an account?{" "}
          <Link href="/login" className="text-steel-400 hover:text-steel-300">
            Sign in
          </Link>
        </p>
      </Container>
    </div>
  );
}
