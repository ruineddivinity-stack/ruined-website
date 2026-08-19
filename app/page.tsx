import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Mission } from "@/components/sections/Mission";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { BestSellers } from "@/components/sections/BestSellers";
import { FAQ } from "@/components/sections/FAQ";
import { Newsletter } from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <BestSellers />
      <TrustStrip />
      <Mission />
      <WhyChooseUs />
      <FAQ />
      <Newsletter />
    </>
  );
}
