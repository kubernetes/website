---
title: Runtime Container
content_type: concept
weight: 10
---
<!-- overview -->
{{< feature-state for_k8s_version="v1.6" state="stable" >}}

Untuk menjalankan Container di Pod, Kubernetes menggunakan _runtime_ Container (Container runtimes). Berikut ini adalah
petunjuk instalasi untuk berbagai macam _runtime_.


<!-- body -->


{{< caution >}}
Sebuah kekurangan ditemukan dalam cara `runc` menangani pendeskripsi berkas (_file_) sistem ketika menjalankan Container.
Container yang berbahaya dapat menggunakan kekurangan ini untuk menimpa konten biner `runc` dan
akibatnya Container tersebut dapat menjalankan perintah yang sewenang-wenang pada sistem host dari Container tersebut.

Silahkan merujuk pada [CVE-2019-5736](https://access.redhat.com/security/cve/cve-2019-5736) untuk informasi lebih lanjut tentang masalah ini.
{{< /caution >}}

### Penerapan

{{< note >}}
Dokumen ini ditulis untuk pengguna yang memasang CRI (Container Runtime Interface) pada sistem operasi Linux. Untuk sistem operasi yang lain, 
silahkan cari dokumentasi khusus untuk platform kamu.

{{< /note >}}

Kamu harus menjalankan semua perintah dalam panduan ini sebagai `root`. Sebagai contoh, awali perintah 
dengan `sudo`, atau masuk sebagai `root` dan kemudian baru menjalankan perintah sebagai pengguna `root`.

### _Driver_ cgroup

Ketika systemd dipilih sebagai sistem init untuk sebuah distribusi Linux, proses init menghasilkan
dan menggunakan grup kontrol root (`cgroup`) dan proses ini akan bertindak sebagai manajer cgroup. Systemd memiliki integrasi yang ketat
dengan cgroup dan akan mengalokasikan cgroups untuk setiap proses. Kamu dapat mengonfigurasi
_runtime_ Container dan kubelet untuk menggunakan `cgroupfs`. Menggunakan `cgroupfs` bersama dengan systemd berarti
akan ada dua manajer cgroup yang berbeda.

Cgroup digunakan untuk membatasi sumber daya yang dialokasikan untuk proses.
Sebuah manajer cgroup tunggal akan menyederhanakan pandangan tentang sumber daya apa yang sedang dialokasikan
dan secara bawaan (_default_) akan memiliki pandangan yang lebih konsisten tentang sumber daya yang tersedia dan yang sedang digunakan. Ketika kita punya memiliki 
dua manajer maka kita pun akan memiliki dua pandangan berbeda tentang sumber daya tersebut. Kita telah melihat kasus di lapangan
di mana Node yang dikonfigurasi menggunakan `cgroupfs` untuk kubelet dan Docker, dan `systemd`
untuk semua sisa proses yang berjalan pada Node maka Node tersebut akan menjadi tidak stabil di bawah tekanan sumber daya.

Mengubah aturan sedemikian rupa sehingga _runtime_ Container dan kubelet kamu menggunakan `systemd` sebagai _driver_ cgroup
akan menstabilkan sistem. Silahkan perhatikan opsi `native.cgroupdriver=systemd` dalam pengaturan Docker di bawah ini.

{{< caution >}}
Mengubah driver cgroup dari Node yang telah bergabung kedalam sebuah Cluster sangat tidak direkomendasikan.
Jika kubelet telah membuat Pod menggunakan semantik dari sebuah _driver_ cgroup, mengubah _runtime_ Container
ke _driver_ cgroup yang lain dapat mengakibatkan kesalahan pada saat percobaan untuk membuat kembali PodSandbox
untuk Pod yang sudah ada. Menjalankan ulang (_restart_) kubelet mungkin tidak menyelesaikan kesalahan tersebut. Rekomendasi yang dianjurkan
adalah untuk menguras Node dari beban kerjanya, menghapusnya dari Cluster dan menggabungkannya kembali.

{{< /caution >}}

## Docker

Pada setiap mesin kamu, mari menginstall Docker.
Versi yang direkomendasikan adalah 19.03.11, tetapi versi 1.13.1, 17.03, 17.06, 17.09, 18.06 dan 18.09 juga diketahui bekerja dengan baik.
Jagalah versi Docker pada versi terbaru yang sudah terverifikasi pada catatan rilis Kubernetes.

Gunakan perintah berikut untuk menginstal Docker pada sistem kamu:

{{< tabs name="tab-cri-docker-installation" >}}
{{% tab name="Ubuntu 16.04+" %}}

```shell
# (Menginstal Docker CE)
## Mengatur repositori:
### Menginstal packet untuk mengijinkan apt untuk menggunakan repositori melalui HTTPS
apt-get update && apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2
```

```shell
# Menambahkan key GPG resmi dari Docker:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```

```shell
# Menambahkan repositori apt dari Docker:
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
```

```shell
# Menginstal Docker CE
apt-get update && apt-get install -y \
  containerd.io=1.2.13-2 \
  docker-ce=5:19.03.11~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.11~3-0~ubuntu-$(lsb_release -cs)
```

```shell
# Mengatur daemon Docker
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
```

```shell
mkdir -p /etc/systemd/system/docker.service.d
```

```shell
# Menjalankan ulang Docker
systemctl daemon-reload
systemctl restart docker
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

```shell
# (Menginstal Docker CE)
## Mengatur repositori
### Menginstal paket yang diperlukan
yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
## Menambahkan repositori apt dari Docker
yum-config-manager --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
# Menginstal Docker CE
yum update -y && yum install -y \
  containerd.io-1.2.13 \
  docker-ce-19.03.11 \
  docker-ce-cli-19.03.11
```

```shell
## Membuat berkas /etc/docker
mkdir /etc/docker
```

```shell
# Mengatur daemon Docker
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF
```

```shell
mkdir -p /etc/systemd/system/docker.service.d
```

```shell
# Menjalankan ulang Docker
systemctl daemon-reload
systemctl restart docker
```
{{% /tab %}}
{{< /tabs >}}

Jika kamu menginginkan layanan Docker berjalan dari saat memulai pertama (_boot_), jalankan perintah ini:

```shell
sudo systemctl enable docker
```

Silahkan merujuk pada [Panduan resmi instalasi Docker](https://docs.docker.com/engine/installation/)
untuk informasi lebih lanjut.

## CRI-O

Bagian ini mencakup langkah-langkah yang diperlukan untuk menginstal `CRI-O` sebagai _runtime_ CRI.

Gunakan perintah-perinath berikut untuk menginstal CRI-O pada sistem kamu:

{{< note >}}
Versi mayor dan minor dari CRI-O harus sesuai dengan versi mayor dan minor dari Kubernetes.
Untuk informasi lebih lanjut, lihatlah [Matriks kompatibilitas CRI-O](https://github.com/cri-o/cri-o).
{{< /note >}}

### Prasyarat

```shell
modprobe overlay
modprobe br_netfilter

# Mengatur parameter sysctl yang diperlukan, dimana ini akan bernilai tetap setiap kali penjalanan ulang.
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

{{< tabs name="tab-cri-cri-o-installation" >}}
{{% tab name="Debian" %}}

```shell
# Debian Unstable/Sid
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Unstable/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Unstable/Release.key -O- | sudo apt-key add -
```

```shell
# Debian Testing
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Testing/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Testing/Release.key -O- | sudo apt-key add -
```

```shell
# Debian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_10/Release.key -O- | sudo apt-key add -
```

```shell
# Raspbian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Raspbian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Raspbian_10/Release.key -O- | sudo apt-key add -
```

dan kemudian install CRI-O:
```shell
sudo apt-get install cri-o-1.17
```

{{% /tab %}}

{{% tab name="Ubuntu 18.04, 19.04 and 19.10" %}}

```shell
# Mengatur repositori paket
. /etc/os-release
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/x${NAME}_${VERSION_ID}/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list"
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/x${NAME}_${VERSION_ID}/Release.key -O- | sudo apt-key add -
sudo apt-get update
```

```shell
# Menginstal CRI-O
sudo apt-get install cri-o-1.17
```
{{% /tab %}}

{{% tab name="CentOS/RHEL 7.4+" %}}

```shell
# Menginstal prasyarat
curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable.repo https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/CentOS_7/devel:kubic:libcontainers:stable.repo
curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable:cri-o:{{< skew latestVersion >}}.repo https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:{{< skew latestVersion >}}/CentOS_7/devel:kubic:libcontainers:stable:cri-o:{{< skew latestVersion >}}.repo
```

```shell
# Menginstal CRI-O
yum install -y cri-o
```
{{% /tab %}}

{{% tab name="openSUSE Tumbleweed" %}}

```shell
sudo zypper install cri-o
```
{{% /tab %}}
{{< /tabs >}}

### Memulai CRI-O

```shell
systemctl daemon-reload
systemctl start crio
```

Silahkan merujuk pada [Panduan instalasi CRI-O](https://github.com/kubernetes-sigs/cri-o#getting-started)
untuk informasi lanjut.

## Containerd

Bagian ini berisi langkah-langkah yang diperlukan untuk menggunakan `containerd` sebagai _runtime_ CRI.

Gunakan perintah-perintah berikut untuk menginstal containerd pada sistem kamu:


### Prasyarat

```shell
cat > /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# Mengatur parameter sysctl yang diperlukan, dimana ini akan bernilai tetap setiap kali penjalanan ulang.
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

### Menginstal containerd

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Ubuntu 16.04" %}}

```shell
# (Meninstal containerd)
## Mengatur repositori paket
### Install packages to allow apt to use a repository over HTTPS
apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
## Menambahkan key GPG resmi dari Docker:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```

```shell
## Mengatur repositori paket Docker
add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
```

```shell
## Menginstal containerd
apt-get update && apt-get install -y containerd.io
```

```shell
# Mengonfigure containerd
mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# Menjalankan ulang containerd
systemctl restart containerd
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

```shell
# (Menginstal containerd)
## Mengatur repositori
### Menginstal paket prasyarat
yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
## Menambahkan repositori Docker
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## Menginstal containerd
yum update -y && yum install -y containerd.io
```

```shell
## Mengonfigurasi containerd
mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# Menjalankan ulang containerd
systemctl restart containerd
```
{{% /tab %}}
{{< /tabs >}}

### systemd

Untuk menggunakan driver cgroup `systemd`, atur `plugins.cri.systemd_cgroup = true` pada `/etc/containerd/config.toml`.
Ketika menggunakan kubeadm, konfigurasikan secara manual
[driver cgroup untuk kubelet](/id/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#mengonfigurasi-cgroup-untuk-kubelet-pada-node-control-plane)

## _Runtime_ CRI yang lainnya: Frakti

Silahkan lihat [Panduan cepat memulai Frakti](https://github.com/kubernetes/frakti#quickstart) untuk informasi lebih lanjut.


