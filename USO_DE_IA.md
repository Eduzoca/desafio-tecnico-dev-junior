# Uso de IA

A seção de depoimentos “Histórias reais” foi removida a pedido da pessoa usuária. A foto principal foi substituída por uma imagem criada pela ferramenta integrada de geração de imagens, inspirada na composição da referência original, com fundo transparente. O prompt completo está em [docs/IMAGEM_HERO.md](docs/IMAGEM_HERO.md).

Foi usado o Codex para implementar a API em C#/.NET 8, o frontend em React/TypeScript, os testes automatizados e a documentação. O agente leu o enunciado e os dados, escreveu a implementação e executou testes e verificações de integração.

Na adaptação visual, o Codex inspecionou o site oficial no navegador para identificar a paleta, as fontes, os ícones e os movimentos. Incorporou imagens oficiais localmente e adaptou a composição para o formulário de busca. A logo branca precisou de um fundo azul-marinho para manter sua legibilidade.

## Erro observado e corrigido

Na primeira implementação da leitura do arquivo, a IA tentou desserializar `professores.json` diretamente como uma lista. Ao inspecionar o arquivo, foi identificado que a raiz é um objeto com a propriedade `professores`. A leitura foi corrigida para usar um objeto `DadosProfessores` contendo essa lista. A chamada HTTP com os dados reais foi usada para verificar a integração.

Os testes e a compilação ajudam a verificar a entrega, mas não substituem a leitura e compreensão do código pela pessoa candidata.

## Aprofundamento dentro do enunciado

Na revisão visual seguinte, o Codex reorganizou o CSS por seções, refinou o hero em três colunas, os estados do formulário e os cartões de resultados, mantendo Poppins local, a paleta da marca e Lucide. A seção “O caminho” explica o fluxo de busca com a hierarquia editorial da referência. Essa revisão foi validada por testes e build, com a inspeção visual em navegador ainda pendente pelo bloqueio previamente relatado.

O Codex preparou índices de agenda por dia, adicionou resumo de resultados e prévia semanal, proteção contra respostas antigas e timeout, testes com todos os dados reais e validação contínua no GitHub. Os nove cenários parametrizados do arquivo real executam 1.143 buscas e comparam a solução com um calendário independente de minutos livres. Não foram alterados os professores nem o contrato de resposta pedido.

Um segundo erro ocorreu ao padronizar JSON inválido: somente `UseStatusCodePages` não tratava o caso no ambiente de desenvolvimento, onde a Minimal API lançava `BadHttpRequestException`. Três testes HTTP falharam ao tentar ler a resposta como JSON. Foi configurado `ThrowOnBadRequest = false` para que o tratamento de HTTP 400 também funcionasse nesse ambiente; os testes passaram após a correção.

Na revisão final, o Codex flexibilizou a seleção do SDK .NET 8, ampliou os testes de fronteira, separou o frontend em componentes e um hook, consolidou o CSS e adicionou testes de interface com respostas HTTP simuladas. O acesso ao navegador foi bloqueado pela ferramenta durante essa revisão; a nova verificação ficou limitada aos testes, à compilação e à inspeção do código. O agente também criou o repositório da solução a partir do template e preparou a publicação Git autorizada pela pessoa usuária.

A pedido da pessoa usuária, Motion foi substituído por GSAP nas entradas da interface. Three.js renderiza anéis decorativos nas cores da marca; GSAP anima suas rotações e posições. A implementação inclui carregamento sob demanda, descarte de recursos, pausa por visibilidade e alternativa em CSS sem WebGL ou com movimento reduzido. Referências técnicas: https://gsap.com/docs/v3/GSAP/gsap.context()/ e https://threejs.org/manual/pages/cleanup.html.

Foram adicionados feedback de preferências, seleção visual de idiomas, estado de carregamento, reação do fundo 3D ao mouse e agenda semanal recorrente por professor. Os dias não consultados são explicitamente identificados. O contrato da API, a ordenação e os idiomas do desafio foram preservados; um teste de interface verifica a troca de idioma, o envio à API e a seleção da agenda.

Foi implementada consulta complementar dos sete dias com o endpoint existente, sem alterar o backend nem deduzir disponibilidade de dias não consultados. Foram adicionados testes de dias independentes e falha da consulta semanal. As bandeiras são SVGs locais e o globo Three.js usa meridianos, paralelos e balões de saudações desenhados em canvas; a limpeza descarta também texturas e materiais.

Na revisão de compactação, a grade manual da semana foi substituída pelo FullCalendar v6 (React + DayGrid), com seleção de professor e estado explícito de abrir/recolher. As bandeiras passaram a usar country-flag-icons, limitadas a 14 px e animadas dentro dos controles. Configurações repetidas foram centralizadas em config.ts. O globo foi movido do fundo para uma região própria, com contraste maior, câmera ajustada ao espaço e ícone de fallback quando WebGL não é usado. Testes verificam recolher/reabrir sem nova consulta e troca de professor sem misturar horários.

Na revisão focada autorizada, o Codex moveu o globo para trás da modelo, separou a cena em funções de construção e ciclo de vida e centralizou parâmetros. Extraiu a consulta semanal para um hook, criou um cliente HTTP compartilhado com validação em runtime e tipou os dias da semana. Adicionou testes de respostas malformadas, timeout, cancelamento, troca de filtros, agregação sem mutação e descarte idempotente do renderer. ESLint e regras de hooks foram incluídos no CI. A inspeção visual foi tentada, mas a ferramenta de navegador falhou ao iniciar com erro de arquivo ausente.

Após a pessoa usuária fornecer uma captura com balões cortados e sobrepostos ao texto, a largura da cena foi limitada à coluna da foto. O enquadramento passou a considerar uma esfera contendo globo e balões, incluindo a animação; os balões foram reduzidos e aproximados do globo. Três testes verificam a projeção dos cantos dos balões em diferentes proporções de tela. A validação visual em navegador continua pendente.

Foi acrescentado um efeito de três bandeiras de 10 px durante 0,5 segundo ao clicar na opção de idioma, inclusive quando ela já está selecionada. O efeito fica dentro do controle, não captura eventos e é desativado com movimento reduzido. Cliques repetidos reiniciam a animação com limpeza do contexto GSAP anterior.

Após nova referência visual, o globo saiu da coluna da modelo e passou para o fundo compartilhado do hero. O canvas maior atravessa visualmente as regiões da foto e do texto, mas fica abaixo de todas as colunas. Os balões usam menor opacidade para preservar a leitura.
