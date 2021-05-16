---
title: Agente de execução de contêiner
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
  O agente de execução de contêiner é o software responsável por executar os contêineres.

aka:
tags:
- fundamental
- workload
---
 O agente de execução (_runtime_) de contêiner é o software responsável por executar os contêineres.

<!--more-->

O Kubernetes suporta diversos agentes de execução de contêineres: {{< glossary_tooltip term_id="docker">}}, {{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}}, e qualquer implementação do [Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
