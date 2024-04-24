---
title: Mengatur Akses Klaster Menggunakan Berkas kubeconfig
content_type: concept
weight: 60
---

<!-- overview -->

Gunakan berkas kubeconfig untuk mengatur informasi mengenai klaster, pengguna, 
_namespace_, dan mekanisme autentikasi. Perintah `kubectl` menggunakan berkas
kubeconfig untuk mencari informasi yang dibutuhkan untuk memilih klaster dan
berkomunikasi dengan API server dari suatu klaster.

{{< note >}}
Sebuah berkas yang digunakan untuk mengatur akses pada klaster disebut dengan
berkas kubeconfig. Ini cara yang umum digunakan untuk mereferensikan berkas
konfigurasi. Ini tidak berarti ada berkas dengan nama `kubeconfig`.
{{< /note >}}

Secara _default_, `kubectl` mencari berkas dengan nama `config` pada direktori
`$HOME/.kube`. Kamu bisa mengatur lokasi berkas kubeconfig dengan mengatur
nilai `KUBECONFIG` pada variabel _environment_ atau dengan mengatur menggunakan
tanda [`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/).

Instruksi langkah demi langkah untuk membuat dan menentukan berkas kubeconfig,
bisa mengacu pada [Mengatur Akses Pada Beberapa Klaster]
(/id/docs/tasks/access-application-cluster/configure-access-multiple-clusters).




<!-- body -->

## Mendukung beberapa klaster, pengguna, dan mekanisme autentikasi

Misalkan kamu memiliki beberapa klaster, pengguna serta komponen dapat melakukan
autentikasi dengan berbagai cara. Sebagai contoh:

- Kubelet yang berjalan dapat melakukan autentikasi dengan menggunakan sertifikat
- Pengguna bisa melakukan autentikasi dengan menggunakan token
- Administrator bisa memiliki beberapa sertifikat yang diberikan kepada pengguna 
individu.

Dengan berkas kubeconfig, kamu bisa mengatur klaster, pengguna, dan _namespace_.
Kamu juga bisa menentukan konteks untuk mempercepat dan mempermudah perpindahan
antara klaster dan _namespace_.

## Konteks

Sebuah elemen konteks pada berkas kubeconfig digunakan untuk mengelompokkan
parameter akses dengan nama yang mudah. Setiap konteks akan memiliki 3 parameter:
klaster, pengguna, dan _namespace_. Secara _default_, perintah `kubectl` menggunakan
parameter dari konteks yang aktif untuk berkomunikasi dengan klaster.

Untuk memilih konteks yang aktif, bisa menggunakan perintah berikut:
```
kubectl config use-context
```

## Variabel _environment_ KUBECONFIG

Variabel _environment_ `KUBECONFIG` berisikan beberapa berkas kubeconfig. Untuk 
Linux dan Mac, beberapa berkas tersebut dipisahkan dengan tanda titik dua (:).
Untuk Windows, dipisahkan dengan menggunakan tanda titik koma (;). Variabel 
_environment_ `KUBECONFIG` tidak diwajibkan untuk ada. Jika variabel _environment_
`KUBECONFIG` tidak ada, maka `kubectl` akan menggunakan berkas kubeconfig pada
`$HOME/.kube/config`.

Jika variabel _environment_ `KUBECONFIG` ternyata ada, maka `kubectl` akan menggunakan
konfigurasi yang merupakan hasil gabungan dari berkas-berkas yang terdapat pada
variabel _environment_ `KUBECONFIG`.

## Menggabungkan berkas-berkas kubeconfig

Untuk melihat konfigurasimu, gunakan perintah berikut ini:

```shell
kubectl config view
```

Seperti yang dijelaskan sebelumnya, hasil perintah diatas bisa berasal dari sebuah 
berkas kubeconfig, atau bisa juga merupakan hasil gabungan dari beberapa berkas kubeconfig.

Berikut adalah aturan yang digunakan `kubectl` ketika menggabungkan beberapa berkas
kubeconfig:

1. Jika menggunakan tanda `--kubeconfig`, maka akan menggunakan berkas yang ditentukan.
   Tidak digabungkan. Hanya 1 tanda `--kubeconfig` yang diperbolehkan.

   Sebaliknya, jika variabel _environment_ `KUBECONFIG` digunakan, maka akan menggunakan 
   ini sebagai berkas-berkas yang akan digabungkan. Penggabungan berkas-berkas yang terdapat
   pada variabel _environment_ `KUBECONFIG` akan mengikuti aturan sebagai berikut:

   * Mengabaikan berkas tanpa nama.
   * Mengeluarkan pesan kesalahan untuk berkas dengan isi yang tidak dapat dideserialisasi.
   * Berkas pertama yang menentukan nilai atau _key_ pada _map_ maka akan digunakan 
     pada _map_ tersebut.
   * Tidak pernah mengubah nilai atau _key_ dari suatu _map_.
     Contoh: Pertahankan konteks pada berkas pertama yang mengatur `current-context`.
     Contoh: Jika terdapat dua berkas yang menentukan nilai `red-user`, maka hanya gunakan
     nilai `red-user` dari berkas pertama.
     Meskipun berkas kedua tidak memiliki entri yang bertentangan pada `red-user`, 
     abaikan mereka.

   Beberapa contoh pengaturan variabel _environment_ `KUBECONFIG`, bisa melihat pada
   [pengaturan vaiabel _environment_ KUBECONFIG](/id/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable).

   Sebaliknya, bisa menggunakan berkas kubeconfig _default_, `$HOME/.kube/config`, 
   tanpa melakukan penggabungan.

1. Konteks ditentukan oleh yang pertama sesuai dari pilihan berikut:

    1. Menggunakan tanda `--context` pada perintah
    1. Menggunakan nilai `current-context` dari hasil gabungan berkas kubeconfig.

   Konteks yang kosong masih diperbolehkan pada tahap ini.

1. Menentukan klaster dan pengguna. Pada tahap ini, mungkin akan ada atau tidak ada konteks.
   Menentukan klaster dan pengguna berdasarkan yang pertama sesuai dengan pilihan berikut,
   yang mana akan dijalankan dua kali: sekali untuk pengguna dan sekali untuk klaster:

   1. Jika ada, maka gunakan tanda pada perintah: `--user` atau `--cluster`.
   1. Jika konteks tidak kosong, maka pengguna dan klaster didapat dari konteks.

   Pengguna dan klaster masih diperbolehkan kosong pada tahap ini.

1. Menentukan informasi klaster sebenarnya yang akan digunakan. Pada tahap ini, mungkin
   akan ada atau tidak ada informasi klaster. Membentuk informasi klaster berdasarkan urutan
   berikut dan yang pertama sesuai akan digunakan:

   1. Jika ada, maka gunakan tanda pada perintah: `--server`, `--certificate-authority`, `--insecure-skip-tls-verify`.
   1. Jika terdapat atribut informasi klaster dari hasil gabungan berkas kubeconfig, 
      maka gunakan itu.
   1. Jika tidak terdapat informasi mengenai lokasi server, maka dianggap gagal.

1. Menentukan informasi pengguna sebenarnya yang akan digunakan. Membentuk informasi 
   pengguna dengan aturan yang sama dengan pembentukan informasi klaster, namun hanya 
   diperbolehkan ada satu teknik autentikasi untuk setiap pengguna:

   1. Jika ada, gunakan tanda pada perintah: `--client-certificate`, `--client-key`, `--username`, `--password`, `--token`.
   1. Menggunakan _field_ `user` dari hasil gabungan berkas kubeconfig.
   1. Jika terdapat dua teknik yang bertentangan, maka dianggap gagal.

1. Untuk setiap informasi yang masih belum terisi, akan menggunakan nilai `default` dan
   kemungkinan akan meminta informasi autentikasi.

## Referensi berkas

Referensi _file_ dan _path_ pada berkas kubeconfig adalah bernilai relatif terhadap
lokasi dari berkas kubeconfig.
Referensi _file_ pada perintah adalah relatif terhadap direktori kerja saat ini.
Dalam `$HOME/.kube/config`, _relative path_ akan disimpan secara relatif, dan
_absolute path_ akan disimpan secara mutlak.




## {{% heading "whatsnext" %}}


* [Mengatur Akses Pada Beberapa Klaster](/id/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)




