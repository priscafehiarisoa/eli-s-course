"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { IconLock, IconMail } from "@tabler/icons-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-mail ou mot de passe incorrect.");
      setLoading(false);
    } else {
      globalThis.location.href = "/admin";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold text-foreground">
            Online Deutschkurs mit <span className="text-accent">Eliana</span>
          </p>
          <p className="mt-1 text-sm text-foreground/50">
            Connectez-vous à l'espace admin
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground/70"
            >
              E-mail
            </label>
            <div className="relative">
              <IconMail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
              />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="admin@mail.de"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground/70"
            >
              Mot de passe
            </label>
            <div className="relative">
              <IconLock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30"
              />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
