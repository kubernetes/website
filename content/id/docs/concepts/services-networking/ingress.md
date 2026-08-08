---
title: Ingress
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "Ingress"
- apiVersion: "networking.k8s.io/v1"
  kind: "IngressClass"

content_type: concept
description: >-
  Buat layanan jaringan HTTP (atau HTTPS) kamu tersedia menggunakan mekanisme konfigurasi yang sadar protokol,
  yang memahami konsep web seperti URI, hostname, path, dan lainnya.
  Konsep Ingress memungkinkan kamu memetakan lalu lintas ke backend yang berbeda berdasarkan aturan yang kamu definisikan
  melalui API Kubernetes.
weight: 30
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.19" state="stable" >}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{< note >}}
Proyek Kubernetes merekomendasikan menggunakan Gateway daripada Ingress.
API Ingress telah dibekukan.
Ini berarti:
API Ingress tersedia secara umum (generally available), dan tunduk pada jaminan stabilitas untuk API yang tersedia sepenuhnya.
API Ingress tidak lagi dikembangkan, dan tidak akan ada perubahan atau pembaruan lebih lanjut yang dilakukan padanya.
{{< /note >}}
<!-- body -->

## Terminologi

Untuk kejelasan, panduan ini mendefinisikan istilah-istilah berikut:
* *Node*: Mesin pekerja di Kubernetes, bagian dari sebuah klaster.
* Klaster: Sekumpulan *Node* yang menjalankan aplikasi terkontainerisasi yang dikelola oleh Kubernetes.
Untuk contoh ini, dan dalam sebagian besar deployment Kubernetes yang umum, *Node* di dalam klaster tidak menjadi bagian dari jaringan klaster itu sendiri.
* Edgerouter: Router yang menegakkan kebijakan firewall untuk klaster kamu. Ini bisa berupa gateway yang dikelola oleh cloud provider.
* Jaringan klaster (Cluster network): Sekumpulan tautan, baik logis maupun fisik, yang memfasilitasi komunikasi di dalam klaster kamu.
* Service: {{< glossary_tooltip term_id="service" >}} Kubernetes yang mengidentifikasi sekumpulan Pod menggunakan selector.


## Apa itu Ingress?

[Ingress](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ingress-v1-networking-k8s-io)
mengekspos rute HTTP dan HTTPS dari luar klaster ke
{{< link text="Service" url="/docs/concepts/services-networking/service/" >}} di dalam klaster.
Routing lalu lintas dikendalikan oleh aturan yang didefinisikan pada *resource* Ingress.

Berikut adalah contoh sederhana di mana sebuah Ingress mengirimkan seluruh lalu lintasnya ke satu Service:

{{< figure src="/docs/images/ingressFanOut.svg" alt="diagram-ingress-fanout" class="diagram-large" caption="Gambar. Ingress Fan Out" >}}

Sebuah Ingress dapat dikonfigurasi untuk memberikan *Service* URL yang dapat dijangkau secara eksternal, melakukan *load balance* lalu lintas, melakukan terminasi SSL / TLS, dan menawarkan *virtual hosting* berbasis nama.
Sebuah [Ingress controller](/docs/concepts/services-networking/ingress-controllers) bertanggung jawab untuk memenuhi Ingress, biasanya dengan *load balancer*, meskipun ia juga dapat mengkonfigurasi *edge router* kamu atau *frontend* tambahan untuk membantu menangani permintaan.

Ingress tidak mengekspos port atau protokol arbitrer. Mengekspos *service* selain HTTP dan HTTPS ke internet biasanya menggunakan *service* dengan tipe [Service.Type=*Node*Port](/docs/concepts/services-networking/service/#type-*Node*Port) atau
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer).

## Prasyarat

Kamu harus memiliki [Ingress controller](/docs/concepts/services-networking/ingress-controllers) untuk memenuhi Ingress. Hanya membuat *resource* Ingress tidak akan memberikan efek apa pun.

Kamu dapat memilih dari sejumlah [Ingress controller](/docs/concepts/services-networking/ingress-controllers).

Idealnya, semua *Ingress controller* harus sesuai dengan spesifikasi referensi. Kenyataannya, berbagai *Ingress controller* beroperasi sedikit berbeda.

{{< note >}}
Pastikan kamu meninjau dokumentasi *Ingress controller* pilihan kamu untuk memahami peringatan saat memilihnya.
{{< /note >}}

## Sumber daya Ingress

Contoh minimal sumber daya Ingress:

{{% code_sample file="service/networking/minimal-ingress.yaml" %}}


Sebuah Ingress memerlukan *field* `apiVersion`, `kind`, `metadata`, dan `spec`.
Nama objek Ingress harus merupakan [Nama subdomain DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) yang valid.
Untuk informasi umum tentang bekerja dengan *file* konfigurasi, lihat
[mendeploy aplikasi](/docs/tasks/run-application/run-stateless-application-deployment/),
[mengkonfigurasi *container*](/docs/tasks/configure-pod-container/configure-pod-configmap/),
[mengelola *resource*](/docs/concepts/workloads/management/).
*Ingress controller* sering menggunakan [anotasi](/docs/concepts/overview/working-with-objects/annotations/) untuk mengkonfigurasi perilaku.
Tinjau dokumentasi *Ingress controller* pilihan kamu untuk mengetahui anotasi mana yang diharapkan dan/atau didukung.

[Spesifikasi Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)
memuat semua informasi yang dibutuhkan untuk mengkonfigurasi *load balancer* atau *proxy server*. Yang terpenting, ia
berisi daftar aturan yang dicocokkan dengan semua permintaan masuk. *Resource* Ingress hanya mendukung aturan
untuk mengarahkan lalu lintas HTTP(S).

Jika `ingressClassName` dihilangkan, sebuah [Ingress class default](#default-ingress-class)
sebaiknya didefinisikan.

Beberapa *ingress controller* bekerja bahkan tanpa definisi
*IngressClass* *default*. Meskipun Kamu menggunakan *ingress controller* yang mampu
beroperasi tanpa *IngressClass* apa pun, proyek Kubernetes tetap merekomendasikan
agar kamu mendefinisikan *IngressClass* *default*.


### Aturan Ingress

Setiap aturan HTTP memuat informasi berikut:

* Host opsional. Dalam contoh ini, tidak ada host yang ditentukan, sehingga aturan berlaku untuk semua lalu lintas HTTP masuk melalui alamat IP yang ditentukan. Jika host disediakan (misalnya, `foo.bar.com`), aturan berlaku untuk host tersebut.
* Daftar *path* (misal, `/testpath`), yang masing-masing memiliki *backend* terkait yang didefinisikan dengan `service.name` dan `service.port.name` atau `service.port.number`. Baik *host* maupun *path* harus cocok dengan konten permintaan masuk sebelum *load balancer* mengarahkan lalu lintas ke *Service* yang direferensikan.
* *Backend* adalah kombinasi *Service* dan nama *port* seperti dijelaskan dalam [dokumen *Service*](/docs/concepts/services-networking/service/) atau [backend *custom resource*](#resource-backend) melalui {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRD" >}}. Permintaan HTTP (dan HTTPS) ke Ingress yang cocok dengan *host* dan *path* dari aturan dikirim ke *backend* yang terdaftar.

Sebuah `defaultBackend` sering dikonfigurasi dalam *Ingress controller* untuk melayani setiap permintaan yang tidak cocok dengan *path* dalam spesifikasi.


### DefaultBackend {#default-backend}
Ingress tanpa aturan mengirimkan semua lalu lintas ke satu default backend, dan `spec.defaultBackend` adalah backend yang seharusnya menangani permintaan dalam kasus tersebut. defaultBackend secara konvensional merupakan opsi konfigurasi dari Ingress controller dan tidak ditentukan dalam resource Ingress kamu. Jika tidak ada .spec.rules yang ditentukan, .spec.defaultBackend harus ditentukan. Jika defaultBackend tidak diatur, penanganan permintaan yang tidak cocok dengan aturan apa pun akan diserahkan kepada ingress controller (konsultasikan dokumentasi untuk ingress controller kamu untuk mengetahui bagaimana ia menangani kasus ini).

Jika tidak ada host atau path yang cocok dengan permintaan HTTP di objek Ingress, lalu lintas dirutekan ke default backend kamu.

### Resource backends {#resource-backend}

Sebuah Resource Backend adalah ObjectRef ke resource Kubernetes lain di dalam namespace yang sama dengan objek Ingress. Sebuah Resource adalah pengaturan yang saling eksklusif dengan Service, dan akan gagal divalidasi jika keduanya ditentukan. ...
Penggunaan umum untuk Resource backend adalah untuk memasukkan data ke backend object storage dengan aset statis.

{{% code_sample file="service/networking/ingress-resource-backend.yaml" %}}

Setelah membuat Ingress di atas, Kamu dapat melihatnya dengan perintah berikut:


```Bash

kubectl describe ingress ingress-resource-backend
```

```
Name:             ingress-resource-backend
Namespace:        default
Address:
Default backend:  APIGroup: k8s.example.com, Kind: StorageBucket, Name: static-assets
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /icons   APIGroup: k8s.example.com, Kind: StorageBucket, Name: icon-assets
Annotations:  <none>
Events:       <none>
```

### Jenis Path (Path types)

Setiap path dalam sebuah Ingress diwajibkan memiliki jenis path yang sesuai (path type). Path yang
tidak menyertakan pathType secara eksplisit akan gagal dalam validasi. Ada tiga jenis path yang didukung:

* ImplementationSpecific: Dengan tipe path ini, pencocokan tergantung pada IngressClass. Implementasi dapat memperlakukannya sebagai pathType yang terpisah atau memperlakukannya identik dengan tipe path Prefix atau Exact.

* Exact: Mencocokkan path URL secara persis dan sensitif terhadap huruf besar/kecil (case-sensitive).

* Prefix: Mencocokkan berdasarkan awalan path URL yang dipisahkan oleh /. Pencocokan sensitif terhadap huruf besar/kecil dan dilakukan per elemen path. Elemen path mengacu pada daftar label di path yang dipisahkan oleh pemisah /. Sebuah permintaan dianggap cocok untuk path p jika setiap p merupakan awalan per elemen dari path p dari path permintaan.

 {{< note >}}
Jika elemen terakhir dari path merupakan substring dari elemen terakhir di path permintaan, itu bukanlah kecocokan (misalnya: /foo/bar cocok dengan /foo/bar/baz, tetapi tidak cocok dengan /foo/barbaz).
{{< /note >}}

### Contoh Pencocokan Path

| Jenis    | Path(s)                       | Path Permintaan | Cocok? | Catatan                                                  |
|----------|-------------------------------|-----------------|--------|----------------------------------------------------------|
| `Prefix` | `/`                           | (semua path)    | Ya     | Mencocokkan semua permintaan.                            |
| `Exact`  | `/foo`                        | `/foo`          | Ya     | Pencocokan persis.                                       |
| `Exact`  | `/foo`                        | `/bar`          | Tidak  | Path tidak sama.                                         |
| `Exact`  | `/foo`                        | `/foo/`         | Tidak  | `Exact` tidak cocok dengan *trailing slash*.             |
| `Exact`  | `/foo/`                       | `/foo`          | Tidak  | `Exact` tidak cocok dengan *trailing slash*.             |
| `Prefix` | `/foo`                        | `/foo`, `/foo/` | Ya     | Cocok dengan prefix elemen.                              |
| `Prefix` | `/foo/`                       | `/foo`, `/foo/` | Ya     | Cocok dengan prefix elemen.                              |
| `Prefix` | `/aaa/bb`                     | `/aaa/bbb`      | Tidak  | `/bbb` bukan elemen yang diawali `/bb`.                  |
| `Prefix` | `/aaa/bbb`                    | `/aaa/bbb`      | Ya     | Pencocokan persis.                                       |
| `Prefix` | `/aaa/bbb/`                   | `/aaa/bbb`      | Ya     | Mengabaikan *trailing slash*.                            |
| `Prefix` | `/aaa/bbb`                    | `/aaa/bbb/`     | Ya     | Cocok dengan *trailing slash*.                           |
| `Prefix` | `/aaa/bbb`                    | `/aaa/bbb/ccc`  | Ya     | Cocok dengan *subpath*.                                  |
| `Prefix` | `/aaa/bbb`                    | `/aaa/bbbxyz`   | Tidak  | Bukan kecocokan prefix elemen.                           |
| `Prefix` | `/, /aaa`                     | `/aaa/ccc`      | Ya     | Cocok dengan prefix `/aaa`.                              |
| `Prefix` | `/, /aaa, /aaa/bbb`           | `/aaa/bbb`      | Ya     | Cocok dengan prefix `/aaa/bbb`.                          |
| `Prefix` | `/, /aaa, /aaa/bbb`           | `/ccc`          | Ya     | Cocok dengan prefix `/`.                                 |
| `Prefix` | `/aaa`                        | `/ccc`          | Tidak  | Tidak ada kecocokan, akan menggunakan *default backend*. |
| `Mixed`  | `/foo (Prefix), /foo (Exact)` | `/foo`          | Ya     | Memilih `Exact` terlebih dahulu.                         |

#### Multiple matches

Dalam beberapa kasus, beberapa *path* dalam satu Ingress akan cocok dengan sebuah permintaan. Dalam situasi ini, prioritas akan diberikan pertama-tama kepada *path* yang paling panjang yang cocok. Jika dua *path* masih sama-sama cocok, prioritas akan diberikan pada *path* dengan tipe *path* *exact* daripada tipe *path* *prefix*.

## Hostname wildcards

*Host* dapat berupa kecocokan tepat (misalnya “`foo.bar.com`”) atau *wildcard* (misalnya “`*.foo.com`”). Kecocokan tepat memerlukan bahwa *header* HTTP `host` cocok dengan *field* `host`. Kecocokan *wildcard* memerlukan *header* HTTP `host` sama dengan *suffix* dari aturan *wildcard*.


| Host        | Header Host       | Cocok?                                                  |
|-------------|-------------------|---------------------------------------------------------|
| `*.foo.com` | `bar.foo.com`     | Cocok berdasarkan *suffix* yang sama                    |
| `*.foo.com` | `baz.bar.foo.com` | Tidak cocok, *wildcard* hanya mencakup satu *label* DNS |
| `*.foo.com` | `foo.com`         | Tidak cocok, *wildcard* hanya mencakup satu *label* DNS |

{{% code_sample file="service/networking/ingress-wildcard-host.yaml" %}}


## Ingress class

Ingress dapat diimplementasikan oleh *controller* yang berbeda, seringkali dengan konfigurasi yang berbeda. Setiap Ingress sebaiknya menentukan *class*, yaitu referensi ke *resource* IngressClass yang memuat konfigurasi tambahan termasuk nama *controller* yang seharusnya mengimplementasikan *class* tersebut.

{{% code_sample file="service/networking/external-lb.yaml" %}}


*Field* `.spec.parameters` dari IngressClass memungkinkan kamu mereferensikan *resource* lain yang menyediakan konfigurasi terkait dengan IngressClass tersebut.

Jenis parameter spesifik yang digunakan tergantung pada *ingress controller* yang kamu tentukan di *field* `.spec.controller` dari IngressClass.

### Ruang lingkup IngressClass

Tergantung pada *ingress controller* kamu, kamu dapat menggunakan parameter yang kamu atur di seluruh klaster, atau hanya untuk satu *namespace*.

{{% tabs name="tabs_ingressclass_parameter_scope" %}}
{{% tab name="Cluster" %}}
Ruang lingkup default untuk parameter IngressClass adalah seluruh klaster.Jika kamu mengatur field .spec.parameters dan tidak mengatur .spec.parameters.scope, atau jika kamu mengatur .spec.parameters.scope ke klaster, maka IngressClass merujuk ke resource berskop klaster. Kind (dikombinasikan dengan apiGroup) dari parameter merujuk ke API berskop klaster (kemungkinan custom resource), dan name dari parameter mengidentifikasi resource berskop klaster tertentu untuk API tersebut.
For example:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-1
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in a
    # ClusterIngressParameter (API group k8s.example.net) named
    # "external-config-1". This definition tells Kubernetes to
    # look for a cluster-scoped parameter resource.
    scope: Cluster
    apiGroup: k8s.example.net
    kind: ClusterIngressParameter
    name: external-config-1
```

{{% /tab %}}
{{% tab name="Namespaced" %}}
{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Jika kamu mengatur *field* `.spec.parameters` dan mengatur `.spec.parameters.scope` ke `Namespace`, maka IngressClass merujuk ke *resource* berskop namespace. Kamu juga harus mengatur *field* `namespace` di dalam `.spec.parameters` ke *namespace* yang memuat parameter yang ingin kamu gunakan.

*Kind* (bersama dengan `apiGroup`) dari parameter merujuk ke API berskop *namespace* (misalnya: ConfigMap), dan `name` dari parameter mengidentifikasi *resource* tertentu di *namespace* yang kamu tentukan di `namespace`.

Parameter berskop namespace membantu operator klaster mendelegasikan kontrol atas konfigurasi (misalnya: pengaturan *load balancer*, definisi *API gateway*) yang digunakan untuk *workload*. Jika kami menggunakan parameter berskop klaster, maka:

- tim operator klaster perlu menyetujui perubahan dari tim lain setiap kali ada konfigurasi baru yang diterapkan.
- tim operator klaster harus mendefinisikan kontrol akses spesifik, seperti *role* dan *binding* [RBAC](/docs/reference/access-authn-authz/rbac/), yang memungkinkan tim aplikasi membuat perubahan pada resource parameter berskop klaster.

API IngressClass itu sendiri selalu berskop klaster.

Berikut adalah contoh IngressClass yang merujuk ke parameter berskop *namespace*:

```yaml
---
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: external-lb-2
spec:
  controller: example.com/ingress-controller
  parameters:
    # The parameters for this IngressClass are specified in an
    # IngressParameter (API group k8s.example.com) named "external-config",
    # that's in the "external-configuration" namespace.
    scope: Namespace
    apiGroup: k8s.example.com
    kind: IngressParameter
    namespace: external-configuration
    name: external-config
```

{{% /tab %}}
{{% /tabs %}}

### Anotasi yang sudah tidak digunakan (Deprecated annotation)

Sebelum *resource* IngressClass dan *field* `ingressClassName` ditambahkan di Kubernetes 1.18, *class* Ingress ditentukan menggunakan anotasi `kubernetes.io/ingress.class` pada Ingress. Anotasi ini tidak pernah didefinisikan secara formal, tetapi didukung secara luas oleh *Ingress controller*.

*Field* `ingressClassName` yang lebih baru pada Ingress adalah pengganti untuk anotasi tersebut, tetapi tidak sepenuhnya setara. Meskipun anotasi umumnya digunakan untuk mereferensikan nama *Ingress controller* yang seharusnya mengimplementasikan Ingress, *field* `ingressClassName` adalah referensi ke *resource* IngressClass yang memuat konfigurasi Ingress tambahan, termasuk nama *Ingress controller*.


### IngressClass default {#default-ingress-class}

Kamu dapat menandai IngressClass tertentu sebagai *default* untuk klaster kamu. Mengatur anotasi `ingressclass.kubernetes.io/is-default-class` ke `true` pada *resource* IngressClass akan memastikan bahwa Ingress baru tanpa *field* `ingressClassName` yang ditentukan akan ditetapkan IngressClass *default* ini.

{{< caution >}}
Jika kamu memiliki lebih dari satu IngressClass yang ditandai sebagai *default* untuk *klaster* kamu, *admission controller* mencegah pembuatan objek Ingress baru yang tidak memiliki `ingressClassName` yang ditentukan. Kamu dapat menyelesaikan masalah ini dengan memastikan bahwa paling banyak 1 IngressClass ditandai sebagai *default* di *klaster* kamu.
{{< /caution >}}

Mulailah dengan mendefinisikan IngressClass *default*. Namun, disarankan untuk menentukan IngressClass *default*:

{{% code_sample file="service/networking/default-ingressclass.yaml" %}}


## Jenis-jenis Ingress

### Ingress dengan satu Service {#single-service-ingress}

Ada konsep Kubernetes yang sudah ada yang memungkinkan kamu mengekspos satu *Service* (lihat [alternatif](#alternatives)). Kamu juga bisa melakukan ini dengan Ingress dengan menentukan *default backend* tanpa aturan.

{{% code_sample file="service/networking/test-ingress.yaml" %}}


Jika kamu membuatnya menggunakan `kubectl apply -f`, kamu akan dapat melihat *state* Ingress yang kamu tambahkan:


```bash
kubectl get ingress test-ingress
```

```
NAME           CLASS         HOSTS   ADDRESS         PORTS   AGE
test-ingress   external-lb   *       203.0.113.123   80      59s
```

Di mana 203.0.113.123 adalah IP yang dialokasikan oleh Ingress controller untuk memenuhi Ingress ini.

{{< note >}}
Ingress controller dan *load balancer* mungkin membutuhkan satu atau dua menit untuk mengalokasikan alamat IP. Sampai saat itu, kamu sering melihat alamat dicantumkan sebagai `<pending>`.
{{< /note >}}

### Fanout sederhana (Simple fanout)

Konfigurasi *fanout* mengarahkan lalu lintas dari satu alamat IP ke lebih dari satu *Service*, berdasarkan URI HTTP yang diminta. Ingress memungkinkan kamu untuk meminimalkan jumlah *load balancer*. Contoh *setup* seperti:

{{< figure src="/docs/images/ingressFanOut.svg" alt="diagram-ingress-fanout" class="diagram-large" caption="Gambar. Ingress Fan Out" link="https://mermaid.live/edit#pako:eNqNUslOwzAQ_RXLvYCUhMQpUFzUUzkgcUBwbHpw4klr4diR7bCo8O8k2FFbFomLPZq3jP00O1xpDpjijWHtFt09zAuFUCUFKHey8vf6NE7QrdoYsDZumGIb4Oi6NAskNeOoZJKpCgxK4oXwrFVgRyi7nCVXWZKRPMlysv5yD6Q4Xryf1Vq_WzDPooJs9egLNDbolKTpT03JzKgh3zWEztJZ0Niu9L-qZGcdmAMfj4cxvWmreba613z9C0B-AMQD-V_AdA-A4j5QZu0SatRKJhSqhZR0wjmPrDP6CeikrutQxy-Cuy2dtq9RpaU2dJKm6fzI5Glmg0VOLio4_5dLjx27hFSC015KJ2VZHtuQvY2fuHcaE43G0MaCREOow_FV5cMxHZ5-oPX75UM5avuXhXuOI9yAaZjg_aLuBl6B3RYaKDDtSw4166QrcKE-emrXcubghgunDaY1kxYizDqnH99UhakzHYykpWD9hjS--fEJoIELqQ">}}

Ini akan membutuhkan Ingress seperti:

{{% code_sample file="service/networking/simple-fanout-example.yaml" %}}

Saat kamu membuat Ingress dengan `kubectl apply -f`:

```shell
kubectl describe ingress simple-fanout-example
```

```
Name:              simple-fanout-example
Namespace:         default
Address:           178.91.123.132
Default backend:   default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host             Path  Backends
  ----             ----  --------
  foo.bar.com
                   /foo    service1:4200 (10.8.0.90:4200)
                   /bar    service2:8080 (10.8.0.91:8080)

Events:

  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

Ingress controller akan menyiapkan *load balancer* implementasi-spesifik
yang memenuhi Ingress, selama Service (`service1`, `service2`) ada.
Setelah selesai, kamu dapat melihat alamat *load balancer* di *field* `Address`.

{{< note >}}
Tergantung pada Ingress controller yang kamu gunakan, kamu mungkin perlu membuat `default-http-backend` Service.
{{< /note >}}

### Name based virtual hosting

*Virtual host* berbasis nama mendukung pengalihan *lalu lintas* HTTP ke beberapa nama *host* pada alamat IP yang sama.

{{< figure src="/docs/images/ingressNameBased.svg" alt="diagram-ingress-namebased" class="diagram-large" caption="Gambar. Ingress Name-based Virtual Hosting" link="https://mermaid.live/edit#pako:eNqNkl9PwyAUxb8KYS-atM1Kp05m9qSJJj4Y97jugcLtRqTQAPVPdN_dVlq3qUt8gZt7zvkBN7xjbgRgiteW1Rt0_zjLNUJcSdD-ZBn21WmcoDu9tuBcXDHN1iDQVWHnSBkmUMEU0xwsSuK5DK5l745QejFNLtMkJVmSZmT1Re9NcTz_uDXOU1QakxTMJtxUHw7ss-SQLhehQEODTsdH4l20Q-zFyc84-Y67pghv5apxHuweMuj9eS2_NiJdPhix-kMgvwQShOyYMNkJoEUYM3PuGkpUKyY1KqVSdCSEiJy35gnoqCzLvo5fpPAbOqlfI26UsXQ0Ho9nB5CnqesRGTnncPYvSqsdUvqp9KRdlI6KojjEkB0mnLgjDRONhqENBYm6oXbLV5V1y6S7-l42_LowlIN2uFm_twqOcAW2YlK0H_i9c-bYb6CCHNO2FFCyRvkc53rbWptaMA83QnpjMS2ZchBh1nizeNMcU28bGEzXkrV_pArN7Sc0rBTu">}}

Ingress berikut memberitahu load balancer backing untuk merutekan permintaan berdasarkan Host header.

{{% code_sample file="service/networking/name-virtual-host-ingress.yaml" %}}



Jika kamu membuat *resource* Ingress tanpa *host* yang didefinisikan dalam aturan, maka setiap lalu lintas web ke alamat IP dari *Ingress controller* kamu dapat dicocokkan tanpa memerlukan *virtual host* berbasis nama.

Sebagai contoh, Ingress berikut mengarahkan lalu lintas yang diminta untuk `first.bar.com` ke `service1`, `second.bar.com` ke `service2`, dan semua lalu lintas yang *header host* permintaannya tidak cocok dengan `first.bar.com` dan `second.bar.com` ke `service3`.

{{% code_sample file="service/networking/name-virtual-host-ingress-no-third-host.yaml" %}}


### TLS

kamu dapat mengamankan Ingress dengan menentukan {{< glossary_tooltip term_id="secret" >}}
yang berisi kunci privat TLS dan sertifikat. *Resource* Ingress hanya
mendukung satu *port* TLS, yaitu 443, dan mengasumsikan terminasi TLS pada titik Ingress
(lalu lintas ke *Service* dan *Pod* terkait dalam *plaintext*). Jika bagian konfigurasi TLS
dalam Ingress menentukan *host* yang berbeda, *host-host* tersebut di-*multiplex* pada *port* yang sama
berdasarkan *hostname* yang ditentukan melalui ekstensi TLS SNI (dengan syarat *Ingress controller* mendukung SNI).
*Secret* TLS harus memuat kunci bernama `tls.crt` dan `tls.key` yang berisi sertifikat dan kunci privat untuk digunakan bagi TLS.

For example:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
type: kubernetes.io/tls
```

Mengacu pada *secret* ini dalam Ingress memberi tahu *Ingress controller* untuk mengamankan saluran dari *client* ke *load balancer* menggunakan TLS. Kamu perlu memastikan *secret* TLS yang kamu buat berasal dari sertifikat yang memuat *Common Name* (CN), juga dikenal sebagai *Fully Qualified Domain Name* (FQDN) untuk `https-example.foo.com`.

{{< note >}}
Ingatlah bahwa TLS tidak akan bekerja pada aturan *default* karena sertifikat harus dikeluarkan untuk semua kemungkinan *sub-domain*. Oleh karena itu, *host* pada bagian TLS harus secara eksplisit cocok dengan *host* di bagian *rules*.
{{< /note >}}

{{% code_sample file="service/networking/tls-example-ingress.yaml" %}}

{{< note >}}
Fitur TLS yang didukung oleh berbagai Ingress controller bisa berbeda.
Lihat dokumentasi Ingress controller yang digunakan untuk memahami cara kerja TLS di lingkunganAnda.
{{< /note >}}

### Load balancing {#load-balancing}

*Ingress controller* di-*bootstrapping* dengan beberapa pengaturan kebijakan *load balancing* yang diterapkan ke semua Ingress, seperti algoritma *load balancing*, skema bobot *backend*, dan lainnya. Konsep *load balancing* yang lebih canggih (misalnya: *persistent sessions*, bobot dinamis) belum diekspos melalui Ingress. Sebagai gantinya, kamu bisa mendapatkan fitur-fitur ini melalui *load balancer* yang digunakan untuk *Service*.

Penting juga untuk dicatat bahwa meskipun pemeriksaan kesehatan (*health check*) tidak diekspos secara langsung melalui Ingress, ada konsep paralel di Kubernetes seperti *readiness probes* yang memungkinkan kamu mencapai hasil akhir yang sama. Harap tinjau dokumentasi spesifik *controller* untuk melihat bagaimana mereka menangani pemeriksaan kesehatan.

### Memperbarui Ingress (Updating an Ingress)

Untuk menambahkan *Host* baru pada Ingress yang sudah ada, kamu dapat memperbaruinya dengan mengedit *resource*:

```shell
kubectl describe ingress test
Name:              test
Namespace:         default
Address:           178.91.123.132
Default backend:   default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host             Path  Backends
  ----             ----  --------
  foo.bar.com
                   /foo    service1:80 (10.8.0.90:80)
Events:
  Type     Reason  Age                 From                        Message
  ----     ------  ----                ----                        -------
  Normal   ADD     35s                 loadbalancer-controller     default/test
```

```shell
kubectl edit ingress test
```

Ini akan memunculkan editor dengan konfigurasi yang ada dalam format YAML. Modifikasi untuk menyertakan Host baru:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          service:
            name: service1
            port:
              number: 80
        path: /foo
        pathType: Prefix
  - host: bar.baz.com
    http:
      paths:
      - backend:
          service:
            name: service2
            port:
              number: 80
        path: /foo
        pathType: Prefix
```

Setelah kamu menyimpan perubahan, kubectl memperbarui resource di API server, yang memberitahu Ingress controller untuk mengonfigurasi ulang load balancer.


Verifikasi ini:

```shell
kubectl describe ingress test
```

```
Name:              test
Namespace:         default
Address:           178.91.123.132
Default backend:   default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host             Path  Backends
  ----             ----  --------
  foo.bar.com
                   /foo    service1:80 (10.8.0.90:80)
  bar.baz.com
                   /foo    service2:80 (10.8.0.91:80)
Events:
  Type     Reason  Age                 From                        Message
  ----     ------  ----                ----                        -------
  Normal   ADD     45s                 loadbalancer-controller     default/test
```

kamu dapat mencapai hasil yang sama dengan memanggil kubectl replace -f pada file YAML Ingress yang telah dimodifikasi.

## Kegagalan di seluruh Availability Zone (Failing across availability zones)

Teknik untuk menyebarkan lalu lintas di seluruh domain kegagalan berbeda-beda antara penyedia layanan cloud.
Harap periksa dokumentasi dari [Ingress controller](/docs/concepts/services-networking/ingress-controllers) yang relevan untuk detailnya.

## Alternatif (Alternatives)

kamu dapat mengekspos Service dengan berbagai cara yang tidak secara langsung melibatkan resource Ingress:

* Gunakan [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)

* Gunakan [Service.Type=*Node*Port](/docs/concepts/services-networking/service/#type-*Node*Port)

## {{% heading "whatsnext" %}}

* Pelajari tentang API[Ingress](/docs/reference/kubernetes-api/service-resources/ingress-v1/)

* Pelajari tentang[Ingress controllers](/docs/concepts/services-networking/ingress-controllers/)
