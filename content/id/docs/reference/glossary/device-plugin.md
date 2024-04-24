---
title: Pugasan Peranti
id: device-plugin
date: 2019-02-02
full_link: /id/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/
short_description: >
  Ekstensi perangkat lunak untuk memungkinkan Pod mengakses peranti yang membutuhkan inisialisasi atau penyiapan khusus.
aka:
- Device Plugin
tags:
- fundamental
- extension
---
Pugasan peranti berjalan pada {{< glossary_tooltip term_id="node" >}} pekerja dan menyediakan akses ke sumber daya untuk {{< glossary_tooltip term_id="pod" >}}, seperti perangkat keras lokal, yang membutuhkan langkah inisialisasi atau penyiapan khusus.

<!--more-->

Pugasan peranti menawarkan sumber daya ke {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}, sehingga beban kerja Pod dapat mengakses fitur perangkat keras yang berhubungan dengan Node di mana Pod tersebut berjalan. Kamu dapat menggelar sebuah pugasan peranti sebagai sebuah {{< glossary_tooltip term_id="daemonset" >}}, atau menginstal perangkat lunak pugasan peranti secara langsung pada setiap Node target.

Lihat [Pugasan Peranti](/id/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) untuk informasi lebih lanjut.
