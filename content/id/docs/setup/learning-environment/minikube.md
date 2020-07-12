---
title: Instalasi Kubernetes dengan Minikube
weight: 30
content_type: concept
---

<!-- overview -->

Minikube adalah alat yang memudahkan untuk menjalankan Kubernetes pada komputer lokal. Minikube menjalankan satu Node klaster Kubernetes di dalam Mesin Virtual (VM) pada laptop kamu untuk pengguna yang ingin mencoba Kubernetes atau mengembangkannya.


<!-- body -->

## Fitur Minikube

Minikube mendukung fitur Kubernetes berikut:

* DNS
* NodePorts
* ConfigMaps dan Secrets
* Dashboards
* Container Runtime: [Docker](https://www.docker.com/), [CRI-O](https://cri-o.io/), and [containerd](https://github.com/containerd/containerd)
* Enabling CNI (Container Network Interface)
* Ingress

## Installasi

Lihat [Instalasi Minikube](/docs/tasks/tools/install-minikube/).

## Quickstart

Demonstrasi singkat ini memandu kamu tentang memulai, menggunakan dan menghapus Minikube secara lokal. Ikuti langkah berikut untuk memulai dan menjelajahi Minikube.

1. Mulai Minikube dan buat sebuah klaster:

   ```shell
    minikube start
   ```

   Keluaran menyerupai:

   ```
   Starting local Kubernetes cluster...
   Running pre-create checks...
   Creating machine...
   Starting local Kubernetes cluster...
   ```
   Untuk informasi lebih lanjut mengenai memulai klaster pada versi Kubernetes tertentu, VM atau kontainer _runtime_, lihat [Memulai klaster](#memulai-klaster).

2. Kini kamu bisa berinteraksi dengan klaster kamu dengan kubectl. Untuk informasi lebih lanjut, lihat [Interaksi dengan klaster kamu](#interaksi-dengan-klaster-kamu).

   Mari buat Kubernetes Deployment menggunakan _image_ bernama `echoserver`, yaitu sebuah server HTTP sederhana dan membuka _port_ 8080 menggunakan `--port`.

   ```shell
   kubectl create deployment hello-minikube --image=k8s.gcr.io/echoserver:1.10
   ```

   Keluaran menyerupai:

   ```
   deployment.apps/hello-minikube created
   ```
3. Untuk mengakses Deployment `hello-minikube`, paparkan dia sebagai sebuah Service:   

   ```shell
   kubectl expose deployment hello-minikube --type=NodePort --port=8080
   ```

   Opsi `--type=NodePort` menentukan tipe Service.

   Keluaran menyerupai:

   ```
   service/hello-minikube exposed
   ```

4. Pod `hello-minikube` sekarang kini telah dibuat namun kamu harus menunggu hingga Pod  Pod is now launched but you have to wait until the Pod selesai sebelum dapat mengaksesnya melalui Service yang telah dibuka. 

   Cek apakah Pod sudah menyala dan beroperasi:

   ```shell
   kubectl get pod
   ```

   Jika keluaran menampilkan `STATUS` sebagai `ContainerCreating`, Pod sedang dalam proses pembuatan:

   ```
   NAME                              READY     STATUS              RESTARTS   AGE
   hello-minikube-3383150820-vctvh   0/1       ContainerCreating   0          3s
   ```

   Jika keluaran menampilkan `STATUS` sebagai `Running`, Pod sudah menyala dan beroperasi:

   ```
   NAME                              READY     STATUS    RESTARTS   AGE
   hello-minikube-3383150820-vctvh   1/1       Running   0          13s
   ```

5. Ambil URL Service yang dibuka untuk melihat detail Service:

   ```shell
   minikube service hello-minikube --url
   ```

6. Untuk melihat detail dari klaster lokal kamu, salin dan tempel URL yang kamu dapatkan dari keluaran pada _browser_ kamu.

   Keluaran menyerupai:

   ```
   Hostname: hello-minikube-7c77b68cff-8wdzq

   Pod Information:
    -no pod information available-

   Server values:
    server_version=nginx: 1.13.3 - lua: 10008

   Request Information:
    client_address=172.17.0.1
    method=GET
    real path=/
    query=
    request_version=1.1
    request_scheme=http
    request_uri=http://192.168.99.100:8080/

   Request Headers:
        accept=*/*
        host=192.168.99.100:30674
        user-agent=curl/7.47.0

   Request Body:
        -no body in request-
   ```

   Jika kamu tidak lagi membutuhkan Service dan klaster, kamu bisa menghapusnya.

7. Hapus Service `hello-minikube`:

   ```shell
   kubectl delete services hello-minikube
   ```

   Keluaran menyerupai:

   ```
   service "hello-minikube" deleted
   ```

8. Hapus Deployment `hello-minikube`:

   ```shell
   kubectl delete deployment hello-minikube
   ```

   Keluaran menyerupai:

   ```
   deployment.extensions "hello-minikube" deleted
   ```

9. Hentikan klaster Minikube lokal:

   ```shell
   minikube stop
   ```

   Keluaran menyerupai:

   ```
   Stopping "minikube"...
   "minikube" stopped.
   ```

   Untuk informasi lebih lanjut, lihat [Menghentikan Klaster](#menghentikan-klaster).

10. Hapus klaster Minikube lokal

    ```shell
    minikube delete
    ```
    Keluaran menyerupai:
    ```
    Deleting "minikube" ...
    The "minikube" cluster has been deleted.
    ```
	Untuk informasi lebih lanjut, lihat [Menghapus Klaster](#menghapus-klaster).

## Mengelola Klaster

### Memulai Klaster

Perintah `minikube start` bisa digunakan untuk memulai klaster kamu.
Perintah ini membuat dan mengkonfigurasi sebuah mesin virtual (VM) yang menjalankan klaster Kubernetes dengan satu Node.
Perintah ini juga mengkonfigurasi instalasi [kubectl](/docs/user-guide/kubectl-overview/) untuk berkomunikasi dengan klaster ini.

{{< note >}}
Jika kamu menggunakan proxy web, kamu harus meneruskan informasi berikut ke perintah `minikube start`:

```shell
https_proxy=<my proxy> minikube start --docker-env http_proxy=<my proxy> --docker-env https_proxy=<my proxy> --docker-env no_proxy=192.168.99.0/24
```
Sayangnya, pengaturan dengan _environment variable_ tidak berfungsi.

Minikube juga membuat konteks "minikube", dan menetapkannya sebagai bawaan di kubectl.
Untuk kembali menggunakan konteks ini, jalankan perintah: `kubectl config use-context minikube`.
{{< /note >}}

#### Menentukan Versi Kubernetes

Kamu bisa menentukan versi Kubernetes yang digunakan oleh Minikube dengan
menambahkan `--kubernetes-version` ke perintah `minikube start`. Sebagai 
contoh, untuk menjalankan versi {{<param "fullversion">}}, kamu akan menjalankan perintah berikut:

```
minikube start --kubernetes-version {{< param "fullversion" >}}
```
#### Menentukan _driver_ VM

Kamu bisa mengubah _driver_ VM dengan menambahkan _flag_ `--driver=<masukan_nama_driver>` kepada `minikube start`.
Sebagai contoh:
```shell
minikube start --driver=<nama_driver>
```

Minikube mendukung _driver_ berikut:
{{< note >}}
Lihat [_DRIVER_](https://minikube.sigs.k8s.io/docs/reference/drivers/) untuk detail tentang _driver_ yang didukung dan proses instalasi plugin.
{{< /note >}}

* docker ([instalasi driver](https://minikube.sigs.k8s.io/docs/drivers/docker/))
* virtualbox ([instalasi driver](https://minikube.sigs.k8s.io/docs/drivers/virtualbox/))
* podman ([instalasi driver](https://minikube.sigs.k8s.io/docs/drivers/podman/)) (TAHAP EXPERIMEN)
* vmwarefusion
* kvm2 ([instalasi driver](https://minikube.sigs.k8s.io/docs/reference/drivers/kvm2/))
* hyperkit ([instalasi driver](https://minikube.sigs.k8s.io/docs/reference/drivers/hyperkit/))
* hyperv ([instalasi driver](https://minikube.sigs.k8s.io/docs/reference/drivers/hyperv/))
Perlu diingat bahwa IP dibawah adalah dinamik dan bisa berubah. IP ini bisa diambil dengan `minikube ip`.
* vmware ([instalasi driver](https://minikube.sigs.k8s.io/docs/reference/drivers/vmware/)) (_driver_ VMware terpadu)
* parallels ([instalasi driver](https://minikube.sigs.k8s.io/docs/reference/drivers/parallels/))
* none (Menjalankan komponen Kubernetes di _host_ dan tidak di mesin virtual. Kamu harus menjalankan Linux dan untuk menginstal {{<glossary_tooltip term_id = "docker">}}.)

{{< caution >}}
Jika kamu menggunakan _driver_ `none`, beberapa komponen Kubernetes dijalankan sebagai kontainer istimewa yang memiliki efek samping di luar lingkungan Minikube. Efek samping tersebut berarti bahwa _driver_ `none` tidak direkomendasikan untuk komputer pribadi.
{{< /caution >}}

#### Memulai klaster pada kontainer _runtime_ alternatif
Kamu bisa memulai Minikube pada _runtime_ kontainer berikut.
{{< tabs name="container_runtimes" >}}
{{% tab name="containerd" %}}
Untuk menggunakan [containerd](https://github.com/containerd/containerd) sebagai _runtime_ kontainer, jalankan:
```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=containerd \
    --bootstrapper=kubeadm
```

Atau kamu bisa menggunakan versi yang diperpanjang:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=unix:///run/containerd/containerd.sock \
    --extra-config=kubelet.image-service-endpoint=unix:///run/containerd/containerd.sock \
    --bootstrapper=kubeadm
```
{{% /tab %}}
{{% tab name="CRI-O" %}}
Untuk menggunakan [CRI-O](https://cri-o.io/) sebagain _runtime_ kontainer, jalankan:
```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --container-runtime=cri-o \
    --bootstrapper=kubeadm
```
Atau kamu bisa menggunakan versi yang diperpanjang:

```bash
minikube start \
    --network-plugin=cni \
    --enable-default-cni \
    --extra-config=kubelet.container-runtime=remote \
    --extra-config=kubelet.container-runtime-endpoint=/var/run/crio.sock \
    --extra-config=kubelet.image-service-endpoint=/var/run/crio.sock \
    --bootstrapper=kubeadm
```
{{% /tab %}}
{{< /tabs >}}

#### Menggunakan _image_ lokal degan menggunakan kembali _daemon_ Docker

Saat menggunakan sebuah VM untuk Kubernetes, akan lebih baik jika _daemon_ Docker bawaan Minikube digunakan kembali. Menggunakan kembali _daemon_ bawaan membuat kamu tidak perlu membangun registri Docker pada mesin _host_ kamu dan mengupload _image_ ke dalamnya. Alih-alih, kamu dapat membangun di dalam _daemon_ Docker yang sama dengan Minikube, yang tentunya dapat mempercepat percobaan lokal.

{{< note >}}
Pastikan untuk memberi _tag_ pada Docker _image_ kamu dengan sesuatu selain `latest` dan gunakan tag tersebut untuk menarik _image_. Karena `:latest` adalah bawaan, dengan kebijakan penarikan _image_ bawaan, yaitu ` Always`, kesalahan penarikan _image_ (`ErrImagePull`) akhirnya dapat terjadi jika kamu tidak memiliki _image_ Docker di registri Docker bawaan (biasanya DockerHub).
{{< /note >}}

Untuk bekerja dengan _daemon_ Docker pada mesin Mac/Linux, jalankan baris terakhir dari `minikube docker-env`.

Kamu sekarang dapat menggunakan Docker di terminal mesin Mac/Linux kamu untuk berkomunikasi dengan _daemon_ Docker di dalam VM Minikube:

```shell
docker ps
```

{{< note >}}
Pada Centos 7, Docker bisa memberikan kesalahan berikut:

```
Could not read CA certificate "/etc/docker/ca.pem": open /etc/docker/ca.pem: no such file or directory
```

Kamu bisa memperbaiki ini dengan memperbaharui /etc/sysconfig/docker untuk memastikan bahwa lingkungan Minikube dikenali:

```shell
< DOCKER_CERT_PATH=/etc/docker
---
> if [ -z "${DOCKER_CERT_PATH}" ]; then
>   DOCKER_CERT_PATH=/etc/docker
> fi
```
{{< /note >}}

### Mengkonfigurasi Kubernetes

Minikube memiliki sebuah fitur "configurator" yang memperbolehkan pengguna untuk mengkonfigurasi komponen Kubernetes dengan sembarang nilai.
Untuk menggunakan fitur ini, kamu bisa menggunakan _flag_ `--extra-config` pada perintah `minikube start`.

_Flag_ ini berulang, jadi kamu bisa menggunakannya beberapa kali dengan beberapa nilai yang berbeda untuk mengatur beberapa opsi.

_Flag_ ini menerima sebuah _string_ dalam format `component.key=value`, dimana `component` adalah salah satu _string_ dari list dibawah, `key` adalah nilai dari _struct_ configurasi dan `value` adalah nilai yang digunakan.

Kunci yang valid bisa ditemukan dengan memeriksa dokumentasi `componentconfigs` Kubernetes untuk setiap komponen.
Berikut adalah dokumentasi untuk setiap konfigurasi yang didukung:

* [kubelet](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)
* [apiserver](https://godoc.org/k8s.io/kubernetes/cmd/kube-apiserver/app/options#ServerRunOptions)
* [proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)
* [controller-manager](https://godoc.org/k8s.io/kubernetes/pkg/controller/apis/config#KubeControllerManagerConfiguration)
* [etcd](https://godoc.org/github.com/coreos/etcd/etcdserver#ServerConfig)
* [scheduler](https://godoc.org/k8s.io/kubernetes/pkg/scheduler/apis/config#KubeSchedulerConfiguration)

#### Contoh

Untuk mengubah pengaturan `MaxPods` menjadi 5 pada Kubelet, gunakan _flag_ ini: `--extra-config=kubelet.MaxPods=5`.

Fitur ini juga mendukung _struct_ bersarang. Untuk mengubah pengaturan `LeaderElection.LeaderElect` menjadi `true` pada penjadwal, gunakan _flag_: `--extra-config=scheduler.LeaderElection.LeaderElect=true`.

Untuk mengatur `AuthorizationMode` pada `apiserver` menjadi `RBAC`, kamu bisa menggunakan: `--extra-config=apiserver.authorization-mode=RBAC`.

### Menghentikan klaster
Perintah `minikube stop` bisa digunakan untuk menghentikan klaster kamu.
Perintah ini menghentikan mesin virtual Minikube, tapi mempertahankan semua _state_ dan data klaster.
Memulai klaster lagi akan mengembalikannya ke _state_ sebelumnya.

### Menghapus klaster
Perintah `minikube delete` bisa digunakan untuk menghapus klaster kamu.
Perintah ini menghentikan dan menghapus mesin virtual Minikube. Tidak ada data atau _state_ yang dipertahankan.

### Memperbaharui Minikube
Jika kamu menggunakan macOS dan [Brew Package Manager](https://brew.sh/) sudah terpasang, jalankan:

```shell
brew update
brew upgrade minikube
```

## Interaksi dengan Klaster Kamu

### Kubectl

Perintah `minikube start` membuah sebuah [konteks kubectl](/docs/reference/generated/kubectl/kubectl-commands#-em-set-context-em-) yang disebut "minikube".
Konteks ini menyimpan pengaturan untuk berkomunikasi dengan klaster Miniku kamu.

Minikube menetapkan konteks ini sebagai bawaan secara otomatis, tetapi jika kamu ingin mengubah kembali ke konteks tersebut di kemudian hari, gunakan:

`kubectl config use-context minikube`

Atau berikan konteks untuk setiap perintah seperti ini:

`kubectl get pods --context=minikube`

### Dashboard

Untuk mengakses [Dashboard Kubernetes](/docs/tasks/access-application-cluster/web-ui-dashboard/), gunakan perintah ini pada terminal setelah memulai Minikube untuk mendapatkan alamatnya:

```shell
minikube dashboard
```

### Service

Untuk mengakses Service yang dibuka via NodePort, jalankan perintah ini diterminal setelah memulai Minikube untuk mendapatkan alamat:

```shell
minikube service [-n NAMESPACE] [--url] NAME
```

## Jaringan

Mesin virtual Minikube dibuka ke sistem _host_ melalui alamat IP _host-only_ , yang bisa didapatkan dengan perintah `minikube ip`.
Seluruh Service dengan jenis `NodePort` bisa diakses melalui alamat IP pada NodePort.

Untuk mementukan NodePort pada Service kamu, kamu bisa menggunakan perintah `kubectl` sebagai berikut:

`kubectl get service $SERVICE --output='jsonpath="{.spec.ports[0].nodePort}"'`

## PersistentVolume

Minikube mendukung [PersistentVolumes](/docs/concepts/storage/persistent-volumes/) dengan henis `hostPath`.
PersistenVolume ini dipetakan ke direktori di dalam mesin virtual Minikube.

Mesin virtual Minikube melakukan _booting_ ke tmpfs, sehingga sebagian besar direktor tidak akan bertahan setelah di _reboot_ (`minikube stop`).

Namun, Minikube diatur untuk mempertahankan berkas yang tersimpan didalam direktori _host_ berikut:

* `/data`
* `/var/lib/minikube`
* `/var/lib/docker`

Ini adalah contoh pengaturan PersistentVolume untuk mempertahankan data di dalam direktori `/data`:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0001
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 5Gi
  hostPath:
    path: /data/pv0001/
```

## _Mounted Host Folders_
Beberapa _driver_ akan memasang folder _host_ di dalam VM sehingga kamu dapat dengan mudah berbagi berkas antara VM dan _host_. Saat ini, hal tersebut tidak dapat dikonfigurasi dan berbeda untuk _driver_ dan sistem operasi yang kamu gunakan.

{{< note >}}
Berbagi folder _host_ bellum diimplementasikan pada _driver_ KVM.
{{< /note >}}

| Driver | OS | HostFolder | VM |
| --- | --- | --- | --- |
| VirtualBox | Linux | /home | /hosthome |
| VirtualBox | macOS | /Users | /Users |
| VirtualBox | Windows | C://Users | /c/Users |
| VMware Fusion | macOS | /Users | /mnt/hgfs/Users |
| Xhyve | macOS | /Users | /Users |

## _Container Registry_ Pribadi

Untuk mengakses kontainer _registry_ pribadi, ikuti langkah berikut pada [halaman ini](/docs/concepts/containers/images/).

Kami merekomendasi penggunaan `ImagePullSecrets`, tetapi jika kamu ingin mengkonfigurasi akses pada virtual mesin Minikube, kamu bisa menempatkan `.dockercfg` di direktori `/home/docker` atau `config.json` di dalam direktori `/home/docker/.docker`.

## Add-on

Supaya Minikube memulai atau memulai kembali add-on kustom dengan benar, 
tempatkan add-on yang ingin kamu jalankan di dalam direktori `~/.minikube/addons`.
Add-on di folder akan dipindahkan ke virtual mesin Minikube dan dijalankan setiap kali Minikube
dimulai atau dimulai ulang.

## Menggunakan Minikube dengan HTTP _Proxy_

Minikube membuat sebuah mesin virtual yang memasukkan Kubernetes dan _daemon_ Docker.
Ketika Kubernetes berusaha untuk menjadwalkan kontainer dengan Docker, _daemon_ Docker mungkin membutuhkan
akses jaringan eksternal untuk menarik kontainer.

Jika kamu berada di belakang HTTP _proxy_, kamu mungkin perlu menyediakan DOcker dengan pengaturan _proxy_. 
Untuk melakukan ini, berikan _environment variable_ yang dibutuhkan sebagai _flag_ saat `minikube start`.

Contoh:

```shell
minikube start --docker-env http_proxy=http://$YOURPROXY:PORT \
                 --docker-env https_proxy=https://$YOURPROXY:PORT
```

Jika alamat mesin virtual kamu adalah 192.168.99.100, maka kemungkinan pengaturan _proxy_ kamu akan mencegah `kubectl` untuk mencapainya. 
Untuk melewati konfigurasi _proxy_ untuk alamat IP ini, kamu harus memodifikasi pengaturan _no_proxy` kamu. Kamu bisa melakukannya dengan:

```shell
export no_proxy=$no_proxy,$(minikube ip)
```

## Masalah yang Diketahui

Fitur yang memerlukan banyak node tidak akan berfungsi di Minikube.

## Desain

Minikube menggunakan [libmachine](https://github.com/docker/machine/tree/master/libmachine) untuk menyediakan mesin virtual, dan [kubeadm](https://github.com/kubernetes/kubeadm) untuk menyediakan klaster Kubernetes.

Untuk info lebih lanjut tentang Minikube, lihat [proposal](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md).

## Tautan Tambahan

* **Tujuan and Non-Tujuab**: Untuk tujuan dan non-tujuan dari projek Minikube, lihat [roadmap](https://minikube.sigs.k8s.io/docs/contrib/roadmap/).
* **Petunjuk Pengembangan**: Lihat [Berkontribusi](https://minikube.sigs.k8s.io/docs/contrib/) untuk ikhtisar bagaimana cara mengirimkan _pull request_..
* **Membangun Minikube**: Untuk instruksi bagaimana membangun atau mengetes Minikube dari sumber kode, lihat [petunjuk membangun](https://minikube.sigs.k8s.io/docs/contrib/building/).
* **Menambahkan Dependensi Baru**: Untuk instruksi bagaimana menambahkan dependensi baru ke Minikube, lihat [petunjuk penambahan dependensi](https://minikube.sigs.k8s.io/docs/contrib/drivers/).
* **Menambahkan Addon Baru**: Untuk instruksi bagaimana menambahkan addon baru untuk Minikube, lihat [petunjuk menambahkan addon baru](https://minikube.sigs.k8s.io/docs/contrib/addons/).
* **MicroK8s**: Pengguna linux yang ingin menhindari penggunaan mesin virtual, bisa mempertimbangkan [MicroK8s](https://microk8s.io/) sebagai alternatif.

## Komunitas

Kontribusi, pertanyaan, dan komentar sangat diharapkan! Pengembang Minikube berkumpul di [Slack](https://kubernetes.slack.com) di _channel_ #minikube (dapatkan undangan [di sini](http://slack.kubernetes.io/)). Kami juga memiliki [milis kubernetes-dev Google Groups](https://groups.google.com/forum/#!forum/kubernetes-dev). Jika kamu memposting sesuatu, awali subjek kamu dengan "minikube: ".

