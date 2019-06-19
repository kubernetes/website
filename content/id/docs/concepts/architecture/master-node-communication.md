---
title: Komunikasi Master-Node
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Dokumen ini menjelaskan tentang jalur-jalur komunikasi di antara kluster Kubernetes dan master yang sebenarnya hanya berhubungan dengan apiserver saja.
Kenapa ada dokumen ini? Supaya kamu, para pengguna Kubernetes, punya gambaran bagaimana mengatur instalasi untuk memperketat konfigurasi jaringan di dalam kluster.
Hal ini cukup penting, karena kluster bisa saja berjalan pada jaringan tak terpercaya (<i>untrusted network</i>), ataupun melalui alamat-alamat IP publik pada penyedia cloud.

{{% /capture %}}


{{% capture body %}}

## Kluster menuju Master

Semua jalur komunikasi dari kluster menuju master diterminasi pada apiserver. 
Tidak ada komponen apapun di dalam master, selain apiserver, yang terekspos ke luar untuk diakses dari servis <i>remote</i>.
Untuk instalasi kluster pada umumnya, apiserver diatur untuk <i>listen</i> ke koneksi <i>remote</i> melalui port HTTPS (443) yang aman, dengan satu atau beberapa metode [autentikasi](/docs/reference/access-authn-authz/authentication/) <i>client</i> yang telah terpasang.
Sebaiknya, satu atau beberapa metode [otorisasi](/docs/reference/access-authn-authz/authorization/) juga dipasang, terutama jika kamu memperbolehkan [permintaan anonim (<i>anonymous request</i>)](/docs/reference/access-authn-authz/authentication/#anonymous-requests) ataupun [service account token](/docs/reference/access-authn-authz/authentication/#service-account-tokens).

Node-node seharusnya disediakan dengan <i>public root certificate</i> untuk kluster, sehingga node-node tersebut bisa terhubung secara aman ke apiserver dengan kredensial <i>client</i> yang valid.
Contohnya, untuk instalasi GKE dengan standar konfigurasi, kredensial <i>client</i> harus diberikan kepada kubelet dalam bentuk <i>client certificate</i>.
Lihat [menghidupkan TLS kubelet](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) untuk menyediakan <i>client certificate</i> untuk kubelet secara otomatis.

Jika diperlukan, pod-pod dapat terhubung pada apiserver secara aman dengan menggunakan <i>service account</i>.
Dengan ini, Kubernetes memasukkan <i>public root certificate</i> dan <i>bearer token</i> yang valid ke dalam pod, secara otomatis saat pod mulai dijalankan.
Kubernetes <i>service</i> (di dalam semua <i>namespace</i>) diatur dengan sebuah alamat IP virtual.
Semua yang mengakses alamat IP ini akan dialihkan (melalui kube-proxy) menuju <i>endpoint</i> HTTPS dari apiserver.

Komponen-komponen master juga berkomunikasi dengan apiserver melalui port yang aman di dalam kluster.
Akibatnya, untuk konfigurasi yang umum dan standar, semua koneksi dari kluster (node-node dan pod-pod yang berjalan di atas node tersebut) menuju master sudah terhubung dengan aman.
Dan juga, kluster dan master bisa terhubung melalui jaringan publik dan/atau yang tak terpercaya (<i>untrusted</i>).

## Master menuju Kluster

Ada dua jalur komunikasi utama dari master (apiserver) menuju kluster.
Pertama, dari apiserver ke <i>process</i> kubelet yang berjalan pada setiap node di dalam kluster.
Kedua, dari apiserver ke setiap node, pod, ataupun service melalui fungsi <i>proxy</i> pada apiserver. 

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

Kubernetes menyediakan tunnel SSH untuk mengamankan jalur komunikasi Master -> Kluster.
Dengan ini, apiserver menginisiasi sebuah <i>tunnel</i> SSH untuk setiap node di dalam kluster (terhubung ke server SSH di port 22) dan membuat semua trafik menuju kubelet, node, pod, atau service dilewatkan melalui <i>tunnel</i> tesebut.
<i>Tunnel</i> ini memastikan trafik tidak terekspos keluar jaringan dimana node-node berada.

<i>Tunnel</i> SSH saat ini sudah usang (<i>deprecated</i>), jadi sebaiknya jangan digunakan, kecuali kamu tahu pasti apa yang kamu lakukan.
Sebuah desain baru untuk mengganti kanal komunikasi ini sedang disiapkan.

{{% /capture %}}
