---
title: StatefulSet
id: statefulset
date: 2019-10-05
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  Melakukan proses manajemen deployment dan _scaling_ dari sebuah set Pod, *serta menjamin mekanisme _ordering_ dan keunikan* dari Pod ini.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---
 Melakukan proses manajemen deployment dan _scaling_ dari sebuah set {{< glossary_tooltip text="Pods" term_id="pod" >}}, *serta menjamin mekanisme _ordering_ dan keunikan* dari Pod ini.

<!--more--> 

Seperti halnya {{< glossary_tooltip term_id="deployment" >}}, sebuah StatefulSet akan melakukan proses manajemen Pod yang didasarkan pada spec container identik. Meskipun begitu tidak seperti sebuah Deployment, sebuah StatefulSet akan menjamin identitas setiap Pod yang ada. Pod ini akan dibuat berdasarkan spec yang sama, tetapi tidak dapat digantikan satu sama lainnya&#58; setiap Pod memiliki identifier persisten yang akan di-maintain meskipun pod tersebut di (re)schedule.

Sebuah StatefulSet beroperasi dengan pola yang sama dengan Kontroler lainnya. Kamu dapat mendefinisikan state yang diinginkan pada objek StatefulSet, dan kontroler StatefulSet akan membuat update yang dibutuhkan dari _state_ saat ini.

