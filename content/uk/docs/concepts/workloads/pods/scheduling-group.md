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

Коли увімкнено функцію [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload), ви можете встановити поле `spec.schedulingGroup` у маніфесті `Pod`. Це поле встановлює звʼязок із конкретним обʼєктом `PodGroup` у тому самому просторі імен за назвою.

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
* Якщо `PodGroup` використовує політику `gang`, `Pod` входить у життєвий цикл планування "все або нічого". Планувальник намагається розмістити принаймні `minCount` `Pods` у групі одночасно; жоден з них не привʼязується до вузлів, якщо мінімум не досягнуто.

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Коли функціональну можливість [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup) увімкнено, `PodGroup` також може вказувати батьківський `CompositePodGroup`. В ієрархічному робочому навантаженні планування регулюється політиками, визначеними для всього дерева груп (такими як багаторівневе групове планування або обмеження топології).

## Відсутні посилання на групи {#missing-group-references}

Якщо `Pod` посилається на `PodGroup`, що ще не існує, `Pod` залишається в стані очікування. Аналогічно, якщо згаданий `PodGroup` вказує батьківський `CompositePodGroup` (через `spec.parentCompositePodGroupName`), який ще не створено, планування не починається, і `Pod` залишається в стані очікування, доки вся ієрархія груп не існуватиме в кластері.

Планувальник автоматично переглядає `Pod`, як тільки всі необхідні ресурси `PodGroup` та `CompositePodGroup` існують.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [PodGroup API](/docs/concepts/workloads/podgroup-api/) та його життєвий цикл.
* Прочитайте про [CompositePodGroup API](/docs/concepts/workloads/compositepodgroup-api/).
* Прочитайте про [політики планування PodGroup](/docs/concepts/workloads/workload-api/policies/).
* Ознайомтеся з алгоритмом [групового планування](/docs/concepts/scheduling-eviction/gang-scheduling/).
