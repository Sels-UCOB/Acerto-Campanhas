"use client";

import React from "react";
import { useAcerto } from "@/context/AcertoContext";
import { XlsxUploader } from "@/components/upload/XlsxUploader";
import { PreviewImportacao } from "@/components/upload/PreviewImportacao";
import { CampaignConfigForm } from "@/components/config/CampaignConfigForm";
import type { DadosImportados } from "@/types/acerto";
import styles from "./page.module.css";

export default function Tela1() {
  const { state, setDadosImportados, setConfig, resetDados } = useAcerto();
  const { dadosImportados, config } = state;

  const podeProsseguir =
    dadosImportados !== null &&
    config.lideres[0].trim() !== "" &&
    config.caixa.trim() !== "";

  return (
    <div className={styles.pagina}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoArea}>
            <span className={styles.logoIcone}>📚</span>
            <div>
              <h1 className={styles.logoTitulo}>Acerto de Colportagem</h1>
              <span className={styles.logoSub}>Sistema de gestão de campanhas</span>
            </div>
          </div>
          <div className={styles.etapa}>
            <span className={styles.etapaAtual}>1</span>
            <span className={styles.etapaSep}>/</span>
            <span className={styles.etapaTotal}>3</span>
            <span className={styles.etapaLabel}>Importação & Configuração</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>

          {/* Coluna esquerda — Importação */}
          <section className={styles.secao}>
            <div className={styles.secaoHeader}>
              <span className={styles.secaoNumero}>01</span>
              <div>
                <h2 className={styles.secaoTitulo}>Relatório de Saldo</h2>
                <p className={styles.secaoDesc}>
                  Importe o arquivo Excel exportado do sistema de saldo de colportores
                </p>
              </div>
            </div>

            {dadosImportados ? (
              <PreviewImportacao
                dados={dadosImportados}
                onLimpar={resetDados}
              />
            ) : (
              <XlsxUploader
                onImportado={(d: DadosImportados) => setDadosImportados(d)}
              />
            )}
          </section>

          {/* Coluna direita — Configuração */}
          <section className={styles.secao}>
            <div className={styles.secaoHeader}>
              <span className={styles.secaoNumero}>02</span>
              <div>
                <h2 className={styles.secaoTitulo}>Configuração da Campanha</h2>
                <p className={styles.secaoDesc}>
                  Preencha os dados da equipe e da campanha
                </p>
              </div>
            </div>

            <CampaignConfigForm config={config} onChange={setConfig} />
          </section>
        </div>

        {/* Rodapé com ação */}
        <div className={styles.rodape}>
          {!podeProsseguir && (
            <p className={styles.aviso}>
              {!dadosImportados
                ? "⬆ Importe o relatório de saldo para continuar"
                : "Preencha ao menos o 1º Líder e o Caixa para continuar"}
            </p>
          )}
          <button
            className={styles.btnProsseguir}
            disabled={!podeProsseguir}
            type="button"
            onClick={() => {
              /* navegar para Tela 2 */
              alert("Tela 2 em construção — dados prontos!");
            }}
          >
            Prosseguir para Lançamentos →
          </button>
        </div>
      </main>
    </div>
  );
}
