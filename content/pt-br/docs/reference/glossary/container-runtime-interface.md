---
title: Container runtime interface
id: container-runtime-interface
date: 2019-03-07
full_link: /docs/concepts/architecture/cri
short_description: >
    O principal protocolo para a comunicação entre o kubelet e os agentes de execução de contêineres.

aka:
tags:
- cri
---

O principal protocolo para a comunicação entre o kubelet e os agentes de execução de contêineres.

<!--more-->

A interface do agente de execução de contêiner do Kubernetes (CRI) define o principal protocolo [gRPC](https://grpc.io) para a comunicação entre os [componentes de cluster](/docs/concepts/overview/components/#node-components)
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} e o {{< glossary_tooltip text="agente de execução de contêiner" term_id="container-runtime" >}}.
