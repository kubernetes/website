---
title: Kubelet
id: kubelet
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kubelet
short_description: >
  Агент, запущений на кожному вузлі кластера. Забезпечує запуск і роботу контейнерів у Podʼах.

aka:
tags:
- fundamental
- core-object
---

Агент, запущений на кожному {{< glossary_tooltip text="вузлі" term_id="node" >}} кластера. Забезпечує запуск і роботу контейнерів в Podʼах.

<!--more-->

[kubelet](/docs/reference/command-line-tools-reference/kubelet/) використовує специфікації PodSpecs, які надаються за допомогою різних механізмів, і забезпечує працездатність і справність усіх контейнерів, що описані у PodSpecs. kubelet керує лише тими контейнерами, що були створені Kubernetes.
