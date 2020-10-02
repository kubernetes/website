---
title: Node
id: node
date: 2018-04-12
full_link: /id/docs/concepts/architecture/nodes/
short_description: >
  Sebuah Node merupakan mesin pekerja di dalam Kubernetes.

aka:
tags:
- fundamental
---
Sebuah Node merupakan mesin pekerja di dalam Kubernetes.

<!--more-->

Node pekerja bisa jadi adalah sebuah VM atau mesin fisik, bergantung pada klasternya. Node memiliki _daemon_ atau layanan lokal untuk menjalankan {{< glossary_tooltip term_id="pod" >}} dan dikelola oleh _control plane_. _Daemon_ pada Node termasuk {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, {< glossary_tooltip  term_id="kube-proxy" >}} dan _runtime_ Container yang mengimplementasikan {{< glossary_tooltip text="CRI" term_id="cri" >}} seperti {{< glossary_tooltip term_id="docker" >}}.

Pada versi awal Kubernetes, Node disebut "Minion".
