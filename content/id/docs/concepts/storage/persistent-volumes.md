---
title: Persistent Volume
feature:
  title: Orkestrasi penyimpanan
  description: >
    Secara otomatis memasang sistem penyimpanan pilihanmu, baik dari penyimpanan lokal, penyedia layanan _cloud_ seperti <a href="https://cloud.google.com/storage/">GCP</a> atau <a href="https://aws.amazon.com/products/storage/">AWS</a>, maupun sebuah sistem penyimpanan jaringan seperti NFS, iSCSI, Gluster, Ceph, Cinder, atau Flocker.

content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Dokumen ini menjelaskan kondisi terkini dari `PersistentVolumes` pada Kubernetes. Disarankan telah memiliki familiaritas dengan [volume](/docs/concepts/storage/volumes/).

{{% /capture %}}


{{% capture body %}}

## Pengenalan

Mengelola penyimpanan adalah hal yang berbeda dengan mengelola komputasi. Sub-sistem `PersistentVolume` (PV) menyediakan API untuk para pengguna dan administrator yang mengabstraksi detail-detail tentang bagaimana penyimpanan disediakan dari bagaimana penyimpanan dikonsumsi. Untuk melakukan ini, kami mengenalkan dua sumber daya API baru:  `PersistentVolume` (PV) dan `PersistentVolumeClaim` (PVC).

Sebuah `PersistentVolume` (PV) adalah suatu bagian dari penyimpanan pada kluster yang telah disediakan oleh seorang administrator. PV merupakan sebuah sumber daya pada kluster sama halnya dengan _node_ yang juga merupakan sumber daya kluster. PV adalah _volume plugin_ seperti _Volumes_, tetapi memiliki siklus hidup yang independen dari _pod_ individual yang menggunakan PV tersebut. Objek API ini menangkap detail-detail implementasi dari penyimpanan, seperti NFS, iSCSI, atau sistem penyimpanan yang spesifik pada penyedia layanan _cloud_.

Sebuah `PersistentVolumeClaim` (PVC) merupakan permintaan penyimpanan oleh pengguna. PVC mirip dengan sebuah _pod_. _Pod_ mengonsumsi sumber daya _node_ dan PVC mengonsumsi sumber daya PV. _Pods_ dapat meminta taraf-taraf spesifik dari sumber daya (CPU dan Memory).  Klaim dapat meminta ukuran dan mode akses yang spesifik (seperti, dapat dipasang sekali sebagai _read/write_ atau lain kali sebagai _read-only_).

Meskipun `PersistentVolumeClaims` mengizinkan pengguna untuk mengkonsumsi sumber daya penyimpanan
abstrak, pada umumnya para pengguna membutuhkan `PersistentVolumes` dengan properti yang
bermacam-macam, seperti performa, untuk mengatasi masalah yang berbeda. Para administrator kluster
harus dapat menawarkan berbagai macam `PersistentVolumes` yang berbeda tidak hanya pada ukuran dan
mode akses, tanpa memaparkan detail-detail bagaimana cara volume tersebut diimplementasikan
kepada para pengguna. Untuk mengatasi hal ini maka dibutuhkan sumber daya
`StorageClass`.

Silakan lihat [panduan mendetail dengan contoh-contoh yang sudah berjalan](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/).


## Siklus hidup dari sebuah volume dan klaim

PV adalah sumber daya dalam sebuah kluster. PVC adalah permintaan terhadap sumber daya tersebut dan juga berperan sebagai pemeriksaan klaim dari sumber daya yang diminta. Interaksi antara PV dan PVC mengikuti siklus hidup berikut ini:

### Penyediaan

Ada dua cara untuk menyediakan PV: secara statis atau dinamis.

#### Statis
Seorang administrator kluster membuat beberapa PV. PV yang telah dibuat membawa detail-detail dari penyimpanan yang sesungguhnya tersedia untuk digunakan oleh pengguna kluster. PV tersebut ada pada Kubernetes API dan siap untuk digunakan.

#### Dinamis
Ketika tidak ada PV statis yang dibuat oleh administrator yang sesuai dengan `PersistentVolumeClaim` (PVC) yang dibuat oleh pengguna, kluster akan mencoba untuk menyediakan volume khusus sesuai permintaan PVC.
Penyediaan dinamis ini berbasis `StorageClass`: artinya PVC harus meminta sebuah _storage class_ dan _storage class_ tersebut harus sudah dibuat dan dikonfigurasi oleh administrator agar penyediaan dinamis bisa terjadi. Klaim yang meminta PV dengan _storage class_ `""` secara efektif telah menonaktifkan penyediaan dinamis.

Untuk mengaktifkan penyediaan _storage_ dinamis berdasarkan _storage class_, administrator kluster harus mengaktifkan [_admission controller_](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
`DefaultStorageClass` pada API _server_. Hal ini dapat dilakukan, dengan cara memastikan `DefaultStorageClass` ada di antara urutan daftar _value_ yang dibatasi koma untuk _flag_ `--enable-admission-plugins` pada komponen API _server_. Untuk informasi lebih lanjut mengenai _flag_ perintah pada API _server_, silakan cek dokumentasi,
[kube-apiserver](/docs/admin/kube-apiserver/).

### Pengikatan

Seorang pengguna membuat, atau telah membuat (dalam kasus penyediaan dinamis), sebuah `PersistentVolumeClaim` (PVC) dengan jumlah penyimpanan spesifik yang diminta dan dengan mode akses tertentu. Sebuah _control loop_ pada _master_ akan melihat adanya PVC baru, mencari PV yang cocok (jika memungkinkan), dan mengikat PVC dengan PV tersebut. Jika sebuah PV disediakan secara dinamis untuk sebuah PVC baru, _loop_ tersebut akan selalu mengikat PV tersebut pada PVC yang baru dibuat itu. Jika tidak, pengguna akan selalu mendapatkan setidaknya apa yang dimintanya, tetapi volume tersebut mungkin lebih dari apa yang diminta sebelumnya. Setelah terikat, ikatan `PersistentVolumeClaim` (PVC) bersifat eksklusif, terlepas dari bagaimana caranya mereka bisa terikat. Sebuah ikatan PVC ke PV merupakan pemetaan satu ke satu.

Klaim akan berada dalam kondisi tidak terikat tanpa kepastian jika tidak ada volume yang cocok. Klaim akan terikat dengan volume yang cocok ketika ada volume yang cocok. Sebagai contoh, sebuah kluster yang sudah menyediakan banyak PV berukuran 50Gi tidak akan cocok dengan PVC yang meminta 100Gi. PVC hanya akan terikat ketika ada PV 100Gi yang ditambahkan ke kluster.

### Penggunaan

_Pod_ menggunakan klaim sebagai volume. Kluster menginspeksi klaim untuk menemukan volume yang terikat dengan klaim tersebut dan memasangkan volume tersebut ke pada _pod_. Untuk volume yang mendukung banyak mode akses, pengguna yang menentukan mode yang diinginkan ketika menggunakan klaim sebagai volume dalam sebuah _pod_.

Ketika pengguna memiliki klaim dan klaim tersebut telah terikat, PV yang terikat menjadi hak penggunanya selama yang dibutuhkan. Pengguna menjadwalkan _pod_ dan mengakses PV yang sudah diklaim dengan menambahkan `persistentVolumeClaim` pada blok volume pada _Pod_ miliknya. [Lihat pranala di bawah untuk detail-detail mengenai sintaks](#claims-as-volumes).

### Object Penyimpanan dalam Perlindungan Penggunaan
Tujuan dari Objek Penyimpanan dalam Perlindungan Penggunan adalah untuk memastikan _Persistent Volume Claim_ (PVC) yang sedang aktif digunakan oleh sebuah _pod_ dan _Persistent Volume_ (PV) yang terikat pada PVC tersebut tidak dihapus dari sistem karena hal ini dapat menyebabkan kehilangan data.

{{< note >}}
PVC dikatakan aktif digunakan oleh sebuah _pod_ ketika sebuah objek _pod_ ada yang menggunakan PVC tersebut.
{{< /note >}}

Jika seorang pengguna menghapus PVC yang sedang aktif digunakan oleh sebuah _pod_, PVC tersebut tidak akan langsung dihapus. Penghapusan PVC akan ditunda sampai PVC tidak lagi aktif digunakan oleh _pod_ manapun, dan juga ketika admin menghapus sebuah PV yang terikat dengan sebuah PVC, PV tersebut tidak akan langsung dihapus. Penghapusan PV akan ditunda sampai PV tidak lagi terikat dengan sebuah PVC.

Kamu dapat melihat PVC yang dilindungi ketika status PVC berisi `Terminating` dan daftar `Finalizers` meliputi `kubernetes.io/pvc-protection`:

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

Kamu dapat melihat sebuah PV dilindungi ketika status PV berisi `Terminating` dan daftar `Finalizers` juga meliputi `kubernetes.io/pv-protection`:

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

### Melakukan Reklaim 

Ketika seorang pengguna telah selesai dengan volumenya, ia dapat menghapus objek PVC dari API yang memungkinkan untuk reklamasi dari sumber daya tersebut. Kebijakan reklaim dari sebuah `PersistentVolume` (PV) menyatakan apa yang dilakukan kluster setelah volume dilepaskan dari klaimnya. Saat ini, volume dapat dipertahankan (_Retained_), didaur ulang (_Recycled_), atau dihapus (_Deleted_).

#### _Retain_

`Retain` merupakan kebijakan reklaim yang mengizinkan reklamasi manual dari sebuah sumber daya. Ketika `PersistentVolumeClaim` (PVC) dihapus, `PersistentVolume` (PV) masih akan tetap ada dan volume tersebut dianggap "terlepas" . Tetapi PV tersebut belum tersedia untuk klaim lainnya karena data milik pengklaim sebelumnya masih terdapat pada volume. Seorang administrator dapat mereklaim volume secara manual melalui beberapa langkah.

1. Menghapus `PersistentVolume` (PV). Aset _storage_ yang terasosiasi dengan infrastruktur eksternal (seperti AWS EBS, GCE PD, Azure Disk, atau Cinder Volume) akan tetap ada setelah PV dihapus.
2. Secara manual membersihkan data pada aset _storage_ terkait.
3. Secara manual menghapus aset _storage_, atau jika kamu ingin menggunakan aset _storage_ yang sama, buatlah sebuah `PersistentVolume` baru dengan definisi aset _storage_ tersebut.

#### _Delete_

Untuk _volume plugin_ yang mendukung kebijakan reklaim `Delete`, penghapusan akan menghilangkan kedua objek dari Kubernetes, `PersistentVolume` (PV) dan juga aset _storage_ yang terasosiasi pada infrastruktur eksternal seperti, AWS EBS, GCE PD, Azure Disk, atau Cinder Volume. Volume yang disediakan secara dinamis mewarisi [kebijakan reklaim dari `StorageClass` miliknya](#reclaim-policy), yang secara bawaan adalah `Delete`. Administrator harus mengkonfigurasi `StorageClass` sesuai ekspektasi pengguna, jika tidak maka PV tersebut harus diubah atau ditambal setelah dibuat nanti. Lihat [Mengganti Kebijakan Reklaim pada PersistentVolume](/docs/tasks/administer-cluster/change-pv-reclaim-policy/).

#### _Recycle_

{{< warning >}}
Kebijakan reklaim `Recycle` sudah ditinggalkan. Sebagai gantinya, pendekatan yang direkomendasikan adalah menggunakan penyediaan dinamis.
{{< /warning >}}

Jika didukung oleh _plugin volume_ yang berada di baliknya, kebijakan reklaim `Recycle` melakukan penghapusan dasar (`rm -rf /thevolume/*`) pada volume dan membuatnya kembali tersedia untuk klaim baru.

Namun, seorang administrator dapat mengkonfigurasi templat _recycler pod_ kustom menggunakan argumen baris perintah _controller manager_ Kubernetes sebagaimana dijelaskan [di sini](/docs/admin/kube-controller-manager/). Templat _reycler pod_ kustom harus memiliki spesifikasi `volumes`, seperti yang ditunjukkan pada contoh di bawah:

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

Namun, alamat yang dispesifikasikan pada templat _recycler pod_ kustom pada bagian `volumes` diganti dengan alamat pada volume yang akan didaur ulang.

### Memperluas _Persistent Volumes Claim_

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

Dukungan untuk memperluas PersistentVolumeClaim (PVC) sekarang sudah diaktifkan sejak awal. Kamu dapat memperluas 
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

Kamu hanya dapat memperluas sebuah PVC jika kolom `allowVolumeExpansion` dipasang sebagai benar pada _storage class_ miliknya.

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

Untuk meminta volume yang lebih besar pada sebuah PVC, ubah objek PVC dan spesifikasikan ukuran yang lebih
besar. Hal ini akan memicu perluasan dari volume yang berada di balik `PersistentVolume` (PV). Sebuah 
`PersistentVolume` (PV) baru tidak akan dibuat untuk memenuhi klaim tersebut. Sebaliknya, volume yang sudah ada akan diatur ulang ukurannya.

#### Perluasan Volume CSI

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

Perluasan volume CSI mengharuskan kamu untuk mengaktifkan gerbang fitur `ExpandCSIVolumes` dan juga membutuhkan _driver_ CSI yang spesifik untuk mendukung perluasan volume. Silakan merujuk pada dokumentasi _driver_ spesifik CSI untuk informasi lebih lanjut.


#### Mengubah ukuran sebuah volume yang memiliki _file system_ 

Kamu hanya dapat mengubah ukuran volume yang memiliki _file system_ jika _file system_ tersebut adalah XFS, Ext3, atau Ext4.

Ketika sebuah volume memiliki _file system_, _file system_ tersebut hanya akan diubah ukurannya ketika sebuah _pod_ baru dinyalakan menggunakan
`PersistentVolumeClaim` (PVC) dalam mode _ReadWrite_. Maka dari itu, jika sebuah _pod_ atau _deployment_ menggunakan sebuah volume dan
kamu ingin memperluasnya, kamu harus menghapus atau membuat ulang _pod_ tersebut setelah volume selesai diperluas oleh penyedia _cloud_ dalam _controller-manager_. Kamu dapat melihat status dari operasi pengubahan ukuran dengan menjalankan perintah `kubectl describe pvc`:

```
kubectl describe pvc <pvc_name>
```

Jika `PersistentVolumeClaim` (PVC) memiliki status `FileSystemResizePending`, maka berarti aman untuk membuat ulang _pod_ menggunakan PersistentVolumeClaim (PVC) tersebut.

FlexVolumes mengizinkan pengubahan ukuran jika _driver_ diatur dengan kapabilitas `RequiresFSResize` menjadi "_true_". 
FlexVolume dapat diubah ukurannya pada saat _pod_ mengalami _restart_. 

{{< feature-state for_k8s_version="v1.11" state="alpha" >}}

#### Mengubah ukuran PersistentVolumeClaim (PVC) yang sedang digunakan

Memperluas PVC yang sedang digunakan merupakan fitur alfa. Untuk menggunakannya, aktifkan gerbang fitur `ExpandInUsePersistentVolumes`.
Pada kasus ini, kamu tidak perlu menghapus dan membuat ulang sebuah _Pod_ atau _deployment_ yang menggunakan PVC yang telah ada.
PVC manapun yang sedang digunakan secara otomatis menjadi tersedia untuk _pod_ yang menggunakannya segera setelah _file system_ miliknya diperluas.
Fitur ini tidak memiliki efek pada PVC yang tidak sedang digunakan oleh _Pod_ atau _deployment_. Kamu harus membuat sebuah _Pod_ yang
menggunakan PVC sebelum perluasan dapat selesai dilakukan.

Memperluas PVC yang sedang digunakan sudah ditambahkan pada rilis 1.13. Untuk mengaktifkan fitur ini gunakan `ExpandInUsePersistentVolumes` dan gerbang fitur `ExpandPersistentVolumes`.  Gerbang fitur `ExpandPersistentVolumes` sudah diaktifkan sejak awal. Jika `ExpandInUsePersistentVolumes` sudah terpasang, FlexVolume dapat diubah ukurannya secara langsung tanpa perlu melakukan _restart_ pada _pod_. 
 
{{< note >}}
Pengubahan ukuran FlexVolume hanya mungkin dilakukan ketika _driver_ yang menjalankannya mendukung pengubahan ukuran.
{{< /note >}}

{{< note >}}
Memperluas volume EBS merupakan operasi yang memakan waktu. Terlebih lagi, ada kuota per volume untuk satu kali modifikasi setiap 6 jam.
{{< /note >}}


## Tipe-tipe _Persistent Volume_

Tipe-tipe `PersistentVolume` (PV) diimplementasikan sebagai _plugin_.  Kubernetes saat ini mendukung _plugin_ berikut:

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
* HostPath (Hanya untuk pengujian _single node_ -- penyimpanan lokal tidak didukung dan TIDAK AKAN BEKERJA pada kluster _multi-node_)
* Portworx Volumes
* ScaleIO Volumes
* StorageOS

## _Persistent Volume_

Setiap PV memiliki sebuah _spec_ dan status, yang merupakan spesifikasi dan status dari volume tersebut.

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

Secara umum, sebuah PV akan memiliki kapasitas _storage_ tertentu.  Hal ini ditentukan menggunakan atribut `capacity` pada PV.  Lihat [Model Sumber Daya](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) Kubernetes untuk memahami satuan yang diharapkan pada atribut `capacity`.

Saat ini, ukuran _storage_ merupakan satu-satunya sumber daya yang dapat ditentukan atau diminta. Atribut-atribut lainnya di masa depan dapat mencakup IOPS, _throughput_, dsb.

### Mode Volume

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Sebelum Kubernetes 1.9, semua _volume plugin_ akan membuat sebuah _filesystem_ pada PersistentVolume (PV).
Sekarang, kamu dapat menentukan nilai dari `volumeMode` menjadi `block` untuk menggunakan perangkat _raw block_, atau `filesystem`
untuk menggunakan sebuah _filesystem_. `filesystem` menjadi standar yang digunakan jika nilainya dihilangkan. Hal ini merupakan parameter API
opsional.

### Mode Akses

Sebuah `PersistentVolume` (PV) dapat dipasangkan pada sebuah _host_ dengan cara apapun yang didukung oleh penyedia sumber daya.  Seperti ditunjukkan pada tabel di bawah, para penyedia akan memiliki kapabilitas yang berbeda-beda dan setiap mode akses PV akan ditentukan menjadi mode-mode spesifik yang didukung oleh tiap volume tersebut. Sebagai contoh, NFS dapat mendukung banyak klien _read/write_, tetapi sebuah NFS PV tertentu mungkin diekspor pada server sebagai _read-only_. Setiap PV memilik seperangkat mode aksesnya sendiri yang menjelaskan kapabilitas dari PV tersebut.

Beberapa mode akses tersebut antara lain:

* ReadWriteOnce -- volume dapat dipasang sebagai _read-write_ oleh satu _node_
* ReadOnlyMany -- volume dapat dipasang sebagai _read-only_ oleh banyak _node_
* ReadWriteMany -- volume dapat dipasang sebagai _read-write_ oleh banyak _node_

Pada CLI, mode-mode akses tersebut disingkat menjadi:

* RWO - ReadWriteOnce
* ROX - ReadOnlyMany
* RWX - ReadWriteMany

> __Penting!__ Sebuah volume hanya dapat dipasang menggunakan satu mode akses dalam satu waktu, meskipun volume tersebut mendukung banyak mode.  Sebagai contoh, sebuah GCEPersistentDisk dapat dipasangkan sebagai ReadWriteOnce oleh satu _node_ atau ReadOnlyMany oleh banyak node, tetapi tidak dalam waktu yang bersamaan.


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

### Kelas

Sebuah PV bisa memiliki sebuah kelas, yang dispesifikasi dalam pengaturan atribut
`storageClassName` menjadi nama
[StorageClass](/docs/concepts/storage/storage-classes/).
Sebuah PV dari kelas tertentu hanya dapat terikat dengan PVC yang meminta
kelas tersebut. Sebuah PV tanpa `storageClassName` tidak memiliki kelas dan hanya dapat terikat
dengan PVC yang tidak meminta kelas tertentu.

Dahulu, anotasi `volume.beta.kubernetes.io/storage-class` digunakan sebagai ganti
atribut `storageClassName`. Anotasi ini masih dapat bekerja, namun
akan dihilangkan sepenuhnya pada rilis Kubernetes mendatang.

### Kebijakan Reklaim 

Kebijakan-kebijakan reklaim saat ini antara lain:

* Retain -- reklamasi manual
* Recycle -- penghapusan dasar (`rm -rf /thevolume/*`)
* Delete -- aset _storage_ terasosiasi seperti AWS EBS, GCE PD, Azure Disk, atau OpenStack Cinder volume akan dihapus

Saat ini, hanya NFS dan HostPath yang mendukung daur ulang. AWS EBS, GCE PD, Azure Disk, dan Cinder Volume mendukung penghapusan.

### Opsi Pemasangan 

Seorang administrator Kubernetes dapat menspesifikasi opsi pemasangan tambahan untuk ketika sebuah _Persistent Volume_ dipasangkan pada sebuah _node_.

{{< note >}}
Tidak semua tipe _Persistent Volume_ mendukung opsi pemasanagan.
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

Dahulu, anotasi `volume.beta.kubernetes.io/mount-options` digunakan sebagai ganti
atribut `mountOptions`. Anotasi ini masih dapat bekerja, namun
akan dihilangkan sepenuhnya pada rilis Kubernetes mendatang.

### Afinitas Node 

{{< note >}}
Untuk kebanyakan tipe volume, kamu tidak perlu memasang kolom ini. Kolom ini secara otomatis terisi untuk tipe blok volume [AWS EBS](/docs/concepts/storage/volumes/#awselasticblockstore), [GCE PD](/docs/concepts/storage/volumes/#gcepersistentdisk) dan [Azure Disk](/docs/concepts/storage/volumes/#azuredisk). Kamu harus mengaturnya secara eksplisit untuk volume [lokal](/docs/concepts/storage/volumes/#local).
{{< /note >}}

Sebuah PV dapat menspesifikasi [afinitas node](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volumenodeaffinity-v1-core) untuk mendefinisikan batasan yang membatasi _node_ mana saja yang dapat mengakses volume tersebut. _Pod_ yang menggunakan sebuah PV hanya akan bisa dijadwalkan ke _node_ yang dipilih oleh afinitas _node_.

### Fase 

Sebuah volume akan berada dalam salah satu fase di bawah ini:

* Available -- sumber daya bebas yang belum terikat dengan sebuah klaim
* Bound -- volume sudah terikat dengan sebuah klaim
* Released -- klaim sudah dihapus, tetapi sumber daya masih belum direklaim oleh kluster
* Failed -- volume gagal menjalankan reklamasi otomatis

CLI akan menunjukkan nama dari PVC yang terikat pada PV.

## PersistentVolumeClaims

Setiap PVC memiliki _spec_ dan status, yang merupakan spesifikasi dan status dari klaim.

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

### Mode Akses 

Klaim menggunakan penulisan yang sama dengan volume ketika meminta _storage_ dengan mode akses tertentu.

### Mode Volume 

Klaim menggunakan penulisan yang sama dengan volume untuk mengindikasikan konsumsi dari volume sebagai _filesystem_ ataupun perangkat _block_.

### Sumber daya

Klaim, seperti _pod_, bisa meminta sumber daya dengan jumlah tertentu.  Pada kasus ini, permintaan untuk _storage_.  [Model sumber daya](https://git.k8s.io/community/contributors/design-proposals/scheduling/resources.md) yang sama berlaku untuk baik volume maupun klaim.

### _Selector_

Klaim dapat menspesifikasi [_label selector_](/docs/concepts/overview/working-with-objects/labels/#label-selectors) untuk memilih serangkaian volume lebih jauh. Hanya volume yang cocok labelnya dengan _selector_ yang dapat terikat dengan klaim. _Selector_ dapat terdiri dari dua kolom:

* `matchLabels` - volume harus memiliki label dengan nilai ini
* `matchExpressions` - daftar dari persyaratan yang dibuat dengan menentukan kunci, daftar nilai, dan operator yang menghubungkan kunci dengan nilai. Operator yang valid meliputi In, NotIn, Exists, dan DoesNotExist.

Semua persyaratan tersebut, dari `matchLabels` dan `matchExpressions` akan dilakukan operasi AND bersama – semuanya harus dipenuhi untuk mendapatkan kecocokan.

### Kelas

Sebuah klaim dapat meminta kelas tertentu dengan menspesifikasi nama dari
[StorageClass](/docs/concepts/storage/storage-classes/)
menggunakan atribut `storageClassName`.
Hanya PV dari kelas yang diminta, yang memiliki `storageClassName` yang sama dengan PVC, yang dapat
terikat dengan PVC.

PVC tidak harus meminta sebuah kelas. Sebuah PVC dengan `storageClassName` miliknya bernilai
`""` akan selalu diinterpretasikan sebagai meminta PV tanpa kelas, jadi PVC
hanya bisa terikat ke PV tanpa kelas (tanpa anotasi atau bernilai
`""`). Sebuah PVC tanpa `storageClassName` tidaklah sama dan diperlakukan berbeda
oleh kluster tergantung apakah
[_admission plugin_ `DefaultStorageClass`](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)
dinyalakan.

* Jika _admission plugin_ dinyalakan, administrator bisa menspesifikasi
  `StorageClass` standar. Seluruh PVC yang tidak memiliki `storageClassName` dapat terikat hanya ke
  PVs standar. Menspesifikasikan `StorageClass` standar dapat dilakukan dengan mengatur
  anotasi `storageclass.kubernetes.io/is-default-class` menjadi "_true_" pada
  sebuah objek `StorageClass`. Jika administrator tidak menspesifikasikan standar apapun,
  kluster menanggapi pembuatan PVC sekan-akan _admission plugin_ dimatikan. Jika
  ada lebih dari satu setelan standar dispesifikasikan, _admission plugin_ melarang pembuatan seluruh
  PVC.
* Jika _admission plugin_ dimatikan, tidak ada pilihan menggunakan
  `StorageClass` standar. Semua PVC yang tidak memiliki `storageClassName` hanya dapat diikat ke PV yang
  tidak memiliki kelas. Pada kasus ini, PVC yang tidak memiliki `storageClassName` diperlakukan
  sama seperti PVC yang memiliki `storageClassName` bernilai `""`.

Tergantung metode instalasi, sebuah StorageClass dari setelan standar dapat dibuat
ke kluster Kubernetes oleh _addon manager_ pada saat instalasi.

Ketika sebuah PVC menspesifikasi sebuah `selector` selain meminta `StorageClass`,
kebutuhan tersebut akan digabungkan dengan operasi AND bersama: hanya PV dari kelas yang diminta dan dengan
label yang diminta yang dapat terikat ke PVC.

{{< note >}}
Saat ini, sebuah PVC dengan `selector` yang tak kosong tidak dapat memiliki PV yang disediakan secara dinamis untuknya.
{{< /note >}}

Dahulu, anotasi `volume.beta.kubernetes.io/storage-class` digunakan sebagai ganti
atribut `storageClassName`. Anotasi ini masih dapat bekerja, namun
akan dihilangkan sepenuhnya pada rilis Kubernetes mendatang.

## Klaim sebagai Volume

_Pod_ mengakses _storage_ dengan menggunakan klaim sebagai volume.  Klaim harus berada pada _namespace_ yang sama dengan _pod_ yang menggunakan klaim tersebut.  Kluster menemukan klaim pada _namespace_ yang sama dengan _pod_ dan menggunakannya untuk mendapatkan `PersistentVolume` (PV) yang ada di baliknya.  Volume tersebut kemudian dipasangkan ke _host_ dan lalu ke _pod_.

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

### Catatan Mengenai _Namespace_

Ikatan `PersistentVolumes` bersifat eksklusif, dan karena `PersistentVolumeClaims` merupakan objek yang berada pada _namespace_, pemasangan klaim dengan "banyak" mode (`ROX`, `RWX`) hanya dimungkinkan jika berada dalam satu _namespace_ yang sama.

## Dukungan Volume _Raw Block_

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

_Volume plugins_ berikut mendukung volume _raw block_, termasuk penyediaan dinamis jika
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
Hanya FC dan volume iSCSI yang mendukung volume _raw block_ pada Kubernetes 1.9.
Dukungan untuk _plugin_ lainnya ditambahkan pada 1.10.
{{< /note >}}

### _Persistent Volume_ menggunakan Volume _Raw Block_
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
### _Persistent Volume Claim_ meminta Volume _Raw Block_ 
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
### Spesifikasi _Pod_ yang menambahkan alamat Perangkat _Raw Block_ pada kontainer
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
Ketika menambahkan sebuah perangkat _raw block_ untuk sebuah _Pod_, kita menspesifikasi alamat perangkat dalam kontainer alih-alih alamat pemasangan.
{{< /note >}}

### Mengikat _Block Volume_

Jika seorang pengguna meminta sebuah volume _raw block_ dengan mengindikasikannya menggunakan kolom `volumeMode` pada _spec_ `PersistentVolumeClaim` (PVC), aturan pengikatannya sedikit berbeda dibanding rilis-rilis sebelumnya yang tidak memerhatikan mode ini sebagai bagian dari _spec_.
Di bawah merupakan tabel dari kemungkinan kombinasi yang pengguna dan admin dapat spesifikasikan untuk meminta sebuah perangkat _raw block_. Tabel tersebut mengindikasikan apakah volume akan terikat atau tidak jika dikombinasikan dengan cara tertentu:
Matriks pengikatan volume untuk volume yang disediakan secara statis:

| PV volumeMode | PVC volumeMode  | Hasil            |
| --------------|:---------------:| ----------------:|
|   unspecified | unspecified     | TERIKAT          |
|   unspecified | Block           | TIDAK TERIKAT    |
|   unspecified | Filesystem      | TERIKAT          |
|   Block       | unspecified     | TIDAK TERIKAT    |
|   Block       | Block           | TERIKAT          |
|   Block       | Filesystem      | TIDAK TERIKAT    |
|   Filesystem  | Filesystem      | TERIKAT          |
|   Filesystem  | Block           | TIDAK TERIKAT    |
|   Filesystem  | unspecified     | TERIKAT          |

{{< note >}}
Hanya volume yang disediakan secara statis yang didukung untuk rilis alfa. Administrator harus memperhatikan nilai-nilai tersebut ketika mengerjakan perangkat-perangkat _raw block_.
{{< /note >}}

## _Volume Snapshot_ dan Dukungan Pemulihan Volume dari _Snapshot_

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Fitur _volume snapshot_ ditambahkan hanya untuk mendukung _CSI Volume Plugins_. Untuk lebih detail, lihat [_volume snapshots_](/docs/concepts/storage/volume-snapshots/).

Untuk mengaktifkan dukungan pemulihan sebuah volume dari sebuah sumber data _volume snapshot_, aktifkan
gerbang fitur `VolumeSnapshotDataSource` pada apiserver dan _controller-manager_.

### Membuat _Persistent Volume Claim_ dari _Volume Snapshot_
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

## Menulis Konfigurasi Portabel

Jika kamu menulis templat konfigurasi atau contoh yang dapat berjalan pada berbagai macam kluster
dan membutuhkan _persistent storage_, kami merekomendasikan agar kamu menggunakan pola berikut:

- Masukkan objek PersistentVolumeClaim (PVC) pada kumpulan _config_ (bersamaan dengan
  Deployments, ConfigMaps, dsb).
- Jangan memasukkan objek PersistentVolume (PV) pada _config_, karena pengguna yang menginstantiasi
  _config_ tersebut kemungkinan tidak memiliki izin untuk membuat PersistentVolume (PV).
- Berikan pengguna opsi untuk menyediakan nama _storage class_ ketika menginstantiasi
  templat.
  - Jika pengguna menyediakan nama _storage class_, taruh nilai tersebut pada
    kolom `persistentVolumeClaim.storageClassName`.
    Hal ini akan membuat PVC agar sesuai dengan _storage class_
    yang tepat jika kluster memiliki banyak StorageClass yang diaktifkan oleh admin.
  - Jika pengguna tidak menyediakan nama _storage class_, biarkan
    kolom `persistentVolumeClaim.storageClassName` kosong.
    - Hal ini kakan membuat sebuah PV disediakan secara otomatis untuk pengguna dengan
      StorageClass standar pada kluster.  Banyak lingkungan kluster memiliki
      StorageClass standar yang sudah terpasang, atau administrator dapat membuat
      StorageClass standar sendiri.
- Dalam pembuatan, perhatikan PVC yang tidak kunjung terikat setelah beberapa lama
  dan beritahukan hal ini pada pengguna, karena hal ini dapat mengindikasikan kluster tidak
  memiliki dukungan penyimpanan dinamis (di mana pengguna harus membuat PV yang sesuai)
  atau kluster tidak memiliki sistem penyimpanan (di mana penggun tidak dapat membuat
  PVC yang membutuhkan _config_).

{{% /capture %}}
