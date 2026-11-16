---
title: Класи знімків томів
content_type: concept
weight: 61 # just after volume snapshots
---

<!-- overview -->

У цьому документі описано концепцію VolumeSnapshotClass у Kubernetes. Рекомендується ознайомитися зі [знімками томів](/docs/concepts/storage/volume-snapshots/) та [класами сховищ](/docs/concepts/storage/storage-classes).

<!-- body -->

## Вступ {#introduction}

Так само як StorageClass надає адміністраторам можливість описувати «класи» сховища, які вони пропонують під час надання тому, VolumeSnapshotClass надає можливість описувати «класи» сховища під час надання знімка тому.

## Ресурс VolumeSnapshotClass {#the-volumesnapshotclass-resource}

Кожен VolumeSnapshotClass містить поля `driver`, `deletionPolicy` та `parameters`, які використовуються, коли VolumeSnapshot, що належить до цього класу, потрібно надати динамічно.

Назва обʼєкта VolumeSnapshotClass є важливою: саме за нею користувачі можуть запитати певний клас. Адміністратори встановлюють назву та інші параметри класу під час першого створення обʼєктів VolumeSnapshotClass, і ці обʼєкти не можна оновлювати після створення.

{{< note >}}
За встановлення CRD відповідає дистрибутив Kubernetes. Якщо потрібних CRD немає, створення VolumeSnapshotClass завершиться невдачею.
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

Адміністратори можуть вказати стандартний VolumeSnapshotClass для VolumeSnapshots, які не запитують привʼязки до певного класу, додавши анотацію `snapshot.storage.kubernetes.io/is-default-class: "true"`:

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

Якщо існує кілька драйверів CSI, для кожного з них можна вказати стандартний VolumeSnapshotClass.

### Залежності VolumeSnapshotClass {#volumesnapshotclass-dependencies}

Коли ви створюєте VolumeSnapshot без зазначення VolumeSnapshotClass, Kubernetes автоматично вибирає стандартний VolumeSnapshotClass, драйвер CSI якого збігається з драйвером CSI StorageClass цього PVC.

Така поведінка дозволяє кільком стандартним обʼєктам VolumeSnapshotClass співіснувати в кластері, якщо кожен із них повʼязаний з унікальним драйвером CSI.

Завжди переконуйтеся, що для кожного драйвера CSI існує лише один стандартний VolumeSnapshotClass. Якщо з одним драйвером CSI створено кілька стандартних обʼєктів VolumeSnapshotClass, створення VolumeSnapshot завершиться невдачею, оскільки Kubernetes не зможе визначити, який із них використати.

### Driver

Класи знімків томів мають драйвер, який визначає, який втулок томів CSI використовується для надання VolumeSnapshots. Це поле є обовʼязковим.

### DeletionPolicy

Класи знімків томів мають [deletionPolicy](/docs/concepts/storage/volume-snapshots/#delete). Вона дозволяє налаштувати, що станеться з VolumeSnapshotContent, коли обʼєкт VolumeSnapshot, до якого він привʼязаний, буде видалено. Значення deletionPolicy класу знімків томів може бути `Retain` або `Delete`. Це поле є обовʼязковим.

Якщо deletionPolicy має значення `Delete`, базовий знімок сховища буде видалено разом з обʼєктом VolumeSnapshotContent. Якщо deletionPolicy має значення `Retain`, то і базовий знімок, і VolumeSnapshotContent залишаються.

## Параметри {#parameters}

Класи знімків томів мають параметри, які описують знімки томів, що належать до цього класу. Залежно від `driver` можуть прийматися різні параметри.
