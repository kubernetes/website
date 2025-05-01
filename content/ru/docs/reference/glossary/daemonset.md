---
title: DaemonSet
id: daemonset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/daemonset
short_description: >
  Гарантирует, что копия пода выполняется на множестве узлов кластера.

aka:
tags:
- fundamental
- core-object
- workload
---
 Гарантирует, что копия {{< glossary_tooltip text="пода" term_id="pod" >}} выполняется на множестве узлов {{< glossary_tooltip text="кластера" term_id="cluster" >}}.

<!--more-->

Используется для развертывания системных демонов, таких как сборщики логов и агенты мониторинга, которые, как правило, должны работать на каждом {{< glossary_tooltip text="узле" term_id="node" >}}.
