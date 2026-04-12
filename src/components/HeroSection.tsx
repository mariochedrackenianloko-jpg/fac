import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-foreground/80" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6 animate-slide-up">
          De zéro à expert :{" "}
          <span className="text-gradient-gold">fabriquer et vendre</span>{" "}
          ses cosmétiques & savons naturels
        </h1>

        <p className="text-lg sm:text-xl text-background/80 max-w-2xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Apprenez à créer et lancer votre business cosmétique en Afrique.
          Un guide complet, étape par étape.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Link
            to="/payment"
            className="bg-gradient-gold text-foreground font-bold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition-all animate-pulse-gold flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Acheter l'ebook
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a href="#modules" className="text-background/80 hover:text-gold transition-colors font-medium flex items-center gap-1">
            Voir le contenu ↓
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-background/60 text-sm animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-gold fill-gold" />
            ))}
            <span className="ml-2">4.9/5</span>
          </div>
          <span>+500 étudiants formés</span>
          <span>100% en ligne</span>
        </div>
      </div>
    </section>
  );
}
