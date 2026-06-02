import React from "react";
import { LancamentoProvider } from "@/context/LancamentoContext";

export default function LancamentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LancamentoProvider>{children}</LancamentoProvider>;
}
