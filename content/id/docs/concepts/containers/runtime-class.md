---
title: Runtime Class
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

Laman ini menjelaskan tentang *resource* RuntimeClass dan proses pemilihan *runtime*.

{{< warning >}}
RuntimeClass memiliki *breaking change* untuk pembaruan ke beta pada v1.14. Jika kamu menggunakan
RuntimeClass sebelum v1.14, lihat [Memperbarui RuntimeClass dari Alpha ke Beta](#memperbarui-runtimeclass-dari-alpha-ke-beta).
{{< /warning >}}

{{% /capture %}}


{{% capture body %}}

## `Runtime Class`

RuntimeClass merupakan sebuah fitur untuk memilih konfigurasi *runtime* kontainer. Konfigurasi
tersebut digunakan untuk menjalankan kontainer-kontainer milik suatu Pod.

### Persiapan

Pastikan gerbang fitur (*feature gate*) `RuntimeClass` sudah aktif (secara *default* sudah aktif).
Lihat [Gerbang Fitur](/docs/reference/command-line-tools-reference/feature-gates/) untuk lebih
jelasnya soal pengaktifan gerbang fitur.
Gerbang fitur RuntimeClass ini harus aktif pada semua apiserver dan kubelet.

1. Lakukan konfigurasi pada implementasi CRI untuk setiap *node* (tergantung *runtime* yang dipilih)
2. Buat *resource* RuntimeClass yang terkait

#### 1. Lakukan konfigurasi pada implementasi CRI untuk setiap *node*

Pilihan konfigurasi yang tersedia melalui RuntimeClass tergantung pada implementasi
*Container Runtime Interface* (CRI). Lihat bagian ([di bawah ini](#konfigurasi-cri))
soal bagaimana melakukan konfigurasi untuk implementasi CRI yang kamu miliki.

{{< note >}}
Untuk saat ini, RuntimeClass berasumsi bahwa semua *node* di dalam kluster punya
konfigurasi yang sama (homogen). Jika ada *node* yang punya konfigurasi berbeda dari
yang lain (heterogen), maka perbedaan ini harus diatur secara independen di luar RuntimeClass
melalui fitur *scheduling* (lihat [Menempatkan Pod pada Node](/docs/concepts/configuration/assign-pod-node/)).
{{< /note >}}

Seluruh konfigurasi memiliki nama `handler` yang terkait, dijadikan referensi oleh RuntimeClass.
Nama *handler* harus berupa valid label 1123 DNS (alfanumerik + karakter `-`).

#### 2. Buat *resource* `RuntimeClass` yang terkait

Masing-masing konfigurasi pada langkah no.1 punya nama `handler` yang merepresentasikan 
konfigurasi-konfigurasi tersebut. Untuk masing-masing `handler`, buatlah sebuah objek RuntimeClass terkait.

*Resource* RuntimeClass saat ini hanya memiliki 2 *field* yang penting: nama RuntimeClass tersebut
(`metadata.name`) dan *handler* (`handler`). Definisi objek tersebut terlihat seperti ini:

```yaml
apiVersion: node.k8s.io/v1beta1  # RuntimeClass didefinisikan pada grup API node.k8s.io
kind: RuntimeClass
metadata:
  name: myclass  # Nama dari RuntimeClass yang nantinya akan dijadikan referensi
  # RuntimeClass merupakan resource tanpa namespace
handler: myconfiguration  # Nama dari konfigurasi CRI terkait
```

{{< note >}}
Sangat disarankan untuk hanya memperbolehkan admin kluster melakukan operasi 
*write* pada RuntimeClass. Biasanya ini sudah jadi *default*. Lihat [Ikhtisar 
Autorisasi](/docs/reference/access-authn-authz/authorization/) untuk penjelasan lebih jauh.
{{< /note >}}

### Penggunaan

Ketika RuntimeClass sudah dikonfigurasi pada kluster, penggunaannya sangatlah mudah.
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
menjalankan *handler* yang terkait, maka Pod akan memasuki [tahap]((/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)) `Failed`.
Lihat [*event*](/docs/tasks/debug-application-cluster/debug-application-introspection/) untuk mengetahui pesan error yang terkait.

Jika tidak ada `runtimeClassName` yang ditentukan di dalam Pod, maka RuntimeHandler yang *default* akan digunakan.
Untuk kasus ini, perilaku kluster akan seperti saat fitur RuntimeClass dinonaktifkan.

### Konfigurasi CRI

Lihat [instalasi CRI](/docs/setup/cri/) untuk lebih detail mengenai pengaturan *runtime* CRI.

#### dockershim

*Built-in* dockershim CRI yang dimiliki Kubernetes tidak mendukung *handler runtime*.

#### [containerd](https://containerd.io/)

*Handler runtime* diatur melalui konfigurasi containerd pada `/etc/containerd/config.toml`.
*Handler* yang valid dapat dikonfigurasi pada bagian *runtime*:

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

Lihat dokumentasi konfigurasi containerd untuk lebih detail:
https://github.com/containerd/cri/blob/master/docs/config.md

#### [cri-o](https://cri-o.io/)

*Handler runtime* dapat diatur menggunakan konfigurasi cri-o pada `/etc/crio/crio.conf`.
*Handler* yang valid dapat dikonfigurasi pada [tabel crio.runtime](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

Lihat dokumentasi konfigurasi cri-o untuk lebih detail:
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go


### Memperbarui RuntimeClass dari Alpha ke Beta

Fitur Beta pada RuntimeClass memiliki perubahan sebagai berikut:

- Grup API *resource* `node.k8s.io` dan `runtimeclasses.node.k8s.io` telah dimigrasi ke suatu
  API *built-in* dari CustomResourceDefinition.
- Atribut `spec` telah disederhakan pada definisi RuntimeClass (tidak ada lagi yang namanya
  RuntimeClassSpec).
- *Field* `runtimeHandler` telah berubah nama menjadi `handler`.
- *Field* `handler` sekarang bersifat wajib untuk semua versi API. Artinya, *field* `runtimeHandler`
  pada API Alpha juga bersifat wajib.
- *Field* `handler` haruslah berupa label DNS valid ([RFC 1123](https://tools.ietf.org/html/rfc1123)),
  yang artinya tidak bisa berisi karakter `.` (pada semua versi). *Handler* valid harus sesuai dengan
  *regular expression* ini: `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`.

**Tindakan yang diperlukan:** Tindakan-tindaka berikut ini diperlukan untuk melakukan
pembaruan fitur RuntimeClass dari versi alpha ke versi beta:

- *Resource* RuntimeClass harus dibuat ulang **setelah** diperbarui ke v.1.14, dan
  CRD `runtimeclasses.node.k8s.io` harus dihapus secara manual:
  ```
  kubectl delete customresourcedefinitions.apiextensions.k8s.io runtimeclasses.node.k8s.io
  ```
- Fitur Alpha pada RuntimeClass akan menjadi tidak valid, jika `runtimeHandler` tidak ditentukan atau 
  kosong atau menggunakan karakter `.` pada *handler*. Ini harus dimigrasi ke *handler* dengan
  konfigurasi yang valid (lihat petunjuk di atas).

{{% /capture %}}
