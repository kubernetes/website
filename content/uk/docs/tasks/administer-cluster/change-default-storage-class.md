---
title: Зміна стандартного StorageClass
content_type: task
weight: 90
---

<!-- overview -->

Ця сторінка показує, як змінити стандартний StorageClass, який використовується для надання томів для PersistentVolumeClaim без особливих вимог.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Чому змінювати стандартний StorageClass? {#why-change-the-default-storage-class}

Залежно від методу встановлення, ваш кластер Kubernetes може бути розгорнутий з наявним StorageClass, позначеним як стандартний. Цей стандартний StorageClass потім використовується для динамічного надання сховища для PersistentVolumeClaim, які не вимагають певного класу сховища. Докладніше дивіться [документацію щодо PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

Попередньо встановлений стандартний StorageClass може не відповідати вашим очікуваним навантаженням; наприклад, він може створювати занадто дороге сховище. У цьому випадку ви можете змінити стандартний StorageClass або повністю вимкнути його, щоб уникнути динамічного створення сховища.

Видалення стандартного StorageClass може не спрацювати, оскільки його може автоматично створити знову менеджер надбудов, що працює у вашому кластері. Докладніше про менеджер надбудов і про те, як вимкнути окремі надбудови, дивіться в документації до вашого встановлення.

## Зміна стандартного StorageClass {#changing-the-default-storageclass}

1. Перегляньте StorageClasses у вашому кластері:

   ```bash
   kubectl get storageclass
   ```

   Вивід подібний до такого:

   ```bash
   NAME                 PROVISIONER               AGE
   standard (default)   kubernetes.io/gce-pd      1d
   gold                 kubernetes.io/gce-pd      1d
   ```

   Стандартний StorageClass позначений як `(default)`.

1. Позначте стандартний StorageClass як нестандартний:

   У стандартного StorageClass є анотація `storageclass.kubernetes.io/is-default-class`, встановлена на `true`. Будь-яке інше значення або відсутність анотації розглядається як `false`.

   Щоб позначити StorageClass як нестандартний, потрібно змінити значення анотації на `false`:

   ```bash
   kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
   ```

   де `standard` — це назва вашого вибраного StorageClass.

1. Позначте StorageClass як стандартний:

   Аналогічно попередньому кроку, вам потрібно додати/встановити анотацію
   `storageclass.kubernetes.io/is-default-class=true`.

   ```bash
   kubectl patch storageclass gold -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   Зверніть увагу, що ви можете позначити декілька `StorageClass` як стандартні. Якщо позначено більше одного `StorageClass` як стандартного, `PersistentVolumeClaim` без явно визначеного `storageClassName` буде створено з використанням останнього створеного стандартного `StorageClass`. Коли `PersistentVolumeClaim` створено із зазначеним `volumeName`, він залишається у стані очікування, якщо `storageClassName` статичного тому не збігається з `StorageClass` у `PersistentVolumeClaim`.

1. Перевірте, що вибраний StorageClass став стандартним:

   ```bash
   kubectl get storageclass
   ```

   Вивід подібний до такого:

   ```bash
   NAME             PROVISIONER               AGE
   standard         kubernetes.io/gce-pd      1d
   gold (default)   kubernetes.io/gce-pd      1d
   ```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
