---
title: Konsep
main_menu: true
content_type: concept
weight: 40
---

<!-- overview -->

Bagian konsep ini membantu kamu belajar tentang bagian-bagian sistem serta abstraksi
yang digunakan Kubernetes untuk merepresentasikan klaster kamu, serta membantu
kamu belajar lebih dalam bagaimana cara kerja Kubernetes.



<!-- body -->

## Ikhtisar

Untuk menggunakan Kubernetes, kamu menggunakan objek-objek *Kubernetes API* untuk merepresentasikan
*state* yang diinginkan: apa yang aplikasi atau *workload* lain yang ingin kamu
jalankan, *image* kontainer yang digunakan, jaringan atau *resource disk* apa yang ingin
kamu sediakan, dan lain sebagainya. Kamu membuat *state* yang diinginkan dengan cara membuat
objek dengan menggunakan API Kubernetes, dan biasanya menggunakan `command-line interface`, yaitu `kubectl`.
Kamu juga dapat secara langsung berinteraksi dengan klaster untuk membuat atau mengubah
*state* yang kamu inginkan.

Setelah kamu membuat *state* yang kamu inginkan, *Control Plane* Kubernetes
menggunakan `Pod Lifecycle Event Generator (PLEG)` untuk mengubah
*state* yang ada saat ini supaya sama dengan *state* yang diinginkan.
Untuk melakukan hal tersebut, Kubernetes melakukan berbagai *task* secara otomatis,
misalnya dengan mekanisme `start` atau `stop` kontainer, melakukan *scale* replika dari
suatu aplikasi, dan lain sebagainya. *Control Plane* Kubernetes terdiri dari sekumpulan
`process` yang dijalankan di klaster:

* **Kubernetes Master** terdiri dari tiga buah *process* yang dijalankan pada sebuah *node* di klaster kamu, *node* ini disebut sebagai *master*, yang terdiri [kube-apiserver](/id/docs/concepts/overview/components/#kube-apiserver), [kube-controller-manager](/id/docs/concepts/overview/components/#kube-controller-manager) dan [kube-scheduler](/id/docs/concepts/overview/components/#kube-scheduler).
* Setiap *node* non-master pada klaster kamu menjalankan dua buah *process*:
  * **[kubelet](/id/docs/concepts/overview/components/#kubelet)**, yang menjadi perantara komunikasi dengan *master*.
  * **[kube-proxy](/id/docs/concepts/overview/components/#kube-proxy)**, sebuah *proxy* yang merupakan representasi jaringan yang ada pada setiap *node*.

## Objek Kubernetes

Kubernetes memiliki beberapa abstraksi yang merepresentasikan *state* dari sistem kamu:
apa yang aplikasi atau *workload* lain yang ingin kamu jalankan, jaringan atau *resource disk* apa yang ingin
kamu sediakan, serta beberapa informasi lain terkait apa yang sedang klaster kamu lakukan.
Abstraksi ini direpresentasikan oleh objek yang tersedia di API Kubernetes;
lihat [ikhtisar objek-objek Kubernetes](/docs/concepts/abstractions/overview/)
untuk penjelasan yang lebih mendetail.

Objek mendasar Kubernetes termasuk:

* [Pod](/id/docs/concepts/workloads/pods/pod-overview/)
* [Service](/id/docs/concepts/services-networking/service/)
* [Volume](/id/docs/concepts/storage/volumes/)
* [Namespace](/id/docs/concepts/overview/working-with-objects/namespaces/)

Sebagai tambahan, Kubernetes memiliki beberapa abstraksi yang lebih tinggi yang disebut kontroler.
Kontroler merupakan objek mendasar dengan fungsi tambahan, contoh dari kontroler ini adalah:

* [ReplicaSet](/id/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/id/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/id/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/id/docs/concepts/workloads/controllers/daemonset/)
* [Job](/id/docs/concepts/workloads/controllers/job/)

## *Control Plane* Kubernetes

Berbagai bagian *Control Plane* Kubernetes, seperti *master* dan *process-process* kubelet,
mengatur bagaimana Kubernetes berkomunikasi dengan klaster kamu. *Control Plane*
menjaga seluruh *record* dari objek Kubernetes serta terus menjalankan
iterasi untuk melakukan manajemen *state* objek. *Control Plane* akan memberikan respon
apabila terdapat perubahan pada klaster kamu dan mengubah *state* saat ini agar sesuai
dengan *state* yang diinginkan.

Contohnya, ketika kamu menggunakan API Kubernetes untuk membuat sebuah *Deployment*,
kamu memberikan sebuah *state* baru yang harus dipenuhi oleh sistem. *Control Plane*
kemudian akan mencatat objek apa saja yang dibuat, serta menjalankan instruksi yang kamu berikan
dengan cara melakukan `start` aplikasi dan melakukan `scheduling` aplikasi tersebut
pada *node*, dengan kata lain mengubah *state* saat ini agar sesuai dengan *state* yang diinginkan.

### Master

Master Kubernetes bertanggung jawab untuk memelihara *state* yang diinginkan pada klaster kamu.
Ketika kamu berinteraksi dengan Kubernetes, misalnya saja menggunakan perangkat `kubectl`,
kamu berkomunikasi dengan *master* klaster Kubernetes kamu.

> "master" merujuk pada tiga buah *process* yang dijalankan pada sebuah *node* pada klaster kamu, *node* ini disebut sebagai *master*, yang terdiri [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) dan [kube-scheduler](/docs/admin/kube-scheduler/).

### Node

*Node* di dalam klaster Kubernetes adalah mesin (mesin virtual maupun fisik) yang
menjalankan aplikasi kamu. Master mengontrol setiap node; kamu akan jarang berinteraksi
dengan *node* secara langsung.

#### Metadata objek


* [Anotasi](/id/docs/concepts/overview/working-with-objects/annotations/)



## {{% heading "whatsnext" %}}


Jika kamu ingin menulis halaman konsep, perhatikan
[cara penggunaan template pada laman](/docs/home/contribute/page-templates/)
untuk informasi mengenai konsep tipe halaman dan *template* konsep.

