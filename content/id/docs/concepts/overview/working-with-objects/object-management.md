---
title: Pengaturan Objek Kubernetes
content_type: concept
weight: 15
---

<!-- overview -->
Perangkat `kubectl` mendukung beberapa cara untuk membuat dan mengatur objek-objek Kubernetes.
Laman ini menggambarkan berbagai macam metodenya. Baca [Kubectl gitbook](https://kubectl.docs.kubernetes.io)
untuk penjelasan pengaturan objek dengan Kubectl secara detail.


<!-- body -->

## Metode pengaturan

{{< warning >}}
Sebuah objek Kubernetes hanya boleh diatur dengan menggunakan satu metode saja. Mengkombinasikan
beberapa metode untuk objek yang sama dapat menghasilkan perilaku yang tidak diinginkan.
{{< /warning >}}

| Metode pengaturan                | Dijalankan pada      | _Environment_ yang disarankan  | Jumlah penulis yang didukung  | Tingkat kesulitan mempelajari |
|----------------------------------|----------------------|--------------------------------|-------------------------------|-------------------------------|
| Perintah imperatif               | Objek _live_         | Proyek pengembangan (_dev_)    | 1+                            | Terendah                      |
| Konfigurasi objek imperatif      | Berkas individu      | Proyek produksi (_prod_)       | 1                             | Sedang                        |
| Konfigurasi objek deklaratif     | Direktori berkas     | Proyek produksi (_prod_)       | 1+                            | Tertinggi                     |

## Perintah imperatif

Ketika menggunakan perintah-perintah imperatif, seorang pengguna menjalankan operasi secara langsung
pada objek-objek _live_ dalam sebuah klaster. Pengguna menjalankan operasi tersebut melalui
argumen atau _flag_ pada perintah `kubectl`.

Ini merupakan cara yang paling mudah untuk memulai atau menjalankan tugas "sekali jalan" pada sebuah klaster.
Karena metode ini dijalankan secara langsung pada objek _live_, tidak ada _history_ yang menjelaskan konfigurasi-konfigurasi terkait sebelumnya.

### Contoh

Menjalankan sebuah instans Container nginx dengan membuat suatu objek Deployment:

```sh
kubectl run nginx --image nginx
```

Melakukan hal yang sama menggunakan sintaks yang berbeda:

```sh
kubectl create deployment nginx --image nginx
```

### Kelebihan dan kekurangan

Beberapa kelebihan metode ini dibandingkan metode konfigurasi objek:

- Sederhana, mudah dipelajari dan diingat.
- Hanya memerlukan satu langkah untuk membuat perubahan pada klaster.

Beberapa kekurangan metode ini dibandingkan metode konfigurasi objek:

- Tidak terintegrasi dengan proses peninjauan (_review_) perubahan.
- Tidak menyediakan jejak audit yang terkait dengan perubahan.
- Tidak menyediakan sumber _record_ kecuali dari apa yang _live_ terlihat.
- Tidak menyediakan templat untuk membuat objek-objek baru.

## Konfigurasi objek imperatif

Pada konfigurasi objek imperatif, perintah kubectl menetapkan jenis operasi
(_create_, _replace_, etc.), _flag-flag_ pilihan dan minimal satu nama berkas.
Berkas ini harus berisi definisi lengkap dari objek tersebut
dalam bentuk YAML atau JSON.

Lihat [referensi API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
untuk info lebih detail mengenai definisi objek.

{{< warning >}}
Perintah imperatif `replace` menggantikan spek yang sudah ada dengan spek yang baru,
membuang semua perubahan terhadap objek tersebut yang tidak didefinisikan pada berkas konfigurasi.
Metode ini sebaiknya tidak dilakukan pada tipe sumber daya yang spek-nya diperbarui
secara independen di luar berkas konfigurasi. Service dengan tipe `LoadBalancer`, sebagai contoh,
memiliki _field_ `externalIPs` yang diperbarui secara independen di luar konfigurasi, dilakukan
oleh klaster.
{{< /warning >}}

### Contoh

Membuat objek yang didefinisikan pada sebuah berkas konfigurasi:

```sh
kubectl create -f nginx.yaml
```

Menghapus objek-objek yang didefinisikan pada dua berkas konfigurasi:

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

Memperbarui objek yang didefinisikan pada sebuah berkas konfigurasi dengan
menimpa konfigurasi _live_:

```sh
kubectl replace -f nginx.yaml
```

### Kelebihan dan kekurangan

Beberapa kelebihan dibandingkan metode perintah imperatif:

- Konfigurasi objek dapat disimpan pada suatu sistem kontrol kode seperti Git.
- Konfigurasi objek dapat diintegrasikan dengan proses-proses, misalnya peninjauan (_review_) perubahan sebelum _push_ dan jejak audit.
- Konfigurasi objek dapat menyediakan templat untuk membuat objek-objek baru.

Beberapa kekurangan dibandingkan metode perintah imperatif:

- Konfigurasi objek memerlukan pemahaman yang mendasar soal skema objek.
- Konfigurasi objek memerlukan langkah tambahan untuk menulis berkas YAML.

Beberapa kelebihan dibandingkan metode konfigurasi objek deklaratif:

- Konfigurasi objek imperatif memiliki perilaku yang lebih sederhana dan mudah dimengerti.
- Sejak Kubernetes versi 1.5, konfigurasi objek imperatif sudah lebih stabil.

Beberapa kekurangan dibandingkan metode konfigurasi objek deklaratif:

- Konfigurasi objek imperatif bekerja dengan baik untuk berkas-berkas, namun tidak untuk direktori.
- Pembaruan untuk objek-objek _live_ harus diterapkan pada berkas-berkas konfigurasi, jika tidak, hasil perubahan akan hilang pada penggantian berikutnya.

## Konfigurasi objek deklaratif

Ketika menggunakan konfigurasi objek deklaratif, seorang pengguna beroperasi pada berkas-berkas
konfigurasi objek yang disimpan secara lokal, namun pengguna tidak mendefinisikan operasi
yang akan dilakukan pada berkas-berkas tersebut. Operasi _create_, _update_, dan _delete_
akan dideteksi secara otomatis per-objek dengan `kubectl`. Hal ini memungkinkan penerapan
melalui direktori, dimana operasi yang berbeda mungkin diperlukan untuk objek-objek yang berbeda.

{{< note >}}
Konfigurasi objek deklaratif mempertahankan perubahan yang dibuat oleh penulis lainnya, bahkan
jika perubahan tidak digabungkan (_merge_) kembali pada berkas konfigurasi objek. Hal ini
bisa terjadi dengan menggunakan operasi API `patch` supaya hanya perbedaannya saja yang ditulis,
daripada menggunakan operasi API `replace` untuk menggantikan seluruh konfigurasi objek.
{{< /note >}}

### Contoh

Melakukan pemrosesan pada semua berkas konfigurasi objek di direktori `configs`, dan melakukan
_create_ atau _patch_ untuk objek-objek _live_. Kamu dapat terlebih dahulu melakukan `diff` untuk
melihat perubahan-perubahan apa saja yang akan dilakukan, dan kemudian terapkan:

```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

Melakukan pemrosesan direktori secara rekursif:

```sh
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```

### Kelebihan dan kekurangan

Beberapa kelebihan dibandingkan konfigurasi objek imperatif:

- Perubahan-perubahan yang dilakukan secara langsung pada objek-objek _live_ akan dipertahankan, bahkan jika perubahan tersebut tidak digabungkan kembali pada berkas-berkas konfigurasi.
- Konfigurasi objek deklaratif memiliki dukungan yang lebih baik dalam mengoperasikan direktori dan secara otomatis mendeteksi tipe operasi (_create_, _patch_, _delete_) per-objek.

Beberapa kekurangan dibandingkan konfigurasi objek imperatif:

- Konfigurasi objek deklaratif lebih sulit untuk di-_debug_ dan hasilnya lebih sulit dimengerti untuk perilaku yang tidak diinginkan.
- Pembaruan sebagian menggunakan _diff_ menghasilkan operasi _merge_ dan _patch_ yang rumit.



## {{% heading "whatsnext" %}}


- [Mengatur Objek Kubernetes menggunakan Perintah Imperatif](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Mengatur Objek Kubernetes menggunakan Konfigurasi Objek (Imperatif)](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Mengatur Objek Kubernetes menggunakan Konfigurasi Objek (Deklaratif)](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [Mengatur Objek Kubernetes menggunakan Kustomize (Deklaratif)](/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Referensi Perintah Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
- [Kubectl Gitbook](https://kubectl.docs.kubernetes.io)
- [Referensi API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)


