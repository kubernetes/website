---
title: Variabel Lingkungan Container
id: container-env-variables
date: 2019-06-24
full_link: /docs/concepts/containers/container-environment-variables/
short_description: >
  Variabel lingkungan Container merupakan pasangan nama=nilai yang dapat digunakan untuk menyediakan informasi penting bagi Container yang dijalankan pada Pod.

aka:
- Container Environment Variables
tags:
- fundamental
---
Variabel lingkungan Container merupakan pasangan nama=nilai yang dapat digunakan untuk menyediakan informasi penting bagi Container yang dijalankan pada Pod.

<!--more-->

Variabel lingkungan Container menyediakan informasi yang dibutuhkan oleh aplikasi yang berjalan di dalam Container bersama dengan informasi mengenai sumber daya penting yang dibutuhkan oleh {{< glossary_tooltip term_id="container" >}}. Sebagai contoh, detail sistem berkas (_file system_), informasi mengenai Container itu sendiri, dan sumber daya klaster lainnya seperti _endpoint_ Service.
