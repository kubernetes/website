---
title: Probe Liveness, Readiness, dan Startup
content_type: concept
weight: 40
---

<!-- overview -->

Kubernetes memiliki beberapa jenis Probe:

- [Probe *Liveness*](#probe-liveness)
- [Probe *Readiness*](#probe-readiness)
- [Probe *Startup*](#probe-startup)

<!-- body -->

## Probe *Liveness*

Probe *liveness* menentukan kapan harus memulai ulang kontainer. Contohnya, Probe *liveness* dapat menangkap *deadlock* ketika aplikasi berjalan tetapi tidak dapat membuat progress.

Jika kontainer gagal dalam Probe *liveness* berulang-ulang, Kubelet akan memulai ulang kontainer tersebut.

Probe *liveness* tidak menunggu Probe *readiness* sampai berhasil. Jika kamu ingin menunggu sebelum mengeksekusi Probe *liveness*, kamu bisa mendefinisikan `initialDelaySeconds` atau menggunakan
[Probe *startup*](#probe-startup).

## Probe *Readiness*

Probe *readiness* menentukan kapan kontainer akan siap menerima trafik. Ini akan berguna ketika menunggu aplikasi yang memakan waktu lama dalam tugas awalnya, seperti membuat koneksi jaringan, memuat berkas, dan memanaskan(*warming*) *cache*.

Jika Probe *readiness* gagal, Kubernetes akan menghapus semua Pod dari semua *endpoint* yang cocok.

Probe *readiness* berjalan selama seluruh siklus hidup kontainer.

## Probe *Startup*

Probe *startup* memverifikasi apakah aplikasi dalam kontainer sudah dimulai. Ini dapat digunakan untuk mengadopsi cek *liveness* pada kontainer yang membutuhkan waktu lama untuk memulai, lalu untuk menghindari kontainer tersebut dihentikan oleh Kubelet sebelum siap dan berjalan.

Jika Probe seperti itu telah dikonfigurasi, maka cek *liveness* dan *readiness* akan dinonaktifkan sampai Probe tersebut berhasil.

Probe dengan tipe seperti ini hanya akan dieksekusi pada saat *startup*, tidak seperti Probe *liveness* dan *readiness* yang dieksekusi secara periodik.

* Baca lebih lanjut tentang [Mengatur Probe Liveness, Readiness, dan Startup](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes).
