---
title: Konfigurasi Garbage Collection pada kubelet
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

*Garbage collection* merupakan fitur kubelet yang sangat bermanfaat, yang akan membersihkan *image-image* dan juga kontainer-kontainer 
yang tidak lagi digunakan. Kubelet akan melakukan *garbage collection* untuk kontainer setiap satu menit dan *garbage collection* untuk
*image* setiap lima menit.

Perangkat *garbage collection* eksternal tidak direkomendasikan karena perangkat tersebut berpotensi merusak perilaku kubelet dengan
menghilangkan kontainer-kontainer yang sebenarnya masih diperlukan.

{{% /capture %}}


{{% capture body %}}

## *Garbage Collection* untuk *Image*

Kubernetes mengelola *lifecycle* untuk seluruh *image* melalui *imageManager*, dengan bantuan cadvisor.

*Policy* untuk melakukan *garbage collection* memperhatikan dua hal: `HighThresholdPercent` dan `LowThresholdPercent`. 
Penggunaan disk yang melewati batas atas (*high threshold*) akan men-*trigger* *garbage collection*.
*Garbage collection* akan mulai menghapus dari *image-image* yang paling jarang digunakan (*least recently used*)
sampai menemui batas bawah (*low threshold*) kembali.

## *Garbage Collection* untuk Kontainer

*Policy* untuk melakukan *garbage collection* pada kontainer memperhatikan tiga variabel yang ditentukan oleh pengguna (*user-defined*).
`MinAge` merupakan umur minimal dimana suatu kontainer dapat terkena *garbage collection*.
`MaxPerPodContainer` merupakan jumlah maksimum yang diperbolehkan untuk setiap pod (UID, container name) *pair* memiliki 
kontainer-kontainer yang sudah mati (*dead containers*). `MaxContainers` merupakan jumlah maksimal total dari seluruh kontainer yang sudah mati.
Semua variabel ini dapat dinonaktifkan secara individual, dengan mengatur `MinAge` ke angka nol serta mengatur `MaxPerPodContainer` dan `MaxContainers`
ke angka di bawah nol.

Kubelet akan mengambil tindakan untuk kontainer-kontainer yang tidak dikenal, sudah dihapus, atau diluar batasan-batasan yang diatur 
sebelumnya melalui *flag*. Kontainer-kontainer yang paling lama (tertua) biasanya akan dihapus terlebih dahulu. `MaxPerPodContainer` dan `MaxContainer`
berpotensi mengalami konflik satu sama lain pada situasi saat menjaga jumlah maksimal kontainer per pod (`MaxPerPodContainer`) akan melebihi
jumlah kontainer mati (*dead containers*) yang diperbolehkan (`MaxContainers`). 
`MaxPerPodContainer` dapat diatur sedemikian rupa dalam situasi ini: Seburuk-buruhknya dengan melakukan *downgrade* `MaxPerPodContainer` ke angka 1
dan melakukan *evict* kontainer-kontainer yang paling lama. Selain itu, kontainer-kontainer milik Pod yang telah dihapus akan dihilangkan
saat umur mereka telah melebihi `MinAge`.

Kontainer-kontainer yang tidak dikelola oleh kubelet akan terbebas dari *garbage collection*.

## Konfigurasi Pengguna

Para pengguna dapat mengatur *threshold-threshold* untuk melakukan *tuning* pada *garbage collection image*
melalui *flag-flag* kubelet sebagai berikut:

1. `image-gc-high-threshold`, persentase dari penggunaan disk yang men-*trigger* proses *garbage collection* untuk *image*.
*Default*-nya adalah 85%.
2. `image-gc-low-threshold`, persentase dari penggunaan disk dimana *garbage collection* berusaha menghapus *image*.
*Default*-nya adalah 80%.

Kami juga memperbolehkan para pengguna untuk menyesuaikan *policy garbage collection* melalui
*flag-flag* kubelet sebagai berikut:

1. `minimum-container-ttl-duration`, umur minimal untuk setiap kontainer yang sudah selesai (*finished*) sebelum
terkena *garbage collection*. *Default*-nya adalah 0 menit, yang berarti setiap kontainer yang telah selesai akan
terkena *garbage collection*.
2. `maximum-dead-containers-per-container`, jumlah maksimal dari kontainer-kontainer lama yang diperbolehkan ada
secara global. *Default*-nya adalah -1, yang berarti tidak ada batasannya untuk global.

Kontainer-kontainer dapat berpotensi terkena *garbage collection* sebelum kegunaannya telah usang. Kontainer-kontainer
ini memliki log dan data lainnya yang bisa saja berguna saat *troubleshoot*. Sangat direkomendasikan untuk menetapkan
angka yang cukup besar pada `maximum-dead-containers-per-container`, untuk memperbolehkan paling tidak 1 kontainer mati
untuk dijaga (*retained*) per jumlah kontainer yang diharapkan. Angka yang lebih besar untuk `maximum-dead-containers`
juga direkomendasikan untuk alasan serupa.
Lihat [isu ini](https://github.com/kubernetes/kubernetes/issues/13287) untuk penjelasan lebih lanjut.


## *Deprecation*

Beberapa fitur *Garbage Collection* pada kubelet di laman ini akan digantikan oleh fitur *eviction* nantinya, termasuk:

| *Flag Existing* | *Flag* Baru | Alasan |
| ------------- | -------- | --------- |
| `--image-gc-high-threshold` | `--eviction-hard` atau `--eviction-soft` | sinyal *eviction* yang ada (*existing*) dapat men-*trigger* *garbage collection* |
| `--image-gc-low-threshold` | `--eviction-minimum-reclaim` | hal serupa dapat diperoleh dengan *eviction reclaim* |
| `--maximum-dead-containers` | | *deprecated* saat log yang telah usang tersimpan di luar konteks kontainer |
| `--maximum-dead-containers-per-container` | | *deprecated* saat log yang telah usang tersimpan di luar konteks kontainer |
| `--minimum-container-ttl-duration` | | *deprecated* saat log yang telah usang tersimpan di luar konteks kontainer |
| `--low-diskspace-threshold-mb` | `--eviction-hard` atau `eviction-soft` | *eviction* memberi generalisasi *threshold* disk untuk *resource-resource* lainnya |
| `--outofdisk-transition-frequency` | `--eviction-pressure-transition-period` | *eviction* memberi generalisasi transisi tekanan *disk* (*disk pressure*)untuk *resource-resource* lainnya | 

{{% /capture %}}

{{% capture whatsnext %}}

Lihat [Konfigurasi untuk Menangani Kehabisan *Resource*](/docs/tasks/administer-cluster/out-of-resource/) untuk penjelasan lebih lanjut.

{{% /capture %}}
