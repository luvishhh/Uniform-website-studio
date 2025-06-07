import AdminSidebar from "@/components/admin/AdminSidebar";
import Header from "@/components/layout/Header"; // Can be a simplified admin header or the main one

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Here you might add authentication checks for admin access
  // For now, we assume access is granted.
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header />  You might want a different header for admin, or hide parts of the main one */}
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 bg-muted/30 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
