import whatsappLogo from "@/assets/whatsap.png";
import { useEffect, useState } from "react";
import { getProductSettings } from "@/lib/product.functions";

export function WhatsAppButton() {
  const [link, setLink] = useState("https://wa.me/");

  useEffect(() => {
    getProductSettings()
      .then((s) => { if (s?.whatsapp_contact) setLink(`https://wa.me/${s.whatsapp_contact.replace(/[^0-9]/g, "")}`); })
      .catch(() => {});
  }, []);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contacter via WhatsApp"
    >
      <img src={whatsappLogo} alt="WhatsApp" className="h-7 w-7 object-contain" />
    </a>
  );
}
