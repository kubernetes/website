---
title: Функціональні можливості (вилучені)
weight: 15
content_type: concept
---

<!-- overview -->

Ця сторінка містить список функціональних можливостей воріт, які були видалені. Інформація на цій сторінці є довідковою. Вилучені функціональні можливості відрізняються від GA або застарілих тим, що вилучені функціональні можливості більше не розпізнається як дійсний функціональний елемент. Однак, GA'ed або застарілі функціональні ворота все ще розпізнаються відповідними компонентами Kubernetes, хоча вони не можуть спричинити жодних відмінностей у поведінці кластера.

Для отримання інформації про функціональні можливості, які все ще розпізнаються компонентами Kubernetes, зверніться до [Таблиці функціональних можливостей Alpha/Beta](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) або [Таблиці функціональних можливостей Graduated/Deprecated](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features).

## Вилучені функціональні можливості {#feature-gates-that-are-removed}

В наступній таблиці:

- У стовпчику "З" вказано реліз Kubernetes, у якому зʼявилася функція
  або змінено стадію її випуску.
- Стовпець "До", якщо він не порожній, містить останній випуск Kubernetes, у якому
  ви все ще можете використовувати функціональні можливості. Якщо стадія функції "Deprecated"
  або "GA", стовпець "До" вказує на випуск Kubernetes, з якого функцію було вилучено.

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-table show-removed="true" caption="Feature Gates Removed" sortable="true" >}}

## Опис вилучених функціональних можливостей {#descriptions-for-removed-feature-gates}

<!-- Want to edit this list? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-list show-removed="true" >}}
