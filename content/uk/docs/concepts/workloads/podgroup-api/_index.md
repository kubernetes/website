---
title: "PodGroup API"
weight: 25
no_list: true
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

PodGroup — це об’єкт середовища виконання, який представляє групу Podʼів, запланованих для роботи як єдине ціле. У той час як [Workload API](/docs/concepts/workloads/workload-api/) визначає шаблони політик планування, PodGroups є їхніми аналогами в середовищі виконання, які містять як саму політику, так і стан планування для конкретного екземпляра цієї групи.

<!-- body -->

## Що таке PodGroup? {#what-is-a-podgroup}

Ресурс API PodGroup є частиною {{< glossary_tooltip text="групи API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha2` і ваш кластер повинен мати цю групу API увімкненою, а також функціональну можливість [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload) , перш ніж ви зможете використовувати цей API.

PodGroup — це самостійна одиниця планування. Вона визначає групу Podʼів, які повинні бути заплановані разом, містить політику планування, що регулює розміщення, і фіксує стан виконання цього рішення про планування.

## Структура API {#api-structure}

PodGroup складається з розділів `spec`, який визначає бажану поведінку планування, та `status`, який відображає поточний стан планування.

### Політика планування {#scheduling-policy}

Кожна PodGroup має [політику планування](/docs/concepts/workloads/workload-api/policies/) (`basic` або `gang`) у `spec.schedulingPolicy`. Коли контролер робочого навантаження створює PodGroup, ця політика копіюється з PodGroupTemplate робочого навантаження під час створення. Для автономних PodGroup ви встановлюєте політику безпосередньо.

```yaml
spec:
  schedulingPolicy:
    gang:
      minCount: 4
```

### Посилання на шаблон {#template-reference}

Необов’язкове поле `spec.podGroupTemplateRef` пов’язує PodGroup з PodGroupTemplate у робочому навантаженні, з якого вона була створена. Це корисно для спостереження та інструментів.

```yaml
spec:
  podGroupTemplateRef:
    workload:
      workloadName: training-policy
      podGroupTemplateName: worker
```

### Запитування пристроїв DRA для PodGroup {#requesting-dra-devices-for-a-podgroup}

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

{{< glossary_tooltip text="Пристрої" term_id="device" >}} доступні через {{< glossary_tooltip text="Динамічне виділення ресурсів (DRA)" term_id="dra" >}} можуть бути запитані PodGroup через поле `spec.resourceClaims`:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

{{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} пов’язані з PodGroups можуть бути спільно використані всіма Podʼами, що належать до групи. Замість того, щоб мати посилання на кожен окремий Pod у `status.reservedFor` ResourceClaim, достатньо посилання на PodGroup, і будь-яка кількість Podʼів у тій самій PodGroup може спільно використовувати ResourceClaim. ResourceClaims також можуть бути створені з {{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}} для кожної PodGroup, що дозволяє пристроям, виділеним для кожного створеного ResourceClaim, бути спільно використаними Podʼами в кожній PodGroup.

За докладною інформацією та більш повним прикладом звертайтесь до [документації DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#workload-resource-claims).

### Статус {#status}

Планувальник оновлює `status.conditions`, щоб повідомити, чи група була успішно запланована. Основною умовою є `PodGroupScheduled`, яка є `True`, коли всі необхідні Podʼи були розміщені, і `False`, коли планування не вдається.

{{< note >}}
Стан `PodGroupScheduled` відображає лише початкове рішення планувальника. Планувальник не оновлює його, якщо Podʼи пізніше зазнають невдачі або будуть виселені. Детальніше див. у розділі [Обмеження](/docs/concepts/workloads/podgroup-api/lifecycle/#limitations).
{{< /note >}}

Див. сторінку [Життєвий цикл PodGroup](/docs/concepts/workloads/podgroup-api/lifecycle/#podgroup-status) для повного списку станів та причин.

## Створення PodGroup {#creating-a-podgroup}

Ресурс API PodGroup є частиною {{< glossary_tooltip text="групи API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha2` . (і ваш кластер повинен мати цю групу API увімкненою, а також функціональну можливість [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload), перш ніж ви зможете використовувати цей API).

Наступний маніфест створює PodGroup з політикою планування gang, яка вимагає, щоб щонайменше 4 Podʼа могли бути заплановані одночасно:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-worker-0
  namespace: default
spec:
  schedulingPolicy:
    gang:
      minCount: 4
```

Ви можете переглянути PodGroups у вашому кластері:

```shell
kubectl get podgroups
```

Щоб побачити повний стан, включаючи стани планування:

```shell
kubectl describe podgroup training-worker-0
```

## Як це працює {#how-it-fits-together}

Взаємозвʼязок між контролерами, Workloads, PodGroups та Podʼами слідує такому шаблону:

1. Контролер Workload створює Workload, який визначає PodGroupTemplates з політиками планування.
2. Для кожного екземпляра середовища виконання контролер створює PodGroup з одного з PodGroupTemplates Workload.
3. Контролер створює Podʼи, які посилаються на PodGroup через поле `spec.schedulingGroup.podGroupName`.

Контролер [Job](/docs/concepts/workloads/controllers/job/) є єдиним вбудованим контролером Workload, який наразі слідує цьому шаблону. Власні контролери можуть реалізувати той самий потік для своїх власних типів Workload.

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: Workload
metadata:
  name: training-policy
spec:
  podGroupTemplates:
  - name: worker
    schedulingPolicy:
      gang:
        minCount: 4
---
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-worker-0
spec:
  podGroupTemplateRef:
    workload:
      workloadName: training-policy
      podGroupTemplateName: worker
  schedulingPolicy:
    gang:
      minCount: 4
---
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
spec:
  schedulingGroup:
    podGroupName: training-worker-0
  containers:
  - name: ml-worker
    image: training:v1
```

Workload виступає як довготривале визначення політики, тоді як PodGroups обробляють тимчасовий стан виконання для кожного екземпляра. Це розділення означає, що оновлення стану для окремих PodGroups не конфліктує з спільним обʼєктом Workload.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [життєвий цикл PodGroup](/docs/concepts/workloads/podgroup-api/lifecycle/) детально.
* Прочитайте про [Workload API](/docs/concepts/workloads/workload-api/), який надає PodGroupTemplates.
* Дізнайтеся, як Podʼи посилаються на свій PodGroup через поле [scheduling group](/docs/concepts/workloads/pods/scheduling-group/).
* Зрозумійте алгоритм [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
