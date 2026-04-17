import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
// import { getFaqs } from "@/lib/admin.functions";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fallbackFaqs = [
  { id: "1", question: "L'ebook est-il adapté aux débutants ?", answer: "Oui ! La formation est conçue pour vous accompagner de zéro. Aucune expérience préalable n'est nécessaire." },
  { id: "2", question: "Comment accéder à l'ebook après achat ?", answer: "Après votre paiement via Wave, confirmez votre achat sur notre site. Vous recevrez instantanément l'accès au téléchargement." },
  { id: "3", question: "Les ingrédients sont-ils disponibles en Afrique ?", answer: "Absolument ! Toutes les recettes utilisent des ingrédients locaux facilement disponibles sur les marchés africains." },
  { id: "4", question: "Est-ce que je peux vraiment gagner de l'argent ?", answer: "Oui ! Nos étudiantes génèrent en moyenne entre 100 000 et 500 000 FCFA par mois après avoir appliqué les techniques de l'ebook." },
  { id: "5", question: "Y a-t-il un accompagnement après l'achat ?", answer: "Oui, vous rejoindrez notre groupe WhatsApp privé où vous bénéficierez d'un accompagnement continu et de l'entraide de la communauté." },
];

export function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  useEffect(() => {
    setFaqs(fallbackFaqs as any);
  }, []);
  const { ref, visible } = useScrollAnimation();

  // Static fallback (server removed)
  // No effect needed - static fallback

  return (
    <section ref={ref as any} id="faq" className={`py-20 bg-background transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-4">
          Questions <span className="text-gradient-gold">fréquentes</span>
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Tout ce que vous devez savoir avant de commencer.
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.id} value={`faq-${i}`} className="border border-border rounded-xl px-4 data-[state=open]:border-gold/40">
              <AccordionTrigger className="text-left font-medium hover:text-gold transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
