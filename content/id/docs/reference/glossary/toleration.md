---
title: Toleration
id: toleration
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/taint-and-toleration/
short_description: >
  Objek Kubernetes inti yang membutuhkan tiga properti: _key_, _value_, dan _effect_. Toleration memungkinan penjadwalan Pod pada Node atau grup Node dengan Taint yang sesuai.

aka:
tags:
- core-object
- fundamental
---
Objek Kubernetes inti yang membutuhkan tiga properti: _key_, _value_, dan _effect_. Toleration memungkinan penjadwalan Pod pada Node atau grup Node dengan {{< glossary_tooltip term_id="taint" >}} yang sesuai.

<!--more-->

Toleration dan {{< glossary_tooltip term_id="taint" >}} bekerja sama untuk memastikan Pod tidak dijadwalkan pada Node yang tidak sesuai. Satu atau beberapa Toleration dapat diterapkan pada sebuah {{< glossary_tooltip term_id="pod" >}}. Sebuah Toleration menandakan {{< glossary_tooltip term_id="pod" >}} diijinkan (tetapi tidak harus) untuk dijadwalkan pada Node atau grup Node dengan {{< glossary_tooltip term_id="taint" >}} yang sesuai.
