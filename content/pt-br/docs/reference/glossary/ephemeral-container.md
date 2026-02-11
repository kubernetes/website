---
title: Contêiner Efêmero
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Um tipo de contêiner que você pode executar temporariamente dentro de um Pod

aka:
tags:
- fundamental
---
Um tipo de {{< glossary_tooltip term_id="container" text="contêiner" >}} que você pode executar temporariamente dentro de um {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Se você deseja investigar um Pod que está em execução com problemas, você pode adicionar um contêiner efêmero a esse Pod e realizar diagnósticos.
Contêineres efêmeros não possuem garantias de {{< glossary_tooltip text="recurso" term_id="infrastructure-resource" >}} ou alocação,
e você não deve usá-los para executar qualquer parte da carga de trabalho em si.

Contêineres efêmeros não são suportados por {{< glossary_tooltip text="Pods estáticos" term_id="static-pod" >}}.
