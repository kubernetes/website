---
title: Mengatur Pod untuk Menggunakan Volume sebagai Tempat Penyimpanan
content_type: task
weight: 50
---

<!-- overview -->

Laman ini menjelaskan bagaimana cara mengatur sebuah Pod untuk menggunakan Volume sebagai tempat penyimpanan.

_Filesystem_ dari sebuah Container hanya hidup selama Container itu juga hidup. Saat Container berakhir dan dimulai ulang, perubahan pada _filesystem_ akan hilang. Untuk penyimpanan konsisten yang independen dari Container, kamu dapat menggunakan [Volume](/id/docs/concepts/storage/volumes/). Hal ini penting terutama untuk aplikasi _stateful_, seperti _key-value stores_ (contohnya Redis) dan database.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Mengatur volume untuk Pod

Pada latihan ini, kamu membuat sebuah Pod yang menjalankan sebuah Container. Pod ini memiliki sebuah Volume dengan tipe [emptyDir](/id/docs/concepts/storage/volumes/#emptydir)
yang tetap bertahan, meski Container berakhir dan dimulai ulang. Berikut berkas konfigurasi untuk Pod:

{{% codenew file="pods/storage/redis.yaml" %}}

1. Membuat Pod:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
    ```

2. Verifikasi apakah Container dari Pod berjalan sukses, lalu mengamati perubahan terhadap Pod:

    ```shell
    kubectl get pod redis --watch
    ```
    
    Hasil keluaran seperti ini:

    ```console
    NAME      READY     STATUS    RESTARTS   AGE
    redis     1/1       Running   0          13s
    ```

1. Pada terminal lain, buka _shell_ untuk masuk ke Container yang sedang berjalan:

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. Di dalam _shell_, pergi ke `/data/redis`, kemudian buat sebuah berkas:

    ```shell
    root@redis:/data# cd /data/redis/
    root@redis:/data/redis# echo Hello > test-file
    ```

1. Di dalam _shell_, munculkan daftar proses-proses yang sedang berjalan:

    ```shell
    root@redis:/data/redis# apt-get update
    root@redis:/data/redis# apt-get install procps
    root@redis:/data/redis# ps aux
    ```

    Keluarannya mirip seperti ini:

    ```console
    USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
    redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
    root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
    root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
    ```

1. Di dalam _shell_, matikan proses Redis:

    ```shell
    root@redis:/data/redis# kill <pid>
    ```

    dengan `<pid>` adalah ID proses Redis (PID).

2. Di dalam terminal awal, amati perubahan terhadap Pod Redis. Sampai akhirnya kamu akan melihat hal seperti ini:

    ```console
    NAME      READY     STATUS     RESTARTS   AGE
    redis     1/1       Running    0          13s
    redis     0/1       Completed  0         6m
    redis     1/1       Running    1         6m
    ```

Sampai di sini, Container telah berakhir dan dimuat ulang. Hal ini karena Pod Redis memiliki
[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
dengan nilai `Always`.

1. Gunakan _shell_ untuk masuk ke dalam Container yang telah dimuat ulang:

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

2. Di dalam _shell_, pergi ke `/data/redis`, dan verifikasi apakah `test-file` masih ada.
    ```shell
    root@redis:/data/redis# cd /data/redis/
    root@redis:/data/redis# ls
    test-file
    ```

3. Hapus Pod yang kamu buat untuk latihan ini:

    ```shell
    kubectl delete pod redis
    ```



## {{% heading "whatsnext" %}}


* Lihat [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

* Lihat [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

* Selain penyimpanan pada disk lokal yang di sediakan oleh `emptyDir`, Kubernetes
juga mendukung solusi penyimpanan _network-attached_, termasuk PD pada
GCE dan EBS dari EC2, yang cenderung lebih disukai untuk data sangat penting dan akan menangani urusan detil seperti _mounting_ dan _unmounting_ perangkat pada Node. Lihat
[Volume](/id/docs/concepts/storage/volumes/) untuk informasi detil.




