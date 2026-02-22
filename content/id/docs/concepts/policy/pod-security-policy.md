---
title: Pod Security Policy
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state state="beta" >}}

Pod Security Policies (kebijakan keamanan Pod) memungkinkan otorisasi secara detil dari pembuatan dan pembaruan Pod.



<!-- body -->

## Apa itu Pod Security Policy?

_Pod Security Policy_ adalah sebuah sumber daya pada tingkat klaster yang mengatur aspek-aspek spesifikasi Pod yang sensitif terhadap keamanan. Objek-objek `PodSecurityPolicy` mendefinisikan sebuah kumpulan kondisi yang harus dijalankan oleh Pod untuk dapat diterima oleh sistem, dan juga sebagai nilai-nilai bawaan untuk kolom-kolom yang bersangkutan. Mereka memungkinkan administrator untuk mengatur hal-hal berikut:

| Aspek yang diatur                                      | Nama Kolom                                 |
| ----------------------------------------------------| ------------------------------------------- |
| Menjalankan Container-container yang _privileged_   | [`privileged`](#privileged)                                |
| Penggunaan _namespace-namespace_ milik _host_       | [`hostPID`, `hostIPC`](#host-namespaces)    |
| Penggunaan jaringan dan _port_ milik _host_         | [`hostNetwork`, `hostPorts`](#host-namespaces) |
| Penggunaan jenis-jenis Volume                       | [`volumes`](#volumes-and-file-systems)      |
| Penggunaan _filesystem_ milik _host_                | [`allowedHostPaths`](#volumes-and-file-systems) |
| Daftar putih untuk _driver-driver_ Flexvolume       | [`allowedFlexVolumes`](#flexvolume-drivers) |
| Mengalokasi FSGroup yang memiliki Volume milik Pod  | [`fsGroup`](#volumes-and-file-systems)      |
| Mengharuskan penggunaan _read-only root filesystem_ | [`readOnlyRootFilesystem`](#volumes-and-file-systems) |
| User dan Grop ID dari Container                    | [`runAsUser`, `runAsGroup`, `supplementalGroups`](#users-and-groups) |
| Membatasi eskalasi ke kemampuan _root_              | [`allowPrivilegeEscalation`, `defaultAllowPrivilegeEscalation`](#privilege-escalation) |
| Kemampuan-kemampuan Linux                           | [`defaultAddCapabilities`, `requiredDropCapabilities`, `allowedCapabilities`](#capabilities) |
| Konteks SELinux dari Container ainer                | [`seLinux`](#selinux)                       |
| Jenis tambatan Proc yang diizinkan untuk Container  | [`allowedProcMountTypes`](#allowedprocmounttypes) |
| Profil AppArmor yang digunakan oleh Container       | [annotations](#apparmor)                    |
| Profil seccomp yang digubakan oleh Container        | [annotations](#seccomp)                     |
| Profil sysctl yang digunakan oleh Container         | [`forbiddenSysctls`,`allowedUnsafeSysctls`](#sysctl)                      |

## Mengaktifkan Pod Security Policy

Pengaturan Pod Security Policy diimplementasi sebagai sebuah opsi (tapi direkomendasikan untuk digunakan) dari [_admission controller_](/docs/reference/access-authn-authz/admission-controllers/#podsecuritypolicy). PodSecurityPolicy dilaksanakan dengan [mengaktifkan _admission controller_-nya](/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-on-an-admission-control-plug-in), tetapi melakukan hal ini tanpa mengizinkan kebijakan apapun **akan menghalangi Pod apapun untuk dibuat** di dalam klaster.

Sejak API dari Pod Security Policy (`policy/v1beta1/podsecuritypolicy`) diaktifkan secara independen dari _admission controller_, untuk klaster-klaster yang sudah ada direkomendasikan untuk menambahkan dan mengizinkan kebijakan yang bersangkutan sebelum mengaktifkan _admission controller_ tersebut.

## Mengizinkan Kebijakan

Saat sebuah sumber daya PodSecurityPolicy dibuat, ia tidak melakukan apa-apa. Untuk menggunakannya, [Service Account](/id/docs/tasks/configure-pod-container/configure-service-account/) dari pengguna yang memintanya atau target Pod-nya harus diizinkan terlebih dahulu untuk menggunakan kebijakan tersebut, dengan membolehkan kata kerja `use` terhadap kebijakan tersebut.

Kebanyakan Pod Kubernetes tidak dibuat secara langsung oleh pengguna. Sebagai gantinya, mereka biasanya dibuat secara tidak langsung sebagai bagian dari sebuah [Deployment](/id/docs/concepts/workloads/controllers/deployment/), [ReplicaSet](/id/docs/concepts/workloads/controllers/replicaset/), atau pengontrol yang sudah ditemplat lainnya melalui Controller Manager. Memberikan akses untuk pengontrol terhadap kebijakan tersebut akan mengizinkan akses untuk *semua* Pod yang dibuat oleh pengontrol tersebut, sehingga metode yang lebih baik untuk mengizinkan kebijakan adalah dengan memberikan akses pada Service Account milik Pod (lihat [contohnya](#run-another-pod)).

### Melalui RBAC

[RBAC](/id/docs/reference/access-authn-authz/rbac/) adalah mode otorisasi standar Kubernetes, dan dapat digunakan dengan mudah untuk mengotorisasi penggunaan kebijakan-kebijakan.

Pertama-tama, sebuah `Role` atau `ClusterRole` perlu memberikan akses pada kata kerja `use` terhadap kebijakan-kebijakan yang diinginkan. `rules` yang digunakan untuk memberikan akses tersebut terlihat seperti berikut:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: <role name>
rules:
- apiGroups: ['policy']
  resources: ['podsecuritypolicies']
  verbs:     ['use']
  resourceNames:
  - <list of policies to authorize>
```

Kemudian, `Role` atau `ClusterRole` tersebut diikat ke pengguna-pengguna yang diberikan otoritas.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: <binding name>
roleRef:
  kind: ClusterRole
  name: <role name>
  apiGroup: rbac.authorization.k8s.io
subjects:
# Mengotorisasi ServiceAccount spesifik
- kind: ServiceAccount
  name: <authorized service account name>
  namespace: <authorized pod namespace>
# Mengotorisasi User spesifik (tidak direkomendasikan)
- kind: User
  apiGroup: rbac.authorization.k8s.io
  name: <authorized user name>
```

Jika sebuah `RoleBinding` (bukan `ClusterRoleBinding`) digunakan, maka ia hanya akan memberi akses penggunaan untuk Pod-Pod yang dijalankan pada Namespace yang sama dengan `RoleBinding` tersebut. Hal ini dapat dipasangkan dengan grup sistem untuk memberi akses pada semua Pod yang berjalan di Namespace tersebut:

```yaml
# Mengotorisasi semua ServiceAccount di dalam sebuah Namespace
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts
# Atau secara ekuivalen, semua pengguna yang telah terotentikasi pada sebuah Namespace
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:authenticated
```

Untuk lebih banyak contoh pengikatan RBAC, lihat [Contoh Role Binding](/id/docs/reference/access-authn-authz/rbac#role-binding-examples).
Untuk contoh lengkap untuk mengotorisasi sebuah PodSecurityPolicy, lihat [di bawah](#contoh).

### Mengatasi Masalah

- [Controller Manager](/docs/admin/kube-controller-manager/) harus dijalankan terhadap [port API yang telah diamankan](/docs/reference/access-authn-authz/controlling-access/), dan tidak boleh memiliki izin _superuser_, atau semua permintaan akan melewati modul-modul otentikasi dan otorisasi, semua objek PodSecurityPolicy tidak akan diizinkan, dan semua pengguna dapat membuat Container-container yang _privileged_. Untuk lebih detil tentang mengkonfigurasi otorisasi Controller Manager, lihat [Controller Roles](/id/docs/reference/access-authn-authz/rbac/#controller-roles).

## Urutan Kebijakan

Sebagai tambahan terhadap membatasi pembuatan dan pembaruan Pod, Pod Security Policy dapat digunakan juga untuk menyediakan nilai-nilai bawaan untuk banyak kolom yang dikontrol olehnya. Saat banyak kebijakan tersedia, pengatur Pod Security Policy memilih kebijakan-kebijakan berdasarkan kriteria berikut:

1. PodSecurityPolicy yang mengizinkan Pod apa adanya, tanpa mengganti nilai-nilai bawaan atau memutasi Pod tersebut, akan lebih dipilih. Urutan PodSecurityPolicy yang tidak mengubah Pod ini tidak dipermasalahkan.
2. Jika Pod-nya harus diberi nilai bawaan atau dimutasi, maka PodSecurityPolicy pertama (diurutkan berdasarkan namanya) untuk mengizinkan Pod tersebut akan dipilih.

{{< note >}}
Saat operasi pembaruan (saat ini mutasi terhadap spesifikasi Pod tidak diizinkan) hanya PodSecurityPolicy yang tidak mengubah Pod yang akan digunakan untuk melakukan validasi terhadap Pod tersebut.
{{< /note >}}

## Contoh

_Contoh ini mengasumsikan kamu telah memiliki klaster yang berjalan dengan _admission controller_ PodSecurityPolicy diaktifkan, dan kamu mempunyai akses admin._

### Persiapan

Mempersiapkan sebuah Namespace dan ServiceAccount untuk digunakan pada contoh ini. Kita akan menggunakan ServiceAccount ini untuk meniru sebuah pengguna bukan admin.

```shell
kubectl create namespace psp-example
kubectl create serviceaccount -n psp-example fake-user
kubectl create rolebinding -n psp-example fake-editor --clusterrole=edit --serviceaccount=psp-example:fake-user
```

Untuk memperjelas kita bertindak sebagai pengguna yang mana dan mempersingkat ketikan, kita akan membuat 2 alias:

```shell
alias kubectl-admin='kubectl -n psp-example'
alias kubectl-user='kubectl --as=system:serviceaccount:psp-example:fake-user -n psp-example'
```

### Membuat sebuah kebijakan dan sebuah Pod

Beri definisi objek contoh PodSecurityPolicy dalam sebuah berkas. Ini adalah kebijakan yang mencegah pembuatan Pod-Pod yang _privileged_.

{{% codenew file="policy/example-psp.yaml" %}}

Dan buatlah PodSecurityPolicy tersebut dengan `kubectl`:

```shell
kubectl-admin create -f example-psp.yaml
```

Sekarang, sebagai pengguna bukan admin, cobalah membuat Pod sederhana:

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      pause
spec:
  containers:
    - name:  pause
      image: registry.k8s.io/pause
EOF
Error from server (Forbidden): error when creating "STDIN": pods "pause" is forbidden: unable to validate against any pod security policy: []
```

**Apa yang terjadi?** Walaupun PodSecurityPolicy tersebut telah dibuat, ServiceAccount dari Pod tersebut maupun `fake-user` tidak memikiki izin untuk menggunakan kebijakan tersebut:

```shell
kubectl-user auth can-i use podsecuritypolicy/example
no
```

Membuat RoleBinding untuk memberikan `fake-user` akses terhadap kata kerja `use` pada kebijakan contoh kita:

{{< note >}}
Ini bukan cara yang direkomendasikan! Lihat [bagian selanjutnya](#menjalankan-pod-lainnya) untuk cara yang lebih baik.
{{< /note >}}

```shell
kubectl-admin create role psp:unprivileged \
    --verb=use \
    --resource=podsecuritypolicy \
    --resource-name=example
role "psp:unprivileged" created

kubectl-admin create rolebinding fake-user:psp:unprivileged \
    --role=psp:unprivileged \
    --serviceaccount=psp-example:fake-user
rolebinding "fake-user:psp:unprivileged" created

kubectl-user auth can-i use podsecuritypolicy/example
yes
```

Sekarang, ulangi membuat Pod tersebut

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      pause
spec:
  containers:
    - name:  pause
      image: registry.k8s.io/pause
EOF
pod "pause" created
```

Bekerja seperti yang diharapkan! Tapi percobaan apapun untuk membuat Pod yang _privileged_ seharusnya masih ditolak:

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      privileged
spec:
  containers:
    - name:  pause
      image: registry.k8s.io/pause
      securityContext:
        privileged: true
EOF
Error from server (Forbidden): error when creating "STDIN": pods "privileged" is forbidden: unable to validate against any pod security policy: [spec.containers[0].securityContext.privileged: Invalid value: true: Privileged containers are not allowed]
```

Hapus Pod tersebut sebelum melanjutkan:

```shell
kubectl-user delete pod pause
```

### Menjalankan Pod lainnya

Mari coba lagi, dengan cara yang sedikit berbeda:

```shell
kubectl-user run pause --image=registry.k8s.io/pause
deployment "pause" created

kubectl-user get pods
No resources found.

kubectl-user get events | head -n 2
LASTSEEN   FIRSTSEEN   COUNT     NAME              KIND         SUBOBJECT                TYPE      REASON                  SOURCE                                  MESSAGE
1m         2m          15        pause-7774d79b5   ReplicaSet                            Warning   FailedCreate            replicaset-controller                   Error creating: pods "pause-7774d79b5-" is forbidden: no providers available to validate pod request
```

**Apa yang terjadi?** Kita telah mengikat Role `psp:unprivileged` untuk `fake-user` kita, kenapa kita mendapatkan kesalahan `Error creating:  pods "pause-7774d79b5-" is forbidden: no providers available to validate pod request`? Jawabannya berada pada sumbernya - `replicaset-controller`. Fake-user berhasil membuat Deployment tersebut (yang berhasil membuat sebuah ReplicaSet), tetapi saat ReplicaSet tersebut akan membuat Pod, ia tidak terotorisasi untuk menggunakan PodSecurityPolicy contoh tersebut.

Untuk memperbaikinya, ikatlah Role `psp:unprivileged` pada ServiceAccount Pod tersebut. Pada kasus ini (karena kita tidak menspesifikasikannya) ServiceAccount-nya adalah `default`:

```shell
kubectl-admin create rolebinding default:psp:unprivileged \
    --role=psp:unprivileged \
    --serviceaccount=psp-example:default
rolebinding "default:psp:unprivileged" created
```

Sekarang, jika kamu memberi waktu ReplicaSet-nya untuk mencoba kembali, pengatur ReplicaSet tersebut seharusnya akan berhasil membuat Pod tersebut.

```shell
kubectl-user get pods --watch
NAME                    READY     STATUS    RESTARTS   AGE
pause-7774d79b5-qrgcb   0/1       Pending   0         1s
pause-7774d79b5-qrgcb   0/1       Pending   0         1s
pause-7774d79b5-qrgcb   0/1       ContainerCreating   0         1s
pause-7774d79b5-qrgcb   1/1       Running   0         2s
```

### Membersihkan

Hapus Namespace tersebut untuk membersihkan sebagian besar sumber daya yang digunakan dalam contoh ini:

```shell
kubectl-admin delete ns psp-example
namespace "psp-example" deleted
```

Perlu diperhatikan bahwa sumber daya `PodSecurityPolicy` tidak diberi Namespace, dan harus dibersihkan secara terpisah:

```shell
kubectl-admin delete psp example
podsecuritypolicy "example" deleted
```

### Contoh-contoh Kebijakan

Berikut adalah kebijakan dengan batasan paling sedikit yang dapat kamu buat, ekuivalen dengan tidak menggunakan _admission controller_ Pod Security Policy:

{{% codenew file="policy/privileged-psp.yaml" %}}

Berikut adalah sebuah contoh kebijakan yang restriktif yang mengharuskan pengguna-pengguna untuk berjalan sebagai pengguna yang _unprivileged_, memblokir kemungkinan eskalasi menjadi _root_, dan mengharuskan penggunaan beberapa mekanisme keamanan.

{{% codenew file="policy/restricted-psp.yaml" %}}

## Referensi Kebijakan

### Privileged

**Privileged** - menentukan bila Container manapun di dalam sebuah Pod dapat mengaktifkan mode _privileged_. Secara bawaan, sebuah Container tidak diizinkan untuk mengakses perangkat apapun pada _host_-nya, tapi sebuah Container yang "_privileged_" akan diberikan akses untuk semua perangkat pada _host_-nya. Hal ini mengizinkan hampir semua akses yang sama dengan proses yang berjalan pada _host_ kepada Container tersebut. Hal ini berfungsi untuk Container-container yang ingin menggunakan kemampuan Linux seperti memanipulasi _network stack_ atau mengakses perangkat-perangkat.
determines if any container in a pod can enable privileged mode.

### Namespace Host

**HostPID** - Mengatur jika Container-container pada Pod dapat berbagi _namespace process ID_ pada _host_. Catatlah bahwa saat dipasangkan dengan ptrace, hal ini dapat digunakan untuk eskalasi _privilege_ di luar kontainer (ptrace secara bawaan tidak diizinkan).

**HostIPC** - Mengatur jika container-container pada Pod dapat berbagi _namespace IPC_ pada _host_.

**HostNetwork** - Mengatur jika Pod dapat menggunakan _namespace_ jaringan pada _host_. Melakukan hal ini akan memberikan Pod akses pada perangkat _loopback_, _service_ yang sedang _listening_ pada _localhost_, dan dapat digunakan untuk mengintai aktivitas jaringan pada Pod-Pod lain pada Node yang sama.

**HostPorts** - Memberikan daftar putih dari berbagai _port_ yang diizinkan pada _namespace_ jaringan pada _host_. Hal ini didefinisikan sebagai sebuah daftar `HostPortRange`, dengan `min`(inklusif) dan `max`(inklusif). Nilai bawaannya adalah tidak ada _host port_ yang diizinkan.

**AllowedHostPaths** - Lihat [Volume dan _file systems_](#volumes-dan-file-systems).

### Volume dan _file system_

**Volume** - Menyediakan sebuah daftar putih dari tipe-tipe Volume yang diizinkan. Nilai-nilai yang diizinkan sesuai dengan sumber Volume yang didefinisikan saat membuat sebuah Volume. Untuk daftar lengkap tipe-tipe Volume, lihat [tipe-tipe Volume](/id/docs/concepts/storage/volumes/#tipe-tipe-volume). Sebagai tambahan, `*` dapat digunakan untuk mengizinkan semua tipe Volume.

**Kumpulan Volume-volume minimal yang direkomendasikan** untuk PodSecurityPolicy baru adalah sebagai berikut:

- configMap
- downwardAPI
- emptyDir
- persistentVolumeClaim
- secret
- projected

{{< warning >}}
PodSecurityPolicy tidak membatasi tipe-tipe objek `PersistentVolume` yang dapat direferensikan oleh `PersistentVolumeClaim`. Hanya pengguna-pengguna yang dipercaya yang boleh diberikan izin untuk membuat objek-objek `PersistentVolume`.
{{< /warning >}}

**FSGroup** - Mengatur grup tambahan yang dipasang ke beberapa volume.

- _MustRunAs_ - Membutuhkan setidaknya satu `range` untuk dapat ditentukan. Menggunakan semua nilai minimum dari `range` yang pertama sebagai nilai bawaannya. Memvalidasikan terhadap semua `range`.
- _MayRunAs_ - Membutuhkan setidaknya satu `range` untuk dapat ditentukan. Mengizinkan `FSGroups` dibiarkan kosong tanpa memberikan nilai bawaan. Memvalidasikan terhadap semua `range` jika nilai `FSGroups` disetel.
- _RunAsAny_ - Tidak ada nilai bawaan yang diberikan. Mengizinkan ID `fsGroup` apapun untuk digunakan.

**AllowedHostPaths** - Memperinci sebuah daftar putih dari _host path_ yang diizinkan untuk digunakan oleh volume-volume `hostPath`. Sebuah daftar kosong berarti tidak ada pembatasan pada _host path_ yang digunakan. Hal ini didefinisikan sebagai sebuah daftar objek-objek dengan sebuah kolom `pathPrefix`, yang mengizinkan volume-volume `hostPath` untuk menambatkan sebuah _path_ yang dimulai dengan sebuah prefiks yang diizinkan, dan sebuah kolom `readOnly` yang menunjukkan bahwa ia harus ditambatkan sebagai _read-only_.
Misalnya:

```yaml
allowedHostPaths:
  # Hal ini mengizinkan "/foo", "/foo/", "/foo/bar" dll., tetapi
  # melarang "/fool", "/etc/foo" dll.
  # "/foo/../" tidak sah.
  - pathPrefix: "/foo"
    readOnly: true # Izinkan hanya tambatan _read-only_
```

{{< warning >}} Ada banyak cara bagi sebuah Container dengan akses yang tidak dibatasi terhadap _host filesystem_-nya untuk dapat melakukan eskalasi _privilege_, termasuk membaca data dari Container-container lain, dan menyalahgunakan kredensial dari _service-service_ sistem, misalnya Kubelet.

Direktori volume `hostPath` yang dapat ditulis mengizinkan container-container untuk menulis ke _filesystem_ melalui cara-cara yang membiarkan mereka melintasi _host filesystem_ di luar `pathPrefix` yang bersangkutan.
`readOnly: true`, tersedia pada Kubernetes 1.11 ke atas, harus digunakan pada **semua** `allowedHostPaths` untuk secara efektif membatasi akses terhadap `pathPrefix` yang diperinci.
{{< /warning >}}

**ReadOnlyRootFilesystem** - Mengharuskan container-container berjalan dengan sebuah _root filesystem_ yang bersifat _read-only_ (yaitu, tanpa lapisan yang dapat ditulis)

### _Driver-driver_ Flexvolume

Hal ini memperinci sebuah daftar putih dari _driver-driver_ Flexvolume yang diizinkan untuk digunakan oleh Flexvolume. Sebuah daftar kosong atau `nil` berarti tidak ada batasan terhadap _driver-driver_ tersebut.
Pastikan kolom [`volumes`](#volume-dan-file-system) berisi tipe volumenya; Jika tidak, tidak ada _driver_ Flexvolume yang diizinkan.

Misalnya:

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: allow-flex-volumes
spec:
  # ... kolom kolom lainnya
  volumes:
    - flexVolume
  allowedFlexVolumes:
    - driver: example/lvm
    - driver: example/cifs
```

### Pengguna dan Grup

**RunAsUser** - Mengatur ID pengguna mana yang digunakan untuk menjalankan container-container.

- _MustRunAs_ - Membutuhkan setidaknya satu `range` untuk dapat ditentukan. Menggunakan semua nilai minimum dari `range` yang pertama sebagai nilai bawaannya. Memvalidasikan terhadap semua `range`.
- _MustRunAsNonRoot_ - Mengharuskan Pod diajukan dengan nilai `runAsUser` yang bukan nol, atau memiliki petunjuk `USER` didefinisikan (dengan UID numerik) di dalam _image_. Pod-Pod yang belum memperinci `runAsNonRoot` atau `runAsUser` akan dimutasikan untuk menyetel `runAsNonRoot=true` sehingga membutuhkan petunjuk `USER` dengan nilai numerik bukan nol di dalam Container. Tidak ada nilai bawaan yang diberikan. Menyetel `allowPrivilegeEscalation=false` sangat disarankan dengan strategi ini.
- _RunAsAny_ - Tidak ada nilai bawaan yang diberikan. Mengizinkan `runAsUser` apapun untuk digunakan.

**RunAsGroup** - Mengatur ID grup primer mana yang digunakan untuk menjalankan Container-container.

- _MustRunAs_ - Membutuhkan setidaknya satu `range` untuk dapat ditentukan. Menggunakan semua nilai minimum dari `range` yang pertama sebagai nilai bawaannya. Memvalidasikan terhadap semua `range`.
- _MayRunAs_ - Tidak memerlukan `RunAsGroup` untuk diperinci. Tetapi, saat `RunAsGroup` diperinci, mereka harus berada pada `range` yang didefinisikan.
- _RunAsAny_ - Tidak ada nilai bawaan yang diberikan. Mengizinkan `runAsGroup` apapun untuk digunakan.

**SupplementalGroups** - Mengatur ID grup mana saja yang ditambah ke Container-container.

- _MustRunAs_ - Membutuhkan setidaknya satu `range` untuk dapat ditentukan. Menggunakan semua nilai minimum dari `range` yang pertama sebagai nilai bawaannya. Memvalidasikan terhadap semua `range`.
- _MayRunAs_ - Membutuhkan setidaknya satu `range` untuk dapat ditentukan. Mengizinkan `supplementalGroups` dibiarkan kosong tanpa memberikan nilai bawaan. Memvalidasikan terhadap semua `range` jika nilai `supplementalGroup` disetel.
- _RunAsAny_ - Tidak ada nilai bawaan yang diberikan. Mengizinkan ID `supplementalGroups` apapun untuk digunakan.

### Eskalasi _Privilege_

Opsi ini mengatur opsi Container `allowPrivilegeEscalation`. Nilai `bool` ini secara langsung mengatur apakah _flag_ [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt) disetel pada proses Container tersebut. _Flag_ ini akan mencegah program `setuid` mengganti ID pengguna efektif, dan mencegah berkas-berkas untuk memungkinkan kemampuan tambahan (misalnya, ini akan mencagah penggunaan peralatan `ping`). Perilaku ini dibutuhkan untuk memaksakan `MustRunAsNonRoot`.

**AllowPrivilegeEscalation** - Membatasi apakah seorang pengguna diizinkan untuk menyetel konteks keamanan dari sebuah Container menjadi `allowPrivilegeEscalation=true`. Hal ini memiliki nilai bawaan untuk diizinkan, agar tidak merusak program `setuid`. Menyetel ini menjadi `false` memastikan bahwa tidak ada proses _child_ dari sebuah Container dapat memperoleh lebih banyak _privilege_ dari _parent_-nya.

**DefaultAllowPrivilegeEscalation** - Menyetel nilai bawaan untuk opsi `allowPrivilegeEscalation`. Perilaku bawaan tanpa hal ini adalah untuk mengizinkan eskalasi _privilege_ agar tidak merusak program `setuid`. Jika perilaku ini tidak diinginkan, kolom ini dapat digunakan untuk menyetel nilai bawaan `allowPrivilegeEscalation` agar melarang eskalasi, sementara masih mengizinkan Pod-Pod untuk meminta `allowPrivilegeEscalation` secara eksplisit.

### Kemampuan-kemampuan

Kemampuan-kemampuan Linux menyediakan perincian yang detail dari _privilege-privilege_ yang biasa dikaitkan dengan `superuser`. Beberapa dari kemampuan-kemampuan ini dapat digunakan untuk mengeskalasi _privilege-privilege_ atau untuk _container breakout_, dan dapat dibatasi oleh PodSecurityPolicy. Untuk lebih lanjut tentang kemampuan-kemampuan Linux, lihat [capabilities(7)](http://man7.org/linux/man-pages/man7/capabilities.7.html).

Kolom-kolom berikut mengambil daftar kemampuan-kemampuan, diperincikan sebagai nama kemampuannya dalam ALL_CAPS tanpa awalan `CAP_`.

**AllowedCapabilities** - Menyediakan sebuah daftar putih dari kemampuan-kemampuan yang dapat ditambahkan pada sebuah Container. Kumpulan kemampuan bawaan secara implisit diizinkan. Kumpulan kosong berarti tidak ada kemampuan tambahan yang dapat ditambahkan selain bawaannya. `*` dapat digunakan untuk mengizinkan semua kemampuan.

**RequiredDropCapabilities** - Kemampuan-kemampuan yang harus dihapus dari Container-container. Kemampuan-kemampuan ini dihapus dari kumpulan bawaan, dan tidak boleh ditambahkan. Kemampuan-kemampuan yang terdaftar di `RequiredDropCapabilities` tidak boleh termasuk di dalam `AllowedCapabilities` atau `DefaultAddCapabilities`.

**DefaultAddCapabilities** - Kemampuan-kemampuan yang ditambahkan pada Container-container secara bawaan, sebagai tambahan untuk bawaan _runtime_. Lihat [dokumentasi Docker](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) untuk daftar kemampuan bawaan saat menggunakan _runtime_ Docker.

### SELinux

- _MustRunAs_ - Mengharuskan penyetelan `seLinuxOptions`. Menggunakan `seLinuxOptions` sebagai nilai bawaannya. Memvalidasi terhadap `seLinuxOptions`.
- _RunAsAny_ - Tidak ada nilai bawaan yang disediakan. Mengizinkan nilai `seLinuxOptions` apapun untuk diberikan.

### AllowedProcMountTypes

`allowedProcMountTypes` adalah sebuah daftar putih dari ProcMountType yang diizinkan. Nilai kosong atau `nil` menunjukkan bahwa hanya `DefaultProcMountType` yang boleh digunakan.

`DefaultProcMount` menggunakan nilai bawaan _container runtime_ untuk _readonly_ dan _masked paths_ untuk `/proc`. Kebanyakan _runtime_ Container melakukan _mask_ terhadap beberapa _path_ di dalam `/proc` untuk menghindari _security exposure_ dari perangkat-perangkat atau informasi khusus yang tidak disengaja. Hal ini ditandai dengan nilai _string_ `Default`.

Satu-satunya ProcMountType lainnya adalah `UnmaskedProcMount`, yang melangkahi perilaku _masking_ bawaan dari _runtime_ Container dan memastikan bahwa `/proc` yang baru dibuat tetap utuh tanpa perubahan. Hal ini ditandai dengan nilai _string_ `Unmasked`.

### AppArmor

Diatur melalui anotasi pada PodSecurityPolicy. Lihat [dokumentasi AppArmor](/docs/tutorials/clusters/apparmor/#podsecuritypolicy-annotations).

### Seccomp

Penggunaan profil-profil _seccomp_ di dalam Pod-Pod dapat diatur melalui anotasi pada PodSecurityPolicy.
_Seccomp_ adalah fitur _Alpha_ di Kubernetes.

**seccomp.security.alpha.kubernetes.io/defaultProfileName** - Anotasi yang menunjukkan profil _seccomp_ bawaan untuk diterapkan kepada container-container. Nilai-nilai yang mungkin adalah:

- `unconfined` - _Seccomp_ tidak diterapkan pada proses-proses di container (ini adalah bawaan di Kubernetes), jika tidak ada alternatif yang diberikan.
- `runtime/default` - Profil _runtime_ container bawaan digunakan.
- `docker/default` - Profil bawaan _seccomp_ Docker digunakan. Sudah kedaluwarsa sejak Kubernetes 1.11. Gunakan `runtime/default` sebagai gantinya.
- `localhost/<path>` - Menentukan sebuah profil sebagai sebuah berkas pada Node yang berlokasi pada `<seccomp_root>/<path>`, di mana `<seccomp_root>` didefinisikan melalui _flag_ `--seccomp-profile-root` pada Kubelet.

**seccomp.security.alpha.kubernetes.io/allowedProfileNames** - Anotasi yang menunjukkan nilai-nilai mana yang diizinkan untuk anotasi _seccomp_ pada Pod. Ditentukan sebagai sebuah daftar nilai yang diizinkan yang dibatasi dengan tanda koma. Nilai-nilai yang dimungkinkan adalah yang terdaftar di atas, ditambah dengan `*` untuk mengizinkan semua profil. Ketiadaan anotasi ini berarti nilai bawaannya tidak dapat diubah.

### Sysctl

Secara bawaan, semua _sysctl_ yang aman diizinkan.

- `forbiddenSysctls` - mengecualikan _sysctl-sysctl_ tertentu. Kamu dapat melarang kombinasi dari _sysctl-sysctl_ yang aman maupun tidak aman pada daftar ini. Untuk melarang menyetel _sysctl_ apapun, gunakan nilai `*`.
- `allowedUnsafeSysctls` - mengizinkan _sysctl-sysctl_ tertentu yang telah dilarang oleh daftar bawaan, selama nilainya tidak terdaftar di dalam `forbiddenSysctls`.

Lihat [dokumentasi Sysctl](/docs/concepts/cluster-administration/sysctl-cluster/#podsecuritypolicy).


