---
title: Service Catalog
reviewers:
- chenopis
content_type: concept
weight: 40
---

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="Service Catalog adalah" >}}  

Sebuah makelar servis (_service broker_), seperti yang didefinisikan oleh [spesifikasi API makelar servis terbuka]
(https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md), adalah sebuah
_endpoint_ untuk beberapa layanan terkelola yang ditawarkan dan dikelola oleh pihak ketiga,
yang bisa jadi sebuah penyedia layanan _cloud_ seperti AWS, GCP atau Azure.

Beberapa contoh dari servis terkelola adalah Microsoft Azure Cloud Queue, Amazon Simple Queue Service, dan
Google Cloud Pub/Sub, selain itu, bisa juga penawaran perangkat lunak apa pun yang dapat digunakan oleh suatu aplikasi.

Dengan menggunakan Service Catalog,
seorang {{< glossary_tooltip text="pengelola klaster" term_id="cluster-operator" >}} dapat melihat
daftar servis terkelola yang ditawarkan oleh makelar servis, melakukan pembuatan terhadap
sebuah servis terkelola, dan menghubungkan (_bind_) untuk membuat tersedia terhadap aplikasi pada suatu klaster Kubernetes.




<!-- body -->
## Contoh kasus penggunaan

Seorang {{< glossary_tooltip text="pengembang aplikasi" term_id="application-developer" >}} ingin menggunakan
sistem antrian pesan sebagai bagian dari aplikasinya yang berjalan dalam klaster Kubernetes. 
Namun, mereka tidak ingin berurusan dengan kesulitan dalam pengaturan, misalnya menjaga servis tetap
berjalan dan mengatur itu oleh mereka sendiri. Beruntungnya, sudah tersedia penyedia layanan _cloud_ 
yang menawarkan sistem antrian pesan sebagai servis terkelola melalui makelar servisnya. 

Seorang pengelola klaster dapat membuat Service Catalog dan menggunakannya untuk berkomunikasi dengan 
makelar servis milik penyedia layanan _cloud_ untuk menyediakan sebuah servis antrian pesan dan membuat
servis ini tersedia kepada aplikasi dalam klaster Kubernetes.
Seorang pengembang aplikasi tidak perlu memikirkan detail implementasi atau mengatur sistem antrian pesan tersebut.
Aplikasi dapat langsung menggunakan servis tersebut.

## Arsitektur
Service Catalog menggunakan [API dari Open Service Broker](https://github.com/openservicebrokerapi/servicebroker)
untuk berkomunikasi dengan makelar servis, bertindak sebagai perantara untuk API Server Kubernetes untuk
merundingkan penyediaan awal dan mengambil kredensial untuk aplikasi bisa menggunakan servis terkelola tersebut.

Ini terimplementasi sebagai ekstensi API Server dan pengontrol, menggunakan etcd sebagai media penyimpanan.
Ini juga menggunakan [lapisan agregasi](/id/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
yang tersedia pada Kubernetes versi 1.7+ untuk menampilkan API-nya.

<br>

![Arsitektur Service Catalog](/images/docs/service-catalog-architecture.svg)


### Sumber Daya API

Service Catalog memasang API `servicecatalog.k8s.io` dan menyediakan beberapa sumber daya Kubernetes berikut:

* `ClusterServiceBroker`: Sebuah representasi dalam klaster untuk makelar servis, membungkus detail koneksi peladen.
  Ini dibuat dan dikelola oleh pengelola klaster yang berharap untuk menggunakan makelar peladen untuk membuat
  tipe baru dari sebuah servis terkelola yang tersedia dalam klaster mereka.
* `ClusterServiceClass`: Sebuah servis terkelola ditawarkan oleh beberapa makelar servis.
  Ketika sumber daya `ClusterServiceBroker` ditambahkan ke dalam klaster, kontroler Service Catalog terhubung
  ke makelar servis untuk mendapatkan daftar servis terkelola yang tersedia. Kemudian membuat sumber daya
  `ClusterServiceClass` sesuai dengan masing-masing servis terkelola.
* `ClusterServicePlan`: Sebuah penawaran khusus dari servis terkelola. Sebagai contoh, sebuah servis terkelola 
  bisa memiliki model harga, yaitu gratis atau berbayar, atau ini mungkin juga memiliki konfigurasi pilihan berbeda,
  misal menggunakan penyimpanan SSD atau memiliki sumber daya lebih. Mirip dengan `ClusterServiceClass`, ketika
  `ClusterServiceBroker` baru ditambahkan ke dalam klaster, Service Catalog akan membuat sumber daya 
  `ClusterServicePlan` sesuai dengan _Service Plan_ yang tersedia untuk masing-masing servis terkelola.
* `ServiceInstance`: Sebuah objek dari `ClusterServiceClass`. 
  Ini dibuat oleh operator klaster untuk membuat bentuk spesifik dari servis terkelola yang tersedia untuk
  digunakan oleh salah satu atau lebih aplikasi dalam klaster.
  Ketika sumber daya `ServiceInstance` baru terbuat, pengontrol Service Catalog terhubung ke makelar servis yang
  sesuai dan menginstruksikan untuk menyediakan sebuah objek servis.
* `ServiceBinding`: Kredensial untuk mengakses suatu `ServiceInstance`.
  Ini dibuat oleh operator klaster yang ingin aplikasinya untuk menggunakan sebuah `ServiceInstance`.
  Saat dibuat, kontroler Service Catalog membuat sebuah `Secret` Kubernetes yang berisikan detail koneksi
  dan kredensial untuk objek servis, yang bisa dimuat ke dalam Pod.

### Autentikasi

Service Catalog mendukung beberapa metode autentikasi, yaitu:

* Basic (nama pengguna/kata sandi)
* [OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)

## Penggunaan

Seorang operator klaster dapat menggunakan API sumber daya Service Catalog untuk membuat servis terkelola
dan membuatnya tersedia dalam klaster Kubernetes. Langkah yang dilalui adalah sebagai berikut:

1. Membuat daftar servis terkelola dan model pembayaran yang tersedia dari makelar servis.
2. Membuat sebuah objek dari suatu servis terkelola.
3. Menghubungkan ke servis terkelola, yang mengembalikan kredensial koneksi.
4. Memetakan kredensial koneksi ke dalam aplikasi.

### Membuat daftar servis terkelola dan model pembayaran

Pertama, seorang operator klaster harus membuat sumber daya `ClusterServiceBroker` dalam kelompok
`servicecatalog.k8s.io`. Sumber daya ini memiliki URL dan detail koneksi untuk mengakses  makelar servis.

Ini ada contoh dari suatu sumber daya `ClusterServiceBroker`:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: cloud-broker
spec:
  # Merujuk pada titik akhir dari makelar servis. (Ini adalah contoh URL yang tidak nyata)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  #####
  # Nilai tambahan dapat ditambahkan disini, yang mungkin bisa digunakan untuk berkomunikasi
  # dengan makelar servis, misalnya saja informasi bearer token atau sebuah caBundle untuk TLS.
  #####
```

Berikut adalah sebuah diagram urutan yang mengilustrasikan langkah-langkah dalam mendaftarkan
servis terkelola dan model pembayaran yang tersedia dari makelar servis:

![Daftar Servis](/images/docs/service-catalog-list.svg)

1. Setelah sumber daya `ClusterServiceBroker` ditambahkan ke dalam Service Catalog, ini membuat panggilan
   makelar servis luar untuk membuat daftar servis yang tersedia.
1. Makelar servis akan mengembalikan daftar servis terkelola yang tersedia dan daftar model pembayaran, 
   yang akan disimpan sementara sebagai `ClusterServiceClass` dan `ClusterServicePlan`.
1. Seorang operator klaster bisa mendapatkan daftar servis terkelola dengan menggunakan perintah berikut ini:

        kubectl get clusterserviceclasses -o=custom-columns=SERVICE\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    Itu seharusnya memberikan daftar nama servis dengan format yang mirip dengan berikut:

        SERVICE NAME                           EXTERNAL NAME
        4f6e6cf6-ffdd-425f-a2c7-3c9258ad2468   cloud-provider-service
        ...                                    ...

    Mereka juga dapat melihat model pembayaran yang tersedia menggunakan perintah berikut:

        kubectl get clusterserviceplans -o=custom-columns=PLAN\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    Itu seharusnya memberikan daftar nama model pembayaran dengan format mirip dengan berikut:

        PLAN NAME                              EXTERNAL NAME
        86064792-7ea2-467b-af93-ac9694d96d52   service-plan-name
        ...                                    ...


### Pembuatan sebuah objek

Seorang operator klaster dapat memulai pembuatan sebuah objek dengan membuat sumber daya `ServiceInstance`.

Ini adalah contoh dari sumber daya `ServiceInstance`:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cloud-queue-instance
  namespace: cloud-apps
spec:
  # Referensi untuk salah satu servis yang pernah dikembalikan
  clusterServiceClassExternalName: cloud-provider-service
  clusterServicePlanExternalName: service-plan-name
  #####
  # Parameter tambahan dapat ditambahkan disini,
  # yang mungkin akan digunakan oleh makelar servis.
  #####
```

Berikut adalah diagram urutan yang mengilustrasikan langkah-langkah dalam pembuatan sebuah objek dari
servis terkelola:

![Pembuatan sebuah servis](/images/docs/service-catalog-provision.svg)

1. Ketika sumber daya `ServiceInstance` sudah terbuat, Service Catalog memulai pemanggilan ke makelar servis 
   luar untuk membuat sebuah objek dari suatu servis.
1. Makelar servis membuat sebuah objek baru dari suatu servis terkelola dan mengembalikan sebuah respons HTTP.
1. Seorang operator klaster dapat mengecek status dari objek untuk melihat apakah sudah siap atau belum.

### Menghubungkan ke servis terkelola

Setelah sebuah objek terbuat, klaster operator harus menghubungkan ke servis terkelola untuk mendapatkan
kredensial koneksi dan detail pengguna servis untuk aplikasi bisa mengguakan servis tersebut. Ini dilakukan
dengan membuat sebuah sumber daya `ServiceBinding`.

Berikut adalah contoh dari sumber daya `ServiceBinding`:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: cloud-queue-binding
  namespace: cloud-apps
spec:
  instanceRef:
    name: cloud-queue-instance
  #####
  # Informasi tambahan dapat ditambahkan disini, seperti misalnya secretName atau
  # parameter pengguna servis, yang mungkin akan digunakan oleh makelar servis.
  #####
```

Berikut ada diagram urutan yang mengilustrasikan langkah-langkah dalam menghubungkan objek servis terkelola.

![Menghubungkan ke servis terkelola](/images/docs/service-catalog-bind.svg)

1. Setelah `ServiceBinding` terbuat, Service Catalog memanggil makelar servis luar untuk meminta
   informasi yang dibutuhkan untuk terhubung dengan objek servis.
1. Makelar servis memberikan izin atau peran kepada aplikasi sesuai dengan pengguna servis.
1. Makelar servis mengembalikan informasi untuk bisa terhubung dan mengakses servis terkelola.
   Ini tergantung pada penyedia layanan dan servis, sehingga informasi yang dikembalikan mungkin berbeda
   antara suatu penyedia layanan dan servis terkelolanya.

### Memetakan kredensial koneksi

Setelah menghubungkan, langkah terakhir melibatkan pemetaan kredensial koneksi dan informasi spesifik mengenai
servis kedalam aplikasi. Informasi ini disimpan dalam Secrets yang mana aplikasi dalam klaster dapat mengakses 
dan menggunakan untuk bisa terkoneksi secara langsung dengan servis terkelola.

<br>

![Pemetaan kredensial koneksi](/images/docs/service-catalog-map.svg)

#### Berkas konfigurasi Pod

Salah satu metode untuk melakukan pemetaan ini adalah dengan menggunakan deklarasi konfigurasi Pod.

Berikut adalah contoh yang mendekripsikan bagaimana pemetaan kredensial pengguna servis ke dalam aplikasi.
Sebuah kunci yang disebut `sa-key` disimpan dalam media bernama `provider-cloud-key`, dan aplikasi memasang
media ini pada `/var/secrets/provider/key.json`. _Environment variable_ `PROVIDER_APPLICATION_CREDENTIALS` 
dipetakan dari nilai pada berkas yang dipasang.

```yaml
...
    spec:
      volumes:
        - name: provider-cloud-key
          secret:
            secretName: sa-key
      containers:
...
          volumeMounts:
          - name: provider-cloud-key
            mountPath: /var/secrets/provider
          env:
          - name: PROVIDER_APPLICATION_CREDENTIALS
            value: "/var/secrets/provider/key.json"
```

Berikut adalah contoh yang mendeskripsikan cara memetakan nilai rahasia ke dalam _environment variable_ aplikasi.
Dalam contoh ini, nama topik dari sistem antrian pesan dipetakan dari _secret_ bernama `provider-queue-credentials`
dengan nama `topic` ke dalam _environment variable_ `TOPIC`.


```yaml
...
          env:
          - name: "TOPIC"
            valueFrom:
                secretKeyRef:
                   name: provider-queue-credentials
                   key: topic
```




## {{% heading "whatsnext" %}}

* Jika kamu terbiasa dengan {{< glossary_tooltip text="Helm Charts" term_id="helm-chart" >}}, 
  [pasang Service Catalog menggunakan Helm](/docs/tasks/service-catalog/install-service-catalog-using-helm/)
  ke dalam klaster Kubernetes. Alternatif lain, kamu dapat [memasang Service Catalog dengan SC tool](/docs/tasks/service-catalog/install-service-catalog-using-sc/).
* Lihat [contoh makelar servis](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Pelajari mengenai [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) proyek.





