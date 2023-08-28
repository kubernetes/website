---
title: Plugin Jaringan
content_type: concept
weight: 10
---


<!-- overview -->

{{< feature-state state="alpha" >}}
{{< warning >}}Fitur-fitur Alpha berubah dengan cepat. {{< /warning >}}

_Plugin_ jaringan di Kubernetes hadir dalam beberapa varian:

* _Plugin_ CNI : mengikuti spesifikasi appc / CNI, yang dirancang untuk interoperabilitas.
* _Plugin_ Kubenet : mengimplementasi `cbr0` sederhana menggunakan _plugin_ `bridge` dan `host-local` CNI



<!-- body -->

## Instalasi

Kubelet memiliki _plugin_ jaringan bawaan tunggal, dan jaringan bawaan umum untuk seluruh kluster. _Plugin_ ini memeriksa _plugin-plugin_ ketika dijalankan, mengingat apa yang ditemukannya, dan mengeksekusi _plugin_ yang dipilih pada waktu yang tepat dalam siklus pod (ini hanya berlaku untuk Docker, karena rkt mengelola _plugin_ CNI sendiri). Ada dua parameter perintah Kubelet yang perlu diingat saat menggunakan _plugin_:

* `cni-bin-dir`: Kubelet memeriksa direktori ini untuk _plugin-plugin_ saat _startup_
* `network-plugin`: _Plugin_ jaringan untuk digunakan dari `cni-bin-dir`. Ini harus cocok dengan nama yang dilaporkan oleh _plugin_ yang diperiksa dari direktori _plugin_. Untuk _plugin_ CNI, ini (nilainya) hanyalah "cni".

## Persyaratan _Plugin_ Jaringan

Selain menyediakan [antarmuka `NetworkPlugin`](https://github.com/kubernetes/kubernetes/tree/v{{< skew currentPatchVersion >}}/pkg/kubelet/dockershim/network/plugins.go) untuk mengonfigurasi dan membersihkan jaringan Pod, _plugin_ ini mungkin juga memerlukan dukungan khusus untuk kube-proxy. Proksi _iptables_ jelas tergantung pada _iptables_, dan _plugin_ ini mungkin perlu memastikan bahwa lalu lintas kontainer tersedia untuk _iptables_. Misalnya, jika plugin menghubungkan kontainer ke _bridge_ Linux, _plugin_ harus mengatur nilai sysctl `net/bridge/bridge-nf-call-iptables` menjadi `1` untuk memastikan bahwa proksi _iptables_ berfungsi dengan benar. Jika _plugin_ ini tidak menggunakan _bridge_ Linux (melainkan sesuatu seperti Open vSwitch atau mekanisme lainnya), _plugin_ ini harus memastikan lalu lintas kontainer dialihkan secara tepat untuk proksi.

Secara bawaan jika tidak ada _plugin_ jaringan Kubelet yang ditentukan, _plugin_ `noop` digunakan, yang menetapkan `net/bridge/bridge-nf-call-iptables=1` untuk memastikan konfigurasi sederhana (seperti Docker dengan sebuah _bridge_) bekerja dengan benar dengan proksi _iptables_.

### CNI

_Plugin_ CNI dipilih dengan memberikan opsi _command-line_ `--network-plugin=cni` pada Kubelet. Kubelet membaca berkas dari `--cni-conf-dir` (bawaan `/etc/cni/net.d`) dan menggunakan konfigurasi CNI dari berkas tersebut untuk mengatur setiap jaringan Pod. Berkas konfigurasi CNI harus sesuai dengan [spesifikasi CNI](https://github.com/containernetworking/cni/blob/master/SPEC.md#network-configuration), dan setiap _plugin_ CNI yang diperlukan oleh konfigurasi harus ada di `--cni-bin-dir` (nilai bawaannya adalah `/opt/cni/bin`).

Jika ada beberapa berkas konfigurasi CNI dalam direktori, Kubelet menggunakan berkas yang pertama dalam urutan abjad.

Selain plugin CNI yang ditentukan oleh berkas konfigurasi, Kubernetes memerlukan _plugin_ CNI standar [`lo`](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go) _plugin_ , minimal pada versi 0.2.0.

#### Dukungan hostPort

_Plugin_ jaringan CNI mendukung `hostPort`. Kamu dapat menggunakan _plugin_ [portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap) resmi yang ditawarkan oleh tim _plugin_ CNI atau menggunakan _plugin_ kamu sendiri dengan fungsionalitas _portMapping_.

Jika kamu ingin mengaktifkan dukungan `hostPort`, kamu harus menentukan `portMappings capability` di `cni-conf-dir` kamu.
Contoh:

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "portmap",
      "capabilities": {"portMappings": true},
      "externalSetMarkChain": "KUBE-MARK-MASQ"
    }
  ]
}
```

#### Dukungan pembentukan lalu-lintas

_Plugin_ jaringan CNI juga mendukung pembentukan lalu-lintas yang masuk dan keluar dari Pod. Kamu dapat menggunakan _plugin_ resmi [_bandwidth_](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth) yang ditawarkan oleh tim _plugin_ CNI atau menggunakan _plugin_ kamu sendiri dengan fungsionalitas kontrol _bandwidth_.

Jika kamu ingin mengaktifkan pembentukan lalu-lintas, kamu harus menambahkan _plugin_ `bandwidth` ke berkas konfigurasi CNI kamu (nilai bawaannya adalah `/etc/cni/ net.d`).

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "bandwidth",
      "capabilities": {"bandwidth": true}
    }
  ]
}
```

Sekarang kamu dapat menambahkan anotasi `kubernetes.io/ingress-bandwidth` dan `kubernetes.io/egress-bandwidth` ke Pod kamu.
Contoh:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/ingress-bandwidth: 1M
    kubernetes.io/egress-bandwidth: 1M
...
```

### Kubenet

Kubenet adalah _plugin_ jaringan yang sangat mendasar dan sederhana, hanya untuk Linux. Ia, tidak dengan sendirinya, mengimplementasi fitur-fitur yang lebih canggih seperti jaringan _cross-node_ atau kebijakan jaringan. Ia biasanya digunakan bersamaan dengan penyedia layanan cloud yang menetapkan aturan _routing_ untuk komunikasi antar Node, atau dalam lingkungan Node tunggal.

Kubenet membuat _bridge_ Linux bernama `cbr0` dan membuat pasangan _veth_ untuk setiap Pod dengan ujung _host_ dari setiap pasangan yang terhubung ke `cbr0`. Ujung Pod dari pasangan diberi alamat IP yang dialokasikan dari rentang yang ditetapkan untuk Node baik melalui konfigurasi atau oleh controller-manager. `cbr0` memiliki MTU yang cocok dengan MTU terkecil dari antarmuka normal yang diaktifkan pada _host_.

_Plugin_ ini memerlukan beberapa hal:

* _Plugin_ CNI `bridge`, `lo` dan `host-local` standar diperlukan, minimal pada versi 0.2.0. Kubenet pertama-tama akan mencari mereka di `/opt/cni/bin`. Tentukan `cni-bin-dir` untuk menyediakan lokasi pencarian tambahan. Hasil pencarian pertama akan digunakan.
* Kubelet harus dijalankan dengan argumen `--network-plugin=kubenet` untuk mengaktifkan _plugin_
* Kubelet juga harus dijalankan dengan argumen `--non-masquerade-cidr=<clusterCidr>` untuk memastikan lalu-lintas ke IP-IP di luar rentang ini akan menggunakan _masquerade_ IP.
* Node harus diberi subnet IP melalui perintah kubelet `--pod-cidr` atau perintah controller-manager `--allocate-node-cidrs=true --cluster-cidr=<cidr>`.

### Menyesuaikan MTU (dengan kubenet)

MTU harus selalu dikonfigurasi dengan benar untuk mendapatkan kinerja jaringan terbaik. _Plugin_ jaringan biasanya akan mencoba membuatkan MTU yang masuk akal, tetapi terkadang logika tidak akan menghasilkan MTU yang optimal. Misalnya, jika _bridge_ Docker atau antarmuka lain memiliki MTU kecil, kubenet saat ini akan memilih MTU tersebut. Atau jika kamu menggunakan enkapsulasi IPSEC, MTU harus dikurangi, dan perhitungan ini di luar cakupan untuk sebagian besar _plugin_ jaringan.

Jika diperlukan, kamu dapat menentukan MTU secara eksplisit dengan opsi `network-plugin-mtu` kubelet. Sebagai contoh, pada AWS `eth0` MTU biasanya adalah 9001, jadi kamu dapat menentukan `--network-plugin-mtu=9001`. Jika kamu menggunakan IPSEC, kamu dapat menguranginya untuk memungkinkan/mendukung _overhead_ enkapsulasi pada IPSEC, contoh: `--network-plugin-mtu=8873`.

Opsi ini disediakan untuk _plugin_ jaringan; Saat ini **hanya kubenet yang mendukung `network-plugin-mtu`**.

## Ringkasan Penggunaan

* `--network-plugin=cni` menetapkan bahwa kita menggunakan _plugin_ jaringan `cni` dengan _binary-binary plugin_ CNI aktual yang terletak di `--cni-bin-dir` (nilai bawaannya `/opt/cni/bin`) dan konfigurasi _plugin_ CNI yang terletak di `--cni-conf-dir` (nilai bawaannya `/etc/cni/net.d`).
* `--network-plugin=kubenet` menentukan bahwa kita menggunakan _plugin_ jaringan `kubenet` dengan `bridge` CNI dan _plugin-plugin_ `host-local` yang terletak di `/opt/cni/bin` atau `cni-bin-dir`.
* `--network-plugin-mtu=9001` menentukan MTU yang akan digunakan, saat ini hanya digunakan oleh _plugin_ jaringan `kubenet`.



## {{% heading "whatsnext" %}}
