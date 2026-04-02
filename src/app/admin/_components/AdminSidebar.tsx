"use client";

import { useEffect, useState } from "react";
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
  IconMenu2,
  IconX,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const sidebarContent = (showCloseButton: boolean) => (
    <>
      <div className="flex h-16 items-center justify-between border-b border-foreground/10 px-6">
        <span className="text-lg font-bold text-foreground">
          Online Deutschkurs mit <span className="text-accent">Eliana</span>
          <span className="ml-2 text-xs font-normal text-foreground/40">Admin</span>
        </span>
        {showCloseButton && (
          <button
            type="button"
            onClick={closeMobile}
            className="text-foreground/50 hover:text-foreground md:hidden"
            aria-label="Fermer le menu"
          >
            <IconX size={18} />
          </button>
        )}
      </div>

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
              onClick={closeMobile}
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

      <div className="border-t border-foreground/10 p-4">
        <div className="mb-3 rounded-xl bg-foreground/[0.03] px-4 py-3">
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-xs text-foreground/40">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/60 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <IconLogout size={18} />
          Se deconnecter
        </button>
      </div>
    </>
  );

  return (
    <>
      {!isDesktop && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-background text-foreground shadow-sm md:hidden"
          aria-label="Ouvrir le menu admin"
        >
          <IconMenu2 size={18} />
        </button>
      )}

      {!isDesktop && mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={closeMobile}
          aria-label="Fermer le menu admin"
        />
      )}

      {isDesktop && (
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-foreground/10 bg-background">
          {sidebarContent(false)}
        </aside>
      )}

      {!isDesktop && (
        <aside
          className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l border-foreground/10 bg-background transition-transform duration-200 md:hidden ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {sidebarContent(true)}
        </aside>
      )}
    </>
  );
}
