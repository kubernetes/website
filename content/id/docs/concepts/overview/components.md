---
reviewers:
- girikuncoro
title: Komponen-Komponen Kubernetes
content_template: templates/concept
weight: 20
card: 
  name: concepts
  weight: 20
---

{{% capture overview %}}
Dokumen ini merupakan ikhtisar yang mencakup berbagai komponen-komponen 
yang dibutuhkan agar kluster Kubernetes dapat berjalan secara fungsional.

{{% /capture %}}

{{% capture body %}}
## Komponen <i> Master </i>

Komponen <i> master </i> menyediakan <i> control plane </i> bagai kluster.
Komponen ini berperan dalam proses pengambilan secara global
pada kluster (contohnya, mekanisme penjadwalan), serta berperan dalam proses
deteksi serta pemberian respons terhadap <i> events </i> yang berlangsung di dalam kluster
(contohnya, penjadwalan pod baru apabila jumlah replika yang ada pada 
<i> replication controller </i> tidak terpenuhi).

Komponen master dapat dijalankan di mesin manapun yang ada di kluster. Meski begitu, 
untuk memudahkan proses yang ada, <i> script </i> inisiasi awal yang dijalankan 
biasanya memulai komponen master pada mesin yang sama, serta tidak menjalankan 
kontainer bagi pengguna di mesin ini. Contoh <i> set-up multi-master VM </i> 
dapat dilihat di modul [Membangun Highly-Available Kluster] (/docs/admin/high-availability/).

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

Kontroler-kontroler ini meliputi:

  * Kontroler <i> Node </i> : Bertanggung jawab untuk mengamati dan memberikan 
    respons apabila jumlah <i>node</i> berkurang.
  * Kontroler Replikasi : Bertanggung jawab untuk menjaga jumlah <i>pod</i> agar
    jumlahnya sesuai dengan kebutuhan setiap objek kontroler replikasi yang ada di sistem.
  * Kontroler <i> Endpoints </i> : Menginisiasi objek <i>Endpoints</i> 
    (yang merupakan gabungan <Pods> dan <Services>).
  * Kontroler <i> Service Account & Token </i>: Membuat akun dan 
    akses token API standar untuk setiap <i> namespaces </i> yang dibuat.

### cloud-controller-manager

cloud-controller-manager merupakan kontroler yang berinteraksi dengan penyedia layanan <i> cloud </i>. 
Kontroler ini merupakat fitur alfa yang diperkenalkan pada Kubernetes versi 1.6. 

<i> cloud-controller-manager </i> hanya menjalankan iterasi kontroler <i> cloud-provider-specific </i> . 
Kamu harus men-disable iterasi kontroler ini pada <i> kube-controller-manager </i>. 
Kamu dapat men-disable iterasi kontroler ini dengan mengubah nilai argumen `--cloud-provider` dengan `external` 
ketika menginisiasi <i> kube-controller-manager </i>.

Adanya <i> cloud-controller-manager </i> memungkinkan kode yang dimiliki oleh penyedia layanan <i> cloud </i>
dan kode yang ada pada Kubernetes saling independen selama masa <i> development </i>.
Pada versi sebelumnya, Kubernetes dependen tehadap fungsionalitas spesifik yang disediakan oleh
penyedia layanan <i> cloud </i>. Di masa mendatang, kode yang secara spesifik dimiliki oleh
penyedia layanan <i> cloud </i> akan di-maintain oleh penyedia layanan <i> cloud </i> itu sendiri, 
kode ini selanjutnya akan dihubungkan dengan <i> cloud-controller-manager </i> ketika Kubernetes dijalankan.

Kontroler berikut ini memiliki keterkaitan dengan penyedia layanan <i> cloud </i>:

  * Kontroler Node : Melakukan pengecekan pada penyedia layanan <i> cloud </i> ketika menentukan apakah sebuah <i> node </i> telah dihapus pada <i> cloud </i> apabila <i> node </i> tersebut berhenti memberikan respons.
  * Route Controller: Melakukan pengaturan awal <i> route </i> yang ada pada penyedia layanan <i> cloud </i>
  * Service Controller: Untuk membuat, meng-update, menghapus <i> load balancer </i> yang disediakan oleh penyedia layanan <i> cloud </i>
  * Volume Controller: Untuk membuat, meng-attach, dan melakukan <i> mount volume </i> serta melakukan inetraksi dengan penyedia layanan <i> cloud </i> untuk melakukan orkestrasi <i> volume </i>
 
## Komponen <i> Node </i>

Komponan ini ada pada setiap <i> node </i>, fungsinya adalah melakukan pemeliharaan terhadap <i> pod </i> serta menyediakan <i> environment runtime </i> bagi Kubernetes. 

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

[kube-proxy](/docs/admin/kube-proxy/) memungkinkan abstraksi <i> Kubernetes service </i> dengan cara memelihara
<i> network rules </i> pada <i> host </i> serta melakukan proses <i> forwarding </i> koneksi terhadap <i> host </i> tersebut. 

### <i> Container Runtime </i>

<i> Container runtime </i> adalah perangkat lunak yang bertanggung jawab dalam menjalankan kontainer. 
Kubernetes mendukung beberapa <i> runtime </i>, diantaranya adalah: [Docker](http://www.docker.com), [containerd](https://containerd.io), [cri-o](https://cri-o.io/), [rktlet](https://github.com/kubernetes-incubator/rktlet) dan semua implementasi [Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).

## <i> Addons </i>

<i> Addons </i> adalah <i> pod </i> dan <i> service </i> yang menerapkan fitur kluster. 
<i> Pod </i> ini dapat dikelola oleh <i> Deployments </i>, <i> ReplicationControllers </i>, 
dan lainnya. Objek <i> addons </i> yang berada di dalam <i> namespace </i> akan berada di dalam 
<i> namespace </i> `kube-system`. 

Beberapa <i> addons </i> akan dijelaskan selanjutnya.

### DNS

Meskipun tidak semua <i> addons </i> dibutuhkan, semua kluster Kubernetes hendaknya 
memiliki DNS kluster. Komponen ini penting karena banyak dibutuhkan oleh komponen
lainnya. 

[Kluster DNS]() adalah server DNS, selain beberapa server DNS lain yang sudah ada di 
<i> environment </i> kamu, yang berfungsi sebagai rekord DNS bagi Kubernetes <i> services </i>

Kontainer yang dimulai oleh kubernetes secara otomatis akan memasukkan server DNS ini 
ke dalam mekanisme pencarian DNS yang dimilikinya.

### <i> Web UI </i> (Dasbor)

[Dasbor]() adalah antar muka berbasis web multifungsi yang ada pada kluster Kubernetes.
Dasbor ini memungkinkan user melakukan manajemen dan <i> troubleshooting </i> kluster maupun 
aplikasi yang ada pada kluster itu sendiri.

### <i> Container Resource Monitoring </i>

[Container Resource Monitoring]() mencatat metrik <i> time-series </i> yang diperoleh 
dari kontainer ke dalam <i> database </i> serta menyediakan antar muka yang dapat digunakan
untuk melakukan pencarian data yang dibutuhkan.

### <i> Cluster-level Logging </i>

[Cluster-level logging]() bertanggung jawab mencatat <i> log </i> kontainer pada 
penyimpanan <i> log </i> pusat dengan antar muka yang dapat digunakan untuk melakukan 
pencarian.

{{% /capture %}}


