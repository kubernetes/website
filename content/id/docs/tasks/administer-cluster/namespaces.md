---
title: Berbagi Klaster dengan Namespaces
content_type: task
---

<!-- overview -->
Halaman ini menunjukkan bagaimana cara melihat, menggunakan dan menghapus {{< glossary_tooltip text="namespaces" term_id="namespace" >}}. Halaman ini juga menunjukkan bagaimana cara menggunakan namespace Kubernetes namespaces untuk membagi klaster kamu.


## {{% heading "prerequisites" %}}

* Memiliki [Klaster Kubernetes](/docs/setup/).
* Memiliki pemahaman dasar _[Pods](/docs/concepts/workloads/pods/pod/)_, _[Services](/docs/concepts/services-networking/service/)_, dan _[Deployments](/docs/concepts/workloads/controllers/deployment/)_ di Kubernetes.


<!-- steps -->

## Melihat namespaces

1. Untuk melihat namespaces yang ada saat ini disebuah klaster anda bisa menggunakan:

```shell
kubectl get namespaces
```
```
NAME          STATUS    AGE
default       Active    11d
kube-system   Active    11d
kube-public   Active    11d
```

Kubernetes berjalan dengan tiga namespaces awal:

   * `default` Namespace bawaan untuk objek-objek yang belum terkait dengan namespace lain
   * `kube-system` Namespace untuk objek-objek yang dibuat oleh sistem Kubernetes
   * `kube-public` Namespae ini dibuat secara otomatis dan dapat dibaca seluruh pengguna (termasuk yang tidak terotentikasi). Namespace ini sering dicadangkan untuk penggunaan klaster, untuk kasus dimana beberapa sumber daya agar dapat terlihat dan dapat dibaca secara publik di keseluruhan klaster. Aspek publik di namespace ini hanya sebuah konvensi bukan kebutuhan.

Kamu bisa mendapat ringkasan namespace tertentu menggunakan:

```shell
kubectl get namespaces <name>
```

Atau anda bisa mendapatkan informasi detail menggunakan:

```shell
kubectl describe namespaces <name>
```
```
Name:           default
Labels:         <none>
Annotations:    <none>
Status:         Active

No resource quota.

Resource Limits
 Type       Resource    Min Max Default
 ----               --------    --- --- ---
 Container          cpu         -   -   100m
```

Sebagai catatan, detail diatas menunjukkan baik kuota sumber daya (apabila ada) dan juga jangkauan batas sumber daya

Kuota sumber daya melacak penggunaan total sumber daya didalam *Namespace* dan mengijinkan operator-operator klaster mendefinisikan *batas atas* penggunaan sumber daya yang dapat di gunakan sebuah *Namespace*.

Jangkauan batas mendefinisikan pembatas min/maks jumlah sumber daya yang dapat di gunakan oleh sebuah entitas di sebuah *Namespace*.

Lihat [Admission control: Limit Range](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)

Sebuah namespace dapat berada di salah satu dari dua fase:

   * `Active` namespace sedang digunakan
   * `Terminating` namespace sedang dihapus dan tidak dapat digunakan untuk objek-objek baru

Lihat [dokumentasi desain](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#phases) untuk detil lebih lanjut.

## Membuat sebuah namespace baru

{{< note >}}
    Hindari membuat namespace dengan awalan `kube-`, karena awalan ini dicadangkan untuk namespace sistem Kubernetes.
{{< /note >}}

1. Buat berkas YAML baru  dengan nama `my-namespace.yaml` dengan isi berikut ini:

    ```yaml
    apiVersion: v1
    kind: Namespace
    metadata:
      name: <insert-namespace-name-here>
    ```
    Then run:
   
    ```
    kubectl create -f ./my-namespace.yaml
    ```

2. Cara alternatif, kamu bisa membuat namespace menggunakan perintah dibawah ini:

    ```
    kubectl create namespace <insert-namespace-name-here>
    ``` 

Nama namespace kamu harus merupakan 
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names) yang valid.

Ada kolom opsional `finalizers`, yang memungkinkan _obvservables_ untuk membersihkan sumber daya ketika namespace dihapus. Ingat bahwa jika kamu memberikan finalizer yang tidak ada, namespace akan dibuat tapi akan macet di status `Terminating` jika pengguna mencoba untuk menghapusnya.

Informasi lebih lanjut mengenai `finalizers` bisa dibaca di [dokumentasi desain](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#finalizers) namespace.

## Menghapus namespace

Hapus namespace dengan

```shell
kubectl delete namespaces <insert-some-namespace-name>
```

{{< warning >}}
Ini akan menghapus _semua hal_ di dalam namespace!
{{< /warning >}}

Proses penghapusan ini asinkrin, jadi untuk beberapa waktu kamu akan melihat namespace dalam status `Terminating`.

## Membagi klaster kamu menggunakan namespace Kubernetes

1. Pahami namespace bawaan

    Secara bawaan, sebuah klaster Kubernetes akan membuat namespace bawaan ketika menyediakan klaster untuk menampung Pod, Services, dan Deployment yang digunakan oleh klaster.
    
    Dengan asumsi kamu memiliki klaster baru, kamu bisa mengecek namespace yang tersedia dengan melakukan hal berikut:

    ```shell
    kubectl get namespaces
    ```
    ```
    NAME      STATUS    AGE
    default   Active    13m
    ```

2. Membuat namespace baru

	 Untuk latihan ini, kita akan membuat dua namespace Kubernetes tambahan untuk menyimpan konten kita

    Dalam sebuah skenario dimana sebuah organisasi menggunakan klaster Kuberetes yang digunakan bersama untuk pengguaan _development_ dan _production_:

    Tim pengembang ingin mengelola ruang di dalam klaster dimana mereka bisa melihat daftar Pod, Layanan, dan Deployment yang digunakan untuk membangun dan menjalankan apliksi mereka. Di ruang ini sumber daya akan datang dan prgi dan pembatasan mengenai siapa bisa atau tidak bisa memodifikasi sumber daya lebih santai untuk mendukung pengembangan secara _agile_.
    
    Tim operasi ingin mengelola ruang didalam klaster dimana mereka bisa memaksakan prosedur ketat mengenai siapa yang bisa atau tidak bisa melakukan manipulasi kumpulan Pod, Layanan, dan Deployment yang berjalan di situs _production_.

    Satu pola yang bisa diikuti organisasi ini adalah dengan membagi klaster Kubernetes menjadi dua namespace: `development` dan `production`

    Mari kita buat dua namespace untuk menyimpan hasil kerja kita.

    Buat namespace `development` menggunakan kubectl:

    ```shell
    kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
    ```

    Kemudian mari kita buat namespace `production` menggunakan kubectl:

    ```shell
    kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
    ```

    Untuk memastikan apa yang kita lakukan benar, lihat seluruh namespace didalam klaster.

    ```shell
    kubectl get namespaces --show-labels
    ```
    ```
    NAME          STATUS    AGE       LABELS
    default       Active    32m       <none>
    development   Active    29s       name=development
    production    Active    23s       name=production
    ```

3. Buat pod di tiap namespace

    Sebuah namespace Kubernetes memberikan batasan untuk Pods, Layanan, dan Deployment di dalam klaster.

    Pengguna yang berinteraksi dengan salah satu namespace tidak melihat konten di dalam namespace lain
    
    Untuk menunjukkan hal ini, Mari kita jalankan Deployment dan Pods sederhana di dalam namespace `development`.

    ```shell
    kubectl create deployment snowflake --image=k8s.gcr.io/serve_hostname -n=development
    kubectl scale deployment snowflake --replicas=2 -n=development
    ```
    Kita baru aja membuat sebuah deployment yang memiliki ukuran replika 2 menjalankan pod dengan nama `snowflake` dengan sebuah kontainer dasar yang hanya melayani hostname.
    

    ```shell
    kubectl get deployment -n=development
    ```
    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    snowflake    2/2     2            2           2m
    ```
    ```shell
    kubectl get pods -l app=snowflake -n=development
    ```
    ```
    NAME                         READY     STATUS    RESTARTS   AGE
    snowflake-3968820950-9dgr8   1/1       Running   0          2m
    snowflake-3968820950-vgc4n   1/1       Running   0          2m
    ```

    Dan ini keren, pengembang bisa melakukan hal yang ingin mereka lakukan dan mereka tidak harus khawatir akan mempengaruhi konten di namespace `production`.
    
    Mari kita pindah ke namespace `production` dan menujukkan bagaimana sumber daya di satu namespace disembunyikan dari yang lain

    Namespace `production` seharusnya kosong, dan perintah berikut ini seharunsnya tidak mengembalikan apapun.

    ```shell
    kubectl get deployment -n=production
    kubectl get pods -n=production
    ```

    Production ingin menjalankan cattle, mari kita buat beberapa pod cattle.

    ```shell
    kubectl create deployment cattle --image=k8s.gcr.io/serve_hostname -n=production
    kubectl scale deployment cattle --replicas=5 -n=production

    kubectl get deployment -n=production
    ```
    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    cattle       5/5     5            5           10s
    ```

    ```shell
    kubectl get pods -l app=cattle -n=production
    ```
    ```
    NAME                      READY     STATUS    RESTARTS   AGE
    cattle-2263376956-41xy6   1/1       Running   0          34s
    cattle-2263376956-kw466   1/1       Running   0          34s
    cattle-2263376956-n4v97   1/1       Running   0          34s
    cattle-2263376956-p5p3i   1/1       Running   0          34s
    cattle-2263376956-sxpth   1/1       Running   0          34s
    ```

Sampai titik ini, seharusnya sudah jelas bahwa sumber daya yang dibuat pengguna di sebuah namespace disembunyikan dari namespace lainnya

Seiring dengan evolusi dukungan kebijakan di kubernetes, kami akan memperluas skenario ini untuk menunjukkan bagaimana kamu bisa menyediakan aturan otorisasi yang berbeda untuk tiap namespace.


<!-- discussion -->

## Memahami motivasi penggunaan namespace

Sebuah klaster tunggal umumnya bisa memenuhi kebutuhan pengguna yang berbeda atau kelompok pengguna (itulah sebabnya disebut 'komunitas pengguna').

_namespace_ Kubernetes membantu proyek-proyek, tim-tim dan pelanggan yang berbeda untuk berbagi klaster Kubernetes.

Ini dilakukan dengan menyediakan hal berikut:

1. Cakupan untuk [Names](/docs/concepts/overview/working-with-objects/names/).
2. Sebuah mekanisme untuk memasang otorisasi dan kebijakan untuk bagian dari klaster.

Penggunaan namespace berbeda merupakan hal opsional.

Tiap komunitas pengguna ingin bisa bekerja secara terisolasi dari komunitas lainnya.

Tiap komunitas pengguna memiliki hal berikut sendiri:

1. sumber daya (pods, services, pengendali replikasi, dll.)
2. kebijakan (siapa yang bisa atau tidak bisa melakukan hal tertentu di komunitasnya)
3. batasan (komunitas ini diberi kuota sekian, dll.)

Seorang operator klaster dapat membuat sebuah Namespace untuk tiap komunitas user unik.

Namespace tersebut memberikan cakupan unik untuk:

1. sumber daya yang diberi nama (untuk menghindari benturan penamaan mendasar)
2. otoritas pengelolaan terdelegasi untuk pengguna yang dipercaya
3. kemampuan untuk membatasi konsumsi sumber daya komunitas

Contoh penggunaan mencakup

1. Sebagai operator klaster, aku ingin mendukung beberapa komunitas pengguna di sebuah klaster.
2. Sebagai operator klaster, aku ingin mendelegasikan otoritas untuk mempartisi klaster ke pengguna terpercaya di komunitasnya.
3. Sebagai operator klaster, aku ingin membatasi jumlah sumberdaya yang bisa dikonsumsi komunitas dalam rangka membatasi dampak ke komunitas lain yang menggunakan klaster yang sama.
4. Sebagai pengguna klaster, aku ingin berinteraks dengan sumber daya yang berkaitan dengan komunitas penggunaku secara terisolasi dari apa yang dilakukan komunitas lain di klaster yang sama.

## Memahami namespace dan DNS

Ketika kamu membuat sebuah [Layanan](/docs/concepts/services-networking/service/), akan terbentuk [entri DNS](/docs/concepts/services-networking/dns-pod-service/) untuk layanan tersebut.
Entri DNS ini dalam bentuk `<service-name>.<namespace-name>.svc.cluster.local`, yang berarti jika sebuah kontainer hanya menggunakan `<service-name>` makan dia akan me-_resolve_ ke layanan yang lokal dalam namespace yang sama. Ini berguna untuk menggunakan konfigurasi yang sama di namespace yang berbeda seperti _Development_, _Staging_ dan _Production_.  Jika kami ingin menjangkau lintas namespace, kamu harus menggunakan _fully qualified domain name_ (FQDN).



## {{% heading "whatsnext" %}}

* Pelajari lebih lanjut mengenai [pengaturan preferensi namespace preference](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference).
* Pelajari lebih lanjut mengenai [pengaturan namespace untuk sebuah permintaan](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)
* Baca [desain namespaces](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/architecture/namespaces.md).



