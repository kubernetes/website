---
title: kube-scheduler
id: kube-scheduler
date: 2019-04-21
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Komponen _control plane_ yang bertugas mengamati Pod yang baru dibuat dan belum ditempatkan ke suatu Node dan kemudian akan memilih sebuah Node di mana Pod baru tersebut akan dijalankan.

aka:
tags:
- architecture
---
Komponen _control plane_ yang bertugas mengamati {{< glossary_tooltip term_id="pod" >}} yang baru dibuat dan belum ditempatkan ke suatu {{< glossary_tooltip term_id="node" >}} dan kemudian akan memilih sebuah Node di mana Pod baru tersebut akan dijalankan.

<!--more-->

Faktor-faktor yang dipertimbangkan untuk keputusan penjadwalan termasuk: kebutuhan sumber daya secara individual dan kolektif, batasan perangkat keras/perangkat lunak/peraturan, spesifikasi afinitas dan nonafinitas, lokalisasi data, interferensi antar beban kerja dan tenggat waktu.
