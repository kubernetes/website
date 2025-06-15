---
title: Daftar Keamanan Aplikasi
description: >
  Panduan dasar untuk memastikan keamanan aplikasi di Kubernetes, ditujukan untuk pengembang aplikasi
content_type: concept
weight: 110
---

<!-- overview -->

Daftar ini bertujuan untuk memberikan panduan dasar dalam mengamankan aplikasi
yang berjalan di Kubernetes dari perspektif pengembang.
Daftar ini tidak dimaksudkan untuk menjadi lengkap dan akan terus berkembang seiring waktu.

<!-- Diambil dari daftar periksa yang ada untuk admin Kubernetes. https://kubernetes.io/docs/concepts/security/security-checklist/ -->

Cara membaca dan menggunakan dokumen ini:

- Urutan topik tidak mencerminkan urutan prioritas.
- Beberapa item daftar dijelaskan dalam paragraf di bawah daftar setiap bagian.
- Daftar ini mengasumsikan bahwa `pengembang` adalah pengguna kluster Kubernetes yang
  berinteraksi dengan objek dalam lingkup _namespace_.

{{< caution >}}
Daftar ini **tidak** cukup untuk mencapai postur keamanan yang baik dengan sendirinya.
Postur keamanan yang baik membutuhkan perhatian dan peningkatan yang terus-menerus, tetapi daftar ini
dapat menjadi langkah pertama dalam perjalanan tanpa akhir menuju kesiapan keamanan.
Beberapa rekomendasi dalam daftar ini bisa jadi terlalu ketat atau terlalu longgar untuk
kebutuhan keamanan spesifik kamu. Karena keamanan Kubernetes tidak bersifat "satu ukuran untuk semua",
setiap kategori item daftar periksa harus dievaluasi berdasarkan kelebihannya.
{{< /caution >}}

<!-- body -->

## Penguatan keamanan dasar

Daftar berikut memberikan rekomendasi penguatan keamanan dasar yang
akan berlaku untuk sebagian besar aplikasi yang di-deploy ke Kubernetes.

### Desain aplikasi

- [ ] Ikuti
  [prinsip keamanan](https://www.cncf.io/wp-content/uploads/2022/06/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)
  yang tepat saat merancang aplikasi.
- [ ] Aplikasi dikonfigurasi dengan {{< glossary_tooltip text="kelas QoS" term_id="QoS-class" >}}
  yang sesuai melalui permintaan dan batas sumber daya.
  - [ ] Batas memori ditetapkan untuk beban kerja dengan batas yang sama atau lebih besar dari permintaan.
  - [ ] Batas CPU dapat ditetapkan pada beban kerja sensitif.

### Akun layanan

- [ ] Hindari menggunakan `default` ServiceAccount. Sebagai gantinya, buat ServiceAccount untuk
  setiap beban kerja (workloads) atau layanan mikro.
- [ ] `automountServiceAccountToken` harus disetel ke `false` kecuali pod
  secara khusus memerlukan akses ke API Kubernetes untuk beroperasi.

### Rekomendasi `securityContext` tingkat pod {#security-context-pod}

- [ ] Terapkan `runAsNonRoot: true`.
- [ ] Konfigurasikan container untuk dijalankan sebagai pengguna dengan hak istimewa lebih rendah
  (misalnya, menggunakan `runAsUser` dan `runAsGroup`), dan konfigurasikan izin yang sesuai
  pada file atau direktori di dalam image container.
- [ ] Opsional, tambahkan grup tambahan dengan `fsGroup` untuk mengakses volume persisten.
- [ ] Aplikasi di-deploy ke namespace yang menerapkan
  [standar keamanan Pod](/docs/concepts/security/pod-security-standards/) yang sesuai.
  Jika kamu tidak dapat mengontrol penerapan ini untuk kluster tempat aplikasi di-deploy,
  pertimbangkan ini melalui dokumentasi atau pertahanan tambahan secara mendalam.

### Rekomendasi `securityContext` tingkat container {#security-context-container}

- [ ] Nonaktifkan eskalasi hak istimewa menggunakan `allowPrivilegeEscalation: false`.
- [ ] Konfigurasikan sistem file root agar hanya dapat dibaca dengan `readOnlyRootFilesystem: true`.
- [ ] Hindari menjalankan container dengan hak istimewa (atur `privileged: false`).
- [ ] Hapus semua kemampuan dari container dan tambahkan kembali hanya yang spesifik
  yang diperlukan untuk operasi container.

### Kontrol Akses Berbasis Peran (RBAC) {#rbac}

- [ ] Izin seperti **create**, **patch**, **update**, dan **delete**
  hanya boleh diberikan jika diperlukan.
- [ ] Hindari membuat izin RBAC untuk membuat atau memperbarui peran yang dapat menyebabkan
  [eskalasi hak istimewa](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping).
- [ ] Tinjau binding untuk grup `system:unauthenticated` dan hapus jika memungkinkan,
  karena ini memberikan akses kepada siapa saja yang dapat menghubungi server API pada tingkat jaringan.

Verba **create**, **update**, dan **delete** harus diizinkan dengan hati-hati.
Verba **patch** jika diizinkan pada Namespace dapat
[mengizinkan pengguna memperbarui label pada namespace atau deployment](/docs/concepts/security/rbac-good-practices/#namespace-modification)
yang dapat meningkatkan permukaan serangan.

Untuk beban kerja sensitif, pertimbangkan untuk menyediakan ValidatingAdmissionPolicy yang direkomendasikan
yang lebih membatasi tindakan tulis yang diizinkan.

### Keamanan image

- [ ] Gunakan alat pemindaian image untuk memindai image sebelum mendepoy container di kluster Kubernetes.
- [ ] Gunakan penandatanganan container untuk memvalidasi tanda tangan image container sebelum men-deploy ke kluster Kubernetes.

### Kebijakan jaringan

- [ ] Konfigurasikan [NetworkPolicies](/docs/concepts/services-networking/network-policies/)
  untuk hanya mengizinkan lalu lintas masuk dan keluar yang diharapkan dari pod.

Pastikan bahwa kluster kamu menyediakan dan menerapkan NetworkPolicy.
Jika kamu menulis aplikasi yang akan di-deploy pengguna ke kluster yang berbeda,
pertimbangkan apakah kamu dapat mengasumsikan bahwa NetworkPolicy tersedia dan diterapkan.

## Penguatan keamanan tingkat lanjut {#advanced}

Bagian ini mencakup beberapa poin penguatan keamanan tingkat lanjut
yang mungkin berharga berdasarkan pengaturan lingkungan Kubernetes yang berbeda.

### Keamanan container Linux

Konfigurasikan {{< glossary_tooltip text="Security Context" term_id="Security-Context" >}}
untuk pod-container.

- [ ] [Tetapkan Profil Seccomp untuk Container](/docs/tasks/configure-pod-container/security-context/#set-the-seccomp-profile-for-a-container).
- [ ] [Batasi Akses Container ke Sumber Daya dengan AppArmor](/docs/tutorials/security/apparmor/).
- [ ] [Tetapkan Label SELinux ke Container](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container).

### Kelas runtime

- [ ] Konfigurasikan kelas runtime yang sesuai untuk container.

{{% thirdparty-content %}}

Beberapa container mungkin memerlukan tingkat isolasi yang berbeda dari yang disediakan oleh
runtime default kluster. `runtimeClassName` dapat digunakan dalam podspec
untuk mendefinisikan kelas runtime yang berbeda.

Untuk beban kerja sensitif, pertimbangkan menggunakan alat emulasi kernel seperti
[gVisor](https://gvisor.dev/docs/), atau isolasi virtual menggunakan mekanisme
seperti [kata-containers](https://katacontainers.io/).

Dalam lingkungan dengan tingkat kepercayaan tinggi, pertimbangkan menggunakan
[mesin virtual rahasia](/blog/2023/07/06/confidential-kubernetes/)
untuk lebih meningkatkan keamanan kluster.
