---
title: Pod
id: pod
date: 2019-06-24
full_link: /docs/concepts/workloads/pods/pod-overview/
short_description: >
  Unit Kubernetes yang paling sederhana dan kecil. Sebuah Pod merepresentasikan sebuah set kontainer yang dijalankan pada klaster kamu.

aka:
tags:
- core-object
- fundamental
---
Unit Kubernetes yang paling sederhana dan kecil. Sebuah Pod merepresentasikan sebuah set kontainer yang dijalankan {{< glossary_tooltip text="kontainer" term_id="container" >}} pada klaster kamu.

<!--more-->
Sebuah Pod biasanya digunakan untuk menjalankan sebuah kontainer. Pod juga dapat digunakan untuk menjalankan beberapa sidecar container dan beberapa fiture tambahan. Pod biasanya diatur oleh sebuah {{< glossary_tooltip term_id="deployment" >}}.
