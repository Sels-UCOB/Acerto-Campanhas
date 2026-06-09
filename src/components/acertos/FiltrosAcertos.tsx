"use client";

import React from "react";
import type { FiltrosAcerto } from "@/types/acertoManager";
import styles from "./FiltrosAcertos.module.css";

const CAMPOS = ["todos", "ALM", "AOM", "ASM", "ABC", "APLAC", "MTO", "IDEC", "Outro"] as const;
const TIPOS = [
  "todos",
  "Sonhando Alto 1",
  "Sonhando Alto 2",
  "Verão",
  "Inverno",
  "Outro",
] as const;
const STATUS = ["todos", "Criado", "Em Aberto", "Encerrado"] as const;

interface Props {
  filtros: FiltrosAcerto;
  onChange: (filtros: FiltrosAcerto) => void;
}

const FILTROS_LIMPOS: FiltrosAcerto = {
  status: "todos",
  campo: "todos",
  tipoCampanha: "todos",
  dataInicio: "",
  dataFim: "",
};

export function FiltrosAcertos({ filtros, onChange }: Props) {
  const set = <K extends keyof FiltrosAcerto>(key: K, value: FiltrosAcerto[K]) =>
    onChange({ ...filtros, [key]: value });

  const sujo = Object.values(filtros).some((v) => v !== "todos" && v !== "");

  return (
    <div className={styles.barra}>
      <div className={styles.grupo}>
        <label className={styles.label}>Status</label>
        <select
          className={styles.select}
          value={filtros.status}
          onChange={(e) => set("status", e.target.value as FiltrosAcerto["status"])}
        >
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s === "todos" ? "Todos os status" : s}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grupo}>
        <label className={styles.label}>Campo</label>
        <select
          className={styles.select}
          value={filtros.campo}
          onChange={(e) => set("campo", e.target.value)}
        >
          {CAMPOS.map((c) => (
            <option key={c} value={c}>
              {c === "todos" ? "Todos os campos" : c}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grupo}>
        <label className={styles.label}>Tipo de Campanha</label>
        <select
          className={styles.select}
          value={filtros.tipoCampanha}
          onChange={(e) => set("tipoCampanha", e.target.value)}
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {t === "todos" ? "Todos os tipos" : t}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grupo}>
        <label className={styles.label}>De</label>
        <input
          type="date"
          className={styles.input}
          value={filtros.dataInicio}
          onChange={(e) => set("dataInicio", e.target.value)}
        />
      </div>

      <div className={styles.grupo}>
        <label className={styles.label}>Até</label>
        <input
          type="date"
          className={styles.input}
          value={filtros.dataFim}
          onChange={(e) => set("dataFim", e.target.value)}
        />
      </div>

      {sujo && (
        <button
          type="button"
          className={styles.btnLimpar}
          onClick={() => onChange(FILTROS_LIMPOS)}
        >
          Limpar
        </button>
      )}
    </div>
  );
}
