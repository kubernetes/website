---
title: Disrupsi
content_template: templates/concept
weight: 60
---

{{% capture overview %}}
Petunjuk ini ditujukan pada pemilik aplikasi yang meninginkan aplikasinya memiliki ketersediaan yang tinggi, sehingga butuh untuk mengerti jenis-jenis Disrupsi yang dapat terjadi pada Pod-pod.

Petunjuk ini juga ditujukan pada administrator kluster yang ingin melakukan berbagai tindakan otomasi pada kluster, seperti pembaruan dan _autoscaling_ kluster.

{{% /capture %}}

{{% capture body %}}

## Disrupsi yang Disengaja dan Tidak Disengaja

Pod-pod tidak akan terhapus sampai sesuatu (orang ataupun _pengendali_) menghancurkan mereka atau ada kesalahan perangkat keras maupun perangkat lunak yang tidak dapat dihindari.

Kita menyebut kasus-kasus yang tidak dapat dihindari sebagai **disrupsi yang tidak disengaja** terhadap aplikasi. Beberapa contohnya adalah sebagai berikut:

- Kesalahan perangkat keras pada mesin yang menjalankan Node
- Administrator kluster menghapus _virtual machine_ secara tidak sengaja
- Kesalahan pada penyedia layanan _cloud_ yang mengakibatkan terhapusnya _virtual machine_
- Sebuah _kernel panic_
- Node menghilang dari kluster karena partisi jaringan kluster
- Pod mengalami _eviction_ karena Node [kehabisan sumber daya](/docs/tasks/administer-cluster/out-of-resource)

Dengan pengecualian pada kondisi kehabisan sumber daya, kondisi-kondisi tersebut pada umumnya diketahui oleh kebanyakan pengguna karena kondisi-kondisi tersebut tidak spesifik pada Kubernetes saja.

Kita menyebut kasus-kasus lainnya sebagai **disrupsi yang disengaja**. Hal ini termasuk tindakan yang dilakukan oleh pemilik aplikasi atau yang dilakukan oleh administrator kluster. Pemilik aplikasi umumnya melakukan hal-hal berikut:

- Menghapus Deployment atau pengendali yang mengatur Pod
- Memperbarui templat Pod yang menyebabkan pengulangan kembali/_restart_
- Menghapus Pod secara langsung

Administrator kluster umumnya melakukan hal-hal berikut:

- [Melakukan _drain_ terhadap Node](/docs/tasks/administer-cluster/safely-drain-node/) untuk perbaikan atau pembaruan.
- Melakukan _drain_ terhadap sebuah node dari kluster untuk memperkecil ukuran kluster (untuk lebih lanjutnya, pelajari [_Autoscaling_ kluster](/docs/tasks/administer-cluster/cluster-management/#cluster-autoscaler)).
- Menghapus sebuah Pod dari node untuk memuat Pod lain ke node tersebut.

Tindakan-tindakan tersebut dapat dilakukan secara langsung oleh administrator kluster, atau oleh alat otomasi yang dijalankan oleh administrator kluster, atau oleh penyedia layanan Kubernetes kamu.

Tanyakan administrator kluster atau penyedia layanan _cloud_ kamu, atau lihatlah dokumentasi penyedia layanan Kubernetes kamu untuk mengetahui bila ada sumber-sumber yang berpotensi mengakibatkan disrupsi yang disengaja yang ada pada klustermu. Jika tidak ada, kamu bisa melewatkan pembuatan _PodDisruptionBudget_

{{< caution >}}
Tidak semua disrupsi yang disengaja dibatasi oleh Pod Disruption Budget. Contohnya, menghapus Deployment atau Pod dapat mengabaikan PodDisruptionBudget.
{{< /caution >}}

## Mengatasi Disrupsi

Berikut beberapa cara untuk mengatasi disrupsi yang tidak disengaja:

- Pastikan Pod-pod kamu [merinci permintaan sumber daya kluster](/docs/tasks/configure-Pod-container/assign-cpu-ram-container) yang dibutuhkan.
- Replikasikan aplikasimu jika membutuhkan ketersediaan yang tinggi. (Pelajari tentang menjalankan aplikasi
[_stateless_](/docs/tasks/run-application/run-stateless-application-deployment/) dan [_stateful_](/docs/tasks/run-application/run-replicated-stateful-application/)).
- Untuk mencapai ketersediaan yang bahkan lebih tinggi lagi saat mereplikasikan aplikasi, sebarkanlah Pod-pod kamu di rak-rak pada _data center_ (menggunakan [_anti-affinity_](/docs/user-guide/node-selection/#inter-Pod-affinity-and-anti-affinity-beta-feature)) atau di seluruh zona (jika kamu menggunakan [kluster pada beberapa zona](/docs/setup/multiple-zones)).

Frekuensi disrupsi yang disengaja dapat berubah-ubah. Pada kluster Kubernetes yang dasar, tidak ada disrupsi yang disengaja sama sekali. Tetapi, administrator kluster atau penyedia layanan Kubernetes kamu mungkin saja menjalankan beberapa servis tambahan yang dapat mengakibatkan disrupsi yang disengaja. Misalnya, memperbarui perangkat lunak pada node yang dapat mengakibatkan disrupsi yang disengaja. Selain itu, beberapa implementasi _autoscaling_ kluster (atau node) dapat mengakibatkan disrupsi yang disengaja untuk merapikan dan memadatkan node-node pada kluster.
Administrator kluster atau penyedia layanan Kubernetes kamu perlu mendokumentasikan tingkatan disrupsi yang disengaja, jika ada disrupsi yang telah diperkirakan.

Kubernetes menawarkan fitur-fitur untuk membantu menjalankan aplikasi-aplikasi dengan ketersediaan tinggi bersamaan dengan seringnya disrupsi yang disengaja, fitur-fitur tersebut dinamai _Disruption Budget_.

## Bagaimana cara kerja _Disruption Budget_

Pemilik aplikasi dapat membuat objek `PodDisruptionBudget` (PDB) untuk setiap aplikasi. Sebuah PDB membatasi jumlah Pod yang boleh mati secara bersamaan pada aplikasi yang direplikasi dikarenakan disrupsi yang disengaja.
Misalnya, sebuah aplikasi yang bekerja secara _quorum_ mau memastikan bahwa jumlah replika yang berjalan tidak jatuh ke bawah yang dibutuhkan untuk membentuk sebuah _quorum_. Contoh lainnya, sebuah _front-end_ web mungkin perlu memastikan bahwa jumlah replika yang melayani trafik tidak pernah turun ke total persentase yang telah ditentukan.

Administrator kluster dan penyedia layanan Kubernetes sebaiknya menggunakan alat-alat yang menghormati PDB dengan cara berkomunikasi dengan [Eviction API](/docs/tasks/administer-cluster/safely-drain-node/#the-eviction-api) dari pada menghapus Pod atau Deployment secara langsung. Contohnya adalah perintah `kubectl drain` dan skrip pembaruan Kubernets-on-GCE (`cluster/gce/upgrade.sh`)

Saat seorang administrator kluster ingin melakukan _drain_ terhadap sebuah node, ia akan menggunakan perintah `kubectl drain`. Alat tersebut mencoba untuk "mengusir" semua Pod di node tersebut. Permintaan untuk mengusir Pod tersebut mungkin ditolak untuk sementara, dan alat tersebut akan mencoba ulang permintaannya secara periodik hingga semua Pod dihapus, atau hingga batas waktu yang ditentukan telah dicapai.

Sebua PDB merinci jumlah replika yang dapat ditoleransi oleh sebuah aplikasi, relatif terhadap berapa banyak yang seharusnya dimiliki oleh aplikasi tersebut. Sebagai contoh, sebuah Deployment yang memiliki rincian `.spec.replicas :5` diharapkan memiliki 5 Pod pada satu waktu. Jika PDB aplikasi tersebut mengizinkan ada 4 replika pada satu waktu, maka Eviction API akan mengizinkan disrupsi yag disengaja sebanyak satu, tapi tidak mengizinkan dua, pada satu waktu.

Sebuah kelompok Pod yang mewakili aplikasi dispesifikasikan menggunakan sebuah _label selector_ yang sama dengan yang digunakan oleh pengatur aplikasi tersebut (Deployment, StatefulSet, dsb.)

Jumlah Pod yang "diharapkan" dihitung dari `.spec.replicas` dari pengendali Pod tersebut. Pengendali dari sebuah Pod dapat ditemukan di spesifikasi `.metadata.ownerReferences` objek Pod yang bersangkutan.

PDB tidak dapat mencegah [disrupsi yang tidak disengaja](#disrupsi-yang-disengaja-dan-tidak-disengaja), tapi disrupsi ini akan dihitung terhadap bujet PDB.

Pod yang dihapus atau tidak tersetia dikarenakan pembaruan bertahap juga dihitung terhadap bujet PDB, tetapi pengendali (seperti Deployment dan StatefulSet) tidak dibatasi oleh PDB ketika melakukan pembaruan bertahap; Penanganan kerusakan saat pembaruan aplikasi dikonfigurasikan pada spesifikasi pengendali. (Pelajari tentang [memperbarui sebuah Deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment).)

Saat sebuah Pod diusir menggunakan _eviction API_, Pod tersebut akan dihapus secara _graceful_ (lihat `terminationGracePeriodSeconds` pada [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#Podspec-v1-core).))

## Contoh PDB

Kita ambil contoh sebuah kluster dengan 3 node, `node-1` hingga `node-3`.
Kluster tersebut menjalankan beberapa aplikasi. Salah satu dari aplikasi tersebut awalnya memiliki 3 replika, yang akan kita namai `Pod-a`, `Pod-b`, dan `Pod-c`. Sebuah Pod lain yang tidak bersangkutan dan tidak memiliki PDB, dinamai `Pod-x` juga terlihat. Awalnya, Pod-pod tersebut berada pada node-node sebagai berikut:

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| Pod-a  _available_   | Pod-b _available_   | Pod-c _available_  |
| Pod-x  _available_   |                     |                    |

3 Pod `Pod-a` hingga `Pod-c` adalah bagian dari sebuah Deployment, dan mereka secara kolektif memiliki sebuah PDB yang mengharuskan ada setidaknya 2 dari 3 Pod untuk tersedia sepanjang waktu.

Sebagai contoh, asumsikan administrator kluster ingin me-_reboot_ ke dalam versi kernel baru untuk memperbaiki kesalahan di dalam kernel lama. Administator kluster pertama-tama mencoba untuk melakukan _drain_ terhadap `node-1` menggunakan perintah `kubectl drain`. Perintah tersebut mencoba untuk mengusir `Pod-a` dan `Pod-x`. Hal ini langsung berhasil. Kedua Pod tersebut masuk ke dalam kondisi `terminating` secara bersamaan. Hal ini mengubah kondisi kluster menjadi sebagai berikut:

|   node-1 _draining_  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| Pod-a  _terminating_ | Pod-b _available_   | Pod-c _available_  |
| Pod-x  _terminating_ |                     |                    |

Deployment tersebut melihat bahwa salah satu Pod berada dalam kondisi `terminating`, sehingga Deployment mencoba untuk membuat penggantinya, `Pod-d`. Sejak `node-1` ditutup (karena perintah `kubectl-drain`), `Pod-d` masuk ke node lainnya. Sesuatu juga membuat `Pod-y` sebagai pengganti `Pod-x`

(Catatan: untuk sebuah StatefulSet, `Pod-a`, akan dinamai dengan `Pod-1`, harus diterminasi hingga selesai sebelum penggantinya, yang juga dinamai `Pod-1` tetapi memiliki UID yang berbeda, akan dibuat. Selain hal ini, seluruh contoh ini juga berlaku untuk StatefulSet.)

Sekarang, kluster berada pada kondisi berikut:

|   node-1 _draining_  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| Pod-a  _terminating_ | Pod-b _available_   | Pod-c _available_  |
| Pod-x  _terminating_ | Pod-d _starting_    | Pod-y              |

Pada satu waktu, Pod-pod yang diusir pun selesai diterminasi, dan kondisi kluster menjadi seperti berikut:

|    node-1 _drained_  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | Pod-b _available_   | Pod-c _available_  |
|                      | Pod-d _starting_    | Pod-y              |

Pada titik ini, jika seorang administrator kluster yang tidak sabar mencoba untuk melakukan _drain_ terhadap `node-2` atau `node-3`, perintah untuk melakukan _drain_ terhadap node tersebut akan terhalang, karena hanya ada 2 Pod yang tersedia, dan PDB-nya membutuhkan setidaknya ada 2 Pod tersedia. Setelah beberapa waktu, `Pod-d` menjadi tersedia.

Kondisi kluster menjadi seperti berikut:

|    node-1 _drained_  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | Pod-b _available_   | Pod-c _available_  |
|                      | Pod-d _available_   | Pod-y              |

Sekarang, administrator kluster mencoba untuk melakukan _drain_ terhadap `node-2`. Perintah _drain_ tersebut akan mencoba mengusir Pod-pod tersebut secara berurutan (tidak bersamaan), misalnya `Pod-b` yang pertama dan diikuti dengan `Pod-d`. Perintah tersebut akan berhasil mengusir `Pod-b`. Tetapi, pada saat ia mencoba untuk mengusir `Pod-d`, hal tersebut akan ditolak karena hal tersebut akan mengakibatkan hanya satu Pod yang tersedia untuk Deployment yang bersangkutan.

Deployment tersebut membuat pengganti `Pod-b` yang dinamai `Pod-e`.
Karena tidak ada sumber daya kluster yang cukup untuk mengalokasikan `Pod-e`, proses _drain_ akan kembali terhalang.
Kluster mungkin berada pada kondisi berikut:

|    node-1 _drained_  |       node-2        |       node-3       | _no node_          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | Pod-b _available_   | Pod-c _available_  | Pod-e _pending_    |
|                      | Pod-d _available_   | Pod-y              |                    |

Pada titik ini, administrator kluster mesti menambah sebuah node untuk kluster agar bisa melanjutkan pembaruan kluster.

Kamu dapat melihat bagaimana frekuensi disrupsi dapat berubah-ubah pada Kubernetes, tergantung pada:

- Berapa banyak replika yang dibutuhkan sebuah aplikasi
- Berapa lama waktu yang dibutuhkan untuk mematikan sebuah Pod secara _graceful_
- Berapa lama waktu yang dibutuhkan untuk memulai sebuah Pod
- Tipe pengendali
- Kapasitas sumber daya kluster

## Memisahkan Peran Pemilik Kluster dan Pemilik Aplikasi

Seringkali akan bermanfaat untuk berpikir Administrator Kluster dan Pemilik Aplikasi sebagai peran yang terpisah dan dengan pengetahuan yang terbatas satu sama lainnya. Pemisahan ini dapat dimengerti dalam beberapa skenario berikut:

- Saat ada banyak tim aplikasi yang berbagi pakai sebuah kluster Kubernetes, dan ada pembagian peran yang spesifik
- Saat alat atau servis pihak ketiga digunakan untuk melakukan otomasi manajemen kluster.

PDB mendukung pemisahan peran ini dengan cara menyediakan antarmuka bagi peran-peran tersebut.

Jika kamu tidak memiliki pemisahan peran seperti ini pada organisasimu, kamu mungkin tidak membutuhkan PDB.

## Bagaimana cara melakukan Tindakan Disruptif terhadap Kluster

Jika kamu adalah Administrator Kluster, maka kamu mesti melakukan tindakan disruptif pada setiap node di klustermu, seperti melakukan pembaruan perangkat lunak pada node, berikut beberapa opsinya:

- Menerima _downtime_ pada saat pembaruan node
- Melakukan _failover_ ke replika lengkap kluster lain.
  - Tanpa _downtime_, tetapi mungkin lebih mahal, baik ongkos duplikasi node-node dan tenaga yang dibutuhkan untuk melakukan _failover_.
- Membuat aplikasi yang toleran terhadap disrupsi, dan gunakan PDB.
  - Tanpa _downtime_.
  - Duplikasi sumber daya yang minimal.
  - Mengizinkan lebih banyak otomasi administrasi kluster.
  - Membuat aplikasi yang toleran terhadap disrupsi agak rumit, tetapi usaha yang dilakukan untuk menoleransi disrupsi yang disengaja kebanyakan beririsan dengan usaha untuk mendukung _autoscaling_ dan menoleransi disrupsi yang tidak disengaja.

{{% /capture %}}

{{% capture whatsnext %}}

- Ikuti langkah-langkah untuk melindungi aplikasimu dengan [membuat sebuah PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/).

- Pelajari lebih lanjut mengenai [melakukan _drain_ terhadap node](/docs/tasks/administer-cluster/safely-drain-node/).

{{% /capture %}}
