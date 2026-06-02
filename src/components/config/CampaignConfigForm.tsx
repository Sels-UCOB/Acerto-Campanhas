"use client";

import React, { useState } from "react";
import type { ConfigCampanha, CampanhaType, CampoType, LiderAcerto, CaixaAcerto } from "@/types/acerto";
import { CAMPANHAS, CAMPOS, EXIBICAO } from "@/config/app";
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

  const setLiderField = (idx: number, campo: keyof LiderAcerto, valor: string | number) => {
    setLocalLideres((prev) => {
      const novos = prev.map((l) => ({ ...l })) as ConfigCampanha["lideres"];
      novos[idx] = { ...novos[idx], [campo]: valor };
      return novos;
    });
  };

  const salvarLideres = () => {
    onChange({ lideres: localLideres, caixa: localCaixa });
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
        <div className={styles.lideresHeader}>
          <span className={styles.lideresColNome}>Nome</span>
          <span className={styles.lideresColPct}>Bonific. % / Sal.</span>
          <span className={styles.lideresColPct}>Auxílio %</span>
        </div>
        {Array.from({ length: EXIBICAO.numLideres }, (_, i) => i).map((idx) => (
          <div key={idx} className={styles.liderRow}>
            <input
              className={styles.input}
              type="text"
              placeholder={`${idx + 1}º líder${idx >= EXIBICAO.liderOpcionalAPartirDe ? " (opcional)" : ""}`}
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
        ))}
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
