"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CartaBolsa } from "@/types/lancamentoLider";

interface LancamentoLiderContextValue {
  cartaBolsa: CartaBolsa;
  jurosCampanha: number | null;
  updateCartaBolsa: (parcial: Partial<CartaBolsa>) => void;
  setJurosCampanha: (v: number | null) => void;
}

const LancamentoLiderContext =
  createContext<LancamentoLiderContextValue | null>(null);

export function LancamentoLiderProvider({ children }: { children: ReactNode }) {
  const [cartaBolsa, setCartaBolsa] = useState<CartaBolsa>({
    valor: 0,
    liderReceptor: "",
  });
  const [jurosCampanha, setJurosCampanha] = useState<number | null>(null);

  const updateCartaBolsa = useCallback((parcial: Partial<CartaBolsa>) => {
    setCartaBolsa((prev) => ({ ...prev, ...parcial }));
  }, []);

  return (
    <LancamentoLiderContext.Provider
      value={{
        cartaBolsa,
        jurosCampanha,
        updateCartaBolsa,
        setJurosCampanha,
      }}
    >
      {children}
    </LancamentoLiderContext.Provider>
  );
}

export function useLancamentoLider() {
  const ctx = useContext(LancamentoLiderContext);
  if (!ctx)
    throw new Error(
      "useLancamentoLider deve ser usado dentro de LancamentoLiderProvider"
    );
  return ctx;
}
