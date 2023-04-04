---
title: Membagi sebuah Klaster dengan Namespace
content_type: task
---

<!-- overview -->
Laman ini menunjukkan bagaimana cara melihat, menggunakan dan menghapus {{< glossary_tooltip text="namespaces" term_id="namespace" >}}. Laman ini juga menunjukkan bagaimana cara menggunakan Namespace Kubernetes namespaces untuk membagi klaster kamu.


## {{% heading "prerequisites" %}}

* Memiliki [Klaster Kubernetes](/id/docs/setup/).
* Memiliki pemahaman dasar [_Pod_](/id/docs/concepts/workloads/pods/pod/), [_Service_](/id/docs/concepts/services-networking/service/), dan [_Deployment_](/id/docs/concepts/workloads/controllers/deployment/) dalam Kubernetes.


<!-- steps -->

## Melihat Namespace

1. Untuk melihat Namespace yang ada saat ini pada sebuah klaster anda bisa menggunakan:

```shell
kubectl get namespaces
```
```
NAME          STATUS    AGE
default       Active    11d
kube-system   Active    11d
kube-public   Active    11d
```

Kubernetes mulai dengan tiga Namespace pertama:

   * `default` Namespace bawaan untuk objek-objek yang belum terkait dengan Namespace lain
   * `kube-system` Namespace untuk objek-objek yang dibuat oleh sistem Kubernetes
   * `kube-public` Namespace ini dibuat secara otomatis dan dapat dibaca oleh seluruh pengguna (termasuk yang tidak terotentikasi). Namespace ini sering dicadangkan untuk kepentingan klaster, untuk kasus dimana beberapa sumber daya seharusnya dapat terlihat dan dapat terlihat secara publik di seluruh klaster. Aspek publik pada Namespace ini hanya sebuah konvensi bukan suatu kebutuhan.

Kamu bisa mendapat ringkasan Namespace tertentu dengan menggunakan:

```shell
kubectl get namespaces <name>
```

Atau kamu bisa mendapatkan informasi detail menggunakan:

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

Sebagai catatan, detail diatas menunjukkan baik kuota sumber daya (jika ada) dan juga jangkauan batas sumber daya.

Kuota sumber daya melacak penggunaan total sumber daya didalam Namespace dan mengijinkan operator-operator klaster mendefinisikan batas atas penggunaan sumber daya yang dapat di gunakan sebuah Namespace.

Jangkauan batas mendefinisikan pertimbangan min/maks jumlah sumber daya yang dapat di gunakan oleh sebuah entitas dalam sebuah Namespace.

Lihatlah [Kontrol Admisi: Rentang Batas](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)

Sebuah Namespace dapat berada dalam salah satu dari dua buah fase:

   * `Active` Namespace sedang digunakan
   * `Terminating` Namespace sedang dihapus dan tidak dapat digunakan untuk objek-objek baru

Lihat [dokumentasi desain](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#phases) untuk detil lebih lanjut.

## Membuat sebuah Namespace baru

{{< note >}}
    Hindari membuat Namespace dengan awalan `kube-`, karena awalan ini dicadangkan untuk Namespace dari sistem Kubernetes.
{{< /note >}}

1. Buat berkas YAML baru  dengan nama `my-namespace.yaml` dengan isi berikut ini:

    ```yaml
    apiVersion: v1
    kind: Namespace
    metadata:
      name: <masukkan-nama-namespace-disini>
    ```
    Then run:
   
    ```
    kubectl create -f ./my-namespace.yaml
    ```

2. Sebagai alternatif, kamu bisa membuat Namespace menggunakan perintah dibawah ini:

    ```
    kubectl create namespace <masukkan-nama-namespace-disini>
    ``` 

Nama Namespace kamu harus merupakan 
[Label DNS](/docs/concepts/overview/working-with-objects/names#dns-label-names) yang valid.

Ada kolom opsional `finalizers`, yang memungkinkan _observables_ untuk membersihkan sumber daya ketika Namespace dihapus. Ingat bahwa jika kamu memberikan finalizer yang tidak ada, Namespace akan dibuat tapi akan berhenti pada status `Terminating` jika pengguna mencoba untuk menghapusnya.

Informasi lebih lanjut mengenai `finalizers` bisa dibaca pada [dokumentasi desain](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#finalizers) dari Namespace.

## Menghapus Namespace

Hapus Namespace dengan

```shell
kubectl delete namespaces <insert-some-namespace-name>
```

{{< warning >}}
Ini akan menghapus semua hal yang ada dalam Namespace!
{{< /warning >}}

Proses penghapusan ini asinkron, jadi untuk beberapa waktu kamu akan melihat Namespace dalam status `Terminating`.

## Membagi klaster kamu menggunakan Namespace Kubernetes

1. Pahami Namespace bawaan

    Secara bawaan, sebuah klaster Kubernetes akan membuat Namespace bawaan ketika menyediakan klaster untuk menampung Pod, Service, dan Deployment yang digunakan oleh klaster.
    
    Dengan asumsi kamu memiliki klaster baru, kamu bisa mengecek Namespace yang tersedia dengan melakukan hal berikut:

    ```shell
    kubectl get namespaces
    ```
    ```
    NAME      STATUS    AGE
    default   Active    13m
    ```

2. Membuat Namespace baru

	 Untuk latihan ini, kita akan membuat dua Namespace Kubernetes tambahan untuk menyimpan konten kita

    Dalam sebuah skenario dimana sebuah organisasi menggunakan klaster Kubernetes yang digunakan bersama untuk penggunaan pengembangan dan produksi:

    Tim pengembang ingin mengelola ruang di dalam klaster dimana mereka bisa melihat daftar Pod, Service, dan Deployment yang digunakan untuk membangun dan menjalankan apliksi mereka. Di ruang ini sumber daya akan datang dan pergi, dan pembatasan yang tidak ketat mengenai siapa yang bisa atau tidak bisa memodifikasi sumber daya untuk mendukung pengembangan secara gesit (_agile_).
    
    Tim operasi ingin mengelola ruang didalam klaster dimana mereka bisa memaksakan prosedur ketat mengenai siapa yang bisa atau tidak bisa melakukan manipulasi pada kumpulan Pod, Layanan, dan Deployment yang berjalan pada situs produksi.

    Satu pola yang bisa diikuti organisasi ini adalah dengan membagi klaster Kubernetes menjadi dua Namespace: `development` dan `production`

    Mari kita buat dua Namespace untuk menyimpan hasil kerja kita.

    Buat Namespace `development` menggunakan kubectl:

    ```shell
    kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
    ```

    Kemudian mari kita buat Namespace `production` menggunakan kubectl:

    ```shell
    kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
    ```

    Untuk memastikan apa yang kita lakukan benar, lihat seluruh Namespace dalam klaster.

    ```shell
    kubectl get namespaces --show-labels
    ```
    ```
    NAME          STATUS    AGE       LABELS
    default       Active    32m       <none>
    development   Active    29s       name=development
    production    Active    23s       name=production
    ```

3. Buat pod pada setiap Namespace

    Sebuah Namespace Kubernetes memberikan batasan untuk Pod, Service, dan Deployment dalam klaster.

    Pengguna yang berinteraksi dengan salah satu Namespace tidak melihat konten di dalam Namespace lain
    
    Untuk menunjukkan hal ini, mari kita jalankan Deployment dan Pod sederhana di dalam Namespace `development`.

    ```shell
    kubectl create deployment snowflake --image=registry.k8s.io/serve_hostname -n=development
    kubectl scale deployment snowflake --replicas=2 -n=development
    ```
    Kita baru aja membuat sebuah Deployment yang memiliki ukuran replika dua yang menjalankan Pod dengan nama `snowflake` dengan sebuah Container dasar yang hanya melayani _hostname_.
    

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

    Dan ini merupakan sesuatu yang bagus, dimana pengembang bisa melakukan hal yang ingin mereka lakukan tanpa harus khawatir hal itu akan mempengaruhi konten pada namespace `production`.
    
    Mari kita pindah ke Namespace `production` dan menujukkan bagaimana sumber daya di satu Namespace disembunyikan dari yang lain

    Namespace `production` seharusnya kosong, dan perintah berikut ini seharusnya tidak menghasilkan apapun.

    ```shell
    kubectl get deployment -n=production
    kubectl get pods -n=production
    ```

    `Production` Namespace ingin menjalankan `cattle`, mari kita buat beberapa Pod `cattle`.

    ```shell
    kubectl create deployment cattle --image=registry.k8s.io/serve_hostname -n=production
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

Sampai sini, seharusnya sudah jelas bahwa sumber daya yang dibuat pengguna pada sebuah Namespace disembunyikan dari Namespace lainnya.

Seiring dengan evolusi dukungan kebijakan di Kubernetes, kami akan memperluas skenario ini untuk menunjukkan bagaimana kamu bisa menyediakan aturan otorisasi yang berbeda untuk tiap Namespace.


<!-- discussion -->

## Memahami motivasi penggunaan Namespace

Sebuah klaster tunggal umumnya bisa memenuhi kebutuhan pengguna yang berbeda atau kelompok pengguna (itulah sebabnya disebut 'komunitas pengguna').

Namespace Kubernetes membantu proyek-proyek, tim-tim dan pelanggan yang berbeda untuk berbagi klaster Kubernetes.

Ini dilakukan dengan menyediakan hal berikut:

1. Cakupan untuk [Names](/id/docs/concepts/overview/working-with-objects/names/).
2. Sebuah mekanisme untuk memasang otorisasi dan kebijakan untuk bagian dari klaster.

Penggunaan Namespace berbeda merupakan hal opsional.

Tiap komunitas pengguna ingin bisa bekerja secara terisolasi dari komunitas lainnya.

Tiap komunitas pengguna memiliki hal berikut sendiri:

1. sumber daya (Pod, Service, ReplicationController, dll.)
2. kebijakan (siapa yang bisa atau tidak bisa melakukan hal tertentu dalam komunitasnya)
3. batasan (komunitas ini diberi kuota sekian, dll.)

Seorang operator klaster dapat membuat sebuah Namespace untuk tiap komunitas user yang unik.

Namespace tersebut memberikan cakupan yang unik untuk:

1. penamaan sumber daya (untuk menghindari benturan penamaan dasar)
2. pendelegasian otoritas pengelolaan untuk pengguna yang dapat dipercaya
3. kemampuan untuk membatasi konsumsi sumber daya komunitas

Contoh penggunaan mencakup

1. Sebagai operator klaster, aku ingin mendukung beberapa komunitas pengguna dalam sebuah klaster.
2. Sebagai operator klaster, aku ingin mendelegasikan otoritas untuk mempartisi klaster ke pengguna terpercaya di komunitasnya.
3. Sebagai operator klaster, aku ingin membatasi jumlah sumber daya yang bisa dikonsumsi komunitas dalam rangka membatasi dampak ke komunitas lain yang menggunakan klaster yang sama.
4. Sebagai pengguna klaster, aku ingin berinteraksi dengan sumber daya yang berkaitan dengan komunitas pengguna saya secara terisolasi dari apa yang dilakukan komunitas lain di klaster yang sama.

## Memahami Namespace dan DNS

Ketika kamu membuat sebuah [Service](/docs/concepts/services-networking/service/), akan terbentuk [entri DNS](/id/docs/concepts/services-networking/dns-pod-service/) untuk Service tersebut.
Entri DNS ini dalam bentuk `<service-name>.<namespace-name>.svc.cluster.local`, yang berarti jika sebuah Container hanya menggunakan `<service-name>` maka dia akan me-_resolve_ ke layanan yang lokal dalam Namespace yang sama. Ini berguna untuk menggunakan konfigurasi yang sama pada Namespace yang berbeda seperti _Development_, _Staging_ dan _Production_.  Jika kami ingin menjangkau antar Namespace, kamu harus menggunakan _fully qualified domain name_ (FQDN).



## {{% heading "whatsnext" %}}

* Pelajari lebih lanjut mengenai [pengaturan preferensi Namespace](/id/docs/concepts/overview/working-with-objects/namespaces/#pengaturan-preferensi-namespace).
* Pelajari lebih lanjut mengenai [pengaturan namespace untuk sebuah permintaan](/id/docs/concepts/overview/working-with-objects/namespaces/#pengaturan-namespace-untuk-sebuah-permintaan)
* Baca [desain Namespace](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/architecture/namespaces.md).


