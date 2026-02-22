---
title: Volume
id: volume
date: 2019-04-24
full_link: /docs/concepts/storage/volumes/
short_description: >
  Sebuah direktori yang mengandung data, dapat diakses o;eh kontainer-kontainer di dalam pod.

aka: 
tags:
- core-object
- fundamental
---
Sebuah direktori yang mengandung data, dapat diakses oleh kontainer-kontainer di dalam {{< glossary_tooltip text="pod" term_id="pod" >}}.

<!--more--> 
Sebuah volume pada Kubernetes akan dianggap hidup selama {{< glossary_tooltip text="pod" term_id="pod" >}} dimana volume tersebut berada dalam kondisi hidup. Dengan demikian, sebuah volume yang hidup lebih lama dari {{< glossary_tooltip text="containers" term_id="container" >}} yang dijalankan pada {{< glossary_tooltip text="pod" term_id="pod" >}}, serta data volume tersebut disimpan pada {{< glossary_tooltip text="container" term_id="container" >}} akan di-restart. 