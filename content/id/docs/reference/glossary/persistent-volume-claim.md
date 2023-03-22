---
title: Persistent Volume Claim
id: persistent-volume-claim
date: 2018-04-12
full_link: /id/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  Mengklaim sumber daya penyimpanan yang didefinisikan di dalam suatu PersistentVolume, sehingga PersistentVolume tersebut dapat dipasang (_mounted_) sebagai sebuah _volume_ pada suatu Container.

aka:
tags:
- core-object
- storage
---
Mengklaim sumber daya penyimpanan yang didefinisikan di dalam suatu {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}, sehingga PersistentVolume tersebut dapat dipasang (_mounted_) sebagai sebuah _volume_ pada suatu {{< glossary_tooltip text="Container" term_id="container" >}}.

<!--more-->

Menentukan jumlah penyimpanan, bagaimana penyimpanan akan diakses (hanya baca (_read-only_), baca tulis (_read-write_), dan/atau eksklusif) dan bagaimana penyimpanan tersebut dapat diklaim kembali (dipertahankan, didaur ulang (_recycled_) atau dihapus). Detail dari penyimpanan itu sendiri dideskripsikan pada objek PersistentVolume.
