"use client";

import { useState } from "react";
import { IconX, IconSend } from "@tabler/icons-react";
import { useLanguage } from "@/app/components/LanguageProvider";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-peacock/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 rounded-2xl bg-background border border-foreground/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/10">
          <h2 className="text-lg font-semibold text-foreground">
            {t("contact.title")}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {t("contact.name")}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder={t("contact.namePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                {t("contact.email")}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder={t("contact.emailPlaceholder")}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5">
              {t("contact.subject")}
            </label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder={t("contact.subjectPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-1.5">
              {t("contact.message")}
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              placeholder={t("contact.messagePlaceholder")}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              {t("contact.cancel")}
            </button>
            <button
              type="submit"
              disabled={sending || sent}
              className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-background shadow-sm transition-colors hover:bg-ballet-slipper disabled:opacity-60"
            >
              {sent
                ? t("contact.sent")
                : sending
                ? t("contact.sending")
                : (
                  <>
                    <IconSend size={16} />
                    {t("contact.send")}
                  </>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
