"use client";

import React from "react";
import { formatarBRL } from "@/lib/parseRelatorioSaldo";
import { TABELA_IRPF_MENSAL_2026 } from "@/config/impostos";
import type { LinhaTabela, DetalheIRPF } from "@/types/lancamentoLider";
import styles from "./ModalDetalhe.module.css";

interface Props {
  linha: LinhaTabela;
  onFechar: () => void;
}

const LABELS_FAIXA = [
  "Até R$ 2.428,80",
  "Até R$ 2.826,65",
  "Até R$ 3.751,05",
  "Até R$ 4.664,68",
  "Acima de R$ 4.664,68",
];

function IRPFDetalhe({ d }: { d: DetalheIRPF }) {
  return (
    <>
      <div className={styles.secao}>
        <span className={styles.secaoTitulo}>Base de Cálculo</span>
        <dl className={styles.lista}>
          <div className={styles.item}>
            <dt>Bonificação</dt>
            <dd>{formatarBRL(d.bonificacao)}</dd>
          </div>
          {d.carta > 0 && (
            <div className={styles.item}>
              <dt>Carta de Bolsa</dt>
              <dd className={styles.deducao}>− {formatarBRL(d.carta)}</dd>
            </div>
          )}
          <div className={`${styles.item} ${styles.itemDestaque}`}>
            <dt>Rendimento bruto</dt>
            <dd>{formatarBRL(d.baseAjustada)}</dd>
          </div>
          <div className={styles.item}>
            <dt>Renda mensal bruta (÷ 6)</dt>
            <dd>{formatarBRL(d.rendaMensal)}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.secao}>
        <span className={styles.secaoTitulo}>Etapa 0 — Dedução do INSS</span>
        <dl className={styles.lista}>
          <div className={styles.item}>
            <dt>Renda mensal bruta</dt>
            <dd>{formatarBRL(d.rendaMensal)}</dd>
          </div>
          <div className={styles.item}>
            <dt>INSS (20% — alíquota patronal)</dt>
            <dd className={styles.deducao}>− {formatarBRL(d.inssDeducao)}</dd>
          </div>
          <div className={`${styles.item} ${styles.itemDestaque}`}>
            <dt>Base mensal (pós-INSS)</dt>
            <dd>{formatarBRL(d.baseMensal)}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.secao}>
        <span className={styles.secaoTitulo}>Etapa 1 — Tabela Progressiva</span>
        <table className={styles.tabelaIRPF}>
          <thead>
            <tr>
              <th>Faixa</th>
              <th>Alíq.</th>
              <th>Dedução</th>
            </tr>
          </thead>
          <tbody>
            {TABELA_IRPF_MENSAL_2026.map((faixa, i) => {
              const aplicada =
                faixa.aliquota === d.faixaAliquota &&
                faixa.deducao === d.faixaDeducao;
              return (
                <tr key={i} className={aplicada ? styles.faixaAplicada : ""}>
                  <td>{LABELS_FAIXA[i]}</td>
                  <td>
                    {faixa.aliquota === 0
                      ? "Isento"
                      : `${(faixa.aliquota * 100).toFixed(1)}%`}
                  </td>
                  <td>
                    {faixa.deducao === 0 ? "—" : formatarBRL(faixa.deducao)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.formula}>
          {d.faixaAliquota === 0 ? (
            <span>
              Faixa isenta → Imposto base = <strong>{formatarBRL(0)}</strong>
            </span>
          ) : (
            <span>
              ({formatarBRL(d.baseMensal)} × {(d.faixaAliquota * 100).toFixed(1)}%) −{" "}
              {formatarBRL(d.faixaDeducao)} = <strong>{formatarBRL(d.impostoBase)}</strong>
            </span>
          )}
        </div>
      </div>

      <div className={styles.secao}>
        <span className={styles.secaoTitulo}>Etapa 2 — Ajuste por Renda</span>
        {d.etapa2 === "isencao" && (
          <div className={styles.etapa2Info}>
            <span className={styles.etapa2Tag}>Isenção total</span>
            <span>
              Renda mensal bruta {formatarBRL(d.rendaMensal)} ≤ R$ 5.000,00 → IRPF = <strong>{formatarBRL(0)}</strong>
            </span>
          </div>
        )}
        {d.etapa2 === "desconto" && (
          <div className={styles.lista}>
            <div className={styles.etapa2Info} style={{ marginBottom: "0.5rem" }}>
              <span className={styles.etapa2Tag}>Desconto parcial</span>
              <span>Renda mensal bruta {formatarBRL(d.rendaMensal)} entre R$ 5.000,00 e R$ 7.350,00</span>
            </div>
            <div className={styles.formula}>
              908,73 − (0,133 × {formatarBRL(d.rendaMensal)}) ={" "}
              <strong>{formatarBRL(d.desconto)}</strong>
            </div>
            <div className={`${styles.formula} ${styles.formulaDestaque}`}>
              max(0, {formatarBRL(d.impostoBase)} − {formatarBRL(d.desconto)}) ={" "}
              <strong>{formatarBRL(d.irpfMensal)}</strong>
            </div>
          </div>
        )}
        {d.etapa2 === "integral" && (
          <div className={styles.etapa2Info}>
            <span className={styles.etapa2Tag}>Integral</span>
            <span>Renda mensal bruta {formatarBRL(d.rendaMensal)} &gt; R$ 7.350,00 → sem ajuste</span>
          </div>
        )}
      </div>

      <div className={styles.secao}>
        <span className={styles.secaoTitulo}>Resultado</span>
        <dl className={styles.lista}>
          <div className={styles.item}>
            <dt>IRPF mensal</dt>
            <dd>{formatarBRL(d.irpfMensal)}</dd>
          </div>
          <div className={`${styles.item} ${styles.itemTotal}`}>
            <dt>Total (× 6 meses)</dt>
            <dd>
              6 × {formatarBRL(d.irpfMensal)}{" "}
              <span className={styles.igual}>=</span>{" "}
              <strong>{formatarBRL(d.irpfTotal)}</strong>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
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
            <IRPFDetalhe d={linha.detalheIRPF} />
          )}
        </div>
      </div>
    </div>
  );
}
