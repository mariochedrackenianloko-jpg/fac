import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { withAuthToken } from "@/lib/auth-client-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Check if current user is admin
const requireAdmin = async (userId: string) => {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (!data) throw new Error("Unauthorized: admin access required");
};

export const getCustomers = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);

    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to load customers");
    return data;
  });

export const updateCustomerStatus = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: { customerId: string; status: string }) => {
    if (!["pending", "approved", "rejected"].includes(input.status)) {
      throw new Error("Invalid status");
    }
    return input;
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);

    const { error } = await supabaseAdmin
      .from("customers")
      .update({ payment_status: data.status })
      .eq("id", data.customerId);

    if (error) throw new Error("Failed to update customer");
    return { success: true };
  });

export const updateProductSettings = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: {
    id: string;
    title?: string;
    description?: string;
    price?: string;
    wave_payment_link?: string;
    whatsapp_group_link?: string;
    cover_image_url?: string;
    ebook_file_url?: string;
  }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);

    const { id, ...updates } = data;
    const { error } = await supabaseAdmin
      .from("product_settings")
      .update(updates)
      .eq("id", id);

    if (error) throw new Error("Failed to update settings");
    return { success: true };
  });

export const getEbookSections = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("ebook_sections")
      .select("*")
      .order("position", { ascending: true });
    if (error) throw new Error("Failed to load sections");
    return data;
  });

export const upsertEbookSection = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: { id?: string; title: string; chapters: { title: string; description: string }[]; position: number }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    if (data.id) {
      const { error } = await supabaseAdmin.from("ebook_sections").update({ title: data.title, chapters: data.chapters, position: data.position }).eq("id", data.id);
      if (error) throw new Error("Failed to update section");
    } else {
      const { error } = await supabaseAdmin.from("ebook_sections").insert({ title: data.title, chapters: data.chapters, position: data.position });
      if (error) throw new Error("Failed to create section");
    }
    return { success: true };
  });

export const deleteEbookSection = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("ebook_sections").delete().eq("id", data.id);
    if (error) throw new Error("Failed to delete section");
    return { success: true };
  });

export const checkIsAdmin = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    return { isAdmin: !!data };
  });
