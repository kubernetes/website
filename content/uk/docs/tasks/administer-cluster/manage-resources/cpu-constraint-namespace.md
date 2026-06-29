---
title: Налаштування мінімальних та максимальних обмеженнь CPU для простору імен
content_type: task
weight: 40
description: >
  Визначте діапазон допустимих обмежень ресурсів CPU для простору імен так, щоб кожен новий Pod у цьому просторі імен відповідав налаштованому діапазону.
---

<!-- overview -->

Ця сторінка показує, як встановити мінімальні та максимальні значення ресурсів CPU, що використовуються контейнерами та Podʼами в {{< glossary_tooltip text="просторі імен" term_id="namespace" >}}. Ви вказуєте мінімальні та максимальні значення CPU в обʼєкті [LimitRange](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/). Якщо Pod не відповідає обмеженням, накладеним LimitRange, його не можна створити у просторі імен.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Ви повинні мати доступ до створення просторів імен у своєму кластері.

Кожен вузол у вашому кластері повинен мати щонайменше 1,0 CPU, доступний для Podʼів. Див. [значення CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu), щоб дізнатися, що означає в Kubernetes "1 CPU".

<!-- steps -->

## Створення простору імен {#create-a-namespace}

Створіть простір імен, щоб ресурси, які ви створюєте у цьому завданні, були відокремлені від інших частин вашого кластера.

```shell
kubectl create namespace constraints-cpu-example
```

## Створення LimitRange та Podʼа {#create-a-limitrange-and-a-pod}

Ось маніфест для прикладу {{< glossary_tooltip text="LimitRange" term_id="limitrange" >}}:

{{% code_sample file="admin/resource/cpu-constraints.yaml" %}}

Створіть LimitRange:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints.yaml --namespace=constraints-cpu-example
```

Перегляньте детальну інформацію про LimitRange:

```shell
kubectl get limitrange cpu-min-max-demo-lr --output=yaml --namespace=constraints-cpu-example
```

Вивід показує мінімальні та максимальні обмеження CPU, як очікувалося. Але зверніть увагу, що навіть якщо ви не вказали типових значень у конфігураційному файлі для LimitRange, вони були створені автоматично.

```yaml
limits:
- default:
    cpu: 800m
  defaultRequest:
    cpu: 800m
  max:
    cpu: 800m
  min:
    cpu: 200m
  type: Container
```

Тепер, кожного разу, коли ви створюєте Pod у просторі імен constraints-cpu-example (або який-небудь інший клієнт API Kubernetes створює еквівалентний Pod), Kubernetes виконує ці кроки:

* Якщо який-небудь контейнер у цьому Podʼі не вказує свої власні CPU-запити та обмеження, панель управління призначає контейнеру типове значення для CPU-запиту та обмеження.

* Перевірте, що кожен контейнер у цьому Podʼі вказує CPU-запит, який більший або дорівнює 200 мілі-CPU.

* Перевірте, що кожен контейнер у цьому Podʼі вказує обмеження CPU, яке менше або дорівнює 800 мілі-CPU.

{{< note >}}
При створенні обʼєкта `LimitRange` можна вказати обмеження на використання великих сторінок або GPU. Однак, коли одночасно вказуються `default` та `defaultRequest` для цих ресурсів, два значення повинні бути однаковими.
{{< /note >}}

Ось маніфест для Podʼа з одним контейнером. Маніфест контейнера вказує CPU-запит у розмірі 500 мілі-CPU та обмеження CPU у розмірі 800 мілі-CPU. Це задовольняє мінімальні та максимальні обмеження CPU, накладені LimitRange на цей простір імен.

{{% code_sample file="admin/resource/cpu-constraints-pod.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod.yaml --namespace=constraints-cpu-example
```

Перевірте, що Pod працює, а його контейнер є справним:

```shell
kubectl get pod constraints-cpu-demo --namespace=constraints-cpu-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod constraints-cpu-demo --output=yaml --namespace=constraints-cpu-example
```

Вивід показує, що єдиний контейнер Podʼа має запит CPU у розмірі 500 мілі-CPU та обмеження CPU
800 мілі-CPU. Це задовольняє обмеження, накладеним LimitRange.

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 500m
```

## Видаліть Pod {#delete-the-pod}

```shell
kubectl delete pod constraints-cpu-demo --namespace=constraints-cpu-example
```

## Спроба створити Pod, який перевищує максимальне обмеження CPU {#attempt-to-create-a-pod-that-exceeds-the-maximum-cpu-constraint}

Ось маніфест для Podʼа з одним контейнером. Контейнер вказує запит CPU у розмірі 500 мілі-CPU та обмеження CPU у розмірі 1,5 CPU.

{{% code_sample file="admin/resource/cpu-constraints-pod-2.yaml" %}}

Спробуйте створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-2.yaml --namespace=constraints-cpu-example
```

Вивід показує, що Pod не створено, оскільки визначений контейнер є неприйнятним. Цей контейнер є неприйнятним, оскільки він вказує обмеження CPU, яке занадто велике:

```none
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-2.yaml":
pods "constraints-cpu-demo-2" is forbidden: maximum cpu usage per Container is 800m, but limit is 1500m.
```

## Спроба створити Pod, який не відповідає мінімальному запиту CPU {#attempt-to-create-a-pod-that-does-not-meet-the-minimum-cpu-request}

Ось маніфест для Podʼа з одним контейнером. Контейнер вказує запит CPU у розмірі 100 мілі-CPU та обмеження CPU у розмірі 800 мілі-CPU.

{{% code_sample file="admin/resource/cpu-constraints-pod-3.yaml" %}}

Спробуйте створити Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-3.yaml --namespace=constraints-cpu-example
```

Вивід показує, що Pod не створено, оскільки визначений контейнер є неприйнятним. Цей контейнер є неприйнятним, оскільки він вказує запит CPU, який нижче мінімального:

```none
Error from server (Forbidden): error when creating "examples/admin/resource/cpu-constraints-pod-3.yaml":
pods "constraints-cpu-demo-3" is forbidden: minimum cpu usage per Container is 200m, but request is 100m.
```

## Створення Podʼа, який не вказує жодного запиту або обмеження CPU {#create-a-pod-that-does-not-specify-any-cpu-request-or-limit}

Ось маніфест для Podʼа з одним контейнером. Контейнер не вказує запит CPU і не вказує обмеження CPU.

{{% code_sample file="admin/resource/cpu-constraints-pod-4.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/cpu-constraints-pod-4.yaml --namespace=constraints-cpu-example
```

Перегляньте детальну інформацію про Pod:

```shell
kubectl get pod constraints-cpu-demo-4 --namespace=constraints-cpu-example --output=yaml
```

Вивід показує, що у Podʼі єдиний контейнер має запит CPU у розмірі 800 мілі-CPU та обмеження CPU у розмірі 800 мілі-CPU. Як цей контейнер отримав ці значення?

```yaml
resources:
  limits:
    cpu: 800m
  requests:
    cpu: 800m
```

Тому що цей контейнер не вказав свій власний запит CPU та обмеження, панель управління застосовує [стандартні обмеження та запит CPU](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/) з LimitRange для цього простору імен.

На цьому етапі ваш Pod може бути запущеним або не запущеним. Згадайте, що передумовою для цієї задачі є те, що у ваших вузлах повинно бути щонайменше 1 CPU для використання. Якщо в кожному вузлі у вас є лише 1 CPU, то, можливо, немає достатньої кількості CPU на будь-якому вузлі для виконання запиту у розмірі 800 мілі-CPU. Якщо ви використовуєте вузли з 2 CPU, то, ймовірно, у вас достатньо CPU для виконання запиту у розмірі 800 мілі-CPU.

Видаліть ваш Pod:

```shell
kubectl delete pod constraints-cpu-demo-4 --namespace=constraints-cpu-example
```

## Застосування мінімальних та максимальних обмежень CPU {#enforcement-of-minimum-and-maximum-cpu-constraints}

Максимальні та мінімальні обмеження CPU, накладені на простір імен за допомогою LimitRange, застосовуються лише при створенні або оновленні Podʼа. Якщо ви зміните LimitRange, це не вплине на Podʼи, які були створені раніше.

{{< note >}}
При використанні [зміни розміру Podʼів на місці](/docs/tasks/configure-pod-container/resize-container-resources/) також застосовуються обмеження CPU. Якщо зміна розміру призведе до порушення обмежень LimitRange для значень CPU Podʼа (перевищення максимального або зниження нижче мінімального значення), зміна розміру буде відхилена, а ресурси Podʼа залишаться на попередніх значеннях.
{{< /note >}}

## Причини для мінімальних та максимальних обмежень CPU {#motivation-for-minimum-and-maximum-cpu-constraints}

Як адміністратор кластера, ви можете бажати накладати обмеження на ресурси CPU, які можуть використовувати Podʼи. Наприклад:

* Кожен вузол у кластері має 2 CPU. Ви не хочете приймати жодного Podʼа, який запитує більше, ніж 2 CPU, оскільки жоден вузол у кластері не може підтримати цей запит.

* Кластер використовується вашими відділами експлуатації та розробки. Ви хочете дозволити навантаженням в експлуатації споживати до 3 CPU, але ви хочете обмежити навантаження в розробці до 1 CPU. Ви створюєте окремі простори імен для експлуатації та розробки та застосовуєте обмеження CPU до кожного простору імен.

## Прибирання {#clean-up}

Видаліть ваш простір імен:

```shell
kubectl delete namespace constraints-cpu-example
```

## {{% heading "whatsnext" %}}

### Для адміністраторів кластера {#for-cluster-administrators}

* [Типові налаштування запитів та обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Типові налаштування запитів та обмежень CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Налаштування мінімальних та максимальних обмежень памʼяті для простору імен](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Налаштування квот памʼяті та CPU для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Налаштування квоти Podʼів для простору імен](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Налаштування квот для обʼєктів API](/docs/tasks/administer-cluster/quota-api-object/)

### Для розробників застосунків {#for-app-developers}

* [Надання ресурсів памʼяті контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Надання ресурсів CPU контейнерам та Podʼам](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Надання ресурсів CPU та памʼяті на рівні Podʼів](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Налаштування якості обслуговування для Podʼів](/docs/tasks/configure-pod-container/quality-service-pod/)
