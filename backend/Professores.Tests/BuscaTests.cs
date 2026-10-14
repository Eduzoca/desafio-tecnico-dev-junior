using Professores.Api;
using Xunit;

public class BuscaTests
{
    private static Professor Criar(int id = 1, string nome = "Ana", bool bloqueada = false, string idioma = "Espanhol", Aula[]? aulas = null, Disponibilidade[]? disponibilidade = null) => new(id, nome, [idioma], bloqueada, disponibilidade ?? [new("segunda", "18:00", "21:00"), new("quarta", "19:00", "21:00")], aulas ?? []);
    private static BuscaRequest Pedido(string[]? dias = null, string inicio = "18:00", string fim = "20:00", int duracao = 60) => new("Espanhol", dias ?? ["segunda"], inicio, fim, duracao);
    [Fact] public void FiltraIdiomaAntesDeAgenda() => Assert.Equal("Não ensina o idioma", new BuscaService([Criar(bloqueada: true, idioma: "Inglês")]).Buscar(Pedido()).NaoElegiveis.Single().Motivo);
    [Fact] public void ExcluiAgendaBloqueada() => Assert.Equal("Agenda bloqueada", new BuscaService([Criar(bloqueada: true)]).Buscar(Pedido()).NaoElegiveis.Single().Motivo);
    [Fact] public void ExigeHorarioEmTodosOsDias() => Assert.Equal(new[] { "19:00" }, new BuscaService([Criar()]).Buscar(Pedido(["segunda", "quarta"])).Professores.Single().Horarios);
    [Fact] public void PermiteEncostarMasNaoSobrepor() => Assert.Equal(new[] { "19:00" }, new BuscaService([Criar(aulas: [new("segunda", "18:00", 60)])]).Buscar(Pedido()).Professores.Single().Horarios);
    [Fact] public void ArredondaInicioECabeNaFaixa() => Assert.Equal(new[] { "18:30", "19:00" }, new BuscaService([Criar()]).Buscar(Pedido(inicio: "18:10")).Professores.Single().Horarios);
    [Fact] public void NaoUneBlocosSeparados() => Assert.Empty(new BuscaService([Criar(disponibilidade: [new("segunda", "18:00", "18:30"), new("segunda", "19:00", "19:30")])]).Buscar(Pedido()).Professores);
    [Fact] public void OrdenaPorCargaDepoisNome() => Assert.Equal(new[] { "Ana", "Bruno", "Carlos" }, new BuscaService([Criar(3, "Carlos", aulas: [new("domingo", "10:00", 30)]), Criar(2, "Bruno"), Criar()]).Buscar(Pedido()).Professores.Select(p => p.Nome));
    [Theory]
    [InlineData("", "segunda", "18:00", "20:00", 60)]
    [InlineData("Espanhol", "feriado", "18:00", "20:00", 60)]
    [InlineData("Espanhol", "segunda", "8:00", "20:00", 60)]
    [InlineData("Espanhol", "segunda", "18:00", "18:00", 60)]
    [InlineData("Espanhol", "segunda", "18:00", "20:00", 45)]
    public void ValidaEntradas(string idioma, string dia, string inicio, string fim, int duracao) => Assert.NotEmpty(BuscaService.Validar(new(idioma, [dia], inicio, fim, duracao)));
    [Fact] public void ValidaAusenciaDeDias() => Assert.NotEmpty(BuscaService.Validar(Pedido([])));

    [Theory]
    [InlineData(30, "19:30")]
    [InlineData(60, "19:00")]
    [InlineData(90, "18:30")]
    public void DuracoesPermitidasRespeitamFimDaFaixa(int duracao, string ultimoHorario)
    {
        var resultado = new BuscaService([Criar()]).Buscar(Pedido(duracao: duracao));
        Assert.Equal(ultimoHorario, resultado.Professores.Single().Horarios.Last());
    }

    [Fact]
    public void PermiteTerminarExatamenteNoInicioDeOutraAula()
    {
        var service = new BuscaService([Criar(aulas: [new("segunda", "19:00", 60)])]);
        Assert.Equal(new[] { "18:00" }, service.Buscar(Pedido()).Professores.Single().Horarios);
    }

    [Fact]
    public void ExcluiQuandoDiasTemHorariosLivresMasNaoEmComum()
    {
        var service = new BuscaService([Criar(disponibilidade:
            [new("segunda", "18:00", "19:00"), new("quarta", "19:00", "20:00")])]);
        var resultado = service.Buscar(Pedido(["segunda", "quarta"]));
        Assert.Empty(resultado.Professores);
        Assert.Equal("Sem horário em comum nos dias pedidos", resultado.NaoElegiveis.Single().Motivo);
    }

    [Fact]
    public void AulaNaoPodeUltrapassarFimDoBloco()
    {
        var service = new BuscaService([Criar(disponibilidade: [new("segunda", "18:00", "19:15")])]);
        Assert.Equal(new[] { "18:00" }, service.Buscar(Pedido()).Professores.Single().Horarios);
    }

    [Fact]
    public void ConflitoEmUmDosDiasEliminaHorarioFixo()
    {
        var service = new BuscaService([Criar(aulas: [new("quarta", "19:30", 30)])]);
        Assert.Empty(service.Buscar(Pedido(["segunda", "quarta"])).Professores);
    }

    [Fact]
    public void DiasDuplicadosNaoDuplicamHorarios()
    {
        var service = new BuscaService([Criar()]);
        Assert.Equal(service.Buscar(Pedido()).Professores.Single().Horarios,
            service.Buscar(Pedido(["segunda", "segunda"])).Professores.Single().Horarios);
    }

    [Theory]
    [InlineData("24:00", "23:59")]
    [InlineData("18:00", "17:59")]
    [InlineData("18:00:00", "20:00")]
    public void RejeitaHorariosForaDosLimitesOuFormato(string inicio, string fim)
        => Assert.NotEmpty(BuscaService.Validar(Pedido(inicio: inicio, fim: fim)));
}
