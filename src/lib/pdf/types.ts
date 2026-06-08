import type { ConfigCampanha, DadosImportados } from "@/types/acerto";
import type { Lancamento } from "@/types/lancamento";
import type { TipoLancamento } from "@/types/configuracao";
import type { LinhaTabela, CartaBolsa } from "@/types/lancamentoLider";
import type { DevedorColportor, GastosLider, ResumoLiderCalc } from "@/types/debitos";

export type TipoExportacao = "SELS" | "LIDERES" | "CAMPO";

export interface DiferencaCaixaCalc {
  saldoInicial: number;
  salarioCaixa: number;
  fpc: number;
  juros: number;
  base: number;
  totalDebitosLideres: number;
  totalDebitosCaixa: number;
  totalDebitos: number;
  diferenca: number;
  temJuros: boolean;
}

export interface GrupoCampanha {
  nome: string;
  total: number;
}

export interface Anexo {
  nome: string;
  tipo: string;
  url: string;
  data: string;
}

export interface DadosPDF {
  tipo: TipoExportacao;
  config: ConfigCampanha;
  dadosImportados: DadosImportados | null;
  lancamentos: Lancamento[];
  tipos: TipoLancamento[];
  linhasLider: LinhaTabela[];
  saldoInicialLider: number;
  devedores: DevedorColportor[];
  gastosLideres: GastosLider[];
  gastosCaixa: GastosLider;
  cartaBolsa: CartaBolsa;
  jurosCampanha: number | null;
  resumosLideres: ResumoLiderCalc[];
  grupoCampanha: GrupoCampanha[];
  totalGeralCampanha: number;
  diferencaCaixa: DiferencaCaixaCalc;
  anexos?: Anexo[];
}
