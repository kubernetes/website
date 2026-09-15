---
title: Оновлення Deployment без простою
content_type: task
weight: 16
---

<!-- overview -->

Ця сторінка показує, як оновити працюючий Deployment до нової версії за допомогою поступового оновлення (rolling update). Поступове оновлення поступово замінює старі Podʼи новими, тому ваш застосунок залишається доступним протягом усього процесу.

## {{% heading "objectives" %}}

- Запустити поступове оновлення Deployment.
- Моніторинг прогресу оновлення.
- Призупинити та відновити розгортання.
- Налаштувати параметри стратегії поступового оновлення.
- (Якщо потрібно) Відкотити до попередньої версії.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібен наявний Deployment. Якщо у вас його немає, створіть Deployment nginx з [Запуск застосунку без збереження стану за допомогою Deployment](/docs/tasks/run-application/run-stateless-application-deployment/):

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Перевірте, що Deployment має два Podʼи:

```shell
kubectl get deployment nginx-deployment
```

Вивід схожий на:

```none
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           10s
```

<!-- steps -->

## Виконання поступового оновлення {#performing-a-rolling-update}

Будь-яка зміна в полі `.spec.template` Deployment запускає поступове оновлення. Kubernetes створює нові Podʼи з оновленою конфігурацією та поступово завершує старі Podʼи.

### Оновлення за допомогою `kubectl apply` {#updating-with-kubectl-apply}

Ви можете запустити поступове оновлення, редагуючи маніфест Deployment і застосовуючи зміни. Цей підхід добре працює, якщо ви зберігаєте маніфести у системі контролю версій.

Експортуйте поточний Deployment у локальний файл:

```shell
kubectl get deployment nginx-deployment -o yaml > /tmp/nginx-deployment.yaml
```

Редагуйте `/tmp/nginx-deployment.yaml` і змініть `.spec.template.spec.containers[0].image` з `nginx:1.14.2` на `nginx:1.16.1`.

Перед застосуванням порівняйте ваші локальні зміни зі станом кластера:

```shell
kubectl diff -f /tmp/nginx-deployment.yaml
```

Вивід схожий на:

```none
diff -u -N /tmp/LIVE/apps.v1.Deployment.default.nginx-deployment /tmp/MERGED/apps.v1.Deployment.default.nginx-deployment
--- /tmp/LIVE/apps.v1.Deployment...
+++ /tmp/MERGED/apps.v1.Deployment...
@@ -29,7 +29,7 @@
       containers:
-      - image: nginx:1.14.2
+      - image: nginx:1.16.1
         name: nginx
```

Застосуйте оновлений маніфест:

```shell
kubectl apply -f /tmp/nginx-deployment.yaml
```

### Оновлення лише образу контейнера {#updating-only-the-container-image}

Щоб оновити образ контейнера без редагування файлу маніфесту, використовуйте `kubectl set image`:

```shell
kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
```

Вивід схожий на:

```none
deployment.apps/nginx-deployment image updated
```

Перевірте, що образ було оновлено:

```shell
kubectl get deployment nginx-deployment -o jsonpath='{.spec.template.spec.containers[0].image}'
```

Вивід схожий на:

```none
nginx:1.16.1
```

## Моніторинг прогресу оновлення {#monitoring-rollout-progress}

Використовуйте `kubectl rollout status`, щоб стежити за прогресом поступового оновлення:

```shell
kubectl rollout status deployment/nginx-deployment
```

Вивід схожий на:

```none
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 old replicas are pending termination...
deployment "nginx-deployment" successfully rolled out
```

Після завершення оновлення перевірте Deployment:

```shell
kubectl get deployment nginx-deployment
```

Вивід схожий на:

```none
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           2m
```

## Призупинення та відновлення поступового оновлення {#pausing-and-resuming-a-rollout}

Ви можете призупинити поступове оновлення, щоб перевірити часткове оновлення або обʼєднати кілька змін в одне оновлення.

### Призупинення поступового оновлення {#pausing-a-rollout}

```shell
kubectl rollout pause deployment/nginx-deployment
```

Вивід схожий на:

```none
deployment.apps/nginx-deployment paused
```

### Виконання додаткових змін під час призупинення {#making-additional-changes-while-paused}

Під час призупинення поступового оновлення ви можете вносити додаткові зміни. Ці зміни не запускають нове оновлення, поки ви не відновите його:

```shell
kubectl set image deployment/nginx-deployment nginx=nginx:1.17.0
```

{{< note >}}
Ви можете внести кілька змін у призупинений Deployment. Kubernetes застосовує всі зміни одночасно, коли ви відновлюєте поступове оновлення.
{{< /note >}}

### Відновлення поступового оновлення {#resuming-a-rollout}

```shell
kubectl rollout resume deployment/nginx-deployment
```

Вивід схожий на :

```none
deployment.apps/nginx-deployment resumed
```

Перевірте, що поступове оновлення завершено:

```shell
kubectl rollout status deployment/nginx-deployment
```

## Налаштування стратегії поступового оновлення {#configuring-rolling-update-strategy}

Deployments підтримують два [типи стратегій оновлення](/docs/concepts/workloads/controllers/deployment/#strategy):

- **RollingUpdate** (стандартно): поступово замінює старі Podʼи новими.
- **Recreate**: спочатку завершує всі наявні Podʼи, а потім створює нові. Це призводить до простою.

Для стратегії RollingUpdate ці параметри контролюють, як Kubernetes виконує оновлення:

| Parameter | Controls | Default | Example |
|-----------|----------|---------|---------|
| `maxUnavailable` | Максимальна кількість Podʼів, які можуть бути недоступні під час оновлення | 25% | `1` або `25%` |
| `maxSurge` | Максимальна кількість додаткових Podʼів, які можуть бути створені під час оновлення | 25% | `1` або `25%` |

{{< note >}}
`maxUnavailable` та `maxSurge` приймають абсолютне число або відсоток. Kubernetes обчислює відсотки від бажаної кількості реплік, округлюючи вниз для `maxUnavailable` та округлюючи вгору для `maxSurge`.
{{< /note >}}

Для налаштування цих параметрів використовуйте `kubectl patch`:

```shell
kubectl patch deployment nginx-deployment -p \
  '{"spec":{"strategy":{"rollingUpdate":{"maxUnavailable":"25%","maxSurge":"25%"}}}}'
```

Ви також можете встановити ці поля в маніфесті Deployment під
`.spec.strategy.rollingUpdate`. Для детальних прикладів дивіться [max unavailable](/docs/concepts/workloads/controllers/deployment/#max-unavailable) та [max surge](/docs/concepts/workloads/controllers/deployment/#max-surge) в документації з концепцій Deployment.

### Виявлення завислого поступового оновлення {#detecting-a-stalled-rollout}

Якщо поступове оновлення не просувається протягом часу, вказаного в `.spec.progressDeadlineSeconds` (зазвичай: 600 секунд), Kubernetes позначає стан Deployment `Progressing` як `False`. Ви можете перевірити цей стан, описавши Deployment:

```shell
kubectl describe deployment nginx-deployment
```

Шукайте стан `Progressing` у розділі `Conditions` у виводі. Зависле поступове оновлення зазвичай вказує на те, що нові Podʼи не можуть запуститися. Розділ `Events` у виводі може допомогти діагностувати проблему.

## Повернення до попередньої ревізії {#rollback}

Якщо нова версія викликає проблеми, ви можете повернутися до попередньої ревізії.

### Перегляд історії поступового оновлення {#viewing-rollout-history}

```shell
kubectl rollout history deployment/nginx-deployment
```

Вивід схожий на:

```none
deployment.apps/nginx-deployment
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

{{< note >}}
Стовпець `CHANGE-CAUSE` показує значення анотації `kubernetes.io/change-cause` на момент кожної ревізії. Ця анотація **не** встановлюється автоматично, але якщо ви використовуєте автоматизоване рішення для керування Deployment, інструмент, який ви використовуєте, може записати деякий текст у цю анотацію.
{{< /note >}}

### Повернення до попередньої ревізії {#rollback-to-the-previous-revision}

```shell
kubectl rollout undo deployment/nginx-deployment
```

Вивід схожий на:

```none
deployment.apps/nginx-deployment rolled back
```

### Повернення до конкретної ревізії {#rollback-to-a-specific-revision}

```shell
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```

Перевірте, що повернення до попередньої ревізії завершено:

```shell
kubectl rollout status deployment/nginx-deployment
```

{{< note >}}
Історія ревізій Deployment зберігається в ReplicaSets, які він контролює. Зазвичай Kubernetes зберігає 10 старих ReplicaSets. Ви можете змінити цей ліміт, встановивши `.spec.revisionHistoryLimit` у маніфесті Deployment. Встановлення значення `0` повністю вимикає можливість відкату.
{{< /note >}}

## {{% heading "cleanup" %}}

Видаліть Deployment:

```shell
kubectl delete deployment nginx-deployment
```

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [Deployments](/docs/concepts/workloads/controllers/deployment/).
- Дізнайтеся, як [масштабувати Deployment вручну](/docs/tasks/run-application/scale-deployment/).
- Пройдіть завдання з [Горизонтального автомасштабування Podʼів](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- Дізнайтеся, як [виконати поступове оновлення для DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
