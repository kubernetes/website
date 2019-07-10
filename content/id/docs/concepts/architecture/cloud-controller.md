---
title: Konsep-konsep di balik Controller Manager
content_template: templates/concept
weight: 30
---

{{% capture overview %}}
Konsep _Cloud Controller Manager_/CCM (jangan tertukar dengan program biner kube-controller-manager) awalnya dibuat untuk memungkinkan kode vendor _cloud_ spesifik dan kode inti Kubernetes untuk berkembang secara independen satu sama lainnya. CCM berjalan bersama dengan komponen  Master lainnya seperti Kubernetes Controller Manager, API Server, dan Scheduler. CCM juga dapat dijalankan sebagai Kubernetes Addon (tambahan fungsi terhadap Kubernetes), yang akan berjalan di atas kluster Kubernetes.

Desain CCM didasarkan pada mekanisme _plugin_ yang memungkinkan penyedia layanan _cloud_ untuk berintegrasi dengan Kubernetes dengan mudah dengan menggunakan _plugin_. Sudah ada rencana untuk pengenalan penyedia layanan _cloud_ baru pada Kubernetes, dan memindahkan penyedia layanan _cloud_ yang sudah ada dari model yang lama ke model CCM.

Dokumen ini mendiskusikan konsep di balik CCM dan mendetail fungsi-fungsinya.

Berikut adalah arsitektur sebuah kluster Kubernetes tanpa CCM:

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

## Desain

Pada diagram sebelumnya, Kubernetes dan penyedia layanan _cloud_ diintegrasikan melalui beberapa komponen berbeda:

* Kubelet
* Kubernetes Controller Manager
* Kubernetes API server

CCM menggabungkan semua logika yang bergantung pada _cloud_ dari dalam tiga komponen tersebut ke dalam sebuah titik integrasi dengan _cloud_. Arsitektur baru di dalam model CCM adalah sebagai berikut:

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

## Komponen-komponen CCM

CCM memisahkan beberapa fungsi Kubernetes Controller Manager (KCM) dan menjalankannya sebagai proses yang berbeda. Secara spesifik, CCM memisahkan pengendali-pengendali (_controller_) di dalam KCM yang bergantung terhadap penyedia layanan _cloud_. KCM memiliki beberapa komponen pengendali yang bergantung pada _cloud_ sebagai berikut:

* Node Controller
* Volume Controller
* Route Controller
* Service Controller

Pada versi 1.9, CCM menjalankan pengendali-pengendali dari daftar sebelumnya sebagai berikut:

* Node Controller
* Route Controller
* Service Controller

{{< note >}}
Volume Controller secara sengaja tidak dipilih sebagai bagian dari CCM. Hal ini adalah karena kerumitan untuk melakukannya, dan mempertimbangkan usaha-usaha yang sedang berlangsung untuk memisahkan logika volume yang spesifik vendor dari KCM, sehingga diputuskan bahwa Volume Contoller tidak akan dipisahkan dari KCM ke CCM.
{{< /note >}}

Rencana awal untuk mendukung volume menggunakan CCM adalah dengan menggunakan Flexvolume untuk mendukung penambahan volume secara _pluggable_. Namun, ada sebuah usaha lain yang diberi nama Container Storage Interface (CSI) yang sedang berlangsung untuk menggantikan Flexvolume.

Mempertimbangkan dinamika tersebut, kami memutuskan untuk mengambil tindakan sementara hingga CSI siap digunakan.

## Fungsi-fungsi CCM

Fungsi-fungsi CCM diwarisi oleh komponen-komponen Kubernetes yang bergantung pada penyedia layanan _cloud_. Bagian ini disusun berdasarkan komponen-komponen tersebut.

### 1. Kubernetes Controller Manager

Kebanyakan fungsi CCM diturunkan dari KCM. Seperti yang telah disebutkan pada bagian sebelumnya, CCM menjalankan komponen-komponen pengendali sebagai berikut:

* Node Controller
* Route Controller
* Service Controller

#### Node Controller

Node Controller bertugas untuk menyiapkan sebuah node dengan cara mengambil informasi node-node yang berjalan di dalam kluster dari penyedia layanan _cloud_. Node Controller melakukan fungsi-fungsi berikut:

1. Menyiapkan sebuah node dengan memberi label _zone_/_region_ yang spesifik pada _cloud_.
2. Menyiapkan sebuah node dengan informasi _instance_ yang spesifik _cloud_ , misalnya tipe dan ukurannya.
3. Mendapatkan alamat jaringan dan _hostname_ milik node tersebut.
4. Dalam hal sebuah node menjadi tidak responsif, memeriksa _cloud_ untuk melihat apakah node tersebut telah dihapus dari _cloud_. Juga, menghapus objek Node tersebut dari kluster Kubernetes, jika node tersebut telah dihapus dari _cloud_.

#### Route Controller

Route Controller bertugas mengkonfigurasi rute jaringan di dalam _cloud_ secara sesuai agar Container pada node-node yang berbeda di dalam kluster Kubernetes dapat berkomunikasi satu sama lain. Route Controller hanya berlaku untuk kluster yang berjalan pada Google Compute Engine (GCE) di penyedia layanan _cloud_ GCP.

#### Service Controller

Service Controller bertugas memantau terjadinya operasi `create`, `update`, dan `delete` pada Service. Berdasarkan keadaan terkini Service-service pada kluster Kubernetes, Service Controller mengkonfigurasi _load balancer_ spesifik _cloud_ (seperti ELB, Google LB, atau Oracle Cloud Infrastructure LB) agar sesuai dengan keadaan Service-service pada kluster Kubernetes. Sebagai tambahan, Service Controller juga memastikan bahwa _service backend_ (target dari _load balancer_ yang bersangkutan) dari _load balancer cloud_ tersebut berada dalam kondisi terkini.

### 2. Kubelet

Node Controller berisi fungsi Kubelet yang bergantung pada _cloud_. Sebelum CCM, Kubelet bertugas untuk menyiapkan node dengan informasi spesifik _cloud_ seperti alamat IP, label _zone_/_region_, dan tipe _instance_. Setelah diperkenalkannya CCM, tugas tersebut telah dipindahkan dari Kubelet ke dalam CCM.

Pada model baru ini, Kubelet menyiapkan sebuah node tanpa informasi spesifik _cloud_. Namun, Kubelet menambahkan sebuah Taint pada node yang baru dibuat yang menjadikan node tersebut tidak dapat dijadwalkan (sehingga tidak ada Pod yang dapat dijadwalkan ke node tersebut) hingga CCM menyiapkan node tersebut dengan informasi spesifik _cloud_. Setelah itu, Kubelet menghapus Taint tersebut.

## Mekanisme _Plugin_

CCM menggunakan _interface_ Go untuk memungkinkan implementasi dari _cloud_ apapun untuk ditambahkan. Secara spesifik, CCM menggunakan CloudProvider Interface yang didefinisikan [di sini](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62)

Implementasi dari empat kontroler-kontroler yang disorot di atas, dan beberapa kerangka kerja, bersama dengan CloudProvider Interface, akan tetap berada pada kode inti Kubernetes. Implementasi spesifik penyedia layanan _cloud_ akan dibuat di luar kode inti dan menggunakan CloudProvider Interface yang didefinisikan di kode inti.

Untuk informasi lebih lanjut mengenai pengembangan _plugin_, lihat [Mengembangkan Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

## Otorisasi

Bagian ini memerinci akses yang dibutuhkan oleh CCM terhadap berbagai objek API untuk melakukan tugas-tugasnya.

### Akses untuk Node Controller

Node Controller hanya berinteraksi dengan objek-objek Node. Node Controller membutuhkan akses penuh untuk operasi `get`, `list`, `create`, `update`, `patch`, `watch`, dan `delete` terhadap objek-objek Node.

v1/Node:

* Get
* List
* Create
* Update
* Patch
* Watch
* Delete

### Akses untuk Route Controller

Route Controller memantau pembuatan objek Node dan mengkonfigurasi rute jaringan secara sesuai. Route Controller membutuhkan akses untuk operasi `get` terhadap objek-objek Node.

v1/Node:

* Get

### Akses untuk Service Controller

Service Controller memantau terjadinya operasi `create`, `update` dan `delete`, kemudian mengkonfigurasi Endpoint untuk Service-service tersebut secara sesuai.

Untuk mengakses Service-service, Service Controller membutuhkan akses untuk operasi _list_ dan _watch_. Untuk memperbarui Service-service, dibutuhkan akses untuk operasi `patch` dan `update`.

Untuk menyiapkan Endpoint bagi untuk Service-service, dibutuhkan akses untuk operasi `create`, `list`, `get`, `watch`, dan `update`.

v1/Service:

* List
* Get
* Watch
* Patch
* Update

### Akses Lainnya

Implementasi dari inti CCM membutuhkan akses untuk membuat Event, dan untuk memastikan operasi yang aman, dibutuhkan akses untuk membuat ServiceAccount.

v1/Event:

* Create
* Patch
* Update

v1/ServiceAccount:

* Create

Detail RBAC dari ClusterRole untuk CCM adalah sebagai berikut:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

## Implementasi Vendor-vendor

Penyedia layanan cloud berikut telah mengimplementasikan CCM:

* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)

## Administrasi Kluster

Petunjuk lengkap untuk mengkonfigurasi dan menjalankan CCM disediakan [di sini](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).

{{% /capture %}}
