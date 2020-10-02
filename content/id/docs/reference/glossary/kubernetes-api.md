---
title: API Kubernetes
id: kubernetes-api
date: 2018-04-12
full_link: /id/docs/concepts/overview/kubernetes-api/
short_description: >
  Aplikasi yang melayani fungsi Kubernetes melalui antarmuka RESTful dan menyimpan keadaan dari klaster.

aka:
tags:
- fundamental
- architecture
---
Aplikasi yang melayani fungsi Kubernetes melalui antarmuka RESTful dan menyimpan keadaan dari klaster.

<!--more--> 

Sumber daya Kubernetes dan "catatan keperluan (_record of intents_)" disimpan semua sebagai objek-objek API, dan diubah melalui panggilan RESTful ke API. API memungkinkan konfigurasi untuk dikelola secara deklaratif. Pengguna dapat berinteraksi dengan API Kubernetes secara langsung, atau via utilitas seperti `kubectl`. API Kubernetes inti fleksibel dan juga dapat diperluas untuk mendukung sumber daya khusus.
