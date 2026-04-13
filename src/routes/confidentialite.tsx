import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [{ title: "Politique de Confidentialité – FAC AFRIQUE" }],
  }),
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading text-3xl font-bold mb-8">Politique de Confidentialité</h1>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">1. Données collectées</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nous collectons uniquement les données nécessaires au traitement de votre commande : votre nom complet et votre numéro de téléphone. Ces données sont saisies volontairement lors de la confirmation de paiement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">2. Utilisation des données</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vos données sont utilisées exclusivement pour vérifier votre paiement et vous donner accès à l'ebook. Elles ne sont jamais vendues, partagées ou utilisées à des fins commerciales tierces.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">3. Conservation des données</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vos données sont conservées de manière sécurisée sur nos serveurs (Supabase) tant que nécessaire pour la gestion de votre accès à l'ebook.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">4. Vos droits</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous via WhatsApp.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">5. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ce site utilise uniquement des cookies techniques nécessaires au bon fonctionnement de l'authentification. Aucun cookie publicitaire ou de tracking n'est utilisé.
            </p>
          </section>

          <p className="text-xs text-muted-foreground mt-12">Dernière mise à jour : {new Date().getFullYear()}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
