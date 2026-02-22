---
title: DNS untuk Service dan Pod
content_type: concept
weight: 20
---
<!-- overview -->
Laman ini menyediakan ikhtisar dari dukungan DNS oleh Kubernetes.


<!-- body -->

## Pendahuluan

Kubernetes DNS melakukan _scheduling_ DNS Pod dan Service yang ada pada klaster, serta 
melakukan konfigurasi kubelet untuk memberikan informasi bagi setiap Container 
untuk menggunakan DNS Service IP untuk melakukan resolusi DNS.

### Apa Sajakah yang Mendapatkan Nama DNS?

Setiap Service yang didefinisikan di dalam klaster (termasuk server DNS itu sendiri) 
memiliki nama DNS. Secara default, sebuah _list_ pencarian DNS pada Pod klien
akan mencantumkan _namespace_ Pod itu sendiri serta domain _default_ klaster. Hal ini dapat diilustrasikan 
dengan contoh berikut:

Asumsikan sebuah Service dengan nama `foo` pada Kubernetes dengan _namespace_ `bar`. 
Sebuah Pod yang dijalankan di _namespace_ `bar` dapat melakukan resolusi 
terhadap Service ini dengan melakukan _query_ DNS 
untuk `foo`.  Sebuah Pod yang dijalankan pada namespace `quux` dapat melakukan 
resolusi Service ini dengan melakukan _query_ DNS untuk `foo.bar`.

Bagian di bawah ini akan menampilkan detail tipe rekaman serta _layout_ yang didukung. 
_Layout_ atau nama _query_ lain yang dapat digunakan dianggap sebagai detail implementasi 
yang bisa saja berubah tanpa adanya pemberitahuan sebelumnya. Untuk informasi spesifikasi 
terbaru kamu dapat membaca [Service Discovery pada Kubernetes berbasis DNS](https://github.com/kubernetes/dns/blob/master/docs/specification.md).

## Service

### A record

Service "Normal" (bukan _headless_) akan diberikan sebuah A _record_ untuk sebuah nama dalam bentuk 
`my-svc.my-namespace.svc.cluster-domain.example`. Inilah yang kemudian digunakan untuk melakukan 
resolusi IP klaster dari Service tersebut.

Service "Headless" (tanpa IP klaster) juga memiliki sebuah A _record_ DNS dengan format 
`my-svc.my-namespace.svc.cluster-domain.example`. Tidak seperti halnya Service normal, 
DNS ini akan melakukan resolusi pada serangkauan IP dari Pod yang dipilih oleh Service tadi. 
Klien diharapkan untuk mengkonsumsi serangkaian IP ini atau cara lain yang digunakan adalah pemilihan 
menggunakan penjadwalan Round-Robin dari set yang ada.

### SRV _record_

SRV _record_ dibuat untuk port bernama yang merupakan bagian dari Service normal maupun [Headless
Services](/id/docs/concepts/services-networking/service/#headless-services).
Untuk setiap port bernama, SRV _record_ akan memiliki format 
`_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster-domain.example`.
Untuk sebuah Service normal, ini akan melakukan resolusi pada nomor port dan 
nama domain: `my-svc.my-namespace.svc.cluster-domain.example`.
Untuk Service headless, ini akan melakukan resolusi pada serangkaian Pod yang merupakan _backend_ dari Service 
tersebut yang memiliki format:  `auto-generated-name.my-svc.my-namespace.svc.cluster-domain.example`.

## Pod

### Hostname Pod dan _Field_ Subdomain

Saat ini ketika sebuah Pod dibuat, _hostname_-nya adalah nilai dari `metadata.name`.

Spek Pod memiliki _field_ opsional `hostname`, yang dapat digunakan untuk menspesifikasikan 
_hostname_ Pod. Ketika dispesifikasikan, maka nama ini akan didahulukan di atas nama Pod . 
Misalnya, sebuah Pod dengan `hostname` yang diberikan nilai "`my-host`", maka _hostname_ Pod tersebut akan menjadi "`my-host`".

Spek Pod juga memiliki _field_ opsional `subdomain` yang dapat digunakan untuk menspesifikasikan 
subdomain Pod tersebut. Misalnya saja sebuah Pod dengan `hostname` yang diberi nilai "`foo`", dan `subdomain`
yang diberi nilai "`bar`", pada _namespace_ "`my-namespace`", akan memiliki _fully qualified
domain name_ (FQDN) "`foo.bar.my-namespace.svc.cluster-domain.example`".

Contoh:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: default-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # Actually, no port is needed.
    port: 1234
    targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: default-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: default-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

Jika terdapat sebuah Service _headless_ memiliki nama yang sama dengan 
subdomain dari suatu Pod pada _namespace_ yang sama, server KubeDNS klaster akan mengembalikan 
A _record_ untuk FQDN Pod.
Sebagai contoh, misalnya terdapat sebuah Pod dengan _hostname_ "`busybox-1`" dan 
subdomain "`default-subdomain`", serta sebuah Service _headless_ dengan nama "`default-subdomain`"  
berada pada suatu _namespace_ yang sama, maka Pod tersebut akan menerima FQDN dirinya sendiri 
sebagai "`busybox-1.default-subdomain.my-namespace.svc.cluster-domain.example`". DNS mengembalikan 
A _record_ pada nama tersebut dan mengarahkannya pada IP Pod. Baik Pod "`busybox1`" dan
"`busybox2`" bisa saja memiliki A _record_ yang berbeda.

Objek Endpoint dapat menspesifikasikan `hostname` untuk alamat _endpoint_ manapun 
beserta dengan alamat IP-nya.

{{< note >}}
Karena A _record_ tidak dibuat untuk sebuah Pod, maka `hostname` diperlukan 
agar sebuah Pod memiliki A _record_. Sebuah Pod yang tidak memiliki `hostname` 
tetapi memiliki `subdomain` hanya akan membuat sebuah A _record_ untuk Service _headless_ 
(`default-subdomain.my-namespace.svc.cluster-domain.example`), yang merujuk pada IP dari 
Pod tersebut. Pod juga harus dalam status _ready_ agar dapat memiliki A _record_ kecuali 
_field_ `publishNotReadyAddresses=True` diaktifkan pada Service.
{{< /note >}}

### Kebijakan DNS Pod

Kebijakan DNS dapat diaktifkan untuk setiap Pod. Kubernetes saat ini mendukung 
kebijakan DNS spesifik Pod (_pod-specific DNS policies_). Kebijakan ini 
dispesifikasikan pada _field_ `dnsPolicy` yang ada pada spek Pod.

- "`Default`": Pod akan mewarisi konfigurasi resolusi yang berasal dari Node 
  dimana Pod tersebut dijalankan.
  Silakan baca [diskusi terkait](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node)
  untuk detailnya.
- "`ClusterFirst`": _Query_ DNS apa pun yang tidak sesuai dengan sufiks domain klaster yang sudah dikonfigurasi 
  misalnya "`www.kubernetes.io`", akan di-_forward_ ke _nameserver_ _upstream_ yang diwarisi dari Node.
  Administrator klaster bisa saja memiliki _stub-domain_ atau DNS _usptream_ lain yang sudah dikonfigurasi.
  Silakan lihat [diskusi terkait](/docs/tasks/administer-cluster/dns-custom-nameservers/#impacts-on-pods)
  untuk detail lebih lanjut mengenai bagaimana _query_ DNS melakukan hal tersebut.
- "`ClusterFirstWithHostNet`": Untuk Pod yang dijalankan dengan menggunakan `hostNetwork`, kamu harus 
  secara eksplisit mengaktifkan kebijakan DNS-nya menjadi "`ClusterFirstWithHostNet`".
- "`None`": Hal ini mengisikan sebuah Pod untuk mengabaikan konfigurasi DNS dari _environment_ Kubernetes 
  Semua pengaturan DNS disediakan menngunakan _field_ `dnsConfig` yang ada pada spek Pod.
  Silakan lihat [konfigurasi DNS Pod](#konfigurasi-dns-pod) di bawah.

{{< note >}}
"Default" bukan merupakan nilai _default_ kebijakan DNS. 
Jika `dnsPolicy` tidak secara eksplisit dispesifikasikan, maka “ClusterFirst” akan digunakan.
{{< /note >}}


Contoh di bawah ini menunjukkan sebuah Pod dengan kebijakan 
DNS yang diubah menjadi "`ClusterFirstWithHostNet`" karena _field_ `hostNetwork` 
diubah menjadi `true`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

### Konfigurasi DNS Pod 

Konfigurasi DNS Pod mengizinkan pengguna untuk memiliki 
lebih banyak kontrol terhadap pengaturan DNS pada Pod.

_Field_ `dnsConfig` bersifat opsional dan dapat digunakan dengan 
pengaturan `dnsPolicy` apa pun.
Meskipun begitu, ketika _field_ `dnsPolicy` pada sebuah Pod diubah menjadi "`None`", 
maka _field_ `dnsConfig` harus dispesifikasikan.

Berikut merupakan properti yang dapat dispesifikasikan oleh pengguna 
pada _field_ `dnsConfig`:

- `nameservers`: serangkaian alamat IP yang akan digunakan sebagai server DNS bagi Pod.
  Jumlah maksimum dari IP yang dapat didaftarkan pada _field_ ini adalah tiga buah IP. 
  Ketika sebuah `dnsPolicy` pada Pod diubah menjadi "`None`", maka list ini setidaknya 
  harus mengandung sebuah alamat IP, selain kasus tersebut properti ini bersifat opsional.
  Server yang didaftarkan akan digabungkan di dalam _nameserver_ dasar yang dihasilkan dari 
  kebijakan DNS yang dispesifikasikan, apabila terdapat duplikat terhadap alamat yang didaftarkan 
  maka alamat tersebut akan dihapus.
- `searches`: merupakan serangkaian domain pencarian DNS yang digunakan untuk proses _lookup_ pada Pod.
  Properti ini bersifat opsional. Ketika dispesifikasikan, list yang disediakan akan digabungkan dengan 
  nama domain pencarian dasar yang dihasilkan dari kebijakan DNS yang dipilih. Alamat yang duplikat akan dihapus.
  Nilai maksimum domain pencarian yang dapat didaftarkan adalah 6 domain.
- `options`: merupakan sebuah list opsional yang berisikan objek dimana setiap objek 
  bisa saja memiliki properti `name` (yang bersifat wajib). Isi dari properti ini 
  akan digabungkan dengan opsi yang dihasilkan kebijakan DNS yang digunakan. 
  Alamat yang duplikat akan dihapus.

Di bawah ini merupakan contoh sebuah Pod dengan pengaturan DNS kustom:

{{% codenew file="service/networking/custom-dns.yaml" %}}

Ketika Pod diatas dibuat, maka Container `test`
memiliki isi berkas `/etc/resolv.conf` sebagai berikut:

```
nameserver 1.2.3.4
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

Untuk pengaturan IPv6, _path_ pencarian dan name server harus dispesifikasikan sebagai berikut:

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```
Keluaran yang dihasilkan akan menyerupai:
```shell
nameserver fd00:79:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

### Keberadaan Fitur (_Feature Availability_) {#keberadaan-fitur}

Keberadaan Pod DNS Config dan DNS Policy "`None`"" diilustrasikan pada tabel di bawah ini.

| versi k8s   | Dukungan Fitur |
| :---------: |:--------------:|
| 1.14 | Stable |
| 1.10 | Beta (aktif secara default)|
| 1.9 | Alpha |



## {{% heading "whatsnext" %}}


Untuk petunjuk lebih lanjut mengenai administrasi konfigurasi DNS, kamu dapat membaca 
[Cara Melakukan Konfigurasi Service DNS](/docs/tasks/administer-cluster/dns-custom-nameservers/)


