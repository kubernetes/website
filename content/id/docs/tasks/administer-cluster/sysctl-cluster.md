---
title: Menggunakan sysctl dalam Sebuah Klaster Kubernetes
content_type: task
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.12" state="beta" >}}

Dokumen ini menjelaskan tentang cara mengonfigurasi dan menggunakan parameter kernel dalam sebuah
klaster Kubernetes dengan menggunakan antarmuka {{< glossary_tooltip term_id="sysctl" >}}.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Melihat Daftar Semua Parameter Sysctl

Dalam Linux, antarmuka sysctl memungkinkan administrator untuk memodifikasi kernel
parameter pada _runtime_. Parameter tersedia melalui sistem file virtual dari proses `/proc/sys/`.
Parameter mencakup berbagai subsistem seperti:

- kernel (dengan prefiks umum: `kernel.`)
- networking (dengan prefiks umum: `net.`)
- virtual memory (dengan prefiks umum: `vm.`)
- MDADM (dengan prefiks umum: `dev.`)
- subsistem yang lainnya dideskripsikan pada [dokumentasi Kernel](https://www.kernel.org/doc/Documentation/sysctl/README).

Untuk mendapatkan daftar semua parameter, kamu bisa menjalankan perintah:

```shell
sudo sysctl -a
```

## Mengaktifkan Sysctl _Unsafe_

Sysctl dikelompokkan menjadi sysctl _safe_ dan sysctl _unsafe_. Sebagai tambahan untuk
pengaturan _Namespace_ yang benar, sebuah sysctl _safe_ harus diisolasikan dengan benar diantara Pod dalam Node yang sama.
Hal ini berarti mengatur sysctl _safe_ dalam satu Pod:

- tidak boleh mempengaruhi Pod lain dalam Node
- tidak boleh membahayakan kesehatan dari Node
- tidak mengizinkan untuk mendapatkan sumber daya CPU atau memori di luar batas sumber daya dari sebuah Pod.


Sejauh ini, sebagian besar sysctl yang diatur sebagai Namespace belum tentu dianggap sysctl _safe_.
Sysctl berikut ini didukung dalam kelompok _safe_:

- `kernel.shm_rmid_forced`,
- `net.ipv4.ip_local_port_range`,
- `net.ipv4.tcp_syncookies`,
- `net.ipv4.ping_group_range` (sejak Kubernetes 1.18).

{{< note >}}
Contoh `net.ipv4.tcp_syncookies` bukan merupakan Namespace pada kernel Linux versi 4.4 atau lebih rendah.

Daftar ini akan terus dikembangkan dalam versi Kubernetes berikutnya ketika kubelet
mendukung mekanisme isolasi yang lebih baik.

Semua sysctl _safe_ diaktifkan secara bawaan.

Semua sysctl _unsafe_ dinon-aktifkan secara bawaan dan harus diizinkan secara manual oleh
administrator klaster untuk setiap Node. Pod dengan sysctl _unsafe_ yang dinon-aktifkan akan dijadwalkan, 
tetapi akan gagal untuk dijalankan.

Dengan mengingat peringatan di atas, administrator klaster dapat mengizinkan sysctl _unsafe_ tertentu
untuk situasi yang sangat spesial seperti pada saat kinerja tinggi atau
penyetelan aplikasi secara _real-time_. _Unsafe_ syctl diaktifkan Node demi Node melalui
_flag_ pada kubelet; sebagai contoh:

```shell
kubelet --allowed-unsafe-sysctls \
  'kernel.msg*,net.core.somaxconn' ...
```

Untuk {{< glossary_tooltip term_id="minikube" >}}, ini dapat dilakukan melalui _flag_ `extra-config`:

```shell
minikube start --extra-config="kubelet.allowed-unsafe-sysctls=kernel.msg*,net.core.somaxconn"...
```

Hanya sysctl yang diatur sebagai Namespace dapat diaktifkan dengan cara ini.

## Mnegatur Sysctl untuk Pod

Sejumlah sysctl adalah diatur sebagai Namespace dalam Kernel Linux hari ini. Ini berarti
mereka dapat diatur secara independen untuk setiap Pod dalam sebuah Node. Hanya sysctl dengan Namespace
yang dapat dikonfigurasi melalui Pod securityContext dalam Kubernetes.

Sysctl berikut dikenal sebagai Namespace. Daftar ini dapat berubah
pada versi kernel Linux yang akan datang.

- `kernel.shm*`,
- `kernel.msg*`,
- `kernel.sem`,
- `fs.mqueue.*`,
- Parameter dibawah `net.*` dapat diatur sebagai Namespace dari _container networking_
  Namun, ada beberapa perkecualian (seperti
  `net.netfilter.nf_conntrack_max` dan `net.netfilter.nf_conntrack_expect_max`
  yang dapat diatur dalam Namespace _container networking_ padahal bukan merupakan Namespace).

Sysctl tanpa Namespace disebut dengan sysctl _node-level_. Jika kamu perlu mengatur
mereka, kamu harus secara manual mengonfigurasi mereka pada sistem operasi setiap Node, atau dengan
menggunakan DaemonSet melalui Container yang berwenang.

Gunakan securityContext dari Pod untuk mengonfigurasi sysctl Namespace. securityContext
berlaku untuk semua Container dalam Pod yang sama.


Contoh ini menggunakan securityContext dari Pod untuk mengatur sebuah sysctl _safe_
`kernel.shm_rmid_forced`, dan dua buah sysctl _unsafe_ `net.core.somaxconn` dan
`kernel.msgmax`. Tidak ada perbedaan antara sysctl _safe_ dan sysctl _unsafe_ dalam
spesifikasi tersebut.

{{< warning >}}
Hanya modifikasi parameter sysctl setelah kamu memahami efeknya, untuk menghindari
gangguan pada kestabilan sistem operasi kamu.
{{< /warning >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
spec:
  securityContext:
    sysctls:
    - name: kernel.shm_rmid_forced
      value: "0"
    - name: net.core.somaxconn
      value: "1024"
    - name: kernel.msgmax
      value: "65536"
  ...
```


<!-- discussion -->

{{< warning >}}
Karena sifat alami dari sysctl _unsafe_, penggunaan sysctl _unsafe_
merupakan resiko kamu sendiri dan dapat menyebabkan masalah parah seperti perilaku yang salah
pada Container, kekurangan sumber daya, atau kerusakan total dari Node.
{{< /warning >}}

Merupakan sebuah praktik yang baik untuk mempertimbangkan Node dengan pengaturan sysctl khusus sebagai
Node yang tercemar (_tainted_) dalam sebuah cluster, dan hanya menjadwalkan Pod yang membutuhkan pengaturan sysctl.
Sangat disarankan untuk menggunakan Kubernetes [fitur _taints and toleration_](/docs/reference/generated/kubectl/kubectl-commands/#taint) untuk mengimplementasikannya.

Pod dengan sysctl _unsafe_ akan gagal diluncurkan pada sembarang Node yang belum
mengaktifkan kedua sysctl _unsafe_ secara eksplisit. Seperti halnya sysctl _node-level_ sangat
disarankan untuk menggunakan [fitur _taints and toleration_](/docs/reference/generated/kubectl/kubectl-commands/#taint) atau
[pencemaran dalam Node](/id/docs/concepts/scheduling-eviction/taint-and-toleration/)
untuk Pod dalam Node yang tepat.

## PodSecurityPolicy

Kamu selanjutnya dapat mengontrol sysctl mana saja yang dapat diatur dalam Pod dengan menentukan daftar
sysctl atau pola (_pattern_) sysctl dalam `forbiddenSysctls` dan/atau _field_
`allowedUnsafeSysctls` dari PodSecurityPolicy. Pola sysctl diakhiri
dengan karakter `*`, seperti `kernel.*`. Karakter `*` saja akan mencakup
semua sysctl.

Secara bawaan, semua sysctl _safe_ diizinkan.

Kedua `forbiddenSysctls` dan `allowedUnsafeSysctls` merupakan daftar dari nama sysctl
atau pola sysctl yang polos (yang diakhiri dengan karakter `*`). Karakter `*` saja berarti sesuai dengan semua sysctl.

_Field_ `forbiddenSysctls` tidak memasukkan sysctl tertentu. Kamu dapat melarang 
kombinasi sysctl _safe_ dan sysctl _unsafe_ dalam daftar tersebut. Untuk melarang pengaturan
sysctl, hanya gunakan `*` saja.

Jika kamu menyebutkan sysctl _unsafe_ pada _field_ `allowedUnsafeSysctls` dan 
tidak ada pada _field_ `forbiddenSysctls`, maka sysctl dapat digunakan pada Pod
dengan menggunakan PodSecurityPolicy ini. Untuk mengizinkan semua sysctl _unsafe_ diatur dalam
PodSecurityPolicy, gunakan karakter `*` saja.

Jangan mengonfigurasi kedua _field_ ini sampai tumpang tindih, dimana
sysctl yang diberikan akan diperbolehkan dan dilarang sekaligus.

{{< warning >}}
Jika kamu mengizinkan sysctl _unsafe_ melalui _field_ `allowUnsafeSysctls`
pada PodSecurityPolicy, Pod apa pun yang menggunakan sysctl seperti itu akan gagal dimulai
jika sysctl _unsafe_ tidak diperbolehkan dalam _flag_ kubelet `--allowed-unsafe-sysctls`
pada Node tersebut.
{{< /warning >}}

Ini merupakan contoh sysctl _unsafe_ yang diawali dengan `kernel.msg` yang diperbolehkan dan
sysctl `kernel.shm_rmid_forced` yang dilarang.

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: sysctl-psp
spec:
  allowedUnsafeSysctls:
  - kernel.msg*
  forbiddenSysctls:
  - kernel.shm_rmid_forced
 ...
```


