---
title: Порушення
id: disruption
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Подія, що призводить до виходу з ладу Podʼів
aka:
- Disruption
tags:
- fundamental
---

Порушення — це події, які призводять до виходу з ладу одного чи кількох {{< glossary_tooltip term_id="pod" text="Podʼів" >}}. Порушення має наслідки для {{< glossary_tooltip text="ресурсів" term_id="api-resource" >}} керування робочими навантаженнями, таких як {{< glossary_tooltip term_id="deployment" >}}, які залежать від уражених Podʼів.

<!--more-->

Якщо ви, як оператор кластера, знищуєте Pod, який належить застосунку, Kubernetes називає це _добровільним порушенням_. Якщо Pod виходить з ладу через відмову вузла або збій, що впливає на ширшу зону відмов, Kubernetes називає це _невідворотним порушенням_.

Докладніше дивіться в розділі [Порушення](/docs/concepts/workloads/pods/disruptions/).
