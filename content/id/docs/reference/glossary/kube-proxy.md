---
title: kube-proxy
id: kube-proxy
date: 2018-04-12
full_link: /docs/reference/command-line-tools-reference/kube-proxy/
short_description: >
  `kube-proxy` merupakan proksi jaringan yang berjalan pada setiap node di dalam klaster.

aka:
tags:
- fundamental
- networking
---
kube-proxy merupakan proksi jaringan yang berjalan pada setiap {{< glossary_tooltip term_id="node" >}} di dalam klastermu, yang mengimplementasikan bagian dari konsep {{< glossary_tooltip text="layanan" term_id="service">}} Kubernetes.

<!--more-->

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) mengelola aturan jaringan pada node. Aturan jaringan tersebut memungkinkan komunikasi jaringan ke Pod-mu melalui sesi jaringan dari dalam ataupun luar klaster.

kube-proxy menggunakan lapisan pemfilteran paket sistem operasi jika ada dan tersedia. Jika tidak, maka kube-proxy akan meneruskan lalu lintas jaringan itu sendiri.
