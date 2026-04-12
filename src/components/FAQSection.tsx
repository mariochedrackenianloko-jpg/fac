import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "L'ebook est-il adapté aux débutants ?",
    a: "Oui ! La formation est conçue pour vous accompagner de zéro. Aucune expérience préalable n'est nécessaire.",
  },
  {
    q: "Comment accéder à l'ebook après achat ?",
    a: "Après votre paiement via Wave, confirmez votre achat sur notre site. Vous recevrez instantanément l'accès au téléchargement.",
  },
  {
    q: "Les ingrédients sont-ils disponibles en Afrique ?",
    a: "Absolument ! Toutes les recettes utilisent des ingrédients locaux facilement disponibles sur les marchés africains.",
  },
  {
    q: "Est-ce que je peux vraiment gagner de l'argent ?",
    a: "Oui ! Nos étudiantes génèrent en moyenne entre 100 000 et 500 000 FCFA par mois après avoir appliqué les techniques de l'ebook.",
  },
  {
    q: "Y a-t-il un accompagnement après l'achat ?",
    a: "Oui, vous rejoindrez notre groupe WhatsApp privé où vous bénéficierez d'un accompagnement continu et de l'entraide de la communauté.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-4">
          Questions <span className="text-gradient-gold">fréquentes</span>
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Tout ce que vous devez savoir avant de commencer.
        </p>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 data-[state=open]:border-gold/40">
              <AccordionTrigger className="text-left font-medium hover:text-gold transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
