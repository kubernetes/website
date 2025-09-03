---
title: Узел
id: node
date: 2018-04-12
full_link: /docs/concepts/architecture/nodes/
short_description: >
  Узел — рабочая машина в Kubernetes.

aka:
tags:
- fundamental
---
 Узел (node) — рабочая машина в Kubernetes.

<!--more-->

Рабочий узел может быть как виртуальной, так и физической машиной, в зависимости от кластера. У него есть локальные демоны или сервисы, необходимые для запуска {{< glossary_tooltip text="подов" term_id="pod" >}}, а сам он управляется управляющим слоем (control plane). Демоны на узле включают в себя {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} и исполняемую среду для контейнеров, реализующую {{< glossary_tooltip text="CRI" term_id="cri" >}} (например, {{< glossary_tooltip term_id="docker" >}}).

В ранних версиях Kubernetes узлы назывались «миньонами» (Minions).
