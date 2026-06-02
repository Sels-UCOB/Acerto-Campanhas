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

export interface LiderAcerto {
  nome: string;
  bonificacaoPercentual: number;
  auxilioPercentual: number;
}

export interface CaixaAcerto {
  nome: string;
  salarioCaixa: number | null;
  auxilioPercentual: number;
}

const LIDER_VAZIO: LiderAcerto = { nome: "", bonificacaoPercentual: 0, auxilioPercentual: 0 };

export interface ConfigCampanha {
  tipoCampanha: CampanhaType;
  tipoCampanhaOutro: string;
  lideres: [LiderAcerto, LiderAcerto, LiderAcerto, LiderAcerto];
  caixa: CaixaAcerto;
  subContaCampanha: string;
  departamento: string;
  campo: CampoType;
  campoOutro: string;
}

export interface AcertoState {
  dadosImportados: DadosImportados | null;
  config: ConfigCampanha;
}

export const CONFIG_INICIAL: ConfigCampanha = {
  tipoCampanha: "Sonhando Alto 1",
  tipoCampanhaOutro: "",
  lideres: [{ ...LIDER_VAZIO }, { ...LIDER_VAZIO }, { ...LIDER_VAZIO }, { ...LIDER_VAZIO }],
  caixa: { nome: "", salarioCaixa: null, auxilioPercentual: 0 },
  subContaCampanha: "",
  departamento: "",
  campo: "AOM",
  campoOutro: "",
};
