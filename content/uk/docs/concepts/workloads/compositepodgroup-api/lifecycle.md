---
title: Життєвий цикл CompositePodGroup
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="CompositePodGroup" >}}

[CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/) представляє некінцевий вузол у багаторівневій ієрархії `PodGroup`. На відміну від ресурсів `PodGroup`, ресурси `CompositePodGroup` не містять Podʼів безпосередньо. Натомість вони підтримують ієрархію дочірніх обʼєктів `CompositePodGroup` та `PodGroup` і несуть політики планування, які застосовуються до їхніх дочірніх груп.

<!-- body -->

## Власність та прибирання сміття {#ownership-and-garbage-collection}

Обʼєкт `CompositePodGroup` разом зі своїми дочірніми ресурсами `CompositePodGroup` та `PodGroup` належить контролеру робочого навантаження, який його створив, через `ownerReferences` Kubernetes. Коли обʼєкт-власник робочого навантаження видаляється, каскадне прибирання сміття автоматично видаляє повʼязану ієрархію груп.

Імена `CompositePodGroup` повинні бути унікальними в межах простору імен і відповідати дійсним [DNS-піддоменам](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

## Порядок створення {#creation-order}

Щоб забезпечити правильне розвʼязання ієрархії та планування, контролери робочого навантаження створюють ресурси в порядку зверху вниз:

1. **`Workload`**: визначає статичні шаблони (`CompositePodGroupTemplates` та `PodGroupTemplates`).
2. **Кореневий `CompositePodGroup`**: створюється з `spec.workloadRef`, що вказує на кореневий шаблон у `Workload`.
3. **Дочірні `CompositePodGroups` та `PodGroups`**: створюються зверху вниз. Кожна дочірня група вказує свого батька за допомогою `spec.parentCompositePodGroupName`, а свій шаблон — за допомогою `spec.workloadRef`.
4. **`Pods`**: створюються з `spec.schedulingGroup.podGroupName`, що вказує на їхній кінцевий `PodGroup`.

Якщо група посилається на батьківський `CompositePodGroup`, який не існує, або якщо Pod посилається на `PodGroup`, який ще не створено, планувальник відкладає планування, доки всі батьківські ресурси в ієрархії не існуватимуть.

## Обмеження та правила перевірки {#limitations-and-validation-rules}

- **Узгоджене імʼя планувальника**: всі Podʼи в усій ієрархії `CompositePodGroup` повинні використовувати той самий `spec.schedulerName`. Якщо виявлено невідповідність, планувальник відхиляє ієрархію як таку, що не може бути запланована.
- **Узгоджений пріоритет**: всі Podʼи в усій ієрархії `CompositePodGroup` повинні вказувати те саме значення `spec.priority`, яке має дорівнювати пріоритету, вказаному кореневою групою. Якщо виявлено невідповідність, планувальник відхиляє ієрархію як таку, що не може бути запланована.
- **Узгоджена політика витіснення**: всі Podʼи в усій ієрархії `CompositePodGroup` повинні використовувати той самий `spec.preemptionPolicy`. Крім того, коли функціональну можливість [PodGroupPreemptionPolicy](/docs/reference/command-line-tools-reference/feature-gates/podgroup-preemption-policy/) увімкнено, політика витіснення кореневої групи повинна дорівнювати політиці, вказаній Podʼами. Якщо виявлено невідповідність, планувальник відхиляє ієрархію як таку, що не може бути запланована.
- **Максимальна глибина вкладеності**: ієрархія шаблонів груп підтримує максимальну глибину 4 рівні.
- **Обмеження списку**: максимальна кількість дочірніх `CompositePodGroupTemplates` та `PodGroupTemplates` на будь-якому рівні `Workload` становить 8.
- **Незмінна кількість груп gang**: поле `spec.schedulingPolicy.gang.minGroupCount` на `CompositePodGroup` є незмінним після створення.
- **Незмінні посилання на ієрархію**: `spec.parentCompositePodGroupName` на групах та `spec.schedulingGroup` на Podʼах є незмінними після встановлення.

## {{% heading "whatsnext" %}}

- Прочитайте огляд [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/).
- Дізнайтеся про [Workload API](/docs/concepts/workloads/workload-api/) та визначення шаблонів.
- Подивіться, як структуровані кінцеві групи в [PodGroup API](/docs/concepts/workloads/podgroup-api/).
- Прочитайте про [політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/).
- Дізнайтеся про [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
