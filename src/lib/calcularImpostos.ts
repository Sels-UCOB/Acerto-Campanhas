import type { DetalheINSS, DetalheIRPF } from "@/types/lancamentoLider";
import {
  INSS_PERCENTUAL,
  TABELA_IRPF_MENSAL_2026,
} from "@/config/impostos";

function arred(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calcularINSSDetalhe(
  bonificacao: number,
  carta: number
): DetalheINSS {
  const base = arred(bonificacao - carta);
  const valor = arred(base * INSS_PERCENTUAL);
  return { bonificacao, carta, base, percentual: INSS_PERCENTUAL, valor };
}

function irpfMensalBruto(baseMensal: number): number {
  // Etapa 1: imposto base progressivo
  let impostoBase = 0;
  for (const faixa of TABELA_IRPF_MENSAL_2026) {
    if (baseMensal <= faixa.limite) {
      impostoBase = Math.max(0, arred(baseMensal * faixa.aliquota - faixa.deducao));
      break;
    }
  }

  // Etapa 2: ajuste por renda mensal total
  if (baseMensal <= 5000) return 0;
  if (baseMensal <= 7350) {
    const desconto = arred(908.73 - 0.133 * baseMensal);
    return Math.max(0, arred(impostoBase - desconto));
  }
  return impostoBase;
}

export function calcularIRPFDetalhe(
  bonificacao: number,
  carta: number
): DetalheIRPF {
  const baseAjustada = arred(bonificacao - carta);
  const baseMensal = arred(baseAjustada / 6);
  const irpfMensal = irpfMensalBruto(baseMensal);
  const irpfTotal = arred(irpfMensal * 6);
  return { bonificacao, carta, baseAjustada, baseMensal, irpfMensal, irpfTotal };
}
