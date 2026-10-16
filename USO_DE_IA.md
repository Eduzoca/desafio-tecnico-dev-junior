# Uso de IA no desenvolvimento

Desenvolvi este projeto com assistência significativa do Codex, incluindo geração e refatoração de código, testes, documentação e ajustes de interface. O apoio não se limitou a sugestões pontuais ou autocompletar.

## Onde houve assistência

- Implementação e revisão das regras de busca, validações e contrato da API em .NET.
- Construção e refatoração da interface React e TypeScript, integração HTTP, filtros e agenda semanal.
- Ajustes de responsividade e composição do hero a partir de solicitações e capturas de tela.
- Elaboração de testes e execução das verificações de backend e frontend.
- Escrita e revisão da documentação, organização dos commits e publicação no GitHub.
- Uso de uma imagem gerada por IA no hero, posteriormente convertida para WebP.

## Condução do trabalho

Defini o comportamento desejado e orientei as revisões: preservação do JSON original, preferência por frameworks, simplificação da apresentação, posição dos filtros, agenda antes dos resultados e adaptações para celular.

Usei o Codex para implementar alterações e executar verificações durante as iterações. Enviei capturas de tela para orientar as correções visuais. Este relato descreve a assistência registrada; não afirmo ter revisado manualmente cada linha.

## Erros que identifiquei e pedi para corrigir

Reuni aqui as correções registradas nos meus pedidos e capturas de tela. Separei os problemas que apontei das falhas detectadas pelas verificações do Codex.

| Caso | O que precisou ser corrigido | Como foi percebido e orientado |
| --- | --- | --- |
| Excesso de informação | A apresentação precisava ser mais limpa e o código mais fácil de editar, com uso de frameworks. | Pedi simplificação e reforcei a preferência por frameworks. A interface foi reorganizada com componentes e configurações separados. |
| Globo desproporcional | O globo estava grande e visualmente forte. | Pedi para reduzir seu tamanho em 20% e diminuir a opacidade. Os parâmetros visuais foram ajustados. |
| Escopo do grid | A alteração pretendida era na área de encontrar professores, mas o hero também precisou ser restaurado. | Esclareci: “deixe o hero como estava”. O trabalho passou a distinguir a composição do hero da organização dos resultados. |
| Remoção do elemento errado | Era necessário remover apenas a visualização de professores disponíveis por horário, preservando o outro filtro. | Enviei uma captura para delimitar o elemento e reforcei “o outro filtro mantenha”. A visualização foi retirada e os filtros de resultados foram mantidos. |
| Interpretação de filtro vertical | A orientação não estava atendida: o pedido se referia aos controles/selects do filtro na vertical. | Precisei esclarecer “o select do filtro que devia ficar na vertical” e pedir um ícone. Os controles foram organizados verticalmente com identificação visual. |
| Ordem do conteúdo | A agenda precisava aparecer primeiro na área de consulta. | Pedi explicitamente “a agenda dos professores deve ser o primeiro”. A agenda passou a anteceder a lista de resultados. |
| Posição e proporção da figura | O hero apareceu desproporcional, com a imagem terminando antes do limite inferior e dando aparência de pernas cortadas. | Enviei capturas de tela e pedi ajustes de posicionamento para mostrar o problema. Foram revistos tamanho e ancoragem da imagem na base da seção. O arquivo não contém o corpo inteiro: o ajuste de composição não cria pés ausentes da imagem. |
| Espaço e alinhamento do formulário | O formulário ficou sem respiro inferior e a composição precisava ser centralizada sem deslocar indevidamente o hero. | Enviei uma captura e pedi aumentar a seção e centralizar o formulário. Foram ajustados altura, alinhamento e espaçamentos. |
| Saudação escondida | O balão “Bonjour!” não estava visível na posição desejada. | Identifiquei o balão no pedido e indiquei a direita. Sua posição foi ajustada na configuração visual. |
| Primeira tela incompleta | Ao abrir o site, a composição não estava toda visível e centralizada na tela de desktop apresentada. | Enviei uma nova captura mostrando a situação real. Foram ajustadas a altura útil após o cabeçalho e a compactação do formulário em telas mais baixas. Isso não significa que toda a página deva caber sem rolagem em qualquer dispositivo. |
| Adaptação para celular | O resultado anterior ainda exigia tratamento específico para telas pequenas, inclusive retirada do globo. | Pedi suporte a celular e depois que o globo desaparecesse nesses dispositivos. Foram adicionados ajustes responsivos e ocultação da cena nesse tamanho. |
| Lado do painel de filtros | O filtro precisava abrir à direita e ocupar espaço próprio, preservando a visão dos resultados. | Especifiquei a posição e pedi que o painel não sobrepusesse os resultados. O desktop usa uma coluna à direita; no celular, os controles seguem o fluxo acima da lista. |
| Documentação de IA incompleta | O primeiro preenchimento do relato não incluía o caso de erro obrigatório no enunciado original. | Anexei o README do desafio e pedi a conferência. A comparação revelou a omissão; o relato passou a explicar erros, percepção e correção. |

Também pedi para remover a exportação CSV, mudar referências de estilo, preservar o JSON, retirar comentários e reorganizar commits. Essas foram decisões de escopo ou restrições que defini, sem classificá-las todas como defeitos do código.

## Falhas detectadas nas verificações do Codex

**Integridade do arquivo original:** o agente havia informado que o JSON permanecia intacto, mas a comparação com o anexo mostrou hashes diferentes. O conteúdo JSON era igual; a cópia local usava CRLF e o anexo usava LF. Depois que pedi igualdade com o original, o arquivo foi copiado byte a byte, protegido por `.gitattributes` e coberto por teste SHA-256. A afirmação anterior de integridade era imprecisa para igualdade de bytes.

**Conversão para WebP:** a primeira tentativa usou apenas `lossless=True`, mas a comparação dos pixels RGBA falhou. O encoder não preservou valores RGB ocultos em pixels transparentes. A conversão foi refeita com `exact=True`, e a comparação dos pixels decodificados passou. O arquivo final ficou cerca de 39% menor. A falha foi detectada pelo agente, sem que eu precisasse apontá-la.

**Execução de verificações:** houve tentativas de build bloqueadas pelas permissões do ambiente e inicialização de worker de testes que excedeu o tempo limite. As verificações foram repetidas com a permissão necessária ou de forma isolada, sem tratar falha de infraestrutura como aprovação nem como defeito comprovado da aplicação.

## Verificação e limites

Foram executados testes de backend e frontend, lint, verificação de formatação e build, além de inspeção visual no navegador. Testes aprovados não garantem ausência de defeitos. Não há suíte automatizada de ponta a ponta em navegador real.

O arquivo `professores.json` foi preservado. Os resultados são calculados a partir desses dados, sem professores ou horários fictícios adicionados para favorecer a demonstração.

## Histórico do repositório

O histórico foi reorganizado com assistência do agente em commits temáticos, com mensagens em minúsculas e datas e horários definidos a meu pedido. Os horários dos commits não devem ser interpretados como registro cronológico fiel das sessões de desenvolvimento nem como evidência de trabalho sem assistência. Comentários de código também foram removidos do histórico publicado a meu pedido.

## Minha responsabilidade pela entrega

O uso da ferramenta não substitui meu entendimento da solução. Sou responsável por revisar a entrega e este relato e por explicar as regras de disponibilidade, as decisões, os testes e os limites do projeto durante a avaliação.
