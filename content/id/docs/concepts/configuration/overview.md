---
title: Konfigurasi dan Penerapan Konsep
content_type: concept
weight: 10
---

<!-- overview -->
Dokumen ini menyoroti dan memperkuat pemahaman konsep konfigurasi yang dikenalkan di seluruh panduan pengguna, dokumentasi Memulai, dan contoh-contoh.

Dokumentasi ini terbuka. Jika Anda menemukan sesuatu yang tidak ada dalam daftar ini tetapi mungkin bermanfaat bagi orang lain, jangan ragu untuk mengajukan issue atau mengirimkan PR.


<!-- body -->

## Tip konfigurasi secara umum


- Saat mendefinisikan konfigurasi, tentukan versi API stabil terbaru.

- File konfigurasi harus disimpan dalam version control sebelum di push ke cluster. Ini memungkinkan Anda untuk dengan cepat mengembalikan perubahan konfigurasi jika perlu. Ini juga membantu penciptaan dan restorasi cluster.

- Tulis file konfigurasi Anda menggunakan YAML tidak dengan JSON. Meskipun format ini dapat digunakan secara bergantian di hampir semua skenario, YAML cenderung lebih ramah pengguna.

- Kelompokkan objek terkait ke dalam satu file yang memungkinkan. Satu file seringkali lebih mudah dikelola daripada beberapa file. Lihat pada [guestbook-all-in-one.yaml](https://github.com/kubernetes/examples/tree/master/guestbook/all-in-one/guestbook-all-in-one.yaml) sebagai contoh file sintaks ini.

- Perhatikan juga bahwa banyak perintah `kubectl` dapat dipanggil pada direktori. Misalnya, Anda dapat memanggil `kubectl apply` pada direktori file konfigurasi.

- Jangan tentukan nilai default yang tidak perlu: sederhana, konfigurasi minimal akan membuat kesalahan lebih kecil.

- Masukkan deskripsi objek dalam anotasi, untuk memungkinkan introspeksi yang lebih baik.


## "Naked" Pods vs ReplicaSets, Deployments, and Jobs

- Jangan gunakan Pods naked (artinya, Pods tidak terikat dengan a [ReplicaSet](/id/docs/concepts/workloads/controllers/replicaset/) a [Deployment](/id/docs/concepts/workloads/controllers/deployment/)) jika kamu bisa menghindarinya. Pod naked tidak akan dijadwal ulang jika terjadi kegagalan pada node.

  Deployment, yang keduanya menciptakan ReplicaSet untuk memastikan bahwa jumlah Pod yang diinginkan selalu tersedia, dan menentukan strategi untuk mengganti Pods (seperti [RollingUpdate](/id/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment)), hampir selalu lebih disukai daripada membuat Pods secara langsung, kecuali untuk beberapa yang eksplisit [`restartPolicy: Never`](/id/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) banyak skenario . A [Job](/id/docs/concepts/workloads/controllers/job/) mungkin juga sesuai.


## Services

- Buat  [Service](/id/docs/concepts/services-networking/service/) sebelum workloads backend terkait (Penyebaran atau ReplicaSets), dan sebelum workloads apa pun yang perlu mengaksesnya. Ketika Kubernetes memulai sebuah container, ia menyediakan environment variabel yang menunjuk ke semua Layanan yang berjalan ketika container itu dimulai. Misalnya, jika Layanan bernama `foo` ada, semua container akan mendapatkan variabel berikut di environment awalnya:

  ```shell
  FOO_SERVICE_HOST=<the host the Service is running on>
  FOO_SERVICE_PORT=<the port the Service is running on>
  ```

  *Ini menunjukan persyaratan pemesanan * - `Service` apa pun yang ingin diakses oleh `Pod` harus dibuat sebelum `Pod` itu sendiri, atau environment variabel tidak akan diisi. DNS tidak memiliki batasan ini.

- Opsional (meskipun sangat disarankan) [cluster add-on](/id/docs/concepts/cluster-administration/addons/) adalah server DNS.
Server DNS melihat API Kubernetes untuk `Service` baru dan membuat satu set catatan DNS untuk masing-masing. Jika DNS telah diaktifkan di seluruh cluster maka semua `Pods` harus dapat melakukan resolusi nama`Service` secara otomatis.

- Jangan tentukan `hostPort` untuk Pod kecuali jika benar-benar diperlukan. Ketika Anda bind Pod ke `hostPort`, hal itu membatasi jumlah tempat Pod dapat dijadwalkan, karena setiap kombinasi <`hostIP`, `hostPort`, `protokol`> harus unik. Jika Anda tidak menentukan `hostIP` dan `protokol` secara eksplisit, Kubernetes akan menggunakan `0.0.0.0` sebagai `hostIP` dan `TCP` sebagai default `protokol`.

  Jika kamu hanya perlu akses ke port untuk keperluan debugging, Anda bisa menggunakan [apiserver proxy](/id/docs/tasks/access-application-cluster/access-cluster/#manually-constructing-apiserver-proxy-urls) atau [`kubectl port-forward`](/id/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).

  Jika Anda secara eksplisit perlu mengekspos port Pod pada node, pertimbangkan untuk menggunakan [NodePort](/id/docs/concepts/services-networking/service/#nodeport) Service sebelum beralih ke `hostPort`.

- Hindari menggunakan `hostNetwork`, untuk alasan yang sama seperti `hostPort`.

- Gunakan [headless Services](/id/docs/concepts/services-networking/service/#headless-
services) (yang memiliki `ClusterIP` dari `None`) untuk Service discovery yang mudah ketika Anda tidak membutuhkan `kube-proxy` load balancing.

## Menggunakan label

- Deklarasi dan gunakan [labels] (/id/docs/concepts/overview/working-with-objects/labels/) untuk identifikasi __semantic attributes__  aplikasi atau Deployment kamu, seperti `{ app: myapp, tier: frontend, phase: test, deployment: v3 }`. Kamu dapat menggunakan label ini untuk memilih Pod yang sesuai untuk sumber daya lainnya; misalnya, Service yang memilih semua `tier: frontend` Pods, atau semua komponen `phase: test` dari `app: myapp`. Lihat [guestbook](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/) aplikasi untuk contoh-contoh pendekatan ini.


Service dapat dibuat untuk menjangkau beberapa Penyebaran dengan menghilangkan label khusus rilis dari pemilihnya. [Deployments](/id/docs/concepts/workloads/controllers/deployment/) membuatnya mudah untuk memperbarui Service yang sedang berjalan tanpa downtime.

Keadaan objek yang diinginkan dideskripsikan oleh Deployment, dan jika perubahan terhadap spesifikasi tersebut adalah _applied_, Deployment controller mengubah keadaan aktual ke keadaan yang diinginkan pada tingkat yang terkontrol.

- Kamu dapat memanipulasi label untuk debugging. Karena Kubernetes controller (seperti ReplicaSet) dan Service Match dengan Pods menggunakan label pemilih, menghapus label yang relevan dari Pod akan menghentikannya dari dianggap oleh Controller atau dari lalu lintas yang dilayani oleh Service. Jika Anda menghapus label dari Pod yang ada, Controller akan membuat Pod baru untuk menggantikannya. Ini adalah cara yang berguna untuk men-debug Pod yang sebelumnya "live" di Environment "quarantine". Untuk menghapus atau menambahkan label secara interaktif, gunakan [`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands#label).

## Container Images

Ini [imagePullPolicy](/id/docs/concepts/containers/images/#updating-images) dan tag dari image mempengaruhi ketika [kubelet](/docs/admin/kubelet/) mencoba menarik image yang ditentukan

- `imagePullPolicy: IfNotPresent`: image ditarik hanya jika belum ada secara lokal.

- `imagePullPolicy: Always`: Image ditarik setiap kali pod dimulai.

- `imagePullPolicy` dihilangkan dan tag imagenya adalah `:latest` atau dihilangkan:`always` diterapkan.

- `imagePullPolicy` dihilangkan dan tag image ada tetapi tidak `:latest`:` IfNotPresent` diterapkan.

- `imagePullPolicy: Never`: image diasumsikan ada secara lokal. Tidak ada upaya yang dilakukan untuk menarik image.

{{< note >}}
Untuk memastikan container selalu menggunakan versi image yang sama, Anda bisa menentukannya [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier), untuk contoh `sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`. digest mengidentifikasi secara unik versi image tertentu, sehingga tidak pernah diperbarui oleh Kubernetes kecuali Anda mengubah nilai digest.
{{< /note >}}

{{< note >}}
Anda harus menghindari penggunaan tag `: latest` saat menempatkan container dalam produksi karena lebih sulit untuk melacak versi image mana yang sedang berjalan dan lebih sulit untuk memutar kembali dengan benar.
{{< /note >}}

{{< note >}}
Semantik caching dari penyedia gambar yang mendasarinya membuat bahkan `imagePullPolicy: Always` efisien. Dengan Docker, misalnya, jika image sudah ada, upaya pull cepat karena semua lapisan image di-cache dan tidak perlu mengunduh image.
{{< /note >}}


## Menggunakan kubectl


- Gunakan `kubectl apply -f <directory>`. Ini mencari konfigurasi Kubernetes di semua file `.yaml`, `.yml`, dan `.json` di `<directory>` dan meneruskannya ke `apply`.

- Gunakan label selector untuk operasi `get` dan `delete` alih-alih nama objek tertentu. Lihat bagian di [label selectors](/id/docs/concepts/overview/working-with-objects/labels/#label-selectors) dan [using labels effectively](/id/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively).

- Gunakan `kubectl run` dan `kubectl expose` untuk dengan cepat membuat Deployment dan Service single-container. Lihat [Use a Service to Access an Application in a Cluster](/docs/tasks/access-application-cluster/service-access-application-cluster/) untuk Contoh.




