---
title: Pola Operator
content_type: concept
weight: 30
---

<!-- overview -->

Operator adalah ekstensi perangkat lunak untuk Kubernetes yang memanfaatkan 
[_custom resource_](/id/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
untuk mengelola aplikasi dan komponen-komponennya. Operator mengikuti prinsip 
Kubernetes, khususnya dalam hal [_control loop_](/docs/concepts/#kubernetes-control-plane).




<!-- body -->

## Motivasi

Pola dari operator bertujuan untuk menangkap tujuan utama dari operator manusia
yang mengelola layanan atau suatu kumpulan layanan. Operator manusia yang 
menjaga spesifik aplikasi dan layanan memiliki pengetahuan yang mendalam tentang
bagaimana sistem harus berperilaku, bagaimana cara menyebarkannya, dan 
bagaimana bereaksi jika ada masalah.

Orang-orang yang menjalankan _workload-workload_ di Kubernetes pada umumnya suka 
menggunakan otomatisasi untuk menangani tugas-tugas yang berulang. Pola
operator menangkap bagaimana kamu dapat menulis kode untuk mengotomatiskan 
sebuah tugas di luar batas apa yang dapat disediakan oleh Kubernetes itu 
sendiri.

## Operator di Kubernetes

Kubernetes didesain untuk otomasi. Secara di luar nalar, kamu mendapatkan banyak
otomatisasi bawaan dari komponen inti Kubernetes. Kamu dapat menggunakan 
Kubernetes untuk mengotomasikan penyebaran dan menjalankan _workload-workload_, *dan* 
kamu juga dapat mengotomasikan cara Kubernetes melakukan pekerjaan itu.

Konsep dari {{< glossary_tooltip text="controller" term_id="controller" >}}
Kubernetes memungkinkan kamu memperluas perilaku klaster tanpa harus mengubah 
kode dari Kubernetes itu sendiri.

Operator adalah klien API dari Kubernetes yang bertindak sebagai _controller_ 
untuk [_custome resource_](/docs/concepts/api-extension/custom-resources/).

## Contoh operator {#contoh}

Beberapa hal yang dapat kamu gunakan untuk mengotomasi operator meliputi:

* menyebarkan aplikasi sesuai dengan permintaan
* mengambil dan memulihkan backup status dari sebuah aplikasi
* menangani pembaruan kode aplikasi termasuk dengan perubahan terkait seperti 
  skema basis data atau pengaturan konfigurasi tambahan
* mempublikasikan layanan ke sebuah aplikasi yang tidak mendukung API Kubernetes
  untuk menemukan mereka
* mensimulasikan kegagalan pada seluruh atau sebagian klaster kamu untuk 
  menguji resiliensinya
* memilih suatu pemimpin untuk aplikasi yang terdistribusi tanpa adanya proses 
  pemilihan anggota secara internal

Seperti apa sebuah operator dalam kasus yang lebih terperinci? Berikut ini 
adalah contoh yang lebih detail:

1. Sebuah _custom resource_ bernama SampleDB, bisa kamu konfigurasi ke 
   dalam klaster.
2. Sebuah Deployment memastikan sebuah Pod berjalan dimana didalamnya 
   berisi bagian _controller_ dari operator.
3. Kontainer Image dari kode operator.
4. Kode _controller_ yang menanyakan pada *control-plane* untuk mencari tahu
   apakah itu sumber daya SampleDB telah dikonfigurasi.
5. Inti dari operator adalah kode untuk memberi tahu server API bagaimana
   membuatnya kondisi sebenarnya sesuai dengan sumber daya yang dikonfigurasi.
   * Jika kamu menambahkan SampleDB baru, operator menyiapkan 
     PersistentVolumeClaims untuk menyediakan penyimpanan basis data yang 
     tahan lama, sebuah StatefulSet untuk menjalankan SampleDB dan pekerjaan
     untuk menangani konfigurasi awal.
   * Jika kamu menghapusnya, operator mengambil _snapshot_, lalu memastikannya
     StatefulSet dan Volume juga dihapus.
6. Operator juga mengelola backup basis data yang reguler. Untuk setiap resource
   SampleDB, operator menentukan kapan membuat Pod yang dapat terhubung
   ke database dan mengambil backup. Pod-Pod ini akan bergantung pada ConfigMap
   dan / atau sebuah Secret yang memiliki basis data koneksi dan kredensial.
7. Karena operator bertujuan untuk menyediakan otomatisasi yang kuat untuk 
   resource yang dikelola, maka akan ada kode pendukung tambahan. Sebagai contoh
   , kode memeriksa untuk melihat apakah basis data menjalankan versi yang 
   lama dan, jika demikian, kode membuat objek Job yang melakukan pembaruan untuk 
   kamu.

## Menyebarkan operator

Cara paling umum untuk menyebarkan operator adalah dengan menambahkan
CustomResourceDefinition dan _controller_ yang berkaitan ke dalam klaster kamu.
_Controller_ biasanya akan berjalan di luar
{{< glossary_tooltip text="control plane" term_id="control-plane" >}},
seperti kamu akan menjalankan aplikasi apa pun yang dikontainerisasi.
Misalnya, kamu bisa menjalankan _controller_ di klaster kamu sebagai sebuah 
Deployment.

## Menggunakan operator {#menggunakan operator}

Setelah operator disebarkan, kamu akan menggunakannya dengan menambahkan, 
memodifikasi, atau menghapus jenis sumber daya yang digunakan operator tersebut.
Melanjutkan contoh diatas, kamu akan menyiapkan Deployment untuk operator itu 
sendiri, dan kemudian:

```shell
kubectl get SampleDB                   # find configured databases

kubectl edit SampleDB/example-database # manually change some settings
```

&hellip;dan itu saja! Operator akan berhati-hati dalam menerapkan perubahan
serta menjaga layanan yang ada dalam kondisi yang baik.

## Menulis operator Kamu Sendiri {#menulis-operator}

Jika tidak ada operator dalam ekosistem yang mengimplementasikan perilaku kamu
inginkan, kamu dapat kode kamu sendiri. Dalam [Selanjutnya](#selanjutnya) kamu 
akan menemukan beberapa tautan ke _library_ dan perangkat yang dapat kamu gunakan
untuk menulis operator _Cloud Native_ kamu sendiri.

Kamu juga dapat mengimplementasikan operator (yaitu, _Controller_) dengan
menggunakan bahasa / _runtime_ yang dapat bertindak sebagai 
[klien dari API Kubernetes](/docs/reference/using-api/client-libraries/).

## {{% heading "whatsnext" %}}

* Memahami lebih lanjut tentang [_custome resources_](/id/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Temukan "ready-made" _operators_ dalam [OperatorHub.io](https://operatorhub.io/) 
  untuk memenuhi use case kamu
* Menggunakan perangkat yang ada untuk menulis operator kamu sendiri, misalnya:
  * menggunakan [KUDO](https://kudo.dev/) (Kubernetes Universal Declarative Operator)
  * menggunakan [kubebuilder](https://book.kubebuilder.io/)
  * menggunakan [Metacontroller](https://metacontroller.github.io/metacontroller/intro.html) bersama dengan
    `WebHooks` yang kamu implementasikan sendiri
  * menggunakan the [Operator _Framework_](https://github.com/operator-framework/getting-started)
* [Terbitkan](https://operatorhub.io/) Operator kamu agar dapat digunakan oleh 
  orang lain
* Baca [artikel asli dari CoreOS](https://coreos.com/blog/introducing-operators.html)
  yang memperkenalkan pola operator
* Baca sebuah [artikel](https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps) 
  dari Google Cloud soal panduan terbaik membangun operator

