export const idiomas = [
  { nome: "Inglês", pais: "GB", saudacao: "Hello!", cor: "#0057a5" },
  { nome: "Espanhol", pais: "ES", saudacao: "¡Hola!", cor: "#cc213a" },
  { nome: "Francês", pais: "FR", saudacao: "Bonjour!", cor: "#061f35" },
] as const;
export const duracoes = [30, 60, 90];
export const diasSemana = [
  ["segunda", "Segunda"],
  ["terca", "Terça"],
  ["quarta", "Quarta"],
  ["quinta", "Quinta"],
  ["sexta", "Sexta"],
  ["sabado", "Sábado"],
  ["domingo", "Domingo"],
];
export const buscaInicial = {
  idioma: idiomas[1].nome,
  dias: [diasSemana[0][0]],
  inicioFaixa: "18:00",
  fimFaixa: "20:00",
  duracaoMinutos: duracoes[1],
};
export const tempoLimiteBusca = 15000;
export function horarioFinal(inicio: string, duracao: number) {
  const [h, m] = inicio.split(":").map(Number);
  const total = h * 60 + m + duracao;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
