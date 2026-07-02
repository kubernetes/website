---
title: Панель управління
id: control-plane
full_link:
short_description: >
  Шар оркестрування контейнерів, який надає API та інтерфейси для виявлення, розгортання та управління життєвим циклом контейнерів.

aka:
- Control Plane
- master
tags:
- fundamental
---

Шар оркестрування контейнерів, який надає API та інтерфейси для виявлення, розгортання та управління життєвим циклом контейнерів.

<!--more-->

Цей шар складається з багатьох різних компонентів, таких як (але не обмежуючись):

* {{< glossary_tooltip text="etcd" term_id="etcd" >}}
* {{< glossary_tooltip text="Сервер API" term_id="kube-apiserver" >}}
* {{< glossary_tooltip text="Планувальник" term_id="kube-scheduler" >}}
* {{< glossary_tooltip text="Менеджер контролерів" term_id="kube-controller-manager" >}}
* {{< glossary_tooltip text="Менеджер хмарних контролерів" term_id="cloud-controller-manager" >}}

Ці компоненти можуть працювати як традиційні служби операційної системи (демони) або як контейнери. Хости, на яких працюють ці компоненти, історично називалися {{< glossary_tooltip text="master" term_id="master" >}}.
