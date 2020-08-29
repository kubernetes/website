---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  Оптимизированная среда выполнения контейнеров, разработанная специально для Kubernetes

aka:
tags:
- tool
---
Инструмент, позволяющий использовать среды выполнения контейнеров формата OCI с помощью технологии Kubernetes CRI.

<!--more-->

CRI-O — это реализация {{< glossary_tooltip term_id="cri" >}}, позволяющая использовать среды выполнения {{< glossary_tooltip text="контейнеров" term_id="container" >}}, совместимые со [спецификацией исполняемой среды контейнеров](http://www.github.com/opencontainers/runtime-spec) Open Container Initiative (OCI).

Развертывание CRI-O позволяет Kubernetes использовать любую OCI-совместимую среду выполнения в качестве контейнерной среды выполнения для выполнения {{< glossary_tooltip text="подов" term_id="pod" >}} и загружать образы OCI-контейнера из удаленных реестров.
