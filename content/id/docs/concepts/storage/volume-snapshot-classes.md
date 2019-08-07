---
title: Volume Snapshot Class
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

Seperti halnya StorageClass yang menyediakan cara untuk para admin mendefinisikan
"kelas" penyimpanan yang mereka tawarkan saat proses penyediaan sebuah volume, VolumeSnapshotClass
menyediakan cara untuk mendefinisikan "kelas" penyimpanan saat menyediakan _snapshot_ volume.

## Sumber Daya VolumeSnapshotClass

Masing-masing VolumeSnapshotClass terdiri dari _field_ `snapshotter` dan `parameters`,
yang digunakan saat sebuah VolumeSnapshot yang dimiliki kelas tersebut perlu untuk
disediakan secara dinamis.

Nama yang dimiliki suatu objek VolumeSnapshotClass sangatlah penting, karena digunakan
oleh pengguna saat meminta sebuah kelas tertentu. Admin dapat mengatur nama dan parameter
lainnya dari sebuah kelas saat pertama kali membuat objek VolumeSnapshotClass. Objek
tidak dapat diperbarui setelah dibuat.

Admin dapat mengatur VolumeSnapshotClass _default_ hanya untuk VolumeSnapshot yang tidak
meminta kelas apapun untuk dikaitkan.

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
snapshotter: csi-hostpath
parameters:
```

### _Snapshotter_

VolumeSnapshotClass memiliki sebuah _snapshotter_ yang menentukan volume CSI plugin
apa yang digunakan untuk penyediaan VolumeSnapshot. _Field_ ini wajib diatur.

## Parameter

VolumeSnapshotClass memiliki parameter-parameter yang menggambarkan _snapshot_ volume
di dalam VolumeSnapshotClass. Parameter-parameter yang berbeda diperbolehkan tergantung
dari `shapshotter`.

{{% /capture %}}
