---
título: Contêiner de aplicações
id: app-container
data: 2023-01-24
full_link:
short_description: >
   Um contêiner usado para executar parte de uma carga de trabalho. Pode ser comparado com um contêiner init.

akaa:
tags:
- workload
---
  Contêineres de aplicações (ou app containers) são os {{< glossary_tooltip text="containers" term_id="container" >}} de um {{< glossary_tooltip text="pod" term_id="pod" >}} que são iniciados após qualquer {{< glossary_tooltip text="init containers" term_id="init-container" >}} terem sido concluídos.

<!--more-->

Um contêiner init permite separar os detalhes de inicialização que são importantes para o
{{< glossary_tooltip text="workload" term_id="workload" >}}, e que não precisam continuar em execução
assim que o contêiner de aplicação for iniciado.
Se um pod não tiver nenhum contêiner init configurado, todos os contêineres nesse pod serão contêineres de aplicação.
