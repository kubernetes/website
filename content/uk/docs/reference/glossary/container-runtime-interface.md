---
title: Інтерфейс середовища виконання контейнерів
id: container-runtime-interface
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  Основний протокол для взаємодії між kubelet та середовищем виконання контейнерів.

aka:
  - Container Runtime Interface
  - CRI
tags:
  - cri
---

Основний протокол для взаємодії між {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та середовищем виконання контейнерів.

<!--more-->

Інтерфейс середовища виконання контейнерів Kubernetes (CRI) визначає основний протокол [gRPC](https://grpc.io) для взаємодії між [компонентами вузла](/docs/concepts/overview/components/#node-components) {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та {{< glossary_tooltip text="середовищем виконання контейнерів" term_id="container-runtime" >}}.
