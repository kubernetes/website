---
title: Apa itu Kubernetes?
content_type: concept
weight: 10
description: >
  Kubernetes merupakan _platform open-source_ yang digunakan untuk melakukan
  manajemen _workloads_ aplikasi yang dikontainerisasi, serta menyediakan
  konfigurasi dan otomatisasi secara deklaratif. Kubernetes berada di dalam ekosistem
  yang besar dan berkembang cepat. _Service_, _support_, dan perkakas
  Kubernetes tersedia secara meluas. Kubernetes merupakan _platform open-source_ 
  yang digunakan untuk melakukan manajemen _workloads_ aplikasi yang dikontainerisasi, 
  serta menyediakan konfigurasi dan otomatisasi secara deklaratif. Kubernetes berada 
  di dalam ekosistem yang besar dan berkembang cepat. _Service_, _support_, 
  dan perkakas Kubernetes tersedia secara meluas.
card:
  name: concepts
  weight: 10
---

<!-- overview -->
Laman ini merupakan ikhtisar Kubernetes.


<!-- body -->
Kubernetes merupakan <i>platform open-source</i> yang digunakan untuk melakukan
manajemen <i>workloads</i> aplikasi yang dikontainerisasi, serta menyediakan
konfigurasi dan otomatisasi secara deklaratif. Kubernetes berada di dalam ekosistem
yang besar dan berkembang cepat. <i>Service</i>, <i>support</i>, dan perkakas
Kubernetes tersedia secara meluas.

Google membuka Kubernetes sebagai proyek <i>open source</i> pada tahun 2014.
Kubernetes dibangun berdasarkan [pengalaman Google selama satu setengah dekade dalam menjalankan workloads](https://research.google.com/pubs/pub43438.html)
bersamaan dengan kontribusi berupa ide-ide terbaik yang diberikan oleh komunitas.

## Melihat masa lalu

Mari kita lihat mengapa Kubernetes sangat berguna dengan melihat masa lalu. 

![Deployment evolution](/images/docs/Container_Evolution.svg)

**Era penyebaran tradisional:** Pada awalnya, organisasi menjalankan aplikasinya pada server fisik. Tidak ada cara untuk memisahkan aplikasi-aplikasi pada server fisik, dan ini dapat menyebabkan isu pada alokasinya. Contohnya, jika beberapa aplikasi berjalan pada sebuah server fisik, server tersebut dapat memakan semua sumber daya pada server tersebut, dan hasilnya dapat mengganggu peforma dari aplikasi lainnya. Solusinya ialah menjalankan setiap aplikasi pada server fisik yang berbeda, dan ini tidak dapat diskalakan saat tidak diutilisasikan serta mahal untuk organisasi untuk memelihara banyak server fisik.

**Era penyebaran tervirtualisasi:** Sebagai solusinya, virtualisasi muncul. Teknologi ini memungkinkan untuk menjalankan mesin virtual pada satu CPU server fisik. Virtualisasi juga memungkinkan aplikasi terisolasi antar mesin virtual (VM) dan memberikan level keamanan informasi pada suatu aplikasi tak bisa diakses oleh aplikasi lainnya secara bebas.

Virtualisasi juga dapat mengutilisasikan sumber daya pada server fisik dan skalabilitas yang lebih baiki karena aplikasi dapat ditambahkan atau diperbarui dengan mudah, mengurangi biaya hardware, dan lain sebagainya.

Setiap mesin virtual merupakan sebuah mesin dengan segala komponen, termasuk sistem operasi, diatas hardware yang tervirtualisasikan.

**Era penyebaran kontainer:** Kontainer mirip dengan mesin virtual, akan tetapi properti isolasinya lebih direlaksikan untuk berbagi sistem operasi diantara aplikasi-aplikasi. Walau begitu, kontainer lebih ringan. Mirp dengan mesin virtual, kontainer mempunyai filesystem-nya sendiri, berbagi CPU, memory, process space dan lain sebagainya. Karena mereka dipisahkan dari infrastruktur yang mendasarinya, mereka portabel di seluruh cloud dan distribusi sistem operasi.

Kontainer semakin populer karena dapat memberikan banyak keuntungan, sepertinya:

* Pembuatan dan penyebaran aplikasi yang lebih tangkas: lebih mudah dan efisiensi pembuatan image kontainer dibandingkan pembuatan image mesin virtual.
* Pengembangan, Intergrasi dan Penyebaran yang berkelanjutan: menyediakan pembuatan dan penyebaran image kontainer yang dapat diandalkan dan sering dilakukan dengan *rollbacks* yang cepat dan efisien (karena image kontainer tak dapat diubah).
* Konsen pada keterpisahan antara pengembangan dan pengoperasian: Membuat image kontainer pada saat pembuatan/perilisan lebih tepat daripada membuatnya pada saat penyebaran, dengan demikian memisahkan aplikasi dari infrastruktur.
* Obervabilitas: tak hanya pada informasi dan metrik pada level sistem operasi saja, tetapi juga kesehatan aplikasi dan sinyal lainnya.
* Konsistensi antara lingkungan pengembangan, pengujian, dan produksi: Jalan di cloud selayaknya jalan di laptopmu.
* Portabilitas distribusi cloud dan sistem operasi: berjalan pada Ubuntu, RHEL, CoreOS, on-premises, cloud publik, dan di tempat lain.
* Manajemen yang terfokus pada aplikasi: Memberikan abstraksi pada sistem operasi pada perangkat keras virtual untuk menjalankan pada sebuah sistem operasi menggunakan sumber daya logis.
* Renggang, terdistribusi, elastis, *micro-services* yang bebas: aplikasi yang terpecah menjadi kecil, independen dan dapat disebarkan dan diurus secara dinamis - tidak seperti monolitik yang jalam pada mesin besar untuk satu tujuan.
* Isolasi sumber daya: performa aplikasi yang terprediksi.
* Utilisasi sumber daya: kepadatan dan efisiensi tinggi.

## Mengapa anda butuh Kubernetes dan apa yang bisa dilakukannya {#mengapa-anda-butuh-kubernetes-dan-apa-yang-bisa-dilakukannya}

Kontainer adalah cara yang baik dalam membungkus dan menjalankannya. Pada lingkungan produksi, kamu butuh mengurus kontainer yang menjalankan aplikasi dan memastikan tidak ada *downtime*. Sebagai contoh, jika kontainer *down*, kontainer lainnya harus dijalankan. Bukannya bisa lebih mudah jika ini dilakukan oleh sebuah sistem?

Maka datanglah kubernetes sebagai "juru selamat"! Kubernetes memberikanmu sebuah kerangka kerja untuk menjalankan sistem yang terdistribusi yang dapat diandalkan. Ia mengurusi bagaimana aplikasi diskalakan dan menangani kegagalan, memberikan pola penyebaran, dan masih banyak lainnya. Sebagai contoh, Kubernetes bisa dengan mudah mengurus sebuah penyebaran secara *canary* untuk sistemmu.

Kubernetes memberikanmu:

* **Penulusuran layanan dan penyeimbangan beban**
  Kubernetes dapat mengekspos kontainer dengan nama DNS atau dengan alamat IP-nya sendiri. Jika lalu lintas jaringan ke sebuah kontainer, kubernetes bisa menyeimbangkan beban dan mendistribusikannya secara merata sehingga penyebaran tetap stabil.
* **Orkestrasi penyimpanan**
  Kubernetes memungkinkanmu untuk menautkan sebuah sistem penyimpanan yang kamu pilih, seperti penyimpanan lokal, penyedia layanan cloud publik, dan lain sebagainya.
* ***Rollouts* dan *rollbacks* yang terotomasi**
  Kamu bisa menyediakan sebuah kondisi yang diinginkan untuk penyeber kontainermu dengan Kubernetes, dan itu bisa diubah ke kondisi yang sebenarnya diinginkan. Sebagai contoh, kamu bisa mengotomasikan Kubernetes untuk membuat kontainer baru untuk penyebaranmu, menghapus kontainer yang telah ada, dan menggunakan sumber dayanya untuk kontainer baru.
* **Pembungkusan bin yang terotomasi**
  Kamu menyediakan Kubernetes dengan sebuah kluster *node* yang dimana bisa digunakan untuk menjalankan tugas-tugas terkontainerisasi. Kamu memberikantahukan Kubernetes seberapa banyak CPU dan RAM yang dibutuhkan setiap kontainer. Kubernetes juga bisa menyesuaikan kontainer ke dalam node-nodemu agar dapat menggunakan sumber dayamu secara lebih baik.
* **Penyembuhan yang mandiri**
  Kubernetes memulai ulang kontainer yang gagal, mengganti kontainer, menghapus kontainer yang tidak memberikan respons ke pemeriksaan yang kamu definisikan, dan tidak akan menggunakan kontainer ke klien sampai benar-benar siap.
* **Manajemen *secret* dan konfigurasi**
  Kubernetes memungkinkanmu untuk menyimpan dan mengatur informasi sensitif, seperti password, token OAuth, dan SSH keys. Kamu juga bisa menyebarkan dan memperbarui informasi rahasia dan konfigurasi aplikasi tanpa membuat image kontainer baru, dan tanpa mengekspos informasi rahasia ke stak konfigurasi.

## {{% heading "whatsnext" %}}

*   Siap untuk [memulai](/docs/setup/)?
*   Untuk penjelasan lebih rinci, silahkan lihat [Dokumentasi Kubernetes](/docs/home/).



