---
title: Variabel Environment Container
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Laman ini menjelaskan berbagai *resource* yang tersedia di dalam Container pada suatu *environment*.

{{% /capture %}}


{{% capture body %}}

## *Environment* Container

*Environment* Container pada Kubernetes menyediakan beberapa *resource* penting yang tersedia di dalam Container:

* Sebuah *Filesystem*, yang merupakan kombinasi antara [image](/docs/concepts/containers/images/) dan satu atau banyak [*volumes*](/docs/concepts/storage/volumes/).
* Informasi tentang Container tersebut.
* Informasi tentang objek-objek lain di dalam klaster.

### Informasi tentang Container

*Hostname* sebuah Container merupakan nama dari Pod dimana Container dijalankan.
Informasi ini tersedia melalui perintah `hostname` atau panggilan (*function call*)
[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html) pada `libc`.

Nama Pod dan *namespace* tersedia sebagai variabel *environment* melalui [API *downward*](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

Variabel *environment* yang ditulis pengguna dalam Pod *definition* juga tersedia di dalam Container,
seperti halnya variabel *environment* yang ditentukan secara statis di dalam *image* Docker.

### Informasi tentang Klaster

Daftar semua *Service* yang dijalankan ketika suatu Container dibuat, tersedia di dalam Container tersebut sebagai variabel *environment*.
Variabel-variabel *environment* tersebut sesuai dengan sintaksis *links* dari Docker.

Untuk suatu *Service* bernama *foo* yang terkait dengan Container bernama *bar*,
variabel-variabel di bawah ini tersedia:

```shell
FOO_SERVICE_HOST=<host dimana service dijalankan>
FOO_SERVICE_PORT=<port dimana service dijalankan>
```

Semua *Service* memiliki alamat-alamat IP yang bisa didapatkan di dalam Container melalui DNS,
jika [*addon* DNS](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/) diaktifkan. 

{{% /capture %}}

{{% capture whatsnext %}}

* Pelajari lebih lanjut tentang [berbagai *hook* pada *lifecycle* Container](/docs/concepts/containers/container-lifecycle-hooks/).
* Dapatkan pengalaman praktis soal
  [memberikan *handler* untuk *event* dari *lifecycle* Container](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

{{% /capture %}}
