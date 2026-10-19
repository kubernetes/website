---
title: Custom Resource
content_type: concept
weight: 20
---

<!-- overview -->

_Custom Resource_ adalah ekstensi dari Kubernetes API. Laman ini mendiskusikan kapan kamu melakukan penambahan sebuah _Custom Resource_ ke klaster Kubernetes dan kapan kamu menggunakan sebuah layanan mandiri. Laman ini mendeskripsikan dua metode untuk menambahkan _Custom Resource_ dan bagaimana cara memilihnya.



<!-- body -->

## _Custom Resource_

Sebuah sumber daya adalah sebuah *endpoint* pada [Kubernetes API](/docs/reference/using-api/api-overview/) yang menyimpan sebuah koleksi [objek API](/id/docs/concepts/overview/working-with-objects/kubernetes-objects/) dari sebuah jenis tertentu. Sebagai contoh, sumber daya bawaan Pod mengandung sebuah koleksi objek-objek Pod.

Sebuah _Custom Resource_ adalah sebuah ekstensi dari Kubernetes API yang tidak seharusnya tersedia pada pemasangan default Kubernetes. Namun, banyak fungsi-fungsi inti Kubernetes yang sekarang dibangun menggunakan _Custom Resource_, membuat Kubernetes lebih modular.

_Custom Resource_ bisa muncul dan menghilang dalam sebuah klaster yang berjalan melalui registrasi dinamis (_dynamic registration_), dan admin-admin klaster bisa memperbaharui _Custom Resource_ secara independen dari klaster itu sendiri. Ketika sebuah _Custom Resource_
dipasang, pengguna dapat membuat dan mengakses objek-objek _Custom Resource_ menggunakan [kubectl](/docs/user-guide/kubectl-overview/), seperti yang mereka lakukan untuk sumber daya bawaan seperti Pod.

## _Controller_ Khusus

Dengan sendirinya, _Custom Resource_ memungkinkan kamu untuk menyimpan dan mengambil data terstruktur. Ketika kamu menggabungkan sebuah _Custom Resource_ dengan _controller_ khusus, _Custom Resource_ akan memberikan sebuah API deklaratif yang sebenarnya.

Sebuah [API deklaratif](/id/docs/concepts/overview/working-with-objects/kubernetes-objects/#memahami-konsep-objek-objek-yang-ada-pada-kubernetes)
memungkinkan kamu untuk mendeklarasikan atau menspesifikasikan keadaan dari sumber daya kamu dan mencoba untuk menjaga agar keadaan saat itu tersinkronisasi dengan keadaan yang diinginkan. *Controller* menginterpretasikan data terstruktur sebagai sebuah rekaman dari keadaan yang diinginkan pengguna, dan secara kontinu menjaga keadaan ini.

Kamu bisa men-_deploy_ dan memperbaharui sebuah _controller_ khusus pada sebuah klaster yang berjalan, secara independen dari siklus hidup klaster itu sendiri. _Controller_ khusus dapat berfungsi dengan sumber daya jenis apapun, tetapi mereka sangat efektif ketika dikombinasikan dengan _Custom Resource_. [_Operator pattern_](https://coreos.com/blog/introducing-operators.html) mengkombinasikan _Custom Resource_ dan _controller_ khusus. Kamu bisa menggunakan _controller_ khusus untuk menyandi pengetahuan domain untuk aplikasi spesifik menjadi sebuah ekstensi dari Kubernetes API.

## Haruskah _Custom Resource_ ditambahkan ke dalam klaster Kubernetes saya?

Ketika membuat sebuah API baru, pikirkan apakah kamu ingin [mengagregasikan API kamu dengan API klaster Kubernetes](/docs/concepts/api-extension/apiserver-aggregation/) atau membiarkan API kamu berdiri sendiri.

| Pilih agregasi API jika: | Pilih sebuah API yang berdiri sendiri jika: |
| ---------------------------- | ---------------------------- |
| API kamu bersifat [Deklaratif](#api-deklaratif). | API kamu tidak cocok dengan model [Deklaratif](#api-deklaratif). |
| Kamu mau tipe baru yang dapat dibaca dan ditulis dengan `kubectl`.| Dukungan `kubectl` tidak diperlukan |
| Kamu mau melihat tipe baru pada sebuah Kubernetes UI, seperti dasbor, bersama dengan tipe-tipe bawaan. | Dukungan Kubernetes UI tidak diperlukan. |
| Kamu mengembangkan sebuah API baru. | Kamu memiliki sebuah program yang melayani API kamu dan dapat berkerja dengan baik. |
| Kamu bersedia menerima pembatasan format yang Kubernetes terapkan pada jalur sumber daya API (Lihat [Ikhtisar API](/id/docs/concepts/overview/kubernetes-api/).) | Kamu perlu memiliki jalur REST spesifik agar menjadi cocok dengan REST API yang telah didefinisikan. |
| Sumber daya kamu secara alami mencakup hingga sebuah klaster atau sebuah *namespace* dari sebuah klaster. | Sumber daya yang mencakup klaster atau *namespace* adalah sebuah ketidakcocokan; kamu perlu mengendalikan jalur sumber daya spesifik. |
| Kamu ingin menggunakan kembali [dukungan fitur Kubernetes API](#fitur-umum).  | Kamu tidak membutuhkan fitur tersebut. |

### API Deklaratif

Dalam sebuah API Deklaratif, biasanya:

- API kamu terdiri dari sejumlah kecil dari objek yang berukuran relatif kecil (sumber daya).
- Objek-objek mendefinisikan pengaturan dari aplikasi atau infrastruktur.
- Objek-objek relatif tidak sering diperbaharui.
- Manusia sering diperlukan untuk membaca dan menulis objek-objek tersebut.
- Operasi utama terhadap objek bersifat CRUD (*creating, reading, updating,* dan *deleting*).
- Transaksi antar objek tidak dibutuhkan; API merepresentasikan sebuah keadaan yang diinginkan, bukan keadaan yang eksak.

API imperatif bersifat tidak deklaratif.
Tanda-tanda apabila API kamu tidak deklaratif termasuk:
- klien berkata "lakukan ini", dan kemudian mendapat sebuah respon serempak ketika selesai.
- klien berkata "lakukan ini", dan kemudian mendapat sebuah ID operasi kembali, dan harus melakukan sebuah cek terhadap objek _Operation_ terpisah untuk menentukan selesainya sebuah permintaan.
- Kamu berbicara tentang _Remote Procedure Call_ (RPC).
- Menyimpan secara langsung sejumlah data (mis. > beberapa kB per objek, atau >1000-an objek).
- Membutuhkan akses dengan _bandwidth_ tinggi (10-an permintaan per detik dapat ditopang).
- Menyimpan data pengguna (seperti gambar, PII, dll) atau data berskala besar yang diproses oleh aplikasi.
- Operasi-operasi natural terhadap objek yang tidak bersifat CRUD.
- API yang tidak mudah dimodelkan dengan objek.
- Kamu memilih untuk merepresentasikan operasi tertunda dengan sebuah ID operasi atau sebuah objek operasi.

## Apakah saya harus menggunakan sebuah ConfigMap atau sebuah _Custom Resource_?

Gunakan ConfigMap jika salah satu hal berikut berlaku:
* Terdapat sebuah format berkas pengaturan yang sudah ada, yang terdokumentasi dengan baik seperti sebuah `mysql.cnf` atau `pom.xml`.
* Kamu ingin menaruh seluruh berkas pengaturan kedalam sebuah *key* dari sebuah ConfigMap.
* Kegunaan utama dari berkas pengaturan adalah untuk dikonsumsi sebuah program yang berjalan di dalam sebuah Pod di dalam klaster kamu untuk mengatur dirinya sendiri.
* Konsumen dari berkas lebih suka untuk mengkonsumsi lewat berkas dalam sebuah Pod atau variabel lingkungan dalam sebuah Pod, dibandingkan melalui Kubernetes API.
* Kamu ingin melakukan pembaharuan bergulir lewat Deployment, dll, ketika berkas diperbaharui.

{{< note >}}
Gunakan sebuah [Secret](/id/docs/concepts/configuration/secret/) untuk data sensitif, yang serupa dengan ConfigMap tetapi lebih aman.
{{< /note >}}

Gunakan sebuah _Custom Resource_ (CRD atau _Aggregated API_) jika kebanyakan dari hal berikut berlaku:

* Kamu ingin menggunakan pustaka klien Kubernetes dan CLI untuk membuat dan memperbaharui sumber daya baru.
* Kamu ingin dukungan tingkat tinggi dari kubectl (sebagai contoh: `kubectl get my-object object-name`).
* Kamu ingin membangun sebuah otomasi baru yang mengawasi pembaharuan terhadap objek baru, dan kemudian melakukan CRUD terhadap objek lainnya, atau sebaliknya.
* Kamu ingin menulis otomasi yang menangani pembaharuan untuk objek.
* Kamu ingin menggunakan kesepakatan API Kubernetes seperti `.spec`, `.status`, dan `.metadata`.
* Kamu ingin objek tersebut untuk menjadi sebuah abstraksi terhadap sebuah kumpulan dari sumber daya terkontrol, atau peringkasan dari sumber daya lainnya.

## Menambahkan _Custom Resource_

Kubernetes menyediakan dua cara untuk menambahkan sumber daya ke klaster kamu:
- CRD cukup sederhana dan bisa diciptakan tanpa pemrograman apapun.
- [Agregasi API](/id/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) membutuhkan pemrograman, tetapi memungkinkan kendali lebih terhadap perilaku API seperti bagaimana data disimpan dan perubahan antar versi API.

Kubernetes menyediakan kedua opsi tersebut untuk memenuhi kebutuhan pengguna berbeda, jadi tidak ada kemudahan penggunaan atau fleksibilitas yang dikompromikan.

_Aggregated API_ adalah bawahan dari APIServer yang duduk dibelakang API server utama, yang bertindak sebagai sebuah _proxy_. Pengaturan ini disebut [Agregasi API](/id/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) (AA). Untuk pengguna, yang terlihat adalah Kubernetes API yang diperluas.

CRD memungkinkan pengguna untuk membuat tipe baru sumber daya tanpa menambahkan APIserver lain. Kamu tidak perlu mengerti Agregasi API untuk menggunakan CRD.

Terlepas dari bagaimana cara mereka dipasang, sumber daya baru disebut sebagai _Custom Resource_ untuk memisahkan mereka dari sumber daya bawaan Kubernetes (seperti Pod).

## CustomResourceDefinition

Sumber daya API [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/) memungkinkan kamu untuk medefinisikan _Custom Resource_. Mendefinisikan sebuah objek CRD akan membuat sebuah _Custom Resource_ dengan sebuah nama dan skema yang kamu spesifikasikan. Kubernetes API melayani dan menangani penyimpanan dari _Custom Resource_ kamu.

Ini membebaskan kamu dari menulis server API kamu sendiri untuk menangani _Custom Resource_, tetapi sifat dasar dari implementasi menyebabkan kamu memiliki fleksibilitas yang berkurang dibanding [agregasi server API](#agregasi-server-api)).

Lihat [contoh *controller* khusus](https://github.com/kubernetes/sample-controller) sebagai sebuah contoh dari bagaimana cara untuk mendaftarkan sebuah _Custom Resource_, bekerja dengan instans dari tipe baru sumber daya kamu, dan menggunakan sebuah *controller* untuk menangani *event*.

## Agregasi server API

Biasanya, tiap sumber daya di API Kubernetes membutuhkan kode yang menangani permintaan REST dan mengatur peyimpanan tetap dari objek-objek. Server Kubernetes API utama menangani sumber daya bawaan seperti Pod dan Service, dan juga menangani _Custom Resource_ dalam sebuah cara yang umum melalui [CRD](#customresourcedefinition).

[Lapisan agregasi](/id/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) memungkinkan kamu untuk menyediakan implementasi khusus untuk _Custom Resource_ dengan menulis dan men-_deploy_ API server kamu yang berdiri sendiri. API server utama menlimpahkan permintaan kepada kamu untuk _Custom Resource_ yang kamu tangani, membuat mereka tersedia untuk semua kliennya.

## Memilih sebuah metode untuk menambahkan _Custom Resource_

CRD lebih mudah digunakan. _Aggregated API_ lebih fleksibel. Pilih metode yang paling baik untuk kebutuhan kamu.

Biasanya, CRD cocok jika:

* Kamu memiliki *field* yang banyak
* Kamu menggunakan sumber daya dalam perusahaan kamu, atau sebagai bagian dari proyek *open-source* kecil (berlawanan dengan sebuah produk komersil)

### Membandingkan kemudahan penggunaan

CRD lebih mudah dibuat dibandingkan dengan _Aggregated API_.

| CRD                        | Aggregated API |
| --------------------------- | -------------- |
| Tidak membutuhkan pemrograman. Pengguna dapat memilih bahasa apapun untuk sebuah *controller* CRD. | Membutuhkan pemrograman dalam Go dan membangun *binary* dan *image*. Pengguna dapat memilih bahasa apapun untuk sebuah CRD *controller*. |
| Tidak ada servis tambahan yang dijalankan; CR ditangani oleh server API. | Sebuah servis tambahan untuk menciptakan dan dapat gagal. |
| Todal ada dukungan berjalan ketika CRD dibuat. Perbaikan *bug* apapun akan dianggap sebagai bagian dari peningkatan Kubernetes Master normal. | Mungkin dibutuhkan untuk secara berkala mengambil perbaikan *bug* dari sumber dan membangun ulang dan memeperbaharui APIserver teragregasi. |
| Tidak butuh untuk menangani banyak versi dari API kamu. Sebagai contoh: ketika kamu mengendalikan klien untuk sumber daya ini, kamu bisa meningkatkannya selaras dengan API. | Kamu perlu menangani banyak versi dari API kamu, sebagai contoh: ketika mengembangkan sebuah ekstensi untuk dibagikan kepada dunia. |

### Fitur lanjutan dan fleksibilitas

_Aggregated API_ menawarkan fitur API lebih lanjut dan kustomisasi dari fitur lain, sebagai contoh: lapisan penyimpanan.

| Fitur | Deskripsi | CRD | Aggregated API |
| ------- | ----------- | ---- | -------------- |
| Validation | Membantu pengguna-pengguna mencegah error dan memungkinkan kamu untuk mengembangkan API kamu secara independen dari klien-klien kamu. Fitur ini sangan berguna ketika ada banyak klien yang tidak semua bisa memperbaharui secara bersamaan pada waktu yang sama. | Ya. Sebagian besar validasi dapat dipesifikasikan di dalam CRD [OpenAPI v3.0 _validation_](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#validation).  Validasi bentuk lainnya didukung dengan penambahan sebuah [_Validating Webhook_](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook-alpha-in-1-8-beta-in-1-9). | Ya, cek validasi secara arbitrer |
| Defaulting | Lihat diatas | Ya, baik melalui [OpenAPI v3.0 _validation_](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#defaulting) `default` keyword (GA in 1.17), maupun melalui sebuah [_Mutating Webhook_](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) (meskipun tidak akan dijalankan ketika membaca dari etcd untuk objek-objek lama) | Ya |
| Multi-versioning | Memungkinkan menyajikan objek yang sama lwat dua versi API. Bisa membantu memudahkan perubahan API seperti menamai ulang *field-field*. Tidak terlalu penting jika kamu mengendalikan versi-versi klien kamu. | [Ya](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definition-versioning) | Ya |
| Custom Storage | Jika kamu membutuhkan penyimpanan dengan sebuah mode performa (sebagai contoh, basis data *time-series* dibanding penyimpanan *key-value*) atau isolasi untuk keamanan (sebagau contoh, rahasia penyandian atau berkas berbeda) | Tidak | Ya |
| Custom Business Logic | Melakukan cek arbitrer atau tindakan-tindakan ketika membuat, membaca, atau memperbaharui sebuah objek | Ya, menggunakan [_Webhooks_](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks). | Ya |
| Scale Subresource | Memungkinkan sistem-sistem seperti HorizontalPodAutoscaler dan PodDisruptionBudget untuk berinteraksi dengan sumber daya baru | [Ya](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#scale-subresource)  | Ya |
| Status Subresource | <ul><li>kontrol akses yang lebih baik: pengguna menulis bagian *spec*, *controller* menulis bagian status.</li><li>Memungkinkan pembuatan objek bertambah pada mutasi data _Custom Resource_ (membutuhkan *spec* terpisah dan bagian status pada sumber daya)</li></ul> | [Ya](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#status-subresource) | Ya |
| Other Subresources | Menambahkan operasi selain CRUD, seperti "logs" atau "exec". | Tidak | Ya |
| strategic-merge-patch | *Endpoint-endpoint* baru yang mendukung PATCH dengan `Content-Type: application/strategic-merge-patch+json`. Berguna untuk memperbaharui objek-objek yang mungkin dapat dimodifikasi baik secara lokal, dan maupun lewat server. Untuk informasi lebih lanjut, lihat ["Update API Objects in Place Using kubectl patch"](/docs/tasks/run-application/update-api-object-kubectl-patch/) | Tidak | Ya |
| Protocol Buffers | sumber daya baru mendukung klien-klien yang ingin menggunakan _Protocol Buffer_ | Tidak | Ya |
| OpenAPI Schema | Apakah ada sebuah skema OpenAPI (swagger) untuk tipe yang bisa secara dinamis diambil dari server? Apakah pengguna terlindungi dari kesalahan pengejaan nama-nama *field* dengan memastikan bahwa hanya *field* yang diperbolehkan yang boleh diisi? Apakah tipe-tipe diberlakukan (dengan kata lain, jangan menaruh sebuah `int` di dalam *field* `string`?) | Ya, berdasarkan pada skema [OpenAPI v3.0 validation](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#validation) (GA pada 1.16) | Ya |

### Fitur Umum

Ketika kamu membuat sebuah _Custom Resource_, baik melalui sebuah CRD atau sebuah AA, kamu mendapat banyak fitur untuk API kamu, dibandingkan dengan mengimplementasikannya diluar platform Kubernetes.

| Fitur | Apa yang dilakukannya |
| ------- | ------------ |
| CRUD | *Endpoint-endpoint* baru yang mendukung operasi dasar melalui HTTP dan `kubectl` |
| Watch | *Endpoint-endpoint* baru yang mendukung operasi Kubernetes Watch melalui HTTP |
| Discovery | Klien seperti kubectl dan dasbor yang secara otomatis menawarkan operasi *list*, *display*, dan pembaharuan *field* pada sumber daya kamu. |
| json-patch | *Endpoint-endpoint* baru yang mendukung PATCH dengan `Content-Type: application/json-patch+json` |
| merge-patch | *Endpoint-endpoint* baru yang mendukung PATCH dengan `Content-Type: application/merge-patch+json` |
| HTTPS | *Endpoint-endpoint* menggunakan HTTPS |
| Built-in Authentication | Akses ke ekstensi yang menggunakan _apiserver_ inti (lapisan agregasi) untuk otentikasi |
| Built-in Authorization | Akses ke ekstensi dapat menggunakan ulang otorisasi yang digunakan oleh _apiserver_ inti (mis. RBAC) |
| Finalizers | Penghapusan blok dari ekstensi sumber daya hingga pembersihan eksternal terjadi. |
| Admission Webhooks | Menentukan nilai default dan memvalidasi ekstensi sumber daya saat terjadi operasi *create/update/delete* apapun. |
| UI/CLI Display | Kubectl, dasbor dapat menampilkan ekstensi sumber daya |
| Unset vs Empty | Klien-klien dapat membedakan *field-field* yang tidak diisi dari *field-field* yang memiliki nilai nol. |
| Client Libraries Generation | Kubernetes menyediakan pustaka klien dasar, juga alat-alat untuk membuat pustaka klien dengan tipe spesifik. |
| Labels and annotations | Metadata umum lintas objek yang cara untuk memperbaharui sumber daya inti dan _Custom Resource_-nya diketahui oleh alat-alat. |

## Persiapan pemasangan sebuah _Custom Resource_

Ada beberapa poin yang harus diperhatikan sebelum menambahkan sebuah _Custom Resource_ ke klaster kamu.

### Kode pihak ketiga dan poin kegagalan baru

Saat membuat sebuah CRD tidak secara otomatis menambahkan titik-titik kegagalan baru (sebagai contoh, dengan menyebabkan kode pihak ketiga untuk berjalan di API server kamu), paket-paket (sebagai contoh, _Chart_) atau bundel pemasangan lain seringkali sudah termasuk CRD dan juga sebagai Deployment dari kode pihak ketiga yang mengimplementasi logika bisnis untuk sebuah _Custom Resource_.

Memasang sebuah APIserver teragregasi selalu melibatkan tindakan menjalankan Deployment baru.

### Penyimpanan

_Custom Resource_ mengkonsumsi ruang penyimpanan dengan cara yang sama dengan ConfigMap. Membuat terlalu banyak sumber daya mungkin akan memenuhi ruang penyimpanan server API kamu.

Server _Aggregated API_ dapat menggunakan penyimpanan yang sama dengan server API utama, dimana peringatan yang sama berlaku.

### Authentication, authorization, and auditing

CRD selalu menggunakan otentikasi, otorisasi, dan audit pencatatan yang sama sebagai sumber daya bawaan dari server API kamu.

Jika kamu menggunakan RBAC untuk otorisasi, sebagian besar *role* RBAC tidak akan mengizinkan akses ke sumber daya baru (kecuali *role cluster-admin* atau *role* apapun yang dibuat menggunakan aturan *wildcard*). Kamu akan dibutuhkan untuk secara eksplisit mengizinkan akses ke sumber daya baru. CRD dan _Aggregated API_ seringkali dibundel dengan definisi *role* baru untuk tipe yang mereka tambahkan.

API server teragregasi dapat atau tidak dapat menggunakan otentikasi, otorisasi, dan pengauditan yang sama dengan server API utama.

## Mengakses sebuah _Custom Resource_

[Pustaka klien](/docs/reference/using-api/client-libraries/) Kubernetes dapat digunakan untuk mengakses _Custom Resource_. Tidak semua pustaka klien mendukung _Custom Resource_. Pustaka klien go dan python melakukannya.

Ketika kamu menambahkan sebuah _Custom Resource_, kamu dapat mengaksesnya dengan menggunakan:

- kubectl
- Klien dinamis kubernetes.
- Sebuah klien REST yang kamu tulis
- Sebuah klien yang dibuat menggunakan [Kubernetes client generation tools](https://github.com/kubernetes/code-generator) (membuat satu adalah usaha lanjutan, tetapi beberapa proyek mungkin menyajikan sebuah klien bersama dengan CRD atau AA).



## {{% heading "whatsnext" %}}


* Belajar bagaimana untuk [Memperluas Kubernetes API dengan lapisan agregasi](/id/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

* Belajar bagaimana untuk [Memperluas Kubernetes API dengan CustomResourceDefinition](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/).


