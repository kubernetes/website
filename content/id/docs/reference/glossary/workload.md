---
title: Beban Kerja
id: workloads
date: 2019-02-13
full_link: /id/docs/concepts/workloads/
short_description: >
  Sebuah beban kerja merupakan suatu aplikasi yang berjalan pada Kubernetes.

aka:
- Workload
tags:
- fundamental
---
Sebuah beban kerja merupakan suatu aplikasi yang berjalan pada Kubernetes.

<!--more-->

Beragam objek inti yang merepresentasikan tipe atau bagian berbeda dari suatu beban kerja termasuk objek DaemonSet, Deployment, Job, ReplicaSet, dan StatefulSet.

Sebagai contoh, suatu beban kerja dengan sebuah server web dan pangkalan data mungkin menjalankan pangkalan data dalam satu {{< glossary_tooltip term_id="StatefulSet" >}} dan server web dalam satu {{< glossary_tooltip term_id="Deployment" >}}.
