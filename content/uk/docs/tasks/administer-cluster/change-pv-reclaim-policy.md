---
title: Зміна політики повторного використання PersistentVolume
content_type: task
weight: 100
---

<!-- overview -->

Ця сторінка показує, як змінити політику повторного використання PersistentVolume в Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Навіщо змінювати політику повторного використання PersistentVolume {#why-change-reclaim-policy-of-a-persistentvolume}

PersistentVolume можуть мати різні політики повторного використання, зокрема "Retain", "Recycle" і "Delete". Для динамічно наданих PersistentVolume стандартна політика повторного використання — "Delete". Це означає, що динамічно наданий том автоматично видаляється, коли користувач видаляє відповідний PersistentVolumeClaim. Така автоматична поведінка може бути неприйнятною, якщо том містить цінні дані. У такому разі доречніше використовувати політику "Retain". З політикою "Retain", якщо користувач видаляє PersistentVolumeClaim, відповідний PersistentVolume не видаляється. Натомість він переходить у фазу Released, і всі його дані можна відновити вручну.

## Зміна політики повторного використання PersistentVolume {#changing-the-reclaim-policy-of-a-persistentvolume}

1. Виведіть список PersistentVolume в вашому кластері:

   ```shell
   kubectl get pv
   ```

   Вивід подібний до такого:

   ```none
   NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
   pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     10s
   pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     6s
   pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim3    manual                     3s
   ```

   Цей список також містить імена заявок (claim), привʼязаних до кожного тому, щоб полегшити визначення динамічно наданих томів.

1. Виберіть один з ваших PersistentVolume та змініть його політику повторного використання:

   ```shell
   kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
   ```

   де `<your-pv-name>` — це імʼя вашого обраного PersistentVolume.

   {{< note >}}
   У Windows ви повинні використовувати подвійні лапки для будь-якого шаблону JSONPath, що містить пробіли (на відміну від одинарних лапок, які використовуються в bash). Це своєю чергою означає, що ви повинні використовувати одинарні лапки або екрановані подвійні лапки навколо будь-яких літералів в шаблоні. Наприклад:

   ```cmd
   kubectl patch pv <your-pv-name> -p "{\"spec\":{\"persistentVolumeReclaimPolicy\":\"Retain\"}}"
   ```

   {{< /note >}}

1. Перевірте, що вибраний PersistentVolume має правильну політику:

   ```shell
   kubectl get pv
   ```

   Вивід подібний до такого:

   ```none
   NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
   pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     40s
   pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     36s
   pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Retain          Bound     default/claim3    manual                     33s
   ```

   У попередньому виводі ви можете побачити, що том, привʼязаний до заявки `default/claim3`, має політику повторного використання `Retain`. Він не буде автоматично видалений, коли користувач видаляє заявку `default/claim3`.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Дізнайтеся більше про [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

### Довідка {#reference}

* {{< api-reference page="core/persistent-volume-v1" >}}
  * Зверніть увагу на [поле](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec) `.spec.persistentVolumeReclaimPolicy` обʼєкта PersistentVolume.
* {{< api-reference page="core/persistent-volume-claim-v1" >}}
