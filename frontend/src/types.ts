export type Resultado = {
  professores: {
    id: number;
    nome: string;
    aulasNaSemana: number;
    horarios: string[];
  }[];
  naoElegiveis: { id: number; nome: string; motivo: string }[];
};
export type BuscaRequest = {
  idioma: string;
  dias: string[];
  inicioFaixa: string;
  fimFaixa: string;
  duracaoMinutos: number;
};
