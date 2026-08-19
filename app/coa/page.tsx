import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestingTracker } from "@/components/coa/TestingTracker";
import { DocumentCard } from "@/components/coa/DocumentCard";
import { getAllProducts } from "@/lib/woocommerce";

export const metadata: Metadata = {
  title: "Lab Reports & COAs | RUINED",
};

/**
 * A report "exists" once a file named after the product slug is dropped into
 * the matching public/lab-reports folder — no code changes needed to publish
 * a real PDF later.
 */
function getReportHref(folder: "raw-materials" | "coas", slug: string): string | null {
  const filePath = path.join(process.cwd(), "public", "lab-reports", folder, `${slug}.pdf`);
  return fs.existsSync(filePath) ? `/lab-reports/${folder}/${slug}.pdf` : null;
}

export default async function LabResultsPage() {
  const products = await getAllProducts();

  return (
    <div className="py-24">
      <Container className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-steel-400">
          Lab Reports
        </p>
        <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight text-fg sm:text-5xl">
          Quality Control
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-fg-muted">
          We&apos;re building out a public library of independent
          third-party lab results for every batch we sell. COAs aren&apos;t
          live yet — we&apos;d rather launch it right than launch it early.
          In the meantime, every compound in our catalog is screened
          internally for identity and purity before it&apos;s listed.
        </p>

        <div className="mt-10">
          <TestingTracker />
        </div>
      </Container>

      <Container className="mt-24">
        <SectionHeading
          eyebrow="Raw Material Testing"
          title="Identity & purity checks on incoming materials"
          description="Reports our manufacturing team runs on raw materials before a batch is approved for production. Added here as each one is completed."
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <DocumentCard
              key={p.slug}
              name={p.name}
              category={p.category}
              href={getReportHref("raw-materials", p.slug)}
            />
          ))}
        </div>
      </Container>

      <Container className="mt-24">
        <SectionHeading
          eyebrow="Certificates of Analysis"
          title="Independent third-party COAs"
          description="Published per batch as results come back from the lab."
        />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <DocumentCard
              key={p.slug}
              name={p.name}
              category={p.category}
              href={getReportHref("coas", p.slug)}
            />
          ))}
        </div>
      </Container>

      <Container className="mt-20 max-w-2xl text-center">
        <Button href="/shop">Shop the Catalog</Button>
      </Container>
    </div>
  );
}
