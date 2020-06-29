---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
# short_description: >
#   `kube-proxy` is a network proxy that runs on each node in the cluster.
short_description: >
  `kube-proxy` - це мережеве проксі, що запущене на кожному вузлі кластера.

aka:
tags:
- fundamental
- networking
---
<!-- [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) is a
network proxy that runs on each node in your cluster, implementing part of
the Kubernetes {{< glossary_tooltip term_id="service">}} concept.
-->
[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) є мережевим проксі, що запущене на кожному вузлі кластера і реалізує частину концепції Kubernetes {{< glossary_tooltip term_id="service" text="Service">}}.

<!--more-->

<!--kube-proxy maintains network rules on nodes. These network rules allow
network communication to your Pods from network sessions inside or outside
of your cluster.
-->
kube-proxy відповідає за мережеві правила на вузлах. Ці правила обумовлюють підключення по мережі до ваших Pod'ів всередині чи поза межами кластера.

<!--kube-proxy uses the operating system packet filtering layer if there is one
and it's available. Otherwise, kube-proxy forwards the traffic itself.
-->
kube-proxy використовує шар фільтрації пакетів операційної системи, за наявності такого. В іншому випадку kube-proxy скеровує трафік самостійно.
