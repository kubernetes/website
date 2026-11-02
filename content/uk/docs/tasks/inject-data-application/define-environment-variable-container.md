---
title: Визначення змінних середовища для контейнера
content_type: task
weight: 20
---

<!-- overview -->

На цій сторінці показано, як визначити змінні середовища для контейнера в Podʼі Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Визначення змінної середовища для контейнера {#define-an-environment-variable-for-a-container}

Під час створення Podʼа ви можете задати змінні середовища для контейнерів, які працюють у Podʼі. Щоб задати змінні середовища, додайте поле `env` або `envFrom` у файл конфігурації.

Поля `env` та `envFrom` діють по-різному.

`env`
: дозволяє задати змінні середовища для контейнера, вказавши значення безпосередньо для кожної названої змінної.

`envFrom`
: дозволяє задати змінні середовища для контейнера через посилання на ConfigMap або Secret. Коли ви використовуєте `envFrom`, усі пари ключ-значення у вказаному ConfigMap або Secret задаються як змінні середовища контейнера. Ви також можете вказати спільний префікс.

Докладніше про [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)
та [Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables).

На цій сторінці пояснено, як використовувати `env`.

У цій вправі ви створите Pod, який запускає один контейнер. Файл конфігурації Podʼа визначає змінну середовища з назвою `DEMO_GREETING` і значенням `"Hello from the environment"`. Ось маніфест конфігурації Podʼа:

{{% code_sample file="pods/inject/envars.yaml" %}}

1. Створіть Pod на основі цього маніфесту:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
   ```

1. Перегляньте перелік запущених Podʼів:

   ```shell
   kubectl get pods -l purpose=demonstrate-envars
   ```

   Вивід подібний до такого:

   ```
   NAME            READY     STATUS    RESTARTS   AGE
   envar-demo      1/1       Running   0          9s
   ```

1. Виведіть змінні середовища контейнера Podʼа:

   ```shell
   kubectl exec envar-demo -- printenv
   ```

   Вивід подібний до такого:

   ```
   NODE_VERSION=4.4.2
   EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
   HOSTNAME=envar-demo
   ...
   DEMO_GREETING=Hello from the environment
   DEMO_FAREWELL=Such a sweet sorrow
   ```

{{< note >}}
Змінні середовища, встановлені за допомогою полів `env` або `envFrom`, перевизначають будь-які змінні середовища, вказані в образі контейнера.
{{< /note >}}

{{< note >}}
Змінні середовища можуть посилатися одна на одну, але порядок важливий. Змінні, що використовують інші змінні, визначені в тому самому контексті, мають іти нижче в списку. Так само уникайте циклічних посилань.
{{< /note >}}

## Використання змінних середовища у вашій конфігурації {#using-environment-variables-inside-of-your-config}

Змінні середовища, які ви визначаєте в конфігурації Podʼа в `.spec.containers[*].env[*]`, можна використовувати в інших частинах конфігурації, наприклад у командах і аргументах, які ви задаєте для контейнерів Podʼа. У наведеному нижче прикладі конфігурації змінні середовища `GREETING`, `HONORIFIC` і `NAME` мають значення `Warm greetings to`, `The Most Honorable` і `Kubernetes` відповідно. Змінна середовища `MESSAGE` обʼєднує всі ці змінні середовища, а потім використовується як аргумент командного рядка, переданий контейнеру `env-print-demo`.

Назви змінних середовища можуть складатися з будь-яких [друкованих символів ASCII](https://www.ascii-code.com/characters/printable-characters), окрім '='.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    - name: MESSAGE
      value: "$(GREETING) $(HONORIFIC) $(NAME)"
    command: ["echo"]
    args: ["$(MESSAGE)"]
```

Після створення в контейнері виконується команда `echo Warm greetings to The Most Honorable Kubernetes`.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Дізнайтеся про [використання Secrets як змінних середовища](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables).
* Дивіться [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
