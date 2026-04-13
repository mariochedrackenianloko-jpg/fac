import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { withAuthToken } from "@/lib/auth-client-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

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

export const getStats = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("payment_status");
    if (error) throw new Error("Failed to load stats");
    const total = data.length;
    const approved = data.filter((c) => c.payment_status === "approved").length;
    const pending = data.filter((c) => c.payment_status === "pending").length;
    const rejected = data.filter((c) => c.payment_status === "rejected").length;
    const { data: settings } = await supabaseAdmin.from("product_settings").select("price").limit(1).single();
    const price = settings?.price ? parseFloat(settings.price.replace(/[^0-9.]/g, "")) : 0;
    return { total, approved, pending, rejected, revenue: approved * price };
  });

export const updateCustomerStatus = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: { customerId: string; status: string }) => {
    if (!["pending", "approved", "rejected"].includes(input.status)) throw new Error("Invalid status");
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
    whatsapp_contact?: string;
    cover_image_url?: string;
    ebook_file_url?: string;
    countdown_date?: string;
    sales_count?: number;
    promo_banner?: string;
  }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const { id, ...updates } = data;
    const { error } = await supabaseAdmin.from("product_settings").update(updates).eq("id", id);
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

export const getTestimonials = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin.from("testimonials").select("*").order("position", { ascending: true });
    if (error) throw new Error("Failed to load testimonials");
    return data;
  });

export const upsertTestimonial = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: { id?: string; name: string; location: string; text: string; rating: number; position: number }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    if (data.id) {
      const { error } = await supabaseAdmin.from("testimonials").update({ name: data.name, location: data.location, text: data.text, rating: data.rating, position: data.position }).eq("id", data.id);
      if (error) throw new Error("Failed to update testimonial");
    } else {
      const { error } = await supabaseAdmin.from("testimonials").insert({ name: data.name, location: data.location, text: data.text, rating: data.rating, position: data.position });
      if (error) throw new Error("Failed to create testimonial");
    }
    return { success: true };
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("testimonials").delete().eq("id", data.id);
    if (error) throw new Error("Failed to delete testimonial");
    return { success: true };
  });

export const getFaqs = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin.from("faqs").select("*").order("position", { ascending: true });
    if (error) throw new Error("Failed to load faqs");
    return data;
  });

export const upsertFaq = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: { id?: string; question: string; answer: string; position: number }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    if (data.id) {
      const { error } = await supabaseAdmin.from("faqs").update({ question: data.question, answer: data.answer, position: data.position }).eq("id", data.id);
      if (error) throw new Error("Failed to update faq");
    } else {
      const { error } = await supabaseAdmin.from("faqs").insert({ question: data.question, answer: data.answer, position: data.position });
      if (error) throw new Error("Failed to create faq");
    }
    return { success: true };
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([withAuthToken, requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await requireAdmin(context.userId);
    const { error } = await supabaseAdmin.from("faqs").delete().eq("id", data.id);
    if (error) throw new Error("Failed to delete faq");
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
