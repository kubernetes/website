---
title: Membuat Daftar Semua Image Container yang Berjalan dalam Klaster
content_type: task
weight: 100
---

<!-- overview -->

Laman ini menunjukkan cara menggunakan kubectl untuk membuat daftar semua _image_ Container
untuk Pod yang berjalan dalam sebuah klaster.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

Dalam latihan ini kamu akan menggunakan kubectl untuk mengambil semua Pod yang
berjalan dalam sebuah klaster, dan mengubah format keluarannya untuk melihat daftar
Container untuk masing-masing Pod.

## Membuat daftar semua _image_ Container pada semua Namespace

- Silakan ambil semua Pod dalam Namespace dengan menggunakan perintah `kubectl get pods --all-namespaces`
- Silakan format keluarannya agar hanya menyertakan daftar nama _image_ dari Container
  dengan menggunakan perintah `-o jsonpath={.items[*].spec.containers[*].image}`.  Perintah ini akan mem-_parsing field_
  `image` dari keluaran json yang dihasilkan.
  - Silakan lihat [referensi jsonpath](/docs/user-guide/jsonpath/)
    untuk informasi lebih lanjut tentang cara menggunakan `jsonpath`.
- Silakan format keluaran dengan menggunakan peralatan standar: `tr`, `sort`, `uniq`
  - Gunakan `tr` untuk mengganti spasi dengan garis baru
  - Gunakan `sort` untuk menyortir hasil
  - Gunakan `uniq` untuk mengumpulkan jumlah _image_

```sh
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

Perintah di atas secara berulang akan mengembalikan semua _field_ bernama `image`
dari semua poin yang dikembalikan.

Sebagai pilihan, dimungkinkan juga untuk menggunakan jalur (_path_) absolut ke _field image_
di dalam Pod. Hal ini memastikan _field_ yang diambil benar
bahkan ketika nama _field_ tersebut diulangi,
misalnya banyak _field_ disebut dengan `name` dalam sebuah poin yang diberikan:

```sh
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}"
```

`Jsonpath` dapat diartikan sebagai berikut:

- `.items[*]`: untuk setiap nilai yang dihasilkan
- `.spec`: untuk mendapatkan spesifikasi
- `.containers[*]`: untuk setiap Container
- `.image`: untuk mendapatkan _image_

{{< note >}}
Pada saat mengambil sebuah Pod berdasarkan namanya, misalnya `kubectl get pod nginx`,
bagian `.items[*]` dari jalur harus dihilangkan karena hanya akan menghasilkan sebuah Pod
sebagai keluarannya, bukan daftar dari semua Pod.

{{< /note >}}

## Membuat daftar _image_ Container berdasarkan Pod

Format dapat dikontrol lebih lanjut dengan menggunakan operasi `range` untuk 
melakukan iterasi untuk setiap elemen secara individual.

```sh
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## Membuat daftar _image_ yang difilter berdasarkan label dari Pod

Untuk menargetkan hanya Pod yang cocok dengan label tertentu saja, gunakan tanda -l. Filter
dibawah ini akan menghasilkan Pod dengan label yang cocok dengan `app=nginx`.

```sh
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" -l app=nginx
```

## Membuat daftar _image_ Container yang difilter berdasarkan Namespace Pod

Untuk hanya menargetkan Pod pada Namespace tertentu, gunakankan tanda Namespace. Filter
dibawah ini hanya menyaring Pod pada Namespace `kube-system`.

```sh
kubectl get pods --namespace kube-system -o jsonpath="{.items[*].spec.containers[*].image}"
```

## Membuat daftar _image_ Container dengan menggunakan go-template sebagai alternatif dari jsonpath

Sebagai alternatif untuk `jsonpath`, kubectl mendukung penggunaan [go-template](https://pkg.go.dev/text/template)
untuk memformat keluaran seperti berikut:


```sh
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```





<!-- discussion -->



## {{% heading "whatsnext" %}}


### Referensi

* Referensi panduan [Jsonpath](/docs/user-guide/jsonpath/).
* Referensi panduan [Go template](https://pkg.go.dev/text/template).




