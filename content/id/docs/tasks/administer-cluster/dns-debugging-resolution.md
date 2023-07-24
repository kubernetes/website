---
reviewers:
title:  Debugging Resolusi DNS
content_type: task
min-kubernetes-server-version: v1.6
---

<!-- overview -->
Laman ini menyediakan beberapa petunjuk untuk mendiagnosis masalah DNS.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}  
Klaster kamu harus dikonfigurasi untuk menggunakan 
{{< glossary_tooltip text="addon" term_id="addons" >}} CoreDNS atau pendahulunya,
kube-dns.  

{{% version-check %}}

<!-- steps -->

### Membuat Pod sederhana yang digunakan sebagai lingkungan pengujian

{{% codenew file="admin/dns/dnsutils.yaml" %}}

Gunakan manifes berikut untuk membuat sebuah Pod:

```shell
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```
```
pod/dnsutils created
```
…dan verifikasi statusnya:
```shell
kubectl get pods dnsutils
```
```
NAME      READY     STATUS    RESTARTS   AGE
dnsutils   1/1       Running   0          <some-time>
```

Setelah Pod tersebut berjalan, kamu dapat menjalankan perintah `nslookup` di lingkungan tersebut.
Jika kamu melihat hal seperti ini, maka DNS sudah berjalan dengan benar.

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

Jika perintah `nslookup` gagal, periksa hal berikut:

### Periksa konfigurasi DNS lokal terlebih dahulu

Periksa isi dari berkas resolv.conf.
(Lihat [_Inheriting_ DNS dari node](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node) dan
[Isu-isu yang dikenal](#known-issues) di bawah ini untuk informasi lebih lanjut)

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

Verifikasi _path_ pencarian dan nama server telah dibuat agar tampil seperti di bawah ini (perlu diperhatikan bahwa _path_ pencarian dapat berbeda tergantung dari penyedia layanan cloud):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

Kesalahan yang muncul berikut ini mengindikasikan terdapat masalah dengan _add-on_ CoreDNS (atau kube-dns) atau Service terkait:

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

atau

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

### Periksa apakah Pod DNS sedang berjalan

Gunakan perintah `kubectl get pods` untuk memverifikasi apakah Pod DNS sedang berjalan.

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```
```
NAME                       READY     STATUS    RESTARTS   AGE
...
coredns-7b96bf9f76-5hsxb   1/1       Running   0           1h
coredns-7b96bf9f76-mvmmt   1/1       Running   0           1h
...
```

{{< note >}}
Nilai dari label `k8s-app` adalah `kube-dns` baik untuk CoreDNS maupun kube-dns.
{{< /note >}}

Jika kamu melihat tidak ada Pod CoreDNS yang sedang berjalan atau Pod tersebut gagal/telah selesai, _add-on_ DNS mungkin tidak dijalankan (_deployed_) secara bawaan di lingkunganmu saat ini dan kamu harus menjalankannya secara manual.

### Periksa kesalahan pada Pod DNS

Gunakan perintah `kubectl logs` untuk melihat log dari Container DNS.

Untuk CoreDNS:
```shell
kubectl logs --namespace=kube-system -l k8s-app=kube-dns
```

Berikut contoh log dari CoreDNS yang sehat (_healthy_):

```
.:53
2018/08/15 14:37:17 [INFO] CoreDNS-1.2.2
2018/08/15 14:37:17 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.2
linux/amd64, go1.10.3, 2e322f6
2018/08/15 14:37:17 [INFO] plugin/reload: Running configuration MD5 = 24e6c59e83ce706f07bcc82c31b1ea1c
```

Periksa jika ada pesan mencurigakan atau tidak terduga dalam log.

### Apakah layanan DNS berjalan?

Verifikasi apakah layanan DNS berjalan dengan menggunakan perintah `kubectl get service`.

```shell
kubectl get svc --namespace=kube-system
```
```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns     ClusterIP   10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

{{< note >}}
Nama layanan adalah `kube-dns` baik untuk CoreDNS maupun kube-dns.
{{< /note >}}

Jika kamu telah membuat Service atau seharusnya Service telah dibuat secara bawaan namun ternyata tidak muncul, lihat
[_debugging_ Service](/docs/tasks/debug/debug-application/debug-service/) untuk informasi lebih lanjut.

### Apakah endpoint DNS telah ekspos?

Kamu dapat memverifikasikan apakah _endpoint_ DNS telah diekspos dengan menggunakan perintah `kubectl get endpoints`.

```shell
kubectl get endpoints kube-dns --namespace=kube-system
```
```
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

Jika kamu tidak melihat _endpoint_, lihat bagian _endpoint_ pada dokumentasi
[_debugging_ Service](/docs/tasks/debug/debug-application/debug-service/).

Untuk tambahan contoh Kubernetes DNS, lihat
[contoh cluster-dns](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns) pada repositori Kubernetes GitHub.

### Apakah kueri DNS diterima/diproses?

Kamu dapat memverifikasi apakah kueri telah diterima oleh CoreDNS dengan menambahkan plugin `log` pada konfigurasi CoreDNS (alias Corefile).
CoreDNS Corefile disimpan pada {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} dengan nama `coredns`. Untuk mengeditnya, gunakan perintah:

```
kubectl -n kube-system edit configmap coredns
```

Lalu tambahkan `log` pada bagian Corefile seperti contoh berikut:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        log
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
          pods insecure
          upstream
          fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        proxy . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

Setelah perubahan disimpan, perubahan dapat memakan waktu satu hingga dua menit untuk Kubernetes menyebarkan perubahan ini pada Pod CoreDNS.

Berikutnya, coba buat beberapa kueri dan lihat log pada bagian atas dari dokumen ini. Jika pod CoreDNS menerima kueri, kamu seharusnya akan melihatnya pada log.

Berikut ini contoh kueri yang terdapat di dalam log:

```
.:53
2018/08/15 14:37:15 [INFO] CoreDNS-1.2.0
2018/08/15 14:37:15 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.0
linux/amd64, go1.10.3, 2e322f6
2018/09/07 15:29:04 [INFO] plugin/reload: Running configuration MD5 = 162475cdf272d8aa601e6fe67a6ad42f
2018/09/07 15:29:04 [INFO] Reloading complete
172.17.0.18:41675 - [07/Sep/2018:15:29:11 +0000] 59925 "A IN kubernetes.default.svc.cluster.local. udp 54 false 512" NOERROR qr,aa,rd,ra 106 0.000066649s
```

## Isu-isu yang Dikenal

Beberapa distribusi Linux (contoh Ubuntu) menggunakan _resolver_ DNS lokal secara bawaan (systemd-resolved).
Systemd-resolved memindahkan dan mengganti `/etc/resolv.conf` dengan berkas _stub_ yang dapat menyebabkan _forwarding loop_ yang fatal saat meresolusi nama pada server _upstream_. Ini dapat diatasi secara manual dengan menggunakan _flag_ kubelet `--resolv-conf`
untuk mengarahkan ke `resolv.conf`  yang benar (Pada `systemd-resolved`, ini berada di `/run/systemd/resolve/resolv.conf`).
kubeadm akan otomatis mendeteksi `systemd-resolved`, dan menyesuaikan _flag_ kubelet sebagai mana mestinya.

Pemasangan Kubernetes tidak menggunakan berkas `resolv.conf` pada _node_ untuk digunakan sebagai klaster DNS secara _default_, karena proses ini umumnya spesifik pada distribusi tertentu. Hal ini bisa jadi akan diimplementasi nantinya.

Libc Linux (alias glibc) secara bawaan memiliki batasan `nameserver` DNS sebanyak 3 rekaman (_records_). Selain itu, pada glibc versi yang lebih lama dari glibc-2.17-222 ([versi terbaru lihat isu ini](https://access.redhat.com/solutions/58028)), jumlah rekaman DNS `search` dibatasi sejumlah 6 ([lihat masalah sejak 2005 ini](https://bugzilla.redhat.com/show_bug.cgi?id=168253)). Kubernetes membutuhkan 1 rekaman `nameserver` dan 3 rekaman `search`. Ini berarti jika instalasi lokal telah menggunakan 3 `nameserver` atau menggunakan lebih dari 3 `search`,sementara versi glibc kamu termasuk yang terkena dampak, beberapa dari pengaturan tersebut akan hilang. Untuk menyiasati batasan rekaman DNS `nameserver`, _node_ dapat menjalankan `dnsmasq`,yang akan menyediakan `nameserver` lebih banyak. Kamu juga dapat menggunakan kubelet `--resolv-conf` _flag_. Untuk menyiasati batasan rekaman `search`, pertimbangkan untuk memperbarui distribusi linux kamu atau memperbarui glibc ke versi yang tidak terdampak.

Jika kamu menggunakan Alpine versi 3.3 atau lebih lama sebagai dasar _image_ kamu, DNS mungkin tidak dapat bekerja dengan benar disebabkan masalah dengan Alpine.
[Masalah 30215](https://github.com/kubernetes/kubernetes/issues/30215) Kubernetes menyediakan informasi lebih detil tentang ini.

## {{% heading "whatsnext" %}}

- Lihat [Penyekalaan otomatis Service DNS dalam klaster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- Baca [DNS untuk Service dan Pod](/docs/concepts/services-networking/dns-pod-service/)