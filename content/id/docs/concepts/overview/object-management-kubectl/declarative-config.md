---
title: Pengelolaan Objek Kubernetes secara Deklaratif dengan Menggunakan File Konfigurasi
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
Objek-objek Kubernetes dapat dibuat, diperbarui, dan dihapus dengan menjalankan perintah `kubectl apply` terhadap file-file konfigurasi objek yang disimpan dalam sebuah direktori secara rekursif sesuai dengan kebutuhan. Perintah `kubectl diff` bisa digunakan untuk menampilkan pratinjau tentang perubahan apa saja yang akan dibuat oleh perintah `kubectil apply`.
{{% /capture %}}

{{% capture body %}}

## Kelebihan dan kekurangan

Perintah `kubectl` memungkinkan tiga cara untuk mengelola objek:

* Perintah imperatif
* Konfigurasi objek imperatif
* Konfigurasi objek deklaratif

Lihat [Pengelolaan Objek Kubernetes](/docs/concepts/overview/object-management-kubectl/overview/) untuk menyimak diskusi mengenai kelebihan dan kekurangan dari tiap cara pengelolaan objek.

## Sebelum kamu mulai

Konfigurasi objek secara deklaratif membutuhkan pemahaman yang baik
tentang definisi dan konfigurasi objek-objek Kubernetes. Jika belum pernah, kamu disarankan untuk membaca terlebih dulu dokumen-dokumen berikut:

- [Pengelolaan Objek Kubernetes Menggunakan Perintah Imperatif](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [Pengelolaan Objek Kubernetes Menggunakan File Konfigurasi Imperatif](/docs/concepts/overview/object-management-kubectl/imperative-config/)

Berikut adalah beberapa defnisi dari istilah-istilah yang digunakan
dalam dokumen ini:

- *objek file konfigurasi / file konfigurasi*: Sebuah *file* yang
mendefinisikan konfigurasi untuk sebuah objek Kubernetes. Dokumen ini akan memperlihatkan cara menggunakan *file* konfigurasi dengan perintah `kubectl apply`. *File-file* konfigurasi biasanya disimpan di sebuah *source control* seperti Git.
- *konfigurasi objek live / konfigurasi live*: nilai konfigurasi *live* dari sebuah objek, sebagaimana yang tersimpan di kluster Kubernetes. Nilai-nilai ini disimpan di *storage* kluster Kubernetes, biasanya etcd.
- *writer konfigurasi deklaratif / writer deklaratif*: Seseorang atau sebuah komponen perangkat lunak yang membuat pembaruan ke objek *live*. *Live writer* yang disebut pada dokumen ini adalah *writer* yang membuat perubahan terhadap *file* konfigurasi objek dan menjalankan perintah `kubectl apply` untuk menulis perubahan-perubahan tersebut.

## Cara membuat objek

Gunakan perintah `kubectl apply` untuk membuat semua objek, kecuali objek-objek yang sudah ada sebelumnya, yang didefinisikan di *file-file* konfigurasi dalam direktori yang ditentukan:

```shell
kubectl apply -f <directory>/
```

Perintah di atas akan memberi anotasi `kubectl.kubernetes.io/last-applied-configuration: '{...}'` pada setiap objek yang dibuat. Anotasi ini berisi konten dari *file* konfigurasi objek yang digunakan untuk membuat objek tersebut.

{{< note >}}
Tambahkan parameter `-R` untuk memproses seluruh direktori secara rekursif.
{{< /note >}}

Berikut sebuah contoh *file* konfigurasi objek:

{{< codenew file="application/simple_deployment.yaml" >}}

Jalankan perintah `kubectl diff` untuk menampilkan objek yang akan dibuat:

```shell
kubectl diff -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
Perintah `diff` menggunakan [*server-side dry-run*](/docs/reference/using-api/api-concepts/#dry-run), yang perlu diaktifkan di `kube-apiserver`.
{{< /note >}}

Buat objek dengan perintah `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Tampilkan konfigurasi *live* dengan perintah `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Keluaran perintah di atas akan menunjukkan bahwa anotasi `kubectl.kubernetes.io/last-applied-configuration` sudah dituliskan ke konfigurasi *live*, dan anotasi tersebut sesuai dengan *file* konfigurasi:

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # Ini merupakan representasi dari simple_deployment.yaml dalam format json
    # Ini ditulis oleh perintah `kubectl apply` ketika objek dibuat
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

## Cara memperbarui objek

Kamu juga bisa menggunakan `kubectl apply` untuk memperbarui semua objek yang didefinisikan dalam sebuah direktori, termasuk objek-objek yang sudah ada sebelumnya. Cara ini akan melakukan hal-hal berikut:

1. Menyimpan nilai *field-field* yang ada di *file* konfigurasi ke konfigurasi *live*.
2. Menghapus *field-field* yang dihapus di *file* konfigurasi dari konfigurasi *live*.

```shell
kubectl diff -f <directory>/
kubectl apply -f <directory>/
```

{{< note >}}
Tambahkan argumen `-R` untuk memproses seluruh direktori secara rekursif.
{{< /note >}}

Berikut sebuah contoh *file* konfigurasi:

{{< codenew file="application/simple_deployment.yaml" >}}

Buat objek dengan perintah `kubectl apply`::

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

{{< note >}}
Untuk keperluan ilustrasi, perintah berikut merujuk ke satu *file* konfigurasi alih-alih ke satu direktori.
{{< /note >}}

Tampilkan konfigurasi *live* dengan perintah `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Keluaran perintah di atas akan menunjukkan bahwa anotasi `kubectl.kubernetes.io/last-applied-configuration` sudah dituliskan ke konfigurasi *live*, dan anotasi tersebut sesuai dengan *file* konfigurasi:

```yaml
kind: Deployment
metadata:
  annotations:
    # ...
    # Berikut merupakan representasi dari simple_deployment.yaml dalam format json
    # Representasi berikut ditulis oleh perintah kubectl apply ketika objek dibuat
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

Perbarui nilai `replicas` secara langsung di konfigurasi `live` dengan menggunakan perintah `kubectl scale`. Pembaruan ini tidak menggunakan perintah `kubectl apply`:

```shell
kubectl scale deployment/nginx-deployment --replicas=2
```

Tampilkan konfigurasi *live* dengan perintah `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Keluaran perintah di atas akan menunjukkan bahwa nilai `replicas` telah diubah menjadi 2, dan anotasi `last-applied-configuration` tidak memuat nilai `replicas`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # perhatikan bahwa anotasi tidak memuat nilai replicas
    # karena nilai tersebut tidak diperbarui melalui perintah kubectl-apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # ditulis oleh perintah kubectl scale
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

Perbarui *file* konfigurasi `simple_deployment.yaml`, ubah *image* dari `nginx:1.7.9` ke `nginx:1.11.9`, dan hapus *field* `minReadySeconds`:

{{< codenew file="application/update_deployment.yaml" >}}

Terapkan perubahan yang telah dibuat di *file* konfigurasi:

```shell
kubectl diff -f https://k8s.io/examples/application/update_deployment.yaml
kubectl apply -f https://k8s.io/examples/application/update_deployment.yaml
```

Tampilkan konfigurasi *live* dengan perintah `kubectl get`:

```
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Keluaran perintah di atas akan menunjukkan perubahan-perubahan berikut pada konfiguasi *live*:

- *Field* `replicas` tetap bernilai 2 sesuai dengan nilai yang diatur oleh perintah `kubectl scale`. Hal ini karena *field* `replicas` dihapuskan dari *file* konfigurasi.
- Nilai *field* `image` telah diperbarui menjadi `nginx:1.11.9` dari `nginx:1.7.9`.
- Anotasi `last-applied-configuration` telah diperbari dengan *image* terbaru.
- *Field* `minReadySeconds` telah dihapus.
- Anotasi `last-applied-configuration` tidak lagi memuat *field* `minReadySeconds`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # Anotasi memuat image yang telah diperbarui ke nginx 1.11.9,
    # tetapi tidak memuat nilai replica yang telah diperbarui menjadi 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.11.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  replicas: 2 # Diatur oleh `kubectl scale`, tidak diubah oleh `kubectl apply`.
  # minReadySeconds dihapuskan oleh `kubectl apply`
  # ...
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.11.9 # Diatur oleh `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

{{< warning >}}
Mencampur perintah `kubectl apply` dengan perintah imperatif untuk konfigurasi objek seperti `create` dan `replace` tidak dimungkinkan. Hal ini karena `create` dan `replace` tidak menyimpan anotasi `kubectl.kubernetes.io/last-applied-configuration` yang diperlukan oleh `kubectl aplly` untuk melakukan pembaruan.
{{< /warning >}}

## Cara menghapus objek

Ada dua cara untuk menghapus objek-objek yang dikelola dengan `kubectl apply`.

### Rekomendasi: `kubectl delete -f <filename>`

Penghapusan objek secara manual dengan menggunakan perintah imperatif merupakan cara yang direkomendasikan karena lebih eksplisit dalam menentukan objek apa yang akan dihapus dan lebih kecil kemungkinannya untuk pengguna menghapus objek lain secara tidak sengaja:

```shell
kubectl delete -f <filename>
```

### Alternatif: `kubectl apply -f <directory/> --prune -l your=label`

Lakukan ini hanya jika kamu benar-benar mengetahui apa yang kamu lakukan.

{{< warning >}}
Perintah `kubectl apply --prune` masih dalam versi alpha dan perubahan-perubahan yang tidak memiliki kompatibilitas dengan versi sebelumnya mungkin akan diperkenalkan pada rilis-rilis berikutnya.
{{< /warning >}}

{{< warning >}}
Kamu harus berhati-hati ketika menggunakan perintah ini agar kamu tidak menghapus objek-objek lain secara tak sengaja.
{{< /warning >}}

Sebagai alternatif dari `kubectl delete`, kamu bisa menggunakan `kubectl apply` untuk mengidentifikasi objek-objek yang hendak dihapus setelah file konfigurasi objek-objek tersebut dihapus dari direktori. Ketika dijalankan dengan argumen `--prune`, perintah `kubectl apply` akan melakukan *query* ke *API server* untuk mencari semua objek yang sesuai dengan himpunan label-label tertentu, dan berusaha untuk mencocokkan kofigurasi objek *live* yg diperoleh terhadap *file* konfigurasi objek. Jika sebuah objek cocok dengan *query* yang dilakukan, dan objek tersebut tidak memiliki *file* konfigurasi di direktori serta tidak memiliki anotasi `last-applied-configuration`, objek tersebut akan dihapus.

{{< comment >}}
TODO(pwittrock): Kita perlu mengubah cara kerja perintah ini untuk mencegah pengguna menjalankan apply ke sub direktori secara tidak disengaja.
{{< /comment >}}

```shell
kubectl apply -f <directory/> --prune -l <labels>
```

{{< warning >}}
Perintah `kubectl apply` dengan argumen `--prune` sebaiknya hanya dijalankan terhadap direktori *root* yang berisi *file-file* konfigurasi objek. Menjalankan perintah tadi terhadap sub direktori bisa menyebabkan terhapusnya objek-objek lain secara tidak disengaja jika objek-objek tersebut memenuhi kriteria selektor label yang dispesifikasikan oleh argumen `-l <label>` dan tidak muncul di sub direktori.
{{< /warning >}}

## Cara melihat objek

Kamu bisa menggunakan perintah `kubectl get` dengan parameter `-o yaml` untuk melihat konfigurasi dari sebuah objek *live*:

```shell
kubectl get -f <filename|url> -o yaml
```

## Cara `kubectl apply` menghitung perbedaan dan menggabungkan perubahan

{{< caution >}}
*Patch* adalah operasi pembaruan yang lingkupnya spesifik terhadap sejumlah *field* dari sebuah objek alih-alih terhadap keseluruhan objek. *Patch* memungkinkan pembaruan terhadap himpunan *field* yang spesifik tanpa harus membaca keseluruhan objek terlebih dulu.
{{< /caution >}}

Ketika memperbarui konfigurasi *live* dari sebuah objek, `kubectl apply` melakukannya dengan mengirimkan *request* untuk melakukan *patch* ke *API server*. *Patch* mendefinisikan pembaruan-pembaruan yang likungpnya sepsifik terhadap sejumlah *field* dari objek konfigurasi *live*. Perintah `kubectl apply` menghitung *patch request* ini menggunakan *file* konfigurasi, konfigurasi *live*, dan anotasi `last-applied-configuration` yang tersimpan di konfigurasi *live*.

### Perhitungan penggabungan *patch*

Perintah `kubectl apply` menulis konten dari file konfigurasi ke anotasi `kubectl.kubernetes.io/last-applied-configuration`. Ini digunakan untuk mengidentifikasi *field* apa saja yang telah dihapus dari *file* konfigurasi dan perlu dihapus dari konfigurasi *live*. Berikut adalah langkah-langkah yang digunakan untuk menghitung *field* apa saja yang harus dihapus atau diubah:

1. Hitung *field-field* yang perlu dihapus. Ini mencakup *field-field* yang ada di `last-applied-configuration` tapi tidak ada di *file* konfigurasi.
2. Hitung *field-field* yang perlu ditambah atau diubah. Ini mencakup *field-field* yang ada di *file* konfigurasi yang nilainya tidak sama dengan konfigurasi *live*.

Agar lebih jelas, simak contoh berikut. Misalkan, berikut adalah *file* konfigurasi untuk sebuah objek Deployment:

{{< codenew file="application/update_deployment.yaml" >}}

Juga, misalkan, berikut adalah konfigurasi *live* dari objek Deployment yang sama:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # perhatikan bagaimana anotasi berikut tidak memuat replicas
    # karena replicas tidak diperbarui melalui perintah kubectl apply
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"minReadySeconds":5,"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.7.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
  # ...
spec:
  replicas: 2 # ditulis oleh perintah kubectl scale
  # ...
  minReadySeconds: 5
  selector:
    matchLabels:
      # ...
      app: nginx
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        # ...
        name: nginx
        ports:
        - containerPort: 80
      # ...
```

Berikut merupakan perhitungan penggabungan yang akan dilakukan oleh perintah `kubectl apply`:

1. Hitung semua *field* yang akan dihapus dengan membaca nilai dari `last-applied-configuration` dan membandingkannya dengan nilai yang ada di *file* konfigurasi. Hapus semua *field* yang nilainya secara eksplisit diubah menjadi null pada *file* konfigurasi objek lokal terlepas dari apakah *field-field* tersebut ada di anotasi `last-applied-configuration` atau tidak. Pada contoh di atas, *field* `minReadySeconds` muncul pada anotasi `last-applied-configuration`, tapi tidak ada di *file* konfigurasi. **Aksi:** Hapus `minReadySeconds` dari konfigurasi *live*.
2. Hitung semua *field* yang akan diubah dengan membaca nilai-nilai dari *file* konfigurasi dan membandingkannya dengan nilai-nilai yang ada di konfigurasi *live*. Pada contoh ini, nilai dari *field* `image` di *file* konfigurasi tidak sama dengan nilai dari konfigurasi *live*. **Aksi:** Ubah nilai `image` pada konfigurasi *live*.
3. Ubah anotasi `last-applied-configuration` agar sesuai dengan nilai yang ada di *file* konfigurasi.
4. Gabungkan hasil-hasil dari langkah 1, 2, dan 3 ke dalam satu *patch request* ke *API server*.

Berikut konfigurasi *live* yang dihasilkan oleh proses penggabungan pada contoh di atas:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    # ...
    # Anotasi memuat pembaruan image menjadi nginx 1.11.9,
    # tetapi tidak memuat pembaruan replicas menjadi 2
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"apps/v1","kind":"Deployment",
      "metadata":{"annotations":{},"name":"nginx-deployment","namespace":"default"},
      "spec":{"selector":{"matchLabels":{"app":nginx}},"template":{"metadata":{"labels":{"app":"nginx"}},
      "spec":{"containers":[{"image":"nginx:1.11.9","name":"nginx",
      "ports":[{"containerPort":80}]}]}}}}
    # ...
spec:
  selector:
    matchLabels:
      # ...
      app: nginx
  replicas: 2 # Diubah oleh `kubectl scale`, tidak diubah oleh `kubectl apply`.
  # minReadySeconds dihapus oleh `kubectl apply`
  # ...
  template:
    metadata:
      # ...
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.11.9 # Diubah oleh `kubectl apply`
        # ...
        name: nginx
        ports:
        - containerPort: 80
        # ...
      # ...
    # ...
  # ...
```

### Cara penggabungan tipe-tipe *field* yang berbeda

Cara sebuah *field* terentu dalam sebuah *file* konfigurasi digabungkan dengan konfigurasi *live* bergantung pada tipe *field* tersebut. Ada beberapa tipe *field*:

- *primitif*: *field* yang bertipe string, integer, atau boolean. Sebagai contoh, `image` dan `replicas` termasuk sebagai *field* primitif. **Aksi:** *Replace*.

- *map*, atau *objek*: *field* yang bertipe *map* atau tipe kompleks yang mengandung sub *field*. Sebagai contoh, `labels`, `annotations`, `spec`, dan `metadata` termasuk sebagai map. **Aksi**: Lakukan penggabungan tiap-tiap elemen atau sub *field*.

- *list*: *field* yang berisi sejumlah item yang tiap itemnya bisa berupa tipe primitif maupun map. Sebagai contoh, `containers`, `ports`, dan `args` termasuk sebagai *list*. **Aksi:** Bervariasi.

Ketika digunakan untuk memperbarui sebuah *field* bertipe *map* atau *list*, perintah `kubectl apply` memperbarui nilai tiap-tiap sub elemen ketimbang mengganti nilai semua *field*. Misalnya, ketika menggabungkan *field* `spec` pada sebuah Deployment, bukan keseluruhan *field* `spec` yang diubah nilainya. Alih-alih, sub *field* dari `spec` seperti `replicas` yang kemudian dibandingkan nilainya dan digabungkan.

### Menggabungkan perubahan pada *field* primitif

*Field* primitif diganti nilainya atau dihapus sama sekali.

{{< note >}}
`-` digunakan untuk menandai sebuah nilai "*not applicable*" karena nilai tersebut tidak digunakan.
{{< /note >}}

| *Field* pada *file* konfigurasi objek | *Field* pada objek konfigurasi *live* | *Field* pada *last-applied-configuration* | Aksi                                    |
|-------------------------------------|------------------------------------|-------------------------------------|-------------------------------------------|
| Ya                                 | Ya                                | -                                   | Ubah nilai di konfigurasi *live* mengikuti nilai pada *file* konfigurasi.  |
| Ya                                 | Tidak                                 | -                                   | Ubah nilai di konfigurasi *live* mengikuti nilai pada konfigurasi lokal.           |
| Tidak                                  | -                                  | Ya                                 | Hapus dari konfigurasi *live*.            |
| Tidak                                  | -                                  | Tidak                                  | Tidak melakukan apa-apa, pertahankan nilai konfigurasi *live*.             |

### Menggabungkan perubahan pada *field* bertipe *map*

*Field* yang bertipe *map* digabungkan dengan membandingkan tiap sub *field* atau elemen dari map:

{{< note >}}
`-` digunakan untuk menandai sebuah nilai "*not applicable*" karena nilai tersebut tidak digunakan.
{{< /note >}}

| *Key* pada *file* konfigurasi objek    | *Key* pada objek konfigurasi *live*   | *Field* pada *last-applied-configuration* | Aksi                           |
|-------------------------------------|------------------------------------|-------------------------------------|----------------------------------|
| Ya                                 | Ya                                | -                                   | Bandingkan nilai tiap sub *field*.        |
| Ya                                 | Tidak                                 | -                                   | Ubah nilai pada konfigurasi *live* mengikuti nilai pada konfigurasi lokal.  |
| Tidak                                  | -                                  | Ya                                 | Hapus dari konfigurasi *live*.   |
| Tidak                                  | -                                  | Tidak                                  | Tidak melakukan apa-apa, pertahankan nilai konfigurasi *live*.     |

### Menggabungkan perubahan pada *field* yang bertipe *list*

Penggabungan perubahan pada sebuah *list* bisa menggunakan salah satu dari tiga strategi:

* Ganti nilai keseluruhan *list*.
* Gabungkan nilai tiap-tiap elemen di dalam sebuah list yang elemennya kompleks.
* Gabungkan list yang elemennya primitif.

Pilihan strategi dibuat berbeda-beda bergantung tipe tiap *field*.

#### Ganti nilai keseluruhan *list*

Perlakukan *list* sama dengan *field* primitif. Ganti atau hapus keseluruhan list. Ini akan menjaga urutan dari list.

**Contoh:** Gunakan `kubectl apply` untuk memperbarui *field* `args` pada sebuah kontainer di dalam sebuah *pod*. Ini akan mengubah nilai `args` di konfigurasi *live* mengikuti nilai di *file* konfigurasi. Elemen `args` apapun yang sebelumnya ditambahkan ke konfigurasi *live* akan hilang. Urutan dari elemen-elemen `args` yang didefinisikan di *file* konfigurasi akan dipertahankan ketika ditulis ke konfigurasi *live*.

```yaml
# nilai last-applied-configuration*
    args: ["a", "b"]

# nilai file konfigurasi
    args: ["a", "c"]

# nilai konfigurasi live
    args: ["a", "b", "d"]

# hasil setelah penggabungan
    args: ["a", "c"]
```

**Penjelasan:** Penggabungan menggunakan nilai pada *file* konfigurasi sebagai nilai baru untuk *list* `args`.

#### Menggabungkan tiap-tiap elemen dari sebuah *list* dengan elemen kompleks:

Perlakukan *list* selayaknya sebuah *map*, perlakukan *field* spesifik dari tiap element sebagai sebuah *key*. Tambah, hapus, atau perbarui tiap-tiap elemen. Operasi ini tidak mempertahankan urutan elemen di dalam *list*.

Strategi penggabungan ini menggunakan *tag* khusus `patchMergeKey` pada tiap *field*. *Tag* `patchMergeKey` didefinisikan untuk tiap *field* pada *source code* Kubernetes: [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2747). Ketika menggabungkan sebuah *list* yang berisi *map*, *field* yang dispesifikasikan sebagai `patchMergeKey` untuk tiap elemen digunakan sebagai *map key* untuk elemen tersebut.

**Contoh:** Gunakan `kubectl apply` untuk memperbarui *field* `containers` pada sebuah PodSpec. Perintah ini akan menggabungkan *list* `containers` seolah-olah *list* tersebut adalah sebuah *map* dan tiap elemennya menggunakan `name` sebagai *key*.

```yaml
# nilai last-applied-configuration
    containers:
    - name: nginx
      image: nginx:1.10
    - name: nginx-helper-a # key: nginx-helper-a; akan dihapus pada hasil akhir
      image: helper:1.3
    - name: nginx-helper-b # key: nginx-helper-b; akan dipertahankan pada hasil akhir
      image: helper:1.3

# nilai file konfigurasi
    containers:
    - name: nginx
      image: nginx:1.10
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # key: nginx-helper-c; akan ditambahkan pada hasil akhir
      image: helper:1.3

# konfigurasi live
    containers:
    - name: nginx
      image: nginx:1.10
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field ini akan dipertahankan pada hasil akhir
    - name: nginx-helper-d # key: nginx-helper-d; akan dipertahankan pada hasil akhir
      image: helper:1.3

# hasil akhir setelah penggabungan
    containers:
    - name: nginx
      image: nginx:1.10
      # Elemen nginx-helper-a dihapus
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field dipertahankan
    - name: nginx-helper-c # Elemen ditambahkan
      image: helper:1.3
    - name: nginx-helper-d # Elemen tidak diubah
      image: helper:1.3
```

**Penjelasan:**

- Kontainer dengan nama "nginx-helper-a" dihapus karena tidak ada kontainer dengan nama tersebut di *file* konfigurasi.
- Kontainer dengan nama "nginx-helper-b" tetap mempertahankan nilai `args` pada konfigurasi *live*. Perintah `kubectl apply` bisa mengenali bahwa "nginx-helper-b" di konfigurasi *live* sama dengan "ngnix-helper-b" di *file* konfigurasi, meskipun keduanya memiliki *field* yang berbeda (tidak ada `args` pada *file* konfigurasi). Ini karena nilai `patchMergeKey` di kedua konfigurasi identik.
- Kontainer dengan nama "nginx-helper-c" ditambahkan karena tidak ada kontainer dengan nama tersebut di konfigurasi *live*, tapi ada di *file* konfigurasi.
- Kontainer dengan nama "nginx-helper-d" dipertahankan karena tidak ada elemen dengan nama tersebut pada *last-applied-configuration*.

#### Menggabungkan sebuah *list* dengan elemen-elemen primitif

Pada versi Kubernetes 1.5, penggabungan list dengan elemen-elemen primitif tidak lagi didukung.

{{< note >}}
Strategi mana yang dipilih untuk sembarang *field* ditentukan oleh *tag* `patchStrategy` pada [types.go](https://github.com/kubernetes/api/blob/d04500c8c3dda9c980b668c57abc2ca61efcf5c4/core/v1/types.go#L2748). Jika `patchStrategy` tidak ditentukan untuk sebuah *field* yang bertipe *list*, maka *list* tersebut akan diubah nilainya secara keseluruhan.
{{< /note >}}

{{< comment >}}
TODO(pwittrock): *Uncomment* ini untuk versi 1.6

- Perlakukan list sebagai sekelopok primitif. Ganti atau hapus tiap-tiap elemen. Tidak mempertahankan urutan. Tidak mempertahankan duplikat.

**Contoh:** Gunakan `kubectl apply` untuk memperbarui *field* `finalizer` dari ObjectMeta mempertahankan elemen-elemen yang ditambahkan ke konfigurasi *live*. Urutan dari `finalizers` tidak dipertahankan.
{{< /comment >}}

## Nilai *default* dari sebuah *field*

*API server* mengisi *field* tertentu dengan nilai *default* pada konfigurasi *live* jika nilai *field-field* tersebut tidak dispesifikasikan ketika objek dibuat.

Berikut adalah sebuah *file* konfigurasi untuk sebuah Deployment. File berikut tidak menspesifikasikan `strategy`:

{{< codenew file="application/simple_deployment.yaml" >}}

Buat objek dengan perintah `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/application/simple_deployment.yaml
```

Tampilkan konfigurasi *live* dengan perintah `kubectl get`:

```shell
kubectl get -f https://k8s.io/examples/application/simple_deployment.yaml -o yaml
```

Keluaran dari perintah tadi menunjukkan bahwa *API server* mengisi beberapa *field* dengan nilai *default* pada konfigurasi *live*. *Field-field* berikut tidak dispesifikan pada *file* konfigurasi.

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  selector:
    matchLabels:
      app: nginx
  minReadySeconds: 5
  replicas: 1 # nilai default dari apiserver
  strategy:
    rollingUpdate: # nilai default dari apiserver - diturunkan dari strategy.type
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate # nilai default dari apiserver
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx:1.7.9
        imagePullPolicy: IfNotPresent # nilai default dari apiserver
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP # nilai default dari apiserver
        resources: {} # nilai default dari apiserver
        terminationMessagePath: /dev/termination-log # nilai default dari apiserver
      dnsPolicy: ClusterFirst # nilai default dari apiserver
      restartPolicy: Always # nilai default dari apiserver
      securityContext: {} # nilai default dari apiserver
      terminationGracePeriodSeconds: 30 # nilai default dari apiserver
# ...
```

Dalam sebuah *patch request*, *field-field* dengan nilai *default* tidak diisi kembali dengan nilai *default* kecuali secara eksplisit nilainya dihapuskan sebagai bagian dari *patch request*. Ini bisa menimbulkan hasil yang tak terduga jika sebagian *field* diisi dengan nilai *default* yang diturunkan dari nilai *field* lainnya. Ketika *field* lain tersebut nilainya diubah, *field-field* yang diisi dengan nilai *default* berdasarkan *field* yang berubah tadi tidak akan diperbarui kecuali secara eksplisit dihapus.

Oleh karena itu, beberapa *field* yang nilainya diisi secara *default* oleh *server* perlu didefinisikan secara eksplisit di *file* konfigurasi, meskipun nilai yang diinginkan sudah sesuai dengan nilai *default* dari server. Ini untuk mempermudah mengenali nilai-nilai yang berselisih yang tidak akan diisi dengan nilai *default* oleh *server*.

**Contoh:**

```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80

# file konfigurasi
spec:
  strategy:
    type: Recreate # nilai yang diperbarui
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80

# konfigurasi live
spec:
  strategy:
    type: RollingUpdate # nilai default
    rollingUpdate: # nilai default yang diturunkan dari type
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80

# hasil setelah penggabungan - ERROR!
spec:
  strategy:
    type: Recreate # nilai yang diperbarui: tidak kompatibel dengan field rollingUpdate
    rollingUpdate: # nilai default: tidak kompatibel dengan "type: Recreate"
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

**Penjelasan:**

1. Pengguna sebelumnya sudah membuat sebuah Deployment tanpa mendefinisikan `strategy.type` (seperti yang bisa dilihat pada `last-applied-configuration`).
2. Server mengisi `strategy.type` dengan nilai *default* `RollingUpdate` dan mengisi `strategy.rollingUpdate` dengan nilai *default* pada konfigurasi *live*.
3. Pengguna mengubah nilai *field* `strategy.type` menjadi `Recreate` pada *file* konfigurasi. Nilai `strategy.rollingUpdate` tidak berubah dari nilai *default*, meskipun server sekarang berekspektasi nilai tersebut dihapus. Jika nilai `strategy.rollingUpdate` didefinisikan di awal pada *file* konfigurasi, akan jelas bagi *server* bahwa *field* tersebut perlu dihapus.
4. Perintah `kubect apply` gagal karena `strategy.rollingUpdate` tidak dihapus. *Field* `strategy.rollingUpdate` tidak bisa didefinisikan jika *field* `strategy.type` berisi `Recreate`.

Rekomendasi: *Field-field* ini harus didefinisikan secara eksplisit di *file* konfigurasi objek:

- Label Selectors dan PodTemplate pada *workloads*, misalnya Deployment, StatefulSet, Job, DaemonSet, ReplicaSet, dan ReplicationController
- Strategi Deployment *rollout*

### Cara menghilangkan *field-field* yang diisi dengan nilai *default* atau diisi oleh *writer* lainnya

*Field-field* yang tidak muncul di *file* konfigurasi bisa dihilangkan dengan mengisi nilainya dengan `null` dan kemudian jalankan `kubectl apply` dengan *file* konfigurasi tersebut. Untuk *field-field* yang nilainya diisi dengan nilai *default* oleh *server*, aksi ini akan mmenyebabkan pengisian ulang *field* dengan nilai *default*.

## Cara mengubah kepemilikan sebuah *field* antara *file* konfigurasi dan *writer* imperatif

Hanya metode-metode berikut yang bisa kamu gunakan untuk mengubah satu *field* objek:

- Gunakan `kubectl apply`.
- Tulis secara langsung ke konfigurasi *live* tanpa memodifikasi *file* konfigurasi: misalnya, dengan perintah `kubectl scale`.

### Mengubah kepemilikan dari *writer* imperatif ke *file* konfigurasi

Tambahkan *field* ke *file* konfigurasi. Hentikan pembaruan secara langsung ke konfigurasi *live* tanpa melalui `kubectl apply`.

### Mengubah kepemilikan dari *file* konfigurasi ke *writer* imperatif

Pada versi Kubernetes 1.5, mengubah kepemilikan sebuah field dari *file* konfigurasi memerlukan langkah-langkah manual:

- Hapus *field* dari *file* konfigurasi.
- Hapus *field* dari anotasi `kubectl.kubernetes.io/last-applied-configuration` pada objek *live*.

## Mengubah metode-metode pengelolaan objek

Objek-objek Kubernetes sebaiknya dikelola dengan satu metode dalam satu waktu. Berpindah dari satu metode ke metode lain dimungkinkan, tetapi memerlukan proses manual.

{{< note >}}
Boleh menggunakan perintah hapus secara imperatif dalam pengelolaan objek secara deklaratif.
{{< /note >}}

{{< comment >}}
TODO(pwittrock): We need to make using imperative commands with
declarative object configuration work so that it doesn't write the
fields to the annotation, and instead.  Then add this bullet point.

- using imperative commands with declarative configuration to manage where each manages different fields.
{{< /comment >}}

### Migrasi dari pengelolaan dengan perintah imperatif ke konfigurasi objek deklaratif

Migrasi dari pengelolaan objek dengan perintah imperatif ke pengelolaan objek dengan konfigurasi deklaratif memerlukan beberapa langkah manual:

1. Ekspor objek *live* ke *file* konfigurasi lokal:

     ```shell
     kubectl get <kind>/<name> -o yaml > <kind>_<name>.yaml
     ```

1. Hapus secara manual *field* `status` dari *file* konfigurasi.

    {{< note >}}
    Tahap ini opsional, karena `kubectl apply` tidak memperbarui *field* status meskipun *field* tersebut ada di *file* konfigurasi.
    {{< /note >}}

1. Ubah anotasi `kubectl.kubernetes.io/last-applied-configuration` pada objek:

    ```shell
    kubectl replace --save-config -f <kind>_<name>.yaml
    ```

1. Selanjutnya gunakan `kubectl apply` secara eksklusif untuk mengelola objek.

{{< comment >}}
TODO(pwittrock): Why doesn't export remove the status field?  Seems like it should.
{{< /comment >}}

### Migrasi dari konfigurasi objek imperatif ke konfigurasi objek deklaratif

1. Atur anotasi `kubectl.kubernetes.io/last-applied-configuration` pada objek:

    ```shell
    kubectl replace --save-config -f <kind>_<name>.yaml
    ```

1. Gunakan selalu perintah `kubectl apply` saja untuk mengelola objek.

## Pendefinisian selektor *controller* dan label PodTemplate

{{< warning >}}
Pembaruan selektor pada *controllers* sangat tidak disarankan.
{{< /warning >}}

Cara yang disarankan adalah dengan mendefinisikan sebuah PodTemplate *immutable* yang hanya digunakan oleh selektor *controller* tanpa memiliki arti semantik lainnya.

**Contoh:**

```yaml
selector:
  matchLabels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "extensions/v1beta1/deployment/nginx"
```

{{% capture whatsnext %}}
- [Pengelolaan Objek Kubernetes Menggunakan Perintah Imperatif](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [Pengelolaan Objek Kubernetes secara Imperatif Menggunakan File Konfigurasi](/docs/concepts/overview/object-management-kubectl/imperative-config/)
- [Rujukan Perintah Kubectl](/docs/reference/generated/kubectl/kubectl/)
- [Rujukan API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
{{% /capture %}}
