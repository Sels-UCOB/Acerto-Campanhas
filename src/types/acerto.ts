export type CampanhaType =
  | "Verão"
  | "Inverno"
  | "Sonhando Alto 1"
  | "Sonhando Alto 2"
  | "Outro";

export type CampoType =
  | "ALM"
  | "AOM"
  | "ASM"
  | "ABC"
  | "APLAC"
  | "MTO"
  | "IDEC"
  | "Outro";

export interface DadosImportados {
  nomes: string[];
  saldos: number[];
  compraTotal: number;
  bonificado: number;
}

export interface ConfigCampanha {
  tipoCampanha: CampanhaType;
  tipoCampanhaOutro: string;
  lideres: [string, string, string, string];
  caixa: string;
  subContaCampanha: string;
  departamento: string;
  campo: CampoType;
  campoOutro: string;
}

export interface AcertoState {
  dadosImportados: DadosImportados | null;
  config: ConfigCampanha;
}

// Valores padrão centralizados em src/config/app.ts → CONFIG_PADRAO
export const CONFIG_INICIAL: ConfigCampanha = {
  tipoCampanha: "Sonhando Alto 1",
  tipoCampanhaOutro: "",
  lideres: ["", "", "", ""],
  caixa: "",
  subContaCampanha: "",
  departamento: "",
  campo: "AOM",
  campoOutro: "",
};
