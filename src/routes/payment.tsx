import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ArrowRight, ExternalLink, ShieldCheck, User, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getProductSettings } from "@/lib/product.functions";
import ebookCover from "@/assets/ebook-cover.jpg";
import waveIcon from "@/assets/iconwave.webp";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Acheter l'ebook – FAC AFRIQUE" },
      { name: "description", content: "Achetez votre ebook de formation en arts cosmétiques et lancez votre business." },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const [settings, setSettings] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductSettings().then(setSettings).catch(console.error);
  }, []);

  const price = settings?.price || "9 900 FCFA";
  const waveLink = settings?.wave_payment_link || "#";

  const handleWavePay = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Veuillez remplir votre nom et numéro avant de payer.");
      return;
    }
    const phoneClean = phone.trim().replace(/\s/g, "");
    if (!/^\+?[0-9]{8,15}$/.test(phoneClean)) {
      setError("Numéro de téléphone invalide. Ex: +225XXXXXXXXXX");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // submitPaymentConfirmation replaced by API or client submit
      console.log('Payment confirmation submitted:', { name: name.trim(), phone: phoneClean });
      setSubmitted(true);
      window.open(waveLink, "_blank");
      setSubmitted(true);
      // Notifier l'admin via WhatsApp si lien disponible
      if (result?.adminWhatsapp) {
        window.open(result.adminWhatsapp, "_blank");
      }
      // Ouvrir Wave
      window.open(waveLink, "_blank");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <img
                src={settings?.cover_image_url || ebookCover}
                alt="Ebook Formation Arts Cosmétiques"
                className="rounded-xl shadow-2xl w-full max-w-xs"
                loading="lazy"
                width={800}
                height={1024}
              />
            </div>

            <div className="space-y-6">
              <h1 className="font-heading text-3xl font-bold">
                {settings?.title || "Formation Arts Cosmétiques"}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {settings?.description || "Guide complet pour maîtriser la fabrication de cosmétiques naturels et lancer votre business en Afrique."}
              </p>

              <div className="bg-gold/10 border border-gold/30 rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-1">Prix de la formation</p>
                <p className="text-4xl font-heading font-bold text-gradient-gold">{price}</p>
                <p className="text-xs text-muted-foreground mt-1">Paiement unique · Accès à vie</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="h-6 w-6 rounded-full bg-gradient-gold text-foreground flex items-center justify-center text-xs font-bold">1</span>
                  Entrez vos informations
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre nom complet"
                      disabled={submitted}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+225 XX XX XX XX"
                      disabled={submitted}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
                    />
                  </div>
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="h-6 w-6 rounded-full bg-gradient-gold text-foreground flex items-center justify-center text-xs font-bold">2</span>
                  Payez via Wave
                </div>
                <button
                  onClick={handleWavePay}
                  disabled={loading}
                  className="w-full text-white font-bold text-lg px-6 py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50"
                  style={{ backgroundColor: "#1DC8EE" }}
                >
                  {loading
                    ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <img src={waveIcon} alt="Wave" className="h-10 w-10 object-contain mix-blend-multiply dark:mix-blend-screen" />}
                  Payer avec Wave
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span className="h-6 w-6 rounded-full bg-gradient-gold text-foreground flex items-center justify-center text-xs font-bold">3</span>
                  Confirmez votre paiement
                </div>
                <Link
                  to="/confirm"
                  search={{ phone: phone.trim() }}
                  className="w-full border-2 border-gold text-foreground font-semibold text-lg px-6 py-4 rounded-xl hover:bg-gold/10 transition-colors flex items-center justify-center gap-2"
                >
                  J'ai payé — Confirmer
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                Paiement 100% sécurisé via Wave
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
