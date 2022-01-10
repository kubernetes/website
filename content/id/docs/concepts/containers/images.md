---
title: Image
content_type: concept
weight: 10
---

<!-- overview -->

Kamu membuat Docker _image_ dan mengunduhnya ke sebuah registri sebelum digunakan di dalam Kubernetes Pod.

Properti `image` dari sebuah Container mendukung sintaksis yang sama seperti perintah `docker`, termasuk registri privat dan _tag_.




<!-- body -->

## Memperbarui Image

Kebijakan _pull default_ adalah `IfNotPresent` yang membuat Kubelet tidak
lagi mengunduh (_pull_) sebuah image jika sudah ada terlebih dahulu. Jika kamu ingin agar
selalu diunduh, kamu bisa melakukan salah satu dari berikut:

- mengatur `imagePullPolicy` dari Container menjadi `Always`.
- buang `imagePullPolicy` dan gunakan `:latest` _tag_ untuk _image_ yang digunakan.
- buang `imagePullPolicy` dan juga _tag_ untuk _image_.
- aktifkan [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) _admission controller_.

Harap diingat kamu sebaiknya hindari penggunaan _tag_ `:latest`, lihat [panduan konfigurasi](/id/docs/concepts/configuration/overview/#container-images) untuk informasi lebih lanjut.

## Membuat Image Multi-arsitektur dengan Manifest

Docker CLI saat ini mendukung perintah `docker manifest` dengan anak perintah `create`, `annotate`, dan `push`. Perintah-perintah ini dapat digunakan
untuk membuat (_build_) dan mengunggah (_push_) manifes. Kamu dapat menggunakan perintah `docker manifest inspect` untuk membaca manifes.

Lihat dokumentasi docker di sini:
https://docs.docker.com/edge/engine/reference/commandline/manifest/

Lihat contoh-contoh bagaimana kami menggunakan ini untuk proses _build harness_:
https://cs.k8s.io/?q=docker%20manifest%20(create%7Cpush%7Cannotate)&i=nope&files=&repos=

Perintah-perintah ini bergantung pada Docker CLI, dan diimplementasi hanya di sisi CLI. Kamu harus mengubah `$HOME/.docker/config.json` dan mengatur _key_ `experimental` untuk mengaktifkan
atau cukup dengan mengatur `DOCKER_CLI_EXPERIMENTAL` variabel _environment_ menjadi `enabled` ketika memanggil perintah-perintah CLI.

{{< note >}}
Gunakan Docker *18.06 ke atas*, versi-versi di bawahnya memiliki _bug_ ataupun tidak mendukung perintah eksperimental. Contohnya https://github.com/docker/cli/issues/1135 yang menyebabkan masalah di bawah containerd.
{{< /note >}}

Kalau kamu terkena masalah ketika mengunggah manifes-manifes yang rusak, cukup bersihkan manifes-manifes yang lama di `$HOME/.docker/manifests` untuk memulai dari awal.

Untuk Kubernetes, kami biasanya menggunakan _image-image_ dengan sufiks `-$(ARCH)`. Untuk kompatibilitas (_backward compatibility_), lakukan _generate image-image_ yang lama dengan sufiks. Idenya adalah men-_generate_, misalnya `pause` image yang memiliki manifes untuk semua arsitektur dan misalnya `pause-amd64` yang punya kompatibilitas terhadap konfigurasi-konfigurasi lama atau berkas-berkas YAML yang bisa saja punya _image-image_ bersufiks yang di-_hardcode_.

## Menggunakan Registri Privat (_Private Registry_) {#menggunakan-registri-privat}

Biasanya kita memerlukan _key_ untuk membaca _image-image_ yang tersedia pada suatu registri privat.
Kredensial ini dapat disediakan melalui beberapa cara:

  - Menggunakan Google Container Registry
    - per-klaster
    - konfigurasi secara otomatis pada Google Compute Engine atau Google Kubernetes Engine
    - semua Pod dapat membaca registri privat yang ada di dalam proyek
  - Menggunakan Amazon Elastic Container Registry (ECR)
    - menggunakan IAM _role_ dan _policy_ untuk mengontrol akses ke repositori ECR
    - secara otomatis _refresh_ kredensial login ECR
  - Menggunakan Oracle Cloud Infrastructure Registry (OCIR)
    - menggunakan IAM _role_ dan _policy_ untuk mengontrol akses ke repositori OCIR
  - Menggunakan Azure Container Registry (ACR)
  - Menggunakan IBM Cloud Container Registry
    - menggunakan IAM _role_ dan _policy_ untuk memberikan akses ke IBM Cloud Container Registry
  - Konfigurasi Node untuk otentikasi registri privat
    - semua Pod dapat membaca registri privat manapun
    - memerlukan konfigurasi Node oleh admin klaster
  - Pra-unduh _image_
    - semua Pod dapat menggunakan _image_ apapun yang di-_cached_ di dalam sebuah Node
    - memerlukan akses root ke dalam semua Node untuk pengaturannya
  - Mengatur ImagePullSecrets dalam sebuah Pod
    - hanya Pod-Pod yang menyediakan _key_ sendiri yang dapat mengakses registri privat

Masing-masing opsi dijelaskan lebih lanjut di bawah ini.

### Menggunakan Google Container Registry

Kubernetes memiliki dukungan _native_ untuk [Google Container
Registry (GCR)](https://cloud.google.com/tools/container-registry/), ketika dijalankan pada
Google Compute Engine (GCE). Jika kamu menjalankan klaster pada GCE atau Google Kubernetes Engine,
cukup gunakan nama panjang _image_ (misalnya gcr.io/my_project/image:tag).

Semua Pod di dalam klaster akan memiliki akses baca _image_ di registri ini.

Kubelet akan melakukan otentikasi GCR menggunakan _service account_ yang dimiliki
_instance_ Google. _Service acccount_ pada _instance_ akan memiliki sebuah `https://www.googleapis.com/auth/devstorage.read_only`,
sehingga dapat mengunduh dari GCR di proyek yang sama, tapi tidak untuk unggah.

### Menggunakan Amazon Elastic Container Registry

Kubernetes memiliki dukungan _native_ untuk [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/), ketika Node adalah
AWS EC2 _instance_.

Cukup gunakan nama panjang _image_ (misalnya `ACCOUNT.dkr.ecr.REGION.amazonaws.com/imagename:tag`) di dalam definisi Pod.

Semua pengguna klaster yang dapat membuat Pod akan bisa menjalankan Pod yang dapat menggunakan
_image-image_ di dalam registri ECR.

Kubelet akan mengambil dan secara periodik memperbarui kredensial ECR, yang memerlukan _permission_ sebagai berikut:

- `ecr:GetAuthorizationToken`
- `ecr:BatchCheckLayerAvailability`
- `ecr:GetDownloadUrlForLayer`
- `ecr:GetRepositoryPolicy`
- `ecr:DescribeRepositories`
- `ecr:ListImages`
- `ecr:BatchGetImage`

Persyaratan:

- Kamu harus menggunakan versi kubelet `v1.2.0` atau lebih (misal jalankan `/usr/bin/kubelet --version=true`).
- Jika Node yang kamu miliki ada di region A dan registri kamu ada di region yang berbeda misalnya B, kamu perlu versi `v1.3.0` atau lebih.
- ECR harus tersedia di region kamu.

Cara _troubleshoot_:

- Verifikasi semua persyaratan di atas.
- Dapatkan kredensial $REGION (misalnya `us-west-2`) pada _workstation_ kamu. Lakukan SSH ke dalam _host_ dan jalankan Docker secara manual menggunakan kredensial tersebut. Apakah berhasil?
- Tambahkan verbositas level _log_ kubelet paling tidak 3 dan periksa _log_ kubelet (misal `journalctl -u kubelet`) di baris-baris yang seperti ini:
  - `aws_credentials.go:109] unable to get ECR credentials from cache, checking ECR API`
  - `aws_credentials.go:116] Got ECR credentials from ECR API for <AWS account ID for ECR>.dkr.ecr.<AWS region>.amazonaws.com`

### Menggunakan Azure Container Registry (ACR)
Ketika menggunakan [Azure Container Registry](https://azure.microsoft.com/en-us/services/container-registry/)
kamu dapat melakukan otentikasi menggunakan pengguna admin maupun sebuah _service principal_.
Untuk keduanya, otentikasi dilakukan melalui proses otentikasi Docker standar. Instruksi-instruksi ini
menggunakan perangkat [azure-cli](https://github.com/azure/azure-cli).

Kamu pertama perlu membuat sebuah registri dan men-_generate_ kredensial, dokumentasi yang lengkap tentang hal ini
dapat dilihat pada [dokumentasi Azure container registry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-get-started-azure-cli).

Setelah kamu membuat registri, kamu akan menggunakan kredensial berikut untuk login:

   * `DOCKER_USER` : _service principal_, atau pengguna admin
   * `DOCKER_PASSWORD`: kata sandi dari _service principal_, atau kata sandi dari pengguna admin
   * `DOCKER_REGISTRY_SERVER`: `${some-registry-name}.azurecr.io`
   * `DOCKER_EMAIL`: `${some-email-address}`

Ketika kamu sudah memiliki variabel-variabel di atas, kamu dapat
[mengkonfigurasi sebuah Kubernetes Secret dan menggunakannya untuk _deploy_ sebuah Pod](/id/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).

### Menggunakan IBM Cloud Container Registry
IBM Cloud Container Registry menyediakan sebuah registri _image_ privat yang _multi-tenant_, dapat kamu gunakan untuk menyimpan dan membagikan _image-image_ secara aman. Secara _default_, _image-image_ di dalam registri privat kamu akan dipindai (_scan_) oleh Vulnerability Advisor terintegrasi untuk deteksi isu
keamanan dan kerentanan (_vulnerability_) yang berpotensi. Para pengguna di dalam akun IBM Cloud kamu dapat mengakses _image_, atau kamu dapat menggunakan IAM
_role_ dan _policy_ untuk memberikan akses ke _namespace_ di IBM Cloud Container Registry.

Untuk instalasi _plugin_ CLI di IBM Cloud Containerr Registry dan membuat sebuah _namespace_ untuk _image-image_ kamu, lihat [Mulai dengan IBM Cloud Container Registry](https://cloud.ibm.com/docs/Registry?topic=registry-getting-started).

Jika kamu menggunakan akun dan wilayah (_region_) yang sama, kamu dapat melakukan _deploy image-image_ yang disimpan di dalam IBM Cloud Container Registry
ke dalam _namespace default_ dari klaster IBM Cloud Kubernetes Service yang kamu miliki tanpa konfigurasi tambahan, lihat [Membuat kontainer dari _image_](https://cloud.ibm.com/docs/containers?topic=containers-images). Untuk opsi konfigurasi lainnya, lihat [Bagaimana cara mengotorasi klaster untuk mengunduh _image_ dari sebuah registri](https://cloud.ibm.com/docs/containers?topic=containers-registry#cluster_registry_auth).

### Konfigurasi Node untuk Otentikasi ke sebuah Registri Privat

{{< note >}}
Jika kamu jalan di Google Kubernetes Engine, akan ada `.dockercfg` pada setiap Node dengan kredensial untuk Google Container Registry. Kamu tidak bisa menggunakan cara ini.
{{< /note >}}

{{< note >}}
Jika kamu jalan di AWS EC2 dan menggunakan EC2 Container Registry (ECR), kubelet pada setiap Node akan dapat
mengatur dan memperbarui kredensial login ECR. Kamu tidak bisa menggunakan cara ini.
{{< /note >}}

{{< note >}}
Cara ini cocok jika kamu dapat mengontrol konfigurasi Node. Cara ini tidak akan bekerja dengan baik pada GCE,
dan penyedia layanan cloud lainnya yang tidak melakukan penggantian Node secara otomatis.
{{< /note >}}

{{< note >}}
Kubernetes pada saat ini hanya mendukung bagian `auths` dan `HttpHeaders` dari konfigurasi docker. Hal ini berarti bantuan kredensial (`credHelpers` atau `credsStore`) tidak didukung.
{{< /note >}}


Docker menyimpan _key_ untuk registri privat pada `$HOME/.dockercfg` atau berkas `$HOME/.docker/config.json`. Jika kamu menempatkan berkas yang sama
pada daftar jalur pencarian (_search path_) berikut, kubelet menggunakannya sebagai penyedia kredensial saat mengunduh _image_.

*   `{--root-dir:-/var/lib/kubelet}/config.json`
*   `{cwd of kubelet}/config.json`
*   `${HOME}/.docker/config.json`
*   `/.docker/config.json`
*   `{--root-dir:-/var/lib/kubelet}/.dockercfg`
*   `{cwd of kubelet}/.dockercfg`
*   `${HOME}/.dockercfg`
*   `/.dockercfg`

{{< note >}}
Kamu mungkin harus mengatur `HOME=/root` secara eksplisit pada berkas _environment_ kamu untuk kubelet.
{{< /note >}}

Berikut langkah-langkah yang direkomendasikan untuk mengkonfigurasi Node kamu supaya bisa menggunakan registri privat.
Pada contoh ini, coba jalankan pada _desktop/laptop_ kamu:

   1. Jalankan `docker login [server]` untuk setiap set kredensial yang ingin kamu gunakan. Ini akan memperbarui `$HOME/.docker/config.json`.
   1. Lihat `$HOME/.docker/config.json` menggunakan _editor_ untuk memastikan sudah berisi kredensial yang ingin kamu gunakan.
   1. Dapatkan daftar Node, contohnya:
      - jika kamu ingin mendapatkan nama: `nodes=$(kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}')`
      - jika kamu ingin mendapatkan IP: `nodes=$(kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}')`
   1. Salin `.docker/config.json` yang ada di lokal kamu pada salah satu jalur pencarian di atas.
      - contohnya: `for n in $nodes; do scp ~/.docker/config.json root@$n:/var/lib/kubelet/config.json; done`

Verifikasi dengana membuat sebuah Pod yanag menggunakan _image_ privat, contohnya:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: private-image-test-1
spec:
  containers:
    - name: uses-private-image
      image: $PRIVATE_IMAGE_NAME
      imagePullPolicy: Always
      command: [ "echo", "SUCCESS" ]
EOF
```
```
pod/private-image-test-1 created
```

Jika semuanya berjalan dengan baik, maka setelah beberapa lama, kamu dapat menjalankan:

```shell
kubectl logs private-image-test-1
```
dan lihat pada keluaran perintah:
```
SUCCESS
```

Jika kamu mencurigai ada perintah yang gagal, kamu dapat menjalankan:
```shell
kubectl describe pods/private-image-test-1 | grep 'Failed'
```
Pada kasus gagal, keluarannya mirip seperti:
```
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```


Kamu harus memastikan semua Node di dalam klaster memiliki `.docker/config.json` yang sama. Jika tidak, Pod-Pod
akan jalan pada beberapa Node saja dan gagal di Node lainnya. Contohnya, jika kamu menggunakan Node _autoscaling_, maka
setiap templat _instance_ perlu untuk mempunyai `.docker/config.json` atau _mount_ sebuah penyimpanan yang berisi berkas tersebut.

Semua Pod memiliki akses baca (_read_) untuk _image-image_ di registri privat manapun ketika
_key_ registri privat ditambahkan pada `.docker/config.json`.

### _Image_ Pra-unduh 

{{< note >}}
Jika kamu jalan di Google Kubernetes Engine, maka akan ada `.dockercfg` pada setiap Node dengan kredensial untuk Google Container Registry. Kamu dapat menggunakan cara ini.
{{< /note >}}

{{< note >}}
Cara ini cocok jika kamu dapat mengontrol konfigurasi Node. Cara ini tidak akan
bisa berjalan dengan baik pada GCE, dan penyedia cloud lainnya yang tidak menggantikan
Node secara otomatis.
{{< /note >}}

Secara _default_, kubelet akan mencoba untuk mengunduh setiap _image_ dari registri yang dispesifikasikan.
Hanya saja, jika properti `imagePullPolicy` diatur menjadi `IfNotPresent` atau `Never`, maka
sebuah _image_ lokal digunakan.

Jika kamu ingin memanfaatkan _image_ pra-unduh sebagai pengganti untuk otentikasi registri,
kamu harus memastikan semua Node di dalam klaster memiliki _image_ pra-unduh yang sama.

Cara ini bisa digunakan untuk memuat _image_ tertentu untuk kecepatan atau sebagai alternatif untuk otentikasi untuk sebuah registri privat.

Semua Pod akan mendapatkan akses baca ke _image_ pra-unduh manapun.

### Tentukan ImagePullSecrets pada sebuah Pod

{{< note >}}
Cara ini merupakan cara yang direkomendasikan saat ini untuk Google Kubernetes Engine, GCE, dan penyedia cloud lainnya yang
secara otomatis dapat membuat Node.
{{< /note >}}

Kubernetes mendukung penentuan _key_ registri pada sebuah Pod.

#### Membuat sebuah Secret dengan Docker Config

Jalankan perintah berikut, ganti nilai huruf besar dengan yang tepat:

```shell
kubectl create secret docker-registry <name> --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
```

Jika kamu sudah memiliki berkas kredensial Docker, daripada menggunakan perintah di atas,
kamu dapat mengimpor berkas kredensial sebagai Kubernetes Secret.
[Membuat sebuah Secret berbasiskan pada kredensial Docker yang sudah ada](/id/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) menjelaskan bagaimana mengatur ini.
Cara ini berguna khususnya jika kamu menggunakan beberapa registri kontainer privat,
perintah `kubectl create secret docker-registry` akan membuat sebuah Secret yang akan
hanya bekerja menggunakan satu registri privat.

{{< note >}}
Pod-Pod hanya dapat mengacu pada imagePullSecrets di dalam _namespace_,
sehingga proses ini perlu untuk diselesaikan satu kali setiap _namespace_.
{{< /note >}}

#### Mengacu pada imagePullSecrets di dalam sebuah Pod

Sekarang, kamu dapat membuat Pod yang mengacu pada Secret dengan menambahkan bagian `imagePullSecrets`
untuk sebuah definisi Pod.

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

Cara ini perlu untuk diselesaikan untuk setiap Pod yang mengguunakan registri privat.

Hanya saja, mengatur _field_ ini dapat diotomasi dengan mengatur imagePullSecrets di dalam
sumber daya [serviceAccount](/docs/user-guide/service-accounts).
Periksa [Tambahan ImagePullSecrets untuk sebuah Service Account](/id/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) untuk instruksi yang lebih detail.

Kamu dapat menggunakan cara ini bersama `.docker/config.json` pada setiap Node. Kredensial-kredensial
akan dapat di-_merged_. Cara ini akan dapat bekerja pada Google Kubernetes Engine.

### Kasus-Kasus Penggunaan (_Use Case_)

Ada beberapa solusi untuk konfigurasi registri privat. Berikut beberapa kasus penggunaan
dan solusi yang disarankan.

1. Klaster yang hanya menjalankan _image non-proprietary_ (misalnya open-source). Tidak perlu unutuk menyembunyikan _image_.
   - Gunakan _image_ publik pada Docker hub.
     - Tidak ada konfigurasi yang diperlukan.
     - Pada GCE/Google Kubernetes Engine, sebuah _mirror_ lokal digunakan secara otomatis untuk meningkatkan kecepatan dan ketersediaan.
1. Klaster yang menjalankan _image proprietary_ yang seharusnya disembunyikan dari luar perusahaan, tetapi bisa terlihat oleh pengguna klaster.
   - Gunakan sebuah privat [registri Docker](https://docs.docker.com/registry/) yang _hosted_.
     - Bisa saja di-_host_ pada [Docker Hub](https://hub.docker.com/signup), atau lainnya.
     - Konfigurasi `.docker/config.json` secara manual pada setiap Node seperti dijelaskan di atas.
   - Atau, jalankan sebuah registri privat internal di belakang _firewall_ kamu dengan akses baca terbuka.
     - Tidak ada konfigurasi Kubernetes yang diperlukan.
   - Atau, ketika pada GCE/Google Kubernetes Engine, menggunakan Google Container Registry yang ada di proyek.
     - Hal ini bisa bekerja baik dengan _autoscaling_ klaster dibandingkan konfigurasi Node manual.
   - Atau, pada sebuah klaster dimana mengubah konfigurasi Node tidak nyaman, gunakan `imagePullSecrets`.
1. Klaster dengan _image proprietary_, beberapa memerlukan akses kontrol yang lebih ketat.
   - Pastikan [AlwaysPullImages _admission controller_](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) aktif. Sebaliknya, semua Pod berpotensi memiliki akses ke semua _image_.
   - Pindahkan data sensitif pada sumber daya "Secret", daripada mengemasnya menjadi sebuah _image_.
1. Sebuah klaster _multi-tenant_ dimana setiap _tenant_ memerlukan registri privatnya masing-masing.
   - Pastikan [AlwaysPullImages _admission controller_](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) aktif. Sebaliknya, semua Pod dari semua tenant berpotensi memiliki akses pada semua _image_.
   - Jalankan sebuah registri privat dimana otorisasi diperlukan.
   - Men-_generate_ kredensial registri uuntuk setiap _tenant_, masukkan ke dalam _secret_ uuntuk setiap _namespace tenant_.
   - _Tenant_ menambahkan _secret_ pada imagePullSecrets uuntuk setiap _namespace_.


Jika kamu memiliki akses pada beberapa registri, kamu dapat membuat satu _secret_ untuk setiap registri.
Kubelet akan melakukan _merge_ `imagePullSecrets` manapun menjadi sebuah virtual `.docker/config.json`.


