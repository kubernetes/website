---
title: Pengenalan Pod
content_template: templates/concept
weight: 10
card: 
  name: concepts
  weight: 60
---

{{% capture overview %}}
Halaman ini menyajikan ikhtisar dari `Pod`, objek terkecil yang dapat di *deploy* di dalam objek model Kubernetes.
{{% /capture %}}


{{% capture body %}}
## Memahami Pod

Sebuah *Pod* adalah unit dasar di Kubernetes--unit terkecil dan paling sederhana di dalam objek model Kubernetes yang dapat dibuat dan di *deploy*. Sebuah *Pod* merepresentasikan suatu proses yang berjalan di dalam kluster.

*Pod* membungkus sebuah kontainer (atau, di beberapa kasus, beberapa kontainer), sumber penyimpanan, alamat jaringan *IP* yang unik, dan opsi yang mengatur bagaimana kontainer harus dijalankan. *Pod* merupakan representasi dari unit *deployment*: sebuah *instance* aplikasi di dalam Kubernetes, yang mungkin terdiri dari satu kontainer atau sekumpulan kontainer yang berbagi *resource*.

[Docker](https://www.docker.com) adalah salah satu kontainer *runtime* yang paling umum digunakan di Kubernetes *Pod*, tetapi *Pod* mendukung kontainer *runtime* lainnya.

*Pod* di Kubernetes kluster dapat digunakan dengan dua cara:

* **Pod menjalankan satu kontainer**. Model satu kontainer per *Pod* adalah model yang umum digunakan di Kubernetes; kamu dapat membayangkan sebuah *Pod* sebagai pembungkus kontainer tersebut, dan Kubernetes tidak mengelola kontainer secara langsung tetapi mengelola *Pod* tersebut.
* **Pod menjalankan beberapa kontainer yang perlu berjalan bersamaan**. Sebuah *Pod* dapat membungkus sebuah aplikasi yang terdiri dari beberapa kontainer yang perlu berbagi *resource*. Kontainer yang ditempatkan di dalam satu *Pod* ini membentuk sebuah layanan. Sebuah kontainer menyajikan berkas dari sumber penyimpanan ke publik, sedangkan kontainer *sidecar* yang lain melakukan pembaharuan terhadap berkas tersebut. *Pod* membungkus semua kontainer dan *resource* penyimpanan sebagai satu kesatuan yang dapat dikelola.

[Kubernetes Blog](http://kubernetes.io/blog) menyediakan beberapa informasi tambahan terkait penggunaan *Pod*. Informasi selengkapnya, kunjungi:

* [The Distributed System Toolkit: Patterns for Composite Containers](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)
* [Container Design Patterns](https://kubernetes.io/blog/2016/06/container-design-patterns)

Setiap *Pod* dimaksudkan untuk menjalankan satu *instance* aplikasi. Jika kamu ingin mengembangkan aplikasi secara horizontal (contoh, banyak *instance* sekaligus), kamu dapat menggunakan banyak *Pod*, satu untuk setiap *instance*. Di Kubernetes, konsep ini umumnya disebut dengan replikasi. *Pod* yang direplikasi biasanya dibuat dan dikelola sebagai grup oleh objek abstraksi yang disebut  kontroler. Lihat [Pod dan Kontroler](#pod-dan-kontroler) untuk informasi selengkapnya.

### Bagaimana *Pod* mengelola beberapa Kontainer
*Pod* didesain untuk mendukung banyak proses (sebagai kontainer) yang membentuk sebuah layanan. Kontainer di dalam sebuah *Pod* akan otomatis ditempatkan bersama di dalam satu mesin fisik atau mesin *virtual* di dalam kluster. Kontainer tersebut dapat berbagi *resource* dan dependensi, berkomunikasi satu sama lain, dan berkoordinasi kapan dan bagaimana mereka diterminasi.

Perhatikan bahwa mengelompokan kontainer di dalam satu *Pod* merupakan kasus lanjutan. Kamu dapat menggunakan pola ini hanya dalam kasus tertentu. Sebagai contoh, kamu memiliki kontainer yang bertindak sebagai *web server* yang menyajikan berkas dari *resource* penyimpanan bersama, dan kontainer *sidecar* melakukan pembaharuan terhadap berkas tersebut dari sumber lain, seperti dalam diagram *Pod* berikut: 
{{< figure src="/images/docs/pod.svg" title="Pod diagram" width="50%" >}}

*Pod* menyediakan dua jenis *resource* sebagai penyusun dari kontainer: *jaringan* dan *penyimpanan*.

#### Jaringan

Setiap *Pod* diberikan sebuah alamat *IP* unik. Setiap kontainer di dalam *Pod* berbagi *network namespace*, termasuk alamat *IP* dan *port* jaringan. Setiap kontainer di dalam *Pod* dapat berkomunikasi satu sama lain menggunakan *localhost*. Saat para kontainer di dalam *Pod* berkomunikasi dengan entitas lain di luar *Pod*, mereka harus berkoordinasi satu sama lain bagaimana mereka menggunakan *resource* jaringan (seperti *Port*).

#### Penyimpanan

*Pod* dapat menentukan penyimpanan bersama yaitu *volumes*. Semua kontainer di dalam *Pod* dapat mengakses *volumes* ini, mengizinkan kontainer untuk berbagi data. *Volumes* juga memungkinkan data di *Pod* untuk bertahan jika salah satu kontainer perlu melakukan proses *restart*. Lihat *[Volumes](/docs/concepts/storage/volumes/)* untuk informasi lebih lanjut bagaimana Kubernetes mengimplementasikan penyimpanan di dalam *Pod*.


## Bekerja dengan Pod

Kamu akan jarang membuat *Pod* secara langsung di Kubernetes. Ini karena *Pod* dirancang sebagai entitas sesaat. Saat *Pod* dibuat (baik oleh kamu, atau secara tidak langsung oleh  kontroler), *Pod* ditempatkan dan dijalankan di sebuah *Node* di dalam kluster. *Pod* akan tetap di *Node* tersebut sampai proses dihentikan, Objek *Pod* dihapus, *Pod* dihentikan karena kekurangan *resource*, atau *Node* tersebut berhenti berjalan.

{{< note >}}
Tidak perlu bingung untuk membedakan antara menjalankan ulang sebuah kontainer di dalam *Pod* dan menjalankan ulang *Pod*. *Pod* itu sendiri tidak berjalan, tetapi *Pod* adalah *environment* kontainer itu berjalan dan akan tetap ada sampai dihapus.
{{< /note >}}

*Pod* tidak melakukan mekanisme penyembuhan diri sendiri. Jika *Pod* ditempatkan disebuah *Node* yang gagal, atau proses penempatan *Pod* itu sendiri gagal, *Pod* akan dihapus; demikian juga, *Pod* tidak akan bertahan jika *Node* tersebut kehabisan *resource* atau sedang dalam tahap pemeliharaan. Kubernetes menggunakan abstraksi yang disebut  kontroler, yang menangani dan mengelola *Pod*. Jadi, meskipun *Pod* dapat dipakai secara langsung di Kubernetes,  kontroler merupakan cara umum yang digunakan untuk mengelola *Pod*. Lihat [Pod dan kontroler](#pod-dan-kontroler) untuk informasi lebih lanjut bagaimana Kubernetes menggunakan  kontroler untuk mengimpelentasikan mekanisme penyembuhan diri sendiri dan replikasi pada *Pod*.

### Pod dan Kontroler

Kontroler dapat membuat dan mengelola banyak *Pod* untuk kamu, menangani replikasi dan menyediakan kemampuan penyembuhan diri sendiri pada lingkup kluster. Sebagai contoh, jika sebuah *Node* gagal,  kontroler akan otomatis mengganti *Pod* tersebut dengan menempatkan *Pod* yang identik di *Node* yang lain.

Beberapa contoh  kontroler yang berisi satu atau lebih *Pod* meliputi:

* [Deployment](/docs/concepts/workloads/controllers/deployment/)
* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)
* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)

Secara umum, kontroler menggunakan templat *Pod* yang kamu sediakan untuk membuat *Pod*.

## Templat Pod

Templat *Pod* adalah spesifikasi dari *Pod* yang termasuk di dalam objek lain seperti
[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Jobs](/docs/concepts/jobs/run-to-completion-finite-workloads/), dan [DaemonSets](/docs/concepts/workloads/controllers/daemonset/). Kontroler menggunakan templat *Pod* untuk membuat *Pod*.

Contoh di bawah merupakan manifestasi sederhana untuk *Pod* yang berisi kontainer yang membuat sebuah pesan.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo Hello Kubernetes! && sleep 3600']
```


Perubahan yang terjadi pada templat atau berganti ke templat yang baru tidak memiliki efek langsung pada *Pod* yang sudah dibuat. *Pod* yang dibuat oleh *replication controller* dapat diperbarui secara langsung.


{{% /capture %}}

{{% capture whatsnext %}}
* Pelajari lebih lanjut tentang perilaku *Pod*:
  * [Terminasi Pod](/docs/concepts/workloads/pods/pod/#termination-of-pods)
  * [Lifecycle Pod](/docs/concepts/workloads/pods/pod-lifecycle/)
{{% /capture %}}
