import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function getProductSettings() {
  try {
    const { data } = await supabaseAdmin
      .from("product_settings")
      .select("*")
      .limit(1)
      .single();
    return data;
  } catch {
    return null;
  }
}

export async function checkPaymentStatus(phone: string) {
  try {
    const { data } = await supabaseAdmin
      .from("customers")
      .select("payment_status, name")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function getSignedDownloadUrl(phone: string) {
  try {
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("payment_status")
      .eq("phone", phone)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!customer || customer.payment_status !== "approved") {
      return null;
    }

    const { data: settings } = await supabaseAdmin
      .from("product_settings")
      .select("ebook_file_url")
      .limit(1)
      .single();

    return settings?.ebook_file_url || null;
  } catch {
    return null;
  }
}

