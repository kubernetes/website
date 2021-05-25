---
title: "Kubeadm"
weight: 10
no_list: true
content_type: concept
card:
  name: reference
  weight: 40
---

<img src="https://raw.githubusercontent.com/kubernetes/kubeadm/master/logos/stacked/color/kubeadm-stacked-color.png" align="right" width="150px">Kubeadm adalah fitur yang dibuat untuk menyediakan `kubeadm init` dan` kubeadm join` sebagai praktik terbaik dengan "jalur cepat" untuk membuat klaster Kubernetes.

kubeadm melakukan tindakan yang diperlukan untuk membuat klaster minimum yang layak untuk aktif dan berjalan. Secara desain, ini hanya memperdulikan tentang *bootstrap*, bukan tentang mesin *provisioning*. Demikian pula, dengan instalasi berbagai *addon* atau tambahan yang bagus untuk dimiliki, seperti Dasbor Kubernetes, solusi pemantauan, dan tambahan khusus cloud, tidak termasuk dalam cakupan.

Sebaliknya, kita mengharapkan perangkat dengan tingkat yang lebih tinggi dan lebih disesuaikan untuk dibangun di atas kubeadm, dan idealnya, menggunakan kubeadm sebagai dasar dari semua penerapan untuk mempermudah pembuatan klaster yang sesuai.

## Cara Instalasi

Untuk menginstal kubeadm, silakan lihat [Petunjuk Instalasi](/docs/setup/production-environment/tools/kubeadm/install-kubeadm).

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) untuk melakukan **bootstrap** pada node control-plane Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) untuk melakukan **bootstrap** worker node Kubernetes worker dan menggabungkannya ke dalam klaster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) untuk melakukan pembaruan klaster Kubernetes ke versi yang lebih baru
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config) untuk mengonfigurasi klaster kamu untuk `kubeadm upgrade`, jika kamu menggunakan kubeadm v1.7.x atau dibawahnya untuk menginisialisasi klaster kamu 
* [kubeadm token](/docs/reference/setup-tools/kubeadm/kubeadm-token) untuk mengatur token-token untuk `kubeadm join`
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) untuk mengembalikan semua perubahan yang dibuat untuk host dengan `kubeadm init` atau `kubeadm join`
* [kubeadm version](/docs/reference/setup-tools/kubeadm/kubeadm-version) untuk mencetak versi kubeadm
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) untuk melihat sekilas sekumpulan fitur yang ada untuk mengumpulkan *feedback* atau umpan balik dari komunitas
