---
title: Garbage Collection
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

Peran dari _garbage collector_ Kubernetes adalah untuk menghapus objek tertentu yang sebelumnya mempunyai pemilik, tetapi tidak lagi mempunyai pemilik.

{{% /capture %}}

{{% capture body %}}

## Pemilik dan _dependent_

Beberapa objek Kubernetes adalah pemilik dari objek lainnya. Sebagai contoh, sebuah ReplicaSet adalah pemilik dari sekumpulan Pod. Objek-objek yang dimiliki disebut _dependent_ dari objek pemilik. Setiap objek _dependent_ memiliki sebuah kolom `metadata.ownerReferences` yang menunjuk ke objek pemilik.

Terkadang, Kubernetes menentukan nilai dari `ownerReference` secara otomatis. Sebagai contoh, ketika kamu membuat sebuah ReplicaSet, Kubernetes secara otomatis akan menentukan tiap kolom `ownerReference` dari tiap Pod di dalam ReplicaSet. Pada versi 1.8, Kubernetes secara otomatis menentukan nilai dari `ownerReference` untuk objek yang diciptakan atau diadopsi oleh ReplicationController, ReplicaSet, StatefulSet, DaemonSet, Deployment, Job dan CronJob.

Kamu juga bisa menspesifikasikan hubungan antara pemilik dan _dependent_ dengan cara menentukan kolom `ownerReference` secara manual.

Berikut adalah berkas untuk sebuah ReplicaSet yang memiliki tiga Pod:

{{< codenew file="controllers/replicaset.yaml" >}}

Jika anda membuat ReplicaSet tersebut dan kemudian melihat metadata Pod, kamu akan melihat kolom OwnerReferences:

```shell
kubectl apply -f https://k8s.io/examples/controllers/replicaset.yaml
kubectl get pods --output=yaml
```

Keluaran menunjukkan bahwa pemilik Pod adalah sebuah ReplicaSet bernama `my-repset`

```yaml
apiVersion: v1
kind: Pod
metadata:
  ...
  ownerReferences:
  - apiVersion: apps/v1
    controller: true
    blockOwnerDeletion: true
    kind: ReplicaSet
    name: my-repset
    uid: d9607e19-f88f-11e6-a518-42010a800195
  ...
```
{{< note >}}
Referensi pemilik lintas _namespace_ tidak diperbolehkan oleh desain. Artinya:
1) _Namespace-scoped dependent_ hanya bisa menspesifikasikan pemilik jika berada di _namespace_ yang sama, dan pemilik bersifat _cluster-scoped_. 
2) _Cluster-scoped dependent_ hanya bisa menspesifikasikan pemilik bersifat _cluster-scoped_, tetapi tidak berlaku untuk pemilik bersifat _namespace-scoped_.
{{< /note >}}

## Mengontrol bagaimana _garbage collector_ menghapus _dependent_

Ketika kamu menghapus sebuah objek, kamu bisa menspesifikasi apakah _dependent_ objek tersebut juga dihapus secara otomatis. Menghapus _dependent_ secara otomatis disebut _cascading deletion_. _Cascading deletion_ memiliki dua mode: _background_ dan _foreground_

# Foreground cascading deletion
Pada *foreground cascading deletion*, pertama objek utama akan memasuki keadaan "_deletion in progress_". Pada saat keadaan "_deletion in progress_", kondisi-kondisi berikut bernilai benar:

 * Objek masih terlihat via REST API
 * `deletionTimestamp` objek telah ditentukan
 * `metadata.finalizers` objek memiliki nilai `foregroundDeletion`.

 Ketika dalam keadaan "_deletion in progress_", _garbage collector_ menghapus _dependent_ dari objek. Ketika _garbage collector_ telah menghapus semua "_blocking_" _dependent_ (objek dengan `ownerReference.blockOwnerDeleteion=true`), _garbage collector_ menghapus objek pemilik.

 Jika kolom `ownerReferences` sebuah objek ditentukan oleh sebuah _controller_ (seperti Deployment atau Replicaset), `blockOwnerDeletion` akan ditentukan secara otomatis dan kamu tidak perlu memodifikasi kolom ini secara manual.

 # Background cascading deletion
 Pada *background cascading deletion*, Kubernetes segera menghapus objek pemilik dan _garbage collector_ kemudian menghapus _dependent_ pada _background_.

 # Mengatur kebijakan _cascading deletion_

 Untuk mengatur kebijakan _cascading deletion_, tambahkan kolom `propagationPolicy` pada argumen `deleteOptions` ketika menghapus sebuah Object. Nilai yang dapat digunakan adalah "Orphan", "Foreground", atau "Background".

 Sebelum Kubernetes 1.9, kebijakan default _garbage collection_ untuk banyak _resource controller_ adalah **orphan**. Ini meliputi ReplicationController, ReplicaSet, StatefulSet, DaemonSet, dan Deployment. Untuk jenis pada kelompok versi `extensions/v1beta1`, `apps/v1beta1`, dan `apps/v1beta2`, kecuali kamu menspesifikasikan dengan cara lain, objek _dependent_ adalah _orphan_ secara default. Pada Kubernetes 1.9, untuk semua jenis pada kelompok versi `apps/v1`, objek _dependent_ dihapus secara default.

 Berikut sebuah contoh yang menghapus _dependent_ di _background_:
 
```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
-d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
-H "Content-Type: application/json"
```

Berikut adalah sebuah contoh yang mengapus _dependent_ di _foreground_:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
-d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
-H "Content-Type: application/json"
```

Berikut adalah contoh _dependent orphan_:

```shell
kubectl proxy --port=8080
curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/replicasets/my-repset \
-d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
-H "Content-Type: application/json"
```

kubectl juga mendukung _cascading deletion_. Untuk menghapus _dependent_ secara otomatis dengan menggunakan kubectl, Ubah nilai `--cascade` menjadi _true_. Untuk _orphan dependent_, ubah nilai `--cascade` menjadi _false_. Nilai default untuk `--cascade` adalah _true_.

Berikut adalah contoh yang membuat _dependent_ ReplicaSet menjadi _orphan_.

```shell
kubectl delete replicaset my-repset --cascade=false
```

# Catatan tambahan untuk Deployment

Sebelum versi 1.7, ketika menggunakan _cascading delete_ dengan Deployment, kamu *harus* menggunakan `propagationPolicy: Foreground` untuk menghapus tidak hanya ReplicaSet yang telah diciptakan, tetapi juga Pod yang mereka miliki. Jika tipe _propagationPolicy_ tidak digunakan, hanya ReplicaSet yag akan dihapus, dan Pod akan menjadi _orphan_. Lihat [kubeadm/#149](https://github.com/kubernetes/kubeadm/issues/149#issuecomment-284766613) untuk informasi lebih lanjut.

## Isu yang diketahui

Ditemukan pada [#26120](https://github.com/kubernetes/kubernetes/issues/26120)

{{% /capture %}}

{{% capture whatsnext %}}

[Dokumen Desain 1](https://git.k8s.io/community/contributors/design-proposals/api-machinery/garbage-collection.md)

[Dokumen Desain 2](https://git.k8s.io/community/contributors/design-proposals/api-machinery/synchronous-garbage-collection.md)

{{% /capture %}}