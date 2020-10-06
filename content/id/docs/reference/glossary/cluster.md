---
title: Klaster
id: cluster
date: 2019-06-15
full_link: 
short_description: >
  Sekumpulan mesin pekerja, yang dikenal sebagai Node, yang menjalankan aplikasi dalam Container. Setiap klaster setidaknya mempunyai satu Node pekerja.
aka:
tags:
- fundamental
- operation
---
Sekumpulan mesin pekerja, yang dikenal sebagai {{< glossary_tooltip term_id="node" >}}, yang menjalankan aplikasi dalam Container. Setiap klaster setidaknya mempunyai satu Node pekerja.

<!--more-->

Node pekerja menjalankan {{< glossary_tooltip term_id="pod" >}} yang merupakan komponen dari beban kerja aplikasi. {{< glossary_tooltip term_id="control-plane" >}} mengelola Node pekerja dan Pod di dalam klaster. Pada lingkungan produksi, _control plane_ biasanya berjalan di beberapa komputer dan suatu klaster pada umumnya menjalankan beberapa Node, hal ini akan memberikan toleransi kesalahan (_fault-tolerance_) dan ketersediaan tinggi (_high availability_).
