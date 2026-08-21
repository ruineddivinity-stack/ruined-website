import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { inter } from "./fonts";
import { ReferralCapture } from "@/lib/referral-capture";
import { StarField } from "@/components/layout/StarField";
import { LightRefraction } from "@/components/layout/LightRefraction";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { GiftTierWidget } from "@/components/layout/GiftTierWidget";
import { GiftTiersModal } from "@/components/layout/GiftTiersModal";
import { SavingsModal } from "@/components/layout/SavingsModal";
import { WelcomePopup } from "@/components/layout/WelcomePopup";
import { AgeGate } from "@/components/layout/AgeGate";
import { PageTransition } from "@/components/layout/PageTransition";
import { Providers } from "./providers";
import { getAllProducts } from "@/lib/woocommerce";
import { getSession } from "@/lib/session";
import { AGE_GATE_COOKIE, isCrawlerUserAgent } from "@/lib/age-gate";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ruinedrx.com"),
  title: "RUINED | Research Peptides",
  description:
    "RUINED — third-party tested research peptides for laboratory use. Not for human consumption.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [products, session, cookieStore, headerStore] = await Promise.all([
    getAllProducts(),
    getSession(),
    cookies(),
    headers(),
  ]);
  const isCrawler = isCrawlerUserAgent(headerStore.get("user-agent"));
  const ageGateOpen =
    !isCrawler && !session && !cookieStore.get(AGE_GATE_COOKIE)?.value;

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-fg">
        <Providers products={products}>
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
          <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
            <GiftTierWidget products={products} />
            <SavingsModal />
          </div>
          <GiftTiersModal products={products} />
          <WelcomePopup ageGateOpen={ageGateOpen} />
          <Suspense fallback={null}>
            <ReferralCapture />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
