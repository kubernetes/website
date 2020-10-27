---
title: Container Inisialisasi
id: init-container
date: 2018-04-12
full_link: 
short_description: >
  Satu atau beberapa Container inisialisasi yang harus berjalan hingga selesai sebelum Container aplikasi apapun dijalankan.
aka:
- Init Container
tags:
- fundamental
---
Satu atau beberapa {{< glossary_tooltip term_id="container" >}} inisialisasi yang harus berjalan hingga selesai sebelum Container aplikasi apapun dijalankan.

<!--more--> 

Container inisialisasi mirip seperti Container aplikasi biasa, dengan satu perbedaan: Container inisialisasi harus berjalan sampai selesai sebelum Container aplikasi lainnya dijalankan. Container inisialisasi dijalankan secara seri: setiap Container inisialisasi harus berjalan sampai selesai sebelum Container inisialisasi berikutnya dijalankan.
