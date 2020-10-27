---
title: Deployment
id: deployment
date: 2018-04-12
full_link: /id/docs/concepts/workloads/controllers/deployment/
short_description: >
  Mengelola aplikasi yang direplikasi di dalam klastermu.
aka: 
tags:
- fundamental
- core-object
- workload
---
Sebuah objek API yang mengelola aplikasi yang direplikasi, biasanya dengan menjalankan Pod tanpa keadaan (_state_) lokal.

<!--more--> 

Setiap replika direpresentasikan oleh sebuah {{< glossary_tooltip term_id="pod" >}}, dan Pod tersebut didistribusikan di antara {{< glossary_tooltip term_id="node" >}} dari suatu klaster. Untuk beban kerja yang membutuhkan keadaan lokal, pertimbangkan untuk menggunakan {{< glossary_tooltip term_id="StatefulSet" >}}.
