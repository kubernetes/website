---
title: Визначення причини збою Podʼа
content_type: task
weight: 30
---

<!-- overview -->

На цій сторінці показано, як записувати й читати повідомлення про завершення контейнера.

Повідомлення про завершення дають контейнерам змогу записувати інформацію про фатальні події в місце, звідки її легко отримати й показати за допомогою таких інструментів, як інформаційні панелі та програмне забезпечення моніторингу. Здебільшого інформацію, яку ви вносите в повідомлення про завершення, також слід записувати в загальні [логи Kubernetes](/docs/concepts/cluster-administration/logging/).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Запис та читання повідомлення про завершення {#writing-and-reading-a-termination-message}

У цій вправі ви створюєте Pod, який запускає один контейнер. Маніфест цього Podʼа вказує команду, що виконується під час запуску контейнера:

{{% code_sample file="debug/termination.yaml" %}}

1. Створіть Pod на основі файлу конфігурації YAML:

    ```shell
    kubectl apply -f https://k8s.io/examples/debug/termination.yaml
    ```

    У файлі YAML у полях `command` та `args` ви можете побачити, що контейнер перебуває в стані очікування (спить) протягом 10 секунд, а потім записує "Sleep expired" у файл `/dev/termination-log`. Після того, як контейнер записує повідомлення "Sleep expired", він завершує роботу.

1. Покажіть інформацію про Pod:

    ```shell
    kubectl get pod termination-demo
    ```

    Повторюйте попередню команду, доки Pod не перестане працювати.

1. Покажіть детальну інформацію про Pod:

    ```shell
    kubectl get pod termination-demo --output=yaml
    ```

    Вивід містить повідомлення "Sleep expired":

    ```yaml
    apiVersion: v1
    kind: Pod
    ...
        lastState:
          terminated:
            containerID: ...
            exitCode: 0
            finishedAt: ...
            message: |
              Sleep expired
            ...
    ```

1. Використайте шаблон Go, щоб відфільтрувати вивід і залишити в ньому лише повідомлення про завершення:

    ```shell
    kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"
    ```

Якщо у вас працює багатоконтейнерний Pod, ви можете використати шаблон Go, щоб додати назву контейнера. Так ви зможете визначити, який із контейнерів завершується збоєм:

```shell
kubectl get pod multi-container-pod -o go-template='{{range .status.containerStatuses}}{{printf "%s:\n%s\n\n" .name .lastState.terminated.message}}{{end}}'
```

## Налаштування повідомлення про завершення {#customizing-the-termination-message}

Kubernetes отримує повідомлення про завершення з файлу повідомлення про завершення, вказаного в полі `terminationMessagePath` контейнера, стандартне значення якого — `/dev/termination-log`. Змінивши це поле, ви можете вказати Kubernetes використовувати інший файл. Kubernetes використовує вміст указаного файлу, щоб заповнити повідомлення про статус контейнера як у разі успіху, так і в разі невдачі.

Повідомлення про завершення має бути коротким фінальним статусом, наприклад повідомленням про невдале твердження (assertion). kubelet обрізає повідомлення, довші за 4096 байтів.

Загальна довжина повідомлень усіх контейнерів обмежена 12KiB і порівну розподіляється між контейнерами. Наприклад, якщо є 12 контейнерів (`initContainers` або `containers`), кожен має 1024 байти доступного місця для повідомлення про завершення.

Стандартний шлях повідомлення про завершення — `/dev/termination-log`. Шлях повідомлення про завершення не можна встановити після запуску Podʼа.

У наведеному нижче прикладі контейнер записує повідомлення про завершення в `/tmp/my-log`, звідки їх отримує Kubernetes:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: msg-path-demo
spec:
  containers:
  - name: msg-path-demo-container
    image: debian
    terminationMessagePath: "/tmp/my-log"
```

Крім того, користувачі можуть налаштувати поле `terminationMessagePolicy` контейнера для додаткового налаштування. Стандартно це поле має значення "`File`", тобто повідомлення про завершення отримуються лише з файлу повідомлення про завершення. Встановивши `terminationMessagePolicy` у "`FallbackToLogsOnError`", ви можете вказати Kubernetes використовувати останній фрагмент виводу логу контейнера, якщо файл повідомлення про завершення порожній, а контейнер завершився з помилкою. Вивід логу обмежено 2048 байтами або 80 рядками, залежно від того, що менше.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дивіться поле `terminationMessagePath` у [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).
* Дивіться [ImagePullBackOff](/docs/concepts/containers/images/#imagepullbackoff) у розділі [Образи](/docs/concepts/containers/images/).
* Дізнайтеся про [отримання логів](/docs/concepts/cluster-administration/logging/).
* Дізнайтеся про [шаблони Go](https://pkg.go.dev/text/template).
* Дізнайтеся про [статус Podʼа](/docs/tasks/debug/debug-application/debug-init-containers/#understanding-pod-status) і [фазу Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase).
* Дізнайтеся про [стани контейнера](/docs/concepts/workloads/pods/pod-lifecycle/#container-states).
