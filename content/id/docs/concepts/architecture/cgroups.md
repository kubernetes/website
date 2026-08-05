---
title: Tentang cgroup v2
content_type: concept
weight: 50
---

<!-- overview -->

Pada Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
berfungsi untuk membatasi <i>resources</i> yang dialokasikan ke setiap program yang sedang berjalan.

{{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} dan <i>container runtime</i> perlu berinteraksi dengan <i>cgroups</i> untuk menerapkan [resource management pada pod dan kontainer](/docs/concepts/configuration/manage-resources-containers/) yang mencakup pengalokasian kebutuhan CPU/Memori dan <i>workloads</i> dalam sebuah container.

Terdapat dua versi cgroups dalam Linux: cgroup v1 dan cgroup v2. Cgroup v2 adalah generasi baru dari `cgroup` API.

<!-- body -->


## Apa itu cgroup v2? {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

cgroup v2 adalah versi lanjutan dari Linux `cgroup` API. cgroup v2 menyediakan unified control system dan kemampuan <i>resource management</i> yang lebih baik. 

cgroup v2 menawarkan beberapa peningkatan dibandingkan cgroup v1, seperti berikut:

- Single unified hierarchy design pada API
- Delegasi sub-tree yang lebih aman pada containers
- Fitur-fitur yang lebih baru seperti [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Manajemen alokasi <i>resource</i> dan pengisolasian antar <i>resources</i> yang lebih baik
  - Perhitungan yang lebih terpadu untuk berbagai jenis pengalokasian memori (memori jaringan, memori kernel, dll)
  - Menghitung perubahan <i>resource</i> yang tidak langsung seperti respon cache pada sebuah halaman

Beberapa fitur-fitur Kubernetes secara eksklusif menggunakan cgroup v2 untuk <i>resource management</i> dan <i>isolation</i> yang lebih baik. Sebagai contoh, fitur [MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) meningkatkan memori QoS dan mengandalkan cgroup v2 primitif.


## Penggunaan cgroup v2 {#using-cgroupv2}

Cara yang direkomendasikan untuk menggunakan cgroup v2 adalah dengan menggunakan Linux Distribution yang menggunakan cgroup v2 secara default.

Untuk memastikan apakah Linux Distribution yang dipakai menggunakan cgroup v2, silahkan membaca 
[Mengidentifikasi versi cgroup pada Linux](#check-cgroup-version).

### Requirements

Penggunaan cgroup v2 memiliki beberapa <i>requirements</i>:

* Distribusi OS mengaktifkan cgroup v2
* Menggunakan Linux kernel versi 5.8 atau setelahnya
* <i>Container runtime</i> mendukung cgroup v2. Sebagai contoh:
  * [containerd](https://containerd.io/) v1.4 dan setelahnya
  * [cri-o](https://cri-o.io/) v1.20 dan setelahnya
* Kubelet dan container runtima dikonfigurasi untuk menggunakan [systemd cgroup driver](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

### Distribusi Linux yang mengaktifkan cgroup v2

Untuk list Distribusi Linux yang menggunakan cgroup v2, bisa dilihat di [cgroup v2 documentation](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)

<!-- the list should be kept in sync with https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* Container Optimized OS (since M97)
* Ubuntu (since 21.10, 22.04+ recommended)
* Debian GNU/Linux (since Debian 11 bullseye)
* Fedora (since 31)
* Arch Linux (since April 2021)
* RHEL and RHEL-like distributions (since 9)

Untuk memeriksa apakah distribusi Linux yang anda gunakan menggunakan cgroup v2, lihat dokumentasi distribusi linux anda gunakan atau ikuti petunjuk pada [Mengidentifikasi versi cgroup pada Linux](#check-cgroup-version).

Anda juga dapat mengaktifkan cgroup v2 secara manual pada distribusi Linux dengan memodifikasi argumen kernel cmdline boot. Jika distribusi Linux anda menggunakan GRUB, tambahkan `systemd.unified_cgroup_hierarchy=1` pada variabel `GRUB_CMDLINE_LINUX` dalam `/etc/default/grub`, diikuti dengan menjalankan `sudo update-grub`. Namun, cara yang direkomendasikan adalah dengan menggunakan distribusi Linux yang telah mengaktifkan cgroup v2 secara default.

### Migrasi ke cgroup v2

Untuk migrasi ke cgroup v2, pastikan Anda telah memenuhi <i>[requirements](#requirements)</i> yang dibutuhkan, kemudian <i>upgrade</i> versi kernel yang telah mengaktifkan cgroup v2 secara default.

Kubelet secara otomatis akan mendeteksi bahwa OS yang digunakan berjalan pada cgroup v2 dan bekerja sebagaimana mestinya tanpa memerlukan konfigurasi tambahan.

Seharusnya tidak ada perubahan yang terlihat atau dirasakan pada <i>user experience</i> ketika beralih menggunakan cgroup v2, kecuali pengguna mengakses cgroup file system secara langsung, baik itu pada node atau dari dalam container.

cgroup v2 menggunakan API yang berbeda dari cgroup v1, jadi ketika terdapat aplikasi yang secara langsung mengakses cgroup file system, aplikasi tersebut perlu diupdate ke versi terbaru yang kompatibel dengan cgroup v2. Sebagai contoh:

* Beberapa agen monitoring dan security dari <i>third-party</i>, mungkin bergantung pada cgroup filesystem. Perbarui agen-agen ini ke versi yang mendukung cgroup v2.
* Jika Anda menjalankan [cAdvisor](https://github.com/google/cadvisor) sebagai stand-alone
 DaemonSet untuk memonitor pods dan containers, perbarui ke versi v0.43.0 atau setelahnya.
* Jika Anda men-<i>deploy</i> aplikasi Java, disarankan untuk menggunakan versi yang kompatibel dengan cgroup v2 secara keseluruhan:
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372, 11.0.16, 15 dan setelahnya
    * [IBM Semeru Runtimes](https://www.eclipse.org/openj9/docs/version0.33/#control-groups-v2-support): jdk8u345-b01, 11.0.16.0, 17.0.4.0, 18.0.2.0 dan setelahnya
    * [IBM Java](https://www.ibm.com/docs/en/sdk-java-technology/8?topic=new-service-refresh-7#whatsnew_sr7__fp15): 8.0.7.15 dan setelahnya
* Jika Anda menggunakan package [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs), pastikan versi yang Anda gunakan adalah v1.5.1 atau setelahnya.

## Mengidentifikasi versi cgroup pada Linux{#check-cgroup-version}

Versi cgroup bergantung pada distribusi Linux yang digunakan dan versi cgroup yang dikonfigurasi pada OS secara default. Untuk memastikan versi cgroup yang digunakan pada distribusi Linux, jalankan command `stat -fc %T /sys/fs/cgroup/` pada Linux node:

```shell
stat -fc %T /sys/fs/cgroup/
```

Untuk cgroup v2, outputnya adalah `cgroup2fs`.

Untuk cgroup v1, outputnya adalah `tmpfs.`

## {{% heading "whatsnext" %}}

- Pelajari lebih lanjut tentang [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- Pelajari lebih lanjut tentang [container runtime](/docs/concepts/architecture/cri)
- Pelajari lebih lanjut tentang [cgroup drivers](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
