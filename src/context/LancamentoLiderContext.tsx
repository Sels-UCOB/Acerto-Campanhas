"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAcerto } from "@/context/AcertoContext";
import type { ConfigLider, CartaBolsa } from "@/types/lancamentoLider";

interface LancamentoLiderContextValue {
  configs: ConfigLider[];
  cartaBolsa: CartaBolsa;
  jurosCampanha: number | null;
  salarioCaixa: number | null;
  updateConfig: (nome: string, parcial: Partial<Omit<ConfigLider, "nome">>) => void;
  updateCartaBolsa: (parcial: Partial<CartaBolsa>) => void;
  setJurosCampanha: (v: number | null) => void;
  setSalarioCaixa: (v: number | null) => void;
}

const LancamentoLiderContext =
  createContext<LancamentoLiderContextValue | null>(null);

export function LancamentoLiderProvider({ children }: { children: ReactNode }) {
  const { state } = useAcerto();
  const [configs, setConfigs] = useState<ConfigLider[]>([]);
  const [inicializado, setInicializado] = useState(false);
  const [cartaBolsa, setCartaBolsa] = useState<CartaBolsa>({
    valor: 0,
    liderReceptor: "",
  });
  const [jurosCampanha, setJurosCampanha] = useState<number | null>(null);
  const [salarioCaixa, setSalarioCaixa] = useState<number | null>(null);

  useEffect(() => {
    if (inicializado) return;
    const lideres = state.config.lideres.filter(Boolean);
    if (lideres.length === 0) return;
    setConfigs(
      lideres.map((nome) => ({
        nome,
        bonificacaoPercentual: 0,
        auxilioPercentual: 0,
      }))
    );
    setInicializado(true);
  }, [inicializado, state.config.lideres]);

  const updateConfig = useCallback(
    (nome: string, parcial: Partial<Omit<ConfigLider, "nome">>) => {
      setConfigs((prev) =>
        prev.map((c) => (c.nome === nome ? { ...c, ...parcial } : c))
      );
    },
    []
  );

  const updateCartaBolsa = useCallback((parcial: Partial<CartaBolsa>) => {
    setCartaBolsa((prev) => ({ ...prev, ...parcial }));
  }, []);

  return (
    <LancamentoLiderContext.Provider
      value={{
        configs,
        cartaBolsa,
        jurosCampanha,
        salarioCaixa,
        updateConfig,
        updateCartaBolsa,
        setJurosCampanha,
        setSalarioCaixa,
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
