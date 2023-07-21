---
title: Container Runtime Interface
id: container-runtime-interface
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  Основной протокол для связи между kubelet'ом и исполняемой средой контейнеров.

aka:
tags:
  - cri
---

Container Runtime Interface (CRI) — это основной протокол для связи между kubelet'ом и исполняемой средой контейнеров.

<!--more-->

Интерфейс Kubernetes Container Runtime Interface (CRI) задает основной [gRPC-протокол](https://grpc.io), на базе которого осуществляется коммуникация между [компонентами кластера](/docs/concepts/overview/components/#node-components): {{< glossary_tooltip text="kubelet'ом" term_id="kubelet" >}} и {{< glossary_tooltip text="исполняемой средой" term_id="container-runtime" >}}.
