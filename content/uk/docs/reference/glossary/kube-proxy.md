---
title: kube-proxy
id: kube-proxy
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` — це мережевий проксі, що запущений на кожному вузлі кластера.

aka:
tags:
- fundamental
- networking
---

kube-proxy є мережевим проксі, що запущений на кожному вузлі кластера і реалізує частину концепції Kubernetes {{< glossary_tooltip term_id="service" text="Service">}}.

<!--more-->

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) забезпечує підтримання мережевих правил на вузлах. Ці правила обумовлюють підключення мережею до ваших Podʼів всередині чи поза межами кластера.

kube-proxy використовує шар фільтрації пакетів операційної системи, за його наявності. В іншому випадку kube-proxy скеровує трафік самостійно.
