---
title: Antarmuka Pengguna Berbasis Web (Dashboard)
content_type: concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Menggunakan Antarmuka Pengguna Berbasis Web Dashboard
---

<!-- overview -->

Dashboard adalah antarmuka pengguna Kubernetes. Kamu dapat menggunakan Dashboard untuk men-_deploy_ aplikasi yang sudah dikontainerisasi ke klaster Kubernetes, memecahkan masalah pada aplikasi kamu, dan mengatur sumber daya klaster. Kamu dapat menggunakan Dashboard untuk melihat ringkasan dari aplikasi yang sedang berjalan di klaster kamu, dan juga membuat atau mengedit objek individu sumber daya Kubernetes (seperti Deployment, Job, DaemonSet, dll.). Sebagai contoh, kamu dapat mengembangkan sebuah Deployment, menginisiasi sebuah pembaruan bertahap (_rolling update_), memulai kembali sebuah Pod atau men-_deploy_ aplikasi baru menggunakan sebuah _deploy wizard_.

Dashboard juga menyediakan informasi tentang status dari sumber daya Kubernetes di klaster kamu dan kesalahan apapun yang mungkin telah terjadi..

![Antarmuka Pengguna Dashboard Kubernetes](/images/docs/ui-dashboard.png)




<!-- body -->

## Men-_deploy_ Antarmuka Pengguna Dashboard

Antarmuka Dashboard tidak ter-_deploy_ secara bawaan. Untuk men-_deploy_-nya, kamu dapat menjalankan perintah berikut:

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml
```

## Mengakses Antarmuka Dashboard


Untuk melindungi data klaster kamu, pen-_deploy_-an Dashboard menggunakan sebuah konfigurasi _RBAC_ yang minimal secara bawaan. Saat ini, Dashboard hanya mendukung otentikasi dengan _Bearer Token_. Untuk membuat token untuk demo, kamu dapat mengikuti petunjuk kita untuk [membuat sebuah contoh pengguna](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md).

{{< warning >}}
Contoh pengguna yang telah dibuat di tutorial tersebut akan memiliki hak istimewa sebagai administrator dan hanyalah untuk tujuan pembelajaran.
{{< /warning >}}

### Proksi antarmuka baris perintah (CLI)
Kamu dapat mengakses Dashboard menggunakan perkakas CLI kubectl dengan menjalankan perintah berikut:

```
kubectl proxy
```

Kubectl akan membuat Dashboard tersedia di http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/.

Antarmuka pengguna berbasis web tersebut hanya dapat di akses dari mesin dimana perintah tersebut dijalankan. Lihat `kubectl proxy --help` untuk lebih lanjut.

{{< note >}}
Metode otentikasi Kubeconfig tidak mendukung penyedia identitas eksternal atau otentikasi berbasis sertifikat elektronik x509.
{{< /note >}}

## Tampilan selamat datang

Ketika kamu mengakses Dashboard di klaster yang kosong, kamu akan melihat laman selamat datang. Laman ini berisi tautan ke dokumen ini serta tombol untuk men-_deploy_ aplikasi pertama kamu. Selain itu, kamu dapat melihat aplikasi-aplikasi sistem mana saja yang berjalan secara bawaan di [Namespace](/docs/tasks/administer-cluster/namespaces/) `kube-system` dari klaster kamu, misalnya Dashboard itu sendiri.

![Kubernetes Dashboard welcome page](/images/docs/ui-dashboard-zerostate.png)

## Men-_deploy_ aplikasi yang sudah dikontainerisasi

Dashboard memungkinkan kamu untuk membuat dan men-_deploy_ aplikasi yang sudah dikontainerisasi sebagai Deployment dan Service opsional dengan sebuah _wizard_ sederhana. Kamu secara manual dapat menentukan detail aplikasi, atau mengunggah sebuah berkas YAML atau JSON yang berisi konfigurasi aplikasi.

Tekan tombol **CREATE** di pojok kanan atas di laman apapun untuk memulai.

### Menentukan detail aplikasi

_Deploy wizard_ meminta kamu untuk menyediakan informasi sebagai berikut:

- **App name** (wajib): Nama dari aplikasi kamu. Sebuah [label](/id/docs/concepts/overview/working-with-objects/labels/) dengan nama tersebut akan ditambahkan ke Deployment dan Service, jika ada, akan di-_deploy_.

  Nama aplikasi harus unik di dalam [Namespace](/docs/tasks/administer-cluster/namespaces/) Kubernetes yang kamu pilih. Nama tersebut harus dimulai dengan huruf kecil, dan diakhiri dengan huruf kecil atau angka, dan hanya berisi huruf kecil, angka dan tanda hubung (-). Nama tersebut juga dibatasi hanya 24 karakter. Spasi di depan dan belakang nama tersebut diabaikan.

- **Container image** (wajib): Tautan publik dari sebuah [_image_](/id/docs/concepts/containers/images/) kontainer Docker pada _registry_ apapun, atau sebuah _image_ privat (biasanya di-_hosting_ di Google Container Registry atau Docker Hub). Spesifikasi _image_ kontainer tersebut harus diakhiri dengan titik dua.

- **Number of pods** (wajib): Berapa banyak Pod yang kamu inginkan untuk men-_deploy_ aplikasimu. Nilainya haruslah sebuah bilangan bulat positif.

  Sebuah [Deployment](/id/docs/concepts/workloads/controllers/deployment/) akan terbuat untuk mempertahankan jumlah Pod di klaster kamu.

- **Service** (opsional): Untuk beberapa aplikasi (misalnya aplikasi _frontend_) kamu mungkin akan mengekspos sebuah [Service](/id/docs/concepts/services-networking/service/) ke alamat IP publik yang mungkin berada diluar klaster kamu(Service eksternal). Untuk Service eksternal, kamu mungkin perlu membuka lebih dari satu porta jaringan untuk mengeksposnya. Lihat lebih lanjut [di sini](/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/).

  Service lainnya yang hanya dapat diakses dari dalam klaster disebut Service internal.

  Terlepas dari jenis Service, jika kamu memilih untuk membuat sebuah Service dan Container kamu berjalan di  sebuah porta(arah masuk), kamu perlu menentukan dua porta. Service akan memetakan porta(arah masuk) ke porta target yang ada di sisi Container. Service akan mengarahkan ke Pod-Pod kamu yang sudah di-_deploy_. Protokol yang didukung adalah TCP dan UDP. Nama DNS internal untuk Service ini akan sesuai dengan nama aplikasi yang telah kamu tentukan diatas.

Jika membutuhkan, kamu dapat membuka bagian **Advanced options** di mana kamu dapat menyetel lebih banyak pengaturan:

- **Description**: Tels yang kamu masukkan ke sini akan ditambahkan sebagai sebuah [anotasi](/id/docs/concepts/overview/working-with-objects/annotations/) ke Deployment dan akan ditampilkan di detail aplikasi.

- **Labels**: [Label-label](/id/docs/concepts/overview/working-with-objects/labels/) bawaan yang akan digunakan untuk aplikasi kamu adalah `name` dan `version` aplikasi. Kamu dapat menentukan label lain untuk diterapkan ke Deployment, Service (jika ada), dan Pod, seperti `release`, `environment`, `tier`, `partition`, dan `track` rilis.

  Contoh:

  ```conf
  release=1.0
  tier=frontend
  environment=pod
  track=stable
  ```

- **_Namespace_**: Kubernetes mendukung beberapa klaster virtual yang berjalan di atas klaster fisik yang sama. Klaster virtual ini disebut [Namespace](/docs/tasks/administer-cluster/namespaces/). Mereka mengizinkan kamu untuk mempartisi sumber daya ke beberapa grup yang diberi nama secara logis.

  Dashboard menampilkan semua Namespace yang tersedia dalam sebuah daftar _dropdown_, dan mengizinkan kamu untuk membuat Namespace baru. Nama yang diizinkan untuk Namespace terdiri dari maksimal 63 karakter alfanumerik dan tanda hubung (-), dan tidak boleh ada huruf kapital.
  Nama dari Namespace tidak boleh terdiri dari angka saja. Jika nama Namespace disetel menjadi sebuah angka, misalnya 10, maka Pod tersebut akan ditaruh di Namespace `default`.

  Jika pembuatan Namespace berhasil, Namespace tersebut akan dipilih secara bawaan. Jika pembuatannya gagal, maka Namespace yang pertama akan terpilih.

- **_Image Pull Secret_**: Jika kamu menggunakan _image_ kontainer Docker yang privat, mungkin diperlukan kredensial [_pull secret_](/id/docs/concepts/configuration/secret/).

  Dashboard menampilkan semua _secret_ yang tersedia dengan daftar _dropdown_, dan mengizinkan kamu untuk membuat _secret_ baru. Nama _secret_ tersebut harus mengikuti aturan Nama DNS, misalnya `new.image-pull.secret`. Isi dari sebuah _secret_ harus dienkode dalam bentuk _base64_ dan ditentukan dalam sebuah berkas [`.dockercfg`](/id/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod). Nama kredensial dapat berisi maksimal 253 karakter.

  Jika pembuatan _image pull secret_ berhasil, _image pull secret_ tersebut akan terpilih secara bawaan. Jika gagal, maka tidak ada _secret_ yang dipilih.

- **_CPU requirement (cores)_** dan **_Memory requirement (MiB)_**: Kamu dapat menentukan [batasan sumber daya](/docs/tasks/configure-pod-container/limit-range/) minimal untuk Container. Secara bawaan, Pod-Pod berjalan dengan CPU dan memori yang tak dibatasi.

- **_Run command_** dan **_Run command arguments_**: Secara bawaan, Container-Container kamu akan menjalankan perintah [_entrypoint_](/docs/user-guide/containers/#containers-and-commands) bawaan dari _image_ Docker yang ditentukan. Kamu dapat menggunakan opsi _Run command_ dan _Run command arguments_ untuk mengganti bawaannya.

- **_Run as priveleged_**: Pengaturan ini untuk menentukan sebuah proses yang berjalan dalam [_privileged container_](/docs/user-guide/pods/#privileged-mode-for-pod-containers) sepadan dengan proses yang berjalan sebagai _root_ pada _host_-nya. _Priveleged container_ dapat menggunakan kemampuan seperti memanipulasi _stack_ jaringan dan mengakses perangkat-perangkat. 

- **_Environment variables_**: Kubernetes mengekspos Service melalui [_environment variable_](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/). Kamu dapat membuat _environment variable_ atau meneruskan argumen ke perintah-perintah untuk menjalankan Container dengan nilai dari _environment variable_. _Environment Variable_ dapat digunakan pada aplikasi-aplikasi untuk menemukan sebuah Service. Nilai _environment variable_ dapat merujuk ke variabel lain menggunakan sintaksis `$(VAR_NAME)`.

### Menggungah berkas YAML atau JSON

Kubernetes mendukung pengaturan deklaratif. Dengan cara ini, semua pengaturan disimpan dalam bentuk berkas YAML atau JSON menggunakan skema sumber daya [[API](/id/docs/concepts/overview/kubernetes-api/).

Sebagai alternatif untuk menentukan detail aplikasi di _deploy wizard_, kamu dapat menentukan sendiri detail aplikasi kamu dalam berkas YAML atau JSON, dan mengunggah berkas tersebut menggunakan Dashboard.

## Menggunakan Dashboard
Bagian ini akan menjelaskan bagian-bagian yang ada pada Antarmuka Dashboard Kubernetes; apa saja yang mereka sediakan dan bagaimana cara menggunakanya.

### Navigation

Ketika ada objek Kubernetes yang sudah didefinisikan di dalam klaster, Dashboard akan menampilkanya di tampilan awalnya. Secara bawaan hanya objek-objek dalam Namespace _default_ saja yang ditampilkan di sini dan kamu dapat menggantinya dengan selektor Namespace yang berada di menu navigasi.

Dashboard menampilkan jenis objek Kubernetes dan mengelompokanya dalam beberapa kategori menu.

#### Admin Overview
Untuk administrasi klaster dan Namespace, Dashboard menampilkan Node, Namespace dan PresistentVolume dan memiliki tampilan yang detail untuk objek-objek tersebut. Daftar Node berisi  metrik penggunaan CPU dan memori yang dikumpulkan dari semua Node. Tampilan detail menampilkan metrik-metrik untuk sebuah Node, spesifikasinya, status, sumber daya yang dialokasikan, _event-event_, dan Pod-Pod yang sedang berjalan di Node tersebut. 

#### Workloads
Menampilkan semua aplikasi yang sedang berjalan di Namespace yang dipilih. Tampilan ini menampilkan aplikasi berdasarkan jenis beban kerja (misalnya, Deployment, Replica Set, Stateful Set, dll.) dan setiap jenis beban kerja memiliki tampilanya sendiri. Daftar ini merangkum informasi yang dapat ditindaklanjuti, seperti berapa banyak Pod yang siap untuk setiap Replica Set atau penggunaan memori pada sebuah Pod.

Tampilan detail dari beban kerja menampilkan status dan informasi spesifik serta hubungan antara objek. Misalnya, Pod-Pod yang diatur oleh ReplicaSet atau, ReplicaSet-ReplicaSet baru, dan HorizontalPodAutoscaler untuk Deployment.

#### Services
Menampilkan sumber daya Kubernetes yang mengizinkan untuk mengekspos Service-Service ke jaringan luar dan menemukannya (_service discovery_) di dalam klaster. Untuk itu, tampilan dari Service dan Ingress menunjukan Pod-Pod yang ditarget oleh mereka, _endpoint-endpoint_ internal untuk koneksi klaster, dan _endpoint-endpoint_ eksternal untuk pengguna eksternal.

#### Storage
Tampilan Storage menampilkan sumber-sumber daya PersistentVolumeClaim yang digunakan oleh aplikasi untuk menyimpan data.

#### Config Maps dan Secrets
Menampilkan semua sumber daya Kubernetes yang digunakan untuk pengaturan aplikasi yang sedang berjalan di klaster. Pada tampilan ini kamu dapat mengedit dan mengelola objek-objek konfigurasi dan menampilkan kredensial yang tersembunyi secara bawaan.

#### Logs Viewer
Laman daftar dan detail Pod tertaut dengan laman penampil log (_log viewer_). Kamu dapat menelusuri log yang berasal dari Container-Container pada sebuah Pod. 

![Logs viewer](/images/docs/ui-dashboard-logs-view.png)



## {{% heading "whatsnext" %}}


Untuk informasi lebih lanjut, lihat
[Laman proyek Kubernetes Dashboard](https://github.com/kubernetes/dashboard).


