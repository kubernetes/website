---
title: Визначення залежних змінних середовища
content_type: task
weight: 20
---

<!-- overview -->

На цій сторінці показано, як визначати залежні змінні середовища для контейнера в Podʼі Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Визначення залежної змінної середовища для контейнера {#define-an-environment-dependent-variable-for-a-container}

Під час створення Podʼа ви можете встановлювати залежні змінні середовища для контейнерів, які працюють у Podʼі. Для цього можна використовувати $(VAR_NAME) у `value` поля `env` у файлі конфігурації.

У цій вправі ви створите Pod, який запускає один контейнер. Файл конфігурації Podʼа визначає залежну змінну середовища з поширеним способом використання. Ось маніфест конфігурації Podʼа:

{{% code_sample file="pods/inject/dependent-envars.yaml" %}}

1. Створіть Pod на основі цього маніфесту:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
   ```

   ```
   pod/dependent-envars-demo created
   ```

2. Перегляньте список запущених Podʼів:

   ```shell
   kubectl get pods dependent-envars-demo
   ```

   ```
   NAME                      READY     STATUS    RESTARTS   AGE
   dependent-envars-demo     1/1       Running   0          9s
   ```

3. Перевірте логи контейнера, що працює у вашому Podʼі:

   ```shell
   kubectl logs pod/dependent-envars-demo
   ```

   ```
   UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   SERVICE_ADDRESS=https://172.17.0.1:80
   ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   ```

Як показано вище, ви визначили правильне посилання на залежність `SERVICE_ADDRESS`, неправильне посилання на залежність `UNCHANGED_REFERENCE` і пропустили залежні посилання в `ESCAPED_REFERENCE`.

Якщо змінну середовища вже визначено на момент посилання, посилання можна правильно розвʼязати, як у випадку `SERVICE_ADDRESS`.

Зверніть увагу, що порядок у списку `env` має значення. Змінна середовища не вважається «визначеною», якщо вона вказана нижче в списку. Саме тому `UNCHANGED_REFERENCE` не вдається розвʼязати `$(PROTOCOL)` у наведеному вище прикладі.

Коли змінна середовища не визначена або включає лише деякі змінні, невизначена змінна середовища розглядається як звичайний рядок, як у випадку `UNCHANGED_REFERENCE`. Зверніть увагу, що неправильно розібрані змінні середовища зазвичай не блокують запуск контейнера.

Синтаксис `$(VAR_NAME)` можна екранувати подвійним `$`, тобто `$$(VAR_NAME)`. Екрановані посилання ніколи не розгортаються, незалежно від того, чи визначена змінна, на яку вони посилаються. Це видно з наведеного вище випадку `ESCAPED_REFERENCE`.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Перегляньте [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
