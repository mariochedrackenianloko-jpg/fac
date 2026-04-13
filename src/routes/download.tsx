import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CheckCircle, Download, MessageCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { checkPaymentStatus, getProductSettings, getSignedDownloadUrl } from "@/lib/product.functions";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [
      { title: "Télécharger l'ebook – FAC AFRIQUE" },
      { name: "description", content: "Téléchargez votre ebook de formation en arts cosmétiques." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    phone: (search.phone as string) || "",
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const { phone } = Route.useSearch();
  const [status, setStatus] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [paymentResult, productSettings] = await Promise.all([
          phone ? checkPaymentStatus({ data: { phone } }) : Promise.resolve({ found: false, status: null, name: "" }),
          getProductSettings(),
        ]);

        if (paymentResult.found) {
          setStatus(paymentResult.status);
          setCustomerName(paymentResult.name || "");
        }
        setSettings(productSettings);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [phone]);

  const handleDownload = async () => {
    if (!phone) return;
    setDownloadLoading(true);
    try {
      const result = await getSignedDownloadUrl({ data: { phone } });
      const a = document.createElement("a");
      const filename = settings?.title ? `${settings.title.replace(/[^a-z0-9]/gi, '_')}_formation_cosmetiques.pdf` : 'formation_arts_cosmetiques.pdf';
      a.href = result.url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (e) {
      console.error(e);
    }
    setDownloadLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-20 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-gold border-t-transparent rounded-full" />
        </main>
      </div>
    );
  }

  const isApproved = status === "approved";
  const isPending = status === "pending";

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-20">
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
          {isApproved ? (
            <>
              <div className="mb-6">
                <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-success" />
                </div>
                <h1 className="font-heading text-3xl font-bold mb-2">Paiement confirmé ! 🎉</h1>
                <p className="text-muted-foreground">
                  {customerName ? `Merci ${customerName} !` : "Merci !"} Votre accès est maintenant activé.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                {settings?.ebook_file_url && (
                  <button
                    onClick={handleDownload}
                    disabled={downloadLoading}
                    className="w-full bg-gradient-gold text-foreground font-bold text-lg px-6 py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {downloadLoading
                      ? <div className="h-5 w-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                      : <Download className="h-5 w-5" />}
                    Télécharger l'ebook
                  </button>
                )}

                {settings?.whatsapp_group_link && (
                  <a
                    href={settings.whatsapp_group_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25d366] text-background font-bold text-lg px-6 py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Rejoindre le groupe WhatsApp
                  </a>
                )}
              </div>
            </>
          ) : isPending ? (
            <>
              <div className="mb-6">
                <div className="h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-gold" />
                </div>
                <h1 className="font-heading text-3xl font-bold mb-2">Paiement en cours de vérification</h1>
                <p className="text-muted-foreground">
                  Votre paiement est en cours de vérification. Vous recevrez l'accès dès qu'il sera confirmé.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Contactez-nous via WhatsApp si vous avez des questions.
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-heading text-3xl font-bold mb-2">Accès non disponible</h1>
                <p className="text-muted-foreground">
                  Veuillez d'abord effectuer votre paiement puis confirmer votre achat.
                </p>
              </div>
              <Link
                to="/payment"
                className="inline-flex items-center gap-2 bg-gradient-gold text-foreground font-bold px-6 py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                Acheter l'ebook
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
