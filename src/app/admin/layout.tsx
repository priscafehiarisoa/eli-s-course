import { auth } from "@/auth";
import AdminSidebar from "./_components/AdminSidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user
    ? { name: session.user.name ?? "", email: session.user.email ?? "" }
    : null;

  return (
    <div className="flex min-h-screen bg-background">
      {user && <AdminSidebar user={user} />}
      <div className={user ? "ml-64 flex-1 overflow-x-hidden" : "flex-1"}>
        {children}
      </div>
    </div>
  );
}
