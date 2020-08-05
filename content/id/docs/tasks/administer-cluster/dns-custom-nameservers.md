---
title: Kustomisasi Service DNS
content_type: task
min-kubernetes-server-version: v1.12
---

<!-- overview -->
Laman ini menjelaskan cara mengonfigurasi DNS
{{< glossary_tooltip text="Pod" term_id="pod" >}} kamu dan menyesuaikan
proses resolusi DNS pada klaster kamu.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Klaster kamu harus menjalankan tambahan (_add-on_) CoreDNS terlebih dahulu.
[Migrasi ke CoreDNS](/docs/tasks/administer-cluster/coredns/#migrasi-ke-coredns)
menjelaskan tentang bagaimana menggunakan `kubeadm` untuk melakukan migrasi dari `kube-dns`.

{{% version-check %}}

<!-- steps -->

## Pengenalan

DNS adalah Service bawaan dalam Kubernetes yang diluncurkan secara otomatis
melalui _addon manager_
[add-on klaster](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/README.md).

Sejak Kubernetes v1.12, CoreDNS adalah server DNS yang direkomendasikan untuk menggantikan kube-dns. Jika klaster kamu
sebelumnya menggunakan kube-dns, maka kamu mungkin masih menggunakan `kube-dns` daripada CoreDNS.

{{< note >}}
Baik Service CoreDNS dan kube-dns diberi nama `kube-dns` pada _field_ `metadata.name`.
Hal ini agar ada interoperabilitas yang lebih besar dengan beban kerja yang bergantung pada nama Service `kube-dns` lama untuk me-_resolve_ alamat internal ke dalam klaster. Dengan menggunakan sebuah Service yang bernama `kube-dns` mengabstraksi detail implementasi yang dijalankan oleh penyedia DNS di belakang nama umum tersebut.
{{< /note >}}

Jika kamu menjalankan CoreDNS sebagai sebuah Deployment, maka biasanya akan ditampilkan sebagai sebuah Service Kubernetes dengan alamat IP yang statis.
Kubelet meneruskan informasi DNS _resolver_ ke setiap Container dengan argumen `--cluster-dns=<dns-service-ip>`.

Nama DNS juga membutuhkan domain. Kamu dapat mengonfigurasi domain lokal di kubelet
dengan argumen `--cluster-domain=<default-local-domain>`.

Server DNS mendukung _forward lookup_ (_record_ A dan AAAA), _port lookup_ (_record_ SRV), _reverse lookup_ alamat IP (_record_ PTR),
dan lain sebagainya. Untuk informasi lebih lanjut, lihatlah [DNS untuk Service dan Pod](/id/docs/concepts/services-networking/dns-pod-service/).

Jika `dnsPolicy` dari Pod diatur menjadi `default`, itu berarti mewarisi konfigurasi resolusi nama
dari Node yang dijalankan Pod. Resolusi DNS pada Pod
harus berperilaku sama dengan Node tersebut.
Tapi lihat [Isu-isu yang telah diketahui](/docs/tasks/debug-application-cluster/dns-debugging-resolution/#known-issues).

Jika kamu tidak menginginkan hal ini, atau jika kamu menginginkan konfigurasi DNS untuk Pod berbeda, kamu bisa
menggunakan argumen `--resolv-conf` pada kubelet. Atur argumen ini menjadi "" untuk mencegah Pod tidak
mewarisi konfigurasi DNS. Atur ke jalur (_path_) berkas yang tepat untuk berkas yang berbeda dengan
`/etc/resolv.conf` untuk menghindari mewarisi konfigurasi DNS.

## CoreDNS

CoreDNS adalah server DNS otoritatif untuk kegunaan secara umum yang dapat berfungsi sebagai Service DNS untuk klaster, yang sesuai dengan [spesifikasi dns](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

### Opsi ConfigMap pada CoreDNS 

CoreDNS adalah server DNS yang modular dan mudah dipasang, dan setiap _plugin_ dapat menambahkan fungsionalitas baru ke CoreDNS.
Fitur ini dapat dikonfigurasikan dengan menjaga berkas [Corefile](https://coredns.io/2017/07/23/corefile-explained/), yang merupakan
berkas konfigurasi dari CoreDNS. Sebagai administrator klaster, kamu dapat memodifikasi
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} untuk Corefile dari CoreDNS dengan mengubah cara perilaku pencarian Service DNS
pada klaster tersebut.

Di Kubernetes, CoreDNS diinstal dengan menggunakan konfigurasi Corefile bawaan sebagai berikut:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
            lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

Konfigurasi Corefile meliputi [_plugin_](https://coredns.io/plugins/) berikut ini dari CoreDNS:

* [errors](https://coredns.io/plugins/errors/): Kesalahan yang ditampilkan ke output standar (_stdout_)
* [health](https://coredns.io/plugins/health/): Kesehatan dari CoreDNS dilaporkan pada `http://localhost:8080/health`. Dalam sintaks yang diperluas `lameduck` akan menangani proses tidak sehat agar menunggu selama 5 detik sebelum proses tersebut dimatikan.
* [ready](https://coredns.io/plugins/ready/): _Endpoint_ HTTP pada port 8181 akan mengembalikan OK 200, ketika semua _plugin_ yang dapat memberi sinyal kesiapan, telah memberikan sinyalnya.
* [kubernetes](https://coredns.io/plugins/kubernetes/): CoreDNS akan menjawab pertanyaan (_query_) DNS berdasarkan IP Service dan Pod pada Kubernetes. Kamu dapat menemukan [lebih detail](https://coredns.io/plugins/kubernetes/) tentang _plugin_ itu dalam situs web CoreDNS. `ttl` memungkinkan kamu untuk mengatur TTL khusus untuk respon dari pertanyaan DNS. Standarnya adalah 5 detik. TTL minimum yang diizinkan adalah 0 detik, dan maksimum hanya dibatasi sampai 3600 detik. Mengatur TTL ke 0 akan mencegah _record_ untuk di simpan sementara dalam _cache_.  
  Opsi `pods insecure` disediakan untuk kompatibilitas dengan Service _kube-dns_ sebelumnya. Kamu dapat menggunakan opsi `pods verified`, yang mengembalikan _record_ A hanya jika ada Pod pada Namespace yang sama untuk alamat IP yang sesuai. Opsi `pods disabled` dapat digunakan jika kamu tidak menggunakan _record_ Pod.
* [prometheus](https://coredns.io/plugins/metrics/): Metrik dari CoreDNS tersedia pada `http://localhost:9153/metrics` dalam format yang sesuai dengan [Prometheus](https://prometheus.io/) (dikenal juga sebagai OpenMetrics).
* [forward](https://coredns.io/plugins/forward/): Setiap pertanyaan yang tidak berada dalam domain klaster Kubernetes akan diteruskan ke _resolver_ yang telah ditentukan dalam berkas (/etc/resolv.conf).
* [cache](https://coredns.io/plugins/cache/): Ini untuk mengaktifkan _frontend cache_.
* [loop](https://coredns.io/plugins/loop/): Mendeteksi _forwarding loop_ sederhana dan menghentikan proses CoreDNS jika _loop_ ditemukan.
* [reload](https://coredns.io/plugins/reload): Mengizinkan _reload_ otomatis Corefile yang telah diubah. Setelah kamu mengubah konfigurasi ConfigMap, beri waktu sekitar dua menit agar perubahan yang kamu lakukan berlaku.
* [loadbalance](https://coredns.io/plugins/loadbalance): Ini adalah _load balancer_ DNS secara _round-robin_ yang mengacak urutan _record_ A, AAAA, dan MX dalam setiap responnya.

Kamu dapat memodifikasi perilaku CoreDNS bawaan dengan memodifikasi ConfigMap.

### Konfigurasi _Stub-domain_ dan _Nameserver Upstream_ dengan menggunakan CoreDNS

CoreDNS memiliki kemampuan untuk mengonfigurasi _stubdomain_ dan _nameserver upstream_ dengan menggunakan [_plugin_ forward](https://coredns.io/plugins/forward/).

#### Contoh

Jika operator klaster memiliki sebuah server domain [Consul](https://www.consul.io/) yang terletak di 10.150.0.1, dan semua nama Consul memiliki akhiran .consul.local. Untuk mengonfigurasinya di CoreDNS, administrator klaster membuat bait (_stanza_) berikut dalam ConfigMap CoreDNS.

```
consul.local:53 {
        errors
        cache 30
        forward . 10.150.0.1
    }
```

Untuk memaksa secara eksplisit semua pencarian DNS _non-cluster_ melalui _nameserver_ khusus pada 172.16.0.1, arahkan `forward` ke _nameserver_ bukan ke `/etc/resolv.conf`

```
forward .  172.16.0.1
```

ConfigMap terakhir bersama dengan konfigurasi `Corefile` bawaan terlihat seperti berikut:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . 172.16.0.1
        cache 30
        loop
        reload
        loadbalance
    }
    consul.local:53 {
        errors
        cache 30
        forward . 10.150.0.1
    }
```

Perangkat `kubeadm` mendukung terjemahan otomatis dari ConfigMap kube-dns
ke ConfigMap CoreDNS yang setara.

{{< note >}}
Sementara ini kube-dns dapat menerima FQDN untuk _stubdomain_ dan _nameserver_ (mis: ns.foo.com), namun CoreDNS belum mendukung fitur ini.
Selama penerjemahan, semua _nameserver_ FQDN akan dihilangkan dari konfigurasi CoreDNS.
{{< /note >}}

## Konfigurasi CoreDNS yang setara dengan kube-dns

CoreDNS mendukung fitur kube-dns dan banyak lagi lainnya.
ConfigMap dibuat agar kube-dns mendukung `StubDomains` dan `upstreamNameservers` untuk diterjemahkan ke _plugin_ `forward` dalam CoreDNS.
Begitu pula dengan _plugin_ `Federations` dalam kube-dns melakukan translasi untuk _plugin_ `federation` dalam CoreDNS.

### Contoh

Contoh ConfigMap ini untuk kube-dns menentukan federasi, _stub domain_ dan server _upstream nameserver_:

```yaml
apiVersion: v1
data:
  federations: |
    {"foo" : "foo.feddomain.com"}
  stubDomains: |
    {"abc.com" : ["1.2.3.4"], "my.cluster.local" : ["2.3.4.5"]}
  upstreamNameservers: |
    ["8.8.8.8", "8.8.4.4"]
kind: ConfigMap
```

Untuk konfigurasi yang setara dengan CoreDNS buat Corefile berikut:

* Untuk federasi:
```
federation cluster.local {
    foo foo.feddomain.com
}
```

* Untuk stubDomain:
```yaml
abc.com:53 {
    errors
    cache 30
    forward . 1.2.3.4
}
my.cluster.local:53 {
    errors
    cache 30
    forward . 2.3.4.5
}
```

Corefile lengkap dengan _plugin_ bawaan:

```
.:53 {
    errors
    health
    kubernetes cluster.local in-addr.arpa ip6.arpa {
        pods insecure
        fallthrough in-addr.arpa ip6.arpa
    }
    federation cluster.local {
        foo foo.feddomain.com
    }
    prometheus :9153
    forward . 8.8.8.8 8.8.4.4
    cache 30
}
abc.com:53 {
    errors
    cache 30
    forward . 1.2.3.4
}
my.cluster.local:53 {
    errors
    cache 30
    forward . 2.3.4.5
}
```

## Migrasi ke CoreDNS

Untuk bermigrasi dari kube-dns ke CoreDNS, 
[artikel blog](https://coredns.io/2018/05/21/migration-from-kube-dns-to-coredns/) yang detail
tersedia untuk membantu pengguna mengadaptasi CoreDNS sebagai pengganti dari kube-dns.

Kamu juga dapat bermigrasi dengan menggunakan
[skrip _deploy_](https://github.com/coredns/deployment/blob/master/kubernetes/deploy.sh) CoreDNS yang resmi.


## {{% heading "whatsnext" %}}

- Baca [_Debugging_ Resolusi DNS](/docs/tasks/administer-cluster/dns-debugging-resolution/)
