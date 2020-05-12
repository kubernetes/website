---
title: Mengonfigurasi Konteks Keamanan untuk Pod atau Kontainer
content_template: templates/task
weight: 80
---

{{% capture overview %}}

Konteks keamanan menentukan wewenang dan aturan kontrol akses untuk sebuah Pod 
atau kontainer. Aturan konteks keamanan meliputi hal-hal berikut ini namun tidak terbatas pada hal-hal tersebut:

* Diskresi kontrol akses: Izin untuk mengakses objek, seperti sebuah _file_, yang didasarkan pada
[ID pengguna atau_user ID_ (UID) dan ID grup atau _group ID_ (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [_Security Enhanced Linux_ (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux): Dimana objek diberi label keamanan.

* Menjalankan dengan wewenang atau tidak dengan wewenang.

* [Kemampuan Linux](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): Memberi sebuah proses beberapa wewenang, namun tidak semua wewenang dari pengguna _root_.

* [AppArmor](/docs/tutorials/clusters/apparmor/): Menggunakan profil program untuk membatasi kemampuan dari masing-masing program.

* [Seccomp](https://en.wikipedia.org/wiki/Seccomp): Menyaring panggilan sistem (_system calls_) dari suatu proses.

* AllowPrivilegeEscalation: Mengontrol apakah suatu proses dapat memperoleh lebih banyak wewenang daripada proses induknya. Pilihan ini mengontrol secara langsung apakah opsi [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt) diaktifkan pada proses dalam kontainer. AllowPrivilegeEscalation selalu aktif (_true_) ketika kontainer: 1) berjalan dengan wewenang ATAU 2) memiliki `CAP_SYS_ADMIN`.

* readOnlyRootFilesystem: _Mount_ _file_ sistem _root_ dari sebuah kontainer hanya sebatas untuk dibaca saja.

Poin-poin di atas bukanlah sekumpulan lengkap dari aturan konteks keamanan - silakan lihat [SecurityContext](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#securitycontext-v1-core) untuk daftar yang lebih lengkap.

Untuk informasi lebih lanjut tentang mekanisme keamanan pada Linux, silahkan lihat
[tinjauan umum fitur keamanan pada Kernel Linux](https://www.linux.com/learn/overview-linux-kernel-security-features)

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Mengatur konteks keamanan untuk Pod

Untuk menentukan aturan keamanan pada Pod, masukkan bagian `securityContext`
dalam spesifikasi Pod. Bagian `securityContext` adalah sebuah objek dari
[PodSecurityContext](/docs/reference/generate/kubernetes-api/{{<param"version">}}/#podsecuritycontext-v1-core).
Aturan keamanan yang kamu tetapkan untuk Pod akan berlaku untuk semua kontainer dalam Pod tersebut.
Berikut ini adalah _file_ konfigurasi untuk Pod yang memiliki _volume_ `securityContext` dan `emptyDir`:

{{< codenew file="pods/security/security-context.yaml" >}}

Dalam _file_ konfigurasi ini, bagian `runAsUser` menentukan bahwa dalam setiap kontainer pada
Pod, semua proses dijalankan oleh ID pengguna 1000. Bagian `runAsGroup` menentukan grup utama dengan ID 3000 untuk
semua proses dalam setiap kontainer pada Pod. Jika bagian ini diabaikan, maka ID grup utama dari kontainer
akan berubah menjadi _root_(0). _File_ apa pun yang dibuat juga akan dimiliki oleh pengguna dengan ID 1000 dan grup dengan ID 3000 ketika `runAsGroup` ditentukan.
Pada saat bagian `fsGroup` ditentukan, semua proses kontainer juga merupakan bagian dari grup tambahan dengan ID 2000.
Pemilik dari _volume_ `/data/demo` dan _file_ apa pun yang dibuat dalam _volume_ tersebut adalah grup dengan ID 2000.

Buatlah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

Verifikasi bahwa kontainer dari Pod sedang berjalan:

```shell
kubectl get pod security-context-demo
```
Dapatkan _shell_ dari kontainer yang sedang berjalan:

```shell
kubectl exec -it security-context-demo -- sh
```

Pada _shell_ kamu, lihat daftar proses yang berjalan:

```shell
ps
```

Tampilan menunjukkan bahwa proses dijalankan oleh pengguna dengan ID 1000, dimana merupakan nilai dari bagian `runAsUser`:

```shell
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

Pada _shell_ kamu, pindahkan ke direktori `/data`, dan lihat isi dari direktori tersebut:

```shell
cd /data
ls -l
```

Tampilan menunjukkan bahwa direktori `/data/demo` memiliki grup dengan ID 2000, dimana merupakan
nilai dari bagian `fsGroup`.

```shell
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

Pada _shell_ kamu, pindahkan ke direktori `/data/demo`, dan buatlah _file_ didalamnya:

```shell
cd demo
echo hello > testfile
```

Lihatlah daftar _file_ dalam direktori `/data/demo`:

```shell
ls -l
```

Tampilan menunjukkan bahwa `testfile` memiliki grup dengan ID 2000, dimana merupakan nilai dari bagian `fsGroup`.

```shell
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

Jalankan perintah berikut ini:

```shell
$ id
uid=1000 gid=3000 groups=2000
```

Kamu akan melihat bahwa nilai _gid_ adalah 3000 yang sama dengan bagian `runAsGroup`. Jika `runAsGroup` diabaikan maka nilai _gid_ akan
tetap bernilai 0(_root_) dan proses akan dapat berinteraksi dengan _file-file_ yang dimiliki oleh grup root(0) dan yang memiliki
izin grup seperti dengan grup root(0).

Keluarlah dari _shell_ kamu:

```shell
exit
```

## Melakukan konfigurasi izin _volume_ dan kebijakan perubahan kepemilikan untuk Pod

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

Secara bawaan, Kubernetes mengubah kepemilikan dan izin secara rekursif untuk konten masing-masing
_volume_ untuk mencocokkan `fsGroup` yang ditentukan dalam `securityContext` dari Pod pada saat _volume_ itu
di-_mounted_. Untuk _volume_ yang besar, memeriksa dan mengubah kepemilikan dan izin dapat memerlukan waktu yang sangat lama,
sehingga memperlambat proses menjalankan Pod. Kamu dapat menggunakan bagian `fsGroupChangePolicy` dalam sebuah `securityContext`
untuk mengontrol bagaimana cara Kubernetes untuk memeriksa dan mengelola kepemilikan dan izin
untuk _volume_ tersebut.

**fsGroupChangePolicy** - `fsGroupChangePolicy` mendefinisikan perilaku untuk mengubah kepemilikan dan izin volume
sebelum diekspos di dalam sebuah Pod. Bagian ini hanya berlaku untuk tipe _volume_ yang mendukung
`fsGroup` untuk mengontrol kepemilikan dan izin. Bagian ini memiliki dua kemungkinan nilai:

* _OnRootMismatch_: Hanya mengubah izin dan kepemilikan jika izin dan kepemilikan dari direktori _root_ tidak sesuai dengan izin _volume_ yang diharapkan. Hal ini dapat membantu mempersingkat waktu yang diperlukan untuk mengubah kepemilikan dan izin _volume_.
* _Always_: Selalu mengubah izin dan kepemilikan _volume_ ketika volume sudah di-_mounted_.

Sebagai contoh:

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

Ini adalah fitur alfa. Untuk menggunakannya, silahkan aktifkan [gerbang fitur](/docs/reference/command-line-tools-reference/feature-gates/) `ConfigurableFSGroupPolicy` untuk kube-api-server, kube-controller-manager, dan kubelet.

{{< note >}}
Bagian ini tidak berpengaruh pada tipe _volume_ sementara (_ephemeral_) seperti
[`secret`](https://kubernetes.io/docs/concepts/storage/volumes/#secret),
[`configMap`](https://kubernetes.io/docs/concepts/storage/volumes/#configmap),
dan [`emptydir`](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir).
{{< /note >}}


## Mengatur konteks keamanan untuk kontainer

Untuk menentukan aturan keamanan untuk suatu kontainer, sertakan bagian `securityContext`
dalam manifes kontainer. Bagian `securityContext` adalah sebuah objek
[SecurityContext](/docs/reference/generate/kubernetes-api/{{<param"version">}}/#securitycontext-v1-core).
Aturan keamanan yang kamu tentukan untuk kontainer hanya berlaku untuk
kontainer secara individu, dan aturan tersebut menimpa aturan yang dibuat pada tingkat Pod apabila
ada aturan yang tumpang tindih. Aturan pada kontainer tidak berpengaruh pada _volume_ pada Pod.

Berikut ini adalah _file_ konfigurasi untuk Pod yang hanya memiliki satu kontainer. Keduanya baik Pod
dan kontainer memiliki bagian `securityContext` seperti berikut:

{{< codenew file="pods/security/security-context-2.yaml" >}}

Buatlah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

Verifikasi bahwa kontainer dalam Pod sedang berjalan:

```shell
kubectl get pod security-context-demo-2
```

Dapatkan _shell_ ke kontainer yang sedang berjalan:

```shell
kubectl exec -it security-context-demo-2 -- sh
```

Pada _shell_ kamu, lihat daftar proses yang sedang berjalan:

```
ps aux
```

Tampilan menunjukkan bahwa proses dijalankan oleh user dengan ID 2000, yang merupakan
nilai dari `runAsUser` seperti yang disebutkan untuk kontainer. Nilai tersebut menimpa nilai ID 1000 seperti yang
disebutkan untuk Pod.

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

Keluar dari _shell_ anda:

```shell
exit
```

## Sekumpulan kemampuan untuk kontainer

Dengan menggunakan [kemampuan Linux](http://man7.org/linux/man-pages/man7/capabilities.7.html),
kamu dapat memberikan wewenang tertentu kepada suatu proses tanpa memberikan semua wewenang
dari pengguna _root_. Untuk menambah atau menghapus kemampuan Linux pada suatu kontainer, masukkan
bagian `capabilities` pada `securityContext` dari manifes kontainer.

Pertama, lihatlah apa yang terjadi ketika kamu tidak menyertakan bagian `capabilities`.
Berikut ini adalah _file_ konfigurasi yang tidak menambah atau mengurangi kemampuan apa pun dari kontainer:

{{< codenew file="pods/security/security-context-3.yaml" >}}

Buatlah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

Verifikasi apakah kontainer dari Pod tersebut berjalan:

```shell
kubectl get pod security-context-demo-3
```

Masuk ke dalam _shell_ dari kontainer yang berjalan: 

```shell
kubectl exec -it security-context-demo-3 -- sh
```

Dalam _sheel_ tersebut, lihatlah daftar proses yang berjalan:

```shell
ps aux
```

Tampilan menunjukkan ID dari proses atau _process IDs_ (PIDs) untuk kontainer tersebut:

```shell
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

Dalam _shell_ kamu, lihatkan status dari proses dengan ID 1:

```shell
cd /proc/1
cat status
```

Tampilan menunjukkan _bitmap_ kemampuan untuk proses tersebut:

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

Buatlah catatan untuk _bitmap_ kemampuan tersebut, dan keluarlah dari _shell_ anda:

```shell
exit
```

Selanjutnya, jalankan kontainer yang sama seperti dengan kontainer sebelumnya, namun
kontainer ini memiliki kemampuan tambahan yang sudah ditetapkan.

Berikut ini adalah _file_ konfigurasi untuk Pod yang hanya menjalankan satu kontainer. Konfigurasi
ini menambahkan kapabilitas `CAP_NET_ADMIN` dan` CAP_SYS_TIME`:

{{< codenew file="pods/security/security-context-4.yaml" >}}

Buatlah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

Masuk ke dalam _shell_ dari kontainer yang berjalan: 

```shell
kubectl exec -it security-context-demo-4 -- sh
```

Dalam _shell_ kamu, lihatkan kapabilitas dari proses dengan ID 1:

```shell
cd /proc/1
cat status
```

Tampilan menunjukkan _bitmap_ kemampuan untuk proses tersebut:

```shell
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

Bandingkan kemampuan dari kedua kontainers tersebut:

```
00000000a80425fb
00000000aa0435fb
```

Dalam _bitmap_ kemampuan pada kontainer pertama, bit-12 dan ke-25 tidak diatur. Sedangkan dalam kontainer kedua,
bit ke-12 dan ke-25 diatur. Bit ke-12 adalah kemampuan `CAP_NET_ADMIN`, dan bit-25 adalah kemampuan `CAP_SYS_TIME`.
Lihatlah [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
untuk definisi dari konstanta kemampuan yang lainnya.

{{< note >}}
Konstanta kemampuan Linux memiliki format `CAP_XXX`. Tetapi ketika kamu memasukkan daftar kemampuan dalam manifes kontainer kamu, kamu harus menghilangkan bagian `CAP_` dari konstanta. Misalnya, untuk menambahkan `CAP_SYS_TIME`, masukkan `SYS_TIME` dalam daftar kemampuan kontainer kamu.
{{< /note >}}

## Memberikan label SELinux pada sebuah kontainer

Untuk memberikan label SELinux pada sebuah kontainer, masukkan bagian `seLinuxOptions` pada
bab `securityContext` dari manifes Pod atau kontainer kamu.
Bagian `seLinuxOptions` adalah sebuah objek [SELinuxOptions](/docs/reference/generated/kubernetes-api/{{<param"version">}}/#selinuxoptions-v1-core).
Berikut ini adalah contoh yang menerapkan tingkat (_level_) dari SELinux:

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
Untuk menetapkan label SELinux, modul keamanan SELinux harus dimuat terlebih dahulu pada sistem operasi dari _host_.
{{< /note >}}

## Diskusi

Konteks keamanan untuk sebuah Pod berlaku juga untuk kontainer yang berada dalam Pod tersebut dan juga untuk
_volume_ dari Pod tersebut jika ada. Khususnya untuk `fsGroup` dan `seLinuxOptions`
akan diterapkan pada _volume_ seperti berikut ini:

* `fsGroup`: _Volume_ yang mendukung manajemen kepemilikan akan dimodifikasi agar dapat dimiliki
dan ditulis oleh ID group (GID) yang disebutkan dalam `fsGroup`. Lihatlah
[Dokumen Desain untuk Manajemen Kepemilikan](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
untuk lebih detail.

* `seLinuxOptions`: _Volume_ yang mendukung pelabelan SELinux akan dilabel ulang agar dapat diakses
oleh label yang ditentukan dari `seLinuxOptions`. Biasanya kamu hanya
perlu mengatur bagian `level`. Dimana ini akan menetapkan label
[Keamanan multi-kategori (_Multi-Category Security_) (MCS)](https://selinuxproject.org/page/NB_MLS)
yang diberikan kepada semua kontainer dalam Pod serta Volume yang ada didalamnya.

{{< warning >}}
Setelah kamu menentukan label MCS untuk Pod, maka semua Pod dengan label yang sama dapat mengakses _volume_. Jika kamu membutuhkan perlindungan antar Pod, kamu harus menetapkan label MCS yang unik untuk setiap Pod.
{{< /warning >}}

## Membersihkan (_Clean Up_)

Menghapus Pod:

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

{{% /capture %}}

{{% capture whatsnext %}}

* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{<param"version">}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{<param"version">}}/#securitycontext-v1-core)
* [Mengatur Docker dengan peningkatan keamanan terbaru](https://opensource.com/business/15/3/docker-security-tuning)
* [Dokumen desain konteks keamanan](https://git.k8s.io/community/contributors/design-proposals/auth/security_context.md)
* [Dokumen desain manajemen kepemilikan](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
* [Kebijakan keamanan Pod](/docs/concepts/policy/pod-security-policy/)
* [Dokumen desain AllowPrivilegeEscalation](https://git.k8s.io/community/contributors/design-proposals/auth/no-new-privs.md)

{{% /capture %}}
