// All admin read-only for client SPA
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function getCustomers() {
  try {
    const { data } = await supabaseAdmin.from("customers").select("*").order("created_at", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export async function getStats() {
  try {
    const { data } = await supabaseAdmin.from("customers").select("payment_status");
    const total = data?.length || 0;
    const approved = data?.filter((c: any) => c.payment_status === "approved").length || 0;
    const pending = data?.filter((c: any) => c.payment_status === "pending").length || 0;
    const { data: settings } = await supabaseAdmin.from("product_settings").select("price").limit(1).single();
    const price = settings?.price ? parseFloat(settings.price.replace(/[^0-9.]/g, "")) : 0;
    return { total, approved, pending, rejected: total - approved - pending, revenue: approved * price };
  } catch {
    return { total: 0, approved: 0, pending: 0, rejected: 0, revenue: 0 };
  }
}

export async function checkIsAdmin() {
  const { data: { user } } = await supabaseAdmin.auth.getUser();
  if (!user) return { isAdmin: false };
  try {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  } catch {
    return { isAdmin: false };
  }
}

// Mutations: use Supabase dashboard or create /api/admin/*
export const mutations = {
  updateCustomerStatus: "Use Supabase dashboard",
  updateProductSettings: "Use Supabase dashboard",
  // etc.
};

