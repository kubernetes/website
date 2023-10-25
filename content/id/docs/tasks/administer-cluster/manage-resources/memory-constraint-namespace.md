---
title: Mengatur Batas Minimum dan Maksimum Memori pada sebuah Namespace
content_type: task
weight: 30
---


<!-- overview -->

Laman ini menunjukkan cara untuk mengatur nilai minimum dan maksimum memori yang digunakan oleh Container
yang berjalan pada sebuah Namespace. Kamu dapat menentukan nilai minimum dan maksimum memori pada objek
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core). Jika sebuah Pod tidak memenuhi batasan yang ditentukan oleh LimitRange,
maka Pod tersebut tidak dapat dibuat pada Namespace tersebut.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Tiap Node dalam klastermu harus memiliki setidaknya 1 GiB memori.




<!-- steps -->

## Membuat sebuah Namespace

Buat sebuah Namespace sehingga sumber daya yang kamu buat pada latihan ini
terisolasi dari komponen lain pada klastermu.

```shell
kubectl create namespace constraints-mem-example
```

## Membuat LimitRange dan Pod

Berikut berkas konfigurasi untuk sebuah LimitRange:

{{% codenew file="admin/resource/memory-constraints.yaml" %}}

Membuat LimitRange:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints.yaml --namespace=constraints-mem-example
```

Melihat informasi mendetail mengenai LimitRange:

```shell
kubectl get limitrange mem-min-max-demo-lr --namespace=constraints-mem-example --output=yaml
```

Keluaran yang dihasilkan menunjukkan batasan minimum dan maksimum dari memori seperti yang diharapkan. Tetapi
perhatikan hal berikut, meskipun kamu tidak menentukan nilai bawaan pada berkas konfigurasi untuk 
LimitRange, namun nilai tersebut akan dibuat secara otomatis.

```
  limits:
  - default:
      memory: 1Gi
    defaultRequest:
      memory: 1Gi
    max:
      memory: 1Gi
    min:
      memory: 500Mi
    type: Container
```

Mulai sekarang setiap Container yang dibuat pada Namespace constraints-mem-example, Kubernetes
akan menjalankan langkah-langkah berikut:

* Jika Container tersebut tidak menentukan permintaan dan limit memori, maka diberikan nilai permintaan 
dan limit memori bawaan pada Container.

* Memastikan Container memiliki permintaan memori yang lebih besar atau sama dengan 500 MiB.

* Memastikan Container memiliki limit memori yang lebih kecil atau kurang dari 1 GiB.

Berikut berkas konfigurasi Pod yang memiliki satu Container. Manifes Container
menentukan permintaan memori 600 MiB dan limit memori 800 MiB. Nilai tersebut memenuhi
batasan minimum dan maksimum memori yang ditentukan oleh LimitRange.

{{% codenew file="admin/resource/memory-constraints-pod.yaml" %}}

Membuat Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod.yaml --namespace=constraints-mem-example
```

Memastikan Container pada Pod sudah berjalan:

```shell
kubectl get pod constraints-mem-demo --namespace=constraints-mem-example
```

Melihat informasi mendetail tentang Pod:

```shell
kubectl get pod constraints-mem-demo --output=yaml --namespace=constraints-mem-example
```

Keluaran yang dihasilkan menunjukkan Container memiliki permintaan memori 600 MiB dan limit memori
800 MiB. Nilai tersebut memenuhi batasan yang ditentukan oleh LimitRange.

```yaml
resources:
  limits:
     memory: 800Mi
  requests:
    memory: 600Mi
```

Menghapus Podmu:

```shell
kubectl delete pod constraints-mem-demo --namespace=constraints-mem-example
```

## Mencoba membuat Pod yang melebihi batasan maksimum memori

Berikut berkas konfigurasi untuk sebuah Pod yang memiliki satu Container. Container tersebut menentukan
permintaan memori 800 MiB dan batas memori 1.5 GiB.

{{% codenew file="admin/resource/memory-constraints-pod-2.yaml" %}}

Mencoba membuat Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-2.yaml --namespace=constraints-mem-example
```

Keluaran yang dihasilkan menunjukkan Pod tidak dibuat, karena Container menentukan limit memori yang
terlalu besar:

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-2.yaml":
pods "constraints-mem-demo-2" is forbidden: maximum memory usage per Container is 1Gi, but limit is 1536Mi.
```

## Mencoba membuat Pod yang tidak memenuhi permintaan memori

Berikut berkas konfigurasi untuk sebuah Pod yang memiliki satu Container. Container tersebut menentukan
permintaan memori 100 MiB dan limit memori 800 MiB.

{{% codenew file="admin/resource/memory-constraints-pod-3.yaml" %}}

Mencoba membuat Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-3.yaml --namespace=constraints-mem-example
```

Keluaran yang dihasilkan menunjukkan Pod tidak dibuat, karena Container menentukan permintaan memori yang
terlalu kecil:

```
Error from server (Forbidden): error when creating "examples/admin/resource/memory-constraints-pod-3.yaml":
pods "constraints-mem-demo-3" is forbidden: minimum memory usage per Container is 500Mi, but request is 100Mi.
```

## Membuat Pod yang tidak menentukan permintaan ataupun limit memori



Berikut berkas konfigurasi untuk sebuah Pod yang memiliki satu Container. Container tersebut tidak menentukan
permintaan memori dan juga limit memori.

{{% codenew file="admin/resource/memory-constraints-pod-4.yaml" %}}

Mencoba membuat Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/resource/memory-constraints-pod-4.yaml --namespace=constraints-mem-example
```

Melihat informasi mendetail tentang Pod:

```
kubectl get pod constraints-mem-demo-4 --namespace=constraints-mem-example --output=yaml
```

Keluaran yang dihasilkan menunjukkan Container pada Pod memiliki permintaan memori 1 GiB dan limit memori 1 GiB.
Bagaimana Container mendapatkan nilai tersebut?

```
resources:
  limits:
    memory: 1Gi
  requests:
    memory: 1Gi
```

Karena Containermu tidak menentukan permintaan dan limit memori, Container tersebut diberikan
[permintaan dan limit memori bawaan](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
dari LimitRange.

Pada tahap ini, Containermu mungkin saja berjalan ataupun mungkin juga tidak berjalan. Ingat bahwa prasyarat
untuk tugas ini adalah Node harus memiliki setidaknya 1 GiB memori. Jika tiap Node hanya memiliki
1 GiB memori, maka tidak akan ada cukup memori untuk dialokasikan pada setiap Node untuk memenuhi permintaan 1 GiB memori. Jika ternyata kamu menggunakan Node dengan 2 GiB memori, maka kamu mungkin memiliki cukup ruang untuk memenuhi permintaan 1 GiB tersebut.

Menghapus Pod:

```
kubectl delete pod constraints-mem-demo-4 --namespace=constraints-mem-example
```

## Pelaksanaan batasan minimum dan maksimum memori

Batasan maksimum dan minimum memori yang yang ditetapkan pada sebuah Namespace oleh LimitRange dilaksanakan
hanya ketika Pod dibuat atau diperbarui. Jika kamu mengubah LimitRange, hal tersebut tidak akan memengaruhi
Pods yang telah dibuat sebelumnya.

## Motivasi untuk batasan minimum dan maksimum memori

Sebagai seorang administrator klaster, kamu mungkin ingin menetapkan pembatasan jumlah memori yang dapat digunakan oleh Pod.
Sebagai contoh:

* Tiap Node dalam sebuah klaster memiliki 2 GB memori. Kamu tidak ingin menerima Pod yang meminta
lebih dari 2 GB memori, karena tidak ada Node pada klater yang dapat memenuhi permintaan tersebut.

* Sebuah klaster digunakan bersama pada departemen produksi dan pengembangan.
Kamu ingin mengizinkan beban kerja (_workload_) pada produksi untuk menggunakan hingga 8 GB memori, tapi
kamu ingin beban kerja pada pengembangan cukup terbatas sampai dengan 512 MB saja. Kamu membuat Namespace terpisah
untuk produksi dan pengembangan, dan kamu menerapkan batasan memori pada tiap Namespace.

## Bersih-bersih

Menghapus Namespace:

```shell
kubectl delete namespace constraints-mem-example
```



## {{% heading "whatsnext" %}}


### Untuk administrator klaster

* [Mengatur Permintaan dan Limit Memori Bawaan untuk Sebuah Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Mengatur Permintaan dan Limit CPU Bawaan untuk Sebuah Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Mengatur Batas Minimum dan Maksimum CPU untuk Sebuah Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Mengatur Kuota Memori dan CPU untuk Sebuah Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Mengatur Kuota Pod untuk Sebuah Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Mengatur Kuota untuk Objek API](/docs/tasks/administer-cluster/quota-api-object/)

### Untuk pengembang aplikasi

* [Memberikan Sumber Daya Memori pada Container dan Pod](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Memberikan Sumber Daya CPU pada Container dan Pod](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Mengatur Kualitas Layanan Pod](/docs/tasks/configure-pod-container/quality-service-pod/)







