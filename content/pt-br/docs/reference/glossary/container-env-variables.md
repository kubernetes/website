---
title: Variáveis de Ambiente de Contêineres
id: container-env-variables
date: 2021-11-20
full_link: /pt-br/docs/concepts/containers/container-environment/
short_description: >
  Variáveis de ambiente de contêineres são pares nome=valor que trazem informações úteis para os contêineres rodando dentro de um Pod.

aka: 
tags:
- fundamental
---
 Variáveis de ambiente de contêineres são pares nome=valor que trazem informações úteis para os contêineres rodando dentro de um {{< glossary_tooltip text="pod" term_id="Pod" >}}

<!--more-->

Variáveis de ambiente de contêineres fornecem informações requeridas pela aplicação conteinerizada, junto com informações sobre recursos importantes para o {{< glossary_tooltip text="contêiner" term_id="container" >}}. Por exemplo, detalhes do sistema de arquivos, informações sobre o contêiner, e outros recursos do cluster, como endpoints de serviços.
