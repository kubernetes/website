---
title: LimitRange
id: limitrange
date: 2019-04-15
full_link: /id/docs/concepts/policy/limit-range/
short_description: >
  Menyediakan batasan-batasan untuk membatasi konsumsi sumber daya per Container atau Pod dalam suatu Namespace.

aka:
tags:
- core-object
- fundamental
- architecture
related:
 - pod
 - container

---
Menyediakan batasan-batasan untuk membatasi konsumsi sumber daya per {{< glossary_tooltip term_id="container" >}} atau {{< glossary_tooltip term_id="pod" >}} dalam suatu Namespace.

<!--more-->

LimitRange membatasi kuantitas objek yang dapat dibuat berdasarkan tipe, serta jumlah sumber daya komputasi yang dapat diminta/dikonsumsi oleh masing-masing {{< glossary_tooltip term_id="container" >}} atau {{< glossary_tooltip term_id="pod" >}} dalam sebuah Namespace.
