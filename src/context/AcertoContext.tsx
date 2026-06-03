"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AcertoState, DadosImportados, ConfigCampanha } from "@/types/acerto";
import { CONFIG_INICIAL } from "@/types/acerto";

interface AcertoContextValue {
  state: AcertoState;
  setDadosImportados: (dados: DadosImportados) => void;
  setConfig: (config: Partial<ConfigCampanha>) => void;
  updateLiderPercentual: (idx: number, pct: number) => void;
  resetDados: () => void;
}

const AcertoContext = createContext<AcertoContextValue | null>(null);

export function AcertoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AcertoState>({
    dadosImportados: null,
    config: CONFIG_INICIAL,
  });

  const setDadosImportados = useCallback((dados: DadosImportados) => {
    setState((s) => ({ ...s, dadosImportados: dados }));
  }, []);

  const setConfig = useCallback((parcial: Partial<ConfigCampanha>) => {
    setState((s) => ({ ...s, config: { ...s.config, ...parcial } }));
  }, []);

  const updateLiderPercentual = useCallback((idx: number, pct: number) => {
    setState((s) => {
      const lideres = s.config.lideres.map((l, i) =>
        i === idx ? { ...l, percentualDebito: pct } : l
      ) as ConfigCampanha["lideres"];
      return { ...s, config: { ...s.config, lideres } };
    });
  }, []);

  const resetDados = useCallback(() => {
    setState((s) => ({ ...s, dadosImportados: null }));
  }, []);

  return (
    <AcertoContext.Provider value={{ state, setDadosImportados, setConfig, updateLiderPercentual, resetDados }}>
      {children}
    </AcertoContext.Provider>
  );
}

export function useAcerto() {
  const ctx = useContext(AcertoContext);
  if (!ctx) throw new Error("useAcerto deve ser usado dentro de AcertoProvider");
  return ctx;
}
