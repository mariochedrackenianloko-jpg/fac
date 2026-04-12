import whatsappLogo from "@/assets/whatsap.png";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/0000000000"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contacter via WhatsApp"
    >
      <img src={whatsappLogo} alt="WhatsApp" className="h-7 w-7 object-contain" />
    </a>
  );
}
