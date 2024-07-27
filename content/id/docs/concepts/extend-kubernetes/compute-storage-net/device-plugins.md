---
reviewers:
title: Plugin Perangkat
description: Gunakan kerangka kerja _plugin_ perangkat Kubernetes untuk mengimplementasikan plugin untuk GPU, NIC, FPGA, InfiniBand, dan sumber daya sejenis yang membutuhkan setelan spesifik vendor.
content_type: concept
weight: 20
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.10" state="beta" >}}

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
      image: registry.k8s.io/pause:2.0
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
        // ListAndWatch mengembalikan aliran dari List of Devices
        // Kapanpun Device menyatakan perubahan atau kehilangan Device, ListAndWatch
        // mengembalikan daftar baru
        rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

        // Allocate dipanggil saat pembuatan kontainer sehingga Device
        // Plugin dapat menjalankan operasi spesifik perangkat dan menyuruh Kubelet
        // dari operasi untuk membuat Device tersedia di kontainer
        rpc Allocate(AllocateRequest) returns (AllocateResponse) {}
  }
  ```

* Plugin mendaftarkan dirinya sendiri dengan kubelet melalui Unix socket pada lokasi host
  `/var/lib/kubelet/device-plugins/kubelet.sock`.

* Seteleh sukses mendaftarkan dirinya sendiri, _plugin_ perangkat berjalan dalam mode peladen, dan selama itu
dia tetap mengawasi kesehatan perangkat dan melaporkan balik ke kubelet terhadap perubahan status perangkat.
Dia juga bertanggung jawab untuk melayani _request_ gRPC `Allocate`. Selama `Allocate`, _plugin_ perangkat dapat 
membuat persiapan spesifik-perangkat; contohnya, pembersihan GPU atau inisiasi QRNG.
Jika operasi berhasil, _plugin_ perangkat mengembalikan `AllocateResponse` yang memuat konfigurasi 
runtime kontainer untuk mengakses perangkat teralokasi. Kubelet memberikan informasi ini ke runtime kontainer.

### Menangani kubelet yang _restart_

Plugin perangkat diharapkan dapat mendeteksi kubelet yang _restart_ dan mendaftarkan dirinya sendiri kembali dengan 
_instance_ kubelet baru. Pada implementasi sekarang, sebuah _instance_ kubelet baru akan menghapus semua socket Unix yang ada 
di dalam `/var/lib/kubelet/device-plugins` ketika dijalankan. Plugin perangkat dapat mengawasi penghapusan 
socket Unix miliknya dan mendaftarkan dirinya sendiri kembali ketika hal tersebut terjadi.

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

Dukungan pada _plugin_ perangkat Kubernetes sedang dalam beta. API dapat berubah hingga stabil,
dalam cara yang tidak kompatibel. Sebagai proyek, Kubernetes merekomendasikan para developer _plugin_ perangkat:

* Mengamati perubahan pada rilis mendatang.
* Mendukung versi API _plugin_ perangkat berbeda untuk kompatibilitas-maju/mundur.

Jika kamu menyalakan fitur DevicePlugins dan menjalankan _plugin_ perangkat pada node yang perlu diperbarui 
ke rilis Kubernetes dengan versi API plugin yang lebih baru, perbarui _plugin_ perangkatmu
agar mendukung kedua versi sebelum membarui para node ini. Memilih pendekatan demikian akan
menjamin fungsi berkelanjutan dari alokasi perangkat selama pembaruan.

## Mengawasi Sumber Daya Plugin Perangkat

{{< feature-state for_k8s_version="v1.15" state="beta" >}}

Dalam rangka mengawasi sumber daya yang disediakan _plugin_ perangkat, agen monitoring perlu bisa
menemukan kumpulan perangkat yang terpakai dalam node dan mengambil metadata untuk mendeskripsikan
pada kontainer mana metrik harus diasosiasikan. Metrik [prometheus](https://prometheus.io/)
diekspos oleh agen pengawas perangkat harus mengikuti
[Petunjuk Instrumentasi Kubernetes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/instrumentation.md),
mengidentifikasi kontainer dengan label prometheus `pod`, `namespace`, dan `container`.

Kubelet menyediakan servis gRPC untuk menyalakan pencarian perangkat yang terpakai, dan untuk menyediakan metadata
untuk perangkat berikut:

```gRPC
// PodResourcesLister adalah layanan yang disediakan kubelet untuk menyediakan informasi tentang
// sumber daya node yang dikonsumsi Pod dan kontainer pada node
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
}
```

Servis gRPC dilayani lewat socket unix pada `/var/lib/kubelet/pod-resources/kubelet.sock`.
Agen pengawas untuk sumber daya _plugin_ perangkat dapat di-_deploy_ sebagai daemon, atau sebagai DaemonSet.
Direktori _canonical_ `/var/lib/kubelet/pod-resources` perlu akses berprivilese,
sehingga agen pengawas harus berjalan dalam konteks keamanan dengan privilese. Jika agen pengawas perangkat berjalan
sebagai DaemonSet, `/var/lib/kubelet/pod-resources` harus dimuat sebagai
{{< glossary_tooltip term_id="volume" >}} pada plugin 
[PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

Dukungan untuk "servis PodResources" butuh [gerbang fitur](/docs/reference/command-line-tools-reference/feature-gates/) 
`KubeletPodResources` untuk dinyalakan. Mulai dari Kubernetes 1.15 nilai bawaannya telah dinyalakan.

## Integrasi Plugin Perangkat dengan Topology Manager

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

Topology Manager adalah komponen Kubelet yang membolehkan sumber daya untuk dikoordinasi secara selaras dengan Topology. Untuk melakukannya, API Plugin Perangkat telah dikembangkan untuk memasukkan struct `TopologyInfo`.


```gRPC
message TopologyInfo {
	repeated NUMANode nodes = 1;
}

message NUMANode {
    int64 ID = 1;
}
```
Plugin Perangkat yang ingin memanfaatkan Topology Manager dapat mengembalikan beberapa _struct_ TopologyInfo sebagai bagian dari pendaftaran perangkat, bersama dengan ID perangkat dan status kesehatan perangkat. Manajer perangkat akan memakai informasi ini untuk konsultasi dengan Topology Manager dan membuat keputusan alokasi sumber daya.

`TopologyInfo` mendukung kolom `nodes` yang bisa `nil` (sebagai bawaan) atau daftar node NUMA. Ini membuat Plugin Perangkat mengumumkan apa saja yang bisa meliputi node NUMA.

Contoh _struct_ `TopologyInfo` untuk perangkat yang dipopulate oleh Plugin Perangkat:

```
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

## Contoh _plugin_ perangkat {#contoh}

Berikut beberapa contoh implementasi _plugin_ perangkat:

* [Plugin perangkat AMD GPU](https://github.com/ROCm/k8s-device-plugin)
* [Plugin perangkat Intel](https://github.com/intel/intel-device-plugins-for-kubernetes) untuk perangkat GPU, FPGA, dan QuickAssist Intel
* [Plugin perangkat KubeVirt](https://github.com/kubevirt/kubernetes-device-plugins) untuk virtualisasi hardware-assisted 
* [Plugin perangkat NVIDIA GPU](https://github.com/NVIDIA/k8s-device-plugin)
    * Perlu [nvidia-docker](https://github.com/NVIDIA/nvidia-docker) versi 2.0 yang memungkinkan untuk menjalakan kontainer Docker yang memuat GPU.
* [Plugin perangkat NVIDIA GPU untuk Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [Plugin perangkat RDMA](https://github.com/hustcat/k8s-rdma-device-plugin)
* [Plugin perangkat Solarflare](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [Plugin perangkat SR-IOV Network](https://github.com/intel/sriov-network-device-plugin)
* [Plugin perangkat Xilinx FPGA](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin) untuk perangkat Xilinx FPGA


## {{% heading "whatsnext" %}}


* Pelajari bagaimana [menjadwalkan sumber daya GPU](/docs/tasks/manage-gpus/scheduling-gpus/) dengan _plugin_ perangkat
* Pelajari bagaimana [mengumumkan sumber daya ekstensi](/docs/tasks/administer-cluster/extended-resource-node/) pada node
* Baca tentang penggunaan [akselerasi perangkat keras untuk ingress TLS](https://kubernetes.io/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) dengan Kubernetes
* Pelajari tentang [Topology Manager] (/docs/tasks/adminster-cluster/topology-manager/)


