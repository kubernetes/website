---
title: ReplicationController
feature:
  title: Reparasi otomatis
  anchor: Bagaimana Sebuah ReplicationController Bekerja
  description: >
    Mengulang dan menjalankan kembali kontainer yang gagal, mengganti dan menjadwalkan ulang ketika ada node yang mati, mematikan kontainer yang tidak memberikan respon terhadap health-check yang telah didefinisikan, dan tidak menunjukkannya ke klien sampai siap untuk digunakan.
    
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< note >}}
[`Deployment`](/docs/concepts/workloads/controllers/deployment/) yang mengonfigurasi [`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/) sekarang menjadi cara yang direkomendasikan untuk melakukan replikasi.
{{< /note >}}

Sebuah _ReplicationController_ memastikan bahwa terdapat sejumlah _pod_ yang sedang berjalan dalam suatu waktu tertentu. Dengan kata lain, ReplicationController memastikan bahwa sebuah pod atau satu set pod yang homogen selalu berjalan dan tersedia. 

{{% /capture %}}


{{% capture body %}}

## Bagaimana ReplicationController Bekerja

Jika terdapat terlalu banyak pod, maka ReplicationController akan membatasi dan mematikan pod-pod yang berlebih. Jika terdapat terlalu sedikit, maka ReplicationController akan memulai dan menjalankan pod-pod baru lainnya. Tidak seperti pod yang dibuat secara manual, pod-pod yang diatur oleh sebuah ReplicationController akan secara otomatis diganti jika mereka gagal, dihapus, ataupun dimatikan.
Sebagai contoh, pod-pod yang kamu miliki akan dibuat ulang dalam sebuah node setelah terjadi proses pemeliharaan seperti pembaruan kernel. Untuk alasan ini, maka kamu sebaiknya memiliki sebuah ReplicationController bahkan ketika aplikasimu membutuhkan hanya satu buah pod. Sebuah ReplicationController memiliki kemiripan dengan sebuah pengawas proses, tetapi alih-alih mengawasi sebuah proses individu pada sebuah node, ReplicationController mengawasi berbagai pod yang terdapat pada beberapa node. 

ReplicationController seringkali disingkat sebagai "rc" dalam diskusi, dan sebagai _shortcut_ dalam perintah kubectl.

Sebuah contoh sederhana adalah membuat sebuah objek ReplicationController untuk menjalankan sebuah _instance_ Pod secara berkelanjutan. Contoh pemakaian lainnya adalah untuk menjalankan beberapa replika identik dari sebuah servis yang direplikasi, seperti _web server_.

## Menjalankan Sebuah Contoh ReplicationController

Contoh ReplicationController ini mengonfigurasi tiga tiruan dari _web server_ nginx.

{{< codenew file="controllers/replication.yaml" >}}

Jalankan contoh di atas dengan mengunduh _file_ contoh dan menjalankan perintah ini:

```shell
kubectl apply -f https://k8s.io/examples/controllers/replication.yaml
```
```
replicationcontroller/nginx created
```

Periksa status dari ReplicationController menggunakan perintah ini:

```shell
kubectl describe replicationcontrollers/nginx
```
```
Name:        nginx
Namespace:   default
Selector:    app=nginx
Labels:      app=nginx
Annotations:    <none>
Replicas:    3 current / 3 desired
Pods Status: 0 Running / 3 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       app=nginx
  Containers:
   nginx:
    Image:              nginx
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen       LastSeen     Count    From                        SubobjectPath    Type      Reason              Message
  ---------       --------     -----    ----                        -------------    ----      ------              -------
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-qrm3m
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-3ntk0
  20s             20s          1        {replication-controller }                    Normal    SuccessfulCreate    Created pod: nginx-4ok8v
```

Tiga pod telah dibuat namun belum ada yang berjalan, dimungkinkan karena _image_ yang sedang di-_pull_.
Beberapa waktu kemudian, perintah yang sama akan menunjukkan:

```shell
Pods Status:    3 Running / 0 Waiting / 0 Succeeded / 0 Failed
```

Untuk melihat semua pod yang dibuat oleh ReplicationController dalam format yang lebih mudah dibaca mesin, kamu dapat menggunakan perintah seperti ini:

```shell
pods=$(kubectl get pods --selector=app=nginx --output=jsonpath={.items..metadata.name})
echo $pods
```
```
nginx-3ntk0 nginx-4ok8v nginx-qrm3m
```

Pada perintah di atas, selektor yang dimaksud adalah selektor yang sama dengan yang terdapat pada ReplicationController (yang dapat dilihat pada keluaran `kubectl describe`), dan dalam format yang berbeda dengan yang terdapat pada `replication.yaml`. Opsi `--output=jsonpath` menspesifikasi perintah untuh mendapatkan hanya nama dari setiap pod yang ada pada daftar hasil.


## Menulis Spesifikasi ReplicationController

Seperti semua konfirugasi Kubernetes lainnya, sebuah ReplicationController membutuhkan _field_ `apiVersion`, `kind`, dan `metadata`.

Untuk informasi umum mengenai _file_ konfigurasi, kamu dapat melihat [_object management_](/docs/concepts/overview/working-with-objects/object-management/).

Sebuah ReplicationController juga membutuhkan [bagian `.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Templat Pod

`.spec.template` adalah satu-satunya _field_ yang diwajibkan pada `.spec`.

`.spec.template` adalah sebuah [templat pod](/docs/concepts/workloads/pods/pod-overview/#pod-templates). Ia memiliki skema yang sama persis dengan sebuah [pod](/docs/concepts/workloads/pods/pod/), namun dapat berbentuk _nested_ dan tidak memiliki _field_ `apiVersion` ataupun `kind`.

Selain _field-field_ yang diwajibkan untuk sebuah Pod, template pod pada ReplicationControll harus menspesifikasi label dan kebijakan pengulangan kembali yang tepat. Untuk label, pastikan untuk tidak tumpang tindih dengan kontroler lain. Lihat [selektor pod](#selektor-pod).

Nilai yang diperbolehkan untuk [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) hanyalah `Always`, yaitu nilai _default_ jika tidak dispesifikasi.

Untuk pengulangan kembali dari sebuah kontainer lokal, ReplicationController mendelegasikannya ke agen pada node, contohnya [Kubelet](/docs/admin/kubelet/) atau Docker.

### Label pada ReplicationController

ReplicationController itu sendiri dapat memiliki label (`.metadata.labels`). Biasanya, kamu akan mengaturnya untuk memiliki nilai yang sama dengan `.spec.template.metadata.labels`; jika `.metadata.labels` tidak dispesifikasi maka akan menggunakan nilai _default_ yaitu `.spec.template.metadata.labels`.  Namun begitu, kedua label ini diperbolehkan untuk memiliki nilai yang berbeda, dan `.metadata.labels` tidak akan memengaruhi perilaku dari ReplicationController.

### Selektor Pod

_Field_ `.spec.selector` adalah sebuah [selektor label](/docs/concepts/overview/working-with-objects/labels/#label-selectors). Sebuah ReplicationController mengatur semua pod dengan label yang sesuai dengan nilai selektor tersebut. Ia tidak membedakan antara pod yang ia buat atau hapus atau pod yang dibuat atau dihapus oleh orang atau proses lain. Hal ini memungkinkan ReplicationController untuk digantikan tanpa memengaruhi pod-pod yang sedang berjalan.

Jika dispesifikasi, `.spec.template.metadata.labels` harus memiliki nilai yang sama dengan `.spec.selector`, atau akan ditolak oleh API. Jika `.spec.selector` tidak dispesifikasi, maka akan menggunakan nilai _default_ yaitu `.spec.template.metadata.labels`.

Selain itu, kamu juga tidak sebaiknya membuat pod dengan label yang cocok dengan selektor ini, baik secara langsung, dengan menggunakan ReplicationController lain, ataupun menggunakan kontroler lain seperti Job. Jika kamu melakukannya, ReplicationController akan menganggap bahwa ia telah membuat pod-pod lainnya. Kubernetes tidak akan menghentikan kamu untuk melakukan aksi ini.

Jika kamu pada akhirnya memiliki beberapa kontroler dengan selektor-selektor yang tumpang tindih, kamu harus mengatur penghapusannya sendiri (lihat [di bawah](#bekerja-dengan-replicationcontroller)).

### Beberapa Replika

Kamu dapat menspesifikasikan jumlah pod yang seharusnya berjalan secara konkuren dengan mengatur nilai `.spec.replicas` dengan jumlah pod yang kamu inginkan untuk berjalan secara konkuren. Jumlah yang berjalan dalam satu satuan waktu dapat lebih tinggi ataupun lebih rendah, seperti jika replika-replika tersebut melewati proses penambahan atau pengurangan, atau jika sebuah pod melalui proses _graceful shutdown_, dan penggantinya telah dijalankan terlebih dahulu.

Jika kamu tidak menspesifikasi nilai dari `.spec.replicas`, maka akan digunakan nilai _default_ 1.

## Bekerja dengan ReplicationController

### Menghapus Sebuah ReplicationController dan Pod-nya

Untuk menghapus sebuah ReplicationController dan pod-pod yang berhubungan dengannya, gunakan perintah  [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete). Kubectl akan mengatur ReplicationController ke nol dan menunggunya untuk menghapus setiap pod sebelum menghapus ReplicationController itu sendiri. Jika perintah kubectl ini terhenti, maka dapat diulang kembali.

Ketika menggunakan atau _library_ klien go, maka kamu butuh untuk melakukan langkah-langkahnya secara eksplisit (mengatur replika-replika ke 0, menunggu penghapusan pod, dan barulah menghapus ReplicationController).

### Menghapus Hanya ReplicationController

Kamu dapat menghapus ReplicationController tanpa memengaruhi pod-pod yang berhubungan dengannya.

Dengan menggunakan kubectl, spesifikasi opsi `--cascade=false` ke [`kubectl delete`](/docs/reference/generDeated/kubectl/kubectl-commands#delete).

Ketika menggunakan REST API atau _library_ klien go, cukup hapus objek ReplicationController.

Ketika ReplicationController yang asli telah dihapus,kamu dapat membuat ReplicationController yang baru sebagai penggantinya. Selama `.spec.selector` yang lama dan baru memiliki nilai yang sama, maka ReplicationController baru akan mengadopsi pod-pod yang lama.
Walaupun begitu, ia tidak akan melakukan usaha apapun untuk membuat pod-pod yang telah ada sebelumnya untuk sesuai dengan pod templat yang baru dan berbeda.
Untuk memerbaharui pod-pod ke spesifikasi yang baru dengan cara yang terkontrol, gunakan [pembaruan bergulir](#pembaruan-bergulir).

### Mengisolasi pod dari ReplicationController

Pod-pod dapat dihapus dari kumpulan target sebuah ReplicationController dengan menganti nilai dari labelnya. Teknik ini dapat digunakan untuk mencopot pod-pod dari servis untuk keperluan pengawakutuan, pemulihan data, dan lainnya. Pod-pod yang dicopot dengan cara ini dapat digantikan secara otomatis (dengan asumsi bahwa jumlah replika juga tidak berubah).

## Pola penggunaan umum

### Penjadwalan ulang

Seperti yang telah disebutkan sebelumnya, baik kamu memiliki hanya 1 pod untuk tetap dijalankan, ataupun 1000, ReplicationController akan memastikan ketersediaan dari sejumlah pod tersebut, bahkan ketika terjadi kegagalan node atau terminasi pod (sebagai contoh karena adanya aksi dari agen kontrol lain).

### Penskalaan

ReplicationController memudahkan penskalaan jumlah replika, baik meningkatkan ataupun mengurangi, secara manual ataupun dengan agen kontrol penskalaan otomatis, dengan hanya mengubah nilai dari _field_ `replicas`.

### Pembaruan bergulir

ReplicationController didesain untuk memfasilitasi pembaruan bergulir untuk sebuah servis dengan mengganti pod-pod satu per satu.

Seperti yang telah dijelaskan di [#1353](http://issue.k8s.io/1353), pendekatan yang direkomendasikan adalah dengan membuat ReplicationController baru dengan 1 replika, skala kontroler yang baru (+1) atau yang lama (-1) satu per satu, dan kemudian hapus kontroler lama setelah menyentuh angka 0 replika. Hal ini memungkinkan pembaruan dilakukan dengan dapat diprediksi terlepas dari adanya kegagalan yang tak terduga.

Idealnya, kontroler pembaruan bergulir akan memerhitungkan kesiapan dari aplikasi, dan memastikan ketersediaan pod dalam jumlah yang cukup secara produktif dalam satu satuan waktu tertentu.

Dua ReplicationController diharuskan untuk memiliki setidaknya satu label yang berbeda, seperti _tag_ _image_ dari kontainer utama dari pod, karena pembaruan bergulir biasanya dilakukan karena adanya pembaruan _image_.

Pembaruan bergulir diipmlementasikan pada kakas klien [`kubectl rolling-update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update). Lihat [`kubectl rolling-update` task](/docs/tasks/run-application/rolling-update-replication-controller/) untuk contoh-contoh yang lebih konkrit.

### Operasi rilis majemuk

Selain menjalankan beberapa rilis dari sebuah aplikasi ketika proses pembaruan bergulir sedang berjalan, merupakan hal yang sering terjadi untuk menjalankan beberapa rilis untuk suatu periode waktu tertentu, atau bahkan secara kontinu, menggunakan operasi rilis majemuk. Operasi-operasi ini akan dibedakan menggunakan label.

Sebagai contoh, sebuah servis dapat menyasar semua pod dengan `tier in (frontend), environment in (prod)`. Anggap kamu memiliki 10 pod tiruan yang membangun lapisan ini tetapi kamu ingin bisa menggunakan 'canary' terhadap versi baru dari komponen ini. Kamu dapat mengatur sebuah ReplicationController dengan nilai `replicas` 9 untuk replika-replikanya, dengan label `tier=frontend, environment=prod, track=stable`, dan ReplicationController lainnya dengan nilai `replicas` 1 untuk canary, dengan label `tier=frontend, environment=prod, track=canary`. Sekarang servis sudah mencakup baik canary maupun pod-pod yang bukan canary. Kamu juga dapat mencoba-coba ReplicationController secara terpisah untuk melakukan pengujian, mengamati hasilnya, dan lainnya.

### Menggunakan ReplicationController dengan Servis

Beberapa ReplicationController dapat ditempatkan untuk sebuah servis tunggal, sedemikian sehingga, sebagai contoh, sebagian _traffic_ dapat ditujukan ke versi lama, dan sebagian lainnya ke versi yang baru.

Sebuah ReplicationController tidak akan berhenti dengan sendirinya, namun ia tidak tidak diekspektasikan untuk berjalan selama servis-servis yang ada. Servis dapat terdiri dari berbagai pod yang dikontrol beberapa ReplicationController, dan terdapat kemungkinan bahwa beberapa ReplicationController untuk dibuat dan dimatikan dalam jangka waktu hidup servis (contohnya adalah untuk melakukan pembaruan pod-pod yang menjalankan servis). Baik servis itu sendiri dan kliennya harus tetap dalam keadaan tidak mempunyai pengetahuan terhadap ReplicationController yang memelihara pod-pod dari servis tersebut.

## Menulis program untuk Replikasi

Pod-pod yang dibuat oleh ReplicationController ditujukan untuk dapat sepadan dan memiliki semantik yang identik, walaupun konfigurasi mereka dapat berbeda seiring keberjalanan waktunya. Ini adalah contoh yang cocok untuk _server_ _stateless_ tiruan, namun ReplicationController juga dapat digunakan untuk memelihara ketersediaan dari _master-elected_, _sharded_, dan aplikasi _worker-pool_. Aplikasi-aplikasi seperti itu sebaiknya menggunakan mekanisme penetapan kerja yang dinamis, seperti [antrian kerja RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-two-python.html), berlainan dengan kustomisasi statik/satu kali dari konfigurasi setiap pod, yang dipandang sebagai sebuah _anti-pattern_. Kustomsasi apapun yang dilakukan terhadap pod, seperti _auto-sizing_ vertikal dari sumber daya (misalnya cpu atau memori), sebaiknya dilakukan oleh proses kontroller luring lainnya, dan bukan oleh ReplicationController itu sendiri.

## Tanggung Jawab ReplicationController

ReplicationController hanya memastikan ketersediaan dari sejumlah pod yang cocok dengan selektor label dan berjalan dengan baik. Saat ini, hanya pod yang diterminasi yang dijadikan pengecualian dari penghitungan. Kedepannya, [kesiapan](http://issue.k8s.io/620) dan informasi yang ada lainnya dari sistem dapat menjadi pertimbangan, kami dapat meningkatkan kontrol terhadap kebijakan penggantian, dan kami berencana untuk menginformasikan kejadian (_event_) yang dapat digunakan klien eksternal untuk implementasi penggantian yang sesuai dan/atau kebijakan pengurangan.

ReplicationController akan selalu dibatasi terhadap tanggung jawab spesifik ini. Ia tidak akan melakukan probe kesiapan atau keaktifan. Daripada melakukan _auto-scaling_, ia ditujukan untuk dikontrol oleh _auto-scaler_ eksternal (seperti yang didiskusikan pada [#492](http://issue.k8s.io/492)), yang akan mengganti _field_ `replicas`. Kami tidak akan menambahkan kebijakan penjadwalan (contohnya [_spreading_](http://issue.k8s.io/367#issuecomment-48428019)) untuk ReplicationController. Ia juga tidak seharusnya melakukan verifikasi terhadap pod-pod yang sedang dikontrol yang cocok dengan spesifikasi templat saat ini, karena hal itu dapat menghambat _auto-sizing_ dan proses otomatis lainnya. Demikian pula batas waktu penyelesaian, pengurutan _dependencies_, ekspansi konfigurasi, dan fitur-fitur lain yang seharusnya berada di komponen lain. Kami juga bahkan berencana untuk mengeluarkan mekanisme pembuatan pod secara serentak ([#170](http://issue.k8s.io/170)).

ReplicationController ditujukan untuk menjadi primitif komponen yang dapat dibangun untuk berbagai kebutuhan. Kami menargetkan API dengan tingkatan yang lebih tinggi dan/atau kakas-kakas untuk dibangun di atasnya dan primitif komplementer lainnya untuk kenyamanan pengguna kedepannya. Operasi-operasi makro yang sudah didikung oleh kubectl (_run_, _scale_, _rolling-update_) adalah contoh _proof-of-concept_ dari konsep ini. Sebagai contohnya, kita dapat menganggap sesuatu seperti [Asgard](http://techblog.netflix.com/2012/06/asgard-web-based-cloud-management-and.html) yang mengatur beberapa ReplicationController, _auto-scaler_, servis, kebijakan penjadwalan, canary, dan yang lainnya.


## Objek API

ReplicationController adalah sebuah sumber daya _top-level_ pada REST API Kubernetes. Detil dari objek API dapat ditemukan di: [objek API ReplicationController](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replicationcontroller-v1-core).

## Alternatif untuk ReplicationController

### ReplicaSet

[`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/) adalah kelanjutan dari ReplicationController yang mendukung selektor [selektor label _set-based_](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement) yang baru. Umumnya digunakan oleh [`Deployment`](/docs/concepts/workloads/controllers/deployment/) sebagai mekanisme untuk mengorkestrasi pembuatan, penghapusan, dan pembaruan pod.
Perhatikan bahwa kami merekomendasikan untuk menggunakan Deployment sebagai ganti menggunakan ReplicaSet secara langsung, kecuali jika kamu membutuhkan orkestrasi pembaruan kustom atau tidak membutuhkan pembaruan sama sekali.


### Deployment (Direkomendasikan)

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) adalah objek API tingkat tinggi yang memperbaharui ReplicaSet dan pod-pod di bawahnya yang mirip dengan cara kerja `kubectl rolling-update`. Deployment direkomendasikan jika kamu menginginkan fungsionalitas dari pembaruan bergulir ini, karena tidak seperti `kubectl rolling-update`, Deployment memiliki sifat deklaratif, _server-side_, dan memiliki beberapa fitur tambahan lainnya.

### Pod sederhana

Tidak seperti pada kasus ketika pengguna secara langsung membuat pod, ReplicationController menggantikan pod-pod yang dihapus atau dimatikan untuk alasan apapun, seperti pada kasus kegagalan node atau pemeliharaan node yang mengganggu, seperti pembaruan kernel. Untuk alasan ini, kami merekomendasikan kamu untuk menggunakan ReplicationController bahkan ketika aplikasimu hanya membutuhkan satu pod tunggal. Anggap hal ini mirip dengan pengawas proses, hanya pada kasus ini mengawasi berbagai pod yang terdapat pada berbagai node dan bukannya proses-proses tunggal pada satu node. ReplicationController mendelegasikan pengulangan kontainer lokal ke agen yang terdapat dalam node (contohnya Kubelet atau Docker).

### Job

Gunakan [`Job`](/docs/concepts/jobs/run-to-completion-finite-workloads/) sebagai ganti ReplicationController untuk pod-pod yang diharapkan diterminasi dengan sendirinya (seperti _batch jobs_).

### DaemonSet

Gunakan [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) sebagai ganti ReplicationController untuk pod-pod yang menyediakan fungsi pada level mesin, seperti pengamatan mesin atau pencatatan mesin. Pod-pod ini memiliki waktu hidup yang bergantung dengan waktu hidup mesin: pod butuh untuk dijalankan di mesin sebelum pod-pod lainnya dimulai, dan aman untuk diterminasi ketika mesin sudah siap untuk dinyalakan ulang atau dimatikan.

## Informasi lanjutan

Baca [Menjalankan Kontroler Replikasi AP _Stateless_](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/).

{{% /capture %}}
