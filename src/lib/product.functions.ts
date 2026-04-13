import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { checkIsAdmin } from "@/lib/admin.functions";

export const getProductSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("product_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) throw new Error("Failed to load product settings");
    return data;
  });

export const submitPaymentConfirmation = createServerFn({ method: "POST" })
  .inputValidator((input: { name: string; phone: string }) => {
    if (!input.name?.trim() || !input.phone?.trim()) {
      throw new Error("Name and phone are required");
    }
    return { name: input.name.trim(), phone: input.phone.trim() };
  })
  .handler(async ({ data }) => {
    const { data: existing } = await supabaseAdmin
      .from("customers")
      .select("id, payment_status")
      .eq("phone", data.phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) return { success: true };

    const { error } = await supabaseAdmin
      .from("customers")
      .insert({ name: data.name, phone: data.phone, payment_status: "pending" });

    if (error) throw new Error("Failed to submit confirmation");

    const { data: settings } = await supabaseAdmin
      .from("product_settings")
      .select("whatsapp_contact")
      .limit(1)
      .single();

    if (settings?.whatsapp_contact) {
      const adminPhone = settings.whatsapp_contact.replace(/[^0-9]/g, "");
      const message = encodeURIComponent(
        `🔔 Nouveau client en attente !\n\nNom : ${data.name}\nTél : ${data.phone}\n\nConnectez-vous au panel admin pour approuver.`
      );
      return { success: true, adminWhatsapp: `https://wa.me/${adminPhone}?text=${message}` };
    }

    return { success: true };
  });

export const checkPaymentStatus = createServerFn({ method: "POST" })
  .inputValidator((input: { phone: string }) => {
    if (!input.phone?.trim()) throw new Error("Phone is required");
    return { phone: input.phone.trim() };
  })
  .handler(async ({ data }) => {
    const { data: customer, error } = await supabaseAdmin
      .from("customers")
      .select("payment_status, name")
      .eq("phone", data.phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error("Failed to check payment");
    if (!customer) return { found: false, status: null };
    return { found: true, status: customer.payment_status, name: customer.name };
  });

export const getSignedDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((input: { phone: string }) => {
    if (!input.phone?.trim()) throw new Error("Phone is required");
    return { phone: input.phone.trim() };
  })
  .handler(async ({ data }) => {
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("payment_status")
      .eq("phone", data.phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!customer || customer.payment_status !== "approved") {
      throw new Error("Unauthorized");
    }

    const { data: settings } = await supabaseAdmin
      .from("product_settings")
      .select("ebook_file_url")
      .limit(1)
      .single();

    if (!settings?.ebook_file_url) throw new Error("No ebook file available");

    const url = new URL(settings.ebook_file_url);
    const storagePath = url.pathname.split("/object/public/ebook-assets/")[1];
    if (!storagePath) throw new Error("Invalid file URL");

    const { data: signed, error } = await supabaseAdmin.storage
      .from("ebook-assets")
      .createSignedUrl(storagePath, 60 * 10);

    if (error || !signed) throw new Error("Failed to generate download link");
    return { url: signed.signedUrl };
  });

export const deleteProductFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { url: string }) => ({ url: input.url.trim() }))
  .handler(async ({ data }) => {
    const url = new URL(data.url);
    const path = url.pathname.split('/object/public/ebook-assets/')[1];
    if (!path) throw new Error('Invalid file URL');

    const { error } = await supabaseAdmin.storage
      .from('ebook-assets')
      .remove([path]);

    if (error) throw new Error(`Delete failed: ${error.message}`);
    return { success: true };
  });


