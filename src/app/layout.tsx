import type { Metadata } from "next";
import "./ui/globals.css";
import { poppins } from "@/app/ui/fonts";
import ThemeProvider from "@/app/components/ThemeProvider";
import LanguageProvider from "@/app/components/LanguageProvider";

export const metadata: Metadata = {
  title: "Online Deutschkurs mit Eliana",
  description: "Online Deutschkurs mit Eliana",
  icons: {
    apple: "/logo/logo.png", // ou "/logo/votre-logo.png"
  },
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
