---
title: Оновлення обʼєктів API на місці за допомогою kubectl patch
description: Використовуйте kubectl patch для оновлення обʼєктів Kubernetes API на місці. Виконайте стратегічний патч злиття або патч злиття JSON.
content_type: task
weight: 50
---

<!-- огляд -->

Це завдання показує, як використовувати `kubectl patch` для оновлення обʼєкта API на місці. Вправи в цьому завданні демонструють стратегічний патч злиття та патч злиття JSON.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Використання стратегічного патчу злиття для оновлення Deployment {#using-strategic-merge-patch-to-update-a-deployment}

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

```none
NAME                        READY     STATUS    RESTARTS   AGE
patch-demo-28633765-670qr   1/1       Running   0          23s
patch-demo-28633765-j5qs3   1/1       Running   0          23s
```

Зробіть позначку про імена працюючих Podʼів. Пізніше ви побачите, що ці Podʼи будуть завершені та замінені новими.

На цей момент кожен Pod має один контейнер, який запускає образ nginx. Тепер, здавалося б, вам потрібно, щоб кожен Pod мав два контейнери: один, який запускає nginx, і один, який запускає redis.

Створіть файл з іменем `patch-file.yaml`, який має такий вміст:

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

Вивід показує, що PodSpec у Deployment має ддва контейнери

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

Вивід показує, що працюючі Podʼи мають різні імена Podʼів, у порівнняні з тими що працювали раніше. Deployment припинив роботу старих Podʼів та створив два нові Podʼи, які відповідають оновленій специфікації Deployment. `2/2` вказує на те, що кожен Pod має два контейнера:

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

```yaml
containers:
- image: redis
  ...
- image: nginx
  ...
```

### Примітки щодо стратегічного патчу злиття {#notes-on-strategic-merge-patch}

Патч, який ви виконали у попередній вправі, називається *стратегічним патчем злиття*. Зверніть увагу, що патч не замінив список `containers`. Замість цього він додав новий контейнер до списку. Іншими словами, список у патчі був обʼєднаний з поточним списком. Це не завжди трапляється, коли ви використовуєте стратегічний патч злиття для списку. У деяких випадках список замінюється, а не обʼєднується.

За допомогою стратегічних патчів злиття список або замінюється, або обʼєднується залежно від його стратегії патча. Стратегія патча вказується значенням ключа `patchStrategy` у мітці поля в вихідному коді Kubernetes. Наприклад, поле `Containers` структури `PodSpec` має `patchStrategy` рівне `merge`:

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

Створіть файл з іменем `patch-file-tolerations.yaml` із таким вмістом:

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

Відвід показує, що у PodSpec у Deployment є лише один Toleration:

```yaml
tolerations:
- effect: NoSchedule
  key: disktype
  value: ssd
```

Зверніть увагу, що список `tolerations` в PodSpec був замінений, а не обʼєднаний. Це тому, що поле Tolerations структури PodSpec не має ключа `patchStrategy` у своїй мітці поля. Тому стратегія патча, що використовується стандартно, дорівнює `replace`.

```go
type PodSpec struct {
  ...
  Tolerations []Toleration `json:"tolerations,omitempty" protobuf:"bytes,22,opt,name=tolerations"`
  ...
}
```

## Використання патчу злиття JSON для оновлення Deployment {#using-json-merge-patch-to-update-a-deployment}

Стратегічне патч злиття відрізняється від [JSON merge patch](https://tools.ietf.org/html/rfc7386). З JSON merge patch, якщо вам потрібно оновити список, вам потрібно вказати цілий новий список. І новий список повністю замінює поточний список.

Команда `kubectl patch` має параметр `type`, який ви можете встановити на одне з цих значень:

<table>
  <tr><th>Значення параметра</th><th>Тип злиття</th></tr>
  <tr><td>json</td><td><a href="https://tools.ietf.org/html/rfc6902">JSON Patch, RFC 6902</a></td></tr>
  <tr><td>merge</td><td><a href="https://tools.ietf.org/html/rfc7386">JSON Merge Patch, RFC 7386</a></td></tr>
  <tr><td>strategic</td><td>Стратегічний патч злиття</td></tr>
</table>

Для порівняння JSON patch та JSON merge patch, див. [JSON Patch та JSON Merge Patch](https://erosb.github.io/post/json-patch-vs-merge-patch/).

Стандартне значення для параметра `type` є `strategic`. Таким чином, у попередній вправі ви виконали стратегічний патч злиття.

Далі виконайте JSON merge patch на вашому Deployment. Створіть файл з іменем `patch-file-2.yaml` із таким вмістом:

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

Перегляньте Podʼи:

```shell
kubectl get pods
```

У виводі ви можете побачити, що наявні Podʼи були завершені, а нові Podʼи — створені. `1/1` вказує на те, що кожен новий Pod працює лише з одним контейнером.

```shell
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1307768864-69308   1/1       Running   0          1m
patch-demo-1307768864-c86dc   1/1       Running   0          1m
```

## Використання стратегічного патча злиття для оновлення Deployment з використанням стратегії retainKeys {#use-strategic-merge-patch-to-update-a-deployment-with-the-retainkeys-strategy}

Ось файл конфігурації для Deployment, що використовує стратегію `RollingUpdate`:

{{% code_sample file="application/deployment-retainkeys.yaml" %}}

Створіть Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment-retainkeys.yaml
```

На цей момент Deployment створено і використовує стратегію `RollingUpdate`.

Створіть файл з іменем `patch-file-no-retainkeys.yaml` з таким вмістом:

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

```none
The Deployment "retainkeys-demo" is invalid: spec.strategy.rollingUpdate: Forbidden: may not be specified when strategy `type` is 'Recreate'
```

Способом видалити значення для `spec.strategy.rollingUpdate` під час оновлення значення для `type` є використання стратегії retainKeys для стратегічного злиття.

Створіть ще один файл з іменем `patch-file-retainkeys.yaml` з таким вмістом:

```yaml
spec:
  strategy:
    $retainKeys:
    - type
    type: Recreate
```

З цим патчем ми вказуємо, що ми хочемо зберегти лише ключ `type` обʼєкта `strategy`. Таким чином, під час операції патча значення `rollingUpdate` буде видалено.

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

### Примітки щодо стратегічного патчу злиття з використанням стратегії retainKeys {#notes-on-strategic-merge-patch-using-the-retainkeys-strategy}

Патч, який ви виконали в попередній вправі, називається *стратегічним патчем злиття з використанням стратегії retainKeys*. Цей метод вводить нову директиву `$retainKeys`, яка має наступні стратегії:

- Вона містить список рядків.
- Усі поля, які потрібно зберегти, повинні бути присутні в списку `$retainKeys`.
- Поля, які присутні, будуть обʼєднані з поточним обʼєктом.
- Всі відсутні поля будуть очищені під час застосування патча.
- Усі поля у списку `$retainKeys` повинні бути надмножиною або такими ж, як і поля, що присутні в патчі.

Стратегія `retainKeys` не працює для всіх обʼєктів. Вона працює лише тоді, коли значення ключа `patchStrategy` у мітці поля в вихідному коді Kubernetes містить `retainKeys`. Наприклад, поле `Strategy` структури `DeploymentSpec` має `patchStrategy` рівне `retainKeys`:

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

І ви можете дізнатись більше про стратегію `retainKeys` в [документації Kubernetes API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).

### Альтернативні форми команди kubectl patch {#alternative-forms-of-the-kubectl-patch-command}

Команда `kubectl patch` приймає YAML або JSON. Вона може приймати патч як файл або безпосередньо в командному рядку.

Створіть файл з іменем `patch-file.json` з таким вмістом:

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

Наступні команди є еквівалентними:

```shell
kubectl patch deployment patch-demo --patch-file patch-file.yaml
kubectl patch deployment patch-demo --patch 'spec:\n template:\n  spec:\n   containers:\n   - name: patch-demo-ctr-2\n     image: redis'

kubectl patch deployment patch-demo --patch-file patch-file.json
kubectl patch deployment patch-demo --patch '{"spec": {"template": {"spec": {"containers": [{"name": "patch-demo-ctr-2","image": "redis"}]}}}}'
```

### Оновлення кількості реплік обʼєкта за допомогою `kubectl patch` з `--subresource` {#scale-kubectl-patch}

Прапорець `--subresource=[імʼя-субресурсу]` використовується з командами kubectl, такими як `get`, `patch`, `edit`, `apply` і `replace`, для отримання та оновлення субресурсів `status`, `scale` та `resize` cубресурсів вказаних вами ресурсів. Ви можете вказати субресурс для будь-якого ресурсу API Kubernetes (вбудованих та CR), які мають субресурси `status`, `scale` або `resize`.

Наприклад, Deployment має субресурси `status` та `scale`, тож ви можете використовувати `kubectl` для отримання та зміни субресрусу `status` Deploymentʼа.

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

У виводі ви можете побачити, що у Deployment є дві Podʼи. Наприклад:

```none
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-7fb96c846b-22567   1/1     Running   0          47s
nginx-deployment-7fb96c846b-mlgns   1/1     Running   0          47s
```

Тепер застосуйте патч до Deployment з прапорцем `--subresource=[імʼя-субресурсу]`:

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

У виводі ви можете побачити, що було створено один новий Pod, тепер у вас є 3 запущені Podʼи.

```none
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
Якщо ви запускаєте `kubectl patch` і вказуєте прапорець `--subresource` для ресурсу, який не підтримує цей конкретний субресурс, сервер API повертає помилку 404 Not Found.
{{< /note >}}

## Підсумки {#summary}

У цій вправі ви використали `kubectl patch`, щоб змінити поточну конфігурацію обʼєкта Deployment. Ви не змінювали файл конфігурації, який ви спочатку використовували для створення обʼєкта Deployment. Інші команди для оновлення обʼєктів API включають [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate), [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit), [kubectl replace](/docs/reference/generated/kubectl/kubectl-commands/#replace), [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale), та [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands/#apply).

{{< note >}}
Стратегічний патч злиття не підтримується для власних ресурсів.
{{< /note >}}

## {{% heading "whatsnext" %}}

- [Управління обʼєктами Kubernetes](/docs/concepts/overview/working-with-objects/object-management/)
- [Управління обʼєктами Kubernetes за допомогою імперативних команд](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Імперативне управління обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Декларативне управління обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/declarative-config/)
