# Encontre um Professor

API em .NET 8 e interface React com TypeScript para encontrar professores com um horário fixo em comum nos dias escolhidos. Os dados são carregados do arquivo original `professores.json`, que permanece inalterado.

## Como executar

Requisitos: SDK .NET 8 e Node.js 22.13+ na linha 22, ou 24+, com npm.

Na raiz, inicie a API:

```powershell
dotnet run --project backend/Professores.Api --urls http://localhost:5000
```

Em outro terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Acesse `http://localhost:5173`. O Vite encaminha `/api` para a API na porta 5000. Para produção, execute `npm run build`; o servidor de hospedagem também precisa encaminhar `/api` ao backend.

## Funcionalidades

- Busca por idioma, dias, faixa de horário e duração. Cada opção atende ao mesmo início em todos os dias pedidos.
- Agenda dos professores antes dos resultados, com consulta complementar dos sete dias e calendário FullCalendar carregado sob demanda.
- Filtros por nome e horário e ordenação por carga semanal, nome ou quantidade de opções. O painel ocupa uma coluna própria à direita; no celular, aparece acima da lista.
- Prévia semanal ao selecionar um horário, com início e término nos dias consultados. Não há reserva nem alteração de dados.
- Estados de carregamento, validação, erro de comunicação, ausência de resultados e motivos de indisponibilidade.
- Landing responsiva, formulário centralizado na primeira tela do desktop e globo decorativo oculto no celular.

## Organização e decisões

A regra de negócio fica em `backend/Professores.Api/BuscaService.cs`, separada da camada HTTP. A agenda é preparada na inicialização com intervalos em minutos agrupados por dia. Aulas que apenas se encostam são permitidas. A prioridade dos motivos de exclusão e a ordenação inicial seguem o enunciado.

O frontend separa componentes, hooks, cliente HTTP, transformações de domínio e configuração visual. React Bootstrap fornece os controles e o painel lateral; FullCalendar, a agenda; Lucide, os ícones; GSAP e Three.js, as animações. As posições das saudações e os parâmetros do globo ficam centralizados na configuração.

O cliente HTTP valida respostas, distingue erros de rede, contrato, servidor e timeout e cancela buscas após 15 segundos. Respostas antigas não substituem uma consulta recente. Resultados e prévias usam os critérios enviados, mesmo que o formulário seja editado depois.

Os filtros locais não fazem novas consultas. As opções por horário são derivadas da API e podem se sobrepor; não representam reservas. A consulta da semana trata cada dia separadamente e não implica um horário comum entre todos eles. Falhas não são mostradas como indisponibilidade.

A identidade visual usa Poppins local, vermelho, azul-marinho e cartões claros, com referência em [King LP](https://kingoflanguages.com.br/lp/) e [King](https://site.kingoflanguages.com.br/). A cena respeita movimento reduzido, pausa fora da tela e limpa seus recursos ao desmontar. O fundo continua disponível sem WebGL.


## Verificação

Na raiz:

```powershell
dotnet test EncontreUmProfessor.sln --configuration Release
```

Em `frontend`:

```powershell
npm test -- --maxWorkers=1
npm run lint
npm run format:check
npm run build
```

O backend tem 38 casos, incluindo validações, contrato HTTP em memória e 1.143 buscas sobre os dados reais, comparadas com um calendário independente minuto a minuto. O frontend tem 32 testes de regras e interface com respostas simuladas. A validação contínua fica em `.github/workflows/validacao.yml`.

O layout foi conferido no navegador em desktop e celular, incluindo a primeira tela em 1920×916 e 1366×768 e a ausência de sobreposição do painel lateral. Essa inspeção não substitui testes automatizados em navegador real, ainda não incluídos.

## Limites

A aplicação consulta agendas recorrentes. Não implementa autenticação, persistência de alterações ou agendamento de aulas. Os arquivos de relatos complementares ficam disponíveis para preenchimento pela pessoa candidata.

---
## Contexto

Uma escola de idiomas precisa encontrar professores disponíveis para cada novo aluno. O aluno informa o idioma, os dias da semana, a faixa de horário em que pode ter aula e a duração da aula; o sistema devolve os professores que conseguem atendê-lo e em quais horários.

Você vai construir uma API em C# que resolve essa busca e uma tela em React para usá-la.

**Estimativa:** 6 a 8 horas de trabalho. O prazo de entrega é informado no convite do processo seletivo.

## Como começar

1. Clique em **Use this template** para criar o seu próprio repositório a partir deste.
2. Desenvolva a solução no seu repositório.
3. Envie o link pelo mesmo canal em que recebeu o desafio. O repositório precisa estar público ou com acesso liberado para quem enviou o desafio.

## Dados

Os professores estão em [`professores.json`](professores.json). Carregue-os desse arquivo; você pode mantê-los em memória.

Cada professor tem:

| Campo | Descrição |
|---|---|
| `id`, `nome` | Identificação do professor |
| `idiomas` | Idiomas que ele ensina |
| `agendaBloqueada` | Quando `true`, o professor não pode receber novos alunos |
| `disponibilidade` | Blocos semanais em que ele pode dar aula (`dia`, `inicio`, `fim`) |
| `aulasMarcadas` | Aulas que ele já tem na semana (`dia`, `inicio`, `duracaoMinutos`) |

**Garantias dos dados:**

- Horários no formato `HH:mm`.
- Nada atravessa a meia-noite.
- Blocos de disponibilidade de um mesmo dia nunca se sobrepõem nem se encostam.
- Dias da semana: `segunda`, `terca`, `quarta`, `quinta`, `sexta`, `sabado`, `domingo`.

## O que construir

### 1. API (C# e .NET 8)

`POST /api/professores/busca`

**Requisição:**

```json
{
  "idioma": "Espanhol",
  "dias": ["segunda"],
  "inicioFaixa": "18:00",
  "fimFaixa": "20:00",
  "duracaoMinutos": 60
}
```

**Resposta:**

```json
{
  "professores": [
    { "id": 1, "nome": "Ana",   "aulasNaSemana": 1, "horarios": ["18:00"] },
    { "id": 4, "nome": "Diego", "aulasNaSemana": 1, "horarios": ["18:00", "18:30", "19:00"] }
  ],
  "naoElegiveis": [
    { "id": 2, "nome": "Bruno", "motivo": "Não ensina o idioma" }
  ]
}
```

A lista `naoElegiveis` do exemplo está resumida a um item.

### 2. Regras da busca

1. O professor precisa ensinar o idioma pedido.
2. Professor com agenda bloqueada não aparece.
3. **O aluno quer horário fixo:** o mesmo horário de início precisa estar livre em **todos** os dias pedidos.
4. A aula precisa caber **inteira** dentro de um bloco de disponibilidade do professor e dentro da faixa pedida pelo aluno.
5. A aula não pode se sobrepor a uma aula já marcada. **Encostar é permitido:** uma aula que termina às 19:00 permite outra começando às 19:00.
6. A aula só pode começar em hora cheia ou meia hora (`:00` ou `:30`).
7. **Ordenação:** primeiro quem tem menos aulas marcadas na semana; em caso de empate, ordem alfabética do nome. Os horários de cada professor vêm em ordem crescente.

**Diferencial:** preencher `naoElegiveis` com o motivo de cada professor que ficou de fora, usando exatamente um destes textos:

- `Não ensina o idioma`
- `Agenda bloqueada`
- `Sem horário em comum nos dias pedidos`

Quando houver mais de um motivo, informe o primeiro nessa ordem.

### 3. Validação

A API responde **400** com uma mensagem clara quando:

- o idioma está vazio;
- nenhum dia foi informado;
- algum dia é inválido;
- algum horário está fora do formato `HH:mm`;
- o fim da faixa é igual ou anterior ao início;
- a duração é diferente de 30, 60 ou 90 minutos.

### 4. Tela (React, de preferência com TypeScript)

- **Formulário:** idioma (Inglês, Espanhol ou Francês), dias da semana, faixa de horário e duração.
- **Resultado:** cada professor com os horários possíveis e a quantidade de aulas na semana.
- **Estados:** carregando, nenhum professor encontrado, falha de comunicação com a API e erros de validação devolvidos pela API.
- **Diferencial:** mostrar os professores que ficaram de fora e o motivo.

### 5. Testes

No mínimo **5 testes automatizados em C#** sobre as regras da busca. Os testes não devem depender de subir a API.

## Se algo não estiver coberto

Se encontrar uma situação que as regras não cobrem, decida, implemente e registre a decisão no README. Isso faz parte da avaliação.

## Entrega

- **`README.md`** no seu repositório, com: como rodar a API e a tela, as decisões que você tomou e o que ficou faltando.

## O que vamos avaliar

1. As regras estão corretas, inclusive nos casos de fronteira.
2. Os testes provam as regras.
3. O código é organizado, com a regra de negócio separada da camada HTTP.
4. A validação e o tratamento de erros funcionam.
5. A tela cobre todos os estados.
6. O README é claro e registra as decisões.

Na entrevista técnica, você vai apresentar a solução e fazer uma pequena alteração ao vivo.
