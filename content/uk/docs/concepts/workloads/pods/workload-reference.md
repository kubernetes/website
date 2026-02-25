---
title: Посилання на Workload
content_type: concept
weight: 90
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

Ви можете повʼязати Pod з обʼєктом [Workload](/docs/concepts/workloads/workload-api/), щоб вказати, що Pod належить до більшого застосунку або групи. Це дозволяє планувальнику приймати рішення на основі вимог групи, а не розглядати Pod як незалежну одиницю.

<!-- body -->

## Визначення посилання на робоче навантаження {#specifying-a-workload-reference}

Коли функція [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload) увімкнена, ви можете використовувати поле `spec.workloadRef` у маніфесті Podʼа. Це поле встановлює посилання на конкретну групу Podʼів, визначену в ресурсі Workload в тому ж просторі імен.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  workloadRef:
    # Імʼя обʼєкта Workload в тому самому просторі імен
    name: training-job-workload
    # Імʼя конкретної групи Podʼів у цьому Workload
    podGroup: workers
```

### Репліки групи подів {#pod-group-replicas}

Для більш складних сценаріїв ви можете реплікувати одну групу подів у кілька незалежних одиниць планування. Це можна зробити за допомогою поля `podGroupReplicaKey` у `workloadRef` пода. Цей ключ діє як мітка для створення логічних підгруп.

Наприклад, якщо у вас є група подів з `minCount: 2` і ви створюєте чотири пода: два з `podGroupReplicaKey: "0"` і два з `podGroupReplicaKey: "1"`, вони будуть розглядатися як дві незалежні групи з двох подів.

```yaml
spec:
  workloadRef:
    name: training-job-workload
    podGroup: workers
    # Всі виконавці з ключем-реплікою "0" будуть заплановані разом як одна група.
    podGroupReplicaKey: "0"
```

### Поведінка {#behavior}

Коли ви визначаєте `workloadRef`, Pod поводиться по-різному залежно від [політики](/docs/concepts/workloads/workload-api/policies/), визначеної в групі Podʼа, на яку посилаються.

* Якщо група, на яку посилаються, використовує політику `basic`, посилання на робоче навантаження діє в першу чергу як мітка групування.
* Якщо група, на яку є посилання, використовує політику `gang` (і функція [`GangScheduling`]((/docs/reference/command-line-tools-reference/feature-gates/#GangScheduling)) увімкнена), Pod входить у цикл життя групового планування. Він чекатиме, поки інші Podʼи у групі будуть створені та заплановані, перш ніж привʼязатися до вузла.

### Відсутні посилання {#missing-references}

Планувальник перевіряє `workloadRef` перед прийняттям будь-яких рішень щодо розміщення.

Якщо Pod посилається на Workload, що не існує, або на групу Podʼів, яка не визначена в цьому Workload, Pod залишатиметься в стані очікування. Він не розглядається для розміщення, поки ви не створите відсутній обʼєкт Workload або не перестворите його, щоб включити відсутнє визначення `PodGroup`.

Ця поведінка застосовується до всіх Podʼів з `workloadRef`, незалежно від того, чи буде кінцевою політикою `basic` або `gang`, оскільки планувальник вимагає визначення Workload для визначення політики.

## {{% heading "whatsnext" %}}

* Дізнайтеся про [Workload API](/docs/concepts/workloads/workload-api/).
* Ознайомтеся з деталями [політик груп подів](/docs/concepts/workloads/workload-api/policies/).
