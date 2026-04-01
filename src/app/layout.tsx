import type { Metadata } from "next";
import "./ui/globals.css";
import { poppins } from "@/app/ui/fonts";
import ThemeProvider from "@/app/components/ThemeProvider";
import LanguageProvider from "@/app/components/LanguageProvider";

export const metadata: Metadata = {
  title: "Eli's courses",
  description: "Eli's courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Force light mode — remove any stored dark theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.documentElement.classList.remove('dark');
              try { localStorage.removeItem('theme'); } catch(e) {}
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
