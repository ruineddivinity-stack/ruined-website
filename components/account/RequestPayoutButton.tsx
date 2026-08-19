"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ModalMode = "payout" | "update" | null;

export function RequestPayoutButton({ couponId }: { couponId: number }) {
  const router = useRouter();
  const [hasBankInfo, setHasBankInfo] = useState<boolean | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/affiliate/bank-status")
      .then((res) => res.json())
      .then((body) => {
        if (!cancelled) setHasBankInfo(Boolean(body.hasBankInfo));
      })
      .catch(() => {
        if (!cancelled) setHasBankInfo(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submitPayout = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/account/affiliate/payout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponId }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      return;
    }

    setDone(true);
    router.refresh();
  };

  const handleClick = () => {
    if (hasBankInfo) {
      submitPayout();
    } else {
      setModalMode("payout");
    }
  };

  if (done) {
    return (
      <span className="text-xs font-semibold uppercase tracking-widest text-steel-300">
        Payout requested
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || hasBankInfo === null}
        className="rounded-full border border-steel-500/40 bg-steel-700/20 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-steel-300 transition-colors hover:border-steel-500 hover:bg-steel-700/30 disabled:opacity-50"
      >
        {loading ? "Requesting…" : "Request Payout"}
      </button>

      {hasBankInfo && !loading && (
        <button
          type="button"
          onClick={() => {
            setUpdated(false);
            setModalMode("update");
          }}
          className="text-[10px] font-semibold uppercase tracking-widest text-fg-faint underline underline-offset-2 hover:text-fg-muted"
        >
          New bank account? Change banking info
        </button>
      )}

      {updated && (
        <p className="text-[11px] text-steel-300">Bank info updated.</p>
      )}
      {error && <p className="text-[11px] text-danger">{error}</p>}

      {modalMode && (
        <BankInfoModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onSaved={() => {
            const wasUpdate = modalMode === "update";
            setHasBankInfo(true);
            setModalMode(null);
            if (wasUpdate) {
              setUpdated(true);
            } else {
              submitPayout();
            }
          }}
        />
      )}
    </div>
  );
}

function BankInfoModal({
  mode,
  onClose,
  onSaved,
}: {
  mode: "payout" | "update";
  onClose: () => void;
  onSaved: () => void;
}) {
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/account/affiliate/bank-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountHolder,
        bankName,
        accountNumber,
        routingNumber,
        accountType,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong.");
      return;
    }

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(3,3,4,0.75)] p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-steel-500/30 bg-surface-2 p-6 sm:p-8">
        <h3 className="font-display text-lg font-black uppercase tracking-wide text-fg">
          {mode === "update"
            ? "Update your payout details"
            : "Where should we send your payout?"}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-fg-muted">
          {mode === "update"
            ? "This replaces the bank details currently on file for future payouts."
            : "We only need this once — it's saved to your account for future payout requests."}
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <Field
            label="Account Holder Name"
            value={accountHolder}
            onChange={setAccountHolder}
            placeholder="Jane Researcher"
          />
          <Field
            label="Bank Name"
            value={bankName}
            onChange={setBankName}
            placeholder="Chase"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Account Number"
              value={accountNumber}
              onChange={(v) => setAccountNumber(v.replace(/\D/g, ""))}
              placeholder="000123456789"
              inputMode="numeric"
            />
            <Field
              label="Routing Number"
              value={routingNumber}
              onChange={(v) => setRoutingNumber(v.replace(/\D/g, ""))}
              placeholder="021000021"
              inputMode="numeric"
            />
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
              Account Type
            </span>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg focus:border-steel-500 focus:outline-none"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </label>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="mt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-6 py-3 text-sm font-semibold text-black transition-transform hover:brightness-110 disabled:opacity-50"
            >
              {saving
                ? "Saving…"
                : mode === "update"
                  ? "Save New Bank Info"
                  : "Save & Request Payout"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold uppercase tracking-widest text-fg-muted hover:text-fg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
        {label}
      </span>
      <input
        type="text"
        required
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
      />
    </label>
  );
}
