---
title: Зміна типового StorageClass
content_type: task
weight: 91
---

<!-- overview -->

Ця сторінка показує, як змінити типовий StorageClass, який використовується для
створення томів для PersistentVolumeClaims, які не мають особливих вимог.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Чому змінювати типовий StorageClass? {#why-change-the-default-storage-class}

Залежно від методу встановлення, ваш кластер Kubernetes може бути розгорнутий з наявним StorageClass, який позначений як типовий. Цей типовий StorageClass потім використовується для динамічного створення сховищ для PersistentVolumeClaims, які не вимагають будь-якого конкретного класу сховища. Див. [документацію по PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) для деталей.

Попередньо встановлений типовий StorageClass може не відповідати вашим очікуваним навантаженням; наприклад, він може створювати занадто дороге сховище. У цьому випадку ви можете змінити типовий StorageClass або повністю вимкнути його, щоб уникнути динамічного створення сховища.

Видалення типового StorageClass може бути недійсним, оскільки він може бути автоматично створений знову менеджером надбудов, що працює в вашому кластері. Будь ласка, перегляньте документацію для вашого встановлення для деталей про менеджера надбудов та способи вимкнення окремих надбудов.

## Зміна типового StorageClass {#changing-the-default-storageclass}

1. Перегляньте StorageClasses у вашому кластері:

   ```bash
   kubectl get storageclass
   ```

   Вивід буде схожий на це:

   ```bash
   NAME                 PROVISIONER               AGE
   standard (default)   kubernetes.io/gce-pd      1d
   gold                 kubernetes.io/gce-pd      1d
   ```

   Типовий StorageClass позначений як `(default)`.

1. Зніміть позначку default з типового StorageClass:

   У типового StorageClass є анотація `storageclass.kubernetes.io/is-default-class`, встановлена на `true`. Будь-яке інше значення або відсутність анотації розглядається як `false`.

   Щоб позначити StorageClass як не типовий, вам потрібно змінити його значення на `false`:

   ```bash
   kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
   ```

   де `standard` — це назва вашого вибраного StorageClass.

1. Позначте StorageClass як типовий:

   Аналогічно попередньому кроку, вам потрібно додати/встановити анотацію
   `storageclass.kubernetes.io/is-default-class=true`.

   ```bash
   kubectl patch storageclass gold -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   Зверніть увагу, що ви можете позначити декілька `StorageClass` як стандартні. Якщо позначено більше одного `StorageClass` як стандартного, `PersistentVolumeClaim` без явно визначеного `storageClassName` буде створено з використанням останнього створеного стандартного `StorageClass`. Коли `PersistentVolumeClaim` створено із зазначеним `volumeName`, він залишається у стані очікування, якщо `storageClassName` статичного тому не збігається з `StorageClass` у `PersistentVolumeClaim`.

1. Перевірте, що ваш вибраний StorageClass є default:

   ```bash
   kubectl get storageclass
   ```

   Вивід буде схожий на це:

   ```bash
   NAME             PROVISIONER               AGE
   standard         kubernetes.io/gce-pd      1d
   gold (default)   kubernetes.io/gce-pd      1d
   ```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
