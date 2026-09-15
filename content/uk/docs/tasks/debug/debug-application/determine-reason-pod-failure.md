---
title: Визначення причини збою Podʼа
content_type: task
weight: 31
---

<!-- overview -->

Ця сторінка показує, як записувати та читати повідомлення про припинення роботи контейнера.

Повідомлення про припинення роботи надають можливість контейнерам записувати інформацію про фатальні події у місце, звідки її можна легко витягти та показувати за допомогою інструментів, таких як інформаційні панелі та програмне забезпечення моніторингу. У більшості випадків інформацію, яку ви вводите у повідомлення про припинення роботи, також слід записати в [логи Kubernetes](/docs/concepts/cluster-administration/logging/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Запис та читання повідомлення про припинення роботи {#writing-and-reading-a-termination-message}

У цьому завданні ви створюєте Pod, який запускає один контейнер. У маніфесті для цього Podʼа вказано команду, яка виконується при запуску контейнера:

{{% code_sample file="debug/termination.yaml" %}}

1. Створіть Pod на основі конфігураційного файлу YAML:

    ```shell
    kubectl apply -f https://k8s.io/examples/debug/termination.yaml
    ```

    У файлі YAML у полях `command` та `args` ви можете побачити, що контейнер перебуває в стані очікування (спить) протягом 10 секунд, а потім записує "Sleep expired" у файл `/dev/termination-log`. Після того, як контейнер записує повідомлення "Sleep expired", він завершує роботу.

2. Покажіть інформацію про Pod:

    ```shell
    kubectl get pod termination-demo
    ```

    Повторіть попередню команду, доки Pod більше не буде запущений.

3. Покажіть детальну інформацію про Pod:

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

4. Використовуйте шаблон Go для фільтрування виводу так, щоб він містив лише повідомлення про припинення роботи контейнера:

    ```shell
    kubectl get pod termination-demo -o go-template="{{range .status.containerStatuses}}{{.lastState.terminated.message}}{{end}}"
    ```

Якщо у вас працює багатоконтейнерний Pod, ви можете використовувати шаблон Go, щоб включити імʼя контейнера. Таким чином, ви можете визначити, який з контейнерів несправний:

```shell
kubectl get pod multi-container-pod -o go-template='{{range .status.containerStatuses}}{{printf "%s:\n%s\n\n" .name .lastState.terminated.message}}{{end}}'
```

## Налаштування повідомлення про припинення роботи {#customizing-the-termination-message}

Kubernetes отримує повідомлення про припинення роботи з файлу повідомлення, вказаного в полі `terminationMessagePath` контейнера, яке має стандартне значення `/dev/termination-log`. Налаштувавши це поле, ви можете сказати Kubernetes використовувати інший файл. Kubernetes використовує вміст зазначеного файлу для заповнення повідомлення про стан контейнера як у випадку успіху, так і невдачі.

Повідомлення про припинення має бути коротким остаточним статусом, таким як повідомлення про помилку твердження. Kubelet обрізає повідомлення, які довше 4096 байтів.

Загальна довжина повідомлення по всіх контейнерах обмежена 12KiB і рівномірно розподілена між всіма контейнерами. Наприклад, якщо є 12 контейнерів (`initContainers` або `containers`), кожен має 1024 байти доступного простору для повідомлень про припинення роботи.

Стандартний шлях для повідомлення про припинення роботи — `/dev/termination-log`. Ви не можете встановити шлях повідомлення про припинення роботи після запуску Podʼа.

У наступному прикладі контейнер записує повідомлення про завершення в `/tmp/my-log` для отримання Kubernetes:

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

Крім того, користувачі можуть налаштувати поле `terminationMessagePolicy` контейнера для подальшої настройки. Типово це поле встановлене на "`File`", що означає, що повідомлення про припинення роботи отримуються лише з файлу повідомлення про припинення роботи. Встановивши `terminationMessagePolicy` на "`FallbackToLogsOnError`", ви можете вказати Kubernetes використовувати останній фрагмент виводу контейнера, якщо файл повідомлення про припинення роботи порожній, і контейнер завершився з помилкою. Вивід логу обмежується 2048 байтами або 80 рядками, якщо вибірка менша.

## {{% heading "whatsnext" %}}

* Перегляньте поле `terminationMessagePath` в [Контейнері](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core).
* Перегляньте [ImagePullBackOff](/docs/concepts/containers/images/#imagepullbackoff) в [Образах](/docs/concepts/containers/images/).
* Дізнайтеся про [отримання логів](/docs/concepts/cluster-administration/logging/).
* Дізнайтеся про [шаблони Go](https://pkg.go.dev/text/template).
* Дізнайтеся про [стани Pod](/docs/tasks/debug/debug-application/debug-init-containers/#understanding-pod-status) та [фази Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase).
* Дізнайтеся про [стани контейнера](/docs/concepts/workloads/pods/pod-lifecycle/#container-states).
