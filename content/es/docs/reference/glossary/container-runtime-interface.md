---
title: Container Runtime Interface
id: container-runtime-interface
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  El protocolo principal para la comunicación entre el kubelet y el Container Runtime.

aka:
tags:
  - cri
---

El protocolo principal para la comunicación entre el _kubelet_ y el _Container Runtime_.

<!--more-->

La _Kubernetes Container Runtime Interface_ (CRI) define el principal protocolo de
[gRPC](https://grpc.io) para la comunicación entre los
[componentes de clúster](/docs/concepts/overview/components/#componentes-de-nodo)
_{{<glossary_tooltip text="kubelet" term_id="kubelet">}}_ y
_{{<glossary_tooltip text="container runtime" term_id="container-runtime">}}_.
