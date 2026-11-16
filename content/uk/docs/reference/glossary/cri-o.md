---
title: CRI-O
id: cri-o
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  Легке середовище виконання контейнерів, створене спеціально для Kubernetes.

aka:
tags:
- tool
---

Інструмент, який дозволяє використовувати середовища виконання контейнерів OCI з Kubernetes CRI.

<!--more-->

CRI-O — це реалізація {{< glossary_tooltip term_id="cri" >}}, яка дозволяє використовувати середовища виконання {{< glossary_tooltip text="контейнерів" term_id="container" >}}, сумісні зі [специфікацією середовища виконання](https://www.github.com/opencontainers/runtime-spec) Open Container Initiative (OCI).

Розгортання CRI-O дозволяє Kubernetes використовувати будь-яке OCI-сумісне середовище виконання як середовище виконання контейнерів для запуску {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, а також завантажувати образи контейнерів OCI з віддалених реєстрів.
