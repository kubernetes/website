---
title: Керування обʼєктами Kubernetes за допомогою імперативних команд
content_type: task
weight: 30
---

<!-- overview -->

Обʼєкти Kubernetes можна швидко створювати, оновлювати й видаляти безпосередньо за допомогою імперативних команд, вбудованих в інструмент командного рядка `kubectl`. У цьому документі пояснено, як організовано ці команди та як їх використовувати для керування живими обʼєктами.

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

Інструмент `kubectl` підтримує команди на основі дієслів для створення деяких найпоширеніших типів обʼєктів. Команди названо так, щоб їх могли розпізнати користувачі, не знайомі з типами обʼєктів Kubernetes.

- `run`: створює новий Pod для запуску контейнера.
- `expose`: створює новий обʼєкт Service для балансування трафіку між Podʼами.
- `autoscale`: створює новий обʼєкт Autoscaler для автоматичного горизонтального масштабування контролера, наприклад Deployment.

Інструмент `kubectl` також підтримує команди створення на основі типу обʼєкта. Ці команди підтримують більше типів обʼєктів і чіткіше виражають свій намір, але вимагають, щоб користувачі знали тип обʼєктів, які вони мають намір створити.

- `create <objecttype> [<subtype>] <instancename>`

Деякі типи обʼєктів мають підтипи, які можна вказати в команді `create`. Наприклад, обʼєкт Service має кілька підтипів, зокрема ClusterIP, LoadBalancer і NodePort. Ось приклад створення Service з підтипом NodePort:

```shell
kubectl create service nodeport <myservicename>
```

У наведеному вище прикладі команда `create service nodeport` називається підкомандою команди `create service`.

Ви можете використати прапорець `-h`, щоб знайти аргументи й прапорці, які підтримує підкоманда:

```shell
kubectl create service nodeport -h
```

## Як оновлювати обʼєкти {#how-to-update-objects}

Команда `kubectl` підтримує команди на основі дієслів для деяких поширених операцій оновлення. Ці команди названо так, щоб користувачі, не знайомі з обʼєктами Kubernetes, могли виконувати оновлення, не знаючи конкретних полів, які потрібно встановити:

- `scale`: горизонтально масштабувати контролер, щоб додати або вилучити Podʼи, оновивши кількість реплік контролера.
- `annotate`: додати анотацію до обʼєкта або вилучити її.
- `label`: додати мітку до обʼєкта або вилучити її.

Команда `kubectl` також підтримує команди оновлення на основі аспекту обʼєкта. Встановлення цього аспекту може встановлювати різні поля для різних типів обʼєктів:

- `set` `<field>`: встановити аспект обʼєкта.

{{< note >}}
У версії Kubernetes 1.5 не кожна команда на основі дієслова має відповідну команду на основі аспекту.
{{< /note >}}

Інструмент `kubectl` підтримує ці додаткові способи безпосереднього оновлення живого обʼєкта, однак вони вимагають кращого розуміння схеми обʼєктів Kubernetes.

- `edit`: безпосередньо редагувати необроблену конфігурацію живого обʼєкта, відкриваючи її в редакторі.
- `patch`: безпосередньо змінювати конкретні поля живого обʼєкта за допомогою рядка патча. Докладніше про рядки патча дивіться в розділі про патчі в [API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#patch-operations).

## Як видаляти обʼєкти {#how-to-delete-objects}

Ви можете використовувати команду `delete`, щоб видалити обʼєкт з кластера:

- `delete <type>/<name>`

{{< note >}}
Ви можете використовувати `kubectl delete` як для імперативних команд, так і для імперативного конфігурування обʼєктів. Різниця полягає в аргументах, переданих команді. Щоб використати `kubectl delete` як імперативну команду, передайте обʼєкт для видалення як аргумент. Ось приклад, який передає обʼєкт Deployment з назвою nginx:
{{< /note >}}

```shell
kubectl delete deployment/nginx
```

## Як переглянути обʼєкт {#how-to-view-an-object}

{{< comment >}}
TODO(pwittrock): Uncomment this when implemented.

You can use `kubectl view` to print specific fields of an object.

- `view`: Prints the value of a specific field of an object.

{{< /comment >}}

Існує кілька команд для виведення інформації про обʼєкт:

- `get`: виводить базову інформацію про відповідні обʼєкти. Використайте `get -h`, щоб побачити список параметрів.
- `describe`: виводить агреговану детальну інформацію про відповідні обʼєкти.
- `logs`: виводить stdout і stderr контейнера, що працює в Podʼі.

## Використання команд `set` для модифікації обʼєктів перед створенням {#using-set-commands-to-modify-objects-before-creation}

Деякі поля обʼєктів не мають прапорця, який можна використати в команді `create`. У деяких із цих випадків можна використати комбінацію `set` і `create`, щоб вказати значення поля перед створенням обʼєкта. Для цього вивід команди `create` передається через канал до команди `set`, а потім назад до команди `create`. Ось приклад:

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

1. Команда `kubectl create service -o yaml --dry-run=client` створює конфігурацію для Service, але виводить її в stdout у форматі YAML замість надсилання до API-сервера Kubernetes.
1. Команда `kubectl set selector --local -f - -o yaml` читає конфігурацію зі stdin і записує оновлену конфігурацію в stdout у форматі YAML.
1. Команда `kubectl create -f -` створює обʼєкт, використовуючи конфігурацію, отриману через stdin.

## Використання `--edit` для модифікації обʼєктів перед створенням {#using-edit-to-modify-objects-before-creation}

Можна використати `kubectl create --edit`, щоб внести довільні зміни в обʼєкт перед його створенням. Ось приклад:

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

1. Команда `kubectl create service` створює конфігурацію для Service та зберігає її у `/tmp/srv.yaml`.
1. Команда `kubectl create --edit` відкриває файл конфігурації для редагування перед створенням обʼєкта.

## {{% heading "whatsnext" %}} {#what-s-next}

* [Імперативне керування обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [Декларативне керування обʼєктами Kubernetes за допомогою файлів конфігурації](/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Довідник команд kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Довідник API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
