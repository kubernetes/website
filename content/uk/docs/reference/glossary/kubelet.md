---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/generated/kubelet
# short_description: >
#   An agent that runs on each node in the cluster. It makes sure that containers are running in a pod.
short_description: >
  Агент, що запущений на кожному вузлі кластера. Забезпечує запуск і роботу контейнерів у Pod'ах.

aka:
tags:
- fundamental
- core-object
---
<!-- An agent that runs on each node in the cluster. It makes sure that containers are running in a pod. -->
Агент, що запущений на кожному вузлі кластера. Забезпечує запуск і роботу контейнерів у Pod'ах.

<!--more-->

<!--The kubelet takes a set of PodSpecs that are provided through various mechanisms and ensures that the containers described in those PodSpecs are running and healthy. The kubelet doesn’t manage containers which were not created by Kubernetes.
-->
kubelet використовує специфікації PodSpecs, які надаються за допомогою різних механізмів, і забезпечує працездатність і справність усіх контейнерів, що описані у PodSpecs. kubelet керує лише тими контейнерами, що були створені Kubernetes.
