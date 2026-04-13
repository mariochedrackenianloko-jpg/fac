import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, Download, MessageCircle, Home } from "lucide-react";

export const Route = createFileRoute("/merci")({
  head: () => ({
    meta: [{ title: "Merci – FAC AFRIQUE" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    phone: (search.phone as string) || "",
  }),
  component: MerciPage,
});

function MerciPage() {
  const { phone } = Route.useSearch();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          <div className="mb-8">
            <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h1 className="font-heading text-3xl font-bold mb-3">Merci pour votre confiance ! 🎉</h1>
            <p className="text-muted-foreground text-lg">
              Votre demande a bien été enregistrée. Notre équipe vérifie votre paiement et vous donnera accès à l'ebook très rapidement.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4 mb-8">
            <h2 className="font-heading text-lg font-semibold">Prochaines étapes</h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p className="text-sm text-muted-foreground">Notre équipe vérifie votre paiement Wave (sous 24h)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p className="text-sm text-muted-foreground">Une fois approuvé, revenez sur cette page pour télécharger votre ebook</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p className="text-sm text-muted-foreground">Rejoignez notre groupe WhatsApp privé pour l'accompagnement</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {phone && (
              <Link
                to="/download"
                search={{ phone, pending: "" }}
                className="w-full bg-gradient-gold text-foreground font-bold px-6 py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Vérifier mon accès
              </Link>
            )}
            <Link
              to="/"
              className="w-full border border-border text-foreground font-medium px-6 py-4 rounded-xl hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Home className="h-5 w-5" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
