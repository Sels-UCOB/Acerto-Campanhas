"use client";

import React from "react";
import type { ConfigCampanha, CampanhaType, CampoType } from "@/types/acerto";
import { CAMPANHAS, CAMPOS, EXIBICAO } from "@/config/app";
import styles from "./CampaignConfigForm.module.css";

interface CampaignConfigFormProps {
  config: ConfigCampanha;
  onChange: (parcial: Partial<ConfigCampanha>) => void;
}

export function CampaignConfigForm({ config, onChange }: CampaignConfigFormProps) {
  const setLider = (idx: number, valor: string) => {
    const novos = [...config.lideres] as ConfigCampanha["lideres"];
    novos[idx] = valor;
    onChange({ lideres: novos });
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
        <div className={styles.grid2}>
          {(Array.from({ length: EXIBICAO.numLideres }, (_, i) => i + 1) as number[]).map((n) => (
            <div key={n} className={styles.grupo}>
              <label className={styles.label} htmlFor={`lider${n}`}>
                {n}º Líder {n > EXIBICAO.liderOpcionalAPartirDe && <span className={styles.opcional}>(opcional)</span>}
              </label>
              <input
                id={`lider${n}`}
                className={styles.input}
                type="text"
                placeholder={`Nome do ${n}º líder`}
                value={config.lideres[n - 1]}
                onChange={(e) => setLider(n - 1, e.target.value)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Financeiro */}
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Financeiro & Organização</legend>
        <div className={styles.grid2}>
          <div className={styles.grupo}>
            <label className={styles.label} htmlFor="caixa">Caixa</label>
            <input
              id="caixa"
              className={styles.input}
              type="text"
              placeholder="Nome do caixa"
              value={config.caixa}
              onChange={(e) => onChange({ caixa: e.target.value })}
            />
          </div>

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
