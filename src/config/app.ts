import type { CampanhaType, CampoType, ConfigCampanha } from "@/types/acerto";

// ─── Opções de campanha ───────────────────────────────────────────────────────
// Ajuste esta lista para incluir / remover tipos de campanha disponíveis.
// O último item "Outro" abre um campo de texto livre.
export const CAMPANHAS: CampanhaType[] = [
  "Verão",
  "Inverno",
  "Sonhando Alto 1",
  "Sonhando Alto 2",
  "Outro",
];

// ─── Opções de campo ──────────────────────────────────────────────────────────
// Siglas dos campos disponíveis para seleção.
// O último item "Outro" abre um campo de texto livre.
export const CAMPOS: CampoType[] = [
  "ALM",
  "AOM",
  "ASM",
  "ABC",
  "APLAC",
  "MTO",
  "IDEC",
  "Outro",
];

// ─── Valores padrão do formulário ─────────────────────────────────────────────
// Estes valores são usados ao abrir o sistema ou ao resetar o formulário.
export const CONFIG_PADRAO: ConfigCampanha = {
  tipoCampanha: "Sonhando Alto 1",
  tipoCampanhaOutro: "",
  lideres: ["", "", "", ""],
  caixa: "",
  subContaCampanha: "",
  departamento: "",
  campo: "AOM",
  campoOutro: "",
};

// ─── Configurações de exibição ────────────────────────────────────────────────
export const EXIBICAO = {
  // Quantos colportores mostrar na preview antes do botão "Ver todos"
  previewMaxLinhas: 5,

  // Número de líderes disponíveis no formulário
  numLideres: 4,

  // Índice a partir do qual os líderes são marcados como (opcional)
  liderOpcionalAPartirDe: 1,
};

// ─── Identidade da organização ────────────────────────────────────────────────
export const ORGANIZACAO = {
  nome: process.env.NEXT_PUBLIC_NOME_ORGANIZACAO ?? "SELS UCOB ME",
  versao: process.env.NEXT_PUBLIC_VERSAO ?? "0.1.0",
};
