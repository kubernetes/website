---
title: Pod
id: pod
date: 2019-06-24
full_link: /id/docs/concepts/workloads/pods/pod-overview/
short_description: >
  Unit Kubernetes yang paling sederhana dan kecil. Sebuah Pod merepresentasikan sekumpulan Container yang dijalankan pada klustermu.

aka: 
tags:
- core-object
- fundamental
---
Unit Kubernetes yang paling sederhana dan kecil. Sebuah Pod merepresentasikan sekumpulan {{< glossary_tooltip term_id="container" >}} yang dijalankan pada klustermu.

<!--more--> 
Sebuah Pod biasanya digunakan untuk menjalankan sebuah Container. Pod juga bisa menjalankan _sidecar_ Container yang akan menambahkan fitur ekstra seperti pencatatan. Pod biasanya dikelola oleh sebuah {{< glossary_tooltip term_id="deployment" >}}.
