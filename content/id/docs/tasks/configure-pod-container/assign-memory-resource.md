---
title: Menetapkan Sumber Daya Memori untuk Container dan Pod
content_type: task
weight: 10
---

<!-- overview -->

Laman ini menunjukkan bagaimana menetapkan permintaan dan batasan memori untuk Container.
Container dijamin memiliki memori sebanyak yang diminta,
tetapi tidak diperbolehkan untuk menggunakan memori melebihi batas.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Setiap Node pada klaster kamu harus memiliki memori setidaknya 300 MiB.

Beberapa langkah pada laman ini mengharuskan kamu menjalankan Service
[_metrics-server_](https://github.com/kubernetes-incubator/metrics-server)
pada klaster kamu. Jika kamu memiliki _metrics-server_
yang sudah berjalan, kamu dapat melewati langkah-langkah berikut ini.

Jika kamu menjalankan Minikube, jalankan perintah berikut untuk mengaktifkan
_metrics-server_:

```shell
minikube addons enable metrics-server
```

Untuk melihat apakah _metrics-server_ sudah berjalan, atau penyedia lain dari API metrik sumber daya
(`metrics.k8s.io`), jalankan perintah berikut ini:

```shell
kubectl get apiservices
```

Jika API metrik sumber daya telah tersedia, keluarannya meliputi seperti
acuan pada `metrics.k8s.io`.

```shell
NAME
v1beta1.metrics.k8s.io
```



<!-- steps -->

## Membuat Namespace

Buat Namespace sehingga sumber daya yang kamu buat dalam latihan ini 
terisolasi dari klaster kamu yang lain.

```shell
kubectl create namespace mem-example
```

## Menentukan permintaan memori dan batasan memori

Untuk menentukan permintaan memori untuk Container, sertakan _field_ `resources:requests`
pada manifes sumber daya dari Container. Untuk menentukan batasan memori, sertakan `resources:limits`.

Dalam latihan ini, kamu akan membuat Pod yang memiliki satu Container. Container memiliki permintaan memori
sebesar 100 MiB dan batasan memori sebesar 200 MiB. Berikut berkas konfigurasi
untuk Pod:

{{% codenew file="pods/resource/memory-request-limit.yaml" %}}

Bagian `args` dalam berkas konfigurasi memberikan argumen untuk Container pada saat dimulai.
Argumen`"--vm-bytes", "150M"` memberi tahu Container agar mencoba mengalokasikan memori sebesar 150 MiB.

Buatlah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Verifikasi apakah Container dalam Pod sudah berjalan:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

Lihat informasi mendetil tentang Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

Keluarannya menunjukkan bahwa satu Container dalam Pod memiliki permintaan memori sebesar 100 MiB
dan batasan memori sebesar 200 MiB.

```yaml
...
resources:
  limits:
    memory: 200Mi
  requests:
    memory: 100Mi
...
```

Jalankan `kubectl top` untuk mengambil metrik dari Pod:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

Keluarannya menunjukkan bahwa Pod menggunakan memori sekitar 162.900.000 byte, dimana
sekitar 150 MiB. Ini lebih besar dari permintaannya sebesar 100 MiB Pod, tetapi masih di dalam
batasan Pod sebesar 200 MiB.


```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Hapuslah Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## Melebihi batasan memori dari Container

Container dapat melebihi permintaan memorinya jika Node memiliki memori yang tersedia. Tapi sebuah Container
tidak diperbolehkan untuk menggunakan lebih dari batasan memorinya. Jika Container mengalokasikan lebih banyak memori daripada
batasannya, Container menjadi kandidat untuk dihentikan. Jika Container terus berlanjut
mengkonsumsi memori melebihi batasnya, maka Container akan diakhiri. Jika Container dihentikan dan bisa
di mulai ulang, kubelet akan memulai ulang, sama seperti jenis kegagalan _runtime_ yang lainnya.

Dalam latihan ini, kamu membuat Pod yang mencoba mengalokasikan lebih banyak memori dari batasannya.
Berikut adalah berkas konfigurasi untuk Pod yang memiliki satu Container dengan berkas
permintaan memori sebesar 50 MiB dan batasan memori sebesar 100 MiB:

{{% codenew file="pods/resource/memory-request-limit-2.yaml" %}}

Dalam bagian `args` dari berkas konfigurasi, kamu dapat melihat bahwa Container tersebut
akan mencoba mengalokasikan memori sebesar 250 MiB, yang jauh di atas batas yaitu 100 MiB.

Buatlah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

Lihat informasi mendetail tentang Pod:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

Sampai sini, Container mungkin sedang berjalan atau dimatikan. Ulangi perintah sebelumnya hingga Container dimatikan:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Dapatkan tampilan yang lebih mendetail tentang status Container:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

Keluarannya menunjukkan bahwa Container dimatikan karena kehabisan memori (OOM):

```shell
lastState:
   terminated:
     containerID: docker://65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

Container dalam latihan ini dapat dimulai ulang, sehingga kubelet akan memulai ulangnya. Ulangi
perintah ini beberapa kali untuk melihat bahwa Container berulang kali dimatikan dan dimulai ulang:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

Keluarannya menunjukkan bahwa Container dimatikan, dimulai ulang, dimatikan lagi, dimulai ulang lagi, dan seterusnya:

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

Lihat informasi mendetail tentang riwayat Pod:

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```


Keluarannya menunjukkan bahwa Container dimulai dan gagal berulang kali:

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

Lihat informasi mendetail tentang Node klaster Anda:

```
kubectl describe nodes
```

Keluarannya mencakup rekaman Container yang dimatikan karena kondisi kehabisan memori:


```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Hapus Pod kamu:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## Menentukan permintaan memori yang terlalu besar untuk Node kamu

Permintaan dan batasan memori yang dikaitkan dengan Container, berguna untuk berpikir
apakah sebuah Pod yang memiliki permintaan dan batasan memori. Permintaan memori untuk Pod tersebut adalah
jumlah permintaan memori untuk semua Container dalam Pod. Begitu juga dengan batasan memori
untuk Pod adalah jumlah batasan memori dari semua Container di dalam Pod.

Penjadwalan Pod didasarkan pada permintaan. Sebuah Pod dijadwalkan untuk berjalan di sebuah Node hanya jika sebuah Node
memiliki cukup memori yang tersedia untuk memenuhi permintaan memori dari Pod tersebut.

Dalam latihan ini, kamu membuat Pod yang memiliki permintaan memori yang sangat besar sehingga melebihi
kapasitas dari Node mana pun dalam klaster kamu. Berikut adalah berkas konfigurasi untuk Pod yang memiliki
Container dengan permintaan memori 1000 GiB, yang kemungkinan besar melebihi kapasitas
dari setiap Node dalam klaster kamu.

{{% codenew file="pods/resource/memory-request-limit-3.yaml" %}}

Buatlah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

Lihat status Pod:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

Keluarannya menunjukkan bahwa status Pod adalah PENDING. Artinya, Pod tidak dijadwalkan untuk berjalan di Node mana pun, dan Pod akan tetap dalam status PENDING tanpa batas waktu:

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

Lihat informasi mendetail tentang Pod, termasuk _event_:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

Keluarannya menunjukkan bahwa Container tidak dapat dijadwalkan karena memori yang tidak cukup pada Node:

```shell
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## Satuan Memori

Sumber daya memori diukur dalam satuan _byte_. Kamu dapat mengekspresikan memori sebagai bilangan bulat biasa atau
bilangan bulan _fixed-point_ dengan salah satu akhiran ini: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
Contoh berikut ini mewakili nilai yang kira-kira sama:

```shell
128974848, 129e6, 129M , 123Mi
```

Hapuslah Pod kamu:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## Jika kamu tidak menentukan batasan memori

Jika kamu tidak menentukan batasan memori untuk sebuah Container, salah satu dari situasi berikut ini berlaku:

* Container tidak memiliki batasan maksimum jumlah memori yang digunakannya. Container
dapat menggunakan semua memori yang tersedia dalam Node dimana Container itu berjalan yang pada gilirannya dapat memanggil penyetop OOM (_out-of-memory_).
Lebih lanjut, dalam kasus menghentikan OOM, Container tanpa batas sumber daya akan memiliki peluang lebih besar untuk dihentikan.

* Container berjalan pada Namespace yang memiliki batasan bawaan memori, dan
Container secara otomatis menetapkan batasan bawaan. Administrator klaster dapat menggunakan
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
untuk menentukan batasan memori secara bawaan.

## Motivasi untuk permintaan dan batasan memori

Dengan mengonfigurasi permintaan dan batasan memori untuk Container yang berjalan pada berkas
klaster, kamu dapat menggunakan sumber daya memori yang tersedia pada Node klaster kamu secara efisien.
Dengan menjaga permintaan memori pada Pod tetap rendah, kamu memberikan kesempatan yang baik untuk Pod tersebut
dijadwalkan. Dengan memiliki batas memori yang lebih besar dari permintaan memori, Anda mencapai dua hal:

* Pod dapat memiliki aktivitas yang bersifat _burst_ dengan memanfaatkan memori yang kebetulan tersedia.
* Jumlah memori yang dapat digunakan Pod selama keadaan _burst_ dibatasi pada jumlah yang wajar.

## Membersihkan

Hapus Namespace kamu. Ini akan menghapus semua Pod yang kamu buat untuk tugas ini:

```shell
kubectl delete namespace mem-example
```



## {{% heading "whatsnext" %}}


### Untuk pengembang aplikasi

* [Menetapkan sumber daya CPU ke Container dan Pod](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Mengonfigurasi _Quality of Service_ untuk Pod](/docs/tasks/configure-pod-container/quality-service-pod/)

### Untuk administrator klaster

* [Mengonfigurasi permintaan dan batasan bawaan memori untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Mengonfigurasi permintaan dan batasan bawaan CPU untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Mengonfigurasi batasan memori minimum dan maksimum untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Mengonfigurasi batasan CPU minimum dan maksimum untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Mengonfigurasi kuota CPU dan memori untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Mengonfigurasi kuota Pod untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Mengonfigurasi kuota untuk objek API](/id/docs/tasks/administer-cluster/quota-api-object/)





