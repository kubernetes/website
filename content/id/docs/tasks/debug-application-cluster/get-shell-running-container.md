---
title: Dapatkan _Shell_ Untuk Masuk ke Kontainer yang Sedang Berjalan
content_template: templates/task
---

{{% capture overview %}}

Halaman ini menunjukkan bagaimana cara menggunakan `kubectl exec` untuk 
mendapatkan _shell_ untuk masuk ke dalam kontainer yang sedang berjalan.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## Mendapatkan sebuah _shell_ untuk masuk ke sebuah kontainer

Dalam latihan ini, kamu perlu membuat Pod yang hanya memiliki satu kontainer saja. Kontainer
tersebut menjalankan _image_ nginx. Berikut ini adalah _file_ konfigurasi untuk Pod tersebut:

{{< codenew file="application/shell-demo.yaml" >}}

Buatlah Pod:

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

Pastikan bahwa kontainer dalam Pod berjalan:

```shell
kubectl get pod shell-demo
```

Dapatkan _shell_ untuk masuk ke dalam kontainer:

```shell
kubectl exec -it shell-demo -- /bin/bash
```

{{< note >}}

Simbol tanda hubung ganda "--" digunakan untuk memisahkan antara argumen perintah yang ingin kamu eksekusi pada kontainer dan argumen dari kubectl itu sendiri.

{{< /note >}}

Dalam _shell_ kamu, perlihatkan isi dari direktori _root_:

```shell
root@shell-demo:/# ls /
```

Dalam _shell_ kamu, cobalah dengan perintah-perintah yang lainnya. Berikut ini beberapa contoh diantaranya:

```shell
root@shell-demo:/# ls /
root@shell-demo:/# cat /proc/mounts
root@shell-demo:/# cat /proc/1/maps
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install -y tcpdump
root@shell-demo:/# tcpdump
root@shell-demo:/# apt-get install -y lsof
root@shell-demo:/# lsof
root@shell-demo:/# apt-get install -y procps
root@shell-demo:/# ps aux
root@shell-demo:/# ps aux | grep nginx
```

## Menulis halaman utama (_root_) untuk nginx

Lihat kembali pada _file_ konfigurasi untuk Pod kamu. Pod
memiliki _volume_ `emptyDir`, dan kontainer melakukan _mounting untuk _volume_ tersebut
pada `/usr/share/nginx/html`.

Pada _shell_ kamu, buatlah _file_ `index.html` dalam direktori `/usr/share/nginx/html`:

```shell
root@shell-demo:/# echo Hello shell demo > /usr/share/nginx/html/index.html
```

Pada _shell_ kamu, kirimkan sebuah permintaan (_request_) GET ke server nginx.

```shell
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install curl
root@shell-demo:/# curl localhost
```

Tampilan akan menunjukkan teks yang kamu tulis pada _file_ `index.html`.

```shell
Hello shell demo
```

Setelah kamu selesai dengan _shell_ kamu, ketiklah `exit`.

## Menjalankan perintah individu dalam sebuah kontainer

Pada jendela (_window_) perintah biasa, bukan pada _shell_ kamu dalam kontainer,
lihatlah daftar lingkungan variabel pada kontainer yang sedang berjalan:

```shell
kubectl exec shell-demo env
```

Cobalah dengan menjalankan perintah lainnya. Berikut ini beberapa contoh diantaranya:

```shell
kubectl exec shell-demo ps aux
kubectl exec shell-demo ls /
kubectl exec shell-demo cat /proc/1/mounts
```

{{% /capture %}}

{{% capture discussion %}}

## Membuka sebuah _shell_ ketika sebuah Pod memiliki lebih dari satu kontainer

Jika sebuah Pod memiliki lebih dari satu kontainer, gunakanlah `--container` atau `-c` untuk
menentukan kontainer yang dimaksud dalam perintah `kubectl exec`. Sebagai contoh,
misalkan kamu memiliki Pod yang bernama my-pod, dan Pod tersebut memiliki dua kontainer
yang bernama main-app dan helper-app. Perintah berikut ini akan membuka sebuah
_shell_ ke kontainer dengan nama main-app.

```shell
kubectl exec -it my-pod --container main-app -- /bin/bash
```

{{% /capture %}}


{{% capture whatsnext %}}

* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)

{{% /capture %}}



