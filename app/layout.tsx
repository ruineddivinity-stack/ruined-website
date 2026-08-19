import type { Metadata } from "next";
import { cookies } from "next/headers";
import { inter } from "./fonts";
import { StarField } from "@/components/layout/StarField";
import { LightRefraction } from "@/components/layout/LightRefraction";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FloatingCartButton } from "@/components/layout/FloatingCartButton";
import { SavingsModal } from "@/components/layout/SavingsModal";
import { AgeGate } from "@/components/layout/AgeGate";
import { PageTransition } from "@/components/layout/PageTransition";
import { Providers } from "./providers";
import { getAllProducts } from "@/lib/woocommerce";
import { getSession } from "@/lib/session";
import { AGE_GATE_COOKIE } from "@/lib/age-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUINED | Research Peptides",
  description:
    "RUINED — third-party tested research peptides for laboratory use. Not for human consumption.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [products, session, cookieStore] = await Promise.all([
    getAllProducts(),
    getSession(),
    cookies(),
  ]);
  const ageGateOpen = !session && !cookieStore.get(AGE_GATE_COOKIE)?.value;

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-fg">
        <Providers>
          <AgeGate initiallyOpen={ageGateOpen} />
          <StarField />
          <LightRefraction />
          <div className="sticky top-0 z-40">
            <AnnouncementBar />
            <Header />
          </div>
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <CartDrawer products={products} />
          <FloatingCartButton />
          <SavingsModal />
        </Providers>
      </body>
    </html>
  );
}
