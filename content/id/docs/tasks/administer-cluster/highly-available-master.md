---
title: Mengatur Control Plane Kubernetes dengan Ketersediaan Tinggi (High-Availability)
content_type: task
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

Kamu dapat mereplikasi _control plane_ Kubernetes dalam skrip `kube-up` atau `kube-down` untuk Google Compute Engine (GCE).
Dokumen ini menjelaskan cara menggunakan skrip kube-up/down untuk mengelola _control plane_ dengan ketersedian tinggi atau _high_availability_ (HA) dan bagaimana _control plane_ HA diimplementasikan untuk digunakan dalam GCE.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Memulai klaster yang kompatibel dengan HA

Untuk membuat klaster yang kompatibel dengan HA, kamu harus mengatur tanda ini pada skrip `kube-up`: 

* `MULTIZONE=true` - untuk mencegah penghapusan replika _control plane_ kubelet dari zona yang berbeda dengan zona bawaan server.
Ini diperlukan jika kamu ingin menjalankan replika _control plane_ pada zona berbeda, dimana hal ini disarankan.

* `ENABLE_ETCD_QUORUM_READ=true` - untuk memastikan bahwa pembacaan dari semua server API akan mengembalikan data terbaru.
Jika `true`, bacaan akan diarahkan ke replika pemimpin dari etcd.
Menetapkan nilai ini menjadi `true` bersifat opsional: pembacaan akan lebih dapat diandalkan tetapi juga akan menjadi lebih lambat.

Sebagai pilihan, kamu dapat menentukan zona GCE tempat dimana replika _control plane_ pertama akan dibuat.
Atur tanda berikut:

* `KUBE_GCE_ZONE=zone` - zona tempat di mana replika _control plane_ pertama akan berjalan.

Berikut ini contoh perintah untuk mengatur klaster yang kompatibel dengan HA pada zona GCE europe-west1-b:

```shell
MULTIZONE=true KUBE_GCE_ZONE=europe-west1-b  ENABLE_ETCD_QUORUM_READS=true ./cluster/kube-up.sh
```

Perhatikan bahwa perintah di atas digunakan untuk membuat klaster dengan sebuah _control plane_;
Namun, kamu bisa menambahkan replika _control plane_ baru ke klaster dengan perintah berikutnya.


## Menambahkan replika _control plane_ yang baru

Setelah kamu membuat klaster yang kompatibel dengan HA, kamu bisa menambahkan replika _control plane_ ke sana.
Kamu bisa menambahkan replika _control plane_ dengan menggunakan skrip `kube-up` dengan tanda berikut ini:

* `KUBE_REPLICATE_EXISTING_MASTER=true` - untuk membuat replika dari _control plane_ yang sudah ada.

* `KUBE_GCE_ZONE=zone` - zona di mana replika _control plane_ itu berjalan.
Region ini harus sama dengan region dari zona replika yang lain.

Kamu tidak perlu mengatur tanda `MULTIZONE` atau `ENABLE_ETCD_QUORUM_READS`,
karena tanda itu diturunkan pada saat kamu memulai klaster yang kompatible dengan HA.

Berikut ini contoh perintah untuk mereplikasi _control plane_ pada klaster sebelumnya yang kompatibel dengan HA:

```shell
KUBE_GCE_ZONE=europe-west1-c KUBE_REPLICATE_EXISTING_MASTER=true ./cluster/kube-up.sh
```

## Menghapus replika _control plane_

Kamu dapat menghapus replika _control plane_ dari klaster HA dengan menggunakan skrip `kube-down` dengan tanda berikut:

* `KUBE_DELETE_NODES=false` - untuk mencegah penghapusan kubelet.

* `KUBE_GCE_ZONE=zone` - zona di mana replika _control plane_ akan dihapus.

* `KUBE_REPLICA_NAME=replica_name` - (opsional) nama replika _control plane_ yang akan dihapus.
Jika kosong: replika mana saja dari zona yang diberikan akan dihapus.

Berikut ini contoh perintah untuk menghapus replika _control plane_ dari klaster HA yang sudah ada sebelumnya:

```shell
KUBE_DELETE_NODES=false KUBE_GCE_ZONE=europe-west1-c ./cluster/kube-down.sh
```

## Mengatasi replika _control plane_ yang gagal

Jika salah satu replika _control plane_ di klaster HA kamu gagal,
praktek terbaik adalah menghapus replika dari klaster kamu dan menambahkan replika baru pada zona yang sama.
Berikut ini contoh perintah yang menunjukkan proses tersebut:

1. Menghapus replika yang gagal:

```shell
KUBE_DELETE_NODES=false KUBE_GCE_ZONE=replica_zone KUBE_REPLICA_NAME=replica_name ./cluster/kube-down.sh
```

2. Menambahkan replika baru untuk menggantikan replika yang lama

```shell
KUBE_GCE_ZONE=replica-zone KUBE_REPLICATE_EXISTING_MASTER=true ./cluster/kube-up.sh
```

## Praktek terbaik untuk mereplikasi _control plane_ untuk klaster HA

* Usahakan untuk menempatkan replika _control plane_ pada zona yang berbeda. Pada saat terjadi kegagalan zona, semua _control plane_ yang ditempatkan dalam zona tersebut akan gagal pula.
Untuk bertahan dari kegagalan pada sebuah zona, tempatkan juga Node pada beberapa zona yang lain
(Lihatlah [multi-zona](/id/docs/setup/best-practices/multiple-zones/) untuk lebih detail).

* Jangan gunakan klaster dengan dua replika _control plane_. Konsensus pada klaster dengan dua replika membutuhkan kedua replika tersebut berjalan pada saat mengubah keadaan yang persisten.
Akibatnya, kedua replika tersebut diperlukan dan kegagalan salah satu replika mana pun mengubah klaster dalam status kegagalan mayoritas.
Dengan demikian klaster dengan dua replika lebih buruk, dalam hal HA, daripada klaster dengan replika tunggal.

* Ketika kamu menambahkan sebuah replika _control plane_, status klaster (etcd) disalin ke sebuah _instance_ baru.
Jika klaster itu besar, mungkin butuh waktu yang lama untuk menduplikasi keadaannya.
Operasi ini dapat dipercepat dengan memigrasi direktori data etcd, seperti yang dijelaskan [di sini](https://coreos.com/etcd/docs/latest/admin_guide.html#member-migration)
(Kami sedang mempertimbangkan untuk menambahkan dukungan untuk migrasi direktori data etcd di masa mendatang).



<!-- discussion -->

## Catatan implementasi

![ha-master-gce](/images/docs/ha-master-gce.png)

### Ikhtisar

Setiap replika _control plane_ akan menjalankan komponen berikut dalam mode berikut:

* _instance_ etcd: semua _instance_ akan dikelompokkan bersama menggunakan konsensus;

* server API : setiap server akan berbicara dengan lokal etcd - semua server API pada cluster akan tersedia;

* pengontrol (_controller_), penjadwal (_scheduler_), dan _scaler_ klaster automatis: akan menggunakan mekanisme sewa - dimana hanya satu _instance_ dari masing-masing mereka yang akan aktif dalam klaster;

* manajer tambahan (_add-on_): setiap manajer akan bekerja secara independen untuk mencoba menjaga tambahan dalam sinkronisasi.

Selain itu, akan ada penyeimbang beban (_load balancer_) di depan server API yang akan mengarahkan lalu lintas eksternal dan internal menuju mereka.


### Penyeimbang Beban

Saat memulai replika _control plane_ kedua, penyeimbang beban yang berisi dua replika akan dibuat
dan alamat IP dari replika pertama akan dipromosikan ke alamat IP penyeimbang beban.
Demikian pula, setelah penghapusan replika _control plane_ kedua yang dimulai dari paling akhir, penyeimbang beban akan dihapus dan alamat IP-nya akan diberikan ke replika terakhir yang ada.
Mohon perhatikan bahwa pembuatan dan penghapusan penyeimbang beban adalah operasi yang rumit dan mungkin perlu beberapa waktu (~20 menit) untuk dipropagasikan.


### Service _control plane_ & kubelet

Daripada sistem mencoba untuk menjaga daftar terbaru dari apiserver Kubernetes yang ada dalam Service Kubernetes,
sistem akan mengarahkan semua lalu lintas ke IP eksternal:

* dalam klaster dengan satu _control plane_, IP diarahkan ke _control plane_ tunggal.

* dalam klaster dengan multiple _control plane_, IP diarahkan ke penyeimbang beban yang ada di depan _control plane_.

Demikian pula, IP eksternal akan digunakan oleh kubelet untuk berkomunikasi dengan _control plane_.


### Sertifikat _control plane_

Kubernetes menghasilkan sertifikat TLS _control plane_ untuk IP publik eksternal dan IP lokal untuk setiap replika.
Tidak ada sertifikat untuk IP publik sementara (_ephemeral_) dari replika;
Untuk mengakses replika melalui IP publik sementara, kamu harus melewatkan verifikasi TLS.

### Pengklasteran etcd

Untuk mengizinkan pengelompokkan etcd, porta yang diperlukan untuk berkomunikasi antara _instance_ etcd akan dibuka (untuk komunikasi dalam klaster).
Untuk membuat penyebaran itu aman, komunikasi antara _instance_ etcd diotorisasi menggunakan SSL.

## Bacaan tambahan

[Dokumen desain - Penyebaran master HA automatis](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/ha_master.md)


