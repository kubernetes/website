---
title: Node
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

Node merupakan sebuah mesin <i>worker</i> di dalam Kubernetes, yang sebelumnya dinamakan `minion`.
Sebuah node bisa berupa VM ataupun mesin fisik, tergantung dari kluster-nya.
Masing-masing node berisi beberapa servis yang berguna untuk menjalankan banyak [pod](/docs/concepts/workloads/pods/pod/) dan diatur oleh komponen-komponen yang dimiliki oleh master.
Servis-servis di dalam sebuah node terdiri dari [runtime kontainer](/docs/concepts/overview/components/#node-components), kubelet dan kube-proxy.
Untuk lebih detail, lihat dokumentasi desain arsitektur pada [Node Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node).

{{% /capture %}}


{{% capture body %}}

## Status Node

Sebuah status node berisikan informasi sebagai berikut:

* [Addresses](#addresses)
* [Condition](#condition)
* [Capacity](#capacity)
* [Info](#info)

Masing-masing bagian dijelaskan secara rinci di bawah ini.

### Addresses

Penggunaan <i>field-field</i> ini bergantung pada penyedia layanan cloud ataupun konfigurasi bare metal yang kamu punya.

* HostName: Merupakan hostname yang dilaporkan oleh kernel node. Dapat diganti melalui parameter `--hostname-override` pada kubelet.
* ExternalIP: Biasanya merupakan alamat IP pada node yang punya <i>route</i> eksternal (bisa diakses dari luar kluster).
* InternalIP: Biasanya merupakan alamat IP pada node yang hanya punya <i>route</i> di dalam kluster.


### Condition

<i>Field</i> `conditions` menjelaskan tentang status dari semua node yang sedang berjalan (`Running`).

| Kondisi Node | Penjelasan |
|----------------|-------------|
| `OutOfDisk`    | `True` jika node sudah tidak punya cukup kapasitas disk untuk menjalankan pod baru, `False` jika sebaliknya |
| `Ready`        | `True` jika node sehat (<i>healthy</i>) dan siap untuk menerima pod, `False` jika node tidak lagi sehat (<i>unhealthy</i>) dan tidak siap menerima pod, serta `Unknown` jika kontroler node tidak menerima pesan di dalam `node-monitor-grace-period` (standarnya 40 detik) |
| `MemoryPressure`    | `True` jika memori pada node terkena tekanan (<i>pressure</i>) -- maksudnya, jika kapasitas memori node sudah di titik rendah; `False` untuk sebaliknya |
| `PIDPressure`    | `True` jika <i>process-process</i> mengalami tekanan (<i>pressure</i>) -- maksudnya, jika node menjalankan terlalu banyak <i>process</i>; `False` untuk sebaliknya |
| `DiskPressure`    | `True` jika ukuran disk mengalami tekanan (<i>pressure</i>) -- maksudnya, jika kapasitas disk sudah di titik rendah; `False` untuk sebaliknya |
| `NetworkUnavailable`    | `True` jika jaringan untuk node tidak dikonfigurasi dengan benar, `False` untuk sebaliknya |

<i>Condition</i> pada node direpresentasikan oleh suatu obyek JSON. Sebagai contoh, respon berikut ini menggambarkan node yang sedang sehat (<i>healthy</i>).

```json
"conditions": [
  {
    "type": "Ready",
    "status": "True"
  }
]
```

Jika status untuk `Ready condition` bernilai `Unknown` atau `False` untuk waktu yang lebih dari `pod-eviction-timeout`, tergantung bagaimana [kube-controller-manager](/docs/admin/kube-controller-manager/) dikonfigurasi, semua pod yang dijalankan pada node tersebut akan dihilangkan oleh Kontroler Node.
Durasi <i>eviction timeout</i> yang standar adalah **lima menit**. 
Pada kasus tertentu ketika node terputus jaringannya, apiserver tidak dapat berkomunikasi dengan kubelet yang ada pada node. 
Keputusan untuk menghilangkan pod tidak dapat diberitahukan pada kubelet, sampai komunikasi dengan apiserver terhubung kembali. 
Sementara itu, pod-pod akan terus berjalan pada node yang sudah terputus, walaupun mendapati <i>schedule</i> untuk dihilangkan.

Pada versi Kubernetes sebelum 1.5, kontroler node dapat menghilangkan dengan paksa ([force delete](/docs/concepts/workloads/pods/pod/#force-deletion-of-pods)) pod-pod yang terputus dari apiserver. 
Namun, pada versi 1.5 dan seterusnya, kontroler node tidak menghilangkan pod dengan paksa, sampai ada konfirmasi bahwa pod tersebut sudah berhenti jalan di dalam kluster.
Pada kasus dimana Kubernetes tidak bisa menarik kesimpulan bahwa ada node yang telah meninggalkan kluster, admin kluster mungkin perlu untuk menghilangkan node secara manual.
Menghilangkan obyek node dari Kubernetes akan membuat semua pod yang berjalan pada node tersebut dihilangkan oleh apiserver, dan membebaskan nama-namanya agar bisa digunakan kembali.

Pada versi 1.12, fitur `TaintNodesByCondition` telah dipromosikan ke beta, sehingga kontroler <i>lifecycle</i> node secara otomatis membuat [taints](/docs/concepts/configuration/taint-and-toleration/) yang merepresentasikan <i>conditions</i>.
Akibatnya, <i>scheduler</i> menghiraukan <i>conditions</i> ketika mempertimbangkan sebuah Node; <i>scheduler</i> akan melihat pada <i>taints</i> sebuah Node dan <i>tolerations</i> sebuah Pod.

Sekarang, para pengguna dapat memilih antara model <i>scheduling</i> yang lama dan model <i>scheduling</i> yang lebih fleksibel.
Pada model yang lama, sebuah pod tidak memiliki <i>tolerations</i> apapun sampai mendapat giliran <i>schedule</i>. Namun, pod dapat dijalankan pada Node tertentu, dimana pod melakukan toleransi terhadap <i>taints</i> yang dimiliki oleh Node tersebut.

{{< caution >}}
Mengaktifkan fitur ini menambahkan <i>delay</i> sedikit antara waktu saat suatu <i>condition</i> terlihat dan saat suatu <i>taint</i> dibuat. <i>Delay</i> ini biasanya kurang dari satu detik, tapi dapat menambahkan jumlah yang telah berhasil mendapat <i>schedule</i>, namun ditolak oleh kubelet untuk dijalankan.
{{< /caution >}}

### Capacity

Menjelaskan tentang <i>resource-resource</i> yang ada pada node: CPU, memori, dan jumlah pod secara maksimal yang dapat dijalankan pada suatu node.

### Info

Informasi secara umum pada suatu node, seperti versi kernel, versi Kubernetes (versi kubelet dan kube-proxy), versi Docker (jika digunakan), nama OS.
Informasi ini dikumpulkan oleh Kubelet di dalam node.

## Manajemen

Tidak seperti [pod](/docs/concepts/workloads/pods/pod/) dan [service](/docs/concepts/services-networking/service/), sebuah node tidaklah dibuat dan dikonfigurasi oleh Kubernetes: tapi node dibuat di luar kluster oleh penyedia layanan cloud, seperti Google Compute Engine, atau <i>pool</i> mesin fisik ataupun virtual (VM) yang kamu punya.
Jadi ketika Kubernetes membuat sebuah node, obyek yang merepresentasikan node tersebut akan dibuat.
Setelah pembuatan, Kubernetes memeriksa apakah node tersebut valid atau tidak.
Contohnya, jika kamu mencoba untuk membuat node dari konten berikut:

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

Kubernetes membuat sebuah obyek node secara internal (representasinya), dan melakukan validasi terhadap node. Validasi dilakukan dengan memeriksa kondisi kesehatan node (<i>health checking</i>), berdasarkan <i>field</i> `metadata.name`. Jika node valid -- terjadi saat semua servis yang diperlukan sudah jalan -- maka node diperbolehkan untuk menjalankan sebuah pod.
Namun jika tidak valid, node tersebut akan dihiraukan untuk aktivitas apapun yang berhubungan dengan kluster, sampai telah menjadi valid.

{{< note >}}
Kubernetes tetap menyimpan obyek untuk node yang tidak valid, dan terus memeriksa apakah node telah menjadi valid atau belum.
Kamu harus secara eksplisit menghilangkan obyek Node tersebut untuk menghilangkan proses ini.
{{< /note >}}

Saat ini, ada tiga komponen yang berinteraksi dengan antarmuka node di Kubernetes: kontroler node, kubelet, dan kubectl.

### Kontroler Node

Kontroler node adalah komponen master Kubernetes yang berfungsi untuk mengatur berbagai aspek dari node.

Kontroler node memiliki berbagai peran (<i>role</i>) dalam sebuah <i>lifecycle</i> node.
Pertama, menetapkan blok CIDR pada node tersebut saat registrasi (jika CIDR <i>assignment</i> diaktifkan).

Kedua, terus memperbarui daftar internal node di dalam kontroler node, sesuai dengan daftar mesin yang tersedia di dalam penyedia layanan cloud.
Ketika berjalan di dalam <i>environment</i> cloud, kapanpun saat sebuah node tidak lagi sehat (<i>unhealthy</i>), kontroler node bertanya pada penyedia cloud, apakah VM untuk node tersebut masihkah tersedia atau tidak.
Jika sudah tidak tersedia, kontroler node menghilangkan node tersebut dari daftar node.

Ketiga, melakukan monitor terhadap kondisi kesehatan (<i>health</i>) node.
Kontroler node bertanggung jawab untuk mengubah status `NodeReady condition` pada `NodeStatus` menjadi `ConditionUnknown`, ketika sebuah node terputus jaringannya (kontroler node tidak lagi mendapat <i>heartbeat</i> karena suatu hal, contohnya karena node tidak hidup), dan saat kemudian melakukan <i>eviction</i> terhadap semua pod yang ada pada node tersebut (melalui terminasi halus -- <i>graceful</i>) jika node masih terus terputus. (<i>Timeout</i> standar adalah 40 detik untuk mulai melaporkan `ConditionUnknown` dan 5 menit setelah itu untuk mulai melakukan <i>eviction</i> terhadap pod.)
Kontroler node memeriksa <i>state</i> masing-masing node untuk durasi yang ditentukan oleh argumen `--node-monitor-period`.

Pada versi Kubernetes sebelum 1.13, `NodeStatus` adalah <i>heartbeat</i> yang diberikan oleh node.
Setelah versi 1.13, fitur <i>node lease</i> diperkenalkan sebagai fitur alpha (fitur gate `NodeLease`,
[KEP-0009](https://github.com/kubernetes/community/blob/master/keps/sig-node/0009-node-heartbeat.md)).
Ketika fitur <i>node lease</i> diaktifasi, setiap node terhubung dengan obyek `Lease` di dalam <i>namespace</i> `kube-node-lease` yang terus diperbarui secara berkala.
Kemudian, `NodeStatus` dan <i>node lease</i> keduanya dijadikan sebagai <i>heartbeat</i> dari node.
Semua <i>node lease</i> diperbarui sesering mungkin, sedangkan `NodeStatus` dilaporkan dari node untuk master hanya ketika ada perubahan atau telah melewati periode waktu tertentu (<i>default</i>-nya 1 menit, lebih lama daripada <i>default timeout</i> node-node yang terputus jaringannya).
Karena <i>node lease</i> jauh lebih ringan daripada `NodeStatus`, fitur ini membuat <i>heartbeat</i> dari node jauh lebih murah secara signifikan dari sudut pandang skalabilitas dan performa.

Di Kubernetes 1.4, kami telah memperbarui <i>logic</i> dari kontroler node supaya lebih baik dalam menangani kasus saat banyak sekali node yang tidak bisa terhubung dengan master (contohnya, karena master punya masalah jaringan).
Mulai dari 1.4, kontroler node melihat <i>state</i> dari semua node di dalam kluster, saat memutuskan untuk melakukan <i>eviction</i> pada pod.

Pada kasus kebanyakan, kontroler node membatasi <i>rate eviction</i> menjadi `--node-eviction-rate` (<i>default</i>-nya 0.1) per detik.
Artinya, kontroler node tidak akan melakukan <i>eviction</i> pada pod lebih dari 1 node per 10 detik.

Perlakuan <i>eviction</i> pada node berubah ketika sebuah node menjadi tidak sehat (<i>unhealthy</i>) di dalam suatu zona <i>availability</i>.
Kontroler node memeriksa berapa persentase node di dalam zona tersebut yang tidak sehat (saat `NodeReady condition` menjadi `ConditionUnknown` atau `ConditionFalse`) pada saat yang bersamaan.
Jika persentase node yang tidak sehat bernilai `--unhealthy-zone-threshold` (<i>default</i>-nya 0.55), maka <i>rate eviction</i> berkurang: untuk ukuran kluster yang kecil (saat jumlahnya lebih kecil atau sama dengan jumlah node `--large-cluster-size-threshold` - <i>default</i>-nya 50), maka <i>eviction</i> akan berhenti dilakukan.
Jika masih besar jumlahnya,  <i>rate eviction</i> dikurangi menjadi `--secondary-node-eviction-rate` (<i>default</i>-nya 0.01) per detik.
Alasan kenapa hal ini diimplementasi untuk setiap zona <i>availability</i> adalah karena satu zona bisa saja terputus dari master, saat yang lainnya masih terhubung.
Jika kluster tidak menjangkau banyak zona <i>availability</i> yang disediakan oleh penyedia cloud, maka hanya ada satu zona (untuk semua node di dalam kluster).

Alasan utama untuk menyebarkan node pada banyak zona <i>availability</i> adalah supaya <i>workload</i> dapat dipindahkan ke zona sehat (<i>healthy</i>) saat suatu zona mati secara menyeluruh.
Kemudian, jika semua node di dalam suatu zona menjadi tidak sehat (<i>unhealthy</i>), maka kontroler node melakukan <i>eviction</i> pada <i>rate</i> normal `--node-eviction-rate`.
Kasus khusus, ketika seluruh zona tidak ada satupun sehat (tidak ada node yang sehat satupun di dalam kluster).
Pada kasus ini, kontroler node berasumsi ada masalah pada jaringan master, dan menghentikan semua <i>eviction</i> sampai jaringan terhubung kembali.

Mulai dari Kubernetes 1.6, kontroler node juga bertanggung jawab untuk melakukan <i>eviction</i> pada pod-pod yang berjalan di atas node dengan <i>taints</i> `NoExecute`, ketika pod-pod tersebut sudah tidak lagi <i>tolerate</i> terhadap <i>taints</i>.
Sebagai tambahan, hal ini di-nonaktifkan secara <i>default</i> pada fitur alpha, kontroler node bertanggung jawab untuk menambahkan <i>taints</i> yang berhubungan dengan masalah pada node, seperti terputus atau `NotReady`.
Lihat [dokumentasi ini](/docs/concepts/configuration/taint-and-toleration/) untuk bahasan detail tentang <i>taints</i> `NoExecute` dan fitur alpha.

Mulai dari versi 1.8, kontroler node bisa diatur untuk bertanggung jawab pada pembuatan <i>taints</i> yang merepresentasikan node <i>condition</i>.
Ini merupakan fitur alpha untuk versi 1.8.

### <i>Self-Registration</i> untuk Node

Ketika argumen `--register-node` pada kubelet bernilai <i>true</i> (<i>default</i>-nya), kubelet akan berusaha untuk registrasi dirinya melalui API server.
Ini merupakan <i>pattern</i> yang disukai, digunakan oleh kebanyakan <i>distros</i>.

Kubelet memulai registrasi diri (<i>self-registration</i>) dengan opsi-opsi berikut:

  - `--kubeconfig` - <i>Path</i> berisi kredensial-kredensial yang digunakan untuk registrasi diri pada apiserver.
  - `--cloud-provider` - Cara berbicara pada sebuah penyedia layanan cloud, baca tentang metadata-nya.
  - `--register-node` - Registrasi secara otomatis pada API server.
  - `--register-with-taints` - Registrasi node dengan daftar <i>taints</i> (dipisahkan oleh koma `<key>=<value>:<effect>`). No-op jika `register-node` bernilai <i>false</i>.
  - `--node-ip` - Alamat IP dari node dimana kubelet berjalan.
  - `--node-labels` - Label-label untuk ditambahkan saat melakukan registrasi untuk node di dalam kluster (lihat label yang dibatasi secara paksa oleh [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) untuk 1.13+).
  - `--node-status-update-frequency` - Menentukan seberapa sering kubelet melaporkan status pada master.

Ketika mode [otorisasi Node]((/docs/reference/access-authn-authz/node/)) dan [NodeRestriction admission plugin](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) diaktifkan, semua kubelet hanya punya otoritas untuk membuat/modifikasi <i>resource</i> Node masing-masing.

#### Administrasi Node secara Manual

Seorang admin kluster dapat membuat dan memodifikasi obyek node.

Jika admin ingin untuk membuat obyek node secara manual, atur argument `--register-node=false` pada kubelet.

Admin dapat memodifikasi <i>resource-resource</i> node (terlepas dari `--register-node`).
Modifikasi terdiri dari pengaturan label pada node dan membuat node tidak dapat di-<i>schedule</i>.

Label-label pada node digunakan oleh <i>selector</i> node untuk mengatur proses <i>schedule</i> untuk pod, misalnya, membatasi sebuah pod hanya boleh dijalankan pada node-node tertentu.

Menandai sebuah node untuk tidak dapat di-<i>schedule</i> mencegah pod baru untuk tidak di-<i>schedule</i> pada node, tanpa mempengaruhi pod-pod yang sudah berjalan pada node tersebut.
Ini berguna sebagai langkah persiapan untuk melakukan <i>reboote</i> pada node.
Sebagai contoh, untuk menandai sebuah node untuk tidak dapat di-<i>schedule</i>, jalankan perintah berikut:

```shell
kubectl cordon $NODENAME
```

{{< note >}}
Pod-pod yang dibuat oleh suatu kontroler DaemonSet menghiraukan <i>scheduler</i> Kubernetes dan mengabaikan tanda <i>unschedulable</i> pada node.
Hal ini mengasumsikan bahwa <i>daemons</i> dimiliki oleh mesin, walaupun telah dilakukan <i>drain</i> pada aplikasi, saat melakukan persaiapan <i>reboot</i>.
{{< /note >}}

### Kapasitas Node

Kapasitas node (jumlah CPU dan memori) adalah bagian dari obyek node.
Pada umumnya, node-node melakukan registrasi diri dan melaporkan kapasitasnya saat obyek node dibuat.
Jika kamu melakukan [administrasi node manual](#manual-node-administration), maka kamu perlu mengatur kapasitas node saat menambahkan node baru.

<i>Scheduler</i> Kubernetes memastikan kalau ada <i>resource</i> yang cukup untuk menjalankan semua pod di dalam sebuah node.
Kubernetes memeriksa jumlah semua <i>request</i> untuk kontainer pada sebuah node tidak lebih besar daripada kapasitas node.
Hal ini termasuk semua kontainer yang dijalankan oleh kubelet. Namun, ini tidak termasuk kontainer-kontainer yang dijalankan secara langsung oleh [runtime kontainer](/docs/concepts/overview/components/#node-components) ataupun <i>process</i> yang ada di luar kontainer.

Kalau kamu ingin secara eksplisit menyimpan <i>resource</i> cadangan untuk menjalankan <i>process-process</i> selain Pod, ikut tutorial [menyimpan resource cadangan untuk <i>system daemon</i>](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).


## Obyek API

Node adalah tingkatan tertinggi dari <i>resource</i> di dalam Kubernetes REST API.
Penjelasan lebih detail tentang obyek API dapat dilihat pada: [Obyek Node API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).

{{% /capture %}}
