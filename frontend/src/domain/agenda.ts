import type { DiaSemana, Resultado, AgendaSemana } from "../types";
export type ProfessorSemana = {
  id: number;
  nome: string;
  dias: AgendaSemana;
  motivo: string;
};
export function agruparSemana(
  respostas: { dia: DiaSemana; resultado: Resultado }[],
): ProfessorSemana[] {
  const professores = new Map<number, ProfessorSemana>();
  for (const { dia, resultado } of respostas) {
    for (const item of [...resultado.professores, ...resultado.naoElegiveis]) {
      const professor = professores.get(item.id) ?? {
        id: item.id,
        nome: item.nome,
        dias: {},
        motivo: "",
      };
      if ("horarios" in item && item.horarios.length)
        professor.dias[dia] = [...item.horarios];
      else if ("motivo" in item) professor.motivo = item.motivo;
      professores.set(item.id, professor);
    }
  }
  return [...professores.values()].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );
}
