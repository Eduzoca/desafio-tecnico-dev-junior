using System.Globalization;

namespace Professores.Api;

public class BuscaService
{
    private readonly AgendaProfessor[] agendas;
    private record Intervalo(int Inicio, int Fim)
    {
        public bool Contem(int inicio, int fim) => inicio >= Inicio && fim <= Fim;
        
        public bool Sobrepoe(int inicio, int fim) => inicio < Fim && fim > Inicio;
    }
    private record AgendaProfessor(Professor Professor,
        ILookup<string, Intervalo> Disponibilidade, ILookup<string, Intervalo> Aulas);

    public BuscaService(IEnumerable<Professor> professores)
    {
        
        agendas = professores.Select(p => new AgendaProfessor(p,
            p.Disponibilidade.ToLookup(d => d.Dia, d => new Intervalo(Minutos(d.Inicio), Minutos(d.Fim))),
            p.AulasMarcadas.ToLookup(a => a.Dia, a => new Intervalo(Minutos(a.Inicio), Minutos(a.Inicio) + a.DuracaoMinutos)))).ToArray();
    }
    private static readonly string[] DiasValidos = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
    private static bool Horario(string? valor, out TimeOnly hora) => TimeOnly.TryParseExact(valor, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out hora);
    private static int Minutos(string valor)
    {
        var hora = TimeOnly.ParseExact(valor, "HH:mm", CultureInfo.InvariantCulture);
        return hora.Hour * 60 + hora.Minute;
    }

    public static List<string> Validar(BuscaRequest request)
    {
        var erros = new List<string>();
        if (string.IsNullOrWhiteSpace(request.Idioma)) erros.Add("Informe o idioma.");
        if (request.Dias is null || request.Dias.Length == 0) erros.Add("Informe pelo menos um dia.");
        else if (request.Dias.Any(d => !DiasValidos.Contains(d))) erros.Add("Informe apenas dias da semana válidos.");
        var inicioValido = Horario(request.InicioFaixa, out var inicio);
        var fimValido = Horario(request.FimFaixa, out var fim);
        if (!inicioValido || !fimValido) erros.Add("Use horários no formato HH:mm.");
        else if (fim <= inicio) erros.Add("O fim da faixa deve ser posterior ao início.");
        if (request.DuracaoMinutos is not (30 or 60 or 90)) erros.Add("A duração deve ser 30, 60 ou 90 minutos.");
        return erros;
    }

    public BuscaResponse Buscar(BuscaRequest request)
    {
        if (Validar(request).Count > 0) throw new ArgumentException("Busca inválida.", nameof(request));
        var elegiveis = new List<Elegivel>();
        var excluidos = new List<NaoElegivel>();
        var inicio = Minutos(request.InicioFaixa!);
        var fim = Minutos(request.FimFaixa!);
        var dias = request.Dias!.Distinct().ToArray();
        foreach (var agenda in agendas)
        {
            var professor = agenda.Professor;
            string? motivo = null;
            var horarios = new List<string>();
            if (!professor.Idiomas.Any(i => string.Equals(i, request.Idioma!.Trim(), StringComparison.OrdinalIgnoreCase))) motivo = "Não ensina o idioma";
            else if (professor.AgendaBloqueada) motivo = "Agenda bloqueada";
            else
            {
                for (var candidato = (inicio + 29) / 30 * 30; candidato + request.DuracaoMinutos <= fim; candidato += 30)
                {
                    var termino = candidato + request.DuracaoMinutos;
                    if (dias.All(dia =>
                        agenda.Disponibilidade[dia].Any(bloco => bloco.Contem(candidato, termino)) &&
                        !agenda.Aulas[dia].Any(aula => aula.Sobrepoe(candidato, termino))))
                        horarios.Add($"{candidato / 60:00}:{candidato % 60:00}");
                }
                if (horarios.Count == 0) motivo = "Sem horário em comum nos dias pedidos";
            }
            if (motivo is not null) excluidos.Add(new(professor.Id, professor.Nome, motivo));
            else elegiveis.Add(new(professor.Id, professor.Nome, professor.AulasMarcadas.Length, horarios.ToArray()));
        }
        return new(elegiveis.OrderBy(p => p.AulasNaSemana).ThenBy(p => p.Nome, StringComparer.Create(CultureInfo.GetCultureInfo("pt-BR"), false)).ToArray(), excluidos.ToArray());
    }
}
