---
title: Групове планування
content_type: concept
weight: 70
---

<!-- overview -->
{{< feature-state feature_gate_name="GangScheduling" >}}

Групове планування забезпечує, щоб група Podʼів була запланована з дотриманням принципу "все або нічого". Якщо кластер не може вмістити всю групу (або визначену мінімальну кількість Podʼів), жоден з Podʼів не привʼязується до вузла.

Ця функція залежить від [PodGroup API](/docs/concepts/workloads/podgroup-api/). Переконайтесь, що увімкнено [функціональну можливість `GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload) та {{< glossary_tooltip text="групу API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha2` у кластері.

<!-- body -->

## Як це працює {#how-it-works}

Коли втулок `GangScheduling` увімкнено, планувальник змінює життєвий цикл Podʼів, що належать до [PodGroup](/docs/concepts/workloads/podgroup-api/), для якої встановлено [політику планування](/docs/concepts/workloads/workload-api/policies/) типу `gang`. Для кожної PodGroup цей процес відбувається за такими кроками:

1. Планувальник утримує Podʼи у фазі `PreEnqueue`, доки:
   * Вказаний обʼєкт PodGroup існує.
   * Кількість Podʼів, створених для PodGroup, принаймні дорівнює `minCount`.

   Podʼи не потрапляють до активної черги планування, доки не будуть виконані обидві умови.

2. Після досягнення кворуму планувальник намагається знайти розміщення для всіх Podʼів у групі. Він використовує [цикл планування PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/), щоб прийняти одне, атомарне рішення щодо планування. Втулок `GangScheduling` реалізує розширювану точку `Permit`, яка оцінюється для кожного Podʼа, що підлягає плануванню. Це використовується для визначення, чи задовольняє обмеження `minCount`, порівнюючи кількість успішно розміщених Podʼів з значенням `minCount`.

3. Якщо планувальник знаходить придатні місця для розміщення щонайменше `minCount` подів, він дозволяє всім їм привʼязатися до призначених їм вузлів. Якщо він не може знайти достатньо місць для задоволення вимоги `minCount`, жоден з подів не планується. Натомість вони переміщуються до черги подів які неможливо запланувати на вузли, щоб чекати на звільнення ресурсів кластера, що дозволяє тим часом планувати інші робочі навантаження.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [PodGroup API](/docs/concepts/workloads/podgroup-api/) та його [життєвий цикл](/docs/concepts/workloads/podgroup-api/lifecycle/).
* Дізнайтеся про [політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/).
* Дізнайтеся про [планування PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
