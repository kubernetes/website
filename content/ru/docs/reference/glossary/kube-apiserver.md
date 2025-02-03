---
title: API-сервер
id: kube-apiserver
date: 2018-04-12
full_link: /docs/reference/generated/kube-apiserver/
short_description: >
  Компонент управляющего слоя, предоставляющий Kubernetes API.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
 API-сервер — компонент {{< glossary_tooltip text="управляющего слоя" term_id="control-plane" >}} Kubernetes,
который делаает доступным Kubernetes API. API-сервер — это фронтенд управляющего слоя Kubernetes.

<!--more-->

Основной реализацией API-сервера Kubernetes является [kube-apiserver](/docs/reference/generated/kube-apiserver/).
kube-apiserver предназначен для горизонтального масштабирования, то есть он масштабируется при развёртывании
на множестве экземплярах. Вы можете запускать множество экземпляров kube-apiserver и балансировать трафик между ними.
