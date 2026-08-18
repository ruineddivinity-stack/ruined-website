"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="text-xs font-semibold uppercase tracking-widest text-fg-muted transition-colors hover:text-fg"
    >
      {loading ? "Signing out…" : "Sign Out"}
    </button>
  );
}
