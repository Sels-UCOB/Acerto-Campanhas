"use client";

import React, { useState, useCallback } from "react";
import { useAcerto } from "@/context/AcertoContext";
import { useLancamento } from "@/context/LancamentoContext";
import { useLancamentoLider } from "@/context/LancamentoLiderContext";
import { useDebitos } from "@/context/DebitosContext";
import { useConfiguracao } from "@/context/ConfiguracaoContext";
import { gerarCSVContabil } from "@/lib/gerarCSVContabil";
import styles from "./BotaoGerarCSV.module.css";

interface Pendencia {
  nome: string;
  falta: string;
}

export function BotaoGerarCSV() {
  const { state } = useAcerto();
  const { lancamentos } = useLancamento();
  const { cartaBolsa, jurosCampanha } = useLancamentoLider();
  const { devedores, gastosLideres, gastosCaixa } = useDebitos();
  const { tipos, campos, lideres: lideresConfig } = useConfiguracao();

  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const handleGerar = useCallback(() => {
    setErroGeral(null);

    if (!state.dadosImportados) {
      setErroGeral("Importe um relatório antes de gerar o CSV.");
      return;
    }

    if (!state.config.subContaCampanha.trim()) {
      setErroGeral("Subconta da campanha não está configurada. Acesse a aba Configuração.");
      return;
    }

    // Valida subconta de cada líder ativo
    const numLideres = state.config.numLideres;
    const lcMap = new Map(lideresConfig.map((l) => [l.nome, l]));
    const faltando: Pendencia[] = [];

    for (let i = 0; i < numLideres; i++) {
      const lider = state.config.lideres[i];
      if (!lider.nome.trim()) continue;
      const lc = lcMap.get(lider.nome);
      const problemas: string[] = [];
      if (!lc || !lc.subcontaLider.trim()) problemas.push("Subconta Líder");
      if (!lc || !lc.subcontaLucro.trim()) problemas.push("Subconta Lucro");
      if (problemas.length > 0) {
        faltando.push({ nome: lider.nome, falta: problemas.join(" e ") });
      }
    }

    if (faltando.length > 0) {
      setPendencias(faltando);
      return;
    }

    const csv = gerarCSVContabil({
      lancamentos,
      tipos,
      lideresConfig,
      campos,
      config: state.config,
      cartaBolsa,
      jurosCampanha,
      devedores,
      gastosLideres,
      gastosCaixa,
      dadosImportados: state.dadosImportados,
    });

    // BOM UTF-8 garante acentuação no Excel
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const campanha =
      state.config.tipoCampanha === "Outro"
        ? state.config.tipoCampanhaOutro
        : state.config.tipoCampanha;
    const campo =
      state.config.campo === "Outro" ? state.config.campoOutro : state.config.campo;
    a.download = `acerto_${campanha}_${campo}_${new Date().getFullYear()}.csv`.replace(/\s+/g, "_");
    a.click();
    URL.revokeObjectURL(url);
  }, [state, lancamentos, tipos, lideresConfig, cartaBolsa, jurosCampanha, devedores, gastosLideres, gastosCaixa]);

  return (
    <>
      <button type="button" className={styles.btn} onClick={handleGerar}>
        Gerar CSV Contábil
      </button>

      {/* Popup: erro geral */}
      {erroGeral && (
        <div className={styles.overlay} onClick={() => setErroGeral(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Não foi possível gerar o CSV</h3>
            <p className={styles.modalDesc}>{erroGeral}</p>
            <button
              type="button"
              className={styles.btnFechar}
              onClick={() => setErroGeral(null)}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Popup: subcontas faltando */}
      {pendencias.length > 0 && (
        <div className={styles.overlay} onClick={() => setPendencias([])}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitulo}>Subcontas não cadastradas</h3>
            <p className={styles.modalDesc}>
              Configure as subcontas dos líderes abaixo em{" "}
              <strong>Configurações → Líderes</strong> antes de gerar o CSV:
            </p>
            <ul className={styles.lista}>
              {pendencias.map((p) => (
                <li key={p.nome} className={styles.item}>
                  <span className={styles.itemNome}>{p.nome}</span>
                  <span className={styles.itemFalta}>{p.falta}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={styles.btnFechar}
              onClick={() => setPendencias([])}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}
