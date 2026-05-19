---
title: Deployment
feature:
  title: Rilis dan pengembalian terotomasi
  description: >
    Kubernetes merilis perubahan secara progresif pada aplikasimu atau konfigurasinya sambil memonitor kesehatan aplikasi untuk menjamin bahwa semua instances tidak mati bersamaan. Jika sesuatu yang buruk terjadi, Kubernetes akan melakukan rollback pada perubahanmu. Take advantage of a growing ecosystem of deployment solutions.

content_type: concept
weight: 30
---

<!-- overview -->

Deployment menyediakan pembaruan [Pods](/id/docs/concepts/workloads/pods/pod/) dan
[ReplicaSets](/id/docs/concepts/workloads/controllers/replicaset/) secara deklaratif.

Kamu mendeskripsikan sebuah state yang diinginkan dalam Deployment, kemudian Deployment {{< glossary_tooltip term_id="controller" >}} mengubah state sekarang menjadi seperti pada deskripsi secara bertahap. Kamu dapat mendefinisikan Deployment untuk membuat ReplicaSets baru atau untuk menghapus Deployment yang sudah ada dan mengadopsi semua resourcenya untuk Deployment baru.

{{< note >}}
Jangan mengganti ReplicaSets milik Deployment. Pertimbangkan untuk membuat isu pada repositori utama Kubernetes jika kasusmu tidak diatasi semua kasus di bawah.
{{< /note >}}




<!-- body -->

## Penggunaan

Berikut adalah penggunaan yang umum pada Deployment:

* [Membuat Deployment untuk merilis ReplicaSet](#membuat-deployment). ReplicaSet membuat Pod di belakang layar. Cek status rilis untuk tahu proses rilis sukses atau tidak.
* [Mendeklarasikan state baru dari Pods](#membarui-deployment) dengan membarui PodTemplateSpec milik Deployment. ReplicaSet baru akan dibuat dan Deployment mengatur perpindahan Pod secara teratur dari ReplicaSet lama ke ReplicaSet baru. Tiap ReplicaSet baru akan mengganti revisi Deployment.
* [Mengembalikan ke revisi Deployment sebelumnya](#membalikkan-deployment) jika state Deployment sekarang tidak stabil. Tiap pengembalian mengganti revisi Deployment.
* [Memperbesar Deployment untuk memfasilitasi beban yang lebih](#mengatur-skala-deployment).
* [Menjeda Deployment](#menjeda-dan-melanjutkan-deployment) untuk menerapkan perbaikan pada PodTemplateSpec-nya, lalu melanjutkan untuk memulai rilis baru.
* [Memakai status Deployment](#status-deployment) sebagai indikator ketika rilis tersendat.
* [Membersihkan ReplicaSet lama](#kebijakan-pembersihan) yang sudah tidak terpakai.

## Membuat Deployment

Berikut adalah contoh Deployment. Dia membuat ReplicaSet untuk membangkitkan tiga Pod `nginx`:

{{% codenew file="controllers/nginx-deployment.yaml" %}}

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

  Sebelum memulai, pastikan klaster Kubernetes sedang menyala dan bekerja.

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
    Ketika kamu memeriksa Deployments pada klastermu, kolom berikut akan tampil:

      * `NAME` menampilkan daftar nama Deployment pada klaster.
      * `DESIRED` menampilkan jumlah replika aplikasi yang diinginkan sesuai yang didefinisikan saat pembuatan Deployment. Ini adalah _state_ yang diinginkan.
      * `CURRENT` menampilkan berapa jumlah replika yang sedang berjalan.
      * `UP-TO-DATE` menampilkan jumlah replika yang diperbarui agar sesuai state yang diinginkan.
      * `AVAILABLE` menampilkan jumlah replika aplikasi yang dapat diakses pengguna.
      * `AGE` menampilkan lama waktu aplikasi telah berjalan.

    Perhatikan bahwa jumlah replika yang diinginkan adalah tiga sesuai kolom `.spec.replicas`.

  3. Untuk melihat status rilis Deployment, jalankan `kubectl rollout status deployment.v1.apps/nginx-deployment`. Keluaran akan tampil seperti berikut:
    ```shell
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    deployment "nginx-deployment" successfully rolled out
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
    nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
    nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
    nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
    ```
    ReplicaSet yang dibuat menjamin bahwa ada tiga Pod `nginx`.

  {{< note >}}
  Kamu harus memasukkan selektor dan label templat Pod yang benar pada Deployment (dalam kasus ini, `app: nginx`).
  Jangan membuat label atau selektor yang beririsan dengan kontroler lain (termasuk Deployment dan StatefulSet lainnya). Kubernetes tidak akan mencegah adanya label yang beririsan.
  Namun, jika beberapa kontroler memiliki selektor yang beririsan, kontroler itu mungkin akan konflik dan berjalan dengan tidak semestinya.
  {{< /note >}}

### Label pod-template-hash

{{< note >}}
Jangan ubah label ini.
{{< /note >}}

Label `pod-template-hash` ditambahkan oleh Deployment kontroler pada tiap ReplicaSet yang dibuat atau diadopsi Deployment.

Label ini menjamin anak-anak ReplicaSet milik Deployment tidak tumpang tindih. Dia dibangkitkan dengan melakukan hash pada `PodTemplate` milik ReplicaSet dan memakainya sebagai label untuk ditambahkan ke selektor ReplicaSet, label templat Pod, dan Pod apapun yang ReplicaSet miliki.

## Membarui Deployment

{{< note >}}
Rilis Deployment hanya dapat dipicu oleh perubahan templat Pod Deployment (yaitu, `.spec.template`), contohnya perubahan kolom label atau image container. Yang lain, seperti replika, tidak akan memicu rilis.
{{< /note >}}

Ikuti langkah-langkah berikut untuk membarui Deployment:

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
    deployment "nginx-deployment" successfully rolled out
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

### Perpanjangan (alias banyak pembaruan secara langsung)

Setiap kali Deployment baru is teramati oleh Deployment kontroler, ReplicaSet dibuat untuk membangkitkan Pod sesuai keinginan.
Jika Deployment diperbarui, ReplicaSet yang terkait Pod dengan label `.spec.selector` yang cocok,
namun kolom `.spec.template` pada templat tidak cocok akan dihapus. Kemudian, ReplicaSet baru akan
digandakan sebanyak `.spec.replicas` dan semua ReplicaSet lama dihapus.

Jika kamu mengubah Deployment saat rilis sedang berjalan, Deployment akan membuat ReplicaSet baru
tiap perubahan dan memulai penggandaan. Lalu, dia akan mengganti ReplicaSet yang dibuat sebelumnya
 -- mereka ditambahkan ke dalam daftar ReplicaSet lama dan akan mulai dihapus.

Contohnya, ketika kamu membuat Deployment untuk membangkitkan 5 replika `nginx:1.7.9`,
kemudian membarui Deployment dengan versi `nginx:1.9.1` ketika ada 3 replika `nginx:1.7.9` yang dibuat.
Dalam kasus ini, Deployment akan segera menghapus 3 replika Pod `nginx:1.7.9` yang telah dibuat, dan mulai membuat
Pod `nginx:1.9.1`. Dia tidak akan menunggu kelima replika `nginx:1.7.9` selesai baru menjalankan perubahan.

### Mengubah selektor label

Umumnya, sekali dibuat, selektor label tidak boleh diubah. Sehingga disarankan untuk direncanakan dengan hati-hati sebelumnya.
Bagaimanapun, jika kamu perlu mengganti selektor label, lakukan dengan seksama dan pastikan kamu tahu segala konsekuensinya.

{{< note >}}
Pada versi API `apps/v1`, selektor label Deployment tidak bisa diubah ketika selesai dibuat.
{{< /note >}}

* Penambahan selektor mensyaratkan label templat Pod di spek Deployment untuk diganti dengan label baru juga.
Jika tidak, galat validasi akan muncul. Perubahan haruslah tidak tumpang-tindih, dengan kata lain selektor baru tidak mencakup ReplicaSet dan Pod yang dibuat dengan selektor lama. Sehingga, semua ReplicaSet lama akan menggantung sedangkan ReplicaSet baru tetap dibuat.
* Pengubahan selektor mengubah nilai pada kunci selektor -- menghasilkan perilaku yang sama dengan penambahan.
* Penghapusan selektor menghilangkan kunci yang ada pada selektor Deployment -- tidak mensyaratkan perubahan apapun pada label templat Pod.
ReplicaSet yang ada tidak menggantung dan ReplicaSet baru tidak dibuat.
Tapi perhatikan bahwa label yang dihapus masih ada pada Pod dan ReplicaSet masing-masing.

## Membalikkan Deployment

Kadang, kamu mau membalikkan Deployment; misalnya, saat Deployment tidak stabil, seperti crash looping.
Umumnya, semua riwayat rilis Deployment disimpan oleh sistem sehingga kamu dapat kembali kapanpun kamu mau
(kamu dapat mengubahnya dengan mengubah batas riwayat revisi).

{{< note >}}
Revisi Deployment dibuat saat rilis Deployment dipicu. Ini berarti revisi baru dibuat jika dan hanya jika
templat Pod Deployment (`.spec.template`) berubah, misalnya jika kamu membarui label atau image kontainer pada templat.
Pembaruan lain, seperti penggantian skala Deployment, tidak membuat revisi Deployment, jadi kamu dapat memfasilitasi
penggantian skala secara manual atau otomatis secara simultan. Artinya saat kamu membalikkan ke versi sebelumnya,
hanya bagian templat Pod Deployment yang dibalikkan.
{{< /note >}}

* Misal kamu membuat saltik saat mengganti Deployment, dengan memberi nama image dengan `nginx:1.91` alih-alih `nginx:1.9.1`:

    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment image updated
    ```

* Rilis akan tersendat. Kamu dapat memeriksanya dengan melihat status rilis:

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
    ```

* Tekan Ctrl-C untuk menghentikan pemeriksaan status rilis di atas. Untuk info lebih lanjut
tentang rilis tersendat, [baca disini](#status-deployment).

* Kamu lihat bahwa jumlah replika lama (`nginx-deployment-1564180365` dan `nginx-deployment-2035384211`) adalah 2, dan replika baru (nginx-deployment-3066724191) adalah 1.

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

* Lihat pada Pod yang dibuat. Akan ada 1 Pod dibuat dari ReplicaSet baru tersendat loop(?) ketika penarikan image.

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
    Controller Deployment menghentikan rilis yang buruk secara otomatis dan juga berhenti meningkatkan ReplicaSet baru.
    Ini tergantung pada parameter rollingUpdate (secara khusus `maxUnavailable`) yang dimasukkan.
    Kubernetes umumnya mengatur jumlahnya menjadi 25%.
    {{< /note >}}

* Tampilkan deskripsi Deployment:
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

  Untuk memperbaikinya, kamu harus kembali ke revisi Deployment yang sebelumnya stabil.

### Mengecek Riwayat Rilis Deployment

Ikuti langkah-langkah berikut untuk mengecek riwayat rilis:

1. Pertama, cek revisi Deployment sekarang:
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

    `CHANGE-CAUSE` disalin dari anotasi Deployment `kubernetes.io/change-cause` ke revisi saat pembuatan. Kamu dapat menentukan pesan `CHANGE-CAUSE` dengan:

    * Menambahkan anotasi pada Deployment dengan `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image updated to 1.9.1"`
    * Menambahkan argumen `--record` untuk menyimpan perintah `kubectl` yang menyebabkan perubahan sumber daya.
    * Mengganti manifest sumber daya secara manual.

2. Untuk melihat detil tiap revisi, jalankan:
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

### Kembali ke Revisi Sebelumnya
Ikuti langkah-langkah berikut untuk membalikkan Deployment dari versi sekarang ke versi sebelumnya, yaitu versi 2.

1. Sekarang kamu telah menentukan akan mengembalikan rilis sekarang ke sebelumnya:
    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment
    ```
    Gantinya, kamu dapat kambali ke revisi tertentu dengan menambahkan argumen `--to-revision`:

    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment
    ```

    Untuk detil lebih lanjut perintah terkait rilis, baca [`rilis kubectl`](/docs/reference/generated/kubectl/kubectl-commands#rollout).

    Deployment sekarang dikembalikan ke revisi stabil sebelumnya. Seperti terlihat, ada event `DeploymentRollback`
    yang dibentuk oleh kontroler Deployment untuk pembalikan ke revisi 2.

2. Cek apakah rilis telah sukses dan Deployment berjalan seharusnya, jalankan:
    ```shell
    kubectl get deployment nginx-deployment
    ```

    Keluaran akan tampil seperti berikut:
    ```
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3         3         3            3           30m
    ```
3. Tampilkan deskripsi Deployment:
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

## Mengatur Skala Deployment

Kamu dapat mengatur skala Deployment dengan perintah berikut:

```shell
kubectl scale deployment.v1.apps/nginx-deployment --replicas=10
```
Keluaran akan tampil seperti berikut:
```
deployment.apps/nginx-deployment scaled
```

Dengan asumsi [horizontal Pod autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) dalam klaster dinyalakan,
kamu dapat mengatur autoscaler untuk Deployment-mu dan memilih jumlah minimal dan maksimal Pod yang mau dijalankan berdasarkan penggunaan CPU
dari Pod.

```shell
kubectl autoscale deployment.v1.apps/nginx-deployment --min=10 --max=15 --cpu-percent=80
```
Keluaran akan tampil seperti berikut:
```
deployment.apps/nginx-deployment scaled
```

### Pengaturan skala proporsional

Deployment RollingUpdate mendukung beberapa versi aplikasi berjalan secara bersamaan. Ketika kamu atau autoscaler
mengubah skala Deployment RollingUpdate yang ada di tengah rilis (yang sedang berjalan maupun terjeda),
kontroler Deployment menyeimbangkan replika tambahan dalam ReplicaSet aktif (ReplicaSet dengan Pod) untuk mencegah resiko.
Ini disebut *pengaturan skala proporsional*.

Sebagai contoh, kamu menjalankan Deployment dengan 10 replika, [maxSurge](#max-surge)=3, dan [maxUnavailable](#max-unavailable)=2.

* Pastikan ada 10 replica di Deployment-mu yang berjalan.
  ```shell
  kubectl get deploy
  ```
  Keluaran akan tampil seperti berikut:

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* Ganti ke image baru yang kebetulan tidak bisa ditemukan dari dalam klaster.
    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:sometag
    ```

    Keluaran akan tampil seperti berikut:
    ```
    deployment.apps/nginx-deployment image updated
    ```

* Penggantian image akan memulai rilis baru dengan ReplicaSet nginx-deployment-1989198191, namun dicegah karena
persyaratan `maxUnavailable` yang disebut di atas. Cek status rilis:
    ```shell
    kubectl get rs
    ```
      Keluaran akan tampil seperti berikut:
    ```
    NAME                          DESIRED   CURRENT   READY     AGE
    nginx-deployment-1989198191   5         5         0         9s
    nginx-deployment-618515232    8         8         8         1m
    ```

* Kemudian, permintaan peningkatan untuk Deployment akan masuk. Autoscaler menambah replika Deployment
menjadi 15. Controller Deployment perlu menentukan dimana 5 replika ini ditambahkan. Jika kamu memakai
pengaturan skala proporsional, kelima replika akan ditambahkan ke ReplicaSet baru. Dengan pengaturan skala proporsional,
kamu menyebarkan replika tambahan ke semua ReplicaSet. Proporsi terbesar ada pada ReplicaSet dengan
replika terbanyak dan proporsi yang lebih kecil untuk replika dengan ReplicaSet yang lebih sedikit.
Sisanya akan diberikan ReplicaSet dengan replika terbanyak. ReplicaSet tanpa replika tidak akan ditingkatkan.

Dalam kasus kita di atas, 3 replika ditambahkan ke ReplicaSet lama dan 2 replika ditambahkan ke ReplicaSet baru.
Proses rilis akan segera memindahkan semua ReplicaSet baru, dengan asumsi semua replika dalam kondisi sehat.
Untuk memastikannya, jalankan:

```shell
kubectl get deploy
```

Keluaran akan tampil seperti berikut:
```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```
Status rilis mengkonfirmasi bagaimana replika ditambahkan ke tiap ReplicaSet.
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

    The state awal Deployment sebelum jeda akan melanjutkan fungsinya, tapi perubahan
    Deployment tidak akan berefek apapun selama Deployment masih terjeda.

* Kemudian, mulai kembali Deployment dan perhatikan ReplicaSet baru akan muncul dengan semua perubahan baru:
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
atau juga [gagal](#deployment-gagal).

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
deployment "nginx-deployment" successfully rolled out
$ echo $?
0
```

### Deployment Gagal

Deployment-mu bisa saja terhenti saat mencoba deploy ReplicaSet terbaru tanpa pernah selesai.
Ini dapat terjadi karena faktor berikut:

* Kuota tidak mencukupi
* Kegagalan pengecekan kesiapan
* Galat saat mengunduh image
* Tidak memiliki ijin
* Limit ranges
* Konfigurasi runtime aplikasi yang salah

Salah satu cara untuk mendeteksi kondisi ini adalah untuk menjelaskan parameter tenggat pada spesifikasi Deployment:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` menyatakan
lama kontroler Deployment menunggu sebelum mengindikasikan (pada status Deployment) bahwa kemajuan Deployment
tersendat dalam detik.

Perintah `kubectl` berikut menetapkan spek dengan `progressDeadlineSeconds` untuk membuat kontroler
melaporkan kemajuan Deployment yang sedikit setelah 10 menit:

```shell
kubectl patch deployment.v1.apps/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```
Keluaran akan tampil seperti berikut:
```
deployment.apps/nginx-deployment patched
```
Ketika tenggat sudah lewat, kontroler Deployment menambah DeploymentCondition dengan atribut
berikut ke `.status.conditions` milik Deployment:

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

Lihat [konvensi Kubernetes API](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) untuk info lebih lanjut tentang kondisi status.

{{< note >}}
Kubernetes tidak melakukan apapun pada Deployment yang tersendat selain melaporkannya sebagai `Reason=ProgressDeadlineExceeded`.
Orkestrator yang lebih tinggi dapat memanfaatkannya untuk melakukan tindak lanjut. Misalnya, mengembalikan Deployment ke versi sebelumnya.
{{< /note >}}

{{< note >}}
Jika Deployment terjeda, Kubernetes tidak akan mengecek kemajuan pada selang itu.
Kamu dapat menjeda Deployment di tengah rilis dan melanjutkannya dengan aman tanpa memicu kondisi saat tenggat telah lewat.
{{< /note >}}

Kamu dapat mengalami galat sejenak pada Deployment disebabkan timeout yang dipasang terlalu kecil atau
hal-hal lain yang terjadi sementara. Misalnya, kamu punya kuota yang tidak mencukupi. Jika kamu mendeskripsikan Deployment
kamu akan menjumpai pada bagian ini:

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

Jika kamu menjalankan `kubectl get deployment nginx-deployment -o yaml`, Deployment status akan muncul seperti berikut:

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

Begitu tenggat kemajuan Deployment terlewat, Kubernetes membarui status dan alasan untuk kondisi Progressing:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

Kamu dapat menangani isu keterbatasan kuota dengan menurunkan jumlah Deployment, bisa dengan menghapus kontrolers
yang sedang berjalan, atau dengan meningkatkan kuota pada namespace. Jika kuota tersedia, kemudian kontroler Deployment
akan dapat menyelesaikan rilis Deployment. Kamu akan melihat bahwa status Deployment berubah menjadi kondisi sukses (`Status=True` dan `Reason=NewReplicaSetAvailable`).

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`Type=Available` dengan `Status=True` artinya Deployment-mu punya ketersediaan minimum. Ketersediaan minimum diatur
oleh parameter yang dibuat pada strategi deployment. `Type=Progressing` dengan `Status=True` berarti Deployment
sedang dalam rilis dan masih berjalan atau sudah selesai berjalan dan jumlah minimum replika tersedia
(lihat bagian Alasan untuk kondisi tertentu - dalam kasus ini `Reason=NewReplicaSetAvailable` berarti Deployment telah selesai).

Kamu dapat mengecek apakah Deployment gagal berkembang dengan perintah `kubectl rollout status`. `kubectl rollout status`
mengembalikan nilai selain nol jika Deployment telah melewati tenggat kemajuan.

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

### Menindak Deployment yang gagal

Semua aksi yang dapat diterapkan pada Deployment yang selesai berjalan juga pada Deployment gagal. Kamu dapat menaik/turunkan replika, membalikkan ke versi sebelumnya, atau menjedanya jika kamu perlu menerapkan beberapa perbaikan pada templat Pod Deployment.

## Kebijakan Pembersihan

Kamu dapat mengisi kolom `.spec.revisionHistoryLimit` di Deployment untuk menentukan banyak ReplicaSet
pada Deployment yang ingin dipertahankan. Sisanya akan di garbage-collected di balik layar. Umumnya, nilai kolom berisi 10.

{{< note >}}
Mengisi secara eksplisit dengan nilai 0 akan membuat pembersihan semua riwayat rilis Deployment
sehingga Deployment tidak akan dapat dikembalikan.
{{< /note >}}

## Deployment Canary

Jika kamu ingin merilis ke sebagian pengguna atau server menggunakan Deployment,
kamu dapat membuat beberapa Deployment, satu tiap rilis, dengan mengikuti pola canary yang didesripsikan pada
[mengelola sumber daya](/id/docs/concepts/cluster-administration/manage-deployment/#deploy-dengan-canary).

## Menulis Spesifikasi Deployment

Sebagaimana konfigurasi Kubernetes lainnya, Deployment memerlukan kolom `apiVersion`, `kind`, dan `metadata`.
Untuk informasi umum tentang penggunaan berkas konfigurasi, lihat dokumen [deploy aplikasi](/id/docs/tutorials/stateless-application/run-stateless-application-deployment/),
mengatur kontainer, dan [memakai kubectl untuk mengatur sumber daya](/id/docs/concepts/overview/working-with-objects/object-management/).

Deployment juga perlu [bagian `.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Templat Pod

Dalam `.spec` hanya ada kolom `.spec.template` dan `.spec.selector` yang wajib diisi.

`.spec.template` adalah [templat Pod](/id/docs/concepts/workloads/pods/pod-overview/#templat-pod). Dia memiliki skema yang sama dengan [Pod](/id/docs/concepts/workloads/pods/pod/). Bedanya dia bersarang dan tidak punya `apiVersion` atau `kind`.

Selain kolom wajib untuk Pod, templat Pod pada Deployment harus menentukan label dan aturan menjalankan ulang yang tepat.
Untuk label, pastikaan tidak bertumpang tindih dengan kontroler lainnya. Lihat [selektor](#selektor)).

[`.spec.template.spec.restartPolicy`](/id/docs/concepts/workloads/pods/pod-lifecycle/#aturan-menjalankan-ulang) hanya boleh berisi `Always`,
yang tidak ditentukan pada bawaan.

### Replika

`.spec.replicas` adalah kolom opsional yang mengatur jumlah Pod yang diinginkan. Setelan bawaannya berisi 1.

### Selektor

`.spec.selector` adalah kolom wajib yang mengatur [selektor label](/id/docs/concepts/overview/working-with-objects/labels/)
untuk Pod yang dituju oleh Deployment ini.

`.spec.selector` harus sesuai `.spec.template.metadata.labels`, atau akan ditolak oleh API.

Di versi API `apps/v1`, `.spec.selector` dan `.metadata.labels` tidak berisi `.spec.template.metadata.labels` jika tidak disetel.
Jadi mereka harus disetel secara eksplisit. Perhatikan juga `.spec.selector` tidak dapat diubah setelah Deployment dibuat pada `apps/v1`.

Deployment dapat mematikan Pod yang labelnya cocok dengan selektor jika templatnya berbeda
dari `.spec.template` atau total jumlah Pod melebihi `.spec.replicas`. Dia akan membuat Pod baru
dengan `.spec.template` jika jumlah Pod kurang dari yang diinginkan.

{{< note >}}
Kamu sebaiknya tidak membuat Pod lain yang labelnya cocok dengan selektor ini, baik secara langsung,
melalui Deployment lain, atau membuat kontroler lain seperti ReplicaSet atau ReplicationController.
Kalau kamu melakukannya, Deployment pertama akan mengira dia yang membuat Pod-pod ini.
Kubernetes tidak akan mencegahmu melakukannya.
{{< /note >}}

Jika kamu punya beberapa kontroler dengan selektor bertindihan, mereka akan saling bertikai
dan tidak akan berjalan semestinya.

### Strategi

`.spec.strategy` mengatur strategi yang dipakai untuk mengganti Pod lama dengan yang baru.
`.spec.strategy.type` dapat berisi "Recreate" atau "RollingUpdate". Nilai bawaannya adalah "RollingUpdate".

#### Membuat Ulang Deployment

Semua Pod yang ada dimatikan sebelum yang baru dibuat ketika nilai `.spec.strategy.type==Recreate`.

#### Membarui Deployment secara Bergulir

Deployment membarui Pod secara bergulir
saat `.spec.strategy.type==RollingUpdate`. Kamu dapat menentukan `maxUnavailable` dan `maxSurge` untuk mengatur
proses pembaruan bergulir.

##### Ketidaktersediaan Maksimum

`.spec.strategy.rollingUpdate.maxUnavailable` adalah kolom opsional yang mengatur jumlah Pod maksimal
yang tidak tersedia selama proses pembaruan. Nilainya bisa berupa angka mutlak (contohnya 5)
atau persentase dari Pod yang diinginkan (contohnya 10%). Angka mutlak dihitung berdasarkan persentase
dengan pembulatan ke bawah. Nilai tidak bisa nol jika `.spec.strategy.rollingUpdate.maxSurge` juga nol.
Nilai bawaannya yaitu 25%.

Sebagai contoh, ketika nilai berisi 30%, ReplicaSet lama dapat segera diperkecil menjadi 70% dari Pod
yang diinginkan saat pembaruan bergulir dimulai. Seketika Pod baru siap, ReplicaSet lama dapat lebih diperkecil lagi,
diikuti dengan pembesaran ReplicaSet, menjamin total jumlah Pod yang siap kapanpun ketika pembaruan
paling sedikit 70% dari Pod yang diinginkan.

##### Kelebihan Maksimum

`.spec.strategy.rollingUpdate.maxSurge` adalah kolom opsional yang mengatur jumlah Pod maksimal yang
dapat dibuat melebihi jumlah Pod yang diinginkan. Nilainya bisa berupa angka mutlak (contohnya 5) atau persentase
dari Pod yang diinginkan (contohnya 10%). Nilai tidak bisa nol jika `MaxUnavailable` juga nol. Angka mutlak
dihitung berdasarkan persentase dengan pembulatan ke bawah. Nilai bawaannya yaitu 25%.

Sebagai contoh, ketika nilai berisi 30%, ReplicaSet baru dapat segera diperbesar saat pembaruan bergulir dimulai,
sehingga total jumlah Pod yang baru dan lama tidak melebihi 130% dari Pod yang diinginkan.
Saat Pod lama dimatikan, ReplicaSet baru dapat lebih diperbesar lagi, menjamin total jumlah Pod yang siap
kapanpun ketika pembaruan paling banyak 130% dari Pod yang diinginkan.

### Tenggat Kemajuan dalam Detik

`.spec.progressDeadlineSeconds` adalah kolom opsional yang mengatur lama tunggu dalam dalam detik untuk Deployment-mu berjalan
sebelum sistem melaporkan lagi bahwa Deployment [gagal](#deployment-gagal) - ditunjukkan dengan kondisi `Type=Progressing`, `Status=False`,
dan `Reason=ProgressDeadlineExceeded` pada status sumber daya. Controller Deployment akan tetap mencoba ulang Deployment.
Nantinya begitu pengembalian otomatis diimplementasikan, kontroler Deployment akan membalikkan Deployment segera
saat dia menjumpai kondisi tersebut.

Jika ditentukan, kolom ini harus lebih besar dari `.spec.minReadySeconds`.

### Lama Minimum untuk Siap dalam Detik

`.spec.minReadySeconds` adalah kolom opsional yang mengatur lama minimal sebuah Pod yang baru dibuat
seharusnya siap tanpa ada kontainer yang rusak, untuk dianggap tersedia, dalam detik.
Nilai bawaannya yaitu 0 (Pod akan dianggap tersedia segera ketika siap). Untuk mempelajari lebih lanjut
kapan Pod dianggap siap, lihat [Pemeriksaan Kontainer](/id/docs/concepts/workloads/pods/pod-lifecycle/#pemeriksaan-kontainer).

### Kembali Ke

Kolom `.spec.rollbackTo` telah ditinggalkan pada versi API `extensions/v1beta1` dan `apps/v1beta1`, dan sudah tidak didukung mulai versi API `apps/v1beta2`.
Sebagai gantinya, disarankan untuk menggunakan `kubectl rollout undo` sebagaimana diperkenalkan dalam [Kembali ke Revisi Sebelumnya](#kembali-ke-revisi-sebelumnya).

### Batas Riwayat Revisi

Riwayat revisi Deployment disimpan dalam ReplicaSet yang dia kendalikan.

`.spec.revisionHistoryLimit` adalah kolom opsional yang mengatur jumlah ReplicaSet lama yang dipertahankan
untuk memungkinkan pengembalian. ReplicaSet lama ini mengambil sumber daya dari `etcd` dan memunculkan keluaran
dari `kubectl get rs`. Konfigurasi tiap revisi Deployment disimpan pada ReplicaSet-nya; sehingga, begitu ReplicaSet lama dihapus,
kamu tidak mampu lagi membalikkan revisi Deployment-nya. Umumnya, 10 ReplicaSet lama akan dipertahankan,
namun nilai idealnya tergantung pada frekuensi dan stabilitas Deployment-deployment baru.

Lebih spesifik, mengisi kolom dengan nol berarti semua ReplicaSet lama dengan 0 replika akan dibersihkan.
Dalam kasus ini, rilis Deployment baru tidak dapat dibalikkan, sebab riwayat revisinya telah dibersihkan.

### Terjeda

`.spec.paused` adalah kolom boolean opsional untuk menjeda dan melanjutkan Deployment. Perbedaan antara Deployment yang terjeda
dan yang tidak hanyalah perubahan apapun pada PodTemplateSpec Deployment terjeda tidak akan memicu rilis baru selama masih terjeda.
Deployment umumnya tidak terjeda saat dibuat.

## Alternatif untuk Deployment

### kubectl rolling update

[`kubectl rolling update`](/id/docs/reference/generated/kubectl/kubectl-commands#rolling-update) membarui Pod dan ReplicationController
dengan cara yang serupa. Namun, Deployments lebih disarankan karena deklaratif, berjalan di sisi server, dan punya fitur tambahan,
seperti pembalikkan ke revisi manapun sebelumnya bahkan setelah pembaruan rolling selesais.

