---
title: Kelas QoS
id: qos-class
date: 2019-04-15
full_link: /id/docs/concepts/workloads/pods/pod-qos/#kelas-kualitas-layanan
short_description: >
  Kelas QoS (Kelas Kualitas Layanan) menyediakan cara bagi Kubernetes untuk mengklasifikasikan Pod dalam klaster ke dalam beberapa kelas dan membuat keputusan tentang penjadwalan dan pengusiran.

aka:
- QoS Class
tags:
- fundamental
- architecture
related:
 - pod

---
Kelas QoS (Kelas Kualitas Layanan) menyediakan cara bagi Kubernetes untuk mengklasifikasikan Pod dalam klaster ke dalam beberapa kelas dan membuat keputusan tentang penjadwalan dan pengusiran.

<!--more-->
Kelas QoS Pod ditetapkan pada waktu pembuatan berdasarkan permintaan sumber daya komputasi dan pengaturan batasannya. Kelas QoS digunakan untuk membuat keputusan tentang penjadwalan dan pengusiran Pod.
Kubernetes dapat menetapkan salah satu kelas QoS berikut ke Pod: *`Guaranteed`*, *`Burstable`* atau *`BestEffort`*.
