---
title: Оновлення обʼєктів API на місці за допомогою kubectl patch
description: Використовуйте kubectl patch для оновлення обʼєктів Kubernetes API на місці. Виконайте strategic merge patch або JSON merge patch.
content_type: task
weight: 50
---

<!-- overview -->

У цьому завданні показано, як використовувати `kubectl patch` для оновлення обʼєкта API на місці. Вправи цього завдання демонструють strategic merge patch і JSON merge patch.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Використання strategic merge patch для оновлення Deployment {#use-a-strategic-merge-patch-to-update-a-deployment}

Ось файл конфігурації для Deployment, що має дві репліки. Кожна репліка є Podʼом, який має один контейнер:

{{% code_sample file="application/deployment-patch.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-patch.yaml
```

Перегляньте Podʼи, повʼязані з вашим Deployment:

```shell
kubectl get pods
```

Вивід показує, що Deployment має два Podʼи. `1/1` вказує на те, що кожен Pod має один контейнер:

```
NAME                        READY     STATUS    RESTARTS   AGE
patch-demo-28633765-670qr   1/1       Running   0          23s
patch-demo-28633765-j5qs3   1/1       Running   0          23s
```

Запишіть назви запущених Podʼів. Пізніше ви побачите, що ці Podʼи будуть завершені й замінені новими.

На цей момент кожен Pod має один контейнер, який запускає образ nginx. Тепер припустимо, що ви хочете, щоб кожен Pod мав два контейнери: один запускає nginx, а інший — redis.

Створіть файл з назвою `patch-file.yaml` із таким вмістом:

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-2
        image: redis
```

Застосуйте патч до вашого Deployment:

```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
```

Перегляньте Deployment після накладання патчу:

```shell
kubectl get deployment patch-demo --output yaml
```

Вивід показує, що PodSpec у Deployment має два контейнери:

```yaml
containers:
- image: redis
  imagePullPolicy: Always
  name: patch-demo-ctr-2
  ...
- image: nginx
  imagePullPolicy: Always
  name: patch-demo-ctr
  ...
```

Перегляньте Podʼи, повʼязані з вашим Deployment після накладання патчу:

```shell
kubectl get pods
```

Вивід показує, що запущені Podʼи мають інші назви, ніж Podʼи, які працювали раніше. Deployment завершив старі Podʼи й створив два нові Podʼи, що відповідають оновленій специфікації Deployment. `2/2` вказує на те, що кожен Pod має два контейнери:

```
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1081991389-2wrn5   2/2       Running   0          1m
patch-demo-1081991389-jmg7b   2/2       Running   0          1m
```

Придивіться уважніше до одного з Podʼів patch-demo:

```shell
kubectl get pod <your-pod-name> --output yaml
```

Вивід показує, що Pod має два контейнери: один, який запускає nginx, і один, який запускає redis:

```
containers:
- image: redis
  ...
- image: nginx
  ...
```

### Примітки щодо strategic merge patch {#notes-on-the-strategic-merge-patch}

Патч, який ви виконали в попередній вправі, називається *strategic merge patch*. Зверніть увагу, що патч не замінив список `containers`. Натомість він додав до списку новий контейнер. Іншими словами, список у патчі обʼєднано з наявним списком. Так відбувається не завжди, коли ви застосовуєте strategic merge patch до списку. У деяких випадках список замінюється, а не обʼєднується.

Під час strategic merge patch список або замінюється, або обʼєднується залежно від його стратегії патча. Стратегія патча задається значенням ключа `patchStrategy` у теґу поля у вихідному коді Kubernetes. Наприклад, поле `Containers` структури `PodSpec` має `patchStrategy` зі значенням `merge`:

```go
type PodSpec struct {
  ...
  Containers []Container `json:"containers" patchStrategy:"merge" patchMergeKey:"name" ...`
  ...
}
```

Ви також можете побачити стратегію патча в [специфікації OpenApi](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json):

```yaml
"io.k8s.api.core.v1.PodSpec": {
    ...,
    "containers": {
        "description": "List of containers belonging to the pod.  ...."
    },
    "x-kubernetes-patch-merge-key": "name",
    "x-kubernetes-patch-strategy": "merge"
}
```
<!-- для редакторів: спеціально використовуйте yaml замість json тут, щоб уникнути помилки підсвітки синтаксису. -->

І ви можете побачити стратегію патча в [документації Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Створіть файл з назвою `patch-file-tolerations.yaml` із таким вмістом:

```yaml
spec:
  template:
    spec:
      tolerations:
      - effect: NoSchedule
        key: disktype
        value: ssd
```

Застосуйте патч до вашого Deployment:

```shell
kubectl patch deployment patch-demo --patch-file patch-file-tolerations.yaml
```

Перегляньте Deployment після накладання патчу:

```shell
kubectl get deployment patch-demo --output yaml
```

Вивід показує, що PodSpec у Deployment має лише один Toleration:

```yaml
tolerations:
- effect: NoSchedule
  key: disktype
  value: ssd
```

Зверніть увагу, що список `tolerations` у PodSpec замінено, а не обʼєднано. Це тому, що поле Tolerations у PodSpec не має ключа `patchStrategy` у своєму теґу поля. Тож strategic merge patch використовує стандартну стратегію патча, тобто `replace`.

```go
type PodSpec struct {
  ...
  Tolerations []Toleration `json:"tolerations,omitempty" protobuf:"bytes,22,opt,name=tolerations"`
  ...
}
```

## Використання JSON merge patch для оновлення Deployment {#use-a-json-merge-patch-to-update-a-deployment}

Strategic merge patch відрізняється від [JSON merge patch](https://tools.ietf.org/html/rfc7386). Якщо під час JSON merge patch потрібно оновити список, слід вказати весь новий список. Новий список повністю замінює наявний.

Команда `kubectl patch` має параметр `type`, який ви можете встановити на одне з цих значень:

<table>
  <tr><th>Значення параметра</th><th>Тип злиття</th></tr>
  <tr><td>json</td><td><a href="https://tools.ietf.org/html/rfc6902">JSON Patch, RFC 6902</a></td></tr>
  <tr><td>merge</td><td><a href="https://tools.ietf.org/html/rfc7386">JSON Merge Patch, RFC 7386</a></td></tr>
  <tr><td>strategic</td><td>Strategic merge patch</td></tr>
</table>

Порівняння JSON patch і JSON merge patch дивіться в [JSON Patch and JSON Merge Patch](https://erosb.github.io/post/json-patch-vs-merge-patch/).

Стандартне значення параметра `type` — `strategic`. Тож у попередній вправі ви виконали strategic merge patch.

Далі виконайте JSON merge patch для того самого Deployment. Створіть файл з назвою `patch-file-2.yaml` із таким вмістом:

```yaml
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-3
        image: gcr.io/google-samples/hello-app:2.0
```

У вашій команді патча встановіть `type` на `merge`:

```shell
kubectl patch deployment patch-demo --type merge --patch-file patch-file-2.yaml
```

Перегляньте Deployment після накладання патчу:

```shell
kubectl get deployment patch-demo --output yaml
```

Список `containers`, який ви вказали у патчі, має лише один контейнер. Вивід показує, що ваш список з одним контейнером замінив наявний список `containers`.

```yaml
spec:
  containers:
  - image: gcr.io/google-samples/hello-app:2.0
    ...
    name: patch-demo-ctr-3
```

Перегляньте запущені Podʼи:

```shell
kubectl get pods
```

У виводі ви можете побачити, що наявні Podʼи були завершені, а нові Podʼи — створені. `1/1` вказує на те, що кожен новий Pod працює лише з одним контейнером.

```shell
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1307768864-69308   1/1       Running   0          1m
patch-demo-1307768864-c86dc   1/1       Running   0          1m
```

## Використання strategic merge patch для оновлення Deployment зі стратегією retainKeys {#use-strategic-merge-patch-to-update-a-deployment-using-the-retainkeys-strategy}

Ось файл конфігурації для Deployment, що використовує стратегію `RollingUpdate`:

{{% code_sample file="application/deployment-retainkeys.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-retainkeys.yaml
```

На цей момент Deployment створено і використовує стратегію `RollingUpdate`.

Створіть файл з назвою `patch-file-no-retainkeys.yaml` з таким вмістом:

```yaml
spec:
  strategy:
    type: Recreate
```

Застосуйте патч до вашого Deployment:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-no-retainkeys.yaml
```

У виводі ви побачите, що неможливо встановити `type` як `Recreate`, коли значення визначено для `spec.strategy.rollingUpdate`:

```
The Deployment "retainkeys-demo" is invalid: spec.strategy.rollingUpdate: Forbidden: may not be specified when strategy `type` is 'Recreate'
```

Щоб вилучити значення `spec.strategy.rollingUpdate` під час оновлення значення `type`, використовуйте стратегію `retainKeys` для strategic merge patch.

Створіть ще один файл з назвою `patch-file-retainkeys.yaml` з таким вмістом:

```yaml
spec:
  strategy:
    $retainKeys:
    - type
    type: Recreate
```

Цим патчем ми вказуємо, що хочемо зберегти лише ключ `type` обʼєкта `strategy`. Таким чином, під час операції патча `rollingUpdate` буде вилучено.

Знову застосуйте патч до вашого Deployment з цим новим патчем:

```shell
kubectl patch deployment retainkeys-demo --type strategic --patch-file patch-file-retainkeys.yaml
```

Дослідіть вміст Deployment:

```shell
kubectl get deployment retainkeys-demo --output yaml
```

У виводі показано, що обʼєкт стратегії в Deployment більше не містить ключа `rollingUpdate`:

```yaml
spec:
  strategy:
    type: Recreate
  template:
```

### Примітки щодо strategic merge patch зі стратегією retainKeys {#notes-on-the-strategic-merge-patch-using-the-retainkeys-strategy}

Патч, який ви виконали в попередній вправі, називається *strategic merge patch зі стратегією retainKeys*. Цей метод вводить нову директиву `$retainKeys`, що має такі стратегії:

- Вона містить список рядків.
- Усі поля, які потрібно зберегти, повинні бути присутні в списку `$retainKeys`.
- Присутні поля буде обʼєднано з живим обʼєктом.
- Всі відсутні поля будуть очищені під час застосування патча.
- Усі поля у списку `$retainKeys` повинні бути надмножиною або такими ж, як і поля, що присутні в патчі.

Стратегія `retainKeys` працює не для всіх обʼєктів. Вона працює лише тоді, коли значення ключа `patchStrategy` у теґу поля у вихідному коді Kubernetes містить `retainKeys`. Наприклад, поле `Strategy` структури `DeploymentSpec` має `patchStrategy` зі значенням `retainKeys`:

```go
type DeploymentSpec struct {
  ...
  // +patchStrategy=retainKeys
  Strategy DeploymentStrategy `json:"strategy,omitempty" patchStrategy:"retainKeys" ...`
  ...
}
```

Ви також можете побачити стратегію `retainKeys` в [специфікації OpenApi](https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json):

```yaml
"io.k8s.api.apps.v1.DeploymentSpec": {
    ...,
    "strategy": {
        "$ref": "#/definitions/io.k8s.api.apps.v1.DeploymentStrategy",
        "description": "The deployment strategy to use to replace existing pods with new ones.",
        "x-kubernetes-patch-strategy": "retainKeys"
    },
    ....
}
```
<!-- для редакторів: спеціально використовуйте yaml замість json тут, щоб уникнути помилки підсвітки синтаксису. -->

Також стратегію `retainKeys` можна побачити в [документації Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).

### Альтернативні форми команди kubectl patch {#alternate-forms-of-the-kubectl-patch-command}

Команда `kubectl patch` приймає YAML або JSON. Вона може приймати патч як файл або безпосередньо в командному рядку.

Створіть файл з назвою `patch-file.json` з таким вмістом:

```json
{
   "spec": {
      "template": {
         "spec": {
            "containers": [
               {
                  "name": "patch-demo-ctr-2",
                  "image": "redis"
               }
            ]
         }
      }
   }
}
```

Наведені нижче команди еквівалентні:

```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
kubectl patch deployment patch-demo --patch 'spec:\n template:\n  spec:\n   containers:\n   - name: patch-demo-ctr-2\n     image: redis'

kubectl patch deployment patch-demo --patch-file patch-file.json
kubectl patch deployment patch-demo --patch '{"spec": {"template": {"spec": {"containers": [{"name": "patch-demo-ctr-2","image": "redis"}]}}}}'
```

### Оновлення кількості реплік обʼєкта за допомогою `kubectl patch` з `--subresource` {#scale-kubectl-patch}

Прапорець `--subresource=[subresource-name]` використовується з командами kubectl, як-от get, patch, edit, apply і replace, для отримання та оновлення субресурсів `status`, `scale` і `resize` вказаних вами ресурсів. Ви можете вказати субресурс для будь-якого ресурсу API Kubernetes (вбудованого або CR), що має субресурс `status`, `scale` або `resize`.

Наприклад, Deployment має субресурси `status` і `scale`, тож ви можете використовувати `kubectl`, щоб отримати або змінити лише субресурс `status` Deployment.

Ось маніфест для Deployment, що має дві репліки:

{{% code_sample file="application/deployment.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

Перегляньте Podʼи, повʼязані з вашим Deployment:

```shell
kubectl get pods -l app=nginx
```

У виводі видно, що Deployment має два Podʼи. Наприклад:

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          47s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          47s
```

Тепер застосуйте патч до Deployment з прапорцем `--subresource=[subresource-name]`:

```shell
kubectl patch deployment nginx-deployment --subresource='scale' --type='merge' -p '{"spec":{"replicas":3}}'
```

Вивід:

```shell
scale.autoscaling/nginx-deployment patched
```

Перегляньте Podʼи, повʼязані з вашим Deployment після патчу:

```shell
kubectl get pods -l app=nginx
```

У виводі видно, що створено один новий Pod, тож тепер у вас 3 запущені Podʼи.

```
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          107s
nginx-deployment-7fb96c846b-lxfr2   1/1     Running   0          14s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          107s
```

Перегляньте Deployment після патчу:

```shell
kubectl get deployment nginx-deployment -o yaml
```

```yaml
...
spec:
  replicas: 3
  ...
status:
  ...
  availableReplicas: 3
  readyReplicas: 3
  replicas: 3
```

{{< note >}}
Якщо ви запускаєте `kubectl patch` і вказуєте прапорець `--subresource` для ресурсу, який не підтримує цей конкретний субресурс, API-сервер повертає помилку 404 Not Found.
{{< /note >}}

## Підсумки {#summary}

У цій вправі ви використали `kubectl patch`, щоб змінити живу конфігурацію обʼєкта Deployment. Ви не змінювали файл конфігурації, за допомогою якого спочатку створили обʼєкт Deployment. Інші команди для оновлення обʼєктів API: [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate), [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit), [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands/#replace), [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale) і [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands/#apply).

{{< note >}}
Strategic merge patch не підтримується для власних ресурсів.
{{< /note >}}

## {{% heading "whatsnext" %}} {#what-s-next}

* [Управління обʼєктами Kubernetes](/docs/concepts/overview/working-with-objects/object-management/)
* [Керування обʼєктами Kubernetes за допомогою імперативних команд](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Імперативне керування обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Декларативне керування обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/declarative-config/)
