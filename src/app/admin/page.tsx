import Link from "next/link";
import { IconBook2, IconUsers, IconUser, IconMail } from "@tabler/icons-react";

const CARDS = [
  {
    href: "/admin/cours",
    icon: IconBook2,
    label: "Cours",
    desc: "Gérer les cours et les modules",
  },
  {
    href: "/admin/enrollments",
    icon: IconUsers,
    label: "Inscriptions",
    desc: "Suivre et valider les inscriptions",
  },
  {
    href: "/admin/profile",
    icon: IconUser,
    label: "Profil",
    desc: "Modifier vos informations et mot de passe",
  },
  {
    href: "/admin/email-template",
    icon: IconMail,
    label: "E-mails",
    desc: "Personnaliser les templates de confirmation",
  },
];

export default function AdminPage() {
  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
      <p className="mt-1 text-sm text-foreground/50 mb-8">Bienvenue dans l'espace administration <strong className="text-accent">Online Deutschkurs mit Eliana</strong>.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 transition-all hover:border-accent/40 hover:bg-accent/5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Icon size={24} className="text-accent" />
            </div>
            <span className="font-semibold text-foreground">{label}</span>
            <span className="text-xs text-center text-foreground/40">{desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
