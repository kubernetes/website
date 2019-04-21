---
title: API Kubernetes
content_template: templates/concept
weight: 30
card: 
  name: concepts
  weight: 30
---

{{% capture overview %}}

Secara keseluruhan standar yang digunakan untuk API dijelaskan di dalam [dokumentasi API standar](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

<i>Endpoints API</i>, <i>resource types</i> serta contoh penggunaan dijelaskan di dalam [API Reference](/en/docs/reference).

Akses <i>remote</i> penggunaan API dijelaskan di dalam [dokumentasi akses API](/en/docs/reference/access-authn-authz/controlling-access/).

API Kubernetes juga berperan sebagai skema konfigurasi yang deklaratif di dalam sistem.. Sementara itu, [kubectl](/en/docs/reference/kubectl/overview/) merupakan <i>command-line</i> yang dapat digunakan untuk membuat, menmperbaharui, menghapus, dan mendapatkan obyek API. 

Kubernetes menyimpan bentuk terserialisasi dari obyek API yang dimilikinya di dalam [etcd](https://coreos.com/docs/distributed-configuration/getting-started-with-etcd/).

Kubernetes sendiri dibagi menjadi beberapa komponen yang saling dapat saling interaksi melalui API. 

{{% /capture %}}


{{% capture body %}}

## Perubahan API

Berdasarkan pengalaman kami, semua sistem yang berhasil memerlukan kebutuhan 
untuk terus tumbuh dan berkembang seiring dengan bertambahnya kebutuhan
yang ada. Dengan demikian, kami berekspektasi bahwa API akan selalu berubah seiring dengan bertambahnya kebutuhan yang ada. 
Meski begitu, perubahan yang ada akan selalu kompatibel dengan implementasi sebelumnya, untuk jangka waktu tertentu. 
Secara umum, penambahan pada sebuah resource API atau field resource bisa sering terjadi.. Penghapusan <i>resource API</i> atau suatu <i>field</i>, di sisi lain, 
diharapkan untuk dapat memenuhi [kaidah deprecation API](/docs/reference/using-api/deprecation-policy/).

Hal-hal apa saja yang perlu diperhatikan untuk menjamin kompatibilitas API 
secara rinci dibahas di dalam [dokumentasi perubahan API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md).

## Swagger and OpenAPI Definition

Detail mengenai API didokumentasikan dengan menggunakan [OpenAPI](https://www.openapis.org/).

Semenjak Kubernetes versi 1.10, Kubernetes menghadirkan spesifikasi <i>OpenAPI</i> melalui <i>endpoint</i> `/openapi/v2`.
Format <i>request</i> dapat diterapkan dengan cara menambahkan <i>header HTTP</i>:

Header | Opsi
------ | ---------------
Accept | `application/json`, `application/com.github.proto-openapi.spec.v2@v1.0+protobuf` (<i>content-type</i> standar yang digunakan adalah `application/json` untuk `*/*`)
Accept-Encoding | `gzip` 

Sebelum versi 1.14, terdapat 4 buah <i>endpoint</i> yang menyediakan spesifikasi <i>OpenAPI</i> 
dalam format berbeda yang dapat digunakan (`/swagger.json`, `/swagger-2.0.0.json`, `/swagger-2.0.0.pb-v1`, `/swagger-2.0.0.pb-v1.gz`). 
<i>Endpoint</i> ini bersifat <i>deprecated</i> dan akan dihapus pada Kubernetes versi 1.14. 

**Cara mendapatkan spesifikasi <i>OpenAPI</i>**:

Sebelum 1.10 | Mulai Kubernetes 1.10
----------- | -----------------------------
GET /swagger.json | GET /openapi/v2 **Accept**: application/json
GET /swagger-2.0.0.pb-v1 | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf
GET /swagger-2.0.0.pb-v1.gz | GET /openapi/v2 **Accept**: application/com.github.proto-openapi.spec.v2@v1.0+protobuf **Accept-Encoding**: gzip

Kubernetes juga menyediakan alternatif mekanisme serialisasi lain, 
yaitu dengan menggunakan <i>Protobuf</i>, yang secara umum digunakan untuk mekanisme komunikasi 
intra-kluster, hal ini didokumentasikan di dalam [proposal desain](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/protobuf.md) 
serta berkas IDL sebagai bentuk spesifikasi skema berada dalam <i>package</i> Go 

Sebelum Kubernetes versi 1.14, <i>apiserver</i> Kubernetes juga mengekspos API 
yang dapat digunakan untuk mendapatkan spesifikasi [Swagger v1.2](http://swagger.io/) pada <i>endpoint</i> `/swaggerapi`.
<i>Endpoint</i> ini akan sudah bersifat <i>deprecated</i> dan akan dihapus pada 
Kubernetes versi 1.14. 

## Pemberian Versi pada API

Untuk memudahkan restrukturisasi field dan resource yang ada, 
Kubernetes menyediakan beberapa versi API yang berada pada <i>path</i> yang berbeda, 
misalnya `/api/v1` atau `/apis/extensions/v1beta1`.

Kita dapat memilih versi yang akan digunakan pada tingkatan API 
dan bukan pada tingkatan <i>field</i> atau <i>resource</i> untuk memastikan 
API yang digunakan memperlihatkan gambaran yang jelas serta konsisten 
mengenai <i>resoure</i> dan sifat sistem yang ada.

Perhatikan bahwa pemberian versi pada API dan pemberian versi pada API dan perangkat lunak memiliki keterkaitan secara tak langsung.
Proposal [API and release
versioning](https://git.k8s.io/community/contributors/design-proposals/release/versioning.md) memberikan deskripsi keterkaitan antara 
pemberian versi pada API dan pemberian versi pada perangkat lunak.

API dengan versi yang berbeda menunjukan tingkatan kestabilan dan ketersediaan yang diberikan pada versi tersebut. 
Kriteria untuk setiap tingkatan dideskripsikan secara lebih detail di dalam 
[dokumentasi perubahan API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#alpha-beta-and-stable-versions).  They are summarized here:

- Tingkatan <i>Alpha</i>:
  - Nama dari versi ini mengandung string `alpha` (misalnya, `v1alpha1`).
  - Bisa jadi terdapat <i>bug</i>. Secara <i>default</i> fitur ini tidak diekspos. 
  - Ketersediaan untuk fitur yang ada bisa saja dihilangkan pada suatu waktu tanpa pemberitahuan sebelumnya. 
  - API yang ada mungkin saja berubah tanpa memperhatikan kompatibilitas dengan versi perangkat lunak sebelumnya.
  - Hanya direkomendasikan untuk kluster yang digunakan untuk tujuan <i>testing</i>. 
- Tingkatan <i>Beta</i>:
  - Nama dari versi ini mengandung string `beta` (misalnya `v2beta3`).
  - Kode yang ada sudah melalui mekanisme <i>testing</i> yang cukup baik. Menggunakan fitur ini dianggap cukup aman. Fitur ini diekspos secara <i>default</i>.
  - Ketersediaan untuk fitur secara menyeluruh tidak akan dihapus, meskipun begitu detail untuk suatu fitur bisa saja berubah. 
  - Skema dan/atau semantik dari suatu obyek mungkin saja berubah tanpa memerhatikan kompatibilitas pada rilis <i>beta</i> selanjutnya. 
    Jika hal ini terjadi, kami akan menyediakan suatu instruksi untuk melakukan migrasi di versi rilis selanjutnya. hal ini bisa saja terdiri dari penghapusan, pengubahan, ataupun pembuatan 
    obyek API. Proses pengubahan mungkin saja membutuhkan pemikiran yang matang. Dampak proses ini bisa saja menyebabkan <i>downtime</i> aplikasi yang bergantung pada fitur ini.
  - Disarankan hanya untuk digunakan untuk penggunaan yang untuk penggunaan yang tidak berdampak langsung pada bisnis kamu.
  - **Kami mohon untuk mencoba versi <i>beta</i> yang kami sediakan dan berikan masukan terhadap fitur yang kamu pakai! Apabila fitur tersebut sudah tidak lagi berada di dalam tingkatan <i>beta</i> perubahan yang kami buat terhadap fitur tersebut bisa jadi tidak lagi dapat digunakan**
- Tingkatan stabil:
  - Nama dari versi ini mengandung string `vX` dimana `X` merupakan bilangan bulat.
  - Fitur yang ada pada tingkatan ini akan selalu muncul di rilis berikutnya. 

## <i>API groups</i>

Untuk memudahkan proses ekstensi suatu API Kubernetes, kami mengimplementasikan [*API groups*](https://git.k8s.io/community/contributors/design-proposals/api-machinery/api-group.md).
<i>API group</i> ini dispesifikasikan di dalam <i>path</i> <i>REST</i> serta di dalam <i>field</i> `apiVersion` dari sebuah obyek yang sudah diserialisasi.

Saat ini, terdapat beberapa <i>API groups</i> yang digunakan:

1. Kelompok *core*, seringkali disebut sebagai *legacy group*, berada pada <i>path</i> <i>REST</i> `/api/v1` serta menggunakan `apiVersion: v1`.

1. <i>Named groups</i> berada pada <i>path</i> <i>REST</i> `/apis/$GROUP_NAME/$VERSION`, serta menggunakan `apiVersion: $GROUP_NAME/$VERSION`
   (misalnya `apiVersion: batch/v1`). Daftar menyeluruh mengenai apa saja <i>API groups</i> dapat dilihat di [Kubernetes API reference](/docs/reference/).


Ekstensi API dengan custom resources dapat dilakukan melalui dua buah path:

1. [CustomResourceDefinition]()
   digunakan jika memerlukan seluruh set semantik Kubernetes API, pengguna boleh implementasi apiserver sendiri dengan menggunakan aggregator.
1. Pengguna yang membutuhkan seperangkat semantik API Kubernetes API dapat mengimplementasikan <i>apiserver</i> mereka sendiri.
   dengan menggunakan [aggregator]()
   untuk membuat integrasi dengan klien menjadi lebih mudah.


## Mengaktifkan <i> API groups</i>

Beberapa <i>resources</i> dan <i>API groups</i> sudah diaktifkan secara <i>default</i>. 
<i>Resource</i> dan <i>API groups</i> ini dapat diaktifkan dan dinonaktifkan dengan mengatur penanda `--runtime-config`
pada <i>apiserver</i>. `--runtime-config` menerima nilai yang dipisahkan oleh koma. Sebagai contoh: untuk menonaktifkan batch/v1, tetapkan
`--runtime-config=batch/v1=false`, untuk mengaktifkan batch/v2alpha1, tetapkan `--runtime-config=batch/v2alpha1`.
Penanda menerima nilai yang dipisahkan oleh pasangan `key=value` yang mendeskripsikan konfigurasi <i>runtime</i> pada <i>apiserver</i>.

PENTING: Melakukan proses mengaktifkan atau menonaktifkan <i>groups</i> atau <i>resources</i> 
membutuhkan mekanisme <i>restart</i> <i>apiserver</i> dan <i>controller-manager</i>
agar <i>apiserver</i> dapat menerima perubahan `--runtime-config`.

## Mengaktifkan <i>resources</i> di dalam <i>groups</i>

<i>DaemonSets</i>, <i>Deployments</i>, <i>HorizontalPodAutoscalers</i>, 
<i>Ingresses</i>, <i>Jobs</i>, dan <i>ReplicaSets</i> diaktifkan secara <i>default</i>.
Ekstensi lain dapat diaktifkan penanda `--runtime-config` pada <i>apiserver</i>. Penanda `--runtime-config` menerima nilai yang dipisahkan oleh koma.
 Sebagai contoh untuk menonaktifkan <i>deployments</i> dan <i>ingress</i>, tetapkan.
`--runtime-config=extensions/v1beta1/deployments=false,extensions/v1beta1/ingresses=false`

{{% /capture %}}
