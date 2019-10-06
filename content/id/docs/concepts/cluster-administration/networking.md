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

## Bagaimana menerapkan model jaringan Kubernetes

Ada beberapa cara agar model jaringan ini dapat diimplementasikan. Dokumen ini bukan studi lengkap tentang berbagai metode, tetapi semoga berfungsi sebagai pengantar ke berbagai teknologi dan berfungsi sebagai titik awal.

Opsi jaringan berikut ini disortir berdasarkan abjad - urutan tidak menyiratkan status istimewa apa pun.

### ACI

[Infrastruktur Sentral Aplikasi Cisco](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html) menawarkan solusi SDN overlay dan underlay terintegrasi yang mendukung kontainer, mesin virtual, dan _bare metal server_. [ACI](https://www.github.com/noironetworks/aci-containers) menyediakan integrasi jaringan kontainer untuk ACI. Tinjauan umum integrasi disediakan [di sini](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf).

### AOS dari Apstra

[AOS](http://www.apstra.com/products/aos/) adalah sistem Jaringan Berbasis Intent yang menciptakan dan mengelola lingkungan pusat data yang kompleks dari platform terintegrasi yang sederhana. AOS memanfaatkan desain terdistribusi sangat _scalable_ untuk menghilangkan pemadaman jaringan sambil meminimalkan biaya.

Desain Referensi AOS saat ini mendukung _host_ yang terhubung dengan Lapis-3 yang menghilangkan masalah peralihan Lapis-2 yang lama. Host Lapis-3 ini bisa berupa _server_ Linux (Debian, Ubuntu, CentOS) yang membuat hubungan tetangga BGP secara langsung dengan _top of rack switches_ (TORs). AOS mengotomatisasi kedekatan perutean dan kemudian memberikan kontrol yang halus atas _route health injections_ (RHI) yang umum dalam _deployment_ Kubernetes.

AOS memiliki banyak kumpulan endpoint REST API yang memungkinkan Kubernetes dengan cepat mengubah kebijakan jaringan berdasarkan persyaratan aplikasi. Peningkatan lebih lanjut akan mengintegrasikan model Grafik AOS yang digunakan untuk desain jaringan dengan penyediaan beban kerja, memungkinkan sistem manajemen ujung ke ujung untuk layanan cloud pribadi dan publik.

AOS mendukung penggunaan peralatan vendor umum dari produsen termasuk Cisco, Arista, Dell, Mellanox, HPE, dan sejumlah besar sistem white-box dan sistem operasi jaringan terbuka seperti Microsoft SONiC, Dell OPX, dan Cumulus Linux.

Detail tentang cara kerja sistem AOS dapat diakses di sini: http://www.apstra.com/products/how-it-works/

### AWS VPC CNI untuk Kubernetes

[AWS VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s) menawarkan jaringan AWS _Virtual Private Cloud_ (VPC) terintegrasi untuk kluster Kubernetes. Plugin CNI ini menawarkan _throughput_ dan ketersediaan tinggi, latensi rendah, dan _jitter_ jaringan minimal. Selain itu, pengguna dapat menerapkan jaringan AWS VPC dan praktik keamanan terbaik untuk membangun kluster Kubernetes. Ini termasuk kemampuan untuk menggunakan catatan aliran VPC, kebijakan perutean VPC, dan grup keamanan untuk isolasi lalu lintas jaringan.

Menggunakan _plugin_ CNI ini memungkinkan _pod_ Kubernetes memiliki alamat IP yang sama di dalam _pod_ seperti yang mereka lakukan di jaringan VPC. CNI mengalokasikan AWS _Elastic Networking Interfaces_ (ENIs) ke setiap node Kubernetes dan menggunakan rentang IP sekunder dari setiap ENI untuk _pod_ pada _node_. CNI mencakup kontrol untuk pra-alokasi ENI dan alamat IP untuk waktu mulai _pod_ yang cepat dan memungkinkan kluster besar hingga 2.000 _node_.

Selain itu, CNI dapat dijalankan bersama [Calico untuk penegakan kebijakan jaringan](https://docs.aws.amazon.com/eks/latest/userguide/calico.html). Proyek AWS VPC CNI adalah _open source_ dengan [dokumentasi di GitHub](https://github.com/aws/amazon-vpc-cni-k8s).

### Big Cloud Fabric dari Big Switch Networks

[Big Cloud Fabric](https://www.bigswitch.com/container-network-automation) adalah arsitektur jaringan asli layanan _cloud_, yang dirancang untuk menjalankan Kubernetes di lingkungan _cloud_ pribadi / lokal. Dengan menggunakan SDN fisik & _virtual_ terpadu, Big Cloud Fabric menangani masalah yang sering melekat pada jaringan kontainer seperti penyeimbangan muatan, visibilitas, pemecahan masalah, kebijakan keamanan & pemantauan lalu lintas kontainer.

Dengan bantuan arsitektur multi-penyewa _pod cloud_ Big Cloud Fabric, sistem orkestrasi kontainer seperti Kubernetes, RedHat OpenShift, Mesosphere DC/OS & Docker Swarm akan terintegrasi secara alami bersama dengan sistem orkestrasi VM seperti VMware, OpenStack & Nutanix. Pelanggan akan dapat terhubung dengan aman berapa pun jumlah klusternya dan memungkinkan komunikasi antar penyewa di antara mereka jika diperlukan.

Terbaru ini BCF diakui oleh Gartner sebagai visioner dalam [_Magic Quadrant_](http://go.bigswitch.com/17GatedDocuments-MagicQuadrantforDataCenterNetworking_Reg.html). Salah satu penyebaran BCF Kubernetes di tempat (yang mencakup Kubernetes, DC/OS & VMware yang berjalan di beberapa DC di berbagai wilayah geografis) juga dirujuk [di sini](https://portworx.com/architects-corner-kubernetes-satya-komala-nio/).

### Cilium

[Cilium](https://github.com/cilium/cilium) adalah perangkat lunak _open source_ untuk menyediakan dan secara transparan mengamankan konektivitas jaringan antar kontainer aplikasi. Cilium mengetahui L7/HTTP dan dapat memberlakukan kebijakan jaringan pada L3-L7 menggunakan model keamanan berbasis identitas yang dipisahkan dari pengalamatan jaringan.
