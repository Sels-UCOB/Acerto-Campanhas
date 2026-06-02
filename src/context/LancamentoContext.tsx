"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Lancamento } from "@/types/lancamento";
import { useAcerto } from "@/context/AcertoContext";
import { useConfiguracao } from "@/context/ConfiguracaoContext";

interface LancamentoContextValue {
  lancamentos: Lancamento[];
  addLancamento: () => void;
  updateLancamento: (id: string, parcial: Partial<Omit<Lancamento, "id">>) => void;
  removeLancamento: (id: string) => void;
}

const LancamentoContext = createContext<LancamentoContextValue | null>(null);

let _seq = 3000;
const genId = () => `l${_seq++}`;

export function LancamentoProvider({ children }: { children: ReactNode }) {
  const { state } = useAcerto();
  const { tipos } = useConfiguracao();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [inicializado, setInicializado] = useState(false);

  useEffect(() => {
    if (inicializado) return;

    const tipoLucro = tipos.find((t) => t.nome === "Lucro");
    const dados = state.dadosImportados;

    const linhas: Lancamento[] = [
      {
        id: genId(),
        tipoLancamentoId: "",
        historico: "",
        valor: null,
        saldoManual: 0,
      },
    ];

    if (dados) {
      dados.nomes.forEach((nome, idx) => {
        if (dados.saldos[idx] > 0) {
          linhas.push({
            id: genId(),
            tipoLancamentoId: tipoLucro?.id ?? "",
            historico: nome,
            valor: dados.saldos[idx],
            saldoManual: null,
          });
        }
      });
      // Só trava a inicialização quando os dados já foram importados.
      // Enquanto dadosImportados for null o efeito re-executa na próxima
      // mudança, garantindo que os colportores sejam pré-preenchidos.
      setInicializado(true);
    }

    setLancamentos(linhas);
  }, [inicializado, state.dadosImportados, tipos]);

  const addLancamento = useCallback(() => {
    setLancamentos((prev) => [
      ...prev,
      {
        id: genId(),
        tipoLancamentoId: "",
        historico: "",
        valor: null,
        saldoManual: null,
      },
    ]);
  }, []);

  const updateLancamento = useCallback(
    (id: string, parcial: Partial<Omit<Lancamento, "id">>) => {
      setLancamentos((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...parcial } : l))
      );
    },
    []
  );

  const removeLancamento = useCallback((id: string) => {
    setLancamentos((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === 0) return prev;
      return prev.filter((l) => l.id !== id);
    });
  }, []);

  return (
    <LancamentoContext.Provider
      value={{ lancamentos, addLancamento, updateLancamento, removeLancamento }}
    >
      {children}
    </LancamentoContext.Provider>
  );
}

export function useLancamento() {
  const ctx = useContext(LancamentoContext);
  if (!ctx) throw new Error("useLancamento deve ser usado dentro de LancamentoProvider");
  return ctx;
}
