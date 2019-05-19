---
title: Pod Preset
content_template: templates/concept
weight: 30
---

{{% capture overview %}}
Halaman ini menyajikan sebuah gambaran umum dari `Pod Preset`, yang merupakan objek untuk memasukkan informasi tertentu ke dalam `Pod` pada saat waktu penciptaan. Informasi dapat berupa *secret*, *volume*, *volume mount*, dan variabel *environment*.
{{% /capture %}}

{{% capture body %}}
## Memahami *Pod Preset*
---

Sebuah *Pod Preset* adalah sebuah *resource* API untuk memasukkan kebutuhan *runtime* tambahan ke dalam sebuah *Pod* pada saat waktu penciptaan. Kamu akan menggunakan *label selector* untuk menunjuk *Pod-pod* dimana *Pod Preset* diterapkan.

Menggunakan sebuah *Pod Preset* memungkinkan pembuat templat *pod* untuk tidak menyediakan secara eksplisit semua informasi untuk setiap *pod*. Dengan demikian, pembuat templat *pod* mengkonsumsi sebuah *service* spesifik untuk tidak perlu tahu semua detail-detail tentang *service* tersebut.

Untuk informasi lebih lanjut mengenai latar belakang lihat [proposal desain untuk *PodPreset*](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/service-catalog/pod-preset.md).

## Bagaimana Cara Kerja *Pod Preset*
---

*Kubernetes* menyediakan sebuah pengendali penerimaan (*PodPreset*) dimana, ketika diaktifkan, *Pod Preset* diterapkan kepada permintaan *pod* yang datang. Ketika sebuah penciptaan *pod* terjadi, sistem melakukan hal-hal berikut:

1. Mengambil semua *PodPreset* yang tersedia untuk digunakan.
2. Cek jika *label selector* dari salah satu *PodPreset* cocok dengan *label* pada *pod* yang sedang diciptakan.
3. Usaha untuk menggabungkan berbagai resource didefinisikan oleh *PodPreset* ke dalam *Pod* yang sedang diciptakan.
4. Ketika terjadi galat, lempar sebuah *event* yang mendokumentasikan galat penggabungan dalam *pod*, dan membuat *pod* tanpa salah satu *resource* dari *PodPreset*.
5. Anotasikan hasil spesifikasi *Pod* yang telah dimodifikasi untuk menunjukkan bahwa *Pod* telah dimodifikasi oleh sebuah *PodPreset*. Anotasi berupa `podpreset.admission.kubernetes.io/podpreset-<nama pod-preset>: "<versi resource>"`.

Tiap *Pod* akan bisa dipasangkan oleh nol atau lebih *Pod Preset*; dan tiap *PodPreset* bisa diterapkan ke nol atau lebih *pod*. Ketika sebuah *PodPreset* diterapkan ke satu atau lebih *Pod*, *Kubernetes* memodifikasi spesifikasi *Pod*.


>Catatan: Sebuah *Pod Preset* mampu memodifikasi kolom `.spec.containers` pada sebuah spesifikasi *Pod* jika sesuai. Tidak ada definisi resource dari *Pod Preset* yang akan diterapkan kepada kolom `initContainer`.


### Menonaktifkan *Pod Preset* untuk sebuah *Pod* Spesifik
Mungkin akan ada keadaan dimana kamu menginginkan sebuah *Pod* tidak bisa diubah oleh sebuah mutasi *Pod Preset*. Pada kasus ini, kamu bisa menambahkan sebuah anotasi pada spesifikasi *Pod* dalam bentuk: `podpreset.admission.kubernetes.io/exclude: "true"`.

## Mengaktifkan *Pod Preset*
---
Dalam rangka untuk menggunakan *Pod Preset* di dalam kluster kamu, kamu harus memastikan hal berikut:

1. kamu telah mengaktifkan tipe API `settings.k8s.io/v1alpha1/podpreset`. Sebagai contoh, ini bisa dilakukan dengan menambahkan `settings.k8s.io/v1alpha1=true` di dalam opsi `--runtime-config` untuk API *server*. Dalam *minikube* tambahkan argumen berikut `--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true` saat memulai kluster.

2. kamu telah mengaktifkan pengendali penerimaan dari *PodPreset*. Salah satu cara untuk melakukannya adalah dengan menambakan *PodPreset* di dalam nilai opsi `--enable-admission-plugins` yang dispesifikasikan untuk API *server*. Dalam *minikube* tambahkan argumen berikut `--extra-config=apiserver.enable-admission-plugins=Initializers,NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset ` saat memulai kluster.

3. kamu telah mendefinisikan *Pod Preset* kamu dengan membuat objek *PodPreset* pada *namespace* yang akan kamu gunakan. 

{{% /capture %}}

{{% capture whatsnext %}}
  * [Memasukkan data kedalam sebuah *Pod* dengan *PodPreset*](/docs/concepts/workloads/pods/pod/#injecting-data-into-a-pod-using-podpreset.md)

{{% /capture %}}