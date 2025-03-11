---
title: Protokol untuk Service
content_type: reference
weight: 10
---

<!-- overview -->
Jika Anda mengonfigurasi {{< glossary_tooltip text="Service" term_id="service" >}},
Anda dapat memilih protokol jaringan manapun selama didukung oleh Kubernetes.

Berikut ini adalah protokol yang didukung Kubernetes untuk digunakan oleh Service:

- [`SCTP`](#protocol-sctp)
- [`TCP`](#protocol-tcp) _(protokol bawaan)_
- [`UDP`](#protocol-udp)

Ketika Anda mendefinisikan Service, Anda juga dapat menggunakan
[protokol aplikasi](/docs/concepts/services-networking/service/#application-protocol) untuk Service.

Halaman ini menjelaskan beberapa kasus khusus, dimana kebanyakan kasus yang terjadi adalah saat penggunaan TCP sebagai protokol *transport*:

- [HTTP](#protocol-http-special) dan [HTTPS](#protocol-http-special)
- [protokol PROXY](#protocol-proxy-special)
- terminasi [TLS](#protocol-tls-special) di *load balancer*

<!-- body -->
## Protokol yang didukung {#protocol-support}

Ada 3 protokol valid yang dapat digunakan *port* suatu Service:

### `SCTP` {#protocol-sctp}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Ketika menggunakan *plugin* jaringan yang mendukung SCTP, Anda dapat menggunakan SCTP untuk sebagian besar Service. Untuk Service dengan `type: LoadBalancer` , dukungan SCTP tersedia apabila penyedia *cloud* menyediakan protokol ini. (Kebanyakan dari mereka tidak menyediakan dukungan untuk protokol ini).

SCTP tidak tersedia untuk *node* yang menjalankan Windows.

#### Dukungan untuk asosiasi *multihomed SCTP* {#caveat-sctp-multihomed}

Dukungan untuk asosiasi *multihomed SCTP* memerlukan *plugin* CNI agar mendukung penempatan banyak *interface* dan alamat IP ke sebuah Pod.

NAT untuk asosiasi *multihomed SCTP* memerlukan logika khusus di modul Kernel terkait.

### `TCP` {#protocol-tcp}

Anda dapat menggunakan TCP untuk berbagai macam Service, dan ini adalah protokol jaringan bawaan.

### `UDP` {#protocol-udp}

Anda dapat menggunakan UDP untuk  sebagian besar Service. Untuk Service dengan `type: LoadBalancer`, dukungan UDP tersedia apabila penyedia *cloud* menyediakan protokol ini

## Kasus Khusus

### HTTP {#protocol-http-special}

Jika penyedia *cloud* mendukung protokol ini, Anda dapat menggunakan Service dengan mode *LoadBalancer* untuk mengonfigurasi *load balancer* yang berada di luar klaster Kubernetes, dengan menggunakan mode khusus dimana *load balancer* yang disediakan penyedia *cloud* telah mengimplementasi HTTP / HTTPS *proxying*, dimana lalu lintas paket diteruskan ke *backend endpoint* untuk Service tersebut.

Biasanya, Anda mengatur protokol untuk Service dengan TCP dan menambahkan
*{{< glossary_tooltip text="annotation" term_id="annotation" >}}*
(biasanya tergantung ke penyedia *cloud*) yang mengonfigurasi *load balancer* untuk menangani lalu lintas paket di tingkat HTTP.
Konfigurasi ini menyediakan juga HTTPS (HTTP di atas TLS) dan *reverse-proxying* HTTP sederhana untuk *workload* Anda.

{{< note >}}
Anda juga dapat menggunakan *{{< glossary_tooltip term_id="ingress" >}}* untuk mengekspos Service dengan HTTP/HTTPS.
{{< /note >}}

Anda juga mungkin ingin mengatur [protokol aplikasi](/docs/concepts/services-networking/service/#application-protocol) suatu koneksi dengan `http` atau `https`. Gunakan `http` jika *session* dari *load balancer* untuk *workload* Anda adalah HTTP tanpa TLS. Dan gunakan `https` jika *session*  dari *load balancer* untuk *workload* Anda menggunakan enkripsi TLS.

### protokol PROXY {#protocol-proxy-special}

Jika penyedia *cloud* Anda mendukung protokol ini, Anda dapat menggunakan Service dengan `type: LoadBalancer`
untuk mengonfigurasi *load balancer* diluar klaster Kubernetes sendiri, yang akan meneruskan koneksi yang dibungkus oleh
[protokol PROXY](https://www.haproxy.org/download/2.5/doc/proxy-protocol.txt).

Kemudian *Load balancer* mengirim rangkaian oktet awal yang menggambarkan koneksi kedatangan, mirip dengan contoh dibawah ini (protokol PROXY v1):

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```
Data yang masuk setelah pembukaan protokol PROXY adalah data asli dari klien. Ketika kedua sisi menutup koneksi, *load balancer* juga memicu penutupan koneksi dan mengirim sisa data ketika memungkinkan.

Biasanya, Anda mendefinisikan Service dengan protokol TCP. Anda juga dapat menambahkan *annotation*, yang khusus untuk penyedia *cloud* Anda, yang mengonfigurasi *load balancer* dengan membungkus setiap koneksi yang datang dengan protokol PROXY.

### TLS {#protocol-tls-special}

Jika penyedia *cloud* Anda mendukung protokol ini, Anda dapat menggunakan protokol ini pada Service sebagai cara untuk membangun *reverse proxying* eksternal, dimana koneksi yang datang dari klien ke *load balancer* terenkripsi dengan TLS dan *load balancer* adalah TLS *server peer*. Koneksi dari *load balancer* yang menuju *workload* Anda dapat juga berupa TLS, atau teks biasa. Pilihan yang tersedia untuk Anda tergantung dari *penyedia cloud* atau implementasi kustom suatu Service.

Biasanya, Anda mengatur protokol ke `TCP` dan menambahkan *annotation* (biasanya khusus untuk penyedia *cloud* Anda) yang mengonfigurasi *load balancer* untuk berjalan sebagai *server* TLS. Anda juga dapat mengonfigurasi identitas TLS (sebagai server, dan mungkin juga sebagai klien yang terhubung ke *workload* Anda) dengan menggunakan mekanisme yang tersedia khusus untuk penyedia *cloud* Anda.
