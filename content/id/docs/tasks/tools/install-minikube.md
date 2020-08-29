---
title: Menginstal Minikube
content_type: task
weight: 20
card:
  name: tasks
  weight: 10
---

<!-- overview -->

Halaman ini menunjukkan cara instalasi [Minikube](/id/docs/tutorials/hello-minikube), sebuah alat untuk menjalankan sebuah klaster Kubernetes dengan satu Node pada mesin virtual yang ada di komputer kamu.



## {{% heading "prerequisites" %}}


{{< tabs name="minikube_before_you_begin" >}}
{{% tab name="Linux" %}}
Untuk mengecek jika virtualisasi didukung pada Linux, jalankan perintah berikut dan pastikan keluarannya tidak kosong:
```
grep -E --color 'vmx|svm' /proc/cpuinfo
```
{{% /tab %}}

{{% tab name="macOS" %}}
Untuk mengecek jika virtualisasi didukung di macOS, jalankan perintah berikut di terminal kamu.
```
sysctl -a | grep -E --color 'machdep.cpu.features|VMX'
```
Jika kamu melihat `VMX` pada hasil keluaran (seharusnya berwarna), artinya fitur VT-x sudah diaktifkan di mesin kamu.
{{% /tab %}}

{{% tab name="Windows" %}}
Untuk mengecek jika virtualisasi didukung di Windows 8 ke atas, jalankan perintah berikut di terminal Windows atau _command prompt_ kamu.

```
systeminfo
```
Jika kamu melihat keluaran berikut, maka virtualisasi didukung di Windows kamu.
```
Hyper-V Requirements:     VM Monitor Mode Extensions: Yes
                          Virtualization Enabled In Firmware: Yes
                          Second Level Address Translation: Yes
                          Data Execution Prevention Available: Yes
```
Jika kamu melihat keluaran berikut, sistem kamu sudah memiliki sebuah Hypervisor yang terinstal dan kamu bisa melewati langkah berikutnya.
```
Hyper-V Requirements:     A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```


{{% /tab %}}
{{< /tabs >}}



<!-- steps -->

## Menginstal minikube

{{< tabs name="tab_with_md" >}}
{{% tab name="Linux" %}}

### Menginstal kubectl

Pastikan kamu mempunyai kubectl yang terinstal. Kamu bisa menginstal kubectl dengan mengikuti instruksi pada halaman [Menginstal dan Menyiapkan kubectl](/id/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux).

### Menginstal sebuah Hypervisor

Jika kamu belum menginstal sebuah Hypervisor, silakan instal salah satu dari:

• [KVM](https://www.linux-kvm.org/), yang juga menggunakan QEMU

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

Minikube juga mendukung sebuah opsi `--driver=none` untuk menjalankan komponen-komponen Kubernetes pada _host_, bukan di dalam VM. Untuk menggunakan _driver_ ini maka diperlukan [Docker](https://www.docker.com/products/docker-desktop) dan sebuah lingkungan Linux, bukan sebuah hypervisor.

Jika kamu menggunakan _driver_ `none` pada Debian atau turunannya, gunakan  paket (_package_) `.deb` untuk Docker daripada menggunakan paket _snap_-nya, karena paket _snap_ tidak berfungsi dengan Minikube.
Kamu bisa mengunduh paket `.deb` dari [Docker](https://www.docker.com/products/docker-desktop).

{{< caution >}}
*Driver* VM `none` dapat menyebabkan masalah pada keamanan dan kehilangan data. Sebelum menggunakan opsi `--driver=none`, periksa [dokumentasi ini](https://minikube.sigs.k8s.io/docs/reference/drivers/none/) untuk informasi lebih lanjut.
{{< /caution >}}

Minikube juga mendukung opsi `vm-driver=podman` yang mirip dengan _driver_ Docker. Podman yang berjalan dengan hak istimewa _superuser_ (pengguna _root_) adalah cara terbaik untuk memastikan kontainer-kontainer kamu memiliki akses penuh ke semua fitur yang ada pada sistem kamu.

{{< caution >}}
_Driver_ `podman` memerlukan kontainer yang berjalan dengan akses _root_ karena akun pengguna biasa tidak memiliki akses penuh ke semua fitur sistem operasi yang mungkin diperlukan oleh kontainer.
{{< /caution >}}

### Menginstal Minikube menggunakan sebuah paket

Tersedia paket uji coba untuk Minikube, kamu bisa menemukan paket untuk Linux (AMD64) di laman [rilisnya](https://github.com/kubernetes/minikube/releases) Minikube di GitHub.

Gunakan alat instalasi paket pada distribusi Linux kamu untuk menginstal paket yang sesuai.

### Menginstal Minikube melalui pengunduhan langsung

Jika kamu tidak menginstal melalui sebuah paket, kamu bisa mengunduh sebuah _stand-alone binary_ dan menggunakannya.


```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Berikut adalah cara mudah untuk menambahkan program Minikube ke _path_ kamu.

```shell
sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```

### Menginstal Minikube menggunakan Homebrew

Sebagai alternatif, kamu bisa menginstal Minikube menggunakan Linux [Homebrew](https://docs.brew.sh/Homebrew-on-Linux):

```shell
brew install minikube
```

{{% /tab %}}
{{% tab name="macOS" %}}
### Instalasi kubectl

Pastikan kamu mempunyai kubectl yang terinstal. Kamu bisa menginstal kubectl berdasarkan instruksi pada laman [Menginstal dan Menyiapkan kubectl](/id/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos).

### Instalasi sebuah Hypervisor

Jika kamu belum menginstal sebuah Hypervisor, silakan instal salah satu  dari:

• [HyperKit](https://github.com/moby/hyperkit)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

• [VMware Fusion](https://www.vmware.com/products/fusion)

### Instalasi Minikube
Cara paling mudah untuk menginstal Minikube pada macOS adalah menggunakan [Homebrew](https://brew.sh):

```shell
brew install minikube
```

Kamu juga bisa menginstalnya dengan mengunduh _stand-alone binary_-nya:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 \
  && chmod +x minikube
```

Berikut adalah cara mudah untuk menambahkan program Minikube ke _path_ kamu.

```shell
sudo mv minikube /usr/local/bin
```

{{% /tab %}}
{{% tab name="Windows" %}}
### Instalasi kubectl

Pastikan kamu mempunyai kubectl yang terinstal. Kamu bisa menginstal kubectl berdasarkan instruksi pada halaman [Menginstal dan Menyiapkan kubectl](/id/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows).

### Menginstal sebuah Hypervisor

Jika kamu belum menginstal sebuah Hypervisor, silakan instal salah satu dari:

• [Hyper-V](https://msdn.microsoft.com/en-us/virtualization/hyperv_on_windows/quick_start/walkthrough_install)

• [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

{{< note >}}
Hyper-V hanya dapat berjalan pada tiga versi dari Windows 10: Windows 10 Enterprise, Windows 10 Professional, dan Windows 10 Education.
{{< /note >}}

### Menginstal Minikube menggunakan Chocolatey

Cara paling mudah untuk menginstal Minikube pada Windows adalah menggunakan [Chocolatey](https://chocolatey.org/) (jalankan sebagai administrator):

```shell
choco install minikube
```

Setelah Minikube telah selesai diinstal, tutup sesi CLI dan hidupkan ulang CLI-nya. Minikube akan ditambahkan ke _path_ kamu secara otomatis.

### Menginstal Minikube menggunakan sebuah program penginstal

Untuk menginstal Minikube secara manual pada Windows menggunakan [Windows Installer](https://docs.microsoft.com/en-us/windows/desktop/msi/windows-installer-portal), unduh [`minikube-installer.exe`](https://github.com/kubernetes/minikube/releases/latest/download/minikube-installer.exe) dan jalankan program penginstal tersebut.

### Menginstal Minikube melalui pengunduhan langsung

Untuk menginstal Minikube secara manual pada Windows, unduh [`minikube-windows-amd64`](https://github.com/kubernetes/minikube/releases/latest), ubah nama menjadi `minikube.exe`, dan tambahkan ke _path_ kamu.

{{% /tab %}}
{{< /tabs >}}


## Memastikan instalasi

Untuk memastikan keberhasilan kedua instalasi hypervisor dan Minikube, kamu bisa menjalankan perintah berikut untuk memulai sebuah klaster Kubernetes lokal:
{{< note >}}

Untuk pengaturan  `--driver` dengan `minikube start`, masukkan nama hypervisor `<driver_name>` yang kamu instal dengan huruf kecil seperti yang ditunjukan dibawah. Daftar lengkap nilai `--driver` tersedia di [dokumentasi menentukan *driver* VM](/docs/setup/learning-environment/minikube/#specifying-the-vm-driver).

{{< /note >}}

```shell
minikube start --driver=<driver_name>
```

Setelah `minikube start` selesai, jalankan perintah di bawah untuk mengecek status klaster:

```shell
minikube status
```

Jika klasternya berjalan, keluaran dari `minikube status` akan mirip seperti ini:

```
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

Setelah kamu memastikan bahwa Minikube berjalan sesuai dengan hypervisor yang telah kamu pilih, kamu dapat melanjutkan untuk menggunakan Minikube atau menghentikan klaster kamu. Untuk menghentikan klaster, jalankan:

```shell
minikube stop
```

## Membersihkan *state* lokal {#cleanup-local-state}

Jika sebelumnya kamu pernah menginstal Minikube, dan menjalankan:
```shell
minikube start
```

dan `minikube start` memberikan pesan kesalahan:
```
machine does not exist
```

maka kamu perlu membersihkan _state_ lokal Minikube:
```shell
minikube delete
```

## {{% heading "whatsnext" %}}


* [Menjalanakan Kubernetes secara lokal dengan Minikube](/docs/setup/learning-environment/minikube/)
