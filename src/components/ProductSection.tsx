import { BookOpen, TrendingUp, Award, ShieldCheck, Sparkles, Package, ChevronDown } from "lucide-react";
import ebookCover from "@/assets/ebook-cover.jpg";
import { useEffect, useState } from "react";
import { getEbookSections } from "@/lib/admin.functions";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fallbackModules = [
  { title: "Savonnerie Naturelle", desc: "Maîtrisez la fabrication de savons artisanaux avec des ingrédients locaux" },
  { title: "Crèmes & Lotions", desc: "Créez des produits de soin efficaces et naturels" },
  { title: "Business & Vente", desc: "Lancez et développez votre entreprise cosmétique" },
  { title: "Réglementation", desc: "Comprenez les normes et certifications nécessaires" },
  { title: "Marketing Digital", desc: "Vendez vos produits en ligne et sur les réseaux sociaux" },
  { title: "Qualité & Sécurité", desc: "Garantissez la qualité et la sécurité de vos produits" },
];

export function ProductSection({ coverUrl }: { coverUrl?: string | null }) {
  const [sections, setSections] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { ref, visible } = useScrollAnimation();

  useEffect(() => {
    getEbookSections().then(setSections).catch(() => {});
  }, []);

  const hasSections = sections.length > 0;
  return (
    <section ref={ref as any} id="modules" className={`py-20 bg-background transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Ebook image */}
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

          {/* Description */}
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tout ce qu'il faut pour <span className="text-gradient-gold">réussir</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Ce guide complet vous accompagne de la fabrication à la vente.
              Que vous soyez débutant ou que vous souhaitiez professionnaliser votre activité,
              cet ebook est fait pour vous.
            </p>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-center gap-2">✅ Recettes professionnelles testées</li>
              <li className="flex items-center gap-2">✅ Stratégies de vente éprouvées</li>
              <li className="flex items-center gap-2">✅ Accès au groupe WhatsApp privé</li>
              <li className="flex items-center gap-2">✅ Mises à jour gratuites</li>
            </ul>
          </div>
        </div>

        {/* Modules / Sections */}
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-10">
          Ce que vous allez <span className="text-gradient-gold">apprendre</span>
        </h3>

        {hasSections ? (
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
                    <span className="text-xs text-muted-foreground hidden sm:inline">({s.chapters.length} chapitre{s.chapters.length !== 1 ? "s" : ""})</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === s.id ? "rotate-180" : ""}`} />
                </button>
                {expanded === s.id && s.chapters.length > 0 && (
                  <ul className="border-t border-border px-5 py-3 space-y-3">
                    {s.chapters.map((ch: { title: string; description: string }, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-gold mt-0.5 shrink-0">✦</span>
                        <div>
                          <p className="font-medium text-foreground">{ch.title}</p>
                          {ch.description && <p className="text-muted-foreground text-xs mt-0.5">{ch.description}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackModules.map((m) => (
              <div key={m.title} className="bg-card rounded-xl p-6 border border-border hover:border-gold/40 transition-colors group">
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-gold" />
                </div>
                <h4 className="font-heading font-semibold text-lg mb-2">{m.title}</h4>
                <p className="text-muted-foreground text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
