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

Залежно від методу встановлення, ваш кластер Kubernetes може бути розгорнутий з наявним StorageClass, який позначений як типовий. Цей типовий StorageClass потім використовується для динамічного створення сховищ для PersistentVolumeClaims, які не вимагають будь-якого конкретного класу сховища. Див. [документацію по PersistentVolumeClaim](/uk/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) для деталей.

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
   standard (default)   kubernetes.io/gce-pd      1д
   gold                 kubernetes.io/gce-pd      1д
   ```

   Типовий StorageClass позначений як `(default)`.

1. Позначте типовий StorageClass як не типовий:

   У типового StorageClass є анотація `storageclass.kubernetes.io/is-default-class`, встановлена на `true`. Будь-яке інше значення або відсутність анотації розглядається як `false`.

   Щоб позначити StorageClass як не типовий, вам потрібно змінити його значення на `false`:

   ```bash
   kubectl patch storageclass standard -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
   ```

   де `standard` — це назва вашого вибраного StorageClass.

2. Позначте StorageClass як типовий:

   Аналогічно попередньому кроку, вам потрібно додати/встановити анотацію
   `storageclass.kubernetes.io/is-default-class=true`.

   ```bash
   kubectl patch storageclass gold -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   Зверніть увагу, що максимум один StorageClass може бути позначений як типовий. Якщо два або більше з них позначені як типові, PersistentVolumeClaim без явно вказаного `storageClassName` не може бути створений.

3. Перевірте, що ваш вибраний StorageClass є default:

   ```bash
   kubectl get storageclass
   ```

   Вивід буде схожий на це:

   ```bash
   NAME             PROVISIONER               AGE
   standard         kubernetes.io/gce-pd      1д
   gold (default)   kubernetes.io/gce-pd      1д
   ```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [PersistentVolumes](/uk/docs/concepts/storage/persistent-volumes/).
