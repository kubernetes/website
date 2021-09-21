---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  Um agente de execução leve de contêineres criado especificamente para o Kubernetes

aka:
tags:
- tool
---
Uma ferramenta que permite você usar agentes de execução de contêineres OCI com o CRI do Kubernetes

<!--more-->

CRI-O é uma implementação do {{< glossary_tooltip term_id="cri" >}}
que permite usar agentes de execução de  {{< glossary_tooltip text="contêiner" term_id="container" >}}
compatíveis com as [especificações](https://www.github.com/opencontainers/runtime-spec)  da Open Container Initiative (OCI).

Usar o CRI-O permite ao Kubernetes utilizar-se de qualquer agente de execução compatível
com o OCI para executar {{< glossary_tooltip text="Pods" term_id="pod" >}}, e obter imagens
de contêineres de registros remotos.
