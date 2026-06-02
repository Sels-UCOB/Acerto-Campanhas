"use client";

import React, { useState, useEffect } from "react";
import { useConfiguracao } from "@/context/ConfiguracaoContext";
import { useAcerto } from "@/context/AcertoContext";
import type { TipoLancamento } from "@/types/configuracao";
import styles from "./NovoTipoModal.module.css";

interface Props {
  onSalvar: (id: string) => void;
  onFechar: () => void;
}

const VAZIO: Omit<TipoLancamento, "id"> = {
  nome: "",
  conta: "",
  subconta: "",
  departamento: "",
};

export function NovoTipoModal({ onSalvar, onFechar }: Props) {
  const { tipos, addTipo } = useConfiguracao();
  const { state } = useAcerto();
  const departamentoCampanha = state.config.departamento;
  const [form, setForm] = useState(VAZIO);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!salvando || tipos.length === 0) return;
    const novoTipo = tipos[tipos.length - 1];
    onSalvar(novoTipo.id);
  }, [tipos, salvando, onSalvar]);

  const podeSubmeter =
    form.nome.trim() !== "" &&
    form.conta.trim() !== "" &&
    form.departamento.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podeSubmeter) return;
    addTipo(form);
    setSalvando(true);
  };

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cabecalho}>
          <h2 className={styles.titulo}>Novo Tipo de Lançamento</h2>
          <button
            type="button"
            className={styles.btnFechar}
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.grupo}>
            <label className={styles.label}>Nome *</label>
            <input
              className={styles.input}
              placeholder="Nome do tipo"
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
              autoFocus
            />
          </div>
          <div className={styles.grupo}>
            <label className={styles.label}>Conta *</label>
            <input
              className={styles.input}
              placeholder="Código da conta"
              value={form.conta}
              onChange={(e) => {
                const conta = e.target.value;
                setForm((p) => ({
                  ...p,
                  conta,
                  ...(conta.startsWith("4") && departamentoCampanha
                    ? { departamento: departamentoCampanha }
                    : {}),
                }));
              }}
            />
          </div>
          <div className={styles.grupo}>
            <label className={styles.label}>Subconta</label>
            <input
              className={styles.input}
              placeholder="Código da subconta (opcional)"
              value={form.subconta}
              onChange={(e) =>
                setForm((p) => ({ ...p, subconta: e.target.value }))
              }
            />
          </div>
          <div className={styles.grupo}>
            <label className={styles.label}>Departamento *</label>
            <input
              className={styles.input}
              placeholder="Nome do departamento"
              value={form.departamento}
              onChange={(e) =>
                setForm((p) => ({ ...p, departamento: e.target.value }))
              }
            />
          </div>

          <div className={styles.acoes}>
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={onFechar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.btnSalvar}
              disabled={!podeSubmeter}
            >
              Salvar Tipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
