"use client";

import { useState } from "react";
import Link from "next/link";

export default function SetupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setState("error");
      setMessage("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setState("done");
        setMessage(`Compte créé pour : ${data.email}`);
      } else {
        setState("error");
        setMessage(data.error ?? "Erreur inconnue.");
      }
    } catch {
      setState("error");
      setMessage("Erreur réseau. Vérifiez votre connexion.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold text-foreground">
            Online Deutschkurs mit <span className="text-accent">Eliana</span>
          </p>
          <p className="mt-1 text-sm text-foreground/50">
            Création du premier compte administrateur
          </p>
        </div>

        {state === "done" ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <p className="text-base font-semibold text-green-700">✓ {message}</p>
            <Link
              href="/admin/login"
              className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8"
          >
            {state === "error" && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {message}
              </div>
            )}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground/70">
                Nom
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={inputClass}
                placeholder="Eliana"
              />
            </div>
            <div>
              <label htmlFor="setup-email" className="mb-1.5 block text-sm font-medium text-foreground/70">
                E-mail
              </label>
              <input
                id="setup-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={inputClass}
                placeholder="admin@mail.de"
              />
            </div>
            <div>
              <label htmlFor="setup-password" className="mb-1.5 block text-sm font-medium text-foreground/70">
                Mot de passe <span className="text-foreground/30">(min. 8 caractères)</span>
              </label>
              <input
                id="setup-password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className={inputClass}
                placeholder="Minimum 8 caractères"
              />
            </div>
            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper disabled:opacity-50"
            >
              {state === "loading" ? "Création…" : "Créer le compte admin"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
