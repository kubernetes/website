---
title: Contêiner de aplicações
id: app-container
data: 2023-01-24
full_link:
short_description: >
   Um contêiner usado para executar parte de uma carga de trabalho. Pode ser comparado com um contêiner de inicialização (init container).

aka:
tags:
- workload
---
Contêineres de aplicações são os {{< glossary_tooltip text="contêineres" term_id="container" >}} de um {{< glossary_tooltip text="Pod" term_id="pod" >}} que são inicializados depois que os {{< glossary_tooltip text="contêineres de inicialização" term_id="init-container" >}} tenham sido concluídos.

<!--more-->

Um contêiner de inicialização permite separar os detalhes de inicialização que são importantes para a
{{< glossary_tooltip text="carga de trabalho" term_id="workload" >}}, e que não precisam continuar em execução
assim que o contêiner de aplicação for iniciado.
Se um Pod não tiver nenhum contêiner inicialização configurado, todos os contêineres nesse Pod serão contêineres de aplicação.
