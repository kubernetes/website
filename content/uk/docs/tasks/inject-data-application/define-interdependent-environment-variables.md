---
title: Визначення залежних змінних середовища
content_type: task
weight: 20
---

<!-- overview -->

Ця сторінка показує, як визначати залежні змінні середовища для контейнера у Podʼі Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Визначення змінної залежної від середовища для контейнера {#define-an-environment-dependent-variable-for-a-container}

При створенні Podʼа ви можете встановлювати залежні змінні середовища для контейнерів, які працюють в Podʼі. Для встановлення залежних змінних середовища ви можете використовувати $(VAR_NAME) у `value` `env` у файлі конфігурації.

У цьому завданні ви створюєте Pod, який запускає один контейнер. Файл конфігурації для Podʼа визначає залежну змінну середовища з визначеним загальним використанням. Ось маніфест конфігурації для Podʼа:

{{% code_sample file="pods/inject/dependent-envars.yaml" %}}

1. Створіть Podʼ на основі цього маніфесту:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/dependent-envars.yaml
   ```

   ```none
   pod/dependent-envars-demo created
   ```

2. Перегляньте список запущених Podʼів:

   ```shell
   kubectl get pods dependent-envars-demo
   ```

   ```none
   NAME                      READY     STATUS    RESTARTS   AGE
   dependent-envars-demo     1/1       Running   0          9s
   ```

3. Перевірте лог контейнера, що працює у вашому Podʼі:

   ```shell
   kubectl logs pod/dependent-envars-demo
   ```

   ```none
   UNCHANGED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   SERVICE_ADDRESS=https://172.17.0.1:80
   ESCAPED_REFERENCE=$(PROTOCOL)://172.17.0.1:80
   ```

Як показано вище, ви визначили правильне посилання на залежність `SERVICE_ADDRESS`, неправильне посилання на залежність `UNCHANGED_REFERENCE` і пропустили залежні посилання на залежність `ESCAPED_REFERENCE`.

Коли змінна середовища вже визначена при посиланні, посилання може бути правильно розгорнуте, як у випадку з `SERVICE_ADDRESS`.

Зверніть увагу, що порядок має значення у списку `env`. Змінна середовища не вважається "визначеною", якщо вона вказана далі в списку. Тому `UNCHANGED_REFERENCE` не вдається розгорнути `$(PROTOCOL)` у прикладі вище.

Коли змінна середовища невизначена або містить лише деякі змінні, невизначена змінна середовища трактується як звичайний рядок, як у випадку з `UNCHANGED_REFERENCE`. Зверніть увагу, що неправильно опрацьовані змінні середовища, як правило, не блокують запуск контейнера.

Синтаксис `$(VAR_NAME)` може бути екранований подвійним `$`, тобто: `$$(VAR_NAME)`. Екрановані посилання ніколи не розгортаються, незалежно від того, чи визначена посилана змінна, чи ні. Це можна побачити у випадку з `ESCAPED_REFERENCE` вище.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Перегляньте [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
