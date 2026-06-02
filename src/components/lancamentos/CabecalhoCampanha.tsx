"use client";

import React from "react";
import { useAcerto } from "@/context/AcertoContext";
import styles from "./CabecalhoCampanha.module.css";

export function CabecalhoCampanha() {
  const { state } = useAcerto();
  const { config } = state;

  const campanha =
    config.tipoCampanha === "Outro" ? config.tipoCampanhaOutro : config.tipoCampanha;
  const campo =
    config.campo === "Outro" ? config.campoOutro : config.campo;
  const lideres = config.lideres.filter((l) => l.nome.trim()).map((l) => l.nome);

  return (
    <section className={styles.cabecalho}>
      <dl className={styles.grid}>
        <div className={styles.item}>
          <dt className={styles.rotulo}>Campanha</dt>
          <dd className={styles.valor}>{campanha || "—"}</dd>
        </div>
        <div className={styles.item}>
          <dt className={styles.rotulo}>Subconta</dt>
          <dd className={styles.valor}>{config.subContaCampanha || "—"}</dd>
        </div>
        <div className={styles.item}>
          <dt className={styles.rotulo}>Departamento</dt>
          <dd className={styles.valor}>{config.departamento || "—"}</dd>
        </div>
        <div className={styles.item}>
          <dt className={styles.rotulo}>Campo</dt>
          <dd className={styles.valor}>{campo || "—"}</dd>
        </div>
        <div className={styles.item}>
          <dt className={styles.rotulo}>Caixa</dt>
          <dd className={styles.valor}>{config.caixa.nome || "—"}</dd>
        </div>
        <div className={styles.item}>
          <dt className={styles.rotulo}>Líderes</dt>
          <dd className={styles.valor}>
            {lideres.length > 0 ? lideres.join(" · ") : "—"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
