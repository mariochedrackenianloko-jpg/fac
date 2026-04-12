import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ProductSection } from "@/components/ProductSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CountdownSection } from "@/components/CountdownSection";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { getProductSettings } from "@/lib/product.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FAC AFRIQUE – Formation Arts Cosmétiques" },
      { name: "description", content: "De zéro à expert : fabriquer et vendre ses cosmétiques & savons naturels. Formation complète pour lancer votre business en Afrique." },
    ],
  }),
  component: Index,
});

function Index() {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    getProductSettings().then((s) => setCoverUrl(s.cover_image_url)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <ProductSection coverUrl={coverUrl} />
      <TestimonialsSection />
      <CountdownSection />
      <FAQSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
