---
title: Mixed Version Proxy (MVP)
id: mvp
full_link: /docs/concepts/architecture/mixed-version-proxy/
short_description: >
  Функціонал, який дозволяє kube-apiserver перенаправити запит на ресурс до іншого рівноправного (peer) API-сервера.
aka:
- MVP
tags:
- architecture
---

Функціонал, який дозволяє kube-apiserver перенаправити запит на ресурс до іншого рівноправного (peer) API-сервера.

<!--more-->

Коли в кластері працює кілька API-серверів з різними версіями Kubernetes, ця функція дозволяє обслуговувати запити до {{< glossary_tooltip text="ресурсів" term_id="api-resource" >}} відповідним API-сервером.

За умовчанням MVP вимкнено. Щоб його активувати, увімкніть [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `UnknownVersionInteroperabilityProxy` під час запуску {{< glossary_tooltip text="API-сервера" term_id="kube-apiserver" >}}.
