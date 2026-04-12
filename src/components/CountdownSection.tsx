import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Flame } from "lucide-react";

export function CountdownSection() {
  return (
    <section className="py-16 bg-gradient-gold">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-foreground/10 rounded-full px-4 py-1.5 mb-6">
          <Flame className="h-5 w-5 text-foreground" />
          <span className="text-foreground font-semibold text-sm">Offre limitée</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ne manquez pas cette opportunité !
        </h2>
        <p className="text-foreground/80 text-lg mb-8 max-w-xl mx-auto">
          Rejoignez les centaines de femmes qui ont déjà transformé leur passion en business rentable.
        </p>

        <div className="flex items-center justify-center gap-2 mb-8 text-foreground/70">
          <Clock className="h-5 w-5" />
          <span className="font-medium">Places limitées — Accès immédiat après paiement</span>
        </div>

        <Link
          to="/payment"
          className="inline-flex items-center gap-2 bg-foreground text-background font-bold text-lg px-10 py-4 rounded-xl hover:bg-foreground/90 transition-colors"
        >
          Acheter maintenant
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
