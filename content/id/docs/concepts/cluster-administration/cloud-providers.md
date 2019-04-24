---
title: Cloud Providers
content_template: templates/concept
weight: 30
---

{{% capture overview %}}
Halaman ini akan menjelaskan bagaimana cara mengelola Kubernetes yang berjalan pada penyedia layanan cloud tertentu.
{{% /capture %}}


{{% capture body %}}
### kubeadm
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) merupakan salah satu cara yang banyak digunakan untuk membuat klaster kubernetes.
kubeadm memiliki pilihan untuk mengatur konfigurasi spesifik untuk penyedia layanan cloud. Salah satu contoh yang biasa digunakan pada penyedia cloud in-tree yang dapat diatur dengan kubeadm sebagai berikut:

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

Penyedia layanan cloud in-tree biasanya membutuhkan `--cloud-provider` dan `--cloud-config` untuk ditentukan sebelumnya pada command lines untuk [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) dan
[kubelet](/docs/admin/kubelet/). Konten dari file yang ditentukan pada `--cloud-config` untuk setiap provider akan dijabarkan di bawah ini.

Untuk semua penyedia layanan cloud eksternal, silakan ikuti instruksi pada repositori masing-masing penyedia layanan.

## AWS
Bagian ini akan menjelaskan semua konfigurasi yang dapat diatur saat menjalankan Kubernetes pada Amazon Web Services.

### Nama Node

Penyedia layanan cloud AWS menggunakan nama DNS private dari instance AWS sebagai nama dari obyek Kubernetes Node.

### Load Balancers
Anda dapat mengatur [load balancers eksternal](/docs/tasks/access-application-cluster/create-external-load-balancer/) sehingga dapat menggunakan fitur khusus AWS dengan mengatur anotasi seperti di bawah ini.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example
  namespace: kube-system
  labels:
    run: example
  annotations:
     service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:xx-xxxx-x:xxxxxxxxx:xxxxxxx/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx #replace this value
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
Pengaturan lainnya dapat diaplikasikan pada layanan load balancer di AWS dengan menggunakan _annotations_. Berikut ini akan dijelaskan anotasi yang didukung oleh AWS ELB:

* `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`: Digunakan untuk menentukan interval pengeluaran log akses.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`: Digunakan untuk mengaktifkan atau menonaktifkan log akses.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`: Digunakan untuk menentukan nama bucket S3 log akses.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`: Digunakan untuk menentukan prefix bucket S3 log akese.
* `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags`: Digunakan untuk menentukan daftar--yang dipisahkan koma--dari pasangan key-value yang akan dicatat sebagai tambahan tag pada ELB. Contoh: `"Key1=Val1,Key2=Val2,KeyNoVal1=,KeyNoVal2"`.
* `service.beta.kubernetes.io/aws-load-balancer-backend-protocol`: Digunakan untuk menentukan protokol yang digunakan oleh backend (pod) di belakang listener. Jika diatur ke `http` (default) atau `https`, maka akan dibuat HTTPS listener yang akan memutuskan koneksi dan meneruskan header. Jika diatur ke `ssl` atau `tcp`, maka akan digunakan "raw" SSL listener. Jika diatur ke `http` dan `aws-load-balancer-ssl-cert` tidak digunakan, maka akan digunakan HTTP listener.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`: Digunakan untuk meminta secure listener. Nilai yang masukkan adalah sertifikat ARN yang valid. Info lebih lanjut lihat [ELB Listener Config](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html) CertARN merupakan IAM atau CM certificate ARN, cth. `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`: Digunakan untuk mengaktifkan atau menonaktfkan connection draining.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`: Digunakan untuk menentukan connection draining timeout.
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`: Digunakan untuk menentukan idle connection timeout.
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`: Digunakan untuk mengaktifkan atau menonaktifkan cross-zone load balancing.
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`: Digunakan untuk menentukan grup keamanan yang akan ditambahkan pada ELB yang dibuat.
* `service.beta.kubernetes.io/aws-load-balancer-internal`: Digunakan sebagai indikasi kita akan menggunakan internal ELB.
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`: Digunakan untuk mengaktifkan proxy protocol pada ELB. Saat ini hanya dapat menerima nilai `*` yang berarti mengaktifkan proxy protocol pada semua ELB backends. Di masa mendatang kita dapat mengatur agar proxy protocol hanya aktif pada backends tertentu..
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`: Digunakan untuk menentukan daftar port--yang dipisahkan koma-- yang akan menggunakan SSL/HTTPS listeners. Nilai default yaitu `*` (semua).

Informasi anotasi untuk AWS di atas diperoleh dari komentar pada [aws.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/providers/aws/aws.go)

## Azure

### Nama Node

Penyedia layanan cloud Azure menggunakan hostname dari node (yang ditentukan oleh kubelet atau menggunakan `--hostname-override`) sebagai nama dari obyek Kubernetes Node.
Perlu diperhatikan bahwa nama Kubernetes Node harus sesuai dengan nama Azure VM.

## CloudStack

### Nama Node

Penyedia layanan cloud CloudStack menggunakan hostname dari node (yang ditentukan kubelet atau menggunakan `--hostname-override`) sebagai nama dari obyek Kubernetes Node.
Perlu diperhatikan bahwa nama Kubernetes Node harus sesuai dengan nama Cloudstack VM.

## GCE

### Nama Node

Penyedia layanan cloud GCE menggunakan hostname dari node (yang ditentukan kubelet atau menggunakan `--hostname-override`) sebagai nama dari obyek Kubernetes Node.
Perlu diperhatikan bahwa segmen pertama dari nama Kubernetes Node harus sesuai dengan nama instance GCE (cth. sebuah Node dengan nama `kubernetes-node-2.c.my-proj.internal` harus sesuai dengan instance yang memiliki nama `kubernetes-node-2`).

## OpenStack
Bagian ini akan menjelaskan semua konfigurasi yang dapat diatur saat menggunakan OpenStack dengan Kubernetes.

### Nama Node

Penyedia layanan cloud OpenStack menggunakan nama instance (yang diperoleh dari metadata OpenStack) sebagai nama obyek Kubernetes Node.
Perli diperhatikan bahwa nama instance harus berupa nama Kubernetes Node yang valid agar kubelet dapat mendaftarkan obyek Node-nya.

### Layanan

Penyedia layanan cloud OpenStack menggunakan beragam layanan OpenStack yang tersedia sebagai underlying cloud agar dapat mendukung Kubernetes:

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

Service discovery dilakukan dengan menggunakan layanan katalog yang diatur oleh
OpenStack Identity (Keystone) menggunakan `auth-url` yang ditentukan pada konfigurasi
penyedia layanan. Penyedia layanan akan menurunkan fungsionalitas secara perlahan saat layanan OpenStack selain Keystone tidak tersedia dan akan menolak dukungan fitur yang terdampak. Beberapa fitur tertentu dapat diaktifkan atau dinonaktfikan tergantung dari ekstensi yang diekspos oleh Neutron pada underlying cloud.

### cloud.conf
Kubernetes berinteraksi dengan OpenStack melalui file cloud.conf. File ini akan menyuplai Kubernetes dengan kredensial dan lokasi dari Openstack auth endpoint.
Anda dapat membuat file cloud.conf dengan menambahkan rincian berikut ini di dalam file:

#### Konfigurasi pada umumnya
Berikut ini merupakan contoh dan konfigurasi yang biasa digunakan dan akan mencakup semua pilihan yang paling sering dibutuhkan. File ini akan merujuk pada endpoint dari Keystone OpenStack, serta menyediakan rincian bagaimana cara mengotentikasi dengannya, termasuk cara mengatur load balancer:
load balancer:

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
Konfigurasi untuk penyedia layanan OpenStack berikut ini akan membahas bagian konfigurasi global sehingga harus berada pada bagian `[Global]` dari file `cloud.conf`:

* `auth-url` (Wajib): URL dari API keystone digunakan untuk otentikasi. ULR ini dapat ditemukan pada bagian Access dan Security > API Access > Credentials di halaman panel kontrol OpenStack.
* `username` (Wajib): Merujuk pada username yang dikelola keystone.
* `password` (Wajib): Merujuk pada kata sandi yang dikelola keystone.
* `tenant-id` (Wajib): Digunakan untuk menentukan id dari project tempat Anda membuat resources.
* `tenant-name` (Opsional): Digunakan untuk menentukan nama dari project tempat Anda ingin membuat resources.
* `trust-id` (Opsional): Digunakan untuk menentukan identifier of the trust untuk digunakan
  sebagai otorisasi. Suatu trust merepresentasikan otorisasi dari suatu pengguna (the trustor) untuk didelegasikan
  pada pengguna lain (the trustee), dan dapat digunakan oleh trustee
  berperan sebagai the trustor. Trust yang tersedia dapat ditemukan pada endpoint
  `/v3/OS-TRUST/trusts` dari Keystone API.
* `domain-id` (Opsional): Digunakan untuk menentukan id dari domain tempat user Anda berada.
* `domain-name` (Opsional): Digunakan untuk menentukan nama dari domain tempat user Anda berada.
* `region` (Opsional): Digunakan untuk menentukan identifier dari region saat digunakan pada
  multi-region OpenStack cloud. Sebuah region merupakan pembagian secara umum dari deployment OpenStack. Meskipun region tidak wajib berkorelasi secara geografis,  suatu deployment dapat menggunakan nama geografis sebagai region identifier seperti
  `us-east`. Daftar region yang tersedia dapat ditemukan pada endpoint `/v3/regions`
  dari Keystone API.
* `ca-file` (Optional): Digunakan untuk menentukan path dari file custom CA.


Saat menggunakan Keystone V3 - yang mengganti istilah tenant menjadi project - nilai `tenant-id`
akan secara otomatis dipetakan pada project yang sesuai di API.

#####  Load Balancer
Konfigurasi berikut ini digunakan untuk mengatur load
balancer dan harus berada pada bagian `[LoadBalancer]` dari file `cloud.conf`:

* `lb-version` (Opsional): Digunakan untuk menimpa pendeteksian versi otomatis. Nilai
  yang valid yaitu `v1` atau `v2`. Jika tidak ditentukan, maka pendeteksian otomatis akan
  memilih versi tertinggi yang didukung dari underlying OpenStack
  cloud.
* `use-octavia` (Opsional): Digunakan untuk menentukan apakah akan menggunakan endpoint dari layanan Octavia LBaaS. Nilai yang valid yaitu `true` atau `false`. Jika diset nilai `true` namun Octavia LBaaS V2 tidak dapat ditemukan, maka load balancer akan kembali menggunakan endpoint dari Neutron LBaaS V2. Nilai default adalah `false`.
* `subnet-id` (Opsional): Digunakan untuk menentukan id dari subnet yang ingin Anda
  buat load balancer di dalamnya. Nilai id ini dapat dilihat pada Network > Networks. Klik pada
  network yang sesuai untuk melihat subnet di dalamnya.
* `floating-network-id` (Opsional): Jika diset, maka akan membuat floating IP
  untuk load balancer.
* `lb-method` (Opsional): Digunakan untuk menentukan algoritma pendistribusian
  yang akan digunakan. Nilai yang valid yaitu
  `ROUND_ROBIN`, `LEAST_CONNECTIONS`, atau `SOURCE_IP`. Jika tidak diset, maka akan
  menggunakan algoritma default yaitu `ROUND_ROBIN`.
* `lb-provider` (Opsional): Digunakan untuk menentukan penyedia dari load balancer.
  Jika tidak ditentukan, maka akan menggunakan penyedia default yang ditentukan pada neutron.
* `create-monitor` (Opsional): Digunakan untuk menentukan apakah akan membuat atau tidak monitor kesehatan
  untuk Neutron load balancer. Nilai yang valid yaitu `true` dan `false`.
  Nilai default adalah `false`. Jika diset nilai `true` maka `monitor-delay`,
  `monitor-timeout`, dan `monitor-max-retries` juga harus diset.
* `monitor-delay` (Opsional): Waktu antara pengiriman probes ke
  anggota dari load balancer. Mohon pastikan Anda memasukkan waktu yang valid. Nilai waktu yang valid yaitu "ns", "us" (atau "µs"), "ms", "s", "m", "h"
* `monitor-timeout` (Opsional): Waktu maksimum dari monitor untuk menunggu
  balasan ping sebelum timeout. Nilai ini harus lebih kecil dari nilai delay.
  Mohon pastikan Anda memasukkan waktu yang valid. Nilai waktu yang valid yaitu "ns", "us" (atau "µs"), "ms", "s", "m", "h"
* `monitor-max-retries` (Opsional): Jumlah gagal ping yang diizinkan sebelum
  mengubah status anggota load balancer menjadi INACTIVE. Harus berupa angka
  antara 1 dan 10.
* `manage-security-groups` (Opsional): Digunakan untuk menentukan apakah load balancer
  akan mengelola aturan grup keamanan sendiri atau tidak. Nilai yang valid
  adalah `true` dan `false`. Nilai default adala `false`. Saat diset ke `true` maka
  nilai `node-security-group` juga harus ditentukan.
* `node-security-group` (Opsional): ID dari grup keamanan yang akan dikelola.

##### Block Storage
Konfigurasi untuk penyedia layanan OpenStack berikut ini digunakan untuk mengatur block storage
dan harus berada pada bagian `[BlockStorage]` dari file `cloud.conf`:

* `bs-version` (Opsional): Digunakan untuk Used to override automatic version detection. Valid
  values are `v1`, `v2`, `v3` and `auto`. When `auto` is specified automatic
  detection will select the highest supported version exposed by the underlying
  OpenStack cloud. The default value if none is provided is `auto`.
* `trust-device-path` (Optional): In most scenarios the block device names
  provided by Cinder (e.g. `/dev/vda`) can not be trusted. This boolean toggles
  this behavior. Setting it to `true` results in trusting the block device names
  provided by Cinder. The default value of `false` results in the discovery of
  the device path based on its serial number and `/dev/disk/by-id` mapping and is
  the recommended approach.
* `ignore-volume-az` (Optional): Used to influence availability zone use when
  attaching Cinder volumes. When Nova and Cinder have different availability
  zones, this should be set to `true`. This is most commonly the case where
  there are many Nova availability zones but only one Cinder availability zone.
  The default value is `false` to preserve the behavior used in earlier
  releases, but may change in the future.

If deploying Kubernetes versions <= 1.8 on an OpenStack deployment that uses
paths rather than ports to differentiate between endpoints it may be necessary
to explicitly set the `bs-version` parameter. A path based endpoint is of the
form `http://foo.bar/volume` while a port based endpoint is of the form
`http://foo.bar:xxx`.

In environments that use path based endpoints and Kubernetes is using the older
auto-detection logic a `BS API version autodetection failed.` error will be
returned on attempting volume detachment. To workaround this issue it is
possible to force the use of Cinder API version 2 by adding this to the cloud
provider configuration:

```yaml
[BlockStorage]
bs-version=v2
```

##### Metadata
These configuration options for the OpenStack provider pertain to metadata and
should appear in the `[Metadata]` section of the `cloud.conf` file:

* `search-order` (Optional): This configuration key influences the way that the
  provider retrieves metadata relating to the instance(s) in which it runs. The
  default value of `configDrive,metadataService` results in the provider
  retrieving metadata relating to the instance from the config drive first if
  available and then the metadata service. Alternative values are:
  * `configDrive` - Only retrieve instance metadata from the configuration
    drive.
  * `metadataService` - Only retrieve instance metadata from the metadata
    service.
  * `metadataService,configDrive` - Retrieve instance metadata from the metadata
    service first if available, then the configuration drive.

  Influencing this behavior may be desirable as the metadata on the
  configuration drive may grow stale over time, whereas the metadata service
  always provides the most up to date view. Not all OpenStack clouds provide
  both configuration drive and metadata service though and only one or the other
  may be available which is why the default is to check both.

##### Router

These configuration options for the OpenStack provider pertain to the [kubenet]
Kubernetes network plugin and should appear in the `[Router]` section of the
`cloud.conf` file:

* `router-id` (Optional): If the underlying cloud's Neutron deployment supports
  the `extraroutes` extension then use `router-id` to specify a router to add
  routes to.  The router chosen must span the private networks containing your
  cluster nodes (typically there is only one node network, and this value should be
  the default router for the node network).  This value is required to use [kubenet]
  on OpenStack.

[kubenet]: /docs/concepts/cluster-administration/network-plugins/#kubenet

{{% /capture %}}

## OVirt

### Node Name

The OVirt cloud provider uses the hostname of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the Kubernetes Node name must match the VM FQDN (reported by OVirt under `<vm><guest_info><fqdn>...</fqdn></guest_info></vm>`)

## Photon

### Node Name

The Photon cloud provider uses the hostname of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the Kubernetes Node name must match the Photon VM name (or if `overrideIP` is set to true in the `--cloud-config`, the Kubernetes Node name must match the Photon VM IP address).

## VSphere

### Node Name

The VSphere cloud provider uses the detected hostname of the node (as determined by the kubelet) as the name of the Kubernetes Node object.

The `--hostname-override` parameter is ignored by the VSphere cloud provider.

## IBM Cloud Kubernetes Service

### Compute nodes
By using the IBM Cloud Kubernetes Service provider, you can create clusters with a mixture of virtual and physical (bare metal) nodes in a single zone or across multiple zones in a region. For more information, see [Planning your cluster and worker node setup](https://cloud.ibm.com/docs/containers?topic=containers-plan_clusters#plan_clusters).

The name of the Kubernetes Node object is the private IP address of the IBM Cloud Kubernetes Service worker node instance.

### Networking
The IBM Cloud Kubernetes Service provider provides VLANs for quality network performance and network isolation for nodes. You can set up custom firewalls and Calico network policies to add an extra layer of security for your cluster, or connect your cluster to your on-prem data center via VPN. For more information, see [Planning in-cluster and private networking](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_cluster#cs_network_cluster).

To expose apps to the public or within the cluster, you can leverage NodePort, LoadBalancer, or Ingress services. You can also customize the Ingress application load balancer with annotations. For more information, see [Planning to expose your apps with external networking](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_planning#cs_network_planning).

### Storage
The IBM Cloud Kubernetes Service provider leverages Kubernetes-native persistent volumes to enable users to mount file, block, and cloud object storage to their apps. You can also use database-as-a-service and third-party add-ons for persistent storage of your data. For more information, see [Planning highly available persistent storage](https://cloud.ibm.com/docs/containers?topic=containers-storage_planning#storage_planning).

## Baidu Cloud Container Engine

### Node Name

The Baidu cloud provider uses the private IP address of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the Kubernetes Node name must match the Baidu VM private IP.
