---
title: Інтерфейс середовища виконання контейнера
id: cri
full_link: /docs/concepts/architecture/cri
short_description: >
  Протокол для звʼязку між kubelet та локальним середовищем виконання контейнера.

aka:
- Container Runtime Interface
- CRI
tags:
  - fundamental
---

Основний протокол для взаємодії між {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та середовищем виконання контейнерів.

<!--more-->

Інтерфейс виконання контейнерів Kubernetes (CRI) визначає основний [gRPC](https://grpc.io) протокол для звʼязку між
[компонентами вузла](/docs/concepts/architecture/#node-components) {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та {{< glossary_tooltip text="середовищем виконання контейнерів" term_id="container-runtime" >}}.
