import type { Metadata } from "next";
import "./ui/globals.css";
import { poppins } from "@/app/ui/fonts";
import ThemeProvider from "@/app/components/ThemeProvider";
import LanguageProvider from "@/app/components/LanguageProvider";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

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
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
