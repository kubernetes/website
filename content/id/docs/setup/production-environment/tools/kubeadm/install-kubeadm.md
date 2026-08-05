---
title: Menginstal kubeadm
content_type: task
weight: 10
card:
  name: setup
  weight: 20
  title: Menginstal alat persiapan kubeadm
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">Laman ini menunjukkan cara untuk menginstal `kubeadm`.
Untuk informasi mengenai cara membuat sebuah klaster dengan kubeadm setelah kamu melakukan proses instalasi ini, lihat laman [Menggunakan kubeadm untuk Membuat Sebuah Klaster](/id/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).



## {{% heading "prerequisites" %}}


* Satu mesin atau lebih yang menjalankan:
  - Ubuntu 16.04+
  - Debian 9+
  - CentOS 7
  - Red Hat Enterprise Linux (RHEL) 7
  - Fedora 25+
  - HypriotOS v1.0.1+
  - Container Linux (teruji pada versi 1800.6.0)
* 2 GB RAM atau lebih per mesin (kurang dari nilai tersebut akan menyisakan sedikit ruang untuk
   aplikasi-aplikasimu)
* 2 CPU atau lebih
* Koneksi internet pada seluruh mesin pada klaster (kamu dapat menggunakan internet
  publik ataupun pribadi)
* _Hostname_ yang unik, alamat MAC, dan product_uuid untuk setiap Node. Lihat [di sini](#memastikan-alamat-mac) untuk detail lebih lanjut.
* Porta tertentu pada mesin. Lihat [di sini](#memeriksa-porta-yang-dibutuhkan) untuk detail lebih lanjut.
* _Swap_ dinonaktifkan. Kamu **HARUS** menonaktifkan _swap_ agar kubelet dapat berfungsi dengan baik.



<!-- steps -->

## Memastikan alamat MAC dan product_uuid yang unik untuk setiap Node {#memastikan-alamat-mac}

* Kamu bisa mendapatkan alamat MAC dari antarmuka jaringan menggunakan perintah `ip link` atau `ifconfig -a`
* product_uuid didapatkan dengan perintah `sudo cat /sys/class/dmi/id/product_uuid`

Sangat memungkinkan bagi perangkat keras untuk memiliki alamat yang unik, namun beberapa mesin virtual bisa memiliki
nilai yang identik. Kubernetes menggunakan nilai-nilai tersebut untuk mengidentifikasi Node-Node secara unik pada klaster.
Jika nilai-nilai tersebut tidak unik pada tiap Node, proses instalasi
bisa saja [gagal](https://github.com/kubernetes/kubeadm/issues/31).

## Memeriksa adaptor jaringan 

Jika kamu memiliki lebih dari satu adaptor jaringan, dan komponen Kubernetes tidak dapat dijangkau melalui rute bawaan (_default route_),
kami merekomendasikan kamu untuk menambahkan rute IP sehingga alamat-alamat klaster Kubernetes melewati adaptor yang tepat.

## Membuat iptables melihat _bridged traffic_

Agar iptables pada Node Linux dapat melihat _bridged traffic_ dengan benar, kamu harus memastikan `net.bridge.bridge-nf-call-iptables` bernilai 1 pada pengaturan `sysctl`, misalnya.

```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo sysctl --system
```

Pastikan modul `br_netfilter` sudah dimuat sebelum melakukan langkah ini. Hal ini dilakukan dengan menjalankan `lsmod | grep br_netfilter`. Untuk memuatnya secara eksplisit gunakan `sudo modprobe br_netfilter`.

Untuk detail lebih lanjut, silakan lihat laman [Persyaratan _Plugin_ Jaringan](/id/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#persyaratan-plugin-jaringan).

## Memeriksa porta yang dibutuhkan

### Node _control-plane_

| Protokol | Arah | Rentang Porta | Kegunaan                 | Digunakan oleh                   |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | Inbound   | 6443*      | Kubernetes API server   | All                       |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP      | Inbound   | 10250      | Kubelet API             | Self, Control plane       |
| TCP      | Inbound   | 10251      | kube-scheduler          | Self                      |
| TCP      | Inbound   | 10252      | kube-controller-manager | Self                      |

### Node pekerja (_worker_)

| Protokol | Arah | Rentang Porta  | Kegunaan               | Digunakan oleh                 |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | Inbound   | 10250       | Kubelet API           | Self, Control plane     |
| TCP      | Inbound   | 30000-32767 | NodePort Services†    | All                     |

† Jangkauan porta bawaan untuk [Service NodePort](/id/docs/concepts/services-networking/service/).

Angka porta yang ditandai dengan * dapat diganti (_overrideable_), sehingga kamu harus memastikan porta khusus lainnya yang kamu sediakan juga terbuka.

Meskipun porta etcd turut dituliskan pada Node _control-plane_, kamu juga bisa menghos klaster etcd-mu sendiri
secara eksternal atau pada porta _custom_.

_Plugin_ jaringan Pod yang kamu gunakan (lihat di bawah) juga mungkin membutuhkan porta tertentu untuk terbuka.
Karena hal ini dapat berbeda pada setiap _plugin_ jaringan Pod, silakan lihat
dokumentasi _plugin_ mengenai porta yang dibutuhkan.

## Menginstal _runtime_ 

Untuk menjalankan Container pada Pod, Kubernetes menggunakan
{{< glossary_tooltip term_id="container-runtime" text="_runtime_ Container" >}}.

{{< tabs name="container_runtime" >}}
{{% tab name="Linux nodes" %}}

Secara bawaan, Kubernetes menggunakan
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI)
sebagai perantara dengan _runtime_ Container pilihanmu.

Jika kamu tidak menentukan _runtime_, kubeadm secara otomatis mencoba untuk mendeteksi
_runtime_ Container yang terinstal dengan memindai sekumpulan soket domain Unix yang umum digunakan.
Tabel berikut menunjukkan _runtime_ Container dan lokasi soketnya:

{{< table caption = "_Runtime_ Container dan lokasi soketnya" >}}
| _Runtime_    | Lokasi domain soket Unix        |
|------------|-----------------------------------|
| Docker     | `/var/run/docker.sock`            |
| containerd | `/run/containerd/containerd.sock` |
| CRI-O      | `/var/run/crio/crio.sock`         |
{{< /table >}}

<br />
Jika ditemukan Docker dan containerd secara bersamaan, Docker akan terpilih. Hal ini diperlukan
karena Docker 18.09 dirilis dengan containerd dan keduanya dapat ditemukan meskipun kamu
hanya menginstal Docker.
Jika ditemukan selain dari kedua _runtime_ Container tersebut, kubeadm akan berhenti dengan kegagalan.

Komponen kubelet berintegrasi dengan Docker melalui implementasi CRI `dockershim` bawaannya.

Lihat [_runtime_ Container](/id/docs/setup/production-environment/container-runtimes/)
untuk informasi lebih lanjut.
{{% /tab %}}
{{% tab name="sistem operasi lainnya" %}}
Secara bawaan, kubeadm menggunakan {{< glossary_tooltip term_id="docker" >}} sebagai _runtime_ Container.
Komponen kubelet berintegrasi dengan Docker melalui implementasi CRI `dockershim` bawaannya.

Lihat [_runtime_ Container](/id/docs/setup/production-environment/container-runtimes/)
untuk informasi lebih lanjut.
{{% /tab %}}
{{< /tabs >}}


## Menginstal kubeadm, kubelet, dan kubectl

Kamu akan menginstal _package_ berikut pada semua mesinmu:

* `kubeadm`: alat untuk mem-_bootstrap_ klaster.

* `kubelet`: komponen yang berjalan pada seluruh mesin pada klaster
    dan memiliki tugas seperti menjalankan Pod dan Container.

* `kubectl`: alat untuk berinteraksi dengan klastermu.

Alat kubeadm **tidak akan** menginstal atau mengelola `kubelet` ataupun `kubectl` untukmu, jadi kamu harus memastikan
keduanya memiliki versi yang cocok dengan _control plane_ Kubernetes yang akan kamu instal
dengan kubeadm. Jika tidak, ada risiko _version skew_ yang dapat terjadi dan
dapat berujung pada perangai yang bermasalah dan tidak terduga. Namun, _satu_ _version skew_ minor antara
kubelet dan _control plane_ masih diperbolehkan, tetapi versi kubelet tidak boleh melebihi versi API
Server. Sebagai contoh, kubelet yang berjalan pada versi 1.7.0 akan kompatibel dengan API Server versi 1.8.0, tetapi tidak sebaliknya.

Untuk informasi mengenai instalasi `kubectl`, lihat [Menginstal dan mengatur kubectl](/id/docs/tasks/tools/install-kubectl/).

{{< warning >}}
Instruksi ini membuat seluruh _package_ Kubernetes keluar dari _system upgrade_.
Hal ini karena kubeadm dan Kubernetes membutuhkan
[perhatian khusus untuk pembaharuan](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
{{</ warning >}}

Untuk informasi lebih lanjut mengenai _version skew_, lihat:

* [Kebijakan _version-skew_ dan versi Kubernetes](/docs/setup/release/version-skew-policy/)
* [Kebijakan _version skew_](/id/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy) yang spesifik untuk kubeadm

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu, Debian atau HypriotOS" %}}
```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```
{{% /tab %}}
{{% tab name="CentOS, RHEL atau Fedora" %}}
```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kubelet kubeadm kubectl
EOF

# Mengatur SELinux menjadi permissive mode (menonaktifkannya secara efektif)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

  **Catatan:**

  - Mengatur SELinux menjadi _permissive mode_ dengan menjalankan `setenforce 0` dan `sed ...` menonaktifkannya secara efektif.
    Hal ini diperlukan untuk mengizinkan Container untuk mengakses _filesystem_ hos, yang dibutuhkan untuk jaringan Pod sebagai contoh.
    Kamu harus melakukan ini sampai dukungan SELinux ditingkatkan pada kubelet.

  - Kamu dapat membiarkan SELinux aktif jika kamu mengetahui cara mengonfigurasinya, tetapi hal tersebut mungkin membutuhkan pengaturan yang tidak didukung oleh kubeadm.
    
{{% /tab %}}
{{% tab name="Container Linux" %}}
Menginstal _plugin_ CNI (dibutuhkan untuk kebanyakan jaringan Pod):

```bash
CNI_VERSION="v0.8.2"
ARCH="amd64"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-linux-${ARCH}-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

Menginstal crictl (dibutuhkan untuk kubeadm / Kubelet Container Runtime Interface (CRI))

```bash
CRICTL_VERSION="v1.22.0"
ARCH="amd64"
mkdir -p /opt/bin
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

Menginstal `kubeadm`, `kubelet`, `kubectl` dan menambahkan _systemd service_ `kubelet`:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"

mkdir -p /opt/bin
ARCH="amd64"
cd /opt/bin
curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet,kubectl}
chmod +x {kubeadm,kubelet,kubectl}

RELEASE_VERSION="v0.2.7"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service
mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Mengaktifkan dan menjalankan `kubelet`:

```bash
systemctl enable --now kubelet
```
{{% /tab %}}
{{< /tabs >}}


Sekarang kubelet akan melakukan _restart_ setiap beberapa detik, sambil menunggu dalam kondisi _crashloop_ sampai kubeadm memberikan instruksi yang harus dilakukan.

## Mengonfigurasi _driver_ cgroup yang digunakan oleh kubelet pada Node _control-plane_ {#mengonfigurasi-cgroup-untuk-kubelet-pada-node-control-plane}

Ketika menggunakan Docker, kubeadm akan mendeteksi secara otomatis _driver_ cgroup untuk kubelet
dan mengaturnya pada berkas `/var/lib/kubelet/config.yaml` pada saat _runtime_.

Jika kamu menggunakan CRI yang berbeda, kamu harus memodifikasi berkasnya dengan nilai `cgroupDriver` yang kamu gunakan, seperti berikut:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: <value>
```

Harap diperhatikan, kamu **hanya** perlu melakukannya jika _driver_ cgroup dari CRI pilihanmu
bukanlah `cgroupfs`, karena nilai tersebut merupakan nilai bawaan yang digunakan oleh kubelet.

{{< note >}}
Karena opsi `--cgroup-driver` sudah dihilangkan pada kubelet, jika kamu memilikinya pada `/var/lib/kubelet/kubeadm-flags.env`
atau `/etc/default/kubelet`(`/etc/sysconfig/kubelet` untuk RPM), silakan hapus dan gunakan KubeletConfiguration
(secara bawaan disimpan di `/var/lib/kubelet/config.yaml`).
{{< /note >}}

Kamu harus melakukan _restart_ pada kubelet:

```bash
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

Deteksi _driver_ cgroup secara otomatis untuk _runtime_ Container lainnya
seperti CRI-O dan containerd masih dalam proses pengembangan.


## Penyelesaian masalah

Jika kamu menemui kesulitan dengan kubeadm, silakan merujuk pada [dokumen penyelesaian masalah](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}


* [Menggunakan kubeadm untuk Membuat Sebuah Klaster](/id/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
