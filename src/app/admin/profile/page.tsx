"use client";

import { useState, useEffect } from "react";
import { IconUser, IconLock, IconCheck, IconAlertCircle } from "@tabler/icons-react";

type ProfileData = { name: string; email: string };
type Msg = { ok: boolean; text: string };

function Alert({ msg }: Readonly<{ msg: Msg }>) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
        msg.ok
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-600"
      }`}
    >
      {msg.ok ? <IconCheck size={15} /> : <IconAlertCircle size={15} />}
      {msg.text}
    </div>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({ name: "", email: "" });
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((d) => setProfile({ name: d.name ?? "", email: d.email ?? "" }));
  }, []);

  // ── Update profile ──────────────────────────────────────
  const handleProfileSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profile.name, email: profile.email }),
    });
    const data = await res.json();
    setProfileMsg(
      res.ok
        ? { ok: true, text: "Profil mis à jour." }
        : { ok: false, text: data.error ?? "Erreur." }
    );
    setProfileLoading(false);
  };

  // ── Change password ─────────────────────────────────────
  const handlePasswordSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ ok: false, text: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg({ ok: false, text: "Le mot de passe doit faire au moins 8 caractères." });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    });
    const data = await res.json();
    setPasswordMsg(
      res.ok
        ? { ok: true, text: "Mot de passe modifié." }
        : { ok: false, text: data.error ?? "Erreur." }
    );
    if (res.ok) {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setPasswordLoading(false);
  };

  const inputClass =
    "w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="px-8 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Mon profil</h1>
      <p className="mt-1 text-sm text-foreground/50">
        Gérez vos informations et votre mot de passe.
      </p>

      {/* ── Profile info ─────────────────────────── */}
      <section className="mt-8 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
            <IconUser size={18} className="text-accent" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Informations personnelles
          </h2>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {profileMsg && <Alert msg={profileMsg} />}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-foreground/70"
            >
              Nom
            </label>
            <input
              id="name"
              type="text"
              required
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="profile-email"
              className="mb-1.5 block text-sm font-medium text-foreground/70"
            >
              E-mail
            </label>
            <input
              id="profile-email"
              type="email"
              required
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper disabled:opacity-50"
            >
              {profileLoading ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Change password ──────────────────────── */}
      <section className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
            <IconLock size={18} className="text-accent" />
          </div>
          <h2 className="text-base font-semibold text-foreground">
            Modifier le mot de passe
          </h2>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordMsg && <Alert msg={passwordMsg} />}
          <div>
            <label
              htmlFor="currentPassword"
              className="mb-1.5 block text-sm font-medium text-foreground/70"
            >
              Mot de passe actuel
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((p) => ({
                  ...p,
                  currentPassword: e.target.value,
                }))
              }
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="mb-1.5 block text-sm font-medium text-foreground/70"
            >
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              type="password"
              required
              autoComplete="new-password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((p) => ({
                  ...p,
                  newPassword: e.target.value,
                }))
              }
              className={inputClass}
              placeholder="Minimum 8 caractères"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm font-medium text-foreground/70"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((p) => ({
                  ...p,
                  confirmPassword: e.target.value,
                }))
              }
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper disabled:opacity-50"
            >
              {passwordLoading ? "Modification…" : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
