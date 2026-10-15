# Desafio técnico: Encontre um Professor

## Solução implementada

API em .NET 8, interface React com TypeScript e testes xUnit. A regra de negócio está em `backend/Professores.Api/BuscaService.cs`, separada da camada HTTP. O arquivo original de professores é copiado para a saída da API e carregado em memória na inicialização.

### Como executar

Requisitos: SDK .NET 8 (qualquer faixa estável a partir de 8.0.100) e Node.js 22.13+ na linha 22, ou 24+, com npm. O `global.json` seleciona a faixa estável mais recente do SDK 8 instalada, sem exigir a versão usada no desenvolvimento.

Na raiz do repositório, inicie a API:

```powershell
dotnet run --project backend/Professores.Api --urls http://localhost:5000
```

Em outro terminal, inicie a tela:

```powershell
cd frontend
npm ci
npm run dev
```

Acesse `http://localhost:5173`. O Vite encaminha `/api` para a API na porta 5000. Para compilar a tela para produção: `npm run build` dentro de `frontend`. O diretório `dist` precisa ser servido por um servidor que também encaminhe `/api` para o backend.

Execute os testes na raiz:

```powershell
dotnet test EncontreUmProfessor.sln --configuration Release
```

### Decisões

- O frontend separa o formulário (`BuscaForm`), os resultados (`BuscaResultados`), os elementos visuais da marca (`Brand` e `Visual`) e o estado HTTP (`useBusca`). O arquivo `App.tsx` compõe a página. O CSS está formatado, com regras de seletores repetidos consolidadas.


- O idioma é comparado sem diferença entre maiúsculas e minúsculas e sem espaços externos. Um idioma não cadastrado retorna uma busca sem professores elegíveis.
- Dias seguem exatamente os identificadores do enunciado; dias repetidos são considerados apenas uma vez.
- O primeiro candidato é arredondado para a próxima hora cheia ou meia hora. A aula precisa terminar dentro da faixa e de um único bloco de disponibilidade.
- A agenda é preparada uma vez na inicialização: horários viram minutos e os intervalos são agrupados por dia. Isso evita converter repetidamente strings durante cada busca. Os dados originais não são modificados. Não foi feito benchmark de desempenho; a otimização reduz trabalho repetido, sem prometer ganho medido.
- Intervalos que apenas se encostam são permitidos. Todos os dias solicitados precisam aceitar o mesmo horário.
- A carga semanal conta todas as aulas cadastradas. Empates usam ordenação de nomes da cultura `pt-BR`.
- Não elegíveis incluem todos os professores excluídos, na ordem original do arquivo, com a prioridade de motivos exigida.
- Entradas semanticamente inválidas retornam HTTP 400 com `mensagem` e uma lista `erros`. JSON malformado, corpo nulo e tipos incorretos também retornam HTTP 400 em JSON, tanto em desenvolvimento quanto em produção.
- A tela apresenta carregamento, erro de comunicação, erros de validação, ausência de resultados e motivos dos professores indisponíveis. Uma nova busca limpa os resultados anteriores.
- O resumo usa os critérios enviados, mesmo que o formulário seja editado depois. Contamos todos os professores analisados e as opções de professor/horário; duas pessoas no mesmo horário são duas opções, não duas vagas garantidas.
- Clicar em um horário mostra uma prévia semanal com início e término em cada dia solicitado. Essa prévia não reserva aulas nem modifica o JSON. A classificação e a ordenação continuam sendo as exigidas no enunciado.
- Os motivos dos não elegíveis são agrupados para facilitar a leitura, mas cada professor continua listado com o texto exato exigido e a prioridade original.
- Uma busca que ultrapasse 15 segundos é cancelada com mensagem para nova tentativa. Respostas antigas não substituem resultados recentes. O cancelamento também ocorre quando a tela é desmontada.

### Limites da entrega

Não há persistência de alterações, autenticação ou agendamento de aulas, pois a aplicação realiza somente a busca solicitada. Há testes unitários da regra de negócio e testes de interface com respostas HTTP simuladas; ainda não há testes automatizados em navegador real. O envio do link ao responsável pelo processo seletivo deve ser feito pela pessoa candidata.

### Verificações

- Backend: 38 casos xUnit. São 24 testes de validação/fronteira, nove combinações de idioma/duração que executam 1.143 buscas no arquivo real e cinco testes adicionais do contrato HTTP.
- As 1.143 buscas percorrem os 127 subconjuntos não vazios da semana, três idiomas e três durações. Um calendário independente, minuto a minuto, confere os oito professores, horários, carga semanal, motivos e ordenação. A faixa dessas buscas é `00:00–23:59`; os testes unitários específicos cobrem faixas menores. Isso não é uma prova para todos os dados possíveis.
- Os testes de regras e dados reais instanciam apenas o serviço, sem subir a API. Os testes HTTP adicionais usam um servidor em memória (`WebApplicationFactory`), sem precisar iniciar um processo ou abrir uma porta.
- Frontend: nove testes com Vitest e Testing Library, cobrindo os estados da interface, prévia semanal fiel à busca enviada, timeout e proteção contra respostas antigas.
- Na pasta `frontend`, execute `npm test`, `npm run build` e `npm run format:check`.
- Os testes de interface usam jsdom e simulam a API e as animações. Eles não substituem a inspeção visual e a integração em um navegador real.
- O workflow `.github/workflows/validacao.yml` executa testes backend, testes frontend, formatação e build em cada push e pull request.

### Como revisar a solução

1. Execute o exemplo em `backend/Professores.Api/buscas.http`: Ana deve retornar `18:00`, e Diego, `18:00`, `18:30` e `19:00`.
2. Busque Inglês em segunda e quarta, com duração de 60 minutos. Confira os motivos de exclusão: Carla está bloqueada, Elisa não tem quarta e Heitor não possui horário comum na faixa `18:00–21:00`.
3. Observe Fábio: seu bloco começa às `18:15`, então o primeiro candidato permitido é `18:30`.
4. Clique em um horário para conferir início e término nos dias selecionados; alterar o formulário só afeta resultados após uma nova busca.

Repositório da solução: https://github.com/Eduzoca/desafio-tecnico-dev-junior, criado a partir do template original. O remoto `origin` aponta para a solução e `upstream` para o enunciado original.

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
- **`USO_DE_IA.md`**, com: quais ferramentas de IA você usou, como usou e **pelo menos um caso em que a IA errou** e como você percebeu. Usar IA é permitido; o que avaliamos é se você entende tudo o que entregou.

## O que vamos avaliar

1. As regras estão corretas, inclusive nos casos de fronteira.
2. Os testes provam as regras.
3. O código é organizado, com a regra de negócio separada da camada HTTP.
4. A validação e o tratamento de erros funcionam.
5. A tela cobre todos os estados.
6. O README é claro e registra as decisões.

Na entrevista técnica, você vai apresentar a solução e fazer uma pequena alteração ao vivo.

### Interações e agenda semanal

Os idiomas são selecionados por controles de rádio. O formulário apresenta a carga semanal e orientações sobre a faixa de horário. Ao selecionar um horário de um professor, a agenda exibe os sete dias da semana, destacando apenas os dias consultados. Os dados são recorrentes: não há datas específicas, reservas ou disciplinas além dos três idiomas do enunciado. Alterar os filtros requer uma nova busca; resultados e agenda continuam vinculados à consulta enviada. O fundo Three.js responde ao mouse com GSAP, sem exigir essa interação para usar a aplicação.
