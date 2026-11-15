---
title: Використання змінних середовища для передачі контейнерам інформації про Pod
content_type: task
weight: 30
---

<!-- overview -->

На цій сторінці показано, як Pod може використовувати змінні середовища, щоб передавати інформацію про себе контейнерам, які працюють у Podʼі, за допомогою _downward API_. Ви можете використовувати змінні середовища для надання полів Podʼа, полів контейнера або тих і тих.

У Kubernetes є два способи надати поля Podʼа та контейнера запущеному контейнеру:

* _Змінні середовища_, як пояснено в цьому завданні
* [Файли томів](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Разом ці два способи надання полів Podʼа та контейнера називаються downward API.

Оскільки Services є основним способом взаємодії між контейнеризованими застосунками, якими керує Kubernetes, корисно мати змогу виявляти їх під час виконання.

Докладніше про доступ до Services читайте [тут](/docs/tutorials/services/connect-applications-service/#accessing-the-service).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Використання полів Podʼа як значень змінних середовища {#use-pod-fields-as-values-for-environment-variables}

У цій частині вправи ви створите Pod з одним контейнером і спроєцюєте поля рівня Podʼа в запущений контейнер як змінні середовища.

{{% code_sample file="pods/inject/dapi-envars-pod.yaml" %}}

У цьому маніфесті ви бачите пʼять змінних середовища. Поле `env` — це масив визначень змінних середовища. Перший елемент масиву вказує, що змінна середовища `MY_NODE_NAME` отримує значення з поля `spec.nodeName` Podʼа. Аналогічно інші змінні середовища отримують свої назви з полів Podʼа.

{{< note >}}
Поля в цьому прикладі є полями Podʼа. Вони не є полями контейнера в Podʼі.
{{< /note >}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

Перевірте, що контейнер у Podʼі працює:

```shell
# Якщо новий Pod ще не справний, повторіть цю команду кілька разів.
kubectl get pods
```

Перегляньте логи контейнера:

```shell
kubectl logs dapi-envars-fieldref
```

Вивід показує значення вибраних змінних середовища:

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

Щоб зрозуміти, чому ці значення є в логу, подивіться на поля `command` і `args` у файлі конфігурації. Коли контейнер запускається, він записує значення пʼяти змінних середовища в stdout. Він повторює це кожні десять секунд.

Далі отримайте доступ до оболонки в контейнері, який працює у вашому Podʼі:

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

В оболонці перегляньте змінні середовища:

```shell
# Виконайте це в оболонці всередині контейнера
printenv
```

Вивід показує, що деяким змінним середовища призначено значення полів Podʼа:

```
MY_POD_SERVICE_ACCOUNT=default
...
MY_POD_NAMESPACE=default
MY_POD_IP=172.17.0.4
...
MY_NODE_NAME=minikube
...
MY_POD_NAME=dapi-envars-fieldref
```

## Використання полів контейнера як значень змінних середовища {#use-container-fields-as-values-for-environment-variables}

У попередній вправі ви використовували інформацію з полів рівня Podʼа як значення змінних середовища. У наступній вправі ви передасте поля, які є частиною визначення Podʼа, але взяті з конкретного [контейнера](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container), а не з Podʼа загалом.

Ось маніфест іншого Podʼа, який знову має лише один контейнер:

{{% code_sample file="pods/inject/dapi-envars-container.yaml" %}}

У цьому маніфесті ви бачите чотири змінні середовища. Поле `env` — це масив визначень змінних середовища. Перший елемент масиву вказує, що змінна середовища `MY_CPU_REQUEST` отримує значення з поля `requests.cpu` контейнера з назвою `test-container`. Аналогічно інші змінні середовища отримують значення з полів, специфічних для цього контейнера.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

Перевірте, що контейнер у Podʼі працює:

```shell
# Якщо новий Pod ще не справний, повторіть цю команду кілька разів.
kubectl get pods
```

Перегляньте логи контейнера:

```shell
kubectl logs dapi-envars-resourcefieldref
```

Вивід показує значення вибраних змінних середовища:

```
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Прочитайте [Визначення змінних середовища для контейнера](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Прочитайте визначення API [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) для Pod. Воно містить визначення Container (частина Pod).
* Перегляньте список [доступних полів](/docs/concepts/workloads/pods/downward-api/#available-fields), які можна надати за допомогою downward API.

Прочитайте про Pods, контейнери та змінні середовища в застарілій довідці API:

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
