namespace Professores.Api;

public record Disponibilidade(string Dia, string Inicio, string Fim);
public record Aula(string Dia, string Inicio, int DuracaoMinutos);
public record Professor(int Id, string Nome, string[] Idiomas, bool AgendaBloqueada, Disponibilidade[] Disponibilidade, Aula[] AulasMarcadas);
public record BuscaRequest(string? Idioma, string[]? Dias, string? InicioFaixa, string? FimFaixa, int DuracaoMinutos);
public record Elegivel(int Id, string Nome, int AulasNaSemana, string[] Horarios);
public record NaoElegivel(int Id, string Nome, string Motivo);
public record BuscaResponse(Elegivel[] Professores, NaoElegivel[] NaoElegiveis);
