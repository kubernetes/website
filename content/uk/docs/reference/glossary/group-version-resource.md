---
title: Group Version Resource
id: gvr
short_description: >
  Група API, версія API та назва API Kubernetes.

aka:
- GVR
tags:
- architecture
---

Спосіб однозначно представляти конкретні API Kubernetes.

<!--more-->

Group Version Resource (GVR) вказує групу API, версію API та _ресурс_ (назву виду обʼєкта в тому вигляді, як вона зʼявляється в URI), повʼязані з доступом до певного ідентифікатора обʼєкта в Kubernetes. GVR дозволяють визначати та розрізняти різні обʼєкти Kubernetes і задавати спосіб доступу до обʼєктів, який залишається стабільним навіть тоді, коли API змінюються.

Тут _ресурс_ означає ресурс HTTP. Оскільки деякі API обмежені простором імен, GVR може не вказувати на конкретний {{< glossary_tooltip text="ресурс API" term_id="api-resource" >}}.
