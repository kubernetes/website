---
title: Taint dan Toleration
content_type: concept
weight: 40
---


<!-- overview -->
Afinitas Node, seperti yang dideskripsikan [di sini](/id/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature),
adalah salah satu properti dari Pod yang menyebabkan pod tersebut memiliki preferensi
untuk ditempatkan di sekelompok Node tertentu (preferensi ini dapat berupa _soft constraints_ atau
_hard constraints_ yang harus dipenuhi). _Taint_ merupakan kebalikan dari afinitas --
properti ini akan menyebabkan Pod memiliki preferensi untuk tidak ditempatkan pada sekelompok Node tertentu.

_Taint_ dan _toleration_ bekerja sama untuk memastikan Pod dijadwalkan pada Node
yang sesuai. Satu atau lebih _taint_ akan diterapkan pada suatu node; hal ini akan menyebabkan
node tidak akan menerima pod yang tidak mengikuti _taint_ yang sudah diterapkan.



<!-- body -->

## Konsep

Kamu dapat menambahkan _taint_ pada sebuah _node_ dengan menggunakan perintah [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
Misalnya,

```shell
kubectl taint nodes node1 key=value:NoSchedule
```

akan menerapkan _taint_ pada _node_ `node1`. _Taint_ tersebut memiliki _key_ `key`, _value_ `value`,
dan _effect_ _taint_ `NoSchedule`. Hal ini artinya pod yang ada tidak akan dapat dijadwalkan pada `node1`
kecuali memiliki _taint_ yang sesuai.

Untuk menghilangkan _taint_ yang ditambahkan dengan perintah di atas, kamu dapat menggunakan
perintah di bawah ini:
```shell
kubectl taint nodes node1 key:NoSchedule-
```

Kamu dapat memberikan spesifikasi _toleration_ untuk _pod_ pada bagian PodSpec.
Kedua _toleration_ yang diterapkan di bawa ini "sesuai" dengan _taint_ yang
_taint_ yang dibuat dengan perintah `kubectl taint` di atas, sehingga sebuah _pod_
dengan _toleration_ yang sudah didefinisikan akan mampu di-_schedule_ ke node `node`:

```yaml
tolerations:
- key: "key"
  operator: "Equal"
  value: "value"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key"
  operator: "Exists"
  effect: "NoSchedule"
```

Sebuah _toleration_ "sesuai" dengan sebuah _taint_ jika _key_ dan efek yang
ditimbulkan sama:

* `operator` dianggap `Exists` (pada kasus dimana tidak ada `value` yang diberikan), atau
* `operator` dianggap `Equal` dan `value` yang ada sama

`Operator` bernilai `Equal` secara _default_ jika tidak diberikan spesifikasi khusus.

{{< note >}}
Terdapat dua kasus khusus:

* Sebuah `key` dengan operator `Exists` akan sesuai dengan semua _key_, _value_, dan _effect_ yang ada.
Dengan kata lain, _tolaration_ ini akan menerima semua hal yang diberikan.

```yaml
tolerations:
- operator: "Exists"
```

* Sebuah `effect` yang kosong akan dianggap sesuai dengan semua _effect_ dengan _key_ `key`.

```yaml
tolerations:
- key: "key"
  operator: "Exists"
```
{{< /note >}}

Contoh yang diberikan di atas menggunakan `effect` untuk `NoSchedule`.
Alternatif lain yang dapat digunakan adalah `effect` untuk `PreferNoSchedule`.
`PreferNoSchedule` merupakan "preferensi" yang lebih fleksibel dari `NoSchedule` --
sistem akan mencoba untuk tidak menempatkan pod yang tidak menoleransi _taint_
pada _node_, tapi hal ini bukan merupakan sesuatu yang harus dipenuhi. Jenis ketiga
dari `effect` adalah `NoExecute`, akan dijelaskan selanjutnya.

Kamu dapat menerapkan beberapa _taint_ sekaligus pada _node_ atau
beberapa _toleration_ sekaligus pada sebuah _pod_. Mekanisme Kubernetes dapat
memproses beberapa _taint_ dan _toleration_ sekaligus sama halnya seperti sebuah
_filter_: memulai dengan _taint_ yang ada pada _node_, kemudian mengabaikan
_taint_ yang sesuai pada pod yang memiliki _toleration_ yang sesuai; kemudian
_taint_ yang diterapkan pada pod yang sudah disaring tadi akan menghasilkan suatu
_effect_ pada pod. Secara khusus:

* jika terdapat _taint_ yang tidak tersaring dengan _effect_ `NoSchedule` maka Kubernetes tidak akan menempatkan
_pod_ pada _node_ tersebut
* jika tidak terdapat _taint_ yang tidak tersaring dengan _effect_ `NoSchedule`
tapi terdapat setidaknya satu _taint_ yang tidak tersaring dengan
_effect_ `PreferNoSchedule` maka Kubernetes akan mencoba untuk tidak akan menempatkan
_pod_ pada _node_ tersebut
* jika terdapat _taint_ yang tidak tersaring dengan _effect_  `NoExecute` maka _pod_ akan
berada dalam kondisi _evicted_ dari _node_ (jika _pod_ tersebut sudah terlanjur ditempatkan pada _node_
tersebut), dan tidak akan di-_schedule_ lagi pada _node_ tersebut.

Sebagai contoh, bayangkan kamu memberikan _taint_ pada _node_ sebagai berikut:

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

Dan _pod_ memiliki dua _toleration_:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

Pada kasus ini, _pod_ tidak akan di-_schedule_ pada _node_, karena tidak ada
_toleration_ yang sesuai dengan _taint_ ketiga. Akan tetapi, _pod_ yang sebelumnya
sudah dijalankan di _node_ dimana _taint_ ditambahkan akan tetap jalan, karena _taint_
ketiga merupakan _taint_ yang tidak ditoleransi oleh _pod_.

Pada umumnya, jika sebuah _taint_ memiliki _effect_ `NoExecute` ditambahkan pada _node_,
maka semua pod yang tidak menoleransi _taint_ tersebut akan berada dalam _state_
_evicted_ secara langsung, dan semua _pod_ yang menoleransi _taint_ tersebut
tidak akan berjalan seperti biasanya (tidak dalam _state_ _evicted_). Meskipun demikian,
_toleration_ dengan _effect_ `NoExecute` dapat dispesfikasikan sebagai _field_ opsional
`tolerationSeconds` yang memberikan perintah berapa lama suatu _pod_ akan berada
pada _node_ apabila sebuah _taint_ ditambahkan. Contohnya:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

ini berarti apabila sebuah _pod_ sedang dalam berada dalam _state_ _running_,
kemudian sebuah _taint_ yang sesuai ditambahkan pada _node_, maka _pod_ tersebut
akan tetap berada di dalam _node_ untuk periode 3600 detik sebelum _state_-nya
berubah menjadi _evicted_. Jika _taint_ dihapus sebelum periode tersebut, maka _pod_
tetap berjalan sebagaimana mestinya.

## Contoh Penggunaan

_Taint_ dan _toleration_ adalah mekanisme fleksibel yang digunakan untuk
memaksa _pod_ agar tidak dijadwalkan pada _node-node_ tertentu atau
mengubah _state_ _pod_ menjadi _evicted_. Berikut adalah beberapa contoh penggunaannya:

* **Node-Node yang Sifatnya _Dedicated_**: Jika kamu ingin menggunakan
sekumpulan _node_ dengan penggunaan eksklusif dari sekumpulan pengguna,
kamu dapat menambahkan _taint_ pada _node-node_ tersebut (misalnya,
`kubectl taint nodes nodename dedicated=groupName:NoSchedule`) dan kemudian
menambahkan _toleration_ yang sesuai pada _pod-pod_ yang berada di dalamnya (hal ini
dapat dilakukan dengan mudah dengan cara menulis
[_admission controller_](/docs/reference/access-authn-authz/admission-controllers/) yang
bersifat khusus). _Pod-pod_ dengan _toleration_ nantinya akan diperbolehkannya untuk menggunakan
_node_ yang sudah di-_taint_ (atau dengan kata lain didedikasikan penggunaannya) maupun
_node_ lain yang ada di dalam klaster. Jika kamu ingin mendedikasikan _node_ khusus
yang hanya digunakan oleh _pod-pod_ tadi serta memastikan _pod-pod_ tadi hanya menggunakan
_node_ yang didedikasikan, maka kamu harus menambahkan sebuah _label_ yang serupa dengan
_taint_ yang diberikan pada sekelompok _node_ (misalnya, `dedicated=groupName`), dan
_admission controller_ sebaiknya menambahkan afininitas _node_ untuk memastikan _pod-pod_
tadi hanya dijadwalkan pada _node_ dengan _label_ `dedicated=groupName`.

* **Node-Node dengan Perangkat Keras Khusus**: Pada suatu klaster dimana
sebagian kecuali _node_ memiliki perangkat keras khusus (misalnya GPU), kita ingin
memastikan hanya _pod-pod_ yang membutuhkan GPU saja yang dijadwalkan di _node_ dengan GPU.
Hal ini dapat dilakukan dengan memberikan _taint_ pada _node_ yang memiliki perangkat keras
khusus (misalnya, `kubectl taint nodes nodename special=true:NoSchedule` atau
`kubectl taint nodes nodename special=true:PreferNoSchedule`) serta menambahkan _toleration_
yang sesuai pada _pod_ yang menggunakan _node_ dengan perangkat keras khusus. Seperti halnya pada
kebutuhan _dedicated_ _node_, hal ini dapat dilakukan dengan mudah dengan cara menulis
[_admission controller_](/docs/reference/access-authn-authz/admission-controllers/) yang
bersifat khusus. Misalnya, kita dapat menggunakan [_Extended Resource_](/id/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)
untuk merepresentasikan perangkat keras khusus, kemudian _taint_ _node_ dengan perangkat keras khusus
dengan nama _extended resource_ dan jalankan _admission controller_
[ExtendedResourceToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration).
Setelah itu, karena _node_ yang ada sudah di-_taint_, maka tidak akan ada _pod_ yang
tidak memiliki _toleration_ yang akan dijadwalkan pada _node_ tersebut_.
Meskipun begitu, ketika kamu membuat suatu _pod_ yang membutuhkan _extended resource_,
maka _admission controller_ dari `ExtendedResourceToleration` akan mengoreksi
_toleration_ sehingga _pod_ tersebut dapat dijadwalkan pada _node_ dengan perangkat keras khusus.
Dengan demikian, kamu tidak perlu menambahkan _toleration_ secara manual pada pod yang ada.

* **_Eviction_ berbasis _Taint_ (fitur beta)**: Konfigurasi _eviction_ per _pod_
yang terjadi ketika _pod_ mengalami gangguan, hal ini akan dibahas lebih lanjut di bagian
selanjutnya.

## _Eviction_ berbasis _Taint_

Sebelumnya, kita sudah pernah membahas soal _effect_ _taint_ `NoExecute`,
yang memengaruhi _pod_ yang sudah dijalankan dengan cara sebagai berikut:

 * _pod_ yang tidak menoleransi _taint_ akan segera diubah _state_-nya menjadi _evicted_
 * _pod_ yang menoleransi _taint_ yang tidak menspesifikasikan `tolerationSeconds` pada
   spesifikasi _toleration_ yang ada akan tetap berada di dalam _node_ tanpa adanya batas waktu tertentu
 * _pod_ yang menoleransi _taint_ yang menspesifikasikan `tolerationSeconds`
   spesifikasi _toleration_ yang ada akan tetap berada di dalam _node_ hingga batas waktu tertentu

Sebagai tambahan, Kubernetes 1.6 memperkenalkan dukungan alfa untuk merepresentasikan
_node_ yang bermasalah. Dengan kata lain, _node controller_ akan secara otomatis memberikan _taint_
pada sebuah _node_ apabila _node_ tersebut memenuhi kriteria tertentu. Berikut merupakan _taint_
yang secara _default_ disediakan:

 * `node.kubernetes.io/not-ready`: _Node_ berada dalam _state_ _not ready_. Hal ini terjadi apabila
    _value_ dari _NodeCondition_ `Ready` adalah "`False`".
 * `node.kubernetes.io/unreachable`: _Node_ berada dalam _state_ _unreachable_ dari _node controller_
    Hal ini terjadi apabila _value_ dari _NodeCondition_ `Ready` adalah "`Unknown`".
 * `node.kubernetes.io/out-of-disk`: _Node_ kehabisan kapasitas _disk_.
 * `node.kubernetes.io/memory-pressure`: _Node_ berada diambang kapasitas memori.
 * `node.kubernetes.io/disk-pressure`: _Node_ berada diambang kapasitas _disk_.
 * `node.kubernetes.io/network-unavailable`: Jaringan pada _Node_ bersifat _unavailable_.
 * `node.kubernetes.io/unschedulable`: _Node_ tidak dapat dijadwalkan.
 * `node.cloudprovider.kubernetes.io/uninitialized`: Ketika _kubelet_ dijalankan dengan
    penyedia layanan _cloud_ "eksternal", _taint_ ini akan diterapkan pada _node_ untuk menandai
    _node_ tersebut tidak digunakan. Setelah kontroler dari _cloud-controller-manager_ melakukan
    inisiasi _node_ tersebut, maka _kubelet_ akan menghapus _taint_ yang ada.

Pada versi 1.13, fitur `TaintBasedEvictions` diubah menjadi beta dan diaktifkan secara _default_,
dengan demikian _taint-taint_ tersebut secara otomatis ditambahkan oleh _NodeController_ (atau _kubelet_)
dan logika normal untuk melakukan _eviction_ pada _pod_ dari suatu _node_ tertentu berdasarkan _value_
dari _Ready_ yang ada pada _NodeCondition_ dinonaktifkan.

{{< note >}}
Untuk menjaga perilaku [_rate limiting_](/id/docs/concepts/architecture/nodes/) yang
ada pada _eviction_ _pod_ apabila _node_ mengalami masalah, sistem sebenarnya menambahkan
_taint_ dalam bentuk _rate limiter_. Hal ini mencegah _eviction_ besar-besaran pada _pod_
pada skenario dimana master menjadi terpisah dari _node_ lainnya.
{{< /note >}}

Fitur beta ini, bersamaan dengan `tolerationSeconds`, mengizinkan sebuah _pod_
untuk menspesifikasikan berapa lama _pod_ harus tetap sesuai dengan sebuah _node_
apabila _node_ tersebut bermasalah.

Misalnya, sebuah aplikasi dengan banyak _state_ lokal akan lebih baik untuk tetap
berada di suatu _node_ pada saat terjadi partisi jaringan, dengan harapan partisi jaringan
tersebut dapat diselesaikan dan mekanisme _eviction_ _pod_ tidak akan dilakukan.
_Toleration_ yang ditambahkan akan berbentuk sebagai berikut:

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

Perhatikan bahwa Kubernetes secara otomatis menambahkan _toleration_ untuk
`node.kubernetes.io/not-ready` dengan `tolerationSeconds=300`
kecuali konfigurasi lain disediakan oleh pengguna.
Kubernetes juga secara otomatis menambahkan _toleration_ untuk
`node.kubernetes.io/unreachable` dengan `tolerationSeconds=300`
kecuali konfigurasi lain disediakan oleh pengguna.

_Toleration_ yang ditambahkan secara otomatis ini menjamin bahwa
perilaku _default_ dari suatu _pod_ adalah tetap bertahan selama 5 menit pada
_node_ apabila salah satu masalah terdeteksi.
Kedua _toleration_ _default_ tadi ditambahkan oleh [DefaultTolerationSeconds
_admission controller_](https://git.k8s.io/kubernetes/plugin/pkg/admission/defaulttolerationseconds).

_Pod-pod_ pada [DaemonSet](/id/docs/concepts/workloads/controllers/daemonset/) dibuat dengan _toleration_
`NoExecute` untuk _taint_ tanpa `tolerationSeconds`:

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

Hal ini menjamin _pod-pod_ yang merupakan bagian dari DaemonSet tidak pernah berada di dalam
_state_ _evicted_ apabila terjadi permasalahan pada _node_.

## _Taint_ pada _Node_ berdasarkan Kondisi Tertentu

Pada versi 1.12, fitur `TaintNodesByCondition` menjadi fitur beta, dengan demikian _lifecycle_
dari kontroler _node_ akan secara otomatis menambahkan _taint_ sesuai dengan kondisi _node_.
Hal yang sama juga terjadi pada _scheduler_, _scheduler_ tidak bertugas memeriksa kondisi _node_
tetapi kondisi _taint_. Hal ini memastikan bahwa kondisi _node_ tidak memengaruhi apa
yang dijadwalkan di _node_. Pengguna dapat memilih untuk mengabaikan beberapa permasalahan yang
ada pada _node_ (yang direpresentasikan oleh kondisi _Node_) dengan menambahkan _toleration_ _Pod_ `NoSchedule`.
Sedangkan _taint_ dengan _effect_ `NoExecute` dikendalikan oleh `TaintBasedEviction` yang merupakan
fitur beta yang diaktifkan secara _default_ oleh Kubernetes sejak versi 1.13.

Sejak Kubernetes versi 1.8, kontroler DaemonSet akan secara otomatis
menambahkan _toleration_ `NoSchedule` pada semua _daemon_ untuk menjaga
fungsionalitas DaemonSet.

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/out-of-disk` (hanya untuk pod yang bersifat _critical_)
  * `node.kubernetes.io/unschedulable` (versi 1.10 atau yang lebih baru)
  * `node.kubernetes.io/network-unavailable` (hanya untuk jaringan _host_)

Menambahkan _toleration_ ini menjamin _backward compatibility_.
Kamu juga dapat menambahkan _toleration_ lain pada DaemonSet.
