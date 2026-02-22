---
title: Pengklonaan Volume CSI
content_type: concept
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="beta" >}}
Dokumen ini mendeskripsikan konsep pengklonaan Volume CSI yang telah tersedia di dalam Kubernetes. Pengetahuan tentang [Volume](/id/docs/concepts/storage/volumes) disarankan.



<!-- body -->

## Introduction

Fitur {{< glossary_tooltip text="CSI" term_id="csi" >}} Volume Cloning menambahkan dukungan untuk merinci {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}} yang telah tersedia pada kolom `dataSource` untuk mengindikasikan bahwa seorang pengguna ingin melakukan pengklonaan terhadap sebuah {{< glossary_tooltip term_id="volume" >}}.

Sebuah klona didefinisikan sebagai sebuah duplikat dari sebuah Volume Kubernetes yang telah tersedia yang dapat digunakan sebagai sebuah Volume standar. Perbedaannya hanyalah pada saat penyediaannya, daripada membuat sebuah Volume kosong yang "baru", peranti penyokongnya membuat sebuah duplikat sama persis dari Volume yang dirinci.

Implementasi dari pengklonaan, dari sudut pandang API Kubernetes, secara sederhana menambahkan kemampuan untuk merinci sebuah PVC yang telah tersedia sebagai sebuah dataSource saat pembuatan PVC. PVC sumber harus tertambat (_bound_) dan tersedia (tidak sedang digunakan).

Pengguna-pengguna mesti menyadari hal-hal berikut saat menggunakan fitur ini:

* Dukungan pengklonaan (`VolumePVCDataSource`) hanya tersedia untuk _driver-driver_ CSI.
* Dukungan pengklonaan hanya tersedia untuk penyedia-penyedia dinamis.
* _Driver-driver_ CSI mungkin telah atau belum mengimplementasi fungsi pengklonaan Volume. 
* Kamu hanya dapat mengklonakan sebuah PVC saat ia tersedia pada Namespace yang sama dengan PVC tujuan (sumber dan tujuan harus berada pada Namespace yang sama).
* Pengklonaan hanya didukung pada Storage Class yang sama.
    - Volume tujuan harus memiliki Storage Class yang sama dengan sumbernya.
    - Storage Class bawaan dapat digunakan dan `storageClassName` dihilangkan dari `spec`

## Penyediaan

Klona-klona disediakan sama seperti PVC lainnya dengan pengecualian dengan penambahan sebuah `dataSource` yang merujuk pada sebuah PVC yang telah tersedia pada Namespace yang sama.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: clone-of-pvc-1
    namespace: myns
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: cloning
  resources:
    requests:
      storage: 5Gi
  dataSource:
    kind: PersistentVolumeClaim
    name: pvc-1
```

Hasilnya adalah sebuah PVC baru dengan nama `clone-of-pvc-1` yang memiliki isi yang sama dengan sumber yang dirinci `pvc-1`.

## Penggunaan

Setelah tersedianya PVC baru tersebut, PVC baru yang diklonakan tersebut digunakan sama seperti PVC lainnya. Juga diharapkan pada titik ini bahwa PVC baru tersebut adalah sebuah objek terpisah yang independen. Ia dapat digunakan, diklonakan, di-_snapshot_, atau dihapus secara terpisah dan tanpa perlu memikirkan PVC dataSource aslinya. Hal ini juga berarti bahwa sumber tidak terikat sama sekali dengan klona yang baru dibuat tersebut, dan dapat diubah atau dihapus tanpa memengaruhi klona yang baru dibuat tersebut.


