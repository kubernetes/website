---
title: Disrupsi
content_template: templates/concept
weight: 60
---

{{% capture overview %}}
Petunjuk ini diperuntukkan bagi pemilik aplikasi yang ingin membuat aplikasi yang memiliki ketersediaan yang tinggi, sehingga dibutuhkan untuk mengerti jenis-jenis Gangguan yang dapat terjadi pada Pods.

Petunjuk ini juga diperuntukkan bagi administrator kluster yang ingin melakukan berbagai tindakan otomasi pada kluster, seperti pembaruan dan *autoscaling* kluster.

{{% /capture %}}

{{% capture body %}}

## Disrupsi yang Disengaja dan Tidak Disengaja

Pods tidak akan terhapus hingga sesuatu (orang maupun *controller*) menghancurkan mereka atau ada kesalahan perangkat keras maupun perangkat lunak yang tidak dapat dihindari.

Kita menyebut kasus-kasus yang tidak dapat dihindari sebagai *disrupsi yang tidak disengaja* terhadap aplikasi. Beberapa contohnya adalah sebagai berikut:

- Kesalahahan perangkat keras pada mesin yang menjalankan Node
- Administrator kluster menghapus *virtual machine* secara tidak sengaja
- Kesalahan pada penyedia layanan cloud yang mengakibatkan terhapusnya *virtual machine*
- Sebuah *kernel panic*
- Node menghilang dari kluster karena partisi jaringan kluster
- Diusirnya Pod karena Node [kehabisan sumber daya](/docs/tasks/administer-cluster/out-of-resource)

Dengan pengecualian pada kondisi kehabisan sumber daya, kondisi-kondisi tersebut pada umumnya diketahui oleh kebanyakan pengguna; Kondisi-kondisi tersebut tidak hanya terjadi pada Kubernetes

Kita menyebut kasus-kasus lainnya sebagai *disrupsi yang disengaja*. Hal ini termasuk tindakan yang dilakukan oleh pemilik aplikasi atau yang dilakukan oleh administrator kluster. Pemilik aplikasi umumnya melakukan hal-hal berikut:

- Menghapus Deployment atau pengontrol yang mengatur Pod
- Memperbarui templat Pod yang menyebabkan pengulangan kembali/*restart*
- Menghapus Pod secara langsung

Administrator kluster umumnya melakukan hal-hal berikut:

- [Menguras Node](/docs/tasks/administer-cluster/safely-drain-node/) untuk perbaikan atau pembaruan.
- Menguras sebuah node dari kluster untuk memperkecil ukuran kluster (untuk lebih lanjutnya, pelajari [*Autoscaling kluster*](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaler)).
- Menghapus sebuah Pod dari node untuk memuat Pod lain ke node tersebut.

Tindakan-tindakan tersebut dapat dilakukan secara langsung oleh administrator kluster, atau oleh alat otomasi yang dijalankan oleh administrator kluster, atau oleh penyedia layanan cloud.

Tanyakan administrator kluster atau penyedia layanan cloud anda, atau lihatlah dokumentasi penyedia layanan cloud anda untuk mengetahui bila ada sumber-sumber yang berpotensi mengakibatkan disrupsi yang disengaja yang ada pada kluster anda. Jika tidak ada, anda bisa melewatkan pembuatan *PodDisruptionBudget*

{{< caution >}}
Tidak semua disrupsi yang disengaja dibatasi oleh Pod Disruption Budgets. Contohnya, menghapus Deployment atau Pod dapat mengabaikan PodDisruptionBudget.
{{< /caution >}}

## Mengatasi Disrupsi

Berikut beberapa cara untuk mengatasi disrupti yang tidak disengaja:

- Pastikan Pod-pod anda [merinci permintaan sumber daya kluster](/docs/tasks/configure-Pod-container/assign-cpu-ram-container) yang dibutuhkan.
- Replikasikan aplikasi anda jika membutuhkan ketersediaan yang tinggi. (Pelajari tentang menjalankan aplikasi
[stateless](/docs/tasks/run-application/run-stateless-application-deployment/) dan [stateful](/docs/tasks/run-application/run-replicated-stateful-application/)).
- Untuk mencapai ketersediaan yang bahkan lebih tinggi lagi saat mereplikasikan aplikasi, sebarkanlah Pod-pod anda di rak-rak pada *data center* (menggunakan [*anti-affinity*](/docs/user-guide/node-selection/#inter-Pod-affinity-and-anti-affinity-beta-feature)) atau di seluruh zona (jika anda menggunakan [kluster pada beberapa zona](/docs/setup/multiple-zones)).

Frekuensi disrupsi yang disengaja dapat berubah-ubah. Pada kluster Kubernetes yang dasar, tidak ada disrupsi yang disengaja sama sekali. Tetapi, administrator kluster atau penyedia layanan cloud anda mungkin saja menjalankan beberapa servis tambahan yang dapat mengakibatkan disrupsi yang disengaja. Misalnya, memperbarui perangkat lunak pada node yang dapat mengakibatkan disrupsi yang disengaja. Selain itu, beberapa implementasi *autoscaling* kluster (atau node) dapat mengakibatkan disrupsi yang disengaja untuk merapikan dan memadatkan node-node pada kluster.
Administrator kluster atau penyedia layanan cloud anda perlu mendokumentasikan tingkatan disrupsi yang disengaja, jika ada disrupsi yang telah diperkirakan.

Kubernetes menawarkan fitur-fitur untuk membantu menjalankan aplikasi-aplikasi dengan ketersediaan tinggi bersamaan dengan seringnya disrupsi yang disengaja. Fitur
Kubernetes offers features to help run highly available applications at the same
time as frequent voluntary disruptions. Fitur-fitur tersebut disebut *Disruption Budgets*.

## Bagaimana cara kerja *Disruption Budgets* 

Pemilik aplikasi dapat membuat obyek `PodDisruptionBudget` (PDB) untuk setiap aplikasi. Sebuah PDB membatasi jumlah Pod yang boleh mati secara bersamaan pada aplikasi yang direplikasi dikarenakan disrupsi yang disengaja.
Misalnya, sebuah aplikasi yang bekerja secara *quorum* mau memastikan bahwa jumlah replika yang berjalan tidak jatuh ke bawah yang dibutuhkan untuk membentuk sebuah *quorum*. Contoh lainnya, sebuah *front-end* web mungkin perlu memastikan bahwa jumlah replika yang melayani trafik tidak pernah turun ke total presentase yang telah ditentukan.

Pengatur kluster dan penyedia layanan cloud sebaiknya menggunakan alat-alat yang menghormati PDB dengan cara berkomunikasi dengan [Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#the-eviction-api) dari pada menghapus Pod atau Deployment secara langsung. Contohnya adalah perintah `kubectl drain` dan skrip pembaruan Kubernets-on-GCE (`cluster/gce/upgrade.sh`)

Saat seorang administrator kluster ingin menguras sebuah node, ia akan menggunakan perintah `kubectl drain`. Alat tersebut mencoba untuk "mengusir" semua Pod di node tersebut. Permintaan untuk mengusir Pod tersebut mungkin ditolak untuk sementara, dan alat tersebut akan mencoba ulang permintaannya secara periodik hingga semua Pod dihapus, atau hingga batas waktu yang ditentukan telah dicapai.

Sebua PDB merinci jumlah replika yang dapat ditoleransi oleh sebuah aplikasi, relatif terhadap berapa banyak yang seharusnya dimiliki oleh aplikasi tersebut. Sebagai contoh, sebuah Deployment yang memiliki rincian `.spec.replicas :5` diharapkan memiliki 5 Pod pada satu waktu. Jika PDB aplikasi tersebut mengizinkan ada 4 replika pada satu waktu, maka Eviction API akan mengizinkan disrupsi yag disengaja sebanyak satu, tapi tidak mengizinkan dua, pada satu waktu.

Sebuah kelompok Pod yang mewakili aplikasi dispesifikasikan menggunakan sebuah *label selector* yang sama dengan yang digunakan oleh penggatur aplikasi tersebut (Deployment, StatefulSet, dsb.)

Jumlah Pod yang "diharapkan" dihitung dari `.spec.replicas` dari pengontrol Pod tersebut. Pengontrol dari sebuah Pod dapat ditemukan di spesifikasi `.metadata.ownerReferences` objek Pod yang bersangkutan.

PDB tidak dapat mencegah [disrupsi yang tidak disengaja](#disrupsi-yang-disengaja-dan-tidak-disengaja), tapi disrupsi ini akan dihitung terhadap bujet PDB.

Pod yang dihapus atau tidak tersetia dikarenakan pembaruan bertahap juga dihitung terhadap bujet PDB, tetapi pengontrol (seperti Deployment dan StatefulSet) tidak dibatasi oleh PDB ketika melakukan pembaruan bertahap; Penanganan kerusakan saat pembaruan aplikasi dikonfigurasikan pada spesifikasi pengontrol. (Pelajari tentang [memperbarui sebuah Deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment).)

Saat sebuah Pod diusir menggunakan *eviction API*, Pod tersebut akan dihapus secara *graceful* (lihat `terminationGracePeriodSeconds` pada [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#Podspec-v1-core).))

## Contoh PDB

Kita ambil contoh sebuah kluster dengan 3 node, `node-1` hingga `node-3`.
Kluster tersebut menjalankan beberapa aplikasi. Salah satu dari aplikasi tersebut awalnya memiliki 3 replika, yang akan kita namai `Pod-a`, `Pod-b`, dan `Pod-c`. Sebuah Pod lain yang tidak bersangkutan dan tidak memiliki PDB, dinamai `Pod-x` juga terlihat. Awalnya, Pod-pod tersebut berada pada node-node sebagai berikut:

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| Pod-a  *available*   | Pod-b *available*   | Pod-c *available*  |
| Pod-x  *available*   |                     |                    |

3 Pod `Pod-a` hingga `Pod-c` adalah bagian dari sebuah Deployment, dan mereka secara kolektif memiliki sebuah PDB yang mengharuskan ada setidaknya 2 dari 3 Pod untuk tersedia sepanjang waktu.

Sebagai contoh, asumsikan administrator kluster ingin me-*reboot* ke dalam versi kernel baru untuk memperbaiki kesalahan di dalam kernel lama. Administator kluster pertama-tama mencoba untuk menguras `node-1` menggunakan perintan `kubectl drain`. Perintah tersebut mencoba untuk mengusir `Pod-a` dan `Pod-x`. Hal ini langsung berhasil. Kedua Pod tersebut masuk ke dalam kondisi `terminating` secara bersamaan. Hal ini mengubah kondisi kluster menjadi sebagai berikut:

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| Pod-a  *terminating* | Pod-b *available*   | Pod-c *available*  |
| Pod-x  *terminating* |                     |                    |

Deployment tersebut melihat bahwa salah satu Pod berada dalam kondisi `terminating`, sehingga Deployment mencoba untuk membuat penggantinya, `Pod-d`. Sejak `node-1` ditutup (karena perintah `kubectl-drain`), `Pod-d` masuk ke node lainnya. Sesuatu juga membuat `Pod-y` sebagai pengganti `Pod-x`

(Catatan: untuk sebuah StatefulSet, `Pod-a`, akan dinamai dengan `Pod-1`, harus diterminasi hingga selesai sebelum penggantinya, yang juga dinamai `Pod-1` tetapi memiliki UID yang berbeda, akan dibuat. Selain hal ini, seluruh contoh ini juga berlaku untuk StatefulSet.)

Sekarang, kluster berada pada kondisi berikut:

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| Pod-a  *terminating* | Pod-b *available*   | Pod-c *available*  |
| Pod-x  *terminating* | Pod-d *starting*    | Pod-y              |

Pada satu waktu, Pod-pod yang diusir pun selesai diterminasi, dan kondisi kluster menjadi seperti berikut:

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | Pod-b *available*   | Pod-c *available*  |
|                      | Pod-d *starting*    | Pod-y              |

Pada titik ini, jika seorang administrator kluster yang tidak sabar mencoba untuk menguras `node-2` atau `node-3`, perintah untuk menguras node tersebut akan terhalang, karena hanya ada 2 Pod yang tersedia, dan PDB-nya membutuhkan setidaknya ada 2 Pod tersedia. Setelah beberapa waktu, `Pod-d` menjadi tersedia.

Kondisi kluster menjadi seperti berikut:

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | Pod-b *available*   | Pod-c *available*  |
|                      | Pod-d *available*   | Pod-y              |

Sekarang, administrator kluster mencoba untuk menguras `node-2`. Perintah pengurasan tersebut akan mencoba mengusir Pod-pod tersebut secara berurutan (tidak bersamaan), misalnya `Pod-b` yang pertama dan diikuti dengan `Pod-d`. Perintah tersebut akan berhasil mengusir `Pod-b`. Tetapi, pada saat ia mencoba untuk mengusir `Pod-d`, hal tersebut akan ditolak karena hal tersebut akan mengakibatkan hanya satu Pod yang tersedia untuk Deployment yang bersangkutan.

Deployment tersebut membuat pengganti `Pod-b` yang dinamai `Pod-e`.
Karena tidak ada sumber daya kluster yang cukup untuk mengalokasikan `Pod-e`, pengurasan akan kembali terhalang.
Kluster mungkin berada pada kondisi berikut:

|    node-1 *drained*  |       node-2        |       node-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | Pod-b *available*   | Pod-c *available*  | Pod-e *pending*    |
|                      | Pod-d *available*   | Pod-y              |                    |

Pada titik ini, administrator kluster mesti menambah sebuah node untuk kluster agar bisa melanjutkan pembaruan kluster.

Anda dapat melihat bagaimana frekuensi disrupsi dapat berubah-ubah pada Kubernetes, tergantung pada:

- Berapa banyak replika yang dibutuhkan sebuah aplikasi
- Berapa lama waktu yang dibutuhkan untuk mematikan sebuah Pod secara *graceful*
- Berapa lama waktu yang dibutuhkan untuk memulai sebuah Pod
- Tipe pengontrol
- Kapasitas sumber daya kluster

## Memisahkan Peran Pemilik Kluster dan Pemilik Aplikasi

Seringkali akan bermanfaat untuk berpikir Administrator Kluster dan Pemilik Aplikasi sebagai peran yang terpisah dan dengan pengetahuan yang terbatas satu sama lainnya. Pemisahan ini dapat dimengerti dalam beberapa skenario berikut:

- Saat ada banyak tim aplikasi yang berbagi pakai sebuah kluster Kubernetes, dan ada pembagian peran yang spesifik
- Saat alat atau servis pihak ketiga digunakan untuk melakukan otomasi manajemen kluster.

PDB mendukung pemisahan peran ini dengan cara menyediakan antarmuka bagi peran-peran tersebut.

Jika anda tidak memiliki pemisahan peran seperti ini pada organisasi anda, anda mungkin tidak membutuhkan PDB.

## Bagaimana cara melakukan Tindakan Disruptif terhadap Kluster anda

Jika anda adalah Administrator Kluster, maka anda mesti melakukan tindakan disruptif pada setiap node di kluster anda, seperti melakukan pembaruan perangkat lunak pada node, berikut beberapa opsinya:

- Menerima *downtime* pada saat pembaruan node
- Melakukan *failover* ke replika lengkap kluster lain.
  - Tanpa *downtime*, tetapi mungkin lebih mahal, baik ongkos duplikasi node-node dan tenaga yang dibutuhkan untuk melakukan *failover*.
- Membuat aplikasi yang toleran terhadap disrupsi, dan gunakan PDB.
  - Tanpa *downtime*.
  - Duplikasi sumber daya yang minimal.
  - Mengizinkan lebih banyak otomasi administrasi kluster.
  - Membuat aplikasi yang toleran terhadap disrupsi agak rumit, tetapi usaha yang dilakukan untuk menoleransi disrupsi yang disengaja kebanyakan beririsan dengan usaha untuk mendukung *autoscaling* dan menoleransi disrupsi yang tidak disengaja.

{{% /capture %}}

{{% capture whatsnext %}}

- Ikuti langkah-langkah untuk melindungi aplikasi anda dengan [membuat sebuah PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/).

- Pelajari lebih lanjut mengenai [menguras node](/docs/tasks/administer-cluster/safely-drain-node/).

{{% /capture %}}
