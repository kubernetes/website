---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` — сетевой прокси, работающий на каждом узле в кластере.

aka:
tags:
- fundamental
- networking
---
 kube-proxy — сетевой прокси, работающий на каждом {{< glossary_tooltip text="узле" term_id="node">}} в кластере и реализующий часть концепции {{< glossary_tooltip text="сервиса" term_id="service">}} Kubernetes.

<!--more-->

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) поддерживает сетевые правила на узлах. Эти правила разрешают сетевое взаимодействие с вашимии подами из сетевых сессий внутри и снаружи кластера.

kube-proxy использует уровень фильтрации пакетов операционной системы, если он доступен. В ином случае kube-proxy сам перенаправляет трафик.
