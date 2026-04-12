import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useState } from "react";
import { Phone, User, Loader2 } from "lucide-react";
import { submitPaymentConfirmation, checkPaymentStatus } from "@/lib/product.functions";

export const Route = createFileRoute("/confirm")({
  head: () => ({
    meta: [
      { title: "Confirmer le paiement – FAC AFRIQUE" },
      { name: "description", content: "Confirmez votre paiement pour accéder à l'ebook." },
    ],
  }),
  component: ConfirmPage,
});

function ConfirmPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      // Submit confirmation
      await submitPaymentConfirmation({ data: { name: name.trim(), phone: phone.trim() } });

      // Check if already approved
      const result = await checkPaymentStatus({ data: { phone: phone.trim() } });

      if (result.found && result.status === "approved") {
        navigate({ to: "/download", search: { phone: phone.trim(), pending: "" } });
      } else {
        // Show pending message
        navigate({ to: "/download", search: { phone: phone.trim(), pending: "true" } });
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">Vérifier mon paiement</h1>
            <p className="text-muted-foreground">
              Entrez vos informations pour vérifier votre paiement et accéder à l'ebook.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">Numéro de téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 XX XX XX XX"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                />
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-gold text-foreground font-bold text-lg px-6 py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                "Vérifier mon paiement"
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
