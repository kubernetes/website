---
title: CompositePodGroup API
weight: 25
no_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="CompositePodGroup" >}}

`CompositePodGroup` — це обʼєкт середовища виконання, який представляє некінцевий вузол у багаторівневій ієрархії робочого навантаження. У той час як [Workload API](/docs/concepts/workloads/workload-api/) визначає статичні шаблони політик планування, обʼєкти `CompositePodGroup` та `PodGroup` є їхніми аналогами в середовищі виконання, які несуть політики та посилання на ієрархію для конкретного екземпляра робочого навантаження.

<!-- body -->

## Що таке CompositePodGroup? {#what-is-a-compositepodgroup}

Ресурс API `CompositePodGroup` є частиною {{< glossary_tooltip text="групи API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3`. Ваш кластер повинен мати цю групу API увімкненою, а також функціональну можливість [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/), перш ніж ви зможете використовувати цей API.

`CompositePodGroup` представляє групування дочірніх груп (які можуть бути обʼєктами `CompositePodGroup` або `PodGroup`). Він несе політики планування, режими розладу, налаштування пріоритету та необовʼязкові топологічні обмеження, які застосовуються колективно до його дочірніх груп.

## Структура API {#api-structure}

`CompositePodGroup` складається з розділу `spec`, який визначає бажану поведінку планування для його дочірніх груп, та підресурсу `status`.

### Політика планування {#scheduling-policy}

Кожен `CompositePodGroup` несе [політику планування](/docs/concepts/workloads/workload-api/policies/) (`basic` або `gang`) у `spec.schedulingPolicy`. Коли контролер робочого навантаження створює `CompositePodGroup`, ця політика копіюється з `CompositePodGroupTemplate` робочого навантаження `Workload` під час створення.

Для політики `gang` на `CompositePodGroup` поле `minGroupCount` визначає мінімальну кількість дочірніх груп, які повинні бути заплановані одночасно:

```yaml
spec:
  schedulingPolicy:
    gang:
      minGroupCount: 2
```

### Посилання на батьківську групу {#parent-group-reference}

Некореневі ресурси `CompositePodGroup` вказують свою батьківську групу за допомогою `spec.parentCompositePodGroupName`. Кореневі обʼєкти `CompositePodGroup` залишають це поле невстановленим.

```yaml
spec:
  parentCompositePodGroupName: root-group-0
```

### Посилання на робоче навантаження {#workload-reference}

Поле `spec.workloadRef` повʼязує `CompositePodGroup` з `CompositePodGroupTemplate` в обʼєкті `Workload`, з якого він був створений.

```yaml
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: replica-group
```

### Статус {#status}

Схема API `CompositePodGroup` включає підресурс `status`. В альфа-версії поле `status` присутнє в типі API, але `kube-scheduler` не оновлює та не заповнює умови стану для обʼєктів `CompositePodGroup`. Відстеження стану для складових груп буде реалізовано в майбутніх випусках.

## Створення CompositePodGroup {#creating-a-compositepodgroup}

Контролери робочого навантаження створюють обʼєкти `CompositePodGroup` автоматично з шаблонів `Workload` під час виконання.

Наступний маніфест створює кореневий `CompositePodGroup` з політикою планування gang, яка вимагає, щоб щонайменше 2 дочірні групи могли бути заплановані одночасно:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: root-group-0
  namespace: default
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
```

Ви можете переглянути ресурси `CompositePodGroup` у вашому кластері:

```shell
kubectl get compositepodgroups
```

Щоб переглянути деталі конкретної складової групи:

```shell
kubectl describe compositepodgroup root-group-0
```

## Як це все повʼязано між собою {#how-it-fits-together}

Взаємозвʼязок між контролерами, Workloads, CompositePodGroups, PodGroups та Podʼами слідує такому шаблону:

1. Контролер робочого навантаження створює `Workload`, який визначає дерево `CompositePodGroupTemplates` та кінцевих `PodGroupTemplates`.
2. Для кожного екземпляра середовища виконання контролер створює кореневий `CompositePodGroup`, дочірні обʼєкти `CompositePodGroup` та кінцеві обʼєкти `PodGroup` у порядку зверху вниз.
3. Контролер створює `Pods`, які посилаються на свій кінцевий `PodGroup` через `spec.schedulingGroup.podGroupName`.

Наступний приклад ілюструє повну ієрархію маніфестів для дворівневого робочого навантаження:

```yaml
apiVersion: scheduling.k8s.io/v1alpha3
kind: Workload
metadata:
  name: hierarchical-workload
  namespace: default
spec:
  compositePodGroupTemplates:
  - name: root
    schedulingPolicy:
      gang:
        minGroupCount: 2
    podGroupTemplates:
    - name: workers-a
      schedulingPolicy:
        gang:
          minCount: 4
    - name: workers-b
      schedulingPolicy:
        gang:
          minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: CompositePodGroup
metadata:
  name: root-group-0
  namespace: default
spec:
  workloadRef:
    workloadName: hierarchical-workload
    templateName: root
  schedulingPolicy:
    gang:
      minGroupCount: 2
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: PodGroup
metadata:
  name: workers-a-0
  namespace: default
spec:
  parentCompositePodGroupName: root-group-0
  workloadRef:
    workloadName: hierarchical-workload
    templateName: workers-a
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha3
kind: PodGroup
metadata:
  name: workers-b-0
  namespace: default
spec:
  parentCompositePodGroupName: root-group-0
  workloadRef:
    workloadName: hierarchical-workload
    templateName: workers-b
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: v1
kind: Pod
metadata:
  name: worker-a-0
  namespace: default
spec:
  schedulingGroup:
    podGroupName: workers-a-0
  containers:
  - name: worker
    image: registry.k8s.io/pause:3.9
```

`Workload` виступає як довготривалий шаблон політики, тоді як ресурси `CompositePodGroup` та `PodGroup` обробляють стан планування під час виконання для кожного екземпляра.

## {{% heading "whatsnext" %}}

* Прочитайте про [життєвий цикл CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/lifecycle/).
* Дізнайтеся про [Workload API](/docs/concepts/workloads/workload-api/) та визначення шаблонів.
* Подивіться, як структуровані кінцеві групи в [PodGroup API](/docs/concepts/workloads/podgroup-api/).
* Прочитайте про [політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/).
* Дізнайтеся про [витіснення з урахуванням навантаження](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
