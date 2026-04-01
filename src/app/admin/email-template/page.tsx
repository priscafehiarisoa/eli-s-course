"use client";

import { useEffect, useMemo, useState } from "react";
import { IconInfoCircle, IconDeviceFloppy, IconCopy, IconSend, IconRefresh } from "@tabler/icons-react";
import { EMAIL_TEMPLATE_KINDS, type EmailTemplateKind, type EmailTemplateStore } from "@/lib/enrollmentEmailTemplate";

type Locale = "en" | "fr" | "de";

type ApiResponse = {
  templates: EmailTemplateStore;
  tokens: string[];
  kinds: EmailTemplateKind[];
};

const LOCALES: Array<{ code: Locale; label: string }> = [
  { code: "en", label: "English" },
  { code: "fr", label: "Francais" },
  { code: "de", label: "Deutsch" },
];

const KIND_LABELS: Record<EmailTemplateKind, string> = {
  enrollment: "Confirmation d'inscription",
  cancellation: "Annulation",
  payment: "Confirmation de paiement",
};

const EMPTY_TEMPLATES: EmailTemplateStore = {
  enrollment: { en: { subject: "", body: "" }, fr: { subject: "", body: "" }, de: { subject: "", body: "" } },
  cancellation: { en: { subject: "", body: "" }, fr: { subject: "", body: "" }, de: { subject: "", body: "" } },
  payment: { en: { subject: "", body: "" }, fr: { subject: "", body: "" }, de: { subject: "", body: "" } },
};

const PREVIEW_DATA: Record<EmailTemplateKind, Record<string, string>> = {
  enrollment: {
    "[student-first-name]": "Marie",
    "[student-last-name]": "Dupont",
    "[student-full-name]": "Marie Dupont",
    "[course-name]": "Allemand B1 - Conversation",
    "[course-start-date]": "Lundi, 14 septembre 2026",
    "[course-schedule-days]": "Lundi / Mercredi",
    "[course-schedule-time]": "18:00 - 20:00",
    "[course-price]": "299 EUR",
    "[payment-date]": "14 septembre 2026",
    "[platform-name]": "Online Deutschkurs mit Eliana",
  },
  cancellation: {
    "[student-first-name]": "Marie",
    "[student-last-name]": "Dupont",
    "[student-full-name]": "Marie Dupont",
    "[course-name]": "Allemand B1 - Conversation",
    "[course-start-date]": "Lundi, 14 septembre 2026",
    "[course-schedule-days]": "Lundi / Mercredi",
    "[course-schedule-time]": "18:00 - 20:00",
    "[course-price]": "299 EUR",
    "[payment-date]": "14 septembre 2026",
    "[platform-name]": "Online Deutschkurs mit Eliana",
  },
  payment: {
    "[student-first-name]": "Marie",
    "[student-last-name]": "Dupont",
    "[student-full-name]": "Marie Dupont",
    "[course-name]": "Allemand B1 - Conversation",
    "[course-start-date]": "Lundi, 14 septembre 2026",
    "[course-schedule-days]": "Lundi / Mercredi",
    "[course-schedule-time]": "18:00 - 20:00",
    "[course-price]": "299 EUR",
    "[payment-date]": "14 septembre 2026",
    "[platform-name]": "Online Deutschkurs mit Eliana",
  },
};

export default function AdminEmailTemplatePage() {
  const [templates, setTemplates] = useState<EmailTemplateStore>(EMPTY_TEMPLATES);
  const [tokens, setTokens] = useState<string[]>([]);
  const [activeKind, setActiveKind] = useState<EmailTemplateKind>("enrollment");
  const [activeLocale, setActiveLocale] = useState<Locale>("fr");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/email-template")
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        setTemplates(data.templates);
        setTokens(data.tokens);
      })
      .catch(() => setError("Impossible de charger les templates e-mail."))
      .finally(() => setLoading(false));
  }, []);

  const current = templates[activeKind][activeLocale];

  const preview = useMemo(() => {
    const values = PREVIEW_DATA[activeKind];
    const subject = current.subject;
    const body = current.body;
    const previewSubject = Object.entries(values).reduce((acc, [token, replacement]) => acc.replaceAll(token, replacement), subject);
    const previewBody = Object.entries(values).reduce((acc, [token, replacement]) => acc.replaceAll(token, replacement), body);
    return { previewSubject, previewBody };
  }, [activeKind, current.subject, current.body]);

  const updateField = (field: "subject" | "body", value: string) => {
    setTemplates((prev) => ({
      ...prev,
      [activeKind]: {
        ...prev[activeKind],
        [activeLocale]: {
          ...prev[activeKind][activeLocale],
          [field]: value,
        },
      },
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/email-template", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templates }),
    });

    const data = await res.json();
    if (res.ok) {
      setTemplates(data.templates);
      setMessage("Templates enregistres avec succes.");
    } else {
      setError(data.error ?? "Erreur lors de l'enregistrement.");
    }

    setSaving(false);
  };

  const resetToDefault = async () => {
    setResetting(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/email-template", { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      setTemplates(data.templates);
      setMessage("Templates reinitialises avec les valeurs par defaut.");
    } else {
      setError(data.error ?? "Erreur lors de la reinitialisation.");
    }

    setResetting(false);
  };

  const sendTestEmail = async () => {
    setTesting(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/email-template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: activeKind, locale: activeLocale, to: testEmail }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`Email test envoye a ${data.to}.`);
    } else {
      setError(data.error ?? "Erreur lors de l'envoi du test.");
    }

    setTesting(false);
  };

  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setMessage(`${token} copie dans le presse-papiers.`);
    } catch {
      setError("Impossible de copier le token.");
    }
  };

  if (loading) {
    return <div className="px-8 py-8 text-foreground/50">Chargement...</div>;
  }

  return (
    <div className="px-8 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-foreground">Personnalisation des e-mails</h1>
      <p className="mt-1 text-sm text-foreground/50">
        Personnalisez les emails d'inscription, d'annulation et de confirmation de paiement.
      </p>

      {message && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {EMAIL_TEMPLATE_KINDS.map((kind) => (
          <button
            key={kind}
            onClick={() => setActiveKind(kind)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeKind === kind ? "bg-accent text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
            }`}
          >
            {KIND_LABELS[kind]}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {LOCALES.map((locale) => (
          <button
            key={locale.code}
            onClick={() => setActiveLocale(locale.code)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeLocale === locale.code ? "bg-accent/90 text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
            }`}
          >
            {locale.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email-template-subject" className="mb-1.5 block text-sm font-medium text-foreground/70">Sujet</label>
              <input
                id="email-template-subject"
                value={current.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="Votre inscription est confirmee - [course-name]"
              />
            </div>

            <div>
              <label htmlFor="email-template-body" className="mb-1.5 block text-sm font-medium text-foreground/70">Contenu du mail</label>
              <textarea
                id="email-template-body"
                value={current.body}
                onChange={(e) => updateField("body", e.target.value)}
                rows={16}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                onClick={resetToDefault}
                disabled={resetting}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2.5 text-sm font-semibold text-foreground/70 transition-colors hover:bg-foreground/5 disabled:opacity-50"
              >
                <IconRefresh size={16} />
                {resetting ? "Reinitialisation..." : "Reinitialiser"}
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-ballet-slipper disabled:opacity-50"
              >
                <IconDeviceFloppy size={16} />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <IconInfoCircle size={16} className="text-accent" />
              Parametres disponibles
            </div>
            <p className="mb-3 text-xs text-foreground/50">
              Inserez ces tokens dans le sujet ou le contenu. Ils seront remplaces automatiquement.
            </p>
            <div className="mb-3 rounded-lg border border-foreground/10 bg-background p-3 text-xs text-foreground/60">
              <p>[course-name] : nom du cours</p>
              <p>[student-full-name] : prenom + nom etudiant</p>
              <p>[course-start-date] : date de debut formatee</p>
              <p>[payment-date] : date de confirmation du paiement</p>
            </div>
            <div className="space-y-2">
              {tokens.map((token) => (
                <button
                  key={token}
                  onClick={() => copyToken(token)}
                  className="flex w-full items-center justify-between rounded-lg border border-foreground/10 bg-background px-3 py-2 text-left text-xs text-foreground/70 hover:bg-foreground/5"
                  title="Cliquer pour copier"
                >
                  <span>{token}</span>
                  <IconCopy size={13} />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Apercu (exemple)</h3>
            <p className="mb-2 text-xs text-foreground/40">Sujet:</p>
            <p className="rounded-lg bg-background px-3 py-2 text-xs text-foreground/80">
              {preview.previewSubject}
            </p>
            <p className="mb-2 mt-3 text-xs text-foreground/40">Contenu:</p>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-background px-3 py-2 text-xs text-foreground/80">
              {preview.previewBody}
            </pre>
          </div>

          <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Envoyer un e-mail test</h3>
            <p className="mb-3 text-xs text-foreground/50">
              Laissez vide pour utiliser l'email de votre compte admin.
            </p>
            <input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="admin@exemple.com"
              className="mb-3 w-full rounded-xl border border-foreground/15 bg-background px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={sendTestEmail}
              disabled={testing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:bg-foreground/5 disabled:opacity-50"
            >
              <IconSend size={16} />
              {testing ? "Envoi en cours..." : "Envoyer test"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
