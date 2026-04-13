import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, getCustomers, updateCustomerStatus, updateProductSettings, getEbookSections, upsertEbookSection, deleteEbookSection, getStats, getTestimonials, upsertTestimonial, deleteTestimonial, getFaqs, upsertFaq, deleteFaq } from "@/lib/admin.functions";
import { getProductSettings, deleteProductFile } from "@/lib/product.functions";
import {
  Users, Settings, FileText, LogOut, Loader2,
  CheckCircle, XCircle, Clock, MessageCircle, CreditCard,
  Save, Upload, ImageIcon, FileUp, BookOpen, Plus, Trash2, ChevronDown, ChevronUp,
  BarChart3, Star, HelpCircle, Phone, Edit2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Dashboard Admin – FAC AFRIQUE" }],
  }),
  component: AdminDashboard,
});

type Tab = "stats" | "customers" | "product" | "content" | "testimonials" | "faqs" | "settings";

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("stats");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async (session: any) => {
      if (!session) {
        navigate({ to: "/admin/login" });
        return;
      }
      try {
        const result = await checkIsAdmin();
        if (!result.isAdmin) {
          navigate({ to: "/admin/login" });
          return;
        }
        setIsAdmin(true);
      } catch {
        navigate({ to: "/admin/login" });
      } finally {
        setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      check(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
      <div className="border-b border-border overflow-x-auto">
        <div className="flex min-w-max">
          {([
            { key: "stats" as Tab, icon: BarChart3, label: "Stats" },
            { key: "customers" as Tab, icon: Users, label: "Clients" },
            { key: "product" as Tab, icon: FileText, label: "Produit" },
            { key: "content" as Tab, icon: BookOpen, label: "Contenu" },
            { key: "testimonials" as Tab, icon: Star, label: "Témoignages" },
            { key: "faqs" as Tab, icon: HelpCircle, label: "FAQ" },
            { key: "settings" as Tab, icon: Settings, label: "Paramètres" },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {tab === "stats" && <StatsTab />}
        {tab === "customers" && <CustomersTab />}
        {tab === "product" && <ProductTab />}
        {tab === "content" && <ContentTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "faqs" && <FaqsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

function StatsTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  const cards = [
    { label: "Total clients", value: stats?.total ?? 0, cls: "text-foreground" },
    { label: "Approuvés", value: stats?.approved ?? 0, cls: "text-success" },
    { label: "En attente", value: stats?.pending ?? 0, cls: "text-gold" },
    { label: "Rejetés", value: stats?.rejected ?? 0, cls: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold">Tableau de bord</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-5 text-center">
            <p className={`text-3xl font-heading font-bold ${c.cls}`}>{c.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-sm text-muted-foreground mb-1">Revenus estimés</p>
        <p className="text-3xl font-heading font-bold text-gradient-gold">
          {stats?.revenue ? stats.revenue.toLocaleString("fr-FR") + " FCFA" : "—"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Basé sur les clients approuvés × prix actuel</p>
      </div>
    </div>
  );
}

function CustomersTab() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateCustomerStatus({ data: { customerId: id, status } });
      toast.success(status === "approved" ? "Client approuvé ✓" : "Client rejeté");
      load();
    } catch (e) { console.error(e); toast.error("Erreur lors de la mise à jour"); }
  };

  const exportCSV = () => {
    const rows = [["Nom", "Téléphone", "Statut", "Date"]];
    customers.forEach((c) => rows.push([c.name, c.phone, c.payment_status, new Date(c.created_at).toLocaleDateString("fr-FR")]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "clients.csv";
    a.click();
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="font-heading text-xl font-bold">Clients ({customers.length})</h2>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom ou tél..."
            className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-gold/50 focus:outline-none w-48"
          />
          <button onClick={exportCSV} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
            Export CSV
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucun client trouvé.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
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
      toast.success("Produit enregistré !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la sauvegarde");
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
        <div>
          {settings.cover_image_url && (
            <div className="mb-2 p-3 bg-muted rounded-lg flex items-center gap-3">
              <img 
                src={settings.cover_image_url} 
                alt="Preview couverture" 
                className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{settings.cover_image_url.split('/').pop()}</p>
                <a href={settings.cover_image_url} target="_blank" rel="noreferrer" className="text-xs text-gold hover:underline">Voir</a>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors ml-auto">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer l'image de couverture</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera définitivement le fichier du stockage. Voulez-vous continuer ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={async () => {
                        try {
                          await deleteProductFile({ data: { url: settings.cover_image_url! } });
                          setSettings({ ...settings, cover_image_url: null });
                          toast.success("Image supprimée !");
                        } catch (e) {
                          toast.error("Erreur suppression");
                        }
                      }}

                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          <FileUploadField
            label="Image de couverture"
            icon={ImageIcon}
            accept="image/*"
            currentUrl={settings.cover_image_url}
            bucket="ebook-assets"
            storagePath="cover"
            onUploaded={(url) => setSettings({ ...settings, cover_image_url: url })}
          />
        </div>

        <div>
          {settings.ebook_file_url && (
            <div className="mb-2 p-3 bg-muted rounded-lg flex items-center gap-3">
              <div className="w-16 h-20 bg-muted-foreground/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{settings.ebook_file_url.split('/').pop()}</p>
                <a href={settings.ebook_file_url} target="_blank" rel="noreferrer" className="text-xs text-gold hover:underline">Voir PDF</a>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors ml-auto">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le fichier PDF de l'ebook</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera définitivement le fichier du stockage. Voulez-vous continuer ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={async () => {
                        try {
                          await deleteProductFile({ data: { url: settings.ebook_file_url! } });
                          setSettings({ ...settings, ebook_file_url: null });
                          toast.success("PDF supprimé !");
                        } catch (e) {
                          toast.error("Erreur suppression");
                        }
                      }}

                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          <FileUploadField
            label="Fichier PDF de l'ebook"
            icon={FileUp}
            accept="application/pdf"
            currentUrl={settings.ebook_file_url}
            bucket="ebook-assets"
            storagePath="ebook"
            onUploaded={(url) => setSettings({ ...settings, ebook_file_url: url })}
          />
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
      toast.success("Section enregistrée !");
      await load();
    } catch (e) { console.error(e); toast.error("Erreur lors de la sauvegarde"); }
    setSaving(null);
  };

  const remove = async (id: string) => {
    if (id.startsWith("new-")) { setSections((p) => p.filter((s) => s.id !== id)); return; }
    try {
      await deleteEbookSection({ data: { id } });
      toast.success("Section supprimée");
      await load();
    } catch (e) { console.error(e); toast.error("Erreur lors de la suppression"); }
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

function TestimonialsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, { name: string; location: string; text: string; rating: number }>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setItems(data);
      const init: Record<string, any> = {};
      data.forEach((t: any) => { init[t.id] = { name: t.name, location: t.location, text: t.text, rating: t.rating }; });
      setEditData(init);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = () => {
    const tempId = "new-" + Date.now();
    setItems((prev) => [...prev, { id: tempId, position: prev.length }]);
    setEditData((prev) => ({ ...prev, [tempId]: { name: "", location: "", text: "", rating: 5 } }));
    setExpanded(tempId);
  };

  const save = async (item: any) => {
    const d = editData[item.id];
    if (!d) return;
    setSaving(item.id);
    try {
      const isNew = item.id.startsWith("new-");
      await upsertTestimonial({ data: { ...(isNew ? {} : { id: item.id }), ...d, position: item.position } });
      toast.success("Témoignage enregistré !");
      await load();
      setExpanded(null);
    } catch (e) { console.error(e); toast.error("Erreur lors de la sauvegarde"); }
    setSaving(null);
  };

  const remove = async (id: string) => {
    if (id.startsWith("new-")) { setItems((p) => p.filter((i) => i.id !== id)); return; }
    try { await deleteTestimonial({ data: { id } }); toast.success("Témoignage supprimé"); await load(); } catch (e) { console.error(e); toast.error("Erreur"); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">Témoignages</h2>
        <button onClick={add} className="flex items-center gap-2 bg-gradient-gold text-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 text-sm">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>
      {items.length === 0 && <p className="text-muted-foreground text-center py-8">Aucun témoignage.</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-gold fill-gold" />
                <span className="font-medium">{editData[item.id]?.name || "Nouveau témoignage"}</span>
                <span className="text-xs text-muted-foreground">{editData[item.id]?.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                {expanded === item.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
            {expanded === item.id && (
              <div className="border-t border-border px-4 py-4 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <input value={editData[item.id]?.name || ""} onChange={(e) => setEditData((p) => ({ ...p, [item.id]: { ...p[item.id], name: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-gold/50 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Localisation</label>
                    <input value={editData[item.id]?.location || ""} onChange={(e) => setEditData((p) => ({ ...p, [item.id]: { ...p[item.id], location: e.target.value } }))}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-gold/50 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Témoignage</label>
                  <textarea value={editData[item.id]?.text || ""} onChange={(e) => setEditData((p) => ({ ...p, [item.id]: { ...p[item.id], text: e.target.value } }))}
                    rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-gold/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Note</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} onClick={() => setEditData((p) => ({ ...p, [item.id]: { ...p[item.id], rating: star } }))}>
                        <Star className={`h-6 w-6 transition-colors ${star <= (editData[item.id]?.rating || 5) ? "text-gold fill-gold" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => save(item)} disabled={saving === item.id}
                  className="bg-gradient-gold text-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2 text-sm disabled:opacity-50">
                  {saving === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqsTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, { question: string; answer: string }>>({});

  const load = async () => {
    setLoading(true);
    try {
      const data = await getFaqs();
      setItems(data);
      const init: Record<string, any> = {};
      data.forEach((f: any) => { init[f.id] = { question: f.question, answer: f.answer }; });
      setEditData(init);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = () => {
    const tempId = "new-" + Date.now();
    setItems((prev) => [...prev, { id: tempId, position: prev.length }]);
    setEditData((prev) => ({ ...prev, [tempId]: { question: "", answer: "" } }));
    setExpanded(tempId);
  };

  const save = async (item: any) => {
    const d = editData[item.id];
    if (!d) return;
    setSaving(item.id);
    try {
      const isNew = item.id.startsWith("new-");
      await upsertFaq({ data: { ...(isNew ? {} : { id: item.id }), ...d, position: item.position } });
      toast.success("FAQ enregistrée !");
      await load();
      setExpanded(null);
    } catch (e) { console.error(e); toast.error("Erreur lors de la sauvegarde"); }
    setSaving(null);
  };

  const remove = async (id: string) => {
    if (id.startsWith("new-")) { setItems((p) => p.filter((i) => i.id !== id)); return; }
    try { await deleteFaq({ data: { id } }); toast.success("Question supprimée"); await load(); } catch (e) { console.error(e); toast.error("Erreur"); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold">FAQ</h2>
        <button onClick={add} className="flex items-center gap-2 bg-gradient-gold text-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 text-sm">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>
      {items.length === 0 && <p className="text-muted-foreground text-center py-8">Aucune question.</p>}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <span className="font-medium text-sm">{editData[item.id]?.question || "Nouvelle question"}</span>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                {expanded === item.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>
            {expanded === item.id && (
              <div className="border-t border-border px-4 py-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <input value={editData[item.id]?.question || ""} onChange={(e) => setEditData((p) => ({ ...p, [item.id]: { ...p[item.id], question: e.target.value } }))}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-gold/50 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Réponse</label>
                  <textarea value={editData[item.id]?.answer || ""} onChange={(e) => setEditData((p) => ({ ...p, [item.id]: { ...p[item.id], answer: e.target.value } }))}
                    rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-gold/50 focus:outline-none" />
                </div>
                <button onClick={() => save(item)} disabled={saving === item.id}
                  className="bg-gradient-gold text-foreground font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2 text-sm disabled:opacity-50">
                  {saving === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
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
      await updateProductSettings({ data: { id: settings.id, wave_payment_link: settings.wave_payment_link, whatsapp_group_link: settings.whatsapp_group_link, whatsapp_contact: settings.whatsapp_contact, countdown_date: settings.countdown_date, sales_count: settings.sales_count, promo_banner: settings.promo_banner } });
      toast.success("Paramètres enregistrés !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la sauvegarde");
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
            <MessageCircle className="h-4 w-4 text-gold" /> Bannière promotionnelle
          </label>
          <input value={settings.promo_banner || ""} onChange={(e) => setSettings({ ...settings, promo_banner: e.target.value })}
            placeholder="Ex: 🔥 Offre spéciale : -20% ce week-end !"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none" />
          <p className="text-xs text-muted-foreground mt-1">Laisser vide pour masquer la bannière</p>
        </div>
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
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <Phone className="h-4 w-4 text-success" /> Numéro WhatsApp contact (bouton flottant)
          </label>
          <input value={settings.whatsapp_contact || ""} onChange={(e) => setSettings({ ...settings, whatsapp_contact: e.target.value })}
            placeholder="+2250700000000"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" /> Date de fin de l'offre (countdown)
          </label>
          <input type="datetime-local" value={settings.countdown_date || ""} onChange={(e) => setSettings({ ...settings, countdown_date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-gold/50 focus:outline-none" />
          <p className="text-xs text-muted-foreground mt-1">Laisser vide pour masquer le countdown</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-2">
            <Users className="h-4 w-4 text-gold" /> Nombre de ventes affiché
          </label>
          <input type="number" value={settings.sales_count || 500} onChange={(e) => setSettings({ ...settings, sales_count: parseInt(e.target.value) })}
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
