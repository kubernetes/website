---
title: Mengonfigurasi Konteks Keamanan untuk Pod atau Container
content_type: task
weight: 80
---

<!-- overview -->

Konteks keamanan (_security context_) menentukan wewenang (_privilege_) dan aturan kontrol akses untuk sebuah Pod 
atau Container. Aturan konteks keamanan meliputi hal-hal berikut ini namun tidak terbatas pada hal-hal tersebut:

* Kontrol akses bersifat diskresi: Izin untuk mengakses objek, seperti sebuah berkas, yang didasarkan pada
[ID pengguna atau _user ID_ (UID) dan ID grup atau _group ID_ (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [_Security Enhanced Linux_ (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux): Di mana objek diberi label keamanan.

* Menjalankan dengan wewenang (_privileged_) atau tanpa wewenang (_unprivileged_).

* [Kapabilitas Linux (Linux Capabilities)](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): Memberi sebuah proses beberapa wewenang, namun tidak semua wewenang dari pengguna _root_.

* [AppArmor](/docs/tutorials/clusters/apparmor/): Menggunakan profil program untuk membatasi kemampuan dari masing-masing program.

* [Seccomp](https://en.wikipedia.org/wiki/Seccomp): Menyaring panggilan sistem (_system calls_) dari suatu proses.

* AllowPrivilegeEscalation: Mengontrol apakah suatu proses dapat memperoleh lebih banyak wewenang daripada proses induknya. Pilihan ini mengontrol secara langsung apakah opsi [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt) diaktifkan pada proses dalam Container. AllowPrivilegeEscalation selalu aktif (_true_) ketika Container: 1) berjalan dengan wewenang ATAU 2) memiliki `CAP_SYS_ADMIN`.

* readOnlyRootFilesystem: Menambatkan (_mount_) sistem berkas (_file system_) _root_ dari sebuah Container hanya sebatas untuk dibaca saja (_read-only_).

Poin-poin di atas bukanlah sekumpulan lengkap dari aturan konteks keamanan - silakan lihat [SecurityContext](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#securitycontext-v1-core) untuk daftar lengkapnya.

Untuk informasi lebih lanjut tentang mekanisme keamanan pada Linux, silahkan lihat
[ikhtisar fitur keamanan pada Kernel Linux](https://www.linux.com/learn/overview-linux-kernel-security-features)



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Mengatur konteks keamanan untuk Pod

Untuk menentukan aturan keamanan pada Pod, masukkan bagian `securityContext`
dalam spesifikasi Pod. Bagian `securityContext` adalah sebuah objek
[PodSecurityContext](/docs/reference/generate/kubernetes-api/{{<param"version">}}/#podsecuritycontext-v1-core).
Aturan keamanan yang kamu tetapkan untuk Pod akan berlaku untuk semua Container dalam Pod tersebut.
Berikut sebuah berkas konfigurasi untuk Pod yang memiliki volume `securityContext` dan `emptyDir`:

{{% codenew file="pods/security/security-context.yaml" %}}

Dalam berkas konfigurasi ini, bagian `runAsUser` menentukan bahwa dalam setiap Container pada
Pod, semua proses dijalankan oleh ID pengguna 1000. Bagian `runAsGroup` menentukan grup utama dengan ID 3000 untuk
semua proses dalam setiap Container pada Pod. Jika bagian ini diabaikan, maka ID grup utama dari Container
akan berubah menjadi _root_(0). Berkas apa pun yang dibuat juga akan dimiliki oleh pengguna dengan ID 1000 dan grup dengan ID 3000 ketika `runAsGroup` ditentukan.
Karena `fsGroup` ditentukan, semua proses milik Container juga merupakan bagian dari grup tambahan dengan ID 2000.
Pemilik volume `/data/demo` dan berkas apa pun yang dibuat dalam volume tersebut adalah grup dengan ID 2000.

Buatlah Pod tersebut:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

Periksa apakah Container dari Pod sedang berjalan:

```shell
kubectl get pod security-context-demo
```
Masuk ke _shell_ dari Container yang sedang berjalan tersebut:

```shell
kubectl exec -it security-context-demo -- sh
```

Pada _shell_ kamu, lihat daftar proses yang berjalan:

```shell
ps
```

Keluarannya menunjukkan bahwa proses dijalankan oleh pengguna dengan ID 1000, yang merupakan nilai dari bagian `runAsUser`:

```shell
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

Pada _shell_ kamu, pindah ke direktori `/data`, dan lihat isinya:

```shell
cd /data
ls -l
```

Keluarannya menunjukkan bahwa direktori `/data/demo` memiliki grup dengan ID 2000, yang merupakan
nilai dari bagian `fsGroup`.

```shell
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

Pada _shell_ kamu, pindah ke direktori `/data/demo`, dan buatlah sebuah berkas didalamnya:

```shell
cd demo
echo hello > testfile
```

Lihatlah daftar berkas dalam direktori `/data/demo`:

```shell
ls -l
```

Keluarannya menunjukkan bahwa `testfile` memiliki grup dengan ID 2000, dimana merupakan nilai dari bagian `fsGroup`.

```shell
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

Jalankan perintah berikut ini:

```shell
$ id
uid=1000 gid=3000 groups=2000
```

Kamu akan melihat bahwa nilai _gid_ adalah 3000, sama dengan bagian `runAsGroup`. Jika `runAsGroup` diabaikan maka nilai _gid_ akan
tetap bernilai 0(_root_) dan proses akan dapat berinteraksi dengan berkas-berkas yang dimiliki oleh grup root(0) dan yang memiliki
izin grup untuk grup root(0).

Keluarlah dari _shell_ kamu:

```shell
exit
```

## Melakukan konfigurasi izin volume dan kebijakan perubahan kepemilikan untuk Pod

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

Secara bawaan, Kubernetes mengubah kepemilikan dan izin secara rekursif untuk konten masing-masing
volume untuk mencocokkan `fsGroup` yang ditentukan dalam `securityContext` dari Pod pada saat volume itu
ditambatkan (_mounted_). Untuk volume yang besar, memeriksa dan mengubah kepemilikan dan izin dapat memerlukan waktu yang sangat lama,
sehingga memperlambat proses menjalankan Pod. Kamu dapat menggunakan bagian `fsGroupChangePolicy` dalam sebuah `securityContext`
untuk mengontrol cara Kubernetes memeriksa dan mengelola kepemilikan dan izin
untuk sebuah volume.

**fsGroupChangePolicy** - `fsGroupChangePolicy` mendefinisikan perilaku untuk mengubah kepemilikan dan izin volume
sebelum diekspos di dalam sebuah Pod. Bagian ini hanya berlaku untuk tipe volume yang mendukung
`fsGroup` untuk mengontrol kepemilikan dan izin. Bagian ini memiliki dua nilai yang dapat dimasukkan:

* _OnRootMismatch_: Hanya mengubah izin dan kepemilikan jika izin dan kepemilikan dari direktori _root_ tidak sesuai dengan izin volume yang diharapkan. Hal ini dapat membantu mempersingkat waktu yang diperlukan untuk mengubah kepemilikan dan izin sebuah volume.
* _Always_: Selalu mengubah izin dan kepemilikan volume ketika volume sudah ditambatkan.

Sebagai contoh:

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

Ini adalah fitur alpha. Untuk menggunakannya, silahkan aktifkan [gerbang fitur](/docs/reference/command-line-tools-reference/feature-gates/) `ConfigurableFSGroupPolicy` untuk kube-api-server, kube-controller-manager, dan kubelet.

{{< note >}}
Bagian ini tidak berpengaruh pada tipe volume yang bersifat sementara (_ephemeral_) seperti
[`secret`](https://kubernetes.io/docs/concepts/storage/volumes/#secret),
[`configMap`](https://kubernetes.io/docs/concepts/storage/volumes/#configmap),
dan [`emptydir`](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir).
{{< /note >}}


## Mengatur konteks keamanan untuk Container

Untuk menentukan aturan keamanan untuk suatu Container, sertakan bagian `securityContext`
dalam manifes Container. Bagian `securityContext` adalah sebuah objek
[SecurityContext](/docs/reference/generate/kubernetes-api/{{<param"version">}}/#securitycontext-v1-core).
Aturan keamanan yang kamu tentukan untuk Container hanya berlaku untuk
Container secara individu, dan aturan tersebut menimpa aturan yang dibuat pada tingkat Pod apabila
ada aturan yang tumpang tindih. Aturan pada Container mempengaruhi volume pada Pod.

Berikut berkas konfigurasi untuk Pod yang hanya memiliki satu Container. Keduanya, baik Pod
dan Container memiliki bagian `securityContext` sebagai berikut:

{{% codenew file="pods/security/security-context-2.yaml" %}}

Buatlah Pod tersebut:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

Periksa jika Container dalam Pod sedang berjalan:

```shell
kubectl get pod security-context-demo-2
```

Masuk ke dalam _shell_ Container yang sedang berjalan tersebut:

```shell
kubectl exec -it security-context-demo-2 -- sh
```

Pada _shell_ kamu, lihat daftar proses yang sedang berjalan:

```
ps aux
```

Keluarannya menunjukkan bahwa proses dijalankan oleh user dengan ID 2000, yang merupakan
nilai dari `runAsUser` seperti yang telah ditentukan untuk Container tersebut. Nilai tersebut menimpa nilai ID 1000 yang
ditentukan untuk Pod-nya.

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

## Mengatur Kapabilitas untuk Container

Dengan menggunakan [Kapabilitas Linux (Linux Capabilities)](http://man7.org/linux/man-pages/man7/capabilities.7.html),
kamu dapat memberikan wewenang tertentu kepada suatu proses tanpa memberikan semua wewenang
dari pengguna _root_. Untuk menambah atau menghapus Kapabilitas Linux pada suatu Container, masukkan
bagian `capabilities` pada `securityContext` di manifes Container-nya.

Pertama-tama, mari melihat apa yang terjadi ketika kamu tidak menyertakan bagian `capabilities`.
Berikut ini adalah berkas konfigurasi yang tidak menambah atau mengurangi kemampuan apa pun dari Container:

{{% codenew file="pods/security/security-context-3.yaml" %}}

Buatlah Pod tersebut:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

Periksa apakah Container dari Pod tersebut sedang berjalan:

```shell
kubectl get pod security-context-demo-3
```

Masuk ke dalam _shell_ dari Container yang berjalan: 

```shell
kubectl exec -it security-context-demo-3 -- sh
```

Dalam _shell_ tersebut, lihatlah daftar proses yang berjalan:

```shell
ps aux
```

Keluarannya menunjukkan ID dari proses atau _process IDs_ (PIDs) untuk Container tersebut:

```shell
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

Dalam _shell_ kamu, lihat status dari proses dengan ID 1:

```shell
cd /proc/1
cat status
```

Keluarannya menunjukkan _bitmap_ dari kapabilitas untuk proses tersebut:

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

Buatlah catatan untuk _bitmap_ dari kapabilitas tersebut, dan keluarlah dari _shell_ kamu:

```shell
exit
```

Berikutnya, jalankan Container yang sama seperti dengan Container sebelumnya, namun
Container ini memiliki kapabilitas tambahan yang sudah ditentukan.

Berikut ini adalah berkas konfigurasi untuk Pod yang hanya menjalankan satu Container. Konfigurasi
ini menambahkan kapabilitas `CAP_NET_ADMIN` dan `CAP_SYS_TIME`:

{{% codenew file="pods/security/security-context-4.yaml" %}}

Buatlah Pod tersebut:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

Masuk ke dalam _shell_ dari Container yang berjalan: 

```shell
kubectl exec -it security-context-demo-4 -- sh
```

Di dalam _shell_ kamu, lihatlah kapabilitas dari proses dengan ID 1:

```shell
cd /proc/1
cat status
```

Keluarannya menunjukkan _bitmap_ kapabilitas untuk proses tersebut:

```shell
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

Bandingkan kemampuan dari kedua Containers tersebut:

```
00000000a80425fb
00000000aa0435fb
```

Dalam _bitmap_ kapabilitas pada Container pertama, bit-12 dan ke-25 tidak diatur. Sedangkan dalam Container kedua,
bit ke-12 dan ke-25 diatur. Bit ke-12 adalah kapabilitas `CAP_NET_ADMIN`, dan bit-25 adalah kapabilitas `CAP_SYS_TIME`.
Lihatlah [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
untuk nilai dari konstanta kapabilitas-kapabilitas yang lainnya.

{{< note >}}
Konstanta kapabilitas Linux memiliki format `CAP_XXX`. Tetapi ketika kamu memasukkan daftar kemampuan dalam manifes Container kamu, kamu harus menghilangkan bagian `CAP_` dari konstantanya. Misalnya, untuk menambahkan `CAP_SYS_TIME`, masukkan `SYS_TIME` ke dalam daftar kapabilitas Container kamu.
{{< /note >}}

## Memberikan label SELinux pada sebuah Container

Untuk memberikan label SELinux pada sebuah Container, masukkan bagian `seLinuxOptions` pada
bagian `securityContext` dari manifes Pod atau Container kamu.
Bagian `seLinuxOptions` adalah sebuah objek [SELinuxOptions](/docs/reference/generated/kubernetes-api/{{<param"version">}}/#selinuxoptions-v1-core).
Berikut ini adalah contoh yang menerapkan sebuah level dari SELinux:

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
Untuk menetapkan label SELinux, modul keamanan SELinux harus dimuat terlebih dahulu pada sistem operasi dari hosnya.
{{< /note >}}

## Diskusi

Konteks keamanan untuk sebuah Pod berlaku juga untuk Container yang berada dalam Pod tersebut dan juga untuk
volume dari Pod tersebut jika ada. Terkhusus untuk `fsGroup` dan `seLinuxOptions`
akan diterapkan pada volume seperti berikut:

* `fsGroup`: Volume yang mendukung manajemen kepemilikan (_ownership_) akan dimodifikasi agar dapat dimiliki
dan ditulis oleh ID group (GID) yang disebutkan dalam `fsGroup`. Lihatlah
[Dokumen Desain untuk Manajemen Kepemilikan](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
untuk lebih lanjut.

* `seLinuxOptions`: Volume yang mendukung pelabelan SELinux akan dilabel ulang agar dapat diakses
oleh label yang ditentukan pada `seLinuxOptions`. Biasanya kamu hanya
perlu mengatur bagian `level`. Dimana ini akan menetapkan label
[Keamanan multi-kategori (_Multi-Category Security_) (MCS)](https://selinuxproject.org/page/NB_MLS)
yang diberikan kepada semua Container dalam Pod serta Volume yang ada didalamnya.

{{< warning >}}
Setelah kamu menentukan label MCS untuk Pod, maka semua Pod dengan label yang sama dapat mengakses Volume tersebut. Jika kamu membutuhkan perlindungan antar Pod, kamu harus menetapkan label MCS yang unik untuk setiap Pod.
{{< /warning >}}

## Bersih-bersih (_Clean Up_)

Hapus Pod-Pod tersebut:

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```



## {{% heading "whatsnext" %}}


* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{<param"version">}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{<param"version">}}/#securitycontext-v1-core)
* [Menyetel Docker dengan peningkatan keamanan terbaru](https://opensource.com/business/15/3/docker-security-tuning)
* [Dokumen desain konteks keamanan](https://git.k8s.io/community/contributors/design-proposals/auth/security_context.md)
* [Dokumen desain manajemen kepemilikan](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
* [Kebijakan keamanan Pod](/id/docs/concepts/policy/pod-security-policy/)
* [Dokumen desain AllowPrivilegeEscalation](https://git.k8s.io/community/contributors/design-proposals/auth/no-new-privs.md)


