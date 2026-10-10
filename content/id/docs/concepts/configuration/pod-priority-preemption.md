---
title: Prioritas dan Pemindahan Pod
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="1.14" state="stable" >}}

[Pod](/docs/user-guide/pods) dapat memiliki _priority_ (prioritas). Priority mengindikasikan lebih penting atau tidaknya sebuah Pod dibandingkan dengan Pod-pod lainnya. Jika sebuah Pod tidak dapat dijadwalkan (tertunda/_pending_), penjadwal akan mencoba untuk melakukan _preemption_/pemindahan (mengusir/_evict_) Pod-pod dengan prioritas lebih rendah agar penjadwalan Pod yang tertunda sebelumnya dapat dilakukan.

Pada Kubernetes 1.9 dan sesudahnya, Priority juga memengaruhi urutan penjadwalan Pod-pod dan urutan pengusiran Pod-pod dari Node pada kasus kehabisan sumber daya.

Priority dan Pemindahan Pod lulus menjadi _beta_ pada Kubernetes 1.11 dan menjadi GA (_Generally Available_) pada Kubernetes 1.14. Mereka telah dihidupkan secara bawaan sejak versi 1.11.

Pada versi-versi Kubernetes di mana Priority dan pemindahan Pod masih berada pada tingkat fitur _alpha_, kamu harus menghidupkannya secara eksplisit. Untuk menggunakan fitur-fitur pada versi-versi lama Kubernetes, ikuti petunjuk di dokumentasi versi Kubernetes kamu, melalui arsip versi dokumentasi untuk versi Kubernetes kamu.

Versi Kubernetes | Keadaan Priority and Pemindahan | Dihidupkan secara Bawaan
------------------ | :---------------------------: | :----------------:
1.8                | alpha                         | tidak
1.9                | alpha                         | tidak
1.10               | alpha                         | tidak
1.11               | beta                          | ya
1.14               | stable                        | ya

{{< warning >}}Pada sebuah klaster di mana tidak semua pengguna dipercaya, seorang pengguna yang berniat jahat dapat membuat Pod-pod dengan prioritas paling tinggi, membuat Pod-pod lainnya dipindahkan/tidak dapat dijadwalkan. Untuk mengatasi masalah ini, [ResourceQuota](/id/docs/concepts/policy/resource-quotas/) ditambahkan untuk mendukung prioritas Pod. Seorang admin dapat membuat ResourceQuota untuk pengguna-pengguna pada tingkat prioritas tertentu, mencegah mereka untuk membuat Pod-pod pada prioritas tinggi. Fitur ini telah beta sejak Kubernetes 1.12.
{{< /warning >}}



<!-- body -->

## Bagaimana cara menggunakan Priority dan pemindahan Pod

Untuk menggunakan Priority dan pemindahan Pod pada Kubernetes 1.11 dan sesudahnya, ikuti langkah-langkah berikut:

1.  Tambahkan satu atau lebih [PriorityClass](#priorityclass).

2.  Buat Pod-pod dengan [`priorityClassName`](#prioritas-pod)
    disetel menjadi salah satu dari PriorityClass yang ditambahkan.
    Tentu saja kamu tidak perlu membuat Pod-pod tersebut secara langsung;
    Biasanya kamu akan menambahkan `priorityClassName` pada 
    `template` Pod dari sebuah objek kumpulan seperti sebuah Deployment.

Teruslah membaca untuk lebih banyak informasi mengenai langkah-langkah tersebut.

Jika kamu mencoba fitur ini dan memutuskan untuk mematikannya, kamu harus menghapus _command-line flag_ PodPriority atau menyetelnya menjadi `false`, kemudian melakukan pengulangan kembali terhadap API Server dan Scheduler. Setelah fitur ini dimatikan, Pod-pod yang sudah ada tetap akan memiliki kolom priority mereka, tetapi pemindahan Pod akan dimatikan, dan kolom-kolom priority tersebut diabaikan. Jika fitur tersebut telah dimatikan, kamu tidak dapat menyetel kolom `priorityClassName` pada Pod-pod baru.

## Cara mematikan pemindahan Pod

{{< note >}}
Pada Kubernetes 1.12 ke atas, Pod-pod yang penting mengandalkan  oleh Schneduler agar dapat dijadwalkan saat klaster berada pada kondisi kekurangan sumber daya. Untuk alasan ini, tidak direkomendasikan untuk mematikan fitur pemindahan Pod.
{{< /note >}}

{{< note >}}
Pada Kubernetes 1.15 ke atas, jika fitur `NonPreemptingPriority` diaktifkan, PriorityClass memiliki pilihan untuk menyetel `preemptionPolicy: Never`.
Hal ini akan mencegah Pod-pod dari PriorityClass tersebut untuk memicu pemindahan Pod-pod lainnya.
{{< /note >}}

Pada Kubernetes 1.11 dan sesudahnya, pemindahan Pod dikontrol oleh sebuah _flag_ kube-scheduler yaitu `disablePreemption`, yang disetel menjadi `false` secara bawaan. Jika kamu ingin mematikan pemindahan Pod meskipun ada catatan di atas, kamu dapat menyetel `disablePreemption` menjadi `true`.

Opsi ini hanya tersedia pada (berkas) konfigurasi komponen saja, dan tidak tersedia pada cara lama melalui _command line options_. Berikut contoh konfigurasi komponen untuk mematikan pemindahan (_preemption_) Pod:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

disablePreemption: true
```

## PriorityClass

Sebuah PriorityClass adalah sebuah objek tanpa Namespace yang mendefinisikan pemetaan dari sebuah nama kelas prioritas menjadi nilai _integer_ dari prioritas tersebut. Nama tersebut dirinci pada kolom `name` dari `metadata` objek PriorityClass tersebut. Nilainya dirinci pada kolom `value` yang diperlukan. Semakin tinggi nilainya, maka semakin tinggi juga prioritasnya.

Sebuah objek PriorityClass dapat memiliki nilai _integer_ 32-bit apa pun yang kurang dari atau sama dengan 1 miliar. Angka-angka yang lebih besar dicadangkan untuk Pod-pod pada sistem yang sangat penting yang secara normal sebaiknya tidak dipindahkan atau diusir. Seorang admin klaster sebaiknya membuat sebuah objek PriorityClass untuk setiap pemetaan seperti ini yang ia inginkan.

PriorityClass juga memiliki dua kolom opsional: `globalDefault` dan `description`. Kolom `globalDefault` mengindikasikan bahwa nilai PriorityClass ini sebaiknya digunakan tanpa sebuah `priorityClassName`. Hanya sebuah PriorityClass dengan `globalDefault` disetel menjadi `true` dapat berada pada sistem/klaster. Jika tidak ada PriorityClass dengan `globalDefault` yang telah disetel, prioritas Pod-pod tanpa `priorityClassName` adalah nol.

Kolom `description` adalah _string_ yang sembarang. Kolom ini diperuntukkan untuk memberitahukan pengguna-pengguna klaster kapan mereka harus menggunakan PriorityClass ini.

### Catatan mengenai PodPriority dan Klaster-klaster yang sudah ada

-   Jika kamu meningkatkan versi klaster kamu dan menghidupkan fitur ini, prioritas
    Pod-pod kamu yang sudah ada akan secara efektif menjadi nol.

-   Penambahan dari sebuah PriorityClass dengan `globalDefault` yang disetel menjadi
    `true` tidak mengubah prioritas-prioritas Pod-pod yang sudah ada. Nilai dari
    PriorityClass semacam ini digunakan hanya untuk Pod-pod yang dibuat setelah
    PriorityClass tersebut ditambahkan.

-   Jika kamu menghapus sebuah PriorityClass, Pod-pod yang sudah ada yang menggunakan
    nama dari PriorityClass yang dihapus tersebut tidak akan berubah, tetapi kamu tidak
    dapat membuat lebih banyak Pod yang menggunakan nama dari PriorityClass yang telah
    dihapus tersebut.

### Contoh PriorityClass

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "Kelas prioritas ini sebaiknya hanya digunakan untuk Pod-pod layanan XYZ saja."
```

### PriorityClass yang _Non-preempting_ (alpha) {#non-preempting-priority-class}

Kubernetes 1.15 menambahkan kolom `PreemptionPolicy` sebagai sebuah fitur _alpha_. Fitur ini dimatikan secara bawaan pada 1.15, dan membutuhkan diaktifkannya [_feature gate_](/docs/reference/command-line-tools-reference/feature-gates/
) `NonPreemptingPriority`.

Pod-pod dengan `PreemptionPolicy: Never` akan ditaruh pada antrean penjadwalkan mendahului Pod-pod dengan prioritas rendah, tetapi mereka tidak dapat memicu pemindahan Pod-pod lainnya (disebut juga Pod yang _non-preempting_).
Sebuah Pod yang _non-preempting_ yang sedang menunggu untuk dijadwalkan akan tetap berada pada antrean penjadwalan, hingga sumber daya yang cukup tersedia, dan ia dapat dijadwalkan. Pod yang _non-preempting_, seperti Pod-pod lainnya, tunduk kepada _back-off_ dari Scheduler. Hal ini berarti bahwa jika Scheduler mencoba untuk menjadwalkan Pod-pod ini dan mereka tidak dapat dijadwalkan, mereka akan dicoba kembali dengan frekuensi (percobaan) yang lebih rendah, memungkinkan Pod-pod lain dengan prioritas yang lebih rendah untuk dijadwalkan sebelum mereka dijadwalkan.

Pod yang _non-preempting_ tetap dapat dipicu untuk dipindahkan oleh Pod lainnya yang memiliki prioritas yang lebih tinggi.

`PreemptionPolicy` secara bawaan nilainya `PreemptionLowerPriority`, yang memungkinkan Pod-pod dengan PriorityClass tersebut untuk memicu pemindahan Pod-pod dengan prioritas lebih rendah (sama seperti sifat bawaan). Jika `PreemptionPolicy` disetel menjadi `Never`, Pod-pod pada PriorityClass tersebut akan menjadi Pod yang _non-preempting_.

Sebuah contoh kasus misalnya pada beban kerja _data science_.
Seorang pengguna dapat memasukkan sebuah beban kerja yang mereka ingin prioritaskan di atas beban kerja lainnya, tetapi tidak ingin menghapus beban kerja yang sudah ada melalui pemicuan pemindahan Pod-pod yang sedang berjalan.
Beban kerja prioritas tinggi dengan `PreemptionPolicy: Never` akan dijadwalkan mendahului Pod-pod lainnya yang berada dalam antrean, segera setelah sumber daya klaster "secara alami" menjadi cukup.

#### Contoh PriorityClass yang _Non-preempting_

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-nonpreempting
value: 1000000
preemptionPolicy: Never
globalDefault: false
description: "Kelas prioritas ini tidak akan memicu pemindahan Pod-pod lainnya."
```

## Prioritas Pod

Setelah kamu memiliki satu atau lebih PriorityClass, kamu dapat membuat Pod-pod yang merinci satu dari nama-nama PriorityClass tersebut pada spesifikasi mereka. Admission Controller prioritas menggunakan kolom `priorityClassName` dan mengumpulkan nilai _integer_ dari prioritasnya. Jika PriorityClass-nya tidak ditemukan, maka Pod tersebut akan ditolak.

YAML berikut adalah contoh sebuah konfigurasi Pod yang menggunakan PriorityClass yang telah dibuat pada contoh sebelumnya. Admission Controller prioritas akan memeriksa spesifikasi tersebut dan memetakan prioritas Pod tersebut menjadi nilai 1000000.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  priorityClassName: high-priority
```

### Efek prioritas Pod terhadap urutan penjadwalan

Pada Kubernetes 1.9 dan sesudahnya, saat prioritas Pod dihidupkan, Scheduler mengurutkan Pod-pod yang tertunda berdasarkan prioritas mereka dan sebuah Pod yang tertunda diletakkan mendahului Pod-pod tertunda lainnya yang memiliki prioritas yang lebih rendah pada antrean penjadwalan. Sebagai hasilnya, Pod dengan prioritas lebih tinggi dapat dijadwalkan lebih awal daripada Pod-pod dengan prioritas yang lebih rendah jika syarat penjadwalan terpenuhi. Jika Pod ini tidak dapat dijadwalkan, Scheduler akan melewatkannya dan mencoba untuk menjadwalkan Pod-pod lain dengan prioritas yang lebih rendah.

## Pemindahan Pod

Saat Pod-pod dibuat, mereka masuk ke sebuah antrean dan menunggu untuk dijadwalkan. Scheduler memilih sebuah Pod dari antrean dan mencoba untuk menjadwalkannya pada sebuah Node. Jika tidak ditemukan Node yang memenuhi semua kebutuhan Pod tersebut, logika program pemindahan Pod dipicu untuk Pod yang tertunda tersebut. Kita akan menyebut Pod tertunda tersebut dengan P. Logika program pemindahan Pod mencoba untuk menemukan sebuah Node di mana penghapusan dari satu atau lebih Pod dengan prioritas yang lebih rendah daripada P dapat memungkinkan P untuk dijadwalkan pada Node tersebut. Jika Node tersebut ditemukan, satu atau lebih Pod dengan prioritas lebih rendah akan dipindahkan dari Node tersebut. Setelah Pod-pod tersebut dihapus, P dapat dijadwalkan pada Node tersebut.

### Informasi yang diekspos pengguna

Saat Pod P memicu pemindahan satu atau lebih Pod pada Node N, kolom `nominatedNodeName` pada status Pod P disetel menjadi nama dari node N. Kolom ini membantu Scheduler untuk melacak sumber daya yang dicadangkan untuk Pod P dan juga memberikan informasi mengenai pemindahan Pod pada klaster untuk pengguna-pengguna.

Harap catat bahwa Pod P tidak harus dijadwalkan pada "_nominated_ Node" (Node yang dicalonkan) tersebut. Setelah Pod-pod yang terpilih telah dipindahkan, mereka akan mendapatkan periode penghentian secara sopan (_graceful_) mereka. Jika Node lain menjadi tersedia saat Scheduler sedang menunggu penghentian Pod-pod yang terpilih untuk dipindahkan, Scheduler akan menggunakan Node lain tersebut untuk menjadwalkan Pod P. Sebagai hasilnya `nominatedNodeName` dan `nodeName` dari spesifikasi Pod belum tentu selalu sama. Juga, jika Scheduler memindahkan Pod-pod pada Node N, tapi kemudian sebuah Pod lain dengan prioritas lebih tinggi daripada Pod P tiba, Scheduler boleh memberikan Node N kepada Pod dengan prioritas lebih tinggi tersebut. Pada kasus demikian, Scheduler menghapus `nominatedPodName` dari Pod P. Dengan melakukan ini, Scheduler membuat Pod P berhak untuk memicu pemindahan Pod-pod lain pada Node lain.

### Batasan-batasan pemindahan Pod

#### Penghentian secara sopan dari korban-korban pemindahan Pod

Saat Pod-pod dipindahkan, korban-korbannya mendapatkan [periode penghentian secara sopan](/id/docs/concepts/workloads/pods/pod/#penghentian-pod). Mereka memiliki waktu sebanyak itu untuk menyelesaikan pekerjaan merekan dan berhenti. Jika mereka tidak menyelesaikannya sebelum waktu tersebut, mereka akan dihentikan secara paksa. Periode penghentian secara sopan ini membuat sebuah jarak waktu antara saat di mana Scheduler memindahkan Pod-pod dengan waktu saat Pod yang tertunda tersebut (P) dapat dijadwalkan pada Node tersebut (N). Sementara itu, Scheduler akan terus menjadwalkan Pod-pod lain yang tertunda. Oleh karena itu, biasanya ada jarak waktu antara titik di mana Scheduler memindahkan korban-korban dan titik saat Pod P dijadwalkan. Untuk meminimalkan jarak waktu ini, kamu dapat menyetel periode penghentian secara sopan dari Pod-pod dengan prioritas lebih rendah menjadi nol atau sebuah angka yang kecil.

#### PodDisruptionBudget didukung, tapi tidak dijamin!

Sebuah [Pod Disruption Budget (PDB)](/id/docs/concepts/workloads/pods/disruptions/) memungkinkan pemilik-pemilik aplikasi untuk membatasi jumlah Pod-pod dari sebuah aplikasi yang direplikasi yang mati secara bersamaan dikarenakan disrupsi yang disengaja. Kubernetes 1.9 mendukung PDB saat memindahkan Pod-pod, tetapi penghormatan terhadap PDB ini bersifat "usaha terbaik" (_best-effort_). Scheduler akan mencoba mencari korban-korban yang PDB-nya tidak dilanggar oleh pemindahan, tetapi jika tidak ada korban yang ditemukan, pemindahan akan tetap terjadi, dan Pod-pod dengan prioritas lebih rendah akan dihapus/dipindahkan meskipun PDB mereka dilanggar.

#### Afinitas antar-Pod pada Pod-pod dengan prioritas lebih rendah

Sebuah Node akan dipertimbangkan untuk pemindahan Pod hanya jika jawaban pertanyaan berikut adalah "ya": "Jika semua Pod-pod dengan prioritas lebih rendah dari Pod yang tertunda dipindahkan dari Node, dapatkan Pod yang tertunda tersebut dijadwalkan (secara sukses) ke Node tersebut?"

{{< note >}}
Pemindahan Pod tidak harus memindahkan semua Pod-pod dengan prioritas lebih rendah. Jika Pod yang tertunda dapat dijadwalkan dengan memindahkan lebih sedikit daripada semua Pod-pod dengan prioritas yang lebih rendah, maka hanya sebagian dari Pod-pod dengan prioritas lebih rendah tersebut akan dipindahkan. Meskipun demikian, jawaban untuk pertanyaan sebelumnya haruslah "ya". Jika jawabannya adalah "tidak", maka Node tersebut tidak akan dipertimbangkan untuk pemindahan Pod.
{{< /note >}}

Jika sebuah Pod yang tertunda memiliki afinitas antar-Pod terhadap satu atau lebih dari Pod-pod dengan prioritas lebih rendah pada Node tersebut, maka aturan afinitas antar-Pod tersebut tidak dapat terpenuhi tanpa hadirnya Pod-pod dengan prioritas lebih rendah tersebut. Pada kasus ini, Scheduler tidak melakukan pemindahan terhadap Pod-pod manapun pada Node tersebut. Sebagai gantinya, ia mencari Node lainnya. Scheduler mungkin mendapatkan Node yang cocok atau tidak. Tidak ada jaminan bahwa Pod yang tertunda tersebut dapat dijadwalkan.

Solusi yang direkomendasikan untuk masalah ini adalah dengan cara membuat afinitas antar-Pod hanya terhadap Pod-pod dengan prioritas yang sama atau lebih tinggi.

#### Pemindahan Pod antar Node

Misalnya sebuah Node N sedang dipertimbangkan untuk pemindahan Pod sehingga sebuah Pod P yang tertunda dapat dijadwalkan pada N. P mungkin menjadi layak untuk N hanya jika sebuah Pod pada Node lain dipindahkan. Berikut sebuah contoh:

*   Pod P dipertimbangkan untuk Node N.
*   Pod Q sedang berjalan pada Node lain pada Zona yang sama dengan Node N.
*   Pod P memiliki anti-afinitas yang berlaku pada seluruh Zona terhadap Pod Q (`topologyKey:
    topology.kubernetes.io/zone`).
*   Tidak ada kasus anti-afinitas lain antara Pod P dengan Pod-pod lainnya pada Zona tersebut.
*   Untuk dapat menjadwalkan Pod P pada Node N, Pod Q dapat dipindahkan, tetapi
    Scheduler tidak melakukan pemindahan Pod antar Node. Jadi, Pod P akan
    dianggap tidak dapat dijadwalkan pada Node N.

Jika Pod Q dihapus dari Node-nya, pelanggaran terhadap anti-afinitas Pod tersebut akan hilang, dan Pod P dapat dijadwalkan pada Node N.

Kita mungkin mempertimbangkan untuk menambahkan pemindahan Pod antar Node pada versi-versi yang akan datang jika ada permintaan yang cukup dari pengguna, dan kami menemukan algoritma dengan kinerja yang layak.

## Memecahkan masalah pada Prioritas dan Pemindahan Pod

Prioritas dan Pemindahan Pod adalah sebuah fitur besar yang berpotensi dapat mengganggu penjadwalan Pod jika fitur ini memiliki kesalahan (_bug_).

### Masalah yang berpotensi diakibatkan oleh Prioritas dan Pemindahan Pod

Berikut adalah beberapa masalah yang dapat diakibatkan oleh kesalahan-kesalahan pada implementasi fitur ini. Daftar ini tidak lengkap.

#### Pod-pod dipindahkan secara tidak perlu

Pemindahan Pod menghapus Pod-pod yang sudah ada dari sebuah klaster yang sedang mengalami kekurangan sumber daya untuk menyediakan ruangan untuk Pod-pod tertunda yang memiliki prioritas yang lebih tinggi. Jika seorang pengguna memberikan prioritas-prioritas tinggi untuk Pod-pod tertentu dengan tidak semestinya (karena kesalahan), Pod-pod prioritas tinggi yang tidak disengaja tersebut dapat mengakibatkan pemindahan Pod-pod pada klaster tersebut. Seperti disebutkan di atas, prioritas Pod dispesifikasikan dengan menyetel kolom `priorityClassName` dari `podSpec`. Nilai _integer_ dari prioritas tersebut kemudian dipetakan dan diisi pada kolom `priority` dari `podSpec`.

Untuk menyelesaikan masalah tersebut, `priorityClassName` dari Pod-pod tersebut harus diubah untuk menggunakan kelas dengan prioritas yang lebih rendah, atau dibiarkan kosong saja. Kolom `priorityClassName` yang kosong dipetakan menjadi nol secara bawaan.

Saat sebuah Pod dipindahkan, akan ada _Event_ yang direkam untuk Pod yang dipindahkan tersebut. Pemindahan seharusnya hanya terjadi saat sebuah klaster tidak memiliki sumber daya yang cukup untuk sebuah Pod. Pada kasus seperti ini, pemindahan terjadi hanya saat prioritas dari Pod yang tertunda tersebut lebih tinggi daripada Pod-pod korban. Pemindahan tidak boleh terjadi saat tidak ada Pod yang tertunda (_preemptor_), atau saat Pod-pod yang tertunda memiliki prioritas yang sama atau lebih rendah dari korban-korbannya. Jika pemindahan terjadi pada skenario demikian, mohon daftarkan sebuah Issue.

#### Pod-pod dipindahkan, tetapi _preemptor_ tidak dijadwalkan

Saat Pod-pod dijadwalkan, mereka menerima periode penghentian secara sopan mereka, yang secara bawaan bernilai 30 detik, tetapi dapat bernilai apa pun sesuai dengan yang disetel pada PodSpec. Jika Pod-pod korban tidak berhenti sebelum periode ini, mereka akan dihentikan secara paksa. Saat semua korban telah pergi, Pod _preemptor_ dapat dijadwalkan.

Saat Pod _preemptor_ sedang menunggu korban-korban dipindahkan, sebuah Pod dengan prioritas lebih tinggi boleh dibuat jika muat pada Node yang sama. Pada kasus ini, Scheduler akan menjadwalkan Pod dengan prioritas lebih tinggi tersebut alih-alih menjadwalkan Pod _preemptor_.

Dalam ketidakhadiran Pod dengan prioritas lebih tinggi tersebut, kita mengharapkan Pod _preemptor_ dijadwalkan setelah periode penghentian secara sopan korban-korbannya telah berakhir.

#### Pod-pod dengan prioritas lebih tinggi dipindahkan karena Pod-pod dengan prioritas lebih rendah

Saat Scheduler mencoba mencari Node-node yang dapat menjalankan sebuah Pod yang tertunda, dan tidak ada Node yang ditemukan, ia akan mencoba untuk memindahkan Pod-pod dengan prioritas lebih rendah dari salah satu Node untuk menyediakan ruangan untuk Pod yang tertunda tersebut. Jika sebuah Node dengan Pod-pod dengan prioritas lebih rendah tidak layak untuk menjalankan Pod yang tertunda tersebut, Scheduler mungkin memilih Node lain dengan Pod yang memiliki prioritas lebih tinggi (dibandingkan dengan Pod-pod pada Node lain tadi) untuk dipindahkan. Korban-korban tersebut harus tetap memiliki prioritas yang lebih rendah dari Pod _preemptor_.

Saat ada beberapa Node yang tersedia untuk pemindahan, Scheduler mencoba untuk memilih Node dengan kumpulan Pod yang memiliki prioritas paling rendah. Namun, jika Pod-pod tersebut memiliki PodDisruptionBudget yang akan dilanggar apabila mereka dipindahkan, maka Scheduler akan memilih Node lain dengan Pod-pod yang memiliki prioritas lebih tinggi.

Saat ada beberapa Node tersedia untuk pemindahan dan tidak ada satupun skenario di atas yang berlaku, kita mengharapkan Scheduler memilih Node dengan prioritas paling rendah. Apabila hal tersebut tidak terjadi, hal ini mungkin menunjukkan bahwa terdapat kesalahan pada Scheduler.

## Interaksi-interaksi prioritas Pod dan QoS

Prioritas Pod dan [QoS](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/resource-qos.md) adalah dua fitur terpisah dengan interaksi yang sedikit dan tidak ada batasan bawaan terhadap penyetelan prioritas Pod berdasarkan kelas QoS-nya. Logika program pemindahan Scheduler tidak mempertimbangkan QoS saat memilih sasaran-sasaran pemindahan. Pemindahan mempertimbangkan prioritas Pod dan mencoba memilih kumpulan sasaran dengan prioritas terendah. Pod-pod dengan prioritas lebih tinggi dipertimbangkan untuk pemindahan hanya jika penghapusan Pod-pod dengan prioritas terendah tidak cukup untuk memungkinkan Scheduler untuk menjadwalkan Pod _preemptor_, atau jika Pod-pod dengan prioritas terendah tersebut dilindungi oleh `PodDisruptionBudget`.

Komponen satu-satunya yang mempertimbangkan baik QoS dan prioritas Pod adalah [pengusiran oleh Kubelet karena kehabisan sumber daya](/docs/tasks/administer-cluster/out-of-resource/).
Kubelet menggolongkan Pod-pod untuk pengusiran pertama-tama berdasarkan apakah penggunaan sumber daya mereka melebihi `requests` mereka atau tidak, kemudian berdasarkan Priority, dan kemudian berdasarkan penggunaan sumber daya yang terbatas tersebut relatif terhadap `requests` dari Pod-pod tersebut.
Lihat [Mengusir Pod-pod pengguna](/docs/tasks/administer-cluster/out-of-resource/#mengusir-pod-pod-pengguna) untuk lebih detail. Pengusiran oleh Kubelet karena kehabisan sumber daya tidak mengusir Pod-pod yang memiliki penggunaan sumber daya yang tidak melebihi `requests` mereka. Jika sebuah Pod dengan prioritas lebih rendah tidak melebihi `requests`-nya, ia tidak akan diusir. Pod lain dengan prioritas lebih tinggi yang melebihi `requests`-nya boleh diusir.


