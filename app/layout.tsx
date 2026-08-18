import type { Metadata } from "next";
import { inter } from "./fonts";
import { StarField } from "@/components/layout/StarField";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FloatingCartButton } from "@/components/layout/FloatingCartButton";
import { SavingsModal } from "@/components/layout/SavingsModal";
import { Providers } from "./providers";
import { getAllProducts } from "@/lib/woocommerce";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUINED | Research Peptides",
  description:
    "RUINED — third-party tested research peptides for laboratory use. Not for human consumption.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const products = await getAllProducts();

  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-fg">
        <Providers>
          <StarField />
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer products={products} />
          <FloatingCartButton />
          <SavingsModal />
        </Providers>
      </body>
    </html>
  );
}
