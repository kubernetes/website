---
title: VolumeSnapshotClass
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Laman ini menjelaskan tentang konsep VolumeSnapshotClass pada Kubernetes. Sebelum melanjutkan,
sangat disarankan untuk membaca [_snapshot_ volume](/docs/concepts/storage/volume-snapshots/)
dan [kelas penyimpanan (_storage class_)](/docs/concepts/storage/storage-classes) terlebih dahulu.

{{% /capture %}}


{{% capture body %}}

## Pengenalan

Seperti halnya StorageClass yang menyediakan cara bagi admin untuk mendefinisikan
"kelas" penyimpanan yang mereka tawarkan saat proses penyediaan sebuah volume, VolumeSnapshotClass
menyediakan cara untuk mendefinisikan "kelas" penyimpanan saat menyediakan _snapshot_ volume.

## Sumber Daya VolumeSnapshotClass

Masing-masing VolumeSnapshotClass terdiri dari _field_ `snapshotter` dan `parameters`,
yang digunakan saat sebuah VolumeSnapshot yang dimiliki kelas tersebut perlu untuk
disediakan secara dinamis.

Nama yang dimiliki suatu objek VolumeSnapshotClass sangatlah penting, karena digunakan
oleh pengguna saat meminta sebuah kelas tertentu. Admin dapat mengatur nama dan parameter
lainnya dari sebuah kelas saat pertama kali membuat objek VolumeSnapshotClass. Objek
tidak dapat diubah setelah dibuat.

Admin dapat mengatur VolumeSnapshotClass _default_ untuk VolumeSnapshot yang tidak
memiliki spesifikasi kelas apapun.

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
snapshotter: csi-hostpath
parameters:
```

### `snapshotter`

VolumeSnapshotClass memiliki sebuah `snapshotter` yang menentukan plugin volume CSI
apa yang digunakan untuk penyediaan VolumeSnapshot. _Field_ ini wajib diatur.

### `parameters`

VolumeSnapshotClass memiliki parameter-parameter yang menggambarkan _snapshot_ volume
di dalam VolumeSnapshotClass. Parameter-parameter yang berbeda diperbolehkan tergantung
dari `shapshotter`.

{{% /capture %}}
