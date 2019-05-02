---
title: Memahami Konsep Objek-Objek yang Ada pada Kubernetes
content_template: templates/concept
weight: 10
card: 
  name: concepts
  weight: 40
---

{{% capture overview %}}
Laman ini menjelaskan bagaimana objek-objek Kubernetes direpresentasikan di dalam API Kubernetes, 
dan bagaimana kamu dapat merepresentasikannya di dalam format `.yaml`.
{{% /capture %}}

{{% capture body %}}
## Memahami Konsep Objek-Objek yang Ada pada Kubernetes

*Objek-Objek Kubernetes* adalah entitas `persisten` di dalam sistem Kubernetes. 
Kubernetes menggunakan entitas ini untuk merepresentasikan `state` yang ada pada 
kluster kamu. Secara spesifik, hal itu dapat dideskripsikan sebagai:

* Aplikasi-aplikasi `containerized` apa sajakah yang sedang dijalankan (serta pada `node` apa aplikasi tersebut dijalankan)
* `Resource` yang tersedia untuk aplikasi tersebut
* `Policy` yang mengatur bagaimana aplikasi tersebut dijalankan, misalnya `restart`, `upgrade`, dan `fault-tolerance`.

Objek Kubernetes merupakan sebuah `"record of intent"`--yang mana sekali kamu membuat suatu objek, 
sistem Kubernetes akan bekerja secara konsisten untuk menjamin 
bahwa objek tersebut akan selalu ada. Dengan membuat sebuah objek, secara tak langsung kamu 
memberikan informasi pada sistem Kubernetes mengenai perilaku apakah yang kamu inginkan pada `workload` kluster yang kamu miliki;
dengan kata lain ini merupakan definisi `state` kluster yang kamu inginkan.

Untuk menggunakan objek-objek Kubernetes--baik membuat, mengubah, atau menghapus objek-objek tersebut--kamu 
harus menggunakan [API Kubernetes](/docs/concepts/overview/kubernetes-api/). 
Ketika kamu menggunakan perintah `kubectl`, perintah ini akan melakukan `API call` untuk perintah 
yang kamu berikan. Kamu juga dapat menggunakan API Kubernetes secara langsung pada program yang kamu miliki 
menggunakan salah satu [`library` klien](/docs/reference/using-api/client-libraries/) yang disediakan.

### `Spec` dan Status Objek

Setiap objek Kubernetes memiliki `field` berantai yang mengatur konfigurasi sebuah `object`:
`spec` dan `status`. `Spec`, merupakan `field` yang harus kamu sediakan, `field` ini mendeskripsikan 
`state` yang kamu inginkan untuk objek tersebut--karakteristik dari objek yang kamu miliki. 
Statue mendeskripsikan `state` yang sebenarnya dari sebuah objek, dan hal ini disediakan dan selalu diubah oleh 
sistem Kubernetes. Setiap saat, `Control Plane` Kubernetes selalu memantau apakah `state` aktual sudah sesuai dengan 
`state` yang diinginkan.

Sebagai contoh, `Deployment` merupakan sebuah objek yang merepresentasikan sebuah aplikasi yang dijalankan di kluster kamu. 
Ketika kamu membuat sebuah `Deployment`, kamu bisa saja memberikan `spec` bagi `Deployment` untuk memberikan spesifikasi 
berapa banyak `replica` yang kamu inginkan. Sistem Kubernetes kemudian akan membaca konfigurasi yang kamu berikan 
dan mengaktifkan tiga buah `instance` untuk aplikasi yang kamu inginkan--mengubah status yang ada saat ini agar sesuai dengan apa yang kamu inginkan. 
Jika terjadi kegagalan dalam `instance` yang dibuat, sistem Kubernetes akan memberikan respons bahwa terdapat perbedaan antara `spec` dan status serta 
melakukan penyesuaian dengan cara memberikan `instance` pengganti.

Informasi lebih lanjut mengenai `spec` objek, `status`, dan `metadata` dapat kamu baca di [`Conventions` API Kubernetes](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

### Mendeskripsikan Objek Kubernetes

Ketika kamu membuat sebuah objek di Kubernetes, kamu harus menyediakan `spec` objek yang 
mendeskripsikan `state` yang diinginkan, serta beberapa informasi tentang objek tersebut (seperti nama). 
Ketika kamu menggunakan API Kubernetes untuk membuat objek tersebut (baik secara langsung atau menggunakan perintah 
`kubectl`), `request` API yang dibuat harus mencakup informasi seperti `request body` dalam format JSON. 
Apabila kamu memberikan **informasi dalam bentuk `.yaml` ketika menggunakan perintah `kubectl`** maka `kubectl` 
akan mengubah informasi yang kamu berikan ke dalam format JSON ketika melakukan `request` API.

Berikut merupakan contoh `file` `.yaml` yang menunjukkan `field` dan `spec` objek untuk `Deployment`:
file that shows the required fields and object spec for a Kubernetes Deployment:

{{< codenew file="application/deployment.yaml" >}}

Salah satu cara untuk membuat `Deployment` menggunakan `file` `.yaml` 
seperti yang dijabarkan diatas dalah dengan menggunakan perintah 
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 
pada `command-line interface` `kubectl` kamu menerapkan `file` `.yaml` sebagai sebuah argumen. 
Berikut merupakan contoh penggunaannya:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml --record
```

Keluaran yang digunakan kurang lebih akan ditampilkan sebagai berikut:

```shell
deployment.apps/nginx-deployment created
```

### `Field-Field` yang dibutuhkan

Pada `file` `.yaml` untuk objek Kubernetes yang ingin kamu buat, kamu perlu 
menyediakan `value` untuk `field-field` berikut:

* `apiVersion` - Version API Kubernetes mana yang kamu gunakan untuk membuat objek tersebut
* `kind` - Objek apakah yang ingin kamu buat
* `metadata` - Data yang dapat kamu gunakan untuk melakukan identifikasi objek termasuk `name` dalam betuk string, `UID`, dan `namespace` yang bersifat opsional

Kamu juga harus menyediakan `field` `spec`. Format spesifik dari `spec` sebuah objek akan berbeda bergantung 
pada objek apakah yang ingin kamu buat, serta mengandung `field` berantai yang spesifik bagi objek tersebut. 
[Referensi API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) memberikan penjelasan 
lebih lanjut mengenai format `spec` untuk semua objek Kubernetes yang dapat kamu buat. Misalnya saja format `spec` 
untuk `Pod` dapat kamu temukan [di sini](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core),
dan format `spec` untuk `Deployment` dapat ditemukan 
[di sini](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).

{{% /capture %}}

{{% capture whatsnext %}}
* Pelajari lebih lanjut mengenai dasar-dasar penting bagi objek Kubernetes, seperti [Pod](/docs/concepts/workloads/pods/pod-overview/).
{{% /capture %}}


