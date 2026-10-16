# Uso de IA no desenvolvimento

O projeto foi desenvolvido com assistência significativa do Codex, incluindo geração e refatoração de código, testes, documentação e ajustes de interface. O apoio não se limitou a sugestões pontuais ou autocompletar.

## Onde houve assistência

- Implementação e revisão das regras de busca, validações e contrato da API em .NET.
- Construção e refatoração da interface React e TypeScript, integração HTTP, filtros e agenda semanal.
- Ajustes de responsividade e composição do hero a partir de solicitações e capturas de tela.
- Elaboração de testes e execução das verificações de backend e frontend.
- Escrita e revisão da documentação, organização dos commits e publicação no GitHub.
- Uso de uma imagem gerada por IA no hero, posteriormente convertida para WebP.

## Condução do trabalho

As solicitações humanas definiram o comportamento desejado e orientaram as revisões: preservação do JSON original, preferência por frameworks, simplificação da apresentação, posição dos filtros, agenda antes dos resultados e adaptações para celular.

O agente implementou alterações e executou verificações durante as iterações. As correções visuais também foram orientadas por capturas de tela enviadas na conversa. Este relato descreve a assistência registrada e não afirma que cada linha foi revisada manualmente pela pessoa candidata.

## Casos em que a IA errou

Durante os ajustes do hero, a composição proposta pelo agente deixou a figura cortada e o formulário sem espaço inferior suficiente. O problema foi percebido pela pessoa candidata ao abrir a página e enviar capturas de tela. A correção envolveu rever a altura da seção, o alinhamento da imagem e os espaçamentos do formulário, com novas verificações em desktop e celular.

Também houve um erro verificável na conversão da imagem para WebP: a primeira tentativa usou apenas `lossless=True`, mas a comparação dos pixels RGBA falhou. O encoder não preservou os valores RGB ocultos em pixels transparentes. A conversão foi refeita com `exact=True`; a comparação byte a byte dos pixels decodificados passou, preservando também a transparência. O arquivo final ficou cerca de 39% menor.

## Verificação e limites

Foram executados testes de backend e frontend, lint, verificação de formatação e build, além de inspeção visual no navegador. Testes aprovados não garantem ausência de defeitos. Não há suíte automatizada de ponta a ponta em navegador real.

O arquivo `professores.json` foi preservado. Os resultados são calculados a partir desses dados, sem professores ou horários fictícios adicionados para favorecer a demonstração.

## Histórico do repositório

O histórico foi reorganizado com assistência do agente em commits temáticos, com mensagens em minúsculas e datas e horários definidos a pedido da pessoa candidata. Os horários dos commits não devem ser interpretados como registro cronológico fiel das sessões de desenvolvimento nem como evidência de trabalho sem assistência. Comentários de código também foram removidos do histórico publicado a pedido da pessoa candidata.

## Responsabilidade pela entrega

A ferramenta não substitui o entendimento da solução. Cabe à pessoa candidata revisar a entrega, conferir este relato e conseguir explicar as regras de disponibilidade, as decisões, os testes e os limites do projeto durante a avaliação.
