---
title: Konsep
main_menu: true
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Bagian konsep ini membantu kamu belajar tentang bagian-bagian sistem serta abstraksi 
yang digunakan Kubernetes untuk merepresentasikan kluster kamu, serta membantu 
kamu belajar lebih dalam bagaimana cara kerja Kubernetes.

{{% /capture %}}

{{% capture body %}}

## Ikhtisar

Untuk menggunakan Kubernetes, kamu menggunakan obyek-obyek *Kubernetes API* untuk merepresentasikan 
*state* yang diinginkan: apa yang aplikasi atau *workload* lain yang ingin kamu 
jalankan, *image* kontainer yang digunakan, jaringan atau *resource disk* apa yang ingin 
kamu sediakan, dan lain sebagainya. Kamu membuat *state* yang diinginkan dengan cara membuat 
obyek dengan menggunakan API Kubernetes, dan biasanya menggunakan `command-line interface`, yaitu `kubectl`.
Kamu juga dapat secara langsung berinteraksi dengan kluster untuk membuat atau mengubah 
*state* yang kamu inginkan.

Setelah kamu membuat *state* yang kamu inginkan, *Control Plane* Kubernetes 
menggunakan `Pod Lifecycle Event Generator (PLEG)` untuk mengubah 
*state* yang ada saat ini supaya sama dengan *state* yang diinginkan. 
Untuk melakukan hal tersebut, Kubernetes melakukan berbagai *task* secara otomatis, 
misalnya dengan mekanisme `start` atau `stop` kontainer, melakukan *scale* replika dari 
suatu aplikasi, dan lain sebagainya. *Control Plane* Kubernetes terdiri dari sekumpulan 
`process` yang dijalankan di kluster:

* **Kubernetes Master** terdiri dari tiga buah *process* yang dijalankan pada sebuah *node* di kluster kamu, *node* ini disebut sebagai *master*, yang terdiri [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) dan [kube-scheduler](/docs/admin/kube-scheduler/).
* Setiap *node* non-master pada kluster kamu menjalankan dua buah *process*: 
  * **[kubelet](/docs/admin/kubelet/)**, yang menjadi perantara komunikasi dengan *master*.
  * **[kube-proxy](/docs/admin/kube-proxy/)**, sebuah *proxy* yang merupakan representasi jaringan yang ada pada setiap *node*.

## Obyek Kubernetes

Kubernetes memiliki beberapa abstraksi yang merepresentasikan *state* dari sistem kamu: 
apa yang aplikasi atau *workload* lain yang ingin kamu jalankan, jaringan atau *resource disk* apa yang ingin 
kamu sediakan, serta beberapa informasi lain terkait apa yang sedang kluster kamu lakukan. 
Abstraksi ini direpresentasikan oleh obyek yang tersedia di API Kubernetes; 
lihat [ikhtisar obyek-obyek Kubernetes](/docs/concepts/abstractions/overview/) 
untuk penjelasan yang lebih mendetail.

Obyek mendasar Kubernetes termasuk: 

* [Pod](/docs/concepts/workloads/pods/pod-overview/)
* [Service](/docs/concepts/services-networking/service/)
* [Volume](/docs/concepts/storage/volumes/)
* [Namespace](/docs/concepts/overview/working-with-objects/namespaces/)

Sebagai tambahan, Kubernetes memiliki beberapa abstraksi yang lebih tinggi yang disebut kontroler.
Kontroler merupakan obyek mendasar dengan fungsi tambahan, contoh dari kontroler ini adalah:

* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
* [Job](/docs/concepts/workloads/controllers/jobs-run-to-completion/)

## *Control Plane* Kubernetes

Berbagai bagian *Control Plane* Kubernetes, seperti *master* dan *process-process* kubelet, 
mengatur bagaimana Kubernetes berkomunikasi dengan kluster kamu. *Control Plane* 
menjaga seluruh *record* dari obyek Kubernetes serta terus menjalankan 
iterasi untuk melakukan manajemen *state* obyek. *Control Plane* akan memberikan respon 
apabila terdapat perubahan pada kluster kamu dan mengubah *state* saat ini agar sesuai 
dengan *state* yang diinginkan.

Contohnya, ketika kamu menggunakan API Kubernetes untuk membuat sebuah *Deployment*, 
kamu memberikan sebuah *state* baru yang harus dipenuhi oleh sistem. *Control Plane* 
kemudian akan mencatat obyek apa saja yang dibuat, serta menjalankan instruksi yang kamu berikan 
dengan cara melakukan `start` aplikasi dan melakukan `scheduling` aplikasi tersebut 
pada *node*, dengan kata lain mengubah *state* saat ini agar sesuai dengan *state* yang diinginkan.

### Master

Master Kubernetes bertanggung jawab untuk memelihara *state* yang diinginkan pada kluster kamu. 
Ketika kamu berinteraksi dengan Kubernetes, misalnya saja menggunakan perangkat `kubectl`, 
kamu berkomunikasi dengan *master* kluster Kubernetes kamu. 

> "master" merujuk pada tiga buah *process* yang dijalankan pada sebuah *node* pada kluster kamu, *node* ini disebut sebagai *master*, yang terdiri [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) dan [kube-scheduler](/docs/admin/kube-scheduler/).

### Node

*Node* di dalam kluster Kubernetes adalah mesin (mesin virtual maupun fisik) yang 
menjalankan aplikasi kamu. Master mengontrol setiap node; kamu akan jarang berinteraksi 
dengan *node* secara langsung.

#### Metadata obyek


* [Anotasi](/docs/concepts/overview/working-with-objects/annotations/)

{{% /capture %}}

{{% capture whatsnext %}}

Jika kamu ingin menulis halaman konsep, perhatikan
[cara penggunaan template pada laman](/docs/home/contribute/page-templates/)
untuk informasi mengenai konsep tipe halaman dan *template* konsep.

{{% /capture %}}