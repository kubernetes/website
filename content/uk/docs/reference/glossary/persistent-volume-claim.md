---
title: Persistent Volume Claim
id: persistent-volume-claim
date: 2018-04-12
full_link: /uk/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims
short_description: >
  Запит на використання ресурсів зберігання, визначених у PersistentVolume, для їх монтування як томів в контейнері.

aka: 
tags:
- core-object
- storage
---

Запит на використання ресурсів зберігання, визначених у {{< glossary_tooltip text="PersistentVolume" term_id="persistent-volume" >}}, для їх монтування як томів в {{< glossary_tooltip text="контейнері" term_id="container" >}}.

<!--more-->

Визначає обсяг сховища, спосіб доступу до сховища (тільки для читання, для читання та запису та/або виключний доступ) та спосіб його вилучення (збережений, перероблений або видалений). Деталі щодо самого сховища описані в обʼєкті PersistentVolume.
