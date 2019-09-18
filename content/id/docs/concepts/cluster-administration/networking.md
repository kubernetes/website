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

Setiap `_Pod_` mendapatkan alamat IP sendiri. Ini berarti kamu tidak perlu secara langsung membuat tautan antara `_Pods_` dan kamu hampir tidak perlu berurusan dengan memetakan _port_ kontainer ke _host port_. Ini menciptakan model yang bersih, kompatibel dengan yang sebelumnya di mana `_Pods_` dapat diperlakukan seperti halnya VM atau _host_ fisik dari perspektif alokasi _port_, penamaan, _service discovery_, _load balancing_, konfigurasi aplikasi, dan migrasi.

Kubernetes memberlakukan persyaratan mendasar berikut pada setiap implementasi jaringan (kecuali kebijakan segmentasi jaringan yang disengaja):

   * _pod_ pada suatu _node_ dapat berkomunikasi dengan semua _pod_ pada semua _node_ tanpa NAT
   * agen pada suatu simpul (mis. _daemon_ sistem, kubelet) dapat berkomunikasi dengan semua pod pada _node_ itu

Catatan: Untuk platform yang mendukung `_Pods_` yang berjalan di jaringan _host_ (mis. Linux):

   * _pod_ di jaringan _host_ dari sebuah _node_ dapat berkomunikasi dengan semua _pod_ pada semua _node_ tanpa NAT

Model ini tidak hanya sedikit kompleks secara keseluruhan, tetapi pada prinsipnya kompatibel dengan keinginan Kubernetes untuk memungkinkan _low-friction porting_ dari aplikasi dari VM ke kontainer. Jika pekerjaan kamu sebelumnya dijalankan dalam VM, VM kamu memiliki IP dan dapat berbicara dengan VM lain di proyek yang sama. Ini adalah model dasar yang sama.

Alamat IP Kubernetes ada di lingkup `_Pod_` - kontainer dalam `_Pod_` berbagi jaringan _namespaces_ mereka - termasuk alamat IP mereka. Ini berarti bahwa kontainer dalam `Pod` semua dapat mencapai port satu sama lain di `_localhost_`. Ini juga berarti bahwa kontainer dalam `Pod` harus mengoordinasikan penggunaan _port_, tetapi ini tidak berbeda dari proses di VM. Ini disebut model "IP-per-pod".
