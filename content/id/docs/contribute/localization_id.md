---
title: Dokumentasi Khusus Untuk Translasi Bahasa Indonesia
content_type: concept
---

<!-- overview -->

Panduan khusus untuk bergabung ke komunitas SIG DOC Indonesia dan melakukan
kontribusi untuk menerjemahkan dokumentasi Kubernetes ke dalam Bahasa
Indonesia.

<!-- body -->

## Manajemen _Milestone_ Tim {#manajemen-milestone-tim}

Secara umum siklus translasi dokumentasi ke Bahasa Indonesia akan dilakukan
3 kali dalam setahun (sekitar setiap 4 bulan). Untuk menentukan dan mengevaluasi
pencapaian atau _milestone_ dalam kurun waktu tersebut [jadwal rapat daring
reguler tim Bahasa Indonesia](https://zoom.us/j/6072809193) dilakukan secara
konsisten setiap dua minggu sekali. Dalam [agenda rapat ini](https://docs.google.com/document/d/1Qrj-WUAMA11V6KmcfxJsXcPeWwMbFsyBGV4RGbrSRXY)
juga dilakukan pemilihan PR _Wrangler_ untuk dua minggu ke depan. Tugas PR
_Wrangler_ tim Bahasa Indonesia serupa dengan PR _Wrangler_ dari proyek
_upstream_.

Target pencapaian atau _milestone_ tim akan dirilis sebagai
[_issue tracking_ seperti ini](https://github.com/kubernetes/website/issues/22296)
pada Kubernetes GitHub Website setiap 4 bulan. Dan bersama dengan informasi
PR _Wrangler_ yang dipilih setiap dua minggu, keduanya akan diumumkan di Slack
_channel_ [#kubernetes-docs-id](https://kubernetes.slack.com/archives/CJ1LUCUHM)
dari Komunitas Kubernetes.

## Cara Memulai Translasi

Untuk menerjemahkan satu halaman Bahasa Inggris ke Bahasa Indonesia, lakukan
langkah-langkah berikut ini:

* Periksa halaman _issue_ di GitHub dan pastikan tidak ada orang lain yang sudah
mengklaim halaman kamu dalam daftar periksa atau komentar-komentar sebelumnya.
* Klaim halaman kamu pada _issue_ di GitHub dengan memberikan komentar di bawah
dengan nama halaman yang ingin kamu terjemahkan dan ambillah hanya satu halaman
dalam satu waktu.
* _Fork_ [repo ini](https://github.com/kubernetes/website), buat terjemahan
kamu, dan kirimkan PR (_pull request_) dengan label `language/id`.
* Setelah dikirim, pengulas akan memberikan komentar dalam beberapa hari, dan
tolong untuk menjawab semua komentar. Direkomendasikan juga untuk melakukan
[_squash_](https://github.com/wprig/wprig/wiki/How-to-squash-commits) _commit_
kamu dengan pesan _commit_ yang baik.

## Informasi Acuan Untuk Translasi

Tidak ada panduan gaya khusus untuk menulis translasi ke bahasa Indonesia.
Namun, secara umum kita dapat mengikuti panduan gaya bahasa Inggris dengan
beberapa tambahan untuk kata-kata impor yang dicetak miring.

Harap berkomitmen dengan terjemahan kamu dan pada saat kamu mendapatkan komentar
dari pengulas, silakan atasi sebaik-baiknya. Kami berharap halaman yang
diklaim akan diterjemahkan dalam waktu kurang lebih dua minggu. Jika ternyata
kamu tidak dapat berkomitmen lagi, beri tahu para pengulas agar mereka dapat
meberikan halaman tersebut ke orang lain.

Beberapa acuan tambahan dalam melakukan translasi silakan lihat informasi
berikut ini:

### Daftar Glosarium Translasi dari tim SIG DOC Indonesia
Untuk kata-kata selengkapnya silakan baca glosariumnya
di [sini](#glosarium-indonesia).

### KBBI
Konsultasikan dengan situs KBBI (Kamus Besar Bahasa Indonesia)
di [sini](https://kbbi.web.id/) atau situs dari Kemendikbud di
[sini](https://kbbi.kemdikbud.go.id/).

### RSNI Glosarium dari Ivan Lanin
[RSNI Glosarium](https://github.com/jk8s/sig-docs-id-localization-how-tos/blob/master/resources/RSNI-glossarium.pdf)
dapat digunakan untuk memahami bagaimana menerjemahkan berbagai istilah teknis
dan khusus Kubernetes.

## Panduan Penulisan _Source Code_

### Mengikuti kode asli dari dokumentasi bahasa Inggris

Untuk kenyamanan pemeliharaan, ikuti lebar teks asli dalam kode bahasa Inggris.
Dengan kata lain, jika teks asli ditulis dalam baris yang panjang tanpa putus
satu baris, maka teks tersebut ditulis panjang dalam satu baris meskipun dalam
bahasa Indonesia. Jagalah agar tetap serupa.

### Hapus nama pengulas di kode asli bahasa Inggris

Terkadang pengulas ditentukan di bagian atas kode di teks asli Bahasa Inggris.
Secara umum, pengulas-pengulas halaman aslinya akan kesulitan untuk meninjau
halaman  dalam bahasa Indonesia, jadi hapus kode yang terkait dengan informasi
pengulas dari metadata kode tersebut.

## Panduan Penulisan Kata-kata Translasi

### Panduan umum

* Gunakan "kamu" daripada "Anda" sebagai subyek agar lebih bersahabat dengan
para pembaca dokumentasi.
* Tulislah miring untuk kata-kata bahasa Inggris yang diimpor jika kamu tidak
dapat menemukan kata-kata tersebut dalam bahasa Indonesia.
    * ✅ Benar: _controller_.
    * ❌ Salah: controller, `controller`.
* Selalu rujuk setiap istilah teknis saat pertama kali disebutkan dalam dokumen ke glosarium.
* Gunakan kalimat aktif bila memungkinkan.
    * ✅ Benar: "Pod menjalankan satu atau lebih kontainer."
    * ❌ Salah: "Sebuah Pod menjalankan satu atau lebih kontainer." (terlalu kaku)
* Jangan menerjemahkan perintah CLI atau keluaran perintah CLI (misalnya, `kubectl get pods` harus tetap dalam bahasa Inggris).
* Ikuti terjemahan di [Glosarium Indonesia](#glosarium-indonesia).

### Panduan untuk kata-kata API Objek Kubernetes

Gunakan gaya "CamelCase" untuk menulis objek API Kubernetes, lihat daftar
lengkapnya [di sini](/docs/reference/kubernetes-api/).
Sebagai contoh:

* PersistentVolume
    * ✅ Benar: PersistentVolume.
    * ❌ Salah: volume persisten, `PersistentVolume`, persistentVolume.

* Pod
    * ✅ Benar: Pod.
    * ❌ Salah: pod, `pod`, "pod".

💡 *Tips*: Biasanya API objek sudah ditulis dalam huruf kapital pada halaman asli
bahasa Inggris.

### Panduan untuk kata-kata yang sama dengan API Objek Kubernetes

Ada beberapa kata-kata yang serupa dengan nama API objek dari Kubernetes dan
dapat mengacu ke arti yang lebih umum (tidak selalu dalam konteks Kubernetes).
Sebagai contoh: _service_, _container_, _node_ , dan lain sebagainya. Kata-kata
sebaiknya diterjemahkan ke Bahasa Indonesia sebagai contoh _service_ menjadi
layanan, _container_ menjadi kontainer.

💡 *Tips*: Biasanya kata-kata yang mengacu ke arti yang lebih umum sudah *tidak*
ditulis dalam huruf kapital pada halaman asli bahasa Inggris.

### Panduan untuk "Feature Gate" Kubernetes

Istilah [_feature gate_](/docs/reference/command-line-tools-reference/feature-gates/)
Kubernetes tidak perlu diterjemahkan ke dalam bahasa Indonesia dan tetap
dipertahankan dalam bentuk aslinya.

Contoh dari _feature gate_ adalah sebagai berikut:

- AllowUnsafeMalformedObjectDeletion
- AnonymousAuthConfigurableEndpoints
- APIResponseCompression
- ...

### Glosarium Indonesia

| **Inggris** | **Indonesia** | **Catatan** | **Sumber** |
|-------------|---------------|-------------|------------|
| Add-ons | ... | ... | ... |
| Admission Controller | ... | ... | ... |
| Affinity | Afinitas | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/afinitas |
| Aggregation Layer | Lapisan Agregasi | Dilokalkan | ... |
| Annotation | Anotasi | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/anotasi |
| API Group | Grup API | Dilokalkan | ... |
| API Resource | Sumber Daya API | Dilokalkan | ... |
| API Server | Server API | Dilokalkan | ... |
| API-initiated eviction | ... | ... | ... |
| App Container | Kontainer Aplikasi | Dilokalkan | ... |
| Application Architect | Aplikasi Arsitek | Dilokalkan | ... |
| Applications | Aplikasi | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/aplikasi |
| Approver | Pemberi Persetujuan | Dilokalkan | ... |
| cAdvisor | cAdvisor | Tetap | ... |
| Certificate | Sertifikat | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/sertifikat |
| cgroup (control group) | cgroup (control group) | Tetap | ... |
| CIDR | CIDR | Tetap | ... |
| CLA (Contributor License Agreement) | CLA (Contributor License Agreement) | Tetap | ... |
| Cluster | Klaster | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/klaster |
| ConfigMap | ConfigMap | Tetap | ... |
| Container | Kontainer | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/kontainer |
| Container Environment Variables | ... | ... | ... |
| Container Lifecycle Hooks | ... | ... | ... |
| Container Network Interface (CNI) | ... | ... | ... |
| Container Runtime | ... | ... | ... |
| Container Runtime Interface (CRI) | ... | ... | ... |
| Container Storage Interface (CSI) | ... | ... | ... |
| containerd | containerd | Tetap | ... |
| Contributor | Kontributor | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/kontributor |
| Control Plane | ... | ... | ... |
| Controller | Pengontrol | Dilokalkan | ... |
| CRI-O | ... | ... | ... |
| CronJob | CronJob | Tetap | ... |
| CustomResourceDefinition | ... | ... | ... |
| DaemonSet | DaemonSet | Tetap | ... |
| Data Plane | ... | ... | ... |
| Deployment | Deployment | Tetap | ... |
| Developer | ... | ... | ... |
| Device Plugin | ... | ... | ... |
| Disruption | Disrupsi | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/disrupsi |
| Docker | Docker | Tetap | ... |
| Dockershim | Dockershim | Tetap | ... |
| Downstream | ... | ... | ... |
| Downward API | ... | ... | ... |
| Drain | ... | ... | ... |
| Duration | Durasi | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/durasi | ... |
| Dynamic Volume Provisioning | ... | ... | ... |
| Endpoints | ... | ... | ... |
| EdnpointSlice | ... | ... | ... |
| Ephemeral Container | Kontainer Sementara | Dilokalkan | ... |
| etcd | etcd | Tetap | ... |
| Event | ... | ... | ... |
| Eviction | Pengusiran | Dilokalkan | ... |
| Extensions | Ekstensi | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/ekstensi |
| Feature gate | ... | ... | ... |
| Finalizer | ... | ... | ... |
| FlexVolume | FlexVolume | Tetap | ... |
| Garbage Collection | ... | ... | ... |
| Gateway API | ... | ... | ... |
| Group Version Resource | ... | ... | ... |
| Helm Chart | ... | ... | ... |
| Horizontal Pod Autoscaler | ... | ... | ... |
| HostAliases | HostAliases | Tetap | ... |
| Image | Image | Tetap | ... |
| Immutable Infrastucture | ... | ... | ... |
| Ingress | Ingress | Tetap | ... |
| Init Container | Kontainer Inisiasi | Dilokalkan | ... |
| Istio | Istio | Tetap | ... |
| Job | Job | Tetap | ... |
| JSON Web Token (JWT) | JSON Web Token (JWT) | Tetap | ... |
| kOps (Kubernetes Operations) | kOps (Operasi Kubernetes) | Dilokalkan | ... |
| kube-controller-manager | kube-controller-manager | Tetap | ... |
| kube-proxy | kube-proxy | Tetap | ... |
| kube-scheduler | kube-scheduler | Tetap | ... |
| Kubeadm | Kubeadm | Tetap | ... |
| Kubectl | Kubectl | Tetap | ... |
| Kubelet | Kubelet | Tetap | ... |
| Kubernetes API | API Kubernetes | Dilokalkan | ... |
| Label | Label | Tetap, Label juga adalah Label dalam Bahasa | https://kbbi.kemdikbud.go.id/entri/label |
| LimitRange | LimitRange | Tetap | ... |
| Logging | ... | ... | ... |
| Managed Service | ... | ... | ... |
| Manifest | Manifes | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/manifes |
| Master | Master | Tetap, Master juga adalah Master dalam Bahasa | https://kbbi.kemdikbud.go.id/entri/master |
| Member | Anggota | Dilokalkan | ... |
| Minikube | Minikube | Tetap | ... |
| Mirror Pod | ... | ... | ... |
| Mixed Version Proxy (MVP) | ... | ... | ... |
| Name | Name | Tetap | ... |
| Namespace | Namespace | Tetap | ... |
| Network Policy | ... | ... | ... |
| Node | Node | Tetap | ... |
| Node-pressure eviction | ... | ... | ... |
| Object | Objek | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/objek |
| Operator pattern | ... | ... | ... |
| Persistent Volume | Persistent Volume | Tetap | ... |
| Persistent Volume Claim | Persistent Volume Claim | Tetap | ... |
| Platform Developer | ... | ... | ... |
| Pod | Pod | Tetap (widely understood) | ... |
| Pod Disruption | Disrupsi Pod | Dilokalkan | ... |
| Pod Disruption Budget | ... | ... | ... |
| Pod Lifecycle | ... | ... | ... |
| Pod Priority | Prioritas Pod | Dilokalkan | ... |
| Pod Security Policy | ... | ... | ... |
| PodTemplate | PodTemplate | Tetap | ... |
| Preemption | ... | ... | ... |
| PriorityClass | PriorityClass | Tetap | ... |
| Probe | ... | ... | ... |
| Proxy | ... | ... | ... |
| QoS Class | Kelas QoS | Dilokalkan | ... |
| Quantity | Kuantitas | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/kuantitas |
| RBAC (Role-Based Access Control) | RBAC (Role-Based Access Control) | Tetap | ... |
| Replica | ... | ... | ... |
| ReplicaSet | ReplicaSet | Tetap | ... |
| ReplicationController | ReplicationController | Tetap | ... |
| Resource (infrastructure) | ... | ... | ... |
| Resource Quotas | ... | ... | ... |
| Reviewer | Pengulas | Dilokalkan | https://kbbi.kemdikbud.go.id/entri/pengulas |
| Secret | Secret | Tetap | ... |
| Security Context | ... | ... | ... |
| Selector | ... | ... | ... |
| Service | Servis | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/servis |
| Service Catalog | ... | ... | ... |
| ServiceAccount | ServiceAccount | Tetap | ... |
| Shuffle-sharding | Shuffle-sharding | Tetap | ... |
| Sidecar Container | Kontainer Sidecar | Dilokalkan | ... |
| SIG (special interest group) | SIG (special interest group) | Tetap | ... |
| Spec | Spec | Tetap | ... |
| StatefulSet | StatefulSet | Tetap | ... |
| Static Pod | Pod Statis | Dilokalkan | ... |
| Storage Class | ... | ... | ... |
| sysctl | sysctl | Tetap | ... |
| Taint | ... | ... | ... |
| Toleration | Toleransi | Ejaan yang disesuaikan | https://kbbi.kemdikbud.go.id/entri/toleransi |
| UID | UID | Tetap | ... |
| Upstream | ... | ... | ... |
| user namespace | ... | ... | ... |
| Volume | Volume | Tetap | ... |
| Volume Plugin | Volume Plugin | Tetap | ... |
| Watch | Watch | Tetap | ... |
| WG (working group) | ... | ... | ... |
| Workload | ... | ... | ... |
