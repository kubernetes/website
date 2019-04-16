# Dokumentasi Kubernetes

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Selamat datang! Repositori ini merupakan wadah bagi semua komponen yang dibutuhkan untuk membuat [dokumentasi Kubernetes](https://kubernetes.io/). Kami merasa sangat senang apabila kamu berminat untuk menjadi kontributor!

## Kontribusi pada dokumentasi

Pertama, kamu dapat menekan tombol **Fork** yang berada pada bagian atas layar, untuk menyalin repositori pada akun Github-mu. Salinan ini disebut sebagai **fork**. Kamu dapat menambahkan konten pada **fork** yang kamu miliki, setelah kamu merasa cukup untuk menambahkan konten yang kamu miliki dan ingin memberikan konten tersebut pada kami, kamu dapat melihat **fork** yang telah kamu buat dan membuat **pull request** untuk memberi tahu kami bahwa kamu ingin menambahkan konten yang telah kamu buat.

Setelah kamu membuat sebuah **pull request**, seorang **reviewer** akan memberikan masukan terhadap konten yang kamu sediakan serta beberapa hal yang dapat kamu lakukan apabila perbaikan diperlukan terhadap konten yang telah kamu sediakan. Sebagai seorang yang membuat **pull request**, **sudah menjadi kewajiban kamu untuk melakukan modifikasi terhadap konten yang kamu berikan sesuai dengan masukan yang diberikan oleh seorang reviewer Kubernetes**. Perlu kamu ketahui bahwa kamu dapat saja memiliki lebih dari satu orang **reviewer Kubernetes** atau dalam kasus kamu bisa saja mendapatkan **reviewer Kubernetes** yang berbeda dengan **reviewer Kubernetes** awal yang ditugaskan untuk memberikan masukan terhadap konten yang kamu sediakan. Selain itu, seorang **reviewer Kubernetes** bisa saja meminta masukan teknis dari [reviewer teknis Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers) jika diperlukan. 

Untuk informasi lebih lanjut mengenai tata cara melakukan kontribusi, kamu dapat melihat tautan di bawah ini:

* [Petunjuk Melakukan Kontribusi](https://kubernetes.io/docs/contribute/start/)
* [Melakukan Tahap Staging pada Konten Dokumentasi yang telah Kamu Sediakan](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Petunjuk Menggunakan Page Templates](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Petunjuk untuk Documentation Style](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Petunjuk untuk Melakukan Lokalisasi Dokumentasi Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## Menjalankan Dokumentasi Kubernetes pada Mesin Lokal Kamu

Petunjuk yang disarankan untuk menjalankan Dokumentasi Kubernetes pada mesin lokal kamus adalah dengan menggunakan [Docker](https://docker.com) **image** yang memiliki **package** [Hugo](https://gohugo.io), **Hugo** sendiri merupakan generator website statis. 

> Jika kamu menggunakan Windows, kamu mungkin membutuhkan beberapa langkah tambahan untuk melakukan instalasi perangkat lunak yang dibutuhkan. Instalasi ini dapat dilakukan dengan menggunakan [Chocolatey](https://chocolatey.org). `choco install make`

> Jika kamu ingin menjalankan **website** tanpa menggunakan **Docker**, kamu dapat melihat tautan berikut [Petunjuk untuk menjalankan website pada mesin lokal dengan menggunakan Hugo](#petunjuk-untuk-menjalankan-website-pada-mesin-lokal-denga-menggunakan-hugo) di bagian bawah.

Jika kamu sudah memiliki **Docker** [yang sudah dapat digunakan](https://www.docker.com/get-started), kamu dapat melakukan **build** `kubernetes-hugo` **Docker image** secara lokal:

```bash
make docker-image
```

Setelah **image** berhasil di-**build**, kamu dapat menjalankan website tersebut pada mesin lokal-mu:

```bash
make docker-serve
```

Buka **browser** kamu ke http://localhost:1313 untuk melihat laman dokumentasi. Selama kamu melakukan penambahan konten, **Hugo** akan secara otomatis melakukan perubahan terhadap laman dokumentasi apabila **browser** melakukan proses **refresh**.


## Petunjuk untuk menjalankan website pada mesin lokal dengan menggunakan Hugo

Kamu dapat melihat [dokumentasi resmi Hugo](https://gohugo.io/getting-started/installing/) untuk mengetahui langkah yang diperlukan untuk melakukan instalasi **Hugo**. Pastikan kamu melakukan instalasi versi **Hugo** sesuai dengan versi yang tersedia pada **environment variable** `HUGO_VERSION` pada **file**[`netlify.toml`](netlify.toml#L9). 

Untuk menjalankan laman pada mesin lokal setelah instalasi **Hugo**, kamu dapat menjalankan perintah berikut:

```bash
make serve
```

Buka **browser** kamu ke http://localhost:1313 untuk melihat laman dokumentasi. Selama kamu melakukan penambahan konten, **Hugo** akan secara otomatis melakukan perubahan terhadap laman dokumentasi apabila **browser** melakukan proses **refresh**.

## Komunitas, Diskusi, Kontribusi, dan Bantuan

Kamu dapat belajar bagaimana tata cara untuk ikut terlibat dalam komunitas Kubernetes melalui [laman komunitas](http://kubernetes.io/community/).

Kamu dapat berinteraksi dengan **maintainers** project ini melalui:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Etika dalam Berkontribusi

Partisipasi dalam komunitas Kubernetes diatur dalam [Etika dalam Berkontribusi pada Kubernetes](code-of-conduct.md).

## Terima Kasih!

Kubernetes sangat menjunjung tinggi partisipasi dari komunitas, dan kami sangat mengapresiasi kontribusi kamu pada laman dan dokumentasi kami!
