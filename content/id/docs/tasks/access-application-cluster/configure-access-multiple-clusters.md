---
title: Mengkonfigurasi Akses ke Banyak Klaster
content_type: task
weight: 30
card:
  name: tasks
  weight: 40
---


<!-- overview -->

Halaman ini menunjukkan bagaimana mengkonfigurasi akses ke banyak klaster dengan menggunakan
berkas (_file_) konfigurasi. Setelah semua klaster, pengguna, dan konteks didefinisikan di
satu atau lebih berkas konfigurasi, kamu akan dengan cepat berpindah antar klaster dengan menggunakan
perintah `kubectl config use-context`.

{{< note >}}
Berkas yang digunakan untuk mengkonfigurasi akses ke sebuah klaster terkadang disebut
berkas *kubeconfig*. Ini adalah cara umum untuk merujuk ke berkas konfigurasi.
Itu tidak berarti bahwa selalu ada berkas bernama `kubeconfig`.
{{< /note >}}



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Mendefinisikan klaster, pengguna, dan konteks

Misalkan kamu memiliki dua klaster, satu untuk pekerjaan pengembangan dan satu untuk pekerjaan eksperimen (_scratch_).
Di klaster `pengembangan`, pengembang _frontend_ kamu bekerja di sebuah Namespace bernama `frontend`,
dan pengembang penyimpanan kamu bekerja di sebuah Namespace bernama `storage`. Di klaster `scratch` kamu,
pengembang bekerja di Namespace `default`, atau mereka membuat Namespace tambahan sesuai keinginan mereka.
Akses ke klaster `development` membutuhkan autentikasi dengan sertifikat.
Akses ke klaster `scratch` membutuhkan autentikasi dengan nama pengguna dan kata sandi.

Buat sebuah direktori bernama `config-exercise`. Di direktori `config-exercise` kamu,
buat sebuah berkas bernama `config-demo` dengan konten ini:

```shell
apiVersion: v1
kind: Config
preferences: {}

clusters:
- cluster:
  name: development
- cluster:
  name: scratch

users:
- name: developer
- name: experimenter

contexts:
- context:
  name: dev-frontend
- context:
  name: dev-storage
- context:
  name: exp-scratch
```

Berkas konfigurasi di atas mendeskripsikan semua klaster, pengguna, dan konteks.
Berkas `config-demo` kamu memiliki kerangka kerja untuk mendeskripsikan dua klaster, dua pengguna, dan tiga konteks.

Buka direktori `config-exercise` kamu. Masukkan perintah-perintah berikut untuk menambahkan detail ke
berkas konfigurasi kamu:

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster scratch --server=https://5.6.7.8 --insecure-skip-tls-verify
```

Tambahkan detail pengguna ke berkas konfigurasi kamu:

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-seefile
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

{{< note >}}
- Untuk menghapus sebuah pengguna, kamu dapat menjalankan perintah `kubectl --kubeconfig=config-demo config unset users.<name>`
- Untuk menghapus sebuah klaster, kamu dapat menjalankan perintah `kubectl --kubeconfig=config-demo config unset clusters.<name>`
- Untuk menghapus sebuah konteks, kamu dapat menjalankan perintah `kubectl --kubeconfig=config-demo config unset contexts.<name>`
{{< /note >}}

Tambahkan detail konteks ke berkas konfigurasi kamu:

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-scratch --cluster=scratch --namespace=default --user=experimenter
```

Buka berkas `config-demo` kamu untuk melihat detail-detail yang telah ditambah. Sebagai alternatif dari membuka
berkas `config-demo`, kamu bisa menggunakan perintah `config view`.

```shell
kubectl config --kubeconfig=config-demo view
```

Keluaran akan menampilkan dua klaster, dua pengguna, dan tiga konteks:

```shell
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: scratch
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: scratch
    namespace: default
    user: experimenter
  name: exp-scratch
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    password: some-password
    username: exp
```

`fake-ca-file`, `fake-cert-file`, dan `fake-key-file` di atas adalah _placeholder_
untuk nama jalur (_pathname_) dari berkas-berkas sertifikat. Kamu harus menggantinya menjadi nama jalur
sebenarnya dari berkas-berkas sertifikat di dalam lingkungan (_environment_) kamu.

Terkadang kamu mungkin ingin menggunakan data yang disandikan Base64 yang langsung dimasukkan di berkas konfigurasi
daripada menggunakan berkas sertifikat yang terpisah. Dalam kasus ini, kamu perlu menambahkan akhiran `-data` ke kunci. Contoh, `certificate-authority-data`, `client-certificate-data`, dan `client-key-data`.

Setiap konteks memiliki tiga bagian: klaster, pengguna, dan Namespace.
Sebagai contoh, konteks `dev-frontend` menyatakan, "Gunakan kredensial dari pengguna `developer`
untuk mengakses Namespace `frontend` di klaster `development`.

Mengatur konteks yang digunakan:

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

Sekarang kapanpun kamu memasukkan perintah `kubectl`, aksi tersebut akan diterapkan untuk klaster,
dan Namespace yang terdaftar pada konteks `dev-frontend`. Dan perintah tersebut akan menggunakan
kredensial dari pengguna yang terdaftar pada konteks `dev-frontend`.

Untuk melihat hanya informasi konfigurasi yang berkaitan dengan konteks saat ini,
gunakan `--minify` flag.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

Output menunjukkan informasi konfigurasi yang berkaitan dengan konteks `dev-frontend`:

```shell
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

Sekarang apabila kamu ingin bekerja sebentar di klaster eksperimen.

Ubah konteks saat ini menjadi `exp-scratch`:

```shell
kubectl config --kubeconfig=config-demo use-context exp-scratch
```

Sekarang, setiap perintah `kubectl` yang diberikan akan berlaku untuk Namespace `default`
dari klaster `scratch`. Dan perintah akan menggunakan kredensial dari pengguna yang
terdaftar di konteks `exp-scratch`.

Untuk melihat konfigurasi yang berkaitan dengan konteks saat ini, `exp-scratch`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

Akhirnya, misalkan kamu ingin bekerja sebentar di Namespace `storage` pada
klaster `development`.

Ubah konteks saat ini menjadi `dev-storage`:

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

Untuk melihat konfigurasi yang berkaitan dengan konteks baru saat ini, `dev-storage`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

## Membuat sebuah berkas konfigurasi kedua

Di direktori `config-exercise` kamu, buat sebuah berkas bernama `config-demo-2` dengan konten ini:

```shell
apiVersion: v1
kind: Config
preferences: {}

contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

Berkas konfigurasi di atas mendefinisikan sebuah konteks baru bernama `dev-ramp-up`.

## Mengatur variabel lingkungan KUBECONFIG

Lihat apakah kamu sudah memiliki sebuah variabel lingkungan bernama `KUBECONFIG`.
Jika iya, simpan nilai saat ini dari variabel lingkungan `KUBECONFIG` kamu, sehingga kamu dapat mengembalikannya nanti.
Sebagai contohL

### Linux
```shell
export KUBECONFIG_SAVED=$KUBECONFIG
```
### Windows PowerShell
```shell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```
Variabel lingkungan `KUBECONFIG` adalah sebuah daftar dari jalur-jalur (beragam _path_) menuju berkas konfigurasi.
Daftar ini dibatasi oleh tanda titik dua untuk Linux dan Mac, dan tanda titik koma untuk Windows. Jika kamu 
memiliki sebuah variabel lingkungan `KUBECONFIG`, biasakan diri kamu dengan berkas-berkas konfigurasi
yang ada pada daftar.

Tambahkan sementara dua jalur ke variabel lingkungan `KUBECONFIG` kamu. Sebagai contoh:

### Linux
```shell
export KUBECONFIG=$KUBECONFIG:config-demo:config-demo-2
```
### Windows PowerShell
```shell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

Di direktori `config-exercise` kamu, masukan perintah ini:

```shell
kubectl config view
```

Keluaran menunjukkan informasi gabungan dari semua berkas yang terdaftar dalam variabel lingkungan `KUBECONFIG` kamu.
Secara khusus, perhatikan bahwa informasi gabungan tersebut memiliki konteks `dev-ramp-up`, konteks dari berkas 
`config-demo-2`, dan tiga konteks dari berkas `config-demo`:

```shell
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: scratch
    namespace: default
    user: experimenter
  name: exp-scratch
```

Untuk informasi lebih tentang bagaimana berkas Kubeconfig tergabung, lihat
[Mengatur Akses Cluster Menggunakan Berkas Kubeconfig](/id/docs/concepts/configuration/organize-cluster-access-kubeconfig/)

## Jelajahi direktori $HOME/.kube

Jika kamu sudah memiliki sebuah klaster, dan kamu bisa menggunakan `kubectl` untuk berinteraksi dengan
klaster kamu, kemudian kamu mungkin memiliki sebuah berkas bernama `config` di
direktori `$HOME/.kube`.

Buka `$HOME/.kube`, dan lihat berkas-berkas apa saja yang ada. Biasanya ada berkas bernama
`config`. Mungkin juga ada berkas-berkas konfigurasi lain di direktori ini.
Biasakan diri anda dengan konten-konten yang ada di berkas-berkas tersebut.

## Tambahkan $HOME/.kube/config ke variabel lingkungan KUBECONFIG kamu

Jika kamu memiliki sebuah berkas `$HOME/.kube/config`, dan belum terdaftar dalam variabel lingungan
`KUBECONFIG` kamu, tambahkan berkas tersebut ke variabel lingkungan `KUBECONFIG` kamu sekarang.
Sebagai contoh:

### Linux
```shell
export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config
```
### Windows Powershell
```shell
$Env:KUBECONFIG=($Env:KUBECONFIG;$HOME/.kube/config)
```

Lihat gabungan informasi konfigurasi dari semua berkas yang sekarang tergabung
dalam variabel lingkungan `KUBECONFIG` kamu. Di direktori `config-exercise` kamu, masukkan perintah:

```shell
kubectl config view
```

## Membersihkan

Kembalikan variabel lingkungan `KUBECONFIG` kamu ke nilai asilnya. Sebagai contoh:<br>

### Linux
```shell
export KUBECONFIG=$KUBECONFIG_SAVED
```
### Windows PowerShell
```shell
$Env:KUBECONFIG=$ENV:KUBECONFIG_SAVED
```



## {{% heading "whatsnext" %}}


* [Mengatur Akses Cluster Menggunakan Berkas Kubeconfig](/id/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)




