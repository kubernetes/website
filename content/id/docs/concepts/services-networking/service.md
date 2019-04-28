---
title: Services
feature:
  title: Service discovery and load balancing
  description: >
    Kamu tidak perlu memodifikasi aplikasi kamu untuk menggunakan mekanisme `service discovery` tambahan. Kubernetes menyediakan IP untuk setiap kontainer serta sebuah DNS bagi sebuah set kontainer, serta akan melakukan mekanisme `load balance` bagi set kontainer tersebut. 

content_template: templates/concept
weight: 10
---


{{% capture overview %}}

[`Pod`](/docs/concepts/workloads/pods/pod/) pada Kubernetes bersifat *mortal*. 
Artinya apabila `pod-pod` tersebut dibuat dan kemudian mati, `pod-pod` tersebut 
tidak akan dihidupkan kembali. [`ReplicaSets`](/docs/concepts/workloads/controllers/replicaset/) secara 
khusus bertugas membuat dan menghapus `Pod` secara dinamsi (misalnya, pada proses *scaling out* atau *scaling in*).  
Meskipun setiap `Pod` memiliki alamat IP-nya masing-masing, kamu tidak dapat mengandalkan alamat IP 
yang diberikan pada `pod-pod` tersebut, karea alamat IP yang diberikan tidak stabil. 
Hal ini kemudian menimbulkan pertanyaan baru: apabila sebuah set `Pod` (yang selanjutnya kita sebut `backend`)
menyediakan `service` bagi sebuah set `Pod` lain (yang selanjutnya kita sebut `frontend`) di dalam 
kluster Kubernetes, bagaimana cara `frontend` menemukan `backends` mana yang digunakan?

Mulai `Services`.

Sebuah `Service` pada Kubernetes adalah sebuah abstraksi yang memberikan definisi 
set logis yang terdiri beberapa `Pod` serta `policy` bagaimana cara kamu mengakses set `Pod` tadi - seringkali disebut sebagai `microservices`.
Set `Pod` yang dirujuk oleh suatu `Service` (biasanya) ditentukan oleh sebuah [`Label Selector`](/docs/concepts/overview/working-with-objects/labels/#label-selectors) 
(lihat penjelasan di bawah untuk mengetahui alasan kenapa kamu mungkin saja membutuhkan `Service` tanpa 
sebuah `selector`).

Sebagai contoh, misalnya terdapat sebuah `backend` yang menyediakan fungsionalitas `image-processing` 
yang memiliki 3 buah `replica`. `Replica-replica` tadi sifatnya sepadan - dengan kata lain `frontend`
tidak peduli `backend` manakah yang digunakan. Meskipun `Pod` penyusun set `backend` bisa berubah, 
`frontend` tidak perlu peduli bagaimana proses ini dijalankan atau menyimpan `list` dari `backend-backend` 
yang ada saat itu. `Service` memiliki tujuan untuk `decouple` mekanisme ini.

Untuk aplikasi yang dijalankan di atas Kubernetes, Kubernetes menyediakan API `endpoint` sederhana 
yang terus diubah apabila `state` sebuah set `Pod` di dalam suatu `Service` berubah. Untuk 
aplikasi `non-native`, Kubernetes menyediakan `bridge` yang berbasis `virtual-IP` bagi `Service` 
yang diarahkan pada `Pod` `backend`.

{{% /capture %}}

{{% capture body %}}

## Mendefinisikan sebuah `Service`

Sebuah `Service` di Kubernetes adalah sebuah objek REST, layak sebuah `Pod`. Seperti semua 
objek `REST`, definisi `Service` dapat dikirim dengan `method POST` pada `apiserver` untuk membuat 
sebuah instans baru. Sebagai contoh, misalnya saja kamu memiliki satu set `Pod` yang mengekspos `port` 
9376 dan memiliki `label` `"app=MyApp"`.

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

Spefisikasi ini akan ditranslasikan sebagai sebuah objek `Service` baru dengan nama `"my-service"` 
dengan `target port` 9376 pada setiap `Pod` yang memiliki `label` `"app=MyApp"`. `Service` ini 
juga akan memiliki alamat IP tersendiri (yang terkadang disebut sebagai `"cluster IP"`), yang nantinya 
akan digunakan oleh `service proxy` (lihat di bagian bawah). `Selector` pada `Service` akan selalu dievaluasi 
dan hasilnya akan kembali dikirim dengan menggunakan `method POST` ke objek `Endpoints` 
yang juga disebut `"my-service"`.

Perhatikan bahwa sebuah `Service` dapat melakukan pemetaan setiap `incoming port` pada `targetPort` 
mana pun. Secara `default`, `field` `targetPort` akan memiliki `value` yang sama dengan `value` dari `field` `port`.
Hal menarik lainnya adalah `value` dari `targetPort` bisa saja berupa string yang merujuk pada nama 
dari `port` yang didefinisikan pada `Pod` `backend`. Nomor `port` yang diberikan pada `port` dengan nama 
tadi bisa saja memiliki nilai yang berbeda di setiap `Pod` `backend`. Hal ini memberikan fleksibilitas 
pada saat kamu melakukan `deploy` atau melakukan perubahan terhadap `Service`. Misalnya saja suatu saat 
kamu ingin mengubah nomor `port` yang ada pada `Pod` `backend` pada rilis selanjutnya tanpa menyebabkan 
permasalahan pada sisi klien.

Secara `default` protokol yang digunakan pada `service` adalah `TCP`, tapi kamu bisa saja menggunakan 
[protokol yang didukung](#protokol-yang-didukung). Karena banyak `Service` memiliki kebutuhan untuk 
mengekspos lebih dari sebuah `port`, Kuberneyes menawarkan definisi `multiple` `port` pada sebuah objek 
`Service`. Setiap definisi `port` dapat memiliki protokol yang berbeda. 

### `Service` tanpa `selector`

Secara umum, `Service` memberikan abstraksi mekanisme yang dilakukan untuk mengakses `Pod`, tapi 
mereka juga melakukan abstraksi bagi `backend` lainnya. Misalnya saja:

  * Kamu ini memiliki sebuah basis data eksternal di `environment` `production` tapi pada tahap `test`, 
    kamu ingin menggunakan basis datamu sendiri. 
  * Kamu ingin merujuk `service` kamu pada `service` lainnya yang berada pada 
    [`Namespace`](/docs/concepts/overview/working-with-objects/namespaces/) yang berbeda atau bahkan kluster yang berbeda. 
  * Kamu melakukan migrasi `workloads` ke Kubernetes dan beberapa `backend` yang kamu miliki masih 
    berada di luar kluster Kubernetes. 

Berdasarkan skenario-skenario di atas, kamu dapat membuat sebuah `Service` tanpa `selector`:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
```

Karena `Service` ini tidak memiliki `selector`, objek `Endpoints` bagi `Service` ini tidak akan dibuat. 
Dengan demikian, kamu bisa membuat `Endpoints` yang kamu inginkan:

```yaml
kind: Endpoints
apiVersion: v1
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 1.2.3.4
    ports:
      - port: 9376
```

{{< note >}}
Perhatikan bahwa alamat IP yang kamu buat untuk `Endpoints` tidak boleh berupa 
`loopback` (127.0.0.0/8), `link-local` (169.254.0.0/16), atau `link-local multicast` (224.0.0.0/24). 
Alamat IP tersebut juga tidak boleh berupa `cluster IP` dari `Service` Kubernetes lainnya,
kare `kube-proxy` belum menyediakan dukungan IP virtual sebagai `destination`.
{{< /note >}}

Cara mengakses suatu `Service` tanpa `selector` sama saja dengan mengakses suatu `Service` 
dengan `selector`. Trafik yang ada akan di-*route* ke `Endpoints` yang dispesifikasikan oleh 
pengguna (dalam contoh kali ini adalah `1.2.3.4:9376`).

Sebuah `ExternalName` `Service` merupakan kasus spesial dari `Service` 
dimana `Service` tidak memiliki `selector` dan menggunakan penamaan `DNS`. Untuk 
informasi lebih lanjut silahkan baca bagian [ExternalName](#externalname).

## IP Virtual dan `proxy` `Service`

Setiap *node* di kluster Kubernetes menjalankan `kube-proxy`. `kube-proxy` 
bertanggung jawab terhadap implementasi IP virtual bagi `Services` dengan tipe 
selain [`ExternalName`](#externalname).

Pada Kubernetes versi v1.0, `Services` adalah `"layer 4" (TCP/UDP pada IP)`, `proxy` 
yang digunakan murni berada pada `userspace`. Pada Kubernetes v1.1, API `Ingress` 
ditambahkan untuk merepresentasikan `"layer 7"(HTTP)`, `proxy` `iptables` juga ditambahkan 
dan menjadi mode operasi `default` sejak Kubernetes v1.2. Pada Kubernetes v1.8.0-beta.0,
`proxy` `ipvs` juga ditambahkan.

### Mode `Proxy`: `userspace`

Pada mode ini, `kube-proxy` mengamati master Kubernetes apabila terjadi penambahan 
atau penghapusan objek `Service` dan `Endpoints`. Untuk setiap `Service`, `kube-proxy` 
akan membuka sebuah `port` (yang dipilih secara random) pada *node* lokal. Koneksi 
pada `"proxy port"` ini akan dihubungkan pada salah satu `Pod` `backend` dari `Service` 
(yang tercatat pada `Endpoints`). `Pod` `backend` yang akan digunakan akan diputuskan berdasarkan 
`SessionAffinity` pada `Service`. Langkah terakhir yang dilakukan oleh `kube-proxy` 
adalah melakukan instalasi `rules` `iptables` yang akan mengarahkan trafik yang ada pada 
`clusterIP` (IP virtual) dan `port` dari `Service` serta melakukan `redirect` trafik ke `proxy` 
yang memproksikan `Pod` `backend`. Secara `default`, mekanisme `routing` yang dipakai adalah 
`round robin`.

![Ikhtisar diagram `Services` pada `proxy` `userspace`](/images/docs/services-userspace-overview.svg)

### Mode `Proxy`: iptables

Pada mode ini, `kube-proxy` mengamati master Kubernetes apabila terjadi penambahan 
atau penghapusan objek `Service` dan `Endpoints`. Untuk setiap `Service`, 
`kube-proxy` akan melakukan instalasi `rules` `iptables` yang akan mengarahkan
trafik ke `clusterIP` (IP virtual) dan `port` dari `Service`. Untuk setiap objek `Endpoints`, 
`kube-proxy` akan melakukan instalasi `rules` `iptables` yang akan memilih satu buah `Pod` 
`backend`. Secara `default`, pemilihan `backend` ini dilakukan secara random.

Tentu saja, `iptables` yang digunakan tidak boleh melakukan `switching` 
antara `userspace` dan `kernelspace`, mekanisme ini harus lebih kokoh dan lebih cepat 
dibandingkan dengan `userspace` `proxy`. Meskipun begitu, berbeda dengan mekanisme 
`proxy` `userspace`, `proxy` `iptables` tidak bisa secara langsung menjalankan mekanisme 
`retry` ke `Pod` lain apabila `Pod` yang sudah dipilih sebelumnya tidak memberikan respons, 
dengan kata lain hal ini akan sangat bergantung pada 
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#defining-readiness-probes).

![Ikhtisar diagram `Services` pada `proxy` `iptables`](/images/docs/services-iptables-overview.svg)

### Mode `Proxy`: ipvs

{{< feature-state for_k8s_version="v1.9" state="beta" >}}

Pada mode ini, `kube-proxy` mengamati `Services` dan `Endpoints`, kemudian memanggil 
`interface` `netlink` untuk membuat `rules` `ipvs` yang sesuai serta melakukan sinkronisasi 
`rules` `ipvs` dengan `Services` dan `Endpoints` Kubernetes secara periodik, untuk memastikan 
sattus `ipvs` konsisten dengan apa yang diharapkan. Ketika sebuah `Services` diakses, 
trafik yang ada akan diarahkan ke salah satu `Pod` `backend`.

Sama halnya dengan `iptables`, `ipvs` juga berdasarkan pada fungsi `hook` `netfilter`, 
bedanya adalah `ipvs` menggunakan struktur data `hash table` dan bekerja di `kernelspace`.
Dengan kata lain `ipvs` melakukan `redirect` trafik dengan lebih cepat dan dengan performa yang lebih 
baik ketika melakukan sinkronisasi `rules` `proxy`. Selain itu, `ipvs` juga menyediakan 
lebih banyak opsi algoritma `load balancing`:

- `rr`: round-robin
- `lc`: least connection
- `dh`: destination hashing
- `sh`: source hashing
- `sed`: shortest expected delay
- `nq`: never queue

{{< note >}}
Mode `ipvs` menggunakan `module` `IPVS` `kernel` yang diinstal pada *node* 
sebelum `kube-proxy` dijalankan. Ketika `kube-proxy` dijalankan dengan mode `proxy` `ipvs`, 
`kube-proxy` akan melakukan proses validasi, apakah `module` `IPVS` sudah diinstal di *node*, 
jika `module` tersebut belum diinstal, maka `kube-proxy` akan menggunakan mode `iptables`.
{{< /note >}}

![Ikhtisar diagram `Services` pada `proxy` `ipvs`](/images/docs/services-ipvs-overview.svg)

Dari sekian model `proxy` yang ada, trafik `inbound` apa pun yang ada diterima oleh `IP:Port` pada `Service` 
akan dilanjutkan melalui `proxy` pada `backend` yang sesuai, dan klien tidak perlu mengetahui 
apa informasi mendetail soal Kubernetes, `Service`, atau `Pod`. Afinitas `Session` berbasis 
`Client-IP` dapat dipilih dengan cara menerapkan nilai `"ClientIP"` pada `service.spec.sessionAffinity` 
(nilai `default` untuk hal ini adalah `"None"`), kamu juga dapat mengatur nilai maximum `session` 
`timeout` yang ada dengan mengatur opsi `service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` jika 
sebelumnya kamu sudah menerapkan nilai `"ClusterIP"` pada `service.spec.sessionAffinity` 
(nilai `default` untuk opsi ini adalah `"10800"`).

## `Multi-Port Services`

Banyak `Services` service dengan kebutuhan untuk mengekspos lebih dari satu `port`. 
Untuk kebutuhan inilah, Kubernetes mendukung `multiple` `port` `definitions` pada objek `Service`. 
Ketika menggunakan `multiple` `port`, kamu harus memberikan nama pada setiap `port` yang didefinisikan, 
sehingga `Endpoint` yang dibentuk tidak ambigu. Contoh:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 9376
  - name: https
    protocol: TCP
    port: 443
    targetPort: 9377
```

Perhatikan bahwa penamaan `port` hanya boleh terdiri dari karakter `lphanumeric` `lowercase` 
dan `-`, serta harus dimulai dan diakhiri dengan karakter `alphanumeric`, misalnya saja `123-abc` dan `web` 
merupakan penamaan yang valid, tapi `123_abc` dan `-web` bukan merupakan penamaan yang valid.

## Memilih sendiri alamt IP yang kamu inginkan

Kamu dapat memberikan spesifikasi alamat `cluster IP` yang kamu inginkan 
sebagai bagian dari `request` pembuatan objek `Service`. Untuk melakukan hal ini, 
kamu harus mengisi `fiels` `.spec.clusterIP` field. Contoh penggunaannya adalah sebagai berikut, 
misalnya saja kamu sudah memiliki `entry` DNS yang ingin kamu gunakan kembali, 
atau sebuah sistem `legacy` yang sudah diatur pada alamat IP spesifik 
dan sulit untuk diubah. Alamat IP yang ingin digunakan pengguna haruslah merupakan alamat IP 
yang valid dan berada di dalam `range` `CIDR` `service-cluster-ip-range` yang dispesifikasikan di dalam 
penanda yang diberikan `apiserver`. Jika `value` yang diberikan tidak valid, `apiserver` akan 
mengembalikan `response` `code` HTTP `422` yang mengindikasikan `value` yang diberikan tidak valid.

### Mengapa tidak menggunakan DNS `round-robin`?

Pertanyaan yang selalu muncul adalah kenapa kita menggunakan IP virtual dan bukan 
DNS `round-robin` standar? Terdapat beberapa alasan dibalik semua itu:

   * Terdapat sejarah panjang dimana `library` DNS tidak mengikuti `TTL` DNS dan 
     melakukan `caching` hasil dari `lookup` yang dilakukan.
   * Banyak aplikasi yang melakukan `lookup` DNS hanya sekali dan kemudian melakukan `cache` hasil yang diperoleh. 
   * Bahkan apabila aplikasi dan `library` melakukan resolusi ulang yang `proper`, `load` dari setiap 
     setiap klien yang melakukan resolusi ulang DNS akan sulit untuk di `manage`. 

Kami berusaha untuk mengurangi ketertarikan pengguna untuk melakukan yang mungkin akan menyusahkan pengguna. 
Dengan demikian, apabila terdapat justifikasi yang cukup kuat, kami mungkin saja memberikan implementasi 
alternatif yang ada.

## `Discovering services`

Kubernetes mendukung 2 buah mode primer untuk melakukan `Service` - variable `environment` dan DNS.

### `Environment variables`

Ketika sebuah `Pod` dijalankan pada *node*, `kubelet` menambahkan seperangkat variable `environment` 
untuk setiap `Service` yang aktif. `Environment` yang didukung adalah [Docker links compatible](https://docs.docker.com/userguide/dockerlinks/) variables (perhatikan 
[makeLinkVariables](http://releases.k8s.io/{{< param "githubbranch" >}}/pkg/kubelet/envvars/envvars.go#L49)) 
dan variable `{SVCNAME}_SERVICE_HOST` dan `{SVCNAME}_SERVICE_PORT`, dinama nama `Service` akan diubah 
menjadi huruf kapital dan `-` akan diubah menjadi `_`.

Sebagai contoh, `Service` `"redis-master"` yang mengekspos `port` TCP 6379 serta `alamat`
`cluster IP` `10.0.0.11` akan memiliki `environment` sebagai berikut:

```shell
REDIS_MASTER_SERVICE_HOST=10.0.0.11
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_PORT=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
REDIS_MASTER_PORT_6379_TCP_PORT=6379
REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

*Hal ini merupakan kebutuhan yang urutannya harus diperhatikan* - `Service` apa pun yang 
akan diakses oleh sebuah `Pod` harus dibuat sebelum `Pod` tersebut dibuat, 
jika tidak `environment` `variables` tidak akan diinisiasi. 
Meskipun begitu, DNS tidak memiliki keterbatasan ini.

### DNS

Salah satu [`add-on`](/docs/concepts/cluster-administration/addons/) opsional 
(meskipun sangat dianjurkan) adalah server DNS. Server DNS bertugas untuk mengamati apakah 
terdapat objek `Service` baru yang dibuat dan kemudian bertugas menyediakan DNS baru untuk 
`Service` tersebut. Jika DNS ini diaktifkan untuk seluruh kluster, maka semua `Pod` akan secara otomatis 
dapat melakukan resolusi DNS.

Sebagai contoh, apabila kamu memiliki sebuah `Service` dengan nama `"mys-service"` pada `Namespace` 
`"my-ns"`, maka `record` DNS `"my-service.my-ns"` akan dibuat. `Pod` yang berada di dalam 
`Namespace` `"my-ns"` dapat langsung melakukan `lookup` dengan hanya menggunakan 
For example, if you have a `Service` called `"my-service"` in a Kubernetes `"my-service"`. 
Sedangkan `Pod` yang berada di luar `Namespace` `my-ns"` harus menggunakan `"my-service.my-ns"`. 
Hasil dari resolusi ini men=rupakan `cluster IP`.

Kubernetes juga menyediakan `record` DNS SRV (service) untuk `named ports`.  Jika 
`Service` `"my-service.my-ns"` memiliki `port` dengan nama `"http"` dengan protokol `TCP`, 
kamu dapat melakukan `query` DNS SRV untuk `"_http._tcp.my-service.my-ns"` untuk mengetahui 
nomor `port` yang digunakan oleh `http`.

Server DNS Kubernetes adalah satu-satunya cara untuk mengakses 
`Service` dengan tipe `ExternalName`. Informasi lebih lanjut tersedia di 
[DNS `Pods` dan `Services`](/docs/concepts/services-networking/dns-pod-service/).

## `Service headless`

Terkadang kamu tidak membutuhkan mekanisme `load-balancing` dan sebuah `single` IP `Sevice`. 
Dalam kasus ini, kamu dapat membuat `"headless"` `Service` dengan cara memberikan spesifikasi 
`None` pada `cluster IP` (`.spec.clusterIP`).

Opsi ini memungkinkan pengguna mengurangi ketergantungan terhadap sistem Kubernetes 
dengan cara memeberikan kebebasan untuk mekanisme `service discovery`. Aplikasi akan 
tetap membutuhkan mekanisme `self-registration` dan `adapter service discovery` 
lain yang dapat digunakan berdasarkan API ini.

Untuk `Service` `"headless"` alokasi `cluster IP` tidak dilakukan dan `kube-proxy` 
tidak me-`manage` `Service-Service`, serta tidak terdapat mekanisme `load balancing` 
yang dilakukan. Bagaimana konfigurasi otomatis bagi DNS dilakukan bergantung pada 
apakah `Service` tersebut memiliki `selector` yang dispesifikasikan.

### Dengan `selector`

Untuk `Service` `"headless"` dengan `selector`, kontroler `Endpoints` akan membuat suatu 
`record` `Endpoints` di API, serta melakukan modifikasi konfigurasi DNS untuk mengembalikan 
`A records (alamat)` yang merujuk secara langsung pada `Pod` `backend`.

### Tanpa `selector`

Untuk `Service` `"headless"` tanpa  `selector`, kontroler `Endpoints` 
tidak akan membuat `record` `Enpoints`. Meskipun demikian, 
sistem DNS tetap melakukan konfigurasi salah satu dari:

  * `record` CNAME untuk [`ExternalName`](#externalname)-type services.
  * `record` untuk semua `Endpoints` yang memiliki nama `Service` yang sama, untuk 
    untuk tipe lainnya.

## Mekanisme `publish` `Service` - jenis-jenis `Service`

Untuk beberapa bagian dari aplikasi yang kamu miliki (misalnya saja, `frontend`), 
bisa saja kamu memiliki kebutuhan untuk mengekspos `Service` yang kamu miliki 
ke alamat IP exkternal (di luar kluster Kubernetes).

`ServiceTypes` yang ada pada Kubernetes memungkinkan kamu untuk menentukan 
jenis `Service` apakah yang kamu butuhkan. Secara `default` jenis `Service` 
yang diberikan adalah `ClusterIP`.

`Value` dan perilaku dari `Type` `Service` dijelaskan sebagai berikut:

   * `ClusterIP`: Mengekspos `Service` ke `range` alamat IP di dalam kluster. Apabila kamu memilih `value` ini 
     `Service` yang kamu miliki hanya dapat diakses secara internal. `Type` ini adalah 
     `default` `value` dari `ServiceType`.
   * [`NodePort`](#nodeport): Mengekspos `Service` pada setiap IP *node* pada `port` statis 
     (`NodePort`). Sebuah `Service` `ClusterIP`, yang mana `Service` `NodePort` akan di-`route`
     akan dibuat secara otomatis. Kamu dapat mengakses `Service` dengan tipe ini,
     dari luar kluster melalui `<NodeIP>:<NodePort>`.
   * [`LoadBalancer`](#loadbalancer): Mengekspos `Service` secara eksternal dengan menggunakan `LoadBalancer` 
     yang disediakan oleh penyedia layanan `cloud`. `Service` dengan `Type` `NodePort` dan `ClusterIP`, 
     dimana trafik akan di-`route`, akan dibuat secara otomatis.
   * [`ExternalName`](#externalname): Melakukan pemetaan `Service` ke konten 
      dari `field` `externalName` (misalnya: `foo.bar.example.com`), dengan cara mengembalikan 
      catatan `CNAME` beserta `value`-nya. Tidak ada metode `proxy` apa pun yang di aktifkan. Mekanisme ini 
      setidaknya membutuhkan `kube-dns` versi 1.7.

### Type NodePort {#nodeport}

Jika kamu menerapkan `value` `NodePort` pada `field` `type`, master Kubernetes akan mengalokasikan 
`port` dari `range` yang dispesifikasikan oleh penanda `--service-node-port-range` (secara `default`, 30000-32767) 
dan setiap `Node` akan memproksikan `port` tersebut (setiap `Node` akan memiliki nomor `port` yang sama) ke `Service` 
yang kamu miliki. `Port` tersebut akan dilaporkan pada `field` `.spec.ports[*].nodePort` di `Service` kamu.

Jika kamu ingin memberikan spesifikasi IP tertentu untuk melakukan `poxy` pada `port`. 
kamu dapat mengatur penanda `--nodeport-addresses` pada `kube-proxy` untuk `range` alamat IP 
tertentu (mekanisme ini didukung sejak v1.10). Sebuah daftar yang dipisahkan koma (misalnya, `10.0.0.0/8`, `1.2.3.4/32`) 
digunakan untuk mem-`filter` alamat IP lokal ke `node` ini. Misalnya saja kamu memulai `kube-proxy` dengan penanda 
`--nodeport-addresses=127.0.0.0/8`, maka `kube-proxy` hanya akan memilih `interface` `loopback` untuk `Service` dengan `Type` 
`NodePort`. Penanda `--nodeport-addresses` memiliki nilai `default` kosong (`[]`), yang artinya akan memilih semua `interface` yang ada 
dan sesuai dengan perilaku `NodePort` `default`.

Jika kamu menginginkan nomor `port` yang berbeda, kamu dapat memberikan spesifikasi 
`value` dari `field` `nodePort`, dan sistem yang ada akan mengalokasikan `port` tersebut untuk kamu, 
jika `port` tersebut belum digunakan (perhatikan bahwa jika kamu menggunakan teknik ini, kamu perlu 
mempertimbangkan `collision` yang mungkin terjadi dan bagaimana cara mengatasi hal tersebut)
atau transaksi API yang dilakukan akan gagal.

Hal ini memberikan kebebasan bagi pengembang untuk memilih `load balancer` yang akan digunakan, terutama apabila 
`load balancer` yang ingin digunakan belum didukung sepenuhnya oleh Kubernetes. 

Perhatikan bahwa `Service` dapat diakses baik dengan menggunakan `<NodeIP>:spec.ports[*].nodePort`
atau `.spec.clusterIP:spec.ports[*].port`. (Jika penanda `--nodeport-addresses` diterapkan, <NodeIP> dapat di-`filter` dengan NodeIP(s).)

### Type LoadBalancer {#loadbalancer}

Pada penyedia layanan `cloud` yang menyediakan pilihan `load balancer` eksternal, pengaturan `field` `type`
ke `LoadBalancer` akan secara otomatis melakukan proses `provision` `load balancer` untuk `Service` yang kamu buat. 
Informasi mengenai `load balancer` yang dibuat akan ditampilkan pada `field` `.status.loadBalancer` 
pada `Service` kamu. Contohnya:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
  clusterIP: 10.0.171.239
  loadBalancerIP: 78.11.24.19
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 146.148.47.155
```

Trafik dari `load balancer` eksternal akan diarahkan pada `Pod` `backend`, meskipun mekanisme 
bagaimana hal ini dilakukan bergantung pada penyedia layanan `cloud`. Beberapa penyedia layanan 
`cloue` mengizinkan konfigurasi untuk `value` `loadBalancerIP`. Dalam kasus tersebut, `load balancer` akan dibuat 
denga `loadbalancerIP` yang dispesifikasikan. Jika `value` dari `loadBalancerIP` tidak dispesifikasikan. 
sebuah IP sementara akan diberikan  pada `loadBalancer`. Jika `loadBalancerIP` dispesifikasikan, 
tetapi penyedia layanan `cloud` tidak mendukung hal ini, maka `field` yang ada akan diabaikan. 

**Catatan Khusus untuk Azure**: Untuk spesifikasi `loadBalancerIP` publik yang didefinisikan oleh pengguna, 
sebuah alamat IP statis publik akan disediakan terlebih daulu, dan alamat IP tersebut harus berada di 
`resource group` dari `resource` yang secara otomatis dibuat oleh kluster. Misalnya saja, `MC_myResourceGroup_myAKSCluster_eastus`. 
Berikan spesifikasi alamat IP sebagai `loadBalancerIP`. Pastikan kamu sudah melakukan `update` pada 
`securityGroupName` pada `file` konfigurasi penyedia layanan `cloud`. 
Untuk informasi lebih lanjut mengenai `permission` untuk `CreatingLoadBalancerFailed` kamu dapat membaca `troubleshooting` untuk 
[Penggunaan alamat IP statis pada `load balancer` Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/static-ip) atau 
[`CreatingLoadBalancerFailed` pada kluster AKS dengan `advanced networking`](https://github.com/Azure/AKS/issues/357).

{{< note >}}
Dukungan untuk SCTP `load balancer` dari penyedia layanan `cloud` bergantung pada 
implementasi `load balancer` yang disediakan oleh penyedia layanan `cloud` tersebut. 
Jika SCTP tidak didukung oleh `load balancer` penyedia layanan publik maka `request` pembuatan `Service` 
akan tetap diterima, meskipun proses pembuatan `load balancer` itu sendiri gagal.
{{< /note >}}

#### `Load balancer` internal
Di dalam `environment`, terkadang terdapat kebutuhan untuk melakukan `route` trafik antar 
`Service` yang berada di dalam satu VPC.

Di dalam `environment` `split-horizon DNS` kamu akan membutuhkan dua `service` yang mampu 
melakukan mekanisme `route` trafik eskternal maupun internal ke `endpoints` yang kamu miliki.

Hal ini dapat diraih dengan cara menambahkan anotasi berikut untuk `service` yang disediakan oleh 
penyedia layanan `cloud`.

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
Select one of the tabs.
{{% /tab %}}
{{% tab name="GCP" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        cloud.google.com/load-balancer-type: "Internal"
[...]
```
Gunakan `cloud.google.com/load-balancer-type: "internal"` untuk master dengan versi 1.7.0 to 1.7.3.
Untuk informasi lebih lanjut, dilahkan baca [dokumentasi](https://cloud.google.com/kubernetes-engine/docs/internal-load-balancing).
{{% /tab %}}
{{% tab name="AWS" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/aws-load-balancer-internal: 0.0.0.0/0
[...]
```
{{% /tab %}}
{{% tab name="Azure" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/azure-load-balancer-internal: "true"
[...]
```
{{% /tab %}}
{{% tab name="OpenStack" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/openstack-internal-load-balancer: "true"
[...]
```
{{% /tab %}}
{{% tab name="Baidu Cloud" %}}
```yaml
[...]
metadata:
    name: my-service
    annotations:
        service.beta.kubernetes.io/cce-load-balancer-internal-vpc: "true"
[...]
```
{{% /tab %}}
{{< /tabs >}}


#### Dukungan untuk SSL di AWS
Dukungan parsial untuk SSL bagi kluster yang dijalankan di AWS mulai diterapkan, 
mulai versi 1.3 terdapat 3 anotasi yang dapat ditambahkan pada `Service` dengan `Type` 
`LoadBalancer`:

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

Anotasi pertama memberikan spesifikasi ARN dari sertifikat yang akan digunakan. 
Sertifikat yang digunakan bisa saja berasal dari `third party` yang diunggah ke IAM atau 
sertifikat yang dibuat secara langsung dengan menggunakan sertifikat manajer AWS.

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

Anotasi kedua memberikan spesifikasi bagi protokol yang digunakan oleh `Pod` untuk saling berkomunikasi.
Untuk HTTPS dan SSL, ELB membutuhkan `Pod` untuk melakukan autentikasi terhadap dirinya sendiri melalui 
koneksi yang di-`encrypt`.

Protokol HTTP dan HTTPS akan memilih mekanisme `proxy` di tingkatan ke-7: 
ELB akan melakukan termisasi koneksi dengan pengguna, melakukan proses `parsing` `headers`, serta 
memasukkan `value` bagi `header` `X-Forwarded-For` dengan alamat IP pengguna (`Pod` hanya dapat melihat 
alamat IP dari ELB pada akhir koneksi yang diberikan) ketika melakukan `forwarding` suatu `request`.
 
Protokol TCP dan SSL akan memilih mekanisme `proxy` pada tingkatan 4: ELB akan melakukan `forwarding` trafik 
tanpa melakukan modifikasi `headers`.

Pada `environment` campuran dimana beberapa `port` diamankan sementara `port` lainnya dalam kondisi tidak dienkripsi, 
anotasi-anotasi berikut dapat digunakan:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
```

Pada contoh diatas, jika `Service` memiliki 3 buah `port`, yaitu: `80`, `443`, dan 
`8443`, maka `443` adan `8443` akan menggunakan sertifikat SSL, tetapi `80` hanya akan 
di-`porxy` menggunakan protokol HTTP.

Mulai versi 1.9, `Service` juga dapat menggunakan [`predefined` `policy`](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html)
untuk HTTPS atau `listener` SSL. Untuk melihat `policy` apa saja yang dapat digunakan, kamu dapat menjalankan perintah `awscli`:

```bash
aws elb describe-load-balancer-policies --query 'PolicyDescriptions[].PolicyName'
```

`Policy` ini kemudian dapat dispesifikasikan menggunakan anotasi 
"`service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`", contohnya:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: "ELBSecurityPolicy-TLS-1-2-2017-01"
```

#### PROXY protocol support on AWS

Untuk mengaktifkan dukungan [protokol PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)
untuk kluster yang dijalankan di AWS, kamu dapat menggunakan anotasi di bawah ini:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
```

Sejak versi 1.3.0, penggunaan anotasi berlaku untuk semua `port` yang di-`proxy` oleh ELB 
dan tidak dapat diatur sebaliknya.

#### Akses `Log` ELB pada AWS

Terdapat beberapa anotasi yang digunakan untuk melakukan manajemen 
akses `log` untuk ELB pada AWS.

Anotasi `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`
mengatur akses `log` mana sajakah yang diaktifkan.

Anotasi `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`
mengatur interval (dalam menit) publikasi akses `log`. Kamu dapat memberikan spesifikasi interval 
diantara `range` 5-60 menit.

Anotasi `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`
mengatur nama `bucket` Amazon S3 dimana akses `log` `load balancer` disimpan.

Anotasi `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`
memberikan spesifikasi hirarki logis yang kamu buat untuk `bucket` Amazon S3 yang kamu buat.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "true"
        # Specifies whether access logs are enabled for the load balancer
        service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "60"
        # The interval for publishing the access logs. You can specify an interval of either 5 or 60 (minutes).
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name: "my-bucket"
        # The name of the Amazon S3 bucket where the access logs are stored
        service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix: "my-bucket-prefix/prod"
        # The logical hierarchy you created for your Amazon S3 bucket, for example `my-bucket-prefix/prod`
```

#### Mekanisme `Draining` Koneksi pada AWS

Mekanisme `draining` untuk ELB klasik dapat dilakukan dengan menggunakan anotasi 
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled` serta mengatur 
`value`-nya menjadi `"true"`. Anotasi 
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout` juga
dapat digunakan untuk mengatur `maximum time` (dalam detik), untuk menjaga koneksi yang ada 
agar selalu terbuka sebelum melakukan `deregistering` `instance`.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "true"
        service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"
```

#### Anotasi ELB lainnya

Terdapat beberapa anotasi lain yang dapat digunakan untuk mengatur ELB klasik 
sebagaimana dijelaskan seperti di bawah ini:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"
        # The time, in seconds, that the connection is allowed to be idle (no data has been sent over the connection) before it is closed by the load balancer

        service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
        # Specifies whether cross-zone load balancing is enabled for the load balancer

        service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "environment=prod,owner=devops"
        # A comma-separated list of key-value pairs which will be recorded as
        # additional tags in the ELB.

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: ""
        # The number of successive successful health checks required for a backend to
        # be considered healthy for traffic. Defaults to 2, must be between 2 and 10

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"
        # The number of unsuccessful health checks required for a backend to be
        # considered unhealthy for traffic. Defaults to 6, must be between 2 and 10

        service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "20"
        # The approximate interval, in seconds, between health checks of an
        # individual instance. Defaults to 10, must be between 5 and 300
        service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "5"
        # The amount of time, in seconds, during which no response means a failed
        # health check. This value must be less than the service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval
        # value. Defaults to 5, must be between 2 and 60

        service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-53fae93f,sg-42efd82e"
        # A list of additional security groups to be added to ELB
```

#### Network Load Balancer support on AWS [alpha]

{{< warning >}}
Ini merupakan tingkatan alfa dan tidak direkomendasikan untuk digunakan pada `environment` `production`.
{{< /warning >}}

Sejak versi 1.9.0, Kubernetes mendukung `Network Load Balancer` (NLB). Untuk
menggunakan NLB pada AWS, gunakan anotasi `service.beta.kubernetes.io/aws-load-balancer-type`
dan atur `value`-nya dengan `nlb`.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

Tidak seperti ELB klasik, NLB, melakukan `forwarding` IP klien melalui `node`.
Jika `field` `.spec.externalTrafficPolicy` diatur `value`-nya menjadi `Cluster`, maka 
alamat IP klien tidak akan diteruskan pada `Pod`.

Dengan mengatur `value` dari `field` `.spec.externalTrafficPolicy` ke `Local`, 
alamat IP klien akan diteruskan ke `Pod`, tapi hal ini bisa menyebabkan distribusi trafifik 
yang tidak merata. `Node` yang tidak memiliki `Pod` untuk `Service` dengan tipe `LoadBalancer` 
akan menyebabkan kegagalan `haelth check` `NLB Target` pada tahapan `auto-assigned` `.spec.healthCheckNodePort` 
dan tidak akan menerima trafik apa pun.

Untuk menghasilkan distribusi trafik yang merata, kamu dapat menggunakan 
`DaemonSet` atau melakukan spesifikasi 
[pod anti-affinity](/docs/concepts/configuration/assign-pod-node/#inter-pod-affinity-and-anti-affinity-beta-feature)
agar `Pod` tidak di-`assign` ke `node` yang sama.

NLB juga dapat digunakan dengan anotasi [internal load balancer](/docs/concepts/services-networking/service/#internal-load-balancer).

Agar trafik klien berhasil mencapai `instances` dibelakang ELB, 
`security group` dari `node` akan diberikan `rules` IP sebagai berikut:

| `Rule` | Protokol | `Port` | `IpRange(s)` | Deskripsi `IpRange` |
|--------|----------|--------|--------------|---------------------|
| `Health Check`   | TCP  | NodePort(s) (`.spec.healthCheckNodePort` for `.spec.externalTrafficPolicy = Local`) | VPC CIDR | kubernetes.io/rule/nlb/health=\<loadBalancerName\> |
| `Client Traffic` | TCP  | NodePort(s) | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/client=\<loadBalancerName\> |
| `MTU Discovery`  | ICMP | 3,4 | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/mtu=\<loadBalancerName\> |

Perhatikan bahwa jika `.spec.loadBalancerSourceRanges` tidak dispesifikasikan, 
Kubernetes akan mengizinkan trafik dari `0.0.0.0/0` ke`Node Security Group`. 
Jika `node` memiliki akses publik, maka kamu harus memperhatikan tersebut karena trafik yang tidak berasal 
dari NLB juga dapat mengakses semua `instance` di `security group` tersebut.

Untuk membatasi klien IP mana yang dapat mengakses NLB, 
kamu harus memberikan spesifikasi `loadBalancerSourceRanges`.

```yaml
spec:
  loadBalancerSourceRanges:
  - "143.231.0.0/16"
```

{{< note >}}
NLB hanya dapat digunakan dengan beberapa kelas `instance` tertentu baca [dokumentasi AWS](http://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets)
untuk mengetahui lebih lanjut `intance` apa saja yang didukung.
{{< /note >}}

### Type ExternalName {#externalname}

Service dengan `Type` `ExternalName` melakukan pemetaan antara `Service` dan DNS, dan bukan 
ke `selector` seperti `my-service` atau `cassandra`. Kamu memberikan spesifikasi `spec.externalName` 
pada `Service` tersebut.

Definisi `Service` ini, sebagai contoh, melaukan pemetaan
`Service` `my-service` pada `namespace` `prod` ke DNS `my.database.example.com`:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```
{{< note >}}
`ExternalName` menerima alamat IPv4 dalam bentuk string, 
tapi karena DNS tersusun atas angka dan bukan sebagai alamat IP.
`ExternalNames` yang menyerupai alamat IPv4 tidak bisa di-`resolve` oleh `CoreDNS` 
atau `ingress-nginx` karena `ExternalNames` memang ditujukan bagi penamaan `canonical` DNS. 
Untuk melakukan `hardcode` alamat IP, kamu dapat menggunakan `headless` `Service` sebagai alternatif.
{{< /note >}}

Ketika melakukan pencarian `host``my-service.prod.svc.cluster.local`, 
servis DNS kluster akanmengembalikan `record` `CNAME` dengan `value` `my.database.example.com`. 
Mekanisme akses pada `my-service` bekerja dengan cara yang sama dengan 
`Service` pada umumnya, perbedaan yang krusial untuk hal ini adalah mekanisme `redirection` 
terjadi pada tingkatan DNS dan bukan melalui `proxy forward`. Apabila kamu berniat memindahkan basis data 
yang kamu pakai ke dalam kluster, kamu hanya perlu mengganti `instance` basis data kamu dan menjalankannya 
di dalam `Pod`, menambahkan `selector` atau `endpoint` yang sesuai, serta mengupah `type` dari 
`Service` yang kamu gunakan.

{{< note >}}
Bagian ini berasal dari tulisan [Tips Kubernetes - Bagian
1](https://akomljen.com/kubernetes-tips-part-1/) dari [Alen Komljen](https://akomljen.com/).
{{< /note >}}

### IP External

Jika terdapat sebuah alamat IP eksternal yang melakukan mekanisme `route` ke 
satu atau lebih `node` yang ada di kluster, `Service` Kubernetes dapat disekspos  
dengan menggunakan `externalIPs`. Trafik yang diarahkan ke kluster dengan IP eksternal 
(sebagai destinasi IP), pada `port` `Service` akan di-`route` ke salah satu `endpoint` `Service`. 
`Value` dari `externalIPs` tidak diatur oleh Kubernetes dan merupakan tanggung jawab 
dari administrator kluster. 

Pada `ServiceSpec`, kamu dapat memberikan spesifikasi `externalIPs` dan `ServiceTypes`. 
Pada contoh di bawah ini. `"my-service"` dapat diakses oleh klien pada "`80.11.12.10:80`" (`externalIP:port`).

```yaml
kind: Service
apiVersion: v1
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
  - name: http
    protocol: TCP
    port: 80
    targetPort: 9376
  externalIPs:
  - 80.11.12.10
```

## Kekurangan

Penggunaan `proxy` `userspace` untuk VIP dapat digunakan untuk `scale` kecil hingga menengah, 
meski begitu hal ini tidak `scalable` untuk kluster yang sangat besar dan memiliki ribuan `Service`. 
Perhatikan [Desain proposal orisinil untuk `portal`](http://issue.k8s.io/1107) untuk informasi 
lebih lanjut.

Penggunaan `proxy` `userspace` menghilangkan `source-IP` dari `packet` yang mengakses 
sebuah `Service`. Hal ini membuat mekanisme `firewall` menjadi sulit untuk diterapkan. 
`Proxy` `iptables` tidak menghilangkan `source IP` yang berasal dari dalam kluster, 
meski begitu, hal ini masih berimbas pada klien yang berasal dari `Service` dengan `Type` 
`load-balancer` atau `node-port`.

`Field` `Type` didesain sebagai fungsionalitas yang berantai - setiap tingkatan 
menambahkan tambahan pada tingkata sebelumnya. Hal ini tidak selalu berlaku bagi 
semua penyedia layanan `cloud` (misalnya saja Google Compute Engine tidak perlu 
melakukan alokasi `NodePort` untuk membuat `LoadBalancer` bekerja sebagai mana mestinya, 
hal ini berbeda dengan AWS yang memerlukan hal ini, setidaknya untuk API yang mereka miliki 
saat ini).

## Pengerjaan lebih lanjut

Di masa mendatang, kami berencana untuk membuat `policy` `proxy` menjadi lebih 
bervariasi dan bukan hanya `round robin`, misalnya saja `master-elected` atau `sharded`.
Kami juga berharap bahwa beberapa `Service` bisa saja memiliki `load balancer` yang sebenranya, 
suatu kasus dimana VIP akan secara langsung mengantarkan paket.

Kami ingin meningkatkan dukungan lebih lanjut untuk `Service` dengan tingkatan `Service` L7(HTTP).

Kami ingin memiliki mode `ingress` yang lebih fleksibel untuk `Service` yang 
mencakup mode `ClusterIP`, `NodePort`, dan `LoadBalancer` dan banyak lagi.

## Detail mendalam mengenai IP virtual

Informasi sebelumnya sudah cukup bagi sebagian orang yang hanya ingin menggunakan 
`Service`. Meskipun begitu, terdapat banyak hal yang sebenarnya terjadi dan akan 
sangat bermanfaat untuk dipelajari lebih lanjut.

### Menghindari `collison`

Salah satu filosofi Kubernetes adalah pengguna tidak mungkin menghadapi situasi 
dimana apa yang mereka mengalami kegagalan tanpa adanya alasan yang jelas. Dalam kasus ini, 
kita akan coba memahami lebih lanjut mengenai `network port` - pengguna tidak seharusnya memilih 
nomor `port` jika hal itu memungkinkan terjadinya `collision` dengan pengguna lainnya. Hal ini 
merupajau mekanisme isolasi kegagalan.

Agar pengguna dapat menentukan nomor `port` bagi `Service` mereka, kita harus 
memastikan bahwa tidak ada dua `Service` yang mengalami `collision`. Kita melakukan 
hal tersebut dengan cara melakukan alokasi alamat IP pada setiap `Service`.

Untuk memastikan setiap `Service` memiliki alamat IP yang unik, sebuah `allocator` 
internal akan secara atomik melakukan pemetaan alokasi global di dalam `etcd` ketika 
membuat sebuah `Service` baru. Pemetaan objek harus tersedia pada `registry` `Service` 
dimana `Service` akan diberikan sebuah IP, jika tidak, proses pembuatan `Service` akan gagal 
dan sebuah pesan akan memberikan informasi bahwa alamat IP tidak dapat dialokasikan.
Sebuah `backgroud` `controller` bertanggung jawab terhadap mekanisme pemetaan tersebut (migrasi 
dari versi Kubernetes yang digunakan dalam `mmeory locking`) sekaligus melakukan pengecekan 
terhadap `assignment` yang tidak valid yang terjadi akibat intervensi administrator dan melakukan 
penghapusan daftar IP yang dialokasikan tapi tidak digunakan oleh `Service` mana pun.

### IP dan VIP

Tidak seperti alamat IP `Pod`, yang akan di `route` ke destinasi yang "pasti", 
IP `Service` tidak mengarahkan `request` hanya pada satu `host`.  Sebagai gantinya, 
kita mneggunakan `iptables` (logika pemrosesan paket pada Linux) untuk melakukan definisi 
alamat IP virtual yang secara transparan akan diarahkan sesuai kebutuhan. Ketika klien 
dihubungkan pada VIP, trafik yang ada akan secara otomatis dialihkan pada `endpoint` yang sesuai. 
Variabel `environment` dan DNS untuk `Service` terdiri dalam bentuk VIP dan `port`.

Kami mendukung tiga jenis mode `proxy` - `userspace`, `iptables`, dan `ipvs` yang memiliki 
perbedaan cara kerja satu sama lainnya.

#### `Userspace`

Sebagai contoh, anggaplah kita memiliki aplikasi `image processing` seperti yang sudah 
disebutkan di atas. Ketika `Service` `backend` dibuat, `master` Kubernetes akan mengalokasikan 
sebuah alamat IP virtual, misalnya 10.0.0.1. Dengan asumsi `port` dari `Service` tersebut adalah `1234`, 
maka `Service` tersebut akan diamati oleh semua `instance` `kube-proxy` yang ada di kluster. 
Ketika sebuah `proxy` mendapati sebuah `Service` baru, `proxy` tersebut akan membuka sebuah `port` 
`random`, menyediakan `iptables` yang mengarahkan VIP pada `port` yang baru saja dibuat, dan mulai 
koneksi pada `port` tersebut.

Ketika sebuah klien terhubung ke VIP dan terdapat `rules` `iptables` 
yang diterapkan, paket akan diarahkan ke `port` dari `proxy` `Service` itu sendiri. 
`Proxy` `Service` akan memilih sebuah `backend`, dan mulai melakukan mekanisme `proxy` 
trafik dari klien ke `backend`.

Dengan demikian, pemilik `Service` dapat memilih `port` mana pun yang dia inginkan 
tanpa adanya kemungkinan terjadinya `collision`. Klien dapat dengan mudah mengakses IP dan `port`, 
tanpa harus mengetahui `Pod` mana yang sebenarnya diakses.

#### `Iptables`

Kembali, bayangkan apabila kita memiliki aplikasi `image processing` seperti yang sudah 
disebutkan di atas. Ketika `Service` `backend` dibuat, `master` Kubernetes akan mengalokasikan 
sebuah alamat IP virtual, misalnya 10.0.0.1. Dengan asumsi `port` dari `Service` tersebut adalah `1234`, 
maka `Service` tersebut akan diamati oleh semua `instance` `kube-proxy` yang ada di kluster. 
Ketika sebuah `proxy` mendapati sebuah `Service` baru, `proxy` tersebut akan melakukan instalasi 
serangkaian `rules` `iptables` yang akan melakukan `redirect` VIP ke `rules` tiap `Service`. `Rules` 
untuk tiap `Service` ini terkait dengan `rules` tiap `Endpoints` yang mengarahkan (destinasi NAT) 
ke `backend`.

Ketika sebuah klien terhubung ke VIP dan terdapat `rules `iptables 
yang diterapkan. Sebuah `backend` akan dipilih (hal ini dapat dilakukan berdasarkan `session affinity` 
maupun secara `random`) dan paket-paket yang ada akan diarahkan ke `backend`. Tidak seperti mekanisme 
yang terjadi di `userspace`, paket-paket yang ada tidak pernah disalin ke `userspace`, `kube-proxy` 
tidak harus aktif untuk menjamin kerja VIP, serta IP klien juga tidak perlu diubah.

Laju eksekusi dini dijalankan ketika trafik masuk melalui sebuah `node-port` 
atau `load-balancer`, meskipun pada dua kasus diatas klien IP tidak akan mengalami perubahan. 

#### `Ipvs`

Operasi `iptables` berlangsung secara lambat pada kluster dengan skala besar (lebih dari 10.000 `Service`). 
`IPVS` didesain untuk mekanisme `load balance` dan berbasis pada `hash tables` yang berada di dalam `kernel`. 
Dengan demikian kita dapat mendapatkan performa yang konsisten pada jumlah `Service` yang cukup besar dengan 
menggunakan `kube-proxy` berbasis `ipvs`. Sementara itu, `kube-proxy` berbasis `ipvs` memiliki algoritma 
`load balance` yang lebih bervariasi (misalnya saja `least conns`, `locality`, `weighted`, `persistence`).

## Objek API

`Service` merupakan `resource` `top-level` pada API Kubernetes. 
Penjelasan lebih lanjut mengenai objek API dapat ditemukan pada: 
[objek API `Service`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## Protokol yang didukung {#protokol-yang-didukung}

### TCP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

Kamu dapat menggunakan TCP untuk `Service` dengan `type` apa pun, dan protokol ini merupakan 
protokol `default` yang digunakan.

### UDP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

Kamu dapat menggunakan UDP untuk sebagian besar `Service`. 
Untuk `Service` dengan `type=LoadBalancer`, dukungan terhadap UDP 
bergantung pada penyedia layanan `cloud` yang kamu gunakan. 

### HTTP

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

Apabila penyedia layanan `cloud` yang kamu gunakan mendukung, kamu dapat menggunakan 
`Service` dengan `type` `LoadBalancer` untuk melakukan mekanisme `reverse` `proxy` 
bagi HTTP/HTTPS, dan melakukan `forwarding` ke `Endpoints` dari `Service.

{{< note >}}
Kamu juga dapat menggunakan {{< glossary_tooltip term_id="ingress" >}} sebagai salah satu 
alternatif penggunaan `Service` untuk HTTP/HTTPS.
{{< /note >}}

### Protokol PROXY

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

Apabila penyedia layanan `cloud` yang kamu gunakan mendukung, (misalnya saja, [AWS](/docs/concepts/cluster-administration/cloud-providers/#aws)),
`Service` dengan `type` `LoadBalancer` untuk melakukan konfigurasi `load balancer` 
diluar Kubernetes sendiri, serta akan melakukan `forwarding` koneksi yang memiliki prefiks 
[protokol PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

`Load balancer` akan melakukan serangkaian inisiasi `octet` yang memberikan 
deskripsi koneksi yang datang, dengan bentuk yang menyerupai:

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```
yang kemudian diikuti data dari klien.

### SCTP

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Kubernetes memberikan dukungan bagi SCTP sebagai `value` dari `definition` yang ada pada 
`Service`, `Endpoints`, `NetworkPolicy` dan `Pod` sebagai fitur alfa. Untuk mengaktifkan fitur ini, 
administrator kluster harus menaktifkan `feature gate` `SCTPSupport` pada `apiserver`, contohnya 
`“--feature-gates=SCTPSupport=true,...”`. Ketika `fature gate` ini diaktifkan, pengguna dapat 
memberikan `value` SCTP pada `field` `protocol` `Service`, `Endpoints`, `NetworkPolicy` dan `Pod`. 
Kubernetes kemudian akan melakukan pengaturan agar jaringan yang digunakan agar jaringan tersebut menggunakan SCTP, 
seperti halnya Kubernetes mengatur jaringan agar menggunakan TCP.

#### Perhatian {#kelemahan-penggunaan-sctp}

##### Dukungan untuk asoasiasi `multihomed` SCTP {#kelemahan-sctp-multihomed}

Dukungan untuk asosiasi `multihomed` SCTP membutuhkan `plugin` CNI yang dapat memberikan 
pengalokasian `multiple interface` serta alamat IP pada sebuah `Pod`.

NAT untuk asosiasi `multihomed` SCTP membutuhkan logika khusus pada modul kernel terkait.

##### `Service` dengan `type=LoadBalancer` {#kelemahan-sctp-loadbalancer-service-type}

Sebuah `Service` dengan `type` `LoadBalancer` dan protokol SCTP dapat dibuat 
hanya jika implementasi `load balancer` penyedia layanan `cloud` menyediakan dukungan 
bagi protokol SCTP. Apabila hal ini tidak terpenuhi, maka `request` pembuatan `Servixe` ini akan ditolak. 
`Load balancer` yang disediakan oleh penyedia layanan `cloud` yang ada saat ini (`Azure`, `AWS`, `CloudStack`, `GCE`, `OpenStack`) tidak mendukung SCTP.

##### Windows {#kelemahan-sctp-windows-os}

SCTP tidak didukung pada `node` berbasis Windows.

##### `Kube-proxy` `userspace` {#kelemahan-sctp-kube-proxy-userspace}

`Kube-proxy` tidak mendukung manajemen asosiasi SCTP ketika hal ini dilakukan pada mode 
`userspace`

{{% /capture %}}

{{% capture whatsnext %}}

Baca [Bagaimana cara menghubungkan `Front End` ke `Back End` menggunakan sebuah `Service`](/docs/tasks/access-application-cluster/connecting-frontend-backend/).

{{% /capture %}}
