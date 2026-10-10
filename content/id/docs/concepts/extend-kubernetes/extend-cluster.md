---
title: Memperluas Klaster Kubernetes Kamu
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes sangat mudah dikonfigurasi dan diperluas. Sehingga,
jarang membutuhkan _fork_ atau menambahkan _patch_ ke kode proyek Kubernetes.

Panduan ini menjelaskan pilihan untuk menyesuaikan klaster Kubernetes.
Dokumen ini ditujukan kepada {{< glossary_tooltip text="operator klaster" term_id="cluster-operator" >}} yang ingin
memahami bagaimana menyesuaikan klaster Kubernetes dengan kebutuhan lingkungan kerja mereka.

Developer yang prospektif {{< glossary_tooltip text="Developer Platform" term_id="platform-developer" >}} atau {{< glossary_tooltip text="Kontributor" term_id="contributor" >}} Proyek Kubernetes juga mendapatkan manfaat dari
dokumen ini sebagai pengantar apa saja poin-poin dan pola-pola perluasan yang ada, untung-rugi, dan batasan-batasannya.




<!-- body -->

## Ikhtisar

Pendekatan-pendekatan kostumisasi secara umum dapat dibagi atas _konfigurasi_, yang hanya melibatkan perubahan _flag_, konfigurasi berkas lokal, atau objek-objek sumber daya API; dan *perluasan*, yang melibatkan berjalannya program atau layanan tambahan. Dokumen ini sebagian besar membahas tentang perluasan.

## Konfigurasi

_Flag-flag_ dan _berkas-berkas konfigurasi_ didokumentasikan di bagian Referensi dari dokumentasi daring, didalam setiap _binary_:

* [kubelet](/docs/admin/kubelet/)
* [kube-apiserver](/docs/admin/kube-apiserver/)
* [kube-controller-manager](/docs/admin/kube-controller-manager/)
* [kube-scheduler](/docs/admin/kube-scheduler/).

_Flag-flag_ dan berkas-berkas konfigurasi mungkin tidak selalu dapat diubah pada layanan Kubernetes yang _hosted_ atau pada distribusi dengan instalasi yang dikelola. Ketika mereka dapat diubah, mereka biasanya hanya dapat diubah oleh Administrator Klaster. Dan juga, mereka dapat sewaktu-waktu diubah dalam versi Kubernetes di masa depan, dan menyetel mereka mungkin memerlukan proses pengulangan kembali. Oleh karena itu, mereka harus digunakan hanya ketika tidak ada pilihan lain.

*API kebijakan bawaan*, seperti [ResourceQuota](/id/docs/concepts/policy/resource-quotas/), [PodSecurityPolicy](/id/docs/concepts/policy/pod-security-policy/), [NetworkPolicy](/id/docs/concepts/services-networking/network-policies/) dan Role-based Access Control ([RBAC](/id/docs/reference/access-authn-authz/rbac/)), adalah API bawaan Kubernetes. API biasanya digunakan oleh layanan Kubernetes yang _hosted_ dan diatur oleh instalasi Kubernetes. Mereka bersifat deklaratif dan menggunakan konvensi yang sama dengan sumber daya Kubernetes lainnya seperti pod-pod, jadi konfigurasi klaster baru dapat diulang-ulang dan dapat diatur dengan cara yang sama dengan aplikasi. Dan, ketika mereka stabil, mereka mendapatkan keuntungan dari [kebijakan pendukung yang jelas](/docs/reference/deprecation-policy/) seperti API Kubernetes lainnya. Oleh karena itu, mereka lebih disukai daripada _berkas konfigurasi_ dan _flag-flag_ saat mereka cocok dengan situasi yang dibutuhkan.

## Perluasan

Perluasan adalah komponen perangkat lunak yang memperluas dan berintegrasi secara mendalam dengan Kubernetes.
Mereka mengadaptasi Kubernetes untuk mendukung perangkat keras tipe baru dan jenis baru.

Kebanyakan administrator klaster akan menggunakan instansi Kubernetes yang didistribusikan atau yang _hosted_.
Sebagai hasilnya, kebanyakan pengguna Kubernetes perlu menginstal perluasan dan lebih sedikit yang perlu untuk membuat perluasan-perluasan yang baru.

## Pola-pola Perluasan

Kubernetes didesain untuk dapat diotomasi dengan menulis program-program klien. Program apapun yang membaca dan/atau menulis ke API Kubernetes dapat menyediakan otomasi yang berguna. 

*Otomasi* dapat berjalan di dalam klaster atau di luar klaster. Dengan mengikuti panduan
di dalam dokumen ini, kamu dapat menulis otomasi yang sangat tersedia dan kuat.
Otomasi pada umumnya dapat bekerja dengan berbagai macam klaster Kubernetes, termasuk
klaster yang _hosted_ dan instalasi yang dikelola.

Ada pola spesifik untuk menulis program klien yang bekerja dengan baik bersama Kubernetes yang disebut pola _Controller_. _Controller-controller_ biasanya membaca kolom `.spec` milik sebuah objek, kemungkinan melakukan sesuatu, dan kemudian memperbarui objek milik `.status`.

_Controller_ adalah klien dari Kubernetes. Ketika Kubernetes adalah klien dan memanggil layanan
terpisah, hal tersebut disebut _Webhook_. Layanan terpisah tersebut disebut sebuah _Webhook Backend_. Seperti _Controller-controller_, _Webhook-webhook_ memang menambah sebuah titik untuk terjadinya kegagalan.

Di dalam model _Webhook_, Kubernetes membuat sebuah _network request_ kepada sebuah layanan terpisah.

Di dalam model _Binary Plugin_, Kubernetes mengeksekusi sebuah program.
_Binary Plugin_ digunakan oleh kubelet (misalnya [_Plugin Flex Volume_](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)
dan oleh [_Plugin_ Jaringan](/docs/concepts/cluster-administration/network-plugins/)) dan oleh kubectl.

Berikut ini adalah diagram yang menunjukkan bagaimana titik-titik perluasan berinteraksi dengan _control plane_ Kubernetes.

<img src="https://docs.google.com/drawings/d/e/2PACX-1vQBRWyXLVUlQPlp7BvxvV9S1mxyXSM6rAc_cbLANvKlu6kCCf-kGTporTMIeG5GZtUdxXz1xowN7RmL/pub?w=960&h=720">

<!-- image source drawing https://docs.google.com/drawings/d/1muJ7Oxuj_7Gtv7HV9-2zJbOnkQJnjxq-v1ym_kZfB-4/edit?ts=5a01e054 -->


## Titik-titik Perluasan

Diagram berikut menunjukkan titik-titik perluasan di sebuah Kubernetes.

<img src="https://docs.google.com/drawings/d/e/2PACX-1vSH5ZWUO2jH9f34YHenhnCd14baEb4vT-pzfxeFC7NzdNqRDgdz4DDAVqArtH4onOGqh0bhwMX0zGBb/pub?w=425&h=809">

<!-- image source diagrams: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

1. Pengguna biasanya berinteraksi dengan API Kubernetes menggunakan `kubectl`. [_Plugin-plugin_ Kubectl](/docs/tasks/extend-kubectl/kubectl-plugins/) memperluas _binari_ kubectl. Mereka hanya memengaruhi lingkungan lokal pengguna, dan tidak dapat memaksakan kebijakan yang menyeluruh di seluruh situs.
2. apiserver menangani semua permintaan. Beberapa tipe titik perluasan di apiserver memperbolehkan otentikasi permintaan, atau memblokir mereka berdasarkan konten mereka, menyunting konten, dan menangani penghapusan. Hal ini dideskripsikan di bagian [Perluasan Akses API](/docs/concepts/overview/extending#perluasan-perluasan-akses-api)
3. apiserver melayani berbagai macam sumber daya, _tipe-tipe sumber daya bawaan_, seperti `pod`, didefinisikan oleh proyek kubernetes dan tidak dapat diubah. kamu juga dapat menambahkan sumber daya yang kamu definisikan sendiri, atau yang proyek lain definisikan, disebut _Custom Resources_, seperti dijelaskan di bagian [Sumber Daya _Custom_](/docs/concepts/overview/extending#tipe-tipe-yang-ditentukan-pengguna). Sumber daya _Custom_ sering digunakan dengan Perluasan Akses API.
4. Penjadwal Kubernetes memutuskan ke Node mana Pod akan ditempatkan. Ada beberapa cara untuk memperluas penjadwalan. Hal ini dibahas pada bagian [Perluasan-perluasan Penjadwal](/docs/concepts/overview/extending#perluasan-perluasan-penjadwal).
5. Sebagian besar perilaku Kubernetes diimplementasi oleh program yang disebut *Controller-controller* yang merupakan klien dari API-Server. *Controller-controller* sering digunakan bersama dengan Sumber Daya _Custom_.
6. Kubelet berjalan di server, dan membantu Pod-pod  terlihat seperti server virtual dengan IP mereka sendiri di jaringan klaster. [_Plugin_ Jaringan](/docs/concepts/overview/extending#plugin-plugin-jaringan) memungkinkan adanya perbedaan implementasi pada jaringan Pod.
7. Kubelet juga melakukan penambatan dan pelepasan tambatan volume untuk kontainer. Tipe-tipe penyimpanan baru dapat didukung via [_Plugin_ Penyimpanan](/docs/concepts/overview/extending#plugin-plugin-penyimpanan).

Jika kamu tidak yakin untuk memulai dari mana, diagram alir di bawah ini dapat membantu kamu. Ingat lah bahwa beberapa solusi mungkin melibatkan beberapa tipe perluasan.


<img src="https://docs.google.com/drawings/d/e/2PACX-1vRWXNNIVWFDqzDY0CsKZJY3AR8sDeFDXItdc5awYxVH8s0OLherMlEPVUpxPIB1CSUu7GPk7B2fEnzM/pub?w=1440&h=1080">

<!-- image source drawing: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

## Perluasan API
### Tipe-tipe yang Ditentukan Pengguna

Pertimbangkan untuk menambahkan Sumber Daya _Custom_ ke Kubernetes jika kamu ingin mendefinisikan pengontrol baru, objek konfigurasi aplikasi atau API deklaratif lainnya, dan untuk mengelolanya menggunakan alat Kubernetes, seperti `kubectl`.

Jangan menggunakan Sumber Daya _Custom_ sebagai penyimpanan data untuk aplikasi, pengguna, atau untuk memonitor data.

Untuk lebih jelasnya tentang Sumber Daya _Custom_, lihat [Panduan Konsep Sumber Daya _Custom_](/docs/concepts/api-extension/custom-resources/).

### Menggabungkan API Baru dengan Otomasi

Kombinasi antara sebuah API sumber daya _custom_ dan _loop_ kontrol disebut [Pola Operator](/id/docs/concepts/extend-kubernetes/operator/). Pola Operator digunakan untuk mengelola aplikasi yang spesifik dan biasanya _stateful_. API-API _custom_ dan _loop_ kontrol ini dapat digunakan untuk mengatur sumber daya lainnya, seperti penyimpanan dan kebijakan-kebijakan.

### Mengubah Sumber Daya Bawaan

Ketika kamu memperluas API Kubernetes dengan menambahkan sumber daya _custom_, sumber daya yang ditambahkan akan selalu masuk ke Grup API baru. Kamu tidak dapat mengganti atau mengubah Grup API yang sudah ada. Menambah sebuah API tidak secara langsung membuat kamu memengaruhi perilaku API yang sudah ada (seperti Pod), tetapi Perluasan Akses API dapat memengaruhinya secara langsung.


### Perluasan-Perluasan Akses API

Ketika sebuah permintaan sampai ke Server API Kubernetes, permintaan tersebut diotentikasi terlebih dahulu, kemudian diotorisasi, kemudian diarahkan ke berbagai jenis _Admission Control_. Lihat dokumentasi [Mengatur Akses ke API Kubernetes](/docs/reference/access-authn-authz/controlling-access/) untuk lebih jelasnya tentang alur ini.

Setiap langkah berikut menawarkan titik-titik perluasan.

Kubernetes memiliki beberapa metode otentikasi bawaan yang didukungnya. Metode ini bisa berada di belakang proksi yang mengotentikasi, dan metode ini dapat mengirim sebuah token dari _header_ Otorisasi ke layanan terpisah untuk verifikasi (sebuah _webhook_). Semua metode ini tercakup dalam [Dokumentasi Otentikasi](/docs/reference/access-authn-authz/authentication/).

### Otentikasi

[Otentikasi](/docs/reference/access-authn-authz/authentication/) memetakan _header_ atau sertifikat dalam semua permintaan ke _username_ untuk klien yang mebuat permintaan.

Kubernetes menyediakan beberapa metode otentikasi bawaan, dan sebuah metode [_Webhook_ Otentikasi](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) jika metode bawaan tersebut tidak mencukupi kebutuhan kamu.

### Otorisasi

[Otorisasi](/docs/reference/access-authn-authz/webhook/) menentukan apakah pengguna tertentu dapat membaca, menulis, dan melakukan operasi lainnya terhadap sumber daya API. Hal ini hanya bekerja pada tingkat sumber daya secara keseluruhan -- tidak membeda-bedakan berdasarkan field objek sembarang. Jika pilihan otorisasi bawaan tidak mencukupi kebutuhan kamu, [_Webhook_ Otorisasi](/docs/reference/access-authn-authz/webhook/) memungkinkan pemanggilan kode yang disediakan pengguna untuk membuat keputusan otorisasi.

### Kontrol Admisi Dinamis

Setalah permintaan diotorisasi, jika ini adalah operasi penulisan, permintaan ini akan melalui langkah [Kontrol Admisi](/docs/reference/access-authn-authz/admission-controllers/). Sebagai tambahan untuk step bawaan, ada beberapa perluasan:

* [_Webhook_ Kebijakan _Image_](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook) membatasi _image_ mana saja yang dapat berjalan di kontainer.
* Untuk membuat keputusan kontrol admisi sembarang, [_Webhook_ Admisi](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) umum dapat digunakan. _Webhook_ Admisi dapat menolak pembuatan atau pembaruan.

## Perluasan Infrastruktur

### _Plugin-plugin_ Penyimpanan

[Flex Volume](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/flexvolume-deployment.md) memungkinkan pengguna untuk memasang tipe-tipe volume tanpa dukungan bawaan dengan cara membiarkan Kubelet memanggil sebuah _Plugin Binary_ untuk menambatkan volume.

### _Plugin_ Perangkat

_Plugin_ perangkat memungkinkan sebuah node untuk menemukan sumber daya Node baru (sebagai tambahan dari bawaannya seperti CPU dan memori) melalui sebuah [_Plugin_ Perangkat](/docs/concepts/cluster-administration/device-plugins/).

### _Plugin-plugin_ Jaringan

Struktur-struktur jaringan yang berbeda dapat didukung melalui [_Plugin_ Jaringan](/docs/admin/network-plugins/) pada tingkat Node.

### Perluasan-perluasan Penjadwal

Penjadwal adalah jenis pengatur spesial yang mengawasi Pod, dan menempatkan Pod ke Node. Penjadwal bawaan dapat digantikan seluruhnya, sementara  terus menggunakan komponen Kubernetes lainnya, atau [penjadwal ganda](/docs/tasks/administer-cluster/configure-multiple-schedulers/) dapat berjalan dalam waktu yang bersamaan.

Ini adalah usaha yang signifikan, dan hampir semua pengguna Kubernetes merasa mereka tidak perlu memodifikasi penjadwal tersebut.

Penjadwal juga mendukung [_webhook_](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md) yang memperbolehkan sebuah _webhook backend_ (perluasan penjadwal) untuk menyaring dan memprioritaskan Node yang terpilih untuk sebuah Pod.




## {{% heading "whatsnext" %}}


* Pelajari lebih lanjut tentang [Sumber Daya _Custom_](/docs/concepts/api-extension/custom-resources/)
* Pelajari tentang [Kontrol Admisi Dinamis](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Pelajari lebih lanjut tentang perluasan Infrastruktur
  * [_Plugin_ Jaringan](/docs/concepts/cluster-administration/network-plugins/)
  * [_Plugin_ Perangkat](/docs/concepts/cluster-administration/device-plugins/)
* Pelajari tentang [_Plugin_ kubectl](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Pelajari tentang [Pola Operator](/id/docs/concepts/extend-kubernetes/operator/)


