---
title: Група планування
content_type: concept
weight: 90
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Ви можете повʼязати `Pod` з [PodGroup](/docs/concepts/workloads/podgroup-api/), щоб вказати, що `Pod` належить до групи `Pods`, які плануються разом. Це дозволяє планувальнику застосовувати політики на рівні групи, такі як gang scheduling, замість того, щоб розглядати кожен `Pod` окремо.

<!-- body -->

## Визначення групи планування {#specifying-a-scheduling-group}

Коли увімкнено функцію [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload), ви можете встановити поле `spec.schedulingGroup` у маніфесті `Pod`. Це поле встановлює зв’язок із конкретним об’єктом `PodGroup` у тому самому просторі імен за назвою.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  schedulingGroup:
    podGroupName: training-worker-0
  containers:
  - name: ml-worker
    image: training:v1
```

Поле `schedulingGroup` є незмінним. Після встановлення `Pod` не можна перемістити до іншої `PodGroup`.

## Поведінка {#behavior}

Коли ви встановлюєте `spec.schedulingGroup`, планувальник шукає посилання на [PodGroup](/docs/concepts/workloads/podgroup-api/) і застосовує визначену в ньому [політику планування](/docs/concepts/workloads/workload-api/policies/):

* Якщо `PodGroup` використовує політику `basic`, кожен `Pod` планується незалежно, використовуючи стандартну поведінку Kubernetes. Групування використовується як мітка на рівні групи.
* Якщо `PodGroup` використовує політику `gang`, `Pod` входить у життєвий цикл планування "все або нічого". Планувальник намагається розмістити принаймні `minCount` `Pods` у групі одночасно; жоден з них не прив'язується до вузлів, якщо мінімум не досягнуто.

## Відсутнє посилання на PodGroup {#missing-podgroup-reference}

Якщо `Pod` посилається на `PodGroup`, що ще не існує, `Pod` залишається в стані очікування. Планувальник автоматично переглядає `Pod`, як тільки `PodGroup` створено.

Це застосовується незалежно від того, чи політика в кінцевому підсумку є `basic` або `gang`, оскільки планувальнику потрібен `PodGroup`, щоб визначити політику.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [PodGroup API](/docs/concepts/workloads/podgroup-api/) та його життєвий цикл.
* Прочитайте про [політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/).
* Ознайомтеся з алгоритмом [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
