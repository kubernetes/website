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
* Kluster: Sekelompok node yang merupakan <i>resource</i> komputasi primer yang diatur oleh Kubernetes, biasanya diproteksi dari internet dengan menggunakan <i>firewall</i>. 
* <i>Edge router</i>: Sebuah <i>router</i> mengatur <i>policy firewall</i> pada kluster kamu. <i>Router</i> ini bisa saja berupa <i>gateway</i> yang diatur oleh penyedia layanan <i>cloud</i> maupun perangkat keras.
* Jaringan kluster: Seperangkat <i>links</i> baik logis maupus fisik, yang memfasilitasi komunikasi di dalam kluster berdasarkan [model jaringan Kubernetes](/en/docs/concepts/cluster-administration/networking/).
* <i>Service</i>: Sebuah [Service](/en/docs/concepts/services-networking/service/) yang mengidentifikasi beberapa <i>Pod</i> dengan menggunakan <i>selector label</i>. Secara umum, <i>Services</i> diasumsikan hanya memiliki IP virtual yang hanya dapat diakses dari dalam jaringan kluster. 

## Apakah <i>Ingress</i> itu?

Ingress ditambahkan sejak Kubernetes v1.1, mengekspos rute HTTP dan HTTPS dari luar kluster ke 
{{< link text="services" url="/en/docs/concepts/services-networking/service/" >}} didalam kluster.
Mekanisme <i>routing</i> trafik dikendalikan oleh peraturan yang didefinisikan pada <i>Ingress</i>.

```none
    internet
        |
   [ Ingress ]
   --|-----|--
   [ Services ]
```

Sebuah <i>Ingress</i> dapat dikonfigurasi agar <i>services</i> memiliki URL yang dapat diakses dari eksternal (luar kluster), melakukan <i>load balance</i> pada trafik, terminasi SSL, serta <i>name-based virtual hosting</i>. 
Sebuah [Ingress controller](/en/docs/concepts/services-networking/ingress-controllers) bertanggung jawab untuk menjalankan fungsi Ingress yaitu sebagai <i>loadbalancer</i>, meskipun dapat juga digunakan untuk mengatur <i>edge router</i> atau <i>frontends</i> tambahan untuk menerima trafik.

Sebuah <i>Ingress</i> tidak mengekspos sembarang <i>ports</i> atau protokol. Mengekspos <i>services</i> untuk protokol selain HTTP ke HTTPS internet biasanya dilakukan dengan menggunakan 
<i>service</i> dengan tipe [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) atau
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Prasyarat

{{< feature-state for_k8s_version="v1.1" state="beta" >}}

Sebelum kamu mulai menggunakan <i>Ingress</i>, ada beberapa hal yang perlu kamu ketahui sebelumnya. <i>Ingress</i> merupakan <i>resource</i> dengan tipe beta. 

{{< note >}}
Kamu harus terlebih dahulu memiliki [kontroler Ingress](/en/docs/concepts/services-networking/ingress-controllers) to satisfy an Ingress. Only creating an Ingress resource has no effect.
{{< /note >}}

GCE/Google Kubernetes Engine melakukan deploy kontroler <i>Ingress</i> pada <i>master</i>. Perhatikan laman berikut
[limitasi beta](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations)
kontroler ini jika kamu menggunakan GCE/GKE.

Jika kamu menggunakan environment selain GCE/Google Kubernetes Engine, kemmungkinan besar kamu
[melakukan proses deploy kontroler ingress kamu sendiri](https://kubernetes.github.io/ingress-nginx/deploy/). Terdapat beberapa jenis 
[kontroler Ingress](/docs/concepts/services-networking/ingress-controllers) yang bisa kamu pilih.

### Sebelum kamu memulai

Secara ideal, semua kontroler Ingress charus memenuhi spesifikasi ini, tetapi beberapa 
kontroler beroperasi sedikit berbeda satu sama lain. 

{{< note >}}
Pastikan kamu sudah terlebih dahulu memahami dokumentasi kontroler Ingress yang akan kamu bakai sebelum memutuskan untuk memakai kontroler tersebut. 
{{< /note >}}

## <i>Resource</i> Ingress

Berikut ini merupakan salah satu contoh konfigurasi Ingress yang minimalis:

```yaml
apiVersion: extensions/v1beta1
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

 Seperti layaknya <i>resource</i> Kubernetes yang lain, sebuah Ingress membutuhkan <i>field</i> `apiVersion`, `kind`, dan `metadata`.  
 Untuk informasi umum soal bagaimana cara bekerja dengan menggunakan file konfigurasi, silakan merujuk pada [melakukan deploy aplikasi](/en/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/).
 Ingress seringkali menggunakan anotasi untuk melakukan konfigurasi beberapa opsi yang ada bergantung pada kontroler Ingress yang digunakan, sebagai congtohnya
 adalah [anotasi rewrite-target](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md).
 [Kontroler Ingress](/en/docs/concepts/services-networking/ingress-controllers) yang berbeda memiliki jenis anotasi yang berbeda. Pastikan kamu sudah terlebih dahulu memahami dokumentasi 
 kontroler Ingress yang akan kamu pakai untuk mengetahui jenis anotasi apa sajakah yang disediakan. 

[Spec](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) Ingress
memiliki segala informasi yang dibutuhkan untuk melakukan proses konfigurasi <i>loadbalancer</i> atau server proxy. Hal yang terpenting adalah 
bagian inilah yang mengandung semua <i>rules</i> yang nantinya akan digunakan untuk menyesuaikan trafik yang masuk. <i>Resource</i> Ingress hanya menyediakan 
fitur <i>rules</i> untuk mengarahkan trafik dengan protokol HTTP.

### <i>Rules</i> Ingress

Setiap <i>rule</i> HTTP mengandung informasi berikut:

* <i>Host</i> opsional. Di dalam contoh ini, tidak ada <i>host</i> yang diberikan, dengan kata lain, semua <i>rules</i> berlaku untuk <i>inbound</i>.
  trafik HTTP bagi alamat IP yang dispesifikasikan. JIka sebuah <i>host</i> dispesifikasikan (misalnya saja,
  foo.bar.com), maka <i>rules</i> yang ada akan berlaku bagi <i>host</i> tersebut.
* Sederetan <i>path</i>(misalnya, /testpath), setiap <i>path</i> ini akan memiliki pasangan berupa sebuah <i>backend</i> yang didefinisikan dengan `serviceName`
  dan `servicePort`. Baik <i>host</i> dan <i>path</i> harus sesuai dengan konten dari <i>request</i> yang masuk sebelum 
  <i>loadbalancer</i> akan mengarahkan trafik pada <i>service</i> yang sesuai. 
* Sebuah <i>backend</i> adalah kombinasi <i>service</i> dan <i>port</i> seperti yang dideskripsikan di
  [dokumentasi Services](/en/docs/concepts/services-networking/service/). Request HTTP (dan HTTPS) yang sesuai dengan 
  <i>host</i> dan <i>path</i> yang ada pada <i>rule</i> akan diteruskan pada <i>backend</i> terkait.

<i>Backend default</i> seringkali dikonfigurasi pada kontroler Ingress controller, tugas <i>backend default</i> ini adalah 
 mengarahkan <i>request</i> yang tidak sesuai dengan <i>path</i> yang tersedia pada spesifikasi. 

### <i>Backend Default</i>

Sebuah Ingress yang tidak memiliki <i>rules</i> akan mengarahkan semua trafik pada sebuag <i>backend default</i>. <i>Backend default</i> inilah yang 
biasanya bisa dimasukkan sebagai salah satu opsi konfigurasi dari [kontroler Ingress](/en/docs/concepts/services-networking/ingress-controllers) dan tidak dispesifikasi di dalam <i>resource</i> Ingress.

Jika tidak ada <i>hosts</i> atau <i>paths</i> yang sesuai dengan <i>request</i> HTTP pada obyek Ingress, maka trafik tersebut 
akan diarahkan pada <i>backend default</i>.

## Jenis Ingress

### Ingress dengan satu Service

Terdapat konsep Kubernetes yang memungkinkan kamu untuk mengekspos sebuah Service.
(see [alternatives](#alternatives)). Kamu juga bisa membuat spesifikasi Ingress dengan  
*backend default* yang tidak memiliki <i>rules</i>.

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
Kontroler Ingress dan <i>load balancers</i> membutuhkan waktu sekitar satu hingga dua menit untuk mengalokasikan alamat IP.  
Hingga alamat IP berhasil dialokasikan, kamu akan melihat tampilan kolom `ADDRESS` sebagai `<pending>`.
{{< /note >}}

### <i>Fanout</i> sederhana

Sebuah konfigurasi fanout akan melakukan <i>route</i> trafik dari sebbuah alamat IP ke lebih dari sebuah Service, 
berdasarkan URI HTTP yang diberikan. Sebuah Ingress memungkinkan kamu untuk memiliki jumlah <i>loadbalancer</i> minimum. 
Contohnya, konfigurasi seperti dibawah ini:

```shell
foo.bar.com -> 178.91.123.132 -> / foo    service1:4200
                                 / bar    service2:8080
```

akan memerlukan konfigurasi Ingress seperti:

```yaml
apiVersion: extensions/v1beta1
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

Kontroler Ingress akan melakukan <i>provision</i> implementasi spesifik <i>loadbalancers</i>
yang sesuai dengan <i>Ingress</i>, selama <i>service-service</i> yang didefinisikan (`s1`, `s2`) ada.
Apabila <i>Ingress</i> selesai dibuat, maka kamu dapat melihat alamat IP dari <i>loadbalancers</i> 
pada kolom `address`.

{{< note >}}
Kamu mungkin saja membutuhkan konfigurasi default-http-backend [Service](/en/docs/concepts/services-networking/service/) 
bergantung pada [Ingress controller](/en/docs/concepts/services-networking/ingress-controllers) yang kamu pakai.
{{< /note >}}

### <i>Name based virtual hosting</i>

<i>Name-based virtual hosts</i> memungkinkan mekanisme <i>routing</i> berdasarkan trafik HTTP ke beberapa <i>host name</i> dengan alamat IP yang sama. 

```none
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```

Ingress di bawah ini memberikan perintah pada <i>loadbalancer</i> untuk melakukan mekanisme <i>routing</i> berdasarkan 
[header host](https://tools.ietf.org/html/rfc7230#section-5.4).

```yaml
apiVersion: extensions/v1beta1
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

Jika kamu membuat sebuah Ingress tanpa mendefinisikan <i>host</i> apa pun, maka 
trafik web ke alamat IP dari kontroler Ingress tetap dapat dilakukan tanpa harus 
menyesuaikan aturan <i>name based virtual host</i>. Sebagai contoh, 
<i>resource</i> Ingress di bawah ini akan melakukan pemetaan trafik  
dari `first.bar.com` ke `service1`, `second.foo.com` ke `service2`, dan trafik lain 
ke alamat IP tanpa <i>host name</i> yang didefinisikan di dalam <i>request</i> (yang tidak memiliki <i>request header</i>) ke `service3`.

```yaml
apiVersion: extensions/v1beta1
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

Kamu dapat mengamankan <i>Ingress</i> yang kamu punya dengan memberikan spesifikasi [secret](/en/docs/concepts/configuration/secret)
yang mengandung <i>private key</i> dan sertifikat TLS. Saat ini, Ingress hanya 
memiliki fitur untuk melakukan konfigurasi <i>single TLS port</i>, yaitu 443, serta melakukan terminasi TLS. 
Jika <i>section</i> TLS pada Ingress memiliki spesifikasi <i>host</i> yang berbeda,
<i>rules</i> yang ada akan dimultipleksikan pada <i>port</i> yang sama berdasarkan 
<i>hostname</i> yang dispesifikasin melalui ekstensi TLS SNI. <i>Secret</i> TLS harus memiliki 
`key` bernama `tls.crt` dan `tls.key` yang mengandung <i>private key</i> dan sertifikat TLS, contohnya:

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

Menambahkan <i>secret</i> ini pada akan membuat Ingress kontroler Ingress untuk 
memproteksi <i>channel</i> dari klien <i>loadbalancer</i> menggunakan TLS. 
Kamu harus memastikan <i>secret</i> TLS yang digunakan dibaut dari sertifikat yang mengandung 
CN untuk `sslexample.foo.com`.

```yaml
apiVersion: extensions/v1beta1
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
Terdapat kesenjangan diantara beberapa fitur TLS 
yang disediakan oleh berbagai kontroler Ingress. Perhatikan dokumentasi 
[nginx](https://git.k8s.io/ingress-nginx/README.md#https),
[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), atau Ingress
kontroler spesifik <i>platform</i> lainnya untuk memahami cara kerja <i>environment</i> 
pada <i>environment</i>.
{{< /note >}}

### <i>Loadbalancing</i>

Sebuah kontroler Ingress sudah dibekali dengan beberapa <i>policy</i> terkait mekanisme <i>load balance</i> 
yang nantinya akan diterapkan pada semua Ingress, misalnya saja algoritma <i>load balancing</i>, <i>backend
weight scheme</i>, dan lain sebagainya. Beberapa konsep <i>load balance</i> yang lebih <i>advance</i> 
(misalnya saja <i>persistent sessions</i>, <i>dynamic weights</i>) belum diekspos melalui Ingress 
Meskipun begitu, kamu masih bisa menggunakan fitur ini melalui 
[loadbalancer service](https://github.com/kubernetes/ingress-nginx).

Perlu diketahui bahwa meskipun <i>health check</i> tidak diekspos secara langsung 
melalui Ingress, terdapat beberapa konsep di Kubernetes yang sejalan dengan hal ini, misalnya 
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)
yang memungkinkan kamu untuk memperoleh hasil yang sama. Silakan pelajari lebih lanjut dokumentasi 
kontroler yang kamu pakai untuk mengetahui bagaimana implementasi <i>health checks</i> pada kontroler yang kamu pilih (
[nginx](https://git.k8s.io/ingress-nginx/README.md),
[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## Mengubah Ingress

Untuk mengubah Ingress yang sudah ada dan menambahkan <i>host</i> baru, kamu dapat mnegubahnya dengan mode <i>edit</i>:

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
dalam format YAML apabila kamu telah emnjalankan perintah di atas. 
Ubah untuk menambahkan <i>host</i>: 

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

Menyimpan konfigurasi dalam bentuk YAML ini akan mengubah <i>resource</i> pada API server,
yang kemudian akan memberi tahu kontroler Ingress untuk mengubah konfigurasi <i>loadbalancer</i>.

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

## Mekanisme <i>failing</i> pada beberapa zona <i>availability</i>

Teknik untuk menyeimbangkan persebaran trafik pada <i>failure domain</i> berbeda antar penyedia layanan <i>cloud</i>.
Kamu dapat mempelajari dokumentasi yang relevan bagi [kontoler Ingress](/en/docs/concepts/services-networking/ingress-controllers) 
untuk informasi yang lebih detail. Kamu juga dapat mempelajari [dokumentasi federasi](/en/docs/concepts/cluster-administration/federation/)
untuk informasi lebih detail soal bagaimana melakukan <i>deploy</i> untuk federasi kluster. 

## Future Work

Silakan amati [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)
untuk detail lebih lanjut mengenai perubahan Ingress dan <i>resource</i> terkait lainnya. Kamu juga bisa melihat 
[repositori Ingress](https://github.com/kubernetes/ingress/tree/master) untuk informasi  yang lebih detail 
soal perubahan berbagai kontroler.

## Alternatif lain

Kamu dapat mengekspos sebuah <i>Service</i> dalam berbagai cara, tanpa harus menggunakan <i>resource</i> Ingress, dengan menggunakan:

* [Service.Type=LoadBalancer](/en/docs/concepts/services-networking/service/#loadbalancer)
* [Service.Type=NodePort](/en/docs/concepts/services-networking/service/#nodeport)
* [Port Proxy](https://git.k8s.io/contrib/for-demos/proxy-to-service)

{{% /capture %}}

{{% capture whatsnext %}}
* [Melakukan konfigurasi Ingress pada Minikube dengan kontroler  NGINX](/en/docs/tasks/access-application-cluster/ingress-minikube)
{{% /capture %}}
