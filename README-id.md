# Dokumentasi Kubernetes

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Selamat datang! Repositori ini merupakan wadah bagi semua komponen yang dibutuhkan untuk membuat [dokumentasi Kubernetes](https://kubernetes.io/). Kami merasa sangat senang apabila Anda berminat untuk menjadi kontributor!

## Kontribusi pada dokumentasi

Pertama Anda dapat menekan tombol **Fork** yang berada pada bagian atas layar Anda untuk menyalin repositori pada akun Github Anda. Salinan ini disebut sebagai **fork**. Anda dapat menambahkan konten pada **fork** yang Anda miliki, setelah Anda meraca cukup untuk menambahkan konten yang Anda miliki dan ingin memberikan konten tersebut pada kami, Anda dapat melihat **fork** yang telah Anda buat dan membuat **pull request** untuk memberi tahu kami bahwa Anda ingin menambahkan konten yang telah Anda buat.

Setelah Anda membuat sebuah **pull request**, seorang **reviewer** akan memberikan masukan terhadap konten yang Anda sediakan serta beberapa hal yang dapat Anda lakukan apabila perbaikan diperlukan terhadap konten yang telah Anda sediakan. Sebagai seorang yang membuat **pull request**, **sudah menjadi kewajiban bagi Anda untuk melakukan modifikasi terhadap konten yang Anda berikan sesuai dengan masukan yang diberikan oleh seorang reviewer Kubernetes**. Perlu Anda ketahui bahwa Anda dapat saja memilki lebih dari satu orang **reviewer Kubernetes** atau dalam kasus Anda bisa saja mendapatkan **reviewer Kubernetes** yang berbeda dengan **reviewer Kubernetes** awal yang ditugaskan untuk memberikan masukan terhadap konten yang Anda sediakan. Selain itu, seorang **reviewer Kubernetes** bisa saja meminta masukan teknikanl dari [reviewer tekninal Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers) jika diperlukan. 

Untuk informasi lebih lanjut mengenai tata cara melakukan kontribusi, Anda dapat melihat tautan di bawah ini:

* [Petunjuk Melakukan Kontribusi](https://kubernetes.io/docs/contribute/start/)
* [Melakukan Tahap Staging pada Konten Dokumentasi yang telah Anda Sediakan](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Petunjuk Menggunakan Page Templates](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Petunjuk untuk Documentation Style](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Petunjuk untuk Melakukan Lokalisasi Dokumentasi Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## Menjalankan Dokumentasi Kubernetes pada Mesin Lokal Anda

Petunjuk yang disarankan untuk menjalankan Dokumentasi Kubernetes pada mesin lokal Anda adalah dengan menggunakan [Docker](https://docker.com) **image** yang memiliki **package** [Hugo](https://gohugo.io), **Hugo** sendiri merupakan generator website statis. 

> Jika Anda menggunakan Windows, Anda mungkin membutuhkan beberapa langkah tambahan untuk melakukan instalasi perangkat lunak yang dibutuhkan. Instalasi ini dapat dilakukan dengan menggukanan [Chocolatey](https://chocolatey.org). `choco install make`

> Jika Anda ingin menjalankan **website** tanpa menggukana **Docker**, Anda dapat emlihat tautan berikut [Petunjuk untuk menjalankan website pada mesin lokal dengan menggunakan Hugo](#petunjuk-untuk-menjalankan-website-pada-mesin-lokal-denga-menggunakan-hugo) di bagian bawah.

Jika Anda sudah memiliki **Docker** [yang sudah dapat digunakan](https://www.docker.com/get-started), Anda dapat melakukan **build** `kubernetes-hugo` **Docker image** secraa lokal:

```bash
make docker-image
```

Setelah **image** berhasil di-**build**, Anda dapat menjalankan website tersebut pada mesin lokal Anda:

```bash
make docker-serve
```

Buka **browser** Anda ke http://localhost:1313 untuk melihat laman dokumentasi. Selama Anda melakukan penambahan konten, **Hugo** akan secara otomatis melakukan perubahan terhadap laman dokumentasi apabila **browser** melakukan proses **refresh**.


## Petunjuk untuk menjalankan website pada mesin lokal dengan menggunakan Hugo

Anda dapat melihat [dokumentasi resmi Hugo](https://gohugo.io/getting-started/installing/) untuk mengetahui langhak yang diperlukan untuk melakukan instalasi **Hugo**. Pastikan Anda melakukan instalasi versi **Hugo** sesuai dengan versi yang tersedia pada **environment variable** `HUGO_VERSION` pada **file**[`netlify.toml`](netlify.toml#L9). 

Untuk menjalankan laman pada mesin lokal Anda setelah Anda melakukan instalasi **Hugo**, anda dapat menjalankan perintah berikut:

```baseh
rang  
make serve
```

Buka **browser** Anda ke http://localhost:1313 untuk melihat laman dokumentasi. Selama Anda melakukan penambahan konten, **Hugo** akan secara otomatis melakukan perubahan terhadap laman dokumentasi apabila **browser** melakukan proses **refresh**.

## Komunitas, Diskusi, Kontribusi, dan Bantuan

Anda dapat belajar bagaimana tata cara untuk ikut terlibat dalam komunitas Kubernetes melalui [laman komunitas](http://kubernetes.io/community/).

Anda dapat berinteraksi dengan **maintainers** project ini melalui:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Etika dalam Berkontribusi

Partisipasi dalam komunitas Kubernetes diatul dalam [Etika dalam Berkontribusi pada Kubernetes](code-of-conduct.md).

## Terima Kasih!

Kubernetes sangat menjunjung tinggi partisipas dari komunitas, dan kami sangat mengapresiasi kontribusi Anda pada laman dan dokumentasi kamu!
