---
title: Job
id: job
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/job/
short_description: >
  Tugas terbatas atau bertumpuk (_batch_) yang berjalan sampai selesai.
aka:
tags:
- fundamental
- core-object
- workload
---
Tugas terbatas atau bertumpuk (_batch_) yang berjalan sampai selesai.

<!--more--> 

Membuat satu atau beberapa objek {{< glossary_tooltip term_id="pod" >}} dan memastikan bahwa sejumlah objek tersebut berhasil dihentikan. Saat Pod berhasil diselesaikan (_complete_), maka Job melacak keberhasilan penyelesaian tersebut.
