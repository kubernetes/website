---
title: "Keamanan Cloud Native dan Kubernetes"
linkTitle: "Keamanan Cloud Native"
weight: 10

# Indeks bagian ini mencantumkannya secara eksplisit
hide_summary: true

description: >
  Konsep untuk menjaga keamanan workload cloud-native Kamu.
---

Kubernetes berdasarkan pada arsitektur cloud-native dan mengikuti saran dari
{{< glossary_tooltip text="CNCF" term_id="cncf" >}} tentang praktik terbaik untuk
keamanan informasi cloud-native.

Baca halaman ini untuk gambaran umum tentang bagaimana Kubernetes dirancang untuk
membantu kamu menerapkan platform cloud-native yang aman.

## Keamanan informasi cloud-native

{{< comment >}}
Ada versi terlokalisasi dari whitepaper ini; jika kamu dapat menautkan ke salah satunya
saat melakukan lokalisasi, itu bahkan lebih baik.
{{< /comment >}}

Whitepaper CNCF [white paper](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
tentang keamanan cloud-native yang mendefinisikan kontrol keamanan dan praktik yang
sesuai untuk berbagai _fase siklus hidup_.

## Fase siklus hidup _Develop_ {#lifecycle-phase-develop}

- Pastikan integritas lingkungan pengembangan.
- Rancang aplikasi mengikuti praktik terbaik untuk keamanan informasi,
  sesuai dengan konteks kamu.
- Pertimbangkan keamanan pengguna akhir sebagai bagian dari desain solusi.

Untuk mencapainya, kamu dapat:

1. Mengadopsi arsitektur, seperti [zero trust](https://glossary.cncf.io/zero-trust-architecture/),
   yang meminimalkan permukaan serangan, bahkan untuk ancaman internal.
1. Mendefinisikan proses tinjauan kode yang mempertimbangkan masalah keamanan.
1. Membangun _model ancaman_ untuk sistem atau aplikasi kamu yang mengidentifikasi
   batas kepercayaan. Gunakan model tersebut untuk mengidentifikasi risiko dan menemukan
   cara untuk mengatasinya.
1. Mengintegrasikan otomatisasi keamanan tingkat lanjut, seperti _fuzzing_ dan
   [rekayasa kekacauan keamanan](https://glossary.cncf.io/security-chaos-engineering/),
   jika diperlukan.

## Fase siklus hidup _Distribute_ {#lifecycle-phase-distribute}

- Pastikan keamanan rantai pasokan untuk container image yang kamu jalankan.
- Pastikan keamanan rantai pasokan untuk klaster dan komponen lain
  yang menjalankan aplikasi kamu. Contohnya adalah database eksternal yang digunakan
  oleh aplikasi cloud-native kamu untuk penyimpanan.

Untuk mencapainya, kamu dapat:

1. Memindai container image dan artefak lainnya untuk kerentanan yang diketahui.
1. Memastikan distribusi perangkat lunak menggunakan enkripsi dalam transit, dengan
   rantai kepercayaan untuk sumber perangkat lunak.
1. Mengadopsi dan mengikuti proses untuk memperbarui dependensi saat pembaruan tersedia,
   terutama sebagai tanggapan terhadap pengumuman keamanan.
1. Menggunakan mekanisme validasi seperti sertifikat digital untuk memastikan
   keamanan rantai pasokan.
1. Berlangganan feed dan mekanisme lainnya untuk memberi tahu kamu tentang risiko keamanan.
1. Membatasi akses ke artefak. Tempatkan container image di
   [registry privat](/docs/concepts/containers/images/#using-a-private-registry)
   yang hanya mengizinkan klien yang berwenang untuk menarik image.

## Fase siklus hidup _Deploy_ {#lifecycle-phase-deploy}

Pastikan pembatasan yang sesuai pada apa yang dapat diterapkan, siapa yang dapat menerapkannya,
dan di mana itu dapat diterapkan.
kamu dapat menerapkan langkah-langkah dari fase _distribute_, seperti memverifikasi
identitas kriptografi dari artefak container image.

Saat kamu menerapkan Kubernetes, kamu juga menetapkan fondasi untuk
lingkungan runtime aplikasi kamu: sebuah klaster Kubernetes (atau
beberapa klaster).
Infrastruktur TI tersebut harus memberikan jaminan keamanan yang diharapkan oleh
lapisan yang lebih tinggi.

## Fase siklus hidup _Runtime_ {#lifecycle-phase-runtime}

Fase Runtime mencakup tiga area penting: [akses](#protection-runtime-access),
[komputasi](#protection-runtime-compute), dan [penyimpanan](#protection-runtime-storage).

### Perlindungan Runtime: akses {#protection-runtime-access}

API Kubernetes adalah inti dari klaster kamu. Melindungi API ini adalah kunci
untuk memberikan keamanan klaster yang efektif.

Halaman lain dalam dokumentasi Kubernetes memiliki detail lebih lanjut tentang cara mengatur
aspek kontrol akses tertentu. [Daftar periksa keamanan](/docs/concepts/security/security-checklist/)
memiliki serangkaian pemeriksaan dasar yang disarankan untuk klaster kamu.

Selain itu, mengamankan klaster kamu berarti menerapkan
[autentikasi](/docs/concepts/security/controlling-access/#authentication) dan
[otorisasi](/docs/concepts/security/controlling-access/#authorization) yang efektif untuk akses API. Gunakan [ServiceAccounts](/docs/concepts/security/service-accounts/) untuk
menyediakan dan mengelola identitas keamanan untuk beban kerja dan komponen klaster.

Kubernetes menggunakan TLS untuk melindungi lalu lintas API; pastikan untuk menerapkan klaster menggunakan
TLS (termasuk untuk lalu lintas antara node dan control plane), dan lindungi
kunci enkripsi. Jika kamu menggunakan API Kubernetes untuk
[CertificateSigningRequests](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests),
berikan perhatian khusus untuk membatasi penyalahgunaan di sana.

### Perlindungan Runtime: komputasi {#protection-runtime-compute}

{{< glossary_tooltip text="Container" term_id="container" >}} menyediakan dua
hal: isolasi antara aplikasi yang berbeda, dan mekanisme untuk menggabungkan
aplikasi yang terisolasi tersebut untuk dijalankan pada komputer host yang sama. Kedua
aspek ini, isolasi dan agregasi, berarti bahwa keamanan runtime melibatkan
mengidentifikasi trade-off dan menemukan keseimbangan yang sesuai.

Kubernetes mengandalkan {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
untuk benar-benar mengatur dan menjalankan container. Proyek Kubernetes tidak
merekomendasikan runtime container tertentu, dan kamu harus memastikan bahwa
runtime yang kamu pilih memenuhi kebutuhan keamanan informasi kamu.

Untuk melindungi komputasi kamu saat runtime, kamu dapat:

1. Menerapkan [standar keamanan Pod](/docs/concepts/security/pod-security-standards/)
   untuk aplikasi, untuk membantu memastikan mereka berjalan hanya dengan hak istimewa yang diperlukan.
1. Menjalankan sistem operasi khusus pada node kamu yang dirancang khusus
   untuk menjalankan beban kerja yang dikontainerisasi. Biasanya ini berbasis pada sistem operasi
   hanya-baca (_immutable image_) yang hanya menyediakan layanan
   penting untuk menjalankan container.

   Sistem operasi khusus container membantu mengisolasi komponen sistem dan
   menghadirkan permukaan serangan yang lebih kecil jika terjadi pelarian container.
1. Mendefinisikan [ResourceQuotas](/docs/concepts/policy/resource-quotas/) untuk
   mengalokasikan sumber daya bersama secara adil, dan menggunakan
   mekanisme seperti [LimitRanges](/docs/concepts/policy/limit-range/)
   untuk memastikan bahwa Pod menentukan persyaratan sumber daya mereka.
1. Membagi beban kerja di berbagai node.
   Gunakan mekanisme [isolasi node](/docs/concepts/scheduling-eviction/assign-pod-node/#node-isolation-restriction),
   baik dari Kubernetes itu sendiri atau dari ekosistem, untuk memastikan bahwa
   Pod dengan konteks kepercayaan yang berbeda dijalankan pada set node yang terpisah.
1. Gunakan {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
   yang menyediakan pembatasan keamanan.
1. Pada node Linux, gunakan modul keamanan Linux seperti [AppArmor](/docs/tutorials/security/apparmor/)
   atau [seccomp](/docs/tutorials/security/seccomp/).

### Perlindungan Runtime: penyimpanan {#protection-runtime-storage}

Untuk melindungi penyimpanan untuk klaster kamu dan aplikasi yang berjalan di sana, kamu dapat:

1. Mengintegrasikan klaster kamu dengan plugin penyimpanan eksternal yang menyediakan enkripsi saat
   data tidak aktif untuk volume.
1. Mengaktifkan [enkripsi saat data tidak aktif](/docs/tasks/administer-cluster/encrypt-data/) untuk
   objek API.
1. Melindungi daya tahan data menggunakan cadangan. Verifikasi bahwa kamu dapat memulihkan data tersebut kapan pun diperlukan.
1. Mengautentikasi koneksi antara node klaster dan penyimpanan jaringan apa pun yang mereka andalkan.
1. Menerapkan enkripsi data dalam aplikasi kamu sendiri.

Untuk kunci enkripsi, menghasilkan kunci ini dalam perangkat keras khusus memberikan
perlindungan terbaik terhadap risiko pengungkapan. Sebuah _hardware security module_
dapat memungkinkan kamu melakukan operasi kriptografi tanpa memungkinkan kunci keamanan
untuk disalin ke tempat lain.

### Jaringan dan keamanan

Kamu juga harus mempertimbangkan langkah-langkah keamanan jaringan, seperti
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) atau
[service mesh](https://glossary.cncf.io/service-mesh/).
Beberapa plugin jaringan untuk Kubernetes menyediakan enkripsi untuk
jaringan klaster kamu, menggunakan teknologi seperti
virtual private network (VPN) overlay.
Secara desain, Kubernetes memungkinkan kamu menggunakan plugin jaringan kamu sendiri untuk
klaster kamu (jika kamu menggunakan Kubernetes yang dikelola, orang atau organisasi
yang mengelola klaster kamu mungkin telah memilih plugin jaringan untuk kamu).

Plugin jaringan yang kamu pilih dan cara kamu mengintegrasikannya dapat memiliki
dampak besar pada keamanan informasi dalam transit.

### Observabilitas dan keamanan runtime

Kubernetes memungkinkan kamu memperluas klaster kamu dengan alat tambahan. kamu dapat mengatur solusi pihak ketiga untuk membantu kamu memantau atau memecahkan masalah aplikasi kamu dan klaster tempat mereka berjalan. kamu juga mendapatkan beberapa fitur observabilitas dasar yang sudah ada di Kubernetes itu sendiri. Kode kamu yang berjalan dalam container dapat menghasilkan log, menerbitkan metrik, atau menyediakan data observabilitas lainnya; pada waktu penerapan, kamu perlu memastikan klaster kamu memberikan tingkat perlindungan yang sesuai di sana.

Jika kamu mengatur dasbor metrik atau sesuatu yang serupa, tinjau rantai komponen yang mengisi data ke dalam dasbor tersebut, serta dasbor itu sendiri. Pastikan bahwa seluruh rantai dirancang dengan ketahanan yang cukup dan perlindungan integritas yang cukup sehingga kamu dapat mengandalkannya bahkan selama insiden di mana klaster kamu mungkin mengalami degradasi.

Jika sesuai, terapkan langkah-langkah keamanan di bawah tingkat Kubernetes itu sendiri, seperti boot yang diukur secara kriptografis, atau distribusi waktu yang diautentikasi (yang membantu memastikan keandalan log dan catatan audit).

Untuk lingkungan dengan jaminan tinggi, terapkan perlindungan kriptografi untuk memastikan bahwa log tidak dapat diubah dan tetap rahasia.

## {{% heading "whatsnext" %}}

### Keamanan cloud-native {#further-reading-cloud-native}

* Whitepaper CNCF [white paper](https://github.com/cncf/tag-security/blob/main/community/resources/security-whitepaper/v2/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
  tentang keamanan cloud-native.
* Whitepaper CNCF [white paper](https://github.com/cncf/tag-security/blob/f80844baaea22a358f5b20dca52cd6f72a32b066/supply-chain-security/supply-chain-security-paper/CNCF_SSCP_v1.pdf)
  tentang praktik terbaik untuk mengamankan rantai pasokan perangkat lunak.
* [Memperbaiki kekacauan klaster Kubernetes: Memahami keamanan dari kernel ke atas](https://archive.fosdem.org/2020/schedule/event/kubernetes/) (FOSDEM 2020)
* [Praktik Terbaik Keamanan Kubernetes](https://www.youtube.com/watch?v=wqsUfvRyYpw) (Kubernetes Forum Seoul 2019)
* [Menuju Boot yang Diukur Secara Default](https://www.youtube.com/watch?v=EzSkU3Oecuw) (Linux Security Summit 2016)

### Kubernetes dan keamanan informasi {#further-reading-k8s}

* [Keamanan Kubernetes](/docs/concepts/security/)
* [Mengamankan klaster kamu](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Enkripsi data dalam transit](/docs/tasks/tls/managing-tls-in-a-cluster/) untuk control plane
* [Enkripsi data saat tidak aktif](/docs/tasks/administer-cluster/encrypt-data/)
* [Secrets di Kubernetes](/docs/concepts/configuration/secret/)
* [Mengontrol Akses ke API Kubernetes](/docs/concepts/security/controlling-access)
* [Kebijakan jaringan](/docs/concepts/services-networking/network-policies/) untuk Pod
* [Standar keamanan Pod](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)
