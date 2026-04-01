"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconBrandInstagram,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconMail,
} from "@tabler/icons-react";
import ContactModal from "@/app/components/ContactModal";
import { useLanguage } from "@/app/components/LanguageProvider";

const socialLinks = [
  { icon: IconBrandInstagram, href: "#", label: "Instagram" },
  { icon: IconBrandX, href: "#", label: "X (Twitter)" },
  { icon: IconBrandLinkedin, href: "#", label: "LinkedIn" },
  { icon: IconBrandYoutube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const { t } = useLanguage();

  const footerLinks = [
    {
      title: t("footer.about"),
      links: [
        { label: t("footer.aboutLink"), href: "#" },
        { label: t("footer.coursesLink"), href: "/courses" },
        { label: t("footer.faq"), href: "#" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), href: "#" },
        { label: t("footer.terms"), href: "#" },
        { label: t("footer.cookies"), href: "#" },
      ],
    },
  ];

  return (
    <>
      <footer className="border-t border-foreground/10 bg-peacock rounded-2xl m-10">
        <div className="mx-auto max-w-7xl px-8 py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Contact info + CTA */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-lg font-bold text-arctic">
                {t("footer.getInTouch")}
              </h3>

              {/* CTA — open contact modal */}
              <button
                onClick={() => setContactOpen(true)}
                className="flex items-center gap-2 rounded-full bg-ballet-slipper px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-bubblegum"
              >
                <IconMail size={16} />
                {t("footer.sendEmail")}
              </button>
            </div>

            {/* Footer link columns */}
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-bold text-arctic mb-4">
                  {group.title}
                </h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-arctic/50 font-semibold transition-colors hover:text-arctic"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 font-semibold border-t border-primary/10 pt-8 sm:flex-row">
            <p className="text-sm text-arctic/40">
              © {new Date().getFullYear()} Eli&apos;s Courses.{" "}
              {t("footer.rights")}
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full font-semibold text-arctic/40 transition-colors hover:bg-arctic/10 hover:text-arctic"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Contact modal */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
