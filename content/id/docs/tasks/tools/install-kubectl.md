---
title: Instalasi dan Konfigurasi kubectl
content_template: templates/task
weight: 10
card:
  name: tasks
  weight: 20
  title: Instalasi kubectl
---

{{% capture overview %}}
[Kubectl](/docs/user-guide/kubectl/) adalah perangkat barisan perintah Kubernetes yang digunakan untuk menjalankan berbagai perintah untuk kluster Kubernetes. Kamu dapat menggunakan `kubectl` untuk men-_deploy_ aplikasi, mengatur _resource_ kluster, dan melihat _log_. Daftar operasi `kubectl` dapat dilihat di [Ikhtisar kubectl](/docs/reference/kubectl/overview/).
{{% /capture %}}

{{% capture prerequisites %}}
Kamu boleh menggunakan `kubectl` versi berapapun selama versi minornya sama atau berbeda satu. Misal, klien v1.2 masih dapat digunakan dengan v1.1, v1.2, dan 1.3 master. Menggunakan versi terbaru `kubectl` dapat menghindari permasalahan yang tidak terduga.
{{% /capture %}}

{{% capture steps %}}

## Instalasi kubectl di Linux

### Instalasi binari kubectl dengan curl di Linux

1. Unduh versi terbaru dengan perintah:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
    ```

    Untuk mengunduh versi spesifik, ganti bagian `curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt` dengan versi yang diinginkan.

    Misal, untuk mengunduh versi {{< param "fullversion" >}} di Linux, ketik:
    
    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

1. Buat agar binari `kubectl` dapat dijalankan.

    ```
    chmod +x ./kubectl
    ```

1. Pindahkan ke PATH komputer.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
1. Pastikan instalasi sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

### Instalasi dengan paket manajer bawaan

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu, Debian or HypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https gnupg2
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS, RHEL or Fedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}

### Instalasi dengan paket manajer lain

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Jika kamu menggunakan Ubuntu atau versi Linux lain yang mendukung paket manajer [snap](https://snapcraft.io/docs/core/install), `kubectl` tersedia dalam bentuk aplikasi di [snap](https://snapcraft.io/).

```shell
snap install kubectl --classic

kubectl version --client
```
{{% /tab %}}
{{% tab name="Homebrew" %}}
Jika kamu menggunakan Linux dengan paket manajer [Homebrew](https://docs.brew.sh/Homebrew-on-Linux), `kubectl` sudah tersedia untuk diinstal di [Homebrew](https://docs.brew.sh/Homebrew-on-Linux#install).
```shell
brew install kubectl

kubectl version --client
```
{{% /tab %}}
{{< /tabs >}}

## Instalasi kubectl di macOS

### Instalasi binari kubectl dengan curl di macOS

1. Unduh versi terbaru dengan perintah:

    ```		 
    curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"
    ```

    Untuk mengunduh versi spesifik, ganti bagian `curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt` dengan versi yang diinginkan.

    Misal, untuk mengunduh versi {{< param "fullversion" >}} di macOS, ketik:
		  
    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
    ```

1. Buat agar binari `kubectl` dapat dijalankan.

    ```
    chmod +x ./kubectl
    ```

1. Pindahkan ke PATH komputer.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
1. Pastikan instalasi sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

### Instalasi dengan Homebrew di macOS

Jika kamu menggunakan macOS dan paket manajer [Homebrew](https://brew.sh/), kamu dapat menginstal `kubectl` langsung dengan Homebrew.

1. Jalankan perintah:

    ```
    brew install kubectl 
    ```
    atau 
    
    ```
    brew install kubernetes-cli
    ```

1. Pastikan instalasi sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

### Instalasi dengan Macports di macOS

Jika kamu menggunakan macOS dan paket manajer [Macports](https://macports.org/), kamu dapat menginstal `kubectl` langsung dengan Macports.

1. Jalankan perintah:

    ```
    sudo port selfupdate
    sudo port install kubectl
    ```
    
1. Pastikan instalasi sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

## Instalasi kubectl di Windows

### Instalasi binari kubectl dengan curl di Windows

1. Unduh versi terbaru {{< param "fullversion" >}} dari [tautan ini](https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe).

    Atau jika sudah ada `curl`, jalankan perintah ini:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
    ```

    Untuk mendapatkan versi stabil terakhir (misal, untuk _scripting_), lihat di [https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt).

1. Tambahkan binary yang sudah diunduh ke PATH komputer.
1. Pastikan instalasi sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```
{{< note >}}
[Docker Desktop untuk Windows](https://docs.docker.com/docker-for-windows/#kubernetes) sudah menambahkan versi `kubectl`nya sendiri ke PATH. Jika kamu sudah menginstal Docker Desktop, kamu harus menambahkan _entry_ ke PATH sebelum yang ditambahkan oleh _installer_ Docker Desktop atau kamu dapat menghapus `kubectl` bawaan Docker Desktop.
{{< /note >}}

### Instalasi dengan Powershell dari PSGallery

Jika kamu menggunakan Windows dan paket manajer [Powershell Gallery](https://www.powershellgallery.com/), kamu dapat menginstal dan melakukan pembaruan `kubectl` dengan Powershell.

1. Jalankan perintah berikut (jangan lupa untuk memasukkan `DownloadLocation`):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```
    
    {{< note >}}Jika kamu tidak menambahkan `DownloadLocation`, `kubectl` akan diinstal di dalam direktori _temp_ pengguna.{{< /note >}}
    
    _Installer_ akan membuat `$HOME/.kube` dan membuat berkas konfigurasi

1. Pastikan instalasi sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

    {{< note >}}Proses pembaruan dapat dilakukan dengan menjalankan ulang dua perintah yang terdapat pada langkah 1.{{< /note >}}

### Instalasi di Windows menggunaakn Chocolatey atau Scoop

Untuk menginstal `kubectl` di Windows kamu dapat menggunakan paket manajer [Chocolatey](https://chocolatey.org) atau _installer_ barisan perintah [Scoop](https://scoop.sh).
{{< tabs name="kubectl_win_install" >}}
{{% tab name="choco" %}}

    choco install kubernetes-cli

{{% /tab %}}
{{% tab name="scoop" %}}

    scoop install kubectl

{{% /tab %}}
{{< /tabs >}}
1. Pastikan instalasi sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

1. Pindah ke direktori utama:

    ```
    cd %USERPROFILE%
    ```
1. Buat direktori `.kube`:

    ```
    mkdir .kube
    ```

1. Pindah ke direktori `.kube` yang baru saja dibuat:

    ```
    cd .kube
    ```

1. Lakukan konfigurasi `kubectl` agar menggunakan _remote_ kluster Kubernetes:

    ```
    New-Item config -type file
    ```
    
    {{< note >}}Ubah berkas konfigurasi dengan editor teks pilihanmu, misal Notepad.{{< /note >}}

## Unduh dengan menggunakan Google Cloud SDK

Kamu dapat menginstal `kubectl` dengan menggunakan Google Cloud SDK.

1. Instal [Google Cloud SDK](https://cloud.google.com/sdk/).
1. Jalankan perintah instalasi `kubectl`:

    ```
    gcloud components install kubectl
    ```
    
1. Pastikan instalasi sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

## Memeriksa konfigurasi kubectl

Agar `kubectl` dapat mengakses kluster Kubernetes, dibutuhkan sebuah [berkas kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), yang akan otomatis dibuat ketika kamu membuat kluster baru menggunakan [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) atau setelah berhasil men-_deploy_ kluster Minikube. Secara _default_, konfigurasi `kubectl` disimpan di `~/.kube/config`.

Kamu dapat memeriksa apakah konfigurasi `kubectl` sudah benar dengan mengambil _state_ kluster:

```shell
kubectl cluster-info
```
Jika kamu melihat respons URL maka konfigurasi kluster `kubectl` sudah benar.

Tetapi jika kamu melihat pesan seperti di bawah maka `kubectl` belum dikonfigurasi dengan benar atau tidak dapat terhubung ke kluster Kubernetes.

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Selanjutnya, apabila kamu ingin menjalankan kluster Kubernetes di laptop (lokal), kamu memerlukan sebuah perangkat seperti Minikube sebelum menjalankan ulang perintah yang ada di atas.

Jika `kubectl cluster-info` mengembalikan respons URL tetapi kamu masih belum dapat mengakses ke kluster, kamu bisa menggunakan perintah di bawah untuk memeriksa apakah kluster sudah dikonfigurasi dengan benar.

```shell
kubectl cluster-info dump
```

## Konfigurasi kubectl yang dapat dilakukan

### Menyalakan _auto complete_ untuk terminal

`kubectl` menyediakan fitur _auto complete_ untuk Bash dan Zsh yang dapat memudahkanmu ketika mengetik di terminal.

Ikuti petunjuk di bawah untuk menyalakan _auto complete_ untuk Bash dan Zsh.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash di Linux" %}}

### Pendahuluan

_Completion script_ `kubectl` untuk Bash dapat dibuat dengan perintah `kubectl completion bash`. Masukkan skrip tersebut ke dalam terminal sebagai sumber untuk menyalakan _auto complete_ dari `kubectl`.

Namun, _completion script_ tersebut tergantung dengan [**bash-completion**](https://github.com/scop/bash-completion), yang artinya kamu harus menginstal program tersebut terlebih dahulu (kamu dapat memeriksa apakah kamu sudah memiliki bash-completion dengan menjalankan perintah `type _init_completion`).

### Instalasi bash-completion

bash-completion disediakan oleh banyak manajer paket (lihat [di sini](https://github.com/scop/bash-completion#installation)). Kamu dapat menginstalnya dengan menggunakan perintah `apt-get install bash-completion` atau `yum install bash-completion`, atau dsb.

Perintah di atas akan membuat skrip utama bash-completion di `/usr/share/bash-completion/bash_completion`. Terkadang kamu juga harus menambahkan skrip tersebut ke dalam berkas `~/.bashrc`, tergantung paket manajer yang kamu pakai.

Untuk memastikan, muat ulang terminalmu dan jalankan `type _init_completion`. Jika perintah berhasil maka instalasi selesai. Jika tidak, tambahkan teks berikut ke dalam berkas `~/.bashrc`:

```shell
source /usr/share/bash-completion/bash_completion
```

Muat ulang lagi terminalmu dan pastikan bash-completion sudah berhasil diinstal dengan menjalankan `type _init_completion`.

### Menyalakan _auto complete_ kubectl

Sekarang kamu harus memastikan bahwa _completion script_ untuk `kubectl` sudah dimasukkan sebagai sumber _auto complete_ di semua sesi terminal. Kamu dapat melakukannya dengan dua cara:

- Masukkan _completion script_ sebagai sumber di berkas `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Menambahkan _completion script_ ke direktori `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```

Jika kamu menggunakan alias untuk `kubectl`, kamu masih dapat menggunakan fitur _auto complete_ dengan menjalankan perintah:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```

{{< note >}}
Semua sumber _completion script_ bash-completion terdapat di `/etc/bash_completion.d`.
{{< /note >}}

Kedua cara tersebut sama, kamu bisa mengambil salah satu cara saja. Setelah memuat ulang terminal, _auto complete_ dari `kubectl` seharusnya sudah dapat bekerja.

{{% /tab %}}


{{% tab name="Bash di macOS" %}}


### Pendahuluan

_Completion script_ `kubectl` untuk Bash dapat dibuat dengan perintah `kubectl completion bash`. Masukkan skrip tersebut ke dalam terminal sebagai sumber untuk menyalakan _auto complete_ dari `kubectl`.

Namun, _completion script_ tersebut tergantung dengan [**bash-completion**](https://github.com/scop/bash-completion), yang artinya kamu harus menginstal program tersebut terlebih dahulu.

{{< warning>}}
Terdapat dua versi bash-completion, v1 dan v2. V1 untuk Bash 3.2 (_default_ dari macOs), dan v2 untuk Bash 4.1+. _Completion script_ `kubectl` **tidak kompatibel** dengan bash-completion v1 dan Bash 3.2. Dibutuhkan **bash-completion v2** dan **Bash 4.1+** agar _completion script_ `kubectl` dapat bekerja dengan baik. Maka dari itu, kamu harus menginstal dan menggunakan Bash 4.1+ ([*panduan*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)) untuk dapat menggunakan fitur _auto complete_ dari `kubectl`. Ikuti panduan di bawah setelah kamu menginstal Bash 4.1+ (yang artinya Bash versi 4.1 atau lebih baru).
{{< /warning >}}

### Pembaruan Bash

Panduan di bawah berasumsi kamu menggunakan Bash 4.1+. Kamu dapat memeriksa versi Bash dengan menjalankan:

```shell
echo $BASH_VERSION
```

Jika versinya sudah terlalu usang, kamu dapat menginstal/memperbaruinya dengan menggunakan Homebrew:

```shell
brew install bash
```

Muat ulang terminalmu dan pastikan versi yang diharapkan sudah dipakai:

```shell
echo $BASH_VERSION $SHELL
```

Homebrew biasanya akan menginstalnya di `/usr/local/bin/bash`.

### Instalasi bash-completion

{{< note >}}
Seperti yang sudah disebutkan, panduan di bawah berasumsi kamu menggunakan Bash 4.1+, yang berarti kamu akan menginstal bash-completion v2 (_auto complete_ dari `kubectl` tidak kompatibel dengan Bash 3.2 dan bash-completion v1).
{{< /note >}}

Kamu dapat memeriksa apakah kamu sudah memiliki bash-completion v2 dengan perintah `type _init_completion`. Jika belum, kamu dapat menginstalnya dengan menggunakan Homebrew:

```shell
brew install bash-completion@2
```

Seperti yang disarankan keluaran perintah di atas, tambahkan teks berikut ke berkas `~/.bashrc`:

```shell
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Muat ulang terminalmu dan pastikan bash-completion v2 sudah terinstal dengan perintah `type _init_completion`.

### Menyalakan _auto complete_ kubectl

Sekarang kamu harus memastikan bahwa _completion script_ untuk `kubectl` sudah dimasukkan sebagai sumber _auto complete_ di semua sesi terminal. Kamu dapat melakukannya dengan beberapa cara:

- Masukkan _completion script_ sebagai sumber di berkas `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Menambahkan _completion script_ ke direktori `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```

- Jika kamu menggunakan alias untuk `kubectl`, kamu masih dapat menggunakan fitur _auto complete_ dengan menjalankan perintah:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```
- Jika kamu menginstal `kubectl` dengan Homebrew (seperti yang sudah dijelaskan [di atas](#install-with-homebrew-on-macos)), maka _completion script_ untuk `kubectl` sudah berada di `/usr/local/etc/bash_completion.d/kubectl`. Kamu tidak perlu melakukan apa-apa lagi.

{{< note >}}
bash-completion v2 yang diinstal dengan Homebrew meletakkan semua berkas nya di direktori `BASH_COMPLETION_COMPAT_DIR`, yang membuat dua cara terakhir dapat bekerja.
{{< /note >}}

Setelah memuat ulang terminal, _auto complete_ dari `kubectl` seharusnya sudah dapat bekerja.
{{% /tab %}}

{{% tab name="Zsh" %}}

_Completion script_ `kubectl` untuk Zsh dapat dibuat dengan perintah `kubectl completion zsh`. Masukkan skrip tersebut ke dalam terminal sebagai sumber untuk menyalakan _auto complete_ dari `kubectl`.

Tambahkan baris berikut di berkas `~/.zshrc` untuk menyalakan _auto complete_ dari `kubectl`:

```shell
source <(kubectl completion zsh)
```

Jika kamu menggunakan alias untuk `kubectl`, kamu masih dapat menggunakan fitur _auto complete_ dengan menjalankan perintah:

```shell
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

Setelah memuat ulang terminal, _auto complete_ dari `kubectl` seharusnya sudah dapat bekerja.

Jika kamu mendapatkan pesan gagal seperti `complete:13: command not found: compdef`, maka tambahkan teks berikut ke awal berkas `~/.zshrc`:

```shell
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}

{{% /capture %}}

{{% capture whatsnext %}}
* [Instalasi Minikube](/docs/tasks/tools/install-minikube/)
* Lihat [panduan memulai](/docs/setup/) untuk mencari tahu tentang pembuatan kluster. 
* [Pelajari cara untuk menjalankan dan mengekspos aplikasimu.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Jika kamu membutuhkan akses ke kluster yang tidak kamu buat, lihat [dokumen Sharing Cluster Access](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Baca [dokumen referensi kubectl](/docs/reference/kubectl/kubectl/)
{{% /capture %}}
