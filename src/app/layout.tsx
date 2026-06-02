import type { Metadata } from "next";
import { AcertoProvider } from "@/context/AcertoContext";
import { ConfiguracaoProvider } from "@/context/ConfiguracaoContext";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acerto de Colportagem",
  description: "Sistema de acerto para campanhas de colportagem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AcertoProvider>
          <ConfiguracaoProvider>
            <AppShell>{children}</AppShell>
          </ConfiguracaoProvider>
        </AcertoProvider>
      </body>
    </html>
  );
}
