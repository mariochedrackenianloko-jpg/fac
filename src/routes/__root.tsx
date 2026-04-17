import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import appCss from "../styles.css?url";
import facLogo from "../assets/fac.jpg";
import ebookCover from "../assets/ebook-cover.jpg";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/ScrollToTop";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page introuvable
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-gold px-6 py-3 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#C9A84C" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "FAC AFRIQUE" },
      { title: "FAC AFRIQUE – Formation Arts Cosmétiques" },
      { name: "description", content: "Apprenez à créer et lancer votre business cosmétique en Afrique. Formation complète de zéro à expert." },
      { name: "author", content: "FAC AFRIQUE" },
      { property: "og:title", content: "FAC AFRIQUE – Formation Arts Cosmétiques" },
      { property: "og:description", content: "De zéro à expert : fabriquer et vendre ses cosmétiques & savons naturels" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ebookCover },
      { property: "og:image:width", content: "800" },
      { property: "og:image:height", content: "1024" },
      { property: "og:image:alt", content: "FAC AFRIQUE – Ebook Formation Arts Cosmétiques" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ebookCover },
      { name: "twitter:site", content: "@facafrique" },
    ],
    script: [{
      type: "application/ld+json",
      dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "FAC AFRIQUE – Formation Arts Cosmétiques",
          "image": ebookCover,
          "description": "Guide complet pour fabriquer et vendre cosmétiques naturels en Afrique. De zéro à business rentable.",
          "sku": "fac-ebook-v1",
          "brand": { "@type": "Organization", "name": "FAC AFRIQUE" },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "XOF",
            "price": "25000",
            "availability": "https://schema.org/InStock",
            "url": "https://fac-afrique.com/payment"
          },
          "category": "Ebook Formation Cosmétiques"
        })
      }
    }],
    links: [
      { rel: "icon", type: "image/jpeg", href: facLogo },
      { rel: "preload", as: "image", href: facLogo, fetchPriority: "high" },
      { rel: "apple-touch-icon", href: facLogo },
      { rel: "canonical", href: "https://fac-afrique.com/" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <>
      <Outlet />
      <ScrollToTop />
    </>
  );
}
