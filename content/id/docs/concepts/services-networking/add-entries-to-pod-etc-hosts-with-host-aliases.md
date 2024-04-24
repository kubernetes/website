---
title: Menambahkan Entry pada /etc/hosts Pod dengan HostAliases
content_type: concept
weight: 60
---

{{< toc >}}

<!-- overview -->
Menambahkan entri pada berkas /etc/hosts Pod akan melakukan _override_
resolusi _hostname_ pada level Pod ketika DNS dan opsi lainnya tidak tersedia.
Pada versi 1.7, pengguna dapat menambahkan entri yang diinginkan beserta _field_ HostAliases
pada PodSpec.

Modifikasi yang dilakukan tanpa menggunakan HostAliases tidaklah disarankan
karena berkas ini diatur oleh Kubelet dan dapat di-_override_ ketika Pod dibuat/di-_restart_.


<!-- body -->

## Isi Default pada Berkas `Hosts`

Misalnya saja kamu mempunyai sebuah Pod Nginx yang memiliki sebuah IP Pod:

```shell
kubectl run nginx --image nginx --generator=run-pod/v1
```

```shell
pod/nginx created
```

Perhatikan IP Pod tersebut:

```shell
kubectl get pods --output=wide
```

```shell
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

_File_ `hosts` yang ada akan tampak sebagai berikut:

```shell
kubectl exec nginx -- cat /etc/hosts
```

```none
# Berkas hosts yang dikelola Kubernetes
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

Secara default, berkas `hosts` hanya berisikan _boilerplate_ alamat IP IPv4 and IPv6 seperti
`localhost` dan hostname dari Pod itu sendiri.

## Menambahkan Entri Tambahan dengan HostAliases

Selain _boilerplate default_, kita dapat menambahkan entri pada berkas
`hosts` untuk melakukan resolusi `foo.local`, `bar.local` pada `127.0.0.1` dan `foo.remote`,
`bar.remote` pada `10.1.2.3`, kita dapat melakukannya dengan cara menambahkan
HostAliases pada Pod di bawah _field_ `.spec.hostAliases`:

{{% codenew file="service/networking/hostaliases-pod.yaml" %}}

Pod ini kemudian dapat dihidupkan dengan perintah berikut:

```shell
kubectl apply -f hostaliases-pod.yaml
```

```shell
pod/hostaliases-pod created
```

Perhatikan IP dan status Pod tersebut:

```shell
kubectl get pod --output=wide
```

```shell
NAME                           READY     STATUS      RESTARTS   AGE       IP              NODE
hostaliases-pod                0/1       Completed   0          6s        10.200.0.5      worker0
```

_File_ `hosts` yang ada akan tampak sebagai berikut:

```shell
kubectl logs hostaliases-pod
```

```none
# Berkas hosts yang dikelola Kubernetes
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.5	hostaliases-pod

# Entries added by HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

Dengan tambahan entri yang telah dispesifikasikan sebelumnya.

## Kenapa Kubelet Melakukan Mekanisme Manajemen Berkas `Hosts`?

Kubelet [melakukan proses manajemen](https://github.com/kubernetes/kubernetes/issues/14633)
berkas `hosts` untuk setiap container yang ada pada Pod untuk mencegah Docker melakukan
[modifikasi](https://github.com/moby/moby/issues/17190) pada berkas tersebut
setelah kontainer dihidupkan.

Karena sifat dari berkas tersebut yang secara otomatis di-_manage_,
semua hal yang didefinisikan oleh pengguna akan ditimpa (_overwrite_) ketika berkas
`hosts` di-_mount_ kembali oleh Kubelet ketika ada kontainer yang di-_restart_
atau Pod di-_schedule_ ulang. Dengan demikian tidak dianjurkan untuk
memodifikasi berkas tersebut secara langsung.



