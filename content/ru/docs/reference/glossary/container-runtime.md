---
title: Container Runtime
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
  Иcполняемая среда контейнеров — это программное обеспечение, предназначенное для запуска контейнеров.

aka:
tags:
- fundamental
- workload
---
Фундаментальный компонент, который позволяет Kubernetes эффективно запускать контейнеры. Он отвечает за управление исполнением и жизненным циклом контейнеров в рамках Kubernetes.

<!--more-->

Kubernetes поддерживает различные среды для запуска контейнеров: {{< glossary_tooltip term_id="containerd" >}},
{{< glossary_tooltip term_id="cri-o" >}} и любые реализации [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
