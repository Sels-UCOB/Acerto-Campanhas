"use client";

import React from "react";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import type { LinhaTabela } from "@/types/lancamentoLider";
import styles from "./ModalDetalhe.module.css";

interface Props {
  linha: LinhaTabela;
  onFechar: () => void;
}

export function ModalDetalhe({ linha, onFechar }: Props) {
  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cabecalho}>
          <h2 className={styles.titulo}>
            {linha.tipo === "inss" ? "Detalhamento — INSS" : "Detalhamento — IRPF"}
          </h2>
          <button
            type="button"
            className={styles.btnFechar}
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className={styles.corpo}>
          {linha.tipo === "inss" && linha.detalheINSS && (
            <dl className={styles.lista}>
              <div className={styles.item}>
                <dt>Bonificação</dt>
                <dd>{formatarBRL(linha.detalheINSS.bonificacao)}</dd>
              </div>
              {linha.detalheINSS.carta > 0 && (
                <div className={styles.item}>
                  <dt>Carta de Bolsa</dt>
                  <dd className={styles.deducao}>
                    − {formatarBRL(linha.detalheINSS.carta)}
                  </dd>
                </div>
              )}
              <div className={`${styles.item} ${styles.itemDestaque}`}>
                <dt>Base utilizada</dt>
                <dd>{formatarBRL(linha.detalheINSS.base)}</dd>
              </div>
              <div className={styles.item}>
                <dt>Percentual aplicado</dt>
                <dd>{(linha.detalheINSS.percentual * 100).toFixed(0)}%</dd>
              </div>
              <div className={`${styles.item} ${styles.itemTotal}`}>
                <dt>Valor INSS</dt>
                <dd>{formatarBRL(linha.detalheINSS.valor)}</dd>
              </div>
            </dl>
          )}

          {linha.tipo === "irpf" && linha.detalheIRPF && (
            <dl className={styles.lista}>
              <div className={styles.item}>
                <dt>Bonificação</dt>
                <dd>{formatarBRL(linha.detalheIRPF.bonificacao)}</dd>
              </div>
              {linha.detalheIRPF.carta > 0 && (
                <div className={styles.item}>
                  <dt>Carta de Bolsa</dt>
                  <dd className={styles.deducao}>
                    − {formatarBRL(linha.detalheIRPF.carta)}
                  </dd>
                </div>
              )}
              <div className={`${styles.item} ${styles.itemDestaque}`}>
                <dt>Base ajustada</dt>
                <dd>{formatarBRL(linha.detalheIRPF.baseAjustada)}</dd>
              </div>
              <div className={styles.item}>
                <dt>Base mensal (÷ 6)</dt>
                <dd>{formatarBRL(linha.detalheIRPF.baseMensal)}</dd>
              </div>
              <div className={styles.item}>
                <dt>IRPF mensal</dt>
                <dd>{formatarBRL(linha.detalheIRPF.irpfMensal)}</dd>
              </div>
              <div className={`${styles.item} ${styles.itemTotal}`}>
                <dt>Total</dt>
                <dd>
                  6 × {formatarBRL(linha.detalheIRPF.irpfMensal)}{" "}
                  <span className={styles.igual}>=</span>{" "}
                  <strong>{formatarBRL(linha.detalheIRPF.irpfTotal)}</strong>
                </dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
