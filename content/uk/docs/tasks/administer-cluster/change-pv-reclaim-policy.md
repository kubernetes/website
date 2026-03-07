---
title: Зміна політики відновлення PersistentVolume
content_type: task
weight: 100
---

<!-- overview -->

Ця сторінка показує, як змінити політику відновлення PersistentVolume в Kubernetes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Навіщо змінювати політику відновлення PersistentVolume {#why-change-reclaim-policy-of-a-persistentvolume}

У PersistentVolume можуть бути різні політики відновлення, включаючи "Retain", "Recycle" та "Delete". Для динамічно створених PersistentVolume типовою політикою відновлення є "Delete". Це означає, що динамічно створений том автоматично видаляється, коли користувач видаляє відповідний PersistentVolumeClaim. Ця автоматична поведінка може бути неприйнятною, якщо том містить важливі дані. У цьому випадку більш відповідною буде політика "Retain". З політикою "Retain", якщо користувач видаляє PersistentVolumeClaim, відповідний PersistentVolume не буде видалено. Замість цього він переміщується до фази Released, де всі його дані можуть бути вручну відновлені.

## Зміна політики відновлення PersistentVolume {#changing-the-reclaim-policy-of-a-persistentvolume}

1. Виведіть список PersistentVolume в вашому кластері:

   ```shell
   kubectl get pv
   ```

   Вивід буде схожий на такий:

   ```none
   NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
   pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     10s
   pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     6s
   pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim3    manual                     3s
   ```

   Цей список також включає імена заявок, які привʼязані до кожного тому для полегшення ідентифікації динамічно створених томів.

1. Виберіть один з ваших PersistentVolume та змініть його політику відновлення:

   ```shell
   kubectl patch pv <your-pv-name> -p '{"spec":{"persistentVolumeReclaimPolicy":"Retain"}}'
   ```

   де `<your-pv-name>` — це імʼя вашого обраного PersistentVolume.

   {{< note >}}
   У Windows ви повинні _двічі_ взяти в лапки будь-який шаблон JSONPath, що містить пробіли (не подвійні лапки як вказано вище для bash). Це своєю чергою означає, що ви повинні використовувати одинарні лапки або екрановані подвійні лапки навколо будь-яких літералів в шаблоні. Наприклад:

   ```cmd
   kubectl patch pv <your-pv-name> -p "{\"spec\":{\"persistentVolumeReclaimPolicy\":\"Retain\"}}"
   ```

   {{< /note >}}

2. Перевірте, що ваш обраний PersistentVolume має відповідну політику:

   ```shell
   kubectl get pv
   ```

   Вивід буде схожий на такий:

   ```none
   NAME                                       CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM             STORAGECLASS     REASON    AGE
   pvc-b6efd8da-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim1    manual                     40s
   pvc-b95650f8-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Delete          Bound     default/claim2    manual                     36s
   pvc-bb3ca71d-b7b5-11e6-9d58-0ed433a7dd94   4Gi        RWO           Retain          Bound     default/claim3    manual                     33s
   ```

   У попередньому виводі ви можете побачити, що том, привʼязаний до заявки `default/claim3`, має політику відновлення `Retain`. Він не буде автоматично видалений, коли користувач видаляє заявку `default/claim3`.

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Дізнайтеся більше про [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).

### Посилання {#reference}

* {{< api-reference page="config-and-storage-resources/persistent-volume-v1" >}}
  * Зверніть увагу на `.spec.persistentVolumeReclaimPolicy`
    [поля](/docs/reference/kubernetes-api/config-and-storage-resources/persistent-volume-v1/#PersistentVolumeSpec)  PersistentVolume.
* {{< api-reference page="config-and-storage-resources/persistent-volume-claim-v1" >}}
