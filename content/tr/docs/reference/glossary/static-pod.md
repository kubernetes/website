---
title: Statik Pod (Static Pod)
id: static-pod
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  Belirli bir düğümdeki kubelet arka plan programı tarafından doğrudan yönetilen bir pod.

aka: 
tags:
- fundamental
---

Belirli bir düğümdeki {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
 arka plan programı tarafından doğrudan yönetilen bir {{< glossary_tooltip text="pod" term_id="pod" >}},
<!--more-->

API sunucusu tarafından gözlemlenmeden çalışır.

Statik Pod'lar {{< glossary_tooltip text="geçici konteynerleri (ephemeral containers)" term_id="ephemeral-container" >}} desteklemez.
