import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-6 z-50 h-11 w-11 rounded-full bg-foreground/80 text-background flex items-center justify-center shadow-lg hover:bg-foreground transition-colors backdrop-blur-sm"
      aria-label="Retour en haut"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
