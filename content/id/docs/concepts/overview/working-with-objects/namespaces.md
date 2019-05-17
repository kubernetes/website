---
title: Namespace
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Kubernetes mendukung banyak kluster virtual di dalam satu kluster fisik. Kluster virtual tersebut disebut dengan *namespace*.

{{% /capture %}}


{{% capture body %}}

## Kapan menggunakan banyak Namespace

*Namespace* dibuat untuk digunakan di *environment* dengan banyak pengguna yang berada di dalam banyak tim ataupun proyek. Untuk sebuah kluster dengan beberapa pengguna saja, kamu tidak harus membuat ataupun memikirkan tentang *namespace*. Mulai gunakan *namespace* saat kamu membutuhkan fitur dari *namespace* itu sendiri.

*Namespace* menyediakan ruang untuk nama objek. Nama dari *resource* atau objek harus berbeda di dalam sebuah *namespace*, tetapi boleh sama jika berbeda *namespace*. *Namespace* tidak bisa dibuat di dalam *namespace* lain dan setiap *resource* atau objek Kubernetes hanya dapat berada di dalam satu *namespace*.

*Namespace* merupakan cara yang digunakan untuk memisahkan *resource* kluster untuk beberapa pengguna (dengan [*resource quota*](/docs/concepts/policy/resource-quotas/)).

Dalam versi Kubernetes yang akan datang, objek di dalam satu *namespace* akan mempunyai *access control policies* yang sama secara *default*.

Tidak perlu menggunakan banyak *namespace* hanya untuk memisahkan sedikit perbedaan pada *resource*, seperti perbedaan versi dari perangkat lunak yang sama: gunakan [label](/docs/user-guide/labels) untuk membedakan *resource* di dalam *namespace* yang sama.

## Bekerja dengan Namespace

Pembuatan dan penghapusan *namespace* dijelaskan di [dokumentasi panduan admin untuk *namespace*](/docs/admin/namespaces).


### Melihat namespace

Kamu dapat melihat daftar *namespace* di dalam kluster menggunakan:

```shell
kubectl get namespace
```
```
NAME          STATUS    AGE
default       Active    1d
kube-system   Active    1d
kube-public   Active    1d
```

Kubernetes berjalan dengan tiga *namespace* awal:

* `default`, *namespace default* untuk objek yang dibuat tanpa mencantumkan *namespace* pada spesifikasinya.
* `kube-system`, *namespace* yang digunakan untuk objek yang dibuat oleh sistem Kubernetes.
* `kube-public`, *namespace* ini dibuat secara otomatis dan dapat diakses oleh semua pengguna (termasuk yang tidak diautentikasi). *Namespace* ini disediakan untuk penggunaan kluster, jika beberapa *resouce* harus terlihat dan dapat dibaca secara publik di seluruh kluster. Aspek publik dari *namespace* ini hanya sebuah konvensi, bukan persyaratan.


### Mengkonfigurasi namespace untuk request

Untuk mengkonfigurasi sementara *request* untuk menggunakan *namespace* tertentu, gunakan `--namespace` *flag*.

Sebagai contoh:

```shell
kubectl --namespace=<insert-namespace-name-here> run nginx --image=nginx
kubectl --namespace=<insert-namespace-name-here> get pods
```

### Mengkonfigurasi preferensi namespace 

Kamu dapat menyimpan konfigurasi *namespace* untuk semua perintah `kubectl` dengan perintah:

```shell
kubectl config set-context $(kubectl config current-context) --namespace=<insert-namespace-name-here>
# Cek namespace
kubectl config view | grep namespace:
```

## Namespace dan DNS

Saat kamu membuat sebuah [Service](/docs/user-guide/services), Kubernetes membuat [Entri DNS](/docs/concepts/services-networking/dns-pod-service/) untuk *service* tersebut. Entri *DNS* ini berformat `<service-name>.<namespace-name>.svc.cluster.local`, yang berarti jika sebuah kontainer hanya menggunakan `<service-name>`, kontainer tersebut akan berkomunikasi dengan *service* yang berada di dalam satu *namespace*. Ini berguna untuk menggunakan konfigurasi yang sama di beberapa *namespace* seperti *Development*, *Staging*, dan *Production*. Jika kamu ingin berkomunikasi antar *namespace*, kamu harus menggunakan seluruh *fully qualified domain name (FQDN)*.


## Tidak semua objek di dalam Namespace

Kebanyakan *resource* di Kubernetes (contohnya *pod*, *service*, *replication controller*, dan yang lain) ada di dalam *namespace*. Namun *resource namespace* sendiri tidak berada di dalam *namespace*. Dan *low-level resource* seperti [node](/docs/admin/node) dan *persistentVolume* tidak berada di *namespace* manapun.

Untuk melihat *resource* di dalam kubernetes yang berada di dalam *namespace* ataupun tidak:

```shell
# Di dalam namespace
kubectl api-resources --namespaced=true

# Tidak di dalam namespace
kubectl api-resources --namespaced=false
```

{{% /capture %}}
