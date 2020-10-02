---
title: Service
id: service
date: 2020-04-05
full_link: /id/docs/concepts/services-networking/service/
short_description: >
  Cara untuk mengekspos aplikasi yang berjalan pada sekumpulan Pod sebagai layanan jaringan.

aka:
tags:
- fundamental
- core-object
---
Abstraksi yang digunakan untuk mengekspos aplikasi yang berjalan pada sekumpulan {{< glossary_tooltip term_id="pod" >}} sebagai layanan jaringan.

<!--more-->

Kumpulan Pod yang ditargetkan oleh Service (biasanya) ditentukan oleh {{< glossary_tooltip text="selector" term_id="selector" >}}. Jika lebih banyak Pod ditambahkan atau dihapus, maka kumpulan Pod yang cocok dengan _selector_ juga akan berubah. Service memastikan bahwa lalu lintas jaringan dapat diarahkan ke kumpulan Pod yang ada saat ini sebagai beban kerja.
