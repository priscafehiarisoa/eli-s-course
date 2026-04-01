"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  IconBook2,
  IconUsers,
  IconUser,
  IconLogout,
  IconLayoutDashboard,
  IconMail,
} from "@tabler/icons-react";

type Props = {
  user: { name: string; email: string };
};

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/admin/cours", label: "Cours", icon: IconBook2 },
  { href: "/admin/enrollments", label: "Inscriptions", icon: IconUsers },
  { href: "/admin/email-template", label: "E-mails", icon: IconMail },
  { href: "/admin/profile", label: "Profil", icon: IconUser },
];

export default function AdminSidebar({ user }: Readonly<Props>) {
  const pathname = usePathname() ?? "";

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-foreground/10 bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-foreground/10 px-6">
        <span className="text-lg font-bold text-foreground">
            Online Deutschkurs mit <span className="text-accent">Eliana</span>
          <span className="ml-2 text-xs font-normal text-foreground/40">Admin</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent/10 text-accent"
                  : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-foreground/10 p-4">
        <div className="mb-3 rounded-xl bg-foreground/[0.03] px-4 py-3">
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-foreground/40 truncate">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <IconLogout size={18} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
