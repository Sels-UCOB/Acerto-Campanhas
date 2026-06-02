export interface ConfigLider {
  nome: string;
  bonificacaoPercentual: number;
  auxilioPercentual: number;
}

export interface CartaBolsa {
  valor: number;
  liderReceptor: string;
}

export interface DetalheINSS {
  bonificacao: number;
  carta: number;
  base: number;
  percentual: number;
  valor: number;
}

export interface DetalheIRPF {
  bonificacao: number;
  carta: number;
  baseAjustada: number;
  baseMensal: number;
  irpfMensal: number;
  irpfTotal: number;
}

export type RowTipo =
  | "header"
  | "bonificacao"
  | "auxilio"
  | "dizimo"
  | "inss"
  | "irpf"
  | "fpc"
  | "jurosCampanha"
  | "salarioCaixa";

export interface LinhaTabela {
  id: string;
  tipo: RowTipo;
  liderNome: string | null;
  descricao: string;
  valor: number;
  excluirDoSaldo: boolean;
  clicavel: boolean;
  detalheINSS?: DetalheINSS;
  detalheIRPF?: DetalheIRPF;
}
