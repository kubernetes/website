---
reviewers:
- davidopp
- lavalamp
title: Pertimbangan untuk klaster besar
weight: 10
---

Klaster adalah kumpulan ({{< glossary_tooltip text="node" term_id="node" >}}) berupa mesin fisik ataupun virtual yang menjalankan agen Kubernetes, dan dikelola oleh {{< glossary_tooltip text="bidang kontrol" term_id="control-plane" >}}. Kubernetes {{< param "version" >}} mendukung klaster hingga 5000 *node*. Lebih tepatnya, Kubernetes didesain untuk mengakomodasi konfigurasi yang mendukung kriteria dibawah ini:

* Jumlah pods tidak lebih dari 110 pods per *node*
* Jumlah *node* tidak lebih dari 5000
* Total pods tidak lebih dari 150000
* Total kontainer tidak lebih dari 300000

Kamu dapat mengubah ukuran klaster dengan menambah atau menghapus *node*. Cara yang digunakan untuk pengubahan ukuran ini tergantung dari bagaimana kamu membangun klaster.

## Kuota sumber daya penyedia cloud {#quota-issues}

Untuk menghindari masalah kuota penyedia *cloud*, ketika membuat klaster dengan banyak *node*, pertimbangkanlah hal berikut ini:

* Mengajukan penambahan kuota untuk sumber daya *cloud* berikut ini:
  * Jumlah mesin virtual
  * CPU
  * Volume penyimpanan
  * Penggunaan alamat IP
  * Aturan penyaringan paket
  * Jumlah penyeimbang beban (*load balancer*)
  * Subnet jaringan
  * Aliran log
* Mengatur pengubahan ukuran klaster untuk menambah *node* baru menggunakan mode *batches*, dengan jeda antar *batches*, karena sejumlah penyedia *cloud* membatasi laju (*rate limit*) pembuatan mesin baru.

## Komponen bidang kontrol

Untuk klaster besar, kamu membutuhkan bidang kontrol dengan komputasi yang cukup dan sumber daya lainnya.

Biasanya, kamu akan menjalankan satu atau dua bidang kontrol untuk tiap zona kegagalan (*failure zone*), mengubah ukuran bidang kontrol secara vertikal terlebih dahulu dan kemudian mengubah ukurannya secara horizontal setelah mencapai batas dari mengubah ukuran secara vertikal.

Kamu harus menjalankan paling tidak satu bidang kontrol per zona kegagalan untuk memberikan toleransi kegagalan (*fault-tolerance*). *node* Kubernetes tidak secara otomatis mengendalikan arus ke bidang kontrol yang berada di zona kegagalan yang sama; bagaimanapun, penyedia *cloud* kamu mungkin memiliki mekanisme toleransi kegagalan mereka sendiri untuk menangani hal tersebut.

Sebagai contoh, dengan menggunakan penyeimbang beban bawaan (*managed load balancer*), kamu dapat mengonfigurasi penyeimbang beban untuk mengirim arus yang berasal dari kubelet dan pods di zona A, kemudian hanya mengarahkan arus tersebut ke bidang kontrol yang hanya ada di zona _A_. Jika salah satu bidang kontrol atau zona kegagalan _A_ mati, artinya semua arus bidang kontrol untuk *node* di zona _A_ akan dikirim ke zona lain. Menjalankan banyak bidang kontrol di setiap zona dapat mencegah masalah tersebut.

### Penyimpanan etcd

Untuk meningkatkan performa klaster besar, kamu dapat menyimpan objek *Event* di *instance* etcd terpisah.

Ketika membangun sebuah klaster, kamu dapat (menggunakan alat khusus):

* Nyalakan dan konfigurasikan *instance* tambahan etcd
* konfigurasikan *{{< glossary_tooltip term_id="kube-apiserver" text="API server" >}}* untuk menggunakan *instance* etcd tambahan tersebut dalam penyimpanan *events*

Lihat juga [Mengoperasikan klaster etcd untuk Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/) dan
[Membangun klaster etcd dengan ketersediaan tinggi (*high-availability*) menggunakan kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) untuk detail tentang konfigurasi dan mengelola etcd untuk klaster besar.

## Resource tambahan

[Batas sumber daya](/docs/concepts/configuration/manage-resources-containers/) Kubernetes membantu untuk meminimalisasi dampak dari kebocoran memori dan hal lainnya yang dapat membuat pods dan kontainer memberikan dampak terhadap komponen lainnya. Batasan sumber daya ini berlaku untuk sumber daya *{{< glossary_tooltip text="addon" term_id="addons" >}}* layaknya berlaku untuk *workload* aplikasi.

Sebagai contoh, kamu dapat mengatur batas CPU dan memori untuk komponen *logging* berikut ini:

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Batas bawaan *addon* biasanya diatur berdasarkan data yang dikumpulkan dari pengalaman menjalankan *addon* pada klaster Kubernetes kecil atau menengah. Ketika menjalankan klaster besar, *addon* biasanya menggunakan lebih banyak sumber daya dibanding batasnya. Jika klaster besar dijalankan tanpa mengubah nilai batasan, *addon* dapat terhenti terus menerus karena mencapai batas memori. Selain itu, *addon* dapat berjalan dengan performa buruk karena pembatasan potongan waktu (*time slice*) CPU.

Untuk mencegah masalah sumber daya *addon* di Kubernetes, saat membangun klaster dengan *node* yang banyak, pertimbangkanlah beberapa hal berikut ini:

* Beberapa *addon* memperbesar ukurannya secara vertikal - terdapat satu replika dari *addon* untuk satu klaster atau melayani hanya satu zona kegagalan. Untuk *addon* tersebut, tambahkan permintaan (*request*) dan batasan ketika kamu memperbesar ukuran klaster.
* Banyak *addon* memperbesar ukurannya secara horizontal - kamu dapat menambah kapasitas dengan menjalankan lebih banyak pods - tapi dengan klaster yang sangat besar, kamu juga perlu untuk menaikan batas CPU atau memori secukupnya.  [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) dapat berjalan dalam mode _recommender_ untuk menyediakan angka yang disarankan bagi permintaan dan batasan.
* Beberapa *addon* berjalan di setiap *node* yang dikontrol oleh {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}}. Sebagai contoh, agregator log tingkat *node*. Mirip dengan kasus *addon* yang memperbesar ukuran secara horizontal, kamu juga dapat menaikkan batas CPU dan memori secukupnya.

## Selanjutnya

* `VerticalPodAutoscaler` adalah *custom resource* yang dapat dijalankan di klaster untuk membantu kamu mengelola permintaan sumber daya dan batasan untuk pods. Pelajari lebih lanjut tentang [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) dan bagaimana kamu dapat menggunakannya untuk mengubah ukuran klaster.
  
* Baca juga tentang [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/).

* [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
membantu kamu mengubah ukuran *addon* secara otomatis ketika ukuran klaster kamu berubah. 
