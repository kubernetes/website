---
title: Mixed Version Proxy (MVP)
id: mvp
short_description: >
  Функціонал, який дозволяє kube-apiserver перенаправити запит на ресурс до іншого API-сервера.
aka:
- MVP
tags:
- architecture
---

Функціонал, який дозволяє kube-apiserver перенаправити запит на ресурс до іншого API-сервера.

<!--more-->

Коли в кластері працюють різні версії Kubernetes на різних API-серверах, ця функція дозволяє правильно обслуговувати запити до {{< glossary_tooltip text="ресурсів" term_id="api-resource" >}} за допомогою відповідного API-сервера.

MVP стандартно вимкнено і може бути активовано, увімкненням [функціонала](/docs/reference/command-line-tools-reference/feature-gates/) `UnknownVersionInteroperabilityProxy` при запуску {{< glossary_tooltip text="API-сервера" term_id="kube-apiserver" >}}.
