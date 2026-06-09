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
import type { AcertoState, DadosImportados, ConfigCampanha } from "@/types/acerto";
import { CONFIG_INICIAL } from "@/types/acerto";
import { useAcertosManagerOptional } from "@/context/AcertosManagerContext";

interface AcertoContextValue {
  state: AcertoState;
  setDadosImportados: (dados: DadosImportados) => void;
  setConfig: (config: Partial<ConfigCampanha>) => void;
  updateLiderPercentual: (idx: number, pct: number) => void;
  resetDados: () => void;
}

const AcertoContext = createContext<AcertoContextValue | null>(null);

const ESTADO_INICIAL: AcertoState = { dadosImportados: null, config: CONFIG_INICIAL };

export function AcertoProvider({ children }: { children: ReactNode }) {
  const manager = useAcertosManagerOptional();
  const activeId = manager?.activeId ?? null;

  const [state, setState] = useState<AcertoState>(ESTADO_INICIAL);
  const lastActiveIdRef = useRef<string | null | undefined>(undefined);

  // Carrega estado quando o acerto ativo muda
  useEffect(() => {
    if (lastActiveIdRef.current === activeId) return;
    lastActiveIdRef.current = activeId;

    if (!activeId) {
      setState(ESTADO_INICIAL);
      return;
    }

    const saved = localStorage.getItem(`acerto_${activeId}_state`);
    if (saved) {
      try {
        setState(JSON.parse(saved));
        return;
      } catch {
        localStorage.removeItem(`acerto_${activeId}_state`);
      }
    }
    setState(ESTADO_INICIAL);
  }, [activeId]);

  // Auto-salva quando estado muda
  useEffect(() => {
    if (!activeId) return;
    localStorage.setItem(`acerto_${activeId}_state`, JSON.stringify(state));
  }, [state, activeId]);

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
    <AcertoContext.Provider
      value={{ state, setDadosImportados, setConfig, updateLiderPercentual, resetDados }}
    >
      {children}
    </AcertoContext.Provider>
  );
}

export function useAcerto() {
  const ctx = useContext(AcertoContext);
  if (!ctx) throw new Error("useAcerto deve ser usado dentro de AcertoProvider");
  return ctx;
}
