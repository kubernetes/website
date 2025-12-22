---
title: User Namespaces
reviewers:
content_type: concept
weight: 160
min-kubernetes-server-version: v1.25
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.30" state="beta" >}}

Halaman ini menjelaskan bagaimana Namespace pengguna digunakan dalam pod Kubernetes. Namespace pengguna
mengisolasi pengguna yang berjalan di dalam kontainer dari pengguna
yang berada di _host_.

Proses yang berjalan sebagai _root_ dalam kontainer dapat berjalan sebagai pengguna lain (_non-root_)
di _host_; dengan kata lain, proses tersebut memiliki hak istimewa penuh untuk operasi
di dalam Namespace pengguna, tetapi tidak memiliki hak istimewa untuk operasi di luar
Namespace.

Kamu dapat menggunakan fitur ini untuk mengurangi kerusakan yang dapat ditimbulkan oleh kontainer yang disusupi terhadap
_host_ atau pod lain dalam node yang sama. Terdapat [beberapa kerentanan
keamanan][KEP-vulns] yang dinilai **HIGH** atau **CRITICAL** yang tidak
dapat dieksploitasi saat Namespace pengguna aktif. Namespace pengguna diharapkan juga akan
memitigasi beberapa kerentanan di masa mendatang.

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

<!-- body -->
## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

Ini adalah fitur khusus Linux dan dukungan diperlukan di Linux untuk pemasangan idmap pada
sistem berkas yang digunakan. Artinya:

* Pada node, sistem berkas yang kamu gunakan untuk `/var/lib/kubelet/pods/`, atau
direktori khusus yang kamu konfigurasikan untuk ini, memerlukan dukungan pemasangan idmap.
* Semua sistem berkas yang digunakan dalam volume pod harus mendukung pemasangan idmap.

Dalam praktiknya, ini berarti kamu memerlukan setidaknya Linux 6.3, karena tmpfs mulai mendukung
pemasangan idmap pada versi tersebut. Ini biasanya diperlukan karena beberapa fitur Kubernetes
menggunakan tmpfs (token akun layanan yang dipasang secara _default_ menggunakan
tmpfs, Secrets menggunakan tmpfs, dll.)

Beberapa sistem berkas populer yang mendukung pemasangan idmap di Linux 6.3 adalah: btrfs,
ext4, xfs, fat, tmpfs, overlayfs.

Selain itu, _runtime_ kontainer dan _runtime_ OCI yang mendasarinya harus mendukung
namespace pengguna. _Runtime_ OCI berikut menawarkan dukungan:

* [crun](https://github.com/containers/crun) versi 1.9 atau lebih tinggi (disarankan versi 1.13+).
* [runc](https://github.com/opencontainers/runc) versi 1.2 atau lebih tinggi.

{{< note >}}
Beberapa _runtime_ OCI tidak menyertakan dukungan yang diperlukan untuk menggunakan namespace pengguna di
pod Linux. Jika kamu menggunakan Kubernetes terkelola, atau telah mengunduhnya dari paket
dan mengaturnya sendiri, ada kemungkinan node di klaster kamu menggunakan _runtime_ yang tidak
menyertakan dukungan ini. {{< /note >}}

Untuk menggunakan namespace pengguna dengan Kubernetes, kamu juga perlu menggunakan CRI
_{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}_
untuk menggunakan fitur ini dengan pod Kubernetes:

* containerd: versi 2.0 (dan yang lebih baru) mendukung namespace pengguna untuk kontainer.
* CRI-O: versi 1.25 (dan yang lebih baru) mendukung namespace pengguna untuk kontainer.

Kamu dapat melihat status dukungan namespace pengguna di cri-dockerd yang dilacak dalam [_issue_][CRI-dockerd-issue]
di GitHub.

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74

## Pengenalan

Namespace pengguna adalah fitur Linux yang memungkinkan pemetaan pengguna di dalam kontainer ke
pengguna lain di _host_. Lebih lanjut, kapabilitas yang diberikan kepada pod di
namespace pengguna hanya valid di dalam namespace tersebut dan tidak berlaku di luarnya.

Sebuah pod dapat memilih untuk menggunakan namespace pengguna dengan menyetel kolom `pod.spec.hostUsers`
ke `false`.

Kubelet akan memilih UID/GID _host_ tempat pod dipetakan, dan akan melakukannya dengan cara
untuk menjamin bahwa tidak ada dua pod pada node yang sama yang menggunakan pemetaan yang sama.

Kolom `runAsUser`, `runAsGroup`, `fsGroup`, dll. di `pod.spec` selalu
merujuk ke pengguna di dalam kontainer. Pengguna ini akan digunakan untuk pemasangan volume
(ditentukan dalam `pod.spec.volumes`) dan oleh karena itu UID/GID _host_ tidak akan
berpengaruh pada penulisan/pembacaan dari volume yang dapat dipasang oleh pod. Dengan kata lain,
inodes yang dibuat/dibaca dalam volume yang dipasang oleh pod akan sama seperti jika
pod tidak menggunakan namespace pengguna.

Dengan cara ini, sebuah pod dapat dengan mudah mengaktifkan dan menonaktifkan namespace pengguna (tanpa memengaruhi
kepemilikan berkas volumenya) dan juga dapat berbagi volume dengan pod tanpa namespace
pengguna hanya dengan mengatur pengguna yang sesuai di dalam kontainer
(`RunAsUser`, `RunAsGroup`, `fsGroup`, dll.). Ini berlaku untuk semua volume yang dapat dipasang oleh pod,
termasuk `hostPath` (jika pod diizinkan untuk memasang volume `hostPath`).

Secara _default_, UID/GID yang valid saat fitur ini diaktifkan adalah rentang 0-65535. Hal ini berlaku untuk berkas dan proses (`runAsUser`, `runAsGroup`, dll.).

Berkas yang menggunakan UID/GID di luar rentang ini akan dianggap sebagai milik
ID overflow, biasanya 65534 (dikonfigurasi dalam `/proc/sys/kernel/overflowuid` dan
`/proc/sys/kernel/overflowgid`). Namun, berkas
tersebut tidak dapat dimodifikasi, bahkan dengan menjalankannya sebagai pengguna/grup 65534.

Jika rentang 0-65535 diperluas dengan tombol konfigurasi, batasan
yang disebutkan di atas berlaku untuk rentang yang diperluas tersebut.

Sebagian besar aplikasi yang perlu dijalankan sebagai root tetapi tidak mengakses namespace atau sumber daya _host_ lain,
seharusnya tetap berjalan dengan baik tanpa perlu perubahan apa pun
jika namespace pengguna diaktifkan.

## Memahami namespace pengguna untuk pod {#pods-and-userns}

Beberapa _runtime_ kontainer dengan konfigurasi _default_-nya (seperti Docker Engine,
containerd, CRI-O) menggunakan namespace Linux untuk isolasi. Teknologi lain juga tersedia
dan dapat digunakan dengan _runtime_ tersebut (misalnya, Kata Containers menggunakan VM, bukan namespace
Linux). Halaman ini berlaku untuk _runtime_ kontainer yang menggunakan namespace Linux
untuk isolasi.

Saat membuat pod, secara _default_, beberapa namespace baru digunakan untuk isolasi:
namespace jaringan untuk mengisolasi jaringan kontainer, namespace PID untuk
mengisolasi tampilan proses, dll. Jika namespace pengguna digunakan, ini akan
mengisolasi pengguna di kontainer dari pengguna di node.

Ini berarti kontainer dapat dijalankan sebagai _root_ dan dipetakan ke pengguna _non-root_ di
_host_. Di dalam kontainer, proses akan mengira dirinya berjalan sebagai _root_ (dan
oleh karena itu, alat seperti `apt`, `yum`, dll. berfungsi dengan baik), padahal kenyataannya proses tersebut
tidak memiliki hak istimewa di _host_. Kamu dapat memverifikasi hal ini, misalnya, jika kamu
memeriksa pengguna mana yang dijalankan oleh proses kontainer dengan menjalankan `ps aux` dari
_host_. Pengguna yang ditampilkan `ps` tidak sama dengan pengguna yang kamu lihat jika kamu
mengeksekusi perintah `id` di dalam kontainer.

Abstraksi ini membatasi apa yang dapat terjadi, misalnya, jika kontainer berhasil
keluar ke _host_. Mengingat kontainer berjalan sebagai pengguna tanpa hak istimewa
di _host_, maka apa yang dapat dilakukannya terhadap _host_ menjadi terbatas.

Lebih lanjut, karena pengguna di setiap pod akan dipetakan ke pengguna
berbeda yang tidak tumpang tindih di _host_, maka apa yang dapat mereka lakukan terhadap pod lain juga terbatas.

Kemampuan yang diberikan kepada pod juga terbatas pada namespace pengguna pod dan
sebagian besar tidak valid di luarnya, beberapa bahkan sepenuhnya batal. Berikut dua contoh:
- `CAP_SYS_MODULE` tidak berpengaruh jika diberikan kepada pod menggunakan
namespace pengguna, pod tersebut tidak dapat memuat modul kernel.
- `CAP_SYS_ADMIN` terbatas pada namespace pengguna pod dan tidak valid di luarnya.

Tanpa menggunakan namespace pengguna, kontainer yang berjalan sebagai _root_, dalam kasus
_breakout_ kontainer, memiliki hak akses _root_ pada node tersebut. Dan jika beberapa kemampuan diberikan kepada kontainer, kemampuan tersebut juga valid pada _host_. Semua hal ini
tidak berlaku ketika kita menggunakan namespace pengguna.

Jika kamu ingin mengetahui detail lebih lanjut tentang perubahan apa saja yang terjadi ketika namespace pengguna digunakan, lihat `man 7 user_namespaces`.

## Siapkan node untuk mendukung namespace pengguna

Secara _default_, kubelet menetapkan UID/GID pod di atas rentang 0-65535, berdasarkan
asumsi bahwa berkas dan proses _host_ menggunakan UID/GID dalam rentang
ini, yang merupakan standar untuk sebagian besar distribusi Linux. Pendekatan ini mencegah
tumpang tindih antara UID/GID _host_ dan pod.

Menghindari tumpang tindih ini penting untuk mengurangi dampak kerentanan seperti
[CVE-2021-25741][CVE-2021-25741], di mana pod berpotensi membaca berkas
sembarangan di _host_. Jika UID/GID pod dan _host_ tidak tumpang tindih,
apa yang dapat dilakukan pod akan terbatas: UID/GID pod tidak akan cocok dengan
pemilik/grup berkas _host_.

Kubelet dapat menggunakan rentang khusus untuk ID pengguna dan ID grup untuk pod. Untuk
mengonfigurasi rentang khusus, node harus memiliki:

* Pengguna `kubelet` di sistem (kamu tidak dapat menggunakan nama pengguna lain di sini)
* Biner `getsubids` terpasang (bagian dari [shadow-utils][shadow-utils]) dan
di `PATH` untuk biner kubelet.
* Konfigurasi UID/GID subordinat untuk pengguna `kubelet` (lihat
[`man 5 subuid`](https://man7.org/linux/man-pages/man5/subuid.5.html) dan
[`man 5 subgid`](https://man7.org/linux/man-pages/man5/subgid.5.html)).

Pengaturan ini hanya mengumpulkan konfigurasi rentang UID/GID dan tidak mengubah
pengguna yang menjalankan `kubelet`.

Kamu harus mengikuti beberapa batasan untuk rentang ID subordinat yang kamu tetapkan
kepada pengguna `kubelet`:

* ID pengguna subordinat, yang memulai rentang UID untuk Pod, **harus** merupakan kelipatan
65536 dan juga harus lebih besar dari atau sama dengan 65536. Dengan kata lain,
kamu tidak dapat menggunakan ID apa pun dari rentang 0-65535 untuk Pod; kubelet
memaksakan batasan ini untuk mempersulit pembuatan konfigurasi
yang tidak aman secara tidak sengaja.

* Jumlah ID subordinat harus kelipatan 65536.

* Jumlah ID subordinat harus minimal `65536 x <maxPods>` di mana `<maxPods>`
adalah jumlah maksimum pod yang dapat berjalan pada node tersebut.

* Kamu harus menetapkan rentang yang sama untuk ID pengguna dan ID grup. Tidak masalah
jika pengguna lain memiliki rentang ID pengguna yang tidak sesuai dengan rentang ID grup.

* Tidak ada rentang yang ditetapkan yang boleh tumpang tindih dengan penugasan lainnya.

* Konfigurasi subordinat harus hanya satu baris. Dengan kata lain, kamu tidak dapat
memiliki beberapa rentang.

Misalnya, kamu dapat mendefinisikan `/etc/subuid` dan `/etc/subgid` agar keduanya memiliki
entri berikut untuk pengguna `kubelet`:

```
# Formatnya adalah
#   name:firstID:count of IDs
# di mana
# - firstID adalah 65536 (nilai minimum yang dimungkinkan)
# - count of IDs adalah 110 * 65536
# (110 adalah batas _default_ untuk jumlah pod pada node)

kubelet:65536:7208960
```

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980
[shadow-utils]: https://github.com/shadow-maint/shadow

## Jumlah ID untuk setiap Pod
Mulai Kubernetes v1.33, jumlah ID untuk setiap Pod dapat diatur di
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/).

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
userNamespaces:
idsPerPod: 1048576
```

Nilai `idsPerPod` (uint32) harus kelipatan 65536.
Nilai _default_-nya adalah 65536.
Nilai ini hanya berlaku untuk kontainer yang dibuat setelah kubelet dimulai dengan
`KubeletConfiguration` ini.
Kontainer yang sedang berjalan tidak terpengaruh oleh konfigurasi ini.

Di Kubernetes sebelum v1.33, jumlah ID untuk setiap Pod dikodekan secara permanen ke
65536.

## Integrasi dengan pemeriksaan penerimaan keamanan Pod

{{< feature-state state="alpha" for_k8s_version="v1.29" >}}

Untuk Pod Linux yang mengaktifkan namespace pengguna, Kubernetes melonggarkan penerapan
[Standar Keamanan Pod](/docs/concepts/security/pod-security-standards) secara terkendali.
Perilaku ini dapat dikendalikan oleh [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/)
`UserNamespacesPodSecurityStandards`, yang memungkinkan pengguna akhir untuk memilih lebih awal. Admin harus memastikan bahwa namespace pengguna diaktifkan oleh semua node
di dalam klaster jika menggunakan _feature gate_.

Jika kamu mengaktifkan _feature gate_ terkait dan membuat Pod yang menggunakan namespace pengguna, kolom-kolom berikut tidak akan dibatasi bahkan dalam konteks yang menerapkan standar keamanan pod
_Baseline_ atau _Restricted_. Perilaku ini tidak
menimbulkan masalah keamanan karena `root` di dalam Pod dengan namespace pengguna
sebenarnya merujuk ke pengguna di dalam kontainer, yang tidak pernah dipetakan ke
pengguna istimewa di _host_. Berikut daftar kolom yang **bukan** diperiksa untuk Pod dalam
kondisi tersebut:

- `spec.securityContext.runAsNonRoot`
- `spec.containers[*].securityContext.runAsNonRoot`
- `spec.initContainers[*].securityContext.runAsNonRoot`
- `spec.ephemeralContainers[*].securityContext.runAsNonRoot`
- `spec.securityContext.runAsUser`
- `spec.containers[*].securityContext.runAsUser`
- `spec.initContainers[*].securityContext.runAsUser`
- `spec.ephemeralContainers[*].securityContext.runAsUser`

## Batasan

Saat menggunakan namespace pengguna untuk pod, penggunaan namespace _host_ lain tidak diperbolehkan. Khususnya, jika kamu menetapkan `hostUsers: false`, kamu tidak
diizinkan untuk menetapkan salah satu dari:

* `hostNetwork: true`
* `hostIPC: true`
* `hostPID: true`

Tidak ada kontainer yang dapat menggunakan `volumeDevices` (volume blok mentah, seperti /dev/sda).
Ini mencakup semua _array_ kontainer dalam spesifikasi pod:
* `containers`
* `initContainers`
* `ephemeralContainers`

## Metrik dan Observabilitas

Kubelet mengekspor dua metrik Prometheus khusus untuk namespace pengguna:
* `started_user_namespaced_pods_total`: penghitung yang melacak jumlah pod namespace pengguna yang dicoba dibuat.
* `started_user_namespaced_pods_errors_total`: penghitung yang melacak jumlah kesalahan saat membuat pod namespace pengguna.

## {{% heading "whatsnext" %}}

* Lihat [Menggunakan Namespace Pengguna dengan Pod](/docs/tasks/configure-pod-container/user-namespaces/)
