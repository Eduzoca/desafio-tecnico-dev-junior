# Uso de IA

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
