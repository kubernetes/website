---
title: Berbagai Proxy di Kubernetes
content_template: templates/concept
weight: 90
---

{{% capture overview %}}
Laman ini menjelaskan berbagai <i>proxy</i> yang ada di dalam Kubernetes.
{{% /capture %}}

{{% capture body %}}

## Berbagai Jenis <i>Proxy</i>

Ada beberapa jenis <i>proxy</i> yang akan kamu temui saat menggunakan Kubernetes:

1.  [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - dijalankan pada <i>desktop</i> pengguna atau di dalam sebuah Pod
    - melakukan <i>proxy</i> dari alamat localhost ke apiserver Kubernetes
    - dari klien menuju <i>proxy</i> menggunakan HTTP
    - dari <i>proxy</i> menuju apiserver menggunakan HTTPS
    - mencari lokasi apiserver
    - menambahkan <i>header</i> autentikasi

1.  [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services):

    - merupakan sebuah <i>bastion</i> yang ada di dalam apiserver
    - menghubungkan pengguna di luar kluster ke alamat-alamat IP di dalam kluster yang tidak bisa terjangkau
    - dijalankan bersama <i>process-process</i> apiserver
    - dari klien menuju <i>proxy</i> menggunakan HTTPS (atau http jika dikonfigurasi pada apiserver)
    - dari <i>proxy</i> menuju target menggunakan HTTP atau HTTPS, tergantung pilihan yang diambil oleh <i>proxy</i> melalui informasi yang ada
    - dapat digunakan untuk menghubungi Node, Pod, atau Service
    - melakukan <i>load balancing</i> saat digunakan untuk menjangkau sebuah Service

1.  [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - dijalankan pada setiap Node
    - melakukan <i>proxy</i> untuk UDP, TCP dan SCTP
    - tidak mengerti HTTP
    - menyediakan <i>load balancing</i>
    - hanya digunakan untuk menjangkau berbagai Service

1.  Sebuah <i>Proxy/Load-balancer</i> di depan satu atau banyak apiserver:

    - keberadaan dan implementasinya bervariasi tergantung pada kluster (contohnya nginx)
    - ada di antara seluruh klien dan satu/banyak apiserver
    - jika ada beberapa apiserver, berfungsi sebagai <i>load balancer</i>

1.  <i>Cloud Load Balancer</i> pada servis eksternal:

    - disediakan oleh beberapa penyedia layanan cloud, seperti AWS ELB, Google Cloud Load Balancer
    - dibuat secara otomatis ketika Service dari Kubernetes dengan tipe `LoadBalancer`
    - biasanya hanya tersedia untuk UDP/TCP
    - <i>support</i> untuk SCTP tergantung pada <i>load balancer</i> yang diimplementasikan oleh penyedia cloud
    - implementasi bervariasi tergantung pada penyedia cloud

Pengguna Kubernetes biasanya hanya cukup perlu tahu tentang kubectl <i>proxy</i> dan apiserver <i>proxy</i>. 
Untuk <i>proxy-proxy</i> lain di luar ini, admin kluster biasanya akan memastikan konfigurasinya dengan benar.

## Melakukan <i>request redirect</i>

<i>Proxy</i> telah menggantikan fungsi <i>redirect</i>. <i>Redirect</i> telah terdeprekasi.

{{% /capture %}}
