---
title: Menempatkan Pod pada Node Menggunakan Afinitas Pod
min-kubernetes-server-version: v1.10
content_type: task
weight: 120
---

<!-- overview -->
Dokumen ini menunjukkan cara menempatkan Pod Kubernetes pada sebuah Node menggunakan
Afinitas Node di dalam klaster Kubernetes.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Menambahkan sebuah Label pada sebuah Node

1. Jabarkan Node-Node yang ada pada klaster kamu, bersamaan dengan label yang ada:

    ```shell
    kubectl get nodes --show-labels
    ```
    Keluaran dari perintah tersebut akan berupa:

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```
1. Pilihkan salah satu dari Node yang ada dan tambahkan label pada Node tersebut.

    ```shell
    kubectl label nodes <nama-node-kamu> disktype=ssd
    ```
    dimana `<nama-node-kamu>` merupakan nama dari Node yang kamu pilih.

1. Keluaran dari Node yang kamu pilih dan sudah memiliki label `disktype=ssd`:

    ```shell
    kubectl get nodes --show-labels
    ```

    Keluaran dari perintah tersebut akan berupa:

    ```
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    Pada keluaran dari perintah di atas, kamu dapat melihat bahwa Node `worker0`
    memiliki label `disktype=ssd`.

## Menjadwalkan Pod menggunakan Afinitas Node

Konfigurasi ini menunjukkan sebuah Pod yang memiliki afinitas node `requiredDuringSchedulingIgnoredDuringExecution`, `disktype: ssd`.
Dengan kata lain, Pod hanya akan dijadwalkan hanya pada Node yang memiliki label `disktype=ssd`.

{{% codenew file="pods/pod-nginx-required-affinity.yaml" %}}

1. Terapkan konfigurasi berikut untuk membuat sebuah Pod yang akan dijadwalkan pada Node yang kamu pilih:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-required-affinity.yaml
    ```

1. Verifikasi apakah Pod yang kamu pilih sudah dijalankan pada Node yang kamu pilih:

    ```shell
    kubectl get pods --output=wide
    ```

    Keluaran dari perintah tersebut akan berupa:

    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## Jadwalkan Pod menggunakan Afinitas Node yang Dipilih

Konfigurasi ini memberikan deskripsi sebuah Pod yang memiliki afinitas Node `preferredDuringSchedulingIgnoredDuringExecution`,`disktype: ssd`.
Artinya Pod akan diutamakan dijalankan pada Node yang memiliki label `disktype=ssd`.

{{% codenew file="pods/pod-nginx-preferred-affinity.yaml" %}}

1. Terapkan konfigurasi berikut untuk membuat sebuah Pod yang akan dijadwalkan pada Node yang kamu pilih:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-preferred-affinity.yaml
    ```

1. Verifikasi apakah Pod yang kamu pilih sudah dijalankan pada Node yang kamu pilih:

    ```shell
    kubectl get pods --output=wide
    ```

    Keluaran dari perintah tersebut akan berupa:

    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```



## {{% heading "whatsnext" %}}

Pelajari lebih lanjut mengenai
[Afinitas Node](/id/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
