---
title: StatefulSet
id: statefulset
date: 2019-10-05
full_link: /id/docs/concepts/workloads/controllers/statefulset/
short_description: >
  Mengelola penggelaran dan penyekalaan dari sekumpulan Pod, dengan penyimpanan dan identitas tetap untuk masing-masing Pod.

aka:
tags:
- fundamental
- core-object
- workload
- storage
---
Mengelola penggelaran dan penyekalaan dari sekumpulan {{< glossary_tooltip term_id="pod" >}}, *serta menjamin urutan dan keunikan* dari masing-masing Pod dalam kumpulan tersebut.

<!--more-->

Seperti halnya {{< glossary_tooltip term_id="deployment" >}}, StatefulSet akan mengelola Pod dengan spesifikasi Container yang identik. Tidak seperti Deployment, StatefulSet menjamin pengenal yang tetap (_sticky_) untuk setiap Pod. Semua Pod tersebut dibuat berdasarkan spesifikasi yang sama, akan tetapi tidak dapat digantikan satu sama lain: masing-masing Pod memiliki pengenal tetap yang akan dipertahankan setiap penjadwalan ulang terjadi.

Jika kamu ingin menggunakan _volume_ penyimpanan yang persisten untuk beban kerja yang ada, kamu dapat menggunakan StatefulSet sebagai bagian dari solusi. Meskipun masing-masing Pod dalam StatefulSet rentan terhadap kegagalan, pengenal Pod yang persisten memudahkan untuk mencocokkan _volume_ yang ada dengan Pod baru yang menggantikan Pod yang gagal.
