---
title: Оновлення Deployment без простою
content_type: task
weight: 16
---

<!-- overview -->

На цій сторінці показано, як оновити запущений Deployment до нової версії за допомогою поетапного оновлення. Поетапне оновлення поступово замінює старі Podʼи новими, тому ваш застосунок залишається доступним протягом усього процесу.

## {{% heading "objectives" %}} {#objectives}

- Запустити поетапне оновлення Deployment.
- Стежити за перебігом розгортання.
- Призупинити та відновити розгортання.
- Налаштувати параметри стратегії поетапного оновлення.
- (За потреби) Відкотитися до попередньої ревізії.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Вам потрібен наявний Deployment. Якщо у вас його немає, створіть Deployment nginx зі сторінки [Запуск застосунку без збереження стану за допомогою Deployment](/docs/tasks/run-application/run-stateless-application-deployment/):

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

## Виконання поетапного оновлення {#performing-a-rolling-update}

Будь-яка зміна в полі `.spec.template` Deployment запускає поетапне оновлення. Kubernetes створює нові Podʼи з оновленою конфігурацією й поступово завершує старі Podʼи.

### Оновлення за допомогою `kubectl apply` {#updating-with-kubectl-apply}

Ви можете запустити поетапне оновлення, відредагувавши маніфест Deployment і застосувавши зміну. Цей підхід добре працює, якщо ви зберігаєте маніфести в системі контролю версій.

Експортуйте поточний Deployment у локальний файл:

```shell
kubectl get deployment nginx-deployment -o yaml > /tmp/nginx-deployment.yaml
```

Відредагуйте `/tmp/nginx-deployment.yaml` і змініть `.spec.template.spec.containers[0].image` з `nginx:1.14.2` на `nginx:1.16.1`.

Перед застосуванням порівняйте свої локальні зміни зі станом кластера:

```shell
kubectl diff -f /tmp/nginx-deployment.yaml
```

Вивід подібний до такого:

```
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

Вивід подібний до такого:

```
deployment.apps/nginx-deployment image updated
```

Перевірте, що образ було оновлено:

```shell
kubectl get deployment nginx-deployment -o jsonpath='{.spec.template.spec.containers[0].image}'
```

Вивід подібний до такого:

```
nginx:1.16.1
```

## Відстеження перебігу розгортання {#monitoring-rollout-progress}

Використовуйте `kubectl rollout status`, щоб стежити за перебігом поетапного оновлення:

```shell
kubectl rollout status deployment/nginx-deployment
```

Вивід подібний до такого:

```
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 old replicas are pending termination...
deployment "nginx-deployment" successfully rolled out
```

Після завершення розгортання перевірте Deployment:

```shell
kubectl get deployment nginx-deployment
```

Вивід подібний до такого:

```
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   2/2     2            2           2m
```

## Призупинення та відновлення розгортання {#pausing-and-resuming-a-rollout}

Ви можете призупинити розгортання, щоб перевірити часткове оновлення або обʼєднати кілька змін в одне розгортання.

### Призупинення розгортання {#pausing-a-rollout}

```shell
kubectl rollout pause deployment/nginx-deployment
```

Вивід подібний до такого:

```
deployment.apps/nginx-deployment paused
```

### Виконання додаткових змін під час призупинення {#making-additional-changes-while-paused}

Поки розгортання призупинено, ви можете вносити додаткові зміни. Ці зміни не запускають нове розгортання, доки ви його не відновите:

```shell
kubectl set image deployment/nginx-deployment nginx=nginx:1.17.0
```

{{< note >}}
Ви можете внести кілька змін у призупинений Deployment. Kubernetes застосовує всі зміни разом, коли ви відновлюєте розгортання.
{{< /note >}}

### Відновлення розгортання {#resuming-a-rollout}

```shell
kubectl rollout resume deployment/nginx-deployment
```

Вивід подібний до такого:

```
deployment.apps/nginx-deployment resumed
```

Перевірте, що розгортання завершується:

```shell
kubectl rollout status deployment/nginx-deployment
```

## Налаштування стратегії поетапного оновлення {#configuring-rolling-update-strategy}

Deployments підтримують два [типи стратегій оновлення](/docs/concepts/workloads/controllers/deployment/#strategy):

- **RollingUpdate** (стандартно): поступово замінює старі Podʼи новими.
- **Recreate**: спочатку завершує всі наявні Podʼи, а потім створює нові. Це призводить до простою.

Для стратегії RollingUpdate ці параметри контролюють, як Kubernetes виконує оновлення:

| Параметр | Що контролює | Стандартно | Приклад |
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

Ви також можете задати ці поля в маніфесті Deployment у `.spec.strategy.rollingUpdate`. Докладні приклади дивіться в розділах [max unavailable](/docs/concepts/workloads/controllers/deployment/#max-unavailable) і [max surge](/docs/concepts/workloads/controllers/deployment/#max-surge) документації з концепцій Deployment.

### Виявлення розгортання, що застрягло {#detecting-a-stalled-rollout}

Якщо розгортання не просувається протягом часу, вказаного в `.spec.progressDeadlineSeconds` (стандартно: 600 секунд), Kubernetes позначає стан Deployment `Progressing` як `False`. Перевірити цей стан можна, описавши Deployment:

```shell
kubectl describe deployment nginx-deployment
```

Шукайте стан `Progressing` у розділі `Conditions` виводу. Розгортання, що застрягло, зазвичай вказує на те, що нові Podʼи не можуть запуститися. Розділ `Events` у виводі може допомогти діагностувати проблему.

## Відкочування до попередньої ревізії {#rollback}

Якщо нова версія спричиняє проблеми, ви можете відкотитися до попередньої ревізії.

### Перегляд історії розгортання {#viewing-rollout-history}

```shell
kubectl rollout history deployment/nginx-deployment
```

Вивід подібний до такого:

```
deployment.apps/nginx-deployment
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

{{< note >}}
Стовпець `CHANGE-CAUSE` показує значення анотації `kubernetes.io/change-cause` на момент кожної ревізії. Ця анотація **не** встановлюється автоматично, але якщо ви використовуєте автоматизоване рішення для керування Deployments, ваш інструмент може записувати в цю анотацію певний текст.
{{< /note >}}

### Відкочування до попередньої ревізії {#rolling-back-to-the-previous-revision}

```shell
kubectl rollout undo deployment/nginx-deployment
```

Вивід подібний до такого:

```
deployment.apps/nginx-deployment rolled back
```

### Відкочування до конкретної ревізії {#rolling-back-to-a-specific-revision}

```shell
kubectl rollout undo deployment/nginx-deployment --to-revision=1
```

Перевірте, що відкочування завершується:

```shell
kubectl rollout status deployment/nginx-deployment
```

{{< note >}}
Історія ревізій Deployment зберігається в ReplicaSets, якими він керує. Стандартно Kubernetes зберігає 10 старих ReplicaSets. Ви можете змінити це обмеження, встановивши `.spec.revisionHistoryLimit` у маніфесті Deployment. Значення `0` повністю вимикає відкочування.
{{< /note >}}

## {{% heading "cleanup" %}} {#cleaning-up}

Видаліть Deployment:

```shell
kubectl delete deployment nginx-deployment
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Дізнайтеся більше про [Deployments](/docs/concepts/workloads/controllers/deployment/).
- Дізнайтеся, як [масштабувати Deployment вручну](/docs/tasks/run-application/scale-deployment/).
- Пройдіть матеріал [Горизонтальне автомасштабування Podʼів](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).
- Дізнайтеся, як [виконати поетапне оновлення DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
