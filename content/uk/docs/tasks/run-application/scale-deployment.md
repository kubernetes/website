---
title: Горизонтальне ручне масштабування для Deployment
content_type: task
weight: 15
---

<!-- overview -->

На цій сторінці показано, як вручну масштабувати Deployment горизонтально, змінюючи кількість його реплік. Ручне масштабування дає змогу безпосередньо контролювати кількість запущених Podʼів для передбачуваних змін навантаження або керування витратами.

Це відрізняється від _вертикального масштабування_, за якого кількість реплік лишається незмінною, але змінюється кількість ресурсів, доступних кожному Podʼу.

## {{% heading "objectives" %}} {#objectives}

- Масштабування Deployment вгору для обробки більшого трафіку.
- Зменшення масштабу Deployment для економії ресурсів.
- Масштабування Deployment до нуля для тимчасового призупинення робочого навантаження.
- Розуміння, коли використовувати ручне масштабування, а коли HorizontalPodAutoscaler.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібен наявний Deployment. Якщо у вас його немає і ви просто хочете попрактикуватися, можна створити Deployment nginx зі сторінки [Запуск застосунку без збереження стану за допомогою Deployment](/docs/tasks/run-application/run-stateless-application-deployment/):

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Перевірте, що Deployment запускає два Podʼи:

```shell
kubectl get deployment nginx-deployment
```

Вивід подібний до такого:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           10s
```

<!-- steps -->

## Масштабування Deployment вгору {#scaling-up-a-deployment}

Існує кілька способів змінити кількість реплік наявного Deployment.

### Масштабування вгору за допомогою `kubectl scale` {#scaling-up-using-kubectl-scale}

Використовуйте `kubectl scale`, щоб встановити кількість реплік:

```shell
kubectl scale deployment/nginx-deployment --replicas=4
```

Вивід подібний до такого:

```
deployment.apps/nginx-deployment scaled
```

Перевірте, що Deployment має чотири Podʼи:

```shell
kubectl get deployment nginx-deployment
```

Вивід подібний до такого:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   4/4     4            4           1m
```

### Декларативне масштабування за допомогою `kubectl apply` {#declarative-scaling-using-kubectl-apply}

Замість виконання імперативної команди можна оновити файл маніфесту й застосувати його. Цей підхід добре підходить для робочих процесів із конфігурацією під контролем версій.

Збережіть поточну конфігурацію Deployment у локальний файл:

```shell
kubectl get deployment nginx-deployment -o yaml > /tmp/nginx-deployment.yaml
```

Відредагуйте `/tmp/nginx-deployment.yaml` і змініть `.spec.replicas` на `4`.

Перед застосуванням порівняйте свої локальні зміни зі станом кластера:

```shell
kubectl diff -f /tmp/nginx-deployment.yaml
```

Застосуйте відредагований маніфест:

```shell
kubectl apply -f /tmp/nginx-deployment.yaml
```

## Зменшення масштабу Deployment {#scaling-down-a-deployment}

Щоб зменшити кількість Podʼів, встановіть `--replicas` на менше значення:

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

Kubernetes коректно завершує зайві Podʼи, дотримуючись налаштування `terminationGracePeriodSeconds` кожного Podʼа.

Перевірте, що Deployment має два Podʼи:

```shell
kubectl get pods -l app=nginx
```

Вивід подібний до такого:

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-66b6c48dd5-7gl6h   1/1     Running   0          2m
nginx-deployment-66b6c48dd5-v8mkd   1/1     Running   0          2m
```

## Масштабування до нуля {#scaling-to-zero}

Ви можете масштабувати Deployment до нуля, щоб тимчасово призупинити робоче навантаження, не видаляючи сам Deployment:

```shell
kubectl scale deployment/nginx-deployment --replicas=0
```

Перевірте, що жоден Pod не працює:

```shell
kubectl get deployment nginx-deployment
```

Вивід подібний до такого:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   0/0     0            0           5m
```

{{< note >}}
Масштабування до нуля видаляє всі Podʼи, але зберігає Deployment і його ReplicaSet. Ви можете знову масштабувати вгору в будь-який час, встановивши `--replicas` на додатне число.
{{< /note >}}

Поширені випадки використання масштабування до нуля:

- Тимчасове призупинення робочого навантаження для економії ресурсів
- Вікна налагодження або обслуговування
- Контроль витрат у середовищах розробки або тестування

## Інші способи зміни кількості реплік {#other-ways-to-change-the-replica-count}

Окрім `kubectl scale`, ви можете змінити `.spec.replicas` за допомогою `kubectl edit` або `kubectl patch`.

### Масштабування за допомогою `kubectl edit` {#scale-using-kubectl-edit}

```shell
kubectl edit deployment nginx-deployment
```

Змініть поле `.spec.replicas` у редакторі, потім збережіть і вийдіть.

### Масштабування за допомогою `kubectl patch` {#scale-using-kubectl-patch}

Ви можете оновити `.spec.replicas` за допомогою strategic merge patch:

```shell
kubectl patch deployment nginx-deployment -p '{"spec":{"replicas":4}}'
```

Для скриптів використовуйте патч JSON із попередньою перевіркою. Наведена нижче команда встановлює кількість реплік на 4, але лише якщо поточна кількість дорівнює 2:

```shell
kubectl patch deployment nginx-deployment --type=json -p='[
  {"op": "test", "path": "/spec/replicas", "value": 2},
  {"op": "replace", "path": "/spec/replicas", "value": 4}
]'
```

Операція `test` призводить до збою патчу, якщо поточне значення не збігається, що запобігає небажаним змінам, коли кілька людей або скриптів змінюють той самий Deployment.

## Коли використовувати ручне, а коли автоматичне масштабування {#when-to-use-manual-versus-automatic-scaling}

| Аспект | Ручне масштабування | Автоматичне масштабування (HPA) |
|--------|------------------|-------------------------------|
| Найкраще для | Передбачуваних, запланованих або одноразових змін навантаження | Змінного або непередбачуваного попиту |
| Як це працює | Ви встановлюєте `.spec.replicas` безпосередньо | HPA регулює кількість реплік на основі спостережуваних метрик |
| Час реакції | Негайно після виконання команди | Реагує на метрики з невеликою затримкою |
| Врахування метрик | Відсутнє — кількість реплік вирішуєте ви | Відстежує CPU, памʼять або власні метрики |
| Обслуговування | Потребує ручного втручання для налаштування | Працює автономно після налаштування |

{{< caution >}}
Якщо HorizontalPodAutoscaler керує Deployment, не встановлюйте репліки вручну. HPA постійно узгоджує кількість реплік і перевизначає будь-які ручні зміни.
{{< /caution >}}

## {{% heading "cleanup" %}} {#cleaning-up}

Видаліть Deployment:

```shell
kubectl delete deployment nginx-deployment
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [Deployments](/docs/concepts/workloads/controllers/deployment/).
- Пройдіть матеріал [Горизонтальне автомасштабування Podʼів](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- Дізнайтеся, як [масштабувати StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
- Дізнайтеся про [керування ресурсами](/docs/concepts/cluster-administration/manage-deployment/).
