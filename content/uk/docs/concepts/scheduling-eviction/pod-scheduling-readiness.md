---
title: Готовність Podʼів до планування
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.30" state="stable" >}}

Podʼи вважалися готовими до планування відразу після створення. Планувальник Kubernetes виконує всі необхідні дії для знаходження вузлів для розміщення всіх Podʼів, що очікують. Однак на практиці деякі Podʼи можуть перебувати в стані «бракує необхідних ресурсів» («miss-essential-resources») протягом тривалого періоду. Ці Podʼи фактично створюють непотрібне навантаження на планувальник (і на залежні від нього інтегратори, такі як Cluster AutoScaler).

Шляхом вказання/видалення поля `.spec.schedulingGates` для Podʼа ви можете контролювати, коли Pod готовий до розгляду для планування.

<!-- body -->

## Налаштування `schedulingGates` Podʼа {#configuring-pod-schedulinggates}

Поле `schedulingGates` містить список рядків, і кожний рядок сприймається як критерій, який повинен бути задоволений перед тим, як Pod буде вважатися придатним для планування. Це поле можна ініціалізувати лише під час створення Podʼа (клієнтом або шляхом зміни під час допуску). Після створення кожен `schedulingGate` можна видалити у довільному порядку, але додавання нового шлюзу планування заборонено.

{{< mermaid >}}

stateDiagram-v2

    s1: Pod створено
    s2: Очікування планування Podʼа
    s3: Pod готовий до планування
    s4: Pod виконується
    if: шлюзи планування порожні?
    [*] --> s1
    s1 --> if
    s2 --> if: шлюз<br>планування<br>видалено
    if --> s2: ні
    if --> s3: так
    s3 --> s4
    s4 --> [*]

classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
class s1,s2,s3,s4,if k8s

{{< /mermaid >}}

Схема. `schedulingGates` Podʼа

## Приклад використання {#usage-example}

Щоб позначити Pod як не готовий до планування, ви можете створити його з одним або кількома шлюзами планування так:

{{% code_sample file="pods/pod-with-scheduling-gates.yaml" %}}

Після створення Podʼа ви можете перевірити його стан за допомогою:

```bash
kubectl get pod test-pod
```

Вивід показує, що він перебуває в стані `SchedulingGated`:

```none
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          7s
```

Ви також можете перевірити його поле `schedulingGates`, запустивши:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

Вивід:

```none
[{"name":"example.com/foo"},{"name":"example.com/bar"}]
```

Щоб повідомити планувальнику, що цей Pod готовий до планування, ви можете повністю видалити його `schedulingGates` шляхом повторного застосування зміненого маніфеста:

{{% code_sample file="pods/pod-without-scheduling-gates.yaml" %}}

Ви можете перевірити, чи очищено `schedulingGates`, виконавши:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

Очікується, що вивід буде порожнім. І ви можете перевірити його останній стан, запустивши:

```bash
kubectl get pod test-pod -o wide
```

Враховуючи те, що test-pod не запитує жодних ресурсів CPU/памʼяті, очікується, що стан цього Podʼа перейде з попереднього `SchedulingGated` в `Running`:

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

## Спостережуваність {#observability}

Метрика `scheduler_pending_pods` має нову мітку `"gated"`, щоб відрізняти, чи були спроби запланувати Pod, але він був визначений як непридатний для планування, чи він явно позначений як не готовий для планування. Ви можете використовувати `scheduler_pending_pods{queue="gated"}` для перевірки результату метрики.

## Змінювані директиви планування Podʼа {#mutable-pod-scheduling-directives}

Ви можете змінювати директиви планування Podʼа, коли вони мають шлюзи планування, з певними обмеженнями. У загальних рисах, ви можете лише робити директиви планування Podʼа жорсткішими. Іншими словами, оновлені директиви призведуть до можливості розміщення Podʼів тільки на підмножині вузлів, з якими вони раніше мали збіг. Конкретніше, правила для оновлення директив планування Podʼа такі:

1. Для `.spec.nodeSelector` дозволяються лише додавання. Якщо відсутнє, його можна встановити.

2. Для `spec.affinity.nodeAffinity`, якщо nil, тоді дозволяється встановлення будь-чого.

3. Якщо `NodeSelectorTerms` був порожнім, дозволено встановлення. Якщо не порожній, тоді дозволяються лише додавання `NodeSelectorRequirements` до `matchExpressions` або `fieldExpressions`, а зміни наявних `matchExpressions` і `fieldExpressions` не будуть дозволені. Це тому, що умови в `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms` обʼєднуються через OR, тоді як вирази в `nodeSelectorTerms[].matchExpressions` та `nodeSelectorTerms[].fieldExpressions` обʼєднуються через AND.

4. Для `.preferredDuringSchedulingIgnoredDuringExecution` всі оновлення дозволені. Це повʼязано з тим, що бажані умови не є авторитетними, і тому контролери політики не перевіряють ці умови.

## {{% heading "whatsnext" %}} {#whats-next}

* Прочитайте [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) для отримання більш детальної інформації
