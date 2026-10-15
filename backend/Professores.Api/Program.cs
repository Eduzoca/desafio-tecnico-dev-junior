using System.Text.Json;
using Professores.Api;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<Microsoft.AspNetCore.Routing.RouteHandlerOptions>(options => options.ThrowOnBadRequest = false);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));
var dados = JsonSerializer.Deserialize<DadosProfessores>(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "professores.json")), new JsonSerializerOptions(JsonSerializerDefaults.Web))!;
builder.Services.AddSingleton(new BuscaService(dados.Professores));
var app = builder.Build();
app.UseStatusCodePages(async context =>
{
    if (context.HttpContext.Response.StatusCode == 400)
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            mensagem = "Requisição inválida.",
            erros = new[] { "Envie um objeto JSON válido com os campos da busca e seus tipos corretos." }
        });
});
app.UseCors();
app.MapPost("/api/professores/busca", (BuscaRequest request, BuscaService service) =>
{
    var erros = BuscaService.Validar(request);
    return erros.Count > 0 ? Results.BadRequest(new { mensagem = "Confira os dados da busca.", erros }) : Results.Ok(service.Buscar(request));
});
app.Run();
record DadosProfessores(List<Professor> Professores);
public partial class Program { }
