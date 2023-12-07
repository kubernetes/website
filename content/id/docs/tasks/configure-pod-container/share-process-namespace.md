---
title: Pembagian Namespace Proses antar Container pada sebuah Pod
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

Dokumen ini akan menjelaskan menkanisme konfigurasi pembagian namespace
process dalam sebuah Pod. Ketika pembagian _namespace_ proses diaktifkan untuk sebuah Pod,
proses yang ada di dalam Container akan bersifat transparan pada semua Container
yang terdapat di dalam Pod tersebut.

Kamu dapat mengaktifkan fitur ini untuk melakukan konfigurasi kontainer yang saling terhubung,
misalnya saja kontainer _sidecar_ yang bertugas dalam urusan log, atau untuk melakukan
proses pemecahan masalah (_troubleshoot_) image kontainer yang tidak memiliki utilitas _debugging_ seperti shell.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Mengatur sebuah Pod

Pembagian _namespace_ proses (_Process Namespace Sharing_) diaktifkan menggunakan _field_ `shareProcessNamespace`
`v1.PodSpec`. Sebagai contoh:

{{% codenew file="pods/share-process-namespace.yaml" %}}

1. Buatlah sebuah Pod `nginx` di dalam klaster kamu:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
    ```

2. Tempelkan kontainer `shell` dan jalankan perintah `ps`:

    ```shell
    kubectl attach -it nginx -c shell
    ```

    Jika kamu tidak melihat _prompt_ perintah, kamu dapat menekan tombol enter:

    ```
    / # ps ax
    PID   USER     TIME  COMMAND
        1 root      0:00 /pause
        8 root      0:00 nginx: master process nginx -g daemon off;
       14 101       0:00 nginx: worker process
       15 root      0:00 sh
       21 root      0:00 ps ax
    ```

Kamu dapat memberikan sinyal pada kontainer lain. Misalnya saja, mengirim sinyal `SIGHUP` pada
nginx untuk menjalankan ulang proses worker. Hal ini membutuhkan kapabilitas `SYS_PTRACE`.

```
/ # kill -HUP 8
/ # ps ax
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   15 root      0:00 sh
   22 101       0:00 nginx: worker process
   23 root      0:00 ps ax
```

Hal ini juga merupakan alasan mengapa kita dapat mengakses kontainer lain menggunakan
tautan (_link_) `/proc/$pid/root`.

```
/ # head /proc/8/root/etc/nginx/nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
```



<!-- discussion -->

## Memahami Pembagian Namespace Process

Pod berbagi banyak sumber daya yang ada sehingga memungkinkan adanya pembagian _namespace_
proses. Beberapa _image_ kontainer bisa jadi terisolasi dari kontainer lainnya,
meskipun begitu, memahami beberapa perbedaan berikut juga merupakan hal yang
penting untuk diketahui:

1. **Proses kontainer tidak lagi memiliki PID 1.** Beberapa image kontainer akan menolak
   untuk dijalankan (contohnya, kontainer yang menggunakan `systemd`) atau menjalankan
   perintah seperti `kill -HUP 1` untuk memberikan sinyal pada proses kontainer. Di dalam Pod dengan
   sebuah namespace process terbagi, sinyal `kill -HUP 1` akan diberikan pada _sandbox_ Pod.
   (`/pause` pada contoh di atas.)

2. **Proses-proses yang ada akan transparan pada kontainer lain di dalam Pod.** Hal ini termasuk
   informasi pada `/proc`, seperti kata sandi yang diberikan sebagai argumen atau _environment variable_.
   Hal ini hanya dilindungi oleh perizinan reguler Unix.

3. **Berkas sistem (_filesystem_) kontainer bersifat transparan pada kontainer lain di dalam Pod melalui link
   `/proc/$pid/root`.** Hal ini memungkinkan proses _debugging_ menjadi lebih mudah, meskipun begitu hal ini
   juga berarti kata kunci (_secret_) yang ada di dalam _filesystem_ juga hanya dilindungi oleh perizinan _filesystem_ saja.

