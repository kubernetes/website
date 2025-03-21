---
title: Panduan Pengamanan - Mekanisme Autentikasi
description: >
  Informasi tentang opsi autentikasi di Kubernetes dan *security* *properties* -nya.
content_type: concept
weight: 90
---

<!-- overview -->

Memilih mekanisme autentikasi yang tepat adalah aspek penting dalam mengamankan kluster Anda.
Kubernetes menyediakan beberapa mekanisme bawaan, masing-masing dengan kelebihan dan kekurangannya
yang harus dipertimbangkan dengan hati-hati saat memilih mekanisme autentikasi terbaik untuk kluster Anda.

Secara umum, disarankan untuk mengaktifkan sesedikit mungkin mekanisme autentikasi untuk menyederhanakan
manajemen pengguna dan mencegah kasus di mana pengguna tetap memiliki akses ke kluster yang tidak lagi diperlukan.

Penting untuk dicatat bahwa Kubernetes tidak memiliki basis data pengguna bawaan di dalam kluster.
Sebaliknya, Kubernetes mengambil informasi pengguna dari sistem autentikasi yang dikonfigurasi dan menggunakan
informasi tersebut untuk membuat keputusan otorisasi. Oleh karena itu, untuk mengaudit akses pengguna, Anda perlu
meninjau kredensial dari setiap sumber autentikasi yang dikonfigurasi.

Untuk kluster produksi dengan banyak pengguna yang mengakses API Kubernetes secara langsung, disarankan untuk
menggunakan sumber autentikasi eksternal seperti OIDC. Mekanisme autentikasi internal, seperti sertifikat klien
dan token akun layanan yang dijelaskan di bawah ini, tidak cocok untuk kasus penggunaan ini.

<!-- body -->

## Autentikasi sertifikat klien X.509 {#x509-client-certificate-authentication}

Kubernetes memanfaatkan [sertifikat klien X.509](/docs/reference/access-authn-authz/authentication/#x509-client-certificates)
untuk komponen sistem, seperti saat kubelet mengautentikasi ke API Server. Meskipun mekanisme ini juga dapat digunakan
untuk autentikasi pengguna, mekanisme ini mungkin tidak cocok untuk penggunaan produksi karena beberapa batasan:

- Sertifikat klien tidak dapat dicabut secara individual. Setelah disusupi, sertifikat dapat digunakan oleh penyerang
  hingga kedaluwarsa. Untuk mengurangi risiko ini, disarankan untuk mengonfigurasi masa berlaku yang pendek untuk
  kredensial autentikasi pengguna yang dibuat menggunakan sertifikat klien.
- Jika sertifikat perlu dibatalkan, otoritas sertifikat harus diubah kuncinya, yang dapat memperkenalkan risiko
  ketersediaan ke kluster.
- Tidak ada catatan permanen tentang sertifikat klien yang dibuat di kluster. Oleh karena itu, semua sertifikat yang
  diterbitkan harus dicatat jika Anda perlu melacaknya.
- Kunci privat yang digunakan untuk autentikasi sertifikat klien tidak dapat dilindungi dengan kata sandi. Siapa pun
  yang dapat membaca file yang berisi kunci tersebut akan dapat menggunakannya.
- Menggunakan autentikasi sertifikat klien memerlukan koneksi langsung dari klien ke API server tanpa titik
  terminasi TLS yang mengintervensi, yang dapat mempersulit arsitektur jaringan.
- Data grup tertanam dalam nilai `O` dari sertifikat klien, yang berarti keanggotaan grup pengguna tidak dapat diubah
  selama masa berlaku sertifikat.

## File token statis {#static-token-file}

Meskipun Kubernetes memungkinkan Anda memuat kredensial dari
[berkas token statis](/docs/reference/access-authn-authz/authentication/#static-token-file) yang terletak
di disk node control plane, pendekatan ini tidak disarankan untuk server produksi karena beberapa alasan:

- Kredensial disimpan dalam teks biasa di disk node control plane, yang dapat menjadi risiko keamanan.
- Mengubah kredensial apa pun memerlukan restart proses API server agar berlaku, yang dapat memengaruhi ketersediaan.
- Tidak ada mekanisme yang tersedia untuk memungkinkan pengguna memutar kredensial mereka. Untuk memutar kredensial,
  administrator kluster harus memodifikasi token di disk dan mendistribusikannya ke pengguna.
- Tidak ada mekanisme penguncian yang tersedia untuk mencegah serangan brute-force.

## Token bootstrap {#bootstrap-tokens}

[Token bootstrap](/docs/reference/access-authn-authz/bootstrap-tokens/) digunakan untuk menghubungkan
node ke kluster dan tidak disarankan untuk autentikasi pengguna karena beberapa alasan:

- Mereka memiliki keanggotaan grup yang dikodekan keras yang tidak cocok untuk penggunaan umum, sehingga tidak cocok
  untuk tujuan autentikasi.
- Pembuatan token bootstrap secara manual dapat menghasilkan token yang lemah yang dapat ditebak oleh penyerang,
  yang dapat menjadi risiko keamanan.
- Tidak ada mekanisme penguncian yang tersedia untuk mencegah serangan brute-force, sehingga memudahkan penyerang
  untuk menebak atau memecahkan token.

## Token rahasia ServiceAccount {#serviceaccount-secret-tokens}

[Rahasia akun layanan](/docs/reference/access-authn-authz/service-accounts-admin/#manual-secret-management-for-serviceaccounts)
tersedia sebagai opsi untuk memungkinkan beban kerja yang berjalan di kluster mengautentikasi ke API server.
Di Kubernetes < 1.23, ini adalah opsi default, namun, mereka sedang digantikan dengan token API TokenRequest.
Meskipun rahasia ini dapat digunakan untuk autentikasi pengguna, mereka umumnya tidak cocok karena beberapa alasan:

- Mereka tidak dapat diatur dengan masa berlaku dan akan tetap berlaku hingga akun layanan terkait dihapus.
- Token autentikasi terlihat oleh pengguna kluster mana pun yang dapat membaca rahasia di namespace tempat mereka
  didefinisikan.
- Akun layanan tidak dapat ditambahkan ke grup arbitrer, yang mempersulit manajemen RBAC di mana mereka digunakan.

## Token API TokenRequest {#tokenrequest-api-tokens}

API TokenRequest adalah alat yang berguna untuk menghasilkan kredensial jangka pendek untuk autentikasi layanan
ke API server atau sistem pihak ketiga. Namun, ini umumnya tidak disarankan untuk autentikasi pengguna karena tidak
ada metode pencabutan yang tersedia, dan mendistribusikan kredensial ke pengguna dengan cara yang aman dapat menjadi
tantangan.

Saat menggunakan token TokenRequest untuk autentikasi layanan, disarankan untuk menerapkan masa berlaku yang pendek
untuk mengurangi dampak token yang disusupi.

## Autentikasi token OpenID Connect {#openid-connect-token-authentication}

Kubernetes mendukung integrasi layanan autentikasi eksternal dengan API Kubernetes menggunakan
[OpenID Connect (OIDC)](/docs/reference/access-authn-authz/authentication/#openid-connect-tokens).
Ada berbagai macam perangkat lunak yang dapat digunakan untuk mengintegrasikan Kubernetes dengan penyedia identitas.
Namun, saat menggunakan autentikasi OIDC di Kubernetes, penting untuk mempertimbangkan langkah-langkah penguatan berikut:

- Perangkat lunak yang diinstal di kluster untuk mendukung autentikasi OIDC harus diisolasi dari beban kerja umum
  karena akan berjalan dengan hak istimewa tinggi.
- Beberapa layanan Kubernetes yang dikelola memiliki batasan pada penyedia OIDC yang dapat digunakan.
- Seperti halnya token TokenRequest, token OIDC harus memiliki masa berlaku yang pendek untuk mengurangi dampak
  token yang disusupi.

## Autentikasi token Webhook {#webhook-token-authentication}

[Autentikasi token Webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)
adalah opsi lain untuk mengintegrasikan penyedia autentikasi eksternal ke Kubernetes. Mekanisme ini memungkinkan
layanan autentikasi, baik yang berjalan di dalam kluster atau di luar, untuk dihubungi untuk keputusan autentikasi
melalui webhook. Penting untuk dicatat bahwa kesesuaian mekanisme ini kemungkinan besar bergantung pada perangkat
lunak yang digunakan untuk layanan autentikasi, dan ada beberapa pertimbangan khusus Kubernetes yang harus diperhatikan.

Untuk mengonfigurasi autentikasi Webhook, akses ke sistem file server control plane diperlukan. Ini berarti bahwa
hal ini tidak akan memungkinkan dengan Kubernetes yang dikelola kecuali penyedia secara khusus membuatnya tersedia.
Selain itu, perangkat lunak apa pun yang diinstal di kluster untuk mendukung akses ini harus diisolasi dari beban
kerja umum, karena akan berjalan dengan hak istimewa tinggi.

## Proxy autentikasi {#authenticating-proxy}

Opsi lain untuk mengintegrasikan sistem autentikasi eksternal ke Kubernetes adalah dengan menggunakan
[proxy autentikasi](/docs/reference/access-authn-authz/authentication/#authenticating-proxy).
Dengan mekanisme ini, Kubernetes mengharapkan menerima permintaan dari proxy dengan nilai header tertentu yang
ditetapkan, menunjukkan nama pengguna dan keanggotaan grup untuk tujuan otorisasi. Penting untuk dicatat bahwa ada
pertimbangan khusus yang harus diperhatikan saat menggunakan mekanisme ini.

Pertama, TLS yang dikonfigurasi dengan aman harus digunakan antara proxy dan API server Kubernetes untuk mengurangi
risiko serangan penyadapan atau pengintaian lalu lintas. Ini memastikan bahwa komunikasi antara proxy dan API server
Kubernetes aman.

Kedua, penting untuk menyadari bahwa penyerang yang dapat memodifikasi header permintaan mungkin dapat memperoleh
akses tidak sah ke sumber daya Kubernetes. Oleh karena itu, penting untuk memastikan bahwa header diamankan dengan
baik dan tidak dapat dirusak.

## {{% heading "whatsnext" %}}

- [Autentikasi Pengguna](/docs/reference/access-authn-authz/authentication/)
- [Autentikasi dengan Token Bootstrap](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Autentikasi Kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/#kubelet-authentication)
- [Autentikasi dengan Token Akun Layanan](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-accounfor kens)
