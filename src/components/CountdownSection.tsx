import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductSettings } from "@/lib/product.functions";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      expired: false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return time;
}

export function CountdownSection() {
  const [settings, setSettings] = useState<any>(null);
  const { ref, visible } = useScrollAnimation();

  useEffect(() => {
    getProductSettings().then(setSettings).catch(() => {});
  }, []);

  const countdownDate = settings?.countdown_date;
  const salesCount = settings?.sales_count ?? 500;
  const time = useCountdown(countdownDate || "");

  return (
    <section ref={ref as any} className={`py-16 bg-gradient-gold transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-foreground/10 rounded-full px-4 py-1.5 mb-6">
          <Flame className="h-5 w-5 text-foreground" />
          <span className="text-foreground font-semibold text-sm">Offre limitée</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ne manquez pas cette opportunité !
        </h2>
        <p className="text-foreground/80 text-lg mb-6 max-w-xl mx-auto">
          Rejoignez les <span className="font-bold">{salesCount}+</span> personnes qui ont déjà transformé leur passion en business rentable.
        </p>

        {countdownDate && !time.expired && (
          <div className="flex items-center justify-center gap-3 mb-8">
            {[
              { label: "Jours", value: time.days },
              { label: "Heures", value: time.hours },
              { label: "Minutes", value: time.minutes },
              { label: "Secondes", value: time.seconds },
            ].map((t, i) => (
              <div key={i} className="bg-foreground/10 rounded-xl px-4 py-3 min-w-[64px]">
                <p className="text-2xl font-heading font-bold text-foreground">{String(t.value).padStart(2, "0")}</p>
                <p className="text-xs text-foreground/70">{t.label}</p>
              </div>
            ))}
          </div>
        )}

        {(!countdownDate || time.expired) && (
          <div className="flex items-center justify-center gap-2 mb-8 text-foreground/70">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Places limitées — Accès immédiat après paiement</span>
          </div>
        )}

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
