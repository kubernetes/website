---
title: VolumeSnapshot
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}
Laman ini menjelaskan tentang fitur VolumeSnapshot pada Kubernetes. Sebelum lanjut membaca, sangat disarankan untuk memahami [PersistentVolume](/id/docs/concepts/storage/persistent-volumes/) terlebih dahulu.




<!-- body -->

## Pengenalan

Seperti halnya sumber daya API PersistentVolume dan PersistentVolumeClaim yang digunakan oleh para pengguna dan administrator untuk menyediakan volume, sumber daya API VolumeSnapshotContent dan VolumeSnapshot digunakan mereka untuk membuat _snapshot_ volume.

VolumeSnapshotContent merupakan suatu _snapshot_ yang diambil dari sebuah volume dari dalam klaster yang telah disediakan oleh administrator. Sepert layaknya PersistentVolume, VolumeSnapshotContent juga merupakan bagian dari sumber daya klaster.

VolumeSnapshot merupakan suatu permintaan _snapshot_ dari volume oleh pengguna. Mirip seperti halnya PersistentVolumeClaim.

Walaupun VolumeSnapshot membuat pengguna bisa mengonsumsi abstraksi dari sumber daya penyimpanan, administrator klaster tetap perlu
menawarkan berbagai macam tipe VolumeSnapshotContent, tanpa perlu mengekspos pengguna pada detail bagaimana _snapshot_
volume tersebut harus tersediakan. Bagi yang memerlukan hal ini, ada yang namanya sumber daya VolumeSnapshotClass.

Para pengguna tetap perlu mengetahui beberapa hal di bawah ketika menggunakan fitur ini:

* Objek API VolumeSnapshot, VolumeSnapshotContent, dan VolumeSnapshotClass adalah CRD, bukan bagian dari API inti.
* Fitur VolumeSnapshot hanya tersedia untuk CSI _driver_.
* Sebagai bagian dari proses _deploy_, tim Kubernetes menyediakan Container _sidecar_ bantuan untuk _controller snapshot_ berrnama `external-snapshotter`. Container ini melakukan _watch_ pada objek VolumeSnapshot dan memicu operasi CreateSnapshot dan DeleteSnapshot terhadap sebuah _endpoint_ CSI.
* _Driver_ CSI ada yang telah implementasi fitur VolumeSnapshot, ada juga yang belum. _Driver_ CSI yang telah menyediakan dukungan terhadap fitur VolumeSnapshot kemungkinan besar menggunakan `external-snapshotter`.
* _Driver_ CSI yang mendukung VolumeSnapshot akan secara otomatis melakukan instalasi CRD untuk VolumeSnapshot.

## Siklus hidup VolumeSnapshot dan VolumeSnapshotContent

VolumeSnapshotContent merupakan bagian dari sumber daya klaster. VolumeSnapshot merupakan permintaan terhadap sumber daya tersebut. Interaksi antara VolumeSnapshotContent dan VolumeSnapshot mengikuti siklus hidup berikut ini:

### Penyediaan VolumeSnapshot

Ada dua cara untuk menyediakan _snapshot_: secara statis maupun dinamis.

#### Statis
Seorang administrator klaster membuat beberapa VolumeSnapshotContent, yang masing-masing memiliki detail tentang penyimpanan sebenarnya yang dapat dipergunakan oleh para pengguna. VolumeSnapshotContent tersebut dapat dikonsumsi melalui API Kubernetes.

#### Dinamis
Ketika VolumeSnapshotContent yang dibuat oleh administrator tidak ada yang sesuai dengan VolumeSnapshot yang dibuat pengguna, klaster bisa saja
mencoba untuk menyediakan sebuah VolumeSnapshot secara dinamis, khususnya untuk objek VolumeSnapshot.
Proses penyediaan ini berdasarkan VolumeSnapshotClasses: VolumeSnapshot harus meminta sebuah [VolumeSnapshotClass](/id/docs/concepts/storage/volume-snapshot-classes/)
dan administrator harus membuat serta mengatur _class_ tersebut supaya penyediaan dinamis bisa terjadi.

### Ikatan (_Binding_)

Seorang pengguna akan membuat (atau telah membuat, dalam kasus penyediaan dinamis) sebuah VolumeSnapshot dengan ukuran penyimpanan yang diminta beserta mode akses tertentu. Suatu _loop_ kontrol melakukan _watch_ terhadap VolumeSnapshot baru, mencari VolumeSnapshotContent yang sesuai (jika memungkinkan), dan mengikat (_bind_) keduanya. Jika VolumeSnapshotContent secara dinamis disediakan untuk VolumeSnapshot yang baru,
_loop_ akan terus mengikat VolumeSnapshotContent dengan VolumeSnapshot. Ketika telah terikat (_bound_), VolumeSnapshot _bind_ bersifat eksklusif, terlepas dari bagaimana proses _bind_ dilakukan. Ikatan (_binding_) antara suatu VolumeSnapshot dengan VolumeSnapshotContent bersifat 1:1 _mapping_.

VolumeSnapshot akan tetap tidak terikat (_unbound_) tanpa ada batas waktu, jika VolumeSnapshotContent yang sesuai tidak ditemukan. VolumeSnapshot akan menjadi terikat (_bound_) ketika VolumeSnapshotContent yang sesuai menjadi ada.

### PersistentVolumeClaim dengan _in-Use Protection_

Tujuan dari objek PersistentVolumeClaim dengan fitur _in Use Protection_ adalah memastikan objek API PVC yang masih dalam penggunaan (_in-use_) tidak akan dihilangkan dari sistem (penghilangan akan menyebabkan hilangnya data).

Jika sebuah PVC sedang digunakan secara aktif oleh proses _snapshot_ yang digunakan sebagai sumbernya (_source_), artinya PVC sedang dalam penggunaan (_in-use_). Jika seorang pengguna menghapus suatu objek API PVC saat dalam penggunaan sebagai sumber _snapshot_, objek PVC tidak akan dihilangkan segera. Namun, penghapusan objek PVC akan ditunda sampai PVCC tidak lagi secara aktif digunakan oleh proses _snapshot_ manapun. Suatu PVC tidak lagi diguunakan sebagai suumber _snapshot_ ketika `ReadyToUse` dari `Status` _snapshot_ menjadi `true`.

### Penghapusan

Proses penghapusan akan menghilangkan objek VolumeSnapshot dari API Kubernetes, beserta aset penyimpanan terkait pada infrastruktur eksternal.

## VolumeSnapshotContent

Setiap VolumeSnapshotContent memiliki sebuah _spec_, yang merepresentasikan spesifikasi dari _snapshot_ volume tersebut.

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshotContent
metadata:
  name: new-snapshot-content-test
spec:
  snapshotClassName: csi-hostpath-snapclass
  source:
    name: pvc-test
    kind: PersistentVolumeClaim
  volumeSnapshotSource:
    csiVolumeSnapshotSource:
      creationTime:    1535478900692119403
      driver:          csi-hostpath
      restoreSize:     10Gi
      snapshotHandle:  7bdd0de3-aaeb-11e8-9aae-0242ac110002
```

### _Class_

Suatu VolumeSnapshotContent dapat memiliki suatu _class_, yang didapat dengan mengatur atribut
`snapshotClassName` dengan nama dari [VolumeSnapshotClass](/id/docs/concepts/storage/volume-snapshot-classes/).
VolumeSnapshotContent dari _class_ tertentu hanya dapat terikat (_bound_) dengan VolumeSnapshot yang
"meminta" _class_ tersebut. VolumeSnapshotContent tanpa `snapshotClassName` tidak memiliki _class_ dan hanya dapat
terikat (_bound_) dengan VolumeSnapshot yang "meminta" untuk tidak menggunakan _class_.

## VolumeSnapshot

Masing-masing VolumeSnapshot memiliki sebuah _spec_ dan status, yang merepresentasikan spesifikasi dan status dari _snapshot_ volume tersebut.

```yaml
apiVersion: snapshot.storage.k8s.io/v1alpha1
kind: VolumeSnapshot
metadata:
  name: new-snapshot-test
spec:
  snapshotClassName: csi-hostpath-snapclass
  source:
    name: pvc-test
    kind: PersistentVolumeClaim
```

### _Class_

Suatu VolumeSnapshot dapat meminta sebuah _class_ tertentu dengan mengatur nama dari
[VolumeSnapshotClass](/id/docs/concepts/storage/volume-snapshot-classes/)
menggunakan atribut `snapshotClassName`.
Hanya VolumeSnapshotContent dari _class_ yang diminta, memiliki `snapshotClassName` yang sama
dengan VolumeSnapshot, dapat terikat (_bound_) dengan VolumeSnapshot tersebut.

## Penyediaan (_Provisioning_) Volume dari _Snapshot_

Kamu dapat menyediakan sebuah volume baru, yang telah terisi dengan data dari suatu _snapshot_, dengan
menggunakan _field_ `dataSource` pada objek PersistentVolumeClaim.

Untuk detailnya bisa dilihat pada [VolumeSnapshot and Mengembalikan Volume dari _Snapshot_](/id/docs/concepts/storage/persistent-volumes/#volume-snapshot-and-restore-volume-from-snapshot-support).


