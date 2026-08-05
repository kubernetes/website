---
title: Mendapatkan Shell Untuk Masuk ke Container yang Sedang Berjalan
content_type: task
---

<!-- overview -->

Laman ini menunjukkan bagaimana cara menggunakan `kubectl exec` untuk 
mendapatkan _shell_ untuk masuk ke dalam Container yang sedang berjalan.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Mendapatkan sebuah _shell_ untuk masuk ke sebuah Container

Dalam latihan ini, kamu perlu membuat Pod yang hanya memiliki satu Container saja. Container
tersebut menjalankan _image_ nginx. Berikut ini adalah berkas konfigurasi untuk Pod tersebut:

{{% codenew file="application/shell-demo.yaml" %}}

Buatlah Pod tersebut:

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

Pastikan bahwa Container dalam Pod berjalan:

```shell
kubectl get pod shell-demo
```

Dapatkan _shell_ untuk masuk ke dalam Container:

```shell
kubectl exec -it shell-demo -- /bin/bash
```

{{< note >}}

Simbol tanda hubung ganda "--" digunakan untuk memisahkan antara argumen perintah yang ingin kamu eksekusi pada Container dan argumen dari kubectl itu sendiri.

{{< /note >}}

Di dalam _shell_ kamu, perlihatkan isi dari direktori _root_:

```shell
root@shell-demo:/# ls /
```

Di dalam _shell_ kamu, cobalah perintah-perintah yang lainnya. Berikut beberapa contohnya:

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

Lihat kembali berkas konfigurasi untuk Pod kamu. Pod
memiliki volume `emptyDir`, dan Container melakukan pemasangan (_mounting_) untuk volume tersebut
pada `/usr/share/nginx/html`.

Pada _shell_ kamu, buatlah berkas `index.html` dalam direktori `/usr/share/nginx/html`:

```shell
root@shell-demo:/# echo Hello shell demo > /usr/share/nginx/html/index.html
```

Pada _shell_ kamu, kirimkan sebuah permintaan (_request_) GET ke server nginx.

```shell
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install curl
root@shell-demo:/# curl localhost
```

Keluarannya akan menunjukkan teks yang kamu tulis pada berkas `index.html`.

```shell
Hello shell demo
```

Setelah kamu selesai dengan _shell_ kamu, ketiklah `exit`.

## Menjalankan perintah individu di dalam sebuah Container

Pada jendela (_window_) perintah biasa, bukan pada _shell_ kamu di dalam Container,
lihatlah daftar variabel lingkungan (_environment variable_) pada Container yang sedang berjalan:

```shell
kubectl exec shell-demo -- env
```

Cobalah dengan menjalankan perintah lainnya. Berikut beberapa contohnya:

```shell
kubectl exec shell-demo ps aux
kubectl exec shell-demo ls /
kubectl exec shell-demo cat /proc/1/mounts
```



<!-- discussion -->

## Membuka sebuah _shell_ ketika sebuah Pod memiliki lebih dari satu Container

Jika sebuah Pod memiliki lebih dari satu Container, gunakanlah `--container` atau `-c` untuk
menentukan Container yang dimaksud pada perintah `kubectl exec`. Sebagai contoh,
misalkan kamu memiliki Pod yang bernama my-pod, dan Pod tersebut memiliki dua Container
yang bernama main-app dan helper-app. Perintah berikut ini akan membuka sebuah
_shell_ ke Container dengan nama main-app.

```shell
kubectl exec -it my-pod --container main-app -- /bin/bash
```




## {{% heading "whatsnext" %}}


* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)





