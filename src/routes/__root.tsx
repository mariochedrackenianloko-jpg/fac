import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import facLogo from "../assets/fac.jpg";
import ebookCover from "../assets/ebook-cover.jpg";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
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
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "icon", type: "image/jpeg", href: facLogo },
      { rel: "apple-touch-icon", href: facLogo },
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
