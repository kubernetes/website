---
title: Menggunakan Port Forwarding untuk Mengakses Aplikasi di sebuah Klaster
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

Halaman ini menunjukkan bagaimana menggunakan `kubectl port-forward` untuk menghubungkan sebuah server Redis yang sedang berjalan di sebuah klaster Kubernetes. Tipe dari koneksi ini dapat berguna untuk melakukan _debugging_ basis data.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Install [redis-cli](http://redis.io/topics/rediscli).




<!-- steps -->

## Membuat Deployment dan Service Redis

1. Buat sebuah Deployment yang menjalankan Redis:

    ```shell
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-deployment.yaml
    ```

    Keluaran dari sebuah perintah yang sukses akan memverifikasi bahwa Deployment telah terbuat:

    ```
    deployment.apps/redis-master created
    ```

    Lihat status Pod untuk memeriksa apakah sudah siap:

    ```shell
    kubectl get pods
    ```

    Keluaran menampilkan Pod yang telah terbuat:

    ```
    NAME                            READY     STATUS    RESTARTS   AGE
    redis-master-765d459796-258hz   1/1       Running   0          50s
    ```

    Lihat status Deployment:

    ```shell
    kubectl get deployment
    ```

    Keluaran menampilkan bahwa Deployment telah terbuat:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    redis-master 1/1     1            1           55s
    ```

    Deployment secara otomatis mengatur sebuah ReplicaSet.
    Lihat status ReplicaSet menggunakan:

    ```shell
    kubectl get replicaset
    ```

    Keluaran menampilkan bahwa ReplicaSet telah terbuat:

    ```
    NAME                      DESIRED   CURRENT   READY     AGE
    redis-master-765d459796   1         1         1         1m
    ```


2. Buat sebuah Service untuk mengekspos Redis di jaringan:

    ```shell
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-service.yaml
    ```

    Keluaran dari perintah yang sukses akan memverifikasi bahwa Service telah terbuat:

    ```
    service/redis-master created
    ```

    Lihat Service yang telah terbuat menggunakan:

    ```shell
    kubectl get service redis-master
    ```

    Keluaran menampilkan service yang telah terbuat:

    ```
    NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    redis-master   ClusterIP   10.0.0.213   <none>        6379/TCP   27s
    ```

3. Periksa apakah server Redis berjalan di Pod, dan mendengarkan porta 6379:

    ```shell
    # Ubah redis-master-765d459796-258hz menjadi nama Pod
    kubectl get pod redis-master-765d459796-258hz --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
    ```

    Keluaran akan menampilkan porta dari Redis di Pod tersebut:

    ```
    6379
    ```

    (ini adalah porta TCP yang dialokasi untuk Redis di internet)

## Meneruskan sebuah porta lokal ke sebuah porta pada Pod

1.  `kubectl port-forward` memungkinkan penggunaan nama sumber daya, seperti sebuah nama Pod, untuk memilih Pod yang sesuai untuk melakukan penerusan porta.


    ```shell
    # Ubah redis-master-765d459796-258hz menjadi nama Pod
    kubectl port-forward redis-master-765d459796-258hz 7000:6379
    ```

    yang sama seperti

    ```shell
    kubectl port-forward pods/redis-master-765d459796-258hz 7000:6379
    ```

    atau

    ```shell
    kubectl port-forward deployment/redis-master 7000:6379
    ```

    atau

    ```shell
    kubectl port-forward replicaset/redis-master 7000:6379
    ```

    atau

    ```shell
    kubectl port-forward service/redis-master 7000:6379
    ```

    Semua perintah di atas berfungsi. Keluarannya mirip dengan ini:

    ```
    I0710 14:43:38.274550    3655 portforward.go:225] Forwarding from 127.0.0.1:7000 -> 6379
    I0710 14:43:38.274797    3655 portforward.go:225] Forwarding from [::1]:7000 -> 6379
    ```

2.  Memulai antarmuka baris perintah (*command line*) Redis:

    ```shell
    redis-cli -p 7000
    ```

3.  Pada baris perintah di Redis, masukkan perintah `ping`:

    ```
    ping
    ```

    Sebuah permintaan *ping* yang sukses akan mengembalikan:

    ```
    PONG
    ```




<!-- discussion -->

## Diskusi

Koneksi-koneksi yang dibuat ke porta lokal 7000 diteruskan ke porta 6379 dari Pod yang menjalankan server Redis.
Dengan koneksi ini, kamu dapat menggunakan *workstation* lokal untuk melakukan *debug* basis data yang berjalan di Pod.

{{< note >}}
`kubectl port-forward` hanya bisa diimplementasikan untuk porta TCP saja.
Dukungan untuk protokol UDP bisa dilihat di
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
{{< /note >}}




## {{% heading "whatsnext" %}}

Belajar lebih tentang [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).

