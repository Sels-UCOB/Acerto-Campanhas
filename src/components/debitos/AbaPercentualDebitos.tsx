"use client";

import React from "react";
import { useAcerto } from "@/context/AcertoContext";
import { calcularPercentuaisProporcional } from "@/lib/calcularDebitos";
import styles from "./AbaPercentualDebitos.module.css";

export function AbaPercentualDebitos() {
  const { state, updateLiderPercentual, setConfig } = useAcerto();
  const numLideres = state.config.numLideres ?? 1;
  const lideres = Array.from({ length: numLideres }, (_, i) => state.config.lideres[i]).filter(
    (l) => l.nome.trim()
  );

  if (lideres.length === 0) {
    return <p className={styles.vazio}>Nenhum líder configurado.</p>;
  }

  const soma = lideres.reduce((s, l) => s + (l.percentualDebito ?? 0), 0);
  const somaErro = Math.abs(soma - 100) > 0.01;

  function handleProporcional() {
    const proporcional = calcularPercentuaisProporcional(state.config.lideres, numLideres);
    const novasLideres = state.config.lideres.map((l, i) =>
      i < numLideres ? { ...l, percentualDebito: proporcional[i] } : l
    ) as typeof state.config.lideres;
    setConfig({ lideres: novasLideres });
  }

  return (
    <div className={styles.container}>
      <div className={styles.linhaHeader}>
        <span>Líder</span>
        <span className={styles.colPct}>%</span>
      </div>

      {lideres.map((lider, idx) => (
        <div key={lider.nome} className={styles.linha}>
          <span className={styles.nome} title={lider.nome}>
            {lider.nome}
          </span>
          <input
            type="number"
            className={styles.inputPct}
            min={0}
            max={100}
            step="0.1"
            value={lider.percentualDebito ?? 0}
            onChange={(e) =>
              updateLiderPercentual(idx, parseFloat(e.target.value) || 0)
            }
          />
        </div>
      ))}

      <div className={styles.somaLinha}>
        <span>Soma</span>
        <span className={somaErro ? styles.somaErro : styles.somaOk}>
          {soma.toFixed(2)}%
        </span>
      </div>

      {somaErro && (
        <p className={styles.avisoSoma}>A soma deve ser 100%.</p>
      )}

      <button
        type="button"
        style={{
          marginTop: "0.5rem",
          width: "100%",
          height: "1.9rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          fontFamily: "inherit",
          cursor: "pointer",
          border: "1px solid var(--borda)",
          borderRadius: "6px",
          background: "var(--fundo-alt)",
          color: "var(--texto-secundario)",
          transition: "background 0.15s",
        }}
        onClick={handleProporcional}
      >
        Calcular proporcional
      </button>
    </div>
  );
}
