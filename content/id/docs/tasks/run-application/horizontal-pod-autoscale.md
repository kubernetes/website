---
title: HorizontalPodAutoscaler
feature:
  title: Horizontal scaling
  description: >
    Scale up dan scale down aplikasimu dengan sebuah perintah yang serderhana, dengan UI, atau otomatis bersadarkan penggunaan CPU.
content_type: concept
weight: 90
---

<!-- overview -->

HorizontalPodAutoscaler secara otomatis akan memperbanyak jumlah Pod di dalam ReplicationController, Deployment, 
ReplicaSet ataupun StatefulSet berdasarkan hasil observasi penggunaan CPU(atau, dengan 
[metrik khusus](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md), pada beberapa aplikasi yang menyediakan metrik). 
Perlu dicatat bahwa HorizontalPodAutoscale tidak dapat diterapkan pada objek yang tidak dapat diperbanyak, seperti DeamonSets. 

HorizontalPodAutoscaler diimplementasikan sebagai Kubernetes API *resource* dan sebuah _controller_.
*Resource* tersebut akan menentukan perilaku dari _controller_-nya.
Kontroler akan mengubah jumlah replika pada ReplicationController atau pada Deployment untuk menyesuaikan dengan hasil observasi rata-rata
penggunaan CPU sesuai dengan yang ditentukan oleh pengguna.




<!-- body -->

## Bagaimana cara kerja HorizontalPodAutoscaler?

![Diagram HorizontalPodAutoscaler](/images/docs/horizontal-pod-autoscaler.svg)

HorizontalPodAutoscaler diimplementasikan sebagai sebuah _loop_ kontrol, yang secara
berkala dikontrol oleh *flag* `--horizontal-pod-autoscaler-sync-period` pada _controller manager_
(dengan nilai bawaan 15 detik). 

Dalam setiap periode, _controller manager_ melakukan kueri penggunaan sumber daya dan membandingkan
dengan metrik yang dispesifikasikan pada HorizontalPodAutoscaler. _Controller manager_ mendapat
metrik dari sumber daya metrik API (untuk metrik per Pod) atau dari API metrik khusus (untuk semua metrik lainnya).

* Untuk metrik per Pod (seperti CPU), _controller_ mengambil metrik dari sumber daya metrik API
  untuk setiap Pod yang ditargetkan oleh HorizontalPodAutoscaler. Kemudian, jika nilai target penggunaan ditentukan,
  maka _controller_ akan menghitung nilai penggunaan sebagai persentasi dari pengguaan sumber daya dari Container
  pada masing-masing Pod. Jika target nilai mentah (*raw value*) ditentukan, maka nilai metrik mentah (*raw metric*)
  akan digunakan secara langsung. _Controller_ kemudian mengambil nilai rata-rata penggunaan atau nilai mentah (tergantung
  dengan tipe target yang ditentukan) dari semua Pod yang ditargetkan dan menghasilkan perbandingan yang
  digunakan untuk menentukan jumlah replika yang akan diperbanyak.

  Perlu dicatat bahwa jika beberapa Container pada Pod tidak memiliki nilai *resource request*, penggunaan CPU
  pada Pod tersebut tidak akan ditentukan dan *autoscaler* tidak akan melakukan tindakan apapun untuk metrik tersebut.
  Perhatikan pada bagian [detail algoritma](#detail-algoritma) di bawah ini untuk informasi lebih lanjut mengenai
  cara kerja algoritma *autoscale*.

* Untuk metrik khusus per Pod, _controller_ bekerja sama seperti sumber daya metrik per Pod,
  kecuali Pod bekerja dengan nilai mentah, bukan dengan nilai utilisasi (*utilization values*).

* Untuk objek metrik dan metrik eksternal, sebuah metrik diambil, dimana metrik tersebut menggambarkan
  objek tersebut. Metrik ini dibandingkan dengan nilai target untuk menghasilkan perbandingan seperti di atas.
  Pada API `autoscaling/v2beta2`, nilai perbandingan dapat secara opsional dibagi dengan jumlah Pod
  sebelum perbandingan dibuat. 

Pada normalnya, HorizontalPodAutoscaler mengambil metrik dari serangkaian API yang sudah diagregat 
(`custom.metric.k8s.io`, dan `external.metrics.k8s.io`). API `metrics.k8s.io` biasanya disediakan oleh
*metric-server*, dimana *metric-server* dijalankan secara terpisah. Perhatikan 
[*metrics-server*](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server) sebagai petunjuk.
HorizontalPodAutoscaler juga mengambil metrik dari Heapster secara langsung.

{{< note >}}
{{< feature-state state="deprecated" for_k8s_version="v1.11" >}}
Pengambian metrik dari Heapster tidak didukung lagi pada Kubernetes versi 1.11.
{{< /note >}}

Perhatikan [Dukungan untuk API metrik](#dukungan-untuk-api-metrik) untuk lebih detail.

*Autoscaler* mengkases _controller_ yang dapat diperbanyak (seperti ReplicationController, Deployment, dan ReplicaSet)
dengan menggunakan *scale sub-resource*. Untuk lebih detail mengenai *scale sub-resource* dapat ditemukan 
[di sini](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#scale-subresource).

### Detail Algoritma

Dari sudut pandang paling sederhana, _controller_ HorizontalPodAutoscaler mengoperasikan
perbandingan metrik yang diinginkan dengan kedaan metrik sekarang.

```
desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
```

Sebagai contoh, jika nilai metrik sekarang adalah `200m` dan nilai metrik yang
diinginkan adalah `100m`, jumlah replika akan ditambah dua kali lipat, 
karena `200.0 / 100.0 == 2.0`. Jika nilai metrik sekarang adalah `50m`,
maka jumlah replika akan dikurangi setengah, karena `50.0 / 100.0 == 0.5`.
Kita tetap memperbanyak replika (_scale_) jika nilai perbandingan mendekati 1.0 (dalam toleransi yang
dapat dikonfigurasi secata global, dari *flag* `--horizontal-pod-autoscaler-tolerance`
dengan nilai bawaan 0.1.

Ketika `targetAverageValue` (nilai target rata-rata) atau `targetAverageUtilization` 
(target penggunaan rata-rata) ditentukan, `currentMetricValue` (nilai metrik sekaraang) 
dihitung dengan mengambil rata-rata dari metrik dari semua Pod yang ditargetkan oleh
HorizontalPodAutoscaler. Sebelum mengecek toleransi dan menentukan nilai akhir, 
kita mengambil kesiapan Pod dan metrik yang hilang sebagai pertimbangan. 

Semua Pod yang memiliki waktu penghapusan (Pod dalam proses penutupan)
dan semua Pod yang mengalami kegagalan akan dibuang.

Jika ada metrik yang hilang dari Pod, maka Pod akan dievaluasi nanti.
Pod dengan nilai metrik yang hilang akan digunakan untuk menyesuaikan
jumlah akhir Pod yang akan diperbanyak atau dikurangi.

Ketika _scaling_ dilakukan karena CPU, jika terdapat Pod yang akan siap (dengan kata lain
Pod tersebut sedang dalam tahap inisialisasi) *atau* metrik terakhir dari Pod
adalah metrik sebelum Pod dalam keadaan siap, maka Pod tersebut juga
akan dievaluasi nantinya.

Akibat keterbatasan teknis, _controller_ HorizontalPodAutoscaler tidak dapat
menentukan dengan tepat kapan pertama kali Pod akan dalam keadaan siap
ketika menentukan apakah metrik CPU tertentu perlu dibuang. Sebaliknya,
HorizontalPodAutoscaler mempertimbangkan sebuah Pod "tidak dalam keadaan siap"
jika Pod tersebut dalam keadaan tidak siap dan dalam transisi ke status tidak
siap dalam waktu singkat, rentang waktu dapat dikonfigurasi, sejak Pod tersebut dijalankan.
Rentang waktu tersebut dapat dikonfigurasi dengan *flag* `--horizontal-pod-autoscaler-initial-readiness-delay`
dan waktu bawaannya adalah 30 detik. Ketika suatu Pod sudah dalam keadaan siap,
Pod tersebut mempertimbangkan untuk siap menjadi yang pertama jika itu terjadi dalam
waktu yang lebih lama, rentang waktu dapat dikonfigurasi, sejak Pod tersebut dijalankan.
Rentang waktu tersebut dapat dikonfigurasi dengan *flag* `--horizontal-pod-autoscaler-cpu-initialization-period`
dan nilai bawaannya adalah 5 menit. 

Skala perbandingan dasar `currentMetricValue / desiredMetricValue`
dihitung menggunakan Pod yang tersisa yang belum disisihkan atau dibuang dari
kondisi di atas.

Jika terdapat metrik yang hilang, kita menghitung ulang rata-rata dengan lebih
konservatif, dengan asumsi Pod mengkonsumsi 100% dari nilai yang diharapkan
jika jumlahnya dikurangi (*scale down*) dan 0% jika jumlahnya diperbanyak (*scale up*). 
Ini akan mengurangi besarnya kemungkinan untuk *scale*.

Selanjutnya, jika terdapat Pod dalam keadaan tidak siap, dan kita akan
memperbanyak replikas (*scale up*) tanpa memperhitungkan metrik yang hilang atau Pod yang tidak dalam
keadaan siap, kita secara konservatif mengasumsikan Pod yang tidak dalam keadaan siap
mengkonsumsi 0% dari metrik yang diharapkan, akhirnya meredam jumlah replika yang diperbanyak (*scale up*).

Seteleh memperhitungkan Pod yang tidak dalam keadaan siap dan metrik yang hilang,
kita menghitung ulang menggunakan perbandingan. Jika perbandingan yang baru membalikkan
arah *scale*-nya atau masih di dalam toleransi, kita akan melakukan *scale* dengan tepat. Jika tidak,
kita menggunakan perbandingan yang baru untuk memperbanyak atau mengurangi jumlah replika.

Perlu dicatat bahwa nilai asli untuk rata-rata penggunaan dilaporkan kembali melalui
status HorizontalPodAutoscaler, tanpa memperhitungkan Pod yang tidak dalam keadaan siap atau
metrik yang hilang, bahkan ketika perbandingan yang baru digunakan.

Jika beberapa metrik ditentukan pada sebuah HorizontalPodAutoscaler, perhitungan
dilakukan untuk setiap metrik dan nilai replika terbesar yang diharapkan akan dipilih.
Jika terdapat metrik yang tidak dapat diubah menjadi jumlah replika yang diharapkan
(contohnya terdapat kesalahan ketika mengambil metrik dari API metrik) dan pengurangan replika
disarankan dari metrik yang dapat diambil, maka *scaling* akan diabaikan. Ini berarti 
HorizontalPodAutoscaler masih mampu untuk memperbanyak replika jika satu atau lebih metrik
memberikan sebuah `desiredReplicas` lebih besar dari nilai yang sekarang.

Pada akhirnya, sebelum HorizontalPodAutoscaler memperbanyak target, rekomendasi *scaling* akan
dicatat. _Controller_ mempertimbangkan semua rekomendasi dalam rentang waktu yang dapat
dikonfigurasi untuk memilih rekomendasi tertinggi. Nilai ini dapat dikonfigurasi menggunakan
*flag* `--horizontal-pod-autoscaler-downscale-stabilization`, dengan nilai bawaan
5 menit. Ini berarti pengurangan replika akan terjadi secara bertahap, untuk mengurangi dampak dari
perubahan nilai metrik yang cepat. 

## Objek API

HorizontalPodAutoscaler adalah sebuah API dalam grup `autoscaling` pada Kubernetes.
Versi stabil, yang hanya mendukung untuk *autoscale* CPU, dapat ditemukan pada versi
API `autoscaling/v1`.

Versi *beta*, yang mendukung untuk *scaling* berdasarkan memori dan metrik khusus,
dapat ditemukan pada `autoscaling/v2beta2`. *Field* yang baru diperkenalkan pada
`autoscaling/v2beta2` adalah *preserved* sebagai anotasi ketika menggunakan `autoscaling/v1`. 

Ketika kamu membuat sebuah HorizontalPodAutoscaler, pastikan nama yang ditentukan adalah valid
[nama subdomain DNS](/id/docs/concepts/overview/working-with-objects/names#nama).
Untuk lebih detail tentang objek API ini dapat ditemukan di
[Objek HorizontalPodAutoscaler](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#horizontalpodautoscaler-object).

## Dukungan untuk HorizontalPodAutoscaler pada kubectl

Seperti sumber daya API lainnya, HorizontalPodAutoscaler didukung secara bawaan oleh `kubectl`.
Kita dapat membuat *autoscaler* yang baru dengan menggunakan perintah `kubectl create`.
Kita dapat melihat daftar *autoscaler* dengan perintah `kubectl get hpa` dan melihat deskripsi
detailnya dengan perintah `kubectl describe hpa`. Akhirnya, kita dapat menghapus *autoscaler*
meggunakan perintah `kubectl delete hpa`. 

Sebagai tambahan, terdapat sebuah perintah khusus `kubectl autoscaler` untuk mempermudah pembuatan
HorizontalPodAutoscaler. Sebagai contoh, mengeksekusi
`kubectl autoscaler rs foo --min=2 --max=5 --cpu-percent=80` akan membuat sebuah *autoscaler* untuk
ReplicaSet *foo*, dengan target pengguaan CPU `80%` dan jumlah replika antara 2 sampai dengan 5.
Dokumentasi lebih detail tentang `kubectl autoscaler` dapat ditemukan di 
[sini](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).

## Autoscaling ketika Rolling Update

Saat ini, dimungkinkan untuk melakukan *rolling update* menggunakan objek Deployment, yang akan 
mengatur ReplicaSet untuk kamu. HorizontalPodAutoscaler hanya mendukung pendekatan terakhir:
HorizontalPodAutoscaler terikat dengan objek Deployment, yang mengatur seberapa besar dari objek Deployment tersebut,
dan Deployment bertugas untuk mengatur besar dari ReplicaSet.

HorizontalPodAutoscaler tidak bekerja dengan *rolling update* yang menggunakan manipulasi
pada ReplicationContoller secara langsung, dengan kata lain kamu tidak bisa mengikat
HorizontalPodAutoscaler dengan ReplicationController dan melakukan *rolling update*.
Alasan HorizontalPodAutoscaler tidak bekerja ketika *rolling update* membuat ReplicationController
yang baru adalah HorizontalPodAutoscaler tidak akan terikat dengan ReplicationController yang baru tersebut.

## Dukungan untuk *Cooldown* / Penundaan

Ketika mengolah *scaleing* dari sebuah grup replika menggunakan HorizonalPodAutoscaler,
jumlah replika dimungkinkan tetap berubah secara sering disebabkan oleh perubahan dinamis
dari metrik yang dievaluasi. Hal ini sering disebut dengan *thrashing*. 

Mulai dari versi 1.6, operator klaster dapat mengatasi masalah ini dengan mengatur
konfigurasi HorizontalPodAutoscaler global sebagai *flag* `kube-controller-manager`.

Mulai dari versi 1.12, sebuah algoritma pembaruan baru menghilangkan kebutuhan terhadap
penundaan memperbanyak replika (*upscale*).

- `--horizontal-pod-autoscaler-downscale-stabilization`: Nilai untuk opsi ini adalah
  sebuah durasi yang menentukan berapa lama *autoscaler* menunggu sebelum operasi
  pengurangan replika (*downscale*) yang lain dilakukan seteleh operasi sekarang selesai. Nilai bawaannya
  adalah 5 menit (`5m0s`).

{{< note >}}
Ketika mengubah nilai paramater ini, sebuah operator klaster sadar akan kemungkinan
konsekuensi. Jika waktu penundaan diset terlalu lama, kemungkinan akan membuat
HorizontalPodAutoscaler tidak responsif terharap perubahan beban kerja. Namun, jika
waktu penundaan diset terlalu cepat, kemungkinan replikasi akan *trashing* seperti
biasanya. 
{{< /note >}}

## Dukungan untuk Beberapa Metrik

Kubernetes versi 1.6 menambah dukungan untuk *scaling* berdasarkan beberapa metrik.
Kamu dapat menggunakan API versi `autoscaling/v2beta2` untuk menentukan beberapa metrik
yang akan digunakan HorizontalPodAutoscaler untuk menambah atau mengurangi jumlah replika. 
Kemudian, _controller_ HorizontalPodAutoscaler akan mengevaluasi setiap metrik dan menyarankan jenis
*scaling* yang baru berdasarkan metrik tersebut. Jumlah replika terbanyak akan digunakan untuk *scale*
yang baru.

## Dukungan untuk Metrik Khusus

{{< note >}}
Kubernetes versi 1.2 menambah dukungan *alpha* untuk melakukan *scaling* berdasarkan metrik
yang spesifik dengan aplikasi menggunakan anotasi khusus. Dukungan untuk anotasi ini
dihilangkan pada Kubernetes versi 1.6 untuk mendukung API *autoscaling* yang baru. Selama
cara lama untuk mendapatkan metrik khusus masih tersedia, metrik ini tidak akan tersedia untuk
digunakan oleh HorizontalPodAutoscaler dan anotasi sebelumnya untuk menentukan metrik khusus untuk
*scaling* tidak lagi digunakan oleh _controller_ HorizontalPodAutscaler.
{{< /note >}}

Kubernetes versi 1.6 menambah dukungan untuk menggunakan metrik khusus pada HorizontalPodAutoscaler.
Kamu dapat menambahkan metrik khusus untuk HorizontalPodAutoscaler pada API versi `autoscaling/v2beta2`.
Kubernetes kemudian memanggil API metrik khusus untuk mengambil nilai dari metrik khusus. 


Lihat [Dukungan untuk API metrik](#dukungan-untuk-api-metrik) untuk kubutuhannya.

## Dukungan untuk API metrik

Secara standar, _controller_ HorizontalPodAutoscaler mengambil metrik dari beberapa API. Untuk dapat
mengakses API ini, administrator klaster harus memastikan bahwa:

* [API Later Pengumpulan](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) diaktifkan.

* API berikut ini terdaftar:

    * Untuk metrik sumber daya, ini adalah API `metrics.k8s.io`, pada umumnya disediakan oleh 
      [metrics-server](https://github.com/kubernetes-incubator/metrics-server). API tersebut dapat
      diaktifkan sebagai *addon* atau tambahan pada klaster. 

    * Untuk metrik khusus, ini adalah API `custom.metrics.k8s.io`. API ini disediakan oleh API
      adaptor server yang disediakan oleh vendor yang memberi solusi untuk metrik. Cek dengan
      *pipeline* metrikmu atau [daftar solusi yang sudah diketahui](https://github.com/kubernetes/metrics/blob/master/IMPLEMENTATIONS.md#custom-metrics-api). Jika kamu ingin membuat sendiri, perhatikan
      [*boilerplate* berikut](https://github.com/kubernetes-incubator/custom-metrics-apiserver) untuk memulai.

    * Untuk metrik eksternal, ini adalah API `external.metrics.k8s.io`. API ini mungkin disediakan oleh penyedia
      metrik khusus diatas.

* Nilai dari `--horizontal-pod-autoscaler-use-rest-clients` adalah `true` atau tidak ada. Ubah nilai tersebut menjadi
  `false` untuk mengubah ke *autoscaling* berdasarkan Heapster, dimana ini sudah tidak didukung lagi.

Untuk informasi lebih lanjut mengenai metrik-metrik ini dan bagaimana perbedaan setiap metrik, perhatikan proposal
desain untuk [HPA V2](https://github.com/kubernetes/design-proposals-archive/blob/main/autoscaling/hpa-v2.md),
[custom.metrics.k8s.io](https://github.com/kubernetes/design-proposals-archive/blob/main/instrumentation/custom-metrics-api.md)
dan [external.metrics.k8s.io](https://github.com/kubernetes/design-proposals-archive/blob/main/instrumentation/external-metrics-api.md).

Untuk contoh bagaimana menggunakan metrik-metrik ini, perhatikan [panduan penggunaan metrik khusus](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics)
dan [panduan penggunaan metrik eksternal](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-metrics-not-related-to-kubernetes-objects).

## Dukungan untuk Perilaku *Scaling* yang dapat Dikonfigurasi

Mulai dari versi [v1.18](https://github.com/kubernetes/enhancements/blob/master/keps/sig-autoscaling/853-configurable-hpa-scale-velocity/README.md), API `v2beta2` mengizinkan perilaku *scaling* dapat
dikonfigurasi melalui *field* `behavior` pada HorizontalPodAutoscaler. Perilaku *scaling up* dan *scaling down*
ditentukan terpisah pada *field* `slaceUp` dan *field* `scaleDown`, dibawah dari *field* `behavior`.
Sebuah stabilisator dapat ditentukan untuk kedua arah *scale* untuk mencegah perubahan replika yang terlalu
berbeda pada target *scaling*. Menentukan *scaling policies* akan mengontrol perubahan replika
ketika *scaling*.

### Scaling Policies

Satu atau lebih *scaling policies* dapat ditentukan pada *field* `behavior`. Ketika beberapa
*policies* ditentukan, *policy* yang mengizinkan *scale* terbesar akan dipilih secara *default*.
Contoh berikut menunjukkan perilaku ketika mengurangi replika:

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

Ketika jumlah Pod lebih besar dari 40, *policy* kedua akan digunakan untuk *scaling down*.
Misalnya, jika terdapat 80 replika dan target sudah di *scale down* ke 10 replika, 8 replika
akan dikurangi pada tahapan pertama. Pada iterasi berikutnya, ketika jumlah replika adalah 72,
10% dari Pod adalah 7.2 tetapi akan dibulatkan menjadi 8. Dalam setiap iterasi pada _controller_
*autoscaler* jumlah Pod yang akan diubah akan dihitung ulang berdarkan jumlah replika sekarang.
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
Ketika metrik menandakan bahwa replika pada target akan dikurangi, algoritma akan memperhatikan
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
jendela stabilisasi. Jika metrik menunjukkan bahwa replika pada target perlu diperbanyak, maka replika akan
diperbanyak di secara langsung. Untuk `scaleUp` terdapat dua *policy*, yaitu empat Pod atau 100% dari
replika yang berjalan akan ditambahkan setiap 15 detik sampai HorizontalPodAutoscaler
dalam keadaan stabil.

### Contoh: Mengubah Jendela Stabiliasi pada *field* scaleDown

Untuk membuat jendela stabilisai untuk pengurangan replika selama satu menit, perilaku
berikut ditambahkan pada HorizontalPodAutoscaler.

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 60
```

### Contoh: Membatasi nilai *scale down*

Untuk membatasi total berapa Pod yang akan dihapus, 10% setiap menut, perilaku
berikut ditambahkan pada HorizontalPodAutoscaler.

```yaml
behavior:
  scaleDown:
    policies:
    - type: Percent
      value: 10
      periodSeconds: 60
```

Untuk mengizinkan penghapusan 5 Pod terakhir, *policy* lain dapat ditambahkan.

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
ditentukan. Untuk mencegah pengurangan replika dapat menggunakan *policy* berikut.

```yaml
behavior:
  scaleDown:
    selectPolicy: Disabled
```



## {{% heading "whatsnext" %}}


* Dokumentasi desain [Horizontal Pod Autoscaling](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md).
* Perintah kubectl autoscale [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale).
* Contoh penggunaan [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/).


