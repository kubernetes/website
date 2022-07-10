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
Kubernetes adalah platform sumber terbuka yang portabel, dan dapat diperbesar untuk mengatur beban kerja terkontainerisasi dan layanannya, memfasilitasi konfigurasi deklaratif dan otomasi. Ia juga memiliki ekosistem yang besar dan berkembang pesat. Layanan, dukungan, dan alat-alat Kubernetes tersedia secara luas.

Nama Kubernetes berasal dari Bahasa Yunani, yang artinya jurumudi. K8s merupakan singkatan yang berasal dari jumlah karakter antara "K" dan "s". Google menjadikan Kubernetes menjadi Open Source pada proyek Kubernetes pada tahun 2014. Kubernetes merupakan mengombinasikan [15 tahun pengalaman Google](/blog/2015/04/borg-predecessor-to-kubernetes/) dalam menjalankan beban kerja produksi skala besar dengan ide dan praktik terbaik dari komunitas.

## Melihat masa lalu

Mari kita lihat mengapa Kubernetes sangat berguna dengan melihat masa lalu.

![Deployment evolution](/images/docs/Container_Evolution.svg)

**Era penyebaran tradisional:** Pada awalnya, organisasi menjalankan aplikasinya pada server fisik. Tidak ada cara untuk memisahkan aplikasi-aplikasi pada server fisik, dan ini dapat menyebabkan isu pada alokasinya. Contohnya, jika beberapa aplikasi berjalan pada sebuah server fisik, server tersebut dapat memakan semua sumber daya pada server tersebut, dan hasilnya dapat mengganggu peforma dari aplikasi lainnya. Solusinya ialah menjalankan setiap aplikasi pada server fisik yang berbeda, dan ini tidak dapat diskalakan saat tidak diutilisasikan serta mahal untuk organisasi untuk memelihara banyak server fisik.

**Era penyebaran tervirtualisasi:** Sebagai solusinya, virtualisasi muncul. Teknologi ini memungkinkan untuk menjalankan mesin virtual pada satu CPU server fisik. Virtualisasi juga memungkinkan aplikasi terisolasi antar mesin virtual (VM) dan memberikan level keamanan informasi pada suatu aplikasi sehingga suatu informasi tidak bisa diakses oleh aplikasi lainnya secara bebas.

Virtualisasi juga dapat mengutilisasikan sumber daya pada server fisik dan skalabilitas yang lebih baik karena aplikasi dapat ditambahkan atau diperbarui dengan mudah, mengurangi biaya hardware, dan lain sebagainya.

Setiap mesin virtual merupakan sebuah mesin dengan segala komponen, termasuk sistem operasi, diatas hardware yang tervirtualisasikan.

**Era penyebaran kontainer:** Kontainer mirip dengan mesin virtual, akan tetapi properti isolasinya lebih direlaksikan untuk berbagi sistem operasi diantara aplikasi-aplikasi. Walau begitu, kontainer lebih ringan. Kontainer juga mempunyai filesystem-nya sendiri, berbagi CPU, memory, process space dan lain sebagainya seperti VM. Karena mereka dipisahkan dari infrastruktur yang mendasarinya, mereka portabel di seluruh cloud dan distribusi sistem operasi.

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

Kontainer adalah cara yang baik dalam mengemas dan menjalankan aplikasimu. Pada lingkungan produksi, kamu butuh mengurus kontainer yang menjalankan aplikasi dan memastikan tidak ada *downtime*. Sebagai contoh, jika kontainer *down*, kontainer lainnya harus dijalankan. Bukannya bisa lebih mudah jika ini dilakukan oleh sebuah sistem?

Maka datanglah Kubernetes sebagai "sang juru selamat"! Kubernetes menyediakan sebuah kerangka kerja untuk menjalankan sistem yang terdistribusi yang dapat diandalkan. Ia mengurusi bagaimana aplikasi diskalakan dan menangani kegagalan, memberikan pola penyebaran, dan masih banyak lainnya. Sebagai contoh, Kubernetes bisa dengan mudah mengurus sebuah penyebaran secara *canary* untuk sistemmu.

Kubernetes menyediakanmu:

* **Penulusuran layanan dan penyeimbangan beban**
  Kubernetes dapat mengekspos kontainer dengan nama DNS atau dengan alamat IP-nya sendiri. Jika lalu lintas jaringan ke sebuah kontainer, kubernetes bisa menyeimbangkan beban dan mendistribusikannya secara merata sehingga penyebaran tetap stabil.
* **Orkestrasi penyimpanan**
  Kubernetes memungkinkanmu untuk menautkan sebuah sistem penyimpanan yang kamu pilih, seperti penyimpanan lokal, penyimpanan dari penyedia layanan cloud publik, dan lain sebagainya.
* ***Rollouts* dan *rollbacks* yang terotomasi**
  Kamu bisa menyediakan sebuah kondisi yang diinginkan untuk penyeber kontainermu dengan Kubernetes, dan itu bisa diubah ke kondisi yang sebenarnya diinginkan. Sebagai contoh, kamu bisa mengotomasikan Kubernetes untuk membuat kontainer baru untuk penyebaranmu, menghapus kontainer yang telah ada, dan menggunakan sumber dayanya untuk kontainer baru.
* **Pengemasan bin yang terotomasi**
  Kamu menyediakan Kubernetes dengan sebuah kluster *node* yang dimana bisa digunakan untuk menjalankan tugas-tugas terkontainerisasi. Kamu memberitahukan Kubernetes seberapa banyak CPU dan RAM yang dibutuhkan setiap kontainer. Kubernetes juga bisa menyesuaikan kontainer ke dalam node-nodemu agar dapat menggunakan sumber dayamu dengan baik.
* **Penyembuhan yang mandiri**
  Kubernetes memulai ulang kontainer yang gagal, mengganti kontainer, menghapus kontainer yang tidak memberikan respons ke pemeriksaan yang kamu definisikan, dan tidak akan menggunakan kontainer ke klien sampai benar-benar siap.
* **Manajemen informasi sensitif dan konfigurasi**
  Kubernetes memungkinkanmu untuk menyimpan dan mengatur informasi sensitif, seperti password, token OAuth, dan SSH keys. Kamu juga bisa menyebarkan dan memperbarui informasi rahasia dan konfigurasi aplikasi tanpa membuat image kontainer baru, dan tanpa mengekspos informasi rahasia ke stak konfigurasi.

## Yang tidak ada di Kubernetes

Kubernetes bukanlah sistem yang tradisional, semuanya merupakan sistem PaaS (Platform as a Service). Sejak Kubernetes beroperasi pada level kontainer dibandingkan pada level *hardware*, Kubernetes menyediakan suatu fitur umum untuk menawarkan PaaS, seperti penyebaran, penskalaan, penyeimbangan beban, dan memungkinkan pengguna untuk mengintegrasikan *logging* mereka. Walau begitu, Kubernetes bukanlah monolitik, dan solusi bawaan yang opsional dan bisa lepas-pasangkan. Kubernetes menyediakan blok pembangun untuk membangun platform untuk pengembang, dengan tetap memberikan keleluasaan dan fleksibilitas sesuai keinginan pengguna yang dimana hal tersebut penting.

Kubernetes:

* Tidak menyediakan tipe aplikasi yang didukung. Kubernetes diarahkan agar mendukung berbagai jenis beban kerja, termasuk *stateless*, *stateful*, dan *data-processing*. Jika aplikasi dapat berjalan sebagai sebuah kontainer, hal itu akan berjalan baik di Kubernetes.
* Tak dapat menyebarkan sumber kode dan membuat aplikasimu.  Beban kerja Continuous Integration, Delivery, and Deployment (CI/CD) ditentukan oleh kultur organisasi dan preferensi sesuai dengan kebutuhan teknis.
* Tidak menyediakan layanan level aplikasi, seperti middleware (contohnya, *message buses*), kerangka kerja data-processing (contohnya, Spark), basis data (contohnya, MySQL), *caches*, dan  kluster sistem penyimpanan (contohnya, Ceph) sebagai layanan bawaan. Komponen tersebut bisa berjalan di atas Kubernetes, dan/atau bisa diakses oleh aplikasi yang berjalan di atas Kubernetes lewat mekanisme portabel, seperti Open Service Broker
* Tidak mendikte *logging*, *monitoring*, ataupun solusi *alerting*. Hal itu disediakan sebagai suatu intergrasi Proof of Concept (PoC), dan mekanismenya untuk mengumpulkan dan mengekspor metrik.
* Tidak menyediakan ataupun mengharuskan ke suatu bahasa konfigurasi/sistem (contohnya, jsonnet). Kubernetes menyediakan API deklaratif yang mungkin ditargetkan oleh suatu fomulir dari spesifikasi yang deklaratif.
* Tidak menyediakan ataupun mengadopsi konfigurasi, pemeliharaan, menajemen serta sistem penyembuhan mandiri mesin apapun yang komprehensif.
* Tambahan, Kubernetes bukanlah sekadar sistem orkestrasi saja. Faktanya, Kubernetes menghilangkan kebutuhan untuk orkestrasi. Definisi teknis mengenai orkestrasi adalah alur kerja yang eksekusinya terdefinisikan: pertama lakukan A, lalu B, lalu C. Sebenarnya, Kubernetes terdiri dari satu set independen, kontrol yang bisa dikomposisi prosesnya secara terus menerus agar keadaan sekarang bisa didorong ke keadaan yang diinginkan. Jadi tidak penting bagaimana kamu mendapatkan sesuatu dari A ke C. Kontrol yang tersentralisasi juga tak dibutuhkan. Jadi hal ini memudahkan penggunaan dan hasilnya lebih *powerful*, *robust*, *resilient*, dan dapat diekstensikan

## {{% heading "whatsnext" %}}

*   Siap untuk [memulai](/docs/setup/)?
*   Untuk penjelasan lebih rinci, silahkan lihat [Dokumentasi Kubernetes](/docs/home/).



