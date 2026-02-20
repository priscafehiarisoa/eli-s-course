"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconBrandInstagram,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconMapPin,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import ContactModal from "@/app/components/ContactModal";

const socialLinks = [
  { icon: IconBrandInstagram, href: "#", label: "Instagram" },
  { icon: IconBrandX, href: "#", label: "X (Twitter)" },
  { icon: IconBrandLinkedin, href: "#", label: "LinkedIn" },
  { icon: IconBrandYoutube, href: "#", label: "YouTube" },
];

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Pricing", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-foreground/10 bg-peacock rounded-2xl m-10">
        <div className="mx-auto max-w-7xl px-8 py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Contact info + CTA */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-bold text-arctic">
                Get in touch
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm font-semibold text-arctic/60">
                  <IconMapPin size={18} className="mt-0.5 shrink-0 text-ballet-slipper" />
                  <span>
                    123 Learning Street
                    <br />
                    75001 Paris, France
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold text-arctic/60">
                  <IconPhone size={18} className="shrink-0 text-ballet-slipper" />
                  <span>+33 1 23 45 67 89</span>
                </div>
              </div>

              {/* CTA — open contact modal */}
              <button
                onClick={() => setContactOpen(true)}
                className="flex items-center gap-2 rounded-full bg-ballet-slipper px-5 py-2.5 text-sm font-semibold text-peacock shadow-sm transition-colors hover:bg-bubblegum"
              >
                <IconMail size={16} />
                Send us an email
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
              © {new Date().getFullYear()} Eli&apos;s Courses. All rights
              reserved.
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

