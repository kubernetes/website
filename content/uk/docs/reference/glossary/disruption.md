---
title: Розлад
id: розлад
date: 2019-09-10
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Подія, що призводить до виходу з ладу Pod(ів)
aka:
tags:
- fundamental
---
Розлади — це події, які призводять до виходу з ладу одного чи кількох {{< glossary_tooltip term_id="pod" text="Podʼів" >}}. Розлад має наслідки для ресурсів робочого навантаження, таких як {{< glossary_tooltip term_id="deployment" >}}, які покладаються постраждалі Podʼі.

<!--more-->

Якщо ви, як оператор кластера, знищуєте Pod, який належить застосунку, Kubernetes називає це _добровільним розладом_. Якщо Pod виходить з ладу через відмову вузла або відмову, яка впливає на широку зону відмов, Kubernetes називає це _невільним розладом_.

Докладніше дивіться в розділі [Розлади](/docs/concepts/workloads/pods/disruptions/).
