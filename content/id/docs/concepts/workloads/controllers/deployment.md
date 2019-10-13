---
reviewers:
- janetkuo
title: Deployments
feature:
  title: Automated rollouts dan rollbacks
  description: >
    Kubernetes merilis perubahan secara progresif pada aplikasimu atau konfigurasinya sambil memonitor kesehatan aplikasi untuk menjamin bahwa semua instances tidak mati bersamaan. Jika sesuatu yang buruk terjadi, Kubernetes akan melakukan rollback pada perubahanmu. Take advantage of a growing ecosystem of deployment solutions.

content_template: templates/concept
weight: 30
---

{{% capture overview %}}

A _Deployment_ menyediakan pembaruan deklaratif [Pods](/docs/id/concepts/workloads/pods/pod/) dan
[ReplicaSets](/docs/id/concepts/workloads/controllers/replicaset/).

Kamu mendeskripsikan sebuah state yang diinginkan dalam Deployment, kemudian Deployment {{< glossary_tooltip term_id="controller" >}} mengubah state sekarang menjadi seperti pada deskripsi secara bertahap. Kamu dapat mendefinisikan Deployment untuk membuat ReplicaSets baru atau untuk menghapus Deployment yang sudah ada dan mengadopsi semua resourcenya untuk Deployment baru.

{{< note >}}
Jangan mengganti ReplicaSets milik Deployment. Consider untuk membuat issue pada repositori utama Kubernetes jika kasusmu tidak dicover semua solusi di bawah.
{{< /note >}}

{{% /capture %}}


{{% capture body %}}

## Penggunaan

Berikut adalah penggunaan yang umum pada Deployment:

* [Membuat Deployment untuk merilis ReplicaSet](#creating-a-deployment). ReplicaSet membuat Pod di belakang layar. Cek status rilis untuk tahu proses rilis sukses atau tidak.
* [Mendeklarasikan state baru dari Pods](#updating-a-deployment) dengan membarui PodTemplateSpec milik Deployment. ReplicaSet baru akan dibuat dan Deployment manages moving the Pods from the old ReplicaSet to the new one at a controlled rate. Each new ReplicaSet updates the revision of the Deployment.
* [Mengembalikan ke revisi Deployment sebelumnya](#rolling-back-a-deployment) jika state Deployment sekarang tidak stabil. Each rollback updates the revision of the Deployment.
* [Scale up the Deployment to facilitate more load](#scaling-a-deployment).
* [Menjeda Deployment](#pausing-and-resuming-a-deployment) untuk menerapkan perbaikan pada PodTemplateSpec-nya, lalu melanjutkan untuk memulai rilis baru.
* [Memakai status Deployment](#deployment-status) sebagai indikator ketika rilis tersendat.
* [Membersihkan ReplicaSet lama](#clean-up-policy) yang sudah tidak terpakai.

## Membuat Deployment

Berikut adalah contoh Deployment. Dia membuat ReplicaSet untuk membangkitkan tiga Pod `nginx`:

{{< codenew file="controllers/nginx-deployment.yaml" >}}

Dalam contoh ini:

* Deployment baru akan dibuat dengan nama `nginx-deployment`, tertulis pada kolom `.metadata.name`.
* Deployment membuat tiga Pod yang direplikasi, ditandai dengan kolom `replicas`.
* Kolom `selector` mendefinisikan bagaimana Deployment menemukan Pod yang diatur.
  Dalam kasus ini, kamu hanya perlu memilih sebuah label yang didefinisikan pada templat Pod (`app: nginx`).
  Namun, aturan pemilihan yang lebih canggih mungkin dilakukan asal templat Pod-nya memenuhi aturan.
    {{< note >}}
    Kolom `matchLabels` berbentuk pasangan {key,value}. Sebuah {key,value} dalam _map_ `matchLabels` ekuivalen dengan 
    elemen pada `matchExpressions`, yang mana kolom key adalah "key", operator adalah "In", dan larik values hanya berisi "value".
    Semua prasyarat dari `matchLabels` maupun `matchExpressions` harus dipenuhi agar dapat dicocokkan.
    {{< /note >}}

* Kolom `template` berisi sub kolom berikut:
  * Pod dilabeli `app: nginx` dengan kolom `labels`.
  * Spesifikasi templat Pod atau kolom `.template.spec` menandakan bahwa Pod mennjalankan satu kontainer `nginx`, 
  yang menjalankan image `nginx` [Docker Hub](https://hub.docker.com/) dengan versi 1.7.9.
  * Membuat satu kontainer bernama `nginx` sesuai kolom `name`.

  Ikuti langkah-langkah berikut untuk membuat Deployment di atas:

  Sebelum memulai, pastikan kluster Kubernetes sedang menyala dan bekerja.

  1. Buat Deployment dengan menjalankan perintah berikut:

      {{< note >}}
      Kamu dapat menambahkan argument `--record` untuk menulis perintah yang dijalankan pada anotasi sumber daya `kubernetes.io/change-cause`. Ini berguna untuk pemeriksaan di masa depan.
      Contohnya yaitu untuk melihat perintah yang dijalankan pada tiap revisi Deployment.
      {{< /note >}}

    ```shell
    kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
    ```

  2. Jalankan `kubectl get deployments` untuk mengecek apakah Deployment telah dibuat. Jika Deployment masih sedang pembuatan, keluaran akan tampil seperti berikut:
    ```shell
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3         0         0            0           1s
    ```
    Ketika kamu memeriksa Deployments pada klustermu, kolom berikut akan tampil:

      * `NAME` menampilkan daftar nama Deployment pada kluster.
      * `DESIRED` menampilkan jumlah replika aplikasi yang diinginkan sesuai yang didefinisikan saat pembuatan Deployment. Ini adalah _state_ yang diinginkan.
      * `CURRENT` menampilkan berapa jumlah replika yang sedang berjalan.
      * `UP-TO-DATE` menampilkan jumlah replika yang diperbarui agar sesuai state yang diinginkan.
      * `AVAILABLE` menampilkan jumlah replika aplikasi yang dapat diakses pengguna.
      * `AGE` menampilkan lama waktu aplikasi telah berjalan.

    Perhatikan bahwa jumlah replika yang diinginkan adalah tiga sesuai kolom `.spec.replicas`.

  3. Untuk melihat status rilis Deployment, jalankan `kubectl rollout status deployment.v1.apps/nginx-deployment`. Keluaran akan tampil seperti berikut:
    ```shell
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    deployment.apps/nginx-deployment successfully rolled out
    ```

  4. Jalankan `kubectl get deployments` lagi beberapa saat kemudian. Keluaran akan tampil seperti berikut:
    ```shell
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3         3         3            3           18s
    ```
    Perhatikan bahwa Deployment telah membuat ketiga replika dan semua replika sudah merupakan yang terbaru (mereka mengandung pembaruan terakhir templat Pod) dan dapat diakses.

  5. Untuk melihat ReplicaSet (`rs`) yang dibuat Deployment, jalankan `kubectl get rs`. Keluaran akan tampil seperti berikut:
    ```shell
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-75675f5897   3         3         3       18s
    ```
    Perhatikan bahwa nama ReplicaSet selalu dalam format `[NAMA-DEPLOYMENT]-[KATA-ACAK]`. Kata acak dibangkitkan secara acak dan menggunakan pod-template-hash sebagai benih.

  6. Untuk melihat label yang dibangkitkan secara otomatis untuk tiap Pod, jalankan `kubectl get pods --show-labels`. Perintah akan menghasilkan keluaran berikut:
    ```shell
    NAME                                READY     STATUS    RESTARTS   AGE       LABELS
    nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
    nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
    nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
    ```
    ReplicaSet yang dibuat menjamin bahwa ada tiga Pod `nginx`.

  {{< note >}}
  Kamu harus memasukkan selektor dan label templat Pod yang benar pada Deployment (dalam kasus ini, `app: nginx`). 
  Jangan membuat label atau selektor yang beririsan dengan controller lain (termasuk Deployment dan StatefulSet lainnya). Kubernetes tidak akan mencegah adanya label yang beririsan. 
  Namun, jika beberapa controller memiliki selektor yang beririsan, controller itu mungkin akan konflik dan berjalan dengan tidak semestinya.
  {{< /note >}}

### Pod-template-hash label

{{< note >}}
Jangan ubah label ini.
{{< /note >}}

Label `pod-template-hash` ditambahkan oleh Deployment controller pada tiap ReplicaSet yang dibuat atau diadopsi Deployment.

Label ini menjamin anak-anak ReplicaSet milik Deployment tidak tumpang tindih. Dia dibangkitkan dengan melakukan hash pada `PodTemplate` milik ReplicaSet dan memakainya sebagai label untuk ditambahkan ke selektor ReplicaSet, label templat Pod, dan Pod apapun yang ReplicaSet miliki.

## Membarui Deployment

{{< note >}}
Rilis Deployment hanya dapat dipicu oleh perubahan templat Pod Deployment (yaitu, `.spec.template`), contohnya perubahan kolom label atau image container. Lainnya, seperti replika, do not trigger a rollout.
{{< /note >}}

Follow the steps given below to update your Deployment:

1. Ganti Pod nginx menjadi image `nginx:1.9.1` dari image `nginx:1.7.9`.

    ```shell
    kubectl --record deployment.apps/nginx-deployment set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1
    ```
    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment image updated
    ```

    Alternatif lainnya, kamu dapat `edit` Deployment dan mengganti `.spec.template.spec.containers[0].image` dari `nginx:1.7.9` ke `nginx:1.9.1`:

    ```shell
    kubectl edit deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment edited
    ```

2. Untuk melihat status rilis, jalankan:

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    ```
    atau
    ```
    deployment.apps/nginx-deployment successfully rolled out
    ```

Untuk menampilkan detail lain dari Deployment yang terbaru:

* Setelah rilis sukses, kamu dapat melihat Deployment dengan menjalankan `kubectl get deployments`.
    Keluaran akan tampil seperti berikut:
    ```
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3         3         3            3           36s
    ```

* Jalankan `kubectl get rs` to see that the Deployment updated the Pods dengan membuat ReplicaSet baru dan 
menggandakannya menjadi 3 replika, sembari menghapus ReplicaSet menjadi 0 replika.

    ```shell
    kubectl get rs
    ```

    Keluaran akan tampil seperti berikut:
    ```
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-1564180365   3         3         3       6s
    nginx-deployment-2035384211   0         0         0       36s
    ```

* Menjalankan `get pods` sekarang hanya akan menampilkan Pod baru:

    ```shell
    kubectl get pods
    ```

    Keluaran akan tampil seperti berikut:
    ```
    NAME                                READY     STATUS    RESTARTS   AGE
    nginx-deployment-1564180365-khku8   1/1       Running   0          14s
    nginx-deployment-1564180365-nacti   1/1       Running   0          14s
    nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
    ```

    Selanjutnya ketika ingin membarui Pod, kamu hanya perlu mengganti templat Pod Deployment lagi.

    Deployment memastikan hanya ada beberapa Pod yang mati saat pembaruan berlangsung. Umumnya,
    dia memastikan paling sedikit ada 75% jumlah Pod yang diinginkan menyala (25% maksimal tidak dapat diakses).

    Deployment juga memastikan hanya ada beberapa Pod yang dibuat melebihi jumlah Pod yang diinginkan.
    Umumnya, dia memastikan paling banyak ada 125% jumlah Pod yang diinginkan menyala (25% tambahan maksimal).

    Misalnya, jika kamu lihat Deployment diatas lebih jauh, kamu akan melihat bahwa pertama-tama dia membuat Pod baru,
    kemudian menghapus beberapa Pod lama, dan membuat yang baru. Dia tidak akan menghapus Pod lama sampai ada cukup 
    Pod baru menyala, dan pula tidak membuat Pod baru sampai ada cukup Pod lama telah mati.
    Dia memastikan paling sedikit 2 Pod menyala dan paling banyak total 4 Pod menyala.

* Melihat detil Deployment:
  ```shell
  kubectl describe deployments
  ```
  Keluaran akan tampil seperti berikut:  
  ```
  Name:                   nginx-deployment
  Namespace:              default
  CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
  Labels:                 app=nginx
  Annotations:            deployment.kubernetes.io/revision=2
  Selector:               app=nginx
  Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
  StrategyType:           RollingUpdate
  MinReadySeconds:        0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
     Containers:
      nginx:
        Image:        nginx:1.9.1
        Port:         80/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
    Events:
      Type    Reason             Age   From                   Message
      ----    ------             ----  ----                   -------
      Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
      Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
      Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
    ```
    Disini bisa dilihat ketika pertama Deployment dibuat, dia membuat ReplicaSet (nginx-deployment-2035384211)
    dan langsung menggandakannya menjadi 3 replika. Saat Deployment diperbarui, dia membuat ReplicaSet baru
    (nginx-deployment-1564180365) dan menambah 1 replika kemudian mengecilkan ReplicaSet lama menjadi 2, 
    sehingga paling sedikit 2 Pod menyala dan paling banyak 4 Pod dibuat setiap saat. Dia kemudian lanjut menaik-turunkan
    ReplicaSet baru dan ReplicaSet lama, dengan strategi pembaruan rolling yang sama. 
    Terakhir, kamu akan dapat 3 replika di ReplicaSet baru telah menyala, dan ReplicaSet lama akan hilang (berisi 0).

### Rollover (aka multiple updates in-flight)

Setiap kali Deployment baru is observed by the Deployment controller, ReplicaSet dibuat untuk membangkitkan Pod sesuai keinginan. 
Jika Deployment diperbarui, the existing ReplicaSet that controls Pods whose labels
match `.spec.selector` but whose template does not match `.spec.template` are scaled down. Eventually, the new
ReplicaSet is scaled to `.spec.replicas` dan all old ReplicaSets is scaled to 0.

If you update a Deployment while an existing rollout is in progress, the Deployment creates a new ReplicaSet
as per the update dan start scaling that up, dan rolls over the ReplicaSet that it was scaling up previously
 -- it will add it to its list of old ReplicaSets dan start scaling it down.

For example, suppose you create a Deployment to create 5 replicas of `nginx:1.7.9`,
but then update the Deployment to create 5 replicas of `nginx:1.9.1`, when only 3
replicas of `nginx:1.7.9` had been created. In that case, the Deployment immediately starts
killing the 3 `nginx:1.7.9` Pods that it had created, dan starts creating
`nginx:1.9.1` Pods. It does not wait for the 5 replicas of `nginx:1.7.9` to be created
before changing course.

### Label selector updates

It is generally discouraged to make label selector updates dan it is suggested to plan your selectors up front.
In any case, if you need to perform a label selector update, exercise great caution dan make sure you have grasped
all of the implications.

{{< note >}}
In API version `apps/v1`, a Deployment's label selector is immutable after it gets created.
{{< /note >}}

* Selector additions require the Pod template labels in the Deployment spec to be updated with the new label too,
otherwise a validation error is returned. This change is a non-overlapping one, meaning that the new selector does
not select ReplicaSets dan Pods created with the old selector, resulting in orphaning all old ReplicaSets and
creating a new ReplicaSet.
* Selector updates perubahan the existing value in a selector key -- result in the same behavior as additions.
* Selector removals removes an existing key from the Deployment selector -- do not require any perubahan in the
Pod template labels. Existing ReplicaSets are not orphaned, dan a new ReplicaSet is not created, but note that the
removed label still exists in any existing Pods dan ReplicaSets.

## Rolling Back a Deployment

Sometimes, you may want to rollback a Deployment; for example, when the Deployment is not stable, such as crash looping.
Umumnya, all of the Deployment's rollout history is kept in the system so that you can rollback anytime you want
(you can change that by modifying revision history limit).

{{< note >}}
A Deployment's revision is created when a Deployment's rollout is triggered. This means that the
new revision is created if dan only if the Deployment's Pod template (`.spec.template`) is changed,
for example if you update the labels or container images of the template. Other updates, such as scaling the Deployment,
do not create a Deployment revision, so that you can facilitate simultaneous manual- or auto-scaling.
This means that when you roll back to an earlier revision, only the Deployment's Pod template part is
rolled back.
{{< /note >}}

* Suppose that you made a typo while updating the Deployment, by putting the image name as `nginx:1.91` instead of `nginx:1.9.1`:

    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment image updated
    ```

* The rollout gets stuck. You can verify it by checking the rollout status:

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
    ```

* Press Ctrl-C to stop the above rollout status watch. For more information on stuck rollouts,
[read more here](#deployment-status).

* You see that the number of old replicas (`nginx-deployment-1564180365` dan `nginx-deployment-2035384211`) is 2, dan new replicas (nginx-deployment-3066724191) is 1.

    ```shell
    kubectl get rs
    ```

    Keluaran akan tampil seperti berikut:
    ```
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-1564180365   3         3         3       25s
    nginx-deployment-2035384211   0         0         0       36s
    nginx-deployment-3066724191   1         1         0       6s
    ```

* Looking at the Pods created, you see that 1 Pod created by new ReplicaSet is stuck in an image pull loop.

    ```shell
    kubectl get pods
    ```

    Keluaran akan tampil seperti berikut:
    ```
    NAME                                READY     STATUS             RESTARTS   AGE
    nginx-deployment-1564180365-70iae   1/1       Running            0          25s
    nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
    nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
    nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
    ```

    {{< note >}}
    The Deployment controller stops the bad rollout automatically, dan stops scaling up the new
    ReplicaSet. This depends on the rollingUpdate parameters (`maxUnavailable` specifically) that you have specified.
    Kubernetes Umumnya sets the value to 25%.
    {{< /note >}}

* Get the description of the Deployment:  
    ```shell
    kubectl describe deployment
    ```

    Keluaran akan tampil seperti berikut:  
    ```
    Name:           nginx-deployment
    Namespace:      default
    CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
    Labels:         app=nginx
    Selector:       app=nginx
    Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
    StrategyType:       RollingUpdate
    MinReadySeconds:    0
    RollingUpdateStrategy:  25% max unavailable, 25% max surge
    Pod Template:
      Labels:  app=nginx
      Containers:
       nginx:
        Image:        nginx:1.91
        Port:         80/TCP
        Host Port:    0/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    ReplicaSetUpdated
    OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
    NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
    Events:
      FirstSeen LastSeen    Count   From                    SubobjectPath   Type        Reason              Message
      --------- --------    -----   ----                    -------------   --------    ------              -------
      1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
      22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
      22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
      22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
      21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
      21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
      13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
      13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
    ```

  To fix this, you need to rollback to a previous revision of Deployment that is stable.

### Checking Rollout History of a Deployment

Follow the steps given below to check the rollout history:

1. First, check the revisions of this Deployment:  
    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment
    ```
    Keluaran akan tampil seperti berikut:  
    ```
    deployments "nginx-deployment"
    REVISION    CHANGE-CAUSE
    1           kubectl apply --filename=https://k8s.io/examples/controllers/nginx-deployment.yaml --record=true
    2           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
    3           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
    ```

    `CHANGE-CAUSE` is copied from the Deployment annotation `kubernetes.io/change-cause` to its revisions upon creation. You can specify the`CHANGE-CAUSE` message by:

    * Annotating the Deployment with `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image updated to 1.9.1"`
    * Append the `--record` flag to save the `kubectl` perintah that is making perubahan to the resource.
    * Manually editing the manifest of the resource.

2. To see the details of each revision, run:
    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment --revision=2
    ```

    Keluaran akan tampil seperti berikut:  
    ```
    deployments "nginx-deployment" revision 2
      Labels:       app=nginx
              pod-template-hash=1159050644
      Annotations:  kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
      Containers:
       nginx:
        Image:      nginx:1.9.1
        Port:       80/TCP
         QoS Tier:
            cpu:      BestEffort
            memory:   BestEffort
        Environment Variables:      <none>
      No volumes.
    ```

### Rolling Back to a Previous Revision
Follow the steps given below to rollback the Deployment from the current version to the previous version, which is version 2.

1. Now you've decided to undo the current rollout dan rollback to the previous revision:
    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:  
    ```
    deployment.apps/nginx-deployment
    ```
    Alternatively, you can rollback to a specific revision by specifying it with `--to-revision`:

    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2
    ```

    Keluaran akan tampil seperti berikut:  
    ```
    deployment.apps/nginx-deployment
    ```

    For more details about rollout related perintahs, read [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-perintahs#rollout).

    The Deployment is now rolled back to a previous stable revision. As you can see, a `DeploymentRollback` event
    for rolling back to revision 2 is generated from Deployment controller.

2. Check if the rollback was successful dan the Deployment is running as expected, run:
    ```shell
    kubectl get deployment nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:  
    ```
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3         3         3            3           30m
    ```
3. Get the description of the Deployment:
    ```shell
    kubectl describe deployment nginx-deployment
    ```
    Keluaran akan tampil seperti berikut:  
    ```
    Name:                   nginx-deployment
    Namespace:              default
    CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
    Labels:                 app=nginx
    Annotations:            deployment.kubernetes.io/revision=4
                            kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
    Selector:               app=nginx
    Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
    StrategyType:           RollingUpdate
    MinReadySeconds:        0
    RollingUpdateStrategy:  25% max unavailable, 25% max surge
    Pod Template:
      Labels:  app=nginx
      Containers:
       nginx:
        Image:        nginx:1.9.1
        Port:         80/TCP
        Host Port:    0/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
    Events:
      Type    Reason              Age   From                   Message
      ----    ------              ----  ----                   -------
      Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
      Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
      Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
      Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
    ```

## Scaling a Deployment

You can scale a Deployment by using the following perintah:

```shell
kubectl scale deployment.v1.apps/nginx-deployment --replicas=10
```
Keluaran akan tampil seperti berikut:
```
deployment.apps/nginx-deployment scaled
```

Assuming [horizontal Pod autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) is enabled
in your cluster, you can setup an autoscaler for your Deployment dan choose the minimum dan maximum number of
Pods you want to run based on the CPU utilization of your existing Pods.

```shell
kubectl autoscale deployment.v1.apps/nginx-deployment --min=10 --max=15 --cpu-percent=80
```
Keluaran akan tampil seperti berikut:
```
deployment.apps/nginx-deployment scaled
```

### Proportional scaling

RollingUpdate Deployments support running multiple versions of an application at the same time. When you
or an autoscaler scales a RollingUpdate Deployment that is in the middle of a rollout (either in progress
or paused), the Deployment controller balances the additional replicas in the existing active
ReplicaSets (ReplicaSets with Pods) in order to mitigate risk. This is called *proportional scaling*.

For example, you are running a Deployment with 10 replicas, [maxSurge](#max-surge)=3, dan [maxUnavailable](#max-unavailable)=2.

* Ensure that the 10 replicas in your Deployment are running.
  ```shell
  kubectl get deploy
  ```
  Keluaran akan tampil seperti berikut:

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* You update to a new image which happens to be unresolvable from inside the cluster.
    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:sometag
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment image updated
    ```

* The image update starts a new rollout with ReplicaSet nginx-deployment-1989198191, but it's blocked due to the
`maxUnavailable` requirement that you mentioned above. Check out the rollout status:
    ```shell
    kubectl get rs
    ```
      Keluaran akan tampil seperti berikut:
    ```
    NAME                          DESIRED   CURRENT   READY     AGE
    nginx-deployment-1989198191   5         5         0         9s
    nginx-deployment-618515232    8         8         8         1m
    ```

* Then a new scaling request for the Deployment comes along. The autoscaler increments the Deployment replicas
to 15. The Deployment controller needs to decide where to add these new 5 replicas. If you weren't using
proportional scaling, all 5 of them would be added in the new ReplicaSet. With proportional scaling, you
spread the additional replicas across all ReplicaSets. Bigger proportions go to the ReplicaSets with the
most replicas dan lower proportions go to ReplicaSets with less replicas. Any leftovers are added to the
ReplicaSet with the most replicas. ReplicaSets with zero replicas are not scaled up.

In our example above, 3 replicas are added to the old ReplicaSet dan 2 replicas are added to the
new ReplicaSet. The rollout process should eventually move all replicas to the new ReplicaSet, assuming
the new replicas become healthy. To confirm this, run:  

```shell
kubectl get deploy
```

Keluaran akan tampil seperti berikut: 
```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```
The rollout status confirms how the replicas were added to each ReplicaSet.
```shell
kubectl get rs
```

Keluaran akan tampil seperti berikut:
```
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

## Menjeda dan Melanjutkan Deployment

Kamu dapat menjeda Deployment sebelum memicu satu atau lebih pembaruan kemudian meneruskannya. 
Hal ini memungkinkanmu menerapkan beberapa perbaikan selama selang jeda tanpa melakukan rilis yang tidak perlu.

* Sebagai contoh, Deployment yang baru dibuat:
  Lihat detil Deployment:
  ```shell
  kubectl get deploy
  ```
  Keluaran akan tampil seperti berikut:
  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```
  Lihat status rilis:
  ```shell
  kubectl get rs
  ```
  Keluaran akan tampil seperti berikut:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

* Jeda dengan menjalankan perintah berikut:
    ```shell
    kubectl rollout pause deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment paused
    ```

* Lalu ganti kolom image Deployment:
    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment image updated
    ```

* Perhatikan tidak ada rilis baru yang muncul:
    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployments "nginx"
    REVISION  CHANGE-CAUSE
    1   <none>
    ```
* Lihat status rilis untuk memastikan Deployment berhasil diperbarui:
    ```shell
    kubectl get rs
    ```

    Keluaran akan tampil seperti berikut:
    ```
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   3         3         3         2m
    ```

* Kamu bisa membuat pembaruan sebanyak yang kamu mau. Contohnya pembaruan sumber daya yang akan dipakai:
    ```shell
    kubectl set resources deployment.v1.apps/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment resource requirements updated
    ```

    The state awal Deployment sebelum pausing it will continue its function, but new updates to
    the Deployment will not have any effect as long as the Deployment is paused.

* Eventually, resume the Deployment dan observe a new ReplicaSet coming up with all the new updates:
    ```shell
    kubectl rollout resume deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment resumed
    ```
* Perhatikan status rilis sampai selesai.
    ```shell
    kubectl get rs -w
    ```

    Keluaran akan tampil seperti berikut:
    ```
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   2         2         2         2m
    nginx-3926361531   2         2         0         6s
    nginx-3926361531   2         2         1         18s
    nginx-2142116321   1         2         2         2m
    nginx-2142116321   1         2         2         2m
    nginx-3926361531   3         2         1         18s
    nginx-3926361531   3         2         1         18s
    nginx-2142116321   1         1         1         2m
    nginx-3926361531   3         3         1         18s
    nginx-3926361531   3         3         2         19s
    nginx-2142116321   0         1         1         2m
    nginx-2142116321   0         1         1         2m
    nginx-2142116321   0         0         0         2m
    nginx-3926361531   3         3         3         20s
    ```
* Lihat status rilis terakhir:
    ```shell
    kubectl get rs
    ```

    Keluaran akan tampil seperti berikut:
    ```
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   0         0         0         2m
    nginx-3926361531   3         3         3         28s
    ```
{{< note >}}
Kamu tidak bisa membalikkan Deployment yang terjeda sampai dia diteruskan.
{{< /note >}}

## Status Deployment

Deployment melalui berbagai state dalam daur hidupnya. Dia dapat [berlangsung](#deployment-berlangsung) selagi merilis ReplicaSet baru, bisa juga [selesai](#deployment-selesai), 
atau juga [gagal](#deployment-gag).

### Deployment Berlangsung

Kubernetes menandai Deployment sebagai _progressing_ saat salah satu tugas di bawah dikerjakan:

* Deployment membuat ReplicaSet baru.
* Deployment menaikkan kapasitas ReplicaSet terbaru.
* Deployment menurunkan kapasitas ReplicaSet yang lebih lama.
* Pod baru menjadi siap atau dapat diakses (siap selama setidaknya [MinReadySeconds](#min-ready-seconds)).

Kamu dapat mengawasi perkembangan Deployment dengan `kubectl rollout status`.

### Deployment Selesai

Kubernetes menandai Deployment sebagai _complete_ saat memiliki karakteristik berikut:

* Semua replika terkait Deployment telah diperbarui ke versi terbaru yang dispecify, artinya semua pembaruan yang kamu inginkan telah selesai.
* Semua replika terkait Deployment dapat diakses.
* Tidak ada replika lama untuk Deployment yang berjalan.

Kamu dapat mengecek apakah Deployment telah selesai dengan `kubectl rollout status`. 
Jika rilis selesai, `kubectl rollout status` akan mengembalikan nilai balik nol.

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
Keluaran akan tampil seperti berikut:
```
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment.apps/nginx-deployment successfully rolled out
$ echo $?
0
```

### Deployment Gagal

Your Deployment may get stuck trying to deploy its newest ReplicaSet without ever completing. This can occur
due to some of the following factors:

* Insufficient quota
* Readiness probe failures
* Image pull errors
* Insufficient permissions
* Limit ranges
* Application runtime misconfiguration

One way you can detect this condition is to specify a deadline parameter in your Deployment spec:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` denotes the
number of seconds the Deployment controller waits before indicating (in the Deployment status) that the
Deployment progress has stalled.

The following `kubectl` perintah sets the spec with `progressDeadlineSeconds` to make the controller report
lack of progress for a Deployment after 10 minutes:

```shell
kubectl patch deployment.v1.apps/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```
Keluaran akan tampil seperti berikut:
```
deployment.apps/nginx-deployment patched
```
Once the deadline has been exceeded, the Deployment controller adds a DeploymentCondition with the following
attributes to the Deployment's `.status.conditions`:

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

See the [Kubernetes API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) for more information on status conditions.

{{< note >}}
Kubernetes takes no action on a stalled Deployment other than to report a status condition with
`Reason=ProgressDeadlineExceeded`. Higher level orchestrators can take advantage of it dan act accordingly, for
example, rollback the Deployment to its previous version.
{{< /note >}}

{{< note >}}
If you pause a Deployment, Kubernetes does not check progress against your specified deadline. You can
safely pause a Deployment in the middle of a rollout dan resume without triggering the condition for exceeding the
deadline.
{{< /note >}}

You may experience transient errors with your Deployments, either due to a low timeout that you have set or
due to any other kind of error that can be treated as transient. For example, let's suppose you have
insufficient quota. If you describe the Deployment you will notice the following section:

```shell
kubectl describe deployment nginx-deployment
```
Keluaran akan tampil seperti berikut:
```
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

If you run `kubectl get deployment nginx-deployment -o yaml`, the Deployment status is similar to this:

```
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

Eventually, once the Deployment progress deadline is exceeded, Kubernetes updates the status dan the
reason for the Progressing condition:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

You can address an issue of insufficient quota by scaling down your Deployment, by scaling down other
controllers you may be running, or by increasing quota in your namespace. If you satisfy the quota
conditions dan the Deployment controller then completes the Deployment rollout, you'll see the
Deployment's status update with a successful condition (`Status=True` dan `Reason=NewReplicaSetAvailable`).

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`Type=Available` with `Status=True` means that your Deployment has minimum availability. Minimum availability is dictated
by the parameters specified in the deployment strategy. `Type=Progressing` with `Status=True` means that your Deployment
is either in the middle of a rollout dan it is progressing or that it has successfully completed its progress dan the minimum
required new replicas are available (see the Reason of the condition for the particulars - in our case
`Reason=NewReplicaSetAvailable` means that the Deployment is complete).

You can check if a Deployment has failed to progress by using `kubectl rollout status`. `kubectl rollout status`
returns a non-zero exit code if the Deployment has exceeded the progression deadline.

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
Keluaran akan tampil seperti berikut:
```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
$ echo $?
1
```

### Operating on a failed deployment

All actions that apply to a complete Deployment also apply to a failed Deployment. You can scale it up/down, roll back
to a previous revision, or even pause it if you need to apply multiple tweaks in the Deployment Pod template.

## Clean up Policy

You can set `.spec.revisionHistoryLimit` field in a Deployment to specify how many old ReplicaSets for
this Deployment you want to retain. The rest will be garbage-collected in the background. Umumnya,
it is 10.

{{< note >}}
Explicitly setting this field to 0, will result in cleaning up all the history of your Deployment
thus that Deployment will not be able to roll back.
{{< /note >}}

## Canary Deployment

If you want to roll out releases to a subset of users or servers using the Deployment, you
can create multiple Deployments, one for each release, following the canary pattern described in
[managing resources](/docs/concepts/cluster-administration/manage-deployment/#canary-deployments).

## Writing a Deployment Spec

As with all other Kubernetes configs, a Deployment needs `apiVersion`, `kind`, dan `metadata` fields.
For general information about working with config files, see [deploying applications](/docs/tutorials/stateless-application/run-stateless-application-deployment/),
configuring containers, dan [using kubectl to manage resources](/docs/concepts/overview/working-with-objects/object-management/) documents.

A Deployment also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Pod Template

The `.spec.template` dan `.spec.selector` are the only required field of the `.spec`.

The `.spec.template` is a [Pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a [Pod](/docs/concepts/workloads/pods/pod/), except it is nested dan does not have an
`apiVersion` or `kind`.

In addition to required fields for a Pod, a Pod template in a Deployment must specify appropriate
labels dan an appropriate restart policy. For labels, make sure not to overlap with other controllers. See [selector](#selector)).

Only a [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) equal to `Always` is
allowed, which is the default if not specified.

### Replicas

`.spec.replicas` is an optional field that specifies the number of desired Pods. It defaults to 1.

### Selector

`.spec.selector` is an required field that specifies a [label selector](/docs/concepts/overview/working-with-objects/labels/)
for the Pods targeted by this Deployment.

`.spec.selector` must match `.spec.template.metadata.labels`, or it will be rejected by the API.

In API version `apps/v1`, `.spec.selector` dan `.metadata.labels` do not default to `.spec.template.metadata.labels` if not set. So they must be set explicitly. Also note that `.spec.selector` is immutable after creation of the Deployment in `apps/v1`.

A Deployment may terminate Pods whose labels match the selector if their template is different
from `.spec.template` or if the total number of such Pods exceeds `.spec.replicas`. It brings up new
Pods with `.spec.template` if the number of Pods is less than the desired number.

{{< note >}}
You should not create other Pods whose labels match this selector, either directly, by creating
another Deployment, or by creating another controller such as a ReplicaSet or a ReplicationController. If you
do so, the first Deployment thinks that it created these other Pods. Kubernetes does not stop you from doing this.
{{< /note >}}

If you have multiple controllers that have overlapping selectors, the controllers will fight with each
other dan won't behave correctly.

### Strategy

`.spec.strategy` specifies the strategy used to replace old Pods by new ones.
`.spec.strategy.type` can be "Recreate" or "RollingUpdate". "RollingUpdate" is
the default value.

#### Recreate Deployment

All existing Pods are killed before new ones are created when `.spec.strategy.type==Recreate`.

#### Rolling Update Deployment

The Deployment updates Pods in a [rolling update](/docs/tasks/run-application/rolling-update-replication-controller/)
fashion when `.spec.strategy.type==RollingUpdate`. You can specify `maxUnavailable` dan `maxSurge` to control
the rolling update process.

##### Max Unavailable

`.spec.strategy.rollingUpdate.maxUnavailable` is an optional field that specifies the maximum number
of Pods that can be unavailable during the update process. The value can be an absolute number (for example, 5)
or a percentage of desired Pods (for example, 10%). The absolute number is calculated from percentage by
rounding down. The value cannot be 0 if `.spec.strategy.rollingUpdate.maxSurge` is 0. The default value is 25%.

For example, when this value is set to 30%, the old ReplicaSet can be scaled down to 70% of desired
Pods immediately when the rolling update starts. Once new Pods are ready, old ReplicaSet can be scaled
down further, followed by scaling up the new ReplicaSet, ensuring that the total number of Pods available
at all times during the update is at least 70% of the desired Pods.

##### Max Surge

`.spec.strategy.rollingUpdate.maxSurge` is an optional field that specifies the maximum number of Pods
that can be created over the desired number of Pods. The value can be an absolute number (for example, 5) or a
percentage of desired Pods (for example, 10%). The value cannot be 0 if `MaxUnavailable` is 0. The absolute number
is calculated from the percentage by rounding up. The default value is 25%.

For example, when this value is set to 30%, the new ReplicaSet can be scaled up immediately when the
rolling update starts, such that the total number of old dan new Pods does not exceed 130% of desired
Pods. Once old Pods have been killed, the new ReplicaSet can be scaled up further, ensuring that the
total number of Pods running at any time during the update is at most 130% of desired Pods.

### Progress Deadline Seconds

`.spec.progressDeadlineSeconds` is an optional field that specifies the number of seconds you want
to wait for your Deployment to progress before the system reports back that the Deployment has
[failed progressing](#failed-deployment) - surfaced as a condition with `Type=Progressing`, `Status=False`.
dan `Reason=ProgressDeadlineExceeded` in the status of the resource. The Deployment controller will keep
retrying the Deployment. In the future, once automatic rollback will be implemented, the Deployment
controller will roll back a Deployment as soon as it observes such a condition.

If specified, this field needs to be greater than `.spec.minReadySeconds`.

### Min Ready Seconds

`.spec.minReadySeconds` is an optional field that specifies the minimum number of seconds for which a newly
created Pod should be ready without any of its containers crashing, for it to be considered available.
This defaults to 0 (the Pod will be considered available as soon as it is ready). To learn more about when
a Pod is considered ready, see [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

### Rollback To

Field `.spec.rollbackTo` has been deprecated in API versions `extensions/v1beta1` dan `apps/v1beta1`, dan is no longer supported in API versions starting `apps/v1beta2`. Instead, `kubectl rollout undo` as introduced in [Rolling Back to a Previous Revision](#rolling-back-to-a-previous-revision) should be used.

### Revision History Limit

A Deployment's revision history is stored in the ReplicaSets it controls.

`.spec.revisionHistoryLimit` is an optional field that specifies the number of old ReplicaSets to retain
to allow rollback. These old ReplicaSets consume resources in `etcd` dan crowd the output of `kubectl get rs`. The configuration of each Deployment revision is stored in its ReplicaSets; therefore, once an old ReplicaSet is deleted, you lose the ability to rollback to that revision of Deployment. Umumnya, 10 old ReplicaSets will be kept, however its ideal value depends on the frequency dan stability of new Deployments.

More specifically, setting this field to zero means that all old ReplicaSets with 0 replicas will be cleaned up.
In this case, a new Deployment rollout cannot be undone, since its revision history is cleaned up.

### Paused

`.spec.paused` is an optional boolean field for pausing dan resuming a Deployment. The only difference between
a paused Deployment dan one that is not paused, is that any perubahan into the PodTemplateSpec of the paused
Deployment will not trigger new rollouts as long as it is paused. A Deployment is not paused Umumnya when
it is created.

## Alternatif untuk Deployment

### kubectl rolling update

[`kubectl rolling update`](/docs/reference/generated/kubectl/kubectl-perintahs#rolling-update) membarui Pod dan ReplicationController
dengan cara yang serupa. Namun, Deployments lebih disarankan karena deklaratif, berjalan di sisi server, dan punya fitur tambahan, 
seperti pengembalian ke revisi manapun sebelumnya bahkan setelah pembaruan rolling selesais.

{{% /capture %}}
