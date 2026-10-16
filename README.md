# Encontre um Professor

Aplicação para encontrar professores de idiomas com um **horário fixo em comum nos dias escolhidos**. API em .NET 8 e interface React com TypeScript, usando o arquivo original `professores.json`, sem alterações.


## Executar localmente

Requisitos: SDK .NET 8 e Node.js 22.13+ na linha 22, ou 24+, com npm.

Na raiz, inicie a API:

```sh
dotnet run --project backend/Professores.Api --urls http://localhost:5000
```

Em outro terminal:

```sh
cd frontend
npm ci
npm run dev
```

Abra [localhost:5173](http://localhost:5173). O Vite encaminha `/api` para a porta 5000. Não é necessário configurar banco de dados ou credenciais.

## Funcionalidades

- Busca por idioma, dias da semana, faixa de horário e duração de 30, 60 ou 90 minutos.
- Agenda semanal dos professores antes dos resultados.
- Resultados com horários possíveis e quantidade de aulas marcadas na semana.
- Filtros por nome e horário e ordenação por carga semanal, nome ou quantidade de opções.
- Painel de filtros à direita no desktop e acima dos resultados no celular.
- Prévia semanal ao selecionar um horário e motivos de exclusão dos professores não elegíveis.
- Estados de carregamento, validação, falha de comunicação e busca sem resultados.
- Layout responsivo, fontes locais e animações que respeitam movimento reduzido.

## Regras e decisões

O início da aula precisa estar disponível em **todos** os dias pedidos. Segunda às 18h e quarta às 19h não atendem a uma busca conjunta: é necessário um mesmo início nos dois dias.

A aula deve caber inteira em um único bloco de disponibilidade e na faixa do aluno. Os inícios ocorrem a cada 30 minutos. Intervalos seguem `[início, fim)`, permitindo que uma aula comece quando outra termina.

A ordenação inicial prioriza menos aulas na semana e depois o nome. A prioridade dos motivos de exclusão é: `Não ensina o idioma`, `Agenda bloqueada` e `Sem horário em comum nos dias pedidos`.

Os dados representam uma semana recorrente, sem datas ou conversão de fuso. A consulta complementar da agenda avalia cada dia separadamente; ela não indica um início comum entre todos os dias. Selecionar um horário apenas exibe uma prévia, sem reservar aula.

O backend carrega o JSON na inicialização e prepara intervalos por dia em memória. Não há banco ou alteração das agendas. Filtros e contadores da interface derivam das respostas da API. Respostas antigas não substituem consultas mais recentes, e falhas de comunicação não são mostradas como indisponibilidade.

Dias repetidos são considerados uma única vez. O idioma é comparado sem distinguir maiúsculas e minúsculas e ignorando espaços nas extremidades; um idioma não vazio que ninguém ensina retorna professores não elegíveis, em vez de erro de validação. Dias devem usar os identificadores do enunciado. Faixas válidas menores que a duração retornam uma busca sem horários. Empates de nome usam a cultura `pt-BR`.

O JSON é idêntico byte a byte ao anexo original, com SHA-256 `44A31E4AE4424DCFBE072B02FE29DA9767CD02F342206C34FAA3619E11B23D14`. O arquivo `.gitattributes` impede que o Git converta suas quebras de linha, e um teste verifica sua integridade.

## API

`POST /api/professores/busca`

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

Requisições inválidas recebem HTTP 400 com `mensagem` e `erros`. A API valida idioma, dias, formato `HH:mm`, ordem da faixa e duração. Mais exemplos em [buscas.http](backend/Professores.Api/buscas.http).

## Organização e tecnologias

| Caminho | Responsabilidade |
| --- | --- |
| `backend/Professores.Api` | Endpoints, validação e regras de disponibilidade |
| `backend/Professores.Tests` | Testes das regras, contrato HTTP e dados originais |
| `frontend/src/components` | Formulário, agenda, resultados e identidade visual |
| `frontend/src/hooks` | Estado e ciclo das consultas |
| `frontend/src/services` | Cliente HTTP e validação das respostas |
| `professores.json` | Fonte original de dados |
| `.github/workflows/validacao.yml` | Validação automática no GitHub |

React Bootstrap fornece os componentes de interface; FullCalendar apresenta a agenda; Lucide fornece ícones; Three.js e GSAP compõem o fundo animado. Componentes, hooks, serviços e configurações mantêm responsabilidades separadas.


## Verificar a solução

Na raiz:

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

São 39 testes no backend e 32 no frontend. O backend inclui 1.143 buscas sobre os dados reais comparadas com uma representação independente dos minutos livres, além de testes de fronteiras e contrato HTTP. O frontend testa regras e interface com respostas simuladas. O GitHub Actions executa testes, lint, formatação e build.

O layout foi inspecionado em desktop e celular. Ainda não há testes automatizados de ponta a ponta em navegador real.

## Publicação e limites

`npm run build` gera os arquivos em `frontend/dist`. Na hospedagem, encaminhe `/api` para o backend; o proxy do Vite funciona apenas no desenvolvimento. Para origens separadas, ajuste também a política de CORS da API.

Esta entrega consulta agendas recorrentes. Não inclui login, cadastro, persistência de alterações ou reserva de aulas. A prévia não garante disponibilidade futura. Como continuidade, cabem testes de ponta a ponta e agendamento com persistência e controle de concorrência.

A identidade visual usa como referência [King LP](https://kingoflanguages.com.br/lp/) e [King](https://site.kingoflanguages.com.br/).
