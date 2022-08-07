---
title: Topologi Service (Service Topology)
feature:
  title: Topologi Service (Service Topology)
  description: >
    Rute lalu lintas layanan berdasarkan topologi klaster.
    
content_type: concept
weight: 10
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.17" state="alpha" >}}

Topologi Service memungkinkan Service untuk 
merutekan lalu lintas jaringan berdasarkan topologi Node dalam klaster. Misalnya, suatu 
layanan dapat menentukan lalu lintas jaringan yang lebih diutamakan untuk dirutekan ke
beberapa _endpoint_ yang berada pada Node yang sama dengan klien, atau pada 
_availability zone_ yang sama.



<!-- body -->

## Pengantar

Secara bawaan lalu lintas jaringan yang dikirim ke `ClusterIP` atau `NodePort` dari Service
dapat dialihkan ke alamat _backend_ untuk Service tersebut. Sejak Kubernetes 1.7
dimungkinkan untuk merutekan lalu lintas jaringan "eksternal" ke Pod yang berjalan di 
Node yang menerima lalu lintas jaringan, tetapi fitur ini tidak didukung untuk `ClusterIP` dari
Service, dan topologi yang lebih kompleks &mdash; seperti rute zonasi &mdash;
belum memungkinkan. Fitur topologi Service mengatasi kekurangan ini dengan 
mengizinkan pembuat layanan untuk mendefinisikan kebijakan dalam merutekan lalu lintas jaringan
berdasarkan label Node untuk Node-Node asal dan tujuan.

Dengan menggunakan label Node yang sesuai antara asal dan tujuan, operator dapat
menunjuk kelompok Node mana yang "lebih dekat" dan mana yang "lebih jauh" antara satu sama lain,
dengan menggunakan metrik apa pun yang masuk akal untuk memenuhi persyaratan 
dari operator itu. Untuk sebagian besar operator di publik _cloud_, misalnya, ada 
preferensi untuk menjaga layanan lalu lintas jaringan dalam zona yang sama, karena lalu lintas jaringan
antar zona memiliki biaya yang dibebankan, sementara lalu lintas jaringan
dalam zona yang sama tidak ada biaya. Kebutuhan umum lainnya termasuk kemampuan untuk merutekan 
lalu lintas jaringan ke Pod lokal yang dikelola oleh sebuah DaemonSet, atau menjaga lalu lintas jaringan ke 
Node yang terhubung ke _top-of-rack switch_ yang sama untuk mendapatkan 
latensi yang terendah.


## Menggunakan Topologi Service

Jika klaster kamu mengaktifkan topologi Service kamu dapat mengontrol rute lalu lintas jaringan Service
dengan mengatur bagian `topologyKeys` pada spesifikasi Service. Bagian ini
adalah daftar urutan label-label Node yang akan digunakan untuk mengurutkan _endpoint_
saat mengakses Service ini. Lalu lintas jaringan akan diarahkan ke Node yang nilai
label pertamanya cocok dengan nilai dari Node asal untuk label yang sama. Jika
tidak ada _backend_ untuk Service pada Node yang sesuai, maka label kedua akan
dipertimbangkan, dan seterusnya, sampai tidak ada label yang tersisa.

Jika tidak ditemukan kecocokan, lalu lintas jaringan akan ditolak, sama seperti jika tidak ada
sama sekali _backend_ untuk Service tersebut. Artinya, _endpoint_ dipilih 
berdasarkan kunci topologi yang pertama yang tersedia pada _backend_. Jika dalam
bagian ini ditentukan dan semua entri tidak memiliki _backend_ yang sesuai dengan
topologi klien, maka Service tidak memiliki _backend_ untuk klien dan koneksi harus 
digagalkan. Nilai khusus `"*"` dapat digunakan untuk mengartikan "topologi 
apa saja". Nilai _catch-all_ ini, jika digunakan, maka hanya sebagai 
nilai terakhir dalam daftar.

Jika `topologyKeys` tidak ditentukan atau kosong, tidak ada batasan topologi 
yang akan diterapkan.

Seandainya sebuah klaster dengan Node yang dilabeli dengan nama _host_ , 
nama zona, dan nama wilayah mereka, maka kamu dapat mengatur nilai 
`topologyKeys` dari sebuah Service untuk mengarahkan lalu lintas jaringan seperti berikut ini.

* Hanya ke _endpoint_ dalam Node yang sama, gagal jika tidak ada _endpoint_ pada Node: `["kubernetes.io/hostname"]`.
* Lebih memilih ke _endpoint_ dalam Node yang sama, jika tidak ditemukan maka ke _endpoint_ pada zona yang sama, diikuti oleh wilayah yang sama, dan selain itu akan gagal: `["kubernetes.io/hostname ", "topology.kubernetes.io/zone", "topology.kubernetes.io/region"]`. Ini mungkin berguna, misalnya, dalam kasus di mana lokalitas data sangatlah penting.
* Lebih memilih ke _endpoint_ dalam zona yang sama, tetapi memilih _endpoint_ mana saja yang tersedia apabila tidak ada yang tersedia dalam zona ini: `["topology.kubernetes.io/zone ","*"]`.


## Batasan

* Topologi Service tidak kompatibel dengan `externalTrafficPolicy=Local`, dan karena itu Service tidak dapat menggunakan kedua fitur ini sekaligus. Dimungkinkan untuk menggunakan kedua fitur pada klaster yang sama untuk Service yang berbeda, bukan untuk Service yang sama.
* Untuk saat ini kunci topologi yang valid hanya terbatas pada `kubernetes.io/hostname`, `topology.kubernetes.io/zone`, dan `topology.kubernetes.io/region`, tetapi akan digeneralisasikan ke label Node yang lain di masa depan.
* Kunci topologi harus merupakan kunci label yang valid dan paling banyak hanya 16 kunci yang dapat ditentukan.
* Nilai _catch-all_, `"*"`, harus menjadi nilai terakhir pada kunci topologi, jika nilai itu digunakan.


## Contoh

Berikut ini adalah contoh umum penggunaan fitur topologi Service.

### Hanya pada _endpoint_ pada Node lokal

Service yang hanya merutekan ke _endpoint_ pada Node lokal. Jika tidak ada _endpoint_ pada Node, lalu lintas jaringan akan dihentikan:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
```

### Lebih memilih _endpoint_ pada Node lokal

Service yang lebih memilih _endpoint_ pada Node lokal, namun akan memilih ke _endpoint_ 
dalam klaster jika _endpoint_ pada Node lokal tidak ada:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "*"
```


### Hanya untuk _endpoint_ pada zona atau wilayah yang sama

Service yang lebih memilih _endpoint_ dalam zona yang sama daripada wilayah yang sama. Jika tidak ada _endpoint_ pada  
keduanya, maka lalu lintas jaringan akan dihentikan.


```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
```

### Lebih memilih _endpoint_ pada Node lokal, zona yang sama, dan kemudian wilayah yang sama

Service yang lebih memilih _endpoint_ pada Node lokal, zona yang sama, dan kemudian baru wilayah yang sama,
namun jika tetap tidak ditemukan maka akan memilih _endpoint_ diseluruh klaster.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  topologyKeys:
    - "kubernetes.io/hostname"
    - "topology.kubernetes.io/zone"
    - "topology.kubernetes.io/region"
    - "*"
```



## {{% heading "whatsnext" %}}


* Baca tentang [mengaktifkan topologi Service](/docs/tasks/administer-cluster/enabling-service-topology)
* Baca [menghubungkan aplikasi dengan Service](/id/docs/concepts/services-networking/connect-applications-service/)

