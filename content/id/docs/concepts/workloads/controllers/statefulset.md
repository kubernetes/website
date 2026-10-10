---
title: StatefulSet
content_type: concept
weight: 40
---

<!-- overview -->

StatefulSet merupakan salah satu objek API _workload_ yang digunakan untuk aplikasi _stateful_.

{{< note >}}
StatefulSet merupakan fitur stabil (GA) sejak versi 1.9.
{{< /note >}}

{{< glossary_definition term_id="statefulset" length="all" >}}


<!-- body -->

## Menggunakan StatefulSet

StatefulSet akan sangat bermanfaat apabila digunakan untuk aplikasi 
yang membutuhkan salah satu atau beberapa fungsi berikut.

* Memiliki identitas jaringan unik yang stabil.
* Penyimpanan persisten yang stabil.
* Mekanisme _scaling_ dan _deployment_ yang _graceful_ tertara berdasarkan urutan.
* Mekanisme _rolling update_ yang otomatis berdasarkan urutan.

Stabil dalam poin-poin di atas memiliki arti yang sama dengan persisten pada 
Pod saat dilakukan _(re)scheduling_. Jika suatu aplikasi tidak membutuhkan 
identitas yang stabil atau _deployment_ yang memiliki urutan, penghapusan, atau 
mekanisme _scaling_, kamu harus melakukan _deploy_ aplikasi dengan _controller_ yang menyediakan 
replika _stateless_. _Controller_ seperti  [Deployment](/id/docs/concepts/workloads/controllers/deployment/) atau 
[ReplicaSet](/id/docs/concepts/workloads/controllers/replicaset/) akan lebih sesuai dengan kebutuhan kamu.

## Keterbatasan

* StatefulSet merupakan sumber daya beta sebelum 1.9 dan tidak tersedia 
  pada Kubernetes rilis sebelum versi 1.5.
* Penyimpanan untuk sebuah Pod harus terlebih dahulu di-_provision_ dengan menggunakan sebuah [Provisioner PersistentVolume](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/persistent-volume-provisioning/README.md) berdasarkan `storage class` yang dispesifikasikan, atau sudah ditentukan sebelumnya oleh administrator.
* Menghapus dan/atau _scaling_ sebuah StatefulSet *tidak akan* menghapus volume yang berkaitan dengan StatefulSet tersebut. Hal ini dilakukan untuk menjamin data yang disimpan, yang secara umum dinilai lebih berhaga dibandingkan dengan mekanisme penghapusan data secara otomatis pada sumber daya terkait.
* StatefulSet saat ini membutuhkan sebuah [Headless Service](/id/docs/concepts/services-networking/service/#headless-services) yang nantinya akan bertanggung jawab terhadap pada identitas jaringan pada Pod. Kamulah yang bertanggung jawab untuk membuat Service tersebut.
* StatefulSet tidak menjamin terminasi Pod ketika sebuah StatefulSet dihapus. Untuk mendapatkan terminasi Pod yang terurut dan _graceful_ pada StatefulSet, kita dapat melakukan _scale down_ Pod ke 0 sebelum penghapusan. 
* Ketika menggunakan [Rolling Update](#mekanisme-strategi-update-rolling-update) dengan 
  [Kebijakan Manajemen Pod](#kebijakan-manajemen-pod) (`OrderedReady`) secara default,
  hal ini memungkinkan untuk mendapatkan _state_ yang lebih terperinci yang membutuhkan 
  [mekanisme intervensi manual untuk perbaikan](#forced-rollback).

## Komponen-Komponen
Contoh di bawah ini akna menunjukkan komponen-komponen penyusun StatefulSet.

* Sebuah Service Headless, dengan nama nginx, digunakan untuk mengontrol domain jaringan.
* StatefulSet, dengan nama web, memiliki Spek yang mengindikasikan terdapat 3 replika Container yang akan dihidupkan pada Pod yang unik.
* _Field_ `volumeClaimTemplates` akan menyediakan penyimpanan stabil menggunakan [PersistentVolume](/id/docs/concepts/storage/persistent-volumes/) yang di-_provision_ oleh sebuah Provisioner PersistentVolume.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # harus sesuai dengan .spec.template.metadata.labels
  serviceName: "nginx"
  replicas: 3 # nilai default-nya adalah 1
  template:
    metadata:
      labels:
        app: nginx # harus sesuai dengan .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: registry.k8s.io/nginx-slim:0.8
        ports:
        - containerPort: 80
          name: web
        volumeMounts:
        - name: www
          mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: "my-storage-class"
      resources:
        requests:
          storage: 1Gi
```

## _Selector_ Pod
Kamu harus menspesifikasikan _field_ `.spec.selector` dari sebuah StatefulSet untuk menyesuaikan dengan label yang ada pada `.spec.template.metadata.labels`. Sebelum Kubernetes 1.8, _field_ `.spec.selector` dapat diabaikan. Sejak versi 1.8 dan versi selanjutnya, apabila tidak terdapat _selector_ Pod yang sesuai maka akan menghasilkan eror pada validasi pembuatan StatefulSet.

## Identitas Pod
Pod pada StatefulSet memiliki identitas unik yang tersusun berdasarkan skala ordinal, sebuah 
identitas jaringan yang stabil, serta penyimpanan yang stabil. Identitas yang ada pada Pod 
ini akan tetap melekat, meskipun Pod tersebut dilakukan _(re)schedule_ pada Node yang berbeda.

### Indeks Ordinal

Untuk sebuah StatefulSet dengan N buah replika, setiap Pod di dalam StatefulSet akan 
diberi nama pada suatu indeks ordinal tertentu, dari 0 hingga N-1, yang unik pada Set ini.

### ID Jaringan yang Stabil

Setiap Pod di dalam StatefulSet memiliki _hostname_ diturunkan dari nama SatetulSet tersebut 
serta ordinal Pod tersebut. Pola pada _hostname_ yang terbentuk adalah 
`$(statefulset name)-$(ordinal)`. Contoh di atas akan menghasilkan tiga Pod 
dengan nama `web-0,web-1,web-2`.
Sebuah StatefulSet dapat menggunakan sebuah [Service Headless](/id/docs/concepts/services-networking/service/#headless-services)
untuk mengontrol domain dari Pod yang ada. Domain yang diatur oleh Service ini memiliki format:
`$(service name).$(namespace).svc.cluster.local`, dimana "cluster.local" merupakan 
domain klaster.
Seiring dibuatnya setiap Pod, Pod tersebut akan memiliki subdomain DNS-nya sendiri, yang memiliki format:
`$(podname).$(governing service domain)`, dimana Service yang mengatur didefinisikan oleh 
_field_ `serviceName` pada StatefulSet.

Seperti sudah disebutkan di dalam bagian [keterbatasan](#keterbatasan), kamulah yang bertanggung jawab 
untuk membuat [Service Headless](/id/docs/concepts/services-networking/service/#headless-services)
yang bertanggung jawab terhadap identitas jaringan pada Pod.

Di sini terdapat beberapa contoh penggunaan Domain Klaster, nama Service, 
nama StatefulSet, dan bagaimana hal tersebut berdampak pada nama DNS dari Pod StatefulSet.

Domain Klaster | Service (ns/nama) | StatefulSet (ns/nama)  | Domain StatefulSet  | DNS Pod | Hostname Pod |
-------------- | ----------------- | ----------------- | -------------- | ------- | ------------ |
 cluster.local | default/nginx     | default/web       | nginx.default.svc.cluster.local | web-{0..N-1}.nginx.default.svc.cluster.local | web-{0..N-1} |
 cluster.local | foo/nginx         | foo/web           | nginx.foo.svc.cluster.local     | web-{0..N-1}.nginx.foo.svc.cluster.local     | web-{0..N-1} |
 kube.local    | foo/nginx         | foo/web           | nginx.foo.svc.kube.local        | web-{0..N-1}.nginx.foo.svc.kube.local        | web-{0..N-1} |

{{< note >}}
Domain klaster akan diatur menjadi `cluster.local` kecuali
[nilainya dikonfigurasi](/id/docs/concepts/services-networking/dns-pod-service/).
{{< /note >}}

### Penyimpanan Stabil

Kubernetes membuat sebuah [PersistentVolume](/id/docs/concepts/storage/persistent-volumes/) untuk setiap 
VolumeClaimTemplate. Pada contoh nginx di atas, setiap Pod akan menerima sebuah PersistentVolume
dengan StorageClass `my-storage-class` dan penyimpanan senilai 1 GiB yang sudah di-_provisioning_. Jika tidak ada StorageClass
yang dispesifikasikan, maka StorageClass _default_ akan digunakan. Ketika sebuah Pod dilakukan _(re)schedule_
pada sebuah Node, `volumeMounts` akan me-_mount_ PersistentVolumes yang terkait dengan 
PersistentVolume Claim-nya. Perhatikan bahwa, PersistentVolume yang terkait dengan 
PersistentVolumeClaim dari Pod tidak akan dihapus ketika Pod, atau StatefulSet dihapus.
Penghapusan ini harus dilakukan secara manual.

### Label _Pod Name_

Ketika sebuah _controller_ StatefulSet membuat sebuah Pod, _controller_ ini akan menambahkan label, `statefulset.kubernetes.io/pod-name`, 
yang akan diaktifkan pada nama Pod. Label ini akan mengizinkan kamu untuk meng-_attach_ sebuah Service pada Pod spesifik tertentu.
di StatefulSet.

## Jaminan Deployment dan Mekanisme _Scaling_

* Untuk sebuah StatefulSet dengan N buah replika, ketika Pod di-_deploy_, Pod tersebut akan dibuat secara berurutan dengan urutan nilai {0..N-1}.
* Ketika Pod dihapus, Pod tersebut akan dihentikan dengan urutan terbalik, yaitu {N-1..0}.
* Sebelum operasi _scaling_ diaplikasikan pada sebuah Pod, semua Pod sebelum Pod tersebut haruslah sudah dalam status Running dan Ready.
* Sebelum sebuah Pod dihentikan, semua Pod setelah Pod tersebut haruslah sudah terlebih dahulu dihentikan.

StatefulSet tidak boleh menspesifikasikan nilai dari `pod.Spec.TerminationGracePeriodSeconds` menjadi 0. Hal ini tidaklah aman dan tidak disarankan. Untuk penjelasan lebih lanjut, silakan lihat [penghapusan paksa Pod pada StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

Ketika contoh nginx di atas dibuat, tiga Pod akan di-_deploy_ dengan urutan 
web-0, web-1, web-2. web-1 tidak akan di-_deploy_ sebelum web-0 berada dalam status 
[Running dan Ready](/docs/user-guide/pod-states/), dan web-2 tidak akan di-_deploy_ sebelum
web-1 berada dalam status Running dan Ready. Jika web-0 gagal, setelah web-1 berada dalam status Running and Ready, 
tapi sebelum web-2 dibuat, maka web-2 tidak akan dibuat hingga web-0 sukses dibuat ulang dan 
berada dalam status Running dan Ready.

Jika seorang pengguna akan melakukan mekanisme _scale_ pada contoh di atas dengan cara melakukan _patch_,
pada StatefulSet sehingga `replicas=1`, maka web-2 akan dihentikan terlebih dahulu.
web-1 tidak akan dihentikan hingga web-2 benar-benar berhenti dan dihapus. 
Jika web-0 gagal setelah web-2 diterminasi dan berada dalam status mati, 
tetapi sebelum web-1 dihentikan, maka web-1 tidak akan dihentikan hingga 
web-0 berada dalam status Running dan Ready.

### Kebijakan Manajemen Pod

Pada Kubernetes versi 1.7 dan setelahnya, StatefulSet mengizinkan kamu untuk 
melakukan mekanisme urutan tadi menjadi lebih fleksibel dengan tetap 
menjamin keunikan dan identitas yang ada melalui _field_ `.spec.podManagementPolicy`.

#### Manajemen OrderedReady pada Pod

Manajemen `OrderedReady` pada Pod merupakan nilai default dari StatefulSet. 
Hal ini akan mengimplementasikan perilaku yang dijelaskan [di atas](#jaminan-deployment-dan-mekanisme-scaling).

#### Manajemen Pod secara Paralel

Manajemen Pod secara `paralel` akan menyebabkan kontroler StatefulSet untuk 
memulai atau menghentikan semua Pod yang ada secara paralel, dan tidak 
menunggu Pod berada dalam status Running dan Ready atau sudah dihentikan secara menyeluruh 
sebelum me-_launch_ atau menghentikan Pod yang lain. Opsi ini hanya akan memengaruhi operasi 
_scaling_. Operasi pembaruan tidak akan terpengaruh.

## Strategi Update

Pada Kubernetes versi 1.7 dan setelahnya, _field_ `.spec.updateStrategy` pada StatefulSet 
memungkinkan-mu untuk melakukan konfigurasi dan menonaktifkan otomatisasi 
_rolling updates_ untuk container, label, resource request/limits, dan
annotation pada Pod yang ada di dalam sebuah StatefulSet.

### Mekanisme Strategi Update _On Delete_

Mekanisme strategi update `OnDelete` mengimplementasikan perilaku legasi (versi 1.6 dan sebelumnya). 
Ketika sebuah _field_ `.spec.updateStrategy.type` pada StatefulSet diubah menjadi `OnDelete` 
maka kontroler StatefulSet tidak akan secara otomatis melakukan update 
pada Pod yang ada di dalam StatefulSet tersebut. Pengguna haruslah secara manual 
melakukan penghapusan Pod agar kontroler membuat Pod baru yang mengandung modifikasi 
yang dibuat pada _field_ `.spec.template` StatefulSet.

### Mekanisme Strategi Update _Rolling Updates_

Mekanisme strategi update `RollingUpdate` mengimplementasikan otomatisasi _rolling update_ 
untuk Pod yang ada pada StatefulSet. Strategi inilah yang diterapkan ketika `.spec.updateStrategy` tidak dispesifikasikan. 
Ketika _field_ `.spec.updateStrategy.type` diubah nilainya menjadi `RollingUpdate`, maka 
kontroler StatefulSet akan menghapus dan membuat setiap Pod di dalam StatefulSet. Kemudian 
hal ini akan diterapkan dengan urutan yang sama dengan mekanisme terminasi Pod (dari nilai ordinal terbesar ke terkecil), 
yang kemudian akan melakukan update Pod satu per satu. Mekanisme ini akan memastikan sebuah Pod yang di-update 
berada dalam status Running dan Ready sebelum meng-update Pod dengan nilai ordinal lebih rendah.

#### Mekanisme Strategi Update dengan Partisi

Mekanisme strategi update `RollingUpdate` dapat dipartisi, dengan cara menspesifikasikan nilai 
dari `.spec.updateStrategy.rollingUpdate.partition`. Jika nilai dari _field_ ini dispesifikasikan, 
maka semua Pod dengan nilai ordinal yang lebih besar atau sama dengan nilai partisi akan diupdate ketika 
nilai `.spec.template` pada StatefulSet diubah. Semua Pod dengan nilai ordinal yang lebih kecil 
dari partisi tidak akan diupdate, dan, bahkan setelah Pod tersebut dihapus, Pod ini akan digantikan 
dengan Pod versi sebelumnya. Jika nilai `.spec.updateStrategy.rollingUpdate.partition` lebih besar dari 
nilai `.spec.replicas`, update pada `.spec.template` tidak akan dipropagasi pada Pod-Pod-nya.
Pada sebagian besar kasus, kamu tidak akan perlu menggunakan partisi, tapi hal tersebut 
akan sangat berguna apabila kamu ingin mekakukan mekanisme update _canary_.

#### Mekanisme Strategi Update yang Dipaksa (_Forced Rollback_)

Ketika menggunakan strategi update [Rolling Updates](#mekanisme-strategi-update-rolling-updates) dengan nilai default 
[Kebijakan Manajemen Pod](#kebijakan-manajemen-pod) (`OrderedReady`),
hal ini memungkinkan adanya kondisi _broken_ yang membutuhkan intervensi secara manual 
agar kondisi ini dapat diperbaiki.

Jika kamu melakukan update pada template Pod untuk konfigurasi 
yang tidak pernah berada dalam status Running dan Ready (sebagai contohnya, apabila terdapat kode _binary_ yang buruk atau error pada konfigurasi di level aplikasi),
maka StatefulSet akan menghentikan proses rollout dan berada dalam status _wait_.

Dalam kondisi ini, maka templat Pod tidak akan diubah secara otomatis pada konfigurasi sebelumnya 
Hal ini terjadi karena adanya [isu](https://github.com/kubernetes/kubernetes/issues/67250),
StatefulSet akan tetap berada dalam kondisi _wait_ untuk menunggu Pod yang bermasalah untuk menjadi Ready
(yang tidak akan terjadi) dan sebelum StatefulSet ini berusaha untuk melakukan _revert_ pada konfigurasi sebelumnya.

Setelah melakukan mekanisme _revert_ templat, kamu juga harus menghapus semua Pod di dalam 
StatefulSet tersebut yang telah berusaha untuk menggunakan konfigurasi yang _broken_. 
StatefulSet akan mulai membuat Pod dengan templat konfigurasi yang sudah di-_revert_.


## {{% heading "whatsnext" %}}


* Ikuti contoh yang ada pada [bagaimana cara melakukan deployi aplikasi stateful](/docs/tutorials/stateful-application/basic-stateful-set/).
* Ikuti contoh yang ada pada [bagaimana cara melakukan deploy Cassandra dengan StatefulSets](/docs/tutorials/stateful-application/cassandra/).


