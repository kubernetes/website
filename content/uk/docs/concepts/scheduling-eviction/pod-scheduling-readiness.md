---
title: Готовність планування Pod
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.30" state="stable" >}}

Podʼи вважалися готовими до планування відразу після створення. Планувальник Kubernetes виконує всі необхідні дії для знаходження вузлів для розміщення всіх Podʼів, що очікують. Однак на практиці деякі Podʼи можуть перебувати в стані "відсутні ресурси" ("miss-essential-resources") протягом тривалого періоду. Ці Podʼи фактично спричиняють зайве навантаження на планувальник (та інтегратори, по ходу далі, такі як Cluster AutoScaler), що є непотрібним.

Шляхом вказання/видалення поля `.spec.schedulingGates` для Podʼа ви можете контролювати, коли Pod готовий до розгляду для планування.

<!-- body -->

## Налаштування `schedulingGates` Podʼа {#configuring-pod-schedulinggates}

Поле `schedulingGates` містить список рядків, і кожний рядок сприймається як критерій, який повинен бути задоволений перед тим, як Pod буде вважатися придатним для планування. Це поле можна ініціалізувати лише при створенні Podʼа (або клієнтом, або під час змін під час допуску). Після створення кожен `schedulingGate` можна видалити у довільному порядку, але додавання нового `scheduling gate` заборонено.

{{<mermaid>}}

stateDiagram-v2

    s1: Pod створено
    s2: Планування Pod очікується
    s3: Планування Pod готову
    s4: Pod виконується
    if: є порожні слоти планування?
    [*] --> s1
    s1 --> if
    s2 --> if: обмеження<br>планування<br>зняте
    if --> s2: ні
    if --> s3: так  
    s3 --> s4
    s4 --> [*]

classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
class s1,s2,s3,s4,if k8s

{{< /mermaid >}}

<!-- {{< figure src="/docs/images/podSchedulingGates.svg" alt="pod-scheduling-gates-diagram" caption="Рисунок. Pod SchedulingGates Podʼа" class="diagram-large" link="https://mermaid.live/edit#pako:eNp9Ustu00AU_RVrukOTxPb4OaCyKUskJHZgFhN7HFt1PJFnXBqiSJAu2CB1U3XLL5SiliqQ8AvjP-LacVqhIryZ-zzn3Ou7QLFIOKJIKqb4Uc4mFZsOTuyojEoDPmlR45VIjOZTs9LXett81Dd6o7d91qaG_qp_6iu9ac4gDy9Y510LFH9uLvW6OWsumlXzBSDO-zbyv7bv0LjSW33dnPXlzk4DFN7pNWQ2jyHzlBrNhaF_dxK3-haKLkE1kLRod23mEd_zXe_bJ--MweAQZt3P3Ll5uh-yd0H0Vn_Tv2ADt90WAOLZuDr8F3QX_9FawH6z17ijaZcG6v4Owkqg8kqvDWO_pF3C2S-hc0Fr-2vigkl5xFPjOJBGmhcFPSC2F3MXS1WJY04P0jTt7cH7PFEZdWanOBaFqLrc0x4DhsXSxpJg6eC8w4tKhNGUV1OWJ3AYi5Y_QirjUx4hCmbCU1YXKkJRuYRSVivxel7GiKqq5hjVs-ThlBBNWSHvoy-SXInqPsg79-XuArtDxGjGyjdCPDSCj-gCnSLqDH3XChwvtC0rtL0wwGiOqOWFQ88N_MANLRKaJvGXGH3oEMxh6Fuu59iEEJOYvmlhVAiW8KpFVPNZSzvJpQLaWJRpPmnjdVVAOFNqJulo1KaHk1xl9XgYi-lI5knGKpWdhN7Is72A2YR7PmEuIUk8tsIgtR0rTYDLZmi5XP4BQAJcvg" >}} -->

## Приклад використання {#usage-example}

Щоб позначити Pod як не готовий до планування, ви можете створити його з одним або кількома шлюзами планування так:

{{% code_sample file="pods/pod-with-scheduling-gates.yaml" %}}

Після створення Podʼа ви можете перевірити його стан за допомогою:

```bash
kubectl get pod test-pod
```

Вивід показує, що він знаходиться в стані `SchedulingGated`:

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

Щоб повідомити планувальник, що цей Pod готовий до планування, ви можете повністю видалити його `schedulingGates` шляхом повторного застосування зміненого маніфесту:

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

Метрика `scheduler_pending_pods` має нову мітку `"gated"`, щоб відрізняти, чи були спроби планувати Podʼа, але він був визначений як непридатний для планування, чи він явно позначений як не готовий для планування. Ви можете використовувати `scheduler_pending_pods{queue="gated"}` для перевірки результату метрики.

## Змінні директиви планування Podʼа {#mutable-pod-scheduling-directives}

Ви можете змінювати директиви планування Podʼа, коли вони мають шлюзи планування, з певними обмеженнями. Узагальнено, ви можете тільки робити директиви планування Podʼа жорсткішими. Іншими словами, оновлені директиви призведуть до можливості розміщення Podʼів тільки на підмножині вузлів, з якими вони раніше мали збіг. Конкретніше, правила для оновлення директив планування Podʼа такі:

1. Для `.spec.nodeSelector` дозволяються лише додавання. Якщо відсутнє, його можна встановити.

2. Для `spec.affinity.nodeAffinity`, якщо nil, тоді дозволяється встановлення будь-чого.

3. Якщо `NodeSelectorTerms` був пустим, дозволено встановлення. Якщо не пустий, тоді дозволяються лише додавання `NodeSelectorRequirements` до `matchExpressions` або `fieldExpressions`, а зміни наявних `matchExpressions` і `fieldExpressions` не будуть дозволені. Це через те, що терміни в `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`, оцінюються через OR тоді як вирази в `nodeSelectorTerms[].matchExpressions` та `nodeSelectorTerms[].fieldExpressions` оцінюються через AND.
   
4. Для `.preferredDuringSchedulingIgnoredDuringExecution` всі оновлення дозволені. Це повʼязано з тим, що бажані умови не є авторитетними, і тому контролери політики не підтверджують ці умови.

## {{% heading "whatsnext" %}}

* Прочитайте [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness) для отримання більш детальної інформації
