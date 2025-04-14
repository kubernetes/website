---
title: Informasi Keamanan dan Pengungkapan Kubernetes
aliases: [/security/]
reviewers:
- eparis
- erictune
- philips
- jessfraz
content_type: concept
weight: 20
---

<!-- overview -->
Pada halaman ini dijelaskan informasi keamanan dan pengungkapan isu keamanan Kubernetes.

<!-- body -->
## Pengumuman Keamanan

Bergabunglah dengan grup [kubernetes-security-announce](https://groups.google.com/forum/#!forum/kubernetes-security-announce)
untuk menerima email tentang keamanan di Kubernetes.

## Melaporkan Masalah Keamananan

Kami sangat berterima kasih kepada peneliti keamanan dan pengguna yang melaporkan kerentanan Kubernetes. Semua laporan akan diselidiki secara menyeluruh oleh sekelompok sukarelawan komunitas.

Untuk membuat laporan, kirimkan masalah keamanan yang kamu temukan ke [program bug bounty Kubernetes](https://hackerone.com/kubernetes).
Ini memungkinkan triase dan penanganan kerentanan dengan waktu respons yang terstandardisasi.

Kamu juga dapat mengirim email ke daftar privat [security@kubernetes.io](mailto:security@kubernetes.io)
dengan rincian keamanan dan detail yang diharapkan untuk
[semua laporan bug Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/.github/ISSUE_TEMPLATE/bug-report.yaml).

Kamu dapat mengenkripsi email ke daftar ini menggunakan kunci GPG dari
[anggota Komite Tanggapan Keamanan](https://git.k8s.io/security/README.md#product-security-committee-psc).
Enkripsi menggunakan GPG TIDAK diperlukan untuk membuat pengungkapan.

### Kapan Saya Harus Melaporkan Kerentanan?

- Kamu berpikir telah menemukan potensi kerentanan keamanan di Kubernetes
- Kamu tidak yakin bagaimana kerentanan memengaruhi Kubernetes
- Kamu berpikir telah menemukan kerentanan di proyek lain yang menjadi dependensi Kubernetes
  - Untuk proyek dengan proses pelaporan dan pengungkapan kerentanannya sendiri, silakan laporkan langsung ke sana

### Kapan Saya TIDAK Harus Melaporkan Kerentanan?

- Kamu membutuhkan bantuan untuk menyetel komponen Kubernetes agar lebih aman
- Kamu membutuhkan bantuan untuk menerapkan pembaruan terkait keamanan
- Masalah kamu tidak terkait dengan keamanan

## Respons Kerentanan Keamanan

Setiap laporan akan diakui dan dianalisis oleh anggota Komite Tanggapan Keamanan dalam waktu 3 hari kerja.
Ini akan memulai [Proses Rilis Keamanan](https://git.k8s.io/security/security-release-process.md#disclosures).

Informasi kerentanan apa pun yang dibagikan dengan Komite Tanggapan Keamanan tetap berada dalam proyek Kubernetes
dan tidak akan disebarluaskan ke proyek lain kecuali diperlukan untuk memperbaiki masalah tersebut.

Saat masalah keamanan bergerak dari triase, ke identifikasi perbaikan, hingga perencanaan rilis, kami akan terus memperbarui pelapor.

## Waktu Pengungkapan Publik

Tanggal pengungkapan publik dinegosiasikan oleh Komite Tanggapan Keamanan Kubernetes dan pengirim bug.
Kami lebih suka mengungkapkan bug sepenuhnya sesegera mungkin setelah mitigasi pengguna tersedia. Penundaan pengungkapan
dapat terjadi jika bug atau perbaikannya belum sepenuhnya dipahami, solusinya belum diuji dengan baik,
atau untuk koordinasi dengan vendor. Kerangka waktu pengungkapan berkisar dari segera (terutama jika sudah diketahui publik)
hingga beberapa minggu. Untuk kerentanan dengan mitigasi yang sederhana, kami mengharapkan waktu dari tanggal laporan
hingga tanggal pengungkapan sekitar 7 hari. Komite Tanggapan Keamanan Kubernetes memiliki keputusan akhir dalam menetapkan tanggal pengungkapan.
