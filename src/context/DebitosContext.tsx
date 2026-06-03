"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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
  gastosCaixa: GastosLider;
  setGastosCaixa: (gastos: number) => void;
  addDebitoAdicionalCaixa: () => void;
  updateDebitoAdicionalCaixa: (id: string, parcial: Partial<Omit<DebitoAdicional, "id">>) => void;
  removeDebitoAdicionalCaixa: (id: string) => void;
  salvar: () => void;
}

const DebitosContext = createContext<DebitosContextValue | null>(null);

const STORAGE_KEY = "acerto_debitos_v1";

let _seq = 5000;
const genId = () => `d${_seq++}`;

const GASTOS_VAZIO: GastosLider = { gastos: 0, debitosAdicionais: [] };
const GASTOS_LIDERES_VAZIO: GastosLider[] = [
  { ...GASTOS_VAZIO },
  { ...GASTOS_VAZIO },
  { ...GASTOS_VAZIO },
  { ...GASTOS_VAZIO },
];

export function DebitosProvider({ children }: { children: ReactNode }) {
  const { state } = useAcerto();

  const [devedores, setDevedores] = useState<DevedorColportor[]>([]);
  const [gastosLideres, setGastosLideresState] = useState<GastosLider[]>(
    GASTOS_LIDERES_VAZIO.map((g) => ({ ...g, debitosAdicionais: [] }))
  );
  const [gastosCaixa, setGastosCaixaState] = useState<GastosLider>({ ...GASTOS_VAZIO });
  const [pronto, setPronto] = useState(false);

  // Ref para detectar troca de relatório (referência de objeto muda no novo import)
  const dadosRef = useRef(state.dadosImportados);

  // --- Carrega do localStorage no primeiro mount ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (Array.isArray(data.devedores)) setDevedores(data.devedores);
        if (Array.isArray(data.gastosLideres)) setGastosLideresState(data.gastosLideres);
        if (data.gastosCaixa) setGastosCaixaState(data.gastosCaixa);
        setPronto(true);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Sem localStorage: inicializa pelo import atual se disponível
    if (state.dadosImportados) {
      const init = buildDevedores(state.dadosImportados.nomes, state.dadosImportados.saldos);
      setDevedores(init);
    }
    setPronto(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // só no mount

  // --- Detecta novo relatório importado e reseta tudo ---
  useEffect(() => {
    if (!pronto) return;
    if (!state.dadosImportados) return;
    if (state.dadosImportados === dadosRef.current) return;

    dadosRef.current = state.dadosImportados;
    localStorage.removeItem(STORAGE_KEY);

    const init = buildDevedores(state.dadosImportados.nomes, state.dadosImportados.saldos);
    setDevedores(init);
    setGastosLideresState(GASTOS_LIDERES_VAZIO.map((g) => ({ ...g, debitosAdicionais: [] })));
    setGastosCaixaState({ ...GASTOS_VAZIO });
  }, [state.dadosImportados, pronto]);

  // --- Auto-salva no localStorage a cada mudança ---
  useEffect(() => {
    if (!pronto) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ devedores, gastosLideres, gastosCaixa })
    );
  }, [devedores, gastosLideres, gastosCaixa, pronto]);

  // --- Helpers ---
  function buildDevedores(nomes: string[], saldos: number[]): DevedorColportor[] {
    const result: DevedorColportor[] = [];
    nomes.forEach((nome, i) => {
      if (saldos[i] < 0) {
        result.push({ id: genId(), nome, valorDebito: Math.abs(saldos[i]) });
      }
    });
    return result;
  }

  const salvar = useCallback(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ devedores, gastosLideres, gastosCaixa })
    );
  }, [devedores, gastosLideres, gastosCaixa]);

  // --- Devedores ---
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

  // --- Gastos líderes ---
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

  // --- Gastos caixa ---
  const setGastosCaixa = useCallback((gastos: number) => {
    setGastosCaixaState((prev) => ({ ...prev, gastos }));
  }, []);

  const addDebitoAdicionalCaixa = useCallback(() => {
    setGastosCaixaState((prev) => ({
      ...prev,
      debitosAdicionais: [...prev.debitosAdicionais, { id: genId(), descricao: "", valor: 0 }],
    }));
  }, []);

  const updateDebitoAdicionalCaixa = useCallback(
    (id: string, parcial: Partial<Omit<DebitoAdicional, "id">>) => {
      setGastosCaixaState((prev) => ({
        ...prev,
        debitosAdicionais: prev.debitosAdicionais.map((d) =>
          d.id === id ? { ...d, ...parcial } : d
        ),
      }));
    },
    []
  );

  const removeDebitoAdicionalCaixa = useCallback((id: string) => {
    setGastosCaixaState((prev) => ({
      ...prev,
      debitosAdicionais: prev.debitosAdicionais.filter((d) => d.id !== id),
    }));
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
        gastosCaixa,
        setGastosCaixa,
        addDebitoAdicionalCaixa,
        updateDebitoAdicionalCaixa,
        removeDebitoAdicionalCaixa,
        salvar,
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
