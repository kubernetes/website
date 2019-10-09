---
title: Ingress
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{% /capture %}}

{{% capture body %}}
## Terminologi

Untuk memudahkan, di awal akan dijelaskan beberapa terminologi yang sering dipakai: 

* Node: Sebuah mesin fisik atau virtual yang berada di dalam kluster Kubernetes. 
* Kluster: Sekelompok node yang merupakan *resource* komputasi primer yang diatur oleh Kubernetes, biasanya diproteksi dari internet dengan menggunakan *firewall*. 
* *Edge router*: Sebuah *router* mengatur *policy firewall* pada kluster kamu. *Router* ini bisa saja berupa *gateway* yang diatur oleh penyedia layanan *cloud* maupun perangkat keras.
* Jaringan kluster: Seperangkat *links* baik logis maupus fisik, yang memfasilitasi komunikasi di dalam kluster berdasarkan [model jaringan Kubernetes](/docs/concepts/cluster-administration/networking/).
* *Service*: Sebuah [*Service*](/docs/concepts/services-networking/service/) yang mengidentifikasi beberapa *Pod* dengan menggunakan *selector label*. Secara umum, semua *Service* diasumsikan hanya memiliki IP virtual yang hanya dapat diakses dari dalam jaringan kluster. 

## Apakah *Ingress* itu?

Ingress ditambahkan sejak Kubernetes v1.1, mengekspos rute HTTP dan HTTPS ke berbagai 
{{< link text="services" url="/docs/concepts/services-networking/service/" >}} di dalam kluster.
Mekanisme *routing* trafik dikendalikan oleh aturan-aturan yang didefinisikan pada *Ingress*.

```none
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

Sebuah *Ingress* dapat dikonfigurasi agar berbagai *Service* memiliki URL yang dapat diakses dari eksternal (luar kluster), melakukan *load balance* pada trafik, terminasi SSL, serta Virtual Host berbasis Nama. 
Sebuah [kontroler Ingress](/docs/concepts/services-networking/ingress-controllers) bertanggung jawab untuk menjalankan fungsi Ingress yaitu sebagai *loadbalancer*, meskipun dapat juga digunakan untuk mengatur *edge router* atau *frontend* tambahan untuk menerima trafik.

Sebuah *Ingress* tidak mengekspos sembarang *port* atau protokol. Mengekspos *Service* untuk protokol selain HTTP ke HTTPS internet biasanya dilakukan dengan menggunakan 
*service* dengan tipe [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) atau
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Prasyarat

{{< feature-state for_k8s_version="v1.1" state="beta" >}}

Sebelum kamu mulai menggunakan *Ingress*, ada beberapa hal yang perlu kamu ketahui sebelumnya. *Ingress* merupakan *resource* dengan tipe beta. 

{{< note >}}
Kamu harus terlebih dahulu memiliki [kontroler Ingress](/docs/concepts/services-networking/ingress-controllers) untuk dapat memenuhi *Ingress*. Membuat sebuah *Ingress* tanpa adanya kontroler *Ingres* tidak akan berdampak apa pun. 
{{< /note >}}

GCE/Google Kubernetes Engine melakukan deploy kontroler *Ingress* pada *master*. Perhatikan laman berikut
[keterbatasan versi beta](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations)
kontroler ini jika kamu menggunakan GCE/GKE.

Jika kamu menggunakan *environment* selain GCE/Google Kubernetes Engine, kemungkinan besar kamu harus 
[melakukan proses deploy kontroler ingress kamu sendiri](https://kubernetes.github.io/ingress-nginx/deploy/). Terdapat beberapa jenis 
[kontroler Ingress](/docs/concepts/services-networking/ingress-controllers) yang bisa kamu pilih.

### Sebelum kamu memulai

Secara ideal, semua kontroler Ingress harus memenuhi spesifikasi ini, tetapi beberapa 
kontroler beroperasi sedikit berbeda satu sama lain. 

{{< note >}}
Pastikan kamu sudah terlebih dahulu memahami dokumentasi kontroler Ingress yang akan kamu pakai sebelum memutuskan untuk memakai kontroler tersebut. 
{{< /note >}}

## *Resource* Ingress

Berikut ini merupakan salah satu contoh konfigurasi Ingress yang minimum:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```

 Seperti layaknya *resource* Kubernetes yang lain, sebuah Ingress membutuhkan *field* `apiVersion`, `kind`, dan `metadata`.  
 Untuk informasi umum soal bagaimana cara bekerja dengan menggunakan file konfigurasi, silahkan merujuk pada [melakukan deploy aplikasi](/docs/tasks/run-application/run-stateless-application-deployment/), [konfigurasi kontainer](/docs/tasks/configure-pod-container/configure-pod-configmap/), [mengatur *resource*](/docs/concepts/cluster-administration/manage-deployment/).
 Ingress seringkali menggunakan anotasi untuk melakukan konfigurasi beberapa opsi yang ada bergantung pada kontroler Ingress yang digunakan, sebagai contohnya
 adalah [anotasi rewrite-target](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).
 [Kontroler Ingress](/docs/concepts/services-networking/ingress-controllers) yang berbeda memiliki jenis anotasi yang berbeda. Pastikan kamu sudah terlebih dahulu memahami dokumentasi 
 kontroler Ingress yang akan kamu pakai untuk mengetahui jenis anotasi apa sajakah yang disediakan. 

[Spesifikasi](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) Ingress
memiliki segala informasi yang dibutuhkan untuk melakukan proses konfigurasi *loadbalancer* atau server proxy. Hal yang terpenting adalah 
bagian inilah yang mengandung semua *rules* yang nantinya akan digunakan untuk menyesuaikan trafik yang masuk. *Resource* Ingress hanya menyediakan 
fitur *rules* untuk mengarahkan trafik dengan protokol HTTP.

### *Rule* Ingress

Setiap *rule* HTTP mengandung informasi berikut:

* *Host* opsional. Di dalam contoh ini, tidak ada *host* yang diberikan, dengan kata lain, semua *rules* berlaku untuk *inbound* 
  trafik HTTP bagi alamat IP yang dispesifikasikan. JIka sebuah *host* dispesifikasikan (misalnya saja,
  foo.bar.com), maka *rules* yang ada akan berlaku bagi *host* tersebut.
* Sederetan *path* (misalnya, /testpath), setiap *path* ini akan memiliki pasangan berupa sebuah *backend* yang didefinisikan dengan `serviceName`
  dan `servicePort`. Baik *host* dan *path* harus sesuai dengan konten dari *request* yang masuk sebelum 
  *loadbalancer* akan mengarahkan trafik pada *service* yang sesuai. 
* Suatu *backend* adalah kombinasi *service* dan *port* seperti yang dideskripsikan di
  [dokumentasi *Service*](/docs/concepts/services-networking/service/). *Request* HTTP (dan HTTPS) yang sesuai dengan 
  *host* dan *path* yang ada pada *rule* akan diteruskan pada *backend* terkait.

*Backend default* seringkali dikonfigurasi pada kontroler kontroler Ingress, tugas *backend default* ini adalah 
 mengarahkan *request* yang tidak sesuai dengan *path* yang tersedia pada spesifikasi. 

### *Backend Default*

Sebuah Ingress yang tidak memiliki *rules* akan mengarahkan semua trafik pada sebuah *backend default*. *Backend default* inilah yang 
biasanya bisa dimasukkan sebagai salah satu opsi konfigurasi dari [kontroler Ingress](/docs/concepts/services-networking/ingress-controllers) dan tidak dimasukkan dalam spesifikasi *resource* Ingress.

Jika tidak ada *host* atau *path* yang sesuai dengan *request* HTTP pada objek Ingress, maka trafik tersebut 
akan diarahkan pada *backend default*.

## Jenis Ingress

### Ingress dengan satu Service

Terdapat konsep Kubernetes yang memungkinkan kamu untuk mengekspos sebuah Service, lihat [alternatif lain](#alternatif-lain). 
Kamu juga bisa membuat spesifikasi Ingress dengan  *backend default* yang tidak memiliki *rules*.

{{< codenew file="service/networking/ingress.yaml" >}}

Jika kamu menggunakan `kubectl apply -f` kamu dapat melihat:

```shell
kubectl get ingress test-ingress
```

```shell
NAME           HOSTS     ADDRESS           PORTS     AGE
test-ingress   *         107.178.254.228   80        59s
```

Dimana `107.178.254.228` merupakan alamat IP yang dialokasikan oleh kontroler Ingress untuk 
memenuhi Ingress ini.

{{< note >}}
Kontroler Ingress dan *load balancer* membutuhkan waktu sekitar satu hingga dua menit untuk mengalokasikan alamat IP.  
Hingga alamat IP berhasil dialokasikan, kamu akan melihat tampilan kolom `ADDRESS` sebagai `<pending>`.
{{< /note >}}

### *Fanout* sederhana

Sebuah konfigurasi fanout akan melakukan *route* trafik dari sebuah alamat IP ke banyak Service, 
berdasarkan URI HTTP yang diberikan. Sebuah Ingress memungkinkan kamu untuk memiliki jumlah *loadbalancer* minimum. 
Contohnya, konfigurasi seperti di bawah ini:

```shell
foo.bar.com -> 178.91.123.132 -> / foo    service1:4200
                                 / bar    service2:8080
```

akan memerlukan konfigurasi Ingress seperti:

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: simple-fanout-example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: service1
          servicePort: 4200
      - path: /bar
        backend:
          serviceName: service2
          servicePort: 8080
```

Ketika kamu membuat Ingress dengan perintah `kubectl apply -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```shell
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

Kontroler Ingress akan menyediakan *loadbalancer* (implementasinya tergantung dari jenis Ingress yang digunakan), selama *service-service* yang didefinisikan (`s1`, `s2`) ada.
Apabila *Ingress* selesai dibuat, maka kamu dapat melihat alamat IP dari berbagai *loadbalancer* 
pada kolom `address`.

{{< note >}}
Kamu mungkin saja membutuhkan konfigurasi default-http-backend [Service](/docs/concepts/services-networking/service/) 
bergantung pada [kontroler Ingress](/docs/concepts/services-networking/ingress-controllers) yang kamu pakai.
{{< /note >}}

### Virtual Host berbasis Nama

Virtual Host berbasis Nama memungkinkan mekanisme *routing* berdasarkan trafik HTTP ke beberapa *host name* dengan alamat IP yang sama. 

```none
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```

Ingress di bawah ini memberikan perintah pada *loadbalancer* untuk melakukan mekanisme *routing* berdasarkan 
[header host](https://tools.ietf.org/html/rfc7230#section-5.4).

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
```

Jika kamu membuat sebuah Ingress tanpa mendefinisikan *host* apa pun, maka 
trafik web ke alamat IP dari kontroler Ingress tetap dapat dilakukan tanpa harus 
menyesuaikan aturan *name based virtual host*. Sebagai contoh, 
*resource* Ingress di bawah ini akan melakukan pemetaan trafik  
dari `first.bar.com` ke `service1`, `second.foo.com` ke `service2`, dan trafik lain 
ke alamat IP tanpa *host name* yang didefinisikan di dalam *request* (yang tidak memiliki *request header*) ke `service3`.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: first.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: second.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
  - http:
      paths:
      - backend:
          serviceName: service3
          servicePort: 80
```

### TLS

Kamu dapat mengamankan *Ingress* yang kamu miliki dengan memberikan spesifikasi [secret](/docs/concepts/configuration/secret)
yang mengandung *private key* dan sertifikat TLS. Saat ini, Ingress hanya 
memiliki fitur untuk melakukan konfigurasi *single TLS port*, yaitu 443, serta melakukan terminasi TLS. 
Jika *section* TLS pada Ingress memiliki spesifikasi *host* yang berbeda,
*rules* yang ada akan dimultiplekskan pada *port* yang sama berdasarkan 
*hostname* yang dispesifikasikan melalui ekstensi TLS SNI. *Secret* TLS harus memiliki 
`key` bernama `tls.crt` dan `tls.key` yang mengandung *private key* dan sertifikat TLS, contohnya:

```yaml
apiVersion: v1
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
type: kubernetes.io/tls
```

Ketika kamu menambahkan *secret* pada Ingress maka kontroler Ingress akan memberikan perintah untuk 
memproteksi *channel* dari klien ke *loadbalancer* menggunakan TLS. 
Kamu harus memastikan *secret* TLS yang digunakan memiliki sertifikat yang mengandung 
CN untuk `sslexample.foo.com`.

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: tls-example-ingress
spec:
  tls:
  - hosts:
    - sslexample.foo.com
    secretName: testsecret-tls
  rules:
    - host: sslexample.foo.com
      http:
        paths:
        - path: /
          backend:
            serviceName: service1
            servicePort: 80
```

{{< note >}}
Terdapat perbedaan di antara beberapa fitur TLS 
yang disediakan oleh berbagai kontroler Ingress. Perhatikan dokumentasi 
[nginx](https://git.k8s.io/ingress-nginx/README.md#https),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), atau 
kontroler Ingress spesifik *platform* lainnya untuk memahami cara kerja TLS 
pada **environment** yang kamu miliki.
{{< /note >}}

### *Loadbalancing*

Sebuah kontroler Ingress sudah dibekali dengan beberapa *policy* terkait mekanisme *load balance* 
yang nantinya akan diterapkan pada semua Ingress, misalnya saja algoritma *load balancing*, *backend
weight scheme*, dan lain sebagainya. Beberapa konsep *load balance* yang lebih *advance* 
(misalnya saja *persistent sessions*, *dynamic weights*) belum diekspos melalui Ingress. 
Meskipun begitu, kamu masih bisa menggunakan fitur ini melalui 
[loadbalancer service](https://github.com/kubernetes/ingress-nginx).

Perlu diketahui bahwa meskipun *health check* tidak diekspos secara langsung 
melalui Ingress, terdapat beberapa konsep di Kubernetes yang sejalan dengan hal ini, misalnya 
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
yang memungkinkan kamu untuk memperoleh hasil yang sama. Silahkan pelajari lebih lanjut dokumentasi 
kontroler yang kamu pakai untuk mengetahui bagaimana implementasi *health checks* pada kontroler yang kamu pilih ([nginx](https://git.k8s.io/ingress-nginx/README.md),
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## Mengubah Ingress

Untuk mengubah Ingress yang sudah ada dan menambahkan *host* baru, kamu dapat mengubahnya dengan mode *edit*:

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

Sebuah editor akan muncul dan menampilkan konfigurasi Ingress kamu 
dalam format YAML apabila kamu telah menjalankan perintah di atas. 
Ubah untuk menambahkan *host*: 

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: s1
          servicePort: 80
        path: /foo
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: s2
          servicePort: 80
        path: /foo
..
```

Menyimpan konfigurasi dalam bentuk YAML ini akan mengubah *resource* pada API server,
yang kemudian akan memberi tahu kontroler Ingress untuk mengubah konfigurasi *loadbalancer*.

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   s2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

Kamu juga dapat mengubah Ingress dengan menggunakan perintah `kubectl replace -f` pada file konfigurasi 
Ingress yang ingin diubah.

## Mekanisme *failing* pada beberapa zona *availability*

Teknik untuk menyeimbangkan persebaran trafik pada *failure domain* berbeda antar penyedia layanan *cloud*.
Kamu dapat mempelajari dokumentasi yang relevan bagi [kontoler Ingress](/docs/concepts/services-networking/ingress-controllers) 
untuk informasi yang lebih detail. Kamu juga dapat mempelajari [dokumentasi federasi](/docs/concepts/cluster-administration/federation/)
untuk informasi lebih detail soal bagaimana melakukan *deploy* untuk federasi kluster. 

## Pengembangan selanjutnya

Silahkan amati [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)
untuk detail lebih lanjut mengenai perubahan Ingress dan *resource* terkait lainnya. Kamu juga bisa melihat 
[repositori Ingress](https://github.com/kubernetes/ingress/tree/master) untuk informasi  yang lebih detail 
soal perubahan berbagai kontroler.

## Alternatif lain

Kamu dapat mengekspos sebuah *Service* dalam berbagai cara, tanpa harus menggunakan *resource* Ingress, dengan menggunakan:

* [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)
* [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport)
* [Port Proxy](https://git.k8s.io/contrib/for-demos/proxy-to-service)

{{% /capture %}}

{{% capture whatsnext %}}
* [Melakukan konfigurasi Ingress pada Minikube dengan kontroler NGINX](/docs/tasks/access-application-cluster/ingress-minikube)
{{% /capture %}}
