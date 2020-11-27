---
title: ConfigMap
id: configmap
date: 2018-04-12
full_link: /docs/concepts/configuration/configmap/
short_description: >
  Sebuah objek API yang digunakan untuk menyimpan data nonkonfidensial sebagai pasangan kunci-nilai (_key-value_). Pod dapat menggunakan ConfigMap sebagai variabel lingkungan, argumen baris perintah (_command-line_), atau berkas konfigurasi dalam sebuah _volume_.

aka:
tags:
- core-object
---
Sebuah objek API yang digunakan untuk menyimpan data nonkonfidensial sebagai pasangan kunci-nilai (_key-value_). {{< glossary_tooltip term_id="pod" >}} dapat menggunakan ConfigMap sebagai variabel lingkungan, argumen baris perintah (_command-line_), atau berkas konfigurasi dalam sebuah {{< glossary_tooltip text="volume" term_id="volume" >}}.

<!--more-->

Sebuah ConfigMap memungkinkanmu untuk memisahkan konfigurasi lingkungan tertentu dari {{< glossary_tooltip text="image Container" term_id="image" >}}, sehingga aplikasimu menjadi lebih portabel.
