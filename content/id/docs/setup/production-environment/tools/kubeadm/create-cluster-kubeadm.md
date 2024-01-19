---
title: Membuat sebuah klaster dengan control-plane tunggal menggunakan kubeadm
content_type: task
weight: 30
---

<!-- overview -->

Perkakas <img src="/images/kubeadm-stacked-color.png" align="right" width="150px">`kubeadm` membantu kamu membuat sebuah klaster Kubernetes minimum yang layak dan sesuai dengan _best practice_. Bahkan, kamu dapat menggunakan `kubeadm` untuk membuat sebuah klaster yang lolos [uji Kubernetes Conformance](https://kubernetes.io/blog/2017/10/software-conformance-certification).  
`kubeadm` juga mendukung fungsi siklus hidup (_lifecycle_)
klaster lainnya, seperti [_bootstrap token_](/docs/reference/access-authn-authz/bootstrap-tokens/) dan pembaruan klaster (_cluster upgrade_).

`kubeadm` merupakan perkakas yang bagus jika kamu membutuhkan:

- Sebuah cara yang sederhana untuk kamu mencoba Kubernetes, mungkin untuk pertama kalinya.
- Sebuah cara bagi pengguna lama (_existing users_) untuk mengotomatiskan penyetelan sebuah klaster dan menguji aplikasi mereka.
- Sebuah komponen dasar pada ekosistem lain dan/atau perkakas penginstal lain dengan cakupan
  yang lebih luas.

Kamu dapat menginstal dan menggunakan `kubeadm` pada berbagai macam mesin: laptop milikmu, sekelompok
server di _cloud_, sebuah Raspberry Pi, dan lain-lain. Baik itu men-_deploy_ pada 
_cloud_ ataupun _on-premise_, kamu dapat mengintegrasikan `kubeadm` pada sistem _provisioning_ seperti
Ansible atau Terraform.



## {{% heading "prerequisites" %}}


Untuk mengikuti panduan ini, kamu membutuhkan:

- Satu mesin atau lebih, yang menjalankan sistem operasi Linux yang kompatibel dengan deb atau rpm; sebagai contoh: Ubuntu atau CentOS.
- 2 GiB atau lebih RAM per mesin--kurang dari nilai tersebut akan menyisakan sedikit ruang untuk
   aplikasi-aplikasimu.
- Sedikitnya 2 CPU pada mesin yang akan kamu gunakan sebagai Node _control-plane_.
- Koneksi internet pada seluruh mesin pada klaster. Kamu dapat menggunakan internet
  publik ataupun pribadi.


Kamu juga harus menggunakan versi `kubeadm` yang dapat men-_deploy_ versi
Kubernetes yang ingin kamu gunakan pada klaster barumu.

[Kebijakan dukungan versi Kubernetes dan _version skew_](https://kubernetes.io/docs/setup/release/version-skew-policy/#supported-versions) juga berlaku pada `kubeadm` dan Kubernetes secara umum.
Periksa kebijakan tersebut untuk mempelajari tentang versi Kubernetes dan `kubeadm`
mana saja yang didukung. Laman ini ditulis untuk Kubernetes {{< param "version" >}}.

Fitur `kubeadm` secara umum berstatus _General Availability_ (GA). Beberapa sub-fitur sedang
berada dalam pengembangan. Implementasi pembuatan klaster dapat berubah
sedikit seiring dengan berevolusinya kubeadm, namun secara umum implementasinya sudah cukup stabil.

{{< note >}}
Semua perintah di dalam `kubeadm alpha`, sesuai definisi, didukung pada level _alpha_.
{{< /note >}}



<!-- steps -->

## Tujuan

* Menginstal Kubernetes klaster dengan _control-plane_ tunggal atau [klaster dengan ketersediaan tinggi](/docs/setup/production-environment/tools/kubeadm/high-availability/)
* Menginstal jaringan Pod pada klaster sehingga Pod dapat
  berinteraksi satu sama lain

## Instruksi

### Menginstal kubeadm pada hos

Lihat ["Menginstal kubeadm"](/id/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
Jika kamu sudah menginstal kubeadm sebelumnya, jalankan `apt-get update &&
apt-get upgrade` atau `yum update` untuk mendapatkan versi kubeadm paling baru.

Ketika kamu melakukan pembaruan, kubelet melakukan _restart_ setiap beberapa detik sambil menunggu dalam kondisi _crashloop_ sampai
kubeadm memberikan perintah yang harus dilakukan. _Crashloop_ ini memang diantisipasi dan normal.
Setelah kamu menginisialisasi _control-plane_, kubelet akan berjalan normal.
{{< /note >}}

### Menginisialisasi Node _control-plane_

Node _control-plane_ adalah mesin dimana komponen-komponen _control plane_ berjalan, termasuk
{{< glossary_tooltip term_id="etcd" >}} (basis data klaster) dan
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
(yang akan berkomunikasi dengan perkakas _command line_ {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.

1. (Direkomendasikan) Jika kamu berencana untuk memperbarui klaster `kubeadm` dengan _control-plane_ tunggal 
menjadi ketersediaan tinggi kamu harus menentukan `--control-plane-endpoint` agar mengarah ke _endpoint_ yang digunakan bersama
untuk semua Node _control-plane_. _Endpoint_ tersebut dapat berupa nama DNS atau sebuah alamat IP dari _load-balancer_.
2. Pilih _add-on_ jaringan Pod, dan pastikan apakah diperlukan argumen untuk
diberikan pada `kubeadm init`. Tergantung
penyedia pihak ketiga yang kamu pilih, kamu mungkin harus mengatur `--pod-network-cidr` dengan nilai
yang spesifik pada penyedia tertentu. Lihat [Menginstal _add-on_ jaringan Pod](#jaringan-pod).
3. (Opsional) Sejak versi 1.14, `kubeadm` mencoba untuk mendeteksi _runtime_ kontainer pada Linux
dengan menggunakan daftar _domain socket path_ yang umum diketahui. Untuk menggunakan _runtime_ kontainer yang berbeda atau
jika ada lebih dari satu yang terpasang pada Node yang digunakan, tentukan argumen `--cri-socket`
pada `kubeadm init`. Lihat [Menginstal _runtime_](/id/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
4. (Opsional) Kecuali ditentukan sebelumnya, `kubeadm` akan menggunakan antarmuka jaringan yang diasosiasikan
dengan _default gateway_ untuk mengatur alamat _advertise_ untuk API Server pada Node _control-plane_ ini.
Untuk menggunakan antarmuka jaringan yang berbeda, tentukan argumen `--apiserver-advertise-address=<ip-address>` 
pada `kubeadm init`. Untuk men-_deploy_ klaster Kubernetes IPv6 menggunakan pengalamatan IPv6, kamu
harus menentukan alamat IPv6, sebagai contoh `--apiserver-advertise-address=fd00::101`
5. (Opsional) Jalankan `kubeadm config images pull` sebelum `kubeadm init` untuk memastikan
konektivitas ke _container image registry_ gcr.io.

Untuk menginisialisasi Node _control-plane_ jalankan:

```bash
kubeadm init <args>
```

### Pertimbangan mengenai apiserver-advertise-address dan ControlPlaneEndpoint

Meski `--apiserver-advertise-address` dapat digunakan untuk mengatur alamat _advertise_ untuk server
API pada Node _control-plane_ ini, `--control-plane-endpoint` dapat digunakan untuk mengatur _endpoint_ yang digunakan bersama
untuk seluruh Node _control-plane_.

`--control-plane-endpoint` tidak hanya mengizinkan alamat IP tetapi juga nama DNS yang dapat dipetakan ke alamat IP.
Silakan hubungi administrator jaringan kamu untuk mengevaluasi solusi-solusi yang mempertimbangkan pemetaan tersebut.

Berikut contoh pemetaannya:

```
192.168.0.102 cluster-endpoint
```

Di mana `192.168.0.102` merupakan alamat IP dari Node ini dan `cluster-endpoint` merupakan nama DNS _custom_ yang dipetakan pada IP ini.
Hal ini memungkinkan kamu untuk memberikan `--control-plane-endpoint=cluster-endpoint` pada `kubeadm init` dan memberikan nama DNS yang sama pada
`kubeadm join`. Kemudian kamu dapat memodifikasi `cluster-endpoint` untuk mengarah pada alamat _load-balancer_ dalam skenario
ketersediaan tinggi (_highly availabile_).

Mengubah klaster _control plane_ tunggal yang dibuat tanpa `--control-plane-endpoint` menjadi klaster dengan ketersediaan tinggi
tidak didukung oleh kubeadm.

### Informasi lebih lanjut

Untuk informasi lebih lanjut mengenai argumen-argumen `kubeadm init`, lihat [panduan referensi kubeadm](/docs/reference/setup-tools/kubeadm/).

Untuk daftar pengaturan konfigurasi yang lengkap, lihat [dokumentasi berkas konfigurasi](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

Untuk menyetel komponen-komponen _control plane_, termasuk pemasangan IPv6 opsional pada _liveness probe_ untuk komponen-komponen _control plane_ dan server etcd, berikan argumen ekstra pada tiap komponen seperti yang didokumentasikan pada [argumen-argumen _custom_](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Untuk menjalankan `kubeadm init` lagi, sebelumnya kamu harus [membongkar klaster](#pembongkaran).

Jika kamu menggabungkan sebuah Node dengan arsitektur yang berbeda ke klastermu, pastikan DaemonSets yang di_deploy_
memiliki _image_ kontainer yang mendukung arsitektur tersebut.

Pertama-tama `kubeadm init` akan menjalankan sekumpulan _precheck_ untuk memastikan mesin
siap untuk menjalankan Kubernetes. Kumpulan _precheck_ ini menunjukkan peringatan-peringatan dan akan berhenti jika terjadi kesalahan. Kemudian `kubeadm init`
akan mengunduh dan menginstal komponen-komponen _control plane_ klaster. Hal ini membutuhkan waktu beberapa menit.
Keluaran yang dihasilkan terlihat seperti berikut ini:

```none
[init] Using Kubernetes version: vX.Y.Z
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Activating the kubelet service
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [kubeadm-cp localhost] and IPs [10.138.0.4 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [kubeadm-cp localhost] and IPs [10.138.0.4 127.0.0.1 ::1]
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [kubeadm-cp kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.138.0.4]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 31.501735 seconds
[uploadconfig] storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-X.Y" in namespace kube-system with the configuration for the kubelets in the cluster
[patchnode] Uploading the CRI Socket information "/var/run/dockershim.sock" to the Node API object "kubeadm-cp" as an annotation
[mark-control-plane] Marking the node kubeadm-cp as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node kubeadm-cp as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: <token>
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstraptoken] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstraptoken] creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

Untuk membuat kubectl bekerja bagi pengguna _non-root_, jalankan perintah-perintah berikut, yang juga merupakan
bagian dari keluaran `kubeadm init`:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Secara alternatif, jika kamu adalah pengguna `root`, kamu dapat menjalankan:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

Buatlah catatan dari perintah `kubeadm join` yang dihasilkan `kubeadm init`. Kamu
membutuhkan perintah ini untuk [menggabungkan Node-Node ke klaster](#menggabungkan-node).

_Token_ digunakan untuk otentikasi bersama (_mutual authentication_) antara Node _control-plane_ dan Node-Node yang
akan bergabung. _Token_ yang didapat di sini bersifat rahasia. Simpan dengan aman, karena siapapun yang memiliki token tersebut
dapat menambahkan Node-Node yang dapat mengotentikasikan diri ke klaster. Kamu dapat menampilkan daftar _token_,
membuat, dan menghapus _token_ dengan perintah `kubeadm token`. Lihat
[panduan referensi kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Menginstal _add-on_ jaringan Pod {#jaringan-pod}

{{< caution >}}
Bagian ini berisi informasi penting mengenai penyetelan jejaring dan
urutan _deployment_.
Baca seluruh saran ini dengan saksama sebelum melanjutkan.

**Kamu harus men-_deploy_
_add-on_ jaringan Pod berbasis {{< glossary_tooltip text="_Container Network Interface_" term_id="cni" >}}
(CNI) sehingga Pod dapat berkomunikasi satu sama lain.  
DNS klaster (CoreDNS) tidak akan menyala sebelum jaringan dipasangkan.**

- Perlu diperhatikan bahwa jaringan Pod tidak boleh tumpang tindih dengan jaringan hos
  manapun: kamu akan menemui beberapa masalah jika terjadi tumpang tindih.  
  (Jika kamu menemukan adanya bentrokan antara jaringan Pod
  pilihan _plugin_ jaringan dengan jaringan hos, kamu harus memikirkan blok
  CIDR yang cocok untuk digunakan, kemudian menggunakannya pada saat `kubeadm init` dengan
  `--pod-network-cidr`, atau sebagai penggantinya pada YAML _plugin_ jaringan kamu).

- Secara bawaan, `kubeadm` mengatur klastermu untuk menggunakan dan melaksanakan penggunaan
  [RBAC](/id/docs/reference/access-authn-authz/rbac/) (_role based access control_).  
  Pastikan _plugin_ jaringan Pod mendukung RBAC, dan begitu juga seluruh manifes
  yang kamu gunakan untuk men-_deploy_-nya.

- Jika kamu ingin menggunakan IPv6--baik jaringan _dual-stack_, ataupun jaringan _single-stack_ IPv6
  --untuk klastermu, pastikan _plugin_ jaringan Pod
  mendukung IPv6.  
  Dukungan IPv6 telah ditambahkan pada CNI sejak [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).

{{< /caution >}}

{{< note >}}
Saat ini Calico adalah satu-satunya _plugin_ CNI yang dapat menerima uji e2e (_end-to-end_) oleh proyek kubeadm.
Jika kamu menemukan isu terkait _plugin_ CNI kamu harus membuat tiket pada pelacak isu masing-masing _plugin_,
bukan pada pelacak isu kubeadm maupun kubernetes.
{{< /note >}}

Beberapa proyek eksternal menyediakan jaringan Pod Kubernetes menggunakan CNI, beberapa di antaranya juga
mendukung [Network Policy](/docs/concepts/services-networking/networkpolicies/).

Lihat daftar
[_add-on_ jejaring dan _network policy_](https://kubernetes.io/docs/concepts/cluster-administration/addons/#networking-and-network-policy) yang tersedia.

Kamu dapat menginstal _add-on_ jaringan Pod dengan perintah berikut pada Node
_control-plane_ atau Node yang memiliki kredensial kubeconfig:

```bash
kubectl apply -f <add-on.yaml>
```

Kamu hanya dapat menginstal satu jaringan Pod per klaster.
Di bawah ini kamu dapat menemukan instruksi instalasi untuk beberapa _plugin_ jaringan Pod yang populer:

{{< tabs name="tabs-pod-install" >}}

{{% tab name="Calico" %}}
[Calico](https://docs.projectcalico.org/latest/introduction/) merupakan penyedia jejaring dan _network  policy_. Calico mendukung sekumpulan opsi jejaring yang fleksibel sehingga kamu dapat memilih opsi yang paling efisien untuk situasimu, termasuk jaringan _non-overlay_ dan _overlay_, dengan atau tanpa BGP. Calico menggunakan mesin yang sama untuk melaksanakan _network policy_ pada hos, Pod, dan (jika menggunakan Istio & Envoy) aplikasi yang berada pada lapisan _service mesh_. Calico bekerja pada beberapa arsitektur, meliputi `amd64`, `arm64`, dan `ppc64le`.

Secara bawaan, Calico menggunakan `192.168.0.0/16` sebagai CIDR jaringan Pod, namun hal ini dapat diatur pada berkas calico.yaml. Agar Calico dapat bekerja dengan benar, kamu perlu memberikan CIDR yang sama pada perintah `kubeadm init` menggunakan opsi `--pod-network-cidr=192.168.0.0/16` atau melalui konfigurasi kubeadm.

```shell
kubectl apply -f https://docs.projectcalico.org/v3.11/manifests/calico.yaml
```

{{% /tab %}}

{{% tab name="Cilium" %}}
Agar Cilium dapat bekerja dengan benar, kamu harus memberikan `--pod-network-cidr=10.217.0.0/16` pada `kubeadm init`.

Untuk men-_deploy_ Cilium kamu hanya perlu menjalankan:

```shell
kubectl create -f https://raw.githubusercontent.com/cilium/cilium/v1.6/install/kubernetes/quick-install.yaml
```

Ketika seluruh Pod Cilium sudah bertanda `READY`, kamu dapat mulai menggunakan klaster.

```shell
kubectl get pods -n kube-system --selector=k8s-app=cilium
```
Keluarannya akan tampil seperti berikut:
```
NAME           READY   STATUS    RESTARTS   AGE
cilium-drxkl   1/1     Running   0          18m
```

Cilium dapat digunakan sebagai kube-proxy, lihat [Kubernetes tanpa kube-proxy](https://docs.cilium.io/en/stable/gettingstarted/kubeproxy-free).

Untuk informasi lebih lanjut mengenai penggunaan Cilium dengan Kubernetes, lihat [panduan Instalasi Kubernetes untuk Cilium](https://docs.cilium.io/en/stable/kubernetes/).

{{% /tab %}}

{{% tab name="Contiv-VPP" %}}
[Contiv-VPP](https://contivpp.io/) menggunakan CNF vSwitch berbasis [FD.io VPP](https://fd.io/) yang dapat diprogram,
menawarkan layanan dan jejaring _cloud-native_ yang memiliki banyak fungsi dan berkinerja tinggi.

Contiv-VPP mengimplementasikan Service dan Network Policy Kubernetes pada _user space_ (on VPP).

Silakan merujuk pada panduan pemasangan berikut: [Pemasangan Manual Contiv-VPP](https://github.com/contiv/vpp/blob/master/docs/setup/MANUAL_INSTALL.md)
{{% /tab %}}

{{% tab name="Kube-router" %}}

Kube-router mengandalkan kube-controller-manager untuk mengalokasikan CIDR Pod untuk Node-Node. Maka dari itu, gunakan `kubeadm init` dengan opsi `--pod-network-cidr`.

Kube-router menyediakan jejaring Pod, _network policy_, dan IP Virtual Server(IPVS)/Linux Virtual Server(LVS) berbasis _service proxy_ yang memiliki kinerja tinggi.

Informasi mengenai penggunaan `kubeadm` untuk mendirikan klaster Kubernetes dengan Kube-router, dapat dilihat di [panduan pemasangan resminya](https://github.com/cloudnativelabs/kube-router/blob/master/docs/kubeadm.md).
{{% /tab %}}

{{% tab name="Weave Net" %}}

Untuk informasi lebih lanjut mengenai pemasangan klaster Kubernetes menggunakan Weave Net, silakan lihat [Mengintegrasikan Kubernetes melalui Addon](https://www.weave.works/docs/net/latest/kube-addon/).

Weave Net bekerja pada platform `amd64`, `arm`, `arm64` dan `ppc64le` tanpa membutuhkan tindakan ekstra.
Weave Net menyalakan mode _hairpin_ secara bawaan. Hal ini mengizinkan Pod untuk mengakses dirinya sendiri melalui alamat IP Service
jika mereka tidak tahu PodIP miliknya.

```shell
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```
{{% /tab %}}

{{< /tabs >}}


Setelah jaringan Pod dipasangkan, kamu dapat mengonfirmasi hal tersebut dengan
memastikan Pod CoreDNS berada pada kondisi `Running` pada keluaran `kubectl get pods --all-namespaces`.
Dan setelah Pod CoreDNS sudah menyala dan berjalan, kamu dapat melanjutkan (pemasangan klaster) dengan menggabungkan Node-Node yang lain.

Jika jaringan belum bekerja atau CoreDNS tidak berada pada kondisi `Running`, periksalah/lihatlah
[panduan penyelesaian masalah](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
untuk `kubeadm`.

### Isolasi Node _control plane_

Secara bawaan, klaster tidak akan menjadwalkan Pod pada Node _control-plane_ untuk alasan
keamanan. Jika kamu ingin Pod dapat dijadwalkan pada Node _control-plane_, sebagai contoh untuk
klaster Kubernetes bermesin-tunggal untuk pengembangan, jalankan:

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

Dengan keluaran seperti berikut:

```
node "test-01" untainted
taint "node-role.kubernetes.io/master:" not found
taint "node-role.kubernetes.io/master:" not found
```

Hal ini akan menghapus _taint_ `node-role.kubernetes.io/master` pada Node manapun yang
memilikinya, termasuk Node _control-plane_, sehingga _scheduler_ akan dapat
menjadwalkan Pod di manapun.

### Menggabungkan Node-Node {#menggabungkan-node}

Node adalah tempat beban kerja (Container, Pod, dan lain-lain) berjalan. Untuk menambahkan Node baru pada klaster lakukan hal berikut pada setiap mesin:

* SSH ke mesin
* Gunakan pengguna _root_ (mis. `sudo su -`)
* Jalankan perintah hasil keluaran `kubeadm init`. Sebagai contoh:

```bash
kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
```

Jika kamu tidak memiliki _token_, kamu bisa mendapatkannya dengan menjalankan perintah berikut pada Node _control-plane_:

```bash
kubeadm token list
```

Keluarannya akan tampil seperti berikut:

```console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```

Secara bawaan, _token_ akan kadaluarsa dalam 24 jam. Jika kamu menggabungkan Node ke klaster setelah _token_ kadaluarsa,
kamu dapat membuat _token_ baru dengan menjalankan perintah berikut pada Node _control-plane_:

```bash
kubeadm token create
```

Keluarannya akan tampil seperti berikut:

```console
5didvk.d09sbcov8ph2amjw
```

Jika kamu tidak memiliki nilai `--discovery-token-ca-cert-hash`, kamu bisa mendapatkannya dengan menjalankan perintah berantai berikut pada Node _control-plane_:

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

Keluaran yang diberikan kurang lebih akan ditampilkan sebagai berikut:

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

{{< note >}}
Untuk menentukan _tuple_ IPv6 untuk `<control-plane-host>:<control-plane-port>`, alamat IPv6 harus be ditutup dengan kurung siku, sebagai contoh: `[fd00::101]:2073`.
{{< /note >}}

Keluaran yang diberikan kurang lebih akan ditampilkan sebagai berikut:

```
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

Beberapa saat kemudian, kamu akan melihat Node tersebut pada keluaran dari `kubectl get nodes` ketika dijalankan pada Node _control-plane_.

### (Opsional) Mengendalikan klaster dari mesin selain Node _control-plane_

Untuk membuat kubectl bekerja pada mesin lain (mis. laptop) agar dapat berbicara dengan
klaster, kamu harus menyalin berkas kubeconfig administrator dari Node _control-plane_
ke mesin seperti berikut:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
Contoh di atas mengasumsikan akses SSH dinyalakan untuk _root_. Jika tidak berlaku
demikian, kamu dapat menyalin berkas `admin.conf` untuk dapat diakses oleh pengguna lain
dan `scp` menggunakan pengguna lain tersebut.

Berkas `admin.conf` memberikan penggunanya privilese (_privilege_) _superuser_ terhadap klaster.
Berkas ini harus digunakan seperlunya. Untuk pengguna biasa, direkomendasikan
untuk membuat kredensial unik dengan privilese _whitelist_. Kamu dapat melakukan
ini dengan perintah `kubeadm kubeconfig user --client-name <CN>`. 
Perintah tersebut akan mencetak berkas KubeConfig ke STDOUT yang harus kamu simpan
ke dalam sebuah berkas dan mendistribusikannya pada para pengguna. Setelah itu, whitelist
privilese menggunakan `kubectl create (cluster)rolebinding`.
{{< /note >}}

### (Opsional) Memproksi API Server ke localhost

Jika kamu ingin terhubung dengan API Server dari luar klaster kamu dapat menggunakan
`kubectl proxy`:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

Kini kamu dapat mengakses API Server secara lokal melalui `http://localhost:8001/api/v1`

## Pembongkaran

Jika kamu menggunakan server sekali pakai untuk membuat klaster, sebagai ujicoba, kamu dapat
mematikannya tanpa perlu melakukan pembongkaran. Kamu dapat menggunakan
`kubectl config delete-cluster` untuk menghapus referensi lokal ke
klaster.

Namun, jika kamu ingin mengatur ulang klaster secara lebih rapih, pertama-tama kamu
harus [menguras (_drain_) Node](/docs/reference/generated/kubectl/kubectl-commands#drain)
dan memastikan Node sudah kosong, kemudian mengembalikan pengaturan pada Node kembali seperti semula.

### Menghapus Node

Berinteraksi dengan Node _control-plane_ menggunakan kredensial yang sesuai, jalankan:

```bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
kubectl delete node <node name>
```

Lalu, pada Node yang dihapus, atur ulang semua kondisi `kubeadm` yang telah dipasang:

```bash
kubeadm reset
```

Proses pengaturan ulang tidak mengatur ulang atau membersihkan kebijakan iptables atau tabel IPVS. Jika kamu ingin mengatur ulang iptables, kamu harus melakukannya secara manual:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

Jika kamu ingin mengatur ulang tabel IPVS, kamu harus menjalankan perintah berikut:

```bash
ipvsadm -C
```

Jika kamu ingin mengulang dari awal, cukup jalankan `kubeadm init` atau `kubeadm join` dengan
argumen yang sesuai.

### Membersihkan _control plane_

Kamu dapat menggunakan `kubeadm reset` pada hos _control plane_ untuk memicu pembersihan
best-effort.

Lihat dokumentasi referensi [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
untuk informasi lebih lanjut mengenai sub-perintah ini dan
opsinya.



<!-- discussion -->

## Selanjutnya

* Pastikan klaster berjalan dengan benar menggunakan [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />Lihat [Memperbaharui klaster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  untuk detail mengenai pembaruan klaster menggunakan `kubeadm`.
* Pelajari penggunaan `kubeadm` lebih lanjut pada [dokumentasi referensi kubeadm](/docs/reference/setup-tools/kubeadm)
* Pelajari lebih lanjut mengenai [konsep-konsep](/docs/concepts/) Kubernetes dan [`kubectl`](/docs/user-guide/kubectl-overview/).
* Lihat halaman [Cluster Networking](/id/docs/concepts/cluster-administration/networking/) untuk daftar
_add-on_ jaringan Pod yang lebih banyak.
* <a id="other-addons" />Lihat [daftar _add-on_](/id/docs/concepts/cluster-administration/addons/) untuk
  mengeksplor _add-on_ lainnya, termasuk perkakas untuk _logging_, _monitoring_, _network policy_, visualisasi &amp;
  pengendalian klaster Kubernetes.
* Atur bagaimana klaster mengelola log untuk peristiwa-peristiwa klaster dan dari
  aplikasi-aplikasi yang berjalan pada Pod.
  Lihat [Arsitektur Logging](/id/docs/concepts/cluster-administration/logging/) untuk
  gambaran umum tentang hal-hal yang terlibat.

### Umpan balik

* Untuk masalah kekutu (_bug_), kunjungi [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* Untuk dukungan, kunjungi kanal Slack
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* Kanal Slack umum pengembangan SIG Cluster Lifecycle:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* Milis SIG Cluster Lifecycle:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)

## Kebijakan _version skew_

`kubeadm` versi v{{< skew latestVersion >}} dapat men-_deploy_ klaster dengan _control plane_ versi v{{< skew latestVersion >}} atau v{{< skew prevMinorVersion >}}.
`kubeadm` v{{< skew latestVersion >}} juga dapat memperbarui klaster yang dibuat dengan kubeadm v{{< skew prevMinorVersion >}}.

Karena kita tidak dapat memprediksi masa depan, CLI kubeadm v{{< skew latestVersion >}} mungkin atau tidak mungkin dapat men-_deploy_ klaster v{{< skew nextMinorVersion >}}.

Sumber daya ini menyediakan informasi lebih lanjut mengenai _version skew_ yang didukung antara kubelet dan _control plane_, serta komponen Kubernetes lainnya:

* [Kebijakan versi and version-skew Kubernetes](/docs/setup/release/version-skew-policy/)
* [Panduan instalasi](/id/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl) spesifik untuk kubeadm

## Keterbatasan

### Ketahanan klaster

Klaster yang dibuat pada panduan ini hanya memiliki Node _control-plane_ tunggal, dengan basis data etcd tunggal
yang berjalan di atasnya. Hal ini berarti jika terjadi kegagalan pada Node _control-plane_, klaster dapat kehilangan
data dan mungkin harus dibuat kembali dari awal.

Solusi:

* Lakukan [back up etcd](https://etcd.io/docs/v3.5/op-guide/recovery/) secara reguler. Direktori data
  etcd yang dikonfigurasi oleh kubeadm berada di `/var/lib/etcd` pada Node _control-plane_.

* Gunakan banyak Node _control-plane_. Kamu dapat membaca
  [Opsi untuk topologi dengan ketersediaan tinggi](/docs/setup/production-environment/tools/kubeadm/ha-topology/) untuk memilih topologi
  klaster yang menyediakan ketersediaan lebih tinggi.

### Kompatibilitas platform

_Package_ dbm/rpm dan _binary_ kubeadm dibuat untuk amd64, arm (32-bit), arm64, ppc64le, dan s390x
mengikuti [proposal multi-platform](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).

_Image_ kontainer _multiplatform_ untuk _control plane_ dan _addon_ juga telah didukung sejak v1.12.

Hanya beberapa penyedia jaringan yang menawarkan solusi untuk seluruh platform. Silakan merujuk pada daftar
penyedia jaringan di atas atau dokumentasi dari masing-masing penyedia untuk mencari tahu apakah penyedia tersebut
mendukung platform pilihanmu.

## Penyelesaian masalah

Jika kamu menemui kesulitan dengan kubeadm, silakan merujuk pada [dokumen penyelesaian masalah](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
