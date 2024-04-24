---
title: Persistent Volume
id: persistent-volume
date: 2018-04-12
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  Sebuat objek API yang merepresentasikan bagian penyimpanan pada klaster. Tersedia sebagai sumber daya umum yang dapat dipasang (_pluggable_) yang tetap bertahan bahkan di luar siklus hidup suatu Pod.

aka:
tags:
- core-object
- storage
---
Sebuat objek API yang merepresentasikan bagian penyimpanan pada klaster. Tersedia sebagai sumber daya umum yang dapat dipasang (_pluggable_) yang tetap bertahan bahkan di luar siklus hidup suatu {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!--more-->

PersistentVolume (PV) menyediakan suatu API yang mengabstraksi detail tentang bagaimana penyimpanan disediakan dari cara penggunaannya.
PV digunakan secara langsung pada skenario di mana penyimpanan dapat dibuat terlebih dahulu (penyediaan statis).
Untuk skenario yang membutuhkan penyimpanan sesuai permintaan (penyediaan dinamis), maka yang dapat digunakan sebagai penggantinya adalah PersistentVolumeClaim (PV).
