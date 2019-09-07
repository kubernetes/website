---
reviewers:
- thockin
title: Jaringan Kluster
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
Jaringan adalah bagian utama dari Kubernetes, tetapi bisa menjadi sulit
untuk memahami persis bagaimana mengharapkannya bisa bekerja.
Ada 4 masalah yang berbeda untuk diatasi:

1. Komunikasi antar kontainer yang sangat erat: hal ini diselesaikan oleh
   [_pods_](/docs/concepts/workloads/pods/pod/) dan komunikasi `_localhost_`.
2. Komunikasi antar _pod_: ini adalah fokus utama dari dokumen ini.
3. Komunikasi _pod_ dengan _service_: ini terdapat di [_services_](/docs/concepts/services-networking/service/).
4. Komunikasi eksternal dengan _service_: ini terdapat di [_services_](/docs/concepts/services-networking/service/).

{{% /capture %}}


{{% capture body %}}

Kubernetes adalah tentang berbagi mesin antar aplikasi. Pada dasarnya,
saat berbagi mesin harus memastikan bahwa dua aplikasi tidak mencoba menggunakan
_port_ yang sama. Mengkoordinasikan _port_ di banyak _developers_ sangat sulit
dilakukan pada skala yang berbeda dan memaparkan pengguna ke masalah
tingkat kluster yang di luar kendali mereka.

Alokasi port yang dinamis membawa banyak komplikasi ke sistem - setiap aplikasi
harus menganggap port sebagai _flag_, _server_ API harus tahu cara memasukkan
nomor _port_ dinamis ke dalam blok konfigurasi, _services_ harus tahu cara
menemukan satu sama lain, dll. Sebaliknya daripada berurusan dengan ini,
Kubernetes mengambil pendekatan yang berbeda.

## Model jaringan Kubernetes

