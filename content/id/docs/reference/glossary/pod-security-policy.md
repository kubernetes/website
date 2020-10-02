---
title: Pod Security Policy
id: pod-security-policy
date: 2018-04-12
full_link: /docs/concepts/policy/pod-security-policy/
short_description: >
  Memungkinan otorisasi mendetail untuk pembuatan dan pembaruan Pod.

aka:
tags:
- core-object
- fundamental
---
Memungkinan otorisasi mendetail untuk pembuatan dan pembaruan {{< glossary_tooltip term_id="pod" >}}.

<!--more--> 

Sumber daya pada tingkat klaster yang mengontrol aspek sensitif keamanan dari spesifikasi Pod. Objek `PodSecurityPolicy` mendefinisikan sekumpulan kondisi yang harus dijalankan Pod untuk dapat diterima oleh sistem, dan juga sebagai nilai bawaan untuk _field_ terkait. Kontrol Pod Security Policy diimplementasikan sebagai pengontrol penerimaan (_admission_) opsional.
