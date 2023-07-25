---
title: Konfigurasi Quality of Service untuk Pod
content_type: task
weight: 30
---

Laman ini menunjukkan bagaimana mengonfigurasi Pod agar ditempatkan pada kelas _Quality of Service_ (QoS) tertentu.
Kubernetes menggunakan kelas QoS untuk membuat keputusan tentang
penjadwalan dan pengeluaran Pod.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## Kelas QoS  {#qos-classes}

Saat membuat Pod, Kubernetes menempatkan salah satu kelas QoS berikut untuknya:

* Guaranteed
* Burstable
* BestEffort


## Membuat sebuah Namespace

Buat sebuah Namespace sehingga sumber daya yang kamu buat dalam latihan ini
terisolasi dari klaster kamu yang lain.

```shell
kubectl create namespace qos-example
```

## Membuat sebuah Pod yang mendapatkan penempatan kelas QoS Guaranteed

Agar sebuah Pod memiliki kelas QoS Guaranteed:

* Setiap Container, termasuk Container pemulai, di dalam Pod harus memiliki batasan memori dan permintaan memori dengan nilai yang sama.
* Setiap Container, termasuk Container pemulai, di dalam Pod harus memiliki batasan CPU dan permintaan CPU dengan nilai yang sama.

Berikut adalah berkas konfigurasi untuk sebuah Pod dengan satu Container. Container tersebut memiliki sebuah batasan memori dan sebuah
permintaan memori, keduanya sama dengan 200MiB. Container itu juga mempunyai batasan CPU dan permintaan CPU yang sama sebesar 700 milliCPU:

{{< codenew file="pods/qos/qos-pod.yaml" >}}


Buatlah Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```


Tampilkan informasi detail Pod yang telah dibuat:

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```


Keluaran dari perintah di atas menunjukkan Kubernetes memberikan kelas QoS Guaranteed pada Pod. Keluaran tersebut juga 
membuktikan bahwa Container pada Pod memiliki permintaan memori yang sesuai dengan batasan memori dan permintaan CPU yang juga sesuai dengan batasan CPU yang dispesifikasikan.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
  ...
status:
  qosClass: Guaranteed
```

{{< note >}}
Jika sebuah Container hanya menspesifikasikan batasan memori tanpa menentukan permintaan memori, maka Kubernetes akan
secara otomatis menetapkan permintaan memori yang sesuai dengan batasan memori yang dicantumkan. Sama halnya jika sebuah Container menspesifikasikan batasan
CPU tanpa menentukan permintaan CPU, maka Kubernetes akan secara otomatis menetapkan permintaan CPU yang sesuai 
dengan batasan CPU yang dicantumkan.
{{< /note >}}


Hapuslah Pod:

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

## Membuat sebuah Pod yang mendapatkan penempatan kelas Qos Burstable
Sebuah Pod akan mendapatkan kelas QoS Burstable apabila:

* Pod tidak memenuhi kriteria untuk kelas QoS Guaranteed.
* Setidaknya ada satu Container di dalam Pod dengan permintaan memori atau CPU.

Berikut adalah berkas konfigurasi untuk Pod dengan satu Container. Container yang dimaksud memiliki batasan memori sebesar 200MiB
dan permintaan memori sebesar 100MiB.

{{< codenew file="pods/qos/qos-pod-2.yaml" >}}


Buatlah Pod:

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```


Tampilkan informasi detail Pod yang telah dibuat:

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```


Keluaran dari perintah di atas menunjukkan Kubernetes memberikan kelas QoS Burstable pada Pod.

```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  qosClass: Burstable
```

Hapuslah Pod:

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

## Membuat sebuah Pod yang mendapatkan penempatan kelas QoS BestEffort

Agar Pod mendapatkan kelas QoS BestEffort, Container dalam pod tidak boleh 
memiliki batasan atau permintaan memori atau CPU.

Berikut adalah berkas konfigurasi untuk Pod dengan satu Container. Container yang dimaksud tidak memiliki batasan atau permintaan memori atau CPU apapun.
{{< codenew file="pods/qos/qos-pod-3.yaml" >}}

Buatlah Pod:

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

Tampilkan informasi detail Pod yang telah dibuat:

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

Keluaran dari perintah di atas menunjukkan Kubernetes memberikan kelas QoS BestEffort pada Pod.

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

Hapuslah Pod:

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

## Membuat sebuah Pod yang memiliki dua Container

Berikut adalah konfigurasi berkas untuk Pod yang memiliki dua Container. Satu Container menentukan permintaan memori sebesar 200MiB. Container yang lain tidak menentukan permintaan atau batasan apapun.

{{< codenew file="pods/qos/qos-pod-4.yaml" >}}

Perhatikan bahwa Pod ini memenuhi kriteria untuk kelas QoS Burstable. Maksudnya, Container tersebut tidak memenuhi 
kriteria untuk kelas QoS Guaranteed, dan satu dari Container tersebut memiliki permintaan memori.

Buatlah Pod:

```shell
kubectl create -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

Tampilkan informasi detail Pod yang telah dibuat:

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

Keluaran dari perintah di atas menunjukkan Kubernetes memberikan kelas QoS Burstable pada Pod.

```yaml
spec:
  containers:
    ...
    name: qos-demo-4-ctr-1
    resources:
      requests:
        memory: 200Mi
    ...
    name: qos-demo-4-ctr-2
    resources: {}
    ...
status:
  qosClass: Burstable
```

Hapuslah Pod:

```shell
kubectl delete pod qos-demo-4 --namespace=qos-example
```

## Membersihkan

Hapuslah Namespace:

```shell
kubectl delete namespace qos-example
```

## {{% heading "whatsnext" %}}

### Untuk pengembang aplikasi

* [Menetapkan sumber daya memori ke Container dan Pod](/id/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Menetapkan permintaan CPU pada Container dan Pod](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Untuk administrator klaster

* [Mengonfigurasi permintaan dan batasan bawaan memori untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Mengonfigurasi permintaan dan batasan bawaan CPU untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Mengonfigurasi batasan memori minimum dan maksimum untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Mengonfigurasi batasan CPU minimum dan maksimum untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Mengonfigurasi kuota CPU dan memori untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Mengonfigurasi kuota Pod untuk Namespace](/id/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Mengonfigurasi kuota untuk objek API](/id/docs/tasks/administer-cluster/quota-api-object/)

* [Kebijakan Pengaturan Manajemen Topologi pada sebuah Node](/id/docs/tasks/administer-cluster/topology-manager/)