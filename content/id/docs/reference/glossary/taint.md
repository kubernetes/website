---
title: Taint
id: taint
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Objek Kubernetes inti yang membutuhkan tiga properti: _key_, _value_, dan _effect_. Taint mencegah penjadwalan Pod pada Node atau grup Node tertentu.

aka:
tags:
- core-object
- fundamental
---
Objek Kubernetes inti yang membutuhkan tiga properti: _key_, _value_, dan _effect_. Taint mencegah penjadwalan {{< glossary_tooltip term_id="pod" >}} pada {{< glossary_tooltip term_id="node" >}} atau grup Node tertentu.

<!--more-->

Taint dan {{< glossary_tooltip term_id="toleration" >}} bekerja sama untuk memastikan Pod tidak dijadwalkan pada Node yang tidak sesuai. Satu atau beberapa Taint bisa diterapkan pada sebuah Node. Suatu Node seharusnya hanya menjadwalkan Pod dengan Toleration yang cocok sesuai konfigurasi Taint.
