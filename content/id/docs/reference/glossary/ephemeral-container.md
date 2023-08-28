---
title: Container Sementara
id: ephemeral-container
date: 2019-08-26
full_link: /id/docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Jenis tipe Container yang dapat kamu jalankan sementara di dalam sebuah Pod.
aka:
- Ephemeral Container
tags:
- fundamental
---
Jenis tipe {{< glossary_tooltip term_id="container" >}} yang dapat kamu jalankan sementara di dalam sebuah {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Jika kamu ingin menyelidiki sebuah Pod yang bermasalah, kamu dapat menambahkan Container sementara ke Pod tersebut dan menjalankan diagnosis. Container sementara tidak memiliki jaminan sumber daya atau penjadwalan, dan kamu tidak boleh menggunakannya untuk menjalankan bagian mana pun dari beban kerja.
