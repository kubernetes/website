---
title: Функціональні можливості (вилучені)
weight: 15
content_type: concept
---

<!-- overview -->

Ця сторінка містить список вилучених функціональних можливостей. Інформація на цій сторінці є довідковою. Вилучена функціональна можливість відрізняється від функціональної можливості, що досягла стадії GA або є застарілою, тим, що вилучена функціональна можливість більше не розпізнається як дійсна. Однак, функціональні можливості, що досягли стадії GA або є застарілими, все ще розпізнаються відповідними компонентами Kubernetes, хоча вони не можуть спричинити жодних відмінностей у поведінці кластера.

Для отримання інформації про функціональні можливості, які все ще розпізнаються компонентами Kubernetes, зверніться до [таблиці функціональних можливостей Alpha/Beta](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) або [таблиці стабільних/застарілих функціональних можливостей](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features).

### Вилучені функціональні можливості {#feature-gates-that-are-removed}

У таблиці нижче:

- Стовпець "З" містить випуск Kubernetes, у якому функцію введено
  або змінено її стадію випуску.
- Стовпець "До", якщо він не порожній, містить останній випуск Kubernetes, у якому
  ви все ще можете використовувати функціональну можливість. Якщо стадія функції "Deprecated"
  або "GA", стовпець "До" вказує на випуск Kubernetes, з якого функцію було вилучено.

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-table show-removed="true" caption="Вилучені функціональні можливості" sortable="true" >}}

## Опис вилучених функціональних можливостей {#descriptions-for-removed-feature-gates}

<!-- Want to edit this list? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-list show-removed="true" >}}
