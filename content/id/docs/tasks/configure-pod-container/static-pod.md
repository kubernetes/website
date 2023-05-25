---
title: Membuat Pod Statis
weight: 170
content_type: task
---

<!-- overview -->

Pod statis dikelola langsung oleh _daemon_ kubelet pada suatu Node spesifik,
tanpa {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
mengobservasi mereka.
Tidak seperti Pod yang dikelola oleh _control plane_ (contohnya,
{{< glossary_tooltip text="Deployment" term_id="deployment" >}});
kubelet akan memantau setiap Pod statis (dan menjalankan ulang jika
Pod mengalami kegagalan).

Pod statis selalu terikat pada satu {{< glossary_tooltip term_id="kubelet" >}}
di dalam Node spesifik.

Kubelet secara otomatis akan mengulang untuk membuat sebuah
{{< glossary_tooltip text="Pod mirror" term_id="mirror-pod" >}}
pada server API Kubernetes untuk setiap Pod statis.
Ini berarti Pod yang berjalan pada Node akan terlihat oleh API server,
namun tidak dapat mengontrol dari sana.

{{< note >}}
Jika kamu menjalankan klaster Kubernetes dan menggunakan Pod statis
untuk menjalankan Pod pada setiap Node, kamu kemungkinan harus menggunakan
sebuah {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}.
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Laman ini mengasumsikan kamu menggunakan {{< glossary_tooltip term_id="cri-o" >}}
untuk menjalankan Pod, dan Node kamu berjalan menggunakan sistem operasi Fedora.
Instruksi untuk distribusi lain atau instalasi Kubernetes mungkin berbeda.

<!-- steps -->

## Membuat sebuah Pod statis

Kamu dapat mengatur Pod statis dengan menggunakan sebuah
[berkas konfigurasi pada _file system_](#konfigurasi-melalui-berkas-sistem)
atau sebuah [berkas konfigurasi ditempatkan pada web](#konfigurasi-melalui-http).

### Manifes Pod statis pada berkas sistem (_file system_) {#konfigurasi-melalui-berkas-sistem}

Manifes adalah standar definisi Pod dalam format JSON atau YAML pada suatu direktori.
Gunakan _field_ `staticPodPath: <direktori>` pada
[berkas konfigurasi kubelet](/docs/tasks/administer-cluster/kubelet-config-file),
yang akan membaca direktori
secara berkala dan membuat atau menghapus Pod statis sesuai dengan berkas YAML/JSON
yang bertambah atau berkurang disana.

Catatan bahwa kubelet akan mengabaikan berkas yang diawali dengan titik (_dot_)
ketika memindai suatu direktori.

Sebagai contoh, ini cara untuk memulai server web sederhana sebagai Pod statis:

1. Pilih Node yang kamu pilih untuk menjalankan Pod statis. Dalam contoh ini adalah `my-node1`.

    ```shell
    ssh my-node1
    ```

2. Pilih sebuah direktori, katakan `/etc/kubelet.d` dan letakkan berkas definisi Pod untuk web server disana, contohnya `/etc/kubelet.d/static-web.yaml`:

    ```shell
    # Jalankan perintah ini pada Node tempat kubelet sedang berjalan
    mkdir /etc/kubelet.d/
    cat <<EOF >/etc/kubelet.d/static-web.yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    EOF
    ```

3. Atur kubelet pada Node untuk menggunakan direktori ini dengan menjalankannya menggunakan argumen `--pod-manifest-path=/etc/kubelet.d/`. Pada Fedora, ubah berkas `/etc/kubernetes/kubelet` dengan menambahkan baris berikut:

   ```
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
   ```
   atau tambahkan _field_ `staticPodPath: <direktori>` pada [berkas konfigurasi kubelet](/docs/tasks/administer-cluster/kubelet-config-file).

4. Jalankan ulang kubelet. Pada Fedora, kamu dapat menjalankan:

   ```shell
   # Jalankan perintah berikut pada Node tempat kubelet berjalan
   systemctl restart kubelet
   ```

### Manifes Pod statis pada Web {#konfigurasi-melalui-http}

Berkas yang ditentukan pada argumen `--manifest-url=<URL>` akan diunduh oleh kubelet secara berkala
dan kubelet akan menginterpretasinya sebagai sebuah berkas JSON/YAML yang berisikan definisi Pod.
Mirip dengan cara kerja [manifes pada _filesystem_](#konfigurasi-melalui-berkas-sistem),
kubelet akan mengambil manifes berdasarkan jadwal. Jika ada perubahan pada daftar
Pod statis, maka kubelet akan menerapkannya.

Untuk menggunakan cara ini:

1. Buat sebuah berkas YAML dan simpan pada suatu web server sehingga kamu pada memberikan URL tersebut pada kubelet.

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    ```

2. Atur kubelet pada suatu Node untuk menggunakan manifes pada web ini dengan menjalankan menggunakan argumen `--manifest-url=<url-manifes>`. Pada Fedora, ubah pada `/etc/kubernetes/kubelet` untuk menambahkan baris ini:

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<url-manifes>"
    ```

3. Jalankan ulang kubelet. Pada Fedora, kamu dapat menjalankan:

    ```shell
    # Jalankan perintah ini pada Node tempat kubelet berjalan
    systemctl restart kubelet
    ```

## Mengobservasi perilaku Pod statis

Ketika kubelet berjalan, secara otomatis akan menjalankan semua Pod statis yang terdefinisi.
Ketika kamu mendefinisikan Pod statis dan menjalankan ulang kubelet, Pod statis yang baru
akan dijalankan.

Kamu dapat melihat Container yang berjalan (termasuk Pod statis) dengan menjalankan (pada Node):
```shell
# Jalankan perintah ini pada Node tempat kubelet berjalan
crictl ps
```

Keluarannya kira-kira seperti berikut:

```console
CONTAINER ID IMAGE         COMMAND  CREATED        STATUS         PORTS     NAMES
f6d05272b57e nginx:latest  "nginx"  8 minutes ago  Up 8 minutes             k8s_web.6f802af4_static-web-fk-node1_default_67e24ed9466ba55986d120c867395f3c_378e5f3c
```

Kamu dapat melihat Pod _mirror_ tersebut pada API server:

```shell
kubectl get pods
```
```
NAME         READY   STATUS    RESTARTS        AGE
static-web   1/1     Running   0               2m
```

{{< note >}}
Pastikan kubelet memiliki izin untuk membuat Pod _mirror_ pada server API. Jika tidak,
pembuatannya akan ditolak oleh API server. Lihat
[PodSecurityPolicy](/id/docs/concepts/policy/pod-security-policy/).
{{< /note >}}


{{< glossary_tooltip term_id="label" text="Label" >}} dari Pod statis
akan dibuat juga pada Pod _mirror_. Kamu dapat menggunakan label tersebut
seperti biasa menggunakan {{< glossary_tooltip term_id="selector" text="selector-selector" >}},
atau yang lainnya.

Kamu dapat mencoba untuk menggunakan kubelet untuk menghapus Pod _mirror_ tersebut pada API server,
namun kubelet tidak akan menghapus Pod statis:

```shell
kubectl delete pod static-web
```
```
pod "static-web" deleted
```
Kamu akan melihat bahwa Pod tersebut tetap berjalan:
```shell
kubectl get pods
```
```
NAME         READY   STATUS    RESTARTS   AGE
static-web   1/1     Running   0          4s
```

Kembali ke Node tempat kubelet berjalan, kamu dapat mencoba menghentikan Container
Docker secara manual.
Kamu akan melihat, setelah beberapa saat, kubelet akan mengetahui dan akan menjalankan ulang Pod
secara otomatis:

```shell
# Jalankan perintah ini pada Node tempat kubelet berjalan
crictl stop 129fd7d382018 # ganti dengan ID pada Container-mu
sleep 20
crictl ps
```
```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
89db4553e1eeb   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

## Penambahan dan pengurangan secara dinamis pada Pod statis

Direktori konfigurasi (`/etc/kubelet.d` pada contoh kita) akan dipindai secara berkala oleh kubelet
untuk melakukan perubahan dan penambahan/pengurangan
Pod sesuai dengan penambahan/pengurangan berkas pada direktori tersebut.

```shell
# Ini mengasumsikan kamu menggunakan konfigurasi Pod statis pada _filesystem_
# Jalankan perintah ini pada Node tempat kubelet berjalan
#
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
crictl ps
# Kamu mendapatkan bahwa tidak ada Container nginx yang berjalan
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
crictl ps
```
```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
f427638871c35   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```
