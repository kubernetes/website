---
title: Шаблон Operator
id: operator-pattern
date: 2019-05-21
full_link: /docs/concepts/extend-kubernetes/operator/
short_description: >
  Спеціалізований контролер, призначений для управління власним ресурсом.

aka:
- Operator
- Operator pattern
tags:
- architecture
---

[Шаблон Operator](/docs/concepts/extend-kubernetes/operator/) — це системний дизайн, який повʼязує контролер з одним чи кількома власними ресурсами.

<!--more-->

Ви можете розширити функціонал Kubernetes, додаючи контролери до свого кластера, поза вбудованими контролерами, які поставляються разом з самим Kubernetes.

Якщо запущений застосунок діє як контролер та має доступ до API для виконання завдань відносно власного ресурсу, що визначений в панелі управління, це приклад шаблону Operator.
