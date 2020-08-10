---
title: Komunikasi antara Control Plane dan Node
content_type: concept
weight: 20
---

<!-- overview -->

Dokumen ini menjelaskan tentang jalur-jalur komunikasi di antara klaster Kubernetes dan control plane yang sebenarnya hanya berhubungan dengan apiserver saja.
Kenapa ada dokumen ini? Supaya kamu, para pengguna Kubernetes, punya gambaran bagaimana mengatur instalasi untuk memperketat konfigurasi jaringan di dalam klaster.
Hal ini cukup penting, karena klaster bisa saja berjalan pada jaringan tak terpercaya (<i>untrusted network</i>), ataupun melalui alamat-alamat IP publik pada penyedia cloud.




<!-- body -->

## Node Menuju Control Plane

Kubernetes memiliki sebuah pola API "hub-and-spoke". Semua penggunaan API dari Node (atau Pod dimana Pod-Pod tersebut dijalankan) akan diterminasi pada apiserver (tidak ada satu komponen _control plane_ apa pun yang didesain untuk diekspos pada servis _remote_).
Apiserver dikonfigurasi untuk mendengarkan koneksi aman _remote_ yang pada umumnya terdapat pada porta HTTPS (443) dengan satu atau lebih bentuk [autentikasi](/docs/reference/access-authn-authz/authentication/) klien yang dipasang.
Sebaiknya, satu atau beberapa metode [otorisasi](/docs/reference/access-authn-authz/authorization/) juga dipasang, terutama jika kamu memperbolehkan [permintaan anonim (<i>anonymous request</i>)](/docs/reference/access-authn-authz/authentication/#anonymous-requests) ataupun [service account token](/docs/reference/access-authn-authz/authentication/#service-account-tokens).

Jika diperlukan, Pod-Pod dapat terhubung pada apiserver secara aman dengan menggunakan ServiceAccount.
Dengan ini, Kubernetes memasukkan _public root certificate_ dan _bearer token_ yang valid ke dalam Pod, secara otomatis saat Pod mulai dijalankan.
Kubernetes Service (di dalam semua Namespace) diatur dengan sebuah alamat IP virtual. Semua yang mengakses alamat IP ini akan dialihkan (melalui kube-proxy) menuju _endpoint_ HTTPS dari apiserver.

Komponen-komponen  juga melakukan koneksi pada apiserver klaster melalui porta yang aman.

Akibatnya, untuk konfigurasi yang umum dan standar, semua koneksi dari klaster (node-node dan pod-pod yang berjalan di atas node tersebut) menujucontrol planesudah terhubung dengan aman.
Dan juga, klaster dancontrol planebisa terhubung melalui jaringan publik dan/atau yang tak terpercaya (<i>untrusted</i>).

## Control Plane menuju Node

Ada dua jalur komunikasi utama dari _control plane_ (apiserver) menuju klaster. Pertama, dari apiserver ke proses kubelet yang berjalan pada setiap Node di dalam klaster. Kedua, dari apiserver ke setiap Node, Pod, ataupun Service melalui fungsi proksi pada apiserver

### Apiserver menuju kubelet

Koneksi dari apiserver menuju kubelet bertujuan untuk:

  * Melihat log dari pod-pod.
  * Masuk ke dalam pod-pod yang sedang berjalan (<i>attach</i>).
  * Menyediakan fungsi port-forward dari kubelet.

Semua koneksi ini diterminasi pada <i>endpoint</i> HTTPS dari kubelet.
Secara <i>default</i>, apiserver tidak melakukan verifikasi <i>serving certificate</i> dari kubelet, yang membuat koneksi terekspos pada serangan <i>man-in-the-middle</i>, dan juga **tidak aman** untuk terhubung melalui jaringan tak terpercaya (<i>untrusted</i>) dan/atau publik.

Untuk melakukan verifikasi koneksi ini, berikan <i>root certificate</i> pada apiserver melalui tanda `--kubelet-certificate-authority`, sehingga apiserver dapat memverifikasi <i>serving certificate</i> dari kubelet.

Cara lainnya, gunakan [tunnel SSH](/docs/concepts/architecture/master-node-communication/#ssh-tunnels) antara apiserver dan kubelet jika diperlukan, untuk menghindari komunikasi melalui jaringan tak terpercaya (<i>untrusted</i>) atau publik.

Terakhir, yang terpenting, aktifkan [autentikasi dan/atau otorisasi Kubelet](/docs/admin/kubelet-authentication-authorization/) untuk mengamankan API kubelet.

### Apiserver menuju Node, Pod, dan Service

Secara <i>default</i>, koneksi apiserver menuju node, pod atau service hanyalah melalui HTTP polos (<i>plain</i>), sehingga tidak ada autentikasi maupun enkripsi.
Koneksi tersebut bisa diamankan melalui HTTPS dengan menambahkan `https:` pada URL API dengan nama dari node, pod, atau service.
Namun, koneksi tidak tervalidasi dengan <i>certificate</i> yang disediakan oleh <i>endpoint</i> HTTPS maupun kredensial <i>client</i>, sehingga walaupun koneksi sudah terenkripsi, tidak ada yang menjamin integritasnya.
Koneksi ini **tidak aman** untuk dilalui pada jaringan publik dan/atau tak terpercaya <i>untrusted</i>.

### Tunnel SSH

Kubernetes menyediakan tunnel SSH untuk mengamankan jalur komunikasi control plane -> Klaster.
Dengan ini, apiserver menginisiasi sebuah <i>tunnel</i> SSH untuk setiap node di dalam klaster (terhubung ke server SSH di port 22) dan membuat semua trafik menuju kubelet, node, pod, atau service dilewatkan melalui <i>tunnel</i> tesebut.
<i>Tunnel</i> ini memastikan trafik tidak terekspos keluar jaringan dimana node-node berada.

<i>Tunnel</i> SSH saat ini sudah usang (<i>deprecated</i>), jadi sebaiknya jangan digunakan, kecuali kamu tahu pasti apa yang kamu lakukan.
Sebuah desain baru untuk mengganti kanal komunikasi ini sedang disiapkan.
