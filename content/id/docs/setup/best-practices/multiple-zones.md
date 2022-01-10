---
title: Menjalankan klaster dalam beberapa zona
weight: 10
content_type: concept
---

<!-- overview -->

Laman ini menjelaskan tentang bagaimana menjalankan sebuah klaster dalam beberapa zona.



<!-- body -->

## Pendahuluan

Kubernetes 1.2 menambahkan dukungan untuk menjalankan sebuah klaster dalam beberapa zona kegagalan (_multiple failure zones_)
(GCE secara sederhana menyebutnya sebagai _"zones"_, AWS menyebutnya sebagai _"availability zones"_, dan di sini kita akan menyebutnya sebagai "zona").
Fitur ini adalah versi sederhana dari fitur federasi klaster yang lebih luas (yang sebelumnya ditujukan pada
sebuah nama panggilan yang ramah (_affectionate nickname_) ["Ubernetes"](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/multicluster/federation.md)).
Federasi klaster yang penuh memungkinkan untuk menggabungkan
klaster Kubernetes terpisah, yang berjalan pada wilayah atau penyedia cloud yang berbeda
(baik dalam _datacenter_ atau _on-premise_). Namun banyak
pengguna yang ingin menjalankan klaster Kubernetes dengan tingkat ketersediaan yang lebih, dalam beberapa zona
dari satu penyedia cloud mereka, dan dukungan inilah yang akhirnya memperbolehkan fitur multi-zona dalam versi Kubernetes 1.2
(sebelumnya fitur ini dikenal dengan nama panggilan "Ubernetes Lite").

Dukungan multi-zona sengaja dibuat terbatas: dimana satu klaster Kubernetes hanya dapat berjalan
dalam beberapa zona, tetapi hanya pada wilayah yang sama (dan penyedia cloud yang sama pula). Hanya
GCE dan AWS yang saat ini mendukung fitur ini secara otomatis (meskipun cukup mudah
untuk menambahkan dukungan serupa untuk penyedia cloud yang lain atau bahkan untuk perangkat _baremetal_, hanya dengan mengatur
label yang sesuai untuk ditambahkan ke Node dan volume).


## Fungsionalitas

Ketika Node mulai dijalankan, kubelet secara otomatis menambahkan label
informasi pada Node tersebut.

Kubernetes akan menyebarkan Pod secara otomatis dalam sebuah _controller_ replikasi
atau Service lintas Node dalam sebuah klaster zona tunggal (untuk mengurangi dampak
kegagalan). Dengan klaster multi-zona, perilaku penyebaran ini akan
dilanjutkan hingga melintasi zona (untuk mengurangi dampak kegagalan dalam satu zona.) (Ini
dicapai melalui opsi `SelectorSpreadPriority`). Hal tersebut adalah untuk upaya penempatan terbaik, 
apabila zona pada klaster kamu bersifat heterogen
(mis. jumlah Node yang berbeda, tipe Node yang berbeda, atau
persyaratan sumber daya Pod yag berbeda), yang akan mencegah dengan sempurna
penyebaran Pod kamu untuk melintasi zona yang berbeda. Jika diinginkan, kamu bisa menggunakan
zona yang homogen (jumlah dan jenis Node yang sama) untuk mengurangi
probabilitas penyebaran yang tidak merata.

Pada saat volume persisten dibuat, _controller_ penerima `PersistentVolumeLabel`
akan secara otomatis menambahkan label zona pada volume tersebut. Penjadwal (melalui
predikat `VolumeZonePredicate`) kemudian akan memastikan bahwa Pod yang mengklaim 
suatu volume hanya akan ditempatkan pada zona yang sama dengan volume tersebut, karena volume
tidak dapat di-_attach_ melintasi zona yang berbeda.

## Batasan

Ada beberapa batasan penting dari dukungan multi-zona:

* Kami berasumsi bahwa zona yang berbeda terletak secara berdekatan satu sama lain dalam
jaringan, jadi kami tidak melakukan _routing_ yang sadar akan zona. Secara khusus, lalu lintas (_traffic_)
yang berjalan melalui Service mungkin melintasi beberapa zona (bahkan ketika beberapa Pod yang mendukung Service itu
berada pada zona yang sama dengan klien), dan hal ini dapat menimbulkan latensi dan biaya tambahan.

* Volume _zone-afinity_ hanya akan bekerja dengan PersistentVolume, dan tidak akan
berfungsi apabila kamu secara langsung menentukan volume EBS dalam spesifikasi Pod (misalnya).

* Klaster tidak dapat melebarkan jangkauan cloud atau _region_ (fungsi ini akan membutuhkan
dukungan penuh federasi).

* Meskipun Node kamu berada dalam beberapa zona, saat ini kube-up hanya membuat
satu Node master secara bawaan (_default_). Karena Service memerlukan 
ketersediaan (_availability_) yang tinggi dan dapat mentolerir akan hilangnya sebuah zona, maka _control plane_
diletakkan pada setiap zona. Pengguna yang menginginkan _control plane_ yang memiliki ketersediaan
tinggi harus mengikuti instruksi [ketersediaan tinggi](/docs/admin/high-availability).

### Batasan Volume

Batasan berikut ditunjukkan dengan menggunakan [pengikatan volume yang sadar topologi](/id/docs/concepts/storage/storage-classes/#mode-volume-_binding_).

* Penyebaran zona volume StatefulSet yang menggunakan penyediaan secara dinamis, saat ini tidak sesuai dengan
  kebijakan afinitas atau anti-afinitas Pod.

* Jika nama StatefulSet berisi tanda hubung ("-"), maka penyebaran zona volume
  mungkin saja tidak menyediakan distribusi penyimpanan (_storage_) yang seragam di seluruh zona yang berbeda.

* Ketika menentukan beberapa PVC dalam spesifikasi Deployment atau Pod, StorageClass
  perlu dikonfigurasi untuk zona tunggal tertentu, atau PV perlu 
  disediakan secara statis pada zona tertentu. Solusi lainnya adalah menggunakan sebuah
  StatefulSet, yang akan memastikan bahwa semua volume untuk sebuah replika
  disediakan dalam zona yang sama.

## Panduan

Kita sekarang akan berjalan melalui pengaturan dan menggunakan multi-zona
klaster pada GCE & AWS. Untuk melakukannya, kamu perlu mengaktifkan klaster penuh
(dengan menentukan `MULTIZONE=true`), dan kemudian kamu menambahkan Node di zona tambahan
dengan menjalankan `kube-up` lagi (dengan menetapkan opsi `KUBE_USE_EXISTING_MASTER=true`).

### Mengaktifkan klaster kamu

Buatlah klaster seperti biasa, tetapi teruskan opsi MULTIZONE untuk memberi tahu klaster untuk mengelola beberapa zona;
dan membuat Node di zona us-central1-a.

GCE:

```shell
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a NUM_NODES=3 bash
```

AWS:

```shell
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a NUM_NODES=3 bash
```

Langkah ini akan mengaktifkan klaster seperti biasa, namun masih berjalan dalam satu zona
(tetapi opsi `MULTIZONE=true` telah mengaktifkan kapabilitas multi-zona).

### Node yang telah diberi label

Lihatlah Node; dimana kamu bisa melihat Node tersebut diberi label sesuai dengan informasi zona.
Node tersebut sejauh ini berada di zona `us-central1-a` (GCE) atau zona `us-west-2a` (AWS).
Label dari Node itu adalah `failure-domain.beta.kubernetes.io/region` untuk informasi wilayah,
dan `failure-domain.beta.kubernetes.io/zone` untuk informasi zona:

```shell
kubectl get nodes --show-labels
```

Tampilan akan seperti dibawah ini:

```shell
NAME                     STATUS                     ROLES    AGE   VERSION          LABELS
kubernetes-master        Ready,SchedulingDisabled   <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-87j9   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
```

### Menambah lebih banyak Node di zona kedua 

Mari kita tambahkan sekumpulan Node ke dalam klaster yang ada, dengan menggunakan kembali
master yang ada, namun dijalankan pada zona yang berbeda (zona `us-central1-b` atau zona `us-west-2b`).
Kemudian kita jalankan kube-up lagi, tetapi dengan menentukan opsi `KUBE_USE_EXISTING_MASTER=true`
sehingga kube-up tidak akan membuat master baru, tetapi akan menggunakan kembali master yang dibuat sebelumnya.

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-b NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

Pada AWS, kita juga perlu menentukan CIDR jaringan sebagai tambahan
subnet, bersama dengan alamat IP internal dari master:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2b NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.1.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```

Lihat lagi Node; dimana 3 Node lainnya harus sudah dijalankan dan ditandai
berada di `us-central1-b`:

```shell
kubectl get nodes --show-labels
```

Hasil tampilan akan terlihat seperti dibawah ini:

```shell
NAME                     STATUS                     ROLES    AGE   VERSION           LABELS
kubernetes-master        Ready,SchedulingDisabled   <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-1,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-281d   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-87j9   Ready                      <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      <none>   17m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
kubernetes-minion-pp2f   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-pp2f
kubernetes-minion-wf8i   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-wf8i
```

### Afinitas Volume

Buatlah sebuah volume dengan menggunakan pembuatan volume yang dinamis (hanya PersistentVolume yang didukung untuk afinitas zona):

```bash
kubectl apply -f - <<EOF
{
  "apiVersion": "v1",
  "kind": "PersistentVolumeClaim",
  "metadata": {
    "name": "claim1",
    "annotations": {
        "volume.alpha.kubernetes.io/storage-class": "foo"
    }
  },
  "spec": {
    "accessModes": [
      "ReadWriteOnce"
    ],
    "resources": {
      "requests": {
        "storage": "5Gi"
      }
    }
  }
}
EOF
```

{{< note >}}
Untuk versi Kubernetes 1.3+ akan mendistribusikan klaim PV yang dinamis di seluruh
zona yang telah dikonfigurasi. Untuk versi 1.2, volume persisten yang dinamis selalu dibuat di zona master klaster
(yaitu `us-central1-a`/`us-west-2a`); masalah tersebut diangkat pada
([#23330](https://github.com/kubernetes/kubernetes/issues/23330))
dan telah diselesaikan pada versi 1.3+.
{{< /note >}}

Sekarang marilah kita memvalidasi bahwa Kubernetes secara otomatis memberikan label zona & wilayah di mana PV itu dibuat.

```shell
kubectl get pv --show-labels
```


Hasil tampilan akan terlihat seperti dibawah ini:

```shell
NAME           CAPACITY   ACCESSMODES   RECLAIM POLICY   STATUS    CLAIM            STORAGECLASS    REASON    AGE       LABELS
pv-gce-mj4gm   5Gi        RWO           Retain           Bound     default/claim1   manual                    46s       failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a
```

Kemudian sekarang kita akan membuat Pod yang menggunakan klaim akan volume persisten.
Karena volume pada GCE PDs / AWS EBS tidak dapat di-_attach_ melewati zona yang berbeda,
hal ini berarti bahwa Pod ini hanya dapat dibuat pada zona yang sama dengan volume tersebut:


```yaml
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: claim1
EOF
```

Perhatikan bahwa Pod secara otomatis dibuat pada zona yang sama dengan volume, karena
pada umumnya lampiran lintas zona tidak diizinkan oleh penyedia cloud:

```shell
kubectl describe pod mypod | grep Node
```

```shell
Node:        kubernetes-minion-9vlv/10.240.0.5
```

Kemudian cek label Node:

```shell
kubectl get node kubernetes-minion-9vlv --show-labels
```

```shell
NAME                     STATUS    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     22m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
```

### Pod yang tersebar melintasi zona yang berbeda

Pod dalam _controller_ atau Service replikasi tersebar secara otomatis
melintasi zona yang berbeda. Pertama-tama, mari kita luncurkan lebih banyak Node di zona ketiga:

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-f NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

AWS:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2c NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.2.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```

Pastikan bahwa kamu mempunyai Node dalam 3 zona berbeda:

```shell
kubectl get nodes --show-labels
```

Buatlah contoh dengan program guestbook-go, yang mencakup RC dengan ukuran 3, dan menjalankan sebuah aplikasi web sederhana:

```shell
find kubernetes/examples/guestbook-go/ -name '*.json' | xargs -I {} kubectl apply -f {}
```

Beberapa Pod seharusnya tersebar di ketiga zona semuanya:

```shell
kubectl describe pod -l app=guestbook | grep Node
```

```shell
Node:        kubernetes-minion-9vlv/10.240.0.5
Node:        kubernetes-minion-281d/10.240.0.8
Node:        kubernetes-minion-olsh/10.240.0.11
```

```shell
kubectl get node kubernetes-minion-9vlv kubernetes-minion-281d kubernetes-minion-olsh --show-labels
```

```shell
NAME                     STATUS    ROLES    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     <none>   34m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-281d   Ready     <none>   20m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-olsh   Ready     <none>   3m     v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,failure-domain.beta.kubernetes.io/region=us-central1,failure-domain.beta.kubernetes.io/zone=us-central1-f,kubernetes.io/hostname=kubernetes-minion-olsh
```

_Load-balancer_ menjangkau semua zona dalam satu klaster; program contoh guestbook-go
sudah termasuk contoh Service dengan beban seimbang (_load-balanced service_):

```shell
kubectl describe service guestbook | grep LoadBalancer.Ingress
```

Hasil tampilan akan terlihat seperti di bawah ini:

```shell
LoadBalancer Ingress:   130.211.126.21
```

Atur alamat IP di atas:

```shell
export IP=130.211.126.21
```

Telusurilah dengan curl melalui alamat IP tersebut:

```shell
curl -s http://${IP}:3000/env | grep HOSTNAME
```

Hasil tampilan akan terlihat seperti di bawah ini:

```shell
  "HOSTNAME": "guestbook-44sep",
```

Kemudian, telusurilah beberapa kali:

```shell
(for i in `seq 20`; do curl -s http://${IP}:3000/env | grep HOSTNAME; done)  | sort | uniq
```

Hasil tampilan akan terlihat seperti dibawah ini:

```shell
  "HOSTNAME": "guestbook-44sep",
  "HOSTNAME": "guestbook-hum5n",
  "HOSTNAME": "guestbook-ppm40",
```

_Load balancer_ telah menargetkan ke semua Pod dengan benar, meskipun semuanya berada di beberapa zona yang berbeda.

### Menghentikan Klaster
### Shutting down the cluster

Apabila kamu sudah selesai, maka bersihkanlah:

GCE:

```shell
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true KUBE_GCE_ZONE=us-central1-f kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true KUBE_GCE_ZONE=us-central1-b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a kubernetes/cluster/kube-down.sh
```

AWS:

```shell
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2c kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a kubernetes/cluster/kube-down.sh
```


