---
title: Імперативне керування обʼєктами Kubernetes за допомогою файлів конфігурації
content_type: task
weight: 40
---

<!-- overview -->
Обʼєкти Kubernetes можна створювати, оновлювати й видаляти за допомогою інструмента командного рядка `kubectl` разом із файлом конфігурації обʼєкта у форматі YAML або JSON. У цьому документі пояснено, як визначати обʼєкти й керувати ними за допомогою файлів конфігурації.

## {{% heading "prerequisites" %}} {#before-you-begin}

Встановіть [`kubectl`](/docs/tasks/tools/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Компроміси {#trade-offs}

Інструмент `kubectl` підтримує три види керування обʼєктами:

* Імперативні команди
* Імперативне конфігурування обʼєктів
* Декларативна конфігурація обʼєктів

Переваги й недоліки кожного виду керування обʼєктами розглянуто в розділі [Управління обʼєктами Kubernetes](/docs/concepts/overview/working-with-objects/object-management/).

## Як створювати обʼєкти {#how-to-create-objects}

Ви можете використовувати `kubectl create -f`, щоб створити обʼєкт з файлу конфігурації. Докладніше дивіться в [довіднику API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

* `kubectl create -f <filename|url>`

## Як оновити обʼєкти {#how-to-update-objects}

{{< warning >}}
Оновлення обʼєктів за допомогою команди `replace` вилучає всі частини специфікації, не вказані у файлі конфігурації. Цю команду не слід використовувати з обʼєктами, чиї специфікації частково керуються кластером, наприклад із Services типу `LoadBalancer`, де поле `externalIPs` керується незалежно від файлу конфігурації. Поля, що керуються незалежно, потрібно скопіювати у файл конфігурації, щоб `replace` не вилучив їх.
{{< /warning >}}

Ви можете використовувати `kubectl replace -f`, щоб оновити живий обʼєкт відповідно до файлу конфігурації.

* `kubectl replace -f <filename|url>`

## Як видалити обʼєкти {#how-to-delete-objects}

Ви можете використовувати `kubectl delete -f`, щоб видалити обʼєкт, описаний у файлі конфігурації.

* `kubectl delete -f <filename|url>`

{{< note >}}
Якщо файл конфігурації задає поле `generateName` у розділі `metadata` замість поля `name`, ви не можете видалити обʼєкт за допомогою `kubectl delete -f <filename|url>`. Для видалення обʼєкта доведеться використати інші прапорці. Наприклад:

```shell
kubectl delete <type> <name>
kubectl delete <type> -l <label>
```

{{< /note >}}

## Як переглянути обʼєкт {#how-to-view-an-object}

Ви можете використовувати `kubectl get -f`, щоб переглянути інформацію про обʼєкт, описаний у файлі конфігурації.

* `kubectl get -f <filename|url> -o yaml`

Прапорець `-o yaml` вказує, що треба вивести повну конфігурацію обʼєкта. Використайте `kubectl get -h`, щоб побачити список параметрів.

## Обмеження {#limitations}

Команди `create`, `replace` і `delete` добре працюють, коли конфігурація кожного обʼєкта повністю визначена й записана в його файлі конфігурації. Однак якщо живий обʼєкт оновлено, а оновлення не внесено до його файлу конфігурації, вони будуть втрачені під час наступного виконання `replace`. Це може статися, якщо контролер, як-от HorizontalPodAutoscaler, вносить оновлення безпосередньо в живий обʼєкт. Ось приклад:

1. Ви створюєте обʼєкт з файлу конфігурації.
1. Інше джерело оновлює обʼєкт, змінюючи якесь поле.
1. Ви замінюєте обʼєкт з файлу конфігурації. Зміни, внесені іншим джерелом на кроці 2, втрачаються.

Якщо вам потрібна підтримка кількох записувачів для одного обʼєкта, можна використовувати `kubectl apply` для керування обʼєктом.

## Створення та редагування обʼєкта за URL без збереження конфігурації {#creating-and-editing-an-object-from-a-url-without-saving-the-configuration}

Припустимо, у вас є URL файлу конфігурації обʼєкта. Ви можете використати `kubectl create --edit`, щоб внести зміни до конфігурації перед створенням обʼєкта. Це особливо корисно для навчальних матеріалів і завдань, що вказують на файл конфігурації, який читач може змінити.

```shell
kubectl create -f <url> --edit
```

## Міграція від імперативних команд до імперативного конфігурування обʼєктів {#migrating-from-imperative-commands-to-imperative-object-configuration}

Міграція від імперативних команд до імперативного конфігурування обʼєктів складається з кількох кроків, які виконуються вручну.

1. Експортуйте живий обʼєкт у локальний файл конфігурації обʼєкта:

    ```shell
    kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
    ```

1. Вручну вилучіть поле status із файлу конфігурації обʼєкта.

1. Для подальшого керування обʼєктом використовуйте виключно `replace`.

    ```shell
    kubectl replace -f <kind>_<name>.yaml
    ```

## Визначення селекторів контролерів та міток PodTemplate {#defining-controller-selectors-and-podtemplate-labels}

{{< warning >}}
Оновлювати селектори контролерів категорично не рекомендовано.
{{< /warning >}}

Рекомендований підхід — визначити одну незмінну мітку PodTemplate, яка використовується тільки селектором контролера без іншого семантичного значення.

Приклад мітки:

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "apps/v1/deployment/nginx"
```

## {{% heading "whatsnext" %}} {#what-s-next}

* [Керування обʼєктами Kubernetes за допомогою імперативних команд](/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [Декларативне керування обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Довідник команд kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Довідник API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
