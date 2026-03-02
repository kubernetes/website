---
title: Використання змінних середовища для передачі контейнерам інформації про Pod
content_type: task
weight: 30
---

<!-- overview -->

Ця сторінка показує, як Pod може використовувати змінні середовища для передачі інформації про себе контейнерам, які працюють в Pod, використовуючи _downward API_. Ви можете використовувати змінні середовища для експозиції полів Pod, полів контейнера або обох.

У Kubernetes є два способи експозиції полів Pod та контейнера для запущеного контейнера:

* _Змінні середовища_, як пояснено в цьому завданні
* [Файли томів](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Разом ці два способи експозиції полів Pod та контейнера називаються downward API.

Оскільки Service є основним засобом взаємодії між контейнеризованими застосунками, якими керує Kubernetes, корисно мати можливість виявляти їх під час виконання.

Дізнайтеся більше про доступ до Сервісів [тут](/docs/tutorials/services/connect-applications-service/#accessing-the-service).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Використання полів Pod як значень для змінних середовища {#use-pod-fields-as-values-for-environment-variables}

У цій частині завдання ви створюєте Pod з одним контейнером, і ви спроєцюєте поля рівня Pod у працюючий контейнер у вигляді змінних середовища.

{{% code_sample file="pods/inject/dapi-envars-pod.yaml" %}}

У цьому маніфесті ви бачите пʼять змінних середовища. Поле `env` є масивом визначень змінних середовища. Перший елемент у масиві вказує, що змінна середовища `MY_NODE_NAME` отримує своє значення з поля `spec.nodeName` Pod. Аналогічно, інші змінні середовища отримують свої назви з полів Pod.

{{< note >}}
Поля в цьому прикладі є полями Pod. Вони не є полями контейнера в Pod.
{{< /note >}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

Перевірте, що контейнер в Pod працює:

```shell
# Якщо новий Pod ще не став доступним, кілька разів перезапустіть цю команду.
kubectl get pods
```

Перегляньте лог контейнера:

```shell
kubectl logs dapi-envars-fieldref
```

Вивід показує значення вибраних змінних середовища:

```none
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

Щоб побачити, чому ці значення є в лозі, подивіться на поля `command` та `args` у файлі конфігурації. При запуску контейнера він записує значення пʼяти змінних середовища у stdout. Він повторює це кожні десять секунд.

Далі, отримайте оболонку в контейнер, який працює в вашому Pod:

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

У вашій оболонці перегляньте змінні середовища:

```shell
# Виконайте це в оболонці всередині контейнера
printenv
```

Вивід показує, що деякі змінні середовища мають призначені значення
полів Pod:

```none
MY_POD_SERVICE_ACCOUNT=default
...
MY_POD_NAMESPACE=default
MY_POD_IP=172.17.0.4
...
MY_NODE_NAME=minikube
...
MY_POD_NAME=dapi-envars-fieldref
```

## Використання полів контейнера як значень для змінних середовища {#use-container-fields-as-values-for-environment-variables}

У попередньому завданні ви використовували інформацію з полів рівня Pod як значення для змінних середовища. У наступному завданні ви плануєте передати поля, які є частиною визначення Pod, але взяті з конкретного [контейнера](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) замість всього Pod загалом.

Ось маніфест для іншого Pod, який знову має лише один контейнер:

{{% code_sample file="pods/inject/dapi-envars-container.yaml" %}}

У цьому маніфесті ви бачите чотири змінні середовища. Поле `env` є масивом визначень змінних середовища. Перший елемент у масиві вказує, що змінна середовища `MY_CPU_REQUEST` отримує своє значення з поля `requests.cpu` контейнера з іменем `test-container`. Аналогічно, інші змінні середовища отримують свої значення з полів, що є специфічними для цього контейнера.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

Перевірте, що контейнер в Pod працює:

```shell
# Якщо новий Pod ще не став доступним, кілька разів перезапустіть цю команду.
kubectl get pods
```

Перегляньте лог контейнера:

```shell
kubectl logs dapi-envars-resourcefieldref
```

Вивід показує значення вибраних змінних середовища:

```none
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}}

* Прочитайте [Визначення змінних середовища для контейнера](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Прочитайте API-визначення [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) для Pod. Специфікація включає визначення Контейнера (частина Pod).
* Ознайомтесь зі списком [доступних полів](/docs/concepts/workloads/pods/downward-api/#available-fields), які можна викрити за допомогою downward API.

Дізнайтеся про Pod, контейнери та змінні середовища в легасі довідці API:

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
