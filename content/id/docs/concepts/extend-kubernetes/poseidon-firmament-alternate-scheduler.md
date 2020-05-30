---
title: Poseidon-Firmament - Sebuah Penjadwal Alternatif
content_type: concept
weight: 80
---

<!-- overview -->

**Rilis saat ini dari Penjadwal Poseidon-Firmament adalah rilis <code> alpha </code>.**

Penjadwal Poseidon-Firmament adalah penjadwal alternatif yang dapat digunakan bersama penjadwal Kubernetes bawaan.



<!-- body -->


## Pengenalan	

Poseidon adalah sebuah layanan yang berperan sebagai pemersatu antara [Penjadwal Firmament](https://github.com/Huawei-PaaS/firmament) dengan Kubernetes. Penjadwal Poseidon-Firmament menambah kapabilitas penjadwal Kubernetes saat ini. Penjadwal ini menggabungkan kemampuan penjadwalan berbasis grafik jaringan grafis (_flow network graph_) baru bersama penjadwal Kubernetes bawaan. Penjadwal Firmament memodelkan beban-beban kerja dan klaster-klaster sebagai jaringan aliran dan menjalankan optimisasi aliran biaya-minimum kepada jaringan ini untuk membuat keputusan penjadwalan.

Penjadwal ini memodelkan masalah penjadwalan sebagai optimasi berbasis batasan atas grafik jaringan aliran. Hal ini dicapai dengan mengurangi penjadwalan ke masalah optimisasi biaya-minimum aliran-maksimum. Penjadwal Poseidon-Firmament secara dinamis memperbaiki penempatan beban kerja.

Penjadwal Poseidon-Firmament berjalan bersamaan dengan penjadwal Kubernetes bawaan sebagai penjadwal alternatif, sehingga beberapa penjadwal dapat berjalan secara bersamaan.

## Keuntungan Utama

### Penjadwalan grafik jaringan (_network graph_) berbasis penjadwalan Poseidon-Firmament memberikan beberapa keuntungan utama sebagai berikut:

- Beban kerja (Pod) dijadwalkan secara kolektif untuk memungkinkan penjadwalan dalam skala besar.
- Berdasarkan hasil tes kinerja yang ekstensif, skala Poseidon-Firmament jauh lebih baik daripada penjadwal bawaan Kubernetes dilihat dari jumlah node meningkat dalam sebuah klaster. Hal ini disebabkan oleh fakta bahwa Poseidon-Firmament mampu mengamortisasi lebih banyak pekerjaan di seluruh beban kerja.
- Penjadwal Poseidon-Firmament mengungguli penjadwal bawaan Kubernetes dengan margin lebar ketika menyangkut jumlah kinerja _throughput_ untuk skenario di mana kebutuhan sumber daya komputasi agak seragam di seluruh pekerjaan (Replicaset / Deployment / Job). Angka kinerja _throughput_ _end-to-end_ penjadwal Poseidon-Firmament , termasuk waktu _bind_, secara konsisten menjadi lebih baik seiring jumlah Node dalam sebuah klaster meningkat. Misalnya, untuk klaster 2.700 Node (ditampilkan dalam grafik [di sini](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/benchmark/README.md)), penjadwal Poseidon-Firmament berhasil mencapai 7X atau lebih _throughput_ _end-to-end_ yang lebih besar dibandingkan dengan penjadwal bawaan Kubernetes, yang mencakup waktu _bind_.
- Tersedianya pembatasan aturan yang kompleks. 
- Penjadwalan dalam Poseidon-Firmament bersifat dinamis; ini membuat sumber daya klaster dalam keadaan optimal secara global selama setiap berjalannya penjadwalan.
- Pemanfaatan sumber daya yang sangat efisien.

## Penjadwal Poseidon-Firmament - Bagaimana cara kerjanya

Sebagai bagian dari pendukung penjadwal-penjadwal Kubernetes, setiap Pod baru biasanya dijadwalkan oleh penjadwal bawaan. Kubernetes dapat diinstruksikan untuk menggunakan penjadwal lain dengan menentukan nama penjadwal _custom_ lain ("poseidon" dalam kasus ini) di _field_ **schedulerName** dari PodSpec pada saat pembuatan pod. Dalam kasus ini, penjadwal bawaan akan mengabaikan Pod itu dan memungkinkan penjadwal Poseidon untuk menjadwalkan Pod pada Node yang relevan.

```yaml
apiVersion: v1
kind: Pod

...
spec:
  schedulerName: poseidon
``` 

{{< note >}}
Untuk detail tentang desain proyek ini, lihat [dokumen desain](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md).
{{< /note >}}

## Kemungkinan Skenario Kasus Penggunaan - Kapan menggunakannya

Seperti yang disebutkan sebelumnya, penjadwal Poseidon-Firmament memungkinkan lingkungan penjadwalan dengan _throughput_ yang sangat tinggi bahkan pada ukuran klaster dengan beban kerja besar, dikarenakan pendekatan penjadwalannya yang sekaligus dalam jumlah besar, dibandingkan dengan pendekatan bawaan _pod-at-a-time_ Kubernetes. Dalam pengujian ekstensif kami, kami telah mengamati manfaat _throughput_ substansial selama kebutuhan sumber daya (CPU / Memori) untuk Pod yang masuk seragam di seluruh tugas (Replicaset / Deployment / Job), terutama karena amortisasi pekerjaan yang efisien di seluruh tugas.

Meskipun penjadwal Poseidon-Firmament mampu menjadwalkan berbagai jenis beban kerja, seperti layanan-layanan, _batch_, dll., berikut ini adalah beberapa kasus penggunaan yang paling unggul:

1. Untuk pekerjaan "Big Data / AI" yang terdiri dari sejumlah besar tugas, manfaat dari _throughput_ luar biasa.
2. Pekerjaan layanan atau _batch job_ di mana kebutuhan sumber dayanya seragam di seluruh pekerjaan (Replicaset / Deployment / Job).

## Tahap Proyek Saat Ini

- **Rilis Alpha - Repo Inkubasi.** di https://github.com/kubernetes-sigs/poseidon.  
- Saat ini, penjadwal Poseidon-Firmament **tidak memberikan dukungan untuk ketersediaan tinggi**, implementasi kami mengasumsikan bahwa penjadwal tidak mungkin gagal. [Dokumen desain](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/design/README.md) menjelaskan cara-cara yang memungkinkan untuk mengaktifkan ketersediaan tinggi, tetapi kami membiarkannya untuk pekerjaan mendatang.
- Kami **tidak mengetahui adanya _production deployment_** dari penjadwal Poseidon-Firmament saat ini.
- Poseidon-Firmament didukung dari rilis Kubernetes 1.6 dan bekerja dengan semua rilis berikutnya.
- Proses rilis untuk _repo_ Poseidon dan Firmament berjalan secara serentak. Rilis Poseidon saat ini dapat ditemukan [di sini](https://github.com/kubernetes-sigs/poseidon/releases) dan rilis Firmament yang sesuai dapat ditemukan [di sini](https://github.com/Huawei-PaaS/firmament/releases).

## Matriks Perbandingan Fitur

| Fitur | Penjadwal Bawaan Kubernetes | Penjadwal Poseidon-Firmament | Catatan |
|--- |--- |--- |--- |
|_Node Affinity_/_Anti-Affinity_|Y|Y||
| _Pod Affinity_ / _Anti-Affinity_ - termasuk dukungan untuk simetri _anti-affinity_ Pod | Y | Y | Saat ini penjadwal bawaan mengungguli penjadwal Poseidon-Firmament Pod dalam segi fungsionalitas _affinity_/_anti-affinity_. Kami sedang berupaya menyelesaikan ini. |
|_Taints_ & _Toleration_|Y|Y||
| Kemampuan Penjadwalan Dasar sesuai dengan sumber daya komputasi yang tersedia (CPU & Memori) pada sebuah Node | Y | Y** | Tidak semua Predikat & Prioritas sudah didukung saat ini. |
| _Throughput_ ekstrim pada skala besar | Y** | Y | Pendekatan penjadwalan massal mengukur atau meningkatkan penempatan beban kerja. Manfaat _throughput_ substansial menggunakan penjadwal Firmament selama persyaratan sumber daya (CPU / Memori) untuk Pod yang masuk seragam di seluruh Replicaset / Deployment / Job. Hal ini terutama disebabkan oleh amortisasi pekerjaan yang efisien di seluruh Replicaset / Deployment / Job. 1) Untuk pekerjaan "Big Data / AI" yang terdiri dari jumlah tugas yang besar, manfaat _throughput_ yang luar biasa. 2) Manfaat _throughput_ substansial juga untuk skenario layanan atau sekumpulan pekerjaan di mana persyaratan sumber daya beban kerja seragam di seluruh Replicaset / Deployment / Job. |
| Penjadwalan Optimal | Penjadwalan _Pod-by-Pod_, memproses satu Pod pada satu waktu (dapat mengakibatkan penjadwalan sub-optimal) | Penjadwalan Massal (Penjadwalan optimal) | Penjadwal bawaan _Pod-by-Pod_ Kubernetes dapat menetapkan tugas ke mesin sub-optimal. Sebaliknya, Firmament mempertimbangkan semua tugas yang tidak terjadwal pada saat yang bersamaan bersama dengan batasan lunak dan kerasnya. |
| Penghindaran Gangguan Kolokasi | N | N** | Direncanakan di Poseidon-Firmament. |
| _Pre-emption_ Prioritas | Y | N** | Tersedia secara parsial pada Poseidon-Firmament, dibandingkan dengan dukungan ekstensif di penjadwal bawaan Kubernetes. |
| Penjadwalan Ulang yang Inheren | N | Y** | Penjadwal Poseidon-Firmament mendukung penjadwalan ulang beban kerja. Dalam setiap penjadwalan, penjadwal Poseidon-Firmament mempertimbangkan semua Pod, termasuk Pod yang sedang berjalan, dan sebagai hasilnya dapat melakukan migrasi atau mengeluarkan Pod - sebuah lingkungan penjadwalan yang optimal secara global. |
| Penjadwalan Berkelompok | N | Y ||
| Dukungan untuk Penjadwalan Volume Persisten Pra-terikat | Y | Y ||
| Dukungan untuk Volume Lokal & Penjadwalan _Binding_ Volume Persisten Dinamis | Y | N** | Direncanakan. |
| Ketersediaan Tinggi | Y | N** | Direncanakan. |
| Penjadwalan berbasis metrik _real-time_ | N | Y** | Awalnya didukung menggunakan Heapster (sekarang tidak digunakan lagi) untuk menempatkan Pod menggunakan statistik penggunaan klaster aktual ketimbang reservasi. Rencananya akan dialihkan ke "server metrik". |
| Dukungan untuk _Max-Pod_ per Node | Y | Y | Penjadwal Poseidon-Firmament secara mulus berdampingan dengan penjadwal bawaan Kubernetes.
| Dukungan untuk Penyimpanan _Ephemeral_, selain CPU / Memori | Y | Y ||


## Instalasi	

Untuk instalasi Poseidon dalam-klaster, silakan mulai dari [Petunjuk Instalasi](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/install/README.md).

## Pengembangan	

Untuk developer, silakan merujuk ke [Instruksi _Setup_ Developer](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/devel/README.md).

## Hasil Pengujian Kinerja _Throughput_ Terbaru

Penjadwal _pod-by-pod_, seperti penjadwal bawaan Kubernetes, biasanya memproses satu Pod pada satu waktu. Penjadwal ini memiliki kelemahan penting berikut:

1. Penjadwal berkomitmen untuk penempatan Pod lebih awal dan membatasi pilihan untuk Pod lain yang menunggu untuk ditempatkan.
2. Ada peluang terbatas untuk amortisasi pekerjaan lintas Pod karena mereka dipertimbangkan untuk ditempatkan secara individual.

Kelemahan dari penjadwal _pod-by-pod_ ini diatasi dengan penjadwalan secara terkumpul atau dalam jumlah banyak secara bersamaan di penjadwal Poseidon-Firmament. Memproses beberapa Pod dalam satu kumpulan memungkinkan penjadwal untuk bersama-sama mempertimbangkan penempatan mereka, dan dengan demikian untuk menemukan untung-rugi terbaik untuk seluruh kumpulan ketimbang satu Pod saja. Pada saat yang sama, amortisasi berfungsi lintas Pod yang menghasilkan _throughput_ yang jauh lebih tinggi.

{{< note >}}
   Silakan merujuk ke [hasil _benchmark_ terbaru](https://github.com/kubernetes-sigs/poseidon/blob/master/docs/benchmark/README.md) untuk hasil uji perbandingan kinerja _throughput_ terperinci antara penjadwal Poseidon-Firmament dan Penjadwal bawaan Kubernetes.
{{< /note >}}


