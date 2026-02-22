---
title: Runtime Class
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

Laman ini menjelaskan tentang _resource_ RuntimeClass dan proses pemilihan _runtime_.

{{< warning >}}
RuntimeClass memiliki _breaking change_ untuk pembaruan ke beta pada v1.14. Jika kamu menggunakan
RuntimeClass sebelum v1.14, lihat [Memperbarui RuntimeClass dari Alpha ke Beta](#memperbarui-runtimeclass-dari-alpha-ke-beta).
{{< /warning >}}




<!-- body -->

## `Runtime Class`

RuntimeClass merupakan sebuah fitur untuk memilih konfigurasi _runtime_ kontainer. Konfigurasi
tersebut digunakan untuk menjalankan kontainer-kontainer milik suatu Pod.

### Persiapan

Pastikan gerbang fitur (_feature gate_) `RuntimeClass` sudah aktif (secara _default_ sudah aktif).
Lihat [Gerbang Fitur](/docs/reference/command-line-tools-reference/feature-gates/) untuk lebih
jelasnya soal pengaktifan gerbang fitur.
Gerbang fitur RuntimeClass ini harus aktif pada semua apiserver dan kubelet.

1. Lakukan konfigurasi pada implementasi CRI untuk setiap _node_ (tergantung _runtime_ yang dipilih)
2. Buat _resource_ RuntimeClass yang terkait

#### 1. Lakukan konfigurasi pada implementasi CRI untuk setiap _node_

Pilihan konfigurasi yang tersedia melalui RuntimeClass tergantung pada implementasi
_Container Runtime Interface_ (CRI). Lihat bagian ([di bawah ini](#konfigurasi-cri))
soal bagaimana melakukan konfigurasi untuk implementasi CRI yang kamu miliki.

{{< note >}}
Untuk saat ini, RuntimeClass berasumsi bahwa semua _node_ di dalam klaster punya
konfigurasi yang sama (homogen). Jika ada _node_ yang punya konfigurasi berbeda dari
yang lain (heterogen), maka perbedaan ini harus diatur secara independen di luar RuntimeClass
melalui fitur _scheduling_ (lihat [Menempatkan Pod pada Node](/id/docs/concepts/scheduling-eviction/assign-pod-node/)).
{{< /note >}}

Seluruh konfigurasi memiliki nama `handler` yang terkait, dijadikan referensi oleh RuntimeClass.
Nama _handler_ harus berupa valid label 1123 DNS (alfanumerik + karakter `-`).

#### 2. Buat _resource_ `RuntimeClass` yang terkait

Masing-masing konfigurasi pada langkah no.1 punya nama `handler` yang merepresentasikan
konfigurasi-konfigurasi tersebut. Untuk masing-masing `handler`, buatlah sebuah objek RuntimeClass terkait.

_Resource_ RuntimeClass saat ini hanya memiliki 2 _field_ yang penting: nama RuntimeClass tersebut
(`metadata.name`) dan _handler_ (`handler`). Definisi objek tersebut terlihat seperti ini:

```yaml
apiVersion: node.k8s.io/v1beta1  # RuntimeClass didefinisikan pada grup API node.k8s.io
kind: RuntimeClass
metadata:
  name: myclass  # Nama dari RuntimeClass yang nantinya akan dijadikan referensi
  # RuntimeClass merupakan resource tanpa namespace
handler: myconfiguration  # Nama dari konfigurasi CRI terkait
```

{{< note >}}
Sangat disarankan untuk hanya memperbolehkan admin klaster melakukan operasi
_write_ pada RuntimeClass. Biasanya ini sudah jadi _default_. Lihat [Ikhtisar
Autorisasi](/docs/reference/access-authn-authz/authorization/) untuk penjelasan lebih jauh.
{{< /note >}}

### Penggunaan

Ketika RuntimeClass sudah dikonfigurasi pada klaster, penggunaannya sangatlah mudah.
Kamu bisa tentukan `runtimeClassName` di dalam `spec` sebuah Pod, sebagai contoh:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

Kubelet akan mendapat instruksi untuk menggunakan RuntimeClass dengan nama yang sudah ditentukan tersebut
untuk menjalankan Pod ini. Jika RuntimeClass dengan nama tersebut tidak ditemukan, atau CRI tidak dapat
menjalankan _handler_ yang terkait, maka Pod akan memasuki [tahap](/id/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) `Failed`.
Lihat [_event_](/docs/tasks/debug-application-cluster/debug-application-introspection/) untuk mengetahui pesan error yang terkait.

Jika tidak ada `runtimeClassName` yang ditentukan di dalam Pod, maka RuntimeHandler yang _default_ akan digunakan.
Untuk kasus ini, perilaku klaster akan seperti saat fitur RuntimeClass dinonaktifkan.

### Konfigurasi CRI

Lihat [instalasi CRI](/docs/setup/cri/) untuk lebih detail mengenai pengaturan _runtime_ CRI.

#### dockershim

_Built-in_ dockershim CRI yang dimiliki Kubernetes tidak mendukung _handler runtime_.

#### [containerd](https://containerd.io/)

_Handler runtime_ diatur melalui konfigurasi containerd pada `/etc/containerd/config.toml`.
_Handler_ yang valid dapat dikonfigurasi pada bagian _runtime_:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

Lihat dokumentasi konfigurasi containerd untuk lebih detail:
https://github.com/containerd/containerd/blob/main/docs/cri/config.md

#### [cri-o](https://cri-o.io/)

_Handler runtime_ dapat diatur menggunakan konfigurasi cri-o pada `/etc/crio/crio.conf`.
_Handler_ yang valid dapat dikonfigurasi pada [tabel crio.runtime](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

Lihat dokumentasi konfigurasi cri-o untuk lebih detail:
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go


### Memperbarui RuntimeClass dari Alpha ke Beta

Fitur Beta pada RuntimeClass memiliki perubahan sebagai berikut:

- Grup API _resource_ `node.k8s.io` dan `runtimeclasses.node.k8s.io` telah dimigrasi ke suatu
  API _built-in_ dari CustomResourceDefinition.
- Atribut `spec` telah disederhakan pada definisi RuntimeClass (tidak ada lagi yang namanya
  RuntimeClassSpec).
- _Field_ `runtimeHandler` telah berubah nama menjadi `handler`.
- _Field_ `handler` sekarang bersifat wajib untuk semua versi API. Artinya, _field_ `runtimeHandler`
  pada API Alpha juga bersifat wajib.
- _Field_ `handler` haruslah berupa label DNS valid ([RFC 1123](https://tools.ietf.org/html/rfc1123)),
  yang artinya tidak bisa berisi karakter `.` (pada semua versi). _Handler_ valid harus sesuai dengan
  _regular expression_ ini: `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`.

**Tindakan yang diperlukan:** Tindakan-tindaka berikut ini diperlukan untuk melakukan
pembaruan fitur RuntimeClass dari versi alpha ke versi beta:

- _Resource_ RuntimeClass harus dibuat ulang **setelah** diperbarui ke v.1.14, dan
  CRD `runtimeclasses.node.k8s.io` harus dihapus secara manual:
  ```
  kubectl delete customresourcedefinitions.apiextensions.k8s.io runtimeclasses.node.k8s.io
  ```
- Fitur Alpha pada RuntimeClass akan menjadi tidak valid, jika `runtimeHandler` tidak ditentukan atau
  kosong atau menggunakan karakter `.` pada _handler_. Ini harus dimigrasi ke _handler_ dengan
  konfigurasi yang valid (lihat petunjuk di atas).


