---
title: Kelas QoS
id: qos-class
date: 2019-04-15
full_link: 
short_description: >
  Kelas QoS (_Quality of Service_) menyediakan cara bagi Kubernetes untuk mengklasifikasikan Pod di dalam klaster menjadi beberapa kelas dan membuat keputusan tentang penjadwalan dan pengusiran.

aka:
tags:
- core-object
- fundamental
- architecture
related:
 - pod
---
Kelas QoS (_Quality of Service_) menyediakan cara bagi Kubernetes untuk mengklasifikasikan Pod di dalam klaster menjadi beberapa kelas dan membuat keputusan tentang penjadwalan dan pengusiran.

<!--more-->

Kelas QoS dari suatu Pod ditentukan pada waktu pembuatannya berdasarkan permintaan sumber daya komputasi dan pengaturan batasan. Kelas QoS digunakan untuk membuat keputusan tentang penjadwalan dan pengusiran Pod. Kubernetes dapat menetapkan salah satu kelas QoS berikut ke Pod: `Guaranteed`, `Burstable` atau `BestEffort`.
