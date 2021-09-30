---
title: Среда выполнения контейнера
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
  Среда выполнения контейнера — это программа, предназначенная для выполнения контейнеров.

aka:
tags:
- fundamental
- workload
---
 Среда выполнения контейнера — это программа, предназначенная для выполнения контейнеров.

<!--more-->

Kubernetes поддерживает несколько сред для запуска контейнеров: {{< glossary_tooltip term_id="docker">}},
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
и любая реализация [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
