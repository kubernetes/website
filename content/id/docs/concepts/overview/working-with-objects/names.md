---
title: Nama
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Seluruh objek di dalam REST API Kubernetes secara jelas ditandai dengan nama dan UID.

Apabila pengguna ingin memberikan atribut tidak unik, Kubernetes menyediakan [label](/docs/user-guide/labels) dan [anotasi](/docs/concepts/overview/working-with-objects/annotations/).

Bacalah [dokumentasi desain penanda](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) agar kamu dapat memahami lebih lanjut sintaks yang digunakan untuk Nama dan UID.

{{% /capture %}}


{{% capture body %}}

## Nama

{{< glossary_definition term_id="name" length="all" >}}

Berdasarkan ketentuan, nama dari _resources_ Kubernetes memiliki panjang maksimum 253 karakter yang terdiri dari karakter alfanumerik huruf kecil, `-`, dan `.`, tetapi *resources* tertentu punya lebih banyak batasan yang spesifik

## UID

{{< glossary_definition term_id="uid" length="all" >}}

{{% /capture %}}
