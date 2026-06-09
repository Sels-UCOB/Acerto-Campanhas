"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { CartaBolsa } from "@/types/lancamentoLider";
import { useAcertosManagerOptional } from "@/context/AcertosManagerContext";

interface LancamentoLiderContextValue {
  cartaBolsa: CartaBolsa;
  jurosCampanha: number | null;
  updateCartaBolsa: (parcial: Partial<CartaBolsa>) => void;
  setJurosCampanha: (v: number | null) => void;
}

const LancamentoLiderContext =
  createContext<LancamentoLiderContextValue | null>(null);

const CARTA_INICIAL: CartaBolsa = { valor: 0, liderReceptor: "" };

export function LancamentoLiderProvider({ children }: { children: ReactNode }) {
  const manager = useAcertosManagerOptional();
  const activeId = manager?.activeId ?? null;

  const [cartaBolsa, setCartaBolsa] = useState<CartaBolsa>(CARTA_INICIAL);
  const [jurosCampanha, setJurosCampanhaState] = useState<number | null>(null);
  const lastActiveIdRef = useRef<string | null | undefined>(undefined);

  // Carrega/reseta quando o acerto ativo muda
  useEffect(() => {
    if (lastActiveIdRef.current === activeId) return;
    lastActiveIdRef.current = activeId;

    if (activeId) {
      const saved = localStorage.getItem(`acerto_${activeId}_lider`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.cartaBolsa) setCartaBolsa(data.cartaBolsa);
          setJurosCampanhaState(data.jurosCampanha ?? null);
          return;
        } catch {
          localStorage.removeItem(`acerto_${activeId}_lider`);
        }
      }
    }
    setCartaBolsa(CARTA_INICIAL);
    setJurosCampanhaState(null);
  }, [activeId]);

  // Auto-salva
  useEffect(() => {
    if (!activeId) return;
    localStorage.setItem(
      `acerto_${activeId}_lider`,
      JSON.stringify({ cartaBolsa, jurosCampanha })
    );
  }, [cartaBolsa, jurosCampanha, activeId]);

  const updateCartaBolsa = useCallback((parcial: Partial<CartaBolsa>) => {
    setCartaBolsa((prev) => ({ ...prev, ...parcial }));
  }, []);

  return (
    <LancamentoLiderContext.Provider
      value={{
        cartaBolsa,
        jurosCampanha,
        updateCartaBolsa,
        setJurosCampanha: setJurosCampanhaState,
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
