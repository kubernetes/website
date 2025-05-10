---
title: Передача інформації про Pod контейнерам через файли
content_type: task
weight: 40
---

<!-- overview -->

Ця сторінка показує, як Pod може використовувати [`volumeDownwardAPI`](/docs/concepts/storage/volumes/#downwardapi), щоб передати інформацію про себе контейнерам, які працюють в Pod. `volumeDownwardAPI` може викривати поля Pod та контейнера.

У Kubernetes є два способи експозиції полів Pod та контейнера для запущеного контейнера:

* [Змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* Файли томів, як пояснено в цьому завданні

Разом ці два способи експозиції полів Pod та контейнера називаються _downward API_.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Зберігання полів Pod {#store-pod-fields}

У цій частині завдання ви створюєте Pod з одним контейнером, і ви проєцюєте поля рівня Pod у працюючий контейнер як файли. Ось маніфест для Pod:

{{% code_sample file="pods/inject/dapi-volume.yaml" %}}

У маніфесті ви бачите, що у Pod є `volumeDownwardAPI`, і контейнер монтує том за шляхом `/etc/podinfo`.

Подивіться на масив `items` під `downwardAPI`. Кожен елемент масиву визначає `volumeDownwardAPI`. Перший елемент вказує, що значення поля `metadata.labels` Pod має бути збережене в файлі з назвою `labels`. Другий елемент вказує, що значення поля `annotations` Pod має бути збережене в файлі з назвою `annotations`.

{{< note >}}
Поля в цьому прикладі є полями Pod. Вони не є полями контейнера в Pod.
{{< /note >}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

Перевірте, що контейнер в Pod працює:

```shell
kubectl get pods
```

Перегляньте логи контейнера:

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

Вивід показує вміст файлів `labels` та `annotations`:

```none
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

Отримайте доступ до оболонки в контейнері, який працює в вашому Pod:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

У вашій оболонці перегляньте файл `labels`:

```shell
/# cat /etc/podinfo/labels
```

Вивід показує, що всі мітки Pod були записані у файл `labels`:

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

У виводі ви побачите, що файли `labels` та `annotations` знаходяться в тимчасовій підтеці: у цьому прикладі, `..2982_06_02_21_47_53.299460680`. У теці `/etc/podinfo`, `..data` є символічним посиланням на тимчасову підтеку. Також у теці `/etc/podinfo`, `labels` та `annotations` є символічними посиланнями.

```none
drwxr-xr-x  ... Feb 6 21:47 ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 ..data -> ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 annotations -> ..data/annotations
lrwxrwxrwx  ... Feb 6 21:47 labels -> ..data/labels

/etc/..2982_06_02_21_47_53.299460680:
total 8
-rw-r--r--  ... Feb  6 21:47 annotations
-rw-r--r--  ... Feb  6 21:47 labels
```

Використання символічних посилань дозволяє динамічне атомарне оновлення метаданих; оновлення записуються у новий тимчасову теку, а символічне посилання `..data` оновлюється атомарно за допомогою [rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html).

{{< note >}}
Контейнер, який використовує Downward API як том з [subPath](/docs/concepts/storage/volumes/#using-subpath) монтуванням, не отримає оновлень від Downward API.
{{< /note >}}

Вийдіть з оболонки:

```shell
/# exit
```

## Зберігання полів контейнера {#store-container-fields}

У попередньому завданні ви зробили поля Pod доступними за допомогою Downward API. У наступній вправі ви передаєте поля, які є частиною визначення Pod, але беруться з конкретного [контейнера](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) скоріше, ніж з Pod загалом. Ось маніфест для Pod, що має лише один контейнер:

{{% code_sample file="pods/inject/dapi-volume-resources.yaml" %}}

У маніфесті ви бачите, що у Pod є [`volumeDownwardAPI`](/docs/concepts/storage/volumes/#downwardapi), і що контейнер у цьому Pod монтує том за шляхом `/etc/podinfo`.

Подивіться на масив `items` під `downwardAPI`. Кожен елемент масиву визначає файл у томі downward API.

Перший елемент вказує, що в контейнері з назвою `client-container`, значення поля `limits.cpu` у форматі, вказаному як `1m`, має бути опубліковане як файл з назвою `cpu_limit`. Поле `divisor` є необовʼязковим і має стандартне значення `1`. Дільник 1 означає ядра для ресурсів `cpu`, або байти для ресурсів `memory`.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

Отримайте доступ до оболонки в контейнері, який працює в вашому Pod:

```shell
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

У вашій оболонці перегляньте файл `cpu_limit`:

```shell
# Виконайте це в оболонці всередині контейнера
cat /etc/podinfo/cpu_limit
```

Ви можете використовувати подібні команди, щоб переглянути файли `cpu_request`, `mem_limit` та `mem_request`.

<!-- discussion -->

## Проєцювання ключів на конкретні шляхи та дозволи на файли {#project-keys-to-specific-paths-and-file-permissions}

Ви можете проєціювати ключі на конкретні шляхи та конкретні дозволи на файл на основі файлу. Для отримання додаткової інформації дивіться [Secret](/docs/concepts/configuration/secret/).

## {{% heading "whatsnext" %}}

* Прочитайте [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec) API-визначення для Pod. Специфікація включає визначення Контейнера (частина Pod).
* Прочитайте список [доступних полів](/docs/concepts/workloads/pods/downward-api/#available-fields), які ви можете викрити за допомогою downward API.

Дізнайтеся про томи в легасі довідці API:

* Перегляньте [`Volume`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core) API-визначення, яке визначає загальний том у Pod для доступу контейнерів.
* Перегляньте [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core) API-визначення, яке визначає том, який містить інформацію Downward API.
* Перегляньте [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core) API-визначення, яке містить посилання на обʼєкт або поля ресурсу для заповнення файлу у томі Downward API.
* Перегляньте [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core) API-визначення, яке вказує ресурси контейнера та їх формат виведення.
