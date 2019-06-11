---
title: Pod Preset
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
Halaman ini menyajikan gambaran umum tentang PodPreset, yang merupakan objek untuk memasukkan informasi tertentu ke dalam Pod pada saat waktu penciptaan. Informasi dapat berupa _secret_, _volume_, _volume mount_, dan variabel _environment_.
{{% /capture %}}

{{% capture body %}}
## Memahami Pod Preset
---

Sebuah `Pod Preset` adalah sebuah _resource_ API untuk memasukkan kebutuhan _runtime_ tambahan ke dalam sebuah Pod pada saat waktu penciptaan. Kamu akan menggunakan _label selector_ untuk menunjuk Pod dimana Pod Preset diterapkan.

Menggunakan sebuah Pod Preset memungkinkan pembuat templat pod untuk tidak menyediakan secara eksplisit semua informasi untuk setiap pod. Dengan demikian, pembuat templat pod yang mengkonsumsi sebuah _service_ spesifik tidak perlu tahu semua detail-detail tentang _service_ tersebut.

Untuk informasi lebih lanjut mengenai latar belakang lihat [proposal desain untuk PodPreset](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/service-catalog/pod-preset.md).

## Bagaimana Cara Kerja Pod Preset
---

Kubernetes menyediakan sebuah _admission controller_ (`PodPreset`) dimana, ketika diaktifkan, PodPreset diterapkan kepada permintaan penciptaan Pod yang akan datang. Ketika sebuah penciptaan Pod terjadi, sistem melakukan hal-hal berikut:

1. Mengambil semua `PodPreset` yang tersedia untuk digunakan.
2. Cek jika _label selector_ dari salah satu `PodPreset` cocok dengan _label_ pada pod yang sedang diciptakan.
3. Usaha untuk menggabungkan berbagai _resource_ didefinisikan oleh `PodPreset` ke dalam Pod yang sedang diciptakan.
4. Ketika terjadi galat, lempar sebuah _event_ yang mendokumentasikan galat penggabungan dalam pod, dan membuat pod tanpa salah satu _resource_ dari `PodPreset`.
5. Anotasikan hasil spesifikasi Pod yang telah dimodifikasi untuk menunjukkan bahwa Pod telah dimodifikasi oleh sebuah PodPreset. Anotasi berupa `podpreset.admission.kubernetes.io/podpreset-<nama pod-preset>: "<versi resource>"`.

Tiap Pod akan bisa dipasangkan oleh nol atau lebih PodPreset; dan tiap PodPreset bisa diterapkan ke nol atau lebih Pod. Ketika sebuah PodPreset diterapkan ke satu atau lebih Pod, Kubernetes memodifikasi Pod Spec. Untuk perubahan terhadap `Env`,`EnvFrom`, dan `VolumeMount`, Kubernetes memodifikasi spesifikasi kontainer untuk semua kontainer di dalam Pod; Untuk perubahan terhadap `Volume`, Kubernetes memodifikasi Pod Spec.

{{< note >}}
Catatan: Sebuah Pod Preset mampu memodifikasi kolom `.spec.containers` pada sebuah Pod Spec jika sesuai. Tidak ada definisi resource dari Pod Preset yang akan diterapkan kepada kolom `initContainer`.
{{< /note >}}

### Menonaktifkan Pod Preset untuk sebuah Pod Spesifik
Mungkin akan ada keadaan dimana kamu menginginkan sebuah Pod tidak bisa diubah oleh sebuah mutasi PodPreset. Pada kasus ini, kamu bisa menambahkan sebuah anotasi pada Pod Spec dalam bentuk: `podpreset.admission.kubernetes.io/exclude: "true"`.

## Mengaktifkan Pod Preset
---
Dalam rangka untuk menggunakan Pod Preset di dalam kluster kamu, kamu harus memastikan hal berikut:

1. Kamu telah mengaktifkan tipe API `settings.k8s.io/v1alpha1/podpreset`. Sebagai contoh, ini bisa dilakukan dengan menambahkan `settings.k8s.io/v1alpha1=true` di dalam opsi `--runtime-config` untuk API _server_. Dalam _minikube_ tambahkan argumen berikut `--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true` saat menginisialisasi kluster.

2. Kamu telah mengaktifkan _admission controller_ dari `PodPreset`. Salah satu cara untuk melakukannya adalah dengan menambahkan `PodPreset` di dalam nilai opsi `--enable-admission-plugins` yang dispesifikasikan untuk API _server_. Dalam _minikube_ tambahkan argumen berikut `--extra-config=apiserver.enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset ` saat menginisialisasi kluster.

3. Kamu telah membuat objek `PodPreset` pada _namespace_ yang kamu gunakan dengan cara mendefinisikan Pod Preset.

{{% /capture %}}

{{% capture whatsnext %}}
  * [Memasukkan data ke dalam sebuah Pod dengan PodPreset](/docs/concepts/workloads/pods/pod/#injecting-data-into-a-pod-using-podpreset.md)

{{% /capture %}}
