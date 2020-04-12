---
title: Antarmuka Web (Dashboard)
content_template: templates/concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Menggunakan Antarmuka Web _Dashboard_ 
---

{{% capture overview %}}

_Dashboard_ adalah antarmuka pengguna Kubernetes. Kamu dapat menggunakan _Dashboard_ untuk merilis aplikasi yang sudah dikemas ke klaster Kubernetes, memecahkan masalah pada aplikasi kamu, dan mengatur sumber daya klaster. Kamu dapat menggunakan _Dashboard_ untuk melihat ringkasan dari aplikasi yang sedang berjalan di klaster kamu, seperti membuat atau mengedit individu sumber daya Kubernetes (seperti _Deployments_, _Jobs_, _DaemonSets_, dll). Sebagai contoh, kamu dapat mengembangkan sebuah _Deployment_, menginisiasi _rolling_ _update_, memulai kembali sebuah _pod_ atau _merilis_ aplikasi baru menggunakan _deploy_ _wizard_.

_Dashboard_ juga menyediakan informasi tentang status dari sumber daya Kubernetes di klaster kamu dan setiap kesalahan yang mungkin terjadi.

![Antarmuka _Dashboard_ Kubernetes](/images/docs/ui-dashboard.png)

{{% /capture %}}


{{% capture body %}}

## Merilis Antarmuka _Dashboard_

Antarmuka _Dashboard_ secara standar tidak dirilis. Untuk merilisnya, kamu dapat menjalankan perintah berikut:

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta8/aio/deploy/recommended.yaml
```

## Mengakses Antarmuka _Dashboard_


Untuk melindungi data klaster kamu, perilisan _Dashboard_ menggunakan konfigurasi minimal _RBAC_ secara standar. Saat ini, _Dashboard_ hanya mendukung otentikasi dengan _Bearer Token_. Untuk membuat token untuk demo, kamu dapat mengikuti petunjuk kami [membuat sampel pengguna](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md).

{{< warning >}}
Sampel pengguna yang telah dibuat di tutorial akan memiliki hak istimewa sebagai _administrative_ dan hanya untuk tujuan pembelajaran.
{{< /warning >}}

### Proksi baris perintah
Kamu dapat mengakses _Dashboard_ menggunakan kubectl _command-line_ _tool_ dengan menjalankan perintah berikut:

```
kubectl proxy
```

Kubectl akan membuat _Dashboard_ berjalan di http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/.

Antarmuka hanya dapat di akses dari mesin dimana perintah tersebut dijalankan. Lihat `kubectl proxy --help` untuk lebih lanjut.

{{< note >}}
Metode otentikasi _Kubeconfig_ tidak mendukung identitas diluar penyedia atau _x509 certificate-based authentication_.
{{< /note >}}

## Tampilan selamat datang

Ketika kamu mengakses _Dashboard_ di klaster yang kosong, kamu akan melihat halaman selamat datang. Halaman ini berisi tautan ke dokumen ini serta tombol untuk merilis aplikasi pertama kamu. Selain itu, kamu dapat melihat aplikasi sistem mana yang berjalan secara standar di [ruang nama](/docs/tasks/administer-cluster/namespaces/) `kube-system` dari klaster kamu, misalnya _Dashboard_ itu sendiri.

![Kubernetes Dashboard welcome page](/images/docs/ui-dashboard-zerostate.png)

## Merilis aplikasi yang sudah dikemas

_Dashboard_ memungkinkan kamu untuk membuat dan merilis aplikasi yang sudah dikemas sebagai _Deployment_ dan _Service_ opsional dengan _simple wizard_. Kamu secara manual dapat menentukan detail aplikasi, atau mengunggah berkas YAML atau JSON yang berisi konfigurasi aplikasi.

Tekan tombol **CREATE** di pojok kanan atas untuk memulai.

### Menentukan detail aplikasi

_Deploy wizard_ meminta kamu untuk memenuhi informasi sebagai berikut:

- **App name** (wajib): Nama dari aplikasi kamu. Sebuah [label](/docs/concepts/overview/working-with-objects/labels/) dengan nama akan ditambahkan ke _Deployment_ dan _Service_, jika ada, akan dirilis.

  Nama aplikasi harus unik di dalam [namespace](/docs/tasks/administer-cluster/namespaces/) Kubernetes yang kamu pilih. Nama harus dimulai dengan huruf kecil, dan diakhiri dengan huruf kecil atau angka, dan hanya berisi huruf kecil, angka dan strip (-). Serta terbatas hanya 24 karakter. _Leading_ dan _trailing spaces_ akan diabaikan.

- **Container image** (wajib): Tautan publik dari Docker [container image](/docs/concepts/containers/images/) di berbagai registri, atau sebuah _image_ private (biasanya dihosting di Google Container Registry atau Docker Hub). Spefikasi _container image_ harus diakhiri dengan titik dua.

- **Number of pods** (wajib): Berapa banyak _Pods_ yang kamu inginkan di aplikasi kamu ketika akan di rilis. Nilai harus _integer_ positive.

  Sebuah [Deployment](/docs/concepts/workloads/controllers/deployment/) akan  terbuat untuk memelihara jumlah _Pods_ di klaster kamu.

- **Service** (opsional): Untuk beberapa aplikasi (contoh _frontends_) kamu mungkin akan mengekspos sebuah [Service](/docs/concepts/services-networking/service/) ke alamat IP publik yang mungkin diluar klaster kamu. Untuk _Services_ eksternal, kamu mungkin perlu membuka lebih dari satu _ports_, untuk melakukanya. Kamu dapat menemukan [disini](/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/).

  _Services_ lain yang hanya dapat diakses dari dalam klaster kamu disebut _internal Services_.

  Terlepas dari jenis _Service_, jika kamu memilih untuk membuat sebuah _Service_ dan _container_ berjalan di _port(incoming)_, kamu perlu menentukan dua _ports_. _Service_ akan memetakan _port(incoming)_ ke target _port_ yang ada di _container_. _Service_ akan mengarahkan ke _Pods_. Protokol yang didukung adalah _TCP_ dan _UDP_. Nama _DNS_ internal untuk service ini akan sesuai dengan nama aplikasi yang telah kamu tentukan diatas.

Jika membutuhkan, kamu dapat membuka bagian **Advanced options** dimana kamu akan menemukan lebih banyak pengaturan:

- **Description**: Karakter yang kamu tulis disini akan menjadi [annotation](/docs/concepts/overview/working-with-objects/annotations/) ke _Deployment_ dan akan ditampilkan di detail aplikasi.

- **Labels**: Secara standar [labels](/docs/concepts/overview/working-with-objects/labels/) yang digunakan untuk aplikasi kamu adalah _name_ dan _version_. Namun, kamu dapat menentukan label lain yang dapat diterapkan ke _Deployment_, _Service_ (jika ada). dan _Pods_, seperti _release, environment, tier, partition, and release track._

  Contoh:

  ```conf
release=1.0
tier=frontend
environment=pod
track=stable
```

- **_Namespace_**: Kubernetes mendukung banyak virtual klaster yang didukung oleh klaster fisik yang sama. Klaster virtual ini disebut [ruang nama](/docs/tasks/administer-cluster/namespaces/). Mereka mengizinkan kamu untuk mempartisi sumber daya ke group yang diberi nama secara logis.

  _Dashboard_ menampilkan semua ruang nama dengan _dropdown list_, dan mengizinkan kamu untuk membuat ruang nama baru. Nama yang diizinkan untuk ruang nama terdiri dari huruf, angka, dan strip (-) dengan maksimal karakter 63 dan semuanya harus huruf kecil, tidak boleh ada huruf besar.
  Nama dari Ruang nama tidak boleh terdiri dari angka semua. Jika kamu membuat ruang nama dengan nama angka, contoh 10, maka pod yang akan di rilis di ruang nama tersebut akan di letakan di _default_ ruang nama.

  Jika pembuatan ruang nama berhasil, maka secara otomatis akan menggunakan ruang nama tersebut. Namun jika gagal, maka akan menggunakan ruang nama yang pertama kali dipilih.

- **_Image Pull Secret_**: Salah satu kasus dimana kamu menggunakan _Docker container image_ yang privat, maka kamu memerlukan [pull secret](/docs/concepts/configuration/secret/) kredensial.

  Dashboard menampilkan semua kredensial dengan _dropdown list_, dan mengizinkan kamu untuk membuat kredensial baru. Nama kredensial harus mengikuti aturan Nama DNS, sebagai contoh `new.image-pull.secret`. Isi dari kredensial harus dalam bentuk _base64-encoded_ dan dalam sebuah berkas [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod). Nama kredensial dapat terdiri dari maksimal 253 karakter.

  Jika pembuatan _image pull secret_ berhasil, maka otomatis akan menggunakan _image pull secret_ tersebut. Jika gagal, maka tidak ada kredensial yang dipilih.

- **_CPU requirement (cores)_** dan **_Memory requirement (MiB)_**: Kamu dapat menentukan [resource limits](/docs/tasks/configure-pod-container/limit-range/) minimal untuk sebuah _container_. Secara standar, _Pods_ akan berjalan dengan CPU dan memory yang tak terbatas.

- **_Run command_** dan **_Run command arguments_**: Secara standar, _container_ akan menggunakan [entrypoint command](/docs/user-guide/containers/#containers-and-commands) sebagai _Run command_. Kamu dapat menggunakan _Run command_ dan _Run command arguments_ untuk mengganti _run command_ standar _container_.

- **_Run as priveleged_**: Pengaturan ini untuk menentukan proses dalam [privileged containers](/docs/user-guide/pods/#privileged-mode-for-pod-containers) sesuai dengan prosess yang berjalan sebagai _root_ di dalam host. _Priveleged containers_ memiliki kemampuan seperti memanipulasi _network stack_ dan _accessing devices_. 

- **_Environment variables_**: Kubernetes mengekspos _Services_ melalui [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/). Kamu dapat membuat _environment variable_ atau meneruskan argumen ke perintah dengan nilai dari _environment variables_. _Environment Variables_ dapat digunakan di aplikasi untuk menemukan _Service_. Nilai yang merujuk ke variabel lain menggunakan sintaksis `$(VAR_NAME)`.

### Menggungah berkas YAML atau JSON

Kubernetes mendukung pengaturan deklaratif. Dengan cara ini, semua pengaturan disimpan dalam bentuk berkas YAML atau JSON dengan mengikuti aturan skema pada Kubernetes [[API](/docs/concepts/overview/kubernetes-api/).

Sebagai alternatif untuk menentukan detail aplikasi di _deploy wizard_, kamu dapat menentukan sendiri detail aplikasi kamu dalam berkas YAML atau JSON, dan mengunggah berkas tersebut melalui _Dashboard_.

## Menggunakan _Dashboard_
Bagian ini akan menjelaskan bagian yang ada pada Antarmuka _Dashboard_ Kubernetes; apa yang mereka sediakan dan bagaimana menggunakanya.

### _Navigation_

Ketika objek Kubernetes sudah didefinisikan di klaster, _Dashboard_ akan menampilkanya di tampilan awal. Secara standar hanya objek dari ruang nama _default_ yang ditampilkan di sini dan kamu dapat menggantinya dengan selektor ruang nama yang berada di menu navigasi.

_Dashboard_ menampilkan jenis objek Kubernetes dan mengelompokanya dalam kategori menu.

#### _Admin Overview_
Untuk klaster dan administrasi ruang nama, _Dashboard_ mencantumkan _Nodes_, _Namespaces_ dan _Presistent Volumes_ dan memiliki tampilan detail untuk mereka. Daftar _Node_ berisi _CPU_ dan metrik penggunaan memori yang dikumpulkan dari semua _Nodes_. Tampilan detail untuk metrik _node_ berisi, spesifikasi, status, _allocated resources, events_ dan _pods_ yang sedang berjalan di _node_ tersebut. 

#### _Workloads_
Menampilkan semua aplikasi yang sedang berjalan di ruang nama yang dipilih. Tampilan ini menampilkan aplikasi berdasarkan jenis _workload_ (contoh, _Deployments, Replica Sets, Stateful Sets,_ dll.) dan setiap jenis _workload_ memiliki tampilan sendiri-sendiri. Daftar ini merangkum informasi yang dapat ditindaklanjuti, seperti berapa banyak _pods_ yang siap untuk setiap _Replica Set_ atau penggunaan memori pada sebuah _Pod_.

Tampilan detail dari _workloads_ menampilkan status dan informasi spesifik serta hubungan antara objek. Contoh, _Pods_ yang diatur oleh _Replica Set_ atau _Repica Sets_ baru dan _Horizontal Pod Autoscalers_ untuk _Deployments_.

#### _Services_
Menampilkan sumber daya Kubernetes yang memungkinkan untuk mengekspos sebuah _services_ ke luar dan menemukanaya di dalam klaster. Karena alasan tersebut, tampilan dari _Service_ dan _Ingress_ menunjukan _Pods_ yang memiliki koneksi dengan mereka, _internal endpoints_ untuk koneksi klaster dan _external endpoints_ untuk pengguna dari luar.

#### _Storage_
Tampilan penyimpanan menampilkan daftar dari sumber daya _Persistent Volume Claim_ yang mana digunakan oleh aplikasi untuk menyimpan sebuah data.

#### _Config Maps_ dan _Secrets_
Menampilkan semua sumber daya Kubernetes yang digunakan untuk pengaturan aplikasi yang sedang berjalan di klaster. Pada tampilan ini kamu dapat mengedit dan mengelola _config objects_ dan menampilkan kredensial yang tersembunyi secara standar.

#### _Logs Viewer_
Daftar _Pod_ dan halaman detail tertaut dengan halaman penampil _log_. Kamu dapat menelusuri _logs_ dari _containers_ milik _Pod_ tunggal. 

![Logs viewer](/images/docs/ui-dashboard-logs-view.png)

{{% /capture %}}

{{% capture whatsnext %}}

For more information, see the
[Kubernetes Dashboard project page](https://github.com/kubernetes/dashboard).

{{% /capture %}}
