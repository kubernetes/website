---
title: EndpointSlice
feature:
  title: EndpointSlice
  description: >
    Pelacakan _endpoint_ jaringan yang dapat diskalakan pada klaster Kubernetes.

content_type: concept
weight: 15
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.17" state="beta" >}}

EndpointSlice menyediakan sebuah cara yang mudah untuk melacak _endpoint_ jaringan dalam sebuah
klaster Kubernetes. EndpointSlice memberikan alternatif yang lebih _scalable_ dan lebih dapat diperluas dibandingkan dengan Endpoints.



<!-- body -->

## Motivasi

Endpoints API telah menyediakan sebuah cara yang mudah dan sederhana untuk
melacak _endpoint_ jaringan pada Kubernetes. Sayangnya, seiring dengan besarnya klaster Kubernetes
dan Service, batasan-batasan yang dimiliki API tersebut semakin terlihat.
Terutama, hal tersebut termasuk kendala-kendala mengenai proses _scaling_ _endpoint_ jaringan
dalam jumlah yang besar.

Karena semua _endpoint_ jaringan untuk sebuah Service disimpan dalam satu sumber daya 
Endpoints, sumber daya tersebut dapat menjadi cukup besar. Hal itu dapat mempengaruhi kinerja
dari komponen-komponen Kubernetes (terutama _master control plane_) dan menyebabkan
lalu lintas jaringan dan pemrosesan yang cukup besar ketika Endpoints berubah.
EndpointSlice membantu kamu menghindari masalah-masalah tersebut dan juga menyediakan platform
yang dapat diperluas untuk fitur-fitur tambahan seperti _topological routing_.

## Sumber daya EndpointSlice

Pada Kubernetes, sebuah EndpointSlice memiliki referensi-referensi terhadap sekumpulan _endpoint_
jaringan. _Controller_ EndpointSlice secara otomatis membuat EndpointSlice
untuk sebuah Service Kubernetes ketika sebuah {{< glossary_tooltip text="selektor"
term_id="selector" >}} dituliskan. EndpointSlice tersebut akan memiliki
referensi-referensi menuju Pod manapun yang cocok dengan selektor pada Service tersebut. EndpointSlice mengelompokkan
_endpoint_ jaringan berdasarkan kombinasi Service dan Port yang unik.
Nama dari sebuah objek EndpointSlice haruslah berupa
[nama subdomain DNS](/id/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) yang sah.

Sebagai contoh, berikut merupakan sampel sumber daya EndpointSlice untuk sebuah Service Kubernetes 
yang bernama `example`.

```yaml
apiVersion: discovery.k8s.io/v1beta1
kind: EndpointSlice
metadata:
  name: example-abc
  labels:
    kubernetes.io/service-name: example
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    topology:
      kubernetes.io/hostname: node-1
      topology.kubernetes.io/zone: us-west2-a
```

Secara bawaan, setiap EndpointSlice yang dikelola oleh _controller_ EndpointSlice tidak akan memiliki
lebih dari 100 _endpoint_. Di bawah skala tersebut, EndpointSlice akan memetakan 1:1
dengan Endpoints dan Service dan akan memiliki kinerja yang sama.

EndpointSlice dapat bertindak sebagai sumber kebenaran untuk kube-proxy sebagai acuan mengenai
bagaimana cara untuk merutekan lalu lintas jaringan internal. Ketika diaktifkan, EndpointSlice semestinya memberikan peningkatan
kinerja untuk Service yang memiliki Endpoints dalam jumlah besar.

### Tipe-tipe Alamat

EndpointSlice mendukung tiga tipe alamat:

* IPv4
* IPv6
* FQDN (_Fully Qualified Domain Name_)

### Topologi

Setiap _endpoint_ pada EndpointSlice dapat memiliki informasi topologi yang relevan.
Hal ini digunakan untuk mengindikasikan di mana _endpoint_ berada, berisi informasi mengenai
Node yang bersangkutan, zona, dan wilayah. Ketika nilai-nilai tersebut tersedia,
label-label Topology berikut akan ditambahkan oleh _controller_ EndpointSlice:

* `kubernetes.io/hostname` - Nama dari Node tempat _endpoint_ berada.
* `topology.kubernetes.io/zone` - Zona tempat _endpoint_ berada. 
* `topology.kubernetes.io/region` - Region tempat _endpoint_ berada.

Nilai-nilai dari label-label berikut berasal dari sumber daya yang diasosiasikan dengan tiap
_endpoint_ pada sebuah _slice_. Label _hostname_ merepresentasikan nilai dari kolom NodeName
 pada Pod yang bersangkutan. Label zona dan wilayah merepresentasikan nilai
dari label-label dengan nama yang sama pada Node yang bersangkutan. 

### Pengelolaan

Secara bawaan, EndpointSlice dibuat dan dikelola oleh _controller_
EndpointSlice. Ada berbagai macam kasus lain untuk EndpointSlice, seperti
implementasi _service mesh_, yang memungkinkan adanya entitas atau _controller_ lain
yang dapat mengelola beberapa EndpointSlice sekaligus. Untuk memastikan beberapa entitas dapat
mengelola EndpointSlice tanpa mengganggu satu sama lain, sebuah
label `endpointslice.kubernetes.io/managed-by` digunakan untuk mengindikasikan entitas
yang mengelola sebuah EndpointSlice. _Controller_ EndpointSlice akan menambahkan
`endpointslice-controller.k8s.io` sebagai nilai dari label tersebut pada seluruh
EndpointSlice yang dikelolanya. Entitas lain yang mengelola EndpointSlice juga diharuskan untuk
menambahkan nilai yang unik untuk label tersebut.

### Kepemilikan

Pada kebanyakan kasus, EndpointSlice akan dimiliki oleh Service yang diikutinya. Hal ini diindikasikan dengan referensi pemilik pada tiap EndpointSlice dan
juga label `kubernetes.io/service-name` yang memudahkan pencarian seluruh
EndpointSlice yang dimiliki oleh sebuah Service.

## _Controller_ EndpointSlice

_Controller_ EndpointSlice mengamati Service dan Pod untuk memastikan EndpointSlice
yang bersangkutan berada dalam kondisi terkini. _Controller_ EndpointSlice akan mengelola EndpointSlice untuk
setiap Service yang memiliki selektor. Ini akan merepresentasikan IP dari Pod
yang cocok dengan selektor dari Service tersebut.

### Ukuran EndpointSlice

Secara bawaan, jumlah _endpoint_ yang dapat dimiliki tiap EndpointSlice dibatasi sebanyak 100 _endpoint_. Kamu dapat
mengaturnya melalui opsi `--max-endpoints-per-slice` {{< glossary_tooltip
text="kube-controller-manager" term_id="kube-controller-manager" >}} sampai dengan
jumlah maksimum sebanyak 1000 _endpoint_.

### Distribusi EndpointSlice

Tiap EndpointSlice memiliki sekumpulan _port_ yang berlaku untuk seluruh _endpoint_ dalam sebuah sumber daya. Ketika nama _port_ digunakan untuk sebuah Service, Pod mungkin mendapatkan
nomor target _port_ yang berbeda-beda untuk nama _port_ yang sama, sehingga membutuhkan
EndpointSlice yang berbeda. Hal ini mirip dengan logika mengenai bagaimana _subset_ dikelompokkan
dengan Endpoints.

_Controller EndpointSlice_ akan mencoba untuk mengisi EndpointSlice sebanyak mungkin, tetapi tidak
secara aktif melakukan _rebalance_ terhadap EndpointSlice tersebut. Logika dari _controller_ cukup sederhana:

1. Melakukan iterasi terhadap EndpointSlice yang sudah ada, menghapus _endpoint_ yang sudah tidak lagi
   dibutuhkan dan memperbarui _endpoint_ yang sesuai yang mungkin telah berubah.
2. Melakukan iterasi terhadap EndpointSlice yang sudah dimodifikasi pada langkah pertama dan
   mengisinya dengan _endpoint_ baru yang dibutuhkan.
3. Jika masih tersisa _endpoint_ baru untuk ditambahkan, mencoba untuk menambahkannya pada
   _slice_ yang tidak berubah sebelumnya dan/atau membuat _slice_ yang baru.
   
Terlebih penting, langkah ketiga memprioritaskan untuk membatasi pembaruan EndpointSlice terhadap
distribusi dari EndpointSlice yang benar-benar penuh. Sebagai contoh, jika ada 10
_endpoint_ baru untuk ditambahkan dan ada 2 EndpointSlice yang masing-masing memiliki ruang untuk 5 _endpoint_ baru,
pendekatan ini akan membuat sebuah EndpointSlice baru daripada mengisi 2
EndpointSlice yang sudah ada. Dengan kata lain, pembuatan sebuah EndpointSlice 
lebih diutamakan daripada pembaruan beberapa EndpointSlice.

Dengan kube-proxy yang berjalan pada tiap Node dan mengamati EndpointSlice, setiap perubahan
pada sebuah EndpointSlice menjadi sangat mahal karena hal tersebut akan dikirimkan ke
setiap Node dalam klaster. Pendekatan ini ditujukan untuk membatasi jumlah
perubahan yang perlu dikirimkan ke setiap Node, meskipun hal tersebut berdampak pada banyaknya
EndpointSlice yang tidak penuh.

Pada praktiknya, distribusi yang kurang ideal seperti ini akan jarang ditemukan. Kebanyakan perubahan yang diproses oleh _controller_ EndpointSlice akan cukup kecil untuk dapat masuk pada
EndpointSlice yang sudah ada, dan jika tidak, cepat atau lambat sebuah EndpointSlice baru 
akan segera dibutuhkan. Pembaruan bertahap (_rolling update_) dari Deployment juga menyediakan sebuah proses
pengemasan ulang EndpointSlice yang natural seiring dengan digantikannya seluruh Pod dan _endpoint_ yang 
bersangkutan.



## {{% heading "whatsnext" %}}


* [Mengaktifkan EndpointSlice](/docs/tasks/administer-cluster/enabling-endpointslices)
* Baca [Menghubungkan Aplikasi dengan Service](/id/docs/concepts/services-networking/connect-applications-service/)


