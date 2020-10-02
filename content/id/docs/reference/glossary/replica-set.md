---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /id/docs/concepts/workloads/controllers/replicaset/
short_description: >
  ReplicaSet memastikan bahwa sejumlah replika Pod berjalan pada satu waktu.

aka:
tags:
- fundamental
- core-object
- workload
---
Sebuah ReplicaSet (bertujuan untuk) memelihara sekumpulan replika Pod yang berjalan pada satu waktu tertentu.

<!--more-->

Objek beban kerja seperti {{< glossary_tooltip term_id="deployment" >}} menggunakan ReplicaSet untuk memastikan bahwa jumlah {{< glossary_tooltip term_id="pod" >}} yang dikonfigurasikan berjalan di dalam klaster berdasarkan spesifikasi dari ReplicaSet.
