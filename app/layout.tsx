import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "SiagaAI – Sistem Peringatan Dini Banjir Berbasis AI",
  description:
    "SiagaAI adalah sistem peringatan dini banjir berbasis kecerdasan buatan untuk Indonesia. Pantau risiko banjir secara real-time dengan analisis prediktif dan rekomendasi mitigasi dari BNPB.",
  keywords: [
    "SiagaAI",
    "peringatan dini banjir",
    "early warning system",
    "AI flood prediction",
    "BNPB",
    "disaster mitigation",
    "Indonesia",
  ],
  authors: [{ name: "Tim Pijak × IBM SkillsBuild" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
