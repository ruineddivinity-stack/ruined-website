import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession, isAdminUser } from "@/lib/session";
import { getAllSubscribers } from "@/lib/subscribers";
import { isResendConfigured } from "@/lib/resend";
import { BroadcastForm } from "@/components/account/BroadcastForm";

export const metadata: Metadata = {
  title: "Subscribers | RUINED",
};

export default async function SubscribersPage() {
  const session = await getSession();
  if (!isAdminUser(session)) redirect("/account");

  let subscribers: Awaited<ReturnType<typeof getAllSubscribers>> = [];
  let loadError: string | null = null;
  try {
    subscribers = await getAllSubscribers();
  } catch (err) {
    console.error("Failed to load subscribers:", err);
    loadError = "Couldn't reach the subscribers list right now.";
  }
  const resendReady = isResendConfigured();

  return (
    <div className="flex flex-col gap-8">
      {loadError && (
        <p className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {loadError}
        </p>
      )}

      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Mailing List
        </p>
        <p className="mt-2 font-display text-3xl font-black text-fg">
          {subscribers.length}
        </p>
        <p className="mt-1 text-sm text-fg-muted">subscribed emails</p>
      </div>

      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-fg">
          Send a Broadcast
        </h2>
        {!resendReady && (
          <p className="mt-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
            Resend isn&rsquo;t connected yet — add RESEND_API_KEY (and verify
            a sending domain) before you can actually send.
          </p>
        )}
        <div className="mt-5">
          <BroadcastForm subscriberCount={subscribers.length} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-fg">
          Recent Subscribers
        </h2>
        {subscribers.length === 0 ? (
          <p className="mt-3 text-sm text-fg-muted">No subscribers yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-border-soft">
            {subscribers.slice(0, 50).map((s) => (
              <li
                key={s.email}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <span className="text-fg">{s.email}</span>
                <span className="text-xs text-fg-faint">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
        {subscribers.length > 50 && (
          <p className="mt-3 text-xs text-fg-faint">
            Showing 50 of {subscribers.length}.
          </p>
        )}
      </div>
    </div>
  );
}
