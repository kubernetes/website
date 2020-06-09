---
title: HorizontalPodAutoscaler
feature:
  title: Horizontal scaling
  description: >
    Scale your application up and down with a simple command, with a UI, or automatically based on CPU usage.

content_template: templates/concept
weight: 90
---

{{% capture overview %}}

HorizontalPodAutoscaler secara otomatis akan men-*scale* jumlah *pod* didalam kontroler replikasi, *deployment*, 
*replica set* ataupun *stateful* berdasarkan hasil observasi penggunaan CPU(atau, dengan 
[*costum* metrik](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md), pada beberapa aplikasi yang menyediakan metrik). 
Perlu dicatat bahwa Horizontal Pod Autoscaling tidak dapat diterapkan pada objek yang tidak dapat di-*scale*, seperti DeamonSets. 

HorizontalPodAutoscaler diimplementasikan sebagai Kubernetes API *resource* dan sebuah kontroller.
*Resource* tersebut akan menentukan perilaku dari kontrolernya.
Kontroler akan menyesuaikan jumlah replika pada kontroler replikasi atau pada *deployment* untuk menyesuaikan dengan hasil observasi rata-rata
penggunaan CPU sesuai dengan yang ditentukan oleh pengguna.

{{% /capture %}}


{{% capture body %}}

## Bagaimana cara kerja HorizontalPodAutoscaler?

![HorizontalPodAutoscaler diagram](/images/docs/horizontal-pod-autoscaler.svg)

HorizontalPodAutoscaler diimplementasikan sebagai sebuah *control loop*, yang secara
berkala dikontrol oleh *flag* `--horizontal-pod-autoscaler-sync-period` pada kontroler manajer
(dengan nilai standar yaitu 15 detik). 

Dalam setiap periode, kontroler manajer melakukan kueri penggunaan sumber daya dan membandingkan
dengan metrik yang dispesifikasikan pada HorizontalPodAutoscaler. Kontroler manajer mendapat
metrik dari *resource* metrik API (untuk metrik per *pod*) atau dari *custom* metrik API (untuk semua metrik lainnya).

During each period, the controller manager queries the resource utilization against the
metrics specified in each HorizontalPodAutoscaler definition.  The controller manager
obtains the metrics from either the resource metrics API (for per-pod resource metrics),
or the custom metrics API (for all other metrics).

* Untuk metrik per *pod* (seperti CPU), kontroler mengambil metrik dari *resource* metrik API
  untuk setiap *pod* yang ditargetkan oleh HorizontalPodAutoscaler. Kemudian, jika nilai target penggunaan ditentukan,
  maka kontroler akan menghitung nilai penggunaan sebagai persentasi dari pengguaan *resource* dari kontainer 
  pada masing-masing *pod*. Jika target *raw value* ditentukan, maka nilai *raw metric* akan digunakan
  secara langsung. Kontroller kemudian mengambil nilai rata-rata penggunaan atau *raw values* (tergantung
  dengan tipe target yang ditentukan) dari semua *pod* yang targetkan dan menghasilkan perbandingan yang
  digunakan untuk menentukan jumlah replika yang akan di-*scale*.

  Perlu dicatat bahwa jika beberapa kontainer pada pod tidak memiliki nilai *resource request*, penggunaan CPU
  pada pod tersebut tidak akan ditentukan dan *autoscaler* tidak akan melakukan tindakan apapun untuk metrik tersebut.
  Perhatikan pada bagian [detail algoritma](#algorithm-details) dibawah ini untuk informasi lebih lanjut mengenai
  cara kerja algorihma *autoscale*.

* Untuk *custom* metrik per *pod*, kontroler bekerja sama seperti *resource* metrik per *pod*,
  kecuali *pod* bekerja dengan *raw values*, bukan dengan *utilization values*.

* Untuk objek metrik dan eksternal metrik, sebuah metrik diambil, dimana metrik tersebut menggambarkan
  object tersebut. Metrik ini dibandingkan dengan nilai target untuk menghasilkan perbandingan seperti diatas.
  Pada API `autoscaling/v2beta2`, nilai perbandingan dapat secara opsional dibagi dengan jumlah *pod*
  sebelum perbandingan dibuat. 

Pada normalnya, HorizontalPodAutoscaler mengambil metrik dari serangkaian APIs yang sudah diagregat 
(`custom.metric.k8s.io`, dan `external.metrics.k8s.io`). API `metrics.k8s.io` biasanya disediakan oleh
*metric-server*, dimana *metric-server* dijalanjkan secara terpisah. Perhatian 
[*metrics-server*](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server) sebagai petunjuk.
HorizontalPodAutoscaler juga mengambil metrik dari Heapster secara langsung.

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.11" >}}
Fetching metrics from Heapster is deprecated as of Kubernetes 1.11.
{{< /note >}}

Perhatikan [Support for metrics APIs](#support-for-metrics-apis) untuk lebih detail.

*Autoscaler* mengkases kontroler yang dapat di-*scale* (seperti kontroler replikasi, *deployment*, dan *replica sets*)
dengan menggunakan *scale sub-resource*. Untuk lebih detail mengenai *scale sub-resource* dapat ditemukan 
[disini](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).

### Detail Algoritma

Dari sudut pandang paling sederhana, kontroler HorizontalPodAutoscaler mengoperasikan
perbandingan metrik yang diinginkan dengan kedaan metrik sekarang.

```
jumlahReplikaYangDiinginkan = pembulatanKeatas[jumlahReplikaSekarang * ( nilaiMetrikSekarang / nilaiMetrikYangDinginkan )]
```

Sebagai contoh, jika nilai metrik sekarang adalah `200m` dan nilai metrik yang
diinginkan adalah `100m`, jumlah replika akan ditambah dua kali lipat, 
karena `200.0 / 100.0 == 2.0`. Jika nilai metrik sekarang adalah `50m`,
maka jumlah replika akan dikurangi setengah, karena `50.0 / 100.0 == 0.5`.
Kita tetap men-*sclae* jika nilai perbandingan mendekati 1.0 (dalam toleransi yang
dapat dikonfigurasi secata global, dari *flag* `--horizontal-pod-autoscaler-tolerance`
dengan nilai standar 0.1.

Ketika `nilaiTargetRatarata` atau `targetPenggunaanRatarata` ditentukan,
`nilaiMetrikSekarang` dihitung dengan mengambil rata-rata dari metrik dari
semua *pods* yang ditargetkan oleh HorizontalPodAutoscaler. Sebelum mengecek
toleransi dan menentukan nilai akhir, kita mengambil kesiaapn *pod* dan metrik
yang hilang sebagai pertimbangan. 

Semua *pods* yang memiliki waktu penghapusan(*pod* dalam proses penutupan)
dan semua *pods* yang *failed* akan dibuang.

Jika ada metrik yang hilang dari *pod*, maka *pod* akan dievaluasi nanti.
*Pod* dengan nilai metrik yang hilang akan digunakan untuk menyesuikan
jumlah akhir *pod* yang akan di-*scale*.

Ketika CPU sedang *scale*, jika terdapat *pod* yang akan siap (dengan kata lain
*pod* tersebut sedang dalam tahap inisialisasi) *atau* metrik terakhir dari *pod*
adalah metrik sebelum *pod* dalam keadaan siap, maka *pod* tersebut juga
akan dievaluasi nanti.

Akibat keterbatasan teknis, kontroler HorizontalPodAutoscaler tidak dapat
menentukan dengan tepat kapan pertama kali *pod* akan dalam keadaan siap
ketika menentukan apakah menyisihkan metrik CPU tertentu. Sebaliknya,
HorizontalPodAutoscaler mempertimbangkan sebuah Pod "tidak dalam keadaan siap"
jika Pod tersebut dalam keadaan tidak siap dan dalam transisi ke status tidak
siap dalam waktu singkat, rentang waktu dapat dikonfigurasi, sejak Pod tersebut berjalan.
Rentang waktu tersebut dapat dikonfigurasi dengan *flag* `--horizontal-pod-autoscaler-initial-readiness-delay`
dan waktu standarnya adalah 30 detik. Ketika suatu Pod sudah dalam keadaan siap,
Pod tersebut mempertimbangkan untuk siap menjadi yang pertama jika itu terjadi dalam
waktu yang lebih lama, rentang waktu dapat di konfigurasi, sejak Pod tersebut berjalan.
Rentang waktu tersebut dapat dikonfigurasi dengan *flag* `--horizontal-pod-autoscaler-cpu-initialization-period`
dan nilai standarnya adalah 5 menit. 

Skala perbandingan dasar `nilaiMetrikSekarang / nilaiMetrikYangDinginkan`
dihitung menggunakan Pod yang tersisa yang belum disisihkan atau dibuang dari
kondisi diatas.

Jika terdapat metrik yang hilang, kita menghitung ulang rata-rata dengan lebih
konservatif, dengan asumsi *pods* menkonsumsi 100% dari nilai yang diharapkan
jika di *scale down* dan 0% jika di *scale up*. Ini akan mengurangi
besarnya kemungkinan untuk *scale*.

Selanjutnya, jika terdapat Pod dalam keadaan tidak siap, and kita akan
men-*scale up* tanpa memperhitungkan metrik yang hilang atau Pod yang tidak dalam
keadaan siap, kita secara konservatif mengasumsikan Pod yang tidak dalam keadaan siap
mengkonsumsi 0% dari metrik yang diharapkan, akhirnya mengurasi besarnya *scale up*.

Seteleh memperhitungkan Pod yang tidak dalam keadaan siap dan metrik yang hilang,
kite menghitung ulang menggunakan perbandingan. Jika perbandingan yang baru membalikkan
arah *scale*-nya atau masih didalam toleransi, kita akan tepat *scale*. Jika tidak,
kita menggunakan perbandingan yang baru untuk *scale*.


Perlu dicatat bahwa nilai *original* untuk rata-rata penggunaan dilaporkan kembali melalui
status HorizontalPodAutoscaler, tanpa memperhitungkan Pod yang tidak dalam keadaan siap atau
metrik yang hilag, bahkan ketika perbandingan yang baru digunakan.


Jika beberapa metrik ditentukan pada sebuah HorizontalPodAutoscaler, perhitungan
dilakukan untuk setiap metrik dan nilai replika terbesar yang diharapkan akan dipilih.
Jika terdapat metrik yang tidak dapat diubah menjadi jumlah replika yang diharapakan
(contohnya terdapat kesalahan ketika mengambil metrik dari API metrik) dan *scale down*
disarankan dari metrik yang dapat diambil, maka *scaling* akan diabaikan. Ini berarti 
HorizontalPodAutoscaler masih mampu untuk *scale up* jika satu atau lebih metrik
memberikan sebuah `jumlahReplikaYangDiinginkan` lebih besar dari nilai yang sekarang.

Pada akhirnya, sebelum HorizontalPodAutoscaler men-*scale* target, rekomendasi *scale* akan
dicatat. Kontroler mempertimbangkan semua rekomendasi dalam rentang waktu yang dapat
dikonfigurasi untuk memilih rekomendasi tertinggi. Nilai ini dapat dikonfigurasi menggunakan
*flag* `--horizontal-pod-autoscaler-downscale-stabilization`, dengan nilai standar
5 menit. Ini berarti *scale down* akan terjadi secara bertahapn, untuk mengurangi dampak dari
perubahan nilai metrik yang cepat. 

## Objek API

HorizontalPodAutoscaler adalah sebuah API dalam `autoscaling` group API Kubernetes.
Versi stabil, dimana hanya mendukung untuk *auto scale* CPU, dapat ditemukan di API versi
`autoscaling/v1`.

Versi *beta*, dimana mendukung untuk *scaling* merdasarkan memori dan metrik khusus,
dapat ditemukan pada `autoscaling/v2beta2`. *Field* yang baru diperkenalkan pada
`autoscaling/v2beta2` adalah *preserved* sebagai anotasi ketika menggunakan `autoscaling/v1`. 

Ketika kamu membuat sebuah HorizontalPodAutoscaler, pastikan nama yang ditentukan adalah valid
[nama subdomain DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
Untuk lebih detail tentang objek API ini dapat ditemukan di
[Objek HorizontalPodAutoscaler](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object).

## Dukungan untuk HorizontalPodAutoscaler pada kubectl

Seperti API *resource* lainnya, HorizontalPodAutoscaler didukung dengan standar oleh `kubectl`.
Kita dapat membuat *autoscaler* yang baru dengan menggunakan perintah `kubectl create`.
Kita dapat melihat daftar *autoscaler* dengan perintah `kubectl get hpa` dan melihat deskripsi
detailnnya dengan perintah `kubectl describe hpa`. Akhirnya, kita dapat menghapus *autoscaler*
meggunakan perintah `kubectl delete hpa`. 

Sebagai tambahan, terdapat sebuah perintah kusus `kubectl autoscaler` untuk mempermudah pembuatan
HorizontalPodAutoscaler. Sebagai contoh, mengeksekusi
`kubectl autoscaler rs foo --min=2 --max=5 --cpu-percent=80` akan membuat sebuah *autoscaler* untuk
ReplicaSet *foo*, dengan target pengguaan CPU `80%` dan jumlah replika antara 2 sampai dengan 5.
Dokumentasi lebih detail tentang `kubectl autoscaler` dapat ditemukan di 
[sini](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).

## Autoscaling ketika Rolling Update

Saat ini, dimungkinkan untuk melakukan *rolling update* menggunakan objek Deployment, dimana 
mengatur ReplicaSet untuk kamu. HorizontalPodAutoscaler hanya mendukung pendekatan terakhir:
HorizontalPodAutoscaler terikat dengan objek Deployment, yang mengatur besar dari objek Deployment,
dan Deployment bertugas untuk mengatur besar dari ReplicaSet.

HorizontalPodAutoscaler tidak bekerja dengan *rolling update* yang menggunakan manipulasi
pada kontroler replikasi secara langsung, dengan kata lain kamu tidak bisa mengikat
HorizontalPodAutoscaler dengan kontroler replikasi dan melakukan *rolling update*.
Alasan HorizontalPodAutoscaler tidak bekerja ketika *rolling update* membuat kontroller
replikasi yang baru adalah HorizontalPodAutoscaler tidak akan terikat dengan kontroler
replikasi yang baru tersebut.

## Dukungan untuk *Cooldown* / Penundaan

Ketika mengolah *scale* dari sebuah replika grup menggunakan HorizonalPodAutoscaler,
jumlah replika dimungkinkan tetap berubah secara sering disebabkan oleh perubahan dinamis
dari metrik yang dievaluasi. Hal ini sering disebut dengan *thrashing*. 

Mulai dari versi 1.6, operator klaster dapat mengatasi masalah ini dengan mengatur
setingan HorizontalPodAutoscaler global sebagai *flag* `kube-controller-manager.

Mulai dari versi 1.12, sebuah algoritma perbaharuan baru menghilankan kebutuhan terhadap
penundaan *upscale*.

- `--horizontal-pod-autoscaler-downscale-stabilization`: Nilai untuk opsi ini adalah
  sebuah durasi yang menentukan berapa lama *autoscaler* menunggu sebelum operasi
  *downscale* yang lain diklakukan seteleh operasi sekarang selesai. Nilai standarnya
  adalah 5 menit (`5m0s`).

{{< note >}}
Ketika mengubah nilai paramater ini, sebuah operator klaster akan sadar akan kemungkinan
konsekuensi. Jika waktu penundaan diset terlalu lama, kemungkinan akan membuat
HorizontalPodAutoscaler tidak responsif terharap perubahan beban kerja. Namun, jika
waktu penundaan diset terlalu cepat, kemungkinan replikasi akan *trashing* seperti
biasanya. 
{{< /note >}}

## Dukukan untuk Beberapa Metrik

Kubernetes versi 1.6 menambah dukungan untuk *scaling* berdasarkan beberapa metrik.
Kamu dapat menggunakan API versi `autoscaling/v2beta2` untuk menentukan beberapa metrik
yang akan digunakan HorizontalPodAutoscaler untuk *scale*. Kemudian, kontroler
HorizontalPodAutoscaler akan mengevaluasi setiap metrik dan menyarankan *scale* yang
baru berdasarkan metrik tersebut. Jumlah replika terbanyak akan digunakan untuk *scale*
yang baru.

## Dukungan untuk Metrik Khusus

{{< note >}}
Kubernetes versi 1.2 menambah dukungan *alpha* untuk melakukan *scaling* berdasarkan metrik
yang spesifik dengan aplikasi menggunakan anotasi khusus. Dukungan untuk anotasi ini
dihilangkan pada Kubernetes versi 1.6 untuk mendukung API *autoscaling* yang baru. Selama
cara lama untuk mendapatkan metrik khusus masih tersedia, metrok ini tidak akan tersedia untuk
digunakan oleh HorizontalPodAutoscaler dan anotasi sebelumnya untuk menentukan metrik khusus untuk
*scale* tidak lagi digunakan oleh kontroler HorizontalPodAutscaler.
{{< /note >}}

Kubernetes versi 1.6 menambah dukungan untuk menggunakan metrik khusu pada HorizontalPodAutoscaler.
Kamu dapat menambahkan metrik khusus untuk HorizontalPodAutoscaler pada API versi `autoscaling/v2beta2`.
Kubernetes kemudian memanggil API metrik khusu untuk mengambil nilai dari metrik khusus. 

Lihat [Dukungan untuk API metrik](#support-for-metrics-apis) untuk kubutuhannya.

## Dukungan untuk API metrik

Secara standar, kontroler HorizontalPodAutoscaler mengambil mentrik dari beberapa API. Untuk dapat
mengakses API ini, administrator klaster harus memastikan bahwa:

* [API Later Pengumpulan](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) diaktifkan.

* API berikut ini terdaftar:

    * Untuk metrik *resource*, ini adalah API `metrics.k8s.io`, pada umumnya disediakan oleh 
      [server metrik](https://github.com/kubernetes-incubator/metrics-server). API tersebut dapat
      diaktifkan sebagai *addon* di klaster. 

    * Untuk metrik khusus, ini adalah API `custom.metrics.k8s.io`. API ini disediakan oleh API
      adaptor server yang disedikaan oleh vendor yang memberi solusi untuk metrik. Cek dengan
      *pipeline* metrikmu atau [daftar solusi yang sudah diketahui](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api). Jika kamu ingin membuat sendiri, perhatikan
      [*boilerplate* berikut](https://github.com/kubernetes-incubator/custom-metrics-apiserver) untuk memulai.

    * Untuk metrik eksternal, ini adalah API `external.metrics.k8s.io`. API ini mungkin disediakan oleh penyedia
      metrik khusus diatas.

* Nilai dari `--horizontal-pod-autoscaler-use-rest-clients` adalah `true` atau tidak ada. Ubah nilai tersebut menjadi
  `false` untuk mengubah ke *Heapster-based autoscaling*, dimana ini sudah tidak didukung lagi.

Untuk informasi lebih lanjut mengenai metrik-metrik ini dan bagaimana perbedaan setiap metrik, perhatikan proposal
desain untuk [HPA V2](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md)
dan [external.metrics.k8s.io](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/external-metrics-api.md).

Untuk contoh bagaimana menggunakan metrik-metrik ini, perhatikan [panduan penggunaan metrik khusus](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
dan [panduan penggunaan metrik eksternal](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects).

## Dukungan untuk Perilaku *Scaling* yang dapat Dikonfigurasi

Mulai dari versi [v1.18](https://github.com/kubernetes/enhancements/blob/master/keps/sig-autoscaling/20190307-configurable-scale-velocity-for-hpa.md), API `v2beta2` mengizinkan perilaku *scaling* dapat
dikonfigurasi melalui *field* `behavior` pada HorizontalPodAutoscaler. Perilaku *scaling up* dan *scaling down*
ditentukan terpisah pada *field* `slaceUp` dan *field* `scaleDown`, dibawah dari *field* `behavior`.
Sebuah stabilisator dapat ditentukan untuk kedua arah *scale* untuk mencegah perubahan replika yang terlalu
berbeda pada target *scaling*. Menentukan *scaling policies* akan mengkontrol perubahan replika
ketika *scaling*.

### Scaling Policies

Satu atau lebih *scaling policies* dapat ditentukan pada *field* `behavior`. Ketika beberapa
*policies* ditentukan, *policy* yang mengizinkan *scale* terbesar akan dipilih secara *default*.
Contoh berikut menunjukkan perilaku ketika *scaling down*:

```yaml
behavior:
  scaleDown:
    policies:
    - type: Pods
      value: 4
      periodSeconds: 60
    - type: Percent
      value: 10
      periodSeconds: 60
```

Ketika jumlah *pod* lebih besar dari 40, *policy* kedua akan digunakan untuk *scaling down*.
Misalnya, jika terdapat 80 replika dan target sudah di *scale down* ke 10 replika, 8 replika
akan dikurangi pada tahapan pertama. Pada iterasi berikutnya, ketika jumlah replika adalah 72,
10% dari *pod* adalah 7.2 tetapi akan dibulatkan menjadi 8. Dalam setiap iterasi pada kontroler
*autoscaler* jumlah *pod* yang akan diubah akan dihitung ulang berdarkan jumlah replika sekarang.
Ketika jumlah replika dibawah 40, *policy* pertama (Pods) akan digunakan dan 4 replika akan dikurangi
dalam satu waktu.

`periodSeconds` menunjukkan berapa lama waktu pada iterasi terkhir untuk menunjukkan *policy*
mana yang akan digunakan. *Policy* pertama mengizinkan maksimal 4 replika di *scale down*
dalam satu menit. *Policy* kedua mengixinkan maksimal 10% dari total replika sekarang di
*scale down* dalam satu menit.

Pemilihan *policy* dapat diubah dengan menentukannya pada *field* `selectPolicy` untuk sebuah
arah *scale* (baik *scale up* ataupun *scale down*). Dengan menentukan nilai `Min`, 
HorizontalPodAutoscaler akan memilih *policy* yang mengizinkan pergantian replika paling sedikit.
Dengan menuntukan nilai `Disable`, akan menghentikan *scaling* pada arah *scale* tersebut.

### Jendela Stabilisasi

Jendela stabilisasi digunakan untuk membatasi perubahan replika yang terlalu drastis ketika
metrik yang digunakan untuk *scaling* tetap berubah-ubah. Jendela stabilisasi digunakan oleh
algoritma *autoscaling* untuk memperhitungkan jumlah replika yang diharapkan dari *scaling*
sebelumnya untuk mencengah *scaling. Berikut adalah contoh penggunaan jendela stabilisasi
pada `scaleDown`.

```yaml
scaleDown:
  stabilizationWindowSeconds: 300
```

Ketika metrik menandakan bahwa target akan di *scale down*, algoritma akan memperhatikan
jumlah replika yang diharapkan sebelumnya dan menggunakan nilai terbesar dari interval
yang ditentukan. Pada contoh diatas, semua jumlah replika yang diharapkan pada 5 menit
yang lalu akan dipertimbangkan.

### Perilaku Standar

Untuk menggunakan *scaling* khusus, tidak semua *field* perlu ditentukan. Hanta nilai yang
perlu diubah saja yang ditentukan. Nilai khusus ini akan digabungkan dengan nilai standar.
Berikut adalah nilai standar perilaku pada algoritma yang digunakan HorizontalPodAutoscaler.

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
  scaleUp:
    stabilizationWindowSeconds: 0
    policies:
    - type: Percent
      value: 100
      periodSeconds: 15
    - type: Pods
      value: 4
      periodSeconds: 15
    selectPolicy: Max
```

Untuk `scaleDown`, nilai dari jendela stabilisasi adalah 300 detik (atau nilai dari
*flag* `--horizontal-pod-autoscaler-downscale-stabilization` jika ditentukan). Hanya terdapat
satu *policy*, yaitu mengizinkan menghapus 100% dari replika yang berjalan,
artinya target replikasi di *scale* ke jumlah replika minimum. Untuk `scaleUp`, tidak terdapat
jendela stabilisasi. Jika metrik menunjukkan bahwa target perlu di *scale up*, maka akan di
*scale up* secara langsung. Untuk `scaleUp` terdapat dua *policy*, yaitu empat *pod* atau 100% dari
replika yang berjalan akan ditambahkan setiap 15 detik sampai HorizontalPodAutoscaler
dalam keadaan stabil.

### Contoh: Mengubah Jendela Stabiliasi pada *field* scaleDown

Untuk membuat jendela stabilisai untuk *downscale* selama satu menit, perilaku
berikut ditambahkan pada HorizontalPodAutoscaler.

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 60
```

### Contoh: Membatasi nilai *scale down*

Untuk membatasi total berapa *pod* yang akan dihapus, 10% setiap menut, perilaku
berikut ditambahkan pada HorizontalPodAutoscaler.

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
```

Untuk mengizinkan penghapusan 5 *pod* terakhir, *policy* lain dapat ditambahkan.

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
    - type: Pods
      value: 5
      periodSeconds: 60
    selectPolicy: Max
```

### Contoh: menonakfitkan *scale down*

Nilai `Disable` pada `selectPolicy` akan menonaktifkan *scaling* pada arah yang
ditentukan. Untuk mencegah *scaling down* dapat menggunakan *policy* berikut.

```yaml
behavior:
  scaleDown:
    selectPolicy: Disabled
```

{{% /capture %}}

{{% capture whatsnext %}}

* Dokumentasi desain [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* Perintah kubectl autoscale [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* Contoh penggunaan [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).

{{% /capture %}}
