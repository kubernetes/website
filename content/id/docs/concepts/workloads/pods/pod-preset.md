---
title: Pod Preset
content_template: templates/concept
weight: 30
---

{{% capture overview %}}
Halaman ini menyajikan gambaran umum tentang `Pod Preset`, yang merupakan objek untuk memasukkan informasi tertentu ke dalam `Pod` pada saat waktu penciptaan. Informasi dapat berupa _secret_, _volume_, _volume mount_, dan variabel _environment_.
{{% /capture %}}

{{% capture body %}}
## Memahami **Pod Preset**
---

Sebuah `Pod Preset` adalah sebuah _resource_ API untuk memasukkan kebutuhan _runtime_ tambahan ke dalam sebuah _Pod_ pada saat waktu penciptaan. Kamu akan menggunakan _label selector_ untuk menunjuk _Pod-pod_ dimana _Pod Preset_ diterapkan.

Menggunakan sebuah _Pod Preset_ memungkinkan pembuat templat _pod_ untuk tidak menyediakan secara eksplisit semua informasi untuk setiap _pod_. Dengan demikian, pembuat templat _pod_ mengkonsumsi sebuah _service_ spesifik untuk tidak perlu tahu semua detail-detail tentang _service_ tersebut.

Untuk informasi lebih lanjut mengenai latar belakang lihat [proposal desain untuk _PodPreset_](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/service-catalog/pod-preset.md).

## Bagaimana Cara Kerja **Pod Preset**
---

_Kubernetes_ menyediakan sebuah _admission controller_ (**PodPreset**) dimana, ketika diaktifkan, `Pod Preset` diterapkan kepada permintaan _pod_ yang datang. Ketika sebuah penciptaan _pod_ terjadi, sistem melakukan hal-hal berikut:

1. Mengambil semua `PodPreset` yang tersedia untuk digunakan.
2. Cek jika _label selector_ dari salah satu `PodPreset` cocok dengan _label_ pada _pod_ yang sedang diciptakan.
3. Usaha untuk menggabungkan berbagai _resource_ didefinisikan oleh `PodPreset` ke dalam _Pod_ yang sedang diciptakan.
4. Ketika terjadi galat, lempar sebuah _event_ yang mendokumentasikan galat penggabungan dalam _pod_, dan membuat _pod_ tanpa salah satu _resource_ dari `PodPreset`.
5. Anotasikan hasil spesifikasi _Pod_ yang telah dimodifikasi untuk menunjukkan bahwa _Pod_ telah dimodifikasi oleh sebuah `PodPreset`. Anotasi berupa `podpreset.admission.kubernetes.io/podpreset-<nama pod-preset>: "<versi resource>"`.

Tiap _Pod_ akan bisa dipasangkan oleh nol atau lebih `Pod Preset`; dan tiap `PodPreset` bisa diterapkan ke nol atau lebih _pod_. Ketika sebuah `PodPreset` diterapkan ke satu atau lebih _Pod_, _Kubernetes_ memodifikasi spesifikasi _Pod_.


>Catatan: Sebuah _Pod Preset_ mampu memodifikasi kolom `.spec.containers` pada sebuah spesifikasi *Pod* jika sesuai. Tidak ada definisi resource dari *Pod Preset* yang akan diterapkan kepada kolom `initContainer`.


### Menonaktifkan **Pod Preset** untuk sebuah _Pod_ Spesifik
Mungkin akan ada keadaan dimana kamu menginginkan sebuah _Pod_ tidak bisa diubah oleh sebuah mutasi _Pod Preset_. Pada kasus ini, kamu bisa menambahkan sebuah anotasi pada spesifikasi _Pod_ dalam bentuk: `podpreset.admission.kubernetes.io/exclude: "true"`.

## Mengaktifkan **Pod Preset**
---
Dalam rangka untuk menggunakan _Pod Preset_ di dalam kluster kamu, kamu harus memastikan hal berikut:

1. Kamu telah mengaktifkan tipe API `settings.k8s.io/v1alpha1/podpreset`. Sebagai contoh, ini bisa dilakukan dengan menambahkan `settings.k8s.io/v1alpha1=true` di dalam opsi `--runtime-config` untuk API _server_. Dalam _minikube_ tambahkan argumen berikut `--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true` saat memulai kluster.

2. Kamu telah mengaktifkan _admission controller_ dari *PodPreset*. Salah satu cara untuk melakukannya adalah dengan menambakan *PodPreset* di dalam nilai opsi `--enable-admission-plugins` yang dispesifikasikan untuk API _server_. Dalam _minikube_ tambahkan argumen berikut `--extra-config=apiserver.enable-admission-plugins=Initializers,NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset ` saat memulai kluster.

3. Kamu telah mendefinisikan _Pod Preset_ kamu dengan membuat objek `PodPreset` pada _namespace_ yang akan kamu gunakan. 

{{% /capture %}}

{{% capture whatsnext %}}
  * [Memasukkan data ke dalam sebuah _Pod_ dengan _PodPreset_](/docs/concepts/workloads/pods/pod/#injecting-data-into-a-pod-using-podpreset.md)

{{% /capture %}}