---
title: Масштабування StatefulSet
content_type: task
weight: 50
---

<!-- overview -->

Це завдання показує, як масштабувати StatefulSet. Масштабування StatefulSet означає збільшення або зменшення кількості реплік.

## {{% heading "prerequisites" %}} {#before-you-begin}

- StatefulSets доступні лише у Kubernetes версії 1.5 або новішій. Щоб перевірити версію Kubernetes, виконайте `kubectl version`.

- Не всі застосунки зі збереженням стану добре масштабуються. Якщо ви не впевнені, чи варто масштабувати ваші StatefulSets, докладніше дивіться в [концепції StatefulSet](/docs/concepts/workloads/controllers/statefulset/) або в [навчальному матеріалі про StatefulSet](/docs/tutorials/stateful-application/basic-stateful-set/).

- Виконуйте масштабування лише тоді, коли впевнені, що кластер вашого застосунку зі збереженням стану повністю справний.

<!-- steps -->

## Масштабування StatefulSets {#scaling-statefulsets}

### Використання kubectl для масштабування StatefulSets {#use-kubectl-to-scale-statefulsets}

Спочатку знайдіть StatefulSet, який ви хочете масштабувати.

```shell
kubectl get statefulsets <stateful-set-name>
```

Змініть кількість реплік вашого StatefulSet:

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

### Оновлення ваших StatefulSets на місці {#make-in-place-updates-on-your-statefulsets}

Також можна виконати [оновлення на місці](/docs/concepts/cluster-administration/manage-deployment/#in-place-updates-of-resources) ваших StatefulSets.

Якщо ваш StatefulSet спочатку створено за допомогою `kubectl apply`, оновіть `.spec.replicas` у маніфестах StatefulSet, а потім виконайте `kubectl apply`:

```shell
kubectl apply -f <stateful-set-file-updated>
```

Інакше відредагуйте це поле за допомогою `kubectl edit`:

```shell
kubectl edit statefulsets <stateful-set-name>
```

Або використовуйте `kubectl patch`:

```shell
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

## Усунення несправностей {#troubleshooting}

### Зменшення масштабу не працює належним чином {#scaling-down-does-not-work-right}

Не можна зменшити масштаб StatefulSet, коли будь-який зі stateful Podʼів, якими він керує, несправний. Зменшення масштабу відбувається лише після того, як ці stateful Podʼи стануть запущеними й готовими.

Якщо spec.replicas > 1, Kubernetes не може визначити причину несправності Podʼа. Це може бути наслідком постійного або тимчасового збою. Тимчасовий збій може бути спричинений перезапуском, потрібним для оновлення або обслуговування.

Якщо Pod несправний через постійний збій, масштабування без усунення збою може призвести до стану, коли кількість членів StatefulSet опуститься нижче певної мінімальної кількості реплік, потрібних для правильної роботи. Це може призвести до недоступності вашого StatefulSet.

Якщо Pod несправний через тимчасовий збій і може знову стати доступним, тимчасова помилка може завадити операції збільшення або зменшення масштабу. Деякі розподілені бази даних мають проблеми, коли вузли приєднуються й виходять одночасно. У таких випадках краще оцінювати операції масштабування на рівні застосунку й виконувати масштабування лише тоді, коли ви впевнені, що кластер вашого застосунку зі збереженням стану повністю справний.

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [видалення StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
