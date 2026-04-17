import { BookOpen, ChevronDown } from "lucide-react";
import ebookCover from "@/assets/ebook-cover.jpg";
import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fallbackModules = [
  {
    id: "1",
    title: "Savonnerie Naturelle",
    chapters: [
      { title: "Principes de base", description: "Comprendre les réactions chimiques" },
      { title: "Recettes simples", description: "Votre premier savon" },
      { title: "Ingrédients locaux", description: "Huiles et beurres africains" }
    ]
  },
  {
    id: "2",
    title: "Crèmes & Lotions",
    chapters: [
      { title: "Émulsions parfaites", description: "Technique professionnelle" },
      { title: "Recettes gain", description: "Crèmes corporelles riches" },
      { title: "Conservation", description: "Formules stables 12 mois" }
    ]
  },
  {
    id: "3",
    title: "Business & Vente",
    chapters: [
      { title: "Prix et marges", description: "Calculs rentables" },
      { title: "Emballage", description: "Packaging pro low-cost" },
      { title: "Marchés locaux", description: "Salons et foires" }
    ]
  },
  {
    id: "4",
    title: "Réglementation",
    chapters: [
      { title: "Normes africaines", description: "CEEEAC, SGG" },
      { title: "Étiquetage", description: "Obligatoire légal" },
      { title: "Certifications", description: "Labels bio naturels" }
    ]
  },
  {
    id: "5",
    title: "Marketing Digital",
    chapters: [
      { title: "WhatsApp Business", description: "Groupe privé client" },
      { title: "Instagram", description: "Stories produits" },
      { title: "Tiktok", description: "Tutoriels rapides" }
    ]
  },
  {
    id: "6",
    title: "Qualité & Sécurité",
    chapters: [
      { title: "Tests stabilité", description: "Méthodes pro" },
      { title: "Contrôle qualité", description: "Checklists" },
      { title: "Gestion réclamations", description: "Clients satisfaits" }
    ]
  },
];

export function ProductSection({ coverUrl }: { coverUrl?: string | null }) {
  const [sections, setSections] = useState<any[]>([]);
  useEffect(() => {
    setSections(fallbackModules);
  }, []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { ref, visible } = useScrollAnimation();

  const hasSections = sections.length > 0;
  return (
    <section ref={ref as any} id="modules" className={`py-20 bg-background transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="flex justify-center">
            <div className="relative animate-float">
              <div className="absolute -inset-4 bg-gradient-gold rounded-2xl opacity-20 blur-xl" />
              <img
                src={coverUrl || ebookCover}
                alt="Ebook Formation Arts Cosmétiques"
                className="relative rounded-xl shadow-2xl w-full max-w-sm"
                loading="lazy"
                width={800}
                height={1024}
              />
            </div>
          </div>
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tout ce qu'il faut pour <span className="text-gradient-gold">réussir</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Ce guide complet vous accompagne de la fabrication à la vente.
            </p>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-center gap-2">✅ Recettes professionnelles</li>
              <li className="flex items-center gap-2">✅ Stratégies de vente</li>
              <li className="flex items-center gap-2">✅ WhatsApp privé</li>
              <li className="flex items-center gap-2">✅ Mises à jour gratuites</li>
            </ul>
          </div>
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-10">
          Ce que vous allez <span className="text-gradient-gold">apprendre</span>
        </h3>
        <div className="space-y-3 max-w-3xl mx-auto">
          {sections.map((s, idx) => (
            <div key={s.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                  <span className="font-heading font-semibold">{s.title}</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === s.id ? "rotate-180" : ""}`} />
              </button>
              {expanded === s.id && (
                <div className="border-t border-border px-5 py-3 space-y-2">
                  {s.chapters.map((ch: { title: string; description: string }, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-gold mt-0.5 shrink-0">✦</span>
                      <div>
                        <p className="font-medium text-foreground">{ch.title}</p>
                        <p className="text-muted-foreground text-xs">{ch.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

