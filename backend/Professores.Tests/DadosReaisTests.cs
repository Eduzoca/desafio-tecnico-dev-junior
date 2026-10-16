using System.Globalization;
using System.Text.Json;
using Professores.Api;
using Xunit;

public class DadosReaisTests
{
    [Fact]
    public void ArquivoDeProfessoresMantemBytesDoOriginal()
    {
        var bytes = File.ReadAllBytes(Path.Combine(AppContext.BaseDirectory, "professores.json"));
        var hash = Convert.ToHexString(System.Security.Cryptography.SHA256.HashData(bytes));
        Assert.Equal("44A31E4AE4424DCFBE072B02FE29DA9767CD02F342206C34FAA3619E11B23D14", hash);
    }

    private static Professor[] LerProfessores()
    {
        using var json = JsonDocument.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "professores.json")));
        return json.RootElement.GetProperty("professores").Deserialize<Professor[]>(new JsonSerializerOptions(JsonSerializerDefaults.Web))!;
    }

    [Theory]
    [InlineData("Inglês", 30)]
    [InlineData("Inglês", 60)]
    [InlineData("Inglês", 90)]
    [InlineData("Espanhol", 30)]
    [InlineData("Espanhol", 60)]
    [InlineData("Espanhol", 90)]
    [InlineData("Francês", 30)]
    [InlineData("Francês", 60)]
    [InlineData("Francês", 90)]
    public void TodosOsProfessoresConferemComCalendarioMinutoAMinuto(string idioma, int duracao)
    {
        var professores = LerProfessores();
        var service = new BuscaService(professores);
        string[] semana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
        
        var livres = professores.ToDictionary(p => p.Id, p => semana.ToDictionary(d => d, d =>
        {
            var minutos = new HashSet<int>();
            foreach (var bloco in p.Disponibilidade.Where(b => b.Dia == d))
                for (var m = Minuto(bloco.Inicio); m < Minuto(bloco.Fim); m++) minutos.Add(m);
            foreach (var aula in p.AulasMarcadas.Where(a => a.Dia == d))
                for (var m = Minuto(aula.Inicio); m < Minuto(aula.Inicio) + aula.DuracaoMinutos; m++) minutos.Remove(m);
            return minutos;
        }));
        
        for (var mascara = 1; mascara < 128; mascara++)
        {
            var dias = semana.Where((_, i) => (mascara & (1 << i)) != 0).ToArray();
            var resposta = service.Buscar(new(idioma, dias, "00:00", "23:59", duracao));
            Assert.Equal(professores.Length, resposta.Professores.Length + resposta.NaoElegiveis.Length);
            foreach (var p in professores)
            {
                var horarios = Enumerable.Range(0, 48).Select(i => i * 30)
                    .Where(inicio => inicio + duracao <= 1439 && dias.All(d => Enumerable.Range(inicio, duracao).All(livres[p.Id][d].Contains)))
                    .Select(inicio => $"{inicio / 60:00}:{inicio % 60:00}").ToArray();
                var motivo = !p.Idiomas.Contains(idioma) ? "Não ensina o idioma" : p.AgendaBloqueada ? "Agenda bloqueada" : horarios.Length == 0 ? "Sem horário em comum nos dias pedidos" : null;
                if (motivo is null)
                {
                    var encontrado = Assert.Single(resposta.Professores, item => item.Id == p.Id);
                    Assert.Equal(horarios, encontrado.Horarios);
                    Assert.Equal(p.AulasMarcadas.Length, encontrado.AulasNaSemana);
                }
                else Assert.Equal(motivo, Assert.Single(resposta.NaoElegiveis, item => item.Id == p.Id).Motivo);
            }
            Assert.Equal(resposta.Professores.OrderBy(p => p.AulasNaSemana).ThenBy(p => p.Nome, StringComparer.Create(CultureInfo.GetCultureInfo("pt-BR"), false)), resposta.Professores);
        }
    }
    private static int Minuto(string texto) => int.Parse(texto[..2]) * 60 + int.Parse(texto[3..]);
}
