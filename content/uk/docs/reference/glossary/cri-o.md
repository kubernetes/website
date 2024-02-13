---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  CRI-O — це легке середовище виконання контейнера, спеціально розроблений для Kubernetes.

aka:
tags:
- tool
---

Інструмент, який дозволяє використовувати середовище виконання контейнера OCI з Kubernetes CRI.

<!--more-->

CRI-O — це реалізація {{< glossary_tooltip term_id="cri" >}}, яка дозволяє використовувати середовище виконання контейнера, сумісне зі специфікацією Open Container Initiative (OCI) [runtime spec](https://www.github.com/opencontainers/runtime-spec).

Використання CRI-O дозволяє Kubernetes використовувати будь-яке середовище виконання контейнерів, сумісе з OCI, як середовище виконання контейнерів для запуску {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, а також завантажувати OCI образи контейнерів з віддалених реєстрів.
