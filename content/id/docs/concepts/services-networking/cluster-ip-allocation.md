---
title: Alokasi ClusterIP pada servis (Service ClusterIP allocation)
content_type: concept
weight: 120
---


<!-- overview -->

Dalam Kubernetes, [Service](/docs/concepts/services-networking/service/) adalah cara abstrak untuk mengekspos aplikasi yang berjalan pada sekumpulan Pod. Service dapat memiliki alamat IP virtual yang berlaku dalam skala klaster (menggunakan Service dengan `type: ClusterIP`). Klien dapat terhubung menggunakan alamat IP virtual tersebut, dan Kubernetes kemudian mendistribusikan lalu lintas ke Service tersebut di antara berbagai Pod yang menjadi _backend_-nya.

<!-- body -->

## Bagaimana ClusterIP pada Service dialokasikan?

Ketika Kubernetes perlu menetapkan alamat IP virtual untuk sebuah Service, penetapan tersebut dapat dilakukan dengan dua cara:

_dinamis_
: _Control plane_ klaster secara otomatis memilih alamat IP yang tersedia dari dalam rentang IP yang telah dikonfigurasi untuk Service dengan `type: ClusterIP`.

_statis_
: Kamu yang menentukan sendiri alamat IP yang diinginkan, asalkan berada dalam rentang IP yang telah dikonfigurasi untuk Service.

Di seluruh klaster kamu, setiap `ClusterIP` untuk Service harus unik. Mencoba membuat Service dengan `ClusterIP` tertentu yang telah dialokasikan sebelumnya akan menghasilkan _error_.

## Mengapa Kamu Perlu Menetapkan Alamat IP Cluster Service?

Kamu terkadang ingin memiliki Service yang berjalan dengan alamat IP yang telah dikenal (_well-known IP addresses_), sehingga komponen lain dan pengguna dalam klaster dapat menggunakannya.

Contoh terbaiknya adalah Service DNS untuk klaster. Sebagai konvensi lunak, beberapa _installer_ Kubernetes menetapkan alamat IP ke-10 dari rentang IP Service untuk Service DNS. Misalnya, jika kamu mengonfigurasi klaster kamu dengan rentang IP Service 10.96.0.0/16 dan ingin alamat IP Service DNS kamu menjadi 10.96.0.10, kamu harus membuat Service seperti berikut:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: CoreDNS
  name: kube-dns
  namespace: kube-system
spec:
  clusterIP: 10.96.0.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
    targetPort: 53
  - name: dns-tcp
    port: 53
    protocol: TCP
    targetPort: 53
  selector:
    k8s-app: kube-dns
  type: ClusterIP
```

Namun, seperti yang telah dijelaskan sebelumnya, alamat IP 10.96.0.10 belum digunakan (_reserved_). Jika Service lain dibuat sebelum atau pararel dengan alokasi dinamis, ada kemungkinan mereka dapat menggunakan alamat IP ini. Akibatnya, kamu tidak akan dapat membuat Service DNS karena akan gagal dengan _error_ konflik.

## Bagaimana Cara Menghindari Konflik Alamat IP ClusterIP pada Service? {#hindari-konflik-ClusterIP}

Implementasi alokasi dalam Kubernetes untuk menetapkan ClusterIP ke Service mengurangi risiko konflik.

rentang IP `ClusterIP` dibagi, berdasarkan rumus `min(max(16, cidrSize / 16), 256)`,
yang dijelaskan sebagai _tidak kurang dari 16 atau lebih dari 256 dengan tahap bertingkat di antara keduanya_.

Alokasi IP dinamis menggunakan pita atas secara _default_, setelah ini habis, akan menggunakan pita bawah. Ini akan memungkinkan pengguna untuk menggunakan alokasi statis pada pita bawah dengan risiko konflik yang rendah.


## Contoh {#contoh-alokasi}

### Contoh 1 {#contoh-alokasi-1}

Contoh ini menggunakan rentang alamat IP: 10.96.0.0/24 (notasi CIDR) untuk alamat IP 
dari Service.

Ukuran Rentang: 2<sup>8</sup> - 2 = 254
Offset Pita (band): `min(max(16, 256/16), 256)` = `min(16, 256)` = 16
Awal pita statis: 10.96.0.1
Akhir pita statis: 10.96.0.16
Akhir Rentang: 10.96.0.254

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "Static" : 16
    "Dynamic" : 238
{{< /mermaid >}}

### Contoh 2 {#contoh-alokasi-2}

Contoh ini menggunakan rentang alamat IP: 10.96.0.0/20 (notasi CIDR) untuk alamat IP 
dari Service.

Ukuran Rentang: 2<sup>12</sup> - 2 = 4094  
Offset Pita (band): `min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
Awal pita statis: 10.96.0.1  
Akhir pita statis: 10.96.1.0  
Akhir Rentang: 10.96.15.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "Static" : 256
    "Dynamic" : 3838
{{< /mermaid >}}

### Contoh 3 {#contoh-alokasi-3}

Contoh ini menggunakan rentang alamat IP: 10.96.0.0/16 (notasi CIDR) untuk alamat IP 
dari Service.

Ukuran Rentang: 2<sup>16</sup> - 2 = 65534  
Offset Pita (band): `min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
Awal pita statis: 10.96.0.1  
Akhir pita statis: 10.96.1.0  
Akhir Rentang: 10.96.255.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "Static" : 256
    "Dynamic" : 65278
{{< /mermaid >}}

## {{% heading "whatsnext" %}}

* Baca mengenai [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Baca mengenai [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
* Baca mengenai [Services](/docs/concepts/services-networking/service/)

