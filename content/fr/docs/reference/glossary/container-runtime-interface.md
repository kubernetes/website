---
title: Interface du Runtime de Conteneur
id: container-runtime-interface
full_link: /fr/docs/concepts/architecture/cri
short_description: >
  Le protocole principal pour la communication entre le kubelet et le Runtime de Conteneur.

aka:
tags:
  - cri
---

Le protocole principal pour la communication entre le {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} et le Runtime de Conteneur.

<!--more-->

L'Interface du Runtime de Conteneur (CRI) de Kubernetes définit le protocole principal [gRPC](https://grpc.io) pour la communication entre les [composants du nœud](/docs/concepts/architecture/#composants-du-nœud) {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} et le {{< glossary_tooltip text="runtime de conteneur" term_id="container-runtime" >}}.

