---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  Легковесная исполняемая среда для контейнеров, разработанная специально для Kubernetes

aka:
tags:
- tool
---
Инструмент, позволяющий использовать исполняемые среды для контейнеров стандарта OCI с помощью технологии Kubernetes CRI.

<!--more-->

CRI-O — это реализация {{< glossary_tooltip term_id="cri" >}}, позволяющая использовать исполняемые среды для {{< glossary_tooltip text="контейнеров" term_id="container" >}}, совместимые со [спецификацией runtime](http://www.github.com/opencontainers/runtime-spec) Open Container Initiative (OCI).

Развертывание CRI-O позволяет Kubernetes использовать любую OCI-совместимую исполняемую среду в качестве среды выполнения для {{< glossary_tooltip text="подов" term_id="pod" >}} и загружать контейнерные образы OCI из удаленных реестров.
