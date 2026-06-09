"use client";

import React, { useState, useEffect } from "react";
import type { AcertoMeta, CriarAcertoData } from "@/types/acertoManager";
import styles from "./ModalCriarAcerto.module.css";

const CAMPOS = ["ALM", "AOM", "ASM", "ABC", "APLAC", "MTO", "IDEC", "Outro"] as const;
const TIPOS_CAMPANHA = [
  "Sonhando Alto 1",
  "Sonhando Alto 2",
  "Verão",
  "Inverno",
  "Outro",
] as const;

interface Props {
  onClose: () => void;
  onSalvar: (data: CriarAcertoData) => void;
  dadosIniciais?: Pick<AcertoMeta, "nome" | "campo" | "tipoCampanha">;
  modoEdicao?: boolean;
}

export function ModalCriarAcerto({ onClose, onSalvar, dadosIniciais, modoEdicao }: Props) {
  const [nome, setNome] = useState(dadosIniciais?.nome ?? "");
  const [campo, setCampo] = useState(dadosIniciais?.campo ?? "AOM");
  const [tipoCampanha, setTipoCampanha] = useState(
    dadosIniciais?.tipoCampanha ?? "Sonhando Alto 1"
  );

  // Fecha ao pressionar Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onSalvar({ nome: nome.trim(), campo, tipoCampanha });
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <h2 className={styles.titulo}>
          {modoEdicao ? "Editar Acerto" : "Novo Acerto"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.campos}>
          <div className={styles.campo}>
            <label htmlFor="acerto-nome">Nome / Identificador</label>
            <input
              id="acerto-nome"
              type="text"
              placeholder="Ex: Sonhando Alto 1 — AOM 2026"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="acerto-campo">Campo</label>
            <select
              id="acerto-campo"
              value={campo}
              onChange={(e) => setCampo(e.target.value)}
            >
              {CAMPOS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.campo}>
            <label htmlFor="acerto-tipo">Tipo de Campanha</label>
            <select
              id="acerto-tipo"
              value={tipoCampanha}
              onChange={(e) => setTipoCampanha(e.target.value)}
            >
              {TIPOS_CAMPANHA.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className={styles.acoes}>
          <button type="button" className={styles.btnCancelar} onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.btnSalvar}
            disabled={!nome.trim()}
            onClick={handleSubmit as unknown as React.MouseEventHandler}
          >
            {modoEdicao ? "Salvar" : "Criar Acerto"}
          </button>
        </div>
      </div>
    </div>
  );
}
