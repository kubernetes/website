---
title: Иcполняемая среда контейнеров
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
  Иcполняемая среда контейнеров — это программа, предназначенная для запуска контейнеров.

aka:
tags:
- fundamental
- workload
---
 Иcполняемая среда контейнера — это программа, предназначенная для запуска контейнера в Kubernetes.

<!--more-->

Kubernetes поддерживает различные среды для запуска контейнеров: {{< glossary_tooltip term_id="docker">}},
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
и любые реализации [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
