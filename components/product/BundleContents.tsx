import Link from "next/link";
import Image from "next/image";
import type { BundledItem } from "@/lib/types";

export function BundleContents({ items }: { items: BundledItem[] }) {
  return (
    <div className="rounded-2xl border border-steel-500/30 bg-surface/60 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
        What&rsquo;s Included
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => {
          const content = (
            <>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-2">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-[9px] font-semibold tracking-widest text-fg-faint">
                    RX
                  </span>
                )}
              </div>
              <span className="flex-1 text-sm font-medium text-fg">
                {item.title}
              </span>
              {item.quantity > 1 && (
                <span className="text-xs font-semibold text-fg-faint">
                  &times;{item.quantity}
                </span>
              )}
            </>
          );

          return (
            <li key={item.productId}>
              {item.slug ? (
                <Link
                  href={`/product/${item.slug}`}
                  className="flex items-center gap-3 rounded-xl p-1 transition-colors hover:bg-surface-2"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex items-center gap-3 p-1">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
