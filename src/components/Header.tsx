import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import facLogo from "@/assets/fac.jpg";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-foreground/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={facLogo} alt="FAC AFRIQUE" className="h-10 w-10 rounded-full object-cover" />
            <span className="text-gradient-gold font-heading text-lg sm:text-xl font-bold tracking-tight">
              FAC AFRIQUE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-background/80 hover:text-gold transition-colors">Accueil</Link>
            <a href="#modules" className="text-sm text-background/80 hover:text-gold transition-colors">Modules</a>
            <a href="#temoignages" className="text-sm text-background/80 hover:text-gold transition-colors">Témoignages</a>
            <a href="#faq" className="text-sm text-background/80 hover:text-gold transition-colors">FAQ</a>
            <Link to="/payment" className="bg-gradient-gold text-foreground font-semibold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Acheter l'ebook
            </Link>
          </nav>

          <button onClick={() => setOpen(!open)} className="md:hidden text-background">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)} className="text-sm text-background/80 hover:text-gold transition-colors">Accueil</Link>
            <a href="#modules" onClick={() => setOpen(false)} className="text-sm text-background/80 hover:text-gold transition-colors">Modules</a>
            <a href="#temoignages" onClick={() => setOpen(false)} className="text-sm text-background/80 hover:text-gold transition-colors">Témoignages</a>
            <a href="#faq" onClick={() => setOpen(false)} className="text-sm text-background/80 hover:text-gold transition-colors">FAQ</a>
            <Link to="/payment" onClick={() => setOpen(false)} className="bg-gradient-gold text-foreground font-semibold text-sm px-5 py-2 rounded-lg text-center hover:opacity-90 transition-opacity">
              Acheter l'ebook
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
