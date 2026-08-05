---
title: Toleransi (Toleration)
id: toleration
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Objek inti yang terdiri dari tiga properti yang diperlukan: _key_(kunci), _value_(nilai), dan _effect_(efek). Toleransi memungkinkan penjadwalan Pod pada Node atau grup dari Node yang memiliki taint yang cocok.
aka:
tags:
- core-object
- fundamental
---
  Objek inti yang terdiri dari tiga properti yang diperlukan: _key_(kunci), _value_(nilai), dan _effect_(efek). Toleransi memungkinkan penjadwalan Pod pada Node atau grup dari Node yang memiliki {{< glossary_tooltip text="taints" term_id="taint" >}} yang cocok.

<!--more-->

Toleransi dan {{< glossary_tooltip text="taints" term_id="taint" >}} bekerja sama untuk memastikan bahwa Pod tidak dijadwalkan ke Node yang tidak sesuai. Satu atau lebih taint dapat diterapkan pada Node. Sebuah Node seharusnya hanya menjadwalkan Pod dengan toleransi yang cocok untuk taint yang dikonfigurasi.
