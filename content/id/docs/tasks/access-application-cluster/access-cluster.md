---
title: Mengakses Klaster
weight: 20
content_type: concept
---

<!-- overview -->

Topik ini membahas tentang berbagai cara untuk berinteraksi dengan klaster.




<!-- body -->

## Mengakses untuk pertama kalinya dengan kubectl

Saat mengakses API Kubernetes untuk pertama kalinya, kami sarankan untuk menggunakan
CLI Kubernetes, `kubectl`.

Untuk mengakses sebuah klaster, kamu perlu mengetahui lokasi klaster dan mempunyai kredensial untuk mengaksesnya.
Biasanya, ini secara otomatis diatur saat kamu mengikuti [Panduan persiapan](/docs/setup/), 
atau orang lain yang mengatur klaster dan memberikan kredensial dan lokasi kepadamu.

Periksa lokasi dan kredensial yang ada pada konfigurasi kubectl-mu melalui perintah ini:

```shell
kubectl config view
```

Beragam [contoh](/docs/user-guide/kubectl-cheatsheet) menyediakan pengantar penggunaan kubectl, dan dokumentasi lengkap dapat ditemukan di [kubectl manual](/docs/user-guide/kubectl-overview).

## Mengakses REST API secara langsung

Kubectl menangani pencarian dan autentikasi ke apiserver. 
Jika kamu ingin secara langsung mengakses REST API dengan klien HTTP seperti curl atau wget, atau peramban, ada beberapa cara untuk pencarian dan autentikasi:

  - Jalankan kubectl dalam mode proksi.
    - Pendekatan yang disarankan.
    - Menggunakan lokasi apiserver yang tersimpan.
    - Melakukan verifikasi identitas apiserver menggunakan sertifikat elektronik yang ditandatangani sendiri. Tidak memungkinkan adanya MITM.
    - Melakukan autentikasi ke apiserver.
    - Di masa depan, dimungkinkan dapat melakukan _load-balancing_ dan _failover_ yang cerdas dari sisi klien.
  - Penyediaan lokasi dan kredensial langsung ke klien http.
    - Pendekatan alternatif.
    - Bekerja dengan beberapa jenis kode klien dengan menggunakan proksi.
    - Perlu mengimpor sertifikat elektronik _root_ ke peramban kamu untuk melindungi dari MITM.

### Menggunakan kubectl proxy

Perintah berikut akan menjalankan kubectl dalam mode di mana ia bertindak sebagai proksi terbalik (_reverse proxy_).
Hal ini menangani pencarian dan autentikasi apiserver.
Jalankan seperti ini:

```shell
kubectl proxy --port=8080
```

Lihat [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands/#proxy) untuk lebih jelasnya.

Kemudian kamu dapat menjelajahi API-nya dengan curl, wget, atau peramban, ganti localhost dengan [::1] untuk IPv6, seperti ini:

```shell
curl http://localhost:8080/api/
```

Hasil keluarannya seperti ini:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```


### Tanpa menggunakan kubectl proxy

Gunakan `kubectl describe secret...` untuk mendapatkan token untuk akun servis (_service account_) `default` dengan grep/cut:

```shell
APISERVER=$(kubectl config view --minify | grep server | cut -f 2- -d ":" | tr -d " ")
SECRET_NAME=$(kubectl get secrets | grep ^default | cut -f1 -d ' ')
TOKEN=$(kubectl describe secret $SECRET_NAME | grep -E '^token' | cut -f2 -d':' | tr -d " ")

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

Hasil keluarannya seperti ini:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

Menggunakan `jsonpath`:

```shell
APISERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')
SECRET_NAME=$(kubectl get serviceaccount default -o jsonpath='{.secrets[0].name}')
TOKEN=$(kubectl get secret $SECRET_NAME -o jsonpath='{.data.token}' | base64 --decode)

curl $APISERVER/api --header "Authorization: Bearer $TOKEN" --insecure
```

Hasil keluarannya seperti ini:

```json
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "10.0.1.149:443"
    }
  ]
}
```

Contoh di atas menggunakan _flag_ `--insecure`. Hal ini membuatnya rentan terhadap serangan MITM. 
Ketika kubectl mengakses klaster, kubectl menggunakan sertifikat elektronik _root_ yang tersimpan dan sertifikat elektronik klien untuk mengakses server. 
(Sertifikat-sertifikat elektronik tersebut diinstal di direktori `~/.kube`). Karena sertifikat elektronik klaster biasanya ditandatangani sendiri, 
mungkin diperlukan konfigurasi khusus untuk membuat klien HTTP kamu menggunakan sertifikat elektronik root.

Pada beberapa klaster, apiserver tidak memerlukan autentikasi; mungkin apiserver tersebut meladen (_serve_) di localhost, atau dilindungi oleh sebuah dinding api (_firewall_). 
Tidak ada standar untuk ini. [Mengonfigurasi Akses ke API](/docs/reference/access-authn-authz/controlling-access/) menjelaskan bagaimana admin klaster dapat mengonfigurasi hal ini. 
Pendekatan semacam itu dapat bertentangan dengan dukungan ketersediaan tinggi (_high-availability_) pada masa depan.

## Akses terprogram ke API

Kubernetes secara resmi mendukung pustaka (_library_) klien [Go](#klien-go) dan [Python](#klien-python).

### Klien Go

* Untuk mendapatkan pustakanya, jalankan perintah berikut: `go get k8s.io/client-go@kubernetes-<kubernetes-version-number>`, lihat [INSTALL.md](https://github.com/kubernetes/client-go/blob/master/INSTALL.md#for-the-casual-user) untuk instruksi instalasi yang lebih detail. Lihat [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go#compatibility-matrix) untuk melihat versi yang didukung.
* Tulis aplikasi dengan menggunakan klien client-go. Perhatikan bahwa client-go mendefinisikan objek APInya sendiri, jadi jika perlu, silakan impor definisi API dari client-go daripada dari repositori utama, misalnya, `import "k8s.io/client-go/kubernetes"`.

Klien Go dapat menggunakan [berkas kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) yang sama dengan yang digunakan oleh CLI kubectl untuk mencari dan mengautentikasi ke apiserver. Lihat [contoh ini](https://git.k8s.io/client-go/examples/out-of-cluster-client-configuration/main.go).

Jika aplikasi ini digunakan sebagai Pod di klaster, silakan lihat [bagian selanjutnya](#mengakses-api-dari-pod).

### Klien Python

Untuk menggunakan [klien Python](https://github.com/kubernetes-client/python), jalankan perintah berikut: `pip install kubernetes`. Lihat [halaman Pustaka Klien Python](https://github.com/kubernetes-client/python) untuk opsi instalasi lainnya.

Klien Python dapat menggunakan [berkas kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) yang sama dengan yang digunakan oleh CLI kubectl untuk mencari dan mengautentikasi ke apiserver. Lihat [contoh](https://github.com/kubernetes-client/python/tree/master/examples).

### Bahasa lainnya

Ada [pustaka klien](/docs/reference/using-api/client-libraries/) untuk mengakses API dari bahasa lain.
Lihat dokumentasi pustaka lain untuk melihat bagaimana mereka melakukan autentikasi.

## Mengakses API dari Pod

Saat mengakses API dari Pod, pencarian dan autentikasi ke apiserver agak berbeda.

Cara yang disarankan untuk menemukan apiserver di dalam Pod adalah dengan nama DNS `kubernetes.default.svc`, 
yang akan mengubah kedalam bentuk Service IP yang pada gilirannya akan dialihkan ke apiserver.

Cara yang disarankan untuk mengautentikasi ke apiserver adalah dengan kredensial [akun servis](/id/docs/tasks/configure-pod-container/configure-service-account/). 
Oleh kube-system, Pod dikaitkan dengan sebuah akun servis (_service account_), dan sebuah kredensial (token) untuk akun servis (_service account_) tersebut ditempatkan ke pohon sistem berkas (_file system tree_) dari setiap Container di dalam Pod tersebut, 
di `/var/run/secrets/kubernetes.io/serviceaccount/token`.

Jika tersedia, bundel sertifikat elektronik ditempatkan ke pohon sistem berkas dari setiap Container di `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`, 
dan itu akan digunakan untuk memverifikasi sertifikat elektronik yang digunakan apiserver untuk meladen.

Terakhir, Namespace `default` yang akan digunakan untuk operasi API _namespaced_ ditempatkan di dalam berkas `/var/run/secrets/kubernetes.io/serviceaccount/namespace` di dalam setiap Container.

Dari dalam Pod, cara yang disarankan untuk menghubungi API adalah:

  - Jalankan `kubectl proxy` pada Container _sidecar_ di dalam Pod, atau sebagai proses _background_ di dalam Container.
    Perintah tersebut memproksi API Kubernetes pada antarmuka localhost Pod tersebut, sehingga proses lain dalam Container apa pun milik Pod dapat mengaksesnya.
  - Gunakan pustaka klien Go, dan buatlah sebuah klien menggunakan fungsi `rest.InClusterConfig()` dan `kubernetes.NewForConfig()`. 
    Mereka menangani pencarian dan autentikasi ke apiserver. [contoh](https://git.k8s.io/client-go/examples/in-cluster-client-configuration/main.go)

Pada setiap kasus, kredensial Pod digunakan untuk berkomunikasi secara aman dengan apiserver.

## Mengakses servis yang berjalan di klaster

Bagian sebelumnya menjelaskan tentang menghubungi server API Kubernetes. Bagian ini menjelaskan tentang menghubungi servis lain yang berjalan di klaster Kubernetes.
Di Kubernetes, semua [Node](/docs/admin/node), [Pod](/docs/user-guide/pods), dan [Service](/docs/user-guide/services) memiliki IP sendiri.
Dalam banyak kasus, IP Node, IP Pod, dan beberapa IP Service pada sebuah klaster tidak dapat dirutekan, sehingga mereka tidak terjangkau dari mesin di luar klaster, seperti mesin desktop kamu.

### Cara untuk terhubung

Kamu memiliki beberapa opsi untuk menghubungi Node, Pod, dan Service dari luar klaster:

  - Mengakses Service melalui IP publik.
    - Gunakan Service dengan tipe `NodePort` atau `LoadBalancer` untuk membuat Service dapat dijangkau di luar klaster. Lihat dokumentasi [Service](/docs/user-guide/services) dan perintah [kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose).
    - Bergantung pada lingkungan klaster kamu, hal ini mungkin hanya mengekspos Service ke jaringan perusahaan kamu, atau mungkin mengeksposnya ke internet. Pikirkan apakah Service yang diekspos aman atau tidak. Apakah layanan di balik Service tersebut melakukan autentikasinya sendiri?
    - Tempatkan Pod di belakang Service. Untuk mengakses satu Pod tertentu dari sekumpulan replika, misalnya untuk pengawakutuan (_debugging_), letakkan label unik di Pod dan buat Service baru yang memilih label ini.
    - Pada kebanyakan kasus, pengembang aplikasi tidak perlu langsung mengakses Node melalui IP Node mereka.
  - Akses Service, Node, atau Pod menggunakan _Verb_ Proxy.
    - Apakah autentikasi dan otorisasi apiserver dilakukan sebelum mengakses Service jarak jauh. Gunakan ini jika Service tersebut tidak cukup aman untuk diekspos ke internet, atau untuk mendapatkan akses ke porta (_port_) pada IP Node, atau untuk pengawakutuan.
    - Proksi dapat menyebabkan masalah untuk beberapa aplikasi web.
    - Hanya bekerja pada HTTP/HTTPS.
    - Dijelaskan [di sini](#url-proxy-apiserver-secara-manual).
  - Akses dari Node atau Pod di klaster.
    - Jalankan Pod, kemudian hubungkan ke sebuah _shell_ di dalamnya menggunakan [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec). Hubungi Node, Pod, dan Service lain dari _shell_ itu.
    - Beberapa klaster memungkinkan kamu untuk melakukan SSH ke sebuah Node di dalam klaster. Dari sana, kamu mungkin dapat mengakses Service-Service klaster. Hal ini merupakan metode yang tidak standar, dan akan bekerja pada beberapa klaster tetapi tidak pada yang lain. Peramban dan perkakas lain mungkin diinstal atau tidak. DNS Klaster mungkin tidak berfungsi.

### Menemukan Service bawaan (_builtin_)

Biasanya, ada beberapa Service yang dimulai pada sebuah klaster oleh kube-system. Dapatkan daftarnya dengan perintah `kubectl cluster-info`:

```shell
kubectl cluster-info
```

Keluarannya mirip seperti ini:

```
Kubernetes master is running at https://104.197.5.247
elasticsearch-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster is running at https://104.197.5.247/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

Ini menunjukkan URL _proxy-verb_ untuk mengakses setiap Service.
Misalnya, klaster ini mempunyai pencatatan log pada level klaster (_cluster-level logging_) yang aktif (menggunakan Elasticsearch), yang dapat dicapai di `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` jika kredensial yang sesuai diberikan.
Pencatatan log dapat pula dicapai dengan sebuah proksi _kubectl_, misalnya di:
`http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.
(Lihat [di atas](#mengakses-rest-api-secara-langsung) untuk panduan bagaimana cara meneruskan kredensial atau menggunakan `kubectl proxy`.)

#### Membuat URL proksi apiserver secara manual

Seperti disebutkan di atas, kamu menggunakan perintah `kubectl cluster-info` untuk mendapatkan URL proksi suatu Service.
Untuk membuat URL proksi yang memuat _endpoint-endpoint_ Service, sufiks, dan parameter, kamu cukup menambahkan ke URL proksi Service:
`http://`*`alamat_kubernetes_master`*`/api/v1/namespaces/`*`nama_namespace`*`/services/`*`nama_servis[:nama_porta]`*`/proxy`

Jika kamu belum menentukan nama untuk porta kamu, kamu tidak perlu memasukan _nama_porta_ di URL.

Secara bawaan, server API memproksi ke Service kamu menggunakan HTTP. Untuk menggunakan HTTPS, awali nama Service dengan `https:`:
`http://`*`alamat_kubernetes_master`*`/api/v1/namespaces/`*`nama_namespace`*`/services/`*`https:nama_servis:[nama_porta]`*`/proxy`

Format yang didukung untuk segmen nama URL adalah:

* `<nama_servis>` - Memproksi ke porta bawaan atau porta tanpa nama menggunakan HTTP
* `<nama_servis>:<nama_porta>` - Memproksi ke porta yang telah ditentukan menggunakan HTTP
* `https:<nama_servis>:` - Memproksi ke porta bawaan atau porta tanpa nama menggunakan HTTPS (perhatikan tanda adanya titik dua)
* `https:<nama_servis>:<nama_porta>` - proksi ke porta yang telah ditentukan menggunakan https

##### Contoh

 * Untuk mengakses _endpoint_ Service Elasticsearch `_search?q=user:kimchy`, kamu dapat menggunakan:   `http://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy`
 * Untuk mengakses informasi kesehatan klaster Elasticsearch `_cluster/health?pretty=true`, kamu dapat menggunakan:   `https://104.197.5.247/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true`

```json
{
  "cluster_name" : "kubernetes_logging",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "active_primary_shards" : 5,
  "active_shards" : 5,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 5
}
```

### Menggunakan peramban web untuk mengakses Service yang berjalan di klaster

Kamu mungkin dapat memasukkan URL proksi apiserver ke bilah alamat peramban. Namun:

  - Peramban web biasanya tidak dapat menerima token, jadi kamu mungkin perlu menggunakan autentikasi dasar/_basic auth_ (kata sandi). Apiserver dapat dikonfigurasi untuk menerima autentikasi dasar, tetapi klaster kamu mungkin belum dikonfigurasi untuk menerima autentikasi dasar.
  - Beberapa aplikasi web mungkin tidak berfungsi, terutama yang memiliki javascript pada sisi klien yang digunakan untuk membuat URL sedemikian sehingga ia tidak mengetahui adanya prefiks jalur (_path_) proksi (`/proxy`).

## Meminta pengalihan

Kemampuan pengalihan telah usang (_deprecated_) dan dihapus. Silakan gunakan proksi (lihat di bawah) sebagai gantinya.

## Begitu Banyaknya Proksi

Ada beberapa proksi berbeda yang mungkin kamu temui saat menggunakan Kubernetes:

1.  [Proksi kubectl](#mengakses-rest-api-secara-langsung):

    - berjalan di desktop pengguna atau di Pod
    - memproksi dari sebuah alamat localhost ke apiserver Kubernetes
    - dari klien ke proksi menggunakan HTTP
    - dari proksi ke apiserver menggunakan HTTPS
    - menemukan apiserver-nya
    - menambahkan _header-header_ autentikasi

1.  [Proksi apiserver](#menemukan-service-bawaan-builtin):

    - merupakan sebuah _bastion_ yang dibangun ke dalam apiserver
    - menghubungkan pengguna di luar klaster ke IP klaster yang mungkin tidak dapat dijangkau
    - berjalan dalam proses apiserver
    - dari klien ke proksi menggunakan HTTPS (atau HTTP jika apiserver dikonfigurasi)
    - dari proksi ke target dapat menggunakan HTTP atau HTTPS seperti yang dipilih oleh proksi menggunakan informasi yang tersedia
    - dapat digunakan untuk menjangkau Node, Pod, atau Service
    - melakukan _load balancing_ saat digunakan untuk menjangkau sebuah Service

1.  [kube-proxy](/id/docs/concepts/services-networking/service/#ips-and-vips):

    - berjalan di setiap Node
    - memproksi UDP dan TCP
    - tidak mengerti HTTP
    - menyediakan _load balancing_
    - hanya digunakan untuk menjangkau Service

1.  Sebuah Proksi/_Load-balancer_ di depan apiserver:

    - keberadaan dan implementasi bervariasi dari satu klaster ke klaster lainnya (mis. nginx)
    - terletak di antara semua klien dan satu atau lebih apiserver
    - bertindak sebagai _load balancer_ jika terdapat beberapa apiserver.

1.  _Cloud Load Balancer_ pada Service eksternal:

    - disediakan oleh beberapa penyedia layanan _cloud_ (mis. AWS ELB, Google Cloud Load Balancer)
    - dibuat secara otomatis ketika Service Kubernetes memiliki tipe `LoadBalancer`
    - hanya menggunakan UDP/TCP
    - implementasi bervariasi berdasarkan penyedia layanan _cloud_.

Pengguna Kubernetes biasanya tidak perlu khawatir tentang apa pun selain dua jenis pertama. Admin klaster biasanya akan memastikan bahwa tipe yang terakhir telah diatur dengan benar.


