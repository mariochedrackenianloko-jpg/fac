import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, getCustomers, updateCustomerStatus, updateProductSettings, getEbookSections, upsertEbookSection, deleteEbookSection } from "@/lib/admin.functions";
import { getProductSettings } from "@/lib/product.functions";
import {
  Users, Settings, FileText, LogOut, Loader2,
  CheckCircle, XCircle, Clock, MessageCircle, CreditCard,
  Save, Upload, ImageIcon, FileUp, BookOpen, Plus, Trash2, ChevronDown, ChevronUp
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard Admin – FAC AFRIQUE" }],
  }),
  component: AdminDashboard,
});

type Tab = "customers" | "product" | "content" | "settings";

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("customers");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async (session: any) => {
      console.log("[ADMIN] check called, session:", session?.user?.email ?? null);
      if (!session) {
        console.log("[ADMIN] no session → redirect login");
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        console.log("[ADMIN] calling checkIsAdmin...");
        const result = await checkIsAdmin();
        console.log("[ADMIN] checkIsAdmin result:", result);
        if (!result.isAdmin) {
          console.log("[ADMIN] not admin → redirect login");
          navigate({ to: "/admin/login" });
          return;
        }
        setIsAdmin(true);
      } catch (e) {
        console.error("[ADMIN] checkIsAdmin error:", e);
        navigate({ to: "/admin/login" });
      } finally {
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[ADMIN] getSession:", session?.user?.email ?? null);
      check(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[ADMIN] onAuthStateChange event:", event, session?.user?.email ?? null);
      check(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background px-4 py-3 flex items-center justify-between">
        <h1 className="text-gradient-gold font-heading text-lg font-bold">FAC AFRIQUE Admin</h1>
        <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-background/70 hover:text-gold transition-colors">
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-border flex">
        {([
          { key: "customers" as Tab, icon: Users, label: "Clients" },
          { key: "product" as Tab, icon: FileText, label: "Produit" },
          { key: "content" as Tab, icon: BookOpen, label: "Contenu" },
          { key: "settings" as Tab, icon: Settings, label: "Paramètres" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {tab === "customers" && <CustomersTab />}
        {tab === "product" && <ProductTab />}
        {tab === "content" && <ContentTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

function CustomersTab() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateCustomerStatus({ data: { customerId: id, status } });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div>
      <h2 className="font-heading text-xl font-bold mb-4">Clients ({customers.length})</h2>
      {customers.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucun client pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {customers.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.phone}</p>
                <p className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={c.payment_status} />
                {c.payment_status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(c.id, "approved")} className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors">
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button onClick={() => updateStatus(c.id, "rejected")} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                      <XCircle className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { icon: Clock, label: "En attente", cls: "bg-gold/10 text-gold" },
    approved: { icon: CheckCircle, label: "Approuvé", cls: "bg-success/10 text-success" },
    rejected: { icon: XCircle, label: "Rejeté", cls: "bg-destructive/10 text-destructive" },
  }[status] || { icon: Clock, label: status, cls: "bg-muted text-muted-foreground" };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.cls}`}>
      <config.icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function FileUploadField({
  label, icon: Icon, accept, currentUrl, bucket, storagePath, onUploaded
}: {
  label: string;
  icon: React.ElementType;
  accept: string;
  currentUrl: string | null;
  bucket: string;
  storagePath: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${storagePath}.${ext}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploaded(data.publicUrl);
    } catch (e: any) {
      setError(e.message ?? "Erreur upload");
    }
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-gold" /> {label}
      </label>
      {currentUrl && (
        <p className="text-xs text-muted-foreground mb-2 truncate">
          Actuel : <a href={currentUrl} target="_blank" rel="noreferrer" className="text-gold underline">{currentUrl.split("/").pop()}</a>
        </p>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-gold/50 transition-colors"
      >
        {uploading
          ? <Loader2 className="h-6 w-6 animate-spin text-gold" />
          : <Upload className="h-6 w-6 text-muted-foreground" />}
        <p className="text-sm text-muted-foreground">
          {uploading ? "Upload en cours..." : "Glisser-déposer ou cliquer pour choisir"}
        </p>
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}

function ProductTab() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProductSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateProductSettings({ data: settings });
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading || !settings) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold">Gérer le produit</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            rows={4} className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Prix</label>
          <input value={settings.price} onChange={(e) => setSettings({ ...settings, price: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none" />
        </div>
        <FileUploadField
          label="Image de couverture"
          icon={ImageIcon}
          accept="image/*"
          currentUrl={settings.cover_image_url}
          bucket="ebook-assets"
          storagePath="cover"
          onUploaded={(url) => setSettings({ ...settings, cover_image_url: url })}
        />
        <FileUploadField
          label="Fichier PDF de l'ebook"
          icon={FileUp}
          accept="application/pdf"
          currentUrl={settings.ebook_file_url}
          bucket="ebook-assets"
          storagePath="ebook"
          onUploaded={(url) => setSettings({ ...settings, ebook_file_url: url })}
        />
        <button onClick={save} disabled={saving}
          className="bg-gradient-gold text-foreground font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
      </div>
    </div>
  );
}

function ContentTab() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, { title: string; chapters: { title: string; description: string }[] }>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await getEbookSections();
      setSections(data);
      const init: Record<string, { title: string; chapters: { title: string; description: string }[] }> = {};
      data.forEach((s: any) => { init[s.id] = { title: s.title, chapters: s.chapters ?? [] }; });
      setEditData(init);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addSection = async () => {
    const tempId = "new-" + Date.now();
    setSections((prev) => [...prev, { id: tempId, title: "Nouvelle partie", chapters: [], position: prev.length }]);
    setEditData((prev) => ({ ...prev, [tempId]: { title: "Nouvelle partie", chapters: [] } }));
    setExpanded(tempId);
  };

  const save = async (s: any) => {
    const d = editData[s.id];
    if (!d) return;
    setSaving(s.id);
    try {
      const isNew = s.id.startsWith("new-");
      await upsertEbookSection({ data: { ...(isNew ? {} : { id: s.id }), title: d.title, chapters: d.chapters.filter((c) => c.title.trim()), position: s.position } });
      await load();
    } catch (e) { console.error(e); }
    setSaving(null);
  };

  const remove = async (id: string) => {
    if (id.startsWith("new-")) { setSections((p) => p.filter((s) => s.id !== id)); return; }
    try {
      await deleteEbookSection({ data: { id } });
      await load();
    } catch (e) { console.error(e); }
  };

  const updateChapter = (sectionId: string, idx: number, field: "title" | "description", val: string) => {
    setEditData((prev) => {
      const chapters = [...(prev[sectionId]?.chapters || [])];
      chapters[idx] = { ...chapters[idx], [field]: val };
      return { ...prev, [sectionId]: { ...prev[sectionId], chapters } };
    });
  };

  const addChapter = (sectionId: string) => {
    setEditData((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], chapters: [...(prev[sectionId]?.chapters || []), { title: "", description: "" }] },
    }));
  };

  const removeChapter = (sectionId: string, idx: number) => {
    setEditData((prev) => {
      const chapters = [...(prev[sectionId]?.chapters || [])].filter((_, i) => i !== idx);
      return { ...prev, [sectionId]: { ...prev[sectionId], chapters } };
    });
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Contenu de l'ebook</h2>
        <button onClick={addSection} className="flex items-center gap-2 bg-gradient-gold text-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm">
          <Plus className="h-4 w-4" /> Ajouter une partie
        </button>
      </div>

      {sections.length === 0 && (
        <p className="text-muted-foreground text-center py-8">Aucune section. Ajoutez une partie.</p>
      )}

      <div className="space-y-3">
        {sections.map((s, idx) => (
          <div key={s.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                <span className="font-medium">{editData[s.id]?.title || s.title}</span>
                <span className="text-xs text-muted-foreground">({(editData[s.id]?.chapters || s.chapters).length} chapitre{(editData[s.id]?.chapters || s.chapters).length !== 1 ? "s" : ""})</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); remove(s.id); }} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                {expanded === s.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>

            {expanded === s.id && (
              <div className="border-t border-border px-4 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre de la partie</label>
                  <input
                    value={editData[s.id]?.title || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, [s.id]: { ...prev[s.id], title: e.target.value } }))}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Chapitres</label>
                    <button onClick={() => addChapter(s.id)} className="flex items-center gap-1 text-xs text-gold hover:underline">
                      <Plus className="h-3 w-3" /> Ajouter un chapitre
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(editData[s.id]?.chapters || []).map((ch: { title: string; description: string }, i: number) => (
                      <div key={i} className="bg-background border border-border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-5 text-right shrink-0">{i + 1}.</span>
                          <input
                            value={ch.title}
                            onChange={(e) => updateChapter(s.id, i, "title", e.target.value)}
                            placeholder={`Titre du chapitre ${i + 1}`}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-input bg-card text-sm focus:ring-2 focus:ring-gold/50 focus:outline-none font-medium"
                          />
                          <button onClick={() => removeChapter(s.id, i)} className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors shrink-0">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="pl-7">
                          <textarea
                            value={ch.description}
                            onChange={(e) => updateChapter(s.id, i, "description", e.target.value)}
                            placeholder="Description du chapitre (optionnel)"
                            rows={2}
                            className="w-full px-3 py-1.5 rounded-lg border border-input bg-card text-sm text-muted-foreground focus:ring-2 focus:ring-gold/50 focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    {(editData[s.id]?.chapters || []).length === 0 && (
                      <p className="text-xs text-muted-foreground">Aucun chapitre. Cliquez sur "Ajouter un chapitre".</p>
                    )}
                  </div>
                </div>

                <button onClick={() => save(s)} disabled={saving === s.id}
                  className="bg-gradient-gold text-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm disabled:opacity-50">
                  {saving === s.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Enregistrer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProductSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateProductSettings({ data: { id: settings.id, wave_payment_link: settings.wave_payment_link, whatsapp_group_link: settings.whatsapp_group_link } });
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading || !settings) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold">Paramètres</h2>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-gold" /> Lien de paiement Wave
          </label>
          <input value={settings.wave_payment_link} onChange={(e) => setSettings({ ...settings, wave_payment_link: e.target.value })}
            placeholder="https://pay.wave.com/..."
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-success" /> Lien du groupe WhatsApp
          </label>
          <input value={settings.whatsapp_group_link} onChange={(e) => setSettings({ ...settings, whatsapp_group_link: e.target.value })}
            placeholder="https://chat.whatsapp.com/..."
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none" />
        </div>
        <button onClick={save} disabled={saving}
          className="bg-gradient-gold text-foreground font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Enregistrer
        </button>
      </div>
    </div>
  );
}
