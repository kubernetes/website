---
title: Penyedia Layanan Cloud
content_template: templates/concept
weight: 30
---

{{% capture overview %}}
Laman ini akan menjelaskan bagaimana cara mengelola Kubernetes yang berjalan pada penyedia layanan cloud tertentu.
{{% /capture %}}


{{% capture body %}}
### Kubeadm
[Kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) merupakan salah satu cara yang banyak digunakan untuk membuat kluster Kubernetes.
Kubeadm memiliki beragam opsi untuk mengatur konfigurasi spesifik untuk penyedia layanan cloud. Salah satu contoh yang biasa digunakan pada penyedia cloud *in-tree* yang dapat diatur dengan kubeadm adalah sebagai berikut:

```yaml
apiVersion: kubeadm.k8s.io/v1beta1
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
---
apiVersion: kubeadm.k8s.io/v1beta1
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
apiServer:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
controllerManager:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
```

Penyedia layanan cloud *in-tree* biasanya membutuhkan `--cloud-provider` dan `--cloud-config` yang ditentukan sebelumnya pada *command lines* untuk [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) dan
[kubelet](/docs/admin/kubelet/). Konten dari *file* yang ditentukan pada `--cloud-config` untuk setiap provider akan dijabarkan di bawah ini.

Untuk semua penyedia layanan cloud eksternal, silakan ikuti instruksi pada repositori masing-masing penyedia layanan.

## AWS
Bagian ini akan menjelaskan semua konfigurasi yang dapat diatur saat menjalankan Kubernetes pada Amazon Web Services.

### Nama Node

Penyedia layanan cloud AWS menggunakan nama DNS privat dari *instance* AWS sebagai nama dari objek Kubernetes Node.

### *Load Balancer*
Kamu dapat mengatur [load balancers eksternal](/docs/tasks/access-application-cluster/create-external-load-balancer/) sehingga dapat menggunakan fitur khusus AWS dengan mengatur anotasi seperti di bawah ini.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example
  namespace: kube-system
  labels:
    run: example
  annotations:
     service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:xx-xxxx-x:xxxxxxxxx:xxxxxxx/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx #ganti nilai ini
     service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
spec:
  type: LoadBalancer
  ports:
  - port: 443
    targetPort: 5556
    protocol: TCP
  selector:
    app: example
```

Pengaturan lainnya juga dapat diaplikasikan pada layanan *load balancer* di AWS dengan menggunakan anotasi-anotasi. Berikut ini akan dijelaskan anotasi yang didukung oleh AWS ELB:

* `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`: Digunakan untuk menentukan interval pengeluaran log akses.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`: Digunakan untuk mengaktifkan atau menonaktifkan log akses.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`: Digunakan untuk menentukan nama *bucket* S3 log akses.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`: Digunakan untuk menentukan prefix *bucket* S3 log akses.
* `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags`: Digunakan untuk menentukan daftar tag tambahan pada ELB dengan menggunakan parameter *key-value*. Contoh: `"Key1=Val1,Key2=Val2,KeyNoVal1=,KeyNoVal2"`.
* `service.beta.kubernetes.io/aws-load-balancer-backend-protocol`: Digunakan untuk menentukan protokol yang digunakan oleh *backend* (pod) di belakang *listener*. Jika diset ke `http` (default) atau `https`, maka akan dibuat HTTPS *listener* yang akan mengakhiri koneksi dan meneruskan *header*. Jika diset ke `ssl` atau `tcp`, maka akan digunakan "raw" SSL *listener*. Jika diset ke `http` dan `aws-load-balancer-ssl-cert` tidak digunakan, maka akan digunakan HTTP *listener*.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`: Digunakan untuk meminta *secure* *listener*. Nilai yang dimasukkan adalah sertifikat ARN yang valid. Info lebih lanjut lihat [ELB Listener Config](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html) CertARN merupakan IAM atau CM certificate ARN, contoh: `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`: Digunakan untuk mengaktifkan atau menonaktfkan *connection draining*.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`: Digunakan untuk menentukan *connection draining timeout*.
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`: Digunakan untuk menentukan *idle connection timeout*.
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`: Digunakan untuk mengaktifkan atau menonaktifkan *cross-zone load balancing*.
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`: Digunakan untuk menentukan grup keamanan yang akan ditambahkan pada ELB yang dibuat.
* `service.beta.kubernetes.io/aws-load-balancer-internal`: Digunakan sebagai indikasi untuk menggunakan internal ELB.
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`: Digunakan untuk mengaktifkan *proxy protocol* pada ELB. Saat ini hanya dapat menerima nilai `*` yang berarti mengaktifkan *proxy protocol* pada semua ELB *backends*. Di masa mendatang kamu juga dapat mengatur agar *proxy protocol* hanya aktif pada *backends* tertentu..
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`: Digunakan untuk menentukan daftar port--yang dipisahkan koma-- yang akan menggunakan SSL/HTTPS *listeners*. Nilai *default* yaitu `*` (semua).

Informasi anotasi untuk AWS di atas diperoleh dari komentar pada [aws.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/providers/aws/aws.go)

## Azure

### Nama Node

Penyedia layanan cloud Azure menggunakan *hostname* dari *node* (yang ditentukan oleh kubelet atau menggunakan `--hostname-override`) sebagai nama dari objek Kubernetes Node.
Perlu diperhatikan bahwa nama Kubernetes Node harus sesuai dengan nama Azure VM.

## CloudStack

### Nama Node

Penyedia layanan cloud CloudStack menggunakan *hostname* dari *node* (yang ditentukan kubelet atau menggunakan `--hostname-override`) sebagai nama dari objek Kubernetes Node.
Perlu diperhatikan bahwa nama Kubernetes Node harus sesuai dengan nama Cloudstack VM.

## GCE

### Nama Node

Penyedia layanan cloud GCE menggunakan *hostname* dari *node* (yang ditentukan kubelet atau menggunakan `--hostname-override`) sebagai nama dari objek Kubernetes Node.
Perlu diperhatikan bahwa segmen pertama dari nama Kubernetes Node harus sesuai dengan nama *instance* GCE (contoh: sebuah *node* dengan nama `kubernetes-node-2.c.my-proj.internal` harus sesuai dengan *instance* yang memiliki nama `kubernetes-node-2`).

## OpenStack
Bagian ini akan menjelaskan semua konfigurasi yang dapat diatur saat menggunakan OpenStack dengan Kubernetes.

### Nama Node

Penyedia layanan cloud OpenStack menggunakan nama *instance* (yang diperoleh dari metadata OpenStack) sebagai nama objek Kubernetes Node.
Perlu diperhatikan bahwa nama *instance* harus berupa nama Kubernetes Node yang valid agar kubelet dapat mendaftarkan objek Node-nya.

### Layanan

Penyedia layanan cloud OpenStack menggunakan beragam layanan OpenStack yang tersedia sebagai *underlying cloud* agar dapat mendukung Kubernetes:

| Layanan                  | Versi API      | Wajib    |
|--------------------------|----------------|----------|
| Block Storage (Cinder)   | V1†, V2, V3    | Tidak    |
| Compute (Nova)           | V2             | Tidak    |
| Identity (Keystone)      | V2‡,  V3       | Ya       |
| Load Balancing (Neutron) | V1§, V2        | Tidak    |
| Load Balancing (Octavia) | V2             | Tidak    |

† Block Storage V1 API tidak lagi didukung, dukungan Block Storage V3 API telah
ditambahkan pada Kubernetes 1.9.

‡ Identity V2 API tidak lagi didukung dan akan dihapus oleh penyedia layanan
pada rilis mendatang. Pada rilis "Queens", OpenStack tidak lagi mengekspos
Identity V2 API.

§ Dukungan Load Balancing V1 API telah dihapus pada Kubernetes 1.9.

*Service discovery* dilakukan dengan menggunakan katalog layanan/servis (*service catalog*) yang diatur oleh
OpenStack Identity (Keystone) menggunakan `auth-url` yang ditentukan pada konfigurasi
penyedia layanan. Penyedia layanan akan menurunkan fungsionalitas secara perlahan saat layanan OpenStack selain Keystone tidak tersedia dan akan menolak dukungan fitur yang terdampak. Beberapa fitur tertentu dapat diaktifkan atau dinonaktfikan tergantung dari ekstensi yang diekspos oleh Neutron pada *underlying cloud*.

### cloud.conf
Kubernetes berinteraksi dengan OpenStack melalui *file* cloud.conf. *File* ini akan menyuplai Kubernetes dengan kredensial dan lokasi dari Openstack *auth endpoint*.
Kamu dapat membuat *file* cloud.conf dengan menambahkan rincian berikut ini di dalam *file*:

#### Konfigurasi pada umumnya
Berikut ini merupakan contoh dan konfigurasi yang biasa digunakan dan akan mencakup semua pilihan yang paling sering dibutuhkan. *File* ini akan merujuk pada *endpoint* dari Keystone OpenStack, serta menyediakan rincian bagaimana cara mengautentikasi dengannya, termasuk cara mengatur *load balancer*:

```yaml
[Global]
username=user
password=pass
auth-url=https://<keystone_ip>/identity/v3
tenant-id=c869168a828847f39f7f06edd7305637
domain-id=2a73b8f597c04551a0fdc8e95544be8a

[LoadBalancer]
subnet-id=6937f8fa-858d-4bc9-a3a5-18d2c957166a
```

##### Global
Konfigurasi untuk penyedia layanan OpenStack berikut ini akan membahas bagian konfigurasi global sehingga harus berada pada bagian `[Global]` dari *file* `cloud.conf`:

* `auth-url` (Wajib): URL dari API keystone digunakan untuk autentikasi. ULR ini dapat ditemukan pada bagian Access dan Security > API Access > Credentials di laman panel kontrol OpenStack.
* `username` (Wajib): Merujuk pada username yang dikelola keystone.
* `password` (Wajib): Merujuk pada kata sandi yang dikelola keystone.
* `tenant-id` (Wajib): Digunakan untuk menentukan id dari *project* tempat kamu membuat *resources*.
* `tenant-name` (Opsional): Digunakan untuk menentukan nama dari *project* tempat kamu ingin membuat *resources*.
* `trust-id` (Opsional): Digunakan untuk menentukan *identifier of the trust* untuk digunakan
  sebagai otorisasi. Suatu *trust* merepresentasikan otorisasi dari suatu pengguna (*the trustor*) untuk didelegasikan
  pada pengguna lain (*the trustee*), dan dapat digunakan oleh *trustee*
  berperan sebagai *the trustor*. *Trust* yang tersedia dapat ditemukan pada *endpoint*
  `/v3/OS-TRUST/trusts` dari Keystone API.
* `domain-id` (Opsional): Digunakan untuk menentukan id dari domain tempat *user* kamu berada.
* `domain-name` (Opsional): Digunakan untuk menentukan nama dari domain tempat *user* kamu berada.
* `region` (Opsional): Digunakan untuk menentukan *identifier* dari region saat digunakan pada
  multi-region OpenStack cloud. Sebuah region merupakan pembagian secara umum dari *deployment* OpenStack. Meskipun region tidak wajib berkorelasi secara geografis, suatu *deployment* dapat menggunakan nama geografis sebagai region *identifier* seperti
  `us-east`. Daftar region yang tersedia dapat ditemukan pada *endpoint* `/v3/regions`
  dari Keystone API.
* `ca-file` (Optional): Digunakan untuk menentukan path dari *file* *custom* CA.

Saat menggunakan Keystone V3 - yang mengganti istilah *tenant* menjadi *project* - nilai `tenant-id`
akan secara otomatis dipetakan pada *project* yang sesuai di API.

#####  *Load Balancer*
Konfigurasi berikut ini digunakan untuk mengatur *load
balancer* dan harus berada pada bagian `[LoadBalancer]` dari *file* `cloud.conf`:

* `lb-version` (Opsional): Digunakan untuk menonaktifkan pendeteksian versi otomatis. Nilai
  yang valid yaitu `v1` atau `v2`. Jika tidak ditentukan, maka pendeteksian otomatis akan
  memilih versi tertinggi yang didukung dari *underlying* OpenStack
  cloud.
* `use-octavia` (Opsional): Digunakan untuk menentukan apakah akan menggunakan *endpoint* dari layanan Octavia LBaaS. Nilai yang valid yaitu `true` atau `false`. Jika diset nilai `true` namun Octavia LBaaS V2 tidak dapat ditemukan, maka *load balancer* akan kembali menggunakan *endpoint* dari Neutron LBaaS V2. Nilai *default* adalah `false`.
* `subnet-id` (Opsional): Digunakan untuk menentukan id dari subnet yang ingin kamu
  buat *load balancer* di dalamnya. Nilai id ini dapat dilihat pada Network > Networks. Klik pada
  jaringan yang sesuai untuk melihat subnet di dalamnya.
* `floating-network-id` (Opsional): Jika diset, maka akan membuat *floating* IP
  untuk *load balancer*.
* `lb-method` (Opsional): Digunakan untuk menentukan algoritma pendistribusian
  yang akan digunakan. Nilai yang valid yaitu
  `ROUND_ROBIN`, `LEAST_CONNECTIONS`, atau `SOURCE_IP`. Jika tidak diset, maka akan
  menggunakan algoritma *default* yaitu `ROUND_ROBIN`.
* `lb-provider` (Opsional): Digunakan untuk menentukan penyedia dari *load balancer*.
  Jika tidak ditentukan, maka akan menggunakan penyedia *default* yang ditentukan pada Neutron.
* `create-monitor` (Opsional): Digunakan untuk menentukan apakah akan membuat atau tidak monitor kesehatan
  untuk Neutron *load balancer*. Nilai yang valid yaitu `true` dan `false`.
  Nilai *default* adalah `false`. Jika diset nilai `true` maka `monitor-delay`,
  `monitor-timeout`, dan `monitor-max-retries` juga harus diset.
* `monitor-delay` (Opsional): Waktu antara pengiriman *probes* ke
  anggota dari *load balancer*. Mohon pastikan kamu memasukkan waktu yang valid. Nilai waktu yang valid yaitu "ns", "us" (atau "µs"), "ms", "s", "m", "h"
* `monitor-timeout` (Opsional): Waktu maksimum dari monitor untuk menunggu
  balasan ping sebelum *timeout*. Nilai ini harus lebih kecil dari nilai *delay*.
  Mohon pastikan kamu memasukkan waktu yang valid. Nilai waktu yang valid yaitu "ns", "us" (atau "µs"), "ms", "s", "m", "h"
* `monitor-max-retries` (Opsional): Jumlah gagal ping yang diizinkan sebelum
  mengubah status anggota *load balancer* menjadi INACTIVE. Harus berupa angka
  antara 1 dan 10.
* `manage-security-groups` (Opsional): Digunakan untuk menentukan apakah *load balancer*
  akan mengelola aturan grup keamanan sendiri atau tidak. Nilai yang valid
  adalah `true` dan `false`. Nilai *default* adalah `false`. Saat diset ke `true` maka
  nilai `node-security-group` juga harus ditentukan.
* `node-security-group` (Opsional): ID dari grup keamanan yang akan dikelola.

##### *Block Storage*
Konfigurasi untuk penyedia layanan OpenStack berikut ini digunakan untuk mengatur penyimpanan blok atau *block storage*
dan harus berada pada bagian `[BlockStorage]` dari *file* `cloud.conf`:

* `bs-version` (Opsional): Digunakan untuk menonaktifkan fitur deteksi versi otomatis. Nilai
  yang valid yaitu `v1`, `v2`, `v3` dan `auto`. Jika diset ke `auto` maka pendeteksian versi
  otomatis akan memilih versi tertinggi yang didukung oleh *underlying*
  OpenStack cloud. Nilai *default* jika tidak diset adalah `auto`.
* `trust-device-path` (Opsional): Pada umumnya nama *block device* yang ditentukan
  oleh Cinder (contoh: `/dev/vda`) tidak dapat diandalkan. Opsi ini dapat mengatur hal
  tersebut. Jika diset ke `true` maka akan menggunakan nama *block device* yang ditentukan
  oleh Cinder. Nilai *default* adalah `false` yang berarti *path* dari *device* akan ditentukan
  oleh nomor serialnya serta pemetaan dari `/dev/disk/by-id`, dan ini merupakan
  cara yang direkomendasikan.
* `ignore-volume-az` (Opsional): Digunakan untuk mengatur penggunaan *availability zone* saat
  menautkan volumes Cinder. Jika Nova dan Cinder memiliki *availability
  zones* yang berbeda, opsi ini harus diset `true`. Skenario seperti ini yang umumnya terjadi, yaitu
  saat terdapat banyak Nova *availability zones* namun hanya ada satu Cinder *availability zone*.
  Nilai *default* yaitu `false` digunakan untuk mendukung penggunaan pada rilis terdahulu,
  tetapi nilai ini dapat berubah pada rilis mendatang.

Jika menjalankan Kubernetes dengan versi <= 1.8 pada OpenStack yang menggunakan *paths* alih-alih
menggunakan port untuk membedakan antara *endpoints*, maka mungkin dibutuhkan untuk
secara eksplisit mengatur parameter `bs-version`. Contoh *endpoint* yang berdasarkan *path* yaitu
`http://foo.bar/volume` sedangkan endpoint yang berdasarkan port memiliki bentuk seperti ini
`http://foo.bar:xxx`.

Pada lingkungan yang menggunakan *endpoint* berdasarkan *path* dan Kubernetes menggunakan logika deteksi-otomatis yang lama, maka *error* `BS API version autodetection failed.` akan muncul saat mencoba
melepaskan volume. Untuk mengatasi isu ini, dimungkinkan
untuk memaksa penggunaan Cinder API versi 2 dengan menambahkan baris berikut ini pada konfigurasi penyedia cloud:

```yaml
[BlockStorage]
bs-version=v2
```

##### Metadata

Konfigurasi untuk OpenStack berikut ini digunakan untuk mengatur metadata dan
harus berada pada bagian `[Metadata]` dari *file* `cloud.conf`:

* `search-order` (Opsional): Konfigurasi berikut ini digunakan untuk mengatur bagaimana
  cara provider mengambil metadata terkait dengan *instance* yang dijalankannya. Nilai
  *default* yaitu `configDrive,metadataService` yang berarti provider akan mengambil
  metadata terkait *instance* dari *config drive* terlebih dahulu jika tersedia, namun
  jika tidak maka akan menggunakan layanan metadata. Nilai alternatif lainnya yaitu:
  * `configDrive` - Hanya mengambil metadata *instance* dari *config
    drive*.
  * `metadataService` - Hanya mengambil data *instance* dari layanan
    metadata.
  * `metadataService,configDrive` - Mengambil metadata *instance* dari layanan metadata terlebih
    dahulu jika tersedia, jika tidak maka akan mengambil dari *config drive*.

  Pengaturan ini memang sebaiknya dilakukan sebab metadata pada *config drive* bisa saja lambat laun akan kedaluwarsa, sedangkan layanan metadata akan selalu menyediakan metadata yang paling mutakhir. Tidak semua penyedia layanan cloud OpenStack menyediakan kedua layanan *config drive* dan layanan metadata dan mungkin hanya salah satu saja
  yang tersedia. Oleh sebab itu nilai *default* diatur agar dapat memeriksa keduanya.

##### Router

Konfigurasi untuk Openstack berikut ini digunakan untuk mengatur *plugin* jaringan Kubernetes [kubenet]
dan harus berada pada bagian `[Router]` dari *file* `cloud.conf`:

* `router-id` (Opsional): Jika Neutron pada *underlying cloud* mendukung ekstensi
  `extraroutes` maka gunakan `router-id` untuk menentukan router mana yang akan ditambahkan rute di dalamnya.
  Router yang dipilih harus menjangkau jaringan privat tempat *node* kluster berada
  (biasanya hanya ada satu jaringan *node*, dan nilai ini harus nilai dari *default* router
  pada jaringan *node*).  Nilai ini dibutuhkan untuk dapat menggunakan [kubenet] pada OpenStack.

[kubenet]: /docs/concepts/cluster-administration/network-plugins/#kubenet

{{% /capture %}}

## OVirt

### Nama Node

Penyedia layanan cloud OVirt menggunakan *hostname* dari *node* (yang ditentukan kubelet atau menggunakan `--hostname-override`) sebagai nama dari objek Kubernetes Node.
Perlu diperhatikan bahwa nama Kubernetes Node harus sesuai dengan VM FQDN (yang ditampilkan oleh OVirt di bawah `<vm><guest_info><fqdn>...</fqdn></guest_info></vm>`)

## Photon

### Nama Node

Penyedia layanan cloud Photon menggunakan *hostname* dari *node* (yang ditentukan kubelet atau menggunakan `--hostname-override`) sebagai nama dari objek Kubernetes Node.
Perlu diperhatikan bahwa nama Kubernetes Node name harus sesuai dengan nama Photon VM (atau jika `overrideIP` diset ke true pada `--cloud-config`, nama Kubernetes Node harus sesuai dengan alamat IP Photon VM).

## VSphere

### Nama Node

Penyedia layanan cloud VSphere menggunakan *hostname* yang terdeteksi dari *node* (yang ditentukan oleh kubelet) sebagai nama dari objek Kubernetes Node.

Parameter `--hostname-override` diabaikan oleh penyedia layanan cloud VSphere.

## IBM Cloud Kubernetes Service

### Node Komputasi
Saat menggunakan layanan IBM Cloud Kubernetes Service, kamu dapat membuat kluster yang terdiri dari campuran antara mesin virtual dan fisik (*bare metal*) sebagai *node* di *single zone* atau *multiple zones* pada satu region. Untuk informasi lebih lanjut, lihat [Perencanaan kluster dan pengaturan worker node](https://cloud.ibm.com/docs/containers?topic=containers-plan_clusters#plan_clusters).

Nama dari objek Kubernetes Node yaitu alamat IP privat dari IBM Cloud Kubernetes Service *worker node instance*.

### Jaringan
Penyedia layanan IBM Cloud Kubernetes Service menyediakan VLAN untuk membuat jaringan node yang terisolasi dengan kinerja tinggi. Kamu juga dapat membuat *custom firewall* dan *policy* jaringan Calico untuk menambah lapisan perlindungan ekstra bagi kluster kamu, atau hubungkan kluster kamu dengan *on-prem* data center via VPN. Untuk informasi lebih lanjut, lihat [Perencanaan jaringan privat dan in-cluster](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_cluster#cs_network_cluster).

Untuk membuka aplikasi ke publik atau di dalam kluster, kamu dapat menggunakan NodePort, LoadBalancer, atau Ingress. Kamu juga dapat menyesuaikan aplikasi *load balancer* Ingress dengan anotasi. Untuk informasi lebih lanjut, lihat [Perencanaan untuk membuka aplikasi dengan jaringan eksternal](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_planning#cs_network_planning).

### Penyimpanan
Penyedia layanan IBM Cloud Kubernetes Service memanfaatkan Kubernetes-native *persistent volumes* agar pengguna dapat melakukan  *mount* *file*, block, dan penyimpanan objek cloud ke aplikasi mereka. Kamu juga dapat menggunakan *database-as-a-service* dan *add-ons* pihak ketiga sebagai penyimpanan *persistent* untuk data kamu. Untuk informasi lebih lanjut, lihat [Perencanaan penyimpanan persistent yang selalu tersedia (*highly available*)](https://cloud.ibm.com/docs/containers?topic=containers-storage_planning#storage_planning).

## Baidu Cloud Container Engine

### Nama Node

Penyedia layanan cloud Baidu menggunakan alamat IP privat dari *node* (yang ditentukan oleh kubelet atau menggunakan `--hostname-override`) sebagai nama dari objek Kubernetes Node.
Perlu diperhatikan bahwa nama Kubernetes Node harus sesuai dengan alamat IP privat dari Baidu VM.