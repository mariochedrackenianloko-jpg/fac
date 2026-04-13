import { useEffect, useState } from "react";
import { getProductSettings } from "@/lib/product.functions";
import { X, Megaphone } from "lucide-react";

export function PromoBanner() {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    getProductSettings().then((s) => { if (s?.promo_banner) setText(s.promo_banner); }).catch(() => {});
  }, []);

  if (!text || !visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-gold text-foreground px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium shadow-md">
      <Megaphone className="h-4 w-4 shrink-0" />
      <span>{text}</span>
      <button onClick={() => setVisible(false)} className="ml-auto p-1 hover:opacity-70 transition-opacity shrink-0">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
