"use client";

import React, { useState } from "react";
import type { ConfigCampanha, CampanhaType, CampoType, LiderAcerto, CaixaAcerto } from "@/types/acerto";
import { CAMPANHAS, CAMPOS, DEFAULTS_LIDERES, TOTAIS_ESPERADOS } from "@/config/app";
import styles from "./CampaignConfigForm.module.css";

interface CampaignConfigFormProps {
  config: ConfigCampanha;
  onChange: (parcial: Partial<ConfigCampanha>) => void;
}

export function CampaignConfigForm({ config, onChange }: CampaignConfigFormProps) {
  const [localLideres, setLocalLideres] = useState<ConfigCampanha["lideres"]>(
    () => config.lideres.map((l) => ({ ...l })) as ConfigCampanha["lideres"]
  );
  const [localCaixa, setLocalCaixa] = useState<CaixaAcerto>(() => ({ ...config.caixa }));
  const [localNumLideres, setLocalNumLideres] = useState<1 | 2 | 3 | 4>(() => (config.numLideres ?? 1) as 1 | 2 | 3 | 4);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  const setLiderField = (idx: number, campo: keyof LiderAcerto, valor: string | number | boolean) => {
    setErroValidacao(null);
    setLocalLideres((prev) => {
      const novos = prev.map((l) => ({ ...l })) as ConfigCampanha["lideres"];
      novos[idx] = { ...novos[idx], [campo]: valor };
      return novos;
    });
  };

  const handleNumLideresChange = (n: 1 | 2 | 3 | 4) => {
    setLocalNumLideres(n);
    setErroValidacao(null);
    const defaults = DEFAULTS_LIDERES[n];
    setLocalLideres((prev) => {
      const novos = prev.map((l) => ({ ...l })) as ConfigCampanha["lideres"];
      for (let i = 0; i < 4; i++) {
        if (i < defaults.length) {
          novos[i] = {
            ...novos[i],
            bonificacaoPercentual: defaults[i].bonificacaoPercentual,
            auxilioPercentual: defaults[i].auxilioPercentual,
          };
        } else {
          novos[i] = { ...novos[i], bonificacaoPercentual: 0, auxilioPercentual: 0 };
        }
      }
      return novos;
    });
  };

  const salvarLideres = () => {
    const totais = TOTAIS_ESPERADOS[localNumLideres];
    if (totais) {
      const ativos = Array.from({ length: localNumLideres }, (_, i) => localLideres[i]);
      const somaBonif = Math.round(ativos.reduce((s, l) => s + l.bonificacaoPercentual, 0) * 100) / 100;
      const somaAux   = Math.round((ativos.reduce((s, l) => s + l.auxilioPercentual, 0) + localCaixa.auxilioPercentual) * 100) / 100;
      const erros: string[] = [];
      if (somaBonif !== totais.bonificacao)
        erros.push(`Manutenção: soma ${somaBonif}%, esperado ${totais.bonificacao}%`);
      if (somaAux !== totais.auxilio)
        erros.push(`Auxílio: soma ${somaAux}%, esperado ${totais.auxilio}%`);
      if (erros.length > 0) {
        setErroValidacao(erros.join(" — "));
        return;
      }
    }
    setErroValidacao(null);
    onChange({ lideres: localLideres, caixa: localCaixa, numLideres: localNumLideres });
  };

  return (
    <div className={styles.form}>
      {/* Campanha */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Campanha</legend>

        <div className={styles.grupo}>
          <label className={styles.label} htmlFor="tipoCampanha">Tipo de Campanha</label>
          <select
            id="tipoCampanha"
            className={styles.select}
            value={config.tipoCampanha}
            onChange={(e) => onChange({ tipoCampanha: e.target.value as CampanhaType })}
          >
            {CAMPANHAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {config.tipoCampanha === "Outro" && (
          <div className={styles.grupo}>
            <label className={styles.label} htmlFor="tipoCampanhaOutro">Nome da Campanha</label>
            <input
              id="tipoCampanhaOutro"
              className={styles.input}
              type="text"
              placeholder="Ex: Primavera 2026"
              value={config.tipoCampanhaOutro}
              onChange={(e) => onChange({ tipoCampanhaOutro: e.target.value })}
            />
          </div>
        )}

        <div className={styles.grupo}>
          <label className={styles.label} htmlFor="campo">Campo</label>
          <select
            id="campo"
            className={styles.select}
            value={config.campo}
            onChange={(e) => onChange({ campo: e.target.value as CampoType })}
          >
            {CAMPOS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {config.campo === "Outro" && (
          <div className={styles.grupo}>
            <label className={styles.label} htmlFor="campoOutro">Nome do Campo</label>
            <input
              id="campoOutro"
              className={styles.input}
              type="text"
              placeholder="Nome do campo"
              value={config.campoOutro}
              onChange={(e) => onChange({ campoOutro: e.target.value })}
            />
          </div>
        )}
      </fieldset>

      {/* Líderes */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Líderes</legend>

        <div className={styles.grupo} style={{ marginBottom: "0.75rem" }}>
          <label className={styles.label} htmlFor="numLideres">Nº de Líderes</label>
          <select
            id="numLideres"
            className={styles.select}
            value={localNumLideres}
            onChange={(e) => handleNumLideresChange(Number(e.target.value) as 1 | 2 | 3 | 4)}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className={styles.lideresHeader}>
          <span className={styles.lideresColNome}>Nome</span>
          <span className={styles.lideresColPct}>Bonific. % / Sal.</span>
          <span className={styles.lideresColPct}>Auxílio %</span>
        </div>

        {Array.from({ length: localNumLideres }, (_, i) => i).map((idx) => (
          <div key={idx}>
            <div className={styles.liderRow}>
              <input
                className={styles.input}
                type="text"
                placeholder={`${idx + 1}º líder`}
                value={localLideres[idx].nome}
                onChange={(e) => setLiderField(idx, "nome", e.target.value)}
              />
              <input
                className={`${styles.input} ${styles.inputPct}`}
                type="number"
                placeholder="0"
                min={0}
                max={100}
                step="0.01"
                value={localLideres[idx].bonificacaoPercentual || ""}
                onChange={(e) =>
                  setLiderField(idx, "bonificacaoPercentual", parseFloat(e.target.value) || 0)
                }
              />
              <input
                className={`${styles.input} ${styles.inputPct}`}
                type="number"
                placeholder="0"
                min={0}
                max={100}
                step="0.01"
                value={localLideres[idx].auxilioPercentual || ""}
                onChange={(e) =>
                  setLiderField(idx, "auxilioPercentual", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            {idx === 0 && (
              <div className={styles.checkboxRow}>
                <input
                  id="veiculoSPA"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={localLideres[0].possuiVeiculoSPA}
                  onChange={(e) => setLiderField(0, "possuiVeiculoSPA", e.target.checked)}
                />
                <label htmlFor="veiculoSPA" className={styles.checkboxLabel}>
                  Possui veículo no SPA?
                </label>
              </div>
            )}
          </div>
        ))}

        {erroValidacao && (
          <div className={styles.erroValidacao}>{erroValidacao}</div>
        )}

        <div className={styles.liderSeparador}>
          <span>Caixa</span>
        </div>
        <div className={styles.liderRow}>
          <input
            className={styles.input}
            type="text"
            placeholder="Nome do caixa"
            value={localCaixa.nome}
            onChange={(e) => setLocalCaixa((p) => ({ ...p, nome: e.target.value }))}
          />
          <input
            className={`${styles.input} ${styles.inputPct}`}
            type="number"
            placeholder="Sal."
            min={0}
            step="0.01"
            value={localCaixa.salarioCaixa ?? ""}
            onChange={(e) =>
              setLocalCaixa((p) => ({
                ...p,
                salarioCaixa: e.target.value === "" ? null : parseFloat(e.target.value),
              }))
            }
          />
          <input
            className={`${styles.input} ${styles.inputPct}`}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            step="0.01"
            value={localCaixa.auxilioPercentual || ""}
            onChange={(e) =>
              setLocalCaixa((p) => ({ ...p, auxilioPercentual: parseFloat(e.target.value) || 0 }))
            }
          />
        </div>
        <div className={styles.liderSalvar}>
          <button type="button" className={styles.btnSalvar} onClick={salvarLideres}>
            Salvar
          </button>
        </div>
      </fieldset>

      {/* Financeiro */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Financeiro & Organização</legend>
        <div className={styles.grid2}>
          <div className={styles.grupo}>
            <label className={styles.label} htmlFor="subConta">SubConta Campanha</label>
            <input
              id="subConta"
              className={styles.input}
              type="text"
              placeholder="Código ou nome"
              value={config.subContaCampanha}
              onChange={(e) => onChange({ subContaCampanha: e.target.value })}
            />
          </div>

          <div className={`${styles.grupo} ${styles.spanFull}`}>
            <label className={styles.label} htmlFor="departamento">Departamento</label>
            <input
              id="departamento"
              className={styles.input}
              type="text"
              placeholder="Nome do departamento"
              value={config.departamento}
              onChange={(e) => onChange({ departamento: e.target.value })}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
