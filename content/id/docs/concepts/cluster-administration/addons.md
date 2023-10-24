---
title: Instalasi Add-ons
content_type: concept
---

<!-- overview -->


*Add-ons* berfungsi untuk menambah serta memperluas fungsionalitas dari Kubernetes.

Laman ini akan menjabarkan beberapa *add-ons* yang tersedia serta tautan instruksi bagaimana cara instalasi masing-masing *add-ons*.

*Add-ons* pada setiap bagian akan diurutkan secara alfabet - pengurutan ini tidak dilakukan berdasarkan status preferensi atau keunggulan.




<!-- body -->

## Jaringan dan *Policy* Jaringan


* [ACI](https://www.github.com/noironetworks/aci-containers) menyediakan integrasi jaringan kontainer dan keamanan jaringan dengan Cisco ACI.
* [Calico](https://docs.projectcalico.org/latest/getting-started/kubernetes/) merupakan penyedia jaringan L3 yang aman dan *policy* jaringan.
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel) menggabungkan Flannel dan Calico, menyediakan jaringan serta *policy* jaringan.
* [Cilium](https://github.com/cilium/cilium) merupakan *plugin* jaringan L3 dan *policy* jaringan yang dapat menjalankan *policy* HTTP/API/L7 secara transparan. Mendukung mode *routing* maupun *overlay/encapsulation*.
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) memungkinkan Kubernetes agar dapat terkoneksi dengan beragam *plugin* CNI, seperti Calico, Canal, Flannel, Romana, atau Weave dengan mulus.
* [Contiv](https://contivpp.io) menyediakan jaringan yang dapat dikonfigurasi (*native* L3 menggunakan BGP, *overlay* menggunakan vxlan, klasik L2, dan Cisco-SDN/ACI) untuk berbagai penggunaan serta *policy framework* yang kaya dan beragam. Proyek Contiv merupakan proyek [open source](https://github.com/contiv). Laman [instalasi](https://github.com/contiv/install) ini akan menjabarkan cara instalasi, baik untuk klaster dengan kubeadm maupun non-kubeadm.
* [Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), yang berbasis dari [Tungsten Fabric](https://tungsten.io), merupakan sebuah proyek *open source* yang menyediakan virtualisasi jaringan *multi-cloud* serta platform manajemen *policy*. Contrail dan Tungsten Fabric terintegrasi dengan sistem orkestrasi lainnya seperti Kubernetes, OpenShift, OpenStack dan Mesos, serta menyediakan mode isolasi untuk mesin virtual (VM), kontainer/pod dan *bare metal*.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) merupakan penyedia jaringan *overlay* yang dapat digunakan pada Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) merupakan solusi jaringan yang mendukung multipel jaringan pada Kubernetes.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) merupakan sebuah multi *plugin* agar Kubernetes mendukung multipel jaringan secara bersamaan sehingga dapat menggunakan semua *plugin* CNI (contoh: Calico, Cilium, Contiv, Flannel), ditambah pula dengan SRIOV, DPDK, OVS-DPDK dan VPP pada *workload* Kubernetes.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in (NCP) menyediakan integrasi antara VMware NSX-T dan orkestrator kontainer seperti Kubernetes, termasuk juga integrasi antara NSX-T dan platform CaaS/PaaS berbasis kontainer seperti *Pivotal Container Service* (PKS) dan OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) merupakan platform SDN yang menyediakan *policy-based* jaringan antara Kubernetes Pods dan non-Kubernetes *environment* dengan *monitoring* visibilitas dan keamanan.
* [Romana](http://romana.io) merupakan solusi jaringan  *Layer* 3 untuk jaringan pod yang juga mendukung [*NetworkPolicy* API](/id/docs/concepts/services-networking/network-policies/). Instalasi Kubeadm *add-on* ini tersedia [di sini](https://github.com/romana/romana/tree/master/containerize).
* [Weave Net](https://www.weave.works/docs/net/latest/kube-addon/) menyediakan jaringan serta *policy* jaringan, yang akan membawa kedua sisi dari partisi jaringan, serta tidak membutuhkan basis data eksternal.

## _Service Discovery_

* [CoreDNS](https://coredns.io) merupakan server DNS yang fleksibel, mudah diperluas yang dapat [diinstal](https://github.com/coredns/deployment/tree/master/kubernetes) sebagai *in-cluster* DNS untuk pod.

## Visualisasi &amp; Kontrol

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) merupakan antarmuka web dasbor untuk Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) merupakan perangkat untuk visualisasi grafis dari kontainer, pod, *service* dll milikmu. Gunakan bersama dengan [akun Weave Cloud](https://cloud.weave.works/) atau *host* UI-mu sendiri.

## *Add-ons* Terdeprekasi

Ada beberapa *add-on* lain yang didokumentasikan pada direktori deprekasi [*cluster/addons*](https://git.k8s.io/kubernetes/cluster/addons).

*Add-on* lain yang dipelihara dan dikelola dengan baik dapat ditulis di sini. Ditunggu PR-nya!


