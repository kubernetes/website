---
title: Mengatur Sumber Daya Komputasi untuk Container
content_type: concept
weight: 20
feature:
  title: Bin Packing Otomatis
  description: >
    Menaruh kontainer-kontainer secara otomatis berdasarkan kebutuhan sumber daya mereka dan batasan-batasan lainnya, tanpa mengorbankan ketersediaan. Membaurkan beban-beban kerja kritis dan _best-effort_ untuk meningkatkan penggunaan sumber daya dan menghemat lebih banyak sumber daya.
---

<!-- overview -->

Saat kamu membuat spesifikasi sebuah [Pod](/id/docs/concepts/workloads/pods/pod/), kamu
dapat secara opsional menentukan seberapa banyak CPU dan memori (RAM) yang dibutuhkan
oleh setiap Container. Saat Container-Container menentukan _request_ (permintaan) sumber daya,
scheduler dapat membuat keputusan yang lebih baik mengenai Node mana yang akan dipilih
untuk menaruh Pod-Pod. Dan saat limit (batas) sumber daya Container-Container telah ditentukan,
maka kemungkinan rebutan sumber daya pada sebuah Node dapat dihindari.
Untuk informasi lebih lanjut mengenai perbedaan `request` dan `limit`, lihat [QoS Sumber Daya](https://git.k8s.io/community/contributors/design-proposals/node/resource-qos.md).



<!-- body -->

## Jenis-jenis sumber daya

_CPU_ dan _memori_ masing-masing merupakan _jenis sumber daya_ (_resource type_).
Sebuah jenis sumber daya memiliki satuan dasar. CPU ditentukan dalam satuan jumlah _core_,
dan memori ditentukan dalam satuan _bytes_. Jika kamu menggunakan Kubernetes v1.14 keatas,
kamu dapat menentukan sumber daya _huge page_. _Huge page_ adalah fitur khusus Linux
di mana kernel Node mengalokasikan blok-blok memori yang jauh lebih besar daripada ukuran
_page_ bawaannya.

Sebagai contoh, pada sebuah sistem di mana ukuran _page_ bawaannya adalah 4KiB, kamu
dapat menentukan sebuah limit, `hugepages-2Mi: 80Mi`. Jika kontainer mencoba mengalokasikan
lebih dari 40 _huge page_ berukuran 20MiB (total 80MiB), maka alokasi tersebut akan gagal.

{{< note >}}
Kamu tidak dapat melakukan _overcommit_ terhadap sumber daya `hugepages-*`.
Hal ini berbeda dari sumber daya `memory` dan `cpu` (yang dapat di-_overcommit_).
{{< /note >}}

CPU dan memori secara kolektif disebut sebagai _sumber daya komputasi_, atau cukup
_sumber daya_ saja. Sumber daya komputasi adalah jumlah yang dapat diminta, dialokasikan,
dan dikonsumsi. Mereka berbeda dengan [sumber daya API](/id/docs/concepts/overview/kubernetes-api/).
Sumber daya API, seperti Pod dan [Service](/id/docs/concepts/services-networking/service/) adalah
objek-objek yang dapat dibaca dan diubah melalui Kubernetes API Server.

## Request dan Limit Sumber daya dari Pod dan Container

Setiap Container dari sebuah Pod dapat menentukan satu atau lebih dari hal-hal berikut:

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.limits.hugepages-<size>`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`
* `spec.containers[].resources.requests.hugepages-<size>`

Walaupun `requests` dan `limits` hanya dapat ditentukan pada Container individual, akan
lebih mudah untuk membahas tentang request dan limit sumber daya dari Pod. Sebuah
_request/limit sumber daya Pod_ untuk jenis sumber daya tertentu adalah jumlah dari
request/limit sumber daya pada jenis tersebut untuk semua Container di dalam Pod tersebut.

## Arti dari CPU

Limit dan request untuk sumber daya CPU diukur dalam satuan _cpu_.
Satu cpu, dalam Kubernetes, adalah sama dengan:

- 1 vCPU AWS
- 1 Core GCP
- 1 vCore Azure
- 1 vCPU IBM
- 1 *Hyperthread* pada sebuah prosesor Intel _bare-metal_ dengan Hyperthreading

Request dalam bentuk pecahan diizinkan. Sebuah Container dengan
`spec.containers[].resources.requests.cpu` bernilai `0.5` dijamin mendapat
setengah CPU dibandingkan dengan yang meminta 1 CPU. Ekspresi nilai  `0.1` ekuivalen
dengan ekspresi nilai `100m`, yang dapat dibaca sebagai "seratus milicpu". Beberapa
orang juga membacanya dengan "seratus milicore", dan keduanya ini dimengerti sebagai
hal yang sama. Sebuah request dengan angka di belakang koma, seperti `0.1` dikonversi
menjadi `100m` oleh API, dan presisi yang lebih kecil lagi dari `1m` tidak dibolehkan.
Untuk alasan ini, bentuk `100m` mungkin lebih disukai.

CPU juga selalu diminta dalam jumlah yang mutlak, tidak sebagai jumlah yang relatif;
0.1 adalah jumlah CPU yang sama pada sebuah mesin _single-core_, _dual-core_, atau
_48-core_.

## Arti dari Memori

Limit dan request untuk `memory` diukur dalam satuan _bytes_. Kamu dapat mengekspresikan
memori sebagai _plain integer_ atau sebagai sebuah _fixed-point integer_ menggunakan
satu dari sufiks-sufiks berikut: E, P, T, G, M, K. Kamu juga dapat menggunakan bentuk
pangkat dua ekuivalennya: Ei, Pi, Ti, Gi, Mi, Ki.
Sebagai contoh, nilai-nilai berikut kurang lebih sama:

```shell
128974848, 129e6, 129M, 123Mi
```

Berikut sebuah contoh.
Pod berikut memiliki dua Container. Setiap Container memiliki request 0.25 cpu dan
64MiB (2<sup>26</sup> bytes) memori. Setiap Container memiliki limit 0.5 cpu dan
128MiB memori. Kamu dapat berkata bahwa Pod tersebut memiliki request 0.5 cpu dan
128MiB memori, dan memiliki limit 1 cpu dan 265MiB memori.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: db
    image: mysql
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "password"
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: wp
    image: wordpress
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## Bagaimana Pod-Pod dengan request sumber daya dijadwalkan

Saat kamu membuat sebuah Pod, Kubernetes scheduler akan memilih sebuah Node
untuk Pod tersebut untuk dijalankan. Setiap Node memiliki kapasitas maksimum
untuk setiap jenis sumber daya: jumlah CPU dan memori yang dapat disediakan
oleh Node tersebut untuk Pod-Pod. Scheduler memastikan bahwa, untuk setiap
jenis sumber daya, jumlah semua request sumber daya dari Container-Container
yang dijadwalkan lebih kecil dari kapasitas Node tersebut. Perlu dicatat
bahwa walaupun penggunaan sumber daya memori atau CPU aktual/sesungguhnya pada
Node-Node sangat rendah, scheduler tetap akan menolak untuk menaruh sebuah
Pod pada sebuah Node jika pemeriksaan kapasitasnya gagal. Hal ini adalah untuk
menjaga dari kekurangan sumber daya pada sebuah Node saat penggunaan sumber daya
meningkat suatu waktu, misalnya pada saat titik puncak _traffic_ harian.

## Bagaimana Pod-Pod dengan limit sumber daya dijalankan

Saat Kubelet menjalankan sebuah Container dari sebuah Pod, Kubelet tersebut
mengoper limit CPU dan memori ke _runtime_ kontainer.

Ketika menggunakan Docker:

- `spec.containers[].resources.requests.cpu` diubah menjadi nilai _core_-nya,
  yang mungkin berbentuk angka pecahan, dan dikalikan dengan 1024. Nilai yang
  lebih besar antara angka ini atau 2 digunakan sebagai nilai dari _flag_
  [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#cpu-share-constraint)
  pada perintah `docker run`.

- `spec.containers[].resources.limits.cpu` diubah menjadi nilai _millicore_-nya dan
  dikalikan dengan 100. Nilai hasilnya adalah jumlah waktu CPU yang dapat digunakan oleh
  sebuah kontainer setiap 100 milidetik. Sebuah kontainer tidak dapat menggunakan lebih
  dari jatah waktu CPU-nya selama selang waktu ini.

  {{< note >}}
  Periode kuota bawaan adalah 100ms. Resolusi minimum dari kuota CPU adalah 1 milidetik.
  {{</ note >}}

- `spec.containers[].resources.limits.memory` diubah menjadi sebuah bilangan bulat, dan
  digunakan sebagai nilai dari _flag_ [`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints)
  dari perintah `docker run`.

Jika sebuah Container melebihi batas memorinya, Container tersebut mungkin akan diterminasi.
Jika Container tersebut dapat diulang kembali, Kubelet akan mengulangnya kembali, sama
seperti jenis kegagalan lainnya.

Jika sebuah Container melebihi request memorinya, kemungkinan Pod-nya akan dipindahkan
kapanpun Node tersebut kehabisan memori.

Sebuah Container mungkin atau mungkin tidak diizinkan untuk melebihi limit CPU-nya
untuk periode waktu yang lama. Tetapi, Container tersebut tidak akan diterminasi karena
penggunaan CPU yang berlebihan.

Untuk menentukan apabila sebuah Container tidak dapat dijadwalkan atau sedang diterminasi
karena limit sumber dayanya, lihat bagian [Penyelesaian Masalah](#penyelesaian-masalah).

## Memantau penggunaan sumber daya komputasi

Penggunaan sumber daya dari sebuah Pod dilaporkan sebagai bagian dari kondisi Pod.

Jika [_monitoring_ opsional](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/cluster-monitoring/README.md) diaktifkan pada klaster kamu, maka penggunaan sumber daya Pod dapat diambil
dari sistem _monitoring_ kamu.

## Penyelesaian Masalah

### Pod-Pod saya berkondisi Pending (tertunda) dengan _event message_ failedScheduling

Jika scheduler tidak dapat menemukan Node manapun yang muat untuk sebuah Pod,
Pod tersebut tidak akan dijadwalkan hingga ditemukannya sebuah tempat yang
muat. Sebuah _event_ akan muncul setiap kali scheduler gagal menemukan tempat
untuk Pod tersebut, seperti berikut:

```shell
kubectl describe pod frontend | grep -A 3 Events
```
```
Events:
  FirstSeen LastSeen   Count  From          Subobject   PathReason      Message
  36s   5s     6      {scheduler }              FailedScheduling  Failed for reason PodExceedsFreeCPU and possibly others
```

Pada contoh di atas, Pod bernama "frontend" gagal dijadwalkan karena kekurangan
sumber daya CPU pada Node tersebut. Pesan kesalahan yang serupa dapat juga menunjukkan
kegagalan karena kekurangan memori (PodExceedsFreeMemroy). Secara umum, jika sebuah
Pod berkondisi Pending (tertunda) dengan sebuah pesan seperti ini, ada beberapa hal yang
dapat dicoba:

- Tambah lebih banyak Node pada klaster.
- Terminasi Pod-Pod yang tidak dibutuhkan untuk memberikan ruangan untuk Pod-Pod yang
  tertunda.
- Periksa jika nilai request Pod tersebut tidak lebih besar dari Node-node yang ada.
  Contohnya, jika semua Node memiliki kapasitas `cpu: 1`, maka Pod dengan request
  `cpu: 1.1` tidak akan pernah dijadwalkan.

Kamu dapat memeriksa kapasitas Node-Node dan jumlah-jumlah yang telah dialokasikan
dengan perintah `kubectl describe nodes`. Contohnya:

```shell
kubectl describe nodes e2e-test-node-pool-4lw4
```
```
Name:            e2e-test-node-pool-4lw4
[ ... lines removed for clarity ...]
Capacity:
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 cpu:                               1800m
 memory:                            7474992Ki
 pods:                              110
[ ... beberapa baris dihapus untuk kejelasan ...]
Non-terminated Pods:        (5 in total)
  Namespace    Name                                  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------    ----                                  ------------  ----------  ---------------  -------------
  kube-system  fluentd-gcp-v1.38-28bv1               100m (5%)     0 (0%)      200Mi (2%)       200Mi (2%)
  kube-system  kube-dns-3297075139-61lj3             260m (13%)    0 (0%)      100Mi (1%)       170Mi (2%)
  kube-system  kube-proxy-e2e-test-...               100m (5%)     0 (0%)      0 (0%)           0 (0%)
  kube-system  monitoring-influxdb-grafana-v4-z1m12  200m (10%)    200m (10%)  600Mi (8%)       600Mi (8%)
  kube-system  node-problem-detector-v0.1-fj7m3      20m (1%)      200m (10%)  20Mi (0%)        100Mi (1%)
Allocated resources:
  (Total limit mungkin melebihi 100 persen, misalnya, karena _overcommit_.)
  CPU Requests    CPU Limits    Memory Requests    Memory Limits
  ------------    ----------    ---------------    -------------
  680m (34%)      400m (20%)    920Mi (12%)        1070Mi (14%)
```

Pada keluaran di atas, kamu dapat melihat bahwa jika sebuah Pod meminta lebih dari
1120m CPU atau 6.23Gi memori, Pod tersebut tidak akan muat pada Node tersebut.

Dengan melihat pada bagian `Pods`, kamu dapat melihat Pod-Pod mana saja yang memakan
sumber daya pada Node tersebut.
Jumlah sumber daya yang tersedia untuk Pod-Pod kurang dari kapasitas Node, karena
_daemon_ sistem menggunakan sebagian dari sumber daya yang ada. Kolom `allocatable` pada
[NodeStatus](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#nodestatus-v1-core)
memberikan jumlah sumber daya yang tersedia untuk Pod-Pod. Untuk lebih lanjut, lihat
[Sumber daya Node yang dapat dialokasikan](https://git.k8s.io/community/contributors/design-proposals/node/node-allocatable.md).

Fitur [kuota sumber daya](/id/docs/concepts/policy/resource-quotas/) dapat disetel untuk
membatasi jumlah sumber daya yang dapat digunakan. Jika dipakai bersama dengan Namespace,
kuota sumber daya dapat mencegah suatu tim menghabiskan semua sumber daya.

### Container saya diterminasi

Container kamu mungkin diterminasi karena Container tersebut melebihi batasnya. Untuk
memeriksa jika sebuah Container diterminasi karena ia melebihi batas sumber dayanya,
gunakan perintah `kubectl describe pod` pada Pod yang bersangkutan:

```shell
kubectl describe pod simmemleak-hra99
```
```
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Replication Controllers:        simmemleak (1/1 replicas created)
Containers:
  simmemleak:
    Image:  saadali/simmemleak
    Limits:
      cpu:                      100m
      memory:                   50Mi
    State:                      Running
      Started:                  Tue, 07 Jul 2015 12:54:41 -0700
    Last Termination State:     Terminated
      Exit Code:                1
      Started:                  Fri, 07 Jul 2015 12:54:30 -0700
      Finished:                 Fri, 07 Jul 2015 12:54:33 -0700
    Ready:                      False
    Restart Count:              5
Conditions:
  Type      Status
  Ready     False
Events:
  FirstSeen                         LastSeen                         Count  From                              SubobjectPath                       Reason      Message
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {scheduler }                                                          scheduled   Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   pulled      Pod container image "registry.k8s.io/pause:0.8.0" already present on machine
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   created     Created with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   started     Started with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    spec.containers{simmemleak}         created     Created with docker id 87348f12526a
```

Pada contoh di atas, `Restart Count:  5` menunjukkan bahwa Container `simmemleak`
pada Pod tersebut diterminasi dan diulang kembali sebanyak lima kali.

Kamu dapat menggunakan perintah `kubectl get pod` dengan opsi `-o go-template=...` untuk
mengambil kondisi dari Container-Container yang sebelumnya diterminasi:

```shell
kubectl get pod -o go-template='{{range.status.containerStatuses}}{{"Container Name: "}}{{.name}}{{"\r\nLastState: "}}{{.lastState}}{{end}}'  simmemleak-hra99
```
```
Container Name: simmemleak
LastState: map[terminated:map[exitCode:137 reason:OOM Killed startedAt:2015-07-07T20:58:43Z finishedAt:2015-07-07T20:58:43Z containerID:docker://0e4095bba1feccdfe7ef9fb6ebffe972b4b14285d5acdec6f0d3ae8a22fad8b2]]
```

Kamu dapat lihat bahwa Container tersebut diterminasi karena  `reason:OOM Killed`, di mana
`OOM` merupakan singkatan dari _Out Of Memory_, atau kehabisan memori.


## Penyimpanan lokal sementara
{{< feature-state state="beta" >}}

Kubernetes versi 1.8 memperkenalkan sebuah sumber daya baru, _ephemeral-storage_ untuk mengatur penyimpanan lokal yang bersifat sementara. Pada setiap Node Kubernetes, direktori _root_ dari Kubelet (secara bawaan /var/lib/kubelet) dan direktori log (/var/log) ditaruh pada partisi _root_ dari Node tersebut. Partisi ini juga digunakan bersama oleh Pod-Pod melalui volume emptyDir, log kontainer, lapisan _image_, dan lapisan kontainer yang dapat ditulis.

Partisi ini bersifat "sementara" dan aplikasi-aplikasi tidak dapat mengharapkan SLA kinerja (misalnya _Disk IOPS_) dari partisi ini. Pengelolaan penyimpanan lokal sementara hanya berlaku untuk partisi _root_; partisi opsional untuk lapisan _image_ dan lapisan yang dapat ditulis berada di luar ruang lingkup.

{{< note >}}
Jika sebuah partisi _runtime_ opsional digunakan, partisi _root_ tidak akan menyimpan lapisan _image_ ataupun lapisan yang dapat ditulis manapun.
{{< /note >}}

### Menyetel request dan limit dari penyimpanan lokal sementara

Setiap Container dari sebuah Pod dapat menentukan satu atau lebih dari hal-hal berikut:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

Limit dan request untuk `ephemeral-storage` diukur dalam satuan _bytes_. Kamu dapat menyatakan
penyimpanan dalam bilangan bulat biasa, atau sebagai _fixed-point integer_ menggunakan satu dari
sufiks-sufiks ini: E, P, T, G, M, K. Kamu jika dapat menggunakan bentuk pangkat dua ekuivalennya:
Ei, Pi, Ti, Gi, Mi, Ki. Contohnya, nilai-nilai berikut kurang lebih sama:

```shell
128974848, 129e6, 129M, 123Mi
```

Contohnya, Pod berikut memiliki dua Container. Setiap Container memiliki request 2GiB untuk penyimpanan lokal sementara. Setiap Container memiliki limit 4GiB untuk penyimpanan lokal sementara. Maka, Pod tersebut memiliki jumlah request 4GiB penyimpanan lokal sementara, dan limit 8GiB.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: db
    image: mysql
    env:
    - name: MYSQL_ROOT_PASSWORD
      value: "password"
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
  - name: wp
    image: wordpress
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
```

### Bagaimana Pod-Pod dengan request ephemeral-storage dijadwalkan

Saat kamu membuat sebuah Pod, Kubernetes scheduler memilih sebuah Node di mana Pod
tersebut akan dijalankan. Setiap Node memiliki jumlah maksimum penyimpanan lokal sementara yang dapat disediakan.
Untuk lebih lanjut, lihat ["Hal-hal yang dapat dialokasikan Node"](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

Scheduler memastikan bahwa jumlah dari request-request sumber daya dari Container-Container yang dijadwalkan lebih kecil dari kapasitas Node.

### Bagaimana Pod-Pod dengan limit ephemeral-storage dijalankan

Untuk isolasi pada tingkat kontainer, jika lapisan yang dapat ditulis dari sebuah Container dan penggunaan log melebihi limit penyimpanannya, maka Pod tersebut akan dipindahkan. Untuk isolasi pada tingkat Pod, jika jumlah dari penyimpanan lokal sementara dari semua Container dan juga volume emptyDir milik Pod melebihi limit, maka Pod teresebut akan dipindahkan.

### Memantau penggunaan ephemeral-storage

Saat penyimpanan lokal sementara digunakan, ia dipantau terus-menerus
oleh Kubelet. Pemantauan dilakukan dengan cara memindai setiap volume
emptyDir, direktori log, dan lapisan yang dapat ditulis secara periodik.
Dimulai dari Kubernetes 1.15, volume emptyDir (tetapi tidak direktori log
atau lapisan yang dapat ditulis) dapat, sebagai pilihan dari operator
klaster, dikelola  dengan menggunakan [_project quotas_](http://xfs.org/docs/xfsdocs-xml-dev/XFS_User_Guide/tmp/en-US/html/xfs-quotas.html).
_Project quotas_ aslinya diimplementasikan dalam XFS, dan baru-baru ini
telah diubah ke ext4fs. _Project quotas_ dapat digunakan baik untuk
_monitoring_ dan pemaksaan; sejak Kubernetes 1.16, mereka tersedia sebagai
fitur _alpha_ untuk _monitoring_ saja.

_Quota_ lebih cepat dan akurat dibandingkan pemindaian direktori. Saat
sebuah direktori ditentukan untuk sebuah proyek, semua berkas yang dibuat
pada direktori tersebut dibuat untuk proyek tersebut, dan kernel hanya
perlu melacak berapa banyak blok yang digunakan oleh berkas-berkas pada
proyek tersebut. Jika sebuah berkas dibuat dan dihapus, tetapi tetap dengan
sebuah _file descriptor_ yang terbuka, maka berkas tersebut tetap akan
memakan ruangan penyimpanan. Ruangan ini akan dilacak oleh _quota_ tersebut,
tetapi tidak akan terlihat oleh sebuah pemindaian direktori.

Kubernetes menggunakan ID proyek yang dimulai dari 1048576. ID-ID yang
digunakan akan didaftarkan di dalam `/etc/projects` dan `/etc/projid`.
Jika ID-ID proyek pada kisaran ini digunakan untuk tujuan lain pada sistem,
ID-ID proyek tersebut harus terdaftar di dalam `/etc/projects` dan `/etc/projid`
untuk mencegah Kubernetes menggunakan ID-ID tersebut.

Untuk mengaktifkan penggunaan _project quotas_, operator klaster
harus melakukan hal-hal berikut:

* Aktifkan _feature gate_ `LocalStorageCapacityIsolationFSQuotaMonitoring=true`
  pada konfigurasi Kubelet. Nilainya secara bawaan `false` pada
  Kubernetes 1.16, jadi harus secara eksplisit disetel menjadi `true`.

* Pastikan bahwa partisi _root_ (atau partisi opsional _runtime_)
  telah dibangun (_build_) dengan mengaktifkan _project quotas_. Semua sistem berkas (_filesystem_)
  XFS mendukung _project quotas_, tetapi sistem berkas ext4 harus dibangun
  secara khusus untuk mendukungnya

* Pastikan bahwa partisi _root_ (atau partisi opsional _runtime_) ditambatkan (_mount_)
  dengan _project quotas_ yang telah diaktifkan.

#### Membangun dan menambatkan sistem berkas dengan _project quotas_ yang telah diaktifkan

Sistem berkas XFS tidak membutuhkan tindakan khusus saat dibangun;
mereka secara otomatis telah dibangun dengan _project quotas_ yang
telah diaktifkan.

Sistem berkas _ext4fs_ harus dibangun dengan  mengaktifkan _quotas_,
kemudian mereka harus diaktifkan pada sistem berkas tersebut.

```
% sudo mkfs.ext4 other_ext4fs_args... -E quotatype=prjquota /dev/block_device
% sudo tune2fs -O project -Q prjquota /dev/block_device
```

Untuk menambatkan sistem berkasnya, baik ext4fs dan XFS membutuhkan opsi
`prjquota` disetel di dalam `/etc/fstab`:

```
/dev/block_device	/var/kubernetes_data	defaults,prjquota	0	0
```


## Sumber daya yang diperluas

Sumber daya yang diperluas (_Extended Resource_) adalah nama sumber daya di luar domain `kubernetes.io`.
Mereka memungkinkan operator klaster untuk menyatakan dan pengguna untuk menggunakan
sumber daya di luar sumber daya bawaan Kubernetes.

Ada dua langkah untuk menggunakan sumber daya yang diperluas. Pertama, operator
klaster harus menyatakan sebuah Extended Resource. Kedua, pengguna harus meminta
sumber daya yang diperluas tersebut di dalam Pod.

### Mengelola sumber daya yang diperluas

#### Sumber daya yang diperluas pada tingkat Node

Sumber daya yang diperluas pada tingkat Node terikat pada Node.

##### Sumber daya Device Plugin yang dikelola

Lihat [Device
Plugin](/id/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) untuk
cara menyatakan sumber daya _device plugin_ yang dikelola pada setiap node.

##### Sumber daya lainnya

Untuk menyatakan sebuah sumber daya yang diperluas tingkat Node, operator klaster
dapat mengirimkan permintaan HTTP `PATCH` ke API server untuk menentukan kuantitas
sumber daya yang tersedia pada kolom `status.capacity` untuk Node pada klaster.
Setelah itu, `status.capacity` pada Node akan memiliki sumber daya baru tersebut.
Kolom `status.allocatable` diperbarui secara otomatis dengan sumber daya baru
tersebut secara _asynchrounous_ oleh Kubelet. Perlu dicatat bahwa karena scheduler
menggunakan nilai `status.allocatable` milik Node saat mengevaluasi muat atau tidaknya
Pod, mungkin ada waktu jeda pendek antara melakukan `PATCH` terhadap kapasitas Node
dengan sumber daya baru dengan Pod pertama yang meminta sumber daya tersebut untuk
dapat dijadwalkan pada Node tersebut.

**Contoh:**

Berikut sebuah contoh yang menunjukkan bagaimana cara menggunakan `curl` untuk
mengirim permintaan HTTP yang menyatakan lima sumber daya "example.com/foo" pada
Node `k8s-node-1` yang memiliki master `k8s-master`.

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}
Pada permintaan HTTP di atas, `~1` adalah _encoding_ untuk karakter `/` pada jalur (_path_) _patch_.
Nilai jalur operasi tersebut di dalam JSON-Patch diinterpretasikan sebagai sebuah JSON-Pointer.
Untuk lebih lanjut, lihat [IETF RFC 6901, bagian 3](https://tools.ietf.org/html/rfc6901#section-3).
{{< /note >}}

#### Sumber daya yang diperluas pada tingkat klaster

Sumber daya yang diperluas pada tingkat klaster tidak terikat pada Node. Mereka
biasanya dikelola oleh _scheduler extender_, yang menangani penggunaan sumber daya
dan kuota sumber daya.

Kamu dapat menentukan sumber daya yang diperluas yang ditangani oleh _scheduler extender_
pada [konfigurasi kebijakan scheduler](https://github.com/kubernetes/kubernetes/blob/release-1.10/pkg/scheduler/api/v1/types.go#L31).

**Contoh:**

Konfigurasi untuk sebuah kebijakan scheduler berikut menunjukkan bahwa
sumber daya yang diperluas pada tingkat klaster "example.com/foo" ditangani
oleh _scheduler extender_.

- Scheduler mengirim sebuah Pod ke _scheduler extender_ hanya jika Pod tersebut
    meminta "example.com/foo".
- Kolom `ignoredByScheduler` menentukan bahwa scheduler tidak memeriksa sumber daya
    "example.com/foo" pada predikat `PodFitsResources` miliknya.

```json
{
  "kind": "Policy",
  "apiVersion": "v1",
  "extenders": [
    {
      "urlPrefix":"<extender-endpoint>",
      "bindVerb": "bind",
      "managedResources": [
        {
          "name": "example.com/foo",
          "ignoredByScheduler": true
        }
      ]
    }
  ]
}
```

### Menggunakan sumber daya yang diperluas

Pengguna dapat menggunakan sumber daya yang diperluas di dalam spesifikasi Pod
seperti CPU dan memori. Scheduler menangani akuntansi sumber daya tersebut agar
tidak ada alokasi untuk yang melebihi jumlah yang tersedia.

API server membatasi jumlah sumber daya yang diperluas dalam bentuk
bilangan bulat. Contoh jumlah yang _valid_ adalah `3`, `3000m`, dan
`3Ki`. Contoh jumlah yang _tidak valid_ adalah `0.5` dan `1500m`.

{{< note >}}
Sumber daya yang diperluas menggantikan Opaque Integer Resource.
Pengguna dapat menggunakan prefiks nama domain selain `kubernetes.io` yang sudah dipakai.
{{< /note >}}

Untuk menggunakan sebuah sumber daya yang diperluas di sebuah Pod, masukkan nama
sumber daya tersebut sebagai nilai _key_ dari map `spec.containers[].resources.limit`
pada spesifikasi Container.

{{< note >}}
Sumber daya yang diperluas tidak dapat di-_overcommit_, sehingga
request dan limit nilainya harus sama jika keduanya ada di spesifikasi
sebuah Container.
{{< /note >}}

Sebuah Pod hanya dijadwalkan jika semua request sumber dayanya terpenuhi, termasuk
CPU, memori, dan sumber daya yang diperluas manapun. Pod tersebut akan tetap
berada pada kondisi `PENDING` selama request sumber daya tersebut tidak terpenuhi.

**Contoh:**

Pod di bawah meminta 2 CPU dan 1 "example.com/foo" (sebuah sumber daya yang diperluas).

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        example.com/foo: 1
      limits:
        example.com/foo: 1
```






## {{% heading "whatsnext" %}}


* Dapatkan pengalaman langsung [menentukan sumber daya memori untuk Container dan Pod](/docs/tasks/configure-pod-container/assign-memory-resource/).

* Dapatkan pengalaman langsung [menentukan sumber daya CPU untuk Container dan Pod](/docs/tasks/configure-pod-container/assign-cpu-resource/).

* [Container API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)

* [ResourceRequirements](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcerequirements-v1-core)


