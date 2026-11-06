---
title: Container Runtime Interface (CRI)
id: cri
full_link: /docs/concepts/architecture/cri
short_description: >
  Протокол для звʼязку між kubelet і локальним середовищем виконання контейнерів.

aka:
- CRI
tags:
  - fundamental
---

Основний протокол для взаємодії між {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та середовищем виконання контейнерів.

<!--more-->

Container Runtime Interface (CRI) у Kubernetes визначає основний протокол [gRPC](https://grpc.io) для звʼязку між
[компонентами вузла](/docs/concepts/architecture/#node-components) {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та {{< glossary_tooltip text="середовищем виконання контейнерів" term_id="container-runtime" >}}.
