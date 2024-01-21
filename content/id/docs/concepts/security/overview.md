---
title: Ikhtisar Keamanan Cloud Native
content_type: concept
weight: 1
---

{{< toc >}}

<!-- overview -->
Keamanan Kubernetes (dan keamanan secara umum) adalah sebuah topik sangat luas yang memiliki banyak bagian yang sangat berkaitan satu sama lain. Pada masa sekarang ini di mana perangkat lunak _open source_ telah diintegrasi ke dalam banyak sistem yang membantu berjalannya aplikasi web, ada beberapa konsep menyeluruh yang dapat membantu intuisimu untuk berpikir tentang konsep keamanan secara menyeluruh. Panduan ini akan mendefinisikan sebuah cara/model berpikir untuk beberapa konsep umum mengenai Keamanan _Cloud Native_. Cara berpikir ini sepenuhnya subjektif dan kamu sebaiknya hanya menggunakannya apabila ini membantumu berpikir tentang di mana harus mengamankan _stack_ perangkat lunakmu.


<!-- body -->

## 4C pada Keamanan _Cloud Native_

Mari memulainya dengan sebuah diagram yang dapat membantumu mengerti bagaimana berpikir tentang keamanan dalam bentuk beberapa lapisan.
{{< note >}}
Pendekatan berlapis ini memperkuat pendekatan [_defense in depth_](https://en.wikipedia.org/wiki/Defense_in_depth_(computing)) terhadap keamanan, yang secara luas dianggap sebagai praktik terbaik untuk mengamankan sistem-sistem perangkat lunak. 4C tersebut adalah Cloud, Cluster, Container, dan Code.
{{< /note >}}

{{< figure src="/images/docs/4c.png" title="The 4C's of Cloud Native Security" >}}

Seperti yang dapat kamu lihat dari gambar di atas, setiap dari 4C tersebut bergantung pada keamanan dari kotak yang lebih besar di mana mereka berada. Hampir tidak mungkin untuk mengamankan sistem terhadap standar-standar keamanan yang buruk pada Cloud, Container, dan Code hanya dengan menangani keamanan pada lapisan kode. Akan tetapi, apabila semua area tersebut ditangani dengan baik, maka menambahkan keamanan ke dalam kode kamu akan memperkuat landasan yang sudah kuat. Area-area yang menjadi perhatian ini akan dideskripsikan lebih mendalam di bawah.

## Cloud

Dalam banyak hal, Cloud (atau server-server _co-located_, atau pusat data/_data center_ korporat) adalah [_trusted computing base_ (basis komputasi yang dipercaya)](https://en.wikipedia.org/wiki/Trusted_computing_base) dari sebuah klaster Kubernetes. Jika komponen-komponen tersebut rentan secara keamanan (atau dikonfigurasi dengan cara yang rentan), maka sesungguhnya tidak ada cara untuk menjamin keamanan dari komponen-komponen apa pun yang dibangun di atas basis komputasi ini. Memberikan rekomendasi untuk keamanan cloud berada di luar lingkup panduan ini, karena setiap penyedia layanan cloud dan beban kerja pada dasarnya berbeda-beda. Berikut beberapa tautan menuju beberapa dokumentasi penyedia layanan cloud yang populer untuk keamanan maupun untuk memberikan panduan umum untuk mengamankan infrastruktur yang menjadi basis sebuah klaster Kubernetes.

### Tabel Keamanan Penyedia Layanan Cloud

IaaS Provider        | Link |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
Huawei Cloud | https://www.huaweicloud.com/intl/id-id/securecenter/overallsafety |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security/ |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |

Jika kamu mengoperasikan perangkat keras kamu sendiri, atau penyedia layanan cloud yang berbeda, kamu perlu merujuk pada dokumentasi penyedia layanan cloud yang kamu pakai untuk praktik keamanan terbaik.

### Tabel Panduan Umum Infrastruktur

Area yang Menjadi Perhatian untuk Infrastruktur Kubernetes | Rekomendasi |
--------------------------------------------- | ------------ |
Akses Jaringan terhadap API Server (Master-master) | Secara Ideal, semua akses terhadap Master-master Kubernetes tidak diizinkan secara publik pada internet, dan dikontrol oleh daftar kendali akses (_network ACL_) yang dibatasi untuk kumpulan alamat IP yang dibutuhkan untuk mengelola klaster. |
Akses Jaringan terhadap Node-node (Server-server Worker)| Node-node harus dikonfigurasikan untuk _hanya_ menerima koneksi-koneksi (melalui daftar kendali akses) dari Master-master pada porta-porta (_port_) yang telah ditentukan, dan menerima koneksi-koneksi dari Service-service Kubernetes dengan tipe NodePort dan LoadBalancer. Apabila memungkinkan, Node-node tersebut sebaiknya tidak diekspos pada internet publik sama sekali. |
Akses Kubernetes terhadap API Penyedia Layanan Cloud | Setiap penyedia layanan cloud perlu memberikan kumpulan izin yang berbeda-beda untuk Master-master dan Node-node Kubernetes, sehingga rekomendasi ini sifatnya lebih umum. Praktik terbaiknya adalah untuk memberikan klaster akses terhadap penyedia layanan cloud yang mengikuti [_principle of least privilege_ (prinsip hak istimewa paling sedikit)](https://en.wikipedia.org/wiki/Principle_of_least_privilege) untuk sumber daya yang klaster tersebut perlukan untuk dikelola. Sebuah contoh untuk Kops di AWS dapat ditemukan di sini: https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles |
Akses terhadap etcd | Akses terhadap etcd (tempat penyimpanan data Kubernetes) harus dibatasi hanya untuk Master-master saja. Bergantung pada konfigurasimu, kamu sebaiknya juga mengusahakan koneksi etcd menggunakan TLS. Informasi lebih lanjut dapat ditemukan di sini: https://github.com/etcd-io/etcd/tree/master/Documentation#security |
Enkripsi etcd | Di mana pun kita dapat melakukannya, mengenkripsi semua data saat diam (_at rest_) pada semua _drive_, dan sejak etcd menyimpan keadaan seluruh klaster (termasuk Secret-secret), _disk_-nya sebaiknya kita enkripsi saat diam. |

## Cluster

Bagian ini akan memberikan tautan-tautan untuk mengamankan beban-beban kerja di dalam Kubernetes. Ada dua area yang menjadi perhatian untuk mengamankan Kubernetes:

* Mengamankan komponen-komponen yang dapat dikonfigurasi yang membentuk klaster
* Mengamankan komponen-komponen yang dijalankan di dalam klaster

### Komponen-komponen _dari_ Cluster

Jika kamu ingin menjaga klastermu dari akses yang tidak disengaja atau yang bersifat serangan, dan mengadopsi praktik yang baik, baca dan ikutilah nasihat untuk [mengamankan klastermu](/docs/tasks/administer-cluster/securing-a-cluster/).

### Komponen-komponen _di dalam_ Cluster (aplikasimu)

Bergantung pada permukaan yang dapat diserang dari aplikasimu, kamu mungkin ingin berfokus pada aspek keamanan yang spesifik. Sebagai contoh, jika kamu menjalankan sebuah layanan (kita sebut Layanan A) yang kritikal di dalam rantai sumber daya lainnya dan sebuah beban kerja terpisah (kita sebut Layanan B) yang rentan terhadap serangan _resource exhaustion_, dengan tidak menyetel limit untuk sumber daya maka kamu juga menaruh risiko terhadap Layanan A. Berikut tabel tautan-tautan menuju hal-hal yang perlu diperhatikan untuk mengamankan beban-beban kerja yang berjalan di dalam Kubernetes.

Area yang Menjadi Perhatian untuk Keamanan Beban Kerja | Rekomendasi |
------------------------------ | ------------ |
Otorisasi RBAC (Akses terhadap API Kubernetes) | https://kubernetes.io/docs/reference/access-authn-authz/rbac/ |
Autentikasi | https://kubernetes.io/docs/reference/access-authn-authz/controlling-access/ |
Manajemen Secret Aplikasi (dan mengenkripsi mereka di etcd) | https://kubernetes.io/docs/concepts/configuration/secret/ <br> https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/ |
Pod Security Policy | https://kubernetes.io/docs/concepts/policy/pod-security-policy/ |
Quality of Service (dan manajemen sumber daya klaster) | https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/ |
Network Policy | https://kubernetes.io/docs/concepts/services-networking/network-policies/ |
TLS untuk Ingress Kubernetes | https://kubernetes.io/docs/concepts/services-networking/ingress/#tls |

## Container

Untuk menjalankan perangkat lunak di dalam Kubernetes, perangkat lunak tersebut haruslah berada di dalam sebuah Container. Karenanya, ada beberapa pertimbangan keamanan yang harus diperhitungkan untuk mengambil manfaat dari fitur-fitur keamanan beban kerja Kubernetes. Keamanan Container berada di luar lingkup panduan ini, tetapi berikut disediakan sebuah tabel rekomendasi-rekomendasi umum dan tautan menuju eksplorasi lebih dalam pada topik ini.

Area yang Menjadi Perhatian untuk Container | Rekomendasi |
------------------------------ | ------------ |
Pemindaian Kerentanan Container dan Dependensi Keamanan OS | Sebagai bagian dari tahap membangun sebuah _image_ atau dilakukan secara teratur, kamu sebaiknya memindai Container-container terhadap kerentanan yang telah diketahui dengan peralatan seperti [CoreOS's Clair](https://github.com/coreos/clair/) |
Penandatanganan _Image_ dan Penegakan Aturan | Dua dari Proyek-proyek CNCF (TUF dan Notary) adalah alat-alat yang berguna untuk menandatangani _image_ Container dan memelihara sistem kepercayaan untuk konten dari Container-container kamu. Jika kamu menggunakan Docker, ia dibangun di dalam Docker Engine sebagai [Docker Content Trust](https://docs.docker.com/engine/security/trust/content_trust/). Pada bagian penegakan aturan, proyek [Portieris dari IBM](https://github.com/IBM/portieris) adalah sebuah alat yang berjalan sebagai sebuah Dynamic Admission Controller Kubernetes untuk memastikan bahwa _image-image_ ditandatangani dengan tepat oleh Notary sebelum dimasukkan ke dalam Cluster. |
Larang pengguna-pengguna dengan hak istimewa | Saat membangun Container-container, rujuklah dokumentasimu untuk cara membuat pengguna-pengguna di dalam Container-container yang memiliki hak istimewa sistem operasi yang paling sedikit yang dibutuhkan untuk mencapai tujuan Container tersebut. |

## Code

Akhirnya pada lapisan kode aplikasi, hal ini adalah satu dari permukaan-permukaan serangan utama yang paling dapat kamu kontrol. Hal ini juga berada di luar lingkup Kubernetes, tetapi berikut beberapa rekomendasi:

### Tabel Panduan Umum Keamanan Kode

Area yang Menjadi Perhatian untuk Kode | Rekomendasi |
--------------------------------------------- | ------------ |
Akses hanya melalui TLS | Jika kode kamu perlu berkomunikasi via TCP, idealnya ia melakukan _TLS handshake_ dengan klien sebelumnya. Dengan pengecualian pada sedikit kasus, kelakuan secara bawaan sebaiknya adalah mengenkripsi semuanya (data) pada saat transit (_encryption at transit_). Lebih jauh lagi, bahkan "di belakang dinding api" di dalam VPC kita sebaiknya kita melakukan enkripsi lalu lintas jaringan di antara layanan-layanan. Hal ini dapat dilakukan melalui sebuah proses yang dikenal dengan _mutual TLS_ atau [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) yang melakukan verifikasi dua sisi terhadap komunikasi antara layanan-layanan yang memiliki sertifikat digital. Ada banyak alat-alat yang dapat digunakan untuk mencapai hal ini, seperti [Linkerd](https://linkerd.io/) dan [Istio](https://istio.io/). |
Membatasi cakupan porta komunikasi | Rekomendasi ini sepertinya cukup jelas, tetapi di mana pun dapat dilakukan sebaiknya kamu hanya membuka porta-porta pada layananmu yang benar-benar diperlukan untuk komunikasi sistem atau pengambilan metrik. |
Keamanan Dependensi Pihak ke-3 | Karena aplikasi-aplikasi kita cenderung memiliki dependensi-dependensi di luar kode kita sendiri, merupakan praktik yang baik untuk memastikan hasil pemindaian rutin dependensi-dependensi kode kita masih aman tanpa CVE yang masih ada terhadap mereka. Setiap bahasa pemrograman memiliki alat untuk melakukan pemindaian ini secara otomatis. |
Analisis Statis Kode | Kebanyakan bahasa pemrograman menyediakan cara agar potongan kode dapat dianalisis terhadap praktik-praktik penulisan kode yang berpotensi tidak aman. Kapan pun dapat dilakukan, kamu sebaiknya melakukan pemeriksaan menggunakan peralatan otomatis yang dapat memindai kode terhadap kesalahan keamanan yang umum terjadi. Beberapa dari peralatan tersebut dapat ditemukan di sini: https://www.owasp.org/index.php/Source_Code_Analysis_Tools |
Serangan Pengamatan (_probing_) Dinamis | Ada sedikit peralatan otomatis yang dapat dijalankan terhadap layanan/aplikasi kamu untuk mencoba beberapa serangan yang terkenal dan umumnya memengaruhi layanan-layanan. Serangan-serangan tersebut termasuk _SQL injection_, CSRF, dan XSS. Satu dari alat analisis dinamis yang terkenal adalah OWASP Zed Attack Proxy https://www.owasp.org/index.php/OWASP_Zed_Attack_Proxy_Project |

## Otomasi yang Kokoh

Kebanyakan dari saran yang disebut di atas dapat diotomasi di dalam _delivery pipeline_ kode kamu sebagai bagian dari rangkaian pemeriksaan keamanan. Untuk mempelajari lebih lanjut tentang pendekatan "_Continuous Hacking_" terhadap _delivery_ perangkat lunak, [artikel ini](https://thenewstack.io/beyond-ci-cd-how-continuous-hacking-of-docker-containers-and-pipeline-driven-security-keeps-ygrene-secure/) menyediakan lebih banyak detail.


## {{% heading "whatsnext" %}}


* Pelajari tentang [Network Policy untuk Pod](/id/docs/concepts/services-networking/network-policies/)
* Pelajari tentang [mengamankan klaster kamu](/docs/tasks/administer-cluster/securing-a-cluster/)
* Pelajari tentang [kontrol akses API](/docs/reference/access-authn-authz/controlling-access/)
* Pelajari tentang [enkripsi data saat transit](/id/docs/tasks/tls/managing-tls-in-a-cluster/) for the control plane
* Pelajari tentang [enkripsi data saat diam](/docs/tasks/administer-cluster/encrypt-data/)
* Pelajari tentang [Secret (data sensitif) pada Kubernetes](/id/docs/concepts/configuration/secret/)


