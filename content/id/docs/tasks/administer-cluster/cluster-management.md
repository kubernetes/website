---
title: Manajemen Klaster
content_type: concept
---

<!-- overview -->

Dokumen ini menjelaskan beberapa topik yang terkait dengan siklus hidup sebuah klaster: membuat klaster baru,
memperbarui Node _control plane_ dan Node pekerja dari klaster kamu,
melakukan pemeliharaan Node (misalnya pembaruan kernel), dan meningkatkan versi API Kubernetes dari
klaster yang berjalan.

<!-- body -->


## Membuat dan mengonfigurasi klaster

Untuk menginstal Kubernetes dalam sekumpulan mesin, konsultasikan dengan salah satu [Panduan Memulai](/id/docs/setup) tergantung dengan lingkungan kamu.

## Memperbarui klaster

Status saat ini pembaruan klaster bergantung pada penyedia, dan beberapa rilis yang mungkin memerlukan perhatian khusus saat memperbaruinya. Direkomendasikan agar admin membaca [Catatan Rilis](https://git.k8s.io/kubernetes/CHANGELOG/README.md), serta catatan khusus pembaruan versi sebelum memperbarui klaster mereka.

### Memperbarui klaster Azure Kubernetes Service (AKS)

Azure Kubernetes Service memungkinkan pembaruan layanan mandiri yang mudah dari _control plane_ dan Node pada klaster kamu. Prosesnya adalah
saat ini dimulai oleh pengguna dan dijelaskan dalam [Azure AKS documentation](https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster).

### Memperbarui klaster Google Compute Engine

Google Compute Engine Open Source (GCE-OSS) mendukung pembaruan _control plane_ dengan menghapus dan
membuat ulang _control plane_, sambil mempertahankan _Persistent Disk_ (PD) yang sama untuk memastikan bahwa data disimpan pada berkas
untuk setiap kali pembaruan.

Pembaruan Node untuk GCE menggunakan [grup _instance_ yang di-_manage_](https://cloud.google.com/compute/docs/instance-groups/), dimana setiap Node
dihancurkan secara berurutan dan kemudian dibuat ulang dengan perangkat lunak baru. Semua Pod yang berjalan di Node tersebut harus
dikontrol oleh pengontrol replikasi (_Replication Controller_), atau dibuat ulang secara manual setelah peluncuran.

Pembaruan versi pada klaster open source Google Compute Engine (GCE) yang dikontrol oleh skrip `cluster/gce/upgrade.sh`.

Dapatkan penggunaan dengan menjalankan `cluster/gce/upgrade.sh -h`.

Misalnya, untuk meningkatkan hanya _control plane_ kamu ke versi tertentu (v1.0.2):

```shell
cluster/gce/upgrade.sh -M v1.0.2
```

Sebagai alternatif, untuk meningkatkan seluruh klaster kamu ke rilis yang stabil terbaru gunakan:

```shell
cluster/gce/upgrade.sh release/stable
```

### Memperbarui klaster Google Kubernetes Engine

Google Kubernetes Engine secara otomatis memperbarui komponen _control plane_ (misalnya, `kube-apiserver`, ` kube-scheduler`) ke versi yang terbaru. Ini juga menangani pembaruan sistem operasi dan komponen lain yang dijalankan oleh _control plane_.

Proses pembaruan Node dimulai oleh pengguna dan dijelaskan dalam [Dokumentasi Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs/clusters/upgrade).

### Memperbarui klaster Amazon EKS

Komponen _control plane_ klaster pada Amazon EKS dapat diperbarui dengan menggunakan eksctl, AWS Management Console, atau AWS CLI. Prosesnya dimulai oleh pengguna dan dijelaskan di [Dokumentasi Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/update-cluster.html).

### Memperbarui klaster Oracle Cloud Infrastructure Container Engine untuk Kubernetes (OKE)

Oracle membuat dan mengelola sekumpulan Node _control plane_ pada _control plane_ Oracle atas nama kamu (dan infrastruktur Kubernetes terkait seperti Node etcd) untuk memastikan kamu memiliki Kubernetes _control plane_ yang terkelola dengan ketersedian tinggi. Kamu juga dapat memperbarui Node _control plane_ ini dengan mulus ke versi Kubernetes baru tanpa berhenti. Tindakan ini dijelaskan dalam [Dokumentasi OKE](https://docs.cloud.oracle.com/iaas/Content/ContEng/Tasks/contengupgradingk8smasternode.htm).

### Memperbarui klaster pada platform yang lain

Penyedia dan alat yang berbeda akan mengelola pembaruan secara berbeda. Kamu disarankan untuk membaca dokumentasi utama mereka terkait pembaruan.

* [kops](https://github.com/kubernetes/kops)
* [kubespray](https://github.com/kubernetes-incubator/kubespray)
* [CoreOS Tectonic](https://coreos.com/tectonic/docs/latest/admin/upgrade.html)
* [Digital Rebar](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html)
* ...

Untuk memperbarukan sebuah klaster pada platform yang tidak disebutkan dalam daftar di atas, periksa urutan pembaruan komponen pada
halaman [Versi Skewed](/docs/setup/release/version-skew-policy/#supported-component-upgrade-order).

## Merubah ukuran klaster

Jika klaster kamu kekurangan sumber daya, kamu dapat dengan mudah menambahkan lebih banyak mesin ke klaster tersebut jika klaster kamu
menjalankan [Mode Node Registrasi Sendiri](/docs/concepts/architecture/nodes/#self-registration-of-nodes).
Jika kamu menggunakan GCE atau Google Kubernetes Engine, itu dilakukan dengan mengubah ukuran grup _instance_ yang mengelola Node kamu.
Ini dapat dilakukan dengan mengubah jumlah _instance_ pada
`Compute > Compute Engine > Instance groups > your group > Edit group`
[Laman Google Cloud Console](https://console.developers.google.com) atau dengan baris perintah gcloud:

```shell
gcloud compute instance-groups managed resize kubernetes-node-pool --size=42 --zone=$ZONE
```

Grup _instance_ akan menangani penempatan _image_ yang sesuai pada mesin baru dan memulainya,
sedangkan Kubelet akan mendaftarkan Node-nya ke server API agar tersedia untuk penjadwalan.
Jika kamu menurunkan skala grup _instance_, sistem akan secara acak memilih Node untuk dimatikan.

Di lingkungan lain kamu mungkin perlu mengonfigurasi mesin sendiri dan memberi tahu Kubelet di mana server API mesin itu berjalan.

### Merubah ukuran klaster Azure Kubernetes Service (AKS)

Azure Kubernetes Service memungkinkan perubahan ukuran klaster yang dimulai oleh pengguna dari CLI atau
portal Azure dan dijelaskan dalam [Dokumentasi Azure AKS](https://docs.microsoft.com/en-us/azure/aks/scale-cluster).


### Penyekalaan otomatis klaster

Jika kamu menggunakan GCE atau Google Kubernetes Engine, kamu dapat mengonfigurasi klaster kamu sehingga secara otomatis diskalakan berdasarkan
kebutuhan Pod.

Seperti yang dideskripsikan dalam [Sumber daya komputasi](/id/docs/concepts/configuration/manage-resources-containers/),
pengguna dapat memesan berapa banyak CPU dan memori yang dialokasikan ke Pod.
Informasi ini digunakan oleh penjadwal Kubernetes untuk menemukan tempat menjalankan Pod. Jika
tidak ada Node yang memiliki kapasitas kosong yang cukup (atau tidak sesuai dengan persyaratan Pod yang lainnya) maka Pod
menunggu sampai beberapa Pod dihentikan atau Node baru ditambahkan.

Penyekala otomatis klaster mencari Pod yang tidak dapat dijadwalkan dan memeriksa apakah perlu menambahkan Node baru, yang serupa
dengan Node yang lain dalam klaster untuk membantu. Jika ya, maka itu mengubah ukuran klaster agar dapat mengakomodasi Pod yang menunggu.

Penyekala otomatis klaster juga menurunkan skala klaster jika mengetahui bahwa satu atau beberapa Node tidak diperlukan lagi untuk
periode waktu tambahan (selama 10 menit tetapi dapat berubah di masa mendatang).

Penyekala otomatis klaster dikonfigurasikan untuk per grup _instance_ (GCE) atau kumpulan Node (Google Kubernetes Engine).

Jika kamu menggunakan GCE, kamu dapat mengaktifkannya sambil membuat klaster dengan skrip kube-up.sh.
Untuk mengonfigurasi penyekala otomatis klaster, kamu harus menyetel tiga variabel lingkungan:

* `KUBE_ENABLE_CLUSTER_AUTOSCALER` - mengaktifkan penyekala otomatis klaster kalau di setel menjadi _true_.
* `KUBE_AUTOSCALER_MIN_NODES` - minimal jumlah Node dalam klaster.
* `KUBE_AUTOSCALER_MAX_NODES` - maksimal jumlah Node dalam klaster.

Contoh:

```shell
KUBE_ENABLE_CLUSTER_AUTOSCALER=true KUBE_AUTOSCALER_MIN_NODES=3 KUBE_AUTOSCALER_MAX_NODES=10 NUM_NODES=5 ./cluster/kube-up.sh
```

Pada Google Kubernetes Engine, kamu mengonfigurasi penyekala otomatis klaster baik saat pembuatan atau pembaruan klaster atau saat membuat kumpulan Node tertentu
(yang ingin kamu skalakan secara otomatis) dengan meneruskan _flag_ `--enable-autoscaling`, `--min-nodes` dan `--max-nodes`
yang sesuai dengan perintah `gcloud`.

Contoh:

```shell
gcloud container clusters create mytestcluster --zone=us-central1-b --enable-autoscaling --min-nodes=3 --max-nodes=10 --num-nodes=5
```

```shell
gcloud container clusters update mytestcluster --enable-autoscaling --min-nodes=1 --max-nodes=15
```

**Penyekala otomatis klaster mengharapkan bahwa Node belum dimodifikasi secara manual (misalnya dengan menambahkan label melalui kubectl) karena properti tersebut tidak akan disebarkan ke Node baru dalam grup _instance_ yang sama.**

Untuk detail selengkapnya tentang cara penyekala otomatis klaster memutuskan apakah, kapan dan bagaimana
melakukan penyekalaan sebuah klaster, silahkan lihat dokumentasi [FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
dari proyek penyekala otomatis klaster.

## Memelihara dalam Node

Jika kamu perlu memulai ulang Node (seperti untuk pembaruan kernel, pembaruan libc, pembaruan perangkat keras, dll.) dan waktu kegagalan (_downtime_) yang
singkat, lalu ketika Kubelet memulai ulang, maka ia akan mencoba untuk memulai ulang Pod yang dijadwalkan. Jika mulai ulang membutuhkan waktu yang lebih lama
(waktu bawaan adalah 5 menit, yang dikontrol oleh `--pod-eviction-timeout` pada _controller-manager_),
maka pengontrol Node akan menghentikan Pod yang terikat ke Node yang tidak tersedia. Jika ada yang sesuai dengan
kumpulan replika (atau pengontrol replikasi), maka salinan baru dari Pod akan dimulai pada Node yang berbeda. Jadi, dalam kasus di mana semua
Pod direplikasi, pembaruan dapat dilakukan tanpa koordinasi khusus, dengan asumsi bahwa tidak semua Node akan mati pada saat yang bersamaan.

Jika kamu ingin lebih mengontrol proses pembaruan, kamu dapat menggunakan alur kerja berikut ini:

Gunakan `kubectl drain` untuk meghentikan perlahan-lahan semua Pod dalam Node ketika menandai Node sebagai _unschedulable_:

```shell
kubectl drain $NODENAME
```

Ini mencegah Pod baru mendarat pada Node saat kamu mencoba melepaskannya.

Untuk Pod dengan sebuah kumpulan replika, Pod tersebut akan diganti dengan Pod baru yang akan dijadwalkan ke Node baru. Selain itu, jika Pod adalah bagian dari layanan, maka klien akan secara otomatis dialihkan ke Pod baru.

Untuk Pod yang tidak memiliki replika, kamu perlu memunculkan salinan baru dari Pod tersebut, dan menganggapnya bukan bagian dari layanan, alihkan klien ke Pod tersebut.

Lakukan pekerjaan pemeliharaan pada Node.

Buat Node dapat dijadwal lagi:


```shell
kubectl uncordon $NODENAME
```

Jika kamu menghapus Node dari _instance_ VM dan membuat yang baru, maka sumber daya Node baru yang dapat dijadwalkan akan
dibuat secara otomatis (jika kamu menggunakan penyedia cloud yang mendukung
pencarian Node; saat ini hanya Google Compute Engine, tidak termasuk CoreOS di Google Compute Engine menggunakan kube-register).
Lihatlah [Node](/docs/concepts/architecture/nodes/) untuk lebih detail.

## Topik lebih lanjut

### Mengaktifkan atau menonaktifkan versi API untuk klaster kamu

Versi API spesifik dapat dinyalakan dan dimatikan dengan meneruskan _flag_ `--runtime-config=api/<version>` ketika menjalankan server API. Sebagai contoh: untuk menyalakan APIv1, teruskan `--runtime-config=api/v1=false`.
_runtime-config_ juga mendukung 2 kunci khusus: api/all dan api/legacy yang masing-masing untuk mengontrol semua dan API lama.
Sebagai contoh, untuk mematikan versi API semua kecuali v1, teruskan `--runtime-config=api/all=false,api/v1=true`.
Untuk tujuan _flag_ ini, API lama adalah API yang sudah tidak digunakan lagi secara eksplisit (misalnya, `v1beta3`).

### Mengalihkan versi API penyimpanan dari klaster kamu

Objek yang disimpan ke diska untuk representasi internal klaster dari sumber daya Kubernetes yang aktif dalam klaster ditulis menggunakan versi API tertentu.
Saat API yang didukung berubah, objek ini mungkin perlu ditulis ulang dalam API yang lebih baru. Kegagalan melakukan ini pada akhirnya akan menghasilkan sumber daya yang tidak lagi dapat didekodekan atau digunakan
oleh server API Kubernetes.

### Mengalihkan berkas konfigurasi kamu ke versi API baru

Kamu dapat menggunakan perintah `kubectl convert` untuk mengubah berkas konfigurasi di antara versi API berbeda.

```shell
kubectl convert -f pod.yaml --output-version v1
```

Untuk opsi yang lainnya, silakan merujuk pada penggunaan dari perintah [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert).


