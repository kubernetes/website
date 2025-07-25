---
title: Daftar Periksa Keamanan
description: >
  Daftar periksa dasar untuk memastikan keamanan di klaster Kubernetes.
content_type: concept
weight: 100
---

<!-- overview -->

Daftar ini bertujuan memberikan daftar dasar panduan dengan tautan ke
dokumentasi yang lebih lengkap pada setiap topiknya. Daftar ini tidak
berarti sudah final dan masih bisa berubah.

Bagaimana cara membaca dan menggunakan dokumen ini:

- Urutan dari topik tidak mencerminkan prioritas
- Beberapa daftar, dirincikan dalam paragraf di bawahnya pada setiap bagian.

{{< caution >}}
Daftar periksa sendiri **tidak** cukup untuk mendapatkan postur keamanan yang baik.
Postur keamanan yang baik membutuhkan usaha yang terus menerus, dan daftar periksa
bisa menjadi langkah pertama dalam perjalanan panjang dalam keamanan.
Beberapa rekomendasi dalam daftar periksa ini bisa jadi terlalu ketat atau
terlalu longgar untuk kebutuhan spesifik keamanan kamu. 
Karena keamanan Kubernetes bukan lah "sama untuk semua", setiap kategori dalam daftar,
harus dievaluasi berdasarkan untung/rugi-nya. 
{{< /caution >}}

<!-- body -->

## Authentication & Authorization
## Autentikasi dan Autorisasi

- [ ] `system:masters` group tidak digunakan untuk pengguna atau komponen otentikasi setelah bootstrapping.
- [ ] kube-controller-manager dijalankan dengan `--use-service-account-credentials`
  aktif.
- [ ] Sertifikat root terlindungi (baik dengan offline CA, atau online CA dengan akses kontrol yang efektif).
- [ ] Sertifikat intermediate dan leaf memiliki masa berlaku tidak lebih dari 
3 tahun ke depan.
- [ ] Terdapat sebuah proses untuk me-review akses periodik dan review dilakukan
tidak lebih dari 24 bulan.
- [ ] [Role Based Access Control Good Practices](/docs/concepts/security/rbac-good-practices/)
  diikuti untuk panduan dalam autentikasi dan autorisasi.

Setelah bootstrapping, baik pengguna ataupun komponen harusnya tidak melakukan
otentikasi ke Kubernetes API sebagai `system:masters`. Mirip dengan, menjalankan
semua kube-controller-manager sebagai `system:masters` harus dihindari.
Faktanya, `system:masters` harus digunakan sebagai mekanisme terakhir (pecahkan-kaca), berlawanan dengan pengguna admin.

## Keamanan Jaringan 

- [ ] Gunakan plugin CNI untuk mendukung kebijakan jaringan.
- [ ] CNI plugins in use support network policies.
- [ ] Kebijakan jaringan ingress dan egress diaplikasikan ke semua workload
  di dalam klaster.
- [ ] Terapkan kebijakan default jaringan setiap namespace, periksa semua pod, dan tolak semua.
- [ ] Jika memungkinkan, sebuah service mesh digunakan untuk mengenkripsi semua komunikasi di dalam klaster.
- [ ] Kubernetes API, kubelet API dan etcd tidak terekspos ke Internet.
- [ ] Akses ke workloads ke cloud metadata API di-filter.
- [ ] Penggunaan LoadBalancer dan ExternalIPs dilarang.

Sejumlah [Container Network Interface (CNI) plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
menyediakan fungsionalitas untuk membatasi sumber daya jaringan yang
memungkinkan pods berkomunikasi. Hal ini umumnya dilakukan melalui
[Network Policies](/docs/concepts/services-networking/network-policies/)
yang menyediakan sumber daya dengan namespace untuk mendefinisikan aturan.
Kebijakan jaringan default yang mem-blok semua egress dan ingress di setiap
namespace, memilih semua pods, dapat bermanfaat untuk mengadopsi pendekatan daftar
diizinkan untuk memastikan tidak ada workloads yang terlewat.

Tidak semua plugin CNI menyediakan enkripsi saat transit. Jika plugin yang dipilih
tidak memiliki fitur ini, solusi alternatif dapat ditawarkan untuk menggunakan
service mesh yang menyediakan fungsionalitas ini.

Datastore etcd dari control plane harus memiliki kontrol untuk membatasi akses
dan tidak terekspos ke Internet. Lebih jauh, mutual TLS (mTLS) harus digunakan
untuk berkomunikasi dengan aman. Certificate authority untuk ini harus unik ke etcd.

Akses Internet eksternal ke server Kubernetes API harus dibatasi untuk tidak
meng-ekspos API ke publik. Harap hati-hati, banyak managed Kubernetes distributions
yang secara default mengekspos API server. Untuk ini, kamu bisa menggunakan bastion host
untuk mengakses server.

Akses API [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
harus dibatasi dan tidak terekspos ke publi, setting default autentikasi dan autorisasi,
saat tidak ada berkas konfigurasi di-spesifikasikan dengan flag `--config`, 
sangat permisif. 

Jika penyedia cloud digunakan untuk men-host Kubernetes, akses dari pod ke
cloud metadata API `169.254.169.254` harus dibatasi juga atau diblok jika tidak
dibutuhkan karena ada informasi yang bisa bocor.

Untuk larangan penggunaan LoadBalancer dan ExternalIPs, lihat [CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076)
dan [DenyServiceExternalIPs admission controller](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
untuk informasi lebih lanjut.

## Keamanan Pod

- [ ] Hak RBAC untuk `create`, `update`, `patch`, `delete` workloads hanya diberikan jika diperlukan.
- [ ] Kebijakan Pod Security Standards yang sesuai diterapkan untuk semua namespace dan ditegakkan.
- [ ] Batas memori ditetapkan untuk workloads dengan batas yang sama atau lebih rendah dari permintaan.
- [ ] Batas CPU dapat ditetapkan pada workloads yang sensitif.
- [ ] Untuk node yang mendukungnya, Seccomp diaktifkan dengan profil syscalls yang sesuai untuk program.
- [ ] Untuk node yang mendukungnya, AppArmor atau SELinux diaktifkan dengan profil yang sesuai untuk program.

Otorisasi RBAC sangat penting tetapi 
[tidak cukup granular untuk memiliki otorisasi pada sumber daya Pods](/docs/concepts/security/rbac-good-practices/#workload-creation)
(atau pada sumber daya apa pun yang mengelola Pods). Granularitas hanya ada pada API verbs 
pada sumber daya itu sendiri, misalnya, `create` pada Pods. Tanpa 
admission tambahan, otorisasi untuk membuat sumber daya ini memungkinkan akses langsung 
tanpa batas ke node yang dapat dijadwalkan dalam klaster.

[Pod Security Standards](/docs/concepts/security/pod-security-standards/)
mendefinisikan tiga kebijakan berbeda, yaitu privileged, baseline, dan restricted yang membatasi 
bagaimana field dapat diatur dalam `PodSpec` terkait keamanan. 
Standar ini dapat ditegakkan di tingkat namespace dengan 
[Pod Security Admission](/docs/concepts/security/pod-security-admission/) baru, 
yang diaktifkan secara default, atau dengan webhook admission pihak ketiga. Harap dicatat bahwa, 
berbeda dengan PodSecurityPolicy admission yang dihapus, 
[Pod Security Admission](/docs/concepts/security/pod-security-admission/) 
dapat dengan mudah digabungkan dengan webhook admission dan layanan eksternal.

Kebijakan `restricted` pada Pod Security Admission, kebijakan paling ketat dari 
[Pod Security Standards](/docs/concepts/security/pod-security-standards/), 
[dapat beroperasi dalam beberapa mode](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces), 
`warn`, `audit`, atau `enforce` untuk secara bertahap menerapkan 
[konteks keamanan](/docs/tasks/configure-pod-container/security-context/) 
yang paling sesuai sesuai dengan praktik terbaik keamanan. Namun demikian, 
[konteks keamanan](/docs/tasks/configure-pod-container/security-context/) 
pada pods harus diselidiki secara terpisah untuk membatasi hak istimewa dan akses yang mungkin dimiliki pods 
di luar standar keamanan yang telah ditentukan, untuk kasus penggunaan tertentu.

Untuk tutorial langsung tentang [Pod Security](/docs/concepts/security/pod-security-admission/), 
lihat posting blog 
[Kubernetes 1.23: Pod Security Graduates to Beta](/blog/2021/12/09/pod-security-admission-beta/).

[Batas memori dan CPU](/docs/concepts/configuration/manage-resources-containers/) 
harus ditetapkan untuk membatasi sumber daya memori dan CPU yang dapat dikonsumsi pod pada node, 
dan dengan demikian mencegah potensi serangan DoS dari workloads yang berbahaya atau 
terkompromi. Kebijakan semacam itu dapat ditegakkan oleh admission controller. 
Harap dicatat bahwa batas CPU akan membatasi penggunaan dan dengan demikian dapat memiliki efek yang tidak diinginkan 
pada fitur auto-scaling atau efisiensi, misalnya menjalankan proses dalam upaya terbaik dengan sumber daya CPU yang tersedia.

{{< caution >}}
Batas memori yang lebih tinggi dari permintaan dapat mengekspos seluruh node terhadap masalah OOM.
{{< /caution >}}

### Mengaktifkan Seccomp

Seccomp adalah singkatan dari secure computing mode dan telah menjadi fitur kernel Linux sejak versi 2.6.12. 
Fitur ini dapat digunakan untuk membatasi hak istimewa sebuah proses, dengan membatasi panggilan sistem (syscalls) 
yang dapat dilakukan dari ruang pengguna (userspace) ke kernel. Kubernetes memungkinkan Anda untuk secara otomatis 
menerapkan profil seccomp yang dimuat ke sebuah node ke Pods dan container Anda.

Seccomp dapat meningkatkan keamanan workloads Anda dengan mengurangi permukaan serangan syscall kernel Linux 
yang tersedia di dalam container. Mode filter seccomp memanfaatkan BPF untuk membuat daftar izin atau larangan 
terhadap syscall tertentu, yang disebut profil.

Sejak Kubernetes 1.27, Anda dapat mengaktifkan penggunaan `RuntimeDefault` sebagai profil seccomp default 
untuk semua workloads. Sebuah [tutorial keamanan](/docs/tutorials/security/seccomp/) tersedia untuk topik ini. 
Selain itu, [Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator) 
adalah proyek yang memfasilitasi pengelolaan dan penggunaan seccomp di dalam klaster.

{{< note >}}
Seccomp hanya tersedia pada node Linux.
{{< /note >}}

### Mengaktifkan AppArmor atau SELinux

#### AppArmor

[AppArmor](/docs/tutorials/security/apparmor/) adalah modul keamanan kernel Linux yang dapat 
menyediakan cara mudah untuk menerapkan Mandatory Access Control (MAC) dan audit yang lebih baik 
melalui log sistem. Profil AppArmor default diterapkan pada node yang mendukungnya, atau profil khusus dapat dikonfigurasi. 
Seperti seccomp, AppArmor juga dikonfigurasi melalui profil, di mana setiap profil dapat berjalan dalam mode enforcing, 
yang memblokir akses ke sumber daya yang tidak diizinkan, atau mode complain, yang hanya melaporkan pelanggaran. 
Profil AppArmor diterapkan pada basis per-container, dengan anotasi, memungkinkan proses untuk mendapatkan hak istimewa yang sesuai.

{{< note >}}
AppArmor hanya tersedia pada node Linux, dan diaktifkan di 
[beberapa distribusi Linux](https://gitlab.com/apparmor/apparmor/-/wikis/home#distributions-and-ports).
{{< /note >}}

#### SELinux

[SELinux](https://github.com/SELinuxProject/selinux-notebook/blob/main/src/selinux_overview.md) juga merupakan 
modul keamanan kernel Linux yang dapat menyediakan mekanisme untuk mendukung kebijakan kontrol akses, 
termasuk Mandatory Access Controls (MAC). Label SELinux dapat diberikan ke container atau pod 
[melalui bagian `securityContext`](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container).

{{< note >}}
SELinux hanya tersedia pada node Linux, dan diaktifkan di 
[beberapa distribusi Linux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux#Implementations).
{{< /note >}}

## Logs dan Audit

- [ ] Log audit, jika diaktifkan, dilindungi dari akses umum.

Log audit adalah alat penting untuk melacak aktivitas dalam klaster Kubernetes Anda. Jika log audit diaktifkan, pastikan log tersebut hanya dapat diakses oleh pengguna atau sistem yang berwenang. Hal ini membantu mencegah kebocoran informasi sensitif dan memastikan bahwa log dapat digunakan untuk investigasi keamanan tanpa risiko manipulasi atau akses tidak sah.

## Penempatan Pod

- [ ] Penempatan pod dilakukan sesuai dengan tingkat sensitivitas aplikasi.
- [ ] Aplikasi sensitif dijalankan secara terisolasi pada node atau dengan runtime sandbox tertentu.

Pod yang berada pada tingkat sensitivitas yang berbeda, misalnya pod aplikasi dan server API Kubernetes, sebaiknya diterapkan pada node yang terpisah. Tujuan dari isolasi node adalah untuk mencegah pelarian container aplikasi yang dapat langsung memberikan akses ke aplikasi dengan tingkat sensitivitas yang lebih tinggi, sehingga memudahkan penyerang untuk berpindah dalam klaster. Pemisahan ini harus ditegakkan untuk mencegah pod secara tidak sengaja diterapkan pada node yang sama. Hal ini dapat ditegakkan dengan fitur berikut:

[Node Selectors](/docs/concepts/scheduling-eviction/assign-pod-node/)
: Pasangan key-value, sebagai bagian dari spesifikasi pod, yang menentukan node mana yang akan digunakan untuk penerapan. Ini dapat ditegakkan pada tingkat namespace dan klaster dengan admission controller [PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector).

[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
: Sebuah admission controller yang memungkinkan administrator membatasi toleransi yang diizinkan dalam sebuah namespace. Pod dalam namespace hanya dapat menggunakan toleransi yang ditentukan pada kunci anotasi objek namespace yang menyediakan serangkaian toleransi default dan yang diizinkan.

[RuntimeClass](/docs/concepts/containers/runtime-class/)
: RuntimeClass adalah fitur untuk memilih konfigurasi runtime container. Konfigurasi runtime container digunakan untuk menjalankan container dalam pod dan dapat memberikan lebih banyak atau lebih sedikit isolasi dari host dengan biaya overhead kinerja.

## Secrets

- [ ] ConfigMap tidak digunakan untuk menyimpan data rahasia.
- [ ] Enkripsi saat data tidak aktif (encryption at rest) dikonfigurasi untuk API Secret.
- [ ] Jika sesuai, mekanisme untuk menyuntikkan secrets yang disimpan di penyimpanan pihak ketiga diterapkan dan tersedia.
- [ ] Token service account tidak dimasukkan ke dalam pod yang tidak membutuhkannya.
- [ ] [Bound service account token volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume) digunakan sebagai pengganti token yang tidak memiliki masa kedaluwarsa.

Secrets yang diperlukan untuk pod sebaiknya disimpan dalam Kubernetes Secrets, bukan alternatif seperti ConfigMap. Sumber daya Secret yang disimpan dalam etcd harus [dienkripsi saat data tidak aktif](/docs/tasks/administer-cluster/encrypt-data/).

Pod yang membutuhkan secrets sebaiknya memiliki secrets tersebut secara otomatis dimasukkan melalui volume, yang sebaiknya disimpan di memori seperti dengan opsi [`emptyDir.medium`](/docs/concepts/storage/volumes/#emptydir). Mekanisme juga dapat digunakan untuk menyuntikkan secrets dari penyimpanan pihak ketiga sebagai volume, seperti [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/). Hal ini sebaiknya dilakukan sebagai alternatif dibandingkan memberikan pod akses RBAC service account ke secrets. Dengan cara ini, secrets dapat ditambahkan ke pod sebagai variabel lingkungan atau file. Namun, perlu dicatat bahwa metode variabel lingkungan lebih rentan terhadap kebocoran karena core dump dalam log dan sifat variabel lingkungan di Linux yang tidak bersifat rahasia, dibandingkan dengan mekanisme izin pada file.

Token service account tidak boleh dimasukkan ke dalam pod yang tidak membutuhkannya. Hal ini dapat dikonfigurasi dengan mengatur [`automountServiceAccountToken`](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server) ke `false`, baik di dalam service account untuk diterapkan di seluruh namespace atau secara spesifik untuk sebuah pod. Untuk Kubernetes v1.22 dan yang lebih baru, gunakan [Bound Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume) untuk kredensial service account yang memiliki batas waktu.

## Images

- [ ] Minimalkan konten yang tidak diperlukan dalam container image.
- [ ] Container image dikonfigurasi untuk dijalankan sebagai pengguna tanpa hak istimewa.
- [ ] Referensi ke container image dilakukan menggunakan digest `sha256` (bukan tag) atau asal-usul image divalidasi dengan memverifikasi tanda tangan digital image saat waktu penerapan [melalui admission control](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller).
- [ ] Container image secara rutin dipindai selama pembuatan dan penerapan, dan perangkat lunak yang rentan diketahui diperbaiki.

Container image sebaiknya hanya berisi konten minimum yang diperlukan untuk menjalankan program yang dikemas. Sebaiknya hanya program dan dependensinya, dengan membangun image dari base image yang seminimal mungkin. Secara khusus, image yang digunakan di lingkungan produksi sebaiknya tidak mengandung shell atau utilitas debugging, karena [ephemeral debug container](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container) dapat digunakan untuk pemecahan masalah.

Bangun image agar langsung dijalankan dengan pengguna tanpa hak istimewa menggunakan [instruksi `USER` dalam Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user). [Security Context](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod) memungkinkan container image dijalankan dengan pengguna dan grup tertentu menggunakan `runAsUser` dan `runAsGroup`, bahkan jika tidak ditentukan dalam manifest image. Namun, izin file dalam layer image mungkin membuatnya tidak memungkinkan untuk langsung memulai proses dengan pengguna tanpa hak istimewa tanpa modifikasi image.

Hindari menggunakan tag image untuk mereferensikan image, terutama tag `latest`, karena image di balik tag dapat dengan mudah dimodifikasi di registry. Sebaiknya gunakan digest lengkap `sha256` yang unik untuk manifest image. Kebijakan ini dapat ditegakkan melalui [ImagePolicyWebhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook). Tanda tangan image juga dapat secara otomatis [diverifikasi dengan admission controller](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller) saat waktu penerapan untuk memvalidasi keaslian dan integritasnya.

Pemindaian container image dapat mencegah kerentanan kritis diterapkan ke klaster bersama dengan container image. Pemindaian image harus diselesaikan sebelum menerapkan container image ke klaster dan biasanya dilakukan sebagai bagian dari proses penerapan dalam pipeline CI/CD. Tujuan dari pemindaian image adalah untuk mendapatkan informasi tentang kemungkinan kerentanan dan pencegahannya dalam container image, seperti skor [Common Vulnerability Scoring System (CVSS)](https://www.first.org/cvss/). Jika hasil pemindaian image digabungkan dengan aturan kepatuhan pipeline, hanya container image yang telah diperbaiki dengan benar yang akan digunakan di lingkungan produksi.

## Admission controllers

- [ ] Pemilihan admission controller yang sesuai diaktifkan.
- [ ] Kebijakan keamanan pod ditegakkan oleh Pod Security Admission atau/atau webhook admission controller.
- [ ] Plugin rantai admission dan webhook dikonfigurasi dengan aman.

Admission controller dapat membantu meningkatkan keamanan klaster. Namun, mereka juga dapat menghadirkan risiko karena memperluas API server dan [harus diamankan dengan benar](/blog/2022/01/19/secure-your-admission-controllers-and-webhooks/).

Daftar berikut menyajikan sejumlah admission controller yang dapat dipertimbangkan untuk meningkatkan postur keamanan klaster dan aplikasi Anda. Ini mencakup controller yang mungkin dirujuk di bagian lain dokumen ini.

Grup pertama admission controller ini mencakup plugin yang [diaktifkan secara default](/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default), pertimbangkan untuk tetap mengaktifkannya kecuali Anda tahu apa yang Anda lakukan:

[`CertificateApproval`](/docs/reference/access-authn-authz/admission-controllers/#certificateapproval)
: Melakukan pemeriksaan otorisasi tambahan untuk memastikan pengguna yang menyetujui memiliki izin untuk menyetujui permintaan sertifikat.

[`CertificateSigning`](/docs/reference/access-authn-authz/admission-controllers/#certificatesigning)
: Melakukan pemeriksaan otorisasi tambahan untuk memastikan pengguna yang menandatangani memiliki izin untuk menandatangani permintaan sertifikat.

[`CertificateSubjectRestriction`](/docs/reference/access-authn-authz/admission-controllers/#certificatesubjectrestriction)
: Menolak permintaan sertifikat apa pun yang menentukan 'group' (atau 'atribut organisasi') dari `system:masters`.

[`LimitRanger`](/docs/reference/access-authn-authz/admission-controllers/#limitranger)
: Menegakkan batasan API LimitRange.

[`MutatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
: Memungkinkan penggunaan custom controller melalui webhook, controller ini dapat memodifikasi permintaan yang mereka tinjau.

[`PodSecurity`](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
: Pengganti untuk Pod Security Policy, membatasi konteks keamanan dari Pod yang diterapkan.

[`ResourceQuota`](/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
: Menegakkan kuota sumber daya untuk mencegah penggunaan sumber daya yang berlebihan.

[`ValidatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
: Memungkinkan penggunaan custom controller melalui webhook, controller ini tidak memodifikasi permintaan yang mereka tinjau.

Grup kedua mencakup plugin yang tidak diaktifkan secara default tetapi berada dalam status ketersediaan umum dan direkomendasikan untuk meningkatkan postur keamanan Anda:

[`DenyServiceExternalIPs`](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
: Menolak semua penggunaan baru dari field `Service.spec.externalIPs`. Ini adalah mitigasi untuk [CVE-2020-8554: Man in the middle menggunakan LoadBalancer atau ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076).

[`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
: Membatasi izin kubelet untuk hanya memodifikasi sumber daya API pod yang mereka miliki atau sumber daya API node yang mewakili mereka sendiri. Ini juga mencegah kubelet menggunakan anotasi `node-restriction.kubernetes.io/`, yang dapat digunakan oleh penyerang dengan akses ke kredensial kubelet untuk memengaruhi penempatan pod ke node yang dikontrol.

Grup ketiga mencakup plugin yang tidak diaktifkan secara default tetapi dapat dipertimbangkan untuk kasus penggunaan tertentu:

[`AlwaysPullImages`](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
: Menegakkan penggunaan versi terbaru dari image yang ditandai dan memastikan bahwa pengelola memiliki izin untuk menggunakan image tersebut.

[`ImagePolicyWebhook`](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
: Memungkinkan penegakan kontrol tambahan untuk image melalui webhook.

## Langkah Selanjutnya

- [Privilege escalation via Pod creation](/docs/reference/access-authn-authz/authorization/#privilege-escalation-via-pod-creation) 
  memberikan peringatan tentang risiko kontrol akses tertentu; periksa bagaimana Anda mengelola ancaman tersebut.
  - Jika Anda menggunakan Kubernetes RBAC, baca 
    [RBAC Good Practices](/docs/concepts/security/rbac-good-practices/) untuk 
    informasi lebih lanjut tentang otorisasi.
- [Mengamankan Klaster](/docs/tasks/administer-cluster/securing-a-cluster/) untuk 
  informasi tentang melindungi klaster dari akses yang tidak disengaja atau berbahaya.
- [Panduan Multi-tenancy Klaster](/docs/concepts/security/multi-tenancy/) untuk 
  rekomendasi opsi konfigurasi dan praktik terbaik tentang multi-tenancy.
- [Posting Blog "Melihat Lebih Dekat Panduan Penguatan Kubernetes NSA/CISA"](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#building-secure-container-images) 
  sebagai sumber pelengkap untuk memperkuat klaster Kubernetes.
