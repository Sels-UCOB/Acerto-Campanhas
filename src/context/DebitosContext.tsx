"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { DevedorColportor, GastosLider, DebitoAdicional } from "@/types/debitos";
import { useAcerto } from "@/context/AcertoContext";

interface DebitosContextValue {
  devedores: DevedorColportor[];
  addDevedor: () => void;
  updateDevedor: (id: string, parcial: Partial<Omit<DevedorColportor, "id">>) => void;
  removeDevedor: (id: string) => void;
  gastosLideres: GastosLider[];
  setGastosLider: (idx: number, gastos: number) => void;
  addDebitoAdicional: (liderIdx: number) => void;
  updateDebitoAdicional: (
    liderIdx: number,
    id: string,
    parcial: Partial<Omit<DebitoAdicional, "id">>
  ) => void;
  removeDebitoAdicional: (liderIdx: number, id: string) => void;
}

const DebitosContext = createContext<DebitosContextValue | null>(null);

let _seq = 5000;
const genId = () => `d${_seq++}`;

const GASTOS_VAZIO: GastosLider = { gastos: 0, debitosAdicionais: [] };

export function DebitosProvider({ children }: { children: ReactNode }) {
  const { state } = useAcerto();
  const [devedores, setDevedores] = useState<DevedorColportor[]>([]);
  const [devedoresInit, setDevedoresInit] = useState(false);
  const [gastosLideres, setGastosLideresState] = useState<GastosLider[]>([
    { ...GASTOS_VAZIO },
    { ...GASTOS_VAZIO },
    { ...GASTOS_VAZIO },
    { ...GASTOS_VAZIO },
  ]);

  useEffect(() => {
    if (devedoresInit || !state.dadosImportados) return;
    const { nomes, saldos } = state.dadosImportados;
    const init: DevedorColportor[] = [];
    nomes.forEach((nome, i) => {
      if (saldos[i] < 0) {
        init.push({ id: genId(), nome, valorDebito: Math.abs(saldos[i]) });
      }
    });
    setDevedores(init);
    setDevedoresInit(true);
  }, [devedoresInit, state.dadosImportados]);

  const addDevedor = useCallback(() => {
    setDevedores((prev) => [...prev, { id: genId(), nome: "", valorDebito: 0 }]);
  }, []);

  const updateDevedor = useCallback(
    (id: string, parcial: Partial<Omit<DevedorColportor, "id">>) => {
      setDevedores((prev) => prev.map((d) => (d.id === id ? { ...d, ...parcial } : d)));
    },
    []
  );

  const removeDevedor = useCallback((id: string) => {
    setDevedores((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const setGastosLider = useCallback((idx: number, gastos: number) => {
    setGastosLideresState((prev) => {
      const next = prev.map((g) => ({ ...g, debitosAdicionais: [...g.debitosAdicionais] }));
      next[idx] = { ...next[idx], gastos };
      return next;
    });
  }, []);

  const addDebitoAdicional = useCallback((liderIdx: number) => {
    setGastosLideresState((prev) => {
      const next = prev.map((g) => ({ ...g, debitosAdicionais: [...g.debitosAdicionais] }));
      next[liderIdx].debitosAdicionais.push({ id: genId(), descricao: "", valor: 0 });
      return next;
    });
  }, []);

  const updateDebitoAdicional = useCallback(
    (liderIdx: number, id: string, parcial: Partial<Omit<DebitoAdicional, "id">>) => {
      setGastosLideresState((prev) =>
        prev.map((g, gi) =>
          gi !== liderIdx
            ? g
            : {
                ...g,
                debitosAdicionais: g.debitosAdicionais.map((d) =>
                  d.id === id ? { ...d, ...parcial } : d
                ),
              }
        )
      );
    },
    []
  );

  const removeDebitoAdicional = useCallback((liderIdx: number, id: string) => {
    setGastosLideresState((prev) =>
      prev.map((g, gi) =>
        gi !== liderIdx
          ? g
          : { ...g, debitosAdicionais: g.debitosAdicionais.filter((d) => d.id !== id) }
      )
    );
  }, []);

  return (
    <DebitosContext.Provider
      value={{
        devedores,
        addDevedor,
        updateDevedor,
        removeDevedor,
        gastosLideres,
        setGastosLider,
        addDebitoAdicional,
        updateDebitoAdicional,
        removeDebitoAdicional,
      }}
    >
      {children}
    </DebitosContext.Provider>
  );
}

export function useDebitos() {
  const ctx = useContext(DebitosContext);
  if (!ctx) throw new Error("useDebitos deve ser usado dentro de DebitosProvider");
  return ctx;
}
