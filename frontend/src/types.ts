import type { diasSemana } from "./config";
export type DiaSemana = (typeof diasSemana)[number][0];
export type AgendaSemana = Partial<Record<DiaSemana, string[]>>;
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
  dias: DiaSemana[];
  inicioFaixa: string;
  fimFaixa: string;
  duracaoMinutos: number;
};
