import type { Resultado } from "../types";

export type ProfessorResultado = Resultado["professores"][number];
export const ordenacoes = {
  carga: "Menos aulas na semana",
  nome: "Nome do professor",
  opcoes: "Mais horários disponíveis",
} as const;
export type Ordenacao = keyof typeof ordenacoes;
const compararNome = new Intl.Collator("pt-BR").compare;
const normalizar = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

export function agruparHorarios(professores: ProfessorResultado[]) {
  const grupos = new Map<string, number>();
  for (const professor of professores)
    for (const horario of new Set(professor.horarios))
      grupos.set(horario, (grupos.get(horario) ?? 0) + 1);
  return [...grupos].sort(([a], [b]) => a.localeCompare(b));
}

export function selecionarProfessores(
  professores: ProfessorResultado[],
  nome: string,
  horario: string,
  ordem: Ordenacao,
) {
  return professores
    .filter(
      (p) =>
        normalizar(p.nome).includes(normalizar(nome)) &&
        (!horario || p.horarios.includes(horario)),
    )
    .sort((a, b) => {
      const diferenca =
        ordem === "carga"
          ? a.aulasNaSemana - b.aulasNaSemana
          : ordem === "opcoes"
            ? b.horarios.length - a.horarios.length
            : 0;
      return diferenca || compararNome(a.nome, b.nome);
    });
}
