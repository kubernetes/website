---
title: Control Plane
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  Merupakan lapisan orkestrasi Container yang mengekspos API dan antarmuka untuk mendefinisikan, menggelar, dan mengelola siklus hidup suatu Container.

aka:
tags:
- fundamental
---
Merupakan lapisan orkestrasi Container yang mengekspos API dan antarmuka untuk mendefinisikan, menggelar, dan mengelola siklus hidup suatu Container.

<!--more--> 

Lapisan ini terdiri dari beragam komponen, seperti (tapi tidak terbatas pada):

* {{< glossary_tooltip text="etcd" term_id="etcd" >}}
* {{< glossary_tooltip text="Server API" term_id="kube-apiserver" >}}
* {{< glossary_tooltip text="Penjadwal" term_id="kube-scheduler" >}}
* {{< glossary_tooltip text="Manajer Pengontrol" term_id="kube-controller-manager" >}}
* {{< glossary_tooltip text="Manajer Pengontrol Cloud" term_id="cloud-controller-manager" >}}

Komponen-komponen tersebut dapat dijalankan sebagai layanan sistem operasi tradisional (_daemon_) atau sebagai Container. Hos yang menjalankan komponen-komponen tersebut secara historis dikenal sebagai {{< glossary_tooltip text="master" term_id="master" >}}.
