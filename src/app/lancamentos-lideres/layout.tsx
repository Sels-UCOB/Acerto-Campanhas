"use client";

import { DebitosProvider } from "@/context/DebitosContext";

export default function LancamentosLideresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DebitosProvider>{children}</DebitosProvider>;
}
