---
title: Pod
id: pod
date: 2018-04-12
full_link: /docs/concepts/workloads/pods/pod-overview/
short_description: >
  Самый маленький и простой объект в Kubernetes. Под — это набор запущенных контейнеров в кластере.

aka:
tags:
- core-object
- fundamental
---
 Самый маленький и простой объект в Kubernetes. Объект Pod — набор запущенных {{< glossary_tooltip text="контейнеров" term_id="container" >}} в кластере.

<!--more-->

Как правило, один под предназначен для выполнения одного основного контейнера. Он также может запускать вспомогательные («прицепные») sidecar-контейнеры, добавляющие новые функциональные возможности, например, логирование. Поды обычно управляются {{< glossary_tooltip text="деплойментом" term_id="deployment" >}}.
