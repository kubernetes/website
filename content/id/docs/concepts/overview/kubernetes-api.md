---
reviewers:
- girikuncoro
title: API Kubernetes
content_template: templates/concept
weight: 30
card: 
  name: concepts
  weight: 30
---

{{% capture overview %}}

Secara keseluruhan standar yang digunakan untuk API dijelaskan di dalam [dokumentasi API standar](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

<i> Endpoints API </i>, <i> resource types </i> serta contoh penggunaan dijelaskan di dalam [API Reference]().

Akses <i> remote </i> penggunaan <i> API </i> dijelaskan di dalam [dokumentasi akses API]().

API Kubernetes berperan sebagai landasan konfigurasi deklaratif yang digunakan. Sementara itu, [kubectl]() merupakan <i> command-line </i> yang dapat digunakan untuk membuat, mengupdate, menghapus, dan mendapatkan objek API. 

Kubernetes menyimpan <i> serialized state </i> dari object <i> API </i> yang dimilikinya di dalam [etcd]().

Kubernetes sendiri dibagi menjadi beberapa komponen yang saling dapat saling berinteraksi melalui <i> API </i>. 

{{% /capture %}}


{{% capture body %}}

## Perubahan <i> API </i>

Berdasarkan pengalaman kami, semua sistem yang berhasil memerlukan kebutuhan 
untuk terus tumbuh dan berkembang seiring dengan bertambahnya <i> use case </i> 
yang ada. Dengan deikian, kami berharap <i> API </i> untuk selalu berubah seiring 
dengan kebutuhan yang ada. Meskipun begitu, perubahan yang ada diharapkan untuk selalu 
menyesuiaikan dalam hal kompatibilitas dengan implementasi sebelumnya untuk jangka waktu tertentu. 
Secara umum, sebuah <i> resource API </i> atau sebuah <i> field resource </i> bisa jadi sering 
ditambahkan. Penghapusan <i> resource API </i> atau suatu <i> field </i>, di sisi lain, 
diharapkan untuk dapat memenuhi [kaidah deprecation API](/docs/reference/using-api/deprecation-policy/).

Hal-hal apa saja yang perlu diperhatikan untuk menjamin kompatibilitas <i> API </i> 
secara mendetail dibahas di dalam [dokumentasi perubahan API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md).

## Definisi Swagger dan OpenAPI

Detail mengenai <i> API </i> didokumentasikan dengan menggunakan [OpenAPI](https://www.openapis.org/).

Semenjak Kubernetes versi 1.10, Kubernetes menghadirkan spesifikasi <i> OpenAPI </i> melalui <i> endpoint </i> `/openapi/v2`.
Format <i> request </i> yang dapat diterapkan dengan cara menambhakan <i> header HTTP </i>:

Header | Nilai yang mungkin
------ | ---------------
Accept | `application/json`, `application/com.github.proto-openapi.spec.v2@v1.0+protobuf` (<i> content-type </i> standar yang digunakan adalah `application/json` untuk `*/*`)
Accept-Encoding | `gzip` 

Sebelum versi 1.14, terdapat 4 buah <i> endpoint </i> yang menyediakan spesifikasi <i> OpenAPI </i> 
dalam format berbeda yang dapat digunakan (`/swagger.json`, `/swagger-2.0.0.json`, `/swagger-2.0.0.pb-v1`, `/swagger-2.0.0.pb-v1.gz`). 
<i> Enpoint </i> ini bersifat <i> deprecated </i> dan akan dihapus pada Kubernetes versi 1.14. 

**Cara mendapatkan spesifikasi <i> OpenAPI </i>**:

Sebelum 1.10 | Mulai Kubernetes 1.10
----------- | -----------------------------
GET /swagger.json | GET /openapi/v2 **Accept**: application/json
GET /swagger-2.0.0.pb-v1 | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf
GET /swagger-2.0.0.pb-v1.gz | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf **Accept-Encoding**: gzip

Kubernetes juga menyediakan alternatif mekanisme <i> serialization </i> lain, 
yaitu dengan menggunakan <i> Protobuf </i>, yang secara umum digunakan untuk mekanisme komunikasi 
intra-kluster, hal ini didokumentasikan di dalam [design proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) 
serta berkas IDL sebagai bentuk spesifikasi skema berada dalam <i> package </i> <i> Go </i> 

Sebelum Kubernetes versi 1.14, <i> apiserver </i> Kubernetes juga mengekspos <i> API </i> 
yang dapat digunakan untuk mendapatkan spesifikasi [Swagger v1.2](http://swagger.io/) pada <i> endpoint </i> `/swaggerapi`.
<i> Endpoint </i> ini akan sudah bersifat <i> deprecated </i> dan akan dihapus pada 
Kubernetes versi 1.14. 

## <i> API versioning </i>

Untuk memudahkan mekanisme restruktur <i> field </i> dan <i> resource </i> yang ada, 
Kubernetes menyediakan beberapa versi <i> API </i> yang berada pada <i> path </i> yang berbeda, 
misalnya `/api/v1` atau `/apis/extensions/v1beta1`.

Kita dapat memilih versi yang akan digunakan pada tingkatan <i> API </i> 
dan bukan pada tingkatan <i> field </i> atau <i> resource </i> untuk memastikan 
<i> API </i> yang digunakan memperlihatkan gambaran yang jelas serta konsisten 
mengenai <i> resoure </i> dan sifat sistem yang ada.

Perhatikan bahwa <i> API versioning </i> dan <i> Software versioning </i> memiliki keterkaitan secara tak langsung.
Proposal [API and release
versioning](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) memberikan deskripsi keterkaitan antara 
<i> API versioning </i> dan <i> Software versioning </i>.

<i> API </i> dengan versi yang berbeda menunjukan tingkatan kestabilan dan dukungan yang diberikan pada versi tersebut. 
Kriteria untuk setiap tingkatan dideskripsikan secara lebih detail di dalam 
[dokumentasi perubahan API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions).  They are summarized here:

- Tingatan <i> Alpha </i>:
  - Nama dari versi ini mengandung string `alpha` (misalnya, `v1alpha1`).
  - Bisa jadi terdapat <i> bug </i>. Secara <i> default </i> fitur ini tidak diekspos. 
  - Dukungan untuk fitur yang ada bisa saja dihilangkan pada suatu waktu tanpa pemberitahuan sebelumnya. 
  - <i> API </i> yang ada mungkin saja berubah tanpa memperhatikan kompatibilitas dengan versi perangkat lunak sebelumnya.
  - Hanya direkomendasikan untuk kluster yang digunakan untuk tujuan <i> testing </i>. 
- Tingkatan <i> Beta </i>:
  - Nama dari versi ini mengandung string `beta` (misalnya `v2beta3`).
  - Kode yang ada sudah melalui mekanisme <i> testing </i> yang cukup baik. Menggunakan fitur ini dianggap cukup aman. Fitur ini diekspos secara <i> default </i>.
  - Dukungan untuk fitur secara menyeluruh tidak akan dihapus, meskipun begitu detail untuk suatu fitur bisa saja berubah. 
  - Skema dan/atau semantik dari suatu objek mungkin saja berubah tanpa memerhatikan kompatibilitas pada rilis <i> beta </i> selanjutnya. 
    Jika hal ini terjadi, kami akan menyediakan suatu instruksi untuk melakukan migrasi di versi rilis selanjutnya. Hal ini bisa saja meliputi menhapus, mengubah, atau membuat ulang 
    objek <i> API </i>. Proses pengubahan mungkin saja membutuhkan pemikiran yang matang. Dampak proses ini bisa saja menyebabkan <i> downtime </i> aplikasi yang bergantung pada fitur ini.
  - Disarankan hanya untuk digunakan untuk penggunaan yang <i> non-business-critical </i>. 
  - **Kami mohon untuk mencoba versi <i> beta </i> yang kami sediakan dan berikan umpan balik terhadap fitur yang kamu pakai! Apabila fitur tersebut sudah tidak lagi berada di dalam tingkatan <i> beta </i> perubahan yang kami buat terhadap fitur tersebut bisa jadi tidak lagi praktis**
- Tingkatan stabil:
  - Nama dari versi ini mengandung string `vX` dimana `X` merupakan bilangan bulat.
  - Fitur yang ada pada tingkatan ini akan selalu muncul di rilis berikutnya. 

## <i> API groups </i>

Untuk memudahkan proses <i> extend </i> suatu <i> API </i> Kubernetes, kami mengimplementasikan [*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md).
<i> API group </i> ini dispesifikasikan di dalam <i> path </i> <i> REST </i> serta di dalam <i> field </i> `apiVersion` dari sebuah objek yang diserialisasi.

Saat ini, terdapat beberapa <i> API groups </i> yang digunakan:

1. Kelompok *core*, seringkali disebut sebagai *legacy group*, berada pada <i> path </i> <i> REST </i> `/api/v1` serta menggunakan `apiVersion: v1`.

1. <i> Named groups </i> berada pada <i> path </i> <i> REST </i> `/apis/$GROUP_NAME/$VERSION`, serta menggunakan `apiVersion: $GROUP_NAME/$VERSION`
   (misalnya `apiVersion: batch/v1`). Daftar menyeluruh mengenai apa saja <i> API groups </i> dapat dilihat di [Kubernetes API reference](/docs/reference/).


Terdapat dua <i> path </i> yang digunakan untuk meng-<i>extend</i> <i> API </i> dengan [custom resources]():

1. [CustomResourceDefinition]()
   digunakan untuk pengguna dengan kebutuhan <i> CRUD </i> yang mendasar.
1. Pengguna yang membutuhkan seperangkat semantik <i> API </i> Kubernetes API dapat mengimplementasikan <i> apiserver </i> mereka sendiri.
   dengan menggunakan [aggregator]()
   untuk membuat integrasi dengan klien menjadi lebih mudah.


## <i> Enabling API groups </i>

Beberapa <i> resources </i> dan <i> API groups </i> sudah di-<i>enable</i> secara <i> default </i>. 
<i> Resource </i> dan <i> API groups </i> ini dapat di-<i>enable</i> dan di-<i>disable</i> dengan mengatur penanda `--runtime-config`
pada <i> apiserver </i>. `--runtime-config` menerima nilai yang dipisahkan oleh koma. Sebagai contoh: untuk men-<i>disable</i> batch/v1, tetapkan
`--runtime-config=batch/v1=false`, untuk meng-<i>enable</i> batch/v2alpha1, tetapkan `--runtime-config=batch/v2alpha1`.
Penanda menerima nilai yang dipisahkan oleh pasangan kunci=nilai yang mendeskripsikan konfigurasi <i> runtime </i> pada <i> apiserver </i>.

PENTING: Melakukan proses <i> enable </i> atau <i> disable </i> <i> groups </i> atau <i> resources </i> 
membutuhkan mekanisme <i> restart </i> <i> apiserver </i> dan <i> controller-manager </i>
agar <i> apiserver </i> dapat menerima perubahan `--runtime-config`.

## <i> Enabling resources in the groups </i>

<i> DaemonSets </i>, <i> Deployments </i>, <i> HorizontalPodAutoscalers </i>, 
<i> Ingresses </i>, <i> Jobs </i>, dan <i> ReplicaSets </i> di-<i>enable</i> secara <i> default </i>.
Ekstensi lain dapat di-<i>enable</i> penanda `--runtime-config` pada <i>apiserver</i>. Penanda `--runtime-config` menerima nilai yang dipisahkan oleh koma.
 Sebagai contoh untuk men-<i>disable</i> <i>deployments</i> dan <i>ingress</i>, tetapkan.
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingresses=false`

{{% /capture %}}
