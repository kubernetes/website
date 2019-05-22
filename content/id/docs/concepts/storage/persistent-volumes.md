---
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: Persistent Volumes
feature:
  title: Storage orchestration
  description: >
    Automatically mount the storage system of your choice, whether from local storage, a public cloud provider such as <a href="https://cloud.google.com/storage/">GCP</a> or <a href="https://aws.amazon.com/products/storage/">AWS</a>, or a network storage system such as NFS, iSCSI, Gluster, Ceph, Cinder, or Flocker.

content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Dookumen ini menjelaskan kondisi terkini dari `PersistentVolumes` pada Kubernetes. Disarankan telah memiliki familiaritas dengan [volumes](/docs/concepts/storage/volumes/).

{{% /capture %}}


{{% capture body %}}

## Pengenalan

Mengelola penyimpanan adalah hal yang berbeda dengan mengelola komputasi. Sub-sistem `PersistentVolume` menyediakan API untuk para pengguna dan administrator yang mengabstraksi detail-detail tentang bagaimana penyimpanan disediakan dari bagaimana penyimpanan dikonsumsi. Untuk melakukan ini, kami mengenalkan dua sumber daya API baru:  `PersistentVolume` dan `PersistentVolumeClaim`.

Sebuah `PersistentVolume` (PV) adalah suatu bagian dari penyimpanan pada kluster yang telah disediakan oleh seorang administrator. PV merupakan sebuah sumber daya pada kluster sama halnya dengan *node* yang juga merupakan sumber daya kluster. PVs adalah *plugins* volume seperti Volumes, tetapi memiliki siklus hidup yang independen daripada *pod* individual yang menggunakan PV tersebut. Objek API ini menangkap detail-detail implementasi dari penyimpanan, seperti NFS, iSCSI, atau sistem penyimpanan yang spesifik pada penyedia layanan *cloud*.

Sebuah `PersistentVolumeClaim` (PVC) merupakan permintaan penyimpanan oleh pengguna. PVC mirip dengan sebuah *pod*. Pods mengonsumsi sumber daya *node* dan PVCs mengonsumsi sumber daya PV. Pods dapat meminta taraf-taraf spesifik dari sumber daya (CPU dan Memory).  Claims dapat meminta ukuran dan mode akses yang spesifik (seperti, can be mounted once read/write or many times read-only).

While `PersistentVolumeClaims` allow a user to consume abstract storage
resources, it is common that users need `PersistentVolumes` with varying
properties, such as performance, for different problems. Cluster administrators
need to be able to offer a variety of `PersistentVolumes` that differ in more
ways than just size and access modes, without exposing users to the details of
how those volumes are implemented. For these needs there is the `StorageClass`
resource.

Please see the [detailed walkthrough with working examples](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).


## Siklus hidup dari sebuah volume dan klaim

PV adalah sumber daya dalam sebuah kluster. PVC adalah permintaan terhadap sumber daya tersebut dan juga berperan sebagai pemeriksaan klaim dari sumber daya yang diminta. Interaksi antara PV dan PVC mengikuti siklus hidup berikut ini:

### Penyediaan

Ada dua cara untuk menyediakan PV: secara statis atau dinamis.

#### Statis
Seorang administrator kluster membuat beberapa PV. PV yang telah dibuat membawa detail-detail dari penyimpanan yang sesungguhnya tersedia untuk digunakan oleh pengguna kluster. PV tersebut ada pada Kubernetes API dan siap untuk digunakan.

#### Dinamis
Ketika tidak ada PV statis yang dibuat oleh administrator yang sesuai dengan `PersistentVolumeClaim` yang dibuat oleh pengguna, kluster akan mencoba untuk menyediakan volume khusus sesuai permintaan PVC.
Penyediaan dinamis ini berbasis/berdasarkan `StorageClass`: artinya PVC harus meminta sebuah *storage class* dan *storage class* tersebut harus sudah dibuat dan dikonfigurasi oleh administrator agar penyediaan dinamis bisa terjadi. Klaim yang meminta PV dengan *storage class* `""` secara efektif telah menonaktifkan penyediaan dinamis.

Untuk mengaktifkan penyediaan *storage* dinamis berdasarkan *storage class*, administrator kluster harus mengaktifkan `DefaultStorageClass` [admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
pada API *server*. Hal ini dapat dilakukan, dengan cara memastikan `DefaultStorageClass` ada di antara urutan daftar *values* yang dibatasi koma untuk *flag* `--enable-admission-plugins` pada komponen API *server*. Untuk informasi lebih lanjut mengenai flag perintah pada API *server*, silakan cek dokumentasi For more information on API server command line flags,
[kube-apiserver](/docs/admin/kube-apiserver/).

### Pengikatan *Binding*

Seorang pengguna membuat, atau telah membuat (dalam kasus penyediaan dinamis), sebuah `PersistentVolumeClaim` dengan jumlah storage spesifik yang diminta dan dengan mode akses tertentu. Sebuah *control loop* pada *master* akan melihat adanya PVC baru, mencari PV yang cocok (jika memungkinkan), dan mengikat PVC dengan PV tersebut. Jika sebuah PV disediakan secara dinamis untuk sebuah PVC baru, *loop* tersebut akan selalu mengikat PV tersebut pada PVC yang baru dibuat itu. Otherwise, pengguna akan selalu mendapatkan setidaknya apa yang dimintanya, tetapi volume tersebut mungkin lebih dari apa yang diminta sebelumnya. Setelah terikat, ikatan `PersistentVolumeClaim` bersifat eksklusif, terlepas dari bagaimana caranya mereka bisa terikat. Sebuah ikatan PVC ke PV merupakan *one-to-one mapping*.

Klaim akan berada dalam kondisi tidak terikat tanpa kepastian jika tidak ada volume yang cocok. Klaim akan terikat dengan volume yang cocok ketika ada volume yang cocok. Sebagai contoh, sebuah kluster yang sudah menyediakan banyak PV berukuran 50Gi tidak akan cocok dengan PVC yang meminta 100Gi. PVC akan terikat hanya ketika PV 100Gi ditambahkan ke kluster.

### Penggunaan Using

Pod menggunakan klaim sebagai volume. Kluster menginspeksi klaim untuk menemukan volume yang terikat dengan klaim tersbut dan memasangkan volume tersebut ke pada pod. Untuk volume yang mendukung banyak mode akses, pengguna yang menentukan mode yang diinginkan ketika menggunakan klaim sebagai volume dalam sebuah pod.

Ketika pengguna memiliki klaim dan klaim tersebut telah terikat, PV yang terikat menjadi hak penggunanya selama yang dibutuhkan. Pengguna menjadwalkan pod dan mengakses PV yang sudah diklaim dengan menambahkan `persistentVolumeClaim` pada blok volume pada Pod miliknya. [See below for syntax details](#claims-as-volumes).

### Object *Storage* dalam Perlindungan Penggunaan Storage Object in Use Protection
Tujuan dari Objek *Storage* dalam Perlindungan Penggunan adalah untuk memastikan *Persistent Volume Claim)*(PVC) yang sedang aktif digunakan oleh sebuah pod dan *Persistent Volume* (PV) yang terikat pada PVC tersebut tidak dihilangkan dari sistem karena hal ini dapat menyebabkan kehilangan data.

{{< note >}}
PVC dalam penggunaan aktif oleh sebuah pod ketika sebuah objek pod ada yang menggunakan PVC tersebut.
{{< /note >}}

Jika seorang pengguna menghapus PVC yang sedang aktif digunakan oleh sebuah pod, PVC tersebut tidak akan langsung dihapus. Penghapusan PVC akan ditunda sampai PVC tidak lagi aktif digunakan oleh pod manapun, dan juga ketika admin menghapus sebuah PV yang terikat dengan sebuah PVC, PV tersebut tidak akan langsung dihapus. Penghapusan PV akan ditunda sampai PV tidak lagi terikat dengan sebuah PVC.

Anda dapat melihat PVC yang dilindungi ketika status PVC `Terminating` dan daftar `Finalizers` meliputi `kubernetes.io/pvc-protection`:

```shell
kubectl describe pvc hostpath
Name:          hostpath
Namespace:     default
StorageClass:  example-hostpath
Status:        Terminating
Volume:        
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-class=example-hostpath
               volume.beta.kubernetes.io/storage-provisioner=example.com/hostpath
Finalizers:    [kubernetes.io/pvc-protection]
...
```

Anda dapat melihat sebuah PV dilindungi ketika `Terminating` dan daftar `Finalizers` juga meliputi `kubernetes.io/pv-protection`:

```shell
kubectl describe pv task-pv-volume
Name:            task-pv-volume
Labels:          type=local
Annotations:     <none>
Finalizers:      [kubernetes.io/pv-protection]
StorageClass:    standard
Status:          Available
Claim:           
Reclaim Policy:  Delete
Access Modes:    RWO
Capacity:        1Gi
Message:         
Source:
    Type:          HostPath (bare host directory volume)
    Path:          /tmp/data
    HostPathType:  
Events:            <none>
```

### Melakukan Reklaim Reclaiming

Ketika seorang user telah selesai dengan volumenya, ia dapat menghapus objek PVC dari API yang meungkinkan untuk reklamasi dari sumber daya tersebut. Kebijakan reklaim dari sebuah `PersistentVolume` menyatakan apa yang dilakukan kluster setelah volume dilepaskan dari klaimnya. Saat ini, volume dapat dipertahankan (*Retained*), didaurulang (*Recycled*), atau dihapus (*Deleted*).

#### *Retain*

`Retain` merupakan kebijakan reklaim yang mengizinkan reklamasi manual dari sebuah sumber daya. Ketika `PersistentVolumeClaim` dihapus, `PersistentVolume` masih akan tetap ada dan volume tersebut dianggap "terlepas" . Tetapi PV tersebut belum tersedia untuk klaim lainnya karena data milik pengklaim sebelumnya masih terdapat pada volume. Seorang administrator dapat mereklaim volume secara manual melalui beberapa langkah.

1. Menghapus `PersistentVolume`. Aset *storage* yang terasosiasi dengan infrastruktur eksternal (seperti AWS EBS, GCE PD, Azure Disk, atau Cinder Volume) akan tetap ada setelah PV dihapus.
2. Secara manual membersihkan data pada aset *storage* yang terasosiasi accordingly.
3. Secara manual menghapus aset *storage*, atau jika Anda ingin menggunakan aset *storage* yang sama, buatlah sebuah `PersistentVolume` baru dengan definisi aset *storage* tersebut.

#### *Delete*

Untuk plugin volume yang mendukung kebijakan reklaim `Delete`, penghapusan menghilangkan kedua objek `PersistentVolume` dari Kubernetes, dan juga aset *storage* yang terasosiasi pada infrastruktur eksternal seperti, AWS EBS, GCE PD, Azure Disk, atau Cinder Volume. Volume yang disediakan secara dinamis mewarisi [kebijakan reklaim dari `StorageClass` turunannya](#reclaim-policy), yang secara bawaan adalah `Delete`. Administrator harus mengkonfigurasi `StorageClass` sesuai ekspektasi pengguna, otherwise PV tersebut harus diubah atau ditambal setelah dibuat nanti. Lihat [Change the Reclaim Policy of a PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

#### *Recycle*

{{< warning >}}
Kebijakan reklaim `Recycle` sudah is deprecated. Instead, pendekatan yang direkomendasikan adalah menggunakin penyediaan dinamis.
{{< /warning >}}

Jika didukung oleh plugin volume underlying, kebijakan reklaim `Recycle` melakukan scrub dasar (`rm -rf /thevolume/*`) pada volume dan membuatnya kembali tersedia untuk klaim baru.

Namun, seorang administrator dapat mengkonfigurasi templat pod *recycler* kustom menggunakan argumen *command line* manager controller Kubernetes sebagaimana dijelaskan [di sini](/docs/admin/kube-controller-manager/). Templat pod *resycler* kustom harus mengandung spesifikasi `volumes`, seperti yang ditunjukkan pada contoh di bawah:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pv-recycler
  namespace: default
spec:
  restartPolicy: Never
  volumes:
  - name: vol
    hostPath:
      path: /any/path/it/will/be/replaced
  containers:
  - name: pv-recycler
    image: "k8s.gcr.io/busybox"
    command: ["/bin/sh", "-c", "test -e /scrub && rm -rf /scrub/..?* /scrub/.[!.]* /scrub/*  && test -z \"$(ls -A /scrub)\" || exit 1"]
    volumeMounts:
    - name: vol
      mountPath: /scrub
```

Namun, the particular path  yang dispesifikasikan pada templat pod *recycler* kustom pada bagian `volumes` diganti dengan with the particular path dari volume yang akan didaurulang.

### Memperluas Persistent Volumes Claim Expanding Persistent Volumes Claims

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

Dukungan untuk memperluas PersistentVolumeClaim (PVC) sekarang sudah diaktifkan sejak awal. Anda dapat memperluas 
tipe-tipe volume berikut:

* gcePersistentDisk
* awsElasticBlockStore
* Cinder
* glusterfs
* rbd
* Azure File
* Azure Disk
* Portworx
* FlexVolumes
* CSI

Anda hanya dapat memperluas sebuah PVC jika kolom `allowVolumeExpansion` dipasang sebagai benar pada *storage class* miliknya.

``` yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

Untuk meminta volume yang lebih besar pada sebuah PVC, ubah object PVC dan spesifikasikan ukuran yang lebih
besar. Hal ini akan memicu perluasan dari volume yang berada di balik `PersistentVolume`. Sebuah 
`PersistentVolume` baru tidak akan pernah dibuat untuk memenuhi klaim tersebut. Sebaliknya, volume yang sudah ada akan diatur ulang ukurannya.

#### Perluasan Volume CSI CSI Volume expansion

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

Perluasan volume CSI membutuhkan Anda untuk mengaktifkan gerbang fitur `ExpandCSIVolumes` dan juga membutuhken *driver* CSI yang spesifik untuk mendukung perluasan volume. Silakan merujuk pada dokumentasi *driver* spesifik CSI untuk informasi lebih lanjut.


#### Mengatur ulang ukuran sebuah volume yang memiliki *file system* Resizing a volume containing a file system

Anda hanya dapat mengatur ulang ukuran volume yang memiliki *file system* jika *file system* tersebut adalah XFS, Ext3, atau Ext4.

Ketika sebuah volume memiliki *file system*, *file system* tersebut hanya akan diatur ulang ukurannya ketika sebuah pod baru dinyalakan menggunakan
`PersistentVolumeClaim` dalam mode *ReadWrite*. Maka dari itu, jika sebuah pod atau *deployment* menggunakan sebuah volume dan
Anda ingin memperluasnya, Anda harus menghapus atau membuat ulang pod tersebut setelah volume selesai diperluas oleh penyedia *cloud* dalam *controller-manager*. Anda dapat melihat status dari operasi resize dengan menjalankan perintah `kubectl describe pvc`:

```
kubectl describe pvc <pvc_name>
```

Jika `PersistentVolumeClaim` memiliki status `FileSystemResizePending`, maka aman untuk membuat ulang pod menggunakan PersistentVolumeClaim tersebut.

FlexVolumes mengizinkan resize jika *driver* dipasang `RequiresFSResize` capability menjadi benar (*true*). 
FlexVolume dapat diatur ulang pada saat pod mengalami *restart*. 

{{< feature-state for_k8s_version="v1.11" state="alpha" >}}

#### Mengatur ulang ukuran PersistentVolumeClaim yang sedang digunakan Resizing an in-use PersistentVolumeClaim

Memperluas PVCs yang sedang digunakan merupakan fitur alpha. Untuk menggunakannya, aktifkan gerbang fitur `ExpandInUsePersistentVolumes`.
Pada kasus ini, Anda tidak perlu menghapus dan membuat ulang sebuah Pod atau *deployment* yang menggunakan PVC yang telah ada.
PVC yang manapun yang sedang digunakan secara otomatis menjadi tersedia untuk pod-nya segera setelah *file system*-nya diperluas.
Fitur ini tidak memiliki efek pada PVC yang tidak sedang digunakan oleh Pod atau *deployment* . Anda harus membuat sebuah Pod yang
menggunakan PVC sebelum perluasan dapat selesai dilakukan.

Memperluas PVC yang sedang digunakan untuk sudah ditambahkan pada rilis 1.13. Untuk mengaktifkan fitur ini gunakan `ExpandInUsePersistentVolumes` dan gerbang fitur `ExpandPersistentVolumes`.  Gerbang fitur `ExpandPersistentVolumes` sudah diaktifkan dari awal. Jika `ExpandInUsePersistentVolumes` sudah terpasang, FlexVolume dapat diatur ulang ukurannya secara langsung tanpa perlu melakukan *restart* pod. 
 
{{< note >}}
FlexVolume resize hanya mungkin dilakukan ketika *driver* yang menjalankannya mendukung resize.
{{< /note >}}

{{< note >}}
Memperluas volume EBS merupakan operasi yang memakan waktu. Also, ada kuota per-volume quota untuk satu kali modifikasi setiap 6 jam.
{{< /note >}}


## Tipe-tipe Persistent Volumes Types of Persistent Volumes

Tipe-tipe `PersistentVolume` diimplementasikan sebagai plugins.  Kubernetes saat ini mendukung plugins berikut:

* GCEPersistentDisk
* AWSElasticBlockStore
* AzureFile
* AzureDisk
* FC (Fibre Channel)
* Flexvolume
* Flocker
* NFS
* iSCSI
* RBD (Ceph Block Device)
* CephFS
* Cinder (OpenStack block storage)
* Glusterfs
* VsphereVolume
* Quobyte Volumes
* HostPath (Hanya untuk pengujian single node -- storage lokal tidak didukung dan TIDAK AKAN BEKERJA pada kluster multi-node)
* Portworx Volumes
* ScaleIO Volumes
* StorageOS

## Persistent Volumes

Setiap PV memiliki sebuah *spec* dan status, yang merupakan spesifikasi dan status dari volume tersebut.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  mountOptions:
    - hard
    - nfsvers=4.1
  nfs:
    path: /tmp
    server: 172.17.0.2
```

### Kapasitas

Secara umum, sebuah PV akan memiliki kapasitas *storage* tertentu.  Hal ini ditentukan menggunakan atribut `capacity` pada PV.  Lihat [Resource Model](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) Kubernetes untuk memahami satuan yang diharapkan `capacity`.

Saat ini, ukuran *storage* merupakan satu-satunya sumber daya yang dapat ditentukan atau diminta. Atribut-atribut lainnya di masa depan dapat mencakup IOPS, *throughput*, dsb.

### Mode Volume Volume Mode

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Sebelum Kubernetes 1.9, semua *plugins* volume akan membuat sebuah *filesystem* pada PersistentVolume.
Sekarang, Anda dapat menentukan nilai dari `volumeMode` menjadi `block` untuk menggunakan perangkat *a *raw block*, atau `filesystem`
untuk menggunakan sebuah *filesystem*. `filesystem` menjadi awalan default jika nilainya dihilangkan. Hal ini merupakan parameter API
opsional.

### Mode Akses Access Modes

Sebuah `PersistentVolume` dapat dipasangkan pada sebuah *host* dengan cara apapun yang didukung oleh penyedia sumber daya.  Seperti ditunjukan pada tabel di bawah, para penyedia akan memiliki kapabilitas yang berbeda-beda dan setiap mode akses PV akan ditentukan menjadi mode-mode spesifik yang didukung oleh tiap volume tersebut. Sebagai contoh, NFS dapat mendukung banyak kllien *read/write*, tetapi sebuah NFS PV tertentu mungkin diekspor pada server sebagai read-only. Setiap PV memilik seperangkat mode aksesnya sendiri yang menjelaskan kapabilitas dari PV tersebut.

Beberapa mode akses antara lain:

* ReadWriteOnce -- the volume dapat dipasang sebagai read-write oleh satu node
* ReadOnlyMany -- the volume dapat dipasang sebagai read-only oleh banyak nodes
* ReadWriteMany -- the volume dapat dipasang sebagai read-write oleh banyak nodes

Pada CLI, mode-mode akses tersebut disingkat menjadi:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany

> __Penting!__ Sebuah volume hanya dapat dipasang menggunakan satu mode akses dalam satu waktu, meskipun volume tersebut mendukung banyak mode.  Sebagai contoh, sebuah GCEPersistentDisk dapat dipasangkan sebagai ReadWriteOnce oleh single node atau ReadOnlyMany oleh banyak node, tetapi tidak dalam waktu yang bersamaan.


| Volume Plugin        | ReadWriteOnce| ReadOnlyMany| ReadWriteMany|
| :---                 |     :---:    |    :---:    |    :---:     |
| AWSElasticBlockStore | &#x2713;     | -           | -            |
| AzureFile            | &#x2713;     | &#x2713;    | &#x2713;     |
| AzureDisk            | &#x2713;     | -           | -            |
| CephFS               | &#x2713;     | &#x2713;    | &#x2713;     |
| Cinder               | &#x2713;     | -           | -            |
| FC                   | &#x2713;     | &#x2713;    | -            |
| Flexvolume           | &#x2713;     | &#x2713;    | depends on the driver |
| Flocker              | &#x2713;     | -           | -            |
| GCEPersistentDisk    | &#x2713;     | &#x2713;    | -            |
| Glusterfs            | &#x2713;     | &#x2713;    | &#x2713;     |
| HostPath             | &#x2713;     | -           | -            |
| iSCSI                | &#x2713;     | &#x2713;    | -            |
| Quobyte              | &#x2713;     | &#x2713;    | &#x2713;     |
| NFS                  | &#x2713;     | &#x2713;    | &#x2713;     |
| RBD                  | &#x2713;     | &#x2713;    | -            |
| VsphereVolume        | &#x2713;     | -           | - (works when pods are collocated)  |
| PortworxVolume       | &#x2713;     | -           | &#x2713;     |
| ScaleIO              | &#x2713;     | &#x2713;    | -            |
| StorageOS            | &#x2713;     | -           | -            |

### Kelas Class

Sebuah PV bisa memiliki sebuah kelas, yang dispesifikasi dalam pengaturan atribut
`storageClassName` menjadi nama
[StorageClass](/docs/concepts/storage/storage-classes/).
Sebuah PV dari kelas tertentu hanya dapat terikat dengan PVC yang meminta
kelas tersebut. Sebuah PV tanpa `storageClassName` tidak memiliki kelas dan hanya dapat terikat
dengan PVCs yang tidak meminta kelas tertentu.

Dahulu, anotasi `volume.beta.kubernetes.io/storage-class` digunakan dari
pada atribut `storageClassName`. Anotasi ini masih dapat bekerja, namun
akan dihilangkan sepenuhnya pada rilis Kubernetes mendatang.

### Kebijakan Reklaim Reclaim Policy

Kebijakan-kebijakan reklaim saat ini antara lain:

* Retain -- reklamasi manual
* Recycle -- basic scrub (`rm -rf /thevolume/*`)
* Delete -- aset *storage* terasosiasi seperti AWS EBS, GCE PD, Azure Disk, atau OpenStack Cinder volume akan dihapus

Saat ini, hanya NFS dan HostPath yang mendukung daur ulang. AWS EBS, GCE PD, Azure Disk, dan Cinder volumes mendukung penghapusan.

### Opsi Pemasangan Mount Options

Seorang administrator Kubernetes dapat menspesifikasi opsi pemasangan tambahan untuk ketika sebuah Persistent Volume dipasangkan pada sebuah *node*. additional mount options for when a Persistent Volume is mounted on a node.

{{< note >}}
Tidak semua tipe Persistent Volume mendukung opsi pemasanagan.
{{< /note >}}

Tipe-tipe volume yang mendukung opsi pemasangan antara lain:

* AWSElasticBlockStore
* AzureDisk
* AzureFile
* CephFS
* Cinder (OpenStack block storage)
* GCEPersistentDisk
* Glusterfs
* NFS
* Quobyte Volumes
* RBD (Ceph Block Device)
* StorageOS
* VsphereVolume
* iSCSI

Opsi pemasangan tidak divalidasi, sehingga pemasangan akan gagal jika salah satunya tidak valid.

Dahulu, anotasi `volume.beta.kubernetes.io/mount-options` digunakan instead
pada atribut `mountOptions`. Anotasi ini masih dapat bekerja, namun
akan dihilangkan sepenuhnya pada rilis Kubernetes mendatang.

### Afinitas Node Node Affinity

{{< note >}}
Untuk kebanyakan tipe volume, Anda tidak perlu memasang kolom ini. Kolom ini secara otomatis terisi untuk tipe blok volume [AWS EBS](/docs/concepts/storage/volumes/#awselasticblockstore), [GCE PD](/docs/concepts/storage/volumes/#gcepersistentdisk) dan [Azure Disk](/docs/concepts/storage/volumes/#azuredisk). Anda harus mengaturnya secara eksplisit untuk volume [lokal](/docs/concepts/storage/volumes/#local).
{{< /note >}}

Sebuah PV dapat menspesifikasi [afinitas node](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volumenodeaffinity-v1-core) untuk mendefinisikan batas-batas yang membatasi node mana saja yang dapat mengakses volume tersebut. Pods yang menggunakan sebuah PV hanya akan bisa dijadwalkan ke nodes yang dipilih oleh afinitas node.

### Fase Phase

Sebuah volume akan berada dalam salah satu fase di bawah ini:

* Available -- sumberdaya bebas yang belum terikat dengan sebuah klaim
* Bound -- volume sudah terikat dengan sebuah klaim
* Released -- klaim sudah dihapus, tetapi sumber daya masih belum direklaim oleh kluster
* Failed -- volume gagal menjalankan reklamasi otomatis

CLI akan menunjukkan nama dari PVC yang terikat pada PV.

## PersistentVolumeClaims

Setiap PVC memiliki spec dan status, yang merupakan spesifikasi dan status dari klaim.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Filesystem
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
  selector:
    matchLabels:
      release: "stable"
    matchExpressions:
      - {key: environment, operator: In, values: [dev]}
```

### Mode Akses Access Modes

Klaim menggunakan penulisan yang sama dengan volume ketika meminta *storage* dengan mode akses tertentu.

### Mode Volume Volume Modes

Klaim menggunakan penulisan yang sama dengan volume untuk mengindikasikan konsumsi dari volume sebagai *filesystem* ataupun perangkat *block*.

### Sumber daya Resources

Klaim, seperti pods, bisa meminta sumber daya dengan jumlah tertentu.  Pada kasus ini, permintaan untuk *storage*.  [Model sumber daya](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) yang sama berlaku untuk baik volumes dan claims.

### Selector

Klaim dapat menspesifikasi [label selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors) untuk memilih serangkaian volume lebih jauh. Hanya volume yang cocok labelnya dengan selector yang dapat terikat dengan klaim. Selector dapat terdiri dari dua kolom:

* `matchLabels` - the volume harus memiliki label dengan nilai ini
* `matchExpressions` - daftar dari kebutuhan-kebutuhan yang dibuat dengan menspesifikasi kunci, daftar nilai, dan operator yang terkait dengan kunci dan nilai. Operator yang valid meliputi In, NotIn, Exists, dan DoesNotExist.

Semua kebutuhan tersebut, dari `matchLabels` dan `matchExpressions` akan dilakukan ANDed bersama – semuanya harus dipenuhi untuk mendapatkan kecocokan.

### Kelas

Sebuah klaim dapat meminta kelas tertentu dengan menspesifikasi nama dari
[StorageClass](/docs/concepts/storage/storage-classes/)
menggunakan atribut `storageClassName`.
Hanya PV dari kelas yang diminta, yang memiliki `storageClassName` yang sama dengan PVC, yang dapat
terikat dengan PVC.

PVC tidak harus meminta sebuah kelas. Sebuah PVC dengan `storageClassName` miliknya terpasang
sama dengan `""` selalu diinterpretasikan sebagai meminta PV tanpa kelas, jadi PVC
hanya bisa terikat ke PV tanpa kelas (tanpa anotasi atau sama dengan
`""`). Sebuah PVC tanpa `storageClassName` tidaklah sama dan diperlakukan berbeda
oleh kluster tergantung apakah
[`DefaultStorageClass` admission plugin](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
dinyalakan.

* Jika admission plugin dinyalakan, administrator bisa menspesifikasi
  default `StorageClass`. Seluruh PVCs yang tidak memiliki `storageClassName` dapat terikat hanya ke
  PVs yang default. Menspesifikasikan default `StorageClass` dapat dilakukan dengan mengatur
  anotasi `storageclass.kubernetes.io/is-default-class` menjadi "true" pada
  sebuah objek `StorageClass`. Jika administrator tidak menspesifikasikan default,
  kluster menanggapi pembuatan PVC sekan-akan admission plugin dimatikan. Jika
  ada lebih dari satu default dispesifikasikan, the admission plugin melarang pembuatan seluruh
  PVCs.
* Jika admission plugin dimatikan, tidak ada no notion of a default
  `StorageClass`. Semua PVCs yang tidak memiliki `storageClassName` hanya dapat diikat ke to PVs yang
  tidak memiliki kelas. Pada kasus ini, PVCs yang tidak memiliki `storageClassName` diperlakukan
  sama seperti PVCs yang memiliki `storageClassName` diatur menjadi `""`.

Tergantung metode instalasi, a default StorageClass dapat di deployed
ke kluster Kubernetes oleh addon manager pada saat instalasi.

Ketika sebuah PVC menspesifikasi sebuah `selector` selain meminta `StorageClass`,
kebutuhan tersebut akan ANDed bersama: hanya PV dari kelas yang diminta dan dengan
label yang diminta yang dapat terikat ke PVC.

{{< note >}}
Saat ini, sebuah PVC dengan `selector` yang tak kosong tidak dapat memiliki PV yang disediakan secara dinmais untuknya.
{{< /note >}}

Dahulu, anotasi `volume.beta.kubernetes.io/storage-class` digunakan instead
pada atribut `storageClassName`. Anotasi ini masih dapat bekerja, namun
akan dihilangkan sepenuhnya pada rilis Kubernetes mendatang.

## Klaim sebagai Volume Claims As Volumes

Pods mengakses storage dengan menggunakan klaim sebagai volume.  Klaim harus ada pada *namespace* yang sama dengan pod yang menggunakan klaim tersebut.  Kluster menemukan klaim pada *namespace* yang sama dengan pod dan menggunakannya untuk mendapatkan `PersistentVolume` yang ada di baliknya.  Volume tersebut kemudian dipasangkan ke *host* dan lalu ke pod.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

### Catatan Mengenai *Namespace* A Note on Namespaces

Ikatan `PersistentVolumes` bersifat eksklusif, dan karena `PersistentVolumeClaims` merupakan objek yang berada pada *namespace*, pemasangan klaim dengan "banyak" mode (`ROX`, `RWX`) hanya dimungkinkan jika berada dalam satu *namespace* yang sama.

## Dukungan Raw Block Volume

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Volume plugins berikut mendukung raw block volumes, termasuk penyediaan dinamis jika
mungkin diterapkan.

* AWSElasticBlockStore
* AzureDisk
* FC (Fibre Channel)
* GCEPersistentDisk
* iSCSI
* Local volume
* RBD (Ceph Block Device)
* VsphereVolume (alpha)

{{< note >}}
Hanya FC dan volume iSCSI yang mendukung raw block volumes pada Kubernetes 1.9.
Dukungan untuk plugins lainnya ditambahkan pada 1.10.
{{< /note >}}

### Persistent Volumes using a Raw Block Volume
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: block-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  persistentVolumeReclaimPolicy: Retain
  fc:
    targetWWNs: ["50060e801049cfd1"]
    lun: 0
    readOnly: false
```
### Persistent Volume Claim requesting a Raw Block Volume
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: block-pvc
spec:
  accessModes:
    - ReadWriteOnce
  volumeMode: Block
  resources:
    requests:
      storage: 10Gi
```
### Pod specification adding Raw Block Device path in container
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-block-volume
spec:
  containers:
    - name: fc-container
      image: fedora:26
      command: ["/bin/sh", "-c"]
      args: [ "tail -f /dev/null" ]
      volumeDevices:
        - name: data
          devicePath: /dev/xvda
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: block-pvc
```

{{< note >}}
Ketika menambahkan sebuah perangkat raw block untuk sebuah Pod, kita menspesifikasi device path dalam kontainer instead of pemasangan path.
{{< /note >}}

### Mengikat Block Volumes

Jika seorang pengguna meminta sebuah raw block volume dengan mengindikasikannya menggunakan kolom `volumeMode` pada spec `PersistentVolumeClaim`, aturan pengikatannya sedikit berbeda dibanding rilis-rilis sebelumnya yang tidak memerhatikan mode ini sebagai bagian dari spec.
Di bawah merupakan tabel dari kemungkinan kombinasi pengguna dan admin dapat spesifikasikan untuk meminta sebuah perangkat raw block. Tabel tersebut mengindikasikan apakah volume akan terikat atau tidak jika dikombinasikan dengan cara tertentu:
Matriks pengikatan volume untuk volume yang disediakan secara statik:

| PV volumeMode | PVC volumeMode  | Result           |
| --------------|:---------------:| ----------------:|
|   unspecified | unspecified     | BIND             |
|   unspecified | Block           | NO BIND          |
|   unspecified | Filesystem      | BIND             |
|   Block       | unspecified     | NO BIND          |
|   Block       | Block           | BIND             |
|   Block       | Filesystem      | NO BIND          |
|   Filesystem  | Filesystem      | BIND             |
|   Filesystem  | Block           | NO BIND          |
|   Filesystem  | unspecified     | BIND             |

{{< note >}}
Hanya volume yang disediakan secara statik yang didukung untuk rilis alfa. Administrator harus memperhatikan nilai-nilai tersebut ketika mengerjakan pernagkat-perangkat raw block.
{{< /note >}}

## Volume Snapshot and Restore Volume from Snapshot Support

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Fitur volume snapshot ditambahkan hanya mendukung CSI Volume Plugins. Untuk lebih detail, lihat [volume snapshots](/docs/concepts/storage/volume-snapshots/).

Untuk mengaktifkan dukungan untuk mengembalikan sebuah volume dari sebuah sumber data volume snapshot, aktifkan
gerbang fitur `VolumeSnapshotDataSource` pada apiserver dan controller-manager.

### Create Persistent Volume Claim from Volume Snapshot
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restore-pvc
spec:
  storageClassName: csi-hostpath-sc
  dataSource:
    name: new-snapshot-test
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## Writing Portable Configuration

Jika Anda menulis templat konfigurasi atau contoh yang dapat berjalan pada berbagai macam kluster
dan membutuhkan persistent storage, kami merekomendasikan agar Anda menggunakan pola berikut:

- Masukkan objek PersistentVolumeClaim pada kumpulan config Anda (bersamaan dengan
  Deployments, ConfigMaps, dsb).
- Jangan memasukkan objek PersistentVolume pada config, karena pengguna yang menginstantiasi
  config tersebut kemungkinan tidak memiliki izin untuk membuat PersistentVolumes.
- Berikan pengguna opsi untuk menyediakan nama storage class ketika menginstantiasi
  templat.
  - Jika pengguna menyediakan nama storage class, taruh nilai tersebut pada
    kolom `persistentVolumeClaim.storageClassName`.
    Hal ini akan membuat PVC agar sesuai dengan kelas storage
    yang tepat jika kluster memiliki StorageClasses diaktifkan oleh admin.
  - Jika pengguna tidak menyediakan nama storage class, biarkan
    kolom `persistentVolumeClaim.storageClassName` kosong.
    - Hal ini kakan membuat sebuah PV disediakan secara otomatis untuk pengguna dengan
      default StorageClass pada kluster.  Banyak kluster environments memiliki
      a default StorageClass yang sudah terpasang, atau administrator dapat membuat
      default StorageClass sendiri.
- In your tooling, do watch for PVCs tidak kunjung terikat setelah beberapa lama
  dan surface hal ini pada pengguna, karena hal ini dapat mengindikasikan kluster tidak
  memiliki dukungan storage dinamis (di mana pengguna harus membuat PV yang sesuai)
  atau kluster tidak memiliki sistem storage (di mana penggun tidak dapat deploy
  PVC yang membutuhkan config).

{{% /capture %}}
