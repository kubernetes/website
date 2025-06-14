---
reviewers:
title: Plugin Perangkat
description: Gunakan kerangka kerja _plugin_ perangkat Kubernetes untuk mengimplementasikan plugin untuk GPU, NIC, FPGA, InfiniBand, dan sumber daya sejenis yang membutuhkan setelan spesifik vendor.
content_type: concept
weight: 20
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes menyediakan [kerangka kerja _plugin_ perangkat](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/resource-management/device-plugin.md)
sehingga kamu dapat memakainya untuk memperlihatkan sumber daya perangkat keras sistem ke dalam {{< glossary_tooltip term_id="kubelet" >}}.

Daripada menkustomisasi kode Kubernetes itu sendiri, vendor dapat mengimplementasikan
_plugin_ perangkat yang di-_deploy_ secara manual atau sebagai {{< glossary_tooltip term_id="daemonset" >}}.
Perangkat yang dituju termasuk GPU, NIC berkinerja tinggi, FPGA, adaptor InfiniBand,
dan sumber daya komputasi sejenis lainnya yang perlu inisialisasi dan setelan spesifik vendor.

<!-- body -->

## Pendaftaran _plugin_ perangkat

Kubelet mengekspor servis gRPC `Registration`:

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```

Plugin perangkat bisa mendaftarkan dirinya sendiri dengan kubelet melalui servis gRPC.
Dalam pendaftaran, _plugin_ perangkat perlu mengirim:

* Nama Unix socket-nya.
* Versi API Plugin Perangkat yang dipakai.
* `ResourceName` yang ingin ditunjukkan. `ResourceName` ini harus mengikuti
  [skema penamaan sumber daya ekstensi](/id/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)
  sebagai `vendor-domain/tipe-sumber-daya`.
  (Contohnya, NVIDIA GPU akan dinamai `nvidia.com/gpu`.)

Setelah registrasi sukses, _plugin_ perangkat mengirim daftar perangkat yang diatur 
ke kubelet, lalu kubelet kemudian bertanggung jawab untuk mengumumkan sumber daya tersebut 
ke peladen API sebagai bagian pembaruan status node kubelet.
Contohnya, setelah _plugin_ perangkat mendaftarkan `hardware-vendor.example/foo` dengan kubelet
dan melaporkan kedua perangkat dalam node dalam kondisi sehat, status node diperbarui
untuk menunjukkan bahwa node punya 2 perangkat “Foo” terpasang dan tersedia.

Kemudian, pengguna dapat meminta perangkat dalam spesifikasi
[Kontainer](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
seperti meminta tipe sumber daya lain, dengan batasan berikut:

* Sumber daya ekstensi hanya didukung sebagai sumber daya integer dan tidak bisa _overcommitted_.
* Perangkat tidak bisa dibagikan antar Kontainer.

Semisal klaster Kubernetes menjalankan _plugin_ perangkat yang menunjukkan sumber daya `hardware-vendor.example/foo`
pada node tertentu. Berikut contoh Pod yang meminta sumber daya itu untuk menjalankan demo beban kerja:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: registry.k8s.io/pause:3.8
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# Pod ini perlu 2 perangkat perangkat-vendor.example/foo
# dan hanya dapat menjadwalkan ke Node yang bisa memenuhi
# kebutuhannya.
#
# Jika Node punya lebih dari 2 perangkat tersedia,
# maka kelebihan akan dapat digunakan Pod lainnya.
```

## Implementasi _plugin_ perangkat

Alur kerja umum dari _plugin_ perangkat adalah sebagai berikut:

* Inisiasi. Selama fase ini, _plugin_ perangkat melakukan inisiasi spesifik vendor
  dan pengaturan untuk memastikan perangkat pada status siap.

* Plugin memulai servis gRPC, dengan Unix socket pada lokasi
  `/var/lib/kubelet/device-plugins/`, yang mengimplementasi antarmuka berikut:

   ```gRPC
   service DevicePlugin {
         // GetDevicePluginOptions mengembalikan opsi yang akan dikomunikasikan dengan Device Manager.
         rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

        // ListAndWatch mengembalikan aliran dari List of Devices
        // Kapanpun Device menyatakan perubahan atau kehilangan Device, ListAndWatch
        // mengembalikan daftar baru
         rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

        // Allocate dipanggil saat pembuatan kontainer sehingga Device
        // Plugin dapat menjalankan operasi spesifik perangkat dan menyuruh Kubelet
        // dari operasi untuk membuat Device tersedia di kontainer
         rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

         // GetPreferredAllocation mengembalikan sekumpulan perangkat yang disukai untuk dialokasikan
         // dari daftar yang tersedia. Alokasi yang dihasilkan tidak
         // dijamin sebagai alokasi yang pada akhirnya dilakukan oleh
         // devicemanager. Ini dirancang hanya untuk membantu devicemanager membuat
         // keputusan alokasi yang lebih tepat ketika memungkinkan.
         rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

         // PreStartContainer dipanggil, jika ditunjukkan oleh Plugin Perangkat selama fase pendaftaran,
         // sebelum setiap awal kontainer. Plugin perangkat dapat menjalankan operasi spesifik perangkat
         // seperti mereset perangkat sebelum membuat perangkat tersedia bagi kontainer.
         rpc PreStartContainer(PreStartContainerRequest) returns (PreStartContainerResponse) {}
   }
   ```

   {{< note >}}
   Plugin tidak diwajibkan untuk memberikan implementasi yang fungsional untuk
   `GetPreferredAllocation()` atau `PreStartContainer()`. Jika ada, indikator mengenai
   ketersediaan panggilan ini harus disertakan dalam pesan `DevicePluginOptions` yang
   dikembalikan oleh panggilan ke `GetDevicePluginOptions()`. `Kubelet` akan selalu
   memanggil `GetDevicePluginOptions()` untuk memeriksa fungsi opsional mana yang
   tersedia sebelum memanggil salah satu fungsi tersebut secara langsung.
   {{< /note >}}

* Plugin mendaftarkan dirinya sendiri dengan kubelet melalui Unix socket pada lokasi host
  `/var/lib/kubelet/device-plugins/kubelet.sock`.

  {{< note >}}
  Urutan alur kerja adalah penting. Sebuah plugin HARUS mulai melayani layanan gRPC
  sebelum mendaftarkan dirinya dengan kubelet untuk pendaftaran yang berhasil.
  {{< /note >}}

* Seteleh sukses mendaftarkan dirinya sendiri, _plugin_ perangkat berjalan dalam mode peladen, dan selama itu
dia tetap mengawasi kesehatan perangkat dan melaporkan balik ke kubelet terhadap perubahan status perangkat.
Dia juga bertanggung jawab untuk melayani _request_ gRPC `Allocate`. Selama `Allocate`, _plugin_ perangkat dapat 
membuat persiapan spesifik-perangkat; contohnya, pembersihan GPU atau inisiasi QRNG.
Jika operasi berhasil, _plugin_ perangkat mengembalikan `AllocateResponse` yang memuat konfigurasi 
runtime kontainer untuk mengakses perangkat teralokasi. Kubelet memberikan informasi ini ke runtime kontainer.

`AllocateResponse` berisi nol atau lebih objek `ContainerAllocateResponse`.
Di dalam objek-objek ini,  plugin perangkat mendefinisikan modifikasi yang harus
dilakukan pada definisi kontainer untuk memberikan akses ke perangkat. Modifikasi ini meliputi:

* [Anotasi](/docs/concepts/overview/working-with-objects/annotations/)
* node perangkat
* variabel lingkungan
* pemasangan (mounts)
* nama perangkat CDI yang sepenuhnya terqualifikasi

{{< note >}}
Pemrosesan nama perangkat CDI yang sepenuhnya terqualifikasi oleh Device Manager memerlukan
agar `DevicePluginCDIDevices` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
diaktifkan untuk kubelet dan kube-apiserver. Fitur ini ditambahkan sebagai fitur alpha di Kubernetes
v1.28, meningkat menjadi beta di v1.29 dan menjadi GA di v1.31.
{{< /note >}}

### Menangani kubelet yang _restart_

Plugin perangkat diharapkan dapat mendeteksi kubelet yang _restart_ dan mendaftarkan dirinya sendiri kembali dengan 
_instance_ kubelet baru. Pada implementasi sekarang, sebuah _instance_ kubelet baru akan menghapus semua socket Unix yang ada 
di dalam `/var/lib/kubelet/device-plugins` ketika dijalankan. Plugin perangkat dapat mengawasi penghapusan 
socket Unix miliknya dan mendaftarkan dirinya sendiri kembali ketika hal tersebut terjadi.

### Plugin perangkat dan perangkat yang tidak sehat

Ada kalanya perangkat mengalami kegagalan atau dimatikan. Tanggung jawab Plugin Perangkat dalam
kasus ini adalah memberi tahu kubelet mengenai situasi tersebut menggunakan API `ListAndWatchResponse`.

Setelah sebuah perangkat ditandai sebagai tidak sehat, kubelet akan mengurangi jumlah yang dapat dialokasikan
untuk sumber daya ini di Node, untuk mencerminkan berapa banyak perangkat yang dapat digunakan untuk
menjadwalkan pod baru. Jumlah kapasitas untuk sumber daya tersebut tidak akan berubah.

Pod yang telah ditugaskan ke perangkat yang gagal akan terus diasosiasikan dengan perangkat ini.
Umumnya, kode yang bergantung pada perangkat akan mulai gagal, dan Pod mungkin akan masuk ke fase Gagal jika
`restartPolicy` untuk Pod tersebut tidak diatur ke `Always`, atau bisa juga masuk ke loop crash.

Sebelum Kubernetes v1.31, cara untuk mengetahui apakah sebuah Pod terkait dengan perangkat yang gagal
adalah dengan menggunakan [API PodResources](#monitoring-device-plugin-resources).

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

Dengan mengaktifkan feature gate `ResourceHealthStatus`, field `allocatedResourcesStatus` akan ditambahkan
ke setiap status kontainer, dalam `.status` untuk setiap Pod. Field `allocatedResourcesStatus` melaporkan
informasi kesehatan untuk setiap perangkat yang ditugaskan kepada kontainer.

Untuk Pod yang gagal, atau di mana Anda mencurigai adanya kesalahan, Anda dapat menggunakan status ini
untuk memahami apakah perilaku Pod mungkin terkait dengan kegagalan perangkat. Misalnya, jika sebuah
akselerator melaporkan kejadian suhu berlebih, field `allocatedResourcesStatus` mungkin dapat melaporkan hal ini.

## Deployment _plugin_ perangkat

Kamu dapat melakukan _deploy_ sebuah _plugin_ perangkat sebagai DaemonSet, sebagai sebuah paket untuk sistem operasi node-mu,
atau secara manual.

Direktori _canonical_ `/var/lib/kubelet/device-plugins` membutuhkan akses berprivilese,
sehingga _plugin_ perangkat harus berjalan dalam konteks keamanan dengan privilese.
Jika kamu melakukan _deploy_ _plugin_ perangkat sebagai DaemonSet, `/var/lib/kubelet/device-plugins`
harus dimuat sebagai {{< glossary_tooltip term_id="volume" >}} pada 
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) 
plugin.

Jika kamu memilih pendekatan DaemonSet, kamu dapat bergantung pada Kubernetes untuk meletakkan Pod 
_plugin_ perangkat ke Node, memulai-ulang Pod daemon setelah kegagalan, dan membantu otomasi pembaruan.

## Kecocokan API

Sebelumnya, skema pengversian mengharuskan versi API Plugin Perangkat untuk cocok persis dengan
versi kubelet. Sejak lulusnya fitur ini ke tahap Beta di v1.12, ini bukan lagi persyaratan yang ketat.
API telah terversi dan tetap stabil sejak lulusnya fitur ini ke tahap Beta. Karena itu, peningkatan
kubelet seharusnya berjalan lancar, tetapi masih mungkin ada perubahan dalam API sebelum stabilisasi,
yang membuat upgrade tidak dijamin tidak akan mengganggu.

{{< note >}}
Meskipun komponen Device Manager Kubernetes adalah fitur yang tersedia secara umum, _API plugin perangkat_ tidak stabil.
Untuk informasi lebih lanjut mengenai API plugin perangkat dan kompatibilitas versi,
baca [Versi API Plugin Perangkat](/docs/reference/node/device-plugin-api-versions/).
{{< /note >}}

Sebagai proyek, Kubernetes merekomendasikan para developer _plugin_ perangkat:

* Mengamati perubahan pada rilis mendatang.
* Mendukung versi API _plugin_ perangkat berbeda untuk kompatibilitas-maju/mundur.

Jika kamu menyalakan fitur DevicePlugins dan menjalankan _plugin_ perangkat pada node yang perlu diperbarui 
ke rilis Kubernetes dengan versi API plugin yang lebih baru, perbarui _plugin_ perangkatmu
agar mendukung kedua versi sebelum membarui para node ini. Memilih pendekatan demikian akan
menjamin fungsi berkelanjutan dari alokasi perangkat selama pembaruan.

## Mengawasi Sumber Daya Plugin Perangkat

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Dalam rangka mengawasi sumber daya yang disediakan _plugin_ perangkat, agen monitoring perlu bisa
menemukan kumpulan perangkat yang terpakai dalam node dan mengambil metadata untuk mendeskripsikan
pada kontainer mana metrik harus diasosiasikan. Metrik [prometheus](https://prometheus.io/)
diekspos oleh agen pengawas perangkat harus mengikuti
[Petunjuk Instrumentasi Kubernetes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md),
mengidentifikasi kontainer dengan label prometheus `pod`, `namespace`, dan `container`.

kubelet menyediakan servis gRPC untuk menyalakan pencarian perangkat yang terpakai, dan untuk menyediakan metadata
untuk perangkat berikut:

```gRPC
// PodResourcesLister adalah layanan yang disediakan kubelet untuk menyediakan informasi tentang
// sumber daya node yang dikonsumsi Pod dan kontainer pada node
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
    rpc Get(GetPodResourcesRequest) returns (GetPodResourcesResponse) {}
}
```

### Endpoint gRPC `List` {#grpc-endpoint-list}

Endpoint `List` menyediakan informasi tentang sumber daya dari pod yang sedang berjalan,
dengan rincian seperti ID CPU yang dialokasikan secara eksklusif, ID perangkat sebagaimana
dilaporkan oleh plugin perangkat, dan ID dari node NUMA di mana perangkat ini dialokasikan.
Selain itu, untuk mesin berbasis NUMA, endpoint ini juga mencakup informasi tentang memori
dan hugepages yang diperuntukkan bagi sebuah kontainer.

Mulai dari Kubernetes v1.27, endpoint `List` dapat memberikan informasi tentang sumber daya
dari pod yang sedang berjalan yang dialokasikan dalam `ResourceClaims` melalui API `DynamicResourceAllocation`.
Untuk mengaktifkan fitur ini, `kubelet` harus dimulai dengan flag berikut:

```
--feature-gates=DynamicResourceAllocation=true,KubeletPodResourcesDynamicResources=true
```

```gRPC
// ListPodResourcesResponse adalah respons yang dikembalikan oleh fungsi List
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources berisi informasi tentang sumber daya node yang dialokasikan untuk sebuah pod
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources berisi informasi tentang sumber daya yang dialokasikan untuk sebuah kontainer
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
    repeated DynamicResource dynamic_resources = 5;
}

// ContainerMemory berisi informasi tentang memori dan hugepages yang dialokasikan untuk sebuah kontainer
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// Topology menjelaskan topologi perangkat keras dari sumber daya
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// Representasi NUMA dari node NUMA
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices berisi informasi tentang perangkat yang dialokasikan untuk sebuah kontainer
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}

// DynamicResource berisi informasi tentang perangkat yang dialokasikan untuk sebuah kontainer oleh Alokasi Sumber Daya Dinamis
message DynamicResource {
    string class_name = 1;
    string claim_name = 2;
    string claim_namespace = 3;
    repeated ClaimResource claim_resources = 4;
}

// ClaimResource berisi informasi sumber daya per-plugin
message ClaimResource {
    repeated CDIDevice cdi_devices = 1 [(gogoproto.customname) = "CDIDevices"];
}

// CDIDevice mengspesifikasikan informasi perangkat CDI
message CDIDevice {
    // Nama perangkat CDI yang sepenuhnya terqualifikasi
    // misalnya: vendor.com/gpu=gpudevice1
    // lihat detail lebih lanjut dalam spesifikasi CDI:
    // https://github.com/container-orchestrated-devices/container-device-interface/blob/main/SPEC.md
    string name = 1;
}
```

{{< note >}}
`cpu_ids` dalam `ContainerResources` pada endpoint `List` sesuai dengan CPU eksklusif yang
dialokasikan untuk kontainer tertentu. Jika tujuannya adalah untuk mengevaluasi CPU yang
termasuk dalam pool bersama, endpoint `List` perlu digunakan bersamaan dengan endpoint
`GetAllocatableResources` seperti yang dijelaskan di bawah ini:

1. Panggil `GetAllocatableResources` untuk mendapatkan daftar semua CPU yang dapat dialokasikan.
2. Panggil `GetCpuIds` pada semua `ContainerResources` di sistem.
3. Kurangi semua CPU dari panggilan `GetCpuIds` dari panggilan `GetAllocatableResources`.
{{< /note >}}

### Endpoint gRPC `GetAllocatableResources` {#grpc-endpoint-getallocatableresources}

{{< feature-state state="stable" for_k8s_version="v1.28" >}}

`GetAllocatableResources` menyediakan informasi tentang sumber daya yang awalnya tersedia pada node pekerja.
Ini memberikan informasi lebih banyak daripada yang diekspor kubelet ke APIServer.

{{< note >}}
`GetAllocatableResources` hanya boleh digunakan untuk mengevaluasi
[sumber daya yang dapat dialokasikan](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
di sebuah node. Jika tujuannya adalah untuk mengevaluasi sumber daya yang bebas/tidak dialokasikan,
maka harus digunakan bersamaan dengan endpoint `List()`. Hasil yang diperoleh dari `GetAllocatableResources`
akan tetap sama kecuali ada perubahan pada sumber daya yang mendasarinya yang diekspos ke kubelet.
Hal ini jarang terjadi, tetapi ketika itu terjadi (misalnya: hotplug/hotunplug, perubahan kesehatan perangkat),
klien diharapkan untuk memanggil endpoint `GetAllocatableResources`.

Namun, memanggil endpoint `GetAllocatableResources` tidak cukup dalam kasus pembaruan CPU dan/atau memori,
dan Kubelet perlu di-restart untuk mencerminkan kapasitas sumber daya yang benar dan dapat dialokasikan.
{{< /note >}}

```gRPC
// AllocatableResourcesResponses berisi informasi tentang semua perangkat yang diketahui oleh kubelet
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
    repeated ContainerMemory memory = 3;
}
```

`ContainerDevices` memang mengungkapkan informasi topologi yang menyatakan ke sel NUMA mana perangkat
tersebut terasosiasi. Sel NUMA diidentifikasi menggunakan ID integer yang tidak jelas, yang nilainya
konsisten dengan apa yang dilaporkan oleh plugin perangkat
[ketika mereka mendaftar ke kubelet](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).

Servis gRPC dilayani lewat socket unix pada `/var/lib/kubelet/pod-resources/kubelet.sock`.
Agen pengawas untuk sumber daya _plugin_ perangkat dapat di-_deploy_ sebagai daemon, atau sebagai DaemonSet.
Direktori _canonical_ `/var/lib/kubelet/pod-resources` perlu akses berprivilese,
sehingga agen pengawas harus berjalan dalam konteks keamanan dengan privilese. Jika agen pengawas perangkat berjalan
sebagai DaemonSet, `/var/lib/kubelet/pod-resources` harus dimuat sebagai
{{< glossary_tooltip term_id="volume" >}} pada plugin 
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

{{< note >}}

Saat mengakses `/var/lib/kubelet/pod-resources/kubelet.sock` dari DaemonSet
atau aplikasi lain yang diterapkan sebagai kontainer di host, yang memasang socket sebagai
volume, merupakan praktik yang baik untuk memasang direktori `/var/lib/kubelet/pod-resources/`
daripada `/var/lib/kubelet/pod-resources/kubelet.sock`. Ini akan memastikan
bahwa setelah kubelet di-restart, kontainer akan dapat terhubung kembali ke socket ini.

Pemasangan kontainer dikelola dengan inode yang mereferensikan socket atau direktori,
tergantung pada apa yang dipasang. Ketika kubelet di-restart, socket dihapus
dan socket baru dibuat, sementara direktori tetap tidak tersentuh.
Jadi inode asli untuk socket menjadi tidak dapat digunakan. Inode ke direktori
akan tetap berfungsi.

{{< /note >}}

### Endpoint gRPC `Get` {#grpc-endpoint-get}

{{< feature-state state="alpha" for_k8s_version="v1.27" >}}

Endpoint `Get` menyediakan informasi tentang sumber daya dari Pod yang sedang berjalan.
Ini mengekspos informasi yang mirip dengan yang dijelaskan pada endpoint `List`.
Endpoint `Get` memerlukan `PodName` dan `PodNamespace` dari Pod yang sedang berjalan.

```gRPC
// GetPodResourcesRequest berisi informasi tentang pod
message GetPodResourcesRequest {
    string pod_name = 1;
    string pod_namespace = 2;
}
```

Untuk mengaktifkan fitur ini, Anda harus memulai layanan kubelet Anda dengan flag berikut:

```
--feature-gates=KubeletPodResourcesGet=true
```

Endpoint `Get` dapat memberikan informasi Pod yang berkaitan dengan sumber daya dinamis
yang dialokasikan oleh API alokasi sumber daya dinamis. Untuk mengaktifkan fitur ini,
Anda harus memastikan layanan kubelet Anda dimulai dengan flag berikut:

```
--feature-gates=KubeletPodResourcesGet=true,DynamicResourceAllocation=true,KubeletPodResourcesDynamicResources=true
```

## Integrasi Plugin Perangkat dengan Topology Manager

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

Topology Manager adalah komponen Kubelet yang membolehkan sumber daya untuk dikoordinasi
secara selaras dengan Topology. Untuk melakukannya, API Plugin Perangkat telah dikembangkan
untuk memasukkan struct `TopologyInfo`.

```gRPC
message TopologyInfo {
    repeated NUMANode nodes = 1;
}

message NUMANode {
    int64 ID = 1;
}
```

Plugin Perangkat yang ingin memanfaatkan Topology Manager dapat mengembalikan beberapa _struct_
TopologyInfo sebagai bagian dari pendaftaran perangkat, bersama dengan ID perangkat dan status
kesehatan perangkat. Manajer perangkat akan memakai informasi ini untuk konsultasi dengan
Topology Manager dan membuat keputusan alokasi sumber daya.

`TopologyInfo` mendukung kolom `nodes` yang bisa `nil` (sebagai bawaan) atau daftar node NUMA.
Ini membuat Plugin Perangkat mengumumkan apa saja yang bisa meliputi node NUMA.

Menetapkan `TopologyInfo` ke `nil` atau menyediakan daftar sel NUMA yang kosong untuk perangkat tertentu
menunjukkan bahwa Plugin Perangkat tidak memiliki preferensi afinitas NUMA untuk perangkat tersebut.

Contoh _struct_ `TopologyInfo` untuk perangkat yang dipopulate oleh Plugin Perangkat:

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

## Contoh _plugin_ perangkat {#contoh}

{{% thirdparty-content %}}

Berikut beberapa contoh implementasi _plugin_ perangkat:

* [Akri](https://github.com/project-akri/akri), yang memungkinkan Anda dengan mudah
  mengekspos perangkat daun heterogen (seperti kamera IP dan perangkat USB).
* [Plugin perangkat AMD GPU](https://github.com/ROCm/k8s-device-plugin)
* [Plugin perangkat generik](https://github.com/squat/generic-device-plugin)
  untuk perangkat Linux generik dan perangkat USB
* [HAMi](https://github.com/Project-HAMi/HAMi) untuk middleware virtualisasi komputasi AI
  heterogen (misalnya, NVIDIA, Cambricon, Hygon, Iluvatar, MThreads, Ascend, Metax)
* [Plugin perangkat Intel](https://github.com/intel/intel-device-plugins-for-kubernetes)
  untuk perangkat Intel GPU, FPGA, QAT, VPU, SGX, DSA, DLB, dan IAA
* [Plugin perangkat KubeVirt](https://github.com/kubevirt/kubernetes-device-plugins)
  untuk virtualisasi hardware-assisted
* [Plugin perangkat GPU NVIDIA](https://github.com/NVIDIA/k8s-device-plugin),
  plugin resmi NVIDIA untuk mengekspos GPU NVIDIA dan memonitor kesehatan GPU
* [Plugin perangkat GPU NVIDIA untuk Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [Plugin perangkat RDMA](https://github.com/hustcat/k8s-rdma-device-plugin)
* [Plugin perangkat SocketCAN](https://github.com/collabora/k8s-socketcan)
* [Plugin perangkat Solarflare](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [Plugin perangkat SR-IOV Network](https://github.com/intel/sriov-network-device-plugin)
* [Plugin perangkat FPGA Xilinx](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin)
  untuk perangkat FPGA Xilinx

## {{% heading "whatsnext" %}}

* Pelajari bagaimana [menjadwalkan sumber daya GPU](/docs/tasks/manage-gpus/scheduling-gpus/) dengan _plugin_ perangkat
* Pelajari bagaimana [mengumumkan sumber daya ekstensi](/docs/tasks/administer-cluster/extended-resource-node/) pada node
* Baca tentang penggunaan [akselerasi perangkat keras untuk ingress TLS](https://kubernetes.io/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) dengan Kubernetes
* Pelajari tentang [Topology Manager] (/docs/tasks/adminster-cluster/topology-manager/)
