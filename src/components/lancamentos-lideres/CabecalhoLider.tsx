"use client";

import React from "react";
import { useAcerto } from "@/context/AcertoContext";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import styles from "./CabecalhoLider.module.css";

export function CabecalhoLider() {
  const { state } = useAcerto();
  const { config, dadosImportados } = state;

  const campanha =
    config.tipoCampanha === "Outro" ? config.tipoCampanhaOutro : config.tipoCampanha;
  const campo =
    config.campo === "Outro" ? config.campoOutro : config.campo;
  const lideres = config.lideres.filter(Boolean);

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
          <dd className={styles.valor}>{config.caixa || "—"}</dd>
        </div>
        <div className={styles.item}>
          <dt className={styles.rotulo}>Líderes</dt>
          <dd className={styles.valor}>
            {lideres.length > 0 ? lideres.join(" · ") : "—"}
          </dd>
        </div>
        <div className={`${styles.item} ${styles.destaque}`}>
          <dt className={styles.rotulo}>Compra Total</dt>
          <dd className={styles.valor}>
            {dadosImportados ? formatarBRL(dadosImportados.compraTotal) : "—"}
          </dd>
        </div>
        <div className={`${styles.item} ${styles.destaque}`}>
          <dt className={styles.rotulo}>Compra Bonificada</dt>
          <dd className={styles.valor}>
            {dadosImportados ? formatarBRL(dadosImportados.bonificado) : "—"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
