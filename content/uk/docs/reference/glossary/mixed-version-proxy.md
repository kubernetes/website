---
title: Mixed Version Proxy (MVP)
id: mvp
date: 2023-07-24
short_description: >
  Функціонал, який дозволяє kube-apiserver перенаправити запит на ресурс до іншого API-сервера. 
aka: 
- MVP
tags:
- architecture
---
Функціонал, який дозволяє kube-apiserver перенаправити запит на ресурс до іншого API-сервера.

<!--more-->

Коли у кластері працюють різні версії Kubernetes на різних API-серверах, ця функція дозволяє правильно обслуговувати запити до ресурсів за допомогою відповідного API-сервера.

MVP стандартно вимкнено і може бути активовано, увімкненням [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) з іменем `UnknownVersionInteroperabilityProxy` при запуску {{< glossary_tooltip text="API-сервера" term_id="kube-apiserver" >}}.
