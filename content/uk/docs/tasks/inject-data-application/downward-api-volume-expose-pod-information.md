---
title: Передача інформації про Pod контейнерам через файли
content_type: task
weight: 40
---

<!-- overview -->

На цій сторінці показано, як Pod може використовувати [том `downwardAPI`](/docs/concepts/storage/volumes/#downwardapi), щоб передавати інформацію про себе контейнерам, які працюють у Podʼі. Том `downwardAPI` може надавати поля Podʼа й контейнера.

У Kubernetes є два способи надати поля Podʼа та контейнера запущеному контейнеру:

* [Змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* Файли томів, як пояснено в цьому завданні

Разом ці два способи надання полів Podʼа та контейнера називаються _downward API_.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Зберігання полів Podʼа {#store-pod-fields}

У цій частині вправи ви створите Pod з одним контейнером і спроєцюєте поля рівня Podʼа в запущений контейнер як файли. Ось маніфест Podʼа:

{{% code_sample file="pods/inject/dapi-volume.yaml" %}}

У маніфесті ви бачите, що Pod має том `downwardAPI`, а контейнер монтує цей том у `/etc/podinfo`.

Подивіться на масив `items` у `downwardAPI`. Кожен елемент масиву визначає том `downwardAPI`. Перший елемент вказує, що значення поля `metadata.labels` Podʼа слід зберегти у файлі з назвою `labels`. Другий елемент вказує, що значення поля `annotations` Podʼа слід зберегти у файлі з назвою `annotations`.

{{< note >}}
Поля в цьому прикладі є полями Podʼа. Вони не є полями контейнера в Podʼі.
{{< /note >}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

Перевірте, що контейнер у Podʼі працює:

```shell
kubectl get pods
```

Перегляньте логи контейнера:

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

Вивід показує вміст файлів `labels` та `annotations`:

```
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

Отримайте доступ до оболонки в контейнері, який працює у вашому Podʼі:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

В оболонці перегляньте файл `labels`:

```shell
/# cat /etc/podinfo/labels
```

Вивід показує, що всі мітки Podʼа записано у файл `labels`:

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

Аналогічно, перегляньте файл `annotations`:

```shell
/# cat /etc/podinfo/annotations
```

Перегляньте файли у теці `/etc/podinfo`:

```shell
/# ls -laR /etc/podinfo
```

У виводі видно, що файли `labels` та `annotations` містяться в тимчасовій підтеці: у цьому прикладі `..2982_06_02_21_47_53.299460680`. У теці `/etc/podinfo` `..data` є символічним посиланням на тимчасову підтеку. Також у теці `/etc/podinfo` `labels` та `annotations` є символічними посиланнями.

```
drwxr-xr-x  ... Feb 6 21:47 ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 ..data -> ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 annotations -> ..data/annotations
lrwxrwxrwx  ... Feb 6 21:47 labels -> ..data/labels

/etc/..2982_06_02_21_47_53.299460680:
total 8
-rw-r--r--  ... Feb  6 21:47 annotations
-rw-r--r--  ... Feb  6 21:47 labels
```

Символічні посилання дають змогу динамічно й атомарно оновлювати метадані: оновлення записуються в нову тимчасову теку, а символічне посилання `..data` оновлюється атомарно за допомогою [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html).

{{< note >}}
Контейнер, який використовує Downward API як том, змонтований через [subPath](/docs/concepts/storage/volumes/#using-subpath), не отримуватиме оновлень Downward API.
{{< /note >}}

Вийдіть з оболонки:

```shell
/# exit
```

## Зберігання полів контейнера {#store-container-fields}

У попередній вправі ви зробили поля рівня Podʼа доступними за допомогою downward API. У наступній вправі ви передасте поля, які є частиною визначення Podʼа, але взяті з конкретного [контейнера](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container), а не з Podʼа загалом. Ось маніфест Podʼа, який знову має лише один контейнер:

{{% code_sample file="pods/inject/dapi-volume-resources.yaml" %}}

У маніфесті ви бачите, що Pod має [том `downwardAPI`](/docs/concepts/storage/volumes/#downwardapi), а єдиний контейнер у цьому Podʼі монтує цей том у `/etc/podinfo`.

Подивіться на масив `items` у `downwardAPI`. Кожен елемент масиву визначає файл у томі downward API.

Перший елемент вказує, що в контейнері з назвою `client-container` значення поля `limits.cpu` у форматі, заданому `1m`, слід опублікувати як файл із назвою `cpu_limit`. Поле `divisor` необовʼязкове й має стандартне значення `1`. Дільник 1 означає ядра для ресурсів `cpu` або байти для ресурсів `memory`.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

Отримайте доступ до оболонки в контейнері, який працює у вашому Podʼі:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

В оболонці перегляньте файл `cpu_limit`:

```shell
# Виконайте це в оболонці всередині контейнера
cat /etc/podinfo/cpu_limit
```

Ви можете використовувати подібні команди, щоб переглянути файли `cpu_request`, `mem_limit` та `mem_request`.

<!-- discussion -->

## Проєціювання ключів на конкретні шляхи та дозволи файлів {#project-keys-to-specific-paths-and-file-permissions}

Ви можете проєціювати ключі на конкретні шляхи й задавати конкретні дозволи для кожного файлу окремо. Докладніше дивіться [Secrets](/docs/concepts/configuration/secret/).

## {{% heading "whatsnext" %}} {#what-s-next}

* Прочитайте визначення API [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) для Pod. Воно містить визначення Container (частина Pod).
* Прочитайте список [доступних полів](/docs/concepts/workloads/pods/downward-api/#available-fields), які можна надати за допомогою downward API.

Прочитайте про томи в застарілій довідці API:

* Перегляньте визначення API [`Volume`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core), яке описує загальний том у Podʼі, до якого мають доступ контейнери.
* Перегляньте визначення API [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core), яке описує том з інформацією Downward API.
* Перегляньте визначення API [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core), яке містить посилання на поля обʼєкта або ресурсу для заповнення файлу в томі Downward API.
* Перегляньте визначення API [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core), яке визначає ресурси контейнера та формат їх виводу.
