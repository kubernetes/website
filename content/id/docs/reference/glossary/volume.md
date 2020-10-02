---
title: Volume
id: volume
date: 2019-04-24
full_link: /id/docs/concepts/storage/volumes/
short_description: >
  Sebuah direktori yang mengandung data, dapat diakses oleh Container di dalam Pod.

aka: 
tags:
- core-object
- fundamental
---
Sebuah direktori yang mengandung data, dapat diakses oleh Container di dalam {{< glossary_tooltip term_id="pod" >}}.

<!--more--> 

Sebuah _volume_ Kubernetes akan dianggap hidup selama {{< glossary_tooltip term_id="pod" >}} di mana _volume_ tersebut berada dalam kondisi hidup. Dengan demikian, sebuah _volume_ hidup lebih lama dari {{< glossary_tooltip term_id="container" >}} yang dijalankan pada {{< glossary_tooltip term_id="pod" >}}, serta data di dalam _volume_ tersebut tetap dipertahankan saat Container dimulai ulang (_restart_).

Lihat [penyimpanan](/id/docs/concepts/storage/) untuk informasi lebih lanjut.