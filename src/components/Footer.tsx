export function Footer() {
  return (
    <footer className="bg-gradient-dark text-background/70 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <h3 className="text-gradient-gold font-heading text-2xl font-bold">FAC AFRIQUE</h3>
          <p className="text-sm max-w-md mx-auto">
            Centre de Formation des Arts Cosmétiques — Votre partenaire pour réussir dans l'industrie cosmétique en Afrique.
          </p>
          <div className="border-t border-background/10 pt-6 mt-6">
            <p className="text-xs text-background/50">
              © {new Date().getFullYear()} FAC AFRIQUE. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
