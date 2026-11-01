---
title: ReplicaSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "ReplicaSet"
content_type: concept
description: >-
  Призначення ReplicaSet полягає в забезпеченні стабільного набору реплік Podʼів, які працюють у будь-який момент часу. Зазвичай ви визначаєте Deployment та дозволяєте цьому Deployment автоматично керувати ReplicaSets.
weight: 20
hide_summary: true # Listed separately in section index
---

<!-- overview -->

Призначення ReplicaSet полягає в забезпеченні стабільного набору реплік Podʼів, які працюють у будь-який момент часу. Тому ReplicaSet часто використовується для гарантування наявності вказаної кількості ідентичних Podʼів.

<!-- body -->

## Як працює ReplicaSet {#how-a-replicaset-works}

ReplicaSet визначається полями, включаючи селектор, який вказує, як ідентифікувати Podʼи, які він може отримати, кількість реплік, що вказує, скільки Podʼів він повинен підтримувати, і шаблон Podʼа, який вказує дані для нових Podʼів, які слід створити для відповідності критеріям кількості реплік. ReplicaSet виконує своє призначення, створюючи та видаляючи Podʼи за необхідності для досягнення їх бажаної кількості. Коли ReplicaSet потребує створення нових Podʼів, він використовує свій шаблон Podʼа.

ReplicaSet повʼязаний зі своїми Podʼами через поле [metadata.ownerReferences](/docs/concepts/architecture/garbage-collection/#owners-dependents) Podʼа, яке вказує, якому ресурсу належить поточний обʼєкт. Усі Podʼи, які отримав ReplicaSet, мають у полі ownerReferences ідентифікаційну інформацію ReplicaSet, що ними володіє. Завдяки цим посиланням ReplicaSet знає про стан Podʼів, які він підтримує, і планує дії відповідно.

ReplicaSet визначає нові Podʼи для отримання за допомогою свого селектора. Якщо існує Pod, який не має OwnerReference або OwnerReference не є {{< glossary_tooltip term_id="controller" text="контролером">}}, і він відповідає селектору ReplicaSet, цей ReplicaSet негайно його отримає.

## Коли використовувати ReplicaSet {#when-to-use-a-replicaset}

ReplicaSet забезпечує наявність вказаної кількості реплік Podʼів у будь-який момент часу. Проте Deployment є концепцією вищого рівня, яка керує ReplicaSets і надає декларативні оновлення для Podʼів разом із багатьма іншими корисними можливостями. Тому ми рекомендуємо використовувати Deployments замість безпосереднього використання ReplicaSets, хіба що вам потрібне власне оркестрування оновлень або оновлення взагалі не потрібні.

Це означає, що вам, можливо, ніколи не доведеться працювати з обʼєктами ReplicaSet: використовуйте Deployment та визначайте ваш застосунок у розділі spec.

## Приклад {#example}

{{% code_sample file="controllers/frontend.yaml" %}}

Якщо зберегти цей маніфест у файл `frontend.yaml` та застосувати його до кластера Kubernetes, буде створено визначений ReplicaSet та Podʼи, якими він керує.

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

Ви можете переглянути розгорнуті ReplicaSets за допомогою команди:

```shell
kubectl get rs
```

І побачите, що створено frontend:

```none
NAME       DESIRED   CURRENT   READY   AGE
frontend   3         3         3       6s
```

Ви також можете перевірити стан ReplicaSet:

```shell
kubectl describe rs/frontend
```

Ви побачите вивід, подібний до цього:

```none
Name:         frontend
Namespace:    default
Selector:     tier=frontend
Labels:       app=guestbook
              tier=frontend
Annotations:  <none>
Replicas:     3 current / 3 desired
Pods Status:  3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  tier=frontend
  Containers:
   php-redis:
    Image:        us-docker.pkg.dev/google-samples/containers/gke/gb-frontend:v5
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From                   Message
  ----    ------            ----  ----                   -------
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-gbgfx
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-rwz57
  Normal  SuccessfulCreate  13s   replicaset-controller  Created pod: frontend-wkl7w
```

І нарешті, ви можете перевірити створені Podʼи:

```shell
kubectl get pods
```

І побачите щось подібне до цього:

```none
NAME             READY   STATUS    RESTARTS   AGE
frontend-gbgfx   1/1     Running   0          10m
frontend-rwz57   1/1     Running   0          10m
frontend-wkl7w   1/1     Running   0          10m
```

Ви можете також перевірити, що посилання на власника цих Podʼів вказує на ReplicaSet frontend. Для цього отримайте YAML одного із запущених Podʼів:

```shell
kubectl get pods frontend-gbgfx -o yaml
```

Вивід буде схожий на цей, з інформацією про ReplicaSet frontend у полі ownerReferences метаданих:

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2024-02-28T22:30:44Z"
  generateName: frontend-
  labels:
    tier: frontend
  name: frontend-gbgfx
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: frontend
    uid: e129deca-f864-481b-bb16-b27abfd92292
...
```

## Володіння Podʼами без шаблону {#non-template-pod-acquisitions}

Хоча ви можете без проблем створювати окремі Podʼи, наполегливо рекомендується переконатися, що ці окремі Podʼи не мають міток, які відповідають селектору одного з ваших ReplicaSets. Причина цього полягає в тому, що ReplicaSet не обмежується володінням Podʼами, зазначеними в його шаблоні — він може отримати інші Podʼи у спосіб, визначений в попередніх розділах.

Візьмемо приклад попереднього ReplicaSet для фронтенду та Podʼів, визначених у цьому маніфесті:

{{% code_sample file="pods/pod-rs.yaml" %}}

Оскільки ці Podʼи не мають контролера (або будь-якого обʼєкта) як власника та відповідають селектору ReplicaSet для фронтенду, вони одразу перейдуть у його володіння.

Припустимо, ви створюєте Podʼи після того, як ReplicaSet для фронтенду було розгорнуто і він налаштував свої початкові репліки Podʼів для виконання вимог до кількості реплік:

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

Нові Podʼи будуть отримані ReplicaSet та негайно завершені, оскільки ReplicaSet буде мати більше, ніж його бажана кількість.

Отримання Podʼів:

```shell
kubectl get pods
```

Вивід покаже, що нові Podʼи або вже завершено, або в процесі завершення:

```
NAME             READY   STATUS        RESTARTS   AGE
frontend-b2zdv   1/1     Running       0          10m
frontend-vcmts   1/1     Running       0          10m
frontend-wtsmm   1/1     Running       0          10m
pod1             0/1     Terminating   0          1s
pod2             0/1     Terminating   0          1s
```

Якщо ви створите Podʼи спочатку:

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

А потім створите ReplicaSet таким чином:

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

Ви побачите, що ReplicaSet отримав Podʼи та створив нові лише відповідно до свого опису, доки кількість його нових Podʼів та оригінальних не відповідала його бажаній кількості. Якщо отримати Podʼи:

```shell
kubectl get pods
```

Вивід покаже, що:

```none
NAME             READY   STATUS    RESTARTS   AGE
frontend-hmmj2   1/1     Running   0          9s
pod1             1/1     Running   0          36s
pod2             1/1     Running   0          36s
```

Таким чином, ReplicaSet може володіти неоднорідним набором Podʼів.

## Написання маніфесту ReplicaSet {#writing-a-replicaset-manifest}

Як і усі інші обʼєкти API Kubernetes, ReplicaSet потребує полів `apiVersion`, `kind` та `metadata`. Для ReplicaSet `kind` завжди є ReplicaSet.

Коли панель управління створює нові Podʼи для ReplicaSet, `.metadata.name` ReplicaSet є частиною основи для назв цих Podʼів. Назва ReplicaSet повинна бути дійсним значенням [DNS-піддомену](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names), але це може призвести до неочікуваних результатів для імен хостів Podʼів. Для найкращої сумісності назва має відповідати суворішим правилам для [DNS-мітки](/docs/concepts/overview/working-with-objects/names#dns-label-names).

ReplicaSet також потребує розділу [`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Шаблон Podʼа {#pod-template}

`.spec.template` — це [шаблон Podʼа](/docs/concepts/workloads/pods/#pod-templates), який також повинен мати встановлені мітки. У нашому прикладі `frontend.yaml` ми мали одну мітку: `tier: frontend`. Будьте обережні, щоб селектори не перекривалися з селекторами інших контролерів, інакше вони можуть спробувати перейняти цей Pod.

Для поля [політики перезапуску](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) шаблону, `.spec.template.spec.restartPolicy`, допустимим є тільки значення `Always`, яке є стандартним.

### Селектор Podʼа {#pod-selector}

Поле `.spec.selector` є [селектором міток](/docs/concepts/overview/working-with-objects/labels/). Як обговорювалося [раніше](#how-a-replicaset-works), це мітки, які використовуються для ідентифікації потенційних Podʼів для володіння. У нашому прикладі `frontend.yaml` селектор був:

```yaml
matchLabels:
  tier: frontend
```

У ReplicaSet `.spec.template.metadata.labels` має відповідати `spec.selector`, інакше він буде відхилений API.

{{< note >}}
Для 2 ReplicaSets, які вказують однаковий `.spec.selector`, але різні поля `.spec.template.metadata.labels` та `.spec.template.spec`, кожен ReplicaSet ігнорує Podʼи, створені іншим ReplicaSet.
{{< /note >}}

### Репліки {#replicas}

Ви можете вказати, скільки Podʼів мають виконуватись одночасно, встановивши значення `.spec.replicas`. ReplicaSet буде створювати/видаляти свої Podʼи, щоб кількість Podʼів відповідала цьому числу.

Якщо ви не вказали `.spec.replicas`, то типово значення дорівнює 1.

## Робота з ReplicaSets {#working-with-replicasets}

### Видалення ReplicaSet та його Podʼів {#deleting-a-replicaset-and-its-pods}

Щоб видалити ReplicaSet і всі його Podʼи, використовуйте [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete). [Збирач сміття](/docs/concepts/architecture/garbage-collection/) стандартно автоматично видаляє всі залежні Podʼи.

Під час використання REST API або бібліотеки `client-go` вам потрібно встановити `propagationPolicy` в `Background` або `Foreground` в опції `-d`. Наприклад:

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
  -H "Content-Type: application/json"
```

### Видалення лише ReplicaSet {#deleting-just-a-replicaset}

Ви можете видалити ReplicaSet, не впливаючи на його Podʼи, за допомогою [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete) з опцією `--cascade=orphan`. Під час використання REST API або бібліотеки `client-go` вам потрібно встановити `propagationPolicy` в `Orphan`. Наприклад:

```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
  -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
  -H "Content-Type: application/json"
```

Після видалення оригіналу ви можете створити новий ReplicaSet для заміни. Поки старий та новий `.spec.selector` однакові, новий перейме старі Podʼи. Однак він не намагатиметься привести наявні Podʼи у відповідність до нового, іншого шаблону Podʼа. Для оновлення Podʼів до нової специфікації у контрольований спосіб використовуйте [Deployment](/docs/concepts/workloads/controllers/deployment/#creating-a-deployment), оскільки ReplicaSets безпосередньо не підтримують поетапне оновлення.

### Podʼи, що завершують роботу {#terminating-pods}

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

Ви можете увімкнути цю функцію, встановивши [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DeploymentReplicaSetTerminatingReplicas` на [API-сервері](/docs/reference/command-line-tools-reference/kube-apiserver/) та в [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)

Podʼи, що завершують роботу через видалення або зменшення масштабу, можуть завершуватися тривалий час і впродовж цього періоду споживати додаткові ресурси. Як наслідок, загальна кількість усіх Podʼів може тимчасово перевищити `.spec.replicas`. Podʼи, що завершують роботу, можна відстежувати за допомогою поля `.status.terminatingReplicas` в ReplicaSet.

### Ізолювання Podʼів від ReplicaSet {#isolating-pods-from-a-replicaset}

Ви можете видалити Podʼи з ReplicaSet, змінивши їх мітки. Цей метод може бути використаний для вилучення Podʼів з обслуговування з метою налагодження, відновлення даних тощо. Podʼи, які вилучаються цим способом, будуть автоматично замінені (за умови, що кількість реплік також не змінюється).

### Масштабування ReplicaSet {#scaling-a-replicaset}

ReplicaSet можна легко масштабувати вгору або вниз, просто оновивши поле `.spec.replicas`. Контролер ReplicaSet гарантує, що бажана кількість Podʼів з відповідним селектором міток доступна та працює.

Під час зменшення масштабу контролер ReplicaSet вибирає Podʼи для видалення, сортуючи доступні Podʼи, щоб визначити, які Podʼи видаляти в першу чергу, за таким загальним алгоритмом:

1. Перш за все прибираються Podʼи, що перебувають в очікуванні (і непридатні для планування).
1. Якщо встановлено анотацію `controller.kubernetes.io/pod-deletion-cost`, то Pod із меншим значенням буде видалено першим.
1. Podʼи на вузлах з більшою кількістю реплік йдуть перед Podʼами на вузлах з меншою кількістю реплік.
1. Якщо часи створення Podʼів відрізняються, то Pod, створений пізніше, йде перед старішим Podʼом (часи створення групуються за цілочисельною логарифмічною шкалою).

Якщо все вище вказане збігається, вибір випадковий.

### Вартість видалення Podʼа {#pod-deletion-cost}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

За допомогою анотації [`controller.kubernetes.io/pod-deletion-cost`](/docs/reference/labels-annotations-taints/#pod-deletion-cost) користувачі можуть встановити уподобання щодо порядку видалення Podʼів під час зменшення масштабу ReplicaSet.

Анотація повинна бути встановлена на Podʼі, діапазон — [-2147483648, 2147483647]. Вона представляє вартість видалення Podʼа порівняно з іншими Podʼами, які належать тому ж ReplicaSet. Podʼи з меншою вартістю видалення видаляються раніше за Podʼи з більшою вартістю видалення.

Неявне значення для цієї анотації для Podʼів, які його не мають, — 0; допустимі відʼємні значення. Неприпустимі значення будуть відхилені API-сервером.

Ця функція перебуває на стадії бета та типово увімкнена. Ви можете вимкнути її, використовуючи [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `PodDeletionCost` як в kube-apiserver, так і в kube-controller-manager.

{{< note >}}

- Це враховується за принципом best-effort, тому порядок видалення Podʼів не гарантується.
- Користувачам слід уникати частого оновлення анотації, такого як оновлення її на основі значення метрики, оскільки це призведе до значного числа оновлень Podʼів на apiserver.
  {{< /note >}}

#### Приклад використання {#example-use-case}

Різні Podʼи застосунку можуть мати різний рівень використання. Під час зменшення масштабу застосунок може віддавати перевагу видаленню Podʼів з меншим використанням. Щоб уникнути частого оновлення Podʼів, застосунок повинен оновити `controller.kubernetes.io/pod-deletion-cost` один раз перед зменшенням масштабу (встановлення анотації в значення, пропорційне рівню використання Podʼа). Це працює, якщо сам застосунок контролює масштабування вниз; наприклад, Pod-драйвер розгортання Spark.

### ReplicaSet як ціль горизонтального автомасштабування Podʼа {#replicaset-as-a-horizontal-pod-autoscaler-target}

ReplicaSet також може бути ціллю для [горизонтального автомасштабування Podʼа (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/). Іншими словами, ReplicaSet може автоматично масштабуватися за допомогою HPA. Ось приклад HPA, який застосовується до ReplicaSet, створеного в попередньому прикладі.

{{% code_sample file="controllers/hpa-rs.yaml" %}}

Збереження цього маніфесту в `hpa-rs.yaml` та його застосування до кластера Kubernetes повинно створити визначене HPA, яке автоматично змінює масштаб цільового ReplicaSet залежно від використання CPU реплікованими Podʼами.

```shell
kubectl apply -f https://k8s.io/examples/controllers/hpa-rs.yaml
```

Або ви можете використовувати команду `kubectl autoscale` для досягнення того ж самого (і це простіше!)

```shell
kubectl autoscale rs frontend --max=10 --min=3 --cpu=50%
```

## Альтернативи ReplicaSet {#alternatives-to-replicaset}

### Deployment (рекомендовано) {#deployment-recommended}

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) — це обʼєкт, який може володіти ReplicaSets і оновлювати їх та їхні Podʼи через декларативні поетапні оновлення на стороні сервера. Хоча ReplicaSets можуть використовуватися незалежно, на сьогодні вони головним чином використовуються Deployments як механізм для оркестрування створення, видалення та оновлення Podʼів. Коли ви використовуєте Deployments, вам не потрібно турбуватися про керування ReplicaSets, які вони створюють. Deployments володіють і керують своїми ReplicaSets. Таким чином, рекомендується використовувати Deployments, коли вам потрібні ReplicaSets.

### Окремі Podʼи {#bare-pods}

На відміну від випадку, коли користувач безпосередньо створює Podʼи, ReplicaSet замінює Podʼи, які видаляються або завершуються з будь-якої причини, такої як відмова вузла чи обслуговування вузла з перериванням роботи, наприклад, оновлення ядра. З цієї причини ми рекомендуємо використовувати ReplicaSet, навіть якщо ваш застосунок вимагає лише одного Podʼа. Подібно до наглядача процесів, він наглядає за кількома Podʼами на різних вузлах замість окремих процесів на одному вузлі. ReplicaSet делегує перезапуск локальних контейнерів до агента на вузлі, такого як Kubelet.

### Job

Використовуйте [`Job`](/docs/concepts/workloads/controllers/job/) замість ReplicaSet для Podʼів, які повинні завершитися самостійно (тобто пакетні завдання).

### DaemonSet

Використовуйте [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) замість ReplicaSet для Podʼів, які надають функції на рівні машини, такі як моніторинг машини або логування машини. Ці Podʼи мають термін служби, який повʼязаний з терміном служби машини: Pod повинен працювати на машині перед тим, як інші Podʼи почнуть роботу, і їх можна безпечно завершити, коли машина готова до перезавантаження/вимкнення.

### ReplicationController

ReplicaSets є наступниками [ReplicationControllers](/docs/concepts/workloads/controllers/replicationcontroller/). Обидва мають те саме призначення та поводяться схоже, за винятком того, що ReplicationController не підтримує вимоги селектора на основі множини, як описано в [посібнику про мітки](/docs/concepts/overview/working-with-objects/labels/#label-selectors). Тому ReplicaSets мають перевагу над ReplicationControllers.

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся про [Podʼи](/docs/concepts/workloads/pods).
- Дізнайтеся про [Deployments](/docs/concepts/workloads/controllers/deployment/).
- [Запустіть stateless-застосунок за допомогою Deployment](/docs/tasks/run-application/run-stateless-application-deployment/), що ґрунтується на роботі ReplicaSets.
- `ReplicaSet` — це ресурс верхнього рівня у REST API Kubernetes. Прочитайте визначення обʼєкта {{< api-reference page="apps/replica-set-v1" >}}, щоб зрозуміти API для ReplicaSets.
- Дізнайтеся про [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) та як ви можете використовувати його для керування доступністю застосунку під час переривань роботи.
