import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { getTestimonials } from "@/lib/admin.functions";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fallbackTestimonials = [
  { id: "1", name: "Aminata K.", location: "Abidjan, Côte d'Ivoire", text: "Grâce à cette formation, j'ai lancé ma marque de savons naturels. Aujourd'hui, je génère plus de 300 000 FCFA par mois !", rating: 5 },
  { id: "2", name: "Fatou D.", location: "Dakar, Sénégal", text: "L'ebook est très complet et facile à comprendre. Les recettes fonctionnent parfaitement avec les ingrédients locaux.", rating: 5 },
  { id: "3", name: "Marie-Claire T.", location: "Douala, Cameroun", text: "Le groupe WhatsApp est incroyable. On s'entraide et on partage nos réussites. Je recommande à 100% !", rating: 5 },
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const { ref, visible } = useScrollAnimation();

  useEffect(() => {
    getTestimonials().then((data) => { if (data?.length) setTestimonials(data); }).catch(() => {});
  }, []);
  return (
    <section ref={ref as any} id="temoignages" className={`py-20 bg-gradient-dark transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center text-background mb-4">
          Ce que disent nos <span className="text-gradient-gold">étudiantes</span>
        </h2>
        <p className="text-background/60 text-center mb-12 max-w-xl mx-auto">
          Rejoignez plus de 500 femmes qui ont transformé leur vie grâce à cette formation.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-background/5 backdrop-blur border border-background/10 rounded-xl p-6">
              <Quote className="h-8 w-8 text-gold/40 mb-4" />
              <p className="text-background/80 mb-4 leading-relaxed">{t.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                ))}
              </div>
              <div>
                <p className="font-semibold text-background">{t.name}</p>
                <p className="text-background/50 text-sm">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
