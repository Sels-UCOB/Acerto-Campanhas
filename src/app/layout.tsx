import type { Metadata } from "next";
import { AcertoProvider } from "@/context/AcertoContext";
import { ConfiguracaoProvider } from "@/context/ConfiguracaoContext";
import { LancamentoProvider } from "@/context/LancamentoContext";
import { LancamentoLiderProvider } from "@/context/LancamentoLiderContext";
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
            <LancamentoProvider>
              <LancamentoLiderProvider>
                <AppShell>{children}</AppShell>
              </LancamentoLiderProvider>
            </LancamentoProvider>
          </ConfiguracaoProvider>
        </AcertoProvider>
      </body>
    </html>
  );
}
