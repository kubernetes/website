---
title: Menginstal dan Menyiapkan kubectl
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Menginstal kubectl
---

<!-- overview -->
[Kubectl](/docs/user-guide/kubectl/) adalah alat baris perintah (_command line tool_) Kubernetes yang digunakan untuk menjalankan berbagai perintah untuk klaster Kubernetes. Kamu dapat menggunakan `kubectl` untuk men-_deploy_ aplikasi, mengatur sumber daya klaster, dan melihat log. Daftar operasi `kubectl` dapat dilihat di [Ikhtisar kubectl](/docs/reference/kubectl/overview/).


## {{% heading "prerequisites" %}}

Kamu harus menggunakan kubectl dengan perbedaan maksimal satu versi minor dengan klaster kamu. Misalnya, klien v1.2 masih dapat digunakan dengan master v1.1, v1.2, dan 1.3. Menggunakan versi terbaru `kubectl` dapat menghindari permasalahan yang tidak terduga.


<!-- steps -->

## Menginstal kubectl pada Linux

### Menginstal program kubectl menggunakan curl pada Linux

1. Unduh versi terbarunya dengan perintah:

    ```
    curl -LO https://dl.k8s.io/release/`curl -LS https://dl.k8s.io/release/stable.txt`/bin/linux/amd64/kubectl
    ```

    Untuk mengunduh versi spesifik, ganti bagian `curl -LS https://dl.k8s.io/release/stable.txt` dengan versi yang diinginkan.

    Misalnya, untuk mengunduh versi {{< skew currentPatchVersion >}} di Linux, ketik:
    
    ```
    curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
    ```

2. Jadikan program `kubectl` dapat dieksekusi.

    ```
    chmod +x ./kubectl
    ```

3. Pindahkan ke PATH kamu.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Pastikan instalasinya sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

### Menginstal dengan manajer paket (_package manager_) bawaan

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
gpgkey=https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}

### Menginstal dengan manajer paket lain

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Jika kamu menggunakan Ubuntu atau versi Linux lain yang mendukung manajer paket [snap](https://snapcraft.io/docs/core/install), `kubectl` tersedia dalam bentuk aplikasi di [snap](https://snapcraft.io/).

```shell
snap install kubectl --classic

kubectl version --client
```
{{% /tab %}}
{{% tab name="Homebrew" %}}
Jika kamu menggunakan Linux dengan manajer paket [Homebrew](https://docs.brew.sh/Homebrew-on-Linux), `kubectl` sudah tersedia untuk diinstal di [Homebrew](https://docs.brew.sh/Homebrew-on-Linux#install).
```shell
brew install kubectl

kubectl version --client
```
{{% /tab %}}
{{< /tabs >}}

## Menginstal kubectl pada macOS

### Menginstal program kubectl dengan curl pada macOS

1. Unduh versi terbarunya dengan perintah:

    ```		 
    curl -LO "https://dl.k8s.io/release/$(curl -LS https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
    ```

    Untuk mengunduh versi spesifik, ganti bagian `curl -LS https://dl.k8s.io/release/stable.txt` dengan versi yang diinginkan.

    Misalnya, untuk mengunduh versi {{< skew currentPatchVersion >}} pada macOS, ketik:
		  
    ```
    curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl
    ```

2. Buat agar program `kubectl` dapat dijalankan.

    ```
    chmod +x ./kubectl
    ```

3. Pindahkan ke PATH kamu.

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```
4. Pastikan instalasinya sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

### Menginstal dengan Homebrew pada macOS

Jika kamu menggunakan macOS dan manajer paket [Homebrew](https://brew.sh/), kamu dapat menginstal `kubectl` langsung dengan Homebrew.

1. Jalankan perintah:

    ```
    brew install kubectl 
    ```
    atau 
    
    ```
    brew install kubernetes-cli
    ```

2. Pastikan instalasinya sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

### Menginstal dengan Macports pada macOS

Jika kamu menggunakan macOS dan manajer paket [Macports](https://macports.org/), kamu dapat menginstal `kubectl` langsung dengan Macports.

1. Jalankan perintah:

    ```
    sudo port selfupdate
    sudo port install kubectl
    ```
    
2. Pastikan instalasinya sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

## Menginstal kubectl pada Windows

### Menginstal program kubectl dengan curl pada Windows

1. Unduh versi terbarunya {{< skew currentPatchVersion >}} dari [tautan ini](https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe).

    Atau jika sudah ada `curl` pada mesin kamu, jalankan perintah ini:

    ```
    curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe
    ```

    Untuk mendapatkan versi stabil terakhir (misalnya untuk _scripting_), lihat di [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).

2. Tambahkan program yang sudah diunduh tersebut ke PATH kamu.
3. Pastikan instalasinya sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```
{{< note >}}
[Docker Desktop untuk Windows](https://docs.docker.com/docker-for-windows/#kubernetes) sudah menambahkan versi `kubectl`-nya sendiri ke PATH. Jika kamu sudah menginstal Docker Desktop, kamu harus menambahkan entrinya ke PATH sebelum yang ditambahkan oleh penginstal (_installer_) Docker Desktop atau kamu dapat menghapus `kubectl` bawaan dari Docker Desktop.
{{< /note >}}

### Menginstal dengan Powershell dari PSGallery

Jika kamu menggunakan Windows dan manajer paket [Powershell Gallery](https://www.powershellgallery.com/), kamu dapat menginstal dan melakukan pembaruan `kubectl` dengan Powershell.

1. Jalankan perintah berikut (jangan lupa untuk memasukkan `DownloadLocation`):

    ```
    Install-Script -Name install-kubectl -Scope CurrentUser -Force
    install-kubectl.ps1 [-DownloadLocation <path>]
    ```
    
    {{< note >}}Jika kamu tidak menambahkan `DownloadLocation`, `kubectl` akan diinstal di dalam direktori _temp_ pengguna.{{< /note >}}
    
    Penginstal akan membuat `$HOME/.kube` dan membuat berkas konfigurasi

2. Pastikan instalasinya sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

    {{< note >}}Proses pembaruan dapat dilakukan dengan menjalankan ulang dua perintah yang terdapat pada langkah 1.{{< /note >}}

### Menginstal pada Windows menggunakan Chocolatey atau Scoop

Untuk menginstal `kubectl` pada Windows, kamu dapat menggunakan manajer paket [Chocolatey](https://chocolatey.org) atau penginstal baris perintah [Scoop](https://scoop.sh).
{{< tabs name="kubectl_win_install" >}}
{{% tab name="choco" %}}

    choco install kubernetes-cli

{{% /tab %}}
{{% tab name="scoop" %}}

    scoop install kubectl

{{% /tab %}}
{{< /tabs >}}
1. Pastikan instalasinya sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

2. Pindah ke direktori utama:

    ```
    cd %USERPROFILE%
    ```
3. Buat direktori `.kube`:

    ```
    mkdir .kube
    ```

4. Pindah ke direktori `.kube` yang baru saja dibuat:

    ```
    cd .kube
    ```

5. Lakukan konfigurasi `kubectl` untuk menggunakan klaster Kubernetes _remote_:

    ```
    New-Item config -type file
    ```
    
    {{< note >}}Ubah berkas konfigurasi dengan penyunting (_editor_) teks pilihanmu, misalnya Notepad.{{< /note >}}

## Mengunduh sebagai bagian dari Google Cloud SDK

Kamu dapat menginstal `kubectl` sebagai bagian dari Google Cloud SDK.

1. Instal [Google Cloud SDK](https://cloud.google.com/sdk/).
2. Jalankan perintah instalasi `kubectl`:

    ```
    gcloud components install kubectl
    ```
    
3. Pastikan instalasinya sudah berhasil dengan melakukan pengecekan versi:

    ```
    kubectl version --client
    ```

## Memeriksa konfigurasi kubectl

Agar `kubectl` dapat mengakses klaster Kubernetes, dibutuhkan sebuah [berkas kubeconfig](/id/docs/tasks/access-application-cluster/configure-access-multiple-clusters/), yang akan otomatis dibuat ketika kamu membuat klaster baru menggunakan [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) atau setelah berhasil men-_deploy_ klaster Minikube. Secara bawaan, konfigurasi `kubectl` disimpan di `~/.kube/config`.

Kamu dapat memeriksa apakah konfigurasi `kubectl` sudah benar dengan mengambil keadaan klaster:

```shell
kubectl cluster-info
```
Jika kamu melihat respons berupa URL, maka konfigurasi klaster `kubectl` sudah benar.

Tetapi, jika kamu melihat pesan seperti di bawah, maka `kubectl` belum dikonfigurasi dengan benar atau tidak dapat terhubung ke klaster Kubernetes.

```shell
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

Selanjutnya, jika kamu ingin menjalankan klaster Kubernetes di laptop (lokal) kamu, kamu memerlukan sebuah perangkat seperti Minikube sebelum menjalankan ulang perintah yang ada di atas.

Jika `kubectl cluster-info` mengembalikan respons URL tetapi kamu masih belum dapat mengakses klaster, kamu bisa menggunakan perintah di bawah untuk memeriksa apakah klaster sudah dikonfigurasi dengan benar.

```shell
kubectl cluster-info dump
```

## Konfigurasi kubectl opsional

### Menyalakan penyelesaian otomatis untuk terminal

`kubectl` menyediakan fitur penyelesaian otomatis (_auto complete_) untuk Bash dan Zsh yang dapat memudahkanmu ketika mengetik di terminal.

Ikuti petunjuk di bawah untuk menyalakan penyelesaian otomatis untuk Bash dan Zsh.

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="Bash pada Linux" %}}

### Pendahuluan

Skrip penyelesaian (_completion script_) `kubectl` untuk Bash dapat dibuat dengan perintah `kubectl completion bash`. Masukkan skrip tersebut ke dalam terminal sebagai sumber untuk menyalakan penyelesaian otomatis dari `kubectl`.

Namun, skrip penyelesaian tersebut bergantung pada [**bash-completion**](https://github.com/scop/bash-completion), yang artinya kamu harus menginstal program tersebut terlebih dahulu (kamu dapat memeriksa apakah kamu sudah memiliki bash-completion dengan menjalankan perintah `type _init_completion`).

### Menginstal bash-completion

bash-completion disediakan oleh banyak manajer paket (lihat [di sini](https://github.com/scop/bash-completion#installation)). Kamu dapat menginstalnya dengan menggunakan perintah `apt-get install bash-completion` atau `yum install bash-completion`, dsb.

Perintah di atas akan membuat skrip utama bash-completion di `/usr/share/bash-completion/bash_completion`. Terkadang kamu juga harus menambahkan skrip tersebut ke dalam berkas `~/.bashrc`, tergantung manajer paket yang kamu pakai.

Untuk memastikannya, muat ulang terminalmu dan jalankan `type _init_completion`. Jika perintah tersebut berhasil, maka instalasi selesai. Jika tidak, tambahkan teks berikut ke dalam berkas `~/.bashrc`:

```shell
source /usr/share/bash-completion/bash_completion
```

Muat ulang terminalmu dan pastikan bash-completion sudah berhasil diinstal dengan menjalankan `type _init_completion`.

### Menyalakan penyelesaian otomatis kubectl

Sekarang kamu harus memastikan bahwa skrip penyelesaian untuk `kubectl` sudah dimasukkan sebagai sumber penyelesaian otomatis pada semua sesi terminal. Kamu dapat melakukannya dengan dua cara:

- Masukkan skrip penyelesaian sebagai sumber di berkas `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Tambahkan skrip penyelesaian ke direktori `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```

Jika kamu menggunakan alias untuk `kubectl`, kamu masih dapat menggunakan fitur penyelesaian otomatis dengan menjalankan perintah:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```

{{< note >}}
Semua sumber skrip penyelesaian bash-completion terdapat di `/etc/bash_completion.d`.
{{< /note >}}

Kedua cara tersebut sama, kamu bisa memilih salah satunya. Setelah memuat ulang terminal, penyelesaian otomatis dari `kubectl` seharusnya sudah dapat bekerja.

{{% /tab %}}


{{% tab name="Bash pada macOS" %}}


### Pendahuluan

Skrip penyelesaian (_completion script_) `kubectl` untuk Bash dapat dibuat dengan perintah `kubectl completion bash`. Masukkan skrip tersebut ke dalam terminal sebagai sumber untuk menyalakan penyelesaian otomatis dari `kubectl`.

Namun, skrip penyelesaian tersebut bergantung pada [**bash-completion**](https://github.com/scop/bash-completion), yang artinya kamu harus menginstal program tersebut terlebih dahulu.

{{< warning>}}
Terdapat dua versi bash-completion, v1 dan v2. V1 untuk Bash 3.2 (bawaan dari macOs), dan v2 untuk Bash 4.1+. Skrip penyelesaian `kubectl` **tidak kompatibel** dengan bash-completion v1 dan Bash 3.2. Dibutuhkan **bash-completion v2** dan **Bash 4.1+** agar skrip penyelesaian `kubectl` dapat bekerja dengan baik. Maka dari itu, kamu harus menginstal dan menggunakan Bash 4.1+ ([*panduan*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)) untuk dapat menggunakan fitur penyelesaian otomatis dari `kubectl`. Ikuti panduan di bawah setelah kamu menginstal Bash 4.1+ (yaitu, Bash versi 4.1 atau lebih baru).
{{< /warning >}}

### Pemutakhiran Bash

Panduan di bawah berasumsi kamu menggunakan Bash 4.1+. Kamu dapat memeriksa versi Bash dengan menjalankan:

```shell
echo $BASH_VERSION
```

Jika versinya sudah terlalu usang, kamu dapat menginstal/memutakhirkannya dengan menggunakan Homebrew:

```shell
brew install bash
```

Muat ulang terminalmu dan pastikan versi yang diharapkan sudah dipakai:

```shell
echo $BASH_VERSION $SHELL
```

Homebrew biasanya akan menginstalnya di `/usr/local/bin/bash`.

### Menginstal bash-completion

{{< note >}}
Seperti yang sudah disebutkan, panduan di bawah berasumsi kamu menggunakan Bash 4.1+, yang berarti kamu akan menginstal bash-completion v2 (penyelesaian otomatis dari `kubectl` tidak kompatibel dengan Bash 3.2 dan bash-completion v1).
{{< /note >}}

Kamu dapat memeriksa apakah kamu sudah memiliki bash-completion v2 dengan perintah `type _init_completion`. Jika belum, kamu dapat menginstalnya dengan menggunakan Homebrew:

```shell
brew install bash-completion@2
```

Seperti yang disarankan pada keluaran perintah di atas, tambahkan teks berikut ke berkas `~/.bashrc`:

```shell
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

Muat ulang terminalmu dan pastikan bash-completion v2 sudah terinstal dengan perintah `type _init_completion`.

### Menyalakan penyelesaian otomatis kubectl

Sekarang kamu harus memastikan bahwa skrip penyelesaian untuk `kubectl` sudah dimasukkan sebagai sumber penyelesaian otomatis di semua sesi terminal. Kamu dapat melakukannya dengan beberapa cara:

- Masukkan skrip penyelesaian sebagai sumber di berkas `~/.bashrc`:

    ```shell
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    ```

- Menambahkan skrip penyelesaian ke direktori `/etc/bash_completion.d`:

    ```shell
    kubectl completion bash >/etc/bash_completion.d/kubectl
    ```

- Jika kamu menggunakan alias untuk `kubectl`, kamu masih dapat menggunakan fitur penyelesaian otomatis dengan menjalankan perintah:

    ```shell
    echo 'alias k=kubectl' >>~/.bashrc
    echo 'complete -F __start_kubectl k' >>~/.bashrc
    ```
- Jika kamu menginstal `kubectl` dengan Homebrew (seperti yang sudah dijelaskan [di atas](#install-with-homebrew-on-macos)), maka skrip penyelesaian untuk `kubectl` sudah berada di `/usr/local/etc/bash_completion.d/kubectl`. Kamu tidak perlu melakukan apa-apa lagi.

{{< note >}}
bash-completion v2 yang diinstal dengan Homebrew meletakkan semua berkas nya di direktori `BASH_COMPLETION_COMPAT_DIR`, itulah alasannya dua cara terakhir dapat bekerja.
{{< /note >}}

Setelah memuat ulang terminal, penyelesaian otomatis dari `kubectl` seharusnya sudah dapat bekerja.
{{% /tab %}}

{{% tab name="Zsh" %}}

Skrip penyelesaian (_completion script_) `kubectl` untuk Zsh dapat dibuat dengan perintah `kubectl completion zsh`. Masukkan skrip tersebut ke dalam terminal sebagai sumber untuk menyalakan penyelesaian otomatis dari `kubectl`.

Tambahkan baris berikut di berkas `~/.zshrc` untuk menyalakan penyelesaian otomatis dari `kubectl`:

```shell
source <(kubectl completion zsh)
```

Jika kamu menggunakan alias untuk `kubectl`, kamu masih dapat menggunakan fitur penyelesaian otomatis dengan menjalankan perintah:

```shell
echo 'alias k=kubectl' >>~/.zshrc
echo 'compdef __start_kubectl k' >>~/.zshrc
```

Setelah memuat ulang terminal, penyelesaian otomatis dari `kubectl` seharusnya sudah dapat bekerja.

Jika kamu mendapatkan pesan gagal seperti `complete:13: command not found: compdef`, maka tambahkan teks berikut ke awal berkas `~/.zshrc`:

```shell
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}

* [Menginstal Minikube.](/id/docs/tasks/tools/install-minikube/)
* Lihat [panduan persiapan](/docs/setup/) untuk mencari tahu tentang pembuatan klaster. 
* [Pelajari cara untuk menjalankan dan mengekspos aplikasimu.](/docs/tasks/access-application-cluster/service-access-application-cluster/)
* Jika kamu membutuhkan akses ke klaster yang tidak kamu buat, lihat [dokumen Berbagi Akses Klaster](/id/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).
* Baca [dokumen referensi kubectl](/docs/reference/kubectl/kubectl/)

