---
title: Menetapkan Pod ke Node
content_type: concept
weight: 30
---


<!-- overview -->

Kamu dapat memaksa sebuah [pod](/id/docs/concepts/workloads/pods/pod/) untuk hanya dapat berjalan pada [node](/id/docs/concepts/architecture/nodes/) tertentu atau mengajukannya agar berjalan pada node tertentu. Ada beberapa cara untuk melakukan hal tersebut. Semua cara yang direkomendasikan adalah dengan menggunakan [_selector_ label](/id/docs/concepts/overview/working-with-objects/labels/) untuk menetapkan pilihan yang kamu inginkan. Pada umumnya, pembatasan ini tidak dibutuhkan, sebagaimana _scheduler_ akan melakukan penempatan yang proporsional dengan otomatis (seperti contohnya menyebar pod di node-node, tidak menempatkan pod pada node dengan sumber daya yang tidak memadai, dst.) tetapi ada keadaan-keadaan tertentu yang membuat kamu memiliki kendali lebih  terhadap node yang menjadi tempat pod dijalankan, contohnya untuk memastikan pod dijalankan pada mesin yang telah terpasang SSD, atau untuk menempatkan pod-pod dari dua servis yang berbeda yang sering berkomunikasi bersamaan ke dalam zona ketersediaan yang sama.

Kamu dapat menemukan semua berkas untuk contoh-contoh berikut pada [dokumentasi yang kami sediakan di sini](https://github.com/kubernetes/website/tree/{{< param "docsbranch" >}}/content/en/docs/concepts/configuration/)



<!-- body -->

## nodeSelector

Penggunaan `nodeSelector` adalah cara pembatasan pemilihan node paling sederhana yang direkomendasikan. `nodeSelector` adalah sebuah _field_ pada PodSpec. `nodeSelector` memerinci sebuah map berisi pasangan kunci-nilai. Agar pod dapat dijalankan pada sebuah node yang memenuhi syarat, node tersebut harus memiliki masing-masing dari pasangan kunci-nilai yang dinyatakan sebagai label (namun node juga dapat memiliki label tambahan diluar itu). Penggunaan paling umum adalah satu pasang kunci-nilai.

Mari kita telusuri contoh dari penggunaan `nodeSelector`.

### Langkah Nol: Prasyarat

Contoh ini mengasumsikan bahwa kamu memiliki pemahaman dasar tentang pod Kubernetes dan kamu telah [membuat klaster Kubernetes](https://github.com/kubernetes/kubernetes#documentation).

### Langkah Satu: Menyematkan label pada node

Jalankan `kubectl get nodes` untuk mendapatkan nama dari node-node yang ada dalam klaster kamu. Temukan node yang akan kamu tambahkan label, kemudian jalankan perintah `kubectl label nodes <node-name> <label-key>=<label-value>` untuk menambahkan label pada node yang telah kamu pilih. Sebagai contoh, jika nama node yang saya pilih adalah 'kubernetes-foo-node-1.c.a-robinson.internal' dan label yang ingin saya tambahkan adalah 'disktype=ssd', maka saya dapat menjalankan `kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`.

Jika terjadi kegagalan dengan kesalahan perintah yang tidak _valid_ ("_invalid command_"), kemungkinan besar kamu menggunakan kubectl dengan versi lebih lama yang tidak memiliki perintah `label`. Dalam hal ini, lihat [versi sebelumnya] (https://github.com/kubernetes/kubernetes/blob/a053dbc313572ed60d89dae9821ecab8bfd676dc/examples/node-selection/README.md) dari petunjuk ini untuk instruksi tentang cara menetapkan label pada node.

Kamu dapat memastikan perintah telah berhasil dengan menjalankan ulang perintah `kubectl get nodes --show-labels` and memeriksa bahwa node yang dipilih sekarang sudah memiliki label yang ditambahkan. Kamu juga dapat menggunakan `kubectl describe node "nodename"` untuk melihat daftar lengkap label yang dimiliki sebuah node.

### Langkah Dua: Menambahkan sebuah nodeSelector ke konfigurasi pod kamu

Ambil berkas konfigurasi pod manapun yang akan kamu jalankan, dan tambahkan sebuah bagian `nodeSelector` pada berkas tersebut, seperti berikut. Sebagai contoh, jika berikut ini adalah konfigurasi pod saya:

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
```

Kemudian tambahkan sebuah `nodeSelector` seperti berikut:

{{% codenew file="pods/pod-nginx.yaml" %}}

Ketika kamu menjalankan perintah `kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml`, pod tersebut akan dijadwalkan pada node yang memiliki label yang dirinci. Kamu dapat memastikan penambahan nodeSelector berhasil dengan menjalankan `kubectl get pods -o wide` dan melihat "NODE" tempat Pod ditugaskan.

## Selingan: label node _built-in_

Sebagai tambahan dari label yang kamu [sematkan](#step-one-attach-label-to-the-node), node sudah terisi dengan satu set label standar. Pada Kubernetes v1.4 label tersebut adalah

* `kubernetes.io/hostname`
* `failure-domain.beta.kubernetes.io/zone`
* `failure-domain.beta.kubernetes.io/region`
* `beta.kubernetes.io/instance-type`
* `kubernetes.io/os`
* `kubernetes.io/arch`

{{< note >}}
Nilai dari label-label tersebut spesifik untuk setiap penyedia layanan _cloud_ dan tidak dijamin reliabilitasnya.
Contohnya, nilai dari `kubernetes.io/hostname` bisa saja sama dengan nama node pada beberapa lingkungan dan berbeda pada lingkungan lain.
{{< /note >}}

## Isolasi/pembatasan Node

Menambahkan label pada objek node memungkinkan penargetan pod pada node atau grup node yang spesifik. Penambahan label ini dapat digunakan untuk memastikan pod yang spesifik hanya berjalan pada node dengan isolasi, keamanan, atau pengaturan tertentu. Saat menggunakan label untuk tujuan tersebut, memilih kunci label yang tidak bisa dimodifikasi oleh proses kubelet pada node sangat direkomendasikan. Hal ini mencegah node yang telah diubah untuk menggunakan kredensial kubelet-nya untuk mengatur label-label pada objek nodenya sediri, dan mempengaruhi scheduler untuk menjadwalkan _workload_ ke node yang telah diubah tersebut.

_Plugin_ penerimaan `NodeRestriction` mencegah kubeletes untuk megatur atau mengubah label dengan awalan `node-restriction.kubernetes.io/`.
Untuk memanfaatkan awalan label untuk isolasi node:

1. Pastikan kamu menggunakan [_authorizer_ node](/docs/reference/access-authn-authz/node/) dan mengaktifkan [_plugin admission NodeRestriction_(/docs/reference/access-authn-authz/admission-controllers/#noderestriction).

2. Tambah label dengan awalan `node-restriction.kubernetes.io/` ke objek node kamu, dan gunakan label tersebut pada node _selector_ kamu. Contohnya, `example.com.node-restriction.kubernetes.io/fips=true` or `example.com.node-restriction.kubernetes.io/pci-dss=true`.

## Afinitas dan anti-afinitas

`_Field_ nodeSelector` menyediakan cara yang sangat sederhana untuk membatasi pod ke node dengan label-label tertentu. Fitur afinitas/anti-afinitas saat ini bersifat beta dan memperluas tipe pembatasan yang dapat kamu nyatakan. Peningkatan kunci dari fitur ini adalah

1. Bahasa yang lebih ekspresif (tidak hanya "AND of exact match")
2. Kamu dapat memberikan indikasi bahwa aturan yang dinyatakan bersifat rendah/preferensi dibanding dengan persyaratan mutlak sehingga jika scheduler tidak dapat memenuhinya, pod tetap akan dijadwalkan
3. Kamu dapat membatasi dengan label pada pod-pod lain yang berjalan pada node (atau domain _topological_ lain), daripada  dengan label pada node itu sendiri, yang memungkinkan pengaturan tentang pod yang dapat dan tidak dapat dilokasikan bersama.

Fitur afinitas terdiri dari dua tipe afinitas yaitu "node afinitas" dan "inter-pod afinitas/anti-afinitas"
Node afinitas adalah seperti `nodeSelector` yang telah ada (tetapi dengam dua kelebihan pertama yang terdaftar di atas), sementara inter-pod afinitas/anti-afinitas membatasi pada label pod daripada label node, seperti yang dijelaskan pada item ketiga pada daftar di atas, sebagai tambahan dari item pertama dan kedua.

_Field_ `nodeSelector` tetap berjalan seperti biasa, namun pada akhirnya akan ditinggalkan karena afinitas node dapat menyatakan semua yang `nodeSelector` dapat nyatakan.

### Afinitas node (fitur beta)

Afinitas node diperkenalkan sebagai fitur alfa pada Kubernetes 1.2.
Afinitas node secara konseptual mirip dengan `nodeSelector` yang memungkinkan kamu untuk membatasi node yang memenuhi syarat untuk penjadwalan pod, berdasarkan label pada node.

Saat ini ada dia tipe afinitas node, yaitu `requiredDuringSchedulingIgnoredDuringExecution` dan
`preferredDuringSchedulingIgnoredDuringExecution`. Kamu dapat menganggap dua tipe ini sebagai "kuat" dan "lemah" secara berurutan, dalam arti tipe pertama menyatakan peraturan yang *harus* dipenuhi agar pod dapat dijadwalkan pada node (sama seperti `nodeSelector` tetapi menggunakan sintaksis yang lebih ekpresif), sementara tipe kedua menyatakan *preferensi* yang akan dicoba dilaksanakan tetapi tidak akan dijamin oleh scheduler. Bagian "IgnoredDuringExecution" dari nama tipe ini berarti, mirip dengan cara kerja `nodeSelector`, jika label pada node berubah pada _runtime_ yang menyebabkan aturan afinitas pada pod tidak lagi terpenuhi, pod akan tetap berjalan pada node. Pada masa yang akan datang kami berencana menawarkan `requiredDuringSchedulingRequiredDuringExecution` yang akan berjalan seperti `requiredDuringSchedulingIgnoredDuringExecution` hanya saja tipe ini akan mengeluarkan pod dari node yang gagal untuk memenuhi persyaratan afinitas node pod.

Dengan denikian, contoh dari `requiredDuringSchedulingIgnoredDuringExecution` adalah "hanya jalankan pod pada node dengan Intel CPU" dan contoh dari `preferredDuringSchedulingIgnoredDuringExecution` adalah "coba jalankan set pod ini dalam zona ketersediaan XYZ, tetapi jika tidak memungkinkan, maka biarkan beberapa pod berjalan di tempat lain".

Afinitas node dinyatakan sebagai _field_ `nodeAffinity` dari _field_ `affinity` pada PodSpec.

Berikut ini contoh dari pod yang menggunakan afinitas node:

{{% codenew file="pods/pod-with-node-affinity.yaml" %}}

Aturan afinitas node tersebut menyatakan pod hanya bisa ditugaskan pada node dengan label yang memiliki kunci `kubernetes.io/e2e-az-name` dan bernilai `e2e-az1` atau `e2e-az2`. Selain itu, dari semua node yang memenuhi kriteria tersebut, mode dengan label dengan kunci `another-node-label-key` and bernilai `another-node-label-value` harus lebih diutamakan.

Kamu dapat meilhat operator `In` digunakan dalam contoh berikut. Sitaksis afinitas node yang baru mendukung operator-operator berikut: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`. Kamu dapat menggunakan `NotIn` dan `DoesNotExist` untuk mewujudkan perilaku node anti-afinitas, atau menggunakan [node taints](/id/docs/concepts/scheduling-eviction/taint-and-toleration/) untuk menolak pod dari node tertentu.

Jika kamu menyatakan `nodeSelector` dan `nodeAffinity`. *keduanya* harus dipenuhi agar pod dapat dijadwalkan pada node kandidat.

Jika kamu menyatakan beberapa `nodeSelectorTerms` yang terkait dengan tipe `nodeAffinity`, maka pod akan dijadwalkan pada node **jika salah satu** dari `nodeSelectorTerms` dapat terpenuhi.

Jika kamu menyatakan beberapa `matchExpressions` yang terkait dengan `nodeSelectorTerms`, makan pod dapat dijadwalkan pada node **hanya jika semua** `matchExpressions` dapat terpenuhi.

Jika kamu menghapus atau mengubah label pada node tempat pod dijadwalkan, pod tidak akan dihapus. Dengan kata lain, pemilihan afinitas hanya bekerja pada saat waktu penjadwalan pod.

_Field_ `weight` pada `preferredDuringSchedulingIgnoredDuringExecution` berada pada rentang nilai 1-100. Untuk setiap node yang memenuhi semua persyaratan penjadwalan (permintaan sumber daya, pernyataan afinitas RequiredDuringScheduling, dll.), _scheduler_ akan menghitung nilai jumlah dengan melakukan iterasi pada elemen-elemen dari _field_ ini dan menambah "bobot" pada jumlah jika node cocok dengan MatchExpressions yang sesuai. Nilai ini kemudian digabungkan dengan nilai dari fungsi prioritas lain untuk node. Node dengan nilai tertinggi adalah node lebih diutamakan.

Untuk informasi lebih lanjut tentang afinitas node kamu dapat melihat [design doc](https://git.k8s.io/community/contributors/design-proposals/scheduling/nodeaffinity.md).


### Afinitas and anti-afinitas antar pod (fitur beta)

Afinitas and anti-afinitas antar pod diperkenalkan pada Kubernetes 1.4. Afinitas and anti-afinitas antar pod memungkinkan kamu untuk membatasi node yang memenuhi syarat untuk penjadwalan pod *berdasarkan label-label pada pod yang sudah berjalan pada node* daripada berdasarkan label-label pada node. Aturan tersebut berbentuk  "pod ini harus (atau, dalam kasus
anti-afinitas, tidak boleh) berjalan dalam X jika X itu sudah menjalankan satu atau lebih pod yang memenuhi aturan Y". Y dinyatakan sebagai sebuah LabelSelector dengan daftar namespace terkait; tidak seperti node, karena pod are namespaced (maka dari itu label-label pada pod diberi namespace secara implisit), sebuah label selector di atas label-label pod harus menentukan namespace yang akan diterapkan selector. Secara konsep X adalah domain topologi seperti node, rack, zona penyedia cloud, daerah penyedia cloud, dll. Kamu dapat menyatakannya menggunakan `topologyKey`  yang merupakan kunci untuk label node yang digunakan sistem untuk menunjukkan domain topologi tersebut, contohnya lihat kunci label yang terdaftar di atas pada bagian [Selingan: label node built-in](#interlude-built-in-node-labels).

{{< note >}}
Afinitas and anti-afinitas antar pod membutuhkan jumlah pemrosesan yang substansial yang dapat memperlambat penjadwalan pada klaster berukuran besar secara signifikan. Kami tidak merekomendasikan penggunaan mereka pada klaster yang berukuran lebih besar dari beberapa ratus node.
{{< /note >}}

{{< note >}}
Anti-afinitas pod mengharuskan node untuk diberi label secara konsisten, misalnya setiap node dalam klaster harus memiliki label sesuai yang cocok dengan `topologyKey`. Jika sebagian atau semua node tidak memiliki label `topologyKey` yang dinyatakan, hal ini dapat menyebabkan perilaku yang tidak diinginkan.
{{< /note >}}

Seperti afinitas node, ada dua tipe afinitas dan anti-afinitas pod, yaitu `requiredDuringSchedulingIgnoredDuringExecution` dan
`preferredDuringSchedulingIgnoredDuringExecution` yang menunjukan persyaratan "kuat" vs. "lemah". Lihat deskripsi pada bagian afinitas node sebelumnya.
Sebuah contoh dari afinitas `requiredDuringSchedulingIgnoredDuringExecution` adalah "Tempatkan bersamaan pod layanan A dan layanan B di zona yang sama, karena mereka banyak berkomunikasi satu sama lain"
dan contoh `preferDuringSchedulingIgnoredDuringExecution` anti-afinitas akan menjadi "sebarkan pod dari layanan ini di seluruh zona" (persyaratan kuat tidak masuk akal, karena kamu mungkin memiliki lebih banyak pod daripada zona).

Afinitas antar pod dinyatakan sebagai _field_ `podAffinity` dari _field_ `affinity` pada PodSpec dan anti-afinitas antar pod dinyatakan sebagai _field_ `podAntiAffinity` dari _field_ `affinity` pada PodSpec.

#### Contoh pod yang menggunakan pod affinity:

{{% codenew file="pods/pod-with-pod-affinity.yaml" %}}

Afinitas pada pod tersebut menetapkan sebuah aturan afinitas pod dan aturan anti-afinitas pod. Pada contoh ini, `podAffinity` adalah `requiredDuringSchedulingIgnoredDuringExecution`
sementara `podAntiAffinity` adalah `preferredDuringSchedulingIgnoredDuringExecution`. Aturan afinitas pod menyatakan bahwa pod dapat dijadwalkan pada node hanya jika node tersebut berada pada zona yang sama dengan minimal satu pod yang sudah berjalan yang memiliki label dengan kunci "security" dan bernilai "S1". (Lebih detail, pod dapat berjalan pada node N jika node N memiliki label dengan kunci `failure-domain.beta.kubernetes.io/zone`dan nilai V sehingga ada minimal satu node dalam klaster dengan kunci `failure-domain.beta.kubernetes.io/zone` dan bernilai V yang menjalankan pod yang memiliki label dengan kunci "security" dan bernilai "S1".) Aturan anti-afinitas pod menyatakan bahwa pod memilih untuk tidak dijadwalkan pada sebuah node jika node tersebut sudah menjalankan pod yang memiliki label dengan kunci "security" dan bernilai "S2". (Jika `topologyKey` adalah `failure-domain.beta.kubernetes.io/zone` maka dapat diartikan bahwa pod tidak dapat dijadwalkan pada node jika node berada pada zona yang sama dengan pod yang memiliki label dengan kunci "security" dan bernilai "S2".) Lihat [design doc](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md) untuk lebih banyak contoh afinitas dan anti-afinitas pod, baik `requiredDuringSchedulingIgnoredDuringExecution`
maupun `preferredDuringSchedulingIgnoredDuringExecution`.

Operator yang sah untuk afinitas dan anti-afinitas pod adalah `In`, `NotIn`, `Exists`, `DoesNotExist`.

Pada dasarnya, `topologyKey` dapat berupa label-kunci apapun yang sah. Namun, untuk alasan performa dan keamanan, ada beberapa batasan untuk `topologyKey`:

1. Untuk afinitas and anti-afinitas pod `requiredDuringSchedulingIgnoredDuringExecution`, `topologyKey` tidak boleh kosong.
2. Untuk anti-afinitas pod `requiredDuringSchedulingIgnoredDuringExecution`, pengontrol penerimaan `LimitPodHardAntiAffinityTopology` diperkenalkan untuk membatasi `topologyKey` pada `kubernetes.io/hostname`. Jika kamu menginginkan untuk membuatnya tersedia untuk topologi khusus, kamu dapat memodifikasi pengontrol penerimaan, atau cukup menonaktifkannya saja.
3. Untuk anti-afinitas pod `preferredDuringSchedulingIgnoredDuringExecution`, `topologyKey` yang kosong diinterpretasikan sebagai "semua topologi" ("semua topologi" sekarang dibatasi pada kombinasi dari `kubernetes.io/hostname`, `failure-domain.beta.kubernetes.io/zone` dan `failure-domain.beta.kubernetes.io/region`).
4. Kecuali untuk kasus-kasus di atas, `topologyKey` dapat berupa label-kunci apapun yang sah.

Sebagai tambahan untuk `labelSelector` and `topologyKey`, kamu secara opsional dapat menyatakan daftar `namespaces` dari namespaces yang akan digunakan untuk mencocokan `labelSelector` (daftar ini berjalan pada level definisi yang sama dengan `labelSelector` dan `topologyKey`)

Jika dihilangkan atau kosong, daftar ini sesuai standar akan merujuk pada _namespace_ dari pod tempat definisi afinitas/anti-afinitas dinyatakan.

Semua `matchExpressions` berkaitan dengan afinitas and anti-afinitas `requiredDuringSchedulingIgnoredDuringExecution` harus dipenuhi agar pod dapat dijadwalkan pada node.

#### Penggunaan yang lebih praktikal

Afinitas and anti-afinitas antar pod dapat menjadi lebih berguna saat digunakan bersamaan dengan koleksi dengan level yang lebih tinggi seperti ReplicaSets, StatefulSets, Deployments, dll. Pengguna dapat dengan mudah mengkonfigurasi bahwa satu set workload harus
ditempatkan bersama dalam topologi yang didefinisikan sama, misalnya, node yang sama.

##### Selalu ditempatkan bersamaan pada node yang sama

Dalam klaster berisi 3 node, sebuah aplikasi web memiliki in-memory cache seperti redis. Kita menginginkan agar  _web-server_ dari aplikasi ini sebisa mungkin ditempatkan bersamaan dengan cache.

Berikut ini kutipan yaml dari deployment redis sederhana dengan 3 replika dan label selector `app=store`, Deployment memiliki konfigurasi `PodAntiAffinity` untuk memastikan _scheduler_ tidak menempatkan replika bersamaan pada satu node.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

Kutipan yaml dari deployment webserver berikut ini memiliki konfigurasi `podAntiAffinity` dan `podAffinity`. Konfigurasi ini menginformasikan scheduler bahwa semua replika harus ditempatkan bersamaan dengan pod yang memiliki label selector `app=store`. Konfigurasi ini juga memastikan bahwa setiap replika webserver tidak ditempatkan bersamaan pada satu node.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.12-alpine
```

Jika kita membuat kedua dployment di atas, klaster berisi 3 node kita seharusnya menjadi seperti berikut.

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |


st
Seperti yang kamu lihat, semua 3 replika dari `web-server` secara otomatis ditempatkan bersama dengan cache seperti yang diharapkan.

```
$ kubectl get pods -o wide
NAME                           READY     STATUS    RESTARTS   AGE       IP           NODE
redis-cache-1450370735-6dzlj   1/1       Running   0          8m        10.192.4.2   kube-node-3
redis-cache-1450370735-j2j96   1/1       Running   0          8m        10.192.2.2   kube-node-1
redis-cache-1450370735-z73mh   1/1       Running   0          8m        10.192.3.1   kube-node-2
web-server-1287567482-5d4dz    1/1       Running   0          7m        10.192.2.3   kube-node-1
web-server-1287567482-6f7v5    1/1       Running   0          7m        10.192.4.3   kube-node-3
web-server-1287567482-s330j    1/1       Running   0          7m        10.192.3.2   kube-node-2
```

##### Tidak akan pernah ditempatkan bersamaan dalam node yang sama


Contoh di atas menggunakan aturan `PodAntiAffinity` dengan `topologyKey: "kubernetes.io/hostname"` untuk melakukan deploy klaster redis sehingga tidak ada dua instance terletak pada hos yang sama.
Lihat [tutorial ZooKeeper](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)  untuk contoh dari konfigurasi StatefulSet dengan anti-afinitas untuk ketersediaan tinggi, menggunakan teknik yang sama.

Untuk informasi lebih lanjut tentang afinitas/anti-afinitas antar pod, lihat [design doc](https://git.k8s.io/community/contributors/design-proposals/scheduling/podaffinity.md).

Kamu juga dapat mengecek [Taints](/id/docs/concepts/scheduling-eviction/taint-and-toleration/), yang memungkinkan sebuah *node* untuk *menolak* sekumpulan pod.

## nodeName

`nodeName` adalah bentuk paling sederhana dari pembatasan pemilihan node, tetapi karena
keterbatasannya biasanya tidak digunakan. `nodeName` adalah sebuah _field_ dari
PodSpec. Jika tidak kosong, scheduler mengabaikan pod dan
kubelet yang berjalan pada node tersebut yang mencoba menjalankan pod.  Maka, jika
`nodeName` disediakan dalam PodSpec, ia memiliki hak yang lebih tinggi dibanding metode-metode di atas untuk pemilihan node.

Beberapa keterbatasan dari penggunaan `nodeName` untuk memilih node adalah:

-   Jika node yang disebut tidak ada, maka pod tidak akan dijalankan, dan dalam beberapa kasus akan
    dihapus secara otomatis.
-   Jika node yang disebut tidak memiliki resource yang cukup untuk mengakomodasi pod, pod akan gagal
    dan alasannya akan mengindikasikan sebab kegagalan, misalnya OutOfmemory atau OutOfcpu.
-   Nama node pada lingkungan cloud tidak selalu dapat diprediksi atau stabil.

Berikut ini contoh konfigurasi pod menggunakan _field_ `nodeName`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```
Pod di atas akan berjalan pada node kube-01.



## {{% heading "whatsnext" %}}



