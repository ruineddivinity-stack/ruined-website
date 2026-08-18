"use client";

export function ContactForm() {
  return (
    <form className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name" placeholder="Jane Researcher" />
        <Field label="Email" type="email" placeholder="you@lab.com" />
      </div>
      <Field label="Subject" placeholder="Question about an order" />
      <label className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
          Message
        </span>
        <textarea
          rows={6}
          placeholder="How can we help?"
          className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-gradient-to-b from-chrome-100 via-chrome-300 to-chrome-500 px-6 py-3 text-sm font-semibold text-black transition-transform hover:brightness-110"
      >
        Send Message
      </button>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-widest text-fg-muted">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-steel-500 focus:outline-none"
      />
    </label>
  );
}
