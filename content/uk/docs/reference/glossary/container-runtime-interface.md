---
title: Інтерфейс контейнерного середовища
id: container-runtime-interface
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  Основний протокол для взаємодії між kubelet та контейнерним середовищем.

aka:
tags:
  - cri
---

Основний протокол для взаємодії між {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та контейнерним середовищем.

<!--more-->

Інтерфейс контейнерного середовища Kubernetes (CRI) визначає основний протокол [gRPC](https://grpc.io) для взаємодії між [компонентами вузла](/docs/concepts/overview/components/#node-components) {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} та {{< glossary_tooltip text="контейнерним середовищем" term_id="container-runtime" >}}.
