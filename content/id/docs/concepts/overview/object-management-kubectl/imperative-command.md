---
title: Pengelolaan Objek Kubernetes dengan Perintah Imperatif
content_template: templates/concept
weight: 20
---

{{% capture overview %}}
Objek-objek Kubernetes bisa dibuat, diperbarui, dan dihapus secara langsung dengan menggunakan perintah-perintah imperatif yang ada pada *command-line* `kubectl`. Dokumen ini menjelaskan cara perintah-perintah tersebut diorganisir dan cara menggunakan perintah-perintah tersebut untuk mengelola objek *live*.
{{% /capture %}}

{{% capture body %}}

## Kelebihan dan kekurangan

Perintah `kubectl` mendukung tiga cara pengelolaan objek:

* Perintah imperatif
* Konfigurasi objek imperatif
* Konfigurasi objek deklaratif

Lihat [Pengelolaan Objek Kubernetes](/id/docs/concepts/overview/object-management-kubectl/overview/) untuk mengenali lebih lanjut kelebihan dan kekurangan dari tiap pengelolaan objek.

## Cara membuat objek

Perangkat `kubectl` mendukung perintah-perintah berbentuk kata kerja untuk membuat beberapa tipe objek yang paling umum. Perintah-perintah tersebut diberi nama yang mudah dikenali oleh pengguna yang belum familiar dengan tipe-tipe objek Kubernetes.

- `run`: Membuat sebuah objek Deployment untuk menjalankan kontainer di satu atau lebih Pod.
- `expose`: Membuat sebuah objek Service untuk mengatur lalu lintas beban antar Pod.
- `autoscale`: Membuat sebuah objek Autoscaler untuk melakukan *scaling* horizontal secara otomatis terhadap sebuah objek *controller*, misalnya sebuah objek Deployment.

Perangkat `kubectl` juga mendukung perintah-perintah pembuatan objek yang berdasarkan pada tipe objek. Perintah-perintah ini mendukung lebih banyak tipe objek dan lebih eksplisit tentang intensi mereka. Tapi, perintah-perintah ini memerlukan pengguna untuk memahami tipe dari objek-objek yang hendak mereka buat.

- `create <objecttype> [<subtype>] <instancename>`

Beberapa tipe objek memiliki sub tipe yang bisa kamu spesifikasikan pada perintah `create`. Misalnya, objek Service memiliki beberapa sub tipe seperti ClusterIP, LoadBalancer, dan NodePort. Berikut adalah sebuah contoh cara membuat sebuah Service dengan sub tipe NodePort:

```shell
kubectl create service nodeport <myservicename>
```

Pada contoh di atas, perintah `create service nodeport` merupakan sub perintah dari `create service`.

Kamu bisa menggunakan parameter `-h` untuk mencari argumen-argumen dan paramenter-parameter yang didukung oleh sebuah sub perintah:

```shell
kubectl create service nodeport -h
```

## Cara memperbarui objek

Perintah `kubectl` mendukung perintah-perintah berbasis kata kerja untuk beberapa operasi pembaruan yang umum. Perintah-perintah ini diberi nama yang memudahkan pengguna yang belum familiar dengan objek-objek Kubernetes untuk melakukan pembaruan tanpa terlebih dulu mengetahui *field-field* spesifik yang harus diperbarui:

- `scale`: Melakukan *scaling* horizontal terhadap sebuah *controller* untuk menambah atau menghapus Pod dengan memperbarui jumlah replika dari *controller* tersebut.
- `annotate`: Menambah atau menghapus anotasi sebuah objek.
- `label`: Menambah atau menghapus label sebuah objek.

Perintah `kubectl` juga mendukung perintah-perintah pembaruan berdasarkan salah satu aspek dari sebuah objek. Untuk tiap tipe objek yang berbeda, memperbarui sebuah aspek tertentu bisa berarti memperbarui sekumpulan *field* yang berbeda pula:

- `set` `<field>`: Memperbarui salah satu aspek dari sebuah objek.

{{< note >}}
Pada Kubernetes versi 1.5, tidak semua perintah yang berdasarkan kata kerja berasosiasi dengan perintah yang berdasarkan aspek tertentu.
{{< /note >}}

Perangkat `kubectl` juga mendukung beberapa cara lain untuk memperbarui objek *live* secara langsung, meskipun cara-cara berikut membutuhkan pemahaman yang lebih tentang skema objek Kubernetes.

- `edit`: Secara langsung mengedit konfigurasi mentah dari sebuah objek *live* dengan membuka konfigurasinya di sebuah editor.
- `patch`: Secara langsung memodifikasi *field-field* spesifik dari sebuah objek *live* dengan menggunakan *patch string*. Untuk detil lebih lanjut mengenai `patch string`, lihat bagian tentang *patch* pada [Konvensi API](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#patch-operations).

## Cara menghapus objek

Kamu bisa menggunakan perintah `delete` pada sebuah objek dari sebuah kluster:

- `delete <type>/<name>`

{{< note >}}
Kamu bisa menggunakan `kubectl delete` baik untuk perintah imperatif maupun konfigurasi objek imperatif. Perbedaannya hanya pada argumen yang diberikan ke perintah tersebut. Untuk menggunakan `kubectl delete` sebagai perintah imperatif, argumen yang diberikan adalah objek yang hendak dihapus. Berikut adalah sebuah contoh perintah `kubectl delete` dengan sebuah objek Deployment bernama nginx sebagai argumen:
{{< /note >}}

```shell
kubectl delete deployment/nginx
```

## Cara melihat objek

{{< comment >}}
TODO(pwittrock): Uncomment this when implemented.

Kamu bisa menggunakan `kubectl view` untuk menampilkan *field-field* tertentu dari sebuah objek.

- `view`: Menampilkan nilai dari *field* tertentu pada sebuah objek.

{{< /comment >}}

Ada beberapa perintah untuk menampilkan informasi tentang sebuah objek:

- `get`: Menampilkan informasi dasar dari objek-objek yang sesuai dengan parameter dari perintah ini. Gunakan `get -h` untuk melihat daftar opsi yang bisa digunakan.
- `describe`: Menampilkan agregat informasi detil dari objek-objek yang sesuai dengan parameter dari perintah ini.
- `logs`: Menampilkan isi stdout dan stderr dari sebuah kontainer yang berjalan di sebuah Pod.

## Menggunakan perintah `set` untuk memodifikasi objek sebelum dibuat

Ada beberapa *field* objek yang tidak memiliki parameter yang bisa kamu gunakan pada perintah `create`. Pada kasus-kasus tersebut, kamu bisa menggunakan kombinasi dari perintah `set` dan `create` untuk menspesifikasikan nilai untuk *field-field* tersebut sebelum objek dibuat. Ini dilakukan dengan melakukan *piping* pada hasil dari perintah `create` ke perintah `set`, dan kemudian mengembalikan hasilnya ke perintah `create`. Simak contoh berikut:

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

1. Perintah `kubectl create service -o yaml --dry-run` membuat konfigurasi untuk sebuah Service, tapi kemudian menuliskan konfigurasi tadi ke stdout dalam format YAML alih-alih mengirimnya ke *API Server* Kubernetes.
1. Perintah `kubectl set selector --local -f - -o yaml` membaca konfigurasi dari stdin, dan menuliskan pembaruan konfigurasi ke stdout dalam format YAML.
1. Perintah `kubectl create -f -` membuat objek dengan menggunakan konfigurasi yang disediakan pada stdin.

## Menggunakan `--edit` untuk memodifikasi objek sebelum dibuat

Kamu bisa menggunakan perintah `kubectl create --edit` untuk membuat perubahan terhadap sebuah objek sebelum objek tersebut dibuat. Simak contoh berikut:

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

1. Perintah `kubectl create service` membuat konfigurasi untuk objek Service dan menyimpannya di `/tmp/srv.yaml`.
1. Perintah `kubectl create --edit` membuka file konfigurasi untuk diedit sebelum objek dibuat.

{{% /capture %}}

{{% capture whatsnext %}}
- [Pengelolaan Objek Kubernetes secara Imperatif dengan Menggunakan Konfigurasi Objek](/docs/concepts/overview/object-management-kubectl/imperative-config/)
- [Pengelolaan Objek Kubernetes secara Deklaratif dengan Menggunakan File Konfigurasi](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Rujukan Perintah Kubectl](/docs/reference/generated/kubectl/kubectl/)
- [Kubernetes API Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
{{% /capture %}}
