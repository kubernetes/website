---
title: Volume
content_type: concept
weight: 10
---

<!-- overview -->

Berkas-berkas yang disimpan di _disk_ di dalam Container bersifat tidak permanen (akan terhapus seiring dengan dihapusnya Container/Pod), yang menimbulkan beberapa masalah untuk aplikasi biasa saat berjalan di dalam Container. Pertama, saat sebuah Container mengalami kegagalan, Kubelet akan memulai kembali Container tersebut, tetapi semua berkas di dalamnya akan hilang - Container berjalan dalam kondisi yang bersih. Kedua, saat menjalankan banyak Container bersamaan di dalam sebuah `Pod`, biasanya diperlukan untuk saling berbagi berkas-berkas di antara Container-container tersebut. Kedua masalah tersebut dipecahkan oleh abstraksi `Volume` pada Kubernetes.

Pengetahuan tentang [Pod](/docs/user-guide/pods) disarankan.



<!-- body -->

## Latar Belakang

Docker juga memiliki konsep _[volume](https://docs.docker.com/storage/)_, walaupun konsepnya Docker agak lebih fleksibel dan kurang dikelola. Pada Docker, sebuah volume adalah sesederhana sebuah direktori pada _disk_ atau  di dalam Container lainnya. _Lifetime_ tidak dikelola dan hingga baru-baru ini hanya ada volume yang didukung _disk_ lokal. Docker sekarang menyediakan _driver_ untuk volume, namun fungsionalitasnya masih sangat terbatas (misalnya hingga Docker 1.7 hanya ada satu _driver_ volume yang diizinkan untuk setiap Container, dan tidak ada cara untuk menyampaikan parameter kepada volume).

Sebaliknya, sebuah Volume Kubernetes memiliki _lifetime_ yang gamblang - sama dengan _lifetime_ Pod yang berisi Volume tersebut. Oleh karena itu, sebuah Volume bertahan lebih lama dari Container-container yang berjalan di dalam Pod tersebut, dan data di Volum tersebut juga dipertahankan melewati diulangnya Container. Tentu saja, saat sebuah Pod berakhir, Volume tersebut juga akan berakhir/terhapus. Dan mungkin lebih penting lagi, Kubernetes mendukung banyak jenis Volume, dan sebuah Pod dapat menggunakan sebanyak apapun Volume secara bersamaan.

Pada intinya, sebuah volume hanyalah sebuah direktori, dan mungkin berisi data, yang dapat diakses oleh Container-container di dalam Pod. Bagaimana direktori tersebut dibuat, medium yang menyokongnya, dan isinya ditentukan oleh jenis volume yang digunakan.

Untuk menggunakan sebuah volume, sebuah Pod memerinci volume-volume yang akan disediakan untuk Pod tersebut (kolom `.spec.volumes`) dan di mana volume-volume tersebut akan ditambatkan (di-_mount_) di dalam Container-container di Pod (kolom `.spec.containers.volumeMounts`).

Sebuah proses di dalam Container memiliki sudut pandang _filesystem_ yang disusun dari _image_ dan volume Dockernya. [Docker Image](https://docs.docker.com/userguide/dockerimages/) berada pada bagian teratas hierarki _filesystem_, dan volume manapun yang ditambatkan pada _path_ yang diperinci di dalam Image tersebut. Volume tidak dapat ditambatkan pada volume lain atau memiliki _hard link_ ke volume lain. Setiap Container di dalam Pod harus secara independen memerinci di mana tiap Volume ditambatkan.

## Jenis-jenis Volume

Kubernetes mendukung beberapa jenis Volume:

   * [awsElasticBlockStore](#awselasticblockstore)
   * [azureDisk](#azuredisk)
   * [azureFile](#azurefile)
   * [cephfs](#cephfs)
   * [cinder](#cinder)
   * [configMap](#configmap)
   * [csi](#csi)
   * [downwardAPI](#downwardapi)
   * [emptyDir](#emptydir)
   * [fc (fibre channel)](#fc)
   * [flexVolume](#flexVolume)
   * [flocker](#flocker)
   * [gcePersistentDisk](#gcepersistentdisk)
   * [gitRepo (deprecated)](#gitrepo)
   * [glusterfs](#glusterfs)
   * [hostPath](#hostpath)
   * [iscsi](#iscsi)
   * [local](#local)
   * [nfs](#nfs)
   * [persistentVolumeClaim](#persistentvolumeclaim)
   * [projected](#projected)
   * [portworxVolume](#portworxvolume)
   * [quobyte](#quobyte)
   * [rbd](#rbd)
   * [scaleIO](#scaleio)
   * [secret](#secret)
   * [storageos](#storageos)
   * [vsphereVolume](#vspherevolume)

Kami menyambut kontribusi tambahan.

### awsElasticBlockStore {#awselasticblockstore}

Sebuah Volume `awsElasticBlockStore` menambatkan sebuah [Volume EBS](http://aws.amazon.com/ebs) Amazon Web Services (AWS) ke dalam Pod kamu. Hal ini berarti bahwa sebuah Volume EBS dapat sebelumnya diisi terlebih dahulu dengan data, dan data dapat "dipindahkan" diantara banyak Pod.

{{< caution >}}
Kamu harus membuat sebuah volume EBS menggunakan `awscli` dengan perintah  `aws ec2 create-volume` atau menggunakan AWS API sebelum kamu dapat menggunakannya.
{{< /caution >}}

Ada beberapa batasan saat menggunakan Volume `awsElasticBlockStore`:

* Node di mana Pod berjalan haruslah merupakan _instance_ AWS EC2.
* _Instance_ tersebut mesti berada pada _region_ **dan** _availability-zone_ yang sama dengan volume EBS.
* EBS hanya mendukung penambatan pada satu _instance_ EC2 pada saat yang bersamaan.

#### Membuat sebuah Volume EBS

Sebelum kamu dapat menggunakan sebuah volume EBS pada sebuah Pod, kamu harus membuatnya pada AWS terlebih dahulu.

```shell
aws ec2 create-volume --availability-zone=eu-west-1a --size=10 --volume-type=gp2
```

Pastikan _availability zone_ yang kamu masukkan sama dengan _availability zone_ klaster kamu. (Dan pastikan juga ukuran dan jenis EBSnya sesuai dengan penggunaan yang kamu butuhkan!)

#### Contoh Konfigurasi AWS EBS

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-ebs
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-ebs
      name: test-volume
  volumes:
  - name: test-volume
    # volume EBS ini harus sudah dibuat di AWS
    awsElasticBlockStore:
      volumeID: <volume-id>
      fsType: ext4
```

#### Migrasi CSI awsElasticBlocStore

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

Pada saat fitur migrasi CSI (Container Storage Interface) untuk `awsElasticBlockStore` diaktifkan, fitur ini akan menterjemahkan semua operasi _plugin_ dari _plugin_ yang sudah ada di kode inti Kubernetes ke bentuk Driver CSI `ebs.csi.aws.com`. Untuk menggunakan fitur ini, [Driver CSI AWS EBS](https://github.com/kubernetes-sigs/aws-ebs-csi-driver) harus dinstal di klaster dan fitur Alpha `CSIMigration` serta `CSIMigrationAWS` harus diaktifkan.

### azureDisk {#azuredisk}

Sebuah `azureDisk` digunakan untuk menambatkan sebuah [Data Disk](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-about-disks-vhds/) Microsoft Azure ke dalam sebuah Pod.

Selengkapnya dapat ditemukan [di sini](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_disk/README.md).

#### Migrasi CSI azureDisk

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

Pada saat fitur migrasi CSI untuk `azureDisk` diaktifkan, fitur ini akan menterjemahkan semua operasi _plugin_ dari _plugin_ yang sudah ada di kode inti Kubernetes ke bentuk Driver CSI `disk.csi.azure.com`. Untuk menggunakan fitur ini, [Driver CSI Azure Disk](https://github.com/kubernetes-sigs/azuredisk-csi-driver) harus dinstal di klaster dan fitur Alpha `CSIMigration` serta `CSIMigrationAzureDisk` harus diaktifkan.

### azureFile {#azurefile}

Sebuah `azureFile` digunakan untuk menambatkan sebuah Microsoft Azure File Volume (SMB 2.1 dan 3.0) ke dalam sebuah Pod.

Selengkapnya dapat ditemukan [di sini](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/azure_file/README.md).

#### Migrasi CSI azureFile

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

Pada saat fitur migrasi CSI untuk `azureFile` diaktifkan, fitur ini akan menterjemahkan semua operasi _plugin_ dari _plugin_ yang sudah ada di kode inti Kubernetes ke bentuk Driver CSI `file.csi.azure.com`. Untuk menggunakan fitur ini, [Driver CSI Azure File](https://github.com/kubernetes-sigs/azuredisk-csi-driver) harus dinstal di klaster dan fitur Alpha `CSIMigration` serta `CSIMigrationAzureFile` harus diaktifkan.

### cephfs {#cephfs}

Sebuah Volume `cephfs` memungkinkan sebuah volume CephFS yang sudah ada untuk ditambatkan ke dalam Pod kamu.  Berbeda dengan `emptyDir`, yang juga ikut dihapus saat Pod dihapus, isi data di dalam sebuah volume CephFS akan dipertahankan dan Volume tersebut hanya dilepaskan tambatannya (_mount_-nya). Hal ini berarti bahwa sebuah Volume CephFS dapat sebelumnya diisi terlebih dahulu dengan data, dan data dapat "dipindahkan" diantara banyak Pod.

{{< caution >}}
Kamu harus memiliki server Ceph sendiri dan mengekspor _share_-nya sebelum kamu dapat menggunakannya.
{{< /caution >}}

Selengkapnya, lihat [contoh CephFS](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/cephfs/).

### cinder {#cinder}

{{< note >}}
Prasyarat: Kubernetes dengan penyedia layanan _cloud_ OpenStack yang telah dikonfigurasikan. Untuk konfigurasi penyedia layanan _cloud_, silahkan lihat [penyedia layanan cloud openstack](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#openstack).
{{< /note >}}

`cinder` digunakan untuk menambatkan Volume Cinder ke dalam Pod kamu.

#### Contoh Konfigurasi Volume Cinder

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-cinder
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-cinder-container
    volumeMounts:
    - mountPath: /test-cinder
      name: test-volume
  volumes:
  - name: test-volume
    # Volume OpenStack ini harus sudah ada sebelumnya.
    cinder:
      volumeID: <volume-id>
      fsType: ext4
```

#### Migrasi CSI Cinder

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

Pada saat fitur migrasi CSI untuk Cinder diaktifkan, fitur ini akan menterjemahkan semua operasi _plugin_ dari _plugin_ yang sudah ada di kode inti Kubernetes ke bentuk Driver CSI `cinder.csi.openstack.com`. Untuk menggunakan fitur ini, [Driver CSI Openstack Cinder](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-cinder-csi-plugin.md) harus dinstal di klaster dan fitur Alpha `CSIMigration` serta `CSIMigrationOpenStack` harus diaktifkan.

### configMap {#configmap}

Sumber daya [`configMap`](/id/docs/tasks/configure-pod-container/configure-pod-configmap/) memungkinkan kamu untuk menyuntikkan data konfigurasi ke dalam Pod.
Data yang ditaruh di dalam sebuah objek `ConfigMap` dapat dirujuk dalam sebuah Volume dengan tipe `configMap` dan kemudian digunakan oleh aplikasi/container yang berjalan di dalam sebuah Pod.

Saat mereferensikan sebuah objek `configMap`, kamu tinggal memasukkan nama ConfigMap tersebut ke dalam rincian Volume yang bersangkutan. Kamu juga dapat mengganti _path_ spesifik yang akan digunakan pada ConfigMap. Misalnya, untuk menambatkan ConfigMap `log-config` pada Pod yang diberi nama `configmap-pod`, kamu dapat menggunakan YAML ini:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-pod
spec:
  containers:
    - name: test
      image: busybox
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
  volumes:
    - name: config-vol
      configMap:
        name: log-config
        items:
          - key: log_level
            path: log_level
```

ConfigMap `log-config` ditambatkan sebagai sebuah Volume, dan semua isinya yang ditaruh di dalam entri `log_level`-nya ditambatkan dalam Pod tersebut pada _path_ "`/etc/config/log_level`".
Perlu dicatat bahwa _path_ tersebut berasal dari isian `mountPath` pada Volume, dan `path` yang ditunjuk dengan `key` bernama `log_level`.

{{< caution >}}
Kamu harus membuat sebuah [ConfigMap](/id/docs/tasks/configure-pod-container/configure-pod-configmap/) sebelum kamu dapat menggunakannya.
{{< /caution >}}

{{< note >}}
Sebuah Container yang menggunakan sebuah ConfigMap sebagai tambatan Volume [subPath](#menggunakan-subpath) tidak akan menerima pembaruan ConfigMap.
{{< /note >}}

### downwardAPI {#downwardapi}

Sebuah Volume `downwardAPI` digunakan untuk menyediakan data `downward API` kepada aplikasi.
Volume ini menambatkan sebuah direktori dan menulis data yang diminta pada berkas-berkas teks biasa.

{{< note >}}
Sebuah Container yang menggunakan Downward API sebagai tambatan Volume [subPath](#menggunakan-subpath) tidak akan menerima pembaruan Downward API.
{{< /note >}}

Lihat [contoh Volume `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) untuk lebih detilnya.

### emptyDir {#emptydir}

Sebuah Volume `emptyDir` pertama kali dibuat saat sebuah Pod dimasukkan ke dalam sebuah Node, dan akan terus ada selama Pod tersebut berjalan di Node tersebut. Sesuai dengan namanya, Volume ini awalnya kosong. Container-container di dalam Pod dapat membaca dan menulis berkas-berkas yang sama di dalam Volume `emptyDir`, walaupun Volume tersebut dapat ditambatkan pada `path` yang sama maupun berbeda pada setiap Container. Saat sebuah Pod dihapus dari sebuah Node untuk alasan apapun, data di dalam `emptyDir` tersebut dihapus untuk selamanya.

{{< note >}}
Sebuah Container yang gagal _TIDAK AKAN_ menghapus sebuah Pod dari sebuah Node, sehingga data di dalam sebuah `emptyDir` akan aman jika Container di dalam Podnya gagal.
{{< /note >}}

Beberapa kegunaan `emptyDir` adalah sebagai berikut:

* _Scratch space_, misalnya untuk _merge sort_ menggunakan berkas-berkas di _disk_
* _Checkpointing_ untuk komputasi panjang yang dipulihkan dari proses yang sebelumnya mengalami kegagalan
* Menyimpan berkas-berkas yang diambil oleh Container aplikasi _Content Manager_ saat sebuah peladen web melayani data tersebut

Secara bawaan, `emptyDir` ditaruh pada media penyimpanan apapun yang menyokong Node yang bersangkuta - mungkin sebuah _disk_ atau SSD atau penyimpanan berbasis jaringan, tergantung lingkungan Node yang kamu miliki. Tetapi, kamu juga dapat menyetel bagian `emptyDir.medium` menjadi `"Memory"` untuk memberitahukan pada Kubernetes untuk menggunakan sebuah `tmpfs` (_filesystem_ berbasis RAM) sebagai gantinya. `tmpfs` memang sangan cepat, tetapi kamu harus sadar bahwa ia tidak seperti _disk_, data di `tmpfs` akan terhapus saat Node tersebut diulang kembali. Selain itu, berkas apapun yang kamu tulis akan dihitung terhadap `limit` `memory` milik Container kamu.

#### Contoh Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
  - name: cache-volume
    emptyDir: {}
```

### fc (fibre channel) {#fc}

Sebuah Volume `fc` memunginkan sebuah _volume_ _fibre channel_ yang sudah ada untuk ditambatkan ke sebuah Pod.
Kamu dapat menentukan satu atau banyak target _World Wide Names_ menggunakan parameter `targetWWNs` pada konfigurasi Volume kamu. Jika banyak WWN ditentukan, maka `targetWWNs` mengharapkan bahwa WWN tersebut berasal dari koneksi _multi-path_.

{{< caution >}}
Sebelumnya, kamu harus mengkonfigurasikan _FC SAN Zoning_ untuk mengalokasikan dan melakukan _masking_ terhadap LUN (_volume_) tersebut terhadap target WWN sehingga Node-node Kubernetes dapat mengakses mereka.
{{< /caution >}}

Lihat [Contoh FC](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/fibre_channel) untuk lebih detilnya.

### flocker {#flocker}

[Flocker](https://github.com/ClusterHQ/flocker) adalah sebuah proyek _open-source_ yg berfungsi sebagai pengatur _volume_ data Container yang diklasterkan. Flocker menyediakan pengelolaan dan orkestrasi _volume_ yang disokong oleh banyak jenis media penyimpanan.

Sebuah Volume `flockere` memungkinkan sebuah _dataset_ Flocker untuk ditambatkan ke dalam sebuah Pod. Jika _dataset_ tersebut belum ada di dalam Flocker, maka ia harus dibuat terlebih dahulu dengan menggunakan Flocker CLI atau menggunakan Flocker API. Jika _dataset_ tersebut sudah ada, ia akan ditambatkan kembali oleh Flocker ke Node di mana Pod tersebut dijadwalkan. Hal ini berarti data dapat dioper diantara Pod-pod sesuai dengan kebutuhan.

{{< caution >}}
Kamu harus memiliki instalasi Flocker yang sudah berjalan sebelum kamu dapat menggunakannya.
{{< /caution >}}

Lihat [Contoh Flocker](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/flocker) untuk lebih detil.

### gcePersistentDisk {#gcepersistentdisk}

Sebuah _volume_ `gcePersistentDisk` menambatkan sebuah [PersistentDisk](http://cloud.google.com/compute/docs/disks) Google Compute Engine (GCE) ke dalam Pod kamu. Tidak seperti `emptyDir` yang ikut dihapus saat Pod dihapus, isi dari sebuah PD dipertahankan dan _volume_-nya hanya dilepaskan tambatannya. Hal ini berarti sebuah PD dapat diisi terlebih dahulu dengan data, dan data tersebut dapat "dioper" diantara Pod-pod.

{{< caution >}}
Kamu harus membuat sebuah PD menggunakan `gcloud` atau GCE API atau GCP UI sebelum kamu dapat menggunakannya.
{{< /caution >}}

Ada beberapa batasan saat menggunakan sebuah `gcePersistentDisk`:

* Node-node di mana Pod-pod berjalan haruslah GCE VM.
* VM tersebut harus berada pada proyek GCE yang sama dan _zone_ yang sama dengan PD tersebut

Sebuah fitur PD yaitu mereka dapat ditambatkan sebagai _read-only_ secara bersamaan oleh beberapa pengguna. Hal ini berarti kamu dapat mengisi data terlebih dahulu dan menyediakan data tersebut secara paralel untuk sebanyak apapun Pod yang kamu butuhkan. Sayangnya, PD hanya dapat ditambatkan kepada satu pengguna saja pada mode _read-write_ - yaitu, tidak boleh ada banyak penulis secara bersamaan.

Menggunakan sebuah PD pada sebuah Pod yang diatur oleh sebuah `ReplicationController` akan gagal, kecuali jika PD tersebut berada pada mode `read-only`, atau jumlah `replica`-nya adalah 0 atau 1.

#### Membuat sebuah PD

Sebelum kamu dapat menggunakan sebuah PD dengan sebuah Pod, kamu harus membuat PD tersebut terlebih dahulu.

```shell
gcloud compute disks create --size=500GB --zone=us-central1-a my-data-disk
```

#### Contoh Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    # GCE PD ini harus sudah ada.
    gcePersistentDisk:
      pdName: my-data-disk
      fsType: ext4
```

#### Regional Persistent Disks

{{< feature-state for_k8s_version="v1.10" state="beta" >}}

Fitur [Regional Persistent Disks](https://cloud.google.com/compute/docs/disks/#repds) memungkinkan pembuatan Persistent Disk yang berada pada beberapa _zone_ pada _region_ yang sama. Untuk menggunakan fitur ini, Volume tersebut harus dibuat sebagai sebuah PersistentVolume; mereferensikan Volume tersebut langsung dari sebuah Pod tidak didukung.

#### Menyediakan sebuah Regional PD PersistentVolume Secara Manual

Penyediaan secara dinamis mungkin dilakukan dengan sebuah [StorageClass untuk GCE PD](/id/docs/concepts/storage/storage-classes/#gce-pd).
Sebelum membuat sebuah PersistentVolume, kamu harus membuat PD-nya:

```shell
gcloud beta compute disks create --size=500GB my-data-disk
    --region us-central1
    --replica-zones us-central1-a,us-central1-b
```

Contoh spesifikasi PersistentVolume:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: test-volume
  labels:
    failure-domain.beta.kubernetes.io/zone: us-central1-a__us-central1-b
spec:
  capacity:
    storage: 400Gi
  accessModes:
  - ReadWriteOnce
  gcePersistentDisk:
    pdName: my-data-disk
    fsType: ext4
```

#### Migrasi CSI GCE PD

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

Pada saat fitur migrasi CSI untuk GCE PD diaktifkan, fitur ini akan menterjemahkan semua operasi _plugin_ dari _plugin_ yang sudah ada di kode inti Kubernetes ke bentuk Driver CSI `pd.csi.storage.gke.io`. Untuk menggunakan fitur ini, [Driver CSI GCE PD](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) harus dinstal di klaster dan fitur Alpha `CSIMigration` serta `CSIMigrationGCE` harus diaktifkan.

### gitRepo (kedaluwarsa) {#gitrepo}

{{< warning >}}
Tipe Volume `gitRepo` telah kedaluwarsa. Untuk membuat sebuah Container dengan sebuah _git repo_, tambatkan sebuah [EmptyDir](#emptydir) ke dalam sebuah InitContainer yang akan mengklon _repo_ tersebut menggunakan git, dan kemudian tambatkan [EmptyDir](#emptydir) tersebut ke dalam Container Pod tersebut.
{{< /warning >}}

Sebuah Volume `gitRepo` adalah sebuah percontohan yang menunjukkan apa yang dapat dilakukan dengan _plugin_ volume. Ia menambatkan sebuah direktori kosong dan mengklon sebuah _repository_ git ke dalamnya untuk digunakan oleh Pod kamu. Ke depannya, Volume seperti ini dapat dipindahkan ke model yang bahkan lebih terpisah, daripada melakukan ekstensi pada Kubernetes API untuk setiap kasus serupa.

Berikut sebuah contoh Volume gitRepo:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: server
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /mypath
      name: git-volume
  volumes:
  - name: git-volume
    gitRepo:
      repository: "git@somewhere:me/my-git-repository.git"
      revision: "22f1d8406d464b0c0874075539c1f2e96c253775"
```

### glusterfs {#glusterfs}

Sebuah Volume `glusterfs` memungkinkan sebuah volume [Glusterfs](http://www.gluster.org) (sebuah proyek _open-source_ _filesystem_ berbasis jaringan) untuk ditambatkan ke dalam Pod kamu.
Tidak seperti `emptyDir` yang ikut dihapus saat Pod dihapus, isi dari sebuah `glusterfs` dipertahankan dan _volume_-nya hanya dilepaskan tambatannya. Hal ini berarti sebuah `glusterfs` dapat diisi terlebih dahulu dengan data, dan data tersebut dapat "dioper" diantara Pod-pod. GlusterFS dapat ditambatkan kepada beberapa penulis secara bersamaan.

{{< caution >}}
Kamu harus mempunyai instalasi GlusterFS terlebih dahulu sebelum dapat kamu gunakan.
{{< /caution >}}

Lihat [contoh GlusterFS](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/glusterfs) untuk lebih detil.

### hostPath {#hostpath}

Sebuah Volume `hostPath` menambatkan sebuah berkas atau direktori dari _filesystem_ Node di mana Pod kamu berjalan ke dalam Pod kamu.
Hal ini bukanlah sesuatu yang dibutuhkan oleh sebagian besar Pod kamu, tetapi hal ini menawarkan sebuah mekanisme pintu darurat untuk beberapa aplikasi.

Contohnya, beberapa kegunaan `hostPath` adalah sebagai berikut:

* Menjalankan sebuah Container yang membutuhkan akses terhadap sistem dalaman Docker; misalnya menggunakan `hostPath` dari `/var/lib/docker`
* Menjalankan cAdvisor di dalam sebuah Container; menggunakan `hostPath` dari `/sys`
* Memungkinkan sebuah Pod untuk merinci apakah `hostPath` harus sudah ada sebelum dijalankannya Pod, apakah ia harus dibuat, dan sebagai apa ia harus dibuat.

Sebagai tambahan pada `path` yang dibutuhkan, pengguna dapat secara opsional merinci `type` untuk sebuah `hostPath`.

Nilai yang didukung untuk kolom `type` adalah:`


| Nilai | Perilaku |
|:------|:---------|
| | String kosong (bawaan) adalah untuk kecocokan dengan versi-versi bawah, yang berarti bahwa tidak ada pemeriksaan yang dilakukan sebelum menambatkan Volume hostPath. |
| `DirectoryOrCreate` | Jika tidak ada yang tersedia pada `path` yang dirinci, sebuah direktori kosong akan dibuat sesuai kebutuhan, dengan _permission_ yang disetel menjadi 0755, dan mempunyai grup dan kepemilikan yang sama dengan Kubelet. |
| `Directory` | Sebuah direktori harus sudah tersedia pada `path` yang dirinci |
| `FileOrCreate` | Jika tidak ada yang tersedia pada `path` yang dirinci, maka sebuah berkas kosong akan dibuat sesuai kebutuhan dengan _permission_ yang disetel menjadi 0644, dan mempunyai grup dan kepemilikan yang sama dengan Kubelet. |
| `File` | Sebuah berkas harus sudah tersedia pada `path` yang dirinci |
| `Socket` | Sebuah _socket_ UNIX harus sudah tersedia pada `path` yang dirinci |
| `CharDevice` | Sebuah _character device_ sudah tersedia pada `path` yang dirinci |
| `BlockDevice` | Sebuah _block device_ harus sudah tersedia pada `path` yang dirinci |

Berhati-hatilah saat menggunakan tipe volume ini, karena:

* Pod-pod dengan konfigurasi identik (misalnya dibuat dari podTemplate) mungkin berperilaku berbeda pada Node-node yang berbeda oleh karena berkas-berkas yang berbeda pada Node-node tersebut.
* Saat Kubernetes menambahkan penjadwalan yang sadar terhadap sumber-daya klaster, sesuai yang telah direncanakan, ia tidak dapat melakukan perhitungan terhadap sumber daya yang digunakan oleh sebuah `hostPath`
* Berkas-berkas atau direktori-direktori yang dibuat pada _host-host_ bersangkutan hanya dapat ditulis oleh `root`. Kamu butuh antara menjalankan proses aplikasi kamu sebagai `root` pada sebuah [privileged Container](/docs/user-guide/security-context) atau mengubah _permission_ berkas kamu pada _host_ tersebut agar dapat menulis pada Volume `hostPath`

#### Contoh Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pd
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-pd
      name: test-volume
  volumes:
  - name: test-volume
    hostPath:
      # Lokasi direktori pada host
      path: /data
      # kolom ini bersifat opsional
      type: Directory
```

### iscsi {#iscsi}

Sebuah Volume `iscsi` memungkinkan sebuah volume iSCSI (_SCSI over IP_) yang sudah ada untuk ditambatkan ke dalam Pod kamu.
Tidak seperti `emptyDir` yang ikut dihapus saat Pod dihapus, isi dari sebuah `iscsi` dipertahankan dan _volume_-nya hanya dilepaskan tambatannya. Hal ini berarti sebuah `iscsi` dapat diisi terlebih dahulu dengan data, dan data tersebut dapat "dioper" diantara Pod-pod.

{{< caution >}}
Kamu harus memiliki peladen iSCSI yang berjalan dengan volume iSCSI yang telah dibuat terlebih dahulu untuk dapat menggunakannya.
{{< /caution >}}

Salah satu fitur iSCSI yaitu mereka dapat ditambatkan sebagai _read-only_ secara bersamaan oleh beberapa pengguna. Hal ini berarti kamu dapat mengisi data terlebih dahulu dan menyediakan data tersebut secara paralel untuk sebanyak apapun Pod yang kamu butuhkan. Sayangnya, iSCSI hanya dapat ditambatkan kepada satu pengguna saja pada mode _read-write_ - yaitu, tidak boleh ada banyak penulis secara bersamaan.

Lihat [contoh iSCSI](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/iscsi) untuk lebih detil.

### local {#local}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

Sebuah Volume `local` merepresentasikan sebuah media penyimpanan lokal yang ditambatkan, seperti _disk_, partisi, atau direktori.

Volume `local` hanya dapat digunakan sebagai PersistentVolume yang dibuat secara statis. _Dynamic provisioning_ belum didukung untuk Volume `local`.

Dibandingkan dengan Volume `hostPath`, Volume `local` dapat digunakan secara _durable_ dan portabel tanpa harus menjadwalkan Pod ke Node secara manual, dikarenakan sistem mengetahui pembatasan yang berlaku terhadap Volume pada Node tersebut, dengan cara melihat `node affinity` pada PersistentVolume-nya.

Tetapi, Volume `local` masih bergantung pada ketersediaan Node yang bersangkutan, dan tidak semua aplikasi cocok menggunakannya. Jika sebuah Node tiba-tiba gagal, maka Volume `local` pada Node tersebut menjadi tidak dapat diakses juga, dan Pod yang menggunakannya tidak dapat dijalankan. Aplikasi yang menggunakan Volume`local` harus dapat mentoleransi hal ini dan juga potensi kehilangan data, tergantung pada karakteristik ketahanan _disk_ yang digunakan.

Berikut sebuah contoh spesifikasi PersistentVolume menggunakan sebuah Volume `local` dan `nodeAffinity`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: example-pv
spec:
  capacity:
    storage: 100Gi
  # kolom volumeMode membutuhkan diaktifkannya feature gate Alpha
  volumeMode: Filesystem
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Delete
  storageClassName: local-storage
  local:
    path: /mnt/disks/ssd1
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: kubernetes.io/hostname
          operator: In
          values:
          - example-node
```

Kolom `nodeAffinity` ada PersistentVolue dibutuhkan saat menggunakan Volume `local`. Ia memungkinkan Kubernetes Scheduler untuk menjadwalkan Pod-pod dengan tepat menggunakan Volume `local` pada Node yang tepat.

Kolom `volumeMode` pada PersistentVolume sekarang dapat disetel menjadi "Block" (menggantikan nilai bawaan "Filesystem") untuk membuka Volume `local` tersebut sebagai media penyimpanan blok mentah. Hal ini membutuhkan diaktifkannya _Alpha feature gate_ `BlockVolume`.

Saat menggunakan Volume `local`, disarankan untuk membuat sebuah StorageClass dengan `volumeBindingMode` yang disetel menjadi `WaitForFirstConsumer`. Lihat[contohnya](/id/docs/concepts/storage/storage-classes/#local). Menunda pengikatan Volume memastikan bahwa keputusan pengikatan PersistentVolumeClaim juga akan dievaluasi terhadap batasan-batasan Node yang berlaku pada Pod, seperti kebutuhan sumber daya Node, `nodeSelector`, `podAffinity`, dan `podAntiAffinity`.

Sebuah penyedia statis eksternal dapat berjalan secara terpisah untuk memperbaik pengaturan siklus hidup Volume `local`. Perlu dicatat bahwa penyedia ini belum mendukung _dynamic provisioning_. Untuk contoh bagaimana menjalankan penyedia Volume `local` eksternal, lihat [petunjuk penggunaannya](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner).

{{< note >}}
PersistentVolume lokal membutuhkan pembersihan dan penghapusan secara manual oleh pengguna jika penyedia eksternal tidak digunakan untuk mengatur siklus hidup Volume `lokal` tersebut.
{{< /note >}}

### nfs {#nfs}

Sebuah Volume `nfs` memungkinkan sebuah NFS (Network File System) yang sudah ada untuk ditambatkan ke dalam Pod kamu.
Tidak seperti `emptyDir` yang ikut dihapus saat Pod dihapus, isi dari sebuah `nfs` dipertahankan dan _volume_-nya hanya dilepaskan tambatannya. Hal ini berarti sebuah `nfs` dapat diisi terlebih dahulu dengan data, dan data tersebut dapat "dioper" diantara Pod-pod. NFS juga dapat ditambatkan oleh beberapa penulis secara sekaligus.

{{< caution >}}
Kamu harus memiliki peladen NFS yang berjalan dengan _share_ yang diekspor sebelum kamu dapat menggunakannya.
{{< /caution >}}

Lihat [contoh NFS](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/nfs) untuk lebih lanjut.

### persistentVolumeClaim {#persistentvolumeclaim}

Sebuah Volume `persistentVolumeClaim` digunakan untuk menambatkan sebuah [PersistentVolume](/id/docs/concepts/storage/persistent-volumes/) ke dalam sebuag Pod. PersistentVolume adalah sebuah cara bagi pengguna untuk "mengklaim" penyimpanan yang _durable_ (seperti sebuah GCE PD atau sebuah volume iSCSI) tanpa mengetahui detil lingkungan _cloud_ yang bersangkutan.

Lihat [contoh PersistentVolumes](/id/docs/concepts/storage/persistent-volumes/) untuk lebih lanjut.

### projected {#projected}

Sebuah Volume `projected` memetakan beberapa sumber Volume yang sudah ada ke dalam direktori yang sama.

Saat ini, tipe-tipe sumber Volume berikut dapat diproyeksikan:

- [`secret`](#secret)
- [`downwardAPI`](#downwardapi)
- [`configMap`](#configmap)
- `serviceAccountToken`

Semua sumber harus berada pada `namespace` yang sama dengan Pod yang menggunakannya. Untuk lebih lanjut, lihat [dokumen desain Volume](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/node/all-in-one-volume.md).

Proyeksi `serviceAccountToken` adalah fitur yang diperkenalkan pada Kubernetes 1.11 dan dipromosikan menjadi Beta pada 1.12.
Untuk mengaktifkan fitur inipada 1.11, kamu harus menyetel [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `TokenRequestProjection` secara eksplisit menjadi `True`.

#### Contoh Pod dengan sebuah Secret, Downward API, dan ConfigMap.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - downwardAPI:
          items:
            - path: "labels"
              fieldRef:
                fieldPath: metadata.labels
            - path: "cpu_limit"
              resourceFieldRef:
                containerName: container-test
                resource: limits.cpu
      - configMap:
          name: myconfigmap
          items:
            - key: config
              path: my-group/my-config
```

#### Contoh Pod dengan banyak Secret dengan mode permission bukan bawaan

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: all-in-one
      mountPath: "/projected-volume"
      readOnly: true
  volumes:
  - name: all-in-one
    projected:
      sources:
      - secret:
          name: mysecret
          items:
            - key: username
              path: my-group/my-username
      - secret:
          name: mysecret2
          items:
            - key: password
              path: my-group/my-password
              mode: 511
```

Setiap sumber Volume `projected` terdaftar pada spesifikasi di kolom `sources`. Parameter-parameter tersebut hampir sama persis dengan dua pengecualian berikut:

* Untuk Secret, kolom `secretName` telah diganti menjadi `name` agar konsisten dengan penamaan ConfigMap.
* Kolom `defaultMode` hanya dapat dispesifikasikan pada tingkat `projected` dan tidak untuk setiap sumber Volume. Tetapi, seperti yang ditunjukkan di atas, kamu dapat secara eksplisit menyetel `mode` untuk setiap proyeksi.

Saat fitur `TokenRequestProjection` diaktifkan, kamu dapat menyuntikkan _token_ untuk [ServiceAccount](/docs/reference/access-authn-authz/authentication/#service-account-tokens) yang bersangkutan ke dalam Pod pada `path` yang diinginkan. Berikut contohnya:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sa-token-test
spec:
  containers:
  - name: container-test
    image: busybox
    volumeMounts:
    - name: token-vol
      mountPath: "/service-account"
      readOnly: true
  volumes:
  - name: token-vol
    projected:
      sources:
      - serviceAccountToken:
          audience: api
          expirationSeconds: 3600
          path: token
```

Contoh Pod tersebut memiliki Volume `projected` yang berisi token ServiceAccount yang disuntikkan. Token ini dapat digunakan oleh Container dalam Pod untuk mengakses Kubernetes API Server misalnya. Kolom `audience` berisi audiensi token yang dituju. Sebuah penerima token tersebut harus mengidentifikasikan dirinya dengan tanda pengenal yang dispesifikasikan pada `audience` token tersebut, atau jika tidak, harus menolak token tersebut. Kolom ini bersifat opsional dan secara bawaan akan berisi tanda pengenal API Server.

Kolom `expirationSeconds` adalah masa berlaku yang diinginkan untuk token ServiceAccount tersebut. Secara bawaan, nilainya adalah 1 jam dan harus paling singkat bernilai 10 menit (600 detik). Seorang administrator juga dapat membatasi nilai maksimumnya dengan menyetel opsi `--service-account-max-token-expiration` pada API Server. Kolom `path` menunjukkan _relative path_ untuk menambatkan Volume `projected` tersebut.

{{< note >}}
Sebuah Container yang menggunakan sebuah sumber Volume `projected` sebagai tambatan Volume [subPath](#menggunakan-subpath) tidak akan menerima pembaruan pada sumber Volume tersebut.
{{< /note >}}

### portworxVolume {#portworxvolume}

Sebuah `portworxVolume` adalah sebuah penyimpanan blok elastis yang berjalan secara _hyperconverged_ dengan Kubernetes. [Portworx](https://portworx.com/use-case/kubernetes-storage/) mengambil sidik jari media penyimpanan pada sebuah _server_, mengklasifikasikannya berdasarkan kemampuannya, dan mengagregasikan kapasitasnya di banyak _server_. Portworx berjalan secara _in-guest_ pada mesin virtual atau pada Node Linux _bare metal_.

Sebuah `portworxVolume` dapat dibuat secara dinamis melalui Kubernetes, atau ia juga dapat disediakan terlebih dahulu dan dirujuk dari dalam Pod Kubernetes. Berikut contoh sebuah Pod yang mereferensikan PortworxVolume yang telah disediakan terlebih dahulu:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-portworx-volume-pod
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /mnt
      name: pxvol
  volumes:
  - name: pxvol
    # Volume Portworx ini harus sudah tersedia.
    portworxVolume:
      volumeID: "pxvol"
      fsType: "<fs-type>"
```

{{< caution >}}
Pastikan kamu sudah memiliki PortworxVolume dengan nama `pxvol` sebelum dapat menggunakannya pada Pod.
{{< /caution >}}

Lihat [di sini](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/portworx/README.md) untuk lebih lanjut.

### quobyte {#quobyte}

Sebuah Volume `quobyte` memungkinkan sebuah volume [Quobyte](http://www.quobyte.com) yang sudah tersedia untuk ditambatkan ke dalam Pod kamu.

{{< caution >}}
Kamu harus sudah memiliki instalasi Quobyte dengan volume yang sudah disediakan terlebih dahulu untuk dapat menggunakannya.
{{< /caution >}}

Quobyte mendukung {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}}.
CSI adalah _plugin_ yang direkomendasikan untuk menggunakan Volume Quobyte di dalam Kubernetes. Ada [petunjuk dan contoh](https://github.com/quobyte/quobyte-csi#quobyte-csi) untuk menggunakan Quobyte menggunakan CSI pada proyek GitHub Quobyte.j

### rbd {#rbd}

Sebuah Volume `rbd` memungkinkan sebuah volume [Rados Block Device](http://ceph.com/docs/master/rbd/rbd/) ditambatkan ke dalam Pod kamu.
Tidak seperti `emptyDir` yang ikut dihapus saat Pod dihapus, isi dari sebuah `rbd` dipertahankan dan _volume_-nya hanya dilepaskan tambatannya. Hal ini berarti sebuah `rbd` dapat diisi terlebih dahulu dengan data, dan data tersebut dapat "dioper" diantara Pod-pod.

{{< caution >}}
Kamu harus memiliki instalasi Ceph yang berjalan sebelum kamu dapat menggunakan RBD.
{{< /caution >}}

Sebuah fitur RBD yaitu mereka dapat ditambatkan sebagai _read-only_ secara bersamaan oleh beberapa pengguna. Hal ini berarti kamu dapat mengisi data terlebih dahulu dan menyediakan data tersebut secara paralel untuk sebanyak apapun Pod yang kamu butuhkan. Sayangnya, RBD hanya dapat ditambatkan kepada satu pengguna saja pada mode _read-write_ - yaitu, tidak boleh ada banyak penulis secara bersamaan.

Lihat [contoh RBD](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/rbd) untuk lebih lanjut.

### scaleIO {#scaleio}

ScaleIO adalah _platform_ penyimpanan berbasis perangkat lunak yang dapat menggunakan perangkat keras yang sudah tersedia untuk membuat klaster-klaster media penyimpanan terhubung jaringan yang _scalable_. _Plugin_ Volume `scaleIO` memungkinkan Pod-pod yang di-_deploy_ untuk mengakses Volume-volume ScaleIO yang telah tersedia (atau dapat menyediakan volume-volume untuk PersistentVolumeClaim secara dinamis, lihat [Persistent Volume ScaleIO](/id/docs/concepts/storage/persistent-volumes/#scaleio)).

{{< caution >}}
Kamu harus memiliki klaster ScaleIO yang berjalan dengan volume-volume yang sudah dibuat sebelum kamu dapat menggunakannya.
{{< /caution >}}

Berikut contoh konfigurasi sebuah Pod yang menggunakan ScaleIO:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-0
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: pod-0
    volumeMounts:
    - mountPath: /test-pd
      name: vol-0
  volumes:
  - name: vol-0
    scaleIO:
      gateway: https://localhost:443/api
      system: scaleio
      protectionDomain: sd0
      storagePool: sp1
      volumeName: vol-0
      secretRef:
        name: sio-secret
      fsType: xfs
```

Lihat [contoh ScaleIO](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/volumes/scaleio) untuk lebih lanjut.

### secret {#secret}

Sebuah Volume `secret` digunakan untuk memberikan informasi yang bersifat sensitif, seperti kata sandi, kepada Pod-pod. Kamu dapat menaruh `secret` dalam Kubernetes API dan menambatkan mereka sebagai berkas-berkas untuk digunakan oleh Pod-pod tanpa harus terikat pada Kubernetes secara langsung. Volume `secret` didukung oleh tmpfs (_filesystem_ yang didukung oleh RAM) sehingga mereka tidak pernah ditulis pada media penyimpanan yang _non-volatile_.

{{< caution >}}
Kamu harus membuat sebuah `secret` di dalam Kubernetes API sebelum kamu dapat menggunakannya.
{{< /caution >}}

{{< note >}}
Sebuah Container yang menggunakan sebuah Secret sebagai sebuah Volume [subPath](#menggunakan-subpath) tidak akan mendapatkan pembaruan terhadap Secret.
{{< /note >}}

Secret dijelaskan lebih lanjut [di sini](/docs/user-guide/secrets).

### storageOS {#storageos}

Sebuah Volume `storageos` memungkinkan volume [StorageOS](https://www.storageos.com) yang sudah tersedia untuk ditambatkan ke dalam Pod kamu.

StorageOS berjalan sebagai sebuah COntainer di dalam lingkungan Kubernetes kamu, membuat penyimpanan yang lokal atau penyimpanan yang sedang dipasang untuk diakses dari Node manapun di dalam klaster Kubernetes.
Data dapat direplikasikan untuk melindungi dari kegagalan Node. _Thin provisioning_ dan kompresi dapat meningkatkan utilisasi dan mengurangi biaya.

Di dalam intinya, StorageOS menyediakan penyimpanan blok kepada Container-container, yang dapat diakses melalui sebuah _filesystem_.

Container StorageOS membutuhkan Linux 64-bit dan tidak memiliki ketergantungan tambahan apapun.
Tersedia pula sebuah lisensi gratis untuk _developer_.

{{< caution >}}
Kamu harus menjalankan Container StorageOS pada setiap Node yang ingin mengakses volume-volume StorageOS atau yang akan berkontribusi pada kapasitas penyimpanan di klaster StorageOS. Untuk petunjuk instalasi, lihat [dokumentasi StorageOS](https://docs.storageos.com).
{{< /caution >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: redis
    role: master
  name: test-storageos-redis
spec:
  containers:
    - name: master
      image: kubernetes/redis:v1
      env:
        - name: MASTER
          value: "true"
      ports:
        - containerPort: 6379
      volumeMounts:
        - mountPath: /redis-master-data
          name: redis-data
  volumes:
    - name: redis-data
      storageos:
        # Volume `redis-vol01` harus sudah tersedia di dalam StorageOS pada Namespace `default`
        volumeName: redis-vol01
        fsType: ext4
```

Untuk lebih lanjut, termasuk Dynamic Provisioning dan Persistent Volume Claim, lihat [contoh-contoh StorageOS](https://github.com/kubernetes/examples/blob/master/staging/volumes/storageos).

### vsphereVolume {#vspherevolume}

{{< note >}}
Prasyarat: Kubernetes dengan Cloud Provider vSphere yang telah dikonfigurasikan. Untuk konfigurasi cloudprovider, silahkan lihat [petunjuk memulai vSphere](https://vmware.github.io/vsphere-storage-for-kubernetes/documentation/).
{{< /note >}}

Sebuah `vsphereVolume` digunakan untuk menambatkan sebuah Volume VMDK vSphere ke dalam Pod kamu. Isi dari sebuah volume dipertahankan pada saat tambatannya dilepas. Ia mendukung penyimpanan data VMFS dan VSAN.

{{< caution >}}
Kamu harus membuat VMDK menggunakan satu dari cara-cara berikut sebelum menggunakannya dengan Pod.
{{< /caution >}}

#### Membuat sebuah Volume VMDK

Pilih satu dari beberapa cara berikut untuk membuat sebuah VMDK.

{{< tabs name="tabs_volumes" >}}
{{% tab name="Create using vmkfstools" %}}
Pertama-tama, ssh ke dalam ESX, kemudian gunakan perintah berikut untuk membuat sebuah VMDK:

```shell
vmkfstools -c 2G /vmfs/volumes/DatastoreName/volumes/myDisk.vmdk
```

{{% /tab %}}
{{% tab name="Create using vmware-vdiskmanager" %}}
Gunakan perintah berikut untuk membuat sebuah VMDK:

```shell
vmware-vdiskmanager -c -t 0 -s 40GB -a lsilogic myDisk.vmdk
```

{{% /tab %}}

{{< /tabs >}}

#### Contoh Konfigurasi vSphere VMDK

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-vmdk
spec:
  containers:
  - image: registry.k8s.io/test-webserver
    name: test-container
    volumeMounts:
    - mountPath: /test-vmdk
      name: test-volume
  volumes:
  - name: test-volume
    # Volume VMDK ini harus sudah tersedia.
    vsphereVolume:
      volumePath: "[DatastoreName] volumes/myDisk"
      fsType: ext4
```

Lebih banyak contoh dapat ditemukan [di sini](https://github.com/kubernetes/examples/tree/master/staging/volumes/vsphere).

## Menggunakan subPath

Terkadang, diperlukan untuk membagi sebuah Volume untuk banyak kegunaan berbeda pada sebuah Pod. Kolom `volumeMounts[*].subPath` dapat digunakan untuk merinci sebuah _sub-path_ di dalam Volume yang dimaksud, menggantikan _root path_-nya.

Berikut contoh sebuah Pod dengan _stack_ LAMP (Linux Apache Mysql PHP) menggunakan sebuah Volume yang dibagi-bagi.
Isi HTML-nya dipetakan ke dalam direktori `html`-nya, dan _database_-nya akan disimpan di dalam direktori `mysql`-nya.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-lamp-site
spec:
    containers:
    - name: mysql
      image: mysql
      env:
      - name: MYSQL_ROOT_PASSWORD
        value: "rootpasswd"
      volumeMounts:
      - mountPath: /var/lib/mysql
        name: site-data
        subPath: mysql
    - name: php
      image: php:7.0-apache
      volumeMounts:
      - mountPath: /var/www/html
        name: site-data
        subPath: html
    volumes:
    - name: site-data
      persistentVolumeClaim:
        claimName: my-lamp-site-data
```

### Menggunakan subPath dengan _environment variable_ yang diekspansi

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

Gunakan kolom `subPathExpr` untuk membuat nama-nama direktori `subPath` dari _environment variable_ Downward API.
Sebelum kamu menggunakan fitur ini, kamu harus mengaktifkan _feature gate_ `VolumeSubpathEnvExpansion`. Kolom `subPath` dan `subPathExpr` bersifat _mutually exclusive_.

Pada contoh ini, sebuah Pod menggunakan `subPathExpr` untuk membuat sebuah direktori `pod1` di dalam Volume hostPath `/var/log/pods`, menggunakan nama Pod dari Downward API. Direktori _host_ `/var/log/pods/pod1` ditambatkan pada `/logs` di dalam Container-nya.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
spec:
  containers:
  - name: container1
    env:
    - name: POD_NAME
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    image: busybox
    command: [ "sh", "-c", "while [ true ]; do echo 'Hello'; sleep 10; done | tee -a /logs/hello.txt" ]
    volumeMounts:
    - name: workdir1
      mountPath: /logs
      subPathExpr: $(POD_NAME)
  restartPolicy: Never
  volumes:
  - name: workdir1
    hostPath:
      path: /var/log/pods
```

## Sumber-sumber

Media penyimpanan (Disk, SSD, dll.) dari sebuah Volume `emptyDir` ditentukan oleh medium dari _filesystem_ yang menyimpan direktori _root_ dari Kubelet (biasanya `/var/lib/kubelet`). Tidak ada batasan berapa banyak ruang yang dapat digunakan oleh Volume `emptyDir` dan `hostPath`, dan tidak ada isolasi antara Container-container atau antara Pod-pod.

Ke depannya, kita mengharapkan Volume `emptyDir` dan `hostPath` akan dapat meminta jumlah ruangan penyimpanan tertentu dengan mengunakan spesifikasi [resource][resource](/docs/user-guide/compute-resources), dan memilih tipe media penyimpanan yang akan digunakan, untuk klaster yang memiliki beberapa jenis media penyimpanan.

## _Plugin_ Volume yang Out-of-Tree

_Plugin_ Volume yang Out-of-tree termasuk Container Storage Interface (CSI) dan Flexvolume. Mereka memungkinkan _vendor_ penyimpanan untuk membuat plugin penyimpanan buatan tanpa perlu menambahkannya pada _repository_ Kubernetes.

Sebelum dikenalkannya CSI dan Flexvolume, semua _plugin_ volume (seperti jenis-jenis volume yang terdaftar di atas) berada pada "in-tree", yang berarti bahwa mereka dibangun, di-_link_, di-_compile_, dan didistribusikan bersama-sama dengan kode inti Kubernetes dan mengekstensi inti dari Kubernetes API. Hal ini berarti menambah sistem penyimpanan baru ke dalam Kubernetes (sebuah _plugin_ volume) membutukan penambahan kode tersebut ke dalam _repository_ kode inti Kubernetes.

CSI dan Flexvolume memungkinkan _plugin_ volume untuk dikembangkan secara terpisah dari kode inti Kubernetes, dan diinstal pada klaster Kubernetes sebagai ekstensi.

Bagi _vendor-vendor_ penyimpanan yang ingin membuat sebuah _plugin_ volume yang out-of-tree, lihat [FAQ ini](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md).

### CSI

[Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) mendefinisikan standar antarmuka untuk sistem orkestrasi (seperti Kubernetes) untuk mengekspos sistem penyimpanan apapun ke dalam beban kerja Container mereka.

Silahkan lihat [proposal desain CSI](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md) untuk lebih lanjut.

Dukungan untuk CSI dikenalkan sebagai Alpha pada Kubernetes v1.9, dan menjadi Beta pada Kubernetes v1.10, dan menjadi GA pada Kubernetes v1.13.

{{< note >}}
Dukungan untuk spesifikasi CSI pada versi 0.2 dan 0.3 telah kedaluwarsa pada Kubernetes v1.13 dan akan dihapus pada rilis-rilis di masa depan.
{{< /note >}}

{{< note >}}
_Driver-driver_ CSI mungkin tidak cocok pada semua rilis Kubernetes.
Silahkan lihat dokumentasi _driver_ CSI yang bersangkutan untuk petunjuk penggunaan yang didukung untuk setiap rilis Kubernetes, dan untuk melihat matriks kompabilitasnya.
{{< /note >}}

Saat sebuah _driver_ volume CSI dipasang pada klaster Kubernetes, pengguna dapat menggunakan tipe Volume `csi` untuk menambatkan volume-volume yang diekspos oleh _driver_ CSI tersebut.

Tipe Volume `csi` tidak mendukung referensi secara langsung dari Pod dan hanya dapat dirujuk di dalam sebuah Pod melalui sebuah objek `PersistentVolumeClaim`.

Kolom-kolom berikut tersedia untuk administrator-administrator penyimpanan untuk mengkonfigurasi sebuah Persistent Volume CSI.

- `driver`: Sebuah nilai string yang merinci nama dari _driver_ volume yang akan digunakan.
  Nilai ini harus sesuai dengan nilai yang dikembalikan oleh `GetPluginInfoResponse` dari _driver_CSI seperti yang didefinisikan pada [spesifikasi CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#getplugininfo).
  Ia digunakan oleh Kubernetes untuk mengidentifikasikan _driver_ CSI mana yang akan dipanggil, dan oleh komponen _driver_ CSI untuk mengidentifikasikan objek PersistentVolume mana yang dimiliki oleh _driver_ CSI tersebut.
- `volumeHandle`: Sebuah nilai string yang secara unik mengidentifikasikan volume tersebut.
  Nilai ini harus sesuai dengan nilai yang dikembalikan oleh kolom `volume.id` dari `CreateVolumeResponse` dari _driver_ CSI seperti yang didefinisikan pada [spesifikasi CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  Nilai tersebut dioper sebagai `volume_id` pada semua panggilan terhadap _driver_ volume CSI saat mereferensikan volume yang bersangkutan.
- `readOnly`: Sebuah nilai boolean bersifat opsional yang mengindikasikan jika sebuah volume akan dijadikan sebagai "ControllerPublished" (ditambatkan) sebagai _read-only_.
  Nilai bawaannya adalah `false`. Nilai ini dioper ke _driver_ CSI melalui kolom `readonly` pada `ControllerPublishVolumeRequest`.
- `fsType`: Jika nilai `VolumeMode` milik PV adalah `FileSystem`, maka kolom ini dapat digunakan untuk menunjukkan _filesystem_ yang akan digunakan untu menambatkan volume tersebut.
  Jika volume tersebut belum diformat dan memformat tidak didukung, maka nilai ini akan digunakan untuk memformat volume tersebut. Nilai ini dioper kepada _driver_ CSI melalui kolom `VolumeCapability` dari `ControllerPublishVolumeRequest`, `NodeStageVolumeRequest`, dan `NodePublishVolumeRequest`.
- `volumeAttributes`: Sebuah _map_ dari string kepada string yang merinci properti statis dari sebuah volume.
  Nilai _map_ ini harus sesuai dengan _map_ yang dikembalikan di dalam kolom `volume.attributes` pada `CreateVolumeResponse` dari _driver_ CSI seperti yang didefinisikan pada [spesifikasi CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume).
  _Map_ tersebut dioper kepada _driver_ CSI melalui kolom `volume_attributes` pada`ControllerPublishVolumeRequest`, `NodeStageVolumeRequests`, dan `NodePublishVolumeRequest`.
- `controllerPublishSecretRef`: Sebuah referensi ke objek Secret yang berisi informasi sensitif untuk diberikan pada _driver_ CSI untuk menyelesaikan panggilan `ControllerPublishVolume` dan `ControllerUnpublishVolume`.
  Kolom ini bersifat opsional, dan dapat bernilai kosong jika tidak ada Secret yang dibutuhkan. Jika objek Secret berisi lebih dari satu _secret_, maka semua _secret_ tersebut akan diberikan.
- `nodeStageSecretRef`: Sebuah referensi ke objek Secret yang berisi informasi sensitif untuk diberikan pada _driver_ CSI untuk menyelesaikan panggilan `NodeStageVolume`. Kolom ini bersifat opsional, dan dapat bernilai kosong jika tidak ada Secret yang dibutuhkan. Jika objek Secret berisi lebih dari satu _secret_, maka semua _secret_ tersebut akan diberikan.
- `nodePublishSecretRef`: Sebuah referensi ke objek Secret yang berisi informasi sensitif untuk diberikan pada _driver_ CSI untuk menyelesaikan panggilan `NodePublishVolume`. Kolom ini bersifat opsional, dan dapat bernilai kosong jika tidak ada Secret yang dibutuhkan. Jika objek Secret berisi lebih dari satu _secret_, maka semua _secret_ tersebut akan diberikan.

#### Dukungan CSI untuk volume blok _raw_

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

Dimulai pada versi 1.11, CSI memperkenalkan dukungak untuk volume blok _raw_, yang bergantung pada fitur volume blok _raw_ yang dikenalkan pada versi Kubernetes sebelumnya. Fitur ini akan memungkinkan _vendor-vendor_ dengan _driver_ CSI eksternal untuk mengimplementasi dukungan volume blok _raw_ pada beban kerja Kubernetes.

Dukungan untuk volume blok CSI bersifat _feature-gate_, tapi secara bawaan diaktifkan. Kedua _feature-gate_ yang harus diaktifkan adalah `BlockVolume` dan `CSIBlockVolume`.

Pelajari cara [menyiapkan PV/PVC dengan dukungan volume blok _raw_](/id/docs/concepts/storage/persistent-volumes/#raw-block-volume-support).

#### Volume CSI Sementara

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

FItur ini memungkinkan volume CSI untuk dipasang secara langsung pada spesifikasi Pod, menggantikan spesifikasi pada PersistentVolume. Volume yang dirinci melalui cara ini bersifat sementara tidak akan dipertahankan saat Pod diulang kembali.

Contoh:

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: my-csi-app
spec:
  containers:
    - name: my-frontend
      image: busybox
      volumeMounts:
      - mountPath: "/data"
        name: my-csi-inline-vol
      command: [ "sleep", "1000000" ]
  volumes:
    - name: my-csi-inline-vol
      csi:
        driver: inline.storage.kubernetes.io
        volumeAttributes:
              foo: bar
```

Fitur ini memerlukan diaktifkannya _feature-gate_ CSIInlineVolume:

```
--feature-gates=CSIInlineVolume=true
```

Volume CSI sementara hanya didukung oleh sebagian dari _driver-driver_ CSI. Silahkan lihat daftar _driver_ CSI [di sini](https://kubernetes-csi.github.io/docs/drivers.html).

# Sumber-sumber untuk _developer_

Untuk informasi bagaimana mengembangkan sebuah _driver_ CSI, lihat [dokumentasi kubernetes-csi](https://kubernetes-csi.github.io/docs/).

#### Migrasi ke _driver-driver_ CSI dari _plugin_ in-tree

#### Migrating to CSI drivers from in-tree plugins

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

Fitur CSI Migration, saat diaktifkan, akan mengarahkan operasi-operasi terhadap _plugin-plugin_ in-tree yang sudah ada ke _plugin-plugin_ CSI yang sesuai (yang diharap sudah dipasang dan dikonfigurasi). Fitur ini mengimplementasi logika translasi dan terjemahan yang dibutuhkan untuk mengarahkan ulang operasi-operasi bersangkutan dengan mulus. Hasilnya, operator-operator tidak perlu membuat perubahan konfigurasi apapun pada StorageClass, PV, atau PVC yang sudah ada (mengacu pada _plugin_ in-tree) saat melakukan transisi pada _driver_ CSI yang menggantikan _plugin_ in-tree yang bersangkutan.

Pada keadaan Alpha, operasi-operasi dan fitur-fitur yang didukung termasuk _provisioning/delete_, _attach/detach_, _mount/unmount_, dan mengubah ukuran volume-volume.

_Plugin-plugin_ in-tree yang mendukung CSI Migration dan mempunyai _driver_ CSI yang sesuai yang telah diimplementasikan terdaftar pada bagian "Jenis-jenis Volume" di atas.

### Flexvolume {#flexVolume}

Flexvolume adalah antarmuka _plugin_ out-of-tree yang telah ada sejak Kubernetes versi 1.2 (sebelum CSI). Ia menggunakan model berbasis _exec_ untuk berhubungan dengan _driver-driver_. Program _driver_ Flexvolume harus dipasan pada _volume plugin path_ yang telah didefinisikan sebelumnya pada setiap Node (dan pada beberapa kasus, di Master).

Pod-pod berinteraksi dengan _driver-driver_ Flexvolume melalui _plugin_ in-tree `flexvolume`.
Untuk lebih lanjut, dapat ditemukan [di sini](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md).

## _Mount Propagation_

_Mount propagation_ memungkinkan berbagi volume-volume yang ditambatkan oleh sebuah Container kepada Container-container lain di dalam Pod yang sama, atau bahkan pada Pod lainnya di dalam Node yang sama.

_Mount propagation_ dari sebuah volume diatur oleh kolom `mountPropagation` di dalam `containers[*].volumeMounts`.
Nilai-nilainya adalah sebagai berikut:

* `None` - Tambatan volume ini tidak akan menerima apapun tambatan selanjutnya yang ditambatkan pada volume ini atau apapun sub-direktori yang dimilikinya oleh _host_.
  Dengan cara yang sama, tidak ada tambatan yang dibuat oleh Container yang dapat terlihat pada _host_. Ini adalah mode bawaan.

  Mode ini setara dengan _mount propagation_ `private`, seperti yang dideskripsikan pada [dokumentasi kernel Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

* `HostToContainer` - Tambatan volume ini akan menerima semua tambatan selanjutnya yang ditambatkan pada volume ini atau pada apapun sub-direktori yang dimilikinya.

  Dalam kata lain, jika _host_ yang bersangkutan menambatkan apapun di dalam tambatan volume, Container akan melihatnya ditambatkan di sana.

  Secara serupa, jika ada Pod dengan _mount propagation_ `Bidirectional` terhadap volume yang sama menambatkan apapun ke situ, maka Container dengan _mount propagation_ `HostToContainer` akan melihatnya.

  Mode ini setara dengan _mount propagation_ `rslave`, seperti yang dideskripsikan pada [dokumentasi kernel Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

* `Bidirectional` - Tambatan volume ini memiliki perilaku yang sama dengan tambatan `HostToContainer`.
  Sebagai tambahannya, semua tambatan volume yang dibuat oleh Container akan dipropagasi kembali kepada _host_ yang bersangkutan dan ke semua Container dari semua Pod yang menggunakan volume yang sama.

  Contoh kasus umum untuk mode ini adalah Pod dengan sebuah Flexvolume atau _driver_ CSI atau sebuah Pod yang perlu menambatkan sesuatu pada _host_-nya dengan menggunakan Volume `hostPath`.

  Mode ini setara dengan _mount propagation_ `rshared`, seperti yang dideskripsikan pada [dokumentasi kernel Linux](https://www.kernel.org/doc/Documentation/filesystems/sharedsubtree.txt)

{{< caution >}}
_Mount propagation_ `Bidirectional` bisa jadi berbahaya. Ia dapat merusak sistem operasi _host_-nya, sehingga hanya diizinkan pada Container yang _privileged_. Keterbiasaan dengan perilaku kernel Linux sangat dianjurkan.
Sebagai tambahan, tambatan volume apapun yang dibuat oleh Container-container di dalam Pod-pod harus dihancurkan (dilepaskan tambatannya) oleh Container-container pada saat terminasi.
{{< /caution >}}

### Konfigurasi

Sebelum _mount propagation_ dapat bekerja dengan baik pada beberapa instalasi (CoreOS, RedHat/Centos, Ubuntu), _mount share_ harus dikonfigurasi dengan benar pada Docker, seperti yang ditunjukkan di bawah.

Sunting berkas servis `systemd` Docker kamu. Setel `MountFlags` sebagai berikut:

```shell
MountFlags=shared
```

Atau, hapus `MountFlags=slave` jika ada. Kemudian, ulang kembali _daemon_ Docker-nya:

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## {{% heading "whatsnext" %}}


* Ikuti contoh [memasang WordPress dan MySQL dengan Persistent Volume](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/).


