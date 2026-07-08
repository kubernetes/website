---
title: Resource Quota
content_type: concept
weight: 10
---

<!-- overview -->

Saat beberapa pengguna atau tim berbagi sebuah klaster dengan jumlah Node yang tetap,
ada satu hal yang perlu diperhatikan yaitu suatu tim dapat menggunakan sumber daya
lebih dari jatah yang mereka perlukan.

_Resource Quota_ (kuota sumber daya) adalah sebuah alat yang dapat digunakan oleh
administrator untuk mengatasi hal ini.



<!-- body -->

Sebuah Resource Quota, didefinisikan oleh objek API `ResourceQuota`, menyediakan batasan-batasan
yang membatasi konsumsi gabungan sumber daya komputasi untuk tiap Namespace. Resource Quota dapat
membatasi jumlah objek yang dapat dibuat dalam sebuah Namespace berdasarkan tipenya, maupun jumlah
seluruh sumber daya komputasi yang dapat dipakai oleh sumber daya API (misalnya Pod) di Namespace
tersebut.

Resource Quota bekerja sebagai berikut:

- Tim-tim berbeda bekerja pada Namespace yang berbeda pula. Sekarang hal ini belum diwajibkan,
  tetapi dukungan untuk mewajibkannya melalui ACL sedang direncanakan.
- Administrator membuat sebuah `ResourceQuota` untuk setiap Namespace.
- Para pengguna membuat sumber daya (Pod, Service, dll.) di dalam Namespace tersebut, kemudian
  sistem kuota memantau penggunaan untuk memastikan bahwa penggunaannya tidak melebihi batas
  sumber daya yang ditentukan di `ResourceQuota`.
- Jika pembuatan atau pembaruan sebuah sumber daya melanggar sebuah batasan kuota, maka permintaan
  tersebut akan gagal dengan kode status `403 FORBIDDEN` dengan sebuah pesan yang menjelaskan batasan
  yang akan dilanggar.
- Jika kuota diaktifkan di sebuah Namespace untuk sumber daya komputasi seperti `cpu` dan `memory`,
  pengguna-pengguna harus menentukan `requests` atau `limits` untuk sumber daya tersebut; atau sistem
  kuota akan menolak pembuatan Pod tersebut. Petunjuk: Gunakan Admission Controller `LimitRanger` untuk
  memaksa nilai-nilai bawaan untuk Pod-Pod yang tidak menentukan kebutuhan sumber daya komputasi.
  Lihat [petunjuknya](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/) untuk contoh bagaimana
  cara menghindari masalah ini.

Contoh-contoh kebijakan yang dapat dibuat menggunakan Namespace dan kuota adalah:

- Dalam sebuah klaster dengan kapasitas RAM 32 GiB, dan CPU 16 _core_, misalkan tim A menggunakan 20GiB
  dan 10 _core_, dan tim B menggunakan 10GiB dan 4 _core_, dan menyimpan 2GiB dan 2 _core_ untuk cadangan
  penggunaan di masa depan.
- Batasi Namespace "testing" dengan batas 1 _core_ dan RAM 1GiB. Biarkan Namespace "production" menggunakan
  berapapun jumlah yang diinginkan.

Pada kasus di mana total kapasitas klaster lebih sedikit dari jumlah seluruh kuota di seluruh Namespace,
dapat terjadi perebutan sumber daya komputasi. Masalah ini akan ditangani dengan cara siapa-cepat-dia-dapat.

Perebutan sumber daya komputasi maupun perubahan kuota tidak akan memengaruhi sumber daya yang sudah dibuat
sebelumnya.

## Mengaktifkan Resource Quota

Dukungan untuk Resource Quota diaktifkan secara bawaan pada banyak distribusi Kubernetes. Resource Quota
diaktifkan saat _flag_ `--enable-admission-plugins=` pada apiserver memiliki `ResourceQuota` sebagai
salah satu nilainya.

Sebuah Resource Quota akan dipaksakan pada sebuah Namespace tertentu saat ada sebuah objek `ResourceQuota`
di dalam Namespace tersebut.

## Resource Quota Komputasi

Kamu dapat membatasi jumlah total [sumber daya komputasi](/docs/user-guide/compute-resources) yang dapat
diminta di dalam sebuah Namespace.

Berikut jenis-jenis sumber daya yang didukung:

| Nama Sumber Daya | Deskripsi |
| --------------------- | ----------------------------------------------------------- |
| `limits.cpu` | Pada seluruh Pod yang berada pada kondisi non-terminal, jumlah `limits` CPU tidak dapat melebihi nilai ini. |
| `limits.memory` | Pada seluruh Pod yang berada pada kondisi non-terminal, jumlah `limits` memori tidak dapat melebihi nilai ini. |
| `limits.cpu` | Pada seluruh Pod yang berada pada kondisi non-terminal, jumlah `requests` CPU tidak dapat melebihi nilai ini. |
| `limits.memory` | Pada seluruh Pod yang berada pada kondisi non-terminal, jumlah `requests` memori tidak dapat melebihi nilai ini. |

### Resource Quota untuk sumber daya yang diperluas

Sebagai tambahan untuk sumber daya yang disebutkan di atas, pada rilis 1.10, dukungan kuota untuk
[sumber daya yang diperluas](/id/docs/concepts/configuration/manage-compute-resources-container/#extended-resources) ditambahkan.

Karena _overcommit_ tidak diperbolehkan untuk sumber daya yang diperluas, tidak masuk akal untuk menentukan
keduanya; `requests` dan `limits` untuk sumber daya yang diperluas yang sama pada sebuah kuota. Jadi, untuk
sumber daya yang diperluas, hanya kuota dengan prefiks `requests.` saja yang diperbolehkan untuk sekarang.

Mari kita ambil contoh sumber daya GPU. Jika nama sumber dayanya adalah `nvidia.com/gpu`, dan kamu ingin
membatasi jumlah total GPU yang diminta pada sebuah Namespace menjadi 4, kamu dapat menentukan sebuah kuota
sebagai berikut:

* `requests.nvidia.com/gpu: 4`

Lihat [Melihat dan Menyetel Kuota](#melihat-dan-menyetel-kuota) untuk informasi lebih lanjut.


## Resource Quota untuk penyimpanan

Kamu dapat membatasi jumlah total [sumber daya penyimpanan](/id/docs/concepts/storage/persistent-volumes/) yang dapat
diminta pada sebuah Namespace.

Sebagai tambahan, kamu dapat membatasi penggunaan sumber daya penyimpanan berdasarkan _storage class_
sumber daya penyimpanan tersebut.

| Nama Sumber Daya | Deskripsi |
| --------------------- | ----------------------------------------------------------- |
| `requests.storage` | Pada seluruh Persistent Volume Claim, jumlah `requests` penyimpanan tidak dapat melebihi nilai ini. |
| `persistentvolumeclaims` | Jumlah kuantitas [Persistent Volume Claim](/id/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) yang dapat ada di dalam sebuah Namespace. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Pada seluruh Persistent Volume Claim yang dikaitkan dengan sebuah nama _storage-class_ (melalui kolom `storageClassName`), jumlah permintaan penyimpanan tidak dapat melebihi nilai ini. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Pada seluruh Persistent Volume Claim yang dikaitkan dengan sebuah nama _storage-class_ (melalui kolom `storageClassName`), jumlah kuantitas [Persistent Volume Claim](/id/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) yang dapat ada di dalam sebuah Namespace. |

Sebagai contoh, jika sebuah operator ingin membatasi penyimpanan dengan Storage Class `gold` yang berbeda dengan Storage Class `bronze`, maka operator tersebut dapat menentukan kuota sebagai berikut:

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

Pada rilis 1.8, dukungan kuota untuk penyimpanan lokal sementara (_local ephemeral storage_) ditambahkan sebagai
sebuah fitur _alpha_:

| Nama Sumber Daya | Deskripsi |
| ------------------------------- |----------------------------------------------------------- |
| `requests.ephemeral-storage` | Pada seluruh Pod di sebuah Namespace, jumlah `requests` penyimpanan lokal sementara tidak dapat melebihi nilai ini. |
| `limits.ephemeral-storage` | Pada seluruh Pod di sebuah Namespace, jumlah `limits` penyimpanan lokal sementara tidak dapat melebihi nilai ini. |

## Kuota Kuantitas Objek

Rilis 1.9 menambahkan dukungan untuk membatasi semua jenis sumber daya standar yang berada pada sebuah Namespace dengan sintaksis sebagai berikut:

* `count/<sumber-daya>.<grup>`

Berikut contoh-contoh sumber daya yang dapat ditentukan pengguna pada kuota kuantitas objek:

* `count/persistentvolumeclaims`
* `count/services`
* `count/secrets`
* `count/configmaps`
* `count/replicationcontrollers`
* `count/deployments.apps`
* `count/replicasets.apps`
* `count/statefulsets.apps`
* `count/jobs.batch`
* `count/cronjobs.batch`
* `count/deployments.extensions`

Rilis 1.15 menambahkan dukungan untuk sumber daya _custom_ menggunakan sintaksis yang sama.
Contohnya, untuk membuat kuota pada sumber daya _custom_ `widgets` pada grup API `example.com`, gunakan
`count/widgets.example.com`.

Saat menggunakan Resource Quota `count/*`, sebuah objek akan menggunakan kuotanya jika ia berada pada penyimpanan Apiserver.
Tipe-tipe kuota ini berguna untuk menjaga dari kehabisan sumber daya penyimpanan. Misalnya, kamu mungkin
ingin membatasi kuantitas objek Secret pada sebuah Apiserver karena ukuran mereka yang besar. Terlalu banyak
Secret pada sebuah klaster bahkan dapat membuat Server dan Controller tidak dapat dijalankan! Kamu dapat membatasi
jumlah Job untuk menjaga dari CronJob yang salah dikonfigurasi sehingga membuat terlalu banyak Job pada sebuah
Namespace yang mengakibatkan _denial of service_.

Sebelum rilis 1.9, kita tidak dapat melakukan pembatasan kuantitas objek generik pada kumpulan sumber daya yang terbatas.
Sebagai tambahan, kita dapat membatasi lebih lanjut sumber daya tertentu dengan kuota berdasarkan jenis mereka.

Berikut jenis-jenis yang telah didukung:

| Nama Sumber Daya | Deskripsi |
| ------------------------------- | ------------------------------------------------- |
| `configmaps` | Jumlah total ConfigMap yang dapat berada pada suatu Namespace. |
| `persistentvolumeclaims` | Jumlah total PersistentVolumeClaim[persistent volume claims](/id/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) yang dapat berada pada suatu Namespace. |
| `pods` | Jumlah total Pod yang berada pada kondisi non-terminal yang dapat berada pada suatu Namespace. Sebuah Pod berada kondisi terminal yaitu jika `.status.phase in (Failed, Succeded)` adalah `true`. |
| `replicationcontrollers` | Jumlah total ReplicationController yang dapat berada pada suatu Namespace. |
| `resourcequotas` | Jumlah total [ResourceQuota](/docs/reference/access-authn-authz/admission-controllers/#resourcequota) yang dapat berada pada suatu Namespace. |
| `services` | Jumlah total Service yang dapat berada pada suatu Namespace. |
| `services.loadbalancers` | Jumlah total Service dengan tipe LoadBalancer yang dapat berada pada suatu Namespace. |
| `services.nodeports` | Jumlah total Service dengan tipe NodePort yang dapat berada pada suatu Namespace. |
| `secrets` | Jumlah total Secret yang dapat berada pada suatu Namespace. |

Sebagai contoh, `pods` membatasi kuantitas dan memaksa kuantitas maksimum `pods` yang
berada pada kondisi non-terminal yang dibuat pada sebuah Namespace. Kamu mungkin ingin
menyetel kuota `pods` pada sebuah Namespace untuk menghindari kasus di mana pengguna membuat
banyak Pod kecil dan menghabiskan persediaan alamat IP Pod pada klaster.

## Lingkup Kuota

Setiap kuota dapat memiliki kumpulan lingkup yang dikaitkan. Sebuah kuota hanya akan mengukur penggunaan sebuah
sumber daya jika sumber daya tersebut cocok dengan irisan dari lingkup-lingkup yang ditentukan.

Saat sebuah lingkup ditambahkan kepada kuota, lingkup itu akan membatasi kuantitas sumber daya yang didukung menjadi yang berkaitan dengan lingkup tersebut.
Sumber daya yang ditentukan pada kuota di luar kumpulan yang diizinkan akan menghasilkan kesalahan validasi.

| Lingkup | Deskripsi |
| ----- | ----------- |
| `Terminating` | Mencocokkan dengan Pod-Pod yang memiliki `.spec.activeDeadlineSeconds >= 0` |
| `NotTerminating` | Mencocokkan dengan Pod-Pod yang memiliki `.spec.activeDeadlineSeconds is nil` |
| `BestEffort` | Mencocokkan dengan Pod-Pod yang memiliki _quality of service_ bertipe _best effort_. |
| `NotBestEffort` | Mencocokkan dengan Pod-Pod yang tidak memiliki _quality of service_ bertipe _best effort_. |

Lingkup `BestEffort` membatasi sebuah kuota untuk memantau sumber daya berikut: `pods`

Lingkup  `Terminating`, `NotTerminating`, dan `NotBestEffort` membatasi sebuah kuota untuk memantau sumber daya berikut:

* `cpu`
* `limits.cpu`
* `limits.memory`
* `memory`
* `pods`
* `requests.cpu`
* `requests.memory`

### Resource Quota Per PriorityClass

{{< feature-state for_k8s_version="1.12" state="beta" >}}

Pod-Pod dapat dibuat dengan sebuah [Priority (prioritas)](/id/docs/concepts/configuration/pod-priority-preemption/#pod-priority) tertentu.
Kamu dapat mengontrol konsumsi sumber daya sistem sebuah Pod berdasarkan Priority Pod tersebut, menggunakan
kolom `scopeSelector` pada spesifikasi kuota tersebut.

Sebuah kuota dicocokkan dan digunakan hanya jika `scopeSelector` pada spesifikasi kuota tersebut memilih Pod tersebut.

Contoh ini membuat sebuah objek kuota dan mencocokkannya dengan Pod-Pod pada Priority tertentu. Contoh tersebut
bekerja sebagai berikut:

- Pod-Pod di dalam klaster memiliki satu dari tiga Priority Class, "low", "medium", "high".
- Satu objek kuota dibuat untuk setiap Priority.

Simpan YAML berikut ke sebuah berkas bernama `quota.yml`.

```yaml
apiVersion: v1
kind: List
items:
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-high
  spec:
    hard:
      cpu: "1000"
      memory: 200Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["high"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-medium
  spec:
    hard:
      cpu: "10"
      memory: 20Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["medium"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-low
  spec:
    hard:
      cpu: "5"
      memory: 10Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["low"]
```

Terapkan YAML tersebut dengan `kubectl create`.

```shell
kubectl create -f ./quota.yml
```

```shell
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

Pastikan bahwa kuota `Used` adalah `0` dengan `kubectl describe quota`.

```shell
kubectl describe quota
```

```shell
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     1k
memory      0     200Gi
pods        0     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

Buat sebuah Pod dengan Priority "high". Simpan YAML berikut ke sebuah
berkas bernama `high-priority-pod.yml`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: high-priority
spec:
  containers:
  - name: high-priority
    image: ubuntu
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo hello; sleep 10;done"]
    resources:
      requests:
        memory: "10Gi"
        cpu: "500m"
      limits:
        memory: "10Gi"
        cpu: "500m"
  priorityClassName: high
```

Terapkan dengan `kubectl create`.

```shell
kubectl create -f ./high-priority-pod.yml
```

Pastikan bahwa status "Used" untuk kuota dengan Priority "high", `pods-high`, telah berubah
dan dua kuota lainnya tidak berubah.

```shell
kubectl describe quota
```

```shell
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         500m  1k
memory      10Gi  200Gi
pods        1     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

`scopeSelector` mendukung nilai-nilai berikut pada kolom `operator`:

* `In`
* `NotIn`
* `Exist`
* `DoesNotExist`

## _Request_ vs Limit

Saat mengalokasikan sumber daya komputasi, setiap Container dapat menentukan sebuah nilai _request_ (permintaan) dan limit untuk CPU atau memori.
Kuota tersebut dapat dikonfigurasi untuk membatasi nilai salah satunya.

Jika kuota tersebut memiliki sebuah nilai yang ditentukan untuk `requests.cpu` atau `requests.memory`, maka kuota
tersebut mengharuskan setiap Container yang akan dibuat untuk menentukan request eksplisit untuk sumber daya tersebut.
Jika kuota tersebut memiliki sebuah nilai yang ditentukan untuk `limits.cpu` atau `limits.memory`, maka kuota tersebut
mengharuskan setiap Container yang akan dibuat untuk menentukan limit eksplisit untuk sumber daya tersebut.

## Melihat dan Menyetel kuota

Kubectl mendukung membuat, membarui, dan melihat kuota:

```shell
kubectl create namespace myspace
```

```shell
cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.nvidia.com/gpu: 4
EOF
```

```shell
kubectl create -f ./compute-resources.yaml --namespace=myspace
```

```shell
cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    pods: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
```

```shell
kubectl create -f ./object-counts.yaml --namespace=myspace
```

```shell
kubectl get quota --namespace=myspace
```

```shell
NAME                    AGE
compute-resources       30s
object-counts           32s
```

```shell
kubectl describe quota compute-resources --namespace=myspace
```

```shell
Name:                    compute-resources
Namespace:               myspace
Resource                 Used  Hard
--------                 ----  ----
limits.cpu               0     2
limits.memory            0     2Gi
requests.cpu             0     1
requests.memory          0     1Gi
requests.nvidia.com/gpu  0     4
```

```shell
kubectl describe quota object-counts --namespace=myspace
```

```shell
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
pods                    0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```

Kubectl juga mendukung kuota kuantitas objek untuk semua sumber daya standar yang berada pada Namespace
menggunakan sintaksis  `count/<resource>.<group>`:

```shell
kubectl create namespace myspace
```

```shell
kubectl create quota test --hard=count/deployments.extensions=2,count/replicasets.extensions=4,count/pods=3,count/secrets=4 --namespace=myspace
```

```shell
kubectl run nginx --image=nginx --replicas=2 --namespace=myspace
```

```shell
kubectl describe quota --namespace=myspace
```

```shell
Name:                         test
Namespace:                    myspace
Resource                      Used  Hard
--------                      ----  ----
count/deployments.extensions  1     2
count/pods                    2     3
count/replicasets.extensions  1     4
count/secrets                 1     4
```

## Kuota dan Kapasitas Klaster

`ResourceQuota` tidak tergantung pada kapasitas klaster. `ResourceQuota` ditentukan dalam
satuan-satuan absolut. Jadi, jika kamu menambahkan Node ke klaster kamu, penambahan ini
**bukan** berarti secara otomatis memberikan setiap Namespace kemampuan untuk menggunakan
lebih banyak sumber daya.

Terkadang kebijakan yang lebih kompleks mungkin lebih diinginkan, seperti:

  - Secara proporsional membagi sumber daya total klaster untuk beberapa tim.
  - Mengizinkan setiap tim untuk meningkatkan penggunaan sumber daya sesuai kebutuhan,
    tetapi tetap memiliki batas yang cukup besar untuk menghindari kehabisan sumber daya.
  - Mendeteksi permintaan dari sebuah Namespace, menambah Node, kemudian menambah kuota.
  
Kebijakan-kebijakan seperti itu dapat diterapkan dengan `ResourceQuota` sebagai dasarnya,
dengan membuat sebuah "pengontrol" yang memantau penggunaan kuota dan menyesuaikan batas
keras kuota untuk setiap Namespace berdasarkan sinyal-sinyal lainnya.

Perlu dicatat bahwa Resource Quota membagi agregat sumber daya klaster, tapi Resource Quota
tidak membuat batasan-batasan terhadap Node: Pod-Pod dari beberapa Namespace boleh berjalan
di Node yang sama.

## Membatasi konsumsi Priority Class secara bawaan

Mungkin saja diinginkan untuk Pod-Pod pada kelas prioritas tertentu, misalnya "cluster-services", sebaiknya diizinkan pada sebuah Namespace, jika dan hanya jika terdapat sebuah objek kuota yang cocok.

Dengan mekanisme ini, operator-operator dapat membatasi penggunaan Priority Class dengan prioritas tinggi pada Namespace-Namespace tertentu saja dan tidak semua Namespace dapat menggunakan Priority Class tersebut secara bawaan.

Untuk memaksa aturan ini, _flag_ kube-apiserver  `--admission-control-config-file` sebaiknya digunakan untuk memberikan _path_ menuju berkas konfigurasi berikut:

{{< tabs name="example1" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}

```yaml
# Kedaluwarsa pada v1.17 digantikan oleh apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    # Kedaluwarsa pada v1.17 digantikan oleh apiserver.config.k8s.io/v1, ResourceQuotaConfiguration
    apiVersion: resourcequota.admission.k8s.io/v1beta1
    kind: Configuration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

{{% /tab %}}
{{< /tabs >}}

Sekarang, Pod-Pod "cluster-services" akan diizinkan hanya pada Namespace di mana ada sebuah objek kuota dengan sebuah `scopeSelector` yang cocok.

Contohnya:

```yaml
    scopeSelector:
      matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

Lihat [LimitedResources](https://github.com/kubernetes/kubernetes/pull/36765) dan [dokumen desain dukungan Quota untuk Priority Class](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/pod-priority-resourcequota.md) untuk informasi lebih lanjut.

## Contoh

Lihat [contoh detail cara menggunakan sebuah Resource Quota](/docs/tasks/administer-cluster/quota-api-object/).



## {{% heading "whatsnext" %}}


Lihat [dokumen desain ResourceQuota](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md) untuk informasi lebih lanjut.


