import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [{ title: "Conditions Générales de Vente – FAC AFRIQUE" }],
  }),
  component: CGVPage,
});

function CGVPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-sm dark:prose-invert">
          <h1 className="font-heading text-3xl font-bold mb-8">Conditions Générales de Vente</h1>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">1. Objet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Les présentes conditions générales de vente régissent les relations contractuelles entre FAC AFRIQUE et tout client souhaitant acquérir l'ebook de formation en arts cosmétiques proposé sur ce site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">2. Produit</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le produit vendu est un ebook numérique intitulé "Formation Arts Cosmétiques – FAC AFRIQUE". Il s'agit d'un fichier PDF téléchargeable, accessible après confirmation du paiement par l'équipe FAC AFRIQUE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">3. Prix et paiement</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le prix est indiqué en FCFA sur la page de vente. Le paiement s'effectue exclusivement via Wave Mobile Money. Aucun autre mode de paiement n'est accepté. Le prix est payable en une seule fois.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">4. Livraison</h2>
            <p className="text-muted-foreground leading-relaxed">
              Après confirmation du paiement par notre équipe (sous 24h maximum), le client reçoit un accès au téléchargement de l'ebook via le site. L'accès est permanent et illimité.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">5. Droit de rétractation</h2>
            <p className="text-muted-foreground leading-relaxed">
              Conformément à la nature numérique du produit, aucun droit de rétractation ne peut être exercé une fois le téléchargement effectué. En cas de problème technique, contactez-nous via WhatsApp.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">6. Propriété intellectuelle</h2>
            <p className="text-muted-foreground leading-relaxed">
              L'ebook est protégé par les droits d'auteur. Toute reproduction, distribution ou revente est strictement interdite. L'achat confère uniquement un droit d'usage personnel et non commercial.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-3">7. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pour toute question relative à votre commande, contactez-nous via le bouton WhatsApp disponible sur le site.
            </p>
          </section>

          <p className="text-xs text-muted-foreground mt-12">Dernière mise à jour : {new Date().getFullYear()}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
