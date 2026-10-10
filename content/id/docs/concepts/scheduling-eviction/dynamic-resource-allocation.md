---
title: Alokasi Sumber Daya Dinamis
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceSlice"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceSlice"
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

Alokasi sumber daya dinamis (_dynamic resource allocation_) adalah API untuk meminta dan berbagi sumber daya antara Pod dan kontainer di dalam sebuah Pod. Ini merupakan generalisasi dari API PersistentVolume untuk sumber daya generik. Biasanya, sumber daya tersebut bisa berupa perangkat seperti GPU.

_Driver_ sumber daya pihak ketiga bertanggung jawab untuk melacak dan mempersiapkan sumber daya, dengan alokasi sumber daya yang ditangani oleh Kubernetes melalui parameter terstruktur (diperkenalkan pada Kubernetes 1.30). Berbagai jenis sumber daya mendukung parameter sembarang untuk mendefinisikan kebutuhan dan inisialisasi.

Kubernetes versi 1.26 hingga 1.31 menyertakan implementasi (alpha) dari DRA (_Dynamic Resource Allocation_) klasik, yang sekarang sudah tidak didukung lagi. Dokumentasi ini yang ditujukan untuk Kubernetes versi {{< skew currentVersion >}}, menjelaskan pendekatan terkini untuk alokasi sumber daya dinamis dalam Kubernetes.

## {{% heading "prerequisites" %}}

Kubernetes versi {{< skew currentVersion >}} menyertakan dukungan API tingkat klaster untuk alokasi sumber daya dinamis, tetapi harus diaktifkan secara eksplisit. Kamu juga harus menginstal _driver_ sumber daya untuk sumber daya tertentu yang akan dikelola menggunakan API ini. Jika kamu tidak menggunakan Kubernetes versi {{< skew currentVersion >}}, periksa dokumentasi untuk versi Kubernetes tersebut.

<!-- body -->

## API

`resource.k8s.io/v1beta1` dan `resource.k8s.io/v1beta2` {{< glossary_tooltip text="API groups" term_id="api-group" >}} menyediakan tipe-tipe berikut:

ResourceClaim
: Menggambarkan permintaan akses ke sumber daya di dalam klaster untuk digunakan oleh beban kerja (_workload_). Misalnya, jika sebuah beban kerja membutuhkan perangkat akselerator dengan properti tertentu, permintaan tersebut diekspresikan melalui tipe ini. Bagian status melacak apakah klaim ini telah terpenuhi dan sumber daya spesifik apa yang telah dialokasikan.

ResourceClaimTemplate
: Mendefinisikan spesifikasi dan beberapa metadata untuk membuat ResourceClaim. Dibuat oleh pengguna saat menerapkan beban kerja. ResourceClaim untuk setiap Pod kemudian dibuat dan dihapus secara otomatis oleh Kubernetes.

DeviceClass
: Berisi kriteria seleksi yang telah ditentukan untuk perangkat tertentu serta konfigurasi untuk perangkat tersebut. DeviceClass dibuat oleh administrator klaster saat menginstal _driver_ sumber daya. Setiap permintaan untuk mengalokasikan perangkat dalam ResourceClaim harus merujuk tepat satu DeviceClass.

ResourceSlice
: Digunakan oleh _driver_ DRA untuk mempublikasikan informasi tentang sumber daya (biasanya perangkat) yang tersedia di klaster.

DeviceTaintRule
: Digunakan oleh administrator atau komponen _control plane_ untuk menambahkan _taint_ perangkat pada perangkat yang dijelaskan dalam ResourceSlice.

Semua parameter yang memilih perangkat didefinisikan dalam ResourceClaim dan DeviceClass menggunakan tipe _in-tree_. Parameter konfigurasi dapat disematkan di sana. Parameter konfigurasi yang valid bergantung pada _driver_ DRA -- Kubernetes hanya meneruskannya tanpa memprosesnya.

`PodSpec` dari `core/v1` mendefinisikan ResourceClaim yang diperlukan untuk sebuah Pod dalam _field_ `resourceClaims`. Entri dalam daftar tersebut merujuk pada ResourceClaim atau ResourceClaimTemplate. Ketika merujuk pada ResourceClaim, semua Pod yang menggunakan PodSpec ini (misalnya, di dalam Deployment atau StatefulSet) berbagi _instance_ ResourceClaim yang sama. Ketika merujuk pada ResourceClaimTemplate, setiap Pod mendapatkan _instance_ tersendiri.

Daftar `resources.claims` untuk sumber daya kontainer mendefinisikan apakah sebuah kontainer mendapatkan akses ke _instance_ sumber daya tersebut, yang memungkinkan berbagi sumber daya antara satu atau lebih kontainer.

Berikut adalah contoh untuk _driver_ sumber daya fiksi. Dua objek ResourceClaim akan dibuat untuk Pod ini, dan setiap kontainer mendapatkan akses ke salah satu dari mereka.

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: DeviceClass
metadata:
  name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          selectors:
          - cel:
             expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  kontainers:
  - name: kontainer0
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: kontainer1
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    resourceClaimTemplateName: large-black-cat-claim-template
```

## Penjadwalan (_Scheduling_)

_Scheduler_ bertanggung jawab untuk mengalokasikan sumber daya ke ResourceClaim setiap kali sebuah Pod membutuhkannya. _Scheduler_ melakukan ini dengan mengambil daftar lengkap sumber daya yang tersedia dari objek ResourceSlice, melacak sumber daya mana yang sudah dialokasikan ke ResourceClaim yang ada, dan kemudian memilih dari sumber daya yang masih tersisa.

Saat ini, satu-satunya jenis sumber daya yang didukung adalah perangkat. Sebuah _instance_ perangkat memiliki nama, beberapa atribut, dan kapasitas. Perangkat dipilih melalui [ekspresi CEL (_Common Expression Language_)](/docs/reference/using-api/cel) yang memeriksa atribut dan kapasitas tersebut. Selain itu, perangkat yang dipilih juga dapat dibatasi pada kumpulan perangkat yang memenuhi batasan tertentu.
Sumber daya yang dipilih dicatat dalam status ResourceClaim bersama dengan konfigurasi spesifik vendor, sehingga ketika sebuah pod akan dijalankan pada sebuah Node, _driver_ sumber daya di Node tersebut memiliki semua informasi yang diperlukan untuk mempersiapkan sumber daya tersebut.

Dengan menggunakan parameter terstruktur, _scheduler_ dapat mengambil keputusan tanpa berkomunikasi dengan _driver_ sumber daya DRA. _Scheduler_ juga dapat menjadwalkan beberapa Pod dengan cepat dengan menyimpan informasi tentang alokasi ResourceClaim di memori dan menuliskan informasi ini ke objek ResourceClaim di latar belakang sambil secara bersamaan mengikat pod ke sebuah Node.

## Memantau Sumber Daya

Kubelet menyediakan layanan gRPC untuk memungkinkan penemuan sumber daya dinamis dari Pod yang sedang berjalan. Untuk informasi lebih lanjut tentang endpoint gRPC, lihat pelaporan alokasi sumber daya.

## Pod yang Sudah Dijadwalkan Sebelumnya

Ketika kamu - atau klien API lainnya - membuat sebuah Pod dengan `spec.nodeName` yang sudah diatur, _scheduler_ akan dilewati. Jika ada ResourceClaim yang dibutuhkan oleh Pod tersebut tetapi belum ada, belum dialokasikan, atau belum dipesan untuk Pod tersebut, maka kubelet akan gagal menjalankan Pod dan akan memeriksa ulang secara berkala karena persyaratan tersebut mungkin masih dapat dipenuhi di kemudian waktu.

Situasi semacam ini juga dapat terjadi ketika dukungan untuk alokasi sumber daya dinamis tidak diaktifkan di _scheduler_ pada saat Pod dijadwalkan (karena perbedaan versi, konfigurasi, _feature gate_, dll.). kube-controller-manager mendeteksi hal ini dan mencoba membuat Pod dapat dijalankan dengan memesan ResourceClaim yang diperlukan. Namun, ini hanya berhasil jika ResourceClaim tersebut telah dialokasikan oleh _scheduler_ untuk Pod lain.

Lebih baik untuk menghindari melewati _scheduler_ karena Pod yang ditugaskan ke sebuah Node akan memblokir sumber daya normal (RAM, CPU) yang tidak dapat digunakan untuk Pod lain sementara Pod tersebut terhenti. Untuk membuat sebuah Pod berjalan di Node tertentu sambil tetap melalui alur penjadwalan normal, buatlah Pod dengan `nodeSelector` yang secara tepat cocok dengan Node yang diinginkan:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: name-of-the-intended-node
  ...
```

Kamu juga dapat memodifikasi Pod yang masuk, pada saat _admission_, untuk menghapus _field_ `.spec.nodeName` dan menggunakan `nodeSelector` sebagai gantinya.

## Akses Admin

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

Kamu dapat menandai sebuah permintaan dalam ResourceClaim atau ResourceClaimTemplate sebagai memiliki fitur istimewa untuk tugas pemeliharaan dan pemecahan masalah. Permintaan dengan akses admin memberikan akses ke perangkat yang sedang digunakan dan mungkin mengaktifkan izin tambahan saat membuat perangkat tersedia di dalam sebuah kontainer:

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          allocationMode: All
          adminAccess: true
```

Jika fitur ini dinonaktifkan, _field_ `adminAccess` akan secara otomatis dihapus saat membuat ResourceClaim semacam itu.

Akses admin adalah mode istimewa dan tidak boleh diberikan kepada pengguna biasa dalam klaster _multi-tenant_. Mulai dari Kubernetes v1.33, hanya pengguna yang memiliki otorisasi untuk membuat objek ResourceClaim atau ResourceClaimTemplate di namespace yang diberi label `resource.k8s.io/admin-access: "true"` (_case-sensitive_) yang dapat menggunakan _field_ `adminAccess`. Hal ini memastikan bahwa pengguna non-admin tidak dapat menyalahgunakan fitur tersebut.

## Status Perangkat ResourceClaim

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

_Driver_ dapat melaporkan data status perangkat spesifik _driver_ untuk setiap perangkat yang dialokasikan dalam sebuah ResourceClaim. Misalnya, IP yang diberikan ke perangkat antarmuka jaringan dapat dilaporkan dalam status ResourceClaim.

_Driver_ yang menetapkan status, keakuratan informasi bergantung pada implementasi _driver_ DRA tersebut. Oleh karena itu, status perangkat yang dilaporkan mungkin tidak selalu mencerminkan perubahan waktu nyata dari keadaan perangkat.

Ketika fitur ini dinonaktifkan, _field_ tersebut secara otomatis akan dihapus saat menyimpan ResourceClaim.

Status perangkat ResourceClaim didukung ketika memungkinkan, dari _driver_ DRA, untuk memperbarui ResourceClaim yang ada di mana _field_ `status.devices` diatur.

### Daftar Prioritas

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

Kamu dapat menyediakan daftar prioritas sub-permintaan untuk permintaan dalam sebuah ResourceClaim. _Scheduler_ kemudian akan memilih sub-permintaan pertama yang dapat dialokasikan. Ini memungkinkan pengguna untuk menentukan perangkat alternatif yang dapat digunakan oleh beban kerja jika pilihan utama tidak tersedia.

Dalam contoh di bawah ini, ResourceClaimTemplate meminta perangkat dengan warna hitam dan ukuran besar. Jika perangkat dengan atribut tersebut tidak tersedia, Pod tidak dapat dijadwalkan. Dengan fitur daftar prioritas, alternatif kedua dapat ditentukan, yang meminta dua perangkat dengan warna putih dan ukuran kecil. Perangkat hitam besar akan dialokasikan jika tersedia. Namun, jika tidak tersedia dan dua perangkat putih kecil tersedia, Pod masih dapat berjalan.

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: prioritized-list-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        firstAvailable:
        - name: large-black
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
        - name: small-white
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "white" &&
                device.attributes["resource-driver.example.com"].size == "small"
          count: 2
```

## Perangkat yang Dapat Dipartisi

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Perangkat yang direpresentasikan dalam DRA tidak harus berupa satu unit yang terhubung ke satu mesin, tetapi juga dapat berupa perangkat logis yang terdiri dari beberapa perangkat yang terhubung ke beberapa mesin. Perangkat-perangkat ini mungkin menggunakan sumber daya yang saling tumpang tindih dari perangkat fisik yang mendasarinya, yang berarti bahwa ketika satu perangkat logis dialokasikan, perangkat lainnya tidak akan lagi tersedia.

Dalam API ResourceSlice, ini direpresentasikan sebagai daftar CounterSet yang diberi nama, masing-masing berisi satu set _counter_ yang juga diberi nama. _Counter_ ini merepresentasikan sumber daya yang tersedia pada perangkat fisik yang digunakan oleh perangkat logis yang diiklankan melalui DRA.

Perangkat logis dapat menentukan daftar ConsumesCounters. Setiap entri berisi referensi ke sebuah CounterSet dan satu set counter yang diberi nama dengan jumlah yang akan mereka konsumsi. Jadi, agar sebuah perangkat dapat dialokasikan, set counter yang direferensikan harus memiliki jumlah yang cukup untuk counter yang direferensikan oleh perangkat tersebut.

Berikut adalah contoh dua perangkat, masing-masing mengonsumsi 6Gi memori dari sebuah _counter_ bersama yang memiliki 8Gi memori. Dengan demikian, hanya satu dari perangkat tersebut yang dapat dialokasikan pada satu waktu. _Scheduler_ menangani ini, dan hal ini transparan bagi konsumen karena API ResourceClaim tidak terpengaruh.

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1beta2
metadata:
  name: resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  sharedCounters:
  - name: gpu-1-counters
    counters:
      memory:
        value: 8Gi
  devices:
  - name: device-1
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
  - name: device-2
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
```

## _Taint_ dan Toleransi Perangkat

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

__Taint__ perangkat mirip dengan _taint_ pada Node: sebuah _taint_ memiliki kunci _string_, nilai _string_, dan efek. Efek ini diterapkan pada ResourceClaim yang menggunakan perangkat yang telah ditaint dan pada semua Pod yang merujuk ke ResourceClaim tersebut. Efek "NoSchedule" mencegah penjadwalan Pod-Pod tersebut. Perangkat yang ditaint akan diabaikan saat mencoba mengalokasikan ResourceClaim karena penggunaannya akan mencegah penjadwalan Pod.

Efek "NoExecute" menyiratkan "NoSchedule" dan, selain itu, menyebabkan pengusiran semua Pod yang telah dijadwalkan sebelumnya. Pengusiran ini diimplementasikan dalam pengontrol pengusiran _taint_ perangkat di kube-controller-manager dengan cara menghapus Pod yang terpengaruh.

ResourceClaim dapat mentoleransi _taint_. Jika sebuah _taint_ ditoleransi, efeknya tidak berlaku. Toleransi kosong cocok dengan semua _taint_. Toleransi dapat dibatasi pada efek tertentu dan/atau cocok dengan pasangan kunci/nilai tertentu. Toleransi dapat memeriksa keberadaan kunci tertentu, terlepas dari nilai apa yang dimilikinya, atau dapat memeriksa nilai spesifik dari sebuah kunci. Untuk informasi lebih lanjut tentang pencocokan ini, lihat konsep _taint_ pada Node.

Pengusiran dapat ditunda dengan mentoleransi _taint_ untuk durasi tertentu. Penundaan tersebut dimulai saat _taint_ ditambahkan ke perangkat, yang dicatat dalam sebuah _field_ pada _taint_.

_Taint_ berlaku seperti yang dijelaskan di atas juga untuk ResourceClaim yang mengalokasikan "semua" perangkat pada sebuah Node. Semua perangkat harus tidak ditaint atau semua _taint_ mereka harus ditoleransi. Mengalokasikan perangkat dengan akses admin (dijelaskan di atas) juga tidak dikecualikan. Seorang admin yang menggunakan mode tersebut harus secara eksplisit mentoleransi semua _taint_ untuk mengakses perangkat yang ditaint.

_Taint_ dapat ditambahkan ke perangkat dengan dua cara berbeda:

### _Taint_ yang Ditetapkan oleh Driver

_Driver_ DRA dapat menambahkan _taint_ ke informasi perangkat yang dipublikasikan dalam ResourceSlice. Konsultasikan dokumentasi _driver_ DRA untuk mengetahui apakah _driver_ menggunakan _taint_ dan apa kunci serta nilainya.

### _Taint_ yang Ditetapkan oleh Admin

Seorang admin atau komponen _control plane_ dapat menaint perangkat tanpa harus meminta _driver_ DRA untuk menyertakan _taint_ dalam informasi perangkatnya di ResourceSlice. Mereka melakukannya dengan membuat DeviceTaintRules. Setiap DeviceTaintRule menambahkan satu _taint_ ke perangkat yang cocok dengan _selector_ perangkat. Tanpa _selector_ semacam itu, tidak ada perangkat yang ditaint. Hal ini membuat lebih sulit untuk secara tidak sengaja mengusir semua Pod yang menggunakan ResourceClaim karena kesalahan dalam menentukan _selector_.

Perangkat dapat dipilih dengan memberikan nama DeviceClass, _driver_, pool, dan/atau perangkat. DeviceClass memilih semua perangkat yang dipilih oleh _selector_ dalam DeviceClass tersebut. Dengan hanya nama _driver_, seorang admin dapat melakukan _taint_ semua perangkat yang dikelola oleh _driver_ tersebut, misalnya saat melakukan pemeliharaan _driver_ di seluruh klaster. Menambahkan nama _pool_ dapat membatasi _taint_ ke satu Node, jika _driver_ mengelola perangkat lokal Node.

Terakhir, menambahkan nama perangkat dapat memilih satu perangkat spesifik. Nama perangkat dan nama _pool_ juga dapat digunakan sendiri, jika diinginkan. Misalnya, _driver_ untuk perangkat lokal Node didorong untuk menggunakan nama Node sebagai nama _pool_ mereka. Maka, melakukan _taint_ dengan nama _pool_ tersebut secara otomatis melakukan _taint_ semua perangkat pada sebuah Node.

_Driver_ mungkin menggunakan nama stabil seperti "gpu-0" yang menyembunyikan perangkat spesifik mana yang saat ini ditugaskan ke nama tersebut. Untuk mendukung perlakuan _taint_ ubstabs perangkat keras tertentu, _selector_ CEL dapat digunakan dalam DeviceTaintRule untuk mencocokkan atribut ID unik spesifik vendor, jika _driver_ mendukungnya untuk perangkat kerasnya.

_Taint_ berlaku selama DeviceTaintRule ada. _taint_ dapat dimodifikasi dan dihapus kapan saja. Berikut adalah contoh DeviceTaintRule untuk _driver_ DRA fiksi:

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: DeviceTaintRule
metadata:
  name: example
spec:
  # The entire hardware installation for this
  # particular driver is broken.
  # Evict all pods and don't schedule new ones.
  deviceSelector:
    driver: dra.example.com
  _taint_:
    key: dra.example.com/unhealthy
    value: Broken
    effect: NoExecute
```

## Mengaktifkan Alokasi Sumber Daya Dinamis

Alokasi sumber daya dinamis adalah fitur beta yang secara default tidak diaktifkan dan hanya dapat diaktifkan jika _feature gate_ `DynamicResourceAllocation` serta {{< glossary_tooltip text="API groups" term_id="api-group" >}} `resource.k8s.io/v1beta1` dan `resource.k8s.io/v1beta2` diaktifkan. Untuk detail lebih lanjut, lihat parameter `--feature-gates` dan `--runtime-config` pada kube-apiserver. Selain itu, kube-scheduler, kube-controller-manager, dan kubelet juga memerlukan _feature gate_ ini.

Ketika _driver_ sumber daya melaporkan status perangkat, maka _feature gate_ `DRAResourceClaimDeviceStatus` harus diaktifkan selain `DynamicResourceAllocation`.
Cara cepat untuk memeriksa apakah klaster Kubernetes mendukung fitur ini adalah dengan daftar objek DeviceClass menggunakan perintah berikut:

```shell
kubectl get deviceclasses
```

Jika klaster kamu mendukung alokasi sumber daya dinamis, respon-nya adalah daftar objek DeviceClass atau:

```
No resources found
```

Jika tidak didukung, kesalahan berikut akan dicetak:

```
error: the server doesn't have a resource type "deviceclasses"
```

Konfigurasi _default_ kube-scheduler mengaktifkan plugin "DynamicResources" hanya jika feature gate diaktifkan dan menggunakan API konfigurasi v1. Konfigurasi kustom mungkin perlu dimodifikasi untuk menyertakannya.

Selain mengaktifkan fitur di klaster, _driver_ sumber daya juga harus diinstal. Silakan merujuk ke dokumentasi _driver_ untuk detail lebih lanjut.

### Mengaktifkan Akses Admin

[Akses Admin](#akses-admin) adalah fitur _alpha_ dan hanya dapat diaktifkan jika [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `DRAAdminAccess` diaktifkan di kube-apiserver dan kube-scheduler.

### Mengaktifkan Status Perangkat

[Status perangkat ResourceClaim](#status-perangkat-resourceclaim) adalah fitur alpha dan hanya dapat diaktifkan jika [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `DRAResourceClaimDeviceStatus` diaktifkan di kube-apiserver.

### Mengaktifkan Daftar Prioritas

[Daftar prioritas](#daftar-prioritas) adalah fitur _alpha_ dan hanya dapat diaktifkan jika [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `DRAPrioritizedList` diaktifkan di kube-apiserver dan kube-scheduler. Fitur ini juga memerlukan [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `DynamicResourceAllocation` diaktifkan.

### Mengaktifkan Perangkat yang Dapat Dipartisi

[Perangkat yang dapat dipartisi](#perangkat-yang-dapat-dipartisi) adalah fitur _alpha_ dan hanya dapat diaktifkan jika [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `DRAPartitionableDevices` diaktifkan di kube-apiserver dan kube-scheduler.

#### Mengaktifkan _Taint_ dan Toleransi Perangkat

[_Taint_ dan toleransi perangkat](#taint-dan-toleransi-perangkat) adalah fitur _alpha_ dan hanya dapat diaktifkan jika [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `DRADevice_Taint_s` diaktifkan di kube-apiserver, kube-controller-manager, dan kube-scheduler. Untuk menggunakan DeviceTaintRules, versi API `resource.k8s.io/v1alpha3` harus diaktifkan.

### {{% heading "whatsnext" %}}

- Untuk informasi lebih lanjut tentang desain, lihat [KEP tentang Alokasi Sumber Daya Dinamis dengan Parameter Terstruktur](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters).