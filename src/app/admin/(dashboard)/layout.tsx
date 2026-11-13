import AdminShell from "@/components/admin/AdminShell";
import { getAdminAccess } from "@/lib/admin/access";

// Every dashboard page checks who is visiting (see src/lib/admin/access.ts) before anything
// is read from the database.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const access = await getAdminAccess();
  return <AdminShell access={access}>{access.status === "allowed" ? children : null}</AdminShell>;
}
