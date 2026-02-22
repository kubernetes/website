---
title: Namespace
id: namespace
date: 2018-04-12
full_link: /id/docs/concepts/overview/working-with-objects/namespaces
short_description: >
  Sebuah abstraksi yang digunakan oleh Kubernetes untuk mendukung multipel klaster virtual pada klaster fisik yang sama.

aka:
tags:
- fundamental
---
Sebuah abstraksi yang digunakan oleh Kubernetes untuk mendukung multipel klaster virtual pada {{< glossary_tooltip text="klaster" term_id="cluster" >}} fisik yang sama.

<!--more-->

Namespace digunakan untuk mengatur objek-objek di dalam suatu klaster dan menyediakan cara untuk membagi sumber daya klaster. Nama sumber daya yang berada di dalam satu Namespace yang sama harus unik, akan tetapi tidak diharuskan dalam hal lintas Namespace.
