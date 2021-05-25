---
title: Service
feature:
  title: Service discovery dan load balancing
  description: >
    Kamu tidak perlu memodifikasi aplikasi kamu untuk menggunakan mekanisme _service discovery_ tambahan. Kubernetes menyediakan IP untuk setiap kontainer serta sebuah DNS bagi sebuah sekumpulan kontainer, serta akan melakukan mekanisme _load balance_ bagi sekumpulan kontainer tersebut.

content_type: concept
weight: 10
---


<!-- overview -->

[`Pod`](/id/docs/concepts/workloads/pods/pod/) pada Kubernetes bersifat *mortal*.
Artinya apabila _pod-pod_ tersebut dibuat dan kemudian mati, _pod-pod_ tersebut
tidak akan dihidupkan kembali. [`ReplicaSets`](/id/docs/concepts/workloads/controllers/replicaset/) secara
khusus bertugas membuat dan menghapus `Pod` secara dinamis (misalnya, pada proses *scaling out* atau *scaling in*).
Meskipun setiap `Pod` memiliki alamat IP-nya masing-masing, kamu tidak dapat mengandalkan alamat IP
yang diberikan pada _pod-pod_ tersebut, karena alamat IP yang diberikan tidak stabil.
Hal ini kemudian menimbulkan pertanyaan baru: apabila sebuah sekumpulan `Pod` (yang selanjutnya kita sebut _backend_)
menyediakan _service_ bagi sebuah sekumpulan `Pod` lain (yang selanjutnya kita sebut _frontend_) di dalam
klaster Kubernetes, bagaimana cara _frontend_ menemukan _backend_ mana yang digunakan?

Inilah alasan kenapa `Service` ada.

Sebuah `Service` pada Kubernetes adalah sebuah abstraksi yang memberikan definisi
set logis yang terdiri beberapa `Pod` serta _policy_ bagaimana cara kamu mengakses sekumpulan `Pod` tadi - seringkali disebut sebagai _microservices_.
Set `Pod` yang dirujuk oleh suatu `Service` (biasanya) ditentukan oleh sebuah [`Label Selector`](/id/docs/concepts/overview/working-with-objects/labels/#label-selectors)
(lihat penjelasan di bawah untuk mengetahui alasan kenapa kamu mungkin saja membutuhkan `Service` tanpa
sebuah _selector_).

Sebagai contoh, misalnya terdapat sebuah _backend_ yang menyediakan fungsionalitas _image-processing_
yang memiliki 3 buah _replica_. _Replica-replica_ tadi sifatnya sepadan - dengan kata lain _frontend_
tidak peduli _backend_ manakah yang digunakan. Meskipun `Pod` penyusun sekumpulan _backend_ bisa berubah,
_frontend_ tidak perlu peduli bagaimana proses ini dijalankan atau menyimpan _list_ dari _backend-backend_
yang ada saat itu. `Service` memiliki tujuan untuk _decouple_ mekanisme ini.

Untuk aplikasi yang dijalankan di atas Kubernetes, Kubernetes menyediakan API _endpoint_ sederhana
yang terus diubah apabila _state_ sebuah sekumpulan `Pod` di dalam suatu `Service` berubah. Untuk
aplikasi _non-native_, Kubernetes menyediakan _bridge_ yang berbasis _virtual-IP_ bagi `Service`
yang diarahkan pada `Pod` _backend_.



<!-- body -->

## Mendefinisikan sebuah `Service`

Sebuah `Service` di Kubernetes adalah sebuah objek REST, layaknya sebuah `Pod`. Seperti semua
objek _REST_, definisi `Service` dapat dikirim dengan _method POST_ pada _apiserver_ untuk membuat
sebuah instans baru. Sebagai contoh, misalnya saja kamu memiliki satu sekumpulan `Pod` yang mengekspos _port_
9376 dan memiliki _label_ `"app=MyApp"`.

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

Spesifikasi ini akan ditranslasikan sebagai sebuah objek `Service` baru dengan nama `"my-service"`
dengan _target port_ 9376 pada setiap `Pod` yang memiliki _label_ `"app=MyApp"`. `Service` ini
juga akan memiliki alamat IP tersendiri (yang terkadang disebut sebagai _"cluster IP"_), yang nantinya
akan digunakan oleh _service proxy_ (lihat di bagian bawah). _Selector_ pada `Service` akan selalu dievaluasi
dan hasilnya akan kembali dikirim dengan menggunakan _method POST_ ke objek `Endpoints`
yang juga disebut `"my-service"`.

Perhatikan bahwa sebuah `Service` dapat melakukan pemetaan setiap _incoming port_ pada `targetPort`
mana pun. Secara _default_, _field_ `targetPort` akan memiliki _value_ yang sama dengan _value_ dari _field_ `port`.
Hal menarik lainnya adalah _value_ dari `targetPort` bisa saja berupa string yang merujuk pada nama
dari _port_ yang didefinisikan pada `Pod` _backend_. Nomor _port_ yang diberikan pada _port_ dengan nama
tadi bisa saja memiliki nilai yang berbeda di setiap `Pod` _backend_. Hal ini memberikan fleksibilitas
pada saat kamu melakukan _deploy_ atau melakukan perubahan terhadap `Service`. Misalnya saja suatu saat
kamu ingin mengubah nomor _port_ yang ada pada `Pod` _backend_ pada rilis selanjutnya tanpa menyebabkan
permasalahan pada sisi klien.

Secara _default_, protokol yang digunakan pada _service_ adalah `TCP`, tapi kamu bisa saja menggunakan
[protokol yang tersedia](#protokol-yang-tersedia). Karena banyak `Service` memiliki kebutuhan untuk
mengekspos lebih dari sebuah _port_, Kubernetes menawarkan definisi _multiple_ _port_ pada sebuah objek
_Service_. Setiap definisi _port_ dapat memiliki protokol yang berbeda.

### `Service` tanpa _selector_

Secara umum, `Service` memberikan abstraksi mekanisme yang dilakukan untuk mengakses `Pod`, tapi
mereka juga melakukan abstraksi bagi _backend_ lainnya. Misalnya saja:

  * Kamu ingin memiliki sebuah basis data eksternal di _environment_ _production_ tapi pada tahap _test_,
    kamu ingin menggunakan basis datamu sendiri.
  * Kamu ingin merujuk _service_ kamu pada _service_ lainnya yang berada pada
    [_Namespace_](/id/docs/concepts/overview/working-with-objects/namespaces/) yang berbeda atau bahkan klaster yang berbeda.
  * Kamu melakukan migrasi _workloads_ ke Kubernetes dan beberapa _backend_ yang kamu miliki masih
    berada di luar klaster Kubernetes.

Berdasarkan skenario-skenario di atas, kamu dapat membuat sebuah `Service` tanpa _selector_:

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

Karena `Service` ini tidak memiliki _selector_, objek `Endpoints` bagi `Service` ini tidak akan dibuat.
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
_loopback_ (127.0.0.0/8), _link-local_ (169.254.0.0/16), atau _link-local multicast_ (224.0.0.0/24).
Alamat IP tersebut juga tidak boleh berupa _cluster IP_ dari `Service` Kubernetes lainnya,
karena `kube-proxy` belum menyediakan dukungan IP virtual sebagai _destination_.
{{< /note >}}

Cara mengakses suatu `Service` tanpa _selector_ sama saja dengan mengakses suatu `Service`
dengan _selector_. Trafik yang ada akan di-*route* ke `Endpoints` yang dispesifikasikan oleh
pengguna (dalam contoh kali ini adalah `1.2.3.4:9376`).

Sebuah `ExternalName` `Service` merupakan kasus spesial dari `Service`
dimana `Service` tidak memiliki _selector_ dan menggunakan penamaan _DNS_. Untuk
informasi lebih lanjut silahkan baca bagian [ExternalName](#externalname).

## IP Virtual dan _proxy_ `Service`

Setiap *node* di klaster Kubernetes menjalankan `kube-proxy`. `kube-proxy`
bertanggung jawab terhadap implementasi IP virtual bagi _Services_ dengan tipe
selain [`ExternalName`](#externalname).

Pada Kubernetes versi v1.0, _Services_ adalah "layer 4" (TCP/UDP pada IP), _proxy_
yang digunakan murni berada pada _userspace_. Pada Kubernetes v1.1, API `Ingress`
ditambahkan untuk merepresentasikan "layer 7"(HTTP), _proxy_ `iptables` juga ditambahkan
dan menjadi mode operasi _default_ sejak Kubernetes v1.2. Pada Kubernetes v1.8.0-beta.0,
_proxy_ _ipvs_ juga ditambahkan.

### Mode _Proxy_: _userspace_

Pada mode ini, `kube-proxy` mengamati master Kubernetes apabila terjadi penambahan
atau penghapusan objek `Service` dan `Endpoints`. Untuk setiap `Service`, `kube-proxy`
akan membuka sebuah _port_ (yang dipilih secara acak) pada *node* lokal. Koneksi
pada _"proxy port"_ ini akan dihubungkan pada salah satu `Pod` _backend_ dari `Service`
(yang tercatat pada `Endpoints`). `Pod` _backend_ yang akan digunakan akan diputuskan berdasarkan
`SessionAffinity` pada `Service`. Langkah terakhir yang dilakukan oleh `kube-proxy`
adalah melakukan instalasi _rules_ `iptables` yang akan mengarahkan trafik yang ada pada
`clusterIP` (IP virtual) dan _port_ dari `Service` serta melakukan _redirect_ trafik ke _proxy_
yang memproksikan `Pod` _backend_. Secara _default_, mekanisme _routing_ yang dipakai adalah
_round robin_.

![Ikhtisar diagram _Services_ pada _proxy_ _userspace_](/images/docs/services-userspace-overview.svg)

### Mode _Proxy_: iptables

Pada mode ini, `kube-proxy` mengamati master Kubernetes apabila terjadi penambahan
atau penghapusan objek `Service` dan `Endpoints`. Untuk setiap `Service`,
`kube-proxy` akan melakukan instalasi _rules_ `iptables` yang akan mengarahkan
trafik ke `clusterIP` (IP virtual) dan _port_ dari `Service`. Untuk setiap objek `Endpoints`,
`kube-proxy` akan melakukan instalasi _rules_ `iptables` yang akan memilih satu buah `Pod`
_backend_. Secara _default_, pemilihan _backend_ ini dilakukan secara acak.

Tentu saja, `iptables` yang digunakan tidak boleh melakukan _switching_
antara _userspace_ dan _kernelspace_, mekanisme ini harus lebih kokoh dan lebih cepat
dibandingkan dengan _userspace_ _proxy_. Meskipun begitu, berbeda dengan mekanisme
_proxy_ _userspace_, _proxy_ `iptables` tidak bisa secara langsung menjalankan mekanisme
_retry_ ke `Pod` lain apabila `Pod` yang sudah dipilih sebelumnya tidak memberikan respons,
dengan kata lain hal ini akan sangat bergantung pada
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/#defining-readiness-probes).

![Ikhtisar diagram _Services_ pada _proxy_ `iptables`](/images/docs/services-iptables-overview.svg)

### Mode _Proxy_: ipvs

{{< feature-state for_k8s_version="v1.9" state="beta" >}}

Pada mode ini, `kube-proxy` mengamati _Services_ dan `Endpoints`, kemudian memanggil
_interface_ _netlink_ untuk membuat _rules_ _ipvs_ yang sesuai serta melakukan sinkronisasi
_rules_ _ipvs_ dengan _Services_ dan `Endpoints` Kubernetes secara periodik, untuk memastikan
status _ipvs_ konsisten dengan apa yang diharapkan. Ketika sebuah _Services_ diakses,
trafik yang ada akan diarahkan ke salah satu `Pod` _backend_.

Sama halnya dengan `iptables`, _ipvs_ juga berdasarkan pada fungsi _hook_ _netfilter_,
bedanya adalah _ipvs_ menggunakan struktur data _hash table_ dan bekerja di _kernelspace_.
Dengan kata lain _ipvs_ melakukan _redirect_ trafik dengan lebih cepat dan dengan performa yang lebih
baik ketika melakukan sinkronisasi _rules_ _proxy_. Selain itu, _ipvs_ juga menyediakan
lebih banyak opsi algoritma _load balancing_:

- `rr`: round-robin
- `lc`: least connection
- `dh`: destination hashing
- `sh`: source hashing
- `sed`: shortest expected delay
- `nq`: never queue

{{< note >}}
Mode _ipvs_ menggunakan _module_ _IPVS_ _kernel_ yang diinstal pada *node*
sebelum `kube-proxy` dijalankan. Ketika `kube-proxy` dijalankan dengan mode _proxy_ _ipvs_,
`kube-proxy` akan melakukan proses validasi, apakah _module_ _IPVS_ sudah diinstal di *node*,
jika _module_ tersebut belum diinstal, maka `kube-proxy` akan menggunakan mode `iptables`.
{{< /note >}}

![Ikhtisar diagram _Services_ pada _proxy_ _ipvs_](/images/docs/services-ipvs-overview.svg)

Dari sekian model _proxy_ yang ada, trafik _inbound_ apa pun yang ada diterima oleh _IP:Port_ pada `Service`
akan dilanjutkan melalui _proxy_ pada _backend_ yang sesuai, dan klien tidak perlu mengetahui
apa informasi mendetail soal Kubernetes, `Service`, atau `Pod`. afinitas _session_ (_session affinity_) berbasis
_Client-IP_ dapat dipilih dengan cara menerapkan nilai _"ClientIP"_ pada `service.spec.sessionAffinity`
(nilai _default_ untuk hal ini adalah _"None"_), kamu juga dapat mengatur nilai maximum _session_
_timeout_ yang ada dengan mengatur opsi `service.spec.sessionAffinityConfig.clientIP.timeoutSeconds` jika
sebelumnya kamu sudah menerapkan nilai _"ClusterIP"_ pada `service.spec.sessionAffinity`
(nilai _default_ untuk opsi ini adalah _"10800"_).

## _Multi-Port Services_

Banyak _Services_ dengan kebutuhan untuk mengekspos lebih dari satu _port_.
Untuk kebutuhan inilah, Kubernetes mendukung _multiple_ _port_ _definitions_ pada objek `Service`.
Ketika menggunakan _multiple_ _port_, kamu harus memberikan nama pada setiap _port_ yang didefinisikan,
sehingga _Endpoint_ yang dibentuk tidak ambigu. Contoh:

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

Perhatikan bahwa penamaan _port_ hanya boleh terdiri dari karakter _alphanumeric_ _lowercase_
dan _-_, serta harus dimulai dan diakhiri dengan karakter _alphanumeric_, misalnya saja `123-abc` dan `web`
merupakan penamaan yang valid, tapi `123_abc` dan `-web` bukan merupakan penamaan yang valid.

## Memilih sendiri alamat IP yang kamu inginkan

Kamu dapat memberikan spesifikasi alamat _cluster IP_ yang kamu inginkan
sebagai bagian dari _request_ pembuatan objek `Service`. Untuk melakukan hal ini,
kamu harus mengisi _fields_ `.spec.clusterIP` field. Contoh penggunaannya adalah sebagai berikut,
misalnya saja kamu sudah memiliki _entry_ DNS yang ingin kamu gunakan kembali,
atau sebuah sistem _legacy_ yang sudah diatur pada alamat IP spesifik
dan sulit untuk diubah. Alamat IP yang ingin digunakan pengguna haruslah merupakan alamat IP
yang valid dan berada di dalam _range_ _CIDR_ `service-cluster-ip-range` yang dispesifikasikan di dalam
penanda yang diberikan _apiserver_. Jika _value_ yang diberikan tidak valid, _apiserver_ akan
mengembalikan _response_ _code_ HTTP _422_ yang mengindikasikan _value_ yang diberikan tidak valid.

### Mengapa tidak menggunakan DNS _round-robin_?

Pertanyaan yang selalu muncul adalah kenapa kita menggunakan IP virtual dan bukan
DNS _round-robin_ standar? Terdapat beberapa alasan dibalik semua itu:

   * Terdapat sejarah panjang dimana _library_ DNS tidak mengikuti _TTL_ DNS dan
     melakukan _caching_ hasil dari _lookup_ yang dilakukan.
   * Banyak aplikasi yang melakukan _lookup_ DNS hanya sekali dan kemudian melakukan _cache_ hasil yang diperoleh.
   * Bahkan apabila aplikasi dan _library_ melakukan resolusi ulang yang _proper_, _load_ dari setiap
     klien yang melakukan resolusi ulang DNS akan sulit untuk di _manage_.

Kami berusaha untuk mengurangi ketertarikan pengguna untuk melakukan yang mungkin akan menyusahkan pengguna.
Dengan demikian, apabila terdapat justifikasi yang cukup kuat, kami mungkin saja memberikan implementasi
alternatif yang ada.

## _Discovering services_

Kubernetes mendukung 2 buah mode primer untuk melakukan `Service` - variabel _environment_ dan DNS.

### Variabel _Environment_

Ketika sebuah `Pod` dijalankan pada *node*, _kubelet_ menambahkan seperangkat variabel _environment_
untuk setiap `Service` yang aktif. _Environment_ yang didukung adalah [Docker links compatible](https://docs.docker.com/userguide/dockerlinks/) variabel (perhatikan
[makeLinkVariables](http://releases.k8s.io/{{< param "githubbranch" >}}/pkg/kubelet/envvars/envvars.go#L49))
dan variabel `{SVCNAME}_SERVICE_HOST` dan `{SVCNAME}_SERVICE_PORT`, dinama nama `Service` akan diubah
menjadi huruf kapital dan tanda _minus_  akan diubah menjadi _underscore_.

Sebagai contoh, `Service` `"redis-master"` yang mengekspos _port_ TCP 6379 serta _alamat_
_cluster IP_ _10.0.0.11_ akan memiliki _environment_ sebagai berikut:

```shell
REDIS_MASTER_SERVICE_HOST=10.0.0.11
REDIS_MASTER_SERVICE_PORT=6379
REDIS_MASTER_PORT=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP=tcp://10.0.0.11:6379
REDIS_MASTER_PORT_6379_TCP_PROTO=tcp
REDIS_MASTER_PORT_6379_TCP_PORT=6379
REDIS_MASTER_PORT_6379_TCP_ADDR=10.0.0.11
```

Hal ini merupakan kebutuhan yang urutannya harus diperhatikan - `Service` apa pun yang
akan diakses oleh sebuah `Pod` harus dibuat sebelum `Pod` tersebut dibuat,
jika tidak variabel _environment_ tidak akan diinisiasi.
Meskipun begitu, DNS tidak memiliki keterbatasan ini.

### DNS

Salah satu [_add-on_](/id/docs/concepts/cluster-administration/addons/) opsional
(meskipun sangat dianjurkan) adalah server DNS. Server DNS bertugas untuk mengamati apakah
terdapat objek `Service` baru yang dibuat dan kemudian bertugas menyediakan DNS baru untuk
_Service_ tersebut. Jika DNS ini diaktifkan untuk seluruh klaster, maka semua `Pod` akan secara otomatis
dapat melakukan resolusi DNS.

Sebagai contoh, apabila kamu memiliki sebuah `Service` dengan nama `"my-service"` pada _Namespace_
_"my-ns"_, maka _record_ DNS `"my-service.my-ns"` akan dibuat. `Pod` yang berada di dalam
_Namespace_ _"my-ns"_ dapat langsung melakukan _lookup_ dengan hanya menggunakan `"my-service"`.
Sedangkan `Pod` yang berada di luar _Namespace_ _my-ns"_ harus menggunakan `"my-service.my-ns"`.
Hasil dari resolusi ini menrupakan _cluster IP_.

Kubernetes juga menyediakan _record_ DNS SRV (service) untuk _named ports_.  Jika
_Service_ `"my-service.my-ns"` memiliki _port_ dengan nama `"http"` dengan protokol `TCP`,
kamu dapat melakukan _query_ DNS SRV untuk `"_http._tcp.my-service.my-ns"` untuk mengetahui
nomor _port_ yang digunakan oleh _http_.

Server DNS Kubernetes adalah satu-satunya cara untuk mengakses
_Service_ dengan tipe `ExternalName`. Informasi lebih lanjut tersedia di
[DNS _Pods_ dan _Services_](/id/docs/concepts/services-networking/dns-pod-service/).

## `Service` _headless_

Terkadang kamu tidak membutuhkan mekanisme _load-balancing_ dan sebuah _single_ IP _Sevice_.
Dalam kasus ini, kamu dapat membuat _"headless"_ `Service` dengan cara memberikan spesifikasi
_None_ pada _cluster IP_ (`.spec.clusterIP`).

Opsi ini memungkinkan pengguna mengurangi ketergantungan terhadap sistem Kubernetes
dengan cara memberikan kebebasan untuk mekanisme _service discovery_. Aplikasi akan
tetap membutuhkan mekanisme _self-registration_ dan _adapter service discovery_
lain yang dapat digunakan berdasarkan API ini.

Untuk `Service` _"headless"_ alokasi _cluster IP_ tidak dilakukan dan `kube-proxy`
tidak me-_manage_ _Service-Service_, serta tidak terdapat mekanisme _load balancing_
yang dilakukan. Bagaimana konfigurasi otomatis bagi DNS dilakukan bergantung pada
apakah `Service` tersebut memiliki _selector_ yang dispesifikasikan.

### Dengan _selector_

Untuk `Service` _"headless"_ dengan _selector_, kontroler `Endpoints` akan membuat suatu
_record_ `Endpoints` di API, serta melakukan modifikasi konfigurasi DNS untuk mengembalikan
_A records (alamat)_ yang merujuk secara langsung pada `Pod` _backend_.

### Tanpa _selector_

Untuk `Service` _"headless"_ tanpa  _selector_, kontroler `Endpoints`
tidak akan membuat _record_ _Enpoints_. Meskipun demikian,
sistem DNS tetap melakukan konfigurasi salah satu dari:

  * _record_ CNAME untuk [`ExternalName`](#externalname)-tipe services.
  * _record_ untuk semua `Endpoints` yang memiliki nama `Service` yang sama, untuk
    tipe lainnya.

## Mekanisme _publish_ `Service` - jenis-jenis `Service`

Untuk beberapa bagian dari aplikasi yang kamu miliki (misalnya saja, _frontend_),
bisa saja kamu memiliki kebutuhan untuk mengekspos `Service` yang kamu miliki
ke alamat IP eksternal (di luar klaster Kubernetes).

`ServiceTypes` yang ada pada Kubernetes memungkinkan kamu untuk menentukan
jenis `Service` apakah yang kamu butuhkan. Secara _default_, jenis `Service`
yang diberikan adalah `ClusterIP`.

_Value_ dan perilaku dari tipe `Service` dijelaskan sebagai berikut:

   * `ClusterIP`: Mengekspos `Service` ke _range_ alamat IP di dalam klaster. Apabila kamu memilih _value_ ini
     `Service` yang kamu miliki hanya dapat diakses secara internal. tipe ini adalah
     _default_ _value_ dari _ServiceType_.
   * [`NodePort`](#nodeport): Mengekspos `Service` pada setiap IP *node* pada _port_ statis
     atau _port_ yang sama. Sebuah `Service` `ClusterIP`, yang mana `Service` `NodePort` akan di-_route_
     , dibuat secara otomatis. Kamu dapat mengakses `Service` dengan tipe ini,
     dari luar klaster melalui `<NodeIP>:<NodePort>`.
   * [`LoadBalancer`](#loadbalancer): Mengekspos `Service` secara eksternal dengan menggunakan `LoadBalancer`
     yang disediakan oleh penyedia layanan _cloud_. `Service` dengan tipe `NodePort` dan `ClusterIP`,
     dimana trafik akan di-_route_, akan dibuat secara otomatis.
   * [`ExternalName`](#externalname): Melakukan pemetaan `Service` ke konten
      dari _field_ `externalName` (misalnya: `foo.bar.example.com`), dengan cara mengembalikan
      catatan `CNAME` beserta _value_-nya. Tidak ada metode _proxy_ apa pun yang diaktifkan. Mekanisme ini
      setidaknya membutuhkan `kube-dns` versi 1.7.

### Type NodePort {#nodeport}

Jika kamu menerapkan _value_ `NodePort` pada _field_ _type_, master Kubernetes akan mengalokasikan
_port_ dari _range_ yang dispesifikasikan oleh penanda `--service-node-port-range` (secara _default_, 30000-32767)
dan setiap _Node_ akan memproksikan _port_ tersebut (setiap _Node_ akan memiliki nomor _port_ yang sama) ke `Service`
yang kamu miliki. `Port` tersebut akan dilaporkan pada _field_ `.spec.ports[*].nodePort` di `Service` kamu.

Jika kamu ingin memberikan spesifikasi IP tertentu untuk melakukan _poxy_ pada _port_.
kamu dapat mengatur penanda `--nodeport-addresses` pada `kube-proxy` untuk _range_ alamat IP
tertentu (mekanisme ini didukung sejak v1.10). Sebuah daftar yang dipisahkan koma (misalnya, _10.0.0.0/8_, _1.2.3.4/32_)
digunakan untuk mem-_filter_ alamat IP lokal ke _node_ ini. Misalnya saja kamu memulai `kube-proxy` dengan penanda
`--nodeport-addresses=127.0.0.0/8`, maka `kube-proxy` hanya akan memilih _interface_ _loopback_ untuk `Service` dengan tipe
`NodePort`. Penanda `--nodeport-addresses` memiliki nilai _default_ kosong (`[]`), yang artinya akan memilih semua _interface_ yang ada
dan sesuai dengan perilaku `NodePort` _default_.

Jika kamu menginginkan nomor _port_ yang berbeda, kamu dapat memberikan spesifikasi
_value_ dari _field_ _nodePort_, dan sistem yang ada akan mengalokasikan _port_ tersebut untuk kamu,
jika _port_ tersebut belum digunakan (perhatikan bahwa jika kamu menggunakan teknik ini, kamu perlu
mempertimbangkan _collision_ yang mungkin terjadi dan bagaimana cara mengatasi hal tersebut)
atau transaksi API yang dilakukan akan gagal.

Hal ini memberikan kebebasan bagi pengembang untuk memilih _load balancer_ yang akan digunakan, terutama apabila
_load balancer_ yang ingin digunakan belum didukung sepenuhnya oleh Kubernetes.

Perhatikan bahwa `Service` dapat diakses baik dengan menggunakan `<NodeIP>:spec.ports[*].nodePort`
atau `.spec.clusterIP:spec.ports[*].port`. (Jika penanda `--nodeport-addresses` diterapkan, <NodeIP> dapat di-_filter_ dengan salah satu atau lebih _NodeIP_.)

### Type LoadBalancer {#loadbalancer}

Pada penyedia layanan _cloud_ yang menyediakan pilihan _load balancer_ eksternal, pengaturan _field_ _type_
ke `LoadBalancer` akan secara otomatis melakukan proses _provision_ _load balancer_ untuk `Service` yang kamu buat.
Informasi mengenai _load balancer_ yang dibuat akan ditampilkan pada _field_ `.status.loadBalancer`
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

Trafik dari _load balancer_ eksternal akan diarahkan pada `Pod` _backend_, meskipun mekanisme
bagaimana hal ini dilakukan bergantung pada penyedia layanan _cloud_. Beberapa penyedia layanan
_cloud_ mengizinkan konfigurasi untuk _value_ `loadBalancerIP`. Dalam kasus tersebut, _load balancer_ akan dibuat
dengan _loadbalancerIP_ yang dispesifikasikan. Jika _value_ dari `loadBalancerIP` tidak dispesifikasikan.
sebuah IP sementara akan diberikan  pada _loadBalancer_. Jika `loadBalancerIP` dispesifikasikan,
tetapi penyedia layanan _cloud_ tidak mendukung hal ini, maka _field_ yang ada akan diabaikan.

**Catatan Khusus untuk Azure**: Untuk spesifikasi `loadBalancerIP` publik yang didefinisikan oleh pengguna,
sebuah alamat IP statis publik akan disediakan terlebih dahulu, dan alamat IP tersebut harus berada di
_resource group_ dari _resource_ yang secara otomatis dibuat oleh klaster. Misalnya saja, `MC_myResourceGroup_myAKSCluster_eastus`.
Berikan spesifikasi alamat IP sebagai `loadBalancerIP`. Pastikan kamu sudah melakukan _update_ pada
_securityGroupName_ pada _file_ konfigurasi penyedia layanan _cloud_.
Untuk informasi lebih lanjut mengenai _permission_ untuk `CreatingLoadBalancerFailed` kamu dapat membaca _troubleshooting_ untuk
[Penggunaan alamat IP statis pada _load balancer_ Azure Kubernetes Service (AKS)](https://docs.microsoft.com/en-us/azure/aks/static-ip) atau
[_CreatingLoadBalancerFailed_ pada klaster AKS dengan _advanced networking_](https://github.com/Azure/AKS/issues/357).

{{< note >}}
Dukungan untuk SCTP _load balancer_ dari penyedia layanan _cloud_ bergantung pada
implementasi _load balancer_ yang disediakan oleh penyedia layanan _cloud_ tersebut.
Jika SCTP tidak didukung oleh _load balancer_ penyedia layanan publik maka _request_ pembuatan `Service`
akan tetap diterima, meskipun proses pembuatan _load balancer_ itu sendiri gagal.
{{< /note >}}

#### _Load balancer_ internal
Di dalam _environment_, terkadang terdapat kebutuhan untuk melakukan _route_ trafik antar
_Service_ yang berada di dalam satu VPC.

Di dalam _environment_ _split-horizon DNS_ kamu akan membutuhkan dua _service_ yang mampu
melakukan mekanisme _route_ trafik eskternal maupun internal ke _endpoints_ yang kamu miliki.

Hal ini dapat diraih dengan cara menambahkan anotasi berikut untuk _service_ yang disediakan oleh
penyedia layanan _cloud_.

{{< tabs name="service_tabs" >}}
{{% tab name="Default" %}}
Pilih salah satu _tab_.
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
Gunakan _cloud.google.com/load-balancer-type: "internal"_ untuk master dengan versi 1.7.0 to 1.7.3.
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
Dukungan parsial untuk SSL bagi klaster yang dijalankan di AWS mulai diterapkan,
mulai versi 1.3 terdapat 3 anotasi yang dapat ditambahkan pada `Service` dengan tipe
`LoadBalancer`:

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
```

Anotasi pertama memberikan spesifikasi ARN dari sertifikat yang akan digunakan.
Sertifikat yang digunakan bisa saja berasal dari _third party_ yang diunggah ke IAM atau
sertifikat yang dibuat secara langsung dengan menggunakan sertifikat manajer AWS.

```yaml
metadata:
  name: my-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: (https|http|ssl|tcp)
```

Anotasi kedua memberikan spesifikasi bagi protokol yang digunakan oleh `Pod` untuk saling berkomunikasi.
Untuk HTTPS dan SSL, ELB membutuhkan `Pod` untuk melakukan autentikasi terhadap dirinya sendiri melalui
koneksi yang dienkripsi.

Protokol HTTP dan HTTPS akan memilih mekanisme _proxy_ di tingkatan ke-7:
ELB akan melakukan terminasi koneksi dengan pengguna, melakukan proses _parsing_ _headers_, serta
memasukkan _value_ bagi _header_ `X-Forwarded-For` dengan alamat IP pengguna (_Pod_ hanya dapat melihat
alamat IP dari ELB pada akhir koneksi yang diberikan) ketika melakukan _forwarding_ suatu _request_.

Protokol TCP dan SSL akan memilih mekanisme _proxy_ pada tingkatan 4: ELB akan melakukan _forwarding_ trafik
tanpa melakukan modifikasi _headers_.

Pada _environment_ campuran dimana beberapa _port_ diamankan sementara _port_ lainnya dalam kondisi tidak dienkripsi,
anotasi-anotasi berikut dapat digunakan:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
        service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443,8443"
```

Pada contoh di atas, jika `Service` memiliki 3 buah _port_, yaitu: `80`, `443`, dan
`8443`, maka `443` adan `8443` akan menggunakan sertifikat SSL, tetapi `80` hanya akan
di-_proxy_ menggunakan protokol HTTP.

Mulai versi 1.9, `Service` juga dapat menggunakan [_predefined_ _policy_](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html)
untuk HTTPS atau _listener_ SSL. Untuk melihat _policy_ apa saja yang dapat digunakan, kamu dapat menjalankan perintah _awscli_:

```bash
aws elb describe-load-balancer-policies --query 'PolicyDescriptions[].PolicyName'
```

_Policy_ ini kemudian dapat dispesifikasikan menggunakan anotasi
"_service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy_", contohnya:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: "ELBSecurityPolicy-TLS-1-2-2017-01"
```

#### Protokol PROXY pada AWS

Untuk mengaktifkan dukungan [protokol PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt)
untuk klaster yang dijalankan di AWS, kamu dapat menggunakan anotasi di bawah ini:

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
```

Sejak versi 1.3.0, penggunaan anotasi berlaku untuk semua _port_ yang diproksi oleh ELB
dan tidak dapat diatur sebaliknya.

#### Akses _Log_ ELB pada AWS

Terdapat beberapa anotasi yang digunakan untuk melakukan manajemen
akses _log_ untuk ELB pada AWS.

Anotasi `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`
mengatur akses _log_ mana sajakah yang diaktifkan.

Anotasi `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`
mengatur interval (dalam menit) publikasi akses _log_. Kamu dapat memberikan spesifikasi interval
diantara _range_ 5-60 menit.

Anotasi `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`
mengatur nama _bucket_ Amazon S3 dimana akses _log_ _load balancer_ disimpan.

Anotasi `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`
memberikan spesifikasi hierarki logis yang kamu buat untuk _bucket_ Amazon S3 yang kamu buat.

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
        # The logical hierarchy you created for your Amazon S3 bucket, for example _my-bucket-prefix/prod_
```

#### Mekanisme _Draining_ Koneksi pada AWS

Mekanisme _draining_ untuk ELB klasik dapat dilakukan dengan menggunakan anotasi
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled` serta mengatur
_value_-nya menjadi `"true"`. Anotasi
`service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout` juga
dapat digunakan untuk mengatur _maximum time_ (dalam detik), untuk menjaga koneksi yang ada
agar selalu terbuka sebelum melakukan _deregistering_ _instance_.

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

#### Dukungan _Network Load Balancer_ (NLB) pada AWS [alpha]

{{< warning >}}
Ini merupakan tingkatan _alpha_ dan tidak direkomendasikan untuk digunakan pada _environment_ _production_.
{{< /warning >}}

Sejak versi 1.9.0, Kubernetes mendukung _Network Load Balancer_ (NLB). Untuk
menggunakan NLB pada AWS, gunakan anotasi `service.beta.kubernetes.io/aws-load-balancer-type`
dan atur _value_-nya dengan `nlb`.

```yaml
    metadata:
      name: my-service
      annotations:
        service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
```

Tidak seperti ELB klasik, NLB, melakukan _forwarding_ IP klien melalui _node_.
Jika _field_ `.spec.externalTrafficPolicy` diatur _value_-nya menjadi `Cluster`, maka
alamat IP klien tidak akan diteruskan pada `Pod`.

Dengan mengatur _value_ dari _field_ `.spec.externalTrafficPolicy` ke `Local`,
alamat IP klien akan diteruskan ke `Pod`, tapi hal ini bisa menyebabkan distribusi trafik
yang tidak merata. _Node_ yang tidak memiliki `Pod` untuk `Service` dengan tipe `LoadBalancer`
akan menyebabkan kegagalan _health check_ _NLB Target_ pada tahapan _auto-assigned_ `.spec.healthCheckNodePort`
dan tidak akan menerima trafik apa pun.

Untuk menghasilkan distribusi trafik yang merata, kamu dapat menggunakan
_DaemonSet_ atau melakukan spesifikasi
[pod anti-affinity](/id/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity-beta-feature)
agar `Pod` tidak di-_assign_ ke _node_ yang sama.

NLB juga dapat digunakan dengan anotasi [internal load balancer](/id/docs/concepts/services-networking/service/#internal-load-balancer).

Agar trafik klien berhasil mencapai _instances_ dibelakang ELB,
_security group_ dari _node_ akan diberikan _rules_ IP sebagai berikut:

| _Rule_ | Protokol | `Port` | _IpRange(s)_ | Deskripsi _IpRange_ |
|--------|----------|--------|--------------|---------------------|
| _Health Check_   | TCP  | NodePort(s) (`.spec.healthCheckNodePort` for _.spec.externalTrafficPolicy = Local_) | VPC CIDR | kubernetes.io/rule/nlb/health=\<loadBalancerName\> |
| _Client Traffic_ | TCP  | NodePort(s) | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/client=\<loadBalancerName\> |
| _MTU Discovery_  | ICMP | 3,4 | `.spec.loadBalancerSourceRanges` (defaults to `0.0.0.0/0`) | kubernetes.io/rule/nlb/mtu=\<loadBalancerName\> |

Perhatikan bahwa jika `.spec.loadBalancerSourceRanges` tidak dispesifikasikan,
Kubernetes akan mengizinkan trafik dari `0.0.0.0/0` ke _Node Security Group_.
Jika _node_ memiliki akses publik, maka kamu harus memperhatikan tersebut karena trafik yang tidak berasal
dari NLB juga dapat mengakses semua _instance_ di _security group_ tersebut.

Untuk membatasi klien IP mana yang dapat mengakses NLB,
kamu harus memberikan spesifikasi _loadBalancerSourceRanges_.

```yaml
spec:
  loadBalancerSourceRanges:
  - "143.231.0.0/16"
```

{{< note >}}
NLB hanya dapat digunakan dengan beberapa kelas _instance_ tertentu baca [dokumentasi AWS](http://docs.aws.amazon.com/elasticloadbalancing/latest/network/target-group-register-targets.html#register-deregister-targets)
untuk mengetahui lebih lanjut _intance_ apa saja yang didukung.
{{< /note >}}

### Tipe ExternalName {#externalname}

Service dengan tipe `ExternalName` melakukan pemetaan antara `Service` dan DNS, dan bukan
ke _selector_ seperti `my-service` atau `cassandra`. Kamu memberikan spesifikasi `spec.externalName`
pada `Service` tersebut.

Definisi `Service` ini, sebagai contoh, melaukan pemetaan
`Service` `my-service` pada _namespace_ `prod` ke DNS `my.database.example.com`:

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
`ExternalName` yang menyerupai alamat IPv4 tidak bisa di-_resolve_ oleh _CoreDNS_
atau _ingress-nginx_ karena `ExternalName` memang ditujukan bagi penamaan _canonical_ DNS.
Untuk melakukan _hardcode_ alamat IP, kamu dapat menggunakan _headless_ `Service` sebagai alternatif.
{{< /note >}}

Ketika melakukan pencarian _host_ `my-service.prod.svc.cluster.local`,
servis DNS klaster akan mengembalikan _record_ `CNAME` dengan _value_ `my.database.example.com`.
Mekanisme akses pada `my-service` bekerja dengan cara yang sama dengan
`Service` pada umumnya, perbedaan yang krusial untuk hal ini adalah mekanisme _redirection_
terjadi pada tingkatan DNS dan bukan melalui _proxy forward_. Apabila kamu berniat memindahkan basis data
yang kamu pakai ke dalam klaster, kamu hanya perlu mengganti instans basis data kamu dan menjalankannya
di dalam `Pod`, menambahkan _selector_ atau _endpoint_ yang sesuai, serta mengupah _type_ dari
_Service_ yang kamu gunakan.

{{< note >}}
Bagian ini berasal dari tulisan [Tips Kubernetes - Bagian
1](https://akomljen.com/kubernetes-tips-part-1/) oleh [Alen Komljen](https://akomljen.com/).
{{< /note >}}

### IP Eksternal

Jika terdapat sebuah alamat IP eksternal yang melakukan mekanisme _route_ ke satu atau lebih _node_ yang ada di klaster, `Service` Kubernetes dapat diekspos
dengan menggunakan `externalIP`. Trafik yang diarahkan ke klaster dengan IP eksternal
(sebagai destinasi IP), pada _port_ `Service` akan di-_route_ ke salah satu _endpoint_ `Service`.
_Value_ dari `externalIP` tidak diatur oleh Kubernetes dan merupakan tanggung jawab
dari administrator klaster.

Pada _ServiceSpec_, kamu dapat memberikan spesifikasi `externalIP` dan `ServiceTypes`.
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

Penggunaan _proxy_ _userspace_ untuk VIP dapat digunakan untuk skala kecil hingga menengah,
meski begitu hal ini tidak _scalable_ untuk klaster yang sangat besar dan memiliki ribuan `Service`.
Perhatikan [Desain proposal orisinil untuk _portal_](http://issue.k8s.io/1107) untuk informasi
lebih lanjut.

Penggunaan _proxy_ _userspace_ menghilangkan _source-IP_ dari _packet_ yang mengakses
sebuah `Service`. Hal ini membuat mekanisme _firewall_ menjadi sulit untuk diterapkan.
_Proxy_ `iptables` tidak menghilangkan _source IP_ yang berasal dari dalam klaster,
meski begitu, hal ini masih berimbas pada klien yang berasal dari `Service` dengan tipe
_load-balancer_ atau _node-port_.

_Field_ tipe didesain sebagai fungsionalitas yang berantai - setiap tingkatan
menambahkan tambahan pada tingkatansebelumnya. Hal ini tidak selalu berlaku bagi
semua penyedia layanan _cloud_ (misalnya saja Google Compute Engine tidak perlu
melakukan alokasi `NodePort` untuk membuat `LoadBalancer` bekerja sebagaimana mestinya,
hal ini berbeda dengan AWS yang memerlukan hal ini, setidaknya untuk API yang mereka miliki
saat ini).

## Pengerjaan lebih lanjut

Di masa mendatang, kami berencana untuk membuat _policy_ _proxy_ menjadi lebih
bervariasi dan bukan hanya _round robin_, misalnya saja _master-elected_ atau _sharded_.
Kami juga berharap bahwa beberapa `Service` bisa saja memiliki _load balancer_ yang sebenarnya,
suatu kasus dimana VIP akan secara langsung mengantarkan paket.

Kami ingin meningkatkan dukungan lebih lanjut untuk `Service` dengan tingkatan `Service` L7(HTTP).

Kami ingin memiliki mode _ingress_ yang lebih fleksibel untuk `Service` yang
mencakup mode `ClusterIP`, `NodePort`, dan `LoadBalancer` dan banyak lagi.

## Detail mendalam mengenai IP virtual

Informasi sebelumnya sudah cukup bagi sebagian orang yang hanya ingin menggunakan
_Service_. Meskipun begitu, terdapat banyak hal yang sebenarnya terjadi dan akan
sangat bermanfaat untuk dipelajari lebih lanjut.

### Menghindari _collison_

Salah satu filosofi Kubernetes adalah pengguna tidak mungkin menghadapi situasi
dimana apa yang mereka mengalami kegagalan tanpa adanya alasan yang jelas. Dalam kasus ini,
kita akan coba memahami lebih lanjut mengenai _network port_ - pengguna tidak seharusnya memilih
nomor _port_ jika hal itu memungkinkan terjadinya _collision_ dengan pengguna lainnya. Hal ini
merupakan mekanisme isolasi kegagalan.

Agar pengguna dapat menentukan nomor _port_ bagi `Service` mereka, kita harus
memastikan bahwa tidak ada dua `Service` yang mengalami _collision_. Kita melakukan
hal tersebut dengan cara melakukan alokasi alamat IP pada setiap `Service`.

Untuk memastikan setiap `Service` memiliki alamat IP yang unik, sebuah _allocator_
internal akan secara atomik melakukan pemetaan alokasi global di dalam _etcd_ ketika
membuat sebuah `Service` baru. Pemetaan objek harus tersedia pada _registry_ `Service`
dimana `Service` akan diberikan sebuah IP, jika tidak, proses pembuatan `Service` akan gagal
dan sebuah pesan akan memberikan informasi bahwa alamat IP tidak dapat dialokasikan.
Sebuah _backgroud_ _controller_ bertanggung jawab terhadap mekanisme pemetaan tersebut (migrasi
dari versi Kubernetes yang digunakan dalam _memory locking_) sekaligus melakukan pengecekan
terhadap _assignment_ yang tidak valid yang terjadi akibat intervensi administrator dan melakukan
penghapusan daftar IP yang dialokasikan tapi tidak digunakan oleh `Service` mana pun.

### IP dan VIP

Tidak seperti alamat IP `Pod`, yang akan di _route_ ke destinasi yang "pasti",
IP `Service` tidak mengarahkan _request_ hanya pada satu _host_.  Sebagai gantinya,
kita mneggunakan `iptables` (logika pemrosesan paket pada Linux) untuk melakukan definisi
alamat IP virtual yang secara transparan akan diarahkan sesuai kebutuhan. Ketika klien
dihubungkan pada VIP, trafik yang ada akan secara otomatis dialihkan pada _endpoint_ yang sesuai.
Variabel _environment_ dan DNS untuk `Service` terdiri dalam bentuk VIP dan _port_.

Kami mendukung tiga jenis mode _proxy_ - _userspace_, `iptables`, dan _ipvs_ yang memiliki
perbedaan cara kerja satu sama lainnya.

#### _Userspace_

Sebagai contoh, anggaplah kita memiliki aplikasi _image processing_ seperti yang sudah
disebutkan di atas. Ketika `Service` _backend_ dibuat, _master_ Kubernetes akan mengalokasikan
sebuah alamat IP virtual, misalnya 10.0.0.1. Dengan asumsi _port_ dari `Service` tersebut adalah _1234_,
maka `Service` tersebut akan diamati oleh semua _instance_ `kube-proxy` yang ada di klaster.
Ketika sebuah _proxy_ mendapati sebuah `Service` baru, _proxy_ tersebut akan membuka sebuah _port_
_acak_, menyediakan `iptables` yang mengarahkan VIP pada _port_ yang baru saja dibuat, dan mulai
koneksi pada _port_ tersebut.

Ketika sebuah klien terhubung ke VIP dan terdapat _rules_ `iptables`
yang diterapkan, paket akan diarahkan ke _port_ dari _proxy_ `Service` itu sendiri.
_Proxy_ `Service` akan memilih sebuah _backend_, dan mulai melakukan mekanisme _proxy_
trafik dari klien ke _backend_.

Dengan demikian, pemilik `Service` dapat memilih _port_ mana pun yang dia inginkan
tanpa adanya kemungkinan terjadinya _collision_. Klien dapat dengan mudah mengakses IP dan _port_,
tanpa harus mengetahui `Pod` mana yang sebenarnya diakses.

#### _Iptables_

Kembali, bayangkan apabila kita memiliki aplikasi _image processing_ seperti yang sudah
disebutkan di atas. Ketika `Service` _backend_ dibuat, _master_ Kubernetes akan mengalokasikan
sebuah alamat IP virtual, misalnya 10.0.0.1. Dengan asumsi _port_ dari `Service` tersebut adalah _1234_,
maka `Service` tersebut akan diamati oleh semua _instance_ `kube-proxy` yang ada di klaster.
Ketika sebuah _proxy_ mendapati sebuah `Service` baru, _proxy_ tersebut akan melakukan instalasi
serangkaian _rules_ `iptables` yang akan melakukan _redirect_ VIP ke _rules_ tiap `Service`. _Rules_
untuk tiap `Service` ini terkait dengan _rules_ tiap `Endpoints` yang mengarahkan (destinasi NAT)
ke _backend_.

Ketika sebuah klien terhubung ke VIP dan terdapat _rules _iptables
yang diterapkan. Sebuah _backend_ akan dipilih (hal ini dapat dilakukan berdasarkan _session affinity_
maupun secara _acak_) dan paket-paket yang ada akan diarahkan ke _backend_. Tidak seperti mekanisme
yang terjadi di _userspace_, paket-paket yang ada tidak pernah disalin ke _userspace_, `kube-proxy`
tidak harus aktif untuk menjamin kerja VIP, serta IP klien juga tidak perlu diubah.

Tahapan yang dijalankan sama dengan tahapan yang dijalankan ketika trafik masuk melalui sebuah _node-port_
atau _load-balancer_, meskipun pada dua kasus di atas klien IP tidak akan mengalami perubahan.

#### _Ipvs_

Operasi `iptables` berlangsung secara lambat pada klaster dengan skala besar (lebih dari 10.000 `Service`).
_IPVS_ didesain untuk mekanisme _load balance_ dan berbasis pada _hash tables_ yang berada di dalam _kernel_.
Dengan demikian kita dapat mendapatkan performa yang konsisten pada jumlah `Service` yang cukup besar dengan
menggunakan `kube-proxy` berbasis _ipvs_. Sementara itu, `kube-proxy` berbasis _ipvs_ memiliki algoritma
_load balance_ yang lebih bervariasi (misalnya saja _least conns_, _locality_, _weighted_, _persistence_).

## Objek API

_Service_ merupakan _resource_ _top-level_ pada API Kubernetes.
Penjelasan lebih lanjut mengenai objek API dapat ditemukan pada:
[objek API `Service`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core).

## Protokol yang didukung {#protokol-yang-tersedia}

### TCP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

Kamu dapat menggunakan TCP untuk `Service` dengan _type_ apa pun, dan protokol ini merupakan
protokol _default_ yang digunakan.

### UDP

{{< feature-state for_k8s_version="v1.0" state="stable" >}}

Kamu dapat menggunakan UDP untuk sebagian besar `Service`.
Untuk `Service` dengan _type=LoadBalancer_, dukungan terhadap UDP
bergantung pada penyedia layanan _cloud_ yang kamu gunakan.

### HTTP

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

Apabila penyedia layanan _cloud_ yang kamu gunakan mendukung, kamu dapat menggunakan
_Service_ dengan _type_ `LoadBalancer` untuk melakukan mekanisme _reverse_ _proxy_
bagi HTTP/HTTPS, dan melakukan _forwarding_ ke `Endpoints` dari _Service.

{{< note >}}
Kamu juga dapat menggunakan {{< glossary_tooltip term_id="ingress" >}} sebagai salah satu
alternatif penggunaan `Service` untuk HTTP/HTTPS.
{{< /note >}}

### Protokol PROXY

{{< feature-state for_k8s_version="v1.1" state="stable" >}}

Apabila penyedia layanan _cloud_ yang kamu gunakan mendukung, (misalnya saja, [AWS](/id/docs/concepts/cluster-administration/cloud-providers/#aws)),
_Service_ dengan _type_ `LoadBalancer` untuk melakukan konfigurasi _load balancer_
di luar Kubernetes sendiri, serta akan melakukan _forwarding_ koneksi yang memiliki prefiks
[protokol PROXY](https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

_Load balancer_ akan melakukan serangkaian inisiasi _octet_ yang memberikan
deskripsi koneksi yang datang, dengan bentuk yang menyerupai:

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```
yang kemudian diikuti data dari klien.

### SCTP

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Kubernetes memberikan dukungan bagi SCTP sebagai _value_ dari _definition_ yang ada pada
_Service_, `Endpoints`, `NetworkPolicy` dan `Pod` sebagai fitur _alpha_. Untuk mengaktifkan fitur ini,
administrator klaster harus mengaktifkan _feature gate_ _SCTPSupport_ pada _apiserver_, contohnya
`“--feature-gates=SCTPSupport=true,...”`. Ketika _fature gate_ ini diaktifkan, pengguna dapat
memberikan _value_ SCTP pada _field_ _protocol_ `Service`, `Endpoints`, `NetworkPolicy` dan `Pod`.
Kubernetes kemudian akan melakukan pengaturan agar jaringan yang digunakan agar jaringan tersebut menggunakan SCTP,
seperti halnya Kubernetes mengatur jaringan agar menggunakan TCP.

#### Perhatian {#kelemahan-penggunaan-sctp}

##### Dukungan untuk asoasiasi _multihomed_ SCTP {#kelemahan-sctp-multihomed}

Dukungan untuk asosiasi _multihomed_ SCTP membutuhkan _plugin_ CNI yang dapat memberikan
pengalokasian _multiple interface_ serta alamat IP pada sebuah `Pod`.

NAT untuk asosiasi _multihomed_ SCTP membutuhkan logika khusus pada modul kernel terkait.

##### `Service` dengan _type=LoadBalancer_ {#kelemahan-sctp-loadbalancer-service-type}

Sebuah `Service` dengan _type_ `LoadBalancer` dan protokol SCTP dapat dibuat
hanya jika implementasi _load balancer_ penyedia layanan _cloud_ menyediakan dukungan
bagi protokol SCTP. Apabila hal ini tidak terpenuhi, maka _request_ pembuatan _Servixe_ ini akan ditolak.
_Load balancer_ yang disediakan oleh penyedia layanan _cloud_ yang ada saat ini (_Azure_, _AWS_, _CloudStack_, _GCE_, _OpenStack_) tidak mendukung SCTP.

##### Windows {#kelemahan-sctp-windows-os}

SCTP tidak didukung pada _node_ berbasis Windows.

##### _Kube-proxy_ _userspace_ {#kelemahan-sctp-kube-proxy-userspace}

_Kube-proxy_ tidak mendukung manajemen asosiasi SCTP ketika hal ini dilakukan pada mode
_userspace_



## {{% heading "whatsnext" %}}


Baca [Bagaimana cara menghubungkan _Front End_ ke _Back End_ menggunakan sebuah `Service`](/docs/tasks/access-application-cluster/connecting-frontend-backend/).


