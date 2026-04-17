import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import { HeroSection } from "@/components/HeroSection";
const LazyProductSection = lazy(() => import("@/components/ProductSection").then(module => ({ default: (module as any).ProductSection })));
const LazyTestimonialsSection = lazy(() => import("@/components/TestimonialsSection").then(module => ({ default: (module as any).TestimonialsSection })));
const LazyFAQSection = lazy(() => import("@/components/FAQSection").then(module => ({ default: (module as any).FAQSection })));
const LazyCountdownSection = lazy(() => import("@/components/CountdownSection").then(module => ({ default: (module as any).CountdownSection }))); 
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Skeleton } from "@/components/ui/skeleton";
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
    getProductSettings().then((s) => {
      setCoverUrl(s?.cover_image_url || null);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <Suspense fallback={<div className="py-20 bg-muted/20"><Skeleton className="h-96 w-full max-w-7xl mx-auto rounded-2xl mx-4" /></div>}>
        <LazyProductSection coverUrl={coverUrl} />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-muted/20"><Skeleton className="h-80 w-full max-w-4xl mx-auto rounded-xl mx-4" /></div>}>
        <LazyTestimonialsSection />
      </Suspense>
      <Suspense fallback={<div className="py-16 bg-muted/20"><Skeleton className="h-24 w-full max-w-md mx-auto rounded-xl mx-4" /></div>}>
        <LazyCountdownSection />
      </Suspense>
      <Suspense fallback={<div className="py-20 bg-muted/20"><Skeleton className="h-[600px] w-full max-w-3xl mx-auto rounded-2xl mx-4 space-y-4 [&>div]:h-12 [&>div]:w-full [&>div]:rounded-lg" /></div>}>
        <LazyFAQSection />
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
