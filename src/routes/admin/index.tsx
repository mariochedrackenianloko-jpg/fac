import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, getCustomers, getStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate({ to: "/admin/login" });

      const adminCheck = await checkIsAdmin();
      if (!adminCheck.isAdmin) return navigate({ to: "/admin/login" });

      setIsAdmin(true);
      Promise.all([
        getStats().then(setStats).catch(() => {}),
        getCustomers().then(setCustomers).catch(() => [])
      ]).finally(() => setLoading(false));
    };
    init();
  }, []);

  if (loading || !isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>Total clients: {stats?.total || 0}</div>
      <div>Approuvés: {stats?.approved || 0}</div>
      <ul>
        {customers.map((c) => (
          <li key={c.id}>{c.name} - {c.payment_status}</li>
        ))}
      </ul>
    </div>
  );
}

