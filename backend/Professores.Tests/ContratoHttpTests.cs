using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

public class ContratoHttpTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient client;
    public ContratoHttpTests(WebApplicationFactory<Program> factory) => client = factory.CreateClient();

    [Fact]
    public async Task ExemploDoEnunciadoMantemContratoEOrdenacao()
    {
        var response = await client.PostAsJsonAsync("/api/professores/busca", new { idioma = "Espanhol", dias = new[] { "segunda" }, inicioFaixa = "18:00", fimFaixa = "20:00", duracaoMinutos = 60 });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var raiz = json.RootElement;
        Assert.Equal(new[] { "professores", "naoElegiveis" }, raiz.EnumerateObject().Select(p => p.Name));
        var professores = raiz.GetProperty("professores");
        Assert.Equal(new[] { "Ana", "Diego" }, professores.EnumerateArray().Select(p => p.GetProperty("nome").GetString()));
        Assert.Equal(new[] { "18:00", "18:30", "19:00" }, professores[1].GetProperty("horarios").EnumerateArray().Select(h => h.GetString()));
        Assert.Equal(6, raiz.GetProperty("naoElegiveis").GetArrayLength());
    }

    [Theory]
    [InlineData("{}")]
    [InlineData("null")]
    [InlineData("{erro")]
    [InlineData("{\"duracaoMinutos\":\"sessenta\"}")]
    public async Task RequisicaoInvalidaRetorna400ComMensagem(string body)
    {
        var response = await client.PostAsync("/api/professores/busca", new StringContent(body, Encoding.UTF8, "application/json"));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.False(string.IsNullOrWhiteSpace(json.RootElement.GetProperty("mensagem").GetString()));
        Assert.True(json.RootElement.GetProperty("erros").GetArrayLength() > 0);
    }
}
