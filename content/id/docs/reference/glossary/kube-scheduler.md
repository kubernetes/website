---
title: kube-scheduler
id: kube-scheduler
date: 2019-04-21
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Komponen di master yang bertugas mengamati pod yang baru dibuat dan belum di-<i>assign</i> ke suatu node dan kemudian akan memilih sebuah node dimana pod baru tersebut akan dijalankan.

aka: 
tags:
- architecture
---
 Komponen di master yang bertugas mengamati pod yang baru dibuat dan belum di-<i>assign</i> ke suatu node dan kemudian akan memilih sebuah node dimana pod baru tersebut akan dijalankan.

<!--more--> 

Faktor-faktor yang diperhatikan dalam proses ini adalah kebutuhan <i>resource</i> secara individual dan kolektif, konstrain perangkat keras/perangkat lunak/peraturan, spesifikasi afinitas dan non-afinitas, lokalisasi data, interferensi <i>inter-workload</i> dan <i>deadlines</i>.

