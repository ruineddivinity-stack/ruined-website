import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AccountNav } from "@/components/account/AccountNav";
import { LogoutButton } from "@/components/account/LogoutButton";
import { getSession } from "@/lib/session";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="py-16">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
              My Account
            </p>
            <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-fg">
              {session.displayName || session.username}
            </h1>
            <p className="mt-1 text-sm text-fg-muted">{session.email}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-8">
          <AccountNav />
        </div>

        <div className="mt-10">{children}</div>
      </Container>
    </div>
  );
}
