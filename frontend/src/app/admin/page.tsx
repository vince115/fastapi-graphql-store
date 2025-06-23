// frontend/src/app/admin/page.tsx
import AdminClientGuard from "@/components/admin/AdminClientGuard";

export default function AdminHomePage() {
  return (
    <main className="p-8">
      <AdminClientGuard />
    </main>
  );
}