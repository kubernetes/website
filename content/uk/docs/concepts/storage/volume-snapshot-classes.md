---
title: Класи знімків томів
content_type: concept
weight: 61 # just after volume snapshots
---

<!-- overview -->

У цьому документі описано концепцію VolumeSnapshotClass в Kubernetes. Рекомендується мати відомості про [знімки томів](/docs/concepts/storage/volume-snapshots/) та [класи сховищ](/docs/concepts/storage/storage-classes).

<!-- body -->

## Вступ {#introduction}

Так само як StorageClass надає можливість адміністраторам описувати "класи" сховищ, які вони пропонують при виділенні тому, VolumeSnapshotClass надає можливість описувати "класи" сховищ при виділенні знімка тому.

## Ресурс VolumeSnapshotClass {#the-volumesnapshotclass-resource}

Кожен VolumeSnapshotClass містить поля `driver`, `deletionPolicy` та `parameters`, які використовуються, коли потрібно динамічно виділити том для VolumeSnapshot, який належить до цього класу.

Назва обʼєкта VolumeSnapshotClass має значення і вказує, як користувачі можуть запитувати певний клас. Адміністратори встановлюють назву та інші параметри класу при створенні обʼєктів VolumeSnapshotClass, і їх не можна оновлювати після створення.

{{< note >}}
Встановлення CRDs є відповідальністю розподілу Kubernetes. Без наявних необхідних CRDs створення VolumeSnapshotClass закінчується невдачею.
{{< /note >}}

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

Адміністратори можуть вказати типовий VolumeSnapshotClass для тих VolumeSnapshots, які не вимагають конкретний клас для привʼязки, додавши анотацію `snapshot.storage.kubernetes.io/is-default-class: "true"`:

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
  annotations:
    snapshot.storage.kubernetes.io/is-default-class: "true"
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

Якщо існує декілька драйверів CSI, для кожного з них можна вказати стандартний VolumeSnapshotClass.

### Залежності VolumeSnapshotClass  {#volumesnapshotclass-dependencies}

Коли ви створюєте VolumeSnapshot без зазначення VolumeSnapshotClass, Kubernetes автоматично вибирає стандартний VolumeSnapshotClass, який має CSI-драйвер, що відповідає CSI-драйверу класу зберігання PVC.

Така поведінка дозволяє співіснувати у кластері декільком стандартним обʼєктам VolumeSnapshotClass, якщо кожен з них повʼязаний з унікальним драйвером CSI.

Завжди переконайтеся, що для кожного драйвера CSI існує лише один типовий VolumeSnapshotClass для кожного драйвера CSI. Якщо за допомогою одного драйвера CSI буде створено декілька стандартних об'єктів VolumeSnapshotClass, створення VolumeSnapshot не вдасться, оскільки Kubernetes не зможе визначити, який саме обʼєкт слід використати.

### Driver

Класи знімків томів мають власника, який визначає, який CSI втулок тому використовується для виділення VolumeSnapshots. Це поле обовʼязкове.

### DeletionPolicy

Класи знімків томів мають [DeletionPolicy](/docs/concepts/storage/volume-snapshots/#delete). Вона дозволяє налаштувати, що відбудеться з VolumeSnapshotContent, коли буде видалено обʼєкт VolumeSnapshot, з яким він повʼязаний. DeletionPolicy класу знімків томів може бути або `Retain`, або `Delete`. Це поле обовʼязкове.

Якщо DeletionPolicy має значення `Delete`, тоді разом з обʼєктом VolumeSnapshotContent буде видалено знімок тому у сховищі. Якщо DeletionPolicy має значення `Retain`, то знімок тому та VolumeSnapshotContent залишаються.

## Параметри {#parameters}

Класи знімків томів мають параметри, які описують знімки томів, що належать до класу знімків томів. Різні параметри можуть бути прийняті залежно від `driver`.
