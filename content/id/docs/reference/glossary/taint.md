---
title: Taint
id: taint
date: 2019-01-11
full_link: /id/docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Objek inti yang terdiri dari tiga properti yang diperlukan: _key_(kunci), _value_(nilai), dan _effect_(efek). Taint mencegah penjadwalan Pod pada Node atau grup Node.

aka:
tags:
- core-object
- fundamental
---
  Objek inti yang terdiri dari tiga properti yang diperlukan: _key_(kunci), _value_(nilai), dan _effect_(efek). Taint mencegah penjadwalan {{< glossary_tooltip text="Pod" term_id="pod" >}} pada {{< glossary_tooltip text="Node" term_id="node" >}} atau grup dari Node.

<!--more-->

Taint dan {{< glossary_tooltip text="toleransi" term_id="toleration" >}} bekerja sama untuk memastikan bahwa Pod tidak dijadwalkan ke Node yang tidak sesuai. Satu atau lebih taint dapat diterapkan pada Node. Sebuah Node seharusnya hanya menjadwalkan Pod dengan toleransi yang cocok untuk taint yang dikonfigurasi.
