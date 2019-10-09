---
title: Penglolaan Objek Kubernetes Secara Imperatif dengan Menggunakan File Konfigurasi
content_template: templates/concept
weight: 30
---

{{% capture overview %}}
Objek-objek Kubernetes bisa dibuat, diperbarui, dan dihapus dengan menggunakan perangkat *command-line* `kubectl` dan file konfigurasi objek yang ditulis dalam format YAML atau JSON. Dokumen ini menjelaskan cara mendefinisikan dan mengelola objek dengan menggunakan file konfigurasi.
{{% /capture %}}

{{% capture body %}}

## Kelebihan dan kekurangan

Perintah `kubectl` mendukung tiga cara pengelolaan objek:

* Perintah imperatif
* Konfigurasi objek imperatif
* Konfigurasi objek deklaratif

Lihat [Pengelolaan Objek Kubernetes](/id/docs/concepts/overview/object-management-kubectl/overview/) untuk mengenali lebih lanjut kelebihan dan kekurangan dari tiap cara pengelolaan objek.

## Cara membuat objek

Kamu bisa menggunakan perintah `kubectl create -f` untuk membuat sebuah objek dari sebuah file konfigurasi. Rujuk dokumen [referensi API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) untuk detil lebih lanjut.

- `kubectl create -f <nama-file|url>`

## Cara memperbarui objek

{{< warning >}}
Memperbarui objek dengan perintah `replace` akan menghilangkan semua bagian dari spesifikasi objek yang tidak dispesifikasikan pada file konfigurasi. Oleh karena itu, perintah ini sebaiknya tidak digunakan terhadap objek-objek yang spesifikasinya sebagian dikelola oleh kluster, misalnya Service dengan tipe `LoadBalancer`, di mana *field* `externalIPs` dikelola secara terpisah dari file konfigurasi. *Field-field* yang dikelola secara terpisah harus disalin ke file konfigurasi untuk mencegah terhapus oleh perintah `replace`.
{{< /warning >}}

Kamu bisa menggunakan perintah `kubectl replace -f` untuk memperbarui sebuah objek *live* sesuai dengan sebuah file konfigurasi.

- `kubectl replace -f <nama-file|url>`

## Cara menghapus objek

Kamu bisa menggunakan perintah `kubectl delete -f` untuk menghapus sebuah objek yang dideskripsikan pada sebuah file konfigurasi.

- `kubectl delete -f <nama-file|url>`

## Cara melihat objek

Kamu bisa menggunakan perintah `kubectl get -f` untuk melihat informasi tentang sebuah objek yang dideskripsikan pada sebuah file konfigurasi.

- `kubectl get -f <nama-file|url> -o yaml`

Parameter `-o yaml` menetapkan bahwa keseluruhan konfigurasi objek ditulis ke file yaml. Gunakan perintah `kubectl get -h` untuk melihat daftar pilihan selengkapnya.

## Keterbatasan

Perintah-perintah `create`, `replace`, dan `delete` bekerja dengan baik saat tiap konfigurasi dari sebuah objek didefinisikan dan dicatat dengan lengkap pada file konfigurasi objek tersebut. Akan tetapi, ketika sebuah objek *live* diperbarui dan pembaruannya tidak dicatat di file konfigurasinya, pembaruan tersebut akan hilang ketika perintah `replace` dieksekusi di waktu berikutnya. Ini bisa terjadi saat sebuah *controller*, misalnya sebuah `HorizontalPodAutoscaler`, membuat pembaruan secara langsung ke sebuah objek *live*. Berikut sebuah contoh:

1. Kamu membuat sebuah objek dari sebuah file konfigurasi.
1. Sebuah sumber lain memperbarui objek tersebut dengan mengubah beberapa *field*.
1. Kamu memperbarui objek tersebut dengan `kubectl replace` dari file konfigurasi. Perubahan yang dibuat dari sumber lain pada langkah nomor 2 di atas akan hilang.

Jika kamu perlu mendukung beberapa *writer* untuk objek yang sama, kamu bisa menggunakan `kubectl apply` untuk mengelola objek tersebut.

## Membuat dan mengedit objek dari URL tanpa menyimpan konfigurasinya

Misalkan kamu memiliki URL dari sebuah file konfigurasi objek. Kamu bisa menggunakan `kubectl create --edit` untuk membuat perubahan pada konfigurasi sebelum objek tersebut dibuat. Langkah ini terutama berguna untuk mengikuti tutorial atau untuk pekerjaan-pekerjaan yang menggunakan sebuah file konfigurasi di URL terentu yang perlu dimodifikasi.

```sh
kubectl create -f <url> --edit
```

## Migrasi dari perintah imperatif ke konfigurasi objek imperatif

Migrsasi dari perintah imperatif ke konfigurasi objek imperatif melibatkan beberapa langkah manual.

1. Ekspor objek *live* ke sebuah file konfigurasi objek lokal:
```sh
kubectl get <kind>/<name> -o yaml --export > <kind>_<name>.yaml
```

1. Hapus secara manual *field* status dari file konfigurasi objek.

1. Untuk pengelolaan objek selanjutnya, gunakan perintah `replace` secara eksklusif.
```sh
kubectl replace -f <kind>_<name>.yaml
```

## Mendefinisikan *controller selectors* dan label PodTemplate

{{< warning >}}
Memperbarui *selectors* pada *controllers* sangat tidak disarankan.
{{< /warning >}}

Pendekatan yang direkomendasikan adalah mendefinisikan sebuah label PodTemplate tunggal dan *immutable* yang hanya digunakan oleh *controller selector* tersebut, tanpa makna semantik lainnya.

Contoh label:

```yaml
selector:
  matchLabels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
```

{{% /capture %}}

{{% capture whatsnext %}}
- [Pengelolaan Objek Kubernetes Menggunakan Perintah Imperatif](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [Pengelolaan Objek Kubernetes secara Deklaratif dengan Menggunakan File Konfigurasi](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Rujukan Perintah Kubectl](/docs/reference/generated/kubectl/kubectl/)
- [Rujukan API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
{{% /capture %}}


