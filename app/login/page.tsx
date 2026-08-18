import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/account/LoginForm";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign In | RUINED",
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/account");

  return (
    <div className="py-20">
      <Container className="max-w-md">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight text-fg">
          Sign In
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          Access your orders and affiliate dashboard.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface/60 p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-fg-faint">
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className="text-steel-400 hover:text-steel-300">
            Create one
          </Link>
        </p>
      </Container>
    </div>
  );
}
