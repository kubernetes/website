---
title: Kontrol Akses Berbasis Rol
id: rbac
date: 2018-04-12
full_link: /id/docs/reference/access-authn-authz/rbac/
short_description: >
  Mengelola keputusan otorisasi, memungkinkan admin untuk mengonfigurasi kebijakan akses secara dinamis melalui API Kubernetes.

aka:
- Role-Based Access Control (RBAC)
tags:
- security
- fundamental
---
Mengelola keputusan otorisasi, memungkinkan admin untuk mengonfigurasi kebijakan akses secara dinamis melalui {{< glossary_tooltip text="API Kubernetes" term_id="kubernetes-api" >}}.

<!--more-->

RBAC menggunakan Role yang memuat aturan perizinan, dan RoleBinding yang memberikan izin sebagaimana telah ditentukan di dalam Role untuk sekumpulan pengguna.
