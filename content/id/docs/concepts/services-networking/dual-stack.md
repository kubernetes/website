---
title: Dual-stack IPv4/IPv6 
feature:
  title: Dual-stack IPv4/IPv6 
  description: >
    Pengalokasian alamat IPv4 dan IPv6 untuk Pod dan Service

content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

_Dual-stack_ IPv4/IPv6 memungkinkan pengalokasian alamat IPv4 dan IPv6 untuk
{{< glossary_tooltip text="Pod" term_id="pod" >}} dan {{< glossary_tooltip text="Service" term_id="service" >}}.

Jika kamu mengaktifkan jaringan _dual-stack_ IPv4/IPv6 untuk klaster Kubernetes 
kamu, klaster akan mendukung pengalokasian kedua alamat IPv4 dan IPv6 secara 
bersamaan.



<!-- body -->

## Fitur-fitur yang didukung

Mengaktifkan _dual-stack_ IPv4 / IPv6 pada klaster Kubernetes kamu untuk 
menyediakan fitur-fitur berikut ini:

* Jaringan Pod _dual-stack_ (pengalokasian sebuah alamat IPv4 dan IPv6 untuk setiap Pod)
* Service yang mendukung IPv4 dan IPv6 (setiap Service hanya untuk satu keluarga alamat)
* Perutean Pod ke luar klaster (misalnya Internet) melalui antarmuka IPv4 dan IPv6

## Prasyarat

Prasyarat berikut diperlukan untuk menggunakan _dual-stack_ IPv4/IPv6 pada 
klaster Kubernetes :

* Kubernetes versi 1.16 atau yang lebih baru
* Dukungan dari penyedia layanan untuk jaringan _dual-stack_ (Penyedia layanan _cloud_ atau yang lainnya harus dapat menyediakan antarmuka jaringan IPv4/IPv6 yang dapat dirutekan) untuk Node Kubernetes
* Sebuah _plugin_ jaringan yang mendukung _dual-stack_ (seperti Kubenet atau Calico)
* Kube-proxy yang berjalan dalam mode IPVS

## Mengaktifkan _dual-stack_ IPv4/IPv6

Untuk mengaktifkan _dual-stack_ IPv4/IPv6, aktifkan [gerbang fitur (_feature gate_)](/docs/reference/command-line-tools-reference/feature-gates/) `IPv6DualStack`
untuk komponen-komponen yang relevan dari klaster kamu, dan tetapkan jaringan 
_dual-stack_ pada klaster:

   * kube-controller-manager:
      * `--feature-gates="IPv6DualStack=true"`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>` misalnya `--cluster-cidr=10.244.0.0/16,fc00::/24`
      * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` nilai bawaannya adalah /24 
        untuk IPv4 dan /64 untuk IPv6
   * kubelet:
      * `--feature-gates="IPv6DualStack=true"`
   * kube-proxy:
      * `--proxy-mode=ipvs`
      * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
      * `--feature-gates="IPv6DualStack=true"`

{{< caution >}}
Jika kamu menentukan blok alamat IPv6 yang lebih besar dari /24 melalui 
`--cluster-cidr` pada baris perintah, maka penetapan tersebut akan gagal.
{{< /caution >}}

## Service

Jika klaster kamu mengaktifkan jaringan _dual-stack_ IPv4/IPv6, maka kamu dapat 
membuat {{<glossary_tooltip text ="Service" term_id ="service">}} dengan 
alamat IPv4 atau IPv6. Kamu dapat memilih keluarga alamat untuk clusterIP  
Service kamu dengan mengatur bagian, `.spec.ipFamily`, pada Service tersebut.
Kamu hanya dapat mengatur bagian ini saat membuat Service baru. Mengatur bagian 
`.spec.ipFamily` bersifat opsional dan hanya boleh digunakan jika kamu berencana
untuk mengaktifkan {{<glossary_tooltip text ="Service "term_id ="service">}} 
dan {{<glossary_tooltip text ="Ingress "term_id ="ingress">}} IPv4 dan IPv6
pada klaster kamu. Konfigurasi bagian ini bukanlah syarat untuk lalu lintas 
[_egress_] (#lalu-lintas-egress).

{{< note >}}
Keluarga alamat bawaan untuk klaster kamu adalah keluarga alamat dari rentang 
clusterIP Service pertama yang dikonfigurasi melalui opsi 
`--service-cluster-ip-range` pada kube-controller-manager.
{{< /note >}}

Kamu dapat mengatur `.spec.ipFamily` menjadi salah satu dari:

   * `IPv4`: Dimana server API akan mengalokasikan IP dari `service-cluster-ip-range` yaitu `ipv4`
   * `IPv6`: Dimana server API akan mengalokasikan IP dari `service-cluster-ip-range` yaitu `ipv6`

Spesifikasi Service berikut ini tidak memasukkan bagian `ipFamily`.
Kubernetes akan mengalokasikan alamat IP (atau yang dikenal juga sebagai 
"_cluster IP_") dari `service-cluster-ip-range` yang dikonfigurasi pertama kali
untuk Service ini.

{{% codenew file="service/networking/dual-stack-default-svc.yaml" %}}

Spesifikasi Service berikut memasukkan bagian `ipFamily`. Sehingga Kubernetes
akan mengalokasikan alamat IPv6 (atau yang dikenal juga sebagai "_cluster IP_") 
dari `service-cluster-ip-range` yang dikonfigurasi untuk Service ini.

{{% codenew file="service/networking/dual-stack-ipv6-svc.yaml" %}}

Sebagai perbandingan, spesifikasi Service berikut ini akan dialokasikan sebuah alamat
IPv4 (atau yang dikenal juga sebagai "_cluster IP_") dari `service-cluster-ip-range` 
yang dikonfigurasi untuk Service ini.

{{% codenew file="service/networking/dual-stack-ipv4-svc.yaml" %}}

### Tipe _LoadBalancer_

Penyedia layanan _cloud_ yang mendukung IPv6 untuk pengaturan beban eksternal,
Mengatur bagian `type` menjadi `LoadBalancer` sebagai tambahan terhadap mengatur bagian 
`ipFamily` menjadi `IPv6` menyediakan sebuah _cloud load balancer_ untuk Service kamu.

## Lalu lintas _egress_

Penggunaan blok alamat IPv6 yang dapat dirutekan dan yang tidak dapat dirutekan 
secara publik diperbolehkan selama {{<glossary_tooltip text="CNI" term_id= "cni">}}
dari penyedia layanan dapat mengimplementasikan transportasinya. Jika kamu memiliki
Pod yang menggunakan IPv6 yang dapat dirutekan secara publik dan ingin agar Pod
mencapai tujuan di luar klaster (misalnya Internet publik), kamu harus mengatur
IP samaran untuk lalu lintas keluar dan balasannya. [_ip-masq-agent_](https://github.com/kubernetes-incubator/ip-masq-agent) 
bersifat _dual-stack aware_, jadi kamu bisa menggunakan ip-masq-agent untuk 
_masquerading_ IP dari klaster _dual-stack_.

## Masalah-masalah yang diketahui

* Kubenet memaksa pelaporan posisi IP untuk IPv4,IPv6 IP (--cluster-cidr)



## {{% heading "whatsnext" %}}


* [Validasi jaringan _dual-stack_ IPv4/IPv6](/docs/tasks/network/validate-dual-stack)


