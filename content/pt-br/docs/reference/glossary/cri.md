---
title: Container runtime interface (CRI)
id: container-runtime-interface
date: 2019-03-07
full_link: /docs/concepts/architecture/cri
short_description: >
    O principal protocolo para comunicação entre o kubelet e os agentes de execução de contêineres.


aka:
tags:
- fundamental
---
O principal protocolo para comunicação entre o kubelet e os agentes de execução de contêineres.

<!--more-->

A interface de execução de contêiner (CRI) do Kubernetes define o principal protocolo [ gRPC ](https://grpc.io) para a comunicação entre os [ componentes de cluster ](/docs/concepts/overview/components.md)