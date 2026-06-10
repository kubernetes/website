---
title: Життєвий цикл PodGroup
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

[PodGroup](/docs/concepts/workloads/podgroup-api/) планується як одиниця яка захищена від передчасного видалення, поки її Podʼи все ще працюють.

<!-- body -->

## Власність та життєвий цикл {#ownership-and-lifecycle}

`PodGroups` належать контролеру Workload, який їх створив (наприклад, Job), через стандартні `ownerReferences`. Коли обʼєкт-власник видаляється, `PodGroups` автоматично прибираються сміттєзбирачем.

Імена `PodGroup` повинні бути унікальними в межах простору імен і відповідати дійсним
[DNS-піддоменам](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

## Порядок створення {#creation-order}

Контролери повинні створювати обʼєкти в такому порядку:

1. `Workload` — шаблон політики планування.
2. `PodGroup` — екземпляр під час виконання.
3. `Pods` — з `spec.schedulingGroup.podGroupName`, що вказує на `PodGroup`.

Якщо `PodGroup` включає `podGroupTemplateRef`, який вказує на `Workload`, що не існує (або видаляється), сервер API відхиляє запит на створення `PodGroup`. Вказаний `Workload` повинен існувати перед створенням `PodGroup`.

Якщо `Pod` посилається на `PodGroup`, який ще не існує, `Pod` залишається в стані очікування. Планувальник автоматично ставить `Pod` у чергу для планування, як тільки `PodGroup` буде створено.

## Захист від видалення {#deletion-protection}

`PodGroup` не може бути повністю видалено, поки будь-які його Podʼи все ще працюють. Спеціальний фіналізатор забезпечує блокування видалення, поки всі `Pod`, що посилаються на `PodGroup`, не досягнуть кінцевої фази (`Succeeded` або `Failed`).

## PodGroups, що керуються контролером та користувачем {#controller-managed-and-user-managed-podgroups}

У більшості випадків контролери робочих навантажень (наприклад, Job) створюють `PodGroups` автоматично (керуються контролером). Контролер визначає `podGroupName` для кожного Podʼа під час створення, аналогічно тому, як `DaemonSet` встановлює спорідненість вузлів для кожного Podʼа.

Якщо вам потрібно більше контролю над іменуванням та життєвим циклом, ви можете безпосередньо створювати об’єкти `PodGroup` та самостійно встановлювати `spec.schedulingGroup.podGroupName` у своїх шаблонах Pod (керовані користувачем). Це надає вам повний контроль над створенням та іменуванням `PodGroup`.

## Обмеження {#limitations}

* Всі Podʼи в `PodGroup` повинні використовувати той самий `.spec.schedulerName`. Якщо виявлено невідповідність, планувальник відхиляє всі Podʼи в групі як такі, що не можуть бути заплановані.
* Поле `spec.schedulingPolicy.gang.minCount` у PodGroup є незмінним. Після створення ви не можете змінити мінімальну кількість Podʼів, які повинні бути заплановані, щоб група була прийнята.
* Поле `spec.schedulingGroup` у Pod є незмінним. Після встановлення Pod не може перейти до іншої PodGroup.
* Максимальна кількість `PodGroupTemplates` в одному `Workload` становить 8.
* Стан `PodGroupScheduled` відображає лише результат початкової спроби планування. Після встановлення стану `True` планувальник не оновлює його, якщо Podʼи пізніше зазнають невдачі, будуть виселені або припинять роботу.

## {{% heading "whatsnext" %}}

* Ознайомтеся з оглядом та структурою [API PodGroup](/docs/concepts/workloads/podgroup-api/).
* Дізнайтеся про [Workload API](/docs/concepts/workloads/workload-api/), який надає `PodGroupTemplates`.
* Дізнайтеся, як Podʼи посилаються на свою PodGroup через поле [scheduling group](/docs/concepts/workloads/pods/scheduling-group/).
* Ознайомтеся з алгоритмом [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
* Прочитайте [політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/), щоб дізнатися більше про `basic` та `gang`.
