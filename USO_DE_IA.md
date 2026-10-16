# Uso de IA

Usei o Codex para me ajudar no desenvolvimento deste projeto. A ferramenta participou bastante da implementação, incluindo geração e refatoração de código, testes, interface e documentação.

## Como usei

Pedi ajuda para construir a API em .NET, integrar a tela em React, criar os filtros e a agenda e organizar o código. Também usei a ferramenta para executar testes, ajustar o layout e preparar os commits e a publicação no GitHub.

Fui orientando as mudanças pelos resultados que via no site e enviando capturas de tela quando algo não ficava como eu esperava. A imagem da estudante no hero também foi gerada com IA e depois convertida para WebP.

## Erros que precisei apontar

- A página ficou com informação demais. Pedi para simplificar a apresentação e usar frameworks para facilitar a manutenção.
- O globo ficou muito grande e forte no fundo. Pedi para diminuir o tamanho e a opacidade.
- Ao mudar o grid dos resultados, o hero também foi alterado. Precisei explicar que queria manter a posição dele.
- A remoção dos elementos de disponibilidade ficou ambígua. Enviei uma captura mostrando exatamente o que deveria sair e pedi para manter o outro filtro.
- O pedido de filtro vertical foi entendido de forma diferente. Esclareci que os selects deveriam ficar um abaixo do outro e pedi um ícone de filtro.
- A agenda não estava na ordem que eu queria. Pedi para colocá-la antes dos resultados.
- A imagem do hero ficou desproporcional e com um corte ruim. Enviei capturas e pedi para ajustar o tamanho e encostar a imagem no final da seção.
- O formulário ficou sem espaço embaixo. Pedi mais espaçamento e alinhamento ao centro, preservando a posição do hero.
- O balão “Bonjour!” ficou escondido. Pedi para colocá-lo à direita, onde pudesse aparecer.
- Ao abrir o site no desktop, a composição não cabia como eu esperava. Enviei outra captura e pedi para ajustar a altura e centralizar os elementos.
- A versão de celular ainda precisava de ajustes. Pedi adaptação do layout e que o globo não aparecesse nesses dispositivos.
- O painel de filtros precisava abrir à direita sem cobrir os resultados. Precisei reforçar esse comportamento.
- O primeiro texto de uso de IA não incluía um erro concreto, exigido pelo desafio. Depois que anexei o enunciado original e pedi a revisão, isso foi corrigido.

Esses problemas mostraram que eu não podia considerar o resultado pronto só porque o código compilava. Precisei conferir o site e explicar os ajustes que queria.

## Outros problemas encontrados nas verificações

Quando pedi para comparar o JSON com o anexo original, a conferência mostrou que o conteúdo era igual, mas as quebras de linha eram diferentes. A afirmação anterior de que o arquivo estava intacto não era exata nesse sentido. O arquivo foi ajustado para ficar igual byte a byte, e foi criado um teste para conferir isso.

Na primeira conversão da imagem para WebP, a comparação de pixels falhou. O Codex detectou o problema e refez a conversão com uma opção que preserva também os valores dos pixels transparentes. Essa falha foi encontrada pela ferramenta, sem que eu precisasse apontá-la.

Também houve verificações bloqueadas por permissões do ambiente e demora na inicialização dos testes. Elas foram executadas novamente para conferir o resultado.

## Testes e limites

Usei o Codex para criar e executar testes de backend e frontend, além de lint, formatação e build. Também conferi o layout pelas telas apresentadas durante o desenvolvimento. Ainda não há testes automatizados de ponta a ponta em navegador real.

O arquivo original de professores foi mantido na entrega, sem adicionar professores ou horários para favorecer os resultados. A aplicação consulta disponibilidade, mas não reserva aulas.

## Histórico e responsabilidade

Pedi ajuda para reorganizar os commits, usar mensagens em minúsculas e definir datas e horários intercalados. Por isso, esses horários não representam fielmente quando cada parte foi desenvolvida. Também pedi a remoção dos comentários do código do histórico.

Sei que usar a ferramenta não substitui entender a solução. Sou responsável pela entrega e por explicar as regras, as decisões e os limites do projeto. Não afirmo ter revisado manualmente cada linha gerada.
