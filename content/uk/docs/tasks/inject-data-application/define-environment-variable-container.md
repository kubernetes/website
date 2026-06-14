---
title: Визначення змінних середовища для контейнера
content_type: task
weight: 20
---

<!-- overview -->

Ця сторінка показує, як визначити змінні середовища для контейнера у Kubernetes Pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Визначення змінної середовища для контейнера {#define-an-environment-variable-for-a-container}

При створенні Pod ви можете задати змінні середовища для контейнерів, які запускаються в Pod. Щоб задати змінні середовища, включіть поле `env` або `envFrom` у файлі конфігурації.

Поля `env` та `envFrom` мають різний ефект.

`env`
: дозволяє вам задати змінні середовища для контейнера, вказуючи значення безпосередньо для кожної змінної, яку ви називаєте.

`envFrom`
: дозволяє вам задати змінні середовища для контейнера, посилаючись на ConfigMap або Secret. Коли ви використовуєте `envFrom`, всі пари ключ-значення у зазначеному ConfigMap або Secret встановлюються як змінні середовища для контейнера. Ви також можете вказати спільний префіксовий рядок.

Докладніше про [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/#configure-all-key-value-pairs-in-a-configmap-as-container-environment-variables)
та [Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/#configure-all-key-value-pairs-in-a-secret-as-container-environment-variables).

Ця сторінка пояснює, як використовувати `env`.

У цьому завданні ви створюєте Pod, який запускає один контейнер. Конфігураційний файл для Pod визначає змінну середовища з імʼям `DEMO_GREETING` та значенням `"Привіт із середовища"`. Ось маніфест конфігурації для Pod:

{{% code_sample file="pods/inject/envars.yaml" %}}

1. Створіть Pod на основі цього маніфесту:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/inject/envars.yaml
   ```

1. Перегляньте перелік запущених Podʼів:

   ```shell
   kubectl get pods -l purpose=demonstrate-envars
   ```

   Вивід буде подібний до:

   ```none
   NAME            READY     STATUS    RESTARTS   AGE
   envar-demo      1/1       Running   0          9s
   ```

1. Перегляньте змінні середовища контейнера Pod:

   ```shell
   kubectl exec envar-demo -- printenv
   ```

   Вивід буде подібний до такого:

   ```none
   NODE_VERSION=4.4.2
   EXAMPLE_SERVICE_PORT_8080_TCP_ADDR=10.3.245.237
   HOSTNAME=envar-demo
   ...
   DEMO_GREETING=Привіт із середовища
   DEMO_FAREWELL=Такий солодкий прощальний слова
   ```

{{< note >}}
Змінні середовища, встановлені за допомогою полів `env` або `envFrom`, перевизначають будь-які змінні середовища, вказані в образі контейнера.
{{< /note >}}

{{< note >}}
Змінні середовища можуть посилатися одна на одну, проте важливий порядок. Змінні, які використовують інші, визначені в тому ж контексті, повинні йти пізніше у списку. Також уникайте циклічних посилань.
{{< /note >}}

## Використання змінних середовища у вашій конфігурації {#use-environment-variables-in-your-config}

Змінні середовища, які ви визначаєте у конфігурації Pod у `.spec.containers[*].env[*]`, можна використовувати в інших частинах конфігурації, наприклад, у командах та аргументах, які ви задаєте для контейнерів Pod. У наступній конфігурації прикладу, змінні середовища `GREETING`, `HONORIFIC` та `NAME` встановлені на `Warm greetings to`, `The Most Honorable` та `Kubernetes` відповідно. Змінна середовища `MESSAGE` комбінує набір усіх цих змінних середовища, а потім використовує їх як аргумент командного рядка, переданий контейнеру `env-print-demo`.

Імена змінних середовища можуть складатися з будь-яких [друкованих символів ASCII](https://www.ascii-code.com/characters/printable-characters), окрім "=".

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

Після створення команда `echo Warm greetings to The Most Honorable Kubernetes` виконується в контейнері.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Дізнайтеся про [використання secret як змінних середовища](/docs/concepts/configuration/secret/#using-secrets-as-environment-variables).
* Дивіться [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core).
