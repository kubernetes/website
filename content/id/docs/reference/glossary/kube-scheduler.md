---
title: kube-scheduler
id: kube-scheduler
date: 2019-04-21
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Komponen _control plane_ yang bertugas mengamati Pod baru yang belum ditempatkan di node manapun dan kemudian memilihkan node di mana Pod baru tersebut akan dijalankan.

aka:
tags:
- architecture
---
Komponen _control plane_ yang bertugas mengamati {{< glossary_tooltip term_id="pod" >}} baru yang belum ditempatkan di node manapun dan kemudian memilihkan {{< glossary_tooltip term_id="node" >}} di mana Pod baru tersebut akan dijalankan.

<!--more-->

Faktor-faktor yang dipertimbangkan untuk keputusan penjadwalan termasuk: kebutuhan sumber daya secara individual dan kolektif, batasan perangkat keras/perangkat lunak/peraturan, spesifikasi afinitas dan nonafinitas, lokalisasi data, interferensi antar beban kerja dan tenggat waktu.
