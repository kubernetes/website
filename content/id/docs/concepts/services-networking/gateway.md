---
title: Gateway API
content_type: concept
description: >-
  Gateway API merupakan bagian dari API yang menyediakan penyediaan infrastruktur dinamis dan pengaturan trafik lanjutan.
weight: 55
---

<!-- overview -->

Gateway API menyediakan layanan jaringan dengan menggunakan mekanisme konfigurasi yang mudah di-_extend_, berorientasi _role_, dan mengerti konsep protokol. [Gateway API](https://gateway-api.sigs.k8s.io/) adalah sebuah {{<glossary_tooltip text="add-on" term_id="addons">}} yang berisi [jenis-jenis](https://gateway-api.sigs.k8s.io/references/spec/) API yang menyediakan penyediaan infrastruktur dinamis dan pengaturan trafik tingkat lanjut.

<!-- body -->

## Prinsip Desain

Prinsip-prinsip berikut membentuk desain dan arsitektur Gateway API:

* __Berorientasi _role_:__ Gateway API dimodelkan sesuai dengan _role_ organisasi yang bertanggung jawab untuk mengelola jaringan layanan Kubernetes:
  * __Penyedia Infrastruktur:__ Mengelola infrastruktur yang memungkinkan beberapa klaster terisolasi untuk melayani beberapa _tenant_, misalnya penyedia layanan _cloud_.
  * __Operator klaster:__ Mengelola klaster dan biasanya memperhatikan kebijakan, akses jaringan, izin aplikasi, dll.
  * __Pengembang Aplikasi:__ Mengelola aplikasi yang berjalan di dalam klaster dan biasanya memperhatikan konfigurasi tingkat aplikasi dan komposisi [Service](/docs/concepts/services-networking/service/).
* __Portabel:__ Spesifikasi Gateway API didefinisikan sebagai [Custom Resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources) dan didukung oleh banyak [implementasi](https://gateway-api.sigs.k8s.io/implementations/).
* __Ekspresif:__ Jenis-jenis Gateway API mendukung fungsi untuk kasus penggunaan routing trafik pada umumnya, seperti pencocokan berbasis header, pembobotan trafik, dan lainnya yang sebelumnya hanya mungkin dilakukan di [Ingress](/docs/concepts/services-networking/ingress/) dengan menggunakan anotasi kustom.
* __Dapat diperluas:__ Gateway memungkinkan sumber daya kustom untuk dihubungkan pada berbagai lapisan API. Ini memungkinkan penyesuaian yang lebih detail pada tempat yang tepat dalam struktur API.

## Model Sumber Daya (_Resource_)

Gateway API memiliki tiga jenis API stabil:

* __GatewayClass:__ Mendefinisikan satu set gateway dengan konfigurasi umum dan dikelola oleh pengendali yang mengimplementasikan kelas tersebut.

* __Gateway:__ Mendefinisikan instans infrastruktur penanganan trafik, seperti penyeimbang beban (_load balancer_) _cloud_.

* __HTTPRoute:__ Mendefinisikan aturan khusus HTTP untuk memetakan trafik dari pendengar (_listener_) Gateway ke representasi titik akhir (_endpoint_) jaringan backend. Titik akhir ini sering diwakili sebagai sebuah {{<glossary_tooltip text="Service" term_id="service">}}.

Gateway API diatur ke dalam berbagai jenis API yang memiliki hubungan saling ketergantungan untuk mendukung sifat berorientasi _role_ dari organisasi. Objek Gateway dikaitkan dengan tepat satu GatewayClass; GatewayClass menggambarkan pengendali gateway yang bertanggung jawab untuk mengelola Gateway dari kelas ini. Satu atau lebih jenis rute seperti HTTPRoute, kemudian dikaitkan dengan Gateway. Sebuah Gateway dapat memfilter rute yang mungkin akan dilampirkan pada `listeners`-nya, membentuk model kepercayaan dua arah dengan rute.

Gambar berikut mengilustrasikan hubungan dari tiga jenis Gateway API yang stabil:

{{< figure src="/docs/images/gateway-kind-relationships.svg" alt="Gambar yang mengilustrasikan hubungan dari tiga jenis Gateway API yang stabil" class="diagram-medium" >}}

### Gateway {#api-kind-gateway}

Gateway menggambarkan sebuah instans infrastruktur penanganan trafik. Ini mendefinisikan titik akhir jaringan yang dapat digunakan untuk memproses trafik, seperti penyaringan (_filter_), penyeimbangan (_balancing_), pemisahan (_splitting_), dll. untuk backend seperti sebuah Service. Sebagai contoh, Gateway dapat mewakili penyeimbang beban (_load balancer_) _cloud_ atau server proksi dalam klaster yang dikonfigurasikan untuk menerima trafik HTTP.

Contoh minimal dari Gateway _resource_:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: example-class
  listeners:
  - name: http
    protocol: HTTP
    port: 80
```

Dalam contoh ini, sebuah instans dari infrastruktur penanganan trafik diprogram untuk mendengarkan trafik HTTP pada port 80. Karena _field_ `addresses` tidak ditentukan, sebuah alamat atau nama host ditugaskan ke Gateway oleh pengendali implementasi. Alamat ini digunakan sebagai titik akhir jaringan untuk memproses trafik titik akhir jaringan backend yang didefinisikan dalam rute.

Lihat [Gateway](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.Gateway) referensi untuk definisi lengkap dari API ini.

### HTTPRoute {#api-kind-httproute}

Jenis HTTPRoute menentukan perilaku _routing_ dari permintaan HTTP dari _listener_ Gateway ke titik akhir jaringan backend. Untuk backend Service, implementasi dapat mewakili titik akhir jaringan backend sebagai IP Service atau Endpoints pendukung dari Service tersebut. HTTPRoute mewakili konfigurasi yang diterapkan pada implementasi Gateway yang mendasarinya. Sebagai contoh, mendefinisikan HTTPRoute baru dapat mengakibatkan pengaturan rute trafik tambahan pada penyeimbang beban _cloud_ atau server proksi dalam klaster.

Contoh minimal dari HTTPRoute:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-httproute
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "www.example.com"
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /login
    backendRefs:
    - name: example-svc
      port: 8080
```

Dalam contoh ini, trafik HTTP dari Gateway `example-gateway` dengan header Host: yang disetel ke `www.example.com` dan jalur permintaan yang ditentukan sebagai `/login` akan diarahkan ke Service `example-svc` pada port `8080`.

Lihat referensi [HTTPRoute](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRoute) untuk definisi lengkap dari API ini.

## Aliran Permintaan (_Request Flow_)

Berikut adalah contoh sederhana dari trafik HTTP yang diarahkan ke sebuah Service menggunakan Gateway dan HTTPRoute:

{{< figure src="/docs/images/gateway-request-flow.svg" alt="Diagram yang memberikan contoh trafik HTTP yang diarahkan ke sebuah Service menggunakan Gateway dan HTTPRoute" class="diagram-medium" >}}

Dalam contoh ini, aliran permintaan untuk Gateway yang diimplementasikan sebagai _reverse proxy_ adalah:

1. Klien mulai mempersiapkan permintaan HTTP untuk URL `http://www.example.com`
2. Resolver DNS klien melakukan query untuk nama tujuan dan mengetahui pemetaan ke satu atau lebih alamat IP yang terkait dengan Gateway.
3. Klien mengirimkan permintaan ke alamat IP Gateway; _reverse proxy_ menerima permintaan HTTP dan menggunakan header Host: untuk mencocokkan konfigurasi yang berasal dari Gateway dan HTTPRoute yang terlampir.
4. Secara opsional, _reverse proxy_ dapat melakukan pencocokan header permintaan dan/atau jalur berdasarkan aturan pencocokan dari HTTPRoute.
5. Secara opsional, _reverse proxy_ dapat memodifikasi permintaan; sebagai contoh, untuk menambah atau menghapus header, berdasarkan aturan filter dari HTTPRoute.
6. Terakhir, _reverse proxy_ meneruskan permintaan ke satu atau lebih backend.

## Kesesuaian (_Conformance_)

Gateway API mencakup beragam fitur dan diimplementasikan secara luas. Kombinasi ini memerlukan definisi dan pengujian kesesuaian yang jelas untuk memastikan bahwa API memberikan pengalaman yang konsisten di mana pun digunakan.

Lihat dokumentasi [conformance](https://gateway-api.sigs.k8s.io/concepts/conformance/) untuk memahami rincian seperti saluran rilis (_release channel_), tingkat dukungan, dan menjalankan tes kesesuaian (_conformance test_).

## Migrasi dari Ingress

Gateway API adalah penerus API [Ingress](/docs/concepts/services-networking/ingress/) tapi tidak termasuk dalam jenis Ingress. Akibatnya, konversi satu kali dari sumber daya Ingress yang ada ke sumber daya Gateway API diperlukan.

Referensi panduan [migrasi ingress](https://gateway-api.sigs.k8s.io/guides/getting-started/migrating-from-ingress) untuk rincian tentang migrasi sumber daya Ingress ke sumber daya Gateway API.

## {{% heading "whatsnext" %}}

Alih-alih sumber daya Gateway API yang diimplementasikan secara natif oleh Kubernetes, spesifikasinya didefinisikan sebagai [Custom Resource Definition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) yang didukung oleh berbagai [implementasi](https://gateway-api.sigs.k8s.io/implementations/). 
[Instal](https://gateway-api.sigs.k8s.io/guides/#installing-gateway-api) CRD Gateway API atau ikuti petunjuk instalasi dari implementasi yang kamu pilih. Setelah menginstal sebuah implementasi, gunakan panduan [Memulai](https://gateway-api.sigs.k8s.io/guides/) untuk membantu kamu segera memulai bekerja dengan Gateway API.

{{< note >}}
Pastikan untuk meninjau dokumentasi dari implementasi yang kamu pilih untuk memahami hal-hal yang perlu diperhatikan.
{{< /note >}}

Referensi [spesifikasi API](https://gateway-api.sigs.k8s.io/reference/spec/) untuk rincian tambahan dari semua jenis Gateway API.