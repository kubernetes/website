---
title: Масштабування StatefulSet
content_type: task
weight: 50
---

<!-- overview -->

Це завдання показує, як масштабувати StatefulSet. Масштабування StatefulSet означає збільшення або зменшення кількості реплік.

## {{% heading "prerequisites" %}}

- StatefulSets доступні тільки в версії Kubernetes 1.5 або пізніше. Щоб перевірити вашу версію Kubernetes, виконайте `kubectl version`.

- Не всі застосунки зі збереженням стану гарно масштабуються. Якщо ви не впевнені, чи масштабувати ваші StatefulSets, див. [Концепції StatefulSet](/docs/concepts/workloads/controllers/statefulset/) або [Посібник StatefulSet](/docs/tutorials/stateful-application/basic-stateful-set/) для отримання додаткової інформації.

- Ви повинні виконувати масштабування лише тоді, коли ви впевнені, що ваш кластер застосунку зі збереженням стану є повністю справним.

<!-- steps -->

## Масштабування StatefulSets {#scaling-statefulsets}

### Використання kubectl для масштабування StatefulSets {#use-kubectl-to-scale-statefulsets}

Спочатку знайдіть StatefulSet, який ви хочете масштабувати.

```shell
kubectl get statefulsets <назва-stateful-set>
```

Змініть кількість реплік вашого StatefulSet:

```shell
kubectl scale statefulsets <назва-stateful-set> --replicas=<нові-репліки>
```

### Виконання оновлень на місці для вашого StatefulSets {#make-in-place-updates-on-your-statefulsets}

Альтернативно, ви можете виконати [оновлення на місці](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources) для ваших StatefulSets.

Якщо ваш StatefulSet спочатку був створений за допомогою `kubectl apply`, оновіть `.spec.replicas` маніфестів StatefulSet, а потім виконайте `kubectl apply`:

```shell
kubectl apply -f <stateful-set-file-updated>
```

Інакше, відредагуйте це поле за допомогою `kubectl edit`:

```shell
kubectl edit statefulsets <stateful-set-name>
```

Або використовуйте `kubectl patch`:

```shell
kubectl patch statefulsets <назва-stateful-set> -p '{"spec":{"replicas":<нові-репліки>}}'
```

## Усунення несправностей {#troubleshooting}

### Масштабування вниз не працює правильно {#scaling-down-does-not-work-right}

Ви не можете зменшити масштаб StatefulSet, коли будь-який з Stateful Podʼів, яким він керує, є нездоровим. Масштабування відбувається лише після того, як ці Stateful Podʼи стають запущеними та готовими.

Якщо spec.replicas > 1, Kubernetes не може визначити причину несправності Podʼа. Це може бути наслідком постійного збою або тимчасового збою. Тимчасовий збій може бути викликаний перезапуском, необхідним для оновлення або обслуговування.

Якщо Pod несправний через постійний збій, масштабування без виправлення дефекту може призвести до стану, коли кількість членів StatefulSet опускається нижче певної мінімальної кількості реплік, необхідних для правильної роботи це може призвести до недоступності вашого StatefulSet.

Якщо Pod несправний через тимчасовий збій і Pod може стати доступним знову, тимчасова помилка може перешкоджати вашій операції масштабування вгору або вниз. Деякі розподілені бази даних мають проблеми, коли вузли приєднуються та відключаються одночасно. Краще розуміти операції масштабування на рівні застосунків у таких випадках і виконувати масштабування лише тоді, коли ви впевнені, що ваш кластер застосунку зі збереженням стану є цілком справним.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [видалення StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
