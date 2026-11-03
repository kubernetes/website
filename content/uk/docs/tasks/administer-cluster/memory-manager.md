---
title: Керування політиками управління памʼяттю на вузлі
content_type: task
min-kubernetes-server-version: v1.32
weight: 145
math: true
---

<!-- overview -->

{{< feature-state feature_gate_name="MemoryManager" >}}

Менеджер памʼяті Kubernetes (*Memory Manager*) забезпечує гарантоване виділення памʼяті (та великих сторінок) для Podʼів у {{< glossary_tooltip text="класі QoS" term_id="qos-class" >}} `Guaranteed`.

Менеджер памʼяті використовує протокол генерації підказок, щоб визначити найбільш відповідну спорідненість NUMA для Podʼа. Менеджер памʼяті передає ці підказки спорідненості центральному менеджеру (*менеджеру топології*). На основі підказок і політики менеджера топології Pod відхиляється або допускається на вузол.

Крім того, менеджер памʼяті забезпечує, що памʼять, яку запитує Pod, виділяється з мінімальної кількості NUMA-вузлів.

Докладніше про ресурси памʼяті для Podʼів читайте в [Призначення ресурсів памʼяті контейнерам і Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}} Якщо ви використовуєте старішу версію Kubernetes, перегляньте документацію для версії Kubernetes, яку ви використовуєте.

### Необхідні умови для вирівнювання ресурсів {#resource-alignment-prerequisites}

Щоб вирівняти ресурси памʼяті з іншими запитуваними ресурсами в специфікації Podʼа:

- менеджер CPU повинен бути увімкнений, і на вузлі повинна бути налаштована відповідна політика менеджера CPU. Див. [керування політиками управління CPU](/docs/tasks/administer-cluster/cpu-management-policies/);
- менеджер топології повинен бути увімкнений, і на вузлі повинна бути налаштована відповідна політика менеджера топології. Див. [керування політиками управління топологією](/docs/tasks/administer-cluster/topology-manager/).

### Підтримка Windows {#windows-support}

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

Підтримку Windows можна увімкнути за допомогою функціональної можливості `WindowsCPUAndMemoryAffinity`, і вона потребує підтримки в середовищі виконання контейнерів. У Windows підтримуються лише політики [None](#policy-none) та [BestEffort](#policy-best-effort).

## Як працює менеджер памʼяті? {#how-does-the-memory-manager-operate}

Для вузлів Linux менеджер памʼяті пропонує гарантоване виділення памʼяті (та великих сторінок) для Podʼів у класі QoS Guaranteed. Щоб одразу ввести менеджер памʼяті в роботу, дотримуйтеся вказівок у розділі [Налаштування менеджера памʼяті](#memory-manager-configuration), а потім підготуйте та розгорніть Pod `Guaranteed`, як показано в розділі [Розміщення Podʼа в класі QoS Guaranteed](#placing-a-pod-in-the-guaranteed-qos-class).

Менеджер памʼяті є постачальником підказок і надає підказки топології менеджеру топології, який потім вирівнює запитані ресурси згідно з цими підказками топології. У Linux він також застосовує `cgroups` (зокрема `cpuset.mems`) для Podʼів. Повну діаграму процесу допуску та розгортання Podʼа показано нижче:

![Менеджер памʼяті в процесі допуску та розгортання Podʼа](/images/docs/memory-manager-diagram.svg)

Під час цього процесу менеджер памʼяті оновлює свої внутрішні лічильники, що зберігаються в [Node Map та Memory Maps][2], для управління гарантованим виділенням памʼяті.

Менеджер памʼяті активується під час запуску kubelet, якщо адміністратор вузла налаштовує `reservedMemory` для kubelet (розділ [Налаштування зарезервованої памʼяті](#reserved-memory-flag)). У цьому випадку kubelet оновлює свою мапу вузла, щоб відобразити це резервування.

Коли налаштована політика `Static`, ви **повинні** налаштувати зарезервовану памʼять для вузла (наприклад, за допомогою поля конфігурації `reservedMemory` у конфігурації kubelet).

Важливою темою в контексті роботи менеджера памʼяті є управління групами NUMA. Щоразу, коли запит памʼяті Podʼа перевищує місткість одного вузла NUMA, менеджер памʼяті намагається створити групу, що складається з кількох вузлів NUMA і має розширену місткість памʼяті.

## Налаштування менеджера памʼяті {#memory-manager-configuration}

Інші менеджери вже мають бути налаштовані (див. [передумови вирівнювання ресурсів](#resource-alignment-prerequisites)). Встановіть у полі конфігурації `memoryManagerPolicy` в [конфігурації kubelet]({{< relref "/docs/reference/config-api/kubelet-config.v1beta1" >}}) назву обраної вами [політики](#policies).

За бажанням можна зарезервувати певний обсяг памʼяті для системних процесів або процесів kubelet, щоб підвищити стабільність вузла (розділ [Налаштування зарезервованої памʼяті](#reserved-memory-flag)).

### Політики {#policies}

Менеджер памʼяті Kubernetes надає три політики. Ви можете вибрати політику за допомогою поля конфігурації `memoryManagerPolicy` у конфігурації kubelet; значення, доступні в Kubernetes {{< skew currentVersion >}}, такі:

- [`None`](#policy-none) (стандартно)
- [`Static`](#policy-static) (тільки Linux)
- [`BestEffort`](#policy-best-effort) (тільки Windows)

#### Політика None {#policy-none}

Це стандартна політика, і вона жодним чином не впливає на виділення памʼяті. Вона працює так, ніби менеджера памʼяті взагалі немає.

Політика `None` повертає стандартну підказку топології. Ця спеціальна підказка означає, що постачальник підказок (Hint Provider; у цьому випадку менеджер памʼяті) не має переваг щодо спорідненості NUMA з жодним ресурсом.

#### Політика Static {#policy-static}

{{< feature-state feature_gate_name="MemoryManager" >}}

**Ця політика підтримується тільки в Linux.**

У випадку `Guaranteed` Podʼа політика менеджера памʼяті `Static` повертає підказки топології, що стосуються набору NUMA-вузлів, де памʼять може бути гарантованою, та резервує памʼять, оновлюючи внутрішній обʼєкт [NodeMap][2].

У випадку Podʼа `BestEffort` або `Burstable` політика менеджера памʼяті `Static` повертає стандартну підказку топології, оскільки немає запиту на гарантовану памʼять, і не резервує памʼять у внутрішньому обʼєкті [NodeMap][2].

Ця політика підтримується тільки в Linux.

#### Політика BestEffort {#policy-best-effort}

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

**Ця політика підтримується лише у Windows.**

У Windows призначення вузлів NUMA працює інакше, ніж у Linux. Немає механізму, який би гарантував, що доступ до памʼяті надходить лише з певного вузла NUMA. Натомість планувальник операційної системи Windows вибирає найоптимальніший вузол NUMA на основі призначених CPU. Windows може використовувати інші вузли NUMA, якщо планувальник Windows вважатиме їх оптимальними.

Політика відстежує обсяг доступної та запитаної памʼяті за допомогою внутрішньої _node map_. Менеджер памʼяті докладає максимум зусиль, щоб забезпечити достатній обсяг памʼяті на вузлі NUMA, перш ніж призначити ресурс. Це означає, що в більшості випадків призначення памʼяті має працювати так, як вказано.

## Налаштування зарезервованої памʼяті {#reserved-memory-flag}

Як адміністратор, ви можете налаштувати загальний обсяг зарезервованої памʼяті для вузла. Це попередньо налаштоване значення згодом використовується для обчислення реального обсягу памʼяті [node allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable), доступної для Podʼів.

Планувальник Kubernetes використовує інформацію про памʼять, доступну для розподілу, для оптимізації [планування](/docs/concepts/scheduling-eviction/) Podʼів. Механізм _node allocatable_ зазвичай використовується адміністраторами вузлів для резервування системних ресурсів вузлів K8s для процесів kubelet або операційної системи, щоб забезпечити стабільність вузлів.

Відповідні налаштування kubelet включають `kubeReserved`, `systemReserved` та `reservedMemory`. Налаштування `reservedMemory` дозволяє розділити загальний обсяг зарезервованої памʼяті та розподілити його між багатьма вузлами NUMA.

Ви вказуєте список резервувань памʼяті, розділених комами, різних типів памʼяті для кожного вузла NUMA. Ви також можете вказати резервування, що охоплюють кілька вузлів NUMA, використовуючи крапку з комою як роздільник.

Менеджер памʼяті не використовуватиме цю зарезервовану памʼять для виконання робочих навантажень контейнерів.

Наприклад, якщо у вас є NUMA-вузол "NUMA0" з доступною памʼяттю 10GiB, і ви налаштовуєте `reservedMemory` для резервування `1Gi` (памʼяті) для NUMA0, менеджер памʼяті припускає, що для Podʼів доступно лише 9GiB.

Ви можете пропустити цей параметр, однак слід памʼятати, що обсяг зарезервованої памʼяті з усіх вузлів NUMA повинен дорівнювати обсягу памʼяті _node allocatable_.

Якщо хоча б один параметр node allocatable має ненульове значення, вам потрібно буде вказати `reservedMemory` хоча б для одного вузла NUMA. Фактично порогове значення `evictionHard` стандартно дорівнює `100Mi`, тому якщо ви використовуєте політику `Static`, вказати `reservedMemory` обовʼязково.

### Синтаксис зарезервованої памʼяті менеджера памʼяті {#reserved-memory-syntax}

Ось кілька прикладів того, як налаштувати конфігурацію `reservedMemory` для kubelet.

```yaml
  # Приклад 1
  reservedMemory:
  - numaNode: 0 # Індекс вузла NUMA
    limits:
      memory: "1Gi" # Кількість байтів
  - numaNode: 1
    limits:
      memory: "2Gi" # Кількість байтів
```

```yaml
  # Приклад 2
  reservedMemory:
  - numaNode: 0
    limits:
      "memory": "512Gi"
  - numaNode: 1
    limits:
      "memory": "512Gi"
      "hugepages-1Gi": "2Gi" # актуально тільки для Linux
```

### Обмеження на резервування памʼяті NUMA {#constraints-on-numa-memory-reservation}

Коли ви вказуєте значення для `reservedMemory`, вони повинні бути сумісними з чинними значеннями `kubeReserved` та `systemReserved`, а також з будь-якими налаштуваннями `memory.available`, які ви вказуєте в рамках `evictionHard`.

```math
\begin{equation*}
\sum_{ \textnormal{i} = 0}^{ \textnormal{node count}} { \textit{reservedMemory} [ \textnormal{i} ]} = \textit{kubeReserved} + \textit{systemReserved} + \textit{evictionHard} \, \boxed{\textnormal{memory.available}}
\end{equation*}\\\
\text{де i — індекс вузла NUMA}
```

Якщо ви не дотримуєтесь наведеної вище формули, менеджер памʼяті покаже помилку під час запуску.

Іншими словами, приклад 1 (вище) показує, що для звичайної памʼяті (`type=memory`) Kubernetes резервує загалом 3GiB, а саме:

```math
\begin{equation*}
\sum_{ \textnormal{i} = 0}^{ \textnormal{node count}} \textit{reservedMemory}_{ [ \textnormal{i} ] }  =  \underbrace{\textit{reservedMemory} [ 0 ] + \textit{reservedMemory} [ 1 ] }_{\textnormal{type=memory}}
            = 1 \textnormal{GiB} + 2 \textnormal{GiB}
            = 3 \textnormal{GiB}
\end{equation*}\\\
\text{де i — індекс вузла NUMA}
```

Деякі приклади налаштувань конфігурації kubelet, що стосуються конфігурації node allocatable:

```yaml
  kubeReserved: { cpu: "500m", memory: "50Mi" } # половина CPU, 50MiB памʼяті
  systemReserved: { cpu: "500m", memory: "256Mi" } # половина CPU, 256MiB памʼяті
```

{{< note >}}
Стандартний жорсткий поріг виселення становить 100MiB, а **не** нуль. Не забудьте збільшити обсяг памʼяті, який ви резервуєте через `reservedMemory`, на величину цього жорсткого порога виселення. Інакше kubelet не запустить менеджер памʼяті й покаже помилку.

Ось приклад правильної конфігурації, яка використовує `reservedMemory`:

```yaml
  # цей фрагмент коду використовує стандартне значення evictionHard
  memoryManagerPolicy: Static
  kubeReserved: { cpu: "4", memory: "4Gi" }
  systemReserved: { cpu: "1", memory: "1Gi" }
  reservedMemory:
  - numaNode: 0
    limits:
      memory: "3Gi"
  - numaNode: 1
    limits:
      memory: "2148Mi" # 3GiB мінус 100MiB
```

{{< /note >}}

### Конфігурації, яких слід уникати {#reserved-memory-configurations-to-avoid}

Уникайте таких конфігурацій:

1. дублікати: той самий вузол NUMA або тип памʼяті, але з іншим значенням;
1. встановлення нульового обмеження для будь-якого типу памʼяті;
1. ідентифікатори вузлів NUMA, які не існують в апаратному забезпеченні машини;
1. назви типів памʼяті, відмінні від `memory` або `hugepages-<size>` (також повинні існувати великі сторінки певного `<size>`).

## Розміщення Podʼа в класі QoS Guaranteed {#placing-a-pod-in-the-guaranteed-qos-class}

Якщо вибрана політика відрізняється від `None`, менеджер памʼяті визначає Podʼи, які належать до класу QoS `Guaranteed`. Менеджер памʼяті надає менеджеру топології конкретні підказки топології для кожного Podʼа `Guaranteed`. Для Podʼів у класі QoS, відмінному від `Guaranteed`, менеджер памʼяті надає менеджеру топології стандартні підказки топології.

Наведені нижче уривки з маніфестів Podʼів призначають Pod до класу QoS `Guaranteed`.

Pod з цілою кількістю CPU працює в класі QoS `Guaranteed`, коли `requests` дорівнюють `limits`:

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
```

Також Pod, який спільно використовує CPU, працює в класі QoS `Guaranteed`, коли `requests` дорівнюють `limits`.

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
```

Зверніть увагу, що для Podʼа потрібно вказати запити і CPU, і памʼяті, щоб він належав до класу QoS Guaranteed.

## {{% heading "whatsnext" %}} {#what-s-next}

- Прочитайте [Усунення несправностей в управлінні топологією](/docs/tasks/debug/debug-cluster/topology/)
- Прочитайте [KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager) (пропозиція щодо вдосконалення Kubernetes) для менеджера памʼяті
- Прочитайте про [Менеджери ресурсів на рівні Podʼа](/docs/concepts/resource-management/resource-managers/#pod-level-resource-managers).

[2]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/
