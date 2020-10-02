---
title: ServiceAccount
id: service-account
date: 2018-04-12
full_link: /id/docs/tasks/configure-pod-container/configure-service-account/
short_description: >
  Memberikan identitas untuk proses-proses yang berjalan dalam suatu Pod.

aka:
tags:
- fundamental
- core-object
---
Memberikan identitas untuk proses-proses yang berjalan dalam suatu {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Ketika proses di dalam Pod mengakses klaster, mereka diautentikasi oleh server API sebagai ServiceAccount tertentu, sebagai contoh, `default`. Ketika kamu membuat Pod, jika kamu tidak menentukan ServiceAccount, maka untuk Pod tersebut akan ditetapkan ServiceAccount bawaan di {{< glossary_tooltip term_id="namespace" >}} yang sama.
