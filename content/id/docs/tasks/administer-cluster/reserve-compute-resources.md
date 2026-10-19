---
title: Melakukan Reservasi Sumber Daya Komputasi untuk Daemon Sistem
content_type: task
min-kubernetes-server-version: 1.8
---

<!-- overview -->

Node Kubernetes dapat dijadwalkan sesuai dengan kapasitas. Secara bawaan, Pod dapat menggunakan
semua kapasitas yang tersedia pada sebuah Node. Ini merupakan masalah karena Node
sebenarnya menjalankan beberapa _daemon_ sistem yang diperlukan oleh OS dan Kubernetes itu sendiri.
Jika sumber daya pada Node tidak direservasi untuk _daemon-daemon_ tersebut, maka
Pod dan _daemon_ akan berlomba-lomba menggunakan sumber daya yang tersedia, sehingga
menyebabkan _starvation_ sumber daya pada Node.

Fitur bernama `Allocatable` pada Node diekspos oleh kubelet yang berfungsi untuk melakukan
reservasi sumber daya komputasi untuk _daemon_ sistem. Kubernetes merekomendasikan admin
klaster untuk mengatur `Allocatable` pada Node berdasarkan tingkat kepadatan (_density_) beban kerja setiap Node.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
Kamu harus menjalankan Kubernetes server dengan versi 1.17 atau yang lebih baru
untuk menggunakan perintah baris kubelet dengan opsi `--reserved-cpus` untuk
menyetel [daftar reservasi CPU secara eksplisit](#melakukan-reservasi-daftar-cpu-secara-eksplisit).



<!-- steps -->

## _Allocatable_ pada Node

```text
       Kapasitas Node
------------------------------
|       kube-reserved        |
|----------------------------|
|      system-reserved       |
|----------------------------|
|     eviction-threshold     |
|     (batas pengusiran)     |
|----------------------------|
|                            |
|        allocatable         |
| (dapat digunakan oleh Pod) |
|                            |
|                            |
------------------------------
```

`Allocatable` atau sumber daya yang dialokasikan pada sebuah Node Kubernetes merupakan
jumlah sumber daya komputasi yang dapat digunakan oleh Pod. Penjadwal tidak
dapat melakukan penjadwalan melebihi `Allocatable`. Saat ini dukungan terhadap
`CPU`, `memory` dan `ephemeral-storage` tersedia.

`Allocatable` pada Node diekspos oleh objek API `v1.Node` dan merupakan
bagian dari baris perintah `kubectl describe node`.

Sumber daya dapat direservasi untuk dua kategori _daemon_ sistem melalui kubelet.

### Mengaktifkan QoS dan tingkatan cgroup dari Pod

Untuk menerapkan batasan `Allocatable` pada Node, kamu harus mengaktifkan
hierarki cgroup yang baru melalui _flag_ `--cgroups-per-qos`. Secara bawaan, _flag_ ini
telah aktif. Saat aktif, kubelet akan memasukkan semua Pod pengguna di bawah
sebuah hierarki cgroup yang dikelola oleh kubelet.

### Mengonfigurasi _driver_ cgroup

Manipulasi terhadap hierarki cgroup pada hos melalui _driver_ cgroup didukung oleh kubelet.
_Driver_ dikonfigurasi melalui _flag_ `--cgroup-driver`.

Nilai yang didukung adalah sebagai berikut:

* `cgroupfs` merupakan _driver_ bawaan yang melakukan manipulasi secara langsung
terhadap _filesystem_ cgroup pada hos untuk mengelola _sandbox_ cgroup.
* `systemd` merupakan _driver_ alternatif yang mengelola _sandbox_ cgroup menggunakan
bagian dari sumber daya yang didukung oleh sistem _init_ yang digunakan.

Tergantung dari konfigurasi _runtime_ Container yang digunakan,
operator dapat memilih _driver_ cgroup tertentu untuk memastikan perilaku sistem yang tepat.
Misalnya, jika operator menggunakan _driver_ cgroup `systemd` yang disediakan oleh
_runtime_ docker, maka kubelet harus diatur untuk menggunakan _driver_ cgroup `systemd`.

### Kube Reserved

- **_Flag_ Kubelet**: `--kube-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=1Gi][,][pid=1000]`
- **_Flag_ Kubelet**: `--kube-reserved-cgroup=`

`kube-reserved` berfungsi untuk mengambil informasi sumber daya reservasi
untuk _daemon_ sistem Kubernetes, seperti kubelet, _runtime_ Container, detektor masalah pada Node, dsb.
`kube-reserved` tidak berfungsi untuk mereservasi sumber daya untuk _daemon_ sistem yang berjalan
sebagai Pod. `kube-reserved`  merupakan fungsi dari kepadatan Pod pada Node.

Selain dari `cpu`, `memory`, dan `ephemeral-storage`,`pid` juga dapat
diatur untuk mereservasi jumlah ID proses untuk _daemon_ sistem Kubernetes.

Secara opsional, kamu dapat memaksa _daemon_ sistem melalui setelan `kube-reserved`.
Ini dilakukan dengan menspesifikasikan _parent_ cgroup sebagai nilai dari _flag_ `--kube-reserved-cgroup` pada kubelet.

Kami merekomendasikan _daemon_ sistem Kubernetes untuk ditempatkan pada
tingkatan cgroup yang tertinggi (contohnya, `runtime.slice` pada mesin systemd).
Secara ideal, setiap _daemon_ sistem sebaiknya dijalankan pada _child_ cgroup
di bawah _parent_ ini. Lihat [dokumentasi](https://git.k8s.io/design-proposals-archive/node/node-allocatable.md#recommended-cgroups-setup)
untuk mengetahui rekomendasi hierarki cgroup secara detail.

Catatan: kubelet **tidak membuat** `--kube-reserved-cgroup` jika cgroup
yang diberikan tidak ada pada sistem. Jika cgroup yang tidak valid diberikan,
maka kubelet akan mengalami kegagalan.

### System Reserved

- **_Flag_ Kubelet**: `--system-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=1Gi][,][pid=1000]`
- **_Flag_ Kubelet**: `--system-reserved-cgroup=`


`system-reserved` berfungsi untuk mengetahui reservasi sumber daya untuk
_daemon_ sistem pada OS, seperti `sshd`, `udev`, dan lainnya. `system-reserved` sebaiknya
mereservasi memori untuk kernel juga, karena memori kernel tidak termasuk dalam
hitungan kalkulasi Pod pada Kubernetes. Kami juga merekomendasikan reservasi sumber daya
untuk sesi (_session_) login pengguna (contohnya, `user.slice` di dalam dunia systemd).

### Melakukan Reservasi Daftar CPU secara Eksplisit
{{< feature-state for_k8s_version="v1.17" state="stable" >}}

- **_Flag_ Kubelet**: `--reserved-cpus=0-3`

`reserved-cpus` berfungsi untuk mendefinisikan [cpuset](https://www.kernel.org/doc/Documentation/cgroup-v1/cpusets.txt) secara eksplisit untuk
_daemon_ sistem OS dan _daemon_ sistem Kubernetes. `reserved-cpus` dimaksudkan untuk
sistem-sistem yang tidak mendefinisikan tingkatan cgroup tertinggi secara terpisah untuk
_daemon_ sistem OS dan _daemon_ sistem Kubernetes yang berkaitan dengan sumber daya cpuset.

Jika kubelet **tidak memiliki** `--system-reserved-cgroup` dan `--kube-reserved-cgroup`,
cpuset akan diberikan secara eksplisit oleh `reserved-cpus`, yang akan menimpa definisi
yang diberikan oleh opsi `--kube-reserved` dan `--system-reserved`.

Opsi ini dirancang secara spesifik untuk kasus-kasus Telco/NFV, di mana _interrupt_ atau _timer_
yang tidak terkontrol bisa memengaruhi performa dari beban kerja. Kamu dapat menggunakan
opsi untuk untuk mendefinisikan cpuset secara eksplisit untuk _daemon_ sistem/Kubernetes dan
_interrupt_/_timer_, sehingga CPU sisanya dalam sistem akan digunakan untuk beban kerja saja,
dengan dampak yang sedikit terhadap _interrupt_/_timer_ yang tidak terkontrol. Untuk
memindahkan _daemon_ sistem, _daemon_ Kubernetes serta _interrrupt_/_timer_ Kubernetes supaya
menggunakan cpuset yang eksplisit didefinisikan oleh opsi ini, sebaiknya digunakan mekanisme lain di luar Kubernetes. Contohnya: pada Centos, kamu dapat melakukan ini dengan menggunakan
toolset yang sudah disetel.

### Batas Pengusiran (_Eviction Threshold_)

- **_Flag_ Kubelet**: `--eviction-hard=[memory.available<500Mi]`

Tekanan memori pada tingkatan Node menyebabkan sistem OOM (_Out Of Memory_) yang
berdampak pada Node secara keseluruhan dan semua Pod yang dijalankan di dalamnya. 
Node dapat berubah menjadi _offline_ sementara sampai memori berhasil diklaim kembali.
Untuk menghindari sistem OOM, atau mengurangi kemungkinan terjadinya OOM, kubelet
menyediakan fungsi untuk pengelolaan saat [Kehabisan Sumber Daya (_Out of Resource_)](/docs/tasks/administer-cluster/out-of-resource/).
Pengusiran dapat dilakukan hanya untuk kasus kehabisan `memory` dan `ephemeral-storage`. Dengan mereservasi
sebagian memori melalui _flag_ `--eviction-hard`, kubelet akan berusaha untuk "mengusir" (_evict_)
Pod ketika ketersediaan memori pada Node jatuh di bawah nilai yang telah direservasi.
Dalam bahasa sederhana, jika _daemon_ sistem tidak ada pada Node, maka Pod tidak dapat menggunakan
memori melebihi nilai yang ditentukan oleh _flag_ `--eviction-hard`. Karena alasan ini,
sumber daya yang direservasi untuk pengusiran tidak tersedia untuk Pod.

### Memaksakan _Allocatable_ pada Node

- **_Flag_ Kubelet**: `--enforce-node-allocatable=pods[,][system-reserved][,][kube-reserved]`

Penjadwal menganggap `Allocatable` sebagai kapasitas yang tersedia untuk digunakan oleh Pod.

Secara bawaan, kubelet memaksakan `Allocatable` untuk semua Pod. Pemaksaan dilakukan
dengan cara "mengusir" Pod-Pod ketika penggunaan sumber daya Pod secara keseluruhan telah
melewati nilai `Allocatable`. Lihat [bagian ini](/docs/tasks/administer-cluster/out-of-resource/#eviction-policy)
untuk mengetahui kebijakan pengusiran secara detail. Pemaksaan ini dikendalikan dengan
cara memberikan nilai Pod melalui _flag_ `--enforce-node-allocatable` pada kubelet.

Secara opsional, kubelet dapat diatur untuk memaksakan `kube-reserved` dan
`system-reserved` dengan memberikan nilai melalui _flag_ tersebut. Sebagai catatan,
jika kamu mengatur `kube-reserved`, maka kamu juga harus mengatur `--kube-reserved-cgroup`. Begitu pula
jika kamu mengatur `system-reserved`, maka kamu juga harus mengatur `--system-reserved-cgroup`.

## Panduan Umum

_Daemon_ sistem dilayani mirip seperti Pod `Guaranteed` yang terjamin sumber dayanya.
_Daemon_ sistem dapat melakukan _burst_ di dalam jangkauan cgroup. Perilaku ini
dikelola sebagai bagian dari penggelaran (_deployment_) Kubernetes. Sebagai contoh,
kubelet harus memiliki cgroup sendiri dan membagikan sumber daya `kube-reserved` dengan
_runtime_ Container. Namun begitu, kubelet tidak dapat melakukan _burst_ dan menggunakan
semua sumber daya yang tersedia pada Node jika `kube-reserved` telah dipaksakan pada sistem.

Kamu harus berhati-hati ekstra ketika memaksakan reservasi `system-reserved` karena dapat
menyebabkan layanan sistem yang terpenting mengalami CPU _starvation_, OOM _killed_, atau tidak
dapat melakukan _fork_ pada Node. Kami menyarankan untuk memaksakan `system-reserved` hanya
jika pengguna telah melakukan _profiling_ sebaik mungkin pada Node mereka untuk
mendapatkan estimasi yang akurat dan percaya diri terhadap kemampuan mereka untuk
memulihkan sistem ketika ada grup yang terkena OOM _killed_.

* Untuk memulai, paksakan `Allocatable` pada Pod.
* Ketika _monitoring_ dan _alerting_ telah cukup dilakukan untuk memonitor _daemon_
dari sistem Kubernetes, usahakan untuk memaksakan `kube-reserved` berdasarkan penggunakan heuristik.
* Jika benar-benar diperlukan, paksakan `system-reserved` secara bertahap.

Sumber daya yang diperlukan oleh _daemon_ sistem Kubernetes dapat tumbuh seiring waktu dengan
adanya penambahan fitur-fitur baru. Proyek Kubernetes akan berusaha untuk menurunkan penggunaan sumber daya
dari _daemon_ sistem Node, tetapi belum menjadi prioritas untuk saat ini.
Kamu dapat berekspektasi bahwa fitur kapasitas `Allocatable` ini akan dihapus pada versi yang akan datang.



<!-- discussion -->

## Contoh Skenario

Berikut ini merupakan contoh yang menggambarkan komputasi `Allocatable` pada Node:

* Node memiliki 16 CPU, memori sebesar 32Gi, dan penyimpanan sebesar 100Gi.
* `--kube-reserved` diatur menjadi `cpu=1,memory=2Gi,ephemeral-storage=1Gi`
* `--system-reserved` diatur menjadi `cpu=500m,memory=1Gi,ephemeral-storage=1Gi`
* `--eviction-hard` diatur menjadi `memory.available<500Mi,nodefs.available<10%`

Dalam skenario ini, `Allocatable` akan menjadi 14.5 CPU, memori 28.5Gi, dan penyimpanan
lokal 88Gi.
Penjadwal memastikan bahwa semua Pod yang berjalan pada Node ini secara total tidak meminta memori melebihi
28.5Gi dan tidak menggunakan penyimpanan lokal melebihi 88Gi.
Pengusiran Pod akan dilakukan kubelet ketika penggunaan memori keseluruhan oleh Pod telah melebihi 28.5Gi,
atau jika penggunaan penyimpanan keseluruhan telah melebihi 88Gi. Jika semua proses pada Node mengonsumsi
CPU sebanyak-banyaknya, Pod-Pod tidak dapat mengonsumsi lebih dari 14.5 CPU.

Jika `kube-reserved` dan/atau `system-reserved` tidak dipaksakan dan _daemon_ sistem
melebihi reservasi mereka, maka kubelet akan mengusir Pod ketika penggunaan memori pada Node
melebihi 31.5Gi atau penggunaan penyimpanan melebihi 90Gi.
