---
title: Горизонтальне ручне масштабування для Deployment
content_type: task
weight: 15
---

<!-- overview -->

Ця сторінка показує, як вручну масштабувати Deployment горизонтально, змінюючи кількість його реплік. Ручне масштабування дозволяє безпосередньо контролювати кількість працюючих Podʼів для передбачуваних змін навантаження або управління витратами.

Це відрізняється від _вертикального масштабування_: залишаючи кількість реплік незмінною, але змінюючи кількість ресурсів, доступних для кожного Pod.

## {{% heading "objectives" %}}

- Масштабування Deployment для обробки більшого трафіку.
- Зменшення масштабування Deployment для економії ресурсів.
- Масштабування Deployment до нуля для тимчасового призупинення навантаження.
- Розуміння, коли використовувати ручне масштабування, а коли HorizontalPodAutoscaler.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібен наявний Deployment. Якщо у вас його немає, і ви просто хочете попрактикуватися, ви можете створити Deployment nginx з [Запуск застосунку без збереження стану за допомогою Deployment](/docs/tasks/run-application/run-stateless-application-deployment/):

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Перевірте, що Deployment запускає два Podʼи:

```shell
kubectl get deployment nginx-deployment
```

Вивід схожий на:

```none
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           10s
```

<!-- steps -->

## Масштабування Deployment вгору {#scaling-up-a-deployment}

Існує кілька способів змінити кількість реплік для існуючого Deployment.

### Масштабування вгору за допомогою `kubectl scale` {#scaling-up-using-kubectl-scale}


Використовуйте `kubectl scale`, щоб встановити кількість реплік:

```shell
kubectl scale deployment/nginx-deployment --replicas=4
```

Вивід схожий на:

```none
deployment.apps/nginx-deployment scaled
```

Перевірте, що Deployment має чотири Podʼи:

```shell
kubectl get deployment nginx-deployment
```

Вивід схожий на:

```none
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   4/4     4            4           1m
```

### Декларативне масштабування за допомогою `kubectl apply` {#declarative-scaling-using-kubectl-apply}

Замість виконання імперативної команди, ви можете оновити файл маніфесту та застосувати його. Цей підхід добре підходить для робочих процесів з версіонованою конфігурацією.

Збережіть поточну конфігурацію Deployment у локальний файл:

```shell
kubectl get deployment nginx-deployment -o yaml > /tmp/nginx-deployment.yaml
```

Відредагуйте `/tmp/nginx-deployment.yaml` і змініть `.spec.replicas` на `4`.

Перед застосуванням порівняйте ваші локальні зміни зі станом кластера:

```shell
kubectl diff -f /tmp/nginx-deployment.yaml
```

Застосуйте відредагований маніфест:

```shell
kubectl apply -f /tmp/nginx-deployment.yaml
```

## Зменшення масштабування Deployment {#scaling-down-a-deployment}

Щоб зменшити кількість Podʼів, встановіть `--replicas` на менше значення:

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

Kubernetes належним чином завершує зайві Podʼи, дотримуючись налаштувань `terminationGracePeriodSeconds` для кожного Pod.

Перевірте, що Deployment має два Podʼи:

```shell
kubectl get pods -l app=nginx
```

Вивід схожий на:

```none
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-66b6c48dd5-7gl6h   1/1     Running   0          2m
nginx-deployment-66b6c48dd5-v8mkd   1/1     Running   0          2m
```

## Масштабування до нуля {#scaling-to-zero}

Ви можете масштабувати Deployment до нуля, щоб тимчасово призупинити навантаження, не видаляючи сам Deployment:

```shell
kubectl scale deployment/nginx-deployment --replicas=0
```

Перевірте, що жоден Pod не працює:

```shell
kubectl get deployment nginx-deployment
```

Вивід схожий на:

```none
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   0/0     0            0           5m
```

{{< note >}}
Масштабування до нуля видаляє всі Podʼи, але зберігає Deployment та його ReplicaSet. Ви можете знову масштабувати вгору в будь-який час, встановивши `--replicas` на позитивне число.
{{< /note >}}

Звичайні випадки використання масштабування до нуля включають:

- Тимчасове призупинення навантаження для економії ресурсів
- Вікна налагодження або обслуговування
- Контроль витрат у середовищах розробки або тестування

## Інші способи зміни кількості реплік {#other-ways-to-change-the-replica-count}

Окрім `kubectl scale`, ви можете змінити `.spec.replicas` за допомогою `kubectl edit` або `kubectl patch`.

### Масштабування за допомогою `kubectl edit` {#scaling-using-kubectl-edit}

```shell
kubectl edit deployment nginx-deployment
```

Змініть поле `.spec.replicas` в редакторі, потім збережіть і вийдіть.

### Масштабування за допомогою `kubectl patch` {#scaling-using-kubectl-patch}

Ви можете оновити `.spec.replicas` за допомогою стратегічного злиття патчу:

```shell
kubectl patch deployment nginx-deployment -p '{"spec":{"replicas":4}}'
```

Для створення скриптів використовуйте патч JSON із тестом на наявність необхідних умов. Наведена нижче команда встановлює кількість реплік на 4, але лише в тому випадку, якщо поточна кількість становить 2:

```shell
kubectl patch deployment nginx-deployment --type=json -p='[
  {"op": "test", "path": "/spec/replicas", "value": 2},
  {"op": "replace", "path": "/spec/replicas", "value": 4}
]'
```

Операція `test` призводить до відмови патчу, якщо поточне значення не збігається, що запобігає небажаним змінам, коли кілька людей або скриптів змінюють один і той же Deployment.

## Коли використовувати ручне та автоматичне масштабування {#when-to-use-manual-versus-automatic-scaling}

| Аспект | Ручне масштабування | Автоматичне масштабування (HPA) |
|--------|------------------|-------------------------------|
| Найкраще для | Передбачуваних, запланованих або одноразових змін навантаження | Змінного або непередбачуваного попиту |
| Як це працює | Ви встановлюєте `.spec.replicas` безпосередньо | HPA регулює кількість реплік на основі спостережуваних метрик |
| Час реакції | Негайно після виконання команди | Реагує на метрики з невеликою затримкою |
| Усвідомлення метрик | Відсутнє — ви вирішуєте кількість реплік | Моніторинг CPU, памʼяті або користувацьких метрик |
| Обслуговування | Потребує ручного втручання для налаштування | Працює автономно після конфігурації |

{{< caution >}}
Якщо HorizontalPodAutoscaler керує Deployment, не встановлюйте репліки вручну. HPA постійно узгоджує кількість реплік і перевизначає будь-які ручні зміни.
{{< /caution >}}

## {{% heading "cleanup" %}}

Видаліть Deployment:

```shell
kubectl delete deployment nginx-deployment
```

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [Deployments](/docs/concepts/workloads/controllers/deployment/).
- Пройдіть через [Горизонтальне автомасштабування Podʼів](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- Дізнайтеся, як [масштабувати StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
- Дізнайтеся про [керування ресурсами](/docs/concepts/cluster-administration/manage-deployment/).
