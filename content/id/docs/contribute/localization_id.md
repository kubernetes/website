---
title: Dokumentasi Khusus Untuk Translasi Bahasa Indonesia
content_type: concept
---

<!-- overview -->

Panduan khusus untuk bergabung ke komunitas SIG DOC Indonesia dan melakukan 
kontribusi untuk mentranslasikan dokumentasi Kubernetes ke dalam Bahasa 
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

* Check halaman _issue_ di GitHub dan pastikan tidak ada orang lain yang sudah 
mengklaim halaman kamu dalam daftar periksa atau komentar-komentar sebelumnya.
* Klaim halaman kamu pada _issue_ di GitHub dengan memberikan komentar di bawah 
dengan nama halaman yang ingin kamu terjemahkan dan ambillah hanya satu halaman 
dalam satu waktu.
* _Fork_ [repo ini](https://github.com/kubernetes/website), buat terjemahan 
kamu, dan kirimkan PR (_pull request_) dengan label `language/id`
* Setelah dikirim, pengulas akan memberikan komentar dalam beberapa hari, dan 
tolong untuk menjawab semua komentar. Direkomendasikan juga untuk melakukan 
[_squash_](https://github.com/wprig/wprig/wiki/How-to-squash-commits) _commit_ 
kamu dengan pesan _commit_ yang baik.


## Informasi Acuan Untuk Translasi

Tidak ada panduan gaya khusus untuk menulis translasi ke bahasa Indonesia. 
Namun, secara umum kita dapat mengikuti panduan gaya bahasa Inggris dengan 
beberapa tambahan untuk kata-kata impor yang dicetak miring.

Harap berkomitmen dengan terjemahan kamu dan pada saat kamu mendapatkan komentar
dari pengulas, silahkan atasi sebaik-baiknya. Kami berharap halaman yang 
diklaim akan diterjemahkan dalam waktu kurang lebih dua minggu. Jika ternyata 
kamu tidak dapat berkomitmen lagi, beri tahu para pengulas agar mereka dapat 
meberikan halaman tersebut ke orang lain.

Beberapa acuan tambahan dalam melakukan translasi silahkan lihat informasi 
berikut ini:

### Daftara Glosarium Translasi dari tim SIG DOC Indonesia
Untuk kata-kata selengkapnya silahkan baca glosariumnya 
[disini](#glosarium-indonesia)

### KBBI
Konsultasikan dengan KBBI (Kamus Besar Bahasa Indonesia) 
[disini](https://kbbi.web.id/) dari 
[Kemendikbud](https://kbbi.kemdikbud.go.id/).

### RSNI Glosarium dari Ivan Lanin
[RSNI Glosarium](https://github.com/jk8s/sig-docs-id-localization-how-tos/blob/master/resources/RSNI-glossarium.pdf)
dapat digunakan untuk memahami bagaimana menerjemahkan berbagai istilah teknis 
dan khusus Kubernetes.


## Panduan Penulisan _Source Code_

### Mengikuti kode asli dari dokumentasi bahasa Inggris

Untuk kenyamanan pemeliharaan, ikuti lebar teks asli dalam kode bahasa Inggris.
Dengan kata lain, jika teks asli ditulis dalam baris yang panjang tanpa putus 
atu baris, maka teks tersebut ditulis panjang dalam satu baris meskipun dalam 
bahasa Indonesia. Jagalah agar tetap serupa.

### Hapus nama reviewer di kode asli bahasa Inggris

Terkadang _reviewer_ ditentukan di bagian atas kode di teks asli Bahasa Inggris. 
Secara umum, _reviewer-reviewer_ halaman aslinya akan kesulitan untuk meninjau 
halaman  dalam bahasa Indonesia, jadi hapus kode yang terkait dengan informasi 
_reviewer_ dari metadata kode tersebut.


## Panduan Penulisan Kata-kata Translasi

### Panduan umum

* Gunakan "kamu" daripada "Anda" sebagai subyek agar lebih bersahabat dengan 
para pembaca dokumentasi.
* Tulislah miring untuk kata-kata bahasa Inggris yang diimpor jika kamu tidak 
dapat menemukan kata-kata tersebut dalam bahasa Indonesia.
*Benar*: _controller_. *Salah*: controller, `controller`

### Panduan untuk kata-kata API Objek Kubernetes

Gunakan gaya "CamelCase" untuk menulis objek API Kubernetes, lihat daftar 
lengkapnya [di sini](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/).
Sebagai contoh:

* *Benar*: PersistentVolume. *Salah*: volume persisten, `PersistentVolume`, 
persistentVolume
* *Benar*: Pod. *Salah*: pod, `pod`, "pod"

*Tips* : Biasanya API objek sudah ditulis dalam huruf kapital pada halaman asli
bahasa Inggris.

### Panduan untuk kata-kata yang sama dengan API Objek Kubernetes

Ada beberapa kata-kata yang serupa dengan nama API objek dari Kubernetes dan 
dapat mengacu ke arti yang lebih umum (tidak selalu dalam konteks Kubernetes).
Sebagai contoh: _service_, _container_, _node_ , dan lain sebagainya. Kata-kata
sebaiknya ditranslasikan ke Bahasa Indonesia sebagai contoh _service_ menjadi 
layanan, _container_ menjadi kontainer.

*Tips* : Biasanya kata-kata yang mengacu ke arti yang lebih umum sudah *tidak* 
ditulis dalam huruf kapital pada halaman asli bahasa Inggris.

### Panduan untuk "Feature Gate" Kubernetes

Istilah [_functional gate_](https://kubernetes.io/ko/docs/reference/command-line-tools-reference/feature-gates/) 
Kubernetes tidak perlu diterjemahkan ke dalam bahasa Indonesia dan tetap 
dipertahankan dalam bentuk aslinya.

Contoh dari _functional gate_ adalah sebagai berikut:

- Akselerator
- AdvancedAuditing
- AffinityInAnnotations
- AllowExtTrafficLocalEndpoints
- ...

### Glosarium Indonesia {#glosarium-indonesia}

Inggris | Tipe Kata | Indonesia | Sumber | Contoh Kalimat
---|---|---|---|---
cluster |  | klaster |  |  
container |  | kontainer |  |
node | kata benda | node |  |
file |  | berkas |  |
service | kata benda | layanan |  |
set |  | sekumpulan |  |
resource |  | sumber daya |  |
default |  | bawaan atau standar (tergantung context) |  | Secara bawaan, ...; Pada konfigurasi dan instalasi standar, ...
deploy |  | menggelar |  |
image |  | _image_ |  |
request |  | permintaan |  |
object | kata benda | objek | https://kbbi.web.id/objek | 
command |  | perintah | https://kbbi.web.id/perintah | 
view |  | tampilan |  |
support |  | tersedia atau dukungan (tergantung konteks) | "This feature is supported on version X; Fitur ini tersedia pada versi X; Supported by community; Didukung oleh komunitas"
release | kata benda | rilis | https://kbbi.web.id/rilis | 
tool |  | perangkat |  |
deployment |  | penggelaran |  |
client |  | klien |  |
reference |  | rujukan |  |
update |  | pembaruan |  | The latest update... ; Pembaruan terkini...
state |  | _state_ |  |
task |  | _task_ |  |
certificate |  | sertifikat |  |
install |  | instalasi | https://kbbi.web.id/instalasi | 
scale |  | skala |  |
process | kata kerja | memproses | https://kbbi.web.id/proses | 
replica | kata benda | replika | https://kbbi.web.id/replika | 
flag |  | tanda, parameter, argumen |  |
event |  | _event_ |  | 