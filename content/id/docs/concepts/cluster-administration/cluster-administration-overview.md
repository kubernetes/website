---
reviewers:
- davidopp
- lavalamp
title: Ikhtisar Administrasi Klaster
content_type: concept
weight: 10
---

<!-- overview -->
Ikhtisar administrasi klaster ini ditujukan untuk siapapun yang akan membuat atau mengelola klaster Kubernetes.
Diharapkan untuk memahami beberapa [konsep](/docs/concepts/) dasar Kubernetes sebelumnya.


<!-- body -->
## Perencanaan Klaster

Lihat panduan di [Persiapan](/docs/setup) untuk mempelajari beberapa contoh tentang bagaimana merencanakan, mengatur dan mengonfigurasi klaster Kubernetes. Solusi yang akan dipaparkan di bawah ini disebut *distro*.

Sebelum memilih panduan, berikut adalah beberapa hal yang perlu dipertimbangkan:

 - Apakah kamu hanya ingin mencoba Kubernetes pada komputermu, atau kamu ingin membuat sebuah klaster dengan *high-availability*, *multi-node*? Pilihlah distro yang paling sesuai dengan kebutuhanmu.
 - **Jika kamu merencanakan klaster dengan _high-availability_**, pelajari bagaimana cara mengonfigurasi [klaster pada *multiple zone*](/id/docs/concepts/cluster-administration/federation/).
 - Apakah kamu akan menggunakan **Kubernetes klaster di _hosting_**, seperti [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), atau **_hosting_ sendiri klastermu**?
 - Apakah klastermu berada pada **_on-premises_**, atau **di cloud (IaaS)**? Kubernetes belum mendukung secara langsung klaster hibrid. Sebagai gantinya, kamu dapat membuat beberapa klaster.
 - **Jika kamu ingin mengonfigurasi Kubernetes _on-premises_**, pertimbangkan [model jaringan](/id/docs/concepts/cluster-administration/networking/) yang paling sesuai.
 - Apakah kamu ingin menjalankan Kubernetes pada **"bare metal" _hardware_** atau pada **_virtual machines_ (VM)**?
 - Apakah kamu **hanya ingin mencoba klaster Kubernetes**, atau kamu ingin ikut aktif melakukan **pengembangan kode dari proyek Kubernetes**? Jika jawabannya yang terakhir, pilihlah distro yang aktif dikembangkan. Beberapa distro hanya menggunakan rilis *binary*, namun menawarkan lebih banyak variasi pilihan.
 - Pastikan kamu paham dan terbiasa dengan beberapa [komponen](/docs/admin/cluster-components/) yang dibutuhkan untuk menjalankan sebuah klaster.

Catatan: Tidak semua distro aktif dikelola. Pilihlah distro yang telah diuji dengan versi terkini dari Kubernetes.

## Mengelola Klaster

* [Mengelola klaster](/docs/tasks/administer-cluster/cluster-management/) akan menjabarkan beberapa topik terkait *lifecycle* dari klaster: membuat klaster baru, melakukan *upgrade* pada *node master* dan *worker*, melakukan pemeliharaan *node* (contoh: *upgrade* kernel), dan melakukan *upgrade* versi Kubernetes API pada klaster yang sedang berjalan.

* Pelajari bagaimana cara [mengatur *node*](/docs/concepts/nodes/node/).

* Pelajari bagaimana cara membuat dan mengatur kuota resource [(*resource quota*)](/id/docs/concepts/policy/resource-quotas/) untuk *shared* klaster.

## Mengamankan Klaster

* [Sertifikat (*certificate*)](/id/docs/concepts/cluster-administration/certificates/) akan menjabarkan langkah-langkah untuk membuat sertifikat menggunakan beberapa *tool chains*.

* [Kubernetes *Container Environment*](/id/docs/concepts/containers/container-environment-variables/) akan menjelaskan *environment* untuk kontainer yang dikelola oleh Kubelet pada Kubernetes *node*.

* [Mengontrol Akses ke Kubernetes API](/docs/reference/access-authn-authz/controlling-access/) akan menjabarkan bagaimana cara mengatur izin (*permission*) untuk akun pengguna dan *service account*.

* [Autentikasi](/docs/reference/access-authn-authz/authentication/) akan menjelaskan autentikasi di Kubernetes, termasuk ragam pilihan autentikasi.

* [Otorisasi](/docs/reference/access-authn-authz/authorization/) dibedakan dari autentikasi, digunakan untuk mengontrol bagaimana *HTTP call* ditangani.

* [Menggunakan *Admission Controllers*](/docs/reference/access-authn-authz/admission-controllers/) akan menjelaskan *plug-in* yang akan melakukan intersep permintaan sebelum menuju ke server Kubernetes API, setelah autentikasi dan otorisasi dilakukan.

* [Menggunakan Sysctls pada Klaster Kubernetes](/docs/concepts/cluster-administration/sysctl-cluster/) akan menjabarkan tentang cara menggunakan perintah `sysctl` pada *command-line* untuk mengatur parameter kernel.

* [Audit](/docs/tasks/debug-application-cluster/audit/) akan menjelaskan bagaimana cara berinteraksi dengan log audit Kubernetes.

### Mengamankan Kubelet
  * [Komunikasi Master-Node](/docs/concepts/architecture/master-node-communication/)
  * [TLS *bootstrapping*](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
  * [Autentikasi/Otorisasi Kubelet](/docs/admin/kubelet-authentication-authorization/)

## Layanan Tambahan Klaster

* [Integrasi DNS](/id/docs/concepts/services-networking/dns-pod-service/) akan menjelaskan bagaimana cara *resolve* suatu nama DNS langsung pada *service* Kubernetes.

* [*Logging* dan *Monitoring* Aktivitas Klaster](/id/docs/concepts/cluster-administration/logging/) akan menjelaskan bagaimana cara *logging* bekerja di Kubernetes serta bagaimana cara mengimplementasikannya.




