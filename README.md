# Encontre um Professor

Desenvolvi esta aplicação para buscar professores de idiomas que tenham um **mesmo horário disponível em todos os dias escolhidos**. Usei .NET 8 na API e React com TypeScript na interface, com os dados fornecidos em `professores.json`.

## Como executar

Para rodar o projeto, é necessário ter o SDK .NET 8 e Node.js 22.13+ na linha 22, ou 24+, com npm.

Na raiz do projeto, inicie a API:

```sh
dotnet run --project backend/Professores.Api --urls http://localhost:5000
```

Em outro terminal, entre na pasta da interface, instale as dependências e inicie o frontend:

```sh
cd frontend
npm ci
npm run dev
```

Acesse [localhost:5173](http://localhost:5173). Mantenha os dois terminais abertos. Configurei o Vite para encaminhar as chamadas de `/api` para a API na porta 5000. Não é necessário configurar banco de dados ou credenciais.

## Funcionalidades

- Busca por idioma, dias da semana, faixa de horário e duração de 30, 60 ou 90 minutos.
- Listagem de professores com horários possíveis e quantidade de aulas marcadas na semana.
- Exibição dos professores não elegíveis e seus motivos.
- Agenda semanal para consultar a disponibilidade de cada professor.
- Filtros por nome e horário e ordenação por carga semanal, nome ou quantidade de opções.
- Prévia dos dias e horários ao selecionar uma opção de aula.
- Estados de carregamento, validação, falha de comunicação e busca sem resultados.
- Interface adaptada para desktop e celular.

## Decisões de implementação

Separei a regra de busca da camada HTTP em `BuscaService.cs`. Na inicialização da API, carrego o JSON em memória, converto os horários para minutos e agrupo os intervalos por dia. Mantive essa estrutura porque o desafio trabalha com uma base pequena e não exige persistência.

Para cada início possível, verifico se a aula cabe inteira em um único bloco de disponibilidade, dentro da faixa solicitada e sem conflito com outra aula. O mesmo início precisa atender a todos os dias escolhidos. Por exemplo, segunda às 18h e quarta às 19h não atendem a uma busca conjunta.

Tratei os intervalos como `[início, fim)`, permitindo que uma aula comece exatamente quando outra termina. Os horários de início são gerados a cada 30 minutos. A ordenação inicial considera menos aulas marcadas na semana e, em caso de empate, o nome em ordem alfabética com a cultura `pt-BR`.

Mantive os motivos de exclusão na prioridade do enunciado: `Não ensina o idioma`, `Agenda bloqueada` e `Sem horário em comum nos dias pedidos`.

Para situações não detalhadas no enunciado, adotei estas decisões:

- Dias repetidos são considerados apenas uma vez.
- Comparo o idioma sem distinguir maiúsculas e minúsculas e ignorando espaços nas extremidades.
- Um idioma não vazio que ninguém ensina retorna os professores como não elegíveis, sem gerar erro de validação.
- Os dias precisam usar os identificadores do enunciado, como `terca`.
- Uma faixa válida menor que a duração da aula retorna uma busca sem horários.
- A agenda representa uma semana recorrente, sem datas ou conversão de fuso horário.

No frontend, separei componentes, hooks, serviços e transformações dos resultados. As buscas guardam os critérios enviados, cancelam consultas anteriores e impedem que respostas antigas substituam resultados recentes. Os filtros locais usam os dados recebidos, sem fazer novas consultas.

Na agenda semanal, consulto cada dia separadamente, mantendo idioma, faixa e duração. Essa visualização permite explorar a semana, mas não indica um horário comum entre todos os dias. Selecionar uma opção apenas exibe uma prévia, sem reservar aula.

## API

`POST /api/professores/busca`

Exemplo de requisição:

```json
{
  "idioma": "Espanhol",
  "dias": ["segunda"],
  "inicioFaixa": "18:00",
  "fimFaixa": "20:00",
  "duracaoMinutos": 60
}
```

A resposta contém `professores`, com `id`, `nome`, `aulasNaSemana` e `horarios`, e `naoElegiveis`, com `id`, `nome` e `motivo`.

Para entradas inválidas, retorno HTTP 400 com `mensagem` e `erros`. Valido idioma, dias, formato `HH:mm`, ordem da faixa e duração. Deixei outros exemplos em [buscas.http](backend/Professores.Api/buscas.http).

## Organização do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `backend/Professores.Api` | Endpoints, validação e regras de disponibilidade |
| `backend/Professores.Tests` | Testes das regras e do contrato HTTP |
| `frontend/src/components` | Formulário, agenda, resultados e elementos visuais |
| `frontend/src/hooks` | Estado e ciclo das consultas |
| `frontend/src/services` | Cliente HTTP e validação das respostas |
| `frontend/src/domain` | Transformações da agenda e dos resultados |
| `frontend/src/config.ts` | Opções do formulário e configurações compartilhadas |
| `professores.json` | Dados fornecidos no desafio |

Usei React Bootstrap nos componentes de interface, FullCalendar na agenda, Lucide nos ícones e Three.js com GSAP no fundo animado. A identidade visual tem como referência [King LP](https://kingoflanguages.com.br/lp/) e [King](https://site.kingoflanguages.com.br/).

## Testes

Na raiz do projeto:

```sh
dotnet test EncontreUmProfessor.sln --configuration Release
```

Na pasta `frontend`:

```sh
npm test -- --maxWorkers=1
npm run lint
npm run format:check
npm run build
```

Organizei 39 casos de teste no backend e 32 no frontend. Os testes do backend cobrem as regras, conflitos, limites dos intervalos, validações, ordenação e contrato HTTP. Também comparo 1.143 buscas nos dados fornecidos com uma representação independente dos minutos livres.

Os testes de regra executam diretamente o serviço, sem subir a API. Os testes HTTP usam servidor em memória. No frontend, os testes usam respostas simuladas para conferir o formulário, os estados da busca, as prévias e o tratamento de consultas concorrentes. Configurei o GitHub Actions para executar testes, lint, formatação e build.

Para conferir a aplicação manualmente:

1. Busque Espanhol, segunda, 18:00–20:00 e 60 minutos. O resultado deve listar Ana e Diego nessa ordem; Diego oferece 18:00, 18:30 e 19:00.
2. Abra os motivos de exclusão, selecione um horário e consulte a agenda semanal.
3. Envie uma busca sem dias para conferir a mensagem de validação.
4. Interrompa a API e tente buscar para conferir o erro de comunicação. Reinicie a API e tente novamente.
5. Confira o formulário e os filtros em desktop e celular.

## Limites e próximos passos

Mantive o escopo na consulta de agendas recorrentes. Não implementei login, cadastro, persistência de alterações ou reserva de aulas. A prévia mostra uma possibilidade de horário e não garante disponibilidade futura.

Ainda não incluí testes automatizados de ponta a ponta em navegador real. Como próximos passos, considero esses testes e um fluxo de agendamento com persistência e controle de concorrência.

Para publicar a interface, `npm run build` gera os arquivos em `frontend/dist`. A hospedagem precisa servir esses arquivos e encaminhar `/api` para o backend. O proxy do Vite funciona apenas no desenvolvimento; em origens separadas, também é necessário ajustar o CORS da API.

Registrei como usei assistência durante o desenvolvimento em [USO_DE_IA.md](USO_DE_IA.md).
