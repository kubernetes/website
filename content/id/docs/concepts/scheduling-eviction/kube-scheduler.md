---
title: Penjadwal Kubernetes
content_type: concept
weight: 50
---

<!-- overview -->

Dalam Kubernetes, _scheduling_ atau penjadwalan ditujukan untuk memastikan 
{{< glossary_tooltip text="Pod" term_id="pod" >}} mendapatkan
{{< glossary_tooltip text="Node" term_id="node" >}} sehingga
{{< glossary_tooltip term_id="kubelet" >}} dapat menjalankannya.



<!-- body -->

## Ikhtisar Penjadwalan {#penjadwalan}

Sebuah penjadwal mengawasi Pod yang baru saja dibuat dan belum ada Node yang 
dialokasikan untuknya. Untuk setiap Pod yang ditemukan oleh penjadwal, maka
penjadwal tersebut bertanggung jawab untuk menemukan Node terbaik untuk 
menjalankan Pod. Penjadwal dapat menetapkan keputusan penempatan ini dengan 
mempertimbangkan prinsip-prinsip penjadwalan yang dijelaskan di bawah ini.

Jika kamu ingin memahami mengapa Pod ditempatkan pada Node tertentu, atau jika
kamu berencana untuk mengimplementasikan penjadwal kustom sendiri, halaman ini
akan membantu kamu belajar tentang penjadwalan.

## Kube-scheduler

[_Kube-scheduler_](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
adalah penjadwal standar untuk Kubernetes dan dijalankan sebagai bagian dari
{{< glossary_tooltip text="_control plane_" term_id="control-plane" >}}.
_Kube-scheduler_ dirancang agar jika kamu mau dan perlu, kamu bisa menulis 
komponen penjadwalan kamu sendiri dan menggunakannya.

Untuk setiap Pod yang baru dibuat atau Pod yang tak terjadwal lainnya, 
_kube-scheduler_ memilih Node yang optimal untuk menjalankannya. Namun, setiap 
kontainer masuk Pod memiliki persyaratan sumber daya yang berbeda dan setiap Pod 
juga memiliki persyaratan yang berbeda juga. Oleh karena itu, Node yang ada 
perlu dipilih sesuai dengan persyaratan khusus penjadwalan.

Dalam sebuah Klaster, Node yang memenuhi persyaratan penjadwalan untuk suatu Pod
disebut Node _feasible_. Jika tidak ada Node yang cocok, maka Pod tetap tidak 
terjadwal sampai penjadwal yang mampu menempatkannya.

Penjadwal menemukan Node-Node yang layak untuk sebuah Pod dan kemudian 
menjalankan sekumpulan fungsi untuk menilai Node-Node yang layak dan mengambil 
satu Node dengan skor tertinggi di antara Node-Node yang layak untuk menjalankan
Pod. Penjadwal kemudian memberi tahu server API tentang keputusan ini dalam 
proses yang disebut dengan _binding_.

Beberapa faktor yang perlu dipertimbangkan untuk keputusan penjadwalan termasuk
persyaratan sumber daya individu dan kolektif, aturan kebijakan / perangkat keras /
lunak, spesifikasi persamaan dan anti-persamaan, lokalitas data, interferensi 
antar Workloads, dan sebagainya.

### Pemilihan node pada kube-scheduler {#kube-scheduler-implementation}

_Kube-scheduler_ memilih node untuk pod dalam 2 langkah operasi:

1. Filtering
2. Scoring

Langkah _filtering_ menemukan sekumpulan Nodes yang layak untuk menjadwalkan
Pod. Misalnya, penyarin PodFitsResources memeriksa apakah Node kandidat 
memiliki sumber daya yang cukup untuk memenuhi permintaan spesifik sumber daya dari 
Pod. Setelah langkah ini, daftar Node akan berisi Node-node yang sesuai; 
seringkali, akan terisi lebih dari satu. Jika daftar itu kosong, maka Pod itu
tidak (belum) dapat dijadwalkan.

Pada langkah _scoring_, penjadwal memberi peringkat pada Node-node yang tersisa
untuk memilih penempatan paling cocok untuk Pod. Penjadwal memberikan skor 
untuk setiap Node yang sudah tersaring, memasukkan skor ini pada aturan 
penilaian yang aktif.

Akhirnya, _kube-scheduler_ memberikan Pod ke Node dengan peringkat tertinggi.
Jika ada lebih dari satu node dengan skor yang sama, maka _kube-scheduler_
memilih salah satunya secara acak.

Ada dua cara yang didukung untuk mengkonfigurasi perilaku penyaringan dan
penilaian oleh penjadwal:

1. [Aturan Penjadwalan](/docs/reference/scheduling/policies) yang memungkinkan 
   kamu untuk mengkonfigurasi _Predicates_ untuk pemfilteran dan _Priorities_ 
   untuk penilaian.
1. [Profil Penjadwalan](/docs/reference/scheduling/profiles) yang memungkinkan
   kamu mengkonfigurasi _Plugin_ yang menerapkan tahapan penjadwalan berbeda, 
   termasuk: `QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit`, dan 
   lainnya. Kamu juga bisa mengonfigurasi _kube-scheduler_ untuk menjalankan 
   profil yang berbeda.


## {{% heading "whatsnext" %}}

* Baca tentang [penyetelan performa penjadwal](/id/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* Baca tentang [pertimbangan penyebarang topologi pod](/id/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* Baca [referensi dokumentasi](/docs/reference/command-line-tools-reference/kube-scheduler/) untuk _kube-scheduler_
* Pelajari tentang [mengkonfigurasi beberapa penjadwal](/docs/tasks/administer-cluster/configure-multiple-schedulers/)
* Pelajari tentang [aturan manajemen topologi](/docs/tasks/administer-cluster/topology-manager/)
* Pelajari tentang [pengeluaran tambahan Pod](/id/docs/concepts/configuration/pod-overhead/)

